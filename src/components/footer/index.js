import { useRouter } from "next/router";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../container";
import { StyledFooterBackground } from "./Footer.style";
import FooterBottom from "./FooterBottom";
import FooterMiddle from "./footer-middle/FooterMiddle";
import FooterTop from "./footer-top/FooterTop";
import AppAndSellerBanner from "./AppAndSellerBanner";

const FooterComponent = (props) => {
  const { configData, landingPageData } = props;
  const router = useRouter();
  const isLandingPage = router.pathname === "/" ? "true" : "false";
  return (
    <CustomStackFullWidth
      sx={{
        mt: {
          xs: router.pathname === "/" ? "0rem" : "6rem",
          sm: router.pathname === "/" ? "0rem" : "3rem",
          md: router.pathname === "/" ? "0rem" : "9rem",
        },
      }}
    >
      <AppAndSellerBanner configData={configData} landingPageData={landingPageData} />
      <FooterTop landingPageData={landingPageData} />
      <StyledFooterBackground nobottommargin={isLandingPage}>
        <CustomStackFullWidth
          height="100%"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <CustomContainer
            sx={{
              width: "100%",
              maxWidth: "100%",
              px: { xs: 2, sm: 2.5, md: 3 },
              boxSizing: "border-box",
            }}
          >
            <FooterMiddle
              configData={configData}
              landingPageData={landingPageData}
            />
          </CustomContainer>
          <FooterBottom configData={configData} />
        </CustomStackFullWidth>
      </StyledFooterBackground>
    </CustomStackFullWidth>
  );
};

export default FooterComponent;
