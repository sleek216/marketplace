import { alpha, useMediaQuery, useTheme, Box, Button } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import MessageSvg from "./MessageSvg";
import StoreAndDeliveryManCommon from "./StoreAndDeliveryManCommon";
import StoreFeature from "./StoreFeature";
import { getToken } from "helper-functions/getToken";

export const StoreChatButton = styled(Button)(({ theme }) => ({
  height: "36px",
  borderRadius: "2px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  flexShrink: 0,
  whiteSpace: "nowrap",
  "&:hover": { boxShadow: "none" },
  [theme.breakpoints.down("md")]: {
    height: "34px",
    padding: "6px",
    minWidth: "34px",
  },
}));

export const hasChatAndReview = (storeData) => {
  let isChat = 0;
  let isReview = 0;
  if (storeData?.store_business_model === "commission") {
    isChat = 1;
    isReview = 1;
  } else if (storeData?.store_business_model === "subscription") {
    isChat = storeData.store_sub?.chat ?? 0;
    isReview = storeData.store_sub?.review ?? 0;
  }

  return { isReview, isChat };
};

const StoreDetails = (props) => {
  const { storeData, configData, t } = props;
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "vendor",
        id: storeData?.vendor_id,
        routeName: "vendor_id",
        chatFrom: "true",
        deliveryman_name: storeData?.name,
        deliveryManData_image: storeData?.logo_full_url,
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
            data={storeData}
            configData={configData}
            image={storeData?.logo_full_url || storeData?.cover_photo_full_url}
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

        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={{ xs: 2, md: 4 }}
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
          }}
        >
          <StoreFeature
            count={`${storeData?.positive_rating?.toFixed(2)}% `}
            title="Positive Review"
          />
          {storeData?.total_items && (
            <StoreFeature count={storeData?.total_items} title="Products" />
          )}
          <StoreFeature
            count={storeData?.delivery_time}
            title="Delivery Time"
          />
        </Stack>
      </Box>
    </Box>
  );
};

StoreDetails.propTypes = {};

export default StoreDetails;
