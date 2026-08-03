import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import CongratulationsIcon from "../assets/img/CongratulationsIcon";
import { X as CloseIcon } from "lucide-react";
import { t } from "i18next";

const CustomPaperRefer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "17px 28px 22px 28px",
  borderRadius: "12px",
  gap: "18px",
  maxWidth: "375px",

  [theme.breakpoints.down("md")]: {
    width: "350px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "301px",
  },
}));

export const PUSH_NOTIFICATION_EVENT = "gift-marketplace-push-notification";

const PushNotificationLayout = ({
  children,
  refetch,
  pathName,
  refetchTrackOrder,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const CustomToast = ({ title, description, icon }) => (
    <CustomPaperRefer>
      {icon && icon}
      <Stack gap="7px">
        <Typography
          fontSize="14px"
          fontWeight={700}
          sx={{ color: "primary.main" }}
        >
          {t(title)}
        </Typography>
        <Typography fontSize="12px" sx={{ width: "100%", maxWidth: "283px" }}>
          {t(description)}
        </Typography>
      </Stack>
      <IconButton
        sx={{ position: "absolute", top: 10, right: 15 }}
        onClick={() => toast.dismiss()}
      >
        <CloseIcon size={16} />
      </IconButton>
    </CustomPaperRefer>
  );

  const clickHandler = (notification) => {
    if (notification.type === "message") {
      router.push(
        {
          pathname: "/chatting",
          query: {
            conversationId: notification?.conversation_id,
            type: notification.sender_type,
            chatFrom: "true",
          },
        },
        undefined,
        { shallow: true }
      );
    }
    if (notification.type === "order_status") {
      router.push(
        `/profile?orderId=${notification.order_id}&page=my-orders&from=checkout`,
        undefined,
        {
          shallow: true,
        }
      );
    }
  };

  useEffect(() => {
    const onPushNotification = (event) => {
      const notification = event?.detail;
      if (!notification) return;

      const type = `${notification?.type ?? notification?.notification_type ?? ""}`
        .toLowerCase()
        .trim();

      if (pathName === "chat" && (type === "message" || type === "chat")) {
        refetch?.();
        return;
      }

      if (type === "referral_code") {
        toast.custom(
          <CustomToast
            title={notification?.title}
            description={notification?.body}
            icon={<CongratulationsIcon />}
          />,
          {
            position: "bottom-right",
            duration: 5000,
          }
        );
        return;
      }

      if (type === "message" || type === "chat") {
        return;
      }

      if (pathName === "profile") {
        refetchTrackOrder?.();
      }

      toast(
        <>
          <Stack
            sx={{ cursor: "pointer" }}
            onClick={() => clickHandler(notification)}
            color={theme.palette.primary.main}
            width="300px"
          >
            <Typography>{notification.title}</Typography>
            <Typography>{notification.body}</Typography>
          </Stack>
        </>,
        {
          position: "bottom-right",
          duration: 5000,
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          },
        }
      );
    };

    window.addEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
    return () =>
      window.removeEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
  }, [pathName, refetch, refetchTrackOrder, router, theme]);

  return <>{children}</>;
};

export default PushNotificationLayout;
