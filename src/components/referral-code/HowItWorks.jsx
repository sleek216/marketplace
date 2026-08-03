import React from "react";
import { Stack, Typography, alpha, useTheme, Box, Divider } from "@mui/material";
import { Info } from "lucide-react";
import { t } from "i18next";

const STEPS = (configData) => [
  t("Invite and share your code to your friends & family members"),
  `${t("They create a account on")} ${configData?.business_name} ${t(
    "using your code and place their first order"
  )}`,
  t("You made your earning when the order is complete"),
];

const HowItWorks = ({ configData }) => {
  const theme = useTheme();
  const steps = STEPS(configData);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "2px",
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.neutral[900], 0.5)
            : alpha(theme.palette.primary.main, 0.03),
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ px: { xs: 1.5, md: 2 }, py: 1.5 }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            minWidth: 28,
            borderRadius: "2px",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <Info size={15} strokeWidth={2.2} />
        </Box>
        <Typography
          fontSize="14px"
          fontWeight={700}
          color={theme.palette.primary.main}
        >
          {t("How it works?")}
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />

      <Stack
        spacing={1.5}
        alignItems="stretch"
        sx={{
          width: "100%",
          px: { xs: 1.5, md: 2 },
          py: 2,
          boxSizing: "border-box",
        }}
      >
        {steps.map((text, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="flex-start"
            spacing={1.25}
            sx={{ width: "100%", m: 0 }}
          >
            <Box
              sx={{
                width: 28,
                minWidth: 28,
                height: 28,
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: "13px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </Box>
            <Typography
              fontSize="13px"
              color={theme.palette.neutral[700]}
              lineHeight={1.55}
              sx={{ flex: 1, minWidth: 0, textAlign: "left", m: 0 }}
            >
              {text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default HowItWorks;
