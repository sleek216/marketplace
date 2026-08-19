import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { google_client_id } from "utils/staticCredential";
import { Stack, styled } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import { alpha, Typography, useMediaQuery, useTheme } from "@mui/material";
import googleLatest from "../../asset/Google_Logo.png";
import { t } from "i18next";
import { getGuestId } from "helper-functions/getToken";

export const CustomGoogleButton = styled(Stack)(({ theme, width, height }) => ({
  width: width,
  backgroundColor: alpha(theme.palette.neutral[400], 0.08),
  height: height ?? "50px",
  justifyContent: "center",
  borderRadius: "8px",
  padding: "10px 16px",
  color: theme.palette.neutral[700],
  border: `1px solid ${alpha(theme.palette.neutral[400], 0.4)}`,
  alignItems: "center",
  cursor: "pointer",
  transition: "background-color 0.2s, border-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
}));

const GoogleLoginComp = (props) => {
  const {
    handleSuccess,
    socialLength,
    state,
    setJwtToken,
    setUserInfo,
    setModalFor,
    setMedium,
    loginMutation,
    setLoginInfo,
  } = props;
  const theme = useTheme();
  const [loginValue, setLoginValue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({ phone: "" });
  const buttonDiv = useRef(null);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [buttonWidth, setButtonWidth] = useState(isSmall ? "300px" : "350px"); // Default width
  const clientId = google_client_id;

  // Update button size based on socialLength
  useEffect(() => {
    switch (socialLength) {
      case 1:
        setButtonWidth("300px");
        break;
      case 2:
        setButtonWidth("147px");
        break;
      case 3:
        setButtonWidth("50px");
        break;
      default:
        setButtonWidth("350px !important");
    }
    if (state?.status === "social") {
      setButtonWidth("306px !important");
    }
  }, [socialLength, state?.status]);
  const handleToken = (token) => {
    if (token) {
      handleSuccess(token);
    } else {
      setMedium("google");
      setModalFor("phone_modal");
      setOpenModal(true);
    }
  };
  const callbackRef = useRef(null);

  useEffect(() => {
    if (otpData?.phone !== "") {
      setOpenOtpModal(true);
    }
  }, [otpData]);

  useEffect(() => {
    let cancelled = false;
    const mountGoogleButton = () => {
      if (cancelled || !buttonDiv.current || !window.google?.accounts?.id) {
        return false;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => callbackRef.current(res),
      });
      const width = Math.max(
        240,
        Math.floor(buttonDiv.current.parentElement?.clientWidth || 320)
      );
      window.google.accounts.id.renderButton(buttonDiv.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        width,
      });
      return true;
    };

    if (mountGoogleButton()) return undefined;
    const retry = setInterval(() => {
      if (mountGoogleButton()) clearInterval(retry);
    }, 200);
    const stop = setTimeout(() => clearInterval(retry), 8000);
    return () => {
      cancelled = true;
      clearInterval(retry);
      clearTimeout(stop);
    };
  }, [clientId, buttonWidth, socialLength]);

  const handleGoogleClick = () => {
    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      toast.error(t("Google Sign-In is not ready. Please try again."));
      return;
    }
    googleId.initialize({
      client_id: clientId,
      callback: (res) => callbackRef.current(res),
    });
    googleId.prompt();
  };

  const handlePostRequestOnSuccess = (response) => {
    const res = response;
    if (response?.is_exist_user === null && response?.is_personal_info === 1) {
      handleToken(response?.token);
    } else if (response?.is_personal_info === 0) {
      setLoginInfo({ ...res, email: response?.email, is_email: true });
      // setForWidth(false);
      setModalFor("user_info");
    } else {
      // setForWidth(false);
      setMedium("google");
      setLoginInfo({ ...res, email: response?.email, is_email: true });
      setModalFor("is_exist_user");
    }
  };
  const handleCallBackResponse = (res) => {
    const userObj = jwt_decode(res.credential);
    const resolvedUniqueId =
      userObj?.sub ||
      res?.unique_id ||
      res?.clientId ||
      userObj?.aud ||
      clientId;

    setJwtToken({
      ...res,
      credential: res.credential,
      clientId: resolvedUniqueId,
      unique_id: resolvedUniqueId,
    });
    setUserInfo(userObj);
    const tempValue = {
      email: res?.email ?? userObj?.email,
      token: res?.token ?? res?.credential,
      unique_id: resolvedUniqueId,
      medium: res?.medium ?? "google",
      login_type: res?.login_type ?? "social",
      guest_id: loginValue?.guest_id ?? getGuestId(),
    };
    setLoginValue(tempValue);
    loginMutation(tempValue, {
      onSuccess: (res) =>
        handlePostRequestOnSuccess({
          ...res,
          email: userObj.email,
        }),
      onError: (error) => {
        error?.response?.data?.errors?.forEach((item) =>
          item.code === "email" ? handleToken() : toast.error(item.message)
        );
      },
    });

    const handleRegistrationOnSuccess = (token) => {
      //registration on success func remaining
      setOpenModal(false);
      handleSuccess(token);
    };
  };
  callbackRef.current = handleCallBackResponse;

  const handleView = () => {
    // Handle conditional rendering for social login button style
    if (state?.status === "social") {
      return (
        <CustomGoogleButton
          direction="row"
          spacing={1}
          width="100%"
          height="50px"
          onClick={handleGoogleClick}
        >
          <CustomImageContainer
            src={googleLatest.src}
            alt="facebook"
            height="24px"
            width="24px"
            objectFit="cover"
            borderRadius="50%"
          />
          <Typography fontSize="14px" fontWeight="600">
            {t("Continue with Google")}
          </Typography>
        </CustomGoogleButton>
      );
    }

    switch (socialLength) {
      case 1:
        return (
          <CustomGoogleButton direction="row" spacing={1} width="100%" height="50px" onClick={handleGoogleClick}>
            <CustomImageContainer
              src={googleLatest.src}
              alt="google"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Continue with Google")}
            </Typography>
          </CustomGoogleButton>
        );
      case 2:
        return (
          <CustomGoogleButton
            direction="row"
            spacing={1}
            width="100%"
            height="50px"
            onClick={handleGoogleClick}
          >
            <CustomImageContainer
              src={googleLatest.src}
              alt="google"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
            <Typography fontSize="14px" fontWeight="600">
              {t("Google")}
            </Typography>
          </CustomGoogleButton>
        );
      case 3:
        return (
          <CustomGoogleButton
            direction="row"
            width="100%"
            spacing={1}
            height="50px"
            onClick={handleGoogleClick}
          >
            <CustomImageContainer
              src={googleLatest.src}
              alt="google"
              height="24px"
              width="24px"
              objectFit="cover"
              borderRadius="50%"
            />
          </CustomGoogleButton>
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      width={socialLength === 3 && state?.status !== "social" ? "45px" : "100%"}
      maxWidth="400px"
      mx="auto"
      alignItems="center"
    >
      <div
        style={{
          position: "relative",
          width: socialLength !== 3 ? "100%" : buttonWidth,
          overflow: "hidden",
          cursor: "pointer",
          height: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            zIndex: 2,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div ref={buttonDiv} style={{ width: "100%", height: "100%" }} />
        </div>
        {handleView()}
      </div>
    </Stack>
  );
};

export default GoogleLoginComp;
