import React, { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { IconButton, Slide } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";
import MobileTopMenu from "./MobileTopMenu";
import { CustomDrawer } from "../../NavBar.style";
import { setLogoutUser } from "redux/slices/profileInfo";
import toast from "react-hot-toast";
import { logoutSuccessFull } from "utils/toasterMessages";
import { clearWishList } from "redux/slices/wishList";
import { setClearCart } from "redux/slices/cart";
import { OPEN_AUTH_MODAL_EVENT } from "../../second-navbar/SecondNavbar";
import { clearUserSessionData } from "helper-functions/headerSessionSync";

import { resetEntireCart } from "redux/slices/cart";

const DrawerMenu = ({ setOpenDrawer: externalSetOpenDrawer }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const closeDrawer = () => {
    setInternalOpen(false);
    if (externalSetOpenDrawer) {
      externalSetOpenDrawer(false);
    }
  };

  const openDrawerHandler = () => {
    setInternalOpen(true);
  };

  const handleRoute = (path) => {
    router.push(`/${path}`, undefined, { shallow: true });
    closeDrawer();
  };

  const handleSignIn = () => {
    window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT));
    closeDrawer();
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      setTimeout(() => {
        dispatch(setLogoutUser(null));
        dispatch(resetEntireCart());
        clearUserSessionData();
        closeDrawer();
        toast.success(t(logoutSuccessFull));
        setOpenModal(false);
        let a = [];
        dispatch(clearWishList(a));
        dispatch(setClearCart());
        if (router.pathname === "/") {
          router.push("/", undefined, { shallow: true });
        } else {
          router.push("/home", undefined, { shallow: true });
        }
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="mobile navigation menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={openDrawerHandler}
        sx={{
          color: (theme) => theme.palette.primary.main,
          paddingRight: "0px",
        }}
      >
        <MenuIcon />
      </IconButton>
      {internalOpen && (
        <CustomDrawer
          variant="temporary"
          anchor="right"
          open={internalOpen}
          onClose={closeDrawer}
          router={router}
          TransitionComponent={Slide}
          TransitionProps={{
            direction: "left",
            timeout: 300,
          }}
        >
          <MobileTopMenu
            handleRoute={handleRoute}
            handleSignIn={handleSignIn}
            toggleDrawer={closeDrawer}
            setOpenDrawer={setInternalOpen}
            handleLogout={handleLogout}
            openModal={openModal}
            isLogoutLoading={isLogoutLoading}
            setOpenModal={setOpenModal}
            t={t}
          />
        </CustomDrawer>
      )}
    </>
  );
};

export default DrawerMenu;
