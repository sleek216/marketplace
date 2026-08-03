import React from "react";
import { alpha, Typography, useTheme, Box } from "@mui/material";
import CustomImageContainer from "../../../CustomImageContainer";
import { Stack } from "@mui/system";
import CustomRatings from "../../../search/CustomRatings";
import { t } from "i18next";

const StoreAndDeliveryManCommon = ({
  data,
  image,
  fromDelivery,
}) => {
  const theme = useTheme();
  const totalOrderText = t("Delivery Completed");
  const displayName = data?.name || data?.f_name || "—";

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.75}
      flex={1}
      minWidth={0}
    >
      <Box
        sx={{
          width: { xs: 56, md: 72 },
          height: { xs: 56, md: 72 },
          flexShrink: 0,
          borderRadius: "2px",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.neutral[200], 0.35),
        }}
      >
        {data && (
          <CustomImageContainer
            src={image}
            height="100%"
            width="100%"
            smWidth="100%"
            smHeight="100%"
            borderRadius="2px"
            objectfit="cover"
          />
        )}
      </Box>

      <Stack spacing={0.35} minWidth={0} flex={1}>
        <Typography
          fontWeight={700}
          fontSize={{ xs: "14px", md: "16px" }}
          color={theme.palette.neutral[1000]}
          noWrap
        >
          {displayName}
        </Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap" useFlexGap spacing={0.75}>
          <CustomRatings
            readOnly="true"
            ratingValue={data?.avg_rating}
            color={theme.palette.warning.new}
          />
          <Typography fontSize="12.5px" fontWeight={700}>
            ({Number(data?.avg_rating ?? 0).toFixed(2)})
          </Typography>
          <Typography
            fontSize="12.5px"
            fontWeight={600}
            sx={{
              pl: 1,
              borderLeft: `1px solid ${alpha(theme.palette.neutral[400], 0.45)}`,
              color: theme.palette.neutral[600],
            }}
          >
            {data?.rating_count || 0} {t("Reviews")}
          </Typography>
        </Stack>
        {fromDelivery !== "true" ? (
          <Typography
            fontSize="12.5px"
            color={theme.palette.neutral[600]}
            sx={{ wordBreak: "break-word" }}
          >
            {t("Address")}: {data?.address || "—"}
          </Typography>
        ) : (
          <Typography fontSize="12.5px" color={theme.palette.neutral[600]}>
            {`${data?.order_count || 0} ${totalOrderText}`}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default StoreAndDeliveryManCommon;
