import { createTheme as createMuiTheme } from "@mui/material/styles";

/** Site-wide marketplace typography — landing + modules + profile. */
export const APP_MARKETPLACE_FONT =
  '"Plus Jakarta Sans", "Rubik", system-ui, sans-serif';

/** @deprecated Use APP_MARKETPLACE_FONT — kept for existing imports */
export const LANDING_MARKETPLACE_FONT = APP_MARKETPLACE_FONT;

const inheritAppFont = {
  fontFamily: APP_MARKETPLACE_FONT,
};

export const appTypographyOptions = {
  fontFamily: APP_MARKETPLACE_FONT,
  h1: {
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  h4: {
    fontWeight: 600,
    letterSpacing: "-0.011em",
  },
  h5: {
    fontWeight: 600,
    letterSpacing: "-0.011em",
  },
  h6: {
    fontWeight: 600,
    letterSpacing: "-0.011em",
  },
  subtitle1: {
    fontWeight: 600,
    letterSpacing: "-0.011em",
  },
  subtitle2: {
    fontWeight: 600,
    letterSpacing: "-0.011em",
  },
  body1: {
    fontWeight: 400,
    fontSize: "0.875rem",
    letterSpacing: "-0.011em",
  },
  body2: {
    fontWeight: 400,
    fontSize: "0.75rem",
    letterSpacing: "-0.011em",
  },
  button: {
    fontWeight: 600,
    fontSize: "0.875rem",
    textTransform: "none",
  },
  caption: {
    fontWeight: 400,
    fontSize: "0.75rem",
    letterSpacing: "-0.011em",
  },
};

export const appComponentFontOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: APP_MARKETPLACE_FONT,
        letterSpacing: "-0.011em",
      },
      "#__next": {
        fontFamily: APP_MARKETPLACE_FONT,
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        ...inheritAppFont,
        fontWeight: 600,
        fontSize: "0.875rem",
        textTransform: "none",
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: inheritAppFont,
      input: {
        fontSize: "0.875rem",
        letterSpacing: "-0.011em",
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        ...inheritAppFont,
        fontWeight: 600,
        textTransform: "none",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      label: inheritAppFont,
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: inheritAppFont,
      secondary: {
        ...inheritAppFont,
        fontSize: "0.75rem",
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiAlert: {
    styleOverrides: {
      message: inheritAppFont,
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: inheritAppFont,
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: inheritAppFont,
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: inheritAppFont,
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: inheritAppFont,
      list: inheritAppFont,
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: inheritAppFont,
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: inheritAppFont,
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      label: inheritAppFont,
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: inheritAppFont,
      head: {
        ...inheritAppFont,
        fontWeight: 600,
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      content: {
        ...inheritAppFont,
        fontWeight: 600,
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: inheritAppFont,
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: inheritAppFont,
    },
  },
};

export const appCssBaselineOverrides = {
  body: {
    fontFamily: APP_MARKETPLACE_FONT,
    letterSpacing: "-0.011em",
  },
  "#__next": {
    fontFamily: APP_MARKETPLACE_FONT,
  },
};

export const createAppTheme = (baseTheme) =>
  createMuiTheme(baseTheme, {
    typography: appTypographyOptions,
    components: appComponentFontOverrides,
  });

/** Back-compat aliases */
export const landingTypographyOptions = appTypographyOptions;
export const landingComponentOverrides = appComponentFontOverrides;
export const createLandingTheme = createAppTheme;
