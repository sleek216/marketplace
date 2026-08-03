import React from "react";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCheckoutGroupGrandTotal } from "helper-functions/groupOrdersByCheckoutGroup";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import Order from "./order";

const MultiStoreOrderGroup = ({
  checkoutGroupId,
  orders,
  renderOrderProps,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const grandTotal = getCheckoutGroupGrandTotal(orders);
  const storeCount = orders?.length || 0;

  return (
    <CustomPaperBigCard
      sx={{
        width: "100%",
        maxWidth: "none",
        height: "auto",
        p: { xs: 1.25, md: 1.75 },
        borderRadius: "2px",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.primary.main, 0.06)
            : alpha(theme.palette.primary.main, 0.03),
        boxShadow: "none",
      }}
    >
      <CustomStackFullWidth spacing={1.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{
            pb: 1,
            borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize={{ xs: "14px", md: "16px" }}>
              {t("Multi-store order")}
            </Typography>
            <Typography fontSize="12px" color="text.secondary" mt={0.25}>
              {t("Group ID")}: {checkoutGroupId}
            </Typography>
            <Typography fontSize="12px" color="text.secondary">
              {storeCount}{" "}
              {storeCount === 1 ? t("Store") : t("Stores")}
            </Typography>
          </Box>
          <Typography fontWeight={700} fontSize={{ xs: "15px", md: "17px" }}>
            {getAmountWithSign(grandTotal)}
          </Typography>
        </Stack>

        <Stack spacing={1.5} width="100%">
          {orders?.map((order, index) => (
            <Box
              key={order?.id}
              sx={{
                pl: { xs: 0.5, md: 1 },
                borderLeft: {
                  xs: `2px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                  md: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <Order
                index={index}
                order={order}
                {...renderOrderProps(order)}
              />
            </Box>
          ))}
        </Stack>
      </CustomStackFullWidth>
    </CustomPaperBigCard>
  );
};

export default MultiStoreOrderGroup;
