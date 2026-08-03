import React from "react";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import WishLists from "./WishLists";
import { Heart as FavoriteIcon } from "lucide-react";
import { t } from "i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DrawerHeader from "../added-cart-view/DrawerHeader";
import { Box } from "@mui/material";

const WishListCardView = (props) => {
  const closeHandler = () => {
    setSideDrawerOpen(false);
  };
  const { sideDrawerOpen, setSideDrawerOpen } = props;
  return (
    <CustomSideDrawer
      anchor="right"
      open={sideDrawerOpen}
      onClose={closeHandler}
      variant="temporary"
      maxWidth="480px"
      width="100%"
      height="100vh"
    >
      <CustomStackFullWidth
        sx={{
          height: "100vh",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DrawerHeader
          CartIcon={<FavoriteIcon size={20} strokeWidth={2.2} />}
          title="Wishlist"
          closeHandler={closeHandler}
        />
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <WishLists t={t} setSideDrawerOpen={setSideDrawerOpen} />
        </Box>
      </CustomStackFullWidth>
    </CustomSideDrawer>
  );
};

export default WishListCardView;
