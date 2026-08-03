import React from "react";
import { sanitizeBrand } from "utils/brandFilter";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography, alpha, useMediaQuery } from "@mui/material";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
import { useTheme } from "@emotion/react";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import CustomContainer from "../container";
import { useRouter } from "next/router";
import FooterBottomItems from "./FooterBottomItems";

const FooterBottom = (props) => {
  const router = useRouter()
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };
  const { configData } = props;
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          background: theme.palette.background.default,
        },
      }}
    >
      <CustomStackFullWidth
        py="1rem"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "relative",
          zIndex: "1",
          backgroundColor:
            getCurrentModuleType() === ModuleTypes?.FOOD
              ? alpha(theme.palette.moduleTheme.food, 0.051)
              : alpha(theme.palette.primary.main, 0.051),
        }}
      >
        <CustomContainer
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <CustomStackFullWidth
            direction={{ xs: "column", sm: "row", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography
              sx={{
                width: { xs: "100%", sm: "auto" },
                whiteSpace: { xs: "normal", md: "nowrap" },
              }}
              textAlign={{ xs: "center", md: "start" }}
            >
              {sanitizeBrand(configData?.footer_text)
                ?.replace(/Demo footer text @ 2025/g, "Gift Marketplace @ 2026")
                ?.replace(/@ 2025/g, "@ 2026") || "Gift Marketplace @ 2026"}
            </Typography>
            <>
              {!isXSmall && <FooterBottomItems handleClickToRoute={handleClickToRoute} configData={configData} />}
            </>
          </CustomStackFullWidth>
        </CustomContainer>
      </CustomStackFullWidth>
    </Box>
  );
};

FooterBottom.propTypes = {};

export default FooterBottom;
