import React from "react";
import { alpha, Stack, Typography } from "@mui/material";
import { Minus as RemoveIcon, Plus as AddIcon } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import {
  CustomFab,
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
    <Stack
      direction="row"
      spacing={1}
      paddingLeft={
        marketplaceLayout
          ? 0
          : productUpdate
            ? "none"
            : { sm: "0px", md: "45px" }
      }
    >
      <Typography fontWeight="500" fontSize={{ xs: "12px", md: "14px" }}>
        {t("Total Price")}:
      </Typography>
      <Typography
        fontWeight="700"
        fontSize={{ xs: "12px", md: "14px" }}
        color={marketplaceLayout ? "primary.main" : "inherit"}
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

  if (marketplaceLayout) {
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
  }

  return (
    <CustomStackFullWidth spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight="400" color="customColor.textGray">
          {t("Unit")} :
        </Typography>
        <Typography fontWeight="500">{modalData?.unit_type}</Typography>
      </Stack>
      <CustomStackFullWidth
        key={modalData}
        direction={productUpdate ? "column" : "row"}
        spacing={2}
        alignItems={productUpdate ? "flex-start" : "center"}
        justifyContent="flex-start"
      >
        <Stack direction="row" spacing={4} alignItems="center">
          <Stack
            direction="row"
            alignIems="center"
            justifyContent="space-between"
            sx={{
              minWidth: { xs: "117px", sm: "130px", md: "142px" },
              backgroundColor:
                getModule()?.module_type === "pharmacy"
                  ? theme.palette.background.custom5
                  : (theme) => alpha(theme.palette.neutral[200], 0.2),
            }}
            borderRadius={
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? "5px"
                : "13%"
            }
            padding={
              getModule()?.module_type === "pharmacy" ||
              getModule()?.module_type === "grocery"
                ? "5px"
                : "0px"
            }
          >
            <CustomFab
              onClick={decrementQuantity}
              aria-label="remove"
              disabled={modalData?.totalPrice === 0 || modalData?.quantity <= 1}
              sx={{
                color:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? (theme) => theme.palette.neutral[1000]
                    : (theme) => alpha(theme.palette.primary.main, 0.9),
                backgroundColor:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? (theme) => theme.palette.background.custom5
                    : (theme) => alpha(theme.palette.primary.main, 0.2),
                boxShadow:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? "none"
                    : "0px 2px 6px rgb(100 116 139 / 12%)",
                borderRadius:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? "0px"
                    : "50%",
                "&:hover": {
                  backgroundColor:
                    getModule()?.module_type === "pharmacy" ||
                    getModule()?.module_type === "grocery"
                      ? (theme) => alpha(theme.palette.neutral[200], 0.2)
                      : (theme) => alpha(theme.palette.primary.main, 0.4),
                },
              }}
            >
              <RemoveIcon size="small" />
            </CustomFab>
            <Stack alignItems="center" justifyContent="center">
              <Typography variant="body1" fontWeight="500" textAlign="center">
                {modalData?.quantity < 10 && "0"}
                {modalData?.quantity}
              </Typography>
            </Stack>
            <CustomFab
              color="primary"
              aria-label="add"
              onClick={incrementQuantity}
              module_type={getModule()?.module_type}
              sx={{
                color:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? (theme) => theme.palette.neutral[1000]
                    : (theme) => theme.palette.neutral[100],
                backgroundColor:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? theme.palette.background.custom5
                    : (theme) => theme.palette.primary.main,
                borderRadius:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? "0px"
                    : "50%",
                boxShadow:
                  getModule()?.module_type === "pharmacy" ||
                  getModule()?.module_type === "grocery"
                    ? "none"
                    : "0px 2px 6px rgb(100 116 139 / 12%)",
                "&:hover": {
                  backgroundColor:
                    getModule()?.module_type === "pharmacy" ||
                    getModule()?.module_type === "grocery"
                      ? (theme) => alpha(theme.palette.neutral[200], 0.2)
                      : (theme) => alpha(theme.palette.primary.main, 0.7),
                },
              }}
            >
              <AddIcon size="small" />
            </CustomFab>
          </Stack>
        </Stack>
        {totalPriceLabel}
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

IncrementDecrementManager.propTypes = {};

export default IncrementDecrementManager;
