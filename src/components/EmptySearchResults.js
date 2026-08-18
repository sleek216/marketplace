import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, useTheme, alpha, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SEARCH_NO_DATA_FOUND } from "../utils/staticTexts";
import NoItemsSvg from "./svg-components/NoItemsSvg";
import NoStoresSvg from "./svg-components/NoStoresSvg";
import NoRentalSvg from "components/svg-components/NoRentalSvg";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/router";

const EmptySearchResults = (props) => {
  const { isItems, isRental, text, onReset } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    } else {
      router.push({
        pathname: "/home",
        query: router.query.module_id ? { module_id: router.query.module_id } : {},
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 4, md: 5 },
        px: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: "16px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.neutral[100] || "#F8FAFC", 0.5),
        border: `1px dashed ${alpha(theme.palette.divider, 0.7)}`,
        my: 0,
      }}
    >
      {/* Soft glowing aura backdrop for illustration */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            filter: "blur(20px)",
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, transform: "scale(0.9)" }}>
          {isRental ? (
            <NoRentalSvg />
          ) : isItems ? (
            <NoItemsSvg />
          ) : (
            <NoStoresSvg />
          )}
        </Box>
      </Box>

      {/* Main Heading */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.15rem", sm: "1.3rem" },
          color: theme.palette.text.primary,
          mb: 0.75,
          letterSpacing: "-0.2px",
        }}
      >
        {t(text || "Items Not Found!")}
      </Typography>

      {/* Description Subtext */}
      <Typography
        variant="body2"
        sx={{
          color: (theme) => alpha(theme.palette.neutral[500], 0.85),
          fontSize: "0.875rem",
          maxWidth: "400px",
          lineHeight: 1.55,
          mb: 3,
        }}
      >
        {t(SEARCH_NO_DATA_FOUND || "Sorry, no data found related to your search. Try adjusting your filters or search keywords.")}
      </Typography>

      {/* Action Button */}
      <Button
        onClick={handleResetFilters}
        variant="outlined"
        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.85rem",
          px: 2.5,
          py: 0.8,
          borderColor: alpha(theme.palette.primary.main, 0.4),
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        {t("Reset All Filters")}
      </Button>
    </Box>
  );
};

EmptySearchResults.propTypes = {
  text: PropTypes.string.isRequired,
  onReset: PropTypes.func,
};

export default EmptySearchResults;
