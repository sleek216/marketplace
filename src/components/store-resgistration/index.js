import React, { useEffect, useRef, useState } from "react";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { NoSsr, Typography, useMediaQuery } from "@mui/material";
import { t } from "i18next";
import StoreStepper from "components/store-resgistration/StoreStepper";
import StoreRegistrationForm from "components/store-resgistration/StoreRegistrationForm";
import BusinessPlan from "components/store-resgistration/BusinessPlan";
import FormSubmitButton from "components/profile/FormSubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { usePostStoreRegistration } from "api-manage/hooks/react-query/store-registration/usePostStoreRegistration";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import PaymentSelect from "components/store-resgistration/PaymentSelect";
import { usePostBusiness } from "api-manage/hooks/react-query/store-registration/usePostBusiness";
import { useRouter } from "next/router";
import SuccessStoreRegistration from "components/store-resgistration/SuccessStoreRegistration";
import {
  setActiveStep,
  setAllData,
  setFieldErrors,
  setInZone,
} from "redux/slices/storeRegistrationData";
import { parseRegistrationApiErrors } from "components/store-resgistration/registrationErrorMapper";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import { useTheme } from "@mui/styles";

const StoreRegistration = () => {
  useScrollToTop();
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [resData, setResData] = useState({});
  const [registrationError, setRegistrationError] = useState("");
  const submitInProgressRef = useRef(false);
  const isSmallSize = useMediaQuery(theme.breakpoints.down("md"));
  const { flag, active, plan, package: pa } = router.query;

  const { allData, activeStep } = useSelector((state) => state.storeRegData);
  const [formValues, setFormValues] = useState({});
  const { mutate, isLoading: regIsloading } = usePostStoreRegistration();
  const { mutate: businessMutate, isLoading } = usePostBusiness();

  const extractErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return t("Something went wrong. Please try again.");

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError?.message === "string" && firstError.message) {
        return firstError.message;
      }
    }

    if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
      const firstFieldErrors = Object.values(data.errors)?.[0];
      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0];
      }
    }

    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }

    return t("Something went wrong. Please try again.");
  };

  const handleRegistrationApiError = (error) => {
    submitInProgressRef.current = false;
    const { step0Errors, otherErrors, firstOtherMessage } =
      parseRegistrationApiErrors(error);

    if (step0Errors && Object.keys(step0Errors).length > 0) {
      dispatch(setFieldErrors(step0Errors));
      dispatch(setActiveStep(0));
      setRegistrationError(
        Object.keys(otherErrors).length > 0
          ? Object.values(otherErrors)[0]
          : ""
      );
      return;
    }

    setRegistrationError(
      firstOtherMessage || extractErrorMessage(error)
    );
    onErrorResponse(error);
  };

  const formSubmit = (value) => {
    const nextData = {
      ...(allData || {}),
      ...(formValues || {}),
      business_plan: value?.business_plan,
      package_id: value?.package_id,
    };
    setRegistrationError("");
    dispatch(setAllData(nextData));
    setResData((prev) => ({
      ...(prev || {}),
      type: value?.business_plan,
      package_id: value?.package_id,
    }));

    // Commission flow completes from Step-2 directly (no payment step).
    if (value?.business_plan === "commission") {
      submitBusiness({}, nextData);
      return;
    }

    // Subscription flow moves to payment selection (Step-3).
    dispatch(setActiveStep(2));
  };

  const submitBusiness = (values, dataOverride) => {
    if (submitInProgressRef.current) return;

    submitInProgressRef.current = true;
    setRegistrationError("");
    const sourceData = dataOverride || allData || {};
    const handleRegisteredStore = (registrationRes) => {
      const businessPayload = {
        business_plan: registrationRes?.type ?? sourceData?.business_plan,
        store_id: registrationRes?.store_id,
        package_id: registrationRes?.package_id ?? sourceData?.package_id,
        ...values,
      };

      // Commission plan can complete without payment transaction.
      if (businessPayload?.business_plan === "commission") {
        const currentQuery = router.query;
        const updatedQuery = { ...currentQuery, flag: "success", active: "" };
        router.replace(
          {
            pathname: router.pathname,
            query: updatedQuery,
          },
          undefined,
          { shallow: true }
        );
        dispatch(setActiveStep(3));
        dispatch(setAllData(null));
        dispatch(setInZone(null));
        return;
      }

      businessMutate(businessPayload, {
        onSuccess: (res) => {
          if (res) {
            if (res?.redirect_link && res?.payment !== "free_trial") {
              const redirect_url = `${res?.redirect_link}`;
              dispatch(setActiveStep(3));
              dispatch(setAllData(null));
              dispatch(setInZone(null));
              router.push(redirect_url);
            } else {
              const currentQuery = router.query;
              const updatedQuery = {
                ...currentQuery,
                flag: "success",
                active: "",
              };
              router.replace(
                {
                  pathname: router.pathname,
                  query: updatedQuery,
                },
                undefined,
                { shallow: true }
              );
              dispatch(setActiveStep(3));
              dispatch(setAllData(null));
              dispatch(setInZone(null));
            }
          }
        },
        onError: handleRegistrationApiError,
      });
    };

    if (resData?.store_id) {
      handleRegisteredStore(resData);
      return;
    }

    const registrationPayload = {
      ...sourceData,
      value: {
        business_plan: sourceData?.business_plan,
        package_id: sourceData?.package_id,
      },
    };

    // Final step: create vendor record only here.
    mutate(registrationPayload, {
      onSuccess: (registrationRes) => {
        setResData((prev) => ({
          ...(prev || {}),
          ...registrationRes,
          type: registrationRes?.type ?? sourceData?.business_plan,
          package_id: registrationRes?.package_id ?? sourceData?.package_id,
        }));
        handleRegisteredStore(registrationRes);
      },
      onError: handleRegistrationApiError,
    });
  };

  useEffect(() => {
    if (flag === "success") {
      dispatch(setActiveStep(3));
    }
  }, [flag]);

  useEffect(() => {
    if (active === "active") {
      dispatch(setActiveStep(0));
    }
  }, [active]);

  const handleActiveStep = () => {
    if (activeStep === 0) {
      return (
        <StoreRegistrationForm
          setActiveStep={setActiveStep}
          setFormValues={setFormValues}
          clearRegistrationError={() => {
            setRegistrationError("");
            dispatch(setFieldErrors(null));
          }}
        />
      );
    } else if (activeStep === 1) {
      return (
        <BusinessPlan
          setActiveStep={setActiveStep}
          formSubmit={formSubmit}
          isLoading={regIsloading || isLoading}
          registrationResponse={resData}
          onBackToGeneralInfo={() => {
            setResData({});
            setRegistrationError("");
          }}
          registrationError={registrationError}
          clearRegistrationError={() => setRegistrationError("")}
        />
      );
    } else if (
      (activeStep === 3 && flag === "success") ||
      (activeStep === 3 && flag === "fail")
    ) {
      return <SuccessStoreRegistration flag={flag} />;
    } else if (activeStep === 2) {
      return (
        <PaymentSelect
          isLoading={isLoading || regIsloading}
          resData={resData}
          submitBusiness={submitBusiness}
          registrationError={registrationError}
          clearRegistrationError={() => setRegistrationError("")}
        />
      );
    }
  };

  return (
    <NoSsr>
      <CustomContainer>
        <CustomStackFullWidth
          justify="center"
          mt={{ xs: "1.5rem", md: "2rem" }}
          sx={{
            maxWidth: "1080px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            fontSize={isSmallSize ? "22px" : "36px"}
            fontWeight="700"
            textAlign="center"
            sx={{
              mb: 0.75,
            }}
          >
            {t("Marketplace Seller")}
          </Typography>
          <Typography
            fontSize={{ xs: "12px", md: "14px" }}
            color={(theme) => theme.palette.neutral[600]}
            sx={{
              maxWidth: "640px",
              mx: "auto",
              mb: { xs: 2, md: 3 },
            }}
          >
            {t(
              "Join GIFT Marketplace and grow your business with online orders, powerful tools, and dedicated customer reach."
            )}
          </Typography>
          <StoreStepper flag={flag} activeStep={activeStep} />
          {handleActiveStep()}
        </CustomStackFullWidth>
      </CustomContainer>
    </NoSsr>
  );
};

export default StoreRegistration;
