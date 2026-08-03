import React from "react";
import { Box } from "@mui/system";
import { Stack, Tab } from "@mui/material";
import { CustomTab } from "./tabs.style";
import { setCurrentTab } from "../../redux/slices/utils";
import { useDispatch } from "react-redux";

const TabLabel = ({ title, badgeCount, t }) => (
  <Stack direction="row" alignItems="center" spacing={0.75}>
    <Box component="span">{t(title)}</Box>
    {typeof badgeCount === "number" && badgeCount > 0 && (
        <Box
          component="span"
          sx={{
            minWidth: 20,
            height: 20,
            px: 0.5,
            borderRadius: "2px",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "10px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
        {badgeCount}
      </Box>
    )}
  </Stack>
);

const TabsTypeOne = (props) => {
  const { currentTab, tabs, t, width } = props;
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    dispatch(setCurrentTab(newValue));
  };

  return (
    <Box>
      <CustomTab
        indicatorColor="primary"
        value={currentTab}
        onChange={handleChange}
      >
        {tabs &&
          tabs.length > 0 &&
          tabs.map((item, index) => {
            return (
              <Tab
                sx={{ textTransform: "capitalize" }}
                key={index}
                label={
                  <TabLabel
                    title={item?.title}
                    badgeCount={item?.badgeCount}
                    t={t}
                  />
                }
                value={item?.title}
              ></Tab>
            );
          })}
      </CustomTab>
    </Box>
  );
};

TabsTypeOne.propTypes = {};

export default TabsTypeOne;
