import React from "react";
import {
  alpha,
  Box,
  List,
  ListItem,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { Check } from "lucide-react";

const PlanCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ theme, isActive }) => ({
  position: "relative",
  height: "100%",
  minHeight: "300px",
  padding: "20px 16px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  border: `1.5px solid ${
    isActive
      ? theme.palette.primary.main
      : alpha(theme.palette.neutral[400], 0.28)
  }`,
  boxShadow: isActive
    ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`
    : "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  overflow: "hidden",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const ActiveCorner = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: "52px",
  height: "52px",
  background: theme.palette.primary.main,
  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  padding: "6px 7px 0 0",
  zIndex: 1,
}));

const FeatureList = styled(List, {
  shouldForwardProp: (prop) => prop !== "isScrollable",
})(({ theme, isScrollable }) => ({
  padding: 0,
  marginTop: "14px",
  maxHeight: "140px",
  overflowY: isScrollable ? "scroll" : "auto",
  paddingRight: isScrollable ? "6px" : 0,
  scrollbarWidth: "thin",
  scrollbarColor: `${alpha(theme.palette.primary.main, 0.55)} ${alpha(
    theme.palette.neutral[300],
    0.45
  )}`,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.neutral[300], 0.4),
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.55),
    borderRadius: "8px",
    border: `1px solid ${alpha(theme.palette.neutral[300], 0.3)}`,
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
}));

const FeatureItem = styled(ListItem)(({ theme }) => ({
  padding: "5px 0",
  gap: "8px",
  fontSize: "12px",
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  "&:last-child": { borderBottom: "none" },
}));

const Plan = ({ setSelectedPackage, selectedPackage, item }) => {
  const theme = useTheme();
  const isActive = selectedPackage === item?.id;

  const features = [
    { label: `${t("Max order")} (${item?.max_order})`, show: true },
    { label: `${t("Max product")} (${item?.max_product})`, show: true },
    { label: t("Pos"), show: item?.pos === 1 },
    { label: t("Mobile app"), show: item?.mobile_app === 1 },
    { label: t("Chat"), show: item?.chat === 1 },
    { label: t("Review"), show: item?.review === 1 },
    { label: t("Self delivery"), show: item?.self_delivery === 1 },
  ].filter((f) => f.show);
  const isScrollable = features.length > 4;

  return (
    <Box sx={{ px: "6px", py: "4px", height: "100%" }}>
      <PlanCard
        isActive={isActive}
        className="plan-item"
        onClick={() => setSelectedPackage(item.id)}
      >
        {isActive && (
          <ActiveCorner>
            <Check size={14} color="#fff" strokeWidth={3} />
          </ActiveCorner>
        )}

        <Typography
          fontSize="14px"
          fontWeight={600}
          color="text.primary"
          textAlign="center"
          sx={{ pr: isActive ? 2 : 0 }}
        >
          {item?.package_name}
        </Typography>

        <Typography
          fontSize="28px"
          fontWeight={700}
          color="primary.main"
          textAlign="center"
          lineHeight={1.2}
          mt={0.5}
        >
          {getAmountWithSign(item?.price)}
        </Typography>

        <Typography
          fontSize="12px"
          color="text.secondary"
          textAlign="center"
          mt={0.5}
          pb={1.5}
          borderBottom={`1px solid ${alpha(theme.palette.divider, 0.12)}`}
        >
          {item?.validity} {t("Days")}
        </Typography>

        <FeatureList isScrollable={isScrollable}>
          {features.map((feature) => (
            <FeatureItem key={feature.label}>
              <Check
                size={14}
                color={theme.palette.primary.main}
                strokeWidth={2.5}
              />
              <span>{feature.label}</span>
            </FeatureItem>
          ))}
        </FeatureList>
        {isScrollable && (
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={0.75}
            fontSize="10px"
            color="text.secondary"
          >
            {t("Scroll for more features")}
          </Typography>
        )}
      </PlanCard>
    </Box>
  );
};

export default Plan;
