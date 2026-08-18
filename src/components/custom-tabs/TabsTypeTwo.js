import React from "react";
import { Box, Stack } from "@mui/system";
import { styled, Typography, useTheme, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";

const TabContainer = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.8)
      : alpha(theme.palette.neutral[200] || "#E2E8F0", 0.5),
  padding: "4px",
  borderRadius: "30px",
  border: `2px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0,0,0,0.3)"
      : "0 2px 8px rgba(0,0,0,0.04)",
}));

const TabButton = styled(Box)(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 24px",
  borderRadius: "24px",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor:
    active === "true"
      ? theme.palette.primary.main
      : "transparent",
  color:
    active === "true"
      ? "#ffffff"
      : theme.palette.text.secondary,
  boxShadow:
    active === "true"
      ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`
      : "none",
  fontWeight: active === "true" ? 700 : 500,
  fontSize: "14px",
  letterSpacing: "-0.1px",
  "&:hover": {
    color:
      active === "true"
        ? "#ffffff"
        : theme.palette.primary.main,
    backgroundColor:
      active === "true"
        ? theme.palette.primary.main
        : alpha(theme.palette.primary.main, 0.08),
  },
}));

const TabsTypeTwo = (props) => {
  const { tabs, currentTab, setCurrentTab } = props;
  const { t } = useTranslation();

  return (
    <TabContainer>
      {tabs?.length > 0 &&
        tabs.map((item, index) => {
          const isActive = currentTab === index;
          return (
            <TabButton
              key={index}
              active={isActive ? "true" : "false"}
              onClick={() => setCurrentTab(index, item)}
            >
              {t(item?.name)}
            </TabButton>
          );
        })}
    </TabContainer>
  );
};

TabsTypeTwo.propTypes = {};

export default TabsTypeTwo;
