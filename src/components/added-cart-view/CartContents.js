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
import {
  getCartQuantityCount,
  isCartItemSelected,
  resolveStoreDeliveryCharge,
} from "helper-functions/cartTotals";
import DeliveryFeeAmount from "./DeliveryFeeAmount";

const StoreGroupTotals = ({ subtotal, deliveryCharge, storeTotal, deliveryLoading }) => {
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize="13px" color="text.secondary">
          {t("Subtotal")}
        </Typography>
        <Typography fontSize="13px" fontWeight={600}>
          {getAmountWithSign(subtotal)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize="13px" color="text.secondary">
          {t("Delivery Fee")}
        </Typography>
        <DeliveryFeeAmount amount={deliveryCharge} loading={deliveryLoading} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize="13px" fontWeight={600}>
          {t("Store Total")}
        </Typography>
        <DeliveryFeeAmount
          amount={storeTotal}
          loading={deliveryLoading}
          fontWeight={700}
          color="primary.main"
        />
      </Stack>
    </Stack>
  );
};

const CartContents = ({
  cartList,
  imageBaseUrl,
  refetch,
  selectedCartIds,
  onToggleSelect,
  storeData,
}) => {
  const { cartMeta, deliveryChargeRefreshing } = useSelector((state) => state.cart);
  const theme = useTheme();

  const storeGroups = useMemo(() => {
    const clientGroups = groupItemsByStore(cartList);
    const apiGroups = cartMeta?.store_groups || [];

    return clientGroups.map((group) => {
      const apiGroup = apiGroups.find(
        (sg) => String(sg?.store_id) === String(group.storeId)
      );

      const selectedGroupItems = group.items.filter(({ item }) =>
        isCartItemSelected(item, selectedCartIds)
      );

      const itemCount = getCartQuantityCount(group.items.map(({ item }) => item));

      if (selectedGroupItems.length === 0) {
        return {
          ...group,
          storeName: apiGroup?.store_name || group.storeName,
          itemCount,
          subtotal: 0,
          deliveryCharge: 0,
          storeTotal: 0,
        };
      }

      const subtotal = cartItemsTotalAmount(
        selectedGroupItems.map(({ item }) => item)
      );
      const deliveryCharge = resolveStoreDeliveryCharge(
        selectedGroupItems,
        apiGroup,
        storeData
      );

      return {
        ...group,
        storeName: apiGroup?.store_name || group.storeName,
        itemCount,
        subtotal,
        deliveryCharge,
        storeTotal: subtotal + deliveryCharge,
      };
    });
  }, [cartList, cartMeta, selectedCartIds, storeData]);

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
              itemCount={group.itemCount}
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
                  isSelected={selectedCartIds?.some((id) => String(id) === String(item?.cartItemId || item?.id))}
                  onToggleSelect={onToggleSelect}
                />
              ))}
              {group.deliverySource && (
                <ManualExpectedDeliveryInfo
                  record={group.deliverySource}
                  variant="footer"
                />
              )}
              <StoreGroupTotals
                subtotal={group.subtotal}
                deliveryCharge={group.deliveryCharge}
                storeTotal={group.storeTotal}
                deliveryLoading={deliveryChargeRefreshing}
              />
            </Box>
          </Box>
        ))}
      </SimpleBar>
    </CustomStackFullWidth>
  );
};

CartContents.propTypes = {};

export default CartContents;
