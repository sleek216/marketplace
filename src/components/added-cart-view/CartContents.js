import React, { useMemo } from "react";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import SimpleBar from "simplebar-react";
import CartContent from "./CartContent";
import "simplebar-react/dist/simplebar.min.css";
import { groupItemsByStore } from "../product-details/storeItemGrouping";
import { StoreGroupHeader } from "../product-details/StoreGroupSection";
import ManualExpectedDeliveryInfo from "../product-details/ManualExpectedDeliveryInfo";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "utils/CustomFunctions";

const StoreGroupTotals = ({ subtotal, deliveryCharge, storeTotal }) => {
  const theme = useTheme();
  return (
    <Stack
      spacing={0.5}
      sx={{
        px: 1.25,
        py: 1,
        mt: 0.5,
        borderRadius: "2px",
        border: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize="13px" color="text.secondary">
          {t("Subtotal")}
        </Typography>
        <Typography fontSize="13px" fontWeight={600}>
          {getAmountWithSign(subtotal)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize="13px" color="text.secondary">
          {t("Delivery Fee")}
        </Typography>
        <Typography fontSize="13px" fontWeight={600}>
          {getAmountWithSign(deliveryCharge)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize="13px" fontWeight={600}>
          {t("Total")}
        </Typography>
        <Typography fontSize="13px" fontWeight={700} color="primary.main">
          {getAmountWithSign(storeTotal)}
        </Typography>
      </Stack>
    </Stack>
  );
};

const CartContents = (props) => {
  const { cartList, imageBaseUrl, refetch, selectedCartIds, onToggleSelect } =
    props;
  const { cartMeta } = useSelector((state) => state.cart);
  const theme = useTheme();

  const storeGroups = useMemo(() => {
    const clientGroups = groupItemsByStore(cartList);
    const apiGroups = cartMeta?.store_groups || [];

    return clientGroups.map((group) => {
      const apiGroup = apiGroups.find(
        (sg) => String(sg?.store_id) === String(group.storeId)
      );
      const itemsSubtotal = cartItemsTotalAmount(
        group.items.map(({ item }) => item)
      );
      const deliveryCharge = Number(apiGroup?.delivery_charge) || 0;
      const storeTotal =
        apiGroup?.store_total != null
          ? Number(apiGroup.store_total)
          : itemsSubtotal + deliveryCharge;

      return {
        ...group,
        storeName: apiGroup?.store_name || group.storeName,
        subtotal:
          apiGroup?.subtotal != null ? Number(apiGroup.subtotal) : itemsSubtotal,
        deliveryCharge,
        storeTotal,
        hasApiTotals: Boolean(apiGroup),
      };
    });
  }, [cartList, cartMeta]);

  return (
    <CustomStackFullWidth
      justifyContent="flex-start"
      sx={{ height: "100%", minHeight: 0 }}
      alignItems="stretch"
    >
      <SimpleBar
        style={{
          height: "100%",
          maxHeight: "100%",
          width: "100%",
          padding: "12px 14px",
        }}
      >
        {storeGroups.map((group, groupIndex) => (
          <Box
            key={group.storeId}
            sx={{
              mb: groupIndex < storeGroups.length - 1 ? 2 : 0,
              borderRadius: "2px",
              border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
              overflow: "hidden",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <StoreGroupHeader
              storeName={group.storeName}
              storeLogo={group.storeLogo}
              storeId={group.storeId}
              sx={{
                px: 1.25,
                py: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }}
            />
            <Box sx={{ p: 1.25, pb: 0.5 }}>
              {group.items.map(({ item }) => (
                <CartContent
                  key={item?.cartItemId || item?.id}
                  cartItem={item}
                  imageBaseUrl={imageBaseUrl}
                  refetch={refetch}
                  isSelected={selectedCartIds?.includes(item?.cartItemId)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
              {group.deliverySource && (
                <ManualExpectedDeliveryInfo
                  record={group.deliverySource}
                  variant="footer"
                />
              )}
              {storeGroups.length > 1 && (
                <StoreGroupTotals
                  subtotal={group.subtotal}
                  deliveryCharge={group.deliveryCharge}
                  storeTotal={group.storeTotal}
                />
              )}
            </Box>
          </Box>
        ))}
      </SimpleBar>
    </CustomStackFullWidth>
  );
};

CartContents.propTypes = {};

export default CartContents;
