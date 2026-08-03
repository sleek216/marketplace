import React from "react";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AlertCircle, BadgeCheck, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CustomImageContainer from "../CustomImageContainer";
import { CustomDateFormat } from "../date-and-time-formators/CustomDateFormat";
import { getUserDisplayName, getUserInitials } from "helper-functions/userDisplay";
import { resolveImageSrc } from "helper-functions/resolveImageSrc";
import { isVerificationFlagOn } from "utils/CustomFunctions";
import UserDashBoard from "./UserDashBoard";

const ProfileHero = ({ data, isLoading, page, onEditClick }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const displayName = getUserDisplayName(data) || t("Profile");
  const imageSrc = resolveImageSrc(data?.image_full_url);
  const showStats = page === "profile-settings" || !page;

  const phoneVerificationRequired =
    configData?.centralize_login?.phone_verification_status === 1;
  const emailVerificationRequired =
    configData?.centralize_login?.email_verification_status === 1;

  const phoneVerified = Number(data?.is_phone_verified) === 1;
  const emailVerified = isVerificationFlagOn(data?.is_email_verified);

  const phoneOk = !phoneVerificationRequired || phoneVerified;
  const emailOk = !emailVerificationRequired || emailVerified;
  const isVerifiedMember = Boolean(data) && phoneOk && emailOk;

  return (
    <Box
      sx={{
        borderRadius: "2px",
        overflow: "hidden",
        background: `linear-gradient(115deg, ${alpha(
          theme.palette.primary.main,
          0.14
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 48%, ${alpha(
          "#6BA3D9",
          0.08
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        px: { xs: 2, md: 2.75 },
        py: { xs: 2, md: 2.5 },
      }}
    >
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2} minWidth={0}>
            <Box
              sx={{
                position: "relative",
                flexShrink: 0,
                cursor: onEditClick ? "pointer" : "default",
              }}
              onClick={onEditClick}
              role={onEditClick ? "button" : undefined}
              tabIndex={onEditClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onEditClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onEditClick();
                }
              }}
            >
              <Box
                sx={{
                  width: { xs: 76, md: 92 },
                  height: { xs: 76, md: 92 },
                  borderRadius: "50%",
                  border: `3px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 6px 18px ${alpha(
                    theme.palette.common.black,
                    0.12
                  )}`,
                  overflow: "hidden",
                  bgcolor: "primary.main",
                }}
              >
                {imageSrc ? (
                  <CustomImageContainer
                    src={imageSrc}
                    borderRadius="50%"
                    objectfit="cover"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: { xs: "1.5rem", md: "1.85rem" },
                      fontWeight: 700,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    {getUserInitials(data)}
                  </Avatar>
                )}
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  bottom: 2,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  display: "grid",
                  placeItems: "center",
                  color: "primary.main",
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.common.black,
                    0.14
                  )}`,
                }}
              >
                <Camera size={14} />
              </Box>
            </Box>

            <Stack spacing={0.65} minWidth={0}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "20px", md: "24px" }}
                color="text.primary"
                noWrap
              >
                {data ? (
                  displayName
                ) : (
                  <Skeleton variant="text" width={160} height={32} />
                )}
              </Typography>
              <Typography fontSize="13px" color="text.secondary">
                {data ? (
                  <>
                    {t("Member since")} {CustomDateFormat(data?.created_at)}
                  </>
                ) : (
                  <Skeleton variant="text" width={140} />
                )}
              </Typography>
              {data && (
                <Chip
                  size="small"
                  icon={
                    isVerifiedMember ? (
                      <BadgeCheck size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )
                  }
                  label={
                    isVerifiedMember
                      ? t("Verified Member")
                      : t("Verification Pending")
                  }
                  sx={{
                    alignSelf: "flex-start",
                    height: 24,
                    borderRadius: "2px",
                    fontWeight: 700,
                    fontSize: "11px",
                    bgcolor: isVerifiedMember
                      ? alpha(theme.palette.success.main, 0.14)
                      : alpha(theme.palette.warning.main, 0.16),
                    color: isVerifiedMember
                      ? theme.palette.success.dark
                      : theme.palette.warning.dark,
                    "& .MuiChip-icon": {
                      color: isVerifiedMember
                        ? theme.palette.success.dark
                        : theme.palette.warning.dark,
                      ml: "7px",
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Stack>

        {showStats && (
          <Box sx={{ width: "100%" }}>
            <UserDashBoard data={data} isLoading={isLoading} />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ProfileHero;
