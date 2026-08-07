import React from "react";
import { Box } from "@mui/material";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { t } from "i18next";
import { Grid, InputAdornment, NoSsr, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getLanguage } from "helper-functions/getLanguage";
import { User, Mail, Lock, Users } from "lucide-react";

const SignUpForm = ({
  configData,
  handleOnChange,
  passwordHandler,
  fNameHandler,
  lNameHandler,
  confirmPasswordHandler,
  emailHandler,
  ReferCodeHandler,
  signUpFormik,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const theme = useTheme();
  const showRefer =
    configData?.customer_wallet_status === 1 &&
    configData?.ref_earning_status === 1;

  const fieldIconSx = (touched, valid) =>
    touched && valid ? theme.palette.primary.main : alpha(theme.palette.neutral[500], 0.4);

  return (
    <NoSsr>
      <Grid container spacing={1.25}>
        {/* Row: User name (+ optional refer on md+) */}
        <Grid
          item
          xs={12}
          md={showRefer ? 6 : 12}
        >
          <CustomTextFieldWithFormik
            compact
            required
            id="name"
            label={t("User Name")}
            placeholder={t("Enter user name")}
            touched={signUpFormik.touched.name}
            errors={signUpFormik.errors.name}
            fieldProps={{
              ...signUpFormik.getFieldProps("name"),
              autoComplete: "nickname",
            }}
            onChangeHandler={fNameHandler}
            value={signUpFormik.values.name}
            startIcon={
              <InputAdornment position="start">
                <User
                  size={18}
                  color={fieldIconSx(
                    signUpFormik.touched.name,
                    !signUpFormik.errors.name
                  )}
                />
              </InputAdornment>
            }
          />
        </Grid>
        {showRefer && (
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              compact
              label={t("Refer Code (Optional)")}
              id="ref_code"
              touched={signUpFormik.touched.ref_code}
              errors={signUpFormik.errors.ref_code}
              fieldProps={{
                ...signUpFormik.getFieldProps("ref_code"),
                autoComplete: "off",
              }}
              onChangeHandler={ReferCodeHandler}
              value={signUpFormik.values.ref_code}
              placeholder={t("Refer Code")}
              startIcon={
                <InputAdornment position="start">
                  <Users
                    size={18}
                    color={fieldIconSx(
                      signUpFormik.touched.ref_code,
                      !signUpFormik.errors.ref_code
                    )}
                  />
                </InputAdornment>
              }
            />
          </Grid>
        )}

        {/* Email */}
        <Grid item xs={12}>
          <CustomTextFieldWithFormik
            compact
            required
            id="email"
            label={t("Email")}
            placeholder={t("Email")}
            touched={signUpFormik.touched.email}
            errors={signUpFormik.errors.email}
            fieldProps={{
              ...signUpFormik.getFieldProps("email"),
              autoComplete: "email",
            }}
            onChangeHandler={emailHandler}
            value={signUpFormik.values.email}
            startIcon={
              <InputAdornment position="start">
                <Mail
                  size={18}
                  color={fieldIconSx(
                    signUpFormik.touched.email,
                    !signUpFormik.errors.email
                  )}
                />
              </InputAdornment>
            }
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12}>
          <Box sx={{ width: "100%", overflow: "visible", paddingTop: "6px" }}>
            <CustomPhoneInput
              alignWithMuiField
              required
              value={signUpFormik.values.phone}
              onHandleChange={handleOnChange}
              initCountry={configData?.country}
              touched={signUpFormik.touched.phone}
              errors={signUpFormik.errors.phone}
              lanDirection={lanDirection}
              height="45px"
              borderRadius="10px"
            />
          </Box>
        </Grid>

        {/* Password + Confirm */}
        <Grid item xs={12}>
          <Grid
            container
            spacing={{ xs: 1.25, sm: 2 }}
            alignItems="flex-start"
            sx={{
              width: "100%",
              m: 0,
              "& > .MuiGrid-item": {
                display: "flex",
                alignItems: "flex-start",
              },
            }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextFieldWithFormik
                compact
                required
                id="password"
                type="password"
                label={t("Password")}
                placeholder={t("Minimum 8 characters")}
                touched={signUpFormik.touched.password}
                errors={signUpFormik.errors.password}
                fieldProps={{
                  ...signUpFormik.getFieldProps("password"),
                  autoComplete: "new-password",
                }}
                onChangeHandler={passwordHandler}
                value={signUpFormik.values.password}
                startIcon={
                  <InputAdornment position="start">
                    <Lock
                      size={18}
                      color={fieldIconSx(
                        signUpFormik.touched.password,
                        !signUpFormik.errors.password
                      )}
                    />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextFieldWithFormik
                compact
                required
                id="confirm_password"
                type="password"
                label={t("Confirm Password")}
                placeholder={t("Re-enter your password")}
                touched={signUpFormik.touched.confirm_password}
                errors={signUpFormik.errors.confirm_password}
                fieldProps={{
                  ...signUpFormik.getFieldProps("confirm_password"),
                  autoComplete: "new-password",
                }}
                onChangeHandler={confirmPasswordHandler}
                value={signUpFormik.values.confirm_password}
                startIcon={
                  <InputAdornment position="start">
                    <Lock
                      size={18}
                      color={fieldIconSx(
                        signUpFormik.touched.confirm_password,
                        !signUpFormik.errors.confirm_password
                      )}
                    />
                  </InputAdornment>
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </NoSsr>
  );
};

export default SignUpForm;
