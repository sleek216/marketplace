import React from "react";
import StoreAndDeliveryManCommon from "./StoreAndDeliveryManCommon";
import { alpha, Box, useMediaQuery, useTheme } from "@mui/material";
import MessageSvg from "./MessageSvg";
import { t } from "i18next";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";
import { hasChatAndReview, StoreChatButton } from "./StoreDetails";
import { getToken } from "../../../../helper-functions/getToken";

const DeliveryManInfo = ({ configData, deliveryManData, storeData }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "delivery_man",
        id: deliveryManData?.id,
        routeName: "delivery_man_id",
        chatFrom: "true",
        deliveryman_name: deliveryManData?.f_name,
        deliveryManData_image: deliveryManData?.image_full_url,
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.75, md: 2 },
      }}
    >
      <Box
        sx={{
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
          bgcolor: theme.palette.background.paper,
          p: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          width="100%"
        >
          <StoreAndDeliveryManCommon
            data={deliveryManData}
            image={deliveryManData?.image_full_url}
            fromDelivery="true"
          />
          {getToken() && hasChatAndReview(storeData)?.isChat === 1 && (
            <StoreChatButton
              variant="contained"
              startIcon={!isSmall && <MessageSvg />}
              onClick={handleClick}
            >
              {isSmall ? <MessageSvg /> : t("See Chat History")}
            </StoreChatButton>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default DeliveryManInfo;
