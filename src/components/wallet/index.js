/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useGetProfile from "../../api-manage/hooks/react-query/profile/useGetProfile";
import { setUser } from "../../redux/slices/profileInfo";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import wallet from "./assets/new-wallet.png";

import { Info as InfoOutlinedIcon, Wallet as WalletIcon } from "lucide-react";
import { t } from "i18next";
import useGetWalletTransactionsList from "../../api-manage/hooks/react-query/useGetWalletTransactionsList";
import TransactionHistory from "../transaction-history";
import HowToUse from "./HowToUse";
import TransactionHistoryMobile from "./TransactionHistoryMobile";
import WalletBoxComponent from "./WalletBoxComponent";
import WalletFundBonus from "./WalletFundBonus";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

export const WallatBox = styled(Box)(({ theme, nobackground }) => ({
  display: "flex",
  height: "123px",
  background: nobackground === "true" ? "inherit" : theme.palette.primary.main,
  borderRadius: "2px",
  [theme.breakpoints.up("xs")]: {
    width: "100%",
    maxWidth: "343px",
  },
  [theme.breakpoints.up("md")]: {
    width: "330px",
  },
}));

const Wallet = (props) => {
  const { configData } = props;

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [openPopover, setOpenPopover] = useState(false);
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
  };
  const {
    data: userData,
    refetch: profileRefetch,
    isLoading: userDataLoading,
  } = useGetProfile(userOnSuccessHandler);

  const [offset, setOffset] = useState(1);

  const [transactionType, setTransactionType] = useState("all");

  let pageParams = { offset: offset, type: transactionType };
  const { data, refetch, isLoading, isFetching } =
    useGetWalletTransactionsList(pageParams);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await refetch();
    await profileRefetch();
  };

  useEffect(() => {
    refetch();
  }, [transactionType, offset]);

  const steps = [
    {
      label: "Earn money to your wallet by completing the offer & challenged",
    },
    {
      label: "Convert your loyalty points into wallet money",
    },
    {
      label: "Admin also reward their top customers with wallet money",
    },
    {
      label: "Send your wallet money while order",
    },
  ];
  return (
    <CustomStackFullWidth sx={{ minHeight: "60vh" }}>
      <ProfileSectionHeader
        icon={WalletIcon}
        title={t("Wallet")}
        subtitle={t("Manage your balance and transactions")}
      />
      <Box sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid
            item
            xs={12}
            md={4.5}
            sx={{
              borderRight: {
                md: `1px solid ${theme.palette.divider}`,
              },
              pr: { md: 3 },
            }}
          >
            <Stack spacing={2.5} maxWidth={{ md: 338 }}>
              {isSmall && (
                <Stack direction="row" justifyContent="flex-end">
                  <InfoOutlinedIcon
                    size={18}
                    onClick={() => setOpenPopover(true)}
                    style={{ cursor: "pointer" }}
                  />
                </Stack>
              )}
              <WalletBoxComponent
                title={t("Total Balance")}
                balance={userData && userData?.wallet_balance}
                image={wallet}
                userDataLoading={userDataLoading}
              />
              {!isSmall && <HowToUse steps={steps} />}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7.5} sx={{ pl: { md: 1 } }}>
            <WalletFundBonus />
            {isSmall ? (
              <TransactionHistoryMobile
                data={data}
                isLoading={isLoading}
                value={transactionType}
                setValue={setTransactionType}
                offset={offset}
                setOffset={setOffset}
                isFetching={isFetching}
              />
            ) : (
              <TransactionHistory
                data={data}
                isLoading={isLoading}
                value={transactionType}
                setValue={setTransactionType}
                offset={offset}
                setOffset={setOffset}
                isFetching={isFetching}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorRef}
        onClose={() => setOpenPopover(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        open={openPopover}
        PaperProps={{
          sx: {
            borderRadius: "2px",
            padding: "20px",
          },
        }}
        transitionDuration={2}
      >
        <Stack>
          <HowToUse steps={steps} />
        </Stack>
      </Popover>
    </CustomStackFullWidth>
  );
};

Wallet.propTypes = {};

export default Wallet;
