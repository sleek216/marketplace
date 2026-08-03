import React, { useEffect, useState } from "react";
import {
  CustomColouredTypography,
  CustomLink,
  CustomStackFullWidth,
  CustomTypographyGray,
} from "../../../styled-components/CustomStyles.style";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import { getLanguage } from "../../../helper-functions/getLanguage";
import LockIcon from "@mui/icons-material/Lock";
import {
  InputAdornment,
  alpha,
  useTheme,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import CustomPhoneInputManual from "components/custom-component/CustomPhoneInputManual";
import { checkInput } from "utils/CustomFunctions";

import { CustomTypography } from "components/landing-page/hero-section/HeroSection.style";
import LoadingButton from "@mui/lab/LoadingButton";

import PhoneOrEmailIcon from "components/auth/asset/PhoneOrEmailIcon";
import { useDispatch } from "react-redux";
import { setOpenForgotPasswordModal } from "redux/slices/utils";

const SignInForm = ({
  loginFormik,
  configData,
  handleOnChange,
  passwordHandler,
  rememberMeHandleChange,
  isApiCalling,
  isLoading,
  handleSignUp,
  only,
  handleClick,
  handleClose,
  isRemember,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  const theme = useTheme();
  const textColor = theme.palette.whiteContainer.main;
  const [isPhone, setIsPhone] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const value = loginFormik.values.email_or_phone;

    const filterInput = checkInput(value);
    if (filterInput === "phone") {
      setIsPhone("phone");
    } else {
      setIsPhone("email");
    }
  }, [loginFormik.values.email_or_phone]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("signin-email-input");
    const passwordInput = document.getElementById("signin-password-input");
    const nextValues = {
      email_or_phone: emailInput?.value ?? loginFormik.values.email_or_phone,
      password: passwordInput?.value ?? loginFormik.values.password,
    };
    await loginFormik.setValues({
      ...loginFormik.values,
      ...nextValues,
    });
    loginFormik.handleSubmit(event);
  };

  return (
    <form noValidate onSubmit={handleFormSubmit} id="signin-form">
      <CustomStackFullWidth alignItems="center">
        <CustomStackFullWidth
          spacing={0.5}
          sx={{ position: "relative" }}
        >
          {isPhone === "phone" ? (
            <CustomPhoneInputManual
              id="signin-phone-input"
              value={loginFormik.values.email_or_phone}
              onHandleChange={handleOnChange}
              initCountry={configData?.country}
              touched={loginFormik.touched.email_or_phone}
              errors={loginFormik.errors.email_or_phone}
              lanDirection={lanDirection}
              height="45px"
              autoFocus
              borderRadius="10px"
            />
          ) : (
            <CustomTextFieldWithFormik
              id="signin-email-input"
              compact
              autoFocus={isPhone === "email" && true}
              required
              label={t("Email/Phone")}
              placeholder={t("Email/Phone")}
              touched={loginFormik.touched.email_or_phone}
              errors={loginFormik.errors.email_or_phone}
              fieldProps={{
                ...loginFormik.getFieldProps("email_or_phone"),
                autoComplete: "username",
              }}
              onChangeHandler={handleOnChange}
              triggerChangeOnType
              value={loginFormik.values.email_or_phone}
              startIcon={
                <InputAdornment position="start">
                  <PhoneOrEmailIcon
                    sx={{
                      color:
                        loginFormik.touched.email_or_phone &&
                          !loginFormik.errors.email_or_phone
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[500], 0.4),
                    }}
                  />
                </InputAdornment>
              }
            />
          )}
          {/* <TextField
        id="email-input" // 👈 unique id
        label="Email"
        variant="outlined"
        fullWidth
      /> */}
          <CustomTextFieldWithFormik
            id="signin-password-input"
            compact
            height="45px"
            required="true"
            type="password"
            label={t("Password")}
            placeholder={t("Minimum 8 characters")}
            touched={loginFormik.touched.password}
            errors={loginFormik.errors.password}
            fieldProps={{
              ...loginFormik.getFieldProps("password"),
              autoComplete: "current-password",
            }}
            onChangeHandler={passwordHandler}
            triggerChangeOnType
            value={loginFormik.values.password}
            startIcon={
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    color:
                      loginFormik.touched.password &&
                        !loginFormik.errors.password
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[500], 0.6),
                  }}
                />
              </InputAdornment>
            }
          />
        </CustomStackFullWidth>
        <CustomStackFullWidth mt="2px" spacing={2}>

          {/* Remember me + Forgot password row */}
          <CustomStackFullWidth
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <FormControlLabel
              control={
                <Checkbox
                  id="signin-remember-checkbox"
                  value="remember"
                  color="primary"
                  size="small"
                  onChange={rememberMeHandleChange}
                  checked={isRemember || false}
                />
              }
              label={
                <Typography fontSize="13px" color="text.secondary">
                  {t("Remember me")}
                </Typography>
              }
              sx={{ ml: "-6px" }}
            />
            <CustomLink
              id="signin-forgot-password-link"
              onClick={() => {
                dispatch(setOpenForgotPasswordModal(true));
                handleClose();
              }}
              sx={{
                fontWeight: 500,
                fontSize: "13px",
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {t("Forgot password?")}
            </CustomLink>
          </CustomStackFullWidth>

          {/* Submit button */}
          <LoadingButton
            id="signin-submit-button"
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{
              color: textColor,
              height: "46px",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: `${theme.shape.borderRadius}px`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
              },
            }}
          >
            {t("Sign In")}
          </LoadingButton>

          {/* Terms */}
          <Box
            sx={{
              textAlign: "center",
              px: 1,
              py: "6px",
              borderRadius: "8px",
              backgroundColor: alpha(theme.palette.neutral[400], 0.07),
            }}
          >
            <Typography
              id="signin-terms-link"
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                fontSize: "11px",
                color: "text.secondary",
                lineHeight: 1.5,
              }}
            >
              {t("* By login I Agree with all the")}
              <Typography
                component="span"
                color={theme.palette.primary.main}
                sx={{ fontWeight: 500, fontSize: "11px", ml: "4px" }}
              >
                {t("Terms & Conditions")}
              </Typography>
            </Typography>
          </Box>

          {/* Sign up link */}
          {only && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                pt: "4px",
              }}
            >
              <Typography fontSize="13px" color="text.secondary">
                {t("Don't have an account?")}
              </Typography>
              <Typography
                id="signin-signup-link"
                component="span"
                onClick={handleSignUp}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("Sign Up")}
              </Typography>
            </Box>
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    </form>
  );
};

export default SignInForm;
