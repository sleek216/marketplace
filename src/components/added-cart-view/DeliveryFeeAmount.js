import React from "react";
import { Skeleton, Typography } from "@mui/material";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const DeliveryFeeAmount = ({
  amount,
  loading,
  fontSize = "13px",
  fontWeight = 600,
  color,
}) => {
  if (loading) {
    return (
      <Skeleton
        variant="text"
        animation="wave"
        width={56}
        height={20}
        sx={{ display: "inline-block", transform: "none" }}
      />
    );
  }

  return (
    <Typography fontSize={fontSize} fontWeight={fontWeight} color={color}>
      {getAmountWithSign(amount)}
    </Typography>
  );
};

export default DeliveryFeeAmount;
