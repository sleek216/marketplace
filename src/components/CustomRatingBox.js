import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Stack } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";

const CustomRatingBox = (props) => {
  const { rating } = props;
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);

  const digits = configData?.digit_after_decimal_point ?? 2;
  const value =
    rating != null && !Number.isNaN(Number(rating)) ? Number(rating) : 0;
  const display = value.toFixed(digits);

  const starColor = theme.palette.warning.main;
  const bg =
    theme.palette.mode === "dark"
      ? alpha(starColor, 0.22)
      : alpha(starColor, 0.13);
  const borderColor = alpha(starColor, 0.32);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.4}
      sx={{
        px: "8px",
        py: "3px",
        width: "auto",
        minWidth: "auto",
        borderRadius: "999px",
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "none"
            : "0 1px 2px rgba(0, 0, 0, 0.06)",
      }}
    >
      <StarRoundedIcon
        sx={{
          fontSize: { xs: 14, md: 15 },
          color: starColor,
          display: "block",
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: { xs: "10px", md: "12px" },
          fontWeight: 700,
          lineHeight: 1.2,
          color: (t) => t.palette.neutral?.[1000] ?? t.palette.text.primary,
          letterSpacing: "0.02em",
        }}
      >
        {display}
      </Typography>
    </Stack>
  );
};

CustomRatingBox.propTypes = {};

export default CustomRatingBox;
