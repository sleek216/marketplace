import { Box } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import SignUpForm from "./SignUpForm";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useSignUp } from "api-manage/hooks/react-query/auth/useSignUp";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import useGetProfile from "api-manage/hooks/react-query/profile/useGetProfile";
import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "redux/slices/profileInfo";
import { setWelcomeModal } from "redux/slices/utils";
import { signup_successfull } from "utils/toasterMessages";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AcceptTermsAndConditions from "../AcceptTermsAndConditions";
import OtpForm from "./OtpForm";
import SignUpValidation from "./SignUpValidation";
import { getLoginUserCheck } from "components/auth/sign-in/loginHepler";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useMergeRecentlyViewed from "api-manage/hooks/react-query/recently-viewed/useMergeRecentlyViewed";
import { notifyHeaderSessionSync } from "helper-functions/headerSessionSync";
import { useQueryClient } from "react-query";
import useGetAllCartList from "api-manage/hooks/react-query/add-cart/useGetAllCartList";
import {
  getCartMetaFromResponse,
  getCartsFromResponse,
  mapApiCartRowsToReduxItems,
} from "helper-functions/normalizeCartListResponse";
import { setCartList, setCartMeta } from "redux/slices/cart";

const SignUp = ({
  configData,
  setModalFor,
  sendOTP,
  handleClose,
  loginMutation,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [openModuleSelection, setOpenModuleSelection] = useState(false);
  const theme = useTheme();
  const [otpData, setOtpData] = useState({ type: "" });
  const [mainToken, setMainToken] = useState(null);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [loginValue, setLoginValue] = useState(null);
  // Tracks credentials from last failed attempt to detect the partial-save loop
  const [lastFailedCredentials, setLastFailedCredentials] = useState(null);
  const [partialSaveDetected, setPartialSaveDetected] = useState(false);
  const guestId = getGuestId();
  const { mutateAsync: mergeRecentlyViewed } = useMergeRecentlyViewed();

  const signUpFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      ref_code: "",
      tandc: false,
    },
    validationSchema: SignUpValidation(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitHandler(values);
      } catch (err) { }
    },
  });
  const handleCloseOtp = () => {
    setOpenOtpModal(false);
  };

  const fNameHandler = (value) => {
    signUpFormik.setFieldValue("name", value);
    if (signUpFormik.errors.name) {
      signUpFormik.setFieldError("name", "");
    }
  };
  const lNameHandler = (value) => {
    signUpFormik.setFieldValue("l_name", value);
  };
  const emailHandler = (value) => {
    signUpFormik.setFieldValue("email", value);
    if (signUpFormik.errors.email) signUpFormik.setFieldError("email", "");
    // Reset loop detection when user changes email
    if (partialSaveDetected) setPartialSaveDetected(false);
  };
  const handleOnChange = (value) => {
    const normalizedPhone = `${value ?? ""}`.replace(/\D/g, "");
    signUpFormik.setFieldValue(
      "phone",
      normalizedPhone ? `+${normalizedPhone}` : ""
    );
    if (signUpFormik.errors.phone) signUpFormik.setFieldError("phone", "");
    // Reset loop detection when user changes phone
    if (partialSaveDetected) setPartialSaveDetected(false);
  };
  const passwordHandler = (value) => {
    signUpFormik.setFieldValue("password", value);
    if (signUpFormik.errors.password) {
      signUpFormik.setFieldError("password", "");
    }
  };
  const confirmPasswordHandler = (value) => {
    signUpFormik.setFieldValue("confirm_password", value);
    if (signUpFormik.errors.confirm_password) {
      signUpFormik.setFieldError("confirm_password", "");
    }
  };
  const handleCheckbox = (e) => {
    signUpFormik.setFieldValue("tandc", e.target.checked);
  };
  const ReferCodeHandler = (value) => {
    signUpFormik.setFieldValue("ref_code", value);
    if (signUpFormik.errors.ref_code) {
      signUpFormik.setFieldError("ref_code", "");
    }
  };

  const getReferralCodeErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return "";

    if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
      const refCodeErrors = data.errors?.ref_code;
      if (Array.isArray(refCodeErrors) && refCodeErrors.length > 0) {
        return refCodeErrors[0];
      }
      if (typeof refCodeErrors === "string") {
        return refCodeErrors;
      }
    }

    if (Array.isArray(data?.errors)) {
      const referralError = data.errors.find((item) => {
        const field = `${item?.field ?? item?.code ?? ""}`.toLowerCase();
        const message = `${item?.message ?? ""}`.toLowerCase();
        return field.includes("ref") || message.includes("ref");
      });
      if (referralError?.message) return referralError.message;
    }

    const fallbackMessage = `${data?.message ?? ""}`.toLowerCase();
    if (fallbackMessage.includes("ref")) {
      return data?.message;
    }

    return "";
  };

  const normalizeErrorKey = (key = "") => {
    const normalized = `${key}`.trim().toLowerCase();
    if (["name", "f_name", "first_name", "full_name", "username", "user_name"].includes(normalized)) {
      return "name";
    }
    if (["email", "email_or_phone", "mail"].includes(normalized)) {
      return "email";
    }
    if (["phone", "phone_number", "mobile", "mobile_number"].includes(normalized)) {
      return "phone";
    }
    if (["password"].includes(normalized)) {
      return "password";
    }
    if (["confirm_password", "password_confirmation"].includes(normalized)) {
      return "confirm_password";
    }
    if (["ref_code", "referral_code", "referral", "refer_code"].includes(normalized)) {
      return "ref_code";
    }
    return "";
  };

  const extractFieldErrorsFromResponse = (error) => {
    const data = error?.response?.data;
    if (!data) return {};

    const fieldErrors = {};
    const pushFieldError = (fieldKey, message) => {
      if (!fieldKey || !message || fieldErrors[fieldKey]) return;
      fieldErrors[fieldKey] = message;
    };

    if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
      Object.entries(data.errors).forEach(([key, messages]) => {
        const formikKey = normalizeErrorKey(key);
        const message = Array.isArray(messages) ? messages[0] : messages;
        if (formikKey && typeof message === "string") {
          pushFieldError(formikKey, message);
        }
      });
    }

    if (Array.isArray(data?.errors)) {
      data.errors.forEach((item) => {
        const formikKey = normalizeErrorKey(item?.field || item?.code || "");
        const message = item?.message;
        if (formikKey && typeof message === "string") {
          pushFieldError(formikKey, message);
        }
      });
    }

    const fallbackMessage = `${data?.message ?? ""}`.toLowerCase();
    if (fallbackMessage.includes("email") && fallbackMessage.includes("taken")) {
      pushFieldError("email", data?.message);
    }
    if (
      (fallbackMessage.includes("phone") || fallbackMessage.includes("mobile")) &&
      fallbackMessage.includes("taken")
    ) {
      pushFieldError("phone", data?.message);
    }
    if (fallbackMessage.includes("ref") && fallbackMessage.includes("invalid")) {
      pushFieldError("ref_code", data?.message);
    }

    return fieldErrors;
  };

  let location = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
  }
  useEffect(() => {
    if (otpData?.type !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);

  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
    //handleClose()
  };
  const cartListSuccessHandler = (res) => {
    if (res) {
      dispatch(setCartMeta(getCartMetaFromResponse(res)));
      dispatch(setCartList(mapApiCartRowsToReduxItems(getCartsFromResponse(res))));
    }
  };
  const { refetch: cartListRefetch } = useGetAllCartList(getGuestId(), cartListSuccessHandler);
  const { data: userData, refetch: profileRefetch } =
    useGetProfile(userOnSuccessHandler);
  const handleTokenAfterSignUp = async (response) => {
    if (response) {
      const token = response?.token ?? response?.data?.token;
      if (!token) {
        toast.error(t("Could not complete sign-in. Please try again."));
        return;
      }
      localStorage.setItem("token", token);
      notifyHeaderSessionSync();

      // Clear stale cart cache
      queryClient.removeQueries({ queryKey: ["cart-itemss"], exact: false });

      // Fire ALL post-signup fetches in PARALLEL for maximum speed
      const [cartData] = await Promise.allSettled([
        cartListRefetch(),
        profileRefetch(),
        mergeRecentlyViewed().catch(() => {}),
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

      toast.success(t(signup_successfull));
      dispatch(setWelcomeModal(true));
      const zoneSelected = JSON.parse(localStorage.getItem("zoneid"));
      if (zoneSelected && getCurrentModuleType()) {
        if (getCurrentModuleType() !== "parcel" && getCurrentModuleType() !== "rental") {
          router.push("/interest", undefined, { shallow: true });
        } else {
          router.push("/home", undefined, { shallow: true });
        }
      } else {
        router.push("/home", undefined, { shallow: true });
      }
      handleClose();
    }
  };

  const handleCloseModuleModal = (item) => {
    if (item) {
      toast.success(t("A Module has been selected."));
      if (signUpFormik.values.ref_code) {
        setSelectedModule(item);
        dispatch(setWelcomeModal(true));
      }

      if (item.module_type !== "parcel" && item?.module_type !== "rental") {
        router.push("/interest", undefined, { shallow: true });
      } else {
        //router.push("/home", undefined, { shallow: true });
      }
    }

    setOpenModuleSelection(false);
  };


  const { mutate, isLoading, error } = useSignUp();
  const formSubmitHandler = (values) => {
    signUpFormik.setErrors({});
    const signUpData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      confirm_password: values.confirm_password,
      ref_code: values.ref_code,
      guest_id: values?.guest_id ?? getGuestId(),
      login_type: "manual",
    };
    setLoginValue(signUpData);
    mutate(signUpData, {
      onSuccess: async (response) => {
        getLoginUserCheck(
          response,
          signUpData,
          handleTokenAfterSignUp,
          setOtpData,
          setMainToken,
          sendOTP,
          configData
        );
      },
      onError: (error) => {
        onErrorResponse(error);
        const fieldErrors = extractFieldErrorsFromResponse(error);
        const referralError = getReferralCodeErrorMessage(error);
        if (referralError && !fieldErrors.ref_code) {
          fieldErrors.ref_code = referralError;
        }

        // ── Partial-save loop detection ─────────────────────────────────
        // Backend bug: it saves email/phone before validating referral, so
        // the next attempt gets "already taken" for the same credentials.
        // We detect this by checking if current "taken" errors are for the
        // same email/phone that failed with a different error previously.
        const isTaken = (msg) => {
          const m = `${msg ?? ""}`.toLowerCase();
          return m.includes("taken") || m.includes("already");
        };
        const emailTaken = isTaken(fieldErrors.email);
        const phoneTaken = isTaken(fieldErrors.phone);

        if ((emailTaken || phoneTaken) && lastFailedCredentials) {
          const sameEmail =
            !emailTaken ||
            lastFailedCredentials.email === signUpFormik.values.email;
          const samePhone =
            !phoneTaken ||
            lastFailedCredentials.phone === signUpFormik.values.phone;

          if (sameEmail && samePhone) {
            // Loop confirmed — suppress misleading field errors and show banner
            setPartialSaveDetected(true);
            delete fieldErrors.email;
            delete fieldErrors.phone;
          }
        }

        // Store credentials when failure is NOT an "already taken" error,
        // so we can detect the loop on the very next submit.
        if (!emailTaken && !phoneTaken) {
          setLastFailedCredentials({
            email: signUpFormik.values.email,
            phone: signUpFormik.values.phone,
          });
        }
        // ────────────────────────────────────────────────────────────────

        if (Object.keys(fieldErrors).length > 0) {
          signUpFormik.setErrors(fieldErrors);
          const touchedUpdates = {};
          Object.keys(fieldErrors).forEach((field) => {
            touchedUpdates[field] = true;
          });
          signUpFormik.setTouched({ ...signUpFormik.touched, ...touchedUpdates }, false);
        }
      },
    });
  };

  const reSendOtp = () => {
    const values = {
      email_or_phone: signUpFormik?.values?.phone,
      login_type: "manual",
      password: signUpFormik?.values?.password,
      guest_id: getGuestId(),
      field_type: "phone",
    };
    loginMutation(values);
  };

  const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifiyAPi } =
    useVerifyPhone();

  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();
  const otpFormSubmitHandler = (values) => {
    const onSuccessHandler = (res) => {
      setOpenOtpModal(false);
      handleTokenAfterSignUp(res);
    };

    if (
      configData?.firebase_otp_verification === 1 &&
      configData?.centralize_login?.phone_verification_status === 1
    ) {
      const temValue = {
        session_info: verificationId,
        phone: values.phone,
        otp: values.reset_token,
        login_type: "manual",
        guest_id: getGuestId(),
      };
      fireBaseOtpMutation(temValue, {
        onSuccess: onSuccessHandler,
        onError: onErrorResponse,
      });
    } else {
      const loginType = otpData?.login_type ?? "manual";
      const tempValues =
        otpData?.verification_type === "email"
          ? {
              email: otpData?.type ?? signUpFormik?.values?.email,
              otp: values.reset_token,
              login_type: loginType,
              verification_type: "email",
              guest_id: getGuestId(),
            }
          : {
              phone: otpData?.type ?? signUpFormik?.values?.phone,
              otp: values.reset_token,
              login_type: loginType,
              verification_type: "phone",
              guest_id: getGuestId(),
            };

      otpVerifyMutate(tempValues, {
        onSuccess: onSuccessHandler,
        onError: (error) => {
          toast.error(error?.response?.data?.message, {
            id: "error",
          });
        },
      });
    }
  };

  const handleSignIn = () => {
    setModalFor("sign-in");
  };

  // Used only by the partial-save warning action.
  // Prefills Sign In form with current credentials before switching modal.
  const handlePartialSaveSignIn = () => {
    if (typeof window !== "undefined") {
      const emailOrPhone =
        (signUpFormik.values?.email || "").trim() ||
        (signUpFormik.values?.phone || "").trim();
      const password = signUpFormik.values?.password || "";

      localStorage.setItem(
        "userDatafor",
        JSON.stringify({
          email_or_phone: emailOrPhone,
          password,
        })
      );
    }
    setModalFor("sign-in");
  };

  const handleClick = () => {
    window.open("/terms-and-conditions");
  };
  return (
    <>
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="stretch"
        sx={{ flex: 1, minHeight: 0, width: "100%" }}
      >
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="stretch"
          sx={{ flex: 1, minHeight: 0, width: "100%" }}
        >
          <Box
            sx={{
              maxWidth: "500px",
              minWidth: { xs: "300px", md: "460px" },
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
            {/* ── Gradient Header ──────────────────────────────── */}
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
                {t("Create Account")} 🎉
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.8)", mt: "4px", textAlign: "center" }}
              >
                {t("Sign up to get started")}
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
              <form noValidate onSubmit={signUpFormik.handleSubmit}>
                <CustomStackFullWidth spacing={1.5}>
                  <SignUpForm
                    configData={configData}
                    handleOnChange={handleOnChange}
                    passwordHandler={passwordHandler}
                    fNameHandler={fNameHandler}
                    lNameHandler={lNameHandler}
                    emailHandler={emailHandler}
                    confirmPasswordHandler={confirmPasswordHandler}
                    ReferCodeHandler={ReferCodeHandler}
                    signUpFormik={signUpFormik}
                  />
                  <AcceptTermsAndConditions
                    handleCheckbox={handleCheckbox}
                    handleClick={handleClick}
                    formikType={signUpFormik}
                  />
                  {partialSaveDetected && (
                    <CustomStackFullWidth
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1.25}
                      sx={{
                        borderRadius: "10px",
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.32)}`,
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        padding: "10px 12px",
                      }}
                    >
                      <Typography
                        fontSize="12.5px"
                        lineHeight={1.35}
                        sx={{ color: theme.palette.text.primary, flex: 1 }}
                      >
                        {t(
                          "Your details were partially saved during a previous attempt. Please Sign In with your email and password, or use a different email and phone number."
                        )}
                      </Typography>
                      <Typography
                        fontSize="13px"
                        fontWeight={700}
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: "pointer",
                          textDecoration: "underline",
                          minWidth: "64px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                        onClick={handlePartialSaveSignIn}
                      >
                        {t("Sign In")}
                      </Typography>
                    </CustomStackFullWidth>
                  )}
                  <CustomStackFullWidth spacing={1.5}>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={isLoading}
                      disabled={!signUpFormik.values.tandc}
                      id="recaptcha-container"
                      sx={{
                        borderRadius: `${theme.shape.borderRadius}px`,
                        height: "45px",
                        fontSize: "16px",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {t("Sign Up")}
                    </LoadingButton>
                    <Typography
                      fontSize="14px"
                      textAlign="center"
                      sx={{ color: "text.secondary" }}
                    >
                      {t("Already have an account?")}{" "}
                      <span
                        onClick={handleSignIn}
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {t("Sign In")}
                      </span>
                    </Typography>
                  </CustomStackFullWidth>
                </CustomStackFullWidth>
              </form>
            </Box>
          </Box>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
      <CustomModal
        handleClose={() => setOpenOtpModal(false)}
        openModal={openOtpModal}
      >
        <OtpForm
          data={otpData?.type ? otpData?.type : signUpFormik?.values?.phone}
          formSubmitHandler={otpFormSubmitHandler}
          isLoading={isLoadingOtpVerifiyAPi || fireIsLoading}
          loginValue={loginValue}
          reSendOtp={reSendOtp}
          handleClose={() => setOpenOtpModal(false)}
        />
      </CustomModal>
      {openModuleSelection && (
        <ModuleSelection
          location={location}
          closeModal={handleCloseModuleModal}
          disableAutoFocus
        />
      )}
    </>
  );
};

export default React.memo(SignUp);
