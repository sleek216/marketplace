import { Button, Popover, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { MoreVertical as MoreVertIcon } from "lucide-react";
import {
  UserProfileTab,
  UserProfileTabs,
} from "styled-components/CustomStyles.style";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getToken } from "helper-functions/getToken";
import DeleteAccount from "./DeleteAccount";
import CustomModal from "../modal";

const ProfileTab = ({
  page,
  menuData,
  marginright,
  fontSize,
  padding,
  handlePage,
  borderRadius,
  deleteUserHandler,
  isLoadingDelete,
  accountDeleteStatus,
  setAccountDeleteStatus,
  setEditProfile,
  isMobileTab,
}) => {
  const theme = useTheme();
  const tabMenu = menuData?.filter((item) => item?.id !== 10);
  const dispatch = useDispatch();
  const router = useRouter();
  const { configData ,modules} = useSelector((state) => state.configData);
  const handleClick = (item) => {
    handlePage(item);
    setEditProfile?.(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleClickDelete = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDeleteModal(false);
    setAccountDeleteStatus(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { query } = router;

  return (
    <Stack
      width="100%"
      padding={{
        xs: "8px 8px 0 8px",
        md: padding ? padding : "12px 12px 8px 12px",
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <UserProfileTabs
        value={page}
        indicatorColor="none"
        variant="scrollable"
        scrollButtons="auto"
        isMobileTab={isMobileTab}
      >
        {tabMenu?.map((item, index) => {
          if (
            (configData?.customer_wallet_status === 0 && item.id === 4) ||
            (configData?.loyalty_point_status === 0 && item.id === 5) ||
            (configData?.ref_earning_status === 0 && item.id === 6) || 
            (!modules?.find((item) => item?.module_type === 'rental') && item.id === 3) || (modules?.find((item) => item?.module_type === 'rental')?.status === 0 && item.id === 3)
          ) {
            return null;
          } else {
            return (
              <Box key={index}>
                <UserProfileTab
                  marginright={marginright}
                  fontSize={fontSize}
                  item={item}
                  page={page.split("?")[0]}
                  onClick={() => handleClick(item)}
                  value={page}
                  borderRadius={borderRadius || "2px"}
                  isMobileTab={isMobileTab}
                >
                  <Typography
                    fontWeight={
                      item?.name === page.split("?")[0] ? "700" : "500"
                    }
                    color={
                      item?.name === page.split("?")[0]
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary
                    }
                    sx={{
                      transition: "color 0.2s ease",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                    fontSize={{
                      xs: isMobileTab ? "11px" : "12px",
                      md:
                        item?.name === page.split("?")[0]
                          ? "14px"
                          : fontSize
                          ? fontSize
                          : "13px",
                    }}
                  >
                    {t(item?.name.replace(/-/g, " "))}
                  </Typography>
                </UserProfileTab>
              </Box>
            );
          }
        })}
      </UserProfileTabs>
      {getToken() && query?.page === "profile-settings" && (
        <MoreVertIcon
          aria-describedby={id}
          variant="contained"
          onClick={handleClickDelete}
          sx={{ cursor: "pointer" }}
        />
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock={true}
        disableRestoreFocus
        sx={{ zIndex: "100" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Button
          sx={{ p: 2, color: (theme) => theme.palette.error.main }}
          onClick={() => setDeleteModal(true)}
        >
          {t("Delete your account")}
        </Button>
      </Popover>
      <CustomModal openModal={deleteModal} handleClose={handleClose}>
        <DeleteAccount
          isLoading={isLoadingDelete}
          handleClose={handleClose}
          deleteUserHandler={deleteUserHandler}
          accountDeleteStatus={accountDeleteStatus}
        />
      </CustomModal>
    </Stack>
  );
};

export default ProfileTab;
//
