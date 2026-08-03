import React, { useEffect, useRef } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ChatMessages from "./ChatMessages";
import ChatMessageAdd from "./ChatMessageAdd";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      outline: `1px solid slategrey`,
    },
  },
}));

export const ScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() =>
    elementRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    })
  );
  return <div ref={elementRef} />;
};

const ChatView = ({
  conversationData,
  handleChatMessageSend,
  messageIsLoading,
  handleScroll,
  scrollBottom,
  receiverType,
  isLoadingMessageSend,
  userType,
  channelId,
  orderId,
  embedded = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    // Mobile: full-screen fixed layout
    // - Fixed header: navbar (~88px) + back+title row (~44px) + profile row (~68px) = ~200px
    // - Messages fill remaining space and scroll
    // - Input fixed at bottom, above bottom nav (~65px)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: "200px",   // below navbar + ConversationInfoTop fixed header
          left: 0,
          right: 0,
          bottom: "65px", // above bottom nav
          zIndex: 10,
          backgroundColor: theme.palette.background.custom6,
        }}
      >
        {/* Scrollable messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: theme.palette.background.custom6,
          }}
          onScroll={handleScroll}
          className={classes.root}
        >
          {conversationData && (
            <ChatMessages
              conversationData={conversationData}
              scrollBottom={scrollBottom}
              receiverType={receiverType}
            />
          )}
        </Box>

        {/* Sticky input at bottom */}
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ChatMessageAdd
            onSend={handleChatMessageSend}
            isLoadingMessageSend={isLoadingMessageSend}
            userType={userType}
            channelId={channelId}
            orderId={orderId}
          />
        </Box>
      </Box>
    );
  }

  // Desktop — profile/drawer embed uses flex fill so the composer stays visible
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        flexGrow: 1,
        minHeight: 0,
        height: embedded ? "100%" : "100%",
        ...(embedded ? {} : { minHeight: "70vh" }),
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.custom6,
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
          height: embedded ? "auto" : "60vh",
          backgroundColor: theme.palette.background.custom6,
        }}
        onScroll={handleScroll}
        className={classes.root}
      >
        {conversationData && (
          <ChatMessages
            conversationData={conversationData}
            scrollBottom={scrollBottom}
            receiverType={receiverType}
          />
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ChatMessageAdd
          onSend={handleChatMessageSend}
          isLoadingMessageSend={isLoadingMessageSend}
          userType={userType}
          channelId={channelId}
          orderId={orderId}
        />
      </Box>
    </Box>
  );
};
export default ChatView;
