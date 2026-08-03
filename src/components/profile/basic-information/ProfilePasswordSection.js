import React, { useMemo, useState } from "react";
import {
  alpha,
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Eye as Visibility,
  EyeOff as VisibilityOff,
  LockKeyhole,
} from "lucide-react";
import useUpdateProfile from "../../../api-manage/hooks/react-query/profile/useUpdateProfile";
import { convertValuesToFormData } from "./BasicInformationForm";
import toast from "react-hot-toast";
import { onSingleErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import useCustomerProfileSync from "hooks/useCustomerProfileSync";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Stack } from "@mui/system";
import { SaveButton } from "./Profile.style";

const fieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "2px",
    bgcolor: (theme) => alpha(theme.palette.neutral[200], 0.35),
  },
};

const ProfilePasswordSection = ({ configData, isSmall, embedded }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const compact = typeof isSmall === "boolean" ? isSmall : isSmallScreen;
  const { data, refetch } = useCustomerProfileSync();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        password: Yup.string()
          .min(6, t("Password must be at least 6 characters"))
          .required(t("Password is required")),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("password"), null], t("Passwords must match"))
          .required(t("Confirm password is required")),
      }),
    [t]
  );

  const { mutate: profileUpdateByMutate, isLoading } = useUpdateProfile();

  const profileFormik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: (values, helpers) => {
      if (!data) return;
      const merged = {
        name: data?.f_name
          ? `${data.f_name} ${data.l_name ? data.l_name : ""}`.trim()
          : "",
        email: data.email ? data.email : "",
        phone: data.phone ? data.phone : "",
        image: data.image_full_url ? data.image_full_url : "",
        password: values.password,
      };
      const formData = convertValuesToFormData(merged, {}, null, {
        omitPassword: false,
      });
      profileUpdateByMutate(formData, {
        onSuccess: (response) => {
          if (response) {
            toast.success(response?.message);
            helpers.resetForm();
            refetch();
          }
        },
        onError: onSingleErrorResponse,
      });
    },
  });

  if (configData?.centralize_login?.manual_login_status !== 1) {
    return null;
  }

  if (!data) {
    return null;
  }

  const passwordForm = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 1.75, md: 2 } }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "2px",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <LockKeyhole size={20} strokeWidth={2.1} />
        </Box>
        <Box minWidth={0}>
          <Typography
            fontSize={{ xs: "16px", md: "18px" }}
            fontWeight={700}
            color={theme.palette.primary.main}
            lineHeight={1.25}
          >
            {t("Change Password")}
          </Typography>
          <Typography
            fontSize="12.5px"
            color={theme.palette.neutral[500]}
            sx={{ mt: 0.2 }}
          >
            {t("Keep your account secure with a strong password")}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.8) }} />

      <Box
        component="form"
        noValidate
        onSubmit={profileFormik.handleSubmit}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 1.75, md: 2.5 },
          py: { xs: 1.75, md: 2.25 },
        }}
      >
        <Grid container spacing={2} sx={{ flex: 1 }}>
          <Grid item xs={12}>
            <TextField
              required
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
              id="profile-password-new"
              variant="outlined"
              placeholder={t("New Password")}
              value={profileFormik.values.password}
              onChange={profileFormik.handleChange}
              name="password"
              label={t("New Password")}
              type={showPassword ? "text" : "password"}
              error={Boolean(
                profileFormik.touched.password && profileFormik.errors.password
              )}
              helperText={
                profileFormik.touched.password && profileFormik.errors.password
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? (
                        <Visibility size={18} />
                      ) : (
                        <VisibilityOff size={18} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { height: "46px" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              InputLabelProps={{ shrink: true }}
              required
              sx={fieldSx}
              id="profile-password-confirm"
              label={t("Confirm New Password")}
              variant="outlined"
              placeholder={t("Confirm New Password")}
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={profileFormik.values.confirm_password}
              onChange={profileFormik.handleChange}
              error={Boolean(
                profileFormik.touched.confirm_password &&
                  profileFormik.errors.confirm_password
              )}
              helperText={
                profileFormik.touched.confirm_password &&
                profileFormik.errors.confirm_password
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setConfirmShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <Visibility size={18} />
                      ) : (
                        <VisibilityOff size={18} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { height: "46px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: "auto" }}>
            <SaveButton
              variant="contained"
              type="submit"
              loading={isLoading}
              fullWidth
              sx={{
                borderRadius: "2px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                mt: 0.5,
              }}
            >
              {t("Update Password")}
            </SaveButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  if (embedded) {
    return (
      <Box
        sx={{
          height: "100%",
          bgcolor: "background.paper",
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.04)}`,
          overflow: "hidden",
        }}
      >
        {passwordForm}
      </Box>
    );
  }

  return (
    <CustomPaperBigCard padding="0px" noboxshadow={compact ? "" : "true"}>
      <CustomStackFullWidth>{passwordForm}</CustomStackFullWidth>
    </CustomPaperBigCard>
  );
};

export default ProfilePasswordSection;
