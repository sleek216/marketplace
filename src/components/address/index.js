import React, { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import {
  Button,
  Divider,
  Grid,
  NoSsr,
  styled,
  Typography,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "./assets/Group 1597886316.svg";
import Shimmer from "./Shimmer";
import AddressCard from "./address-card";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { SmallDeviceIconButton } from "../profile/basic-information";
import { useTheme } from "@emotion/react";
import { setAllSaveAddress } from "redux/slices/storedData";

export const GrayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "13px",
  fontWeight: 600,
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: "2px",
  padding: "6px 14px",
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.dark,
    boxShadow: "none",
  },
}));

const Address = (props) => {
  const {
    configData,
    setAddAddress,
    setEditAddress,
    data,
    refetch,
    isLoading,
    compactLayout,
  } = props;
  const { AllSaveAddress } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { openAddressModal } = useSelector((state) => state.addressModel);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (AllSaveAddress?.length === 0) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setAllSaveAddress(data?.addresses));
    }
  }, [data]);

  const handleClick = () => {
    setEditAddress(null);
    setAddAddress((prvState) => !prvState);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}
        sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 1.75, md: 2 } }}
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
            <MapPin size={20} strokeWidth={2.1} />
          </Box>
          <Box minWidth={0}>
            <Typography
              fontSize={{ xs: "16px", md: "18px" }}
              fontWeight={700}
              color={theme.palette.primary.main}
              lineHeight={1.25}
            >
              {t("My Addresses")}
            </Typography>
            <Typography
              fontSize="12.5px"
              color={theme.palette.neutral[500]}
              sx={{ mt: 0.2 }}
            >
              {t("Manage your saved delivery addresses")}
            </Typography>
          </Box>
        </Stack>

        {isSmall ? (
          <SmallDeviceIconButton onClick={handleClick}>
            <Plus size={18} />
          </SmallDeviceIconButton>
        ) : (
          <GrayButton
            onClick={handleClick}
            variant="outlined"
            startIcon={<Plus size={15} />}
          >
            {t("Add Address")}
          </GrayButton>
        )}
      </Stack>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.8) }} />

      <Box
        sx={{
          flex: 1,
          px: { xs: 1.75, md: 2.5 },
          py: { xs: 1.75, md: 2.25 },
        }}
      >
        <NoSsr>
          {isLoading ? (
            <Shimmer />
          ) : AllSaveAddress && AllSaveAddress?.length > 0 ? (
            <Grid container spacing={1.5}>
              {AllSaveAddress?.map((item) => (
                <Grid
                  item
                  key={item.id}
                  xs={12}
                  sm={compactLayout ? 12 : 6}
                  md={compactLayout ? 12 : 6}
                >
                  <AddressCard
                    item={item}
                    refetch={refetch}
                    configData={configData}
                    dispatch={dispatch}
                    openAddressModal={openAddressModal}
                    setEditAddress={setEditAddress}
                    edit={edit}
                    setAddAddress={setAddAddress}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              width="100%"
              minHeight={140}
            >
              <CustomEmptyResult
                label="No address found"
                image={nodata}
                width="128px"
                height="80"
              />
            </Stack>
          )}
        </NoSsr>
      </Box>
    </Box>
  );
};

Address.propTypes = {};

export default Address;
