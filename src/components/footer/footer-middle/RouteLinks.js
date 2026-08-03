import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Router, useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { RouteLinksData } from "../demoLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import { useDispatch, useSelector } from "react-redux";

const RouteLinks = (props) => {
  const dispatch = useDispatch();
  const { selectedModule } = useSelector((state) => state.utilsData);

  const { token, configData } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const handleClick = (href, value) => {
    if (value === "loyalty_points" || value === "my_wallet") {
      if (token) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must be login to access this page."));
      }
    } else if (value === "campaigns") {
      const zoneId = localStorage.getItem("zoneid");
      if (zoneId) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must pick a zone to access this page."));
      }
    } else if (value === "restaurant_owner") {
      dispatch(setAllData(null));
      router.push(
        {
          pathname: href,
          query: { active: "active" }, // Add your query parameter here
        },
        undefined,
        { shallow: true }
      );
    } else if (value === "delivery_man") {
      router.push(href, undefined, { shallow: true });
    } else if (value === "help-and-support") {
      router.push(href, undefined, { shallow: true });
    }
  };
  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };
  const theme = useTheme();
  const footerRouteLinks = [
    ...RouteLinksData.filter((item) => {
      if (
        (!configData?.toggle_dm_registration && item.value === "delivery_man") ||
        (!configData?.toggle_dm_registration && item?.value === "restaurant_owner")
      ) {
        return false;
      }
      return true;
    }).map((item) => ({
      label: t(item.name),
      onClick: () => handleClick(item.link, item.value),
    })),
    {
      label: t("About Us"),
      onClick: () => handleClickToRoute("/about-us"),
    },
    {
      label:
        selectedModule?.module_type === "rental"
          ? t("Track Trip")
          : t("Track Order"),
      onClick: () => handleClickToRoute("/track-order"),
    },
  ];

  const linkSx = {
    cursor: "pointer",
    fontWeight: 600,
    fontSize: { xs: "12px", sm: "13px", md: "14px" },
    position: "relative",
    transition: "all 0.2s ease",
    width: "100%",
    textAlign: { xs: "left", sm: "center" },
    lineHeight: 1.35,
    px: { xs: 0.25, sm: 0.5 },
    whiteSpace: { xs: "normal", md: "nowrap" },
    wordBreak: "break-word",
    "&:hover": {
      color: theme.palette.primary.main,
      "&::after": {
        width: "100%",
      },
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-4px",
      left: 0,
      width: 0,
      height: "2px",
      backgroundColor: theme.palette.primary.main,
      transition: "width 0.2s ease",
    },
  };

  return (
    <CustomStackFullWidth
      sx={{
        width: "100%",
        minWidth: 0,
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(5, minmax(0, 1fr))",
        },
        gap: { xs: "10px 12px", sm: "14px 16px", md: "12px 14px" },
        alignItems: "start",
      }}
    >
      {footerRouteLinks.map((item, index) => (
        <Typography
          key={`${item.label}-${index}`}
          onClick={item.onClick}
          sx={{
            ...linkSx,
            py: { xs: 0.35, sm: 0.25 },
          }}
        >
          {item.label}
        </Typography>
      ))}
    </CustomStackFullWidth>
  );
};

RouteLinks.propTypes = {};

export default RouteLinks;
