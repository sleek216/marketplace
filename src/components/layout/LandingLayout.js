import PropTypes from "prop-types";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import ModuleSelect from "../module-select/ModuleSelect";
import HeaderComponent from "../header";
import FooterComponent from "../footer";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import AppShellRoot from "./AppShellRoot";

export { APP_MARKETPLACE_FONT as LANDING_MARKETPLACE_FONT } from "../../theme/app-typography";

export const LandingLayout = ({ children, configData, landingPageData }) => {
  const { data } = useGetLandingPage();
  const theme = useTheme();
  const isSmall = useMediaQuery("(max-width:1180px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppShellRoot justifyContent="space-between">
      <header>
        <HeaderComponent configData={configData} />
      </header>
      <Stack
        sx={{
          mt: !isSmall ? "5.9rem" : isMobile ? "5.5rem" : "3.5rem",
          flexGrow: 1,
          minHeight: {
            xs: "calc(100dvh - 5.5rem)",
            md: "calc(100dvh - 5.9rem)",
          },
        }}
      >

        {children}
      </Stack>
      <footer style={{ overflowAnchor: "none" }}>
        <FooterComponent
          configData={configData}
          landingPageData={data ?? landingPageData}
        />
      </footer>
    </AppShellRoot>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node,
};
