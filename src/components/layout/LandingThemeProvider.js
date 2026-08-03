import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { createAppTheme } from "../../theme/app-typography";

/** Optional nested theme — global createTheme already applies app typography. */
const LandingThemeProvider = ({ children }) => {
  const baseTheme = useTheme();
  const theme = useMemo(() => createAppTheme(baseTheme), [baseTheme]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default LandingThemeProvider;
