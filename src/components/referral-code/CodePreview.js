import React from "react";
import { Box, Stack } from "@mui/system";
import { alpha, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import CustomCopyWithTooltip from "../custom-copy-with-tooltip";
import { useTheme } from "@emotion/react";
import { CodePreviewWrapper } from "./ReferralCode.style";
import ReferralShare from "./ReferralShare";
import { t } from "i18next";

const CodePreview = () => {
  const theme = useTheme();
  const isXsmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { profileInfo } = useSelector((state) => state.profileInfo);

  return (
    <Stack width="100%" spacing={1.5}>
      <Typography
        fontSize="13px"
        fontWeight={600}
        color={theme.palette.neutral[600]}
      >
        {t("Your referral code")}
      </Typography>
      <CodePreviewWrapper
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.neutral[900], 0.6)
              : alpha(theme.palette.primary.main, 0.05),
          borderColor: alpha(theme.palette.primary.main, 0.35),
          borderRadius: "2px",
          padding: { xs: "12px 14px", md: "14px 16px" },
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={{ xs: "15px", md: "16px" }}
          color={theme.palette.primary.main}
          fontFamily="monospace"
          letterSpacing={1}
        >
          {profileInfo?.ref_code}
        </Typography>
        <CustomCopyWithTooltip t={t} value={profileInfo?.ref_code} />
      </CodePreviewWrapper>
      <Typography
        fontSize="12px"
        color={theme.palette.neutral[500]}
        fontWeight={600}
        letterSpacing={0.4}
      >
        {t("OR SHARE")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <ReferralShare
          referralCode={profileInfo?.ref_code}
          size={isXsmall ? 30 : 36}
        />
      </Box>
    </Stack>
  );
};

export default CodePreview;
