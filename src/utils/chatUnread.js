export function getProfileUserId(profileInfo) {
  return profileInfo?.id ?? profileInfo?.userinfo?.id ?? null;
}

/** Customer user id on a conversation — mirrors ChatMessage sender/receiver logic. */
export function getCustomerIdFromConversation(conversation) {
  if (!conversation) return null;

  if (conversation.sender_type === "customer") {
    return conversation.sender_id ?? conversation.sender?.id ?? null;
  }

  return conversation.receiver?.id ?? conversation.receiver_id ?? null;
}

export function getLastMessageText(conversation) {
  const lastMessage = conversation?.last_message;
  if (!lastMessage) return "";
  if (typeof lastMessage === "string") return lastMessage;
  return lastMessage.message ?? lastMessage.text ?? "";
}

const recentCustomerSends = new Map();
const RECENT_SEND_TTL_MS = 60_000;

function conversationCacheKey(conversation) {
  if (!conversation) return null;
  if (conversation.receiver_type === "admin") return "admin";
  if (conversation.id != null) return String(conversation.id);
  return null;
}

/** Remember a message this customer just sent (API may still report it as unread). */
export function markConversationMessageSent(conversationKey, text) {
  const keys = new Set();

  if (conversationKey?.receiverType === "admin") {
    keys.add("admin");
  }
  if (conversationKey?.conversationId != null) {
    keys.add(String(conversationKey.conversationId));
  }

  if (keys.size === 0) return;

  const entry = {
    text: `${text ?? ""}`.trim().toLowerCase(),
    expiresAt: Date.now() + RECENT_SEND_TTL_MS,
  };

  keys.forEach((key) => {
    recentCustomerSends.set(key, entry);
  });
}

export function isRecentlySentConversation(conversationId) {
  if (conversationId == null) return false;

  const key =
    `${conversationId}` === "admin" || conversationId === "admin"
      ? "admin"
      : String(conversationId);

  const entry = recentCustomerSends.get(key);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    recentCustomerSends.delete(key);
    return false;
  }

  return true;
}

function wasRecentCustomerSend(conversation) {
  const key = conversationCacheKey(conversation);
  if (!key) return false;

  const entry = recentCustomerSends.get(key);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    recentCustomerSends.delete(key);
    return false;
  }

  const lastText = getLastMessageText(conversation).trim().toLowerCase();
  if (!lastText || !entry.text) return false;

  return lastText === entry.text;
}

/** True when the conversation's latest message was sent by this customer. */
export function isLastMessageFromCurrentUser(conversation, currentUserId) {
  const lastMessage = conversation?.last_message;
  if (!lastMessage && !getLastMessageText(conversation)) return false;

  if (wasRecentCustomerSend(conversation)) return true;

  if (typeof lastMessage === "object" && lastMessage) {
    const senderId = Number(lastMessage.sender_id ?? lastMessage.senderId);
    const profileId = Number(currentUserId);
    const conversationCustomerId = Number(
      getCustomerIdFromConversation(conversation)
    );

    const senderMatchesCustomer =
      senderId &&
      !Number.isNaN(senderId) &&
      ((profileId &&
        !Number.isNaN(profileId) &&
        senderId === profileId) ||
        (conversationCustomerId &&
          !Number.isNaN(conversationCustomerId) &&
          senderId === conversationCustomerId));

    if (senderMatchesCustomer) return true;

    const senderType = `${lastMessage.sender_type ?? lastMessage.senderType ?? ""}`
      .toLowerCase()
      .trim();
    if (["customer", "user", "client"].includes(senderType)) return true;
  }

  return false;
}

export function conversationMatchesKey(conversation, key) {
  if (!conversation || !key) return false;

  if (key.receiverType === "admin" && conversation.receiver_type === "admin") {
    return true;
  }

  if (key.conversationId == null || conversation.id == null) return false;
  return String(conversation.id) === String(key.conversationId);
}

export function isConversationActive(conversation, options = {}) {
  const { activeKey, selectedId, currentId } = options;
  if (!conversation) return false;

  if (activeKey && conversationMatchesKey(conversation, activeKey)) return true;

  if (
    selectedId != null &&
    currentId != null &&
    String(selectedId) === String(currentId)
  ) {
    return true;
  }

  return false;
}

/** Unread count that only reflects incoming messages the user has not opened. */
export function getEffectiveUnreadCount(conversation, currentUserId, options = {}) {
  const raw = Number(conversation?.unread_message_count);
  const unread = Number.isNaN(raw) ? 0 : raw;
  if (unread <= 0) return 0;
  if (isLastMessageFromCurrentUser(conversation, currentUserId)) return 0;
  if (isConversationActive(conversation, options)) return 0;
  return unread;
}

export function sumIncomingUnreadFromChannelData(
  channelData,
  currentUserId,
  options = {}
) {
  const conversations = channelData?.conversations ?? [];
  return conversations.reduce(
    (sum, conv) => sum + getEffectiveUnreadCount(conv, currentUserId, options),
    0
  );
}

/** Normalize channel list from API so self-sent threads never count as unread. */
export function sanitizeChannelListData(channelData, currentUserId) {
  if (!channelData?.conversations?.length) return channelData;

  return {
    ...channelData,
    conversations: channelData.conversations.map((conv) => {
      const effectiveUnread = getEffectiveUnreadCount(conv, currentUserId);
      if (
        effectiveUnread === conv.unread_message_count &&
        !isLastMessageFromCurrentUser(conv, currentUserId)
      ) {
        return conv;
      }

      const lastMessage =
        typeof conv.last_message === "object" && conv.last_message
          ? {
              ...conv.last_message,
              ...(isLastMessageFromCurrentUser(conv, currentUserId)
                ? {
                    sender_type:
                      conv.last_message.sender_type ??
                      conv.last_message.senderType ??
                      "customer",
                    sender_id:
                      conv.last_message.sender_id ??
                      conv.last_message.senderId ??
                      currentUserId ??
                      getCustomerIdFromConversation(conv),
                  }
                : {}),
            }
          : conv.last_message;

      return {
        ...conv,
        unread_message_count: effectiveUnread,
        last_message: lastMessage,
      };
    }),
  };
}
