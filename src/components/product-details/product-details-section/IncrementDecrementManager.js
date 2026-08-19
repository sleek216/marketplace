import React from "react";
import { alpha, Stack, Typography } from "@mui/material";
import { Minus as RemoveIcon, Plus as AddIcon } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import {
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import { t } from "i18next";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";
import { Box } from "@mui/system";

const R = "2px";

const MarketplaceQty = ({
  value,
  onDec,
  onInc,
  disabledDec,
  disabledInc,
}) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: 34,
        minWidth: 130,
        borderRadius: R,
        border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
        overflow: "hidden",
        bgcolor: alpha(theme.palette.grey[100], 0.9),
      }}
    >
      <Box
        component="button"
        type="button"
        disabled={disabledDec}
        onClick={onDec}
        sx={{
          all: "unset",
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          cursor: disabledDec ? "default" : "pointer",
          color: "text.secondary",
          opacity: disabledDec ? 0.4 : 1,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            color: "primary.main",
          },
        }}
      >
        <RemoveIcon size={15} />
      </Box>
      <Typography
        sx={{
          flex: 1,
          textAlign: "center",
          fontSize: "13px",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {value < 10 ? `0${value}` : value}
      </Typography>
      <Box
        component="button"
        type="button"
        disabled={disabledInc}
        onClick={onInc}
        sx={{
          all: "unset",
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          cursor: disabledInc ? "default" : "pointer",
          color: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          opacity: disabledInc ? 0.4 : 1,
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.16) },
        }}
      >
        <AddIcon size={15} />
      </Box>
    </Stack>
  );
};

const IncrementDecrementManager = (props) => {
  const {
    decrementQuantity,
    incrementQuantity,
    modalData,
    productUpdate,
    marketplaceLayout,
  } = props;
  const theme = useTheme();
  const getModule = () => {
    return JSON.parse(window.localStorage.getItem("module"));
  };

  const totalPriceLabel = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography fontWeight="500" fontSize={{ xs: "12px", md: "14px" }}>
        {t("Total Price")}:
      </Typography>
      <Typography
        fontWeight="700"
        fontSize={{ xs: "12px", md: "14px" }}
        color="primary.main"
      >
        {modalData &&
          getAmountWithSign(
            getDiscountedAmount(
              modalData?.totalPrice,
              modalData?.discount,
              modalData?.discount_type,
              modalData?.store_discount,
              modalData?.quantity
            )
          )}
      </Typography>
    </Stack>
  );

  return (
    <CustomStackFullWidth spacing={1.5} sx={{ mt: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight="400" color="customColor.textGray" fontSize="13px">
          {t("Unit")} :
        </Typography>
        <Typography fontWeight="600" fontSize="13px">
          {modalData?.unit_type}
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <MarketplaceQty
          value={modalData?.quantity || 1}
          onDec={decrementQuantity}
          onInc={incrementQuantity}
          disabledDec={
            modalData?.totalPrice === 0 || modalData?.quantity <= 1
          }
        />
        {totalPriceLabel}
      </Stack>
    </CustomStackFullWidth>
  );
};

IncrementDecrementManager.propTypes = {};

export { MarketplaceQty };
export default IncrementDecrementManager;
