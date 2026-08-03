import React from "react";
import {
  alpha,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BasicInformationForm from "./BasicInformationForm";
import { Box, Stack, styled } from "@mui/system";
import {
  AlertCircle,
  CheckCircle2,
  Edit as EditIcon,
  UserRound,
} from "lucide-react";
import AddAddressComponent from "../../address/add-new-address/AddAddressComponent";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import {
  formatPhoneNumber,
  isVerificationFlagOn,
} from "utils/CustomFunctions";

export const SmallDeviceIconButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.neutral[400],
  borderRadius: "2px",
  padding: "6px",
}));

const DetailRow = ({ label, value, action, showDivider = true }) => {
  const theme = useTheme();
  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 0.75, sm: 3 }}
        sx={{ py: { xs: 1.75, md: 2.1 } }}
      >
        <Typography
          fontSize="13px"
          fontWeight={500}
          color={theme.palette.neutral[500]}
          sx={{ minWidth: { sm: 140 }, flexShrink: 0 }}
        >
          {label}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}
        >
          <Typography
            fontWeight={600}
            fontSize={{ xs: "14px", md: "15px" }}
            color={theme.palette.neutral[900]}
            sx={{ wordBreak: "break-word", textAlign: { sm: "right" } }}
          >
            {value}
          </Typography>
          {action}
        </Stack>
      </Stack>
      {showDivider && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.55) }} />
      )}
    </>
  );
};

const VerifyAction = ({ label, onClick }) => {
  const theme = useTheme();
  return (
    <Button
      size="small"
      onClick={onClick}
      startIcon={<AlertCircle size={14} strokeWidth={2.2} />}
      sx={{
        py: 0.45,
        px: 1.25,
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "2px",
        color: theme.palette.error.main,
        border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
        bgcolor: alpha(theme.palette.error.main, 0.04),
        boxShadow: "none",
        "&:hover": {
          bgcolor: alpha(theme.palette.error.main, 0.08),
          borderColor: theme.palette.error.main,
          boxShadow: "none",
        },
      }}
    >
      {label}
    </Button>
  );
};

const VerifiedTag = ({ label }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ color: theme.palette.success.main }}
    >
      <CheckCircle2 size={15} strokeWidth={2.2} />
      <Typography fontSize="12px" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
};

const BasicInformation = (props) => {
  const {
    data,
    t,
    refetch,
    setEditProfile,
    editProfile,
    setAddAddress,
    addAddress,
    editAddress,
    addressRefetch,
    setEditAddress,
  } = props;
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const handleClick = () => {
    setEditProfile((prvState) => !prvState);
  };

  const fullName =
    `${data?.f_name || ""} ${data?.l_name || ""}`.trim() || "—";
  const phoneVerified = Number(data?.is_phone_verified) === 1;
  const emailVerified = isVerificationFlagOn(data?.is_email_verified);
  const phoneVerifyEnabled =
    configData?.centralize_login?.phone_verification_status === 1;
  const emailVerifyEnabled =
    configData?.centralize_login?.email_verification_status === 1;

  return (
    <>
      <Box sx={{ p: 0 }}>
        {addAddress ? (
          <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <AddAddressComponent
              setAddAddress={setAddAddress}
              configData={configData}
              userData={data}
              editAddress={editAddress}
              addressRefetch={addressRefetch}
              setEditAddress={setEditAddress}
            />
          </Box>
        ) : editProfile ? (
          <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <BasicInformationForm
              data={data}
              configData={configData}
              setEditProfile={setEditProfile}
              handleClick={handleClick}
              t={t}
              refetch={refetch}
            />
          </Box>
        ) : (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1.5}
              sx={{ px: { xs: 2, md: 2.75 }, py: { xs: 2, md: 2.25 } }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} minWidth={0}>
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
                  <UserRound size={20} strokeWidth={2.1} />
                </Box>
                <Box minWidth={0}>
                  <Typography
                    fontSize={{ xs: "16px", md: "18px" }}
                    fontWeight={700}
                    color={theme.palette.primary.main}
                    lineHeight={1.25}
                  >
                    {t("Personal Details")}
                  </Typography>
                  <Typography
                    fontSize="12.5px"
                    color={theme.palette.neutral[500]}
                    sx={{ mt: 0.25 }}
                  >
                    {t("Manage your personal information")}
                  </Typography>
                </Box>
              </Stack>

              {!isSmall ? (
                <Button
                  onClick={handleClick}
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon size={15} />}
                  sx={{
                    fontSize: "13px",
                    borderRadius: "2px",
                    px: 2,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
                  }}
                >
                  {t("Edit Profile")}
                </Button>
              ) : (
                <SmallDeviceIconButton onClick={handleClick}>
                  <EditIcon size={16} />
                </SmallDeviceIconButton>
              )}
            </Stack>

            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />

            <Box sx={{ px: { xs: 2, md: 2.75 }, py: { xs: 0.5, md: 0.75 } }}>
              {data ? (
                <>
                  <DetailRow label={t("User Name")} value={fullName} />
                  <DetailRow
                    label={t("Phone Number")}
                    value={
                      data?.phone ? formatPhoneNumber(data?.phone) : "—"
                    }
                    action={
                      phoneVerified ? (
                        <VerifiedTag label={t("Verified")} />
                      ) : phoneVerifyEnabled ? (
                        <VerifyAction
                          label={t("Verify Phone")}
                          onClick={handleClick}
                        />
                      ) : null
                    }
                  />
                  <DetailRow
                    label={t("Email Address")}
                    value={data?.email || "—"}
                    showDivider={false}
                    action={
                      emailVerified ? (
                        <VerifiedTag label={t("Verified")} />
                      ) : emailVerifyEnabled ? (
                        <VerifyAction
                          label={t("Verify Email")}
                          onClick={handleClick}
                        />
                      ) : null
                    }
                  />
                </>
              ) : (
                <Stack spacing={2} py={2}>
                  <Skeleton variant="rounded" height={28} />
                  <Skeleton variant="rounded" height={28} />
                  <Skeleton variant="rounded" height={28} />
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

BasicInformation.propTypes = {};

export default BasicInformation;
