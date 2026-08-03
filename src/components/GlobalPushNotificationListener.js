import { useCallback, useEffect, useState } from "react";
import "firebase/messaging";
import { fetchToken, subscribeForegroundMessages } from "../firebase";
import { HEADER_SESSION_SYNC_EVENT } from "helper-functions/headerSessionSync";
import { useStoreFcm } from "api-manage/hooks/react-query/push-notifications/usePushNotification";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { MessageCircle as MessageCircleIcon, X as CloseIcon } from "lucide-react";
import { t } from "i18next";
import { OPEN_CHAT_DRAWER_EVENT } from "components/header/second-navbar/SecondNavbar";
import { isIncomingChatNotification } from "hooks/useChatUnreadBadge";
import { getProfileUserId } from "utils/chatUnread";
import { PUSH_NOTIFICATION_EVENT } from "components/PushNotificationLayout";

const hasValidAuthToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "null" && normalized !== "undefined";
};

/** Runs once app-wide so chat badges and toasts update on every route. */
export default function GlobalPushNotificationListener() {
  const theme = useTheme();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [fcmToken, setFcmToken] = useState("");
  const { mutate } = useStoreFcm();

  const showMessageToast = useCallback(
    (notif) => {
      const senderName = notif?.sender_name || notif?.title || t("New Message");
      const messagePreview =
        notif?.body || notif?.message || t("You have a new message");
      const conversationId = notif?.conversation_id ?? notif?.conversationId;
      const senderType = notif?.sender_type || "vendor";

      const handleToastClick = (toastId) => {
        toast.dismiss(toastId);
        if (conversationId) {
          window.dispatchEvent(
            new CustomEvent(OPEN_CHAT_DRAWER_EVENT, {
              detail: { conversationId, senderType },
            })
          );
        }
      };

      toast.custom(
        (toastInstance) => (
          <Paper
            onClick={() => handleToastClick(toastInstance.id)}
            elevation={4}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px 12px 12px",
              borderRadius: "14px",
              maxWidth: "360px",
              width: "100%",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              position: "relative",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              boxShadow: `0 8px 32px -8px ${alpha(theme.palette.common.black, 0.18)}`,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              <MessageCircleIcon size={20} />
            </Avatar>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontSize="13px" fontWeight={700} noWrap>
                {senderName}
              </Typography>
              <Typography
                fontSize="12px"
                color={theme.palette.text.secondary}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {messagePreview}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(toastInstance.id);
              }}
              sx={{ position: "absolute", top: 6, right: 6, padding: "2px" }}
            >
              <CloseIcon size={13} />
            </IconButton>
          </Paper>
        ),
        { position: "bottom-right", duration: 6000 }
      );
    },
    [theme]
  );

  const dispatchPushEvent = useCallback(
    (payload) => {
      if (typeof window === "undefined" || !payload) return;

      window.dispatchEvent(
        new CustomEvent(PUSH_NOTIFICATION_EVENT, { detail: payload })
      );

      const currentUserId = getProfileUserId(profileInfo);
      const type = `${payload?.type ?? payload?.notification_type ?? ""}`
        .toLowerCase()
        .trim();

      if (
        (type === "message" || type === "chat") &&
        isIncomingChatNotification(payload, currentUserId)
      ) {
        showMessageToast(payload);
      }
    },
    [profileInfo, showMessageToast]
  );

  useEffect(() => {
    fetchToken(() => {}, setFcmToken).catch((error) => {
      console.warn("Failed to initialize push notifications:", error);
    });
  }, []);

  const syncFcmToBackend = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !fcmToken ||
      typeof fcmToken !== "string" ||
      fcmToken.trim() === ""
    ) {
      return;
    }
    const authToken = localStorage.getItem("token");
    if (hasValidAuthToken(authToken)) {
      mutate(fcmToken);
    }
  }, [fcmToken, mutate]);

  useEffect(() => {
    syncFcmToBackend();
  }, [syncFcmToBackend]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener(HEADER_SESSION_SYNC_EVENT, syncFcmToBackend);
    window.addEventListener("focus", syncFcmToBackend);
    return () => {
      window.removeEventListener(HEADER_SESSION_SYNC_EVENT, syncFcmToBackend);
      window.removeEventListener("focus", syncFcmToBackend);
    };
  }, [syncFcmToBackend]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    subscribeForegroundMessages((payload) => {
      if (cancelled || !payload) return;
      const data = payload.data || {};
      const n = payload.notification || {};
      const merged = {
        ...data,
        ...(n.title || n.body || n.image
          ? {
              title: data.title ?? n.title ?? "",
              body: data.body ?? n.body ?? "",
            }
          : {}),
      };
      if (Object.keys(merged).length > 0) {
        dispatchPushEvent(merged);
      }
    }).then((unsub) => {
      if (!cancelled && typeof unsub === "function") {
        unsubscribe = unsub;
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [dispatchPushEvent]);

  return null;
}
