import React from "react";
import { Box } from "@mui/material";
import { MessageCircle } from "lucide-react";
import { t } from "i18next";
import ProfileSectionHeader from "./ProfileSectionHeader";
import Chatting from "../chat/Chatting";

const ProfileInbox = ({ configData }) => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        height: { md: "calc(100vh - 200px)" },
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <ProfileSectionHeader
        icon={MessageCircle}
        title={t("Inbox")}
        subtitle={t("Chat with stores and support")}
      />
      <Box
        sx={{
          px: { xs: 1.25, md: 2 },
          py: { xs: 1.5, md: 2 },
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, minHeight: { xs: "70vh", md: 0 }, height: "100%" }}>
          <Chatting configData={configData} profileEmbed />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileInbox;
