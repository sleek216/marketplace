import React from "react";
import {
  Box,
  Dialog,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { MessageCircle, X } from "lucide-react";
import { t } from "i18next";
import Chatting from "components/chat/Chatting";

/**
 * Centered Messages panel — replaces the right-side drawer so the UI
 * sits in the middle of the viewport with marketplace theme styling.
 */
const MessagesPanel = ({
  open,
  onClose,
  configData,
  initialConversationId = null,
  initialSenderType = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "min(920px, 94vw)" },
          height: { xs: "100%", md: "min(720px, 86vh)" },
          maxHeight: { md: "86vh" },
          m: { xs: 0, md: 2 },
          borderRadius: { xs: 0, md: "2px" },
          overflow: "hidden",
          boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.18)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          bgcolor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.45),
        },
      }}
      sx={{
        zIndex: (z) => z.zIndex.appBar + 120,
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          flexShrink: 0,
          px: { xs: 1.5, md: 2 },
          py: 1.25,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "2px",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
            }}
          >
            <MessageCircle size={18} strokeWidth={2.2} />
          </Box>
          <Box>
            <Typography fontSize="16px" fontWeight={700} lineHeight={1.2}>
              {t("Messages")}
            </Typography>
            <Typography fontSize="12px" color="text.secondary" lineHeight={1.2}>
              {t("Chat with support and vendors")}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("Close")}
          sx={{
            borderRadius: "2px",
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          p: { xs: 0, md: 1.25 },
          bgcolor: alpha(theme.palette.neutral[200], 0.2),
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            height: "100%",
            borderRadius: { xs: 0, md: "2px" },
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            border: {
              xs: "none",
              md: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
            },
          }}
        >
          <Chatting
            configData={configData}
            drawerMode
            initialConversationId={initialConversationId}
            initialSenderType={initialSenderType}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default MessagesPanel;
