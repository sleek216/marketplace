import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";

const StoreFeature = ({ count, title }) => {
  return (
    <Stack spacing={0.35}>
      <Typography fontSize={{ xs: "15px", md: "16px" }} fontWeight={800} color="primary.main">
        {count}
      </Typography>
      <Typography fontSize="12px" color="text.secondary">
        {t(title)}
      </Typography>
    </Stack>
  );
};

export default StoreFeature;
