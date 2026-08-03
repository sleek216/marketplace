import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { alpha, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../custom-component/CustomPhoneInput";
import { useFormik } from "formik";
import { setGuestUserInfo } from "redux/slices/guestUserInfo";
import { getLanguage, getModule } from "helper-functions/getLanguage";
import { PrimaryButton } from "../Map/map.style";
import TrackOrderDetails from "./TrackOrderDetails";
import { getGuestId } from "helper-functions/getToken";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import { Search } from "lucide-react";

import Router from "next/router";
import { useGetTripDetails } from "api-manage/hooks/react-query/useGetTripDetails";

const FIELD_RADIUS = "2px";

const TrackOrderInput = ({ configData }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData, dispatch]);

  const trackOrderFormik = useFormik({
    initialValues: {
      order_id: "",
      contact_person_number: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        dispatch(setGuestUserInfo(values));
        setShowOrderDetails(true);
        if (getModule()?.module_type === "rental") {
          refetchData();
        } else {
          refetchTrackOrder();
        }
      } catch (err) {}
    },
  });
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const nameHandler = (value) => {
    trackOrderFormik.setFieldValue("order_id", value);
  };
  const numberHandler = (value) => {
    trackOrderFormik.setFieldValue("contact_person_number", `+${value}`);
  };
  const guestId = getGuestId();
  const handleSuccess = () => {
    setShowOrderDetails(true);
  };
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
    isLoading,
  } = useGetTrackOrderData(
    trackOrderFormik?.values?.order_id,
    trackOrderFormik?.values?.contact_person_number,
    guestId,
    setShowOrderDetails,
    handleSuccess
  );
  const {
    data: tripDetails,
    refetch: refetchData,
    isFetching,
  } = useGetTripDetails(trackOrderFormik?.values?.order_id);
  useEffect(() => {
    if (tripDetails) {
      Router.push(`/rental/trip-status/${tripDetails?.id}?from=""`);
    }
  }, [tripDetails]);

  const isRental = selectedModule?.module_type === "rental";

  return (
    <CustomStackFullWidth
      sx={{
        minHeight: { xs: "calc(100vh - 220px)", md: "calc(100vh - 260px)" },
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 3, md: 4 },
      }}
      spacing={{ xs: 2, md: 2.5 }}
    >
      <Stack
        spacing={1}
        alignItems="center"
        textAlign="center"
        maxWidth="620px"
        px={2}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "22px", sm: "28px", md: "32px" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: theme.palette.text.primary,
            lineHeight: 1.25,
          }}
        >
          {isRental ? t("Track Your Rental Trip") : t("Track Your Order Status")}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "13px", sm: "14px" },
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            maxWidth: "520px",
          }}
        >
          {isRental
            ? t(
                "Enter your trip ID and contact number below to get live updates and driver location."
              )
            : t(
                "Enter your order ID and phone number below to get real-time delivery updates and courier status."
              )}
        </Typography>
      </Stack>

      <Box
        sx={{
          width: "100%",
          maxWidth: "760px",
          mx: "auto",
          p: { xs: 2, sm: 3, md: 3.5 },
          borderRadius: FIELD_RADIUS,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.06)}`,
          "& .MuiOutlinedInput-root": {
            borderRadius: FIELD_RADIUS,
          },
          "& .MuiTextField-root": {
            borderRadius: FIELD_RADIUS,
          },
        }}
      >
        <form noValidate onSubmit={trackOrderFormik.handleSubmit}>
          <Grid container spacing={{ xs: 2, sm: 2.5 }} alignItems="center">
            <Grid item xs={12} sm={6}>
              <CustomTextFieldWithFormik
                placeholder={t("e.g. 151515615616516")}
                required="true"
                type="text"
                label={isRental ? t("Trip ID") : t("Order ID")}
                touched={trackOrderFormik.touched.order_id}
                errors={trackOrderFormik.errors.order_id}
                fieldProps={trackOrderFormik.getFieldProps("order_id")}
                onChangeHandler={nameHandler}
                value={trackOrderFormik.values.order_id}
                height="45px"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomPhoneInput
                value={trackOrderFormik.values.contact_person_number}
                onHandleChange={numberHandler}
                initCountry={configData?.country}
                touched={trackOrderFormik.touched.contact_person_number}
                errors={trackOrderFormik.errors.contact_person_number}
                rtlChange="true"
                lanDirection={lanDirection}
                height="45px"
                borderRadius={FIELD_RADIUS}
              />
            </Grid>

            <Grid item xs={12} pt={{ xs: 1, md: 1.5 }}>
              <PrimaryButton
                type="submit"
                sx={{
                  width: "100%",
                  height: "48px",
                  borderRadius: FIELD_RADIUS,
                  fontSize: "15px",
                  fontWeight: 600,
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                <Search size={18} />
                {isRental ? t("Search Trip") : t("Search Order")}
              </PrimaryButton>
            </Grid>
          </Grid>
        </form>
      </Box>

      {trackOrderData && showOrderDetails && (
        <Box sx={{ width: "100%", maxWidth: "960px", mx: "auto", mt: 2 }}>
          <TrackOrderDetails
            trackOrderFormik={trackOrderFormik}
            showOrderDetails={setShowOrderDetails}
            trackOrderData={trackOrderData}
          />
        </Box>
      )}
    </CustomStackFullWidth>
  );
};

export default TrackOrderInput;
