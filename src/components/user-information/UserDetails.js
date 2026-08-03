import React from "react";
import { Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import {
  alpha,
  Avatar,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { CustomDateFormat } from "../date-and-time-formators/CustomDateFormat";
import { useTranslation } from "react-i18next";
import { getUserDisplayName, getUserInitials } from "helper-functions/userDisplay";
import { resolveImageSrc } from "helper-functions/resolveImageSrc";

const UserDetails = ({
  data,
  page,
  deleteUserHandler,
  isLoadingDelete,
  setAccountDeleteStatus,
  accountDeleteStatus,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2.5}
        position="relative"
      >
        <Stack
          width={{ xs: page === "inbox" ? "50px" : "100px", md: "140px" }}
          height={{ xs: page === "inbox" ? "50px" : "100px", md: "140px" }}
          sx={{
            border: "2px solid",
            borderColor: (theme) => theme.palette.neutral[100],
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.dark, 0.8),
            overflow: "hidden",
          }}
        >
          {resolveImageSrc(data?.image_full_url) ? (
            <CustomImageContainer
              src={resolveImageSrc(data?.image_full_url)}
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
                fontSize: { xs: "1.25rem", md: "2.5rem" },
                bgcolor: (th) => alpha(th.palette.primary.main, 0.25),
                color: "primary.main",
                borderRadius: "50%",
              }}
            >
              {getUserInitials(data)}
            </Avatar>
          )}
        </Stack>
        <Stack justifyContent="start" width="150px">
          <Typography fontWeight="600" fontSize="18px">
            {data ? (
              getUserDisplayName(data) || t("Profile")
            ) : (
              <Skeleton variant="text" width="200px" height="30px" />
            )}
          </Typography>
          <Typography variant="body" color={theme.palette.neutral[400]}>
            {t("Join")} {CustomDateFormat(data?.created_at)}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default UserDetails;
