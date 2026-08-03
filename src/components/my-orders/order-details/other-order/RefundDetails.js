import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import Refund from "./Refund";
import { isRefundPipelineStatus } from "utils/orderStatus";

const RefundDetails = ({ trackOrderData, configData, t }) => {
  const status = trackOrderData?.order_status;

  if (!trackOrderData?.refund && status !== "refund_request_canceled") {
    return null;
  }

  if (status === "refund_request_canceled") {
    return (
      <Grid item xs={12} align="left">
        <Refund
          t={t}
          title="Refund cancellation note:"
          note={
            trackOrderData.refund?.admin_note ||
            trackOrderData?.refund_cancellation_note
          }
          configData={configData}
        />
      </Grid>
    );
  }

  if (isRefundPipelineStatus(status) || status === "refunded" || status === "refund_resolved") {
    return (
      <Grid item xs={12} align="left">
        <Refund
          t={t}
          title="Refund request note:"
          note={trackOrderData?.refund?.customer_note}
          reason={trackOrderData?.refund?.customer_reason}
          image={trackOrderData?.refund?.image}
          configData={configData}
        />
      </Grid>
    );
  }

  return null;
};

RefundDetails.propTypes = {};

export default RefundDetails;
