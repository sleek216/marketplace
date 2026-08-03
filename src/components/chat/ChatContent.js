import { Stack, Typography, Box, alpha } from "@mui/material";
import { t } from "i18next";
import React from "react";
import ChatContactSearch from "./ChatContactSearch";
import ChatUserTab from "./ChatUserTab";
import ChatWithAdmin from "./ChatWithAdmin";
import ContactLists from "./ContactLists";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const ChatContent = ({
  isFetched,
  handleToggleSidebar,
  selectedId,
  handleReset,
  searchSubmitHandler,
  channelLoading,
  isLoading,
  channelList,
  handleChannelOnClick,
  searchValue,
  setSearchValue,
  handleSearch,
  userType,
  setUserType,
  setChannelId,
  setIsSidebarOpen,
  configData,
  setResetState,
  compact = false,
  profileEmbed = false,
}) => {
  const isAdmin =
    channelList && channelList?.find((item) => item.receiver_type === "admin");

  const handleChatWithAdmin = () => {
    if (channelList.length === 0 || !isAdmin) {
      return (
        <ChatWithAdmin
          configData={configData}
          handleChannelOnClick={handleChannelOnClick}
        />
      );
    } else {
      return (
        <ContactLists
          channelList={channelList}
          handleChannelOnClick={handleChannelOnClick}
          channelLoading={channelLoading}
          selectedId={selectedId}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab="admin"
          setResetState={setResetState}
        />
      );
    }
  };
  const theme = useTheme();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  
  return (
    <Stack
      spacing={compact || profileEmbed ? 1 : 1.5}
      sx={{ height: "100%", minHeight: 0 }}
      padding={
        compact || profileEmbed
          ? { xs: "0.75rem", md: "0.85rem 1rem" }
          : { xs: "0 .75rem .75rem .75rem", md: "1rem" }
      }
    >
      {!profileEmbed && !compact && mdUp && (
        <CustomStackFullWidth spacing={1} mb={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "2px",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <MessageCircle size={20} />
            </Box>
            <Typography
              fontSize={{ xs: "16px", md: "18px" }}
              fontWeight="700"
              color={theme.palette.neutral[1000]}
            >
              {t("Messages")}
            </Typography>
          </Stack>
          <Typography fontSize="13px" color={theme.palette.neutral[600]}>
            {t("Chat with support and vendors")}
          </Typography>
        </CustomStackFullWidth>
      )}
      {!profileEmbed && !compact && !mdUp && (
        <Typography
          sx={{ paddingBlockStart: ".5rem", paddingInlineStart: "4px" }}
          fontSize="18px"
          fontWeight="700"
          color={theme.palette.neutral[1000]}
        >
          {t("Messages")}
        </Typography>
      )}

      <ChatContactSearch
        compact={compact || profileEmbed}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        isLoading={isLoading}
        handleReset={handleReset}
        searchSubmitHandler={searchSubmitHandler}
      />
      {handleChatWithAdmin()}
      <ChatUserTab
        compact={compact || profileEmbed}
        setUserType={setUserType}
        userType={userType}
        setChannelId={setChannelId}
        handleReset={handleReset}
        setResetState={setResetState}
      />
      <ContactLists
        compact={compact || profileEmbed}
        fill
        channelList={channelList}
        handleChannelOnClick={handleChannelOnClick}
        channelLoading={channelLoading}
        selectedId={selectedId}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={userType}
        setResetState={setResetState}
      />
    </Stack>
  );
};
export default ChatContent;
