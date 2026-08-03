import { Grid } from "@mui/material";
import React from "react";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import ProfileStatistics from "../profile/ProfileStatistics";

const UserDashBoard = ({ data, isLoading }) => {
  return (
    <Grid container alignItems="stretch" spacing={1.25} sx={{ width: "100%", m: 0 }}>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.member_since_days}
          title="Days Since Joining"
          pathname="profile-settings"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={getAmountWithSign(data?.wallet_balance)}
          title="Amount in Wallet"
          pathname="wallet"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.order_count}
          title="Total Orders"
          pathname="my-orders"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <ProfileStatistics
          isLoading={isLoading}
          value={data?.loyalty_point}
          title="Loyalty Points"
          pathname="loyalty-points"
        />
      </Grid>
    </Grid>
  );
};

export default UserDashBoard;
