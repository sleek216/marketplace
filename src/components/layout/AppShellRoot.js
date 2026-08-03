import { Stack, styled } from "@mui/material";
import { APP_MARKETPLACE_FONT } from "../../theme/app-typography";

/** Shared page shell — same typography on landing, modules, profile, checkout. */
export const AppShellRoot = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  fontFamily: APP_MARKETPLACE_FONT,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  letterSpacing: "-0.011em",
  "& h1, & h2, & h3": {
    letterSpacing: "-0.02em",
    fontWeight: 700,
    fontFamily: "inherit",
  },
  "& h4, & h5, & h6": {
    letterSpacing: "-0.011em",
    fontWeight: 600,
    fontFamily: "inherit",
  },
  "& .MuiTypography-root, & button, & input, & textarea, & select, & label, & a, & p, & span, & li, & td, & th":
    {
      fontFamily: "inherit",
    },
}));

export default AppShellRoot;
