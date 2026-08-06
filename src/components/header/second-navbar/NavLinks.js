import React, { useCallback, useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { NavMenuLink } from "../NavBar.style";
import NavCategory from "./NavCategory";
import NavStore from "./NavStore";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import { setModules } from "redux/slices/configData";
import { useRouter } from "next/router";

const NavLinks = ({ moduleType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);
  const { data: moduleData } = useGetModule(modules?.length === 0);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [storeAnchor, setStoreAnchor] = useState(null);

  useEffect(() => {
    if (moduleData && moduleData.length > 0 && (!modules || modules.length === 0)) {
      dispatch(setModules(moduleData));
    }
  }, [moduleData, modules, dispatch]);

  // Scoped closers: a stale hover-close from one dropdown must not close
  // the other one that just opened.
  const closeCategory = useCallback(() => {
    setActiveDropdown((prev) => (prev === "category" ? null : prev));
    setCategoryAnchor(null);
  }, []);

  const closeStore = useCallback(() => {
    setActiveDropdown((prev) => (prev === "store" ? null : prev));
    setStoreAnchor(null);
  }, []);

  const openCategory = useCallback((anchor) => {
    setCategoryAnchor(anchor);
    setStoreAnchor(null);
    setActiveDropdown("category");
  }, []);

  const openStore = useCallback((anchor) => {
    setStoreAnchor(anchor);
    setCategoryAnchor(null);
    setActiveDropdown("store");
  }, []);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{
        pr: { lg: 1, xl: 2 },
        position: "relative",
        zIndex: 2,
        whiteSpace: "nowrap",
      }}
    >
      <NavMenuLink
        component={Link}
        href="/"
        underline="none"
        sx={{
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "14px",
          px: 1.25,
          py: 0.85,
          borderRadius: "8px",
          textDecoration: "none",
          color: (router.pathname === "/" || router.pathname === "/home") ? "primary.main" : "text.primary",
          backgroundColor: "transparent",
          "&:hover": {
            color: "primary.main",
            backgroundColor: "alpha(theme.palette.primary.main, 0.05)",
          },
        }}
      >
        {t("Home")}
      </NavMenuLink>

      {moduleType !== "parcel" ? (
        <>
          <NavCategory
            isOpen={activeDropdown === "category"}
            anchorEl={categoryAnchor}
            onOpen={openCategory}
            onClose={closeCategory}
          />
          <NavStore
            isOpen={activeDropdown === "store"}
            anchorEl={storeAnchor}
            onOpen={openStore}
            onClose={closeStore}
          />
        </>
      ) : (
        <NavMenuLink
          component={Link}
          href="/help-and-support"
          underline="none"
          role="button"
          tabIndex={0}
          sx={{
            cursor: "pointer",
            fontSize: "15px",
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          {t("Contact")}
        </NavMenuLink>
      )}
    </Stack>
  );
};

export default React.memo(NavLinks);
