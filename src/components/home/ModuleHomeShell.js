import { Box, useTheme } from "@mui/material";
import CustomContainer from "../container";
import { sectionBandPySx } from "./homeSectionRhythm";

/** Landing-matched page shell for all module homes */
export const ModuleHomeShell = ({ children, sx }) => (
  <Box
    sx={{
      bgcolor: "background.paper",
      minHeight: "100vh",
      pb: { xs: 2, md: 2.5 },
      "& h1, & h2": {
        textAlign: "left !important",
      },
      ...sx,
    }}
  >
    {children}
  </Box>
);

/** Alternating paper / muted bands — same rhythm as landing marketplace sections */
export const ModuleSectionBand = ({
  children,
  variant = "paper",
  sx,
  containerSx,
  fullBleed = false,
}) => {
  const theme = useTheme();
  const paperBandSx = {
    bgcolor: "background.paper",
    ...sectionBandPySx,
  };
  const mutedBandSx = {
    bgcolor: theme.palette.neutral?.[100] || theme.palette.background.custom3,
    ...sectionBandPySx,
  };
  const bandSx = variant === "muted" ? mutedBandSx : paperBandSx;

  return (
    <Box sx={{ ...bandSx, ...sx }}>
      {fullBleed ? children : (
        <CustomContainer sx={containerSx}>{children}</CustomContainer>
      )}
    </Box>
  );
};

export default ModuleHomeShell;
