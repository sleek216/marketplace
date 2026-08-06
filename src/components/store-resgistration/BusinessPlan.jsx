import React, { useEffect, useState } from "react";
import { Alert, alpha, Grid, Typography, useTheme } from "@mui/material";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { CheckCircle2 as CheckCircleIcon } from "lucide-react";
import Plan from "components/store-resgistration/Plan";
import FormSubmitButton from "components/profile/FormSubmitButton";
import { useDispatch, useSelector } from "react-redux";
import useGetSubscriptionPackage from "api-manage/hooks/react-query/store-registration/useGetSubscriptionPackage";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import { setActiveStep } from "redux/slices/storeRegistrationData";
import { ResetButton } from "components/profile/basic-information/BasicInformationForm";
import { SaveButton } from "components/profile/basic-information/Profile.style";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";

const BusinessPlan = ({
  formSubmit,
  isLoading,
  registrationResponse = {},
  onBackToGeneralInfo,
  registrationError,
  clearRegistrationError,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const { allData } = useSelector((state) => state.storeRegData);
  const [selectedPlan, setSelectedPlan] = useState("commission");
  const { data } = useGetSubscriptionPackage(selectedPlan);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const res = registrationResponse || {};
    const savedPlan = res?.type ?? allData?.business_plan;
    const savedPackageId = res?.package_id ?? allData?.package_id;

    if (savedPlan === "commission" || savedPlan === "subscription") {
      setSelectedPlan(savedPlan);
    }
    if (savedPackageId != null && savedPackageId !== "") {
      const id = savedPackageId;
      setSelectedPackage(typeof id === "string" ? Number(id) || id : id);
    }
    if (savedPlan === "commission") {
      setSelectedPackage(null);
    }
  }, [
    allData?.business_plan,
    allData?.package_id,
    registrationResponse?.store_id,
    registrationResponse?.type,
    registrationResponse?.package_id,
  ]);
  const [isHover, setIsHover] = useState(false);
  const packageCount = data?.packages?.length ?? 0;
  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    pauseOnHover: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  const handleSubmit = () => {
    const tempValues = {
      business_plan: selectedPlan,
      package_id: selectedPlan === "subscription" ? selectedPackage : null,
    };
    formSubmit(tempValues);
  };
  return (
    <CustomStackFullWidth
      sx={{
        borderRadius: "16px",
        marginTop: "2rem",
        padding: { xs: "18px 14px", md: "28px 30px" },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.neutral[900], 0.9)
            : `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.03
              )} 0%, ${theme.palette.background.paper} 55%, #ffffff 100%)`,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? `0 18px 45px ${alpha(theme.palette.common.black, 0.7)}`
            : `0 18px 45px ${alpha(theme.palette.neutral[900], 0.08)}`,
      }}
    >
      <Stack
        spacing={1}
        sx={{
          borderRadius: "12px",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: "left",
          mb: { xs: 2, md: 3 },
        }}
      >
        <Typography
          fontSize={{ xs: "18px", md: "22px" }}
          fontWeight="600"
          textAlign="left"
        >
          {t("Choose Your Business Plan")}
        </Typography>
        <Typography
          fontSize={{ xs: "12px", md: "13px" }}
          color={(theme) => theme.palette.neutral[500]}
          maxWidth="520px"
        >
          {t(
            "Pick how you want to work with {{name}}. You can start with a commission plan or choose a subscription package that fits your goals.",
            { name: configData?.business_name }
          )}
        </Typography>
      </Stack>

      <CustomStackFullWidth
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mt="0.5rem"
      >
          {configData?.commission_business_model !== 0 && (
            <Stack
              flexGrow={1}
              padding={{ xs: "14px", md: "18px 20px" }}
              sx={{
                cursor: "pointer",
                borderRadius: "14px",
                border: "1px solid",
                backgroundColor:
                  selectedPlan === "commission"
                    ? (theme) => alpha(theme.palette.primary.main, 0.06)
                    : (theme) => theme.palette.neutral[100],
                borderColor:
                  selectedPlan === "commission"
                    ? (theme) => theme.palette.primary.main
                    : (theme) => alpha(theme.palette.neutral[400], 0.6),
                transition: "all 0.25s ease",
                "&:hover": {
                  borderColor: (theme) => theme.palette.primary.main,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0 12px 30px ${alpha(theme.palette.neutral[900], 0.08)}`,
                },
              }}
              spacing={1}
              onClick={() => {
                clearRegistrationError?.();
                setSelectedPlan("commission");
                setSelectedPackage(null);
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="700"
                  color={
                    selectedPlan === "commission"
                      ? theme.palette.primary.main
                      : "inherit"
                  }
                >
                  {t("Commission Base")}
                </Typography>
                {selectedPlan === "commission" && (
                  <CheckCircleIcon
                    sx={{
                      fontSize: "24px",
                      color: (theme) => theme.palette.primary.main,
                    }}
                  />
                )}
              </Stack>
              <Typography
                fontSize={{ xs: "12px", md: "13.5px" }}
                color={theme.palette.neutral[700]}
                lineHeight={1.5}
              >
                {t(
                  `Store will pay ${configData?.admin_commission}% commission to ${configData?.business_name} from each order. You will get access of all the features and options  in store panel , app and interaction with user.`
                )}
              </Typography>
            </Stack>
          )}
          {configData?.subscription_business_model !== 0 && (
            <Stack
              onClick={() => {
                clearRegistrationError?.();
                setSelectedPlan("subscription");
              }}
              flexGrow={1}
              padding={{ xs: "14px", md: "18px 20px" }}
              sx={{
                cursor: "pointer",
                borderRadius: "14px",
                border: "1px solid",
                backgroundColor:
                  selectedPlan === "subscription"
                    ? (theme) => alpha(theme.palette.primary.main, 0.06)
                    : (theme) => theme.palette.neutral[100],
                borderColor:
                  selectedPlan === "subscription"
                    ? (theme) => theme.palette.primary.main
                    : (theme) => alpha(theme.palette.neutral[400], 0.6),
                transition: "all 0.25s ease",
                "&:hover": {
                  borderColor: (theme) => theme.palette.primary.main,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0 12px 30px ${alpha(theme.palette.neutral[900], 0.08)}`,
                },
              }}
              spacing={1}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="700"
                  color={
                    selectedPlan === "subscription"
                      ? theme.palette.primary.main
                      : "inherit"
                  }
                >
                  {t("Subscription Base")}
                </Typography>
                {selectedPlan === "subscription" && (
                  <CheckCircleIcon
                    sx={{
                      fontSize: "24px",
                      color: (theme) => theme.palette.primary.main,
                    }}
                  />
                )}
              </Stack>

              <Typography
                fontSize={{ xs: "12px", md: "13.5px" }}
                color={theme.palette.neutral[700]}
                lineHeight={1.5}
              >
                {t(
                  "Run store by purchasing subsciption  packages. You will have access the features of in store panel , app and interaction with user according to the subscription packages."
                )}
              </Typography>
            </Stack>
          )}
      </CustomStackFullWidth>
      {selectedPlan === "subscription" && data?.packages?.length > 0 && (
        <Stack width="100%" mt={{ xs: 2.5, md: 3.5 }} spacing={2}>
          <Stack spacing={0.5}>
            <Typography
              fontWeight={700}
              fontSize={{ xs: "16px", md: "19px" }}
              color="text.primary"
            >
              {t("Choose Subscription Package")}
            </Typography>
            <Typography fontSize="13px" color="text.secondary">
              {t("Select one package to continue with your subscription plan.")}
            </Typography>
          </Stack>

          <Box
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            sx={{
              mx: { xs: -0.5, md: 0 },
              "& .slick-list": { margin: "0 -6px", padding: "12px 0" },
              "& .slick-slide > div": { height: "100%" },
              "& .slick-track": { display: "flex", alignItems: "stretch" },
            }}
          >
            <SliderCustom padding="0">
              <Slider {...settings}>
                {data?.packages?.map((item, index) => (
                  <Plan
                    key={item.id}
                    item={item}
                    isPopular={index === 2 || item?.package_name?.toLowerCase().includes("premium")}
                    setSelectedPackage={(id) => {
                      clearRegistrationError?.();
                      setSelectedPackage(id);
                    }}
                    selectedPackage={selectedPackage}
                  />
                ))}
              </Slider>
            </SliderCustom>
          </Box>
        </Stack>
      )}
      {registrationError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: "8px",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          {t(registrationError)}
        </Alert>
      )}

      <CustomStackFullWidth
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        mt="2rem"
      >
        <ResetButton
          onClick={() => {
            onBackToGeneralInfo?.();
            dispatch(setActiveStep(0));
          }}
          variant="outlined"
        >
          {t("Back")}
        </ResetButton>
        <SaveButton
          sx={{ minWidth: "120px" }}
          onClick={() => {
            clearRegistrationError?.();
            handleSubmit();
          }}
          variant="contained"
          loading={isLoading}
          disabled={isLoading || (selectedPlan === "subscription" && !selectedPackage)}
        >
          {t("Next")}
        </SaveButton>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default BusinessPlan;
