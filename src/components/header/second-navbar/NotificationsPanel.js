import React, { useMemo } from "react";
import { Box, Stack, Tab, Tabs, Typography, alpha } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Bell as BellIcon } from "lucide-react";
import { t } from "i18next";
import CustomSideDrawer from "components/side-drawer/CustomSideDrawer";
import DrawerHeader from "components/added-cart-view/DrawerHeader";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import moment from "moment";
import { useTheme } from "@emotion/react";

const getNotificationData = (notification) => notification?.data || {};

const NotificationsPanel = ({
  open,
  onClose,
  notifications = [],
  onNotificationClick,
  activeTab = "new",
  onTabChange,
  onMarkAllRead,
  markAllLoading = false,
}) => {
  const theme = useTheme();

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const dateA = new Date(a?.created_at || a?.updated_at || 0).getTime();
      const dateB = new Date(b?.created_at || b?.updated_at || 0).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return Number(b?.id || 0) - Number(a?.id || 0);
    });
  }, [notifications]);

  const visibleNotifications = sortedNotifications;

  return (
    <CustomSideDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      maxWidth="420px"
      width="100%"
      height="100vh"
    >
      <Stack sx={{ height: "100%" }}>
        <DrawerHeader
          CartIcon={<BellIcon size={20} />}
          title="Notifications"
          closeHandler={onClose}
        />
        <Box
          sx={{
            px: 1.5,
            pt: 0.5,
            borderBottom: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(event, value) => onTabChange?.(value)}
            variant="fullWidth"
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                fontSize: "12px",
                textTransform: "capitalize",
                fontWeight: 600,
              },
            }}
          >
            <Tab value="new" label={t("New")} />
            <Tab value="read" label={t("Read")} />
          </Tabs>
        </Box>
        {activeTab === "new" && visibleNotifications?.length > 0 && (
          <Stack px={1.5} pt={1}>
            <LoadingButton
              size="small"
              loading={markAllLoading}
              variant="text"
              onClick={onMarkAllRead}
              sx={{ alignSelf: "flex-end", textTransform: "none" }}
            >
              {t("Mark all as read")}
            </LoadingButton>
          </Stack>
        )}
        <Stack sx={{ p: 1.5, height: "100%", minHeight: 0 }}>
          <SimpleBar style={{ maxHeight: "100%", height: "100%" }}>
            {visibleNotifications?.length > 0 ? (
              <Stack spacing={1}>
                {visibleNotifications.map((notification) => {
                  const data = getNotificationData(notification);
                  return (
                    <Stack
                      key={notification?.id}
                      onClick={() => onNotificationClick?.(notification)}
                      sx={{
                        p: 1.25,
                        borderRadius: "10px",
                        border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        },
                      }}
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        {data?.title || t("Notification")}
                      </Typography>
                      <Typography
                        fontSize="12px"
                        color="text.secondary"
                        sx={{
                          mt: 0.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {data?.description || t("No description")}
                      </Typography>
                      <Typography
                        fontSize="11px"
                        color="text.disabled"
                        sx={{ mt: 0.5 }}
                      >
                        {notification?.created_at
                          ? moment(notification.created_at).fromNow()
                          : ""}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%", textAlign: "center", px: 2 }}
                spacing={1}
              >
                <BellIcon size={28} color={theme.palette.text.secondary} />
                <Typography fontSize="14px" fontWeight={600}>
                  {activeTab === "new"
                    ? t("No new notifications")
                    : t("No read notifications")}
                </Typography>
                <Typography fontSize="12px" color="text.secondary">
                  {activeTab === "new"
                    ? t("New notifications will appear here.")
                    : t("Read notifications will appear here.")}
                </Typography>
              </Stack>
            )}
          </SimpleBar>
        </Stack>
      </Stack>
    </CustomSideDrawer>
  );
};

export default NotificationsPanel;

