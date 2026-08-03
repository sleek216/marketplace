/* eslint-disable react-hooks/exhaustive-deps */
import {Tab, Tabs} from "@mui/material";
import {Stack} from "@mui/system";
import {t} from "i18next";
import React, {useEffect} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export const data = [
  {
    id: 1,
    userType: "Vendor",
    value: "vendor",
  },
  {
    id: 2,
    userType: "Delivery Man",
    value: "delivery_man",
  },
];

const ChatUserTab = ({
  setUserType,
  userType,
  setChannelId,
  handleReset,
  setResetState,
  compact = false,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    setUserType(data[0]?.value);
  }, []);

  const handleChange = (event, newValue) => {
    setUserType(newValue);
    setChannelId(null);
    setResetState(false);
    handleReset();
  };

  return (
    <Stack
      width="100%"
      sx={{
        paddingInlineEnd: compact ? "2px" : "6px",
        ...(isMobile && {
          borderBottom: "1px solid",
          borderColor: "divider",
        }),
      }}
    >
      <Tabs
        indicatorColor="primary"
        value={userType}
        onChange={handleChange}
        scrollButtons={false}
        aria-label="chat user type tabs"
        sx={{
          "& .MuiButtonBase-root": {
            minHeight: compact ? "34px" : isMobile ? "44px" : "40px",
            paddingInlineEnd: compact ? "8px" : "12px",
            paddingInlineStart: compact ? "8px" : "4px",
            fontSize: compact ? "13px" : isMobile ? "15px" : "13px",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: 0,
            borderRadius: "2px",
          },
          "& .MuiTabs-flexContainer": {
            gap: compact ? "4px" : "6px",
          },
          "& .MuiTabs-indicator": {
            height: "2px",
            borderRadius: "2px",
          },
        }}
      >
        {data?.map((item) => (
          <Tab value={item?.value} label={t(item.userType)} key={item?.id} />
        ))}
      </Tabs>
    </Stack>
  );
};

export default ChatUserTab;
