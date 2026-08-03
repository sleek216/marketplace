import { useState } from "react";
import {
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import ProfileTab from "./ProfileTab";
import ProfileBody from "./ProfileBody";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHero from "./ProfileHero";
import Address from "../address";
import ProfilePasswordSection from "../profile/basic-information/ProfilePasswordSection";
import { menuData } from "../header/second-navbar/account-popover/menuData";
import Router from "next/router";
import { alpha, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import useGetAddressList from "../../api-manage/hooks/react-query/address/useGetAddressList";

const BodySection = ({
  page,
  configData,
  orderId,
  userToken,
  deleteUserHandler,
  isLoadingDelete,
  accountDeleteStatus,
  setAccountDeleteStatus,
  profileData,
  profileLoading,
  hideHero,
}) => {
  const [editProfile, setEditProfile] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isMobileInbox =
    isSmall &&
    (page === "inbox" || page === "my-orders" || page?.startsWith?.("my-orders"));
  const { data, isLoading, refetch } = useGetAddressList();
  const activePage = page || "profile-settings";

  const handleActivePage = (item) => {
    Router.push(
      {
        pathname: "/profile",
        query: { page: item?.name },
      },
      undefined,
      { shallow: true }
    );
  };

  const contentCardSx = {
    bgcolor: "background.paper",
    borderRadius: "2px",
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.04)}`,
    overflow: "hidden",
  };

  const mainContent = (
    <Stack spacing={3} width="100%">
      {/* Hero only on Profile Settings — other pages use their own section headers */}
      {!hideHero &&
        userToken &&
        !isSmall &&
        activePage === "profile-settings" && (
          <ProfileHero
            data={profileData}
            isLoading={profileLoading}
            page={activePage}
            onEditClick={() => setEditProfile(true)}
          />
        )}

      {isMobileInbox ? (
        <ProfileBody
          key={`${page}-${orderId || "no-order"}`}
          page={activePage}
          configData={configData}
          orderId={orderId}
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          addAddress={addAddress}
          setAddAddress={setAddAddress}
          editAddress={editAddress}
          refetch={refetch}
          setEditAddress={setEditAddress}
        />
      ) : (
        <Box sx={contentCardSx}>
          {isSmall && userToken && (
            <ProfileTab
              deleteUserHandler={deleteUserHandler}
              isLoadingDelete={isLoadingDelete}
              accountDeleteStatus={accountDeleteStatus}
              setAccountDeleteStatus={setAccountDeleteStatus}
              page={activePage}
              menuData={menuData}
              handlePage={handleActivePage}
              setEditProfile={setEditProfile}
            />
          )}
          <ProfileBody
            key={`${page}-${orderId || "no-order"}`}
            page={activePage}
            configData={configData}
            orderId={orderId}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            addAddress={addAddress}
            setAddAddress={setAddAddress}
            editAddress={editAddress}
            refetch={refetch}
            setEditAddress={setEditAddress}
          />
        </Box>
      )}

      {activePage === "profile-settings" && !editProfile && !addAddress && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
          width="100%"
          sx={{ mt: 0.5 }}
        >
          <Box
            sx={{
              ...contentCardSx,
              flex: 1,
              minWidth: 0,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Address
              configData={configData}
              addAddress={addAddress}
              setAddAddress={setAddAddress}
              setEditAddress={setEditAddress}
              data={data}
              refetch={refetch}
              isLoading={isLoading}
              compactLayout
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              width: { xs: "100%", md: "auto" },
              display: "flex",
              "& > *": { flex: 1, width: "100%" },
            }}
          >
            <ProfilePasswordSection
              configData={configData}
              isSmall={isSmall}
              embedded
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );

  if (isSmall || !userToken) {
    return (
      <CustomStackFullWidth
        spacing={2}
        sx={{
          width: "100%",
          overflowX: "hidden",
          ...(isMobileInbox && { gap: "0px !important" }),
        }}
      >
        {mainContent}
      </CustomStackFullWidth>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      alignItems="stretch"
      sx={{ overflow: "visible", m: 0, width: "100%" }}
    >
      <Grid
        item
        md={2.75}
        xs={12}
        sx={{
          overflow: "visible !important",
          position: "relative",
          pl: "0 !important",
        }}
      >
        <ProfileSidebar
          page={activePage}
          menuData={menuData}
          handlePage={handleActivePage}
          setEditProfile={setEditProfile}
          deleteUserHandler={deleteUserHandler}
          isLoadingDelete={isLoadingDelete}
          accountDeleteStatus={accountDeleteStatus}
          setAccountDeleteStatus={setAccountDeleteStatus}
        />
      </Grid>
      <Grid item md={9.25} xs={12} sx={{ minWidth: 0 }}>
        {mainContent}
      </Grid>
    </Grid>
  );
};

export default BodySection;
