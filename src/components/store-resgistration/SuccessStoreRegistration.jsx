import React from "react";
import { alpha, Button, Stack, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { t } from "i18next";
import { useRouter } from "next/router";
import { setActiveStep } from "redux/slices/storeRegistrationData";
import { useDispatch } from "react-redux";
import CustomImageContainer from "components/CustomImageContainer";
import successGif from "../../assets/GIF 1.gif";
import failGif from "../../assets/GIF 2.gif";

const SuccessStoreRegistration = ({ flag, onBack, onGoToStep }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const tryAgain = () => {
    if (onGoToStep) {
      onGoToStep(2);
      return;
    }
    if (onBack) {
      onBack();
      return;
    }
    router.replace(
      {
        pathname: router.pathname,
      },
      undefined,
      { shallow: true }
    );
    dispatch(setActiveStep(2));
  };
  return (
    <CustomStackFullWidth
      sx={{
        marginTop: "2rem",
        borderRadius: "18px",
        padding: { xs: "22px 16px", md: "32px 32px" },
        justifyContent: "center",
        alignItems: "center",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.neutral[900], 0.9)
            : `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.04
              )} 0%, ${alpha(theme.palette.neutral[100], 1)} 60%, #ffffff 100%)`,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? `0 20px 50px ${alpha(theme.palette.common.black, 0.8)}`
            : `0 20px 55px ${alpha(theme.palette.neutral[900], 0.12)}`,
      }}
      spacing={2}
    >
      {flag === "success" ? (
        <>
          <CustomImageContainer
            src={successGif.src}
            alt="success animation"
            height={160}
            width={160}
            objectFit="contain"
          />
          <Typography
            fontSize={{ xs: "20px", md: "24px" }}
            fontWeight="700"
            textAlign="center"
            sx={{
              color: (theme) => theme.palette.neutral[900],
            }}
          >
            {t("Congratulations!")}
          </Typography>
          <Stack justifyContent="center" alignItems="center" width="100%">
            <Typography
              fontSize={{ xs: "14px", md: "16px" }}
              textAlign="center"
              sx={{
                color: (theme) => theme.palette.neutral[700],
              }}
            >
              {t("Your registration has been completed successfully.")}
            </Typography>
            <Typography
              fontSize={{ xs: "12px", md: "13px" }}
              textAlign="center"
              sx={{
                mt: 0.5,
                color: (theme) => theme.palette.neutral[500],
                maxWidth: "480px",
              }}
            >
              {t(
                "Admin will confirm your registration after review"
              )}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: "1.5rem",
                px: 4,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: (theme) =>
                  `0 10px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
              onClick={() => {
                const zoneId = localStorage.getItem("zoneid");
                const location = localStorage.getItem("location");
                if (zoneId || location) {
                  router.push("/home");
                } else {
                  router.push("/");
                }
              }}
            >
              {t("Got it")}
            </Button>
            <Button
              variant="text"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={() => router.push("/store-registration?new=1")}
            >
              {t("Register another store")}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <CustomImageContainer
            src={failGif.src}
            alt="payment failed"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Typography
            fontSize={{ xs: "20px", md: "22px" }}
            fontWeight="700"
            textAlign="center"
          >
            {t("Payment Error !")}
          </Typography>
          <Stack justifyContent="center" alignItems="center">
            <Typography fontSize="16px" textAlign="center">
              {t("Your Registration Could Not Completed .")}
            </Typography>
            <Typography fontSize="13px" component="span">
              {t(
                "Due to payment transaction error your registration could not complete."
              )}
              <Typography
                textAlign="center"
                onClick={tryAgain}
                component="span"
                fontSize="13px"
                color={theme.palette.primary.main}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {t("Please Try Again")}
              </Typography>
            </Typography>
          </Stack>
        </>
      )}
    </CustomStackFullWidth>
  );
};

export default SuccessStoreRegistration;
