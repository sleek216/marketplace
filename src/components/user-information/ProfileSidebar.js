import { alpha, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { Headphones } from "lucide-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { getToken } from "helper-functions/getToken";
import { useState } from "react";
import DeleteAccount from "./DeleteAccount";
import CustomModal from "../modal";

const ProfileSidebar = ({
  page,
  menuData,
  handlePage,
  setEditProfile,
  deleteUserHandler,
  isLoadingDelete,
  accountDeleteStatus,
  setAccountDeleteStatus,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { configData, modules } = useSelector((state) => state.configData);
  const [deleteModal, setDeleteModal] = useState(false);
  const activePage = (page || "profile-settings").split("?")[0];
  const tabMenu = menuData?.filter((item) => item?.id !== 10);

  const handleClick = (item) => {
    handlePage(item);
    setEditProfile?.(false);
  };

  const handleContactSupport = () => {
    router.push("/help-and-support");
  };

  return (
    <Stack
      spacing={2}
      sx={{
        position: { md: "sticky" },
        top: { md: 100 },
        alignSelf: "flex-start",
        zIndex: 5,
        width: "100%",
        maxHeight: { md: "calc(100vh - 116px)" },
        overflowY: { md: "auto" },
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        // Hide scrollbar but keep scroll if menu is very tall
        scrollbarWidth: "thin",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          overflow: "hidden",
          boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.04)}`,
        }}
      >
        <Stack spacing={0.5} sx={{ p: 1.25 }}>
          {tabMenu?.map((item) => {
            if (
              (configData?.customer_wallet_status === 0 && item.id === 4) ||
              (configData?.loyalty_point_status === 0 && item.id === 5) ||
              (configData?.ref_earning_status === 0 && item.id === 6) ||
              (!modules?.find((m) => m?.module_type === "rental") &&
                item.id === 3) ||
              (modules?.find((m) => m?.module_type === "rental")?.status ===
                0 &&
                item.id === 3)
            ) {
              return null;
            }

            const isActive = item?.name === activePage;
            return (
              <Box
                key={item.id}
                component="button"
                type="button"
                onClick={() => handleClick(item)}
                sx={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.5,
                  py: 1.15,
                  borderRadius: "2px",
                  borderLeft: isActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.neutral[600],
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    color: theme.palette.primary.main,
                  },
                  "& svg": {
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                  },
                }}
              >
                {item?.icon}
                <Typography
                  fontSize="13.5px"
                  fontWeight={isActive ? 700 : 500}
                  sx={{ textTransform: "capitalize", lineHeight: 1.2 }}
                >
                  {t(item?.name.replace(/-/g, " "))}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        {getToken() && activePage === "profile-settings" && (
          <Box
            sx={{
              px: 1.25,
              pb: 1.25,
              pt: 0.5,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
            }}
          >
            <Button
              fullWidth
              onClick={() => setDeleteModal(true)}
              sx={{
                color: "error.main",
                textTransform: "none",
                fontSize: "12.5px",
                fontWeight: 700,
                borderRadius: "2px",
                py: 1,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                bgcolor: alpha(theme.palette.error.main, 0.04),
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              {t("Delete your account")}
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          borderRadius: "2px",
          p: 2,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "2px",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Headphones size={18} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={700} fontSize="14px" color="text.primary">
              {t("Need Help?")}
            </Typography>
            <Typography
              fontSize="12px"
              color="text.secondary"
              sx={{ mt: 0.35, mb: 1.1, lineHeight: 1.4 }}
            >
              {t("Our support team is here for you")}
            </Typography>
            <Button
              onClick={handleContactSupport}
              size="small"
              sx={{
                px: 0,
                minWidth: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "12.5px",
                color: "primary.main",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              {t("Contact Support")} →
            </Button>
          </Box>
        </Stack>
      </Box>

      <CustomModal
        openModal={deleteModal}
        handleClose={() => {
          setDeleteModal(false);
          setAccountDeleteStatus?.(true);
        }}
      >
        <DeleteAccount
          isLoading={isLoadingDelete}
          handleClose={() => {
            setDeleteModal(false);
            setAccountDeleteStatus?.(true);
          }}
          deleteUserHandler={deleteUserHandler}
          accountDeleteStatus={accountDeleteStatus}
        />
      </CustomModal>
    </Stack>
  );
};

export default ProfileSidebar;
