import { useTranslation } from "react-i18next";
import {
  alpha,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getLanguage } from "helper-functions/getLanguage";
import { Lock as LockIcon } from "lucide-react";
import React, { useMemo } from "react";
import { Mail as EmailIcon } from "lucide-react";

const iconColor = (theme) => alpha(theme.palette.neutral[400], 0.7);

const AccountInfo = ({
  RestaurantJoinFormik,
  emailHandler,
  passwordHandler,
  confirmPasswordHandler,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const emailStartIcon = useMemo(
    () => (
      <InputAdornment position="start">
        <EmailIcon
          sx={{
            color: iconColor(theme),
            fontSize: "18px",
          }}
        />
      </InputAdornment>
    ),
    [theme]
  );

  const lockStartIcon = useMemo(
    () => (
      <InputAdornment position="start">
        <LockIcon
          sx={{
            color: iconColor(theme),
            fontSize: "18px",
          }}
        />
      </InputAdornment>
    ),
    [theme]
  );

  return (
    <CustomStackFullWidth>
      <Typography fontSize={{xs: "16px", sm: "18px"}} fontWeight="500" textAlign="left" p={{xs: 1.2, sm: 2}} sx={{
          borderBottom: `1px solid ${alpha(
            theme.palette.neutral[400],
            0.2
          )}`,
        }}>
        {t("Account Info")}
      </Typography>
      <Stack p={2} pb={0} mt={2}>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={12} align="left">
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
              id="seller-email"
              labelColor={alpha(theme.palette.neutral[1000],0.8)}
              placeholder={t("Type your email")}
              required="true"
              type="text"
              label={t("Email")}
              touched={RestaurantJoinFormik.touched.email}
              errors={RestaurantJoinFormik.errors.email}
              onChangeHandler={emailHandler}
              triggerChangeOnType
              value={RestaurantJoinFormik.values.email}
              fontSize="12px"
              startIcon={emailStartIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
              id="seller-password"
              labelColor={alpha(theme.palette.neutral[1000],0.8)}
              placeholder={t("Password")}
              required="true"
              type="password"
              label={t("Password")}
              touched={RestaurantJoinFormik.touched.password}
              errors={RestaurantJoinFormik.errors.password}
              onChangeHandler={passwordHandler}
              triggerChangeOnType
              value={RestaurantJoinFormik.values.password}
              fontSize="12px"
              startIcon={lockStartIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
              id="seller-confirm-password"
              labelColor={alpha(theme.palette.neutral[1000],0.8)}
              placeholder={t("Confirm Password")}
              required="true"
              type="password"
              label={t("Confirm Password")}
              touched={RestaurantJoinFormik.touched.confirm_password}
              errors={RestaurantJoinFormik.errors.confirm_password}
              onChangeHandler={confirmPasswordHandler}
              triggerChangeOnType
              value={RestaurantJoinFormik.values.confirm_password}
              fontSize="12px"
              startIcon={lockStartIcon}
            />
          </Grid>
        </Grid>
      </Stack>
    </CustomStackFullWidth>
  );
};
export default AccountInfo;
