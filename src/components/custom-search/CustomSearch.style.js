import { alpha, InputBase, IconButton, styled } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { APP_MARKETPLACE_FONT } from "theme/app-typography";

const R = "2px";

export const Search = styled(CustomStackFullWidth)(
  ({ theme, type2, compact }) => ({
    position: "relative",
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.04)
        : alpha(theme.palette.neutral?.[100] || "#f5f6f8", 0.9),
    color: theme.palette.text.primary,
    height: compact ? "34px" : "40px",
    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
    borderRadius: R,
    boxShadow: "none",
    overflow: "hidden",
    fontFamily: APP_MARKETPLACE_FONT,
    transition: theme.transitions.create(
      ["box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.short }
    ),
    "&:hover": {
      borderColor: alpha(theme.palette.primary.main, 0.35),
      backgroundColor: theme.palette.background.paper,
    },
    "&:focus-within": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    [theme.breakpoints.down("md")]: {
      height: compact ? "34px" : "38px",
    },
    [theme.breakpoints.down("sm")]: {
      height: compact ? "32px" : "36px",
    },
  })
);

export const SearchIconWrap = styled("span")(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginInlineStart: "10px",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: "color 0.15s ease",
  [theme.breakpoints.down("sm")]: {
    marginInlineStart: "8px",
  },
}));

export const SearchActionButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  width: 32,
  height: 32,
  marginInlineEnd: "4px",
  borderRadius: R,
  color: theme.palette.text.secondary,
  padding: 0,
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  [theme.breakpoints.down("sm")]: {
    width: 28,
    height: 28,
    marginInlineEnd: "3px",
  },
}));

export const StyledInputBase = styled(InputBase)(
  ({ theme, language_direction, compact }) => ({
    color: theme.palette.text.primary,
    width: "100%",
    flex: 1,
    minWidth: 0,
    fontFamily: APP_MARKETPLACE_FONT,
    "& .MuiInputBase-input": {
      padding: compact ? "7px 8px" : "9px 10px",
      fontSize: compact ? "13px" : "13.5px",
      fontWeight: 500,
      letterSpacing: "-0.011em",
      lineHeight: 1.3,
      transition: theme.transitions.create("width"),
      width: "100%",
      "&::placeholder": {
        color: theme.palette.text.secondary,
        opacity: 0.75,
        fontWeight: 400,
      },
      [theme.breakpoints.down("sm")]: {
        padding: compact ? "6px 6px" : "8px 8px",
        fontSize: "13px",
      },
    },
  })
);
