import React, { useEffect, useState } from "react";
import { Book as LibraryBooksIcon, Home as HomeIcon, MessageCircle as SmsRoundedIcon, ShoppingCart as ShoppingCartRoundedIcon, Heart as FavoriteIcon } from "lucide-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Badge, BottomNavigation, Paper, Box } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { CustomBottomNavigationAction } from "./NavBar.style";
import { t } from "i18next";
import CardView from "../added-cart-view";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import WishListCardView from "../wishlist";
import { getGuestId, getToken } from "helper-functions/getToken";
import { toast } from "react-hot-toast";
import useGetAllCartList from "api-manage/hooks/react-query/add-cart/useGetAllCartList";
import {
  getCartsFromResponse,
  getCartMetaFromResponse,
  mapApiCartRowsToReduxItems,
} from "helper-functions/normalizeCartListResponse";
import { getModule } from "helper-functions/getLanguage";
import { setCartList, setCartMeta } from "redux/slices/cart";
import {
  OPEN_CART_DRAWER_EVENT,
  Taxi,
} from "components/header/second-navbar/SecondNavbar";
import { useChatUnreadBadgeContext } from "contexts/ChatUnreadBadgeContext";

const styles = {
  maxWidth: 2000,
  width: "100%",
  height: "100%",
  padding: "0px 1rem",
};

const BottomNav = () => {
  const dispatch = useDispatch();
  const chatUnreadCtx = useChatUnreadBadgeContext();
  const chatBadgeCount =
    getToken() && chatUnreadCtx?.chatBadgeCount != null
      ? chatUnreadCtx.chatBadgeCount
      : null;
  const { wishLists } = useSelector((state) => state.wishList);
  const { cartList } = useSelector((state) => state.cart);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const totalWishList = wishLists?.item?.length + wishLists?.store?.length;
  const rentalTotalWishList =
    wishLists?.providers?.length + wishLists?.vehicles?.length;

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [wishListSideDrawerOpen, setWishListSideDrawerOpen] = useState(false);
  const router = useRouter();
  const currentRoute = router.pathname.replace("/", "");

  const cartListSuccessHandler = (res) => {
    if (res == null) return;
    dispatch(setCartMeta(getCartMetaFromResponse(res)));
    dispatch(setCartList(mapApiCartRowsToReduxItems(getCartsFromResponse(res))));
  };

  const {
    data: cartListData,
    refetch: cartListRefetch,
    isLoading: cartLoading,
  } =
    useGetAllCartList(getGuestId(), cartListSuccessHandler);

  useEffect(() => {
    if (cartListData != null) {
      cartListSuccessHandler(cartListData);
    }
  }, [cartListData]);
  const handleCartDrawerOpen = () => {
    setSideDrawerOpen(true);
    cartListRefetch?.();
  };

  useEffect(() => {
    const open = () => {
      setSideDrawerOpen(true);
      cartListRefetch?.();
    };
    window.addEventListener(OPEN_CART_DRAWER_EVENT, open);
    return () => window.removeEventListener(OPEN_CART_DRAWER_EVENT, open);
  }, [cartListRefetch]);
  const handleWishListsDrawerOpen = () => {
    if (getToken()) {
      setWishListSideDrawerOpen(true);
    } else {
      toast.error(t("Please login"));
    }
  };

  const isLandingPage = router.pathname === "/" || router.pathname === "" || !selectedModule?.id;
  const calculateTotalCartCount = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);
  };
  const bottomCartBadgeCount = isLandingPage
    ? calculateTotalCartCount(cartList)
    : calculateTotalCartCount(getCartListModuleWise(cartList));

  return (
    <CustomStackFullWidth>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "5px",
          width: "100%",
          zIndex: 1082,
          boxShadow: "0px -10px 10px -5px rgba(0, 0, 0, 0.2)",
        }}
        elevation={3}
      >
        <SimpleBar style={styles}>
          <BottomNavigation
            showLabels
            value={currentRoute}
            onChange={(event, newValue) => {
              if (newValue !== "cart" && newValue !== "wishlist") {
                if (newValue !== "home") {
                  if (getToken()) {
                    if (newValue === "inbox") {
                      // Do NOT reset the badge here — the badge clears naturally
                      // when the channel-list API poll reflects the messages as read.
                      // Calling resetChatBadge on tap would clear it before the user
                      // has actually read anything.
                    }
                    router.push(
                      { pathname: "/profile", query: { page: newValue } },
                      undefined,
                      {
                        shallow: true,
                      }
                    );
                  } else {
                    toast.error(t("Please login"));
                  }
                } else {
                  router.push(`/${newValue}`);
                }
              }
            }}
          >
            <CustomBottomNavigationAction
              label={t("Home")}
              value="home"
              icon={<HomeIcon />}
            />

                {selectedModule?.module_type === "rental" ? (<CustomBottomNavigationAction
                  label={t("My Trips")}
                  value="my-trips"
                  icon={
                      <Badge color="primary">
                      <Taxi />
                      </Badge>
                  }
              />) : (<CustomBottomNavigationAction
                  label={t("My Orders")}
                  value="my-orders"
                  icon={
                      <Badge color="primary">
                          <LibraryBooksIcon/>
                      </Badge>
                  }
              />)}

            {!isLandingPage &&
              selectedModule?.module_type !== "parcel" &&
              selectedModule?.module_type !== "rental" && (
                <CustomBottomNavigationAction
                  onClick={() => handleCartDrawerOpen()}
                  label={t("Cart")}
                  value="cart"
                  icon={
                    <Badge
                      badgeContent={bottomCartBadgeCount > 0 ? bottomCartBadgeCount : null}
                      color="primary"
                    >
                      <ShoppingCartRoundedIcon />
                    </Badge>
                  }
                />
              )}
            {selectedModule?.module_type === "rental" && (
              <Box sx={{ marginTop: "2px", marginInlineStart: "4px" }}>
                <Taxi color={(theme) => theme.palette.neutral[1000]} label={t("Carts")} />
              </Box>
            )}
            <CustomBottomNavigationAction
              label={t("Chat")}
              value="inbox"
              icon={
                <Badge
                  badgeContent={chatBadgeCount}
                  color="primary"
                  invisible={chatBadgeCount == null}
                >
                  <SmsRoundedIcon />
                </Badge>
              }
            />
            <CustomBottomNavigationAction
              label={t("WishList")}
              value="wishlist"
              onClick={() => handleWishListsDrawerOpen()}
              icon={
                <Badge
                  badgeContent={
                    getModule()?.module_type !== "rental"
                      ? totalWishList
                      : rentalTotalWishList || 0
                  }
                  color="primary"
                >
                  <FavoriteIcon />
                </Badge>
              }
            />
          </BottomNavigation>
        </SimpleBar>
        {!!sideDrawerOpen && (
          <CardView
            sideDrawerOpen={sideDrawerOpen}
            setSideDrawerOpen={setSideDrawerOpen}
            cartList={cartList}
            refetch={cartListRefetch}
            isLoading={cartLoading}
          />
        )}

        {!!wishListSideDrawerOpen && (
          <WishListCardView
            sideDrawerOpen={wishListSideDrawerOpen}
            setSideDrawerOpen={setWishListSideDrawerOpen}
          />
        )}
      </Paper>
    </CustomStackFullWidth>
  );
};

export default React.memo(BottomNav);
