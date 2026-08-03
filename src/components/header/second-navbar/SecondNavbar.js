import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  alpha,
  Avatar,
  IconButton,
  NoSsr,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Bell as NotificationsIcon, MessageCircle as ChatBubbleOutlineIcon } from "lucide-react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import LogoSide from "../../logo/LogoSide";
import NavLinks from "./NavLinks";
import { t } from "i18next";
import { Heart as FavoriteBorderIcon } from "lucide-react";
import { ShoppingCart as ShoppingCartOutlinedIcon } from "lucide-react";
import { useRouter } from "next/router";
import NavBarIcon from "./NavBarIcon";
import { useDispatch, useSelector } from "react-redux";
import AccountPopover from "./account-popover";
import CardView from "../../added-cart-view";
import CustomContainer from "../../container";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import WishListCardView from "../../wishlist";
import useCustomerProfileSync from "hooks/useCustomerProfileSync";
import {
  getUserDisplayName,
  getUserInitials,
} from "helper-functions/userDisplay";
import { resolveImageSrc } from "helper-functions/resolveImageSrc";
import useGetAllCartList from "../../../api-manage/hooks/react-query/add-cart/useGetAllCartList";
import { setCartList, setCartMeta } from "redux/slices/cart";
import { clearOfflinePaymentInfo } from "redux/slices/offlinePaymentData";
import { Truck as LocalShippingOutlinedIcon } from "lucide-react";
import { getModule } from "helper-functions/getLanguage";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";
import {
  getCartMetaFromResponse,
  getCartsFromResponse,
  mapApiCartRowsToReduxItems,
} from "helper-functions/normalizeCartListResponse";
import useGetGuest from "../../../api-manage/hooks/react-query/guest/useGetGuest";
import CallToAdmin from "../../CallToAdmin";
import CustomLanguage from "../top-navbar/language/CustomLanguage";
import { SignInButton } from "components/header/NavBar.style";
import { Lock as LockOutlinedIcon, Car as DirectionsCarOutlinedIcon } from "lucide-react";
import dynamic from "next/dynamic";
import TaxiView from "components/home/module-wise-components/rental/components/home/TaxiView";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import Box from "@mui/material/Box";
import cookie from "js-cookie";
import CustomModal from "components/modal";
import ForgotPassword from "components/auth/ForgotPassword/ForgotPassword";
import { setOpenForgotPasswordModal } from "redux/slices/utils";
import TrackOrderSvg from "components/header/TrackOrderSvg";
import NextImage from "components/NextImage";
import ManageSearch from "./ManageSearch";
import trackImage from "./assets/fi_2726193.png"
import MessagesPanel from "./MessagesPanel";
import useGetCustomerNotifications from "api-manage/hooks/react-query/push-notifications/useGetCustomerNotifications";
import NotificationsPanel from "./NotificationsPanel";
import useMarkNotificationAsRead from "api-manage/hooks/react-query/push-notifications/useMarkNotificationAsRead";
import useMarkAllNotificationsAsRead from "api-manage/hooks/react-query/push-notifications/useMarkAllNotificationsAsRead";
import { PUSH_NOTIFICATION_EVENT } from "components/PushNotificationLayout";
import { useChatUnreadBadgeContext } from "contexts/ChatUnreadBadgeContext";
import { HEADER_SESSION_SYNC_EVENT } from "helper-functions/headerSessionSync";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";
const AuthModal = dynamic(() => import("components/auth/AuthModal"));

/** Dispatched after reorder adds items so the header can refetch cart; listeners open the cart drawer. */
export const REORDER_CART_REFRESH_EVENT = "gift-marketplace-cart-reorder-done";
export const OPEN_CART_DRAWER_EVENT = "gift-marketplace-open-cart-drawer";
export const OPEN_AUTH_MODAL_EVENT = "gift-marketplace-open-auth-modal";
/** Dispatched to open the chat drawer, optionally jumping to a conversation.
 *  Payload: CustomEvent detail = { conversationId?: string|number, senderType?: string }
 */
export const OPEN_CHAT_DRAWER_EVENT = "gift-marketplace-open-chat-drawer";

const Cart = ({ isLoading, cartListRefetch }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { cartList } = useSelector((state) => state.cart);
  useEffect(() => {
    const open = () => setSideDrawerOpen(true);
    window.addEventListener(OPEN_CART_DRAWER_EVENT, open);
    return () => window.removeEventListener(OPEN_CART_DRAWER_EVENT, open);
  }, []);
  useEffect(() => {
    if (sideDrawerOpen) {
      cartListRefetch?.();
    }
  }, [sideDrawerOpen, cartListRefetch]);
  const handleIconClick = () => {
    setSideDrawerOpen(true);
  };
  return (
    <>
      <NavBarIcon
        icon={<ShoppingCartOutlinedIcon size={20} />}
        label={t("Cart")}
        user="false"
        handleClick={handleIconClick}
        badgeCount={
          getCartListModuleWise(cartList)?.length > 0
            ? getCartListModuleWise(cartList).length
            : null // or use `0` if you want the badge to show as "0"
        }
      />
      {!!sideDrawerOpen && (
        <CardView
          isLoading={isLoading}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          cartList={cartList}
          refetch={cartListRefetch}
        />
      )}
    </>
  );
};

export const Taxi = ({ isLoading, label, color }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const { cartList } = useSelector((state) => state.cart);
  useEffect(() => {
    const open = () => setSideDrawerOpen(true);
    window.addEventListener(OPEN_CART_DRAWER_EVENT, open);
    return () => window.removeEventListener(OPEN_CART_DRAWER_EVENT, open);
  }, []);
  const handleIconClick = () => {
    setSideDrawerOpen(true);
  };

  return (
    <>
      <NavBarIcon
        icon={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DirectionsCarOutlinedIcon sx={{ fontSize: "20px", color: color || "inherit" }} />
            {label && (
              <Typography
                sx={{
                  color: (theme) => theme.palette.neutral[1000],
                }}
                variant="caption"
              >
                {label}
              </Typography>
            )}
          </Box>
        }
        user="false"
        handleClick={handleIconClick}
        badgeCount={
          getCartListModuleWise(cartList?.carts)?.length > 0
            ? getCartListModuleWise(cartList?.carts).length
            : null // or use `0` if you want the badge to show as "0"
        }
      />

      {!!sideDrawerOpen && (
        <TaxiView
          isLoading={isLoading}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          cartList={cartList}
        />
      )}
    </>
  );
};

const WishListSideBar = ({ totalWishList }) => {
  const [wishListSideDrawerOpen, setWishListSideDrawerOpen] = useState(false);
  const handleIconClick = () => {
    setWishListSideDrawerOpen(true);
  };
  return (
    <>
      <NavBarIcon
        id="wish-list-icon"
        icon={<FavoriteBorderIcon size={20} />}
        label={t("WishList")}
        user="false"
        handleClick={handleIconClick}
        badgeCount={totalWishList > 0 ? totalWishList : null}
      />

      {!!wishListSideDrawerOpen && (
        <WishListCardView
          sideDrawerOpen={wishListSideDrawerOpen}
          setSideDrawerOpen={setWishListSideDrawerOpen}
        />
      )}
    </>
  );
};

export const getSelectedVariations = (variations) => {
  let selectedItem = [];
  if (variations?.length > 0) {
    variations?.forEach((item, index) => {
      item?.values?.forEach((value, optionIndex) => {
        if (value?.isSelected) {
          const itemObj = {
            choiceIndex: index,
            isSelected: value?.isSelected,
            label: value?.label,
            optionIndex: optionIndex,
            optionPrice: value?.optionPrice,
            // type:item?.
          };
          selectedItem.push(itemObj);
        }
      });
    });
  }
  return selectedItem;
};
const getOtherModuleVariation = (itemVariations, selectedVariation) => {
  let selectedItem = [];
  itemVariations?.forEach((item) => {
    selectedVariation?.forEach((sVari) => {
      if (sVari?.type === item?.type) {
        selectedItem.push(item);
      }
    });
  });

  return selectedItem;
};
const SecondNavBar = ({ configData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartList } = useSelector((state) => state.cart);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
  const { countryCode, language } = useSelector((state) => state.configData);
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const { profileInfo } = useSelector((state) => state.profileInfo);
  useCustomerProfileSync();
  const [openPopover, setOpenPopover] = useState(false);
  const [moduleType, SetModuleType] = useState("");
  const { wishLists } = useSelector((state) => state.wishList);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatInitialConversationId, setChatInitialConversationId] = useState(null);
  const [chatInitialSenderType, setChatInitialSenderType] = useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("new");
  const chatUnreadCtx = useChatUnreadBadgeContext();
  const chatBadgeCount = chatUnreadCtx?.chatBadgeCount ?? null;
  const refetchChatChannelList = chatUnreadCtx?.refetchChannelList;
  const anchorRef = useRef(null);
  const [modalFor, setModalFor] = useState("sign-in");
  useEffect(() => {
    const openAuthModal = () => {
      setModalFor("sign-in");
      setOpenSignIn(true);
    };
    window.addEventListener(OPEN_AUTH_MODAL_EVENT, openAuthModal);
    return () => window.removeEventListener(OPEN_AUTH_MODAL_EVENT, openAuthModal);
  }, []);

  useEffect(() => {
    const openChatDrawer = (e) => {
      const detail = e?.detail || {};
      if (detail.conversationId) {
        setChatInitialConversationId(String(detail.conversationId));
        setChatInitialSenderType(detail.senderType || null);
      }
      setChatDrawerOpen(true);
    };
    window.addEventListener(OPEN_CHAT_DRAWER_EVENT, openChatDrawer);
    return () => window.removeEventListener(OPEN_CHAT_DRAWER_EVENT, openChatDrawer);
  }, []);
  const { openForgotPasswordModal } = useSelector((state) => state.utilsData);
  let token = undefined;
  let zoneId = undefined;
  let guestId = undefined;
  const currentModuleType = getCurrentModuleType();

  let totalWishList = undefined;
  if (currentModuleType === "rental") {
    totalWishList = wishLists?.vehicles?.length + wishLists?.providers?.length;
  } else {
    totalWishList = wishLists?.item?.length + wishLists?.store?.length;
  }

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const notificationStatus = notificationTab === "new" ? "unread" : "read";
  const { data: notifications = [], refetch: refetchNotifications } =
    useGetCustomerNotifications(token, notificationStatus);
  const { data: unreadNotifications = [], refetch: refetchUnreadNotifications } =
    useGetCustomerNotifications(token, "unread");
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllNotificationsAsRead, isLoading: markAllLoading } =
    useMarkAllNotificationsAsRead();

  if (typeof window !== "undefined") {
    guestId = localStorage.getItem("guest_id");
  }

  const {
    data: guestData,
    refetch: guestRefetch,
    isLoading: guestIsLoading,
  } = useGetGuest();

  useEffect(() => {
    const fetchGuestId = async () => {
      try {
        // Check if there is no guest ID in local storage
        if (!guestId) {
          // Trigger API call to get guest ID
          await guestRefetch();
        }
      } catch (error) {
        // Handle error (e.g., log it or show a notification)
        console.error("Error fetching guest ID:", error);
      }
    };

    // Call the function to fetch guest ID
    fetchGuestId();
  }, [guestId, guestRefetch]);

  useEffect(() => {
    // Update guestId when guestData is available
    if (guestData?.guest_id) {
      localStorage.setItem("guest_id", guestData.guest_id);
      guestId = guestData.guest_id;
    }
  }, [guestData]);

  const {
    data,
    refetch: cartListRefetch,
    isLoading,
  } = useGetAllCartList(guestId);

  const {
    data: bookingLists,
    isLoading: bookingListsIsLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(guestId);

  useEffect(() => {
    if (moduleType) {
      if (moduleType === "rental") {
        bookingRefetch();
      } else {
        cartListRefetch();
      }
    }
  }, [moduleType]);

  useEffect(() => {
    const syncCartAfterLogin = () => {
      if (!hasValidAuthToken(getToken())) return;
      if (moduleType === "rental") {
        bookingRefetch();
      } else if (moduleType) {
        cartListRefetch();
      }
    };
    window.addEventListener(HEADER_SESSION_SYNC_EVENT, syncCartAfterLogin);
    return () =>
      window.removeEventListener(HEADER_SESSION_SYNC_EVENT, syncCartAfterLogin);
  }, [moduleType, cartListRefetch, bookingRefetch]);

  const setItemIntoCart = () => {
    return mapApiCartRowsToReduxItems(getCartsFromResponse(data));
  };

  useEffect(() => {
    if (moduleType === "rental") {
      dispatch(setCartList(bookingLists));
      if (bookingLists?.carts?.length > 0) {
        cookie.set("cart-list", bookingLists?.carts?.length);
      }
    } else {
      dispatch(setCartMeta(getCartMetaFromResponse(data)));
      dispatch(setCartList(setItemIntoCart()));
    }
  }, [data, moduleType, bookingLists]);

  useEffect(() => {
    if (offlineInfoStep !== 0) {
      if (router.pathname !== "/checkout") {
        dispatch(clearOfflinePaymentInfo());
      }
    }
  }, []);

  useEffect(() => {
    SetModuleType(selectedModule?.module_type);
  }, [selectedModule]);

  useEffect(() => {
    const onReorderDone = async () => {
      if (moduleType === "rental") {
        await bookingRefetch();
      } else {
        await cartListRefetch();
      }
      window.dispatchEvent(new CustomEvent(OPEN_CART_DRAWER_EVENT));
    };
    window.addEventListener(REORDER_CART_REFRESH_EVENT, onReorderDone);
    return () =>
      window.removeEventListener(REORDER_CART_REFRESH_EVENT, onReorderDone);
  }, [moduleType, cartListRefetch, bookingRefetch]);

  useEffect(() => {
    const onPushNotification = () => {
      refetchNotifications();
      setTimeout(() => {
        refetchNotifications();
      }, 1200);
    };
    window.addEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
    return () => {
      window.removeEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
    };
  }, [refetchNotifications]);

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    zoneId = JSON.parse(localStorage.getItem("zoneid"));
  }

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };
  const handleWishlistClick = (pathName) => {
    if (pathName === "inbox") {
      refetchChatChannelList?.();
      setChatInitialConversationId(null);
      setChatInitialSenderType(null);
      setChatDrawerOpen(true);
      return;
    }
    router.push({
      pathname: "/profile",
      query: {
        page: pathName,
      },
    });
  };

  const handleTrackOrder = () => {
    router.push({
      pathname: "/track-order",
    });
  };
  const handleClose = () => {
    setModalFor("sign-in");
    setOpenSignIn(false);
  };
  const unreadNotificationsCount = unreadNotifications?.length;
  const notificationsBadgeCount =
    unreadNotificationsCount > 0 ? unreadNotificationsCount : null;
  const getNotificationData = (notification) => {
    const rawData = notification?.data;
    if (!rawData) return {};
    if (typeof rawData === "string") {
      try {
        return JSON.parse(rawData);
      } catch (_) {
        return {};
      }
    }
    return typeof rawData === "object" ? rawData : {};
  };
  const isMessageNotification = (notification) => {
    const data = getNotificationData(notification);
    const type = `${data?.type ?? notification?.type ?? notification?.notification_type ?? ""}`
      .toLowerCase()
      .trim();
    return type === "message" || type === "chat";
  };

  const handleNotificationClick = (notification) => {
    const data = getNotificationData(notification);
    const type = data?.type;
    const orderId = data?.order_id;
    const conversationId = data?.conversation_id;
    const senderType = data?.sender_type;
    setNotificationDrawerOpen(false);

    if (Number(notification?.status) === 1 && notification?.id) {
      markNotificationAsRead(notification?.id, {
        onSettled: () => {
          refetchNotifications();
          refetchUnreadNotifications();
        },
      });
    }

    if (type === "message" && conversationId) {
      refetchChatChannelList?.();
      router.push(
        {
          pathname: "/profile",
          query: {
            page: "inbox",
            conversationId: conversationId,
            type: senderType || "admin",
            chatFrom: "true",
          },
        },
        undefined,
        { shallow: true }
      );
      return;
    }
    if (type === "order_status" && orderId) {
      router.push(
        {
          pathname: "/profile",
          query: {
            page: "my-orders",
            orderId: orderId,
            from: "notification",
          },
        },
        undefined,
        { shallow: true }
      );
      return;
    }
    if (type === "add_fund") {
      handleWishlistClick("wallet");
      return;
    }
    router.push(
      {
        pathname: "/profile",
        query: {
          page: "profile-settings",
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const handleMarkAllNotificationsRead = () => {
    markAllNotificationsAsRead(undefined, {
      onSuccess: () => {
        setNotificationTab("read");
      },
      onSettled: () => {
        refetchNotifications();
        refetchUnreadNotifications();
      },
    });
  };

  const getDesktopScreenComponents = () => (
    <CustomStackFullWidth
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        marginLeft: "0 !important",
        width: "100%",
        gap: { lg: 2, xl: 3 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
          gap: { lg: 2, xl: 3 },
        }}
      >
        {!isSmall && (
          <Box
            onClick={() => router.push("/")}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              flexShrink: 0,
              borderRadius: "10px",
              pr: { lg: 2, xl: 2.5 },
              mr: { lg: 0.25, xl: 0.75 },
              borderRight: (th) =>
                `1px solid ${alpha(th.palette.divider, 0.75)}`,
              transition: "opacity 180ms ease",
              "&:hover": {
                opacity: 0.82,
              },
              "&:focus-visible": {
                outline: (th) =>
                  `2px solid ${alpha(th.palette.primary.main, 0.45)}`,
                outlineOffset: "3px",
              },
            }}
            aria-label={t("Go to landing page")}
          >
            <LogoSide
              width="128px"
              height="50px"
              configData={configData}
              objectFit="contain"
            />
          </Box>
        )}
        {!isSmall && (
          <NavLinks t={t} moduleType={moduleType} />
        )}
      </Stack>

      {!isSmall && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ lg: 1, xl: 2 }}
          sx={{
            flexShrink: 0,
            minWidth: "fit-content",
            gap: { lg: 0.25, xl: 0.5 },
          }}
        >
          {moduleType !== "rental" &&
            moduleType !== "parcel" && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: { lg: 240, xl: 280 },
                  maxWidth: { lg: 420, xl: 520 },
                  width: "100%",
                  mr: { lg: 0.5, xl: 1 },
                }}
              >
                <ManageSearch
                  zoneid={zoneId}
                  query={router.query}
                  searchQuery={
                    router.query?.data_type === "searched"
                      ? router.query.search
                      : ""
                  }
                />
              </Box>
            )}
          {!token && moduleType !== "parcel" && (
            <Tooltip
              title={moduleType !== "rental" ? t("Track order") : t("Track Trip")}
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: (theme) => theme.palette.toolTipColor,
                    "& .MuiTooltip-arrow": {
                      color: (theme) => theme.palette.toolTipColor,
                    },
                  },
                },
              }}
            >
              <IconButton
                onClick={handleTrackOrder}
                id="track-order-button"
                sx={{
                  height: "40px",
                  width: "40px",
                  padding: "8px",
                  color: "text.secondary",
                  border: (th) =>
                    `1px solid ${alpha(th.palette.divider, 0.8)}`,
                  backgroundColor: "background.paper",
                  transition:
                    "color 180ms ease, background-color 180ms ease, transform 180ms ease",
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: (th) =>
                      alpha(th.palette.primary.main, 0.06),
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <LocalShippingOutlinedIcon size={20} />
              </IconButton>
            </Tooltip>
          )}
          {token && moduleType !== "parcel" && (
            <NavBarIcon
              icon={<ChatBubbleOutlineIcon size={20} />}
              label={t("Chat")}
              user="false"
              handleClick={() => handleWishlistClick("inbox")}
              badgeCount={chatBadgeCount}
            />
          )}
          {token && (
            <NavBarIcon
              icon={<NotificationsIcon size={20} />}
              label={t("Notifications")}
              user="false"
              handleClick={() => setNotificationDrawerOpen(true)}
              badgeCount={notificationsBadgeCount}
            />
          )}
          {token && zoneId && moduleType !== "parcel" && (
            <WishListSideBar totalWishList={totalWishList} />
          )}

          {moduleType !== "parcel" &&
            moduleType !== "rental" && (
              <Cart isLoading={isLoading} cartListRefetch={cartListRefetch} />
            )}

          {moduleType === "rental" && <Taxi isLoading={isLoading} />}

          {token ? (
            <IconButton
              ref={anchorRef}
              onClick={() => handleOpenPopover()}
              sx={{
                padding: "5px",
                gap: "8px",
                borderRadius: "999px",
                border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.18)}`,
                backgroundColor: (th) => alpha(th.palette.primary.main, 0.04),
                "&:hover": {
                  backgroundColor: (th) => alpha(th.palette.primary.main, 0.1),
                },
              }}
            >
              {resolveImageSrc(profileInfo?.image_full_url) ||
              profileInfo?.image ? (
                <Avatar
                  alt={getUserDisplayName(profileInfo) || "user"}
                  sx={{ width: 34, height: 34 }}
                  src={
                    resolveImageSrc(profileInfo?.image_full_url) ??
                    profileInfo?.image ??
                    undefined
                  }
                />
              ) : (
                <Avatar
                  alt={getUserDisplayName(profileInfo) || "user"}
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 14,
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.15),
                    color: "primary.main",
                  }}
                >
                  {getUserInitials(profileInfo)}
                </Avatar>
              )}

              <Typography
                color={theme.palette.neutral[1000]}
                textTransform="capitalize"
                sx={{
                  maxWidth: { lg: 95, xl: 140 },
                  display: { lg: isTablet ? "none" : "block", xl: "block" },
                }}
                noWrap
              >
                {getUserDisplayName(profileInfo) || t("Profile")}
              </Typography>
            </IconButton>
          ) : (
            <Stack direction="row" gap="0.85rem" alignItems="center">

              <Stack justifyContent="flex-end" alignItems="flex-end">
                <SignInButton
                  onClick={() => setOpenSignIn(true)}
                  variant="contained"
                  id="header-sign-in-button"
                  sx={{
                    height: 38,
                    px: 1.6,
                  borderRadius: "10px",
                    boxShadow: (th) =>
                      `0px 8px 18px -10px ${alpha(th.palette.primary.main, 0.7)}`,
                  }}
                >
                  <CustomStackFullWidth
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                  >
                    <LockOutlinedIcon
                      size={16}
                      style={{
                        color: theme.palette.whiteContainer.main,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      color={theme.palette.whiteContainer.main}
                      fontSize="14px"
                      fontWeight={500}
                      lineHeight={1}
                    >
                      {t("Sign In")}
                    </Typography>
                  </CustomStackFullWidth>
                </SignInButton>
              </Stack>
            </Stack>
          )}
        </CustomStackFullWidth>
      )
      }
    </CustomStackFullWidth >
  );

  return (
    <CustomBoxFullWidth
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: {
          xs: "none",
          lg: (th) => `1px solid ${alpha(th.palette.divider, 0.8)}`,
        },
        boxShadow: {
          xs: "none",
          lg: "0 2px 8px rgba(15, 23, 42, 0.035)",
        },
        zIndex: 1251,
      }}
    >
      <NoSsr>
        <CustomContainer>
          <Toolbar
            disableGutters
            sx={{
              display: { xs: "none", lg: "flex" },
              minHeight: { xs: 56, sm: 60, lg: 68 },
              py: { xs: 0.4, lg: 0.65 },
            }}
          >
            {getDesktopScreenComponents()}
            <AccountPopover
              anchorEl={anchorRef.current}
              onClose={() => setOpenPopover(false)}
              open={openPopover}
              cartListRefetch={cartListRefetch}
            />
          </Toolbar>
        </CustomContainer>
        <AuthModal
          modalFor={modalFor}
          setModalFor={setModalFor}
          open={openSignIn}
          handleClose={handleClose}
        />
        {openForgotPasswordModal &&
          <CustomModal
            handleClose={() => dispatch(setOpenForgotPasswordModal(false))}
            openModal={openForgotPasswordModal}
          >
            <ForgotPassword configData={configData} />
          </CustomModal>
        }
        <MessagesPanel
          open={chatDrawerOpen}
          onClose={() => {
            setChatDrawerOpen(false);
            setChatInitialConversationId(null);
            setChatInitialSenderType(null);
          }}
          configData={configData}
          initialConversationId={chatInitialConversationId}
          initialSenderType={chatInitialSenderType}
        />
        <NotificationsPanel
          open={notificationDrawerOpen}
          onClose={() => setNotificationDrawerOpen(false)}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          activeTab={notificationTab}
          onTabChange={setNotificationTab}
          onMarkAllRead={handleMarkAllNotificationsRead}
          markAllLoading={markAllLoading}
        />

      </NoSsr>
    </CustomBoxFullWidth>
  );
};

export default SecondNavBar;
