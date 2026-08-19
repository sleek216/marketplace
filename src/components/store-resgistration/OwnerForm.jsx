import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Box,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getLanguage } from "helper-functions/getLanguage";
import React from "react";
import { UserCircle as AccountCircleIcon } from "lucide-react";

const OwnerForm = ({
  RestaurantJoinFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
  phoneReady = true,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const handleNameKeyDown = (event) => {
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      " ",
    ];
    if (allowedControlKeys.includes(event.key)) return;
    if (!/^[A-Za-z]$/.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleNamePaste = (event) => {
    const pastedText = event.clipboardData?.getData("text") || "";
    if (!/^[A-Za-z\s]+$/.test(pastedText)) {
      event.preventDefault();
    }
  };

  return (
    <CustomStackFullWidth sx={{ position: "relative", isolation: "isolate", zIndex: 0 }}>
      <Typography fontSize={{xs: "16px", sm: "18px"}} fontWeight="500" textAlign="left" p={{xs: 1.2, sm: 2}} sx={{
          borderBottom: `1px solid ${alpha(
            theme.palette.neutral[400],
            0.2
          )}`,
        }}
      >
        {t("Owner Information")}
      </Typography>
      <Typography
        fontSize="12px"
        color="text.secondary"
        textAlign="left"
        px={{ xs: 1.2, sm: 2 }}
        pt={1}
      >
        {t(
          "This creates a separate seller account and store ID. Your customer login stays the same. For another store, use a unique seller email and phone."
        )}
      </Typography>
      <Stack p={2} pb={{xs: 2, md: 0}} mt={1}>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={12} align="left">
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
              <CustomTextFieldWithFormik
              labelColor={alpha(theme.palette.neutral[1000], 0.8)}
              placeholder={t("First name")}
              required="true"
              type="text"
              label={t("First Name")}
              touched={RestaurantJoinFormik.touched.f_name}
              errors={RestaurantJoinFormik.errors.f_name}
              fieldProps={RestaurantJoinFormik.getFieldProps("f_name")}
              onChangeHandler={fNameHandler}
              onKeyDown={handleNameKeyDown}
              onPaste={handleNamePaste}
              value={RestaurantJoinFormik.values.f_name}
              fontSize="12px"
              startIcon={
                <InputAdornment position="start">
                  <AccountCircleIcon
                    sx={{
                      color:
                        RestaurantJoinFormik.touched.restaurant_name &&
                        !RestaurantJoinFormik.errors.restaurant_name
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
            labelColor={alpha(theme.palette.neutral[1000],0.8)}
              required="true"
              type="text"
              placeholder={t("Last name")}
              label={t("Last Name")}
              touched={RestaurantJoinFormik.touched.l_name}
              errors={RestaurantJoinFormik.errors.l_name}
              fieldProps={RestaurantJoinFormik.getFieldProps("l_name")}
              onChangeHandler={lNameHandler}
              onKeyDown={handleNameKeyDown}
              onPaste={handleNamePaste}
              value={RestaurantJoinFormik.values.l_name}
              fontSize="12px"
              startIcon={
                <InputAdornment position="start">
                  <AccountCircleIcon
                    sx={{
                      color:
                        RestaurantJoinFormik.touched.restaurant_name &&
                        !RestaurantJoinFormik.errors.restaurant_name
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ width: "100%", overflow: "visible", pt: "2px" }}>
              {phoneReady ? (
                <CustomPhoneInput
                  initCountry={configData?.country}
                  value={RestaurantJoinFormik.values.phone}
                  onHandleChange={phoneHandler}
                  touched={RestaurantJoinFormik.touched.phone}
                  errors={RestaurantJoinFormik.errors.phone}
                  lanDirection={lanDirection}
                  height="45px"
                  borderRadius="10px"
                  required="true"
                  alignWithMuiField
                />
              ) : (
                <Box sx={{ height: "45px" }} />
              )}
            </Box>
          </Grid>
          </Grid>
      </Stack>
    </CustomStackFullWidth>
  );
};
export default OwnerForm;
