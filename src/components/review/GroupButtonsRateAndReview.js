import React from "react";
import { Box, Tab, Tabs, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const GroupButtonsRateAndReview = ({ setType, type, moduleType }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tabs = [];
  if (moduleType !== "parcel") tabs.push({ label: t("Items"), value: "items" });
  tabs.push({ label: t("Delivery man"), value: "delivery_man" });

  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: `1px solid ${alpha(theme.palette.neutral[400], 0.22)}`,
      }}
    >
      <Tabs
        value={type}
        onChange={(event, newValue) => setType(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: "34px",
          "& .MuiTabs-indicator": {
            height: "3px",
            borderRadius: "2px",
          },
          "& .MuiTab-root": {
            minHeight: "34px",
            textTransform: "capitalize",
            fontSize: { xs: "12px", md: "13px" },
            fontWeight: 600,
            px: { xs: 1.2, md: 1.8 },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
};

GroupButtonsRateAndReview.propTypes = {};

export default GroupButtonsRateAndReview;
