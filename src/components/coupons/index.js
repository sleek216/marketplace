import React, { useState } from "react";
import useGetCoupons from "../../api-manage/hooks/react-query/useGetCoupons";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/nodata.png";
import Coupon from "./Coupon";
import CustomShimmerCard from "./Shimmer";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useGetCouponLists } from "api-manage/hooks/react-query/useCouponsLists";
import { getToken } from "helper-functions/getToken";
import { Ticket } from "lucide-react";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

const Coupons = () => {
  const [copy, setCopy] = useState(null);

  const isRentalModule = getCurrentModuleType() === "rental";
  const hasToken =
    typeof window !== "undefined" && Boolean(getToken());

  const {
    data: rentalCouponData,
    isLoading: isRentalCouponLoading,
    isFetching: isRentalCouponFetching,
  } = useGetCouponLists({ enabled: isRentalModule && hasToken });
  const { data, isLoading, isFetching } = useGetCoupons({
    enabled: !isRentalModule && hasToken,
  });

  const couponData = isRentalModule ? rentalCouponData ?? [] : data ?? [];
  const isCouponLoading = isRentalModule ? isRentalCouponLoading : isLoading;
  const isCouponFetching = isRentalModule ? isRentalCouponFetching : isFetching;

  return (
    <Box sx={{ minHeight: "60vh" }}>
      <ProfileSectionHeader
        icon={Ticket}
        title={t("Coupons")}
        subtitle={t("Browse and apply available discount coupons")}
      />
      <Box sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          {couponData &&
            couponData?.length > 0 &&
            couponData?.map((coupon, index) => {
              return (
                <Grid item sm={6} xs={12} md={4} key={index}>
                  <Coupon
                    coupon={coupon}
                    isLoading={isCouponLoading}
                    setCopy={setCopy}
                    copy={copy}
                  />
                </Grid>
              );
            })}
          {couponData && !isCouponFetching && couponData.length === 0 && (
            <CustomEmptyResult label="No Coupon Found" image={nodataimage} />
          )}
          {(isCouponLoading || isCouponFetching) && <CustomShimmerCard />}
        </Grid>
      </Box>
    </Box>
  );
};

Coupons.propTypes = {};

export default Coupons;
