import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { useGetChannelList } from "api-manage/hooks/react-query/chat/useGetChannelLists";
import { PUSH_NOTIFICATION_EVENT } from "components/PushNotificationLayout";
import { hasValidAuthToken } from "helper-functions/getToken";
import {
  getProfileUserId,
  isRecentlySentConversation,
  sumIncomingUnreadFromChannelData,
} from "utils/chatUnread";

export const CHAT_MESSAGE_SENT_EVENT = "gift-marketplace-chat-message-sent";
export const CHAT_CONVERSATION_ACTIVE_EVENT =
  "gift-marketplace-chat-conversation-active";

export function getChatNotificationType(payload) {
  return `${payload?.type ?? payload?.notification_type ?? payload?.notificationType ?? ""}`
    .toLowerCase()
    .trim();
}

export function isChatNotificationPayload(payload) {
  const type = getChatNotificationType(payload);
  if (type === "message" || type === "chat") return true;
  const conversationId = payload?.conversation_id ?? payload?.conversationId;
  return conversationId != null && !payload?.order_id;
}

/** True only when the push payload represents a message received by this customer. */
export function isIncomingChatNotification(payload, currentUserId) {
  if (!isChatNotificationPayload(payload)) return false;

  const conversationId = payload?.conversation_id ?? payload?.conversationId;
  if (conversationId != null && isRecentlySentConversation(conversationId)) {
    return false;
  }
  if (
    `${payload?.receiver_type ?? ""}`.toLowerCase().trim() === "admin" &&
    isRecentlySentConversation("admin")
  ) {
    return false;
  }

  const senderType = `${payload?.sender_type ?? ""}`.toLowerCase().trim();
  if (["customer", "user", "client"].includes(senderType)) return false;

  const senderId = Number(payload?.sender_id ?? payload?.senderId);
  const userId = Number(currentUserId);
  if (
    senderId &&
    userId &&
    !Number.isNaN(senderId) &&
    !Number.isNaN(userId) &&
    senderId === userId
  ) {
    return false;
  }

  const isSelfSent =
    payload?.is_sender === true ||
    payload?.is_sender === "true" ||
    payload?.sent_by_me === true ||
    payload?.sent_by_me === "true";
  if (isSelfSent) return false;

  return true;
}

/**
 * Shared chat unread badge: authoritative count from channel-list API + live bumps
 * from incoming push events between polls.
 */
export default function useChatUnreadBadge(token) {
  const queryClient = useQueryClient();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const currentUserId = getProfileUserId(profileInfo);
  const isAuthenticated = hasValidAuthToken(token);

  const { data: channelData, refetch: refetchChannelList } = useGetChannelList(
    undefined,
    { enabled: isAuthenticated, currentUserId }
  );

  const [activeConversationKey, setActiveConversationKey] = useState(null);

  const apiUnreadCount = useMemo(
    () =>
      sumIncomingUnreadFromChannelData(channelData, currentUserId, {
        activeKey: activeConversationKey,
      }),
    [channelData, currentUserId, activeConversationKey]
  );

  const [effectiveApiUnread, setEffectiveApiUnread] = useState(0);
  const [liveChatUnreadCount, setLiveChatUnreadCount] = useState(0);

  const prevApiUnreadRef = useRef(null);
  const suppressApiIncreaseUntilRef = useRef(0);

  useEffect(() => {
    if (isAuthenticated) return;

    setActiveConversationKey(null);
    setEffectiveApiUnread(0);
    setLiveChatUnreadCount(0);
    prevApiUnreadRef.current = 0;
    queryClient.removeQueries(["get_channel_list"]);
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    if (prevApiUnreadRef.current === null) {
      prevApiUnreadRef.current = apiUnreadCount;
      setEffectiveApiUnread(apiUnreadCount);
      return;
    }

    const prev = prevApiUnreadRef.current;
    let nextEffective = apiUnreadCount;

    if (
      apiUnreadCount > prev &&
      Date.now() < suppressApiIncreaseUntilRef.current
    ) {
      nextEffective = prev;
    }

    if (nextEffective >= prev) {
      setLiveChatUnreadCount(0);
    } else {
      const delta = prev - nextEffective;
      setLiveChatUnreadCount((live) => Math.max(0, live - delta));
    }

    prevApiUnreadRef.current = nextEffective;
    setEffectiveApiUnread(nextEffective);
  }, [apiUnreadCount]);

  useEffect(() => {
    const onConversationActive = (event) => {
      setActiveConversationKey(event?.detail ?? null);
      setLiveChatUnreadCount(0);
    };
    window.addEventListener(
      CHAT_CONVERSATION_ACTIVE_EVENT,
      onConversationActive
    );
    return () =>
      window.removeEventListener(
        CHAT_CONVERSATION_ACTIVE_EVENT,
        onConversationActive
      );
  }, []);

  useEffect(() => {
    const onMessageSent = () => {
      suppressApiIncreaseUntilRef.current = Date.now() + 8000;
      setLiveChatUnreadCount(0);
    };
    window.addEventListener(CHAT_MESSAGE_SENT_EVENT, onMessageSent);
    return () =>
      window.removeEventListener(CHAT_MESSAGE_SENT_EVENT, onMessageSent);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInbox = () => {
      refetchChannelList();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refreshInbox();
      }
    };

    window.addEventListener("focus", refreshInbox);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("focus", refreshInbox);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, refetchChannelList]);

  useEffect(() => {
    const onPushNotification = (event) => {
      if (!isAuthenticated) return;

      const payload = event?.detail || {};
      const isChatMessage = isChatNotificationPayload(payload);

      if (
        isChatMessage &&
        isIncomingChatNotification(payload, currentUserId) &&
        Date.now() >= suppressApiIncreaseUntilRef.current
      ) {
        setLiveChatUnreadCount((prev) => prev + 1);
      }

      if (isChatMessage) {
        refetchChannelList();
        setTimeout(() => refetchChannelList(), 1200);
      }
    };

    window.addEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
    return () =>
      window.removeEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
  }, [refetchChannelList, currentUserId, isAuthenticated]);

  const chatBadgeBase =
    effectiveApiUnread + Math.max(0, liveChatUnreadCount);
  const chatBadgeCount = chatBadgeBase > 0 ? chatBadgeBase : null;

  return {
    chatBadgeCount,
    chatBadgeBase,
    resetChatBadge: () => {
      setLiveChatUnreadCount(0);
    },
    refetchChannelList,
    apiUnreadCount: effectiveApiUnread,
    liveChatUnreadCount,
  };
}
