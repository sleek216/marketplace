import React from "react";
import { Avatar, Box, Divider, IconButton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ChatUserTop } from "./Chat.style";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { getConversationPartnerName } from "utils/chatDisplayName";

const ConversationInfoTop = ({
  receiver,
  mdUp,
  handleToggleSidebar,
  ChatImageUrl,
  userImage,
  theme: themeProp,
  deliveryman_name,
  deliveryUrl,
  receiverType,
  adminUser,
}) => {
  const { configData } = useSelector((state) => state.configData);
  const language_direction = localStorage.getItem("direction");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const senderName = receiverType === "admin"
    ? adminUser
    : deliveryman_name
    ? deliveryman_name
    : getConversationPartnerName(receiver, configData);

  const senderRole = receiverType === "admin"
    ? t("Admin")
    : receiverType === "delivery_man"
    ? t("Delivery Man")
    : t("Vendor");

  if (isMobile) {
    return (
      // Fixed header on mobile: sits just below the app navbar
      // App navbar is ~88px tall (topbar ~32px + secondbar ~56px)
      <Box
        sx={{
          position: "fixed",
          top: "88px",
          left: 0,
          right: 0,
          zIndex: 20,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 1px 4px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Row 1: Back arrow + "Messages" title */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            px: 1,
            py: 0.75,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton onClick={handleToggleSidebar} size="small">
            {language_direction === "rtl" ? (
              <ArrowForwardIosIcon sx={{ fontSize: 16, color: theme.palette.neutral[1000] }} />
            ) : (
              <ArrowBackIosNewIcon sx={{ fontSize: 16, color: theme.palette.neutral[1000] }} />
            )}
          </IconButton>
          <Typography
            fontSize="16px"
            fontWeight={700}
            sx={{ flex: 1, textAlign: "center", pr: "32px" /* offset icon width */ }}
          >
            {t("Messages")}
          </Typography>
        </Stack>

        {/* Row 2: Avatar + name + role */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 2, py: 1 }}
        >
          <Avatar
            src={userImage}
            sx={{
              width: 44,
              height: 44,
              bgcolor: theme.palette.neutral[200],
              "& .MuiAvatar-img": { objectFit: "contain", objectPosition: "center" },
            }}
          />
          <Stack>
            <Typography fontSize="15px" fontWeight={700} color={theme.palette.neutral[1000]}>
              {senderName}
            </Typography>
            <Typography fontSize="12px" color={theme.palette.neutral[500]} textTransform="capitalize">
              {senderRole}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
      </Box>
    );
  }

  // Desktop layout — unchanged
  return (
    <Stack>
      {!mdUp && (
        <ChatUserTop direction="row">
          {!mdUp &&
            (language_direction === "rtl" ? (
              <IconButton onClick={handleToggleSidebar}>
                <ArrowForwardIosIcon sx={{ width: "16px", height: "15px", color: (t) => t.palette.neutral[1000] }} />
              </IconButton>
            ) : (
              <IconButton onClick={handleToggleSidebar}>
                <ArrowBackIosNewIcon fontSize="small" sx={{ width: "16px", height: "15px", color: (t) => t.palette.neutral[1000] }} />
              </IconButton>
            ))}
          <Stack width="100%">
            <Typography fontSize="16px" fontWeight="700" textAlign="center">
              {t("Messages")}
            </Typography>
          </Stack>
        </ChatUserTop>
      )}

      <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
        <IconButton>
          <Avatar
            fontSize="small"
            src={userImage}
            sx={{
              width: 50,
              height: 50,
              bgcolor: (themeProp || theme).palette.neutral[200],
              "& .MuiAvatar-img": { objectFit: "contain", objectPosition: "center" },
            }}
          />
        </IconButton>
        <Stack justifyContent="flex-start" alignItems="start">
          {receiverType === "admin" ? (
            <Stack>
              <Typography textAlign="left" color={(themeProp || theme).palette.neutral[1000]} fontSize="16px" fontWeight="600">
                {adminUser}
              </Typography>
              <Typography textTransform="capitalize">{receiverType}</Typography>
            </Stack>
          ) : (
            <>
              {deliveryman_name ? (
                <Typography textAlign="left" color={(themeProp || theme).palette.neutral[1000]} fontSize="16px" fontWeight="600">
                  {deliveryman_name}
                </Typography>
              ) : (
                <Typography textAlign="left" color={(themeProp || theme).palette.neutral[1000]} fontSize="16px" fontWeight="600">
                  {getConversationPartnerName(receiver, configData)}
                </Typography>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConversationInfoTop;
