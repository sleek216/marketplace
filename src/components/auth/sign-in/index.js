import { alpha, IconButton, NoSsr, styled, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import { t } from "i18next";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";
import SignInForm from "./SignInForm";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";

import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";

import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCartList, setCartMeta } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import { setWishList } from "redux/slices/wishList";
import {
  checkInput,
  formatPhoneNumber,
  handleProductValueWithOutDiscount,
} from "utils/CustomFunctions";
import {
  loginSuccessFull,
  moduleSelected,
  SigninSuccessFull,
} from "utils/toasterMessages";
import useGetAllCartList from "../../../api-manage/hooks/react-query/add-cart/useGetAllCartList";
import useGetProfile from "../../../api-manage/hooks/react-query/profile/useGetProfile";
import { getSelectedVariations } from "../../header/second-navbar/SecondNavbar";
import {
  getCartMetaFromResponse,
  getCartsFromResponse,
  mapApiCartRowsToReduxItems,
} from "helper-functions/normalizeCartListResponse";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AuthHeader from "../AuthHeader";
import OtpForm from "../sign-up/OtpForm";
import SocialLogins from "./social-login/SocialLogins";
import {
  ACTIONS,
  loginInitialState,
  loginReducer,
} from "components/auth/state";
import {
  getActiveLoginStatus,
  getLoginUserCheck,
} from "components/auth/sign-in/loginHepler";
import OtpLogin from "components/auth/sign-in/OtpLogin";
import * as Yup from "yup";

import CloseIcon from "@mui/icons-material/Close";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import { useGetWishList } from "api-manage/hooks/react-query/rental-wishlist/useGetWishlist";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import { setOpenForgotPasswordModal } from "redux/slices/utils";
import useMergeRecentlyViewed from "api-manage/hooks/react-query/recently-viewed/useMergeRecentlyViewed";
import { notifyHeaderSessionSync } from "helper-functions/headerSessionSync";
import { useQueryClient } from "react-query";

const SignIn = ({
  modalFor,
  configData,
  setModalFor,
  setLoginInfo,
  setJwtToken,
  setUserInfo,
  handleSuccess,
  setMedium,
  zoneid,
  loginMutation,
  loginIsLoading,
  verificationId,
  sendOTP,
  handleClose,
}) => {
  const router = useRouter();
  const previousRouteName = router.query.from;
  const { openForgotPasswordModal } = useSelector((state) => state.utilsData);
  const guestId = getGuestId();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [loginValue, setLoginValue] = useState(null);
  const [otpData, setOtpData] = useState({ type: "" });
  const [mainToken, setMainToken] = useState(null);
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const theme = useTheme();

  const [state, loginDispatch] = useReducer(loginReducer, loginInitialState);
  let userDatafor = undefined;
  const moduleType = getCurrentModuleType();
  if (typeof window !== "undefined") {
    userDatafor = JSON.parse(localStorage.getItem("userDatafor"));
  }

  const loginFormik = useFormik({
    initialValues: {
      email_or_phone: userDatafor?.email_or_phone || "",
      password: userDatafor ? userDatafor.password : "",
      tandc: false,
    },
    validationSchema: Yup.object({
      email_or_phone: Yup.string()
        .required(t("Email or phone number is required"))
        .test(
          "email-or-phone",
          t("Must be a valid email or phone number"),
          function (value) {
            // Regular expressions for validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format for phone numbers

            // Check if value matches either email or phone regex
            return emailRegex.test(value) || phoneRegex.test(value);
          }
        ),
      password: Yup.string()
        .min(6, t("Password is too short - should be 6 chars minimum."))
        .required(t("Password is required")),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (isRemember) {
          localStorage.setItem("userDatafor", JSON.stringify(values));
        }
        formSubmitHandler({ ...values, login_type: "manual" });
      } catch (err) {}
    },
  });

  const cartListSuccessHandler = (res) => {
    if (res) {
      dispatch(setCartMeta(getCartMetaFromResponse(res)));
      dispatch(setCartList(mapApiCartRowsToReduxItems(getCartsFromResponse(res))));
    }
  };

  const {
    data,
    refetch: cartListRefetch,
    isLoading,
  } = useGetAllCartList(guestId, cartListSuccessHandler);

  const bookingSuccess = (res) => {
    dispatch(setCartList(res));
  };
  const {
    data: bookingLists,
    isLoading: bookingListsIsLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(getGuestId(), bookingSuccess);
  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
  };

  let location = undefined;
  let isModuleSelected = undefined;
  let lanDirection = undefined;
  let languageSetting;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
    isModuleSelected = JSON.parse(localStorage.getItem("module"));
    lanDirection = JSON.parse(localStorage.getItem("settings"));
    languageSetting = JSON.parse(localStorage.getItem("language-setting"));
  }

  const handleOnChange = (value) => {
    if (typeof value !== "string") return;

    const normalizedValue = value.trim();
    // Keep empty input empty; do not auto-insert phone prefix on blur.
    if (!normalizedValue) {
      loginFormik.setFieldValue("email_or_phone", "");
      return;
    }

    // Email input: preserve as-is, but strip accidental leading + prefix.
    if (value.includes("@")) {
      const cleanedValue = value.startsWith("+")
        ? value.replace(/^\+/, "")
        : value;
      loginFormik.setFieldValue("email_or_phone", cleanedValue);
      return;
    }

    // Only format as phone when the value is phone-like (digits, optional +).
    const isPhoneLike = /^\+?[\d\s\-().]+$/.test(value);
    if (isPhoneLike) {
      loginFormik.setFieldValue("email_or_phone", formatPhoneNumber(value));
      return;
    }

    // Partial email or other text — keep raw, strip any accidental leading +.
    loginFormik.setFieldValue(
      "email_or_phone",
      value.replace(/^\+/, "")
    );
  };
  const passwordHandler = (value) => {
    loginFormik.setFieldValue("password", value);
  };

  useEffect(() => {
    if (otpData?.type !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);
  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
    setIsApiCalling(false);
  };

  const { refetch: profileRefetch } = useGetProfile(userOnSuccessHandler);
  const { refetch: wishlistRefetch } = useWishListGet(onSuccessHandler);
  const { refetch: rentalWishlistRefetch } = useGetWishList(onSuccessHandler);
  const { mutateAsync: mergeRecentlyViewed } = useMergeRecentlyViewed();

  const handleTokenAfterSignIn = async (response) => {
    if (response) {
      const token = response?.token;
      if (!token) {
        toast.error(t("Could not complete sign-in. Please try again."));
        return;
      }
      localStorage.setItem("token", token);
      notifyHeaderSessionSync();
      handleClose();

      // Clear stale cart cache
      queryClient.removeQueries({ queryKey: ["cart-itemss"], exact: false });

      // Fire ALL post-login fetches in PARALLEL for maximum speed
      const [cartData] = await Promise.allSettled([
        cartListRefetch(),
        profileRefetch(),
        mergeRecentlyViewed().catch(() => {}),
        moduleType === "rental"
          ? Promise.all([bookingRefetch(), rentalWishlistRefetch()])
          : wishlistRefetch(),
      ]);

      // Sync cart to Redux immediately
      if (cartData?.status === "fulfilled" && cartData?.value?.data) {
        dispatch(setCartMeta(getCartMetaFromResponse(cartData.value.data)));
        dispatch(
          setCartList(
            mapApiCartRowsToReduxItems(getCartsFromResponse(cartData.value.data))
          )
        );
      }

      toast.success(t(loginSuccessFull));

      if (router.pathname === "/forgot-password") {
        router.push("/home");
      }
    }
  };

  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t(moduleSelected));
      if (previousRouteName) {
        router.push("/home");
      } else {
        router.back();
      }
    }
    setOpenModuleSelection(false);
  };

  const formSubmitHandler = (values) => {
    const numberOrEmail = checkInput(values?.email_or_phone);
    let newValues = {};
    if (values?.login_type === "otp") {
      newValues = {
        ...values,
        type: "phone",
        guest_id: guestId,
      };
    } else {
      newValues = {
        ...values,
        guest_id: guestId,
        field_type: numberOrEmail,
        type: numberOrEmail,
      };
    }
    setLoginValue(newValues);
    loginMutation(newValues, {
      onSuccess: async (response) => {
        if (response?.is_personal_info === 0) {
          handleLoginInfo(response, {
            phone: newValues.email_or_phone,
          });
        } else {
          getLoginUserCheck(
            response,
            newValues,
            handleTokenAfterSignIn,
            setOtpData,
            setMainToken,
            sendOTP,
            configData
          );
        }
      },
      onError: onErrorResponse,
    });
  };

  const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifyApi } =
    useVerifyPhone();
  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();

  const handleLoginInfo = (res, values) => {
    // Common logic to set login info based on response
    setLoginInfo({
      ...res,
      phone: values.phone,
      otp: values?.reset_token,
    });

    // Determine which modal to show based on the response
    if (res?.is_personal_info === 0) {
      setModalFor("user_info");
    } else if (res?.is_exist_user !== null) {
      setModalFor("is_exist_user");
    } else {
      setOpenOtpModal(false);
      handleClose();
      handleTokenAfterSignIn(res).then();
      //handleClose();
    }
  };
  const otpFormSubmitHandler = (values) => {
    if (configData?.firebase_otp_verification === 1) {
      const temValue = {
        session_info: verificationId,
        phone: values.phone,
        otp: values.reset_token,
        login_type: "otp",
        guest_id: getGuestId(),
      };
      fireBaseOtpMutation(temValue, {
        onSuccess: (res) => {
          if (res) {
            handleLoginInfo(res, values);
          }
        },
        onError: onErrorResponse,
      });
    } else {
      let tempValues = {
        phone: values.phone,
        otp: values.reset_token,
        login_type: otpData?.login_type,
        verification_type: otpData?.verification_type,
        guest_id: getGuestId(),
      };
      const onSuccessHandler = (res) => {
        if (res) {
          handleLoginInfo(res, values);
        }
      };

      otpVerifyMutate(tempValues, {
        onSuccess: onSuccessHandler,
        onError: onSingleErrorResponse,
      });
    }
  };

  const rememberMeHandleChange = (e) => {
    setIsRemember(e.target.checked)
  }
  useEffect(() => {
    let userDatafor = undefined
    if (typeof window !== 'undefined') {
      userDatafor = JSON.parse(localStorage.getItem('userDatafor'))
    }
    if(userDatafor){
      setIsRemember(true)
    }
  }, [])
  const { centralize_login } = configData || {};
  const getActiveLoginType = () => {

    if (centralize_login) {
      const { otp_login_status, manual_login_status, social_login_status } =
        centralize_login;

      loginDispatch({
        type: ACTIONS.setActiveLoginType,
        payload: {
          otp: otp_login_status === 1,
          manual: manual_login_status === 1,
          social: social_login_status === 1,
        },
      });
    }
  }
const onlyOtp=centralize_login?.otp_login_status && !centralize_login?.manual_login_status && !centralize_login?.social_login_status

  useEffect(() => {
    getActiveLoginType()
  }, []);

  useEffect(() => {
    getActiveLoginStatus(state, loginDispatch);
  }, [state.activeLoginType]);

  const otpLoginFormik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required(t("Please give a phone number"))
        .min(10, "Number must be 10 digits"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler({ ...values, login_type: "otp" });
      } catch (err) {}
    },
  });
  const otpHandleChange = (value) => {
    otpLoginFormik.setFieldValue("phone", `+${value}`);
  };
  const handleClick = () => {
    window.open("/terms-and-conditions");
  };
  const selectedOtp = () => {
    loginDispatch({
      type: ACTIONS.setActiveLoginType,
      payload: {
        otp: true,
        manual: false,
        social: false,
      },
    });
  };

  const handleSignUp = () => {
    setModalFor("sign-up");
  };


  const handleFormBasedOnDirection = () => {
    const commonSignInFormProps = {
      isApiCalling,
      configData,
      handleOnChange,
      passwordHandler,
      loginFormik,
      lanDirection: lanDirection?.direction,
      rememberMeHandleChange,
      isLoading: loginIsLoading,
      handleClick,
      handleClose,
      isRemember,
    };

    const commonSocialLoginsProps = {
      socialLogin: configData?.social_login,
      configData,
      state,
      setJwtToken,
      setUserInfo,
      handleSuccess,
      setModalFor,
      setMedium,
      loginMutation,
      setLoginInfo,
    };

    const orSeparator = (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          my: 0.5,
        }}
      >
        <Box sx={{ flex: 1, height: "1px", backgroundColor: (t) => alpha(t.palette.neutral[400], 0.3) }} />
        <Typography
          fontSize="12px"
          fontWeight={500}
          color="text.disabled"
          sx={{ whiteSpace: "nowrap", px: "4px" }}
        >
          {t("Or")}
        </Typography>
        <Box sx={{ flex: 1, height: "1px", backgroundColor: (t) => alpha(t.palette.neutral[400], 0.3) }} />
      </Box>
    );

    const otpOption = (
      <Typography
        component="span"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        color={theme.palette.neutral[400]}
      >
        {t("Sign in with")}
        <Typography
          onClick={selectedOtp}
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          component="span"
          color={theme.palette.primary.main}
          ml="10px"
        >
          {t("OTP")}
        </Typography>
      </Typography>
    );

    const signUpFooter = (
      <CustomStackFullWidth
        alignItems="center"
        spacing={0.5}
        sx={{ paddingTop: "10px !important" }}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={0.5}
        >
          <CustomTypography fontSize="14px">
            {t("Don't have an account?")}
          </CustomTypography>
          <span
            onClick={handleSignUp}
            style={{
              color: theme.palette.primary.main,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
          {t("Sign Up")}
        </span>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );

    const socialLoginSection = (
      <Stack width="100%" alignItems="center" spacing={1}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, height: "1px", backgroundColor: (t) => alpha(t.palette.neutral[400], 0.3) }} />
          <Typography
            fontSize="12px"
            fontWeight={500}
            color="text.disabled"
            sx={{ whiteSpace: "nowrap", px: "4px" }}
          >
            {t("or continue with")}
          </Typography>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: (t) => alpha(t.palette.neutral[400], 0.3) }} />
        </Box>
        <SocialLogins {...commonSocialLoginsProps} />
      </Stack>
    );

    if(state?.status && state?.activeLoginType){
      switch (state.status) {
        case "otp":
          return (
            <OtpLogin
              otpHandleChange={otpHandleChange}
              otpLoginFormik={otpLoginFormik}
              configData={configData}
              isLoading={loginIsLoading}
              handleClick={handleClick}
              rememberMeHandleChange={rememberMeHandleChange}
              handleClose={handleClose}
              isRemember={isRemember}
              getActiveLoginType={getActiveLoginType}
              onlyOtp={onlyOtp}
            />
          );

        case "manual":
          return (
            <Stack width="100%">
              <SignInForm {...commonSignInFormProps} only handleSignUp={handleSignUp} />
              
            </Stack>
          );

        case "social":
          return <SocialLogins {...commonSocialLoginsProps} />;

        case "otp_manual":
          return (
            <Stack width="100%" gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              {orSeparator}
              {otpOption}
              {signUpFooter}
            </Stack>
          );

        case "otp_social":
          return (
            <>
              <OtpLogin
                otpHandleChange={otpHandleChange}
                otpLoginFormik={otpLoginFormik}
                configData={configData}
                isLoading={loginIsLoading}
                handleClick={handleClick}
                rememberMeHandleChange={rememberMeHandleChange}
                isRemember={isRemember}
                getActiveLoginType={getActiveLoginType}
                onlyOtp={onlyOtp}
              />
              {socialLoginSection}
            </>
          );

        case "manual_social":
          return (
            <CustomStackFullWidth gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              {socialLoginSection}
              {signUpFooter}
            </CustomStackFullWidth>
          );

        case "all":
          return (
            <CustomStackFullWidth gap="1rem">
              <SignInForm {...commonSignInFormProps} />
              <Stack gap="10px">
                {orSeparator}
                {otpOption}
              </Stack>
              <SocialLogins {...commonSocialLoginsProps} />
              {signUpFooter}
            </CustomStackFullWidth>
          );

        default:
          return null;
      }
    }
  };
  return (
    <>
      <NoSsr>
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              maxWidth: "450px",
              minWidth: { xs: "300px", md: "420px" },
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              maxHeight: "min(90vh, calc(100dvh - 32px))",
              width: "100%",
              alignSelf: "center",
            }}
          >
            {/* ── Gradient Header ─────────────────────────────── */}
            <Box
              sx={{
                background: (t) =>
                  `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${alpha(t.palette.primary.dark || t.palette.primary.main, 0.85)} 100%)`,
                px: 3,
                pt: 3,
                pb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Close button */}
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.35)" },
                }}
              >
                <CloseIcon sx={{ fontSize: "16px" }} />
              </IconButton>

              {/* Logo */}
              {configData?.logo_full_url && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    px: "14px",
                    py: "8px",
                    mb: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    maxWidth: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={configData?.logo_full_url}
                    alt={configData?.business_name || "Logo"}
                    sx={{
                      height: "36px",
                      maxWidth: "130px",
                      objectFit: "contain",
                    }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </Box>
              )}

              {/* Welcome text */}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#fff", letterSpacing: "0.3px" }}
              >
                Welcome Back 👋
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: "4px", textAlign: "center" }}
              >
                Sign in to your account to continue
              </Typography>

              {/* Decorative wave bottom */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: "22px",
                  backgroundColor: (t) => t.palette.background.paper,
                  borderTopLeftRadius: "50% 100%",
                  borderTopRightRadius: "50% 100%",
                }}
              />
            </Box>

            {/* ── Form Section (scrolls only when content exceeds viewport) ── */}
            <Box
              sx={{
                backgroundColor: (t) => t.palette.background.paper,
                px: { xs: "24px", md: "36px" },
                pt: 1,
                pb: "28px",
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <CustomStackFullWidth spacing={2}>
                {handleFormBasedOnDirection()}
              </CustomStackFullWidth>
            </Box>
          </Box>
        </CustomStackFullWidth>
      </NoSsr>
      {openModuleSelection && (
        <ModuleSelection
          location={location}
          closeModal={handleCloseModuleModal}
          disableAutoFocus
        />
      )}
      <CustomModal
        handleClose={() => setOpenOtpModal(false)}
        openModal={openOtpModal}
      >
        <OtpForm
          data={otpData?.type ? otpData?.type : loginFormik?.values?.phone}
          formSubmitHandler={otpFormSubmitHandler}
          isLoading={isLoadingOtpVerifyApi || fireIsLoading}
          recaptcha="recaptcha-container"
          loginValue={loginValue}
          reSendOtp={formSubmitHandler}
          handleClose={() => setOpenOtpModal(false)}
        />
      </CustomModal>
      
    </>
  );
};

export default SignIn;
