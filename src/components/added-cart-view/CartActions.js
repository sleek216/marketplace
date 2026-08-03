import React, { useState } from "react";
import { PrimaryButton } from "../Map/map.style";
import { Stack } from "@mui/system";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getStoreMinimumOrderAmount } from "utils/CustomFunctions";
import MinimumOrderNotice from "components/checkout/item-checkout/MinimumOrderNotice";
import { setClearCart } from "redux/slices/cart";
import GuestCheckoutModal from "../cards/GuestCheckoutModal";
import dynamic from "next/dynamic";
const AuthModal = dynamic(() => import("components/auth/AuthModal"));
const CartActions = (props) => {
  const {
    setSideDrawerOpen,
    cartList,
    text,
    selectedCartIds = [],
    minimumOrderBlocked,
    storeData,
    cartSubtotal,
    selectedCartList = [],
  } = props;
  const { configData } = useSelector((state) => state.configData);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const selectedCount = selectedCartIds?.length || 0;

  const showMinimumOrderToast = () => {
    const minimum = getStoreMinimumOrderAmount(storeData);
    const current = cartSubtotal ?? 0;
    toast.error(
      t(
        "This store accepts orders of {{minimum}} or more. Your item total is {{current}} — add {{remaining}} more to continue.",
        {
          minimum: getAmountWithSign(minimum),
          current: getAmountWithSign(current),
          remaining: getAmountWithSign(Math.max(0, minimum - current)),
        }
      ),
      { duration: 5000 }
    );
  };

  const handleRoute = () => {
    if (minimumOrderBlocked) {
      showMinimumOrderToast();
      return;
    }
    const checkoutQuery =
      selectedCount > 0
        ? `/checkout?page=cart&selected_cart_ids=${selectedCartIds.join(",")}`
        : "/checkout?page=cart";
    router.push(checkoutQuery, undefined, { shallow: true }).then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };
  const handleCheckout = () => {
    if (minimumOrderBlocked) {
      showMinimumOrderToast();
      return;
    }
    if (
      cartList?.length > 0 &&
      !token &&
      configData?.guest_checkout_status === 1
    ) {
      setOpen(true);
    } else if (cartList?.length > 0 && token) {
      const checkoutQuery =
        selectedCount > 0
          ? `/checkout?page=cart&selected_cart_ids=${selectedCartIds.join(",")}`
          : "/checkout?page=cart";
      router.push(checkoutQuery, undefined, { shallow: true }).then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      setSideDrawerOpen(false);
    } else {
      if (cartList?.length === 0) {
        setSideDrawerOpen(false);
        router.push("/home", undefined, { shallow: true }).then(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        setOpenAuth(true);
      }
    }
  };


  return (
    <Stack width="100%" spacing={1.25} sx={{ px: 1.75, pb: 1.75, pt: 0.5 }}>
      {minimumOrderBlocked && (
        <MinimumOrderNotice
          cartList={selectedCartList}
          storeData={storeData}
          subtotal={cartSubtotal}
          disableCollapse
        />
      )}
      <PrimaryButton
        onClick={handleCheckout}
        variant="contained"
        size="large"
        fullWidth
        sx={{
          borderRadius: "2px",
          height: 48,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "15px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
        disabled={
          (cartList?.length > 0 && selectedCount === 0) || minimumOrderBlocked
        }
      >
        {text ? (
          text
        ) : (
          <>
            {cartList?.length > 0
              ? t("Proceed To Checkout")
              : t("Continue Shopping")}
          </>
        )}
      </PrimaryButton>
      {open && (
        <GuestCheckoutModal
          open={open}
          setOpen={setOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          handleRoute={handleRoute}
          setModalFor={setModalFor}
          setOpenAuth={setOpenAuth}
        />
      )}
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={openAuth}
        handleClose={() => setOpenAuth(false)}
      />
    </Stack>
  );
};

CartActions.propTypes = {};

export default CartActions;
