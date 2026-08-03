import { Chip, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ManageSearch from "../header/second-navbar/ManageSearch";
import TrackParcelFromHomePage from "../parcel/TrackParcelFromHomePage";
import { useSelector } from "react-redux";

const SearchWithTitle = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const moduleType = getCurrentModuleType();
  const { zoneid, token, searchQuery, name, query, currentTab } = props;
  const { configData } = useSelector((state) => state.configData);
  const showLeftAlignedHero =
    moduleType === ModuleTypes.GROCERY ||
    moduleType === ModuleTypes.ECOMMERCE ||
    moduleType === ModuleTypes.PHARMACY ||
    moduleType === ModuleTypes.FOOD;
  const filterChips = {
    [ModuleTypes.GROCERY]: ["All", "Fresh", "Popular", "Offers"],
    [ModuleTypes.ECOMMERCE]: ["All", "Best Seller", "New Arrival", "Trending"],
    [ModuleTypes.PHARMACY]: ["All", "Healthcare", "Supplements", "Deals"],
    [ModuleTypes.FOOD]: ["All", "Fast Food", "Top Rated", "Discount"],
  };

  const getBannerTexts1 = t("Get your car rental service with")
  const getBannerSubTexts = t("with affordable price.")

  const getBannerTexts = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          title: "Fresh Item that deserve to eat",
          subTitle: "Get your groceries items delivered in less than an hour",
        };
      case ModuleTypes.PHARMACY:
        return {
          title: "Quality Medicines & Health care at your Doorstep.",
          subTitle: "",
        };
      case ModuleTypes.ECOMMERCE:
        return {
          title: "Exclusive collection for everyone",
          subTitle: "Get Your Desired High Quality Products Here",
        };
      case ModuleTypes.FOOD:
        return {
          title: "FIND YOUR HAPPINESS",
          subTitle: "For the love of delicious food.",
        };
      case ModuleTypes.PARCEL:
        return {
          title: "Track your Products",
          subTitle: "Now you can track your products easily whenever you want.",
        };
      case ModuleTypes.RENTAL:
        return {
          title: "Rent best car for best experience",
          subTitle: `${getBannerTexts1} ${configData?.business_name} ${getBannerSubTexts}`,
        };
      default:
        return {
          title: "",
          subTitle: "",
        };
    }
  };

  return (
    <CustomStackFullWidth
      alignItems={showLeftAlignedHero ? "flex-start" : "center"}
      justifyContent={showLeftAlignedHero ? "flex-start" : "center"}
      spacing={isSmall ? 0.6 : 3}
      p={isSmall ? "12px 14px" : "20px"}
      mt={ModuleTypes.RENTAL === "rental" ? { xs: 0, sm: 2 } : 0}
      sx={{
        maxWidth: showLeftAlignedHero ? "760px" : "100%",
        width: "100%",
        marginInline: showLeftAlignedHero ? "0" : "auto",
      }}
    >
      <CustomStackFullWidth
        alignItems={showLeftAlignedHero ? "flex-start" : "center"}
        justifyContent={showLeftAlignedHero ? "flex-start" : "center"}
        spacing={isSmall ? 0.6 : 1.5}
      >
        <Typography
          variant={isSmall ? "h6" : "h5"}
          textAlign={showLeftAlignedHero ? "left" : "center"}
          fontWeight="600"
          lineHeight="33.18px"
          component="h1"
          sx={{
            fontSize: {
              xs: "18px",
              sm: "24px",
              md: ModuleTypes.RENTAL === "rental" && "30px !important",
            },
            textTransform:
              ModuleTypes.RENTAL === "rental" ? "capitalize" : "initial",
          }}
        >
          {t(getBannerTexts().title)}
        </Typography>
        <Typography
          variant={isSmall ? "subtitle2" : "subtitle1"}
          textAlign={showLeftAlignedHero ? "left" : "center"}
          sx={{ color: (theme) =>theme.palette.mode==="dark"?theme.palette.neutral[1000]: theme.palette.neutral[400] }}
          fontWeight="400"
          lineHeight={isSmall ? "16px" : "18.75px"}
          fontSize={isSmall ? "13px" : undefined}
          component="p"
        >
          {t(getBannerTexts().subTitle)}
        </Typography>
      </CustomStackFullWidth>

      {moduleType === "parcel" ? (
        <TrackParcelFromHomePage />
      ) : moduleType === "rental" ? null : (
        <CustomStackFullWidth spacing={isSmall ? 0.7 : 1.2}>
          <ManageSearch
            zoneid={zoneid}
            token={token}
            maxwidth="false"
            fullWidth
            searchQuery={searchQuery}
            name={name}
            query={query}
            currentTab={currentTab}
          />
          {/* Filter badge chips hidden — see HIDDEN_FROM_MAIN_PREVIEW.md #9 */}
        </CustomStackFullWidth>
      )}
    </CustomStackFullWidth>
  );
};

export default SearchWithTitle;
