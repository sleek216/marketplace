import React from "react";
import { Box, Divider, Grid, Skeleton, Stack, alpha } from "@mui/material";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";

const InfoBannerSkeleton = ({ isItems }) => (
  <Box
    sx={{
      width: "100%",
      px: 1.25,
      py: 1,
      borderRadius: "8px",
      backgroundColor: (theme) =>
        isItems
          ? `${theme.palette.primary.light}22`
          : `${theme.palette.success.light}22`,
      border: (theme) =>
        `1px solid ${
          isItems ? theme.palette.primary.light : theme.palette.success.light
        }`,
    }}
  >
    <Skeleton
      variant="text"
      width="32%"
      height={18}
      sx={{ transform: "none", borderRadius: "4px" }}
    />
    <Skeleton
      variant="text"
      width="78%"
      height={16}
      sx={{ transform: "none", borderRadius: "4px", mt: 0.5 }}
    />
  </Box>
);

const ItemFormSkeleton = ({ compact = true }) => (
  <Box sx={{ width: "100%" }}>
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={compact ? 1.25 : 2}
      sx={{ width: "100%" }}
    >
      <Skeleton
        variant="rounded"
        width={compact ? 52 : 86}
        height={compact ? 52 : 86}
        sx={{ borderRadius: compact ? "10px" : "16px", flexShrink: 0 }}
      />
      <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.35}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={0.75}
        >
          <Skeleton
            variant="text"
            width="58%"
            height={compact ? 16 : 24}
            sx={{ transform: "none", borderRadius: "4px" }}
          />
          <Skeleton
            variant="text"
            width="24%"
            height={compact ? 14 : 20}
            sx={{ transform: "none", borderRadius: "4px" }}
          />
        </Stack>
        <Skeleton
          variant="rounded"
          width={120}
          height={18}
          sx={{ borderRadius: "6px" }}
        />
      </Stack>
    </Stack>
    <Skeleton
      variant="rounded"
      width="100%"
      height={compact ? 56 : 80}
      sx={{ mt: 0.75, borderRadius: "10px" }}
    />
  </Box>
);

const DeliverymanFormSkeleton = ({ compact = true, withCard = true }) => {
  const content = (
    <Stack
      direction="row"
      spacing={compact ? 1.25 : 2}
      alignItems="flex-start"
      sx={{ width: "100%" }}
    >
      <Skeleton
        variant="circular"
        width={compact ? 44 : 84}
        height={compact ? 44 : 84}
        sx={{ flexShrink: 0 }}
      />
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="48%"
          height={compact ? 16 : 24}
          sx={{ transform: "none", borderRadius: "4px" }}
        />
        <Skeleton
          variant="rounded"
          width={120}
          height={18}
          sx={{ borderRadius: "6px" }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={compact ? 56 : 72}
          sx={{ borderRadius: "10px" }}
        />
      </Stack>
    </Stack>
  );

  if (!withCard) return content;

  return (
    <CustomPaperBigCard sx={{ width: "100%" }}>
      {content}
    </CustomPaperBigCard>
  );
};

const ItemsReviewSkeleton = ({ embedded = false }) => {
  const compact = embedded;

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: embedded ? "52vh" : "unset",
        overflowY: embedded ? "auto" : "visible",
        pr: embedded ? 0.5 : 0,
      }}
    >
      <Stack
        spacing={1.25}
        divider={<Divider flexItem />}
        sx={{
          width: "100%",
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: "12px",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          p: 1.25,
        }}
      >
        {Array.from({ length: embedded ? 2 : 1 }).map((_, index) => (
          <ItemFormSkeleton key={index} compact={compact} />
        ))}
      </Stack>
    </Box>
  );
};

const desktopSplitDividerSx = {
  display: { xs: "none", md: "block" },
  alignSelf: "stretch",
  borderColor: (theme) => alpha(theme.palette.neutral[400], 0.22),
  borderRightWidth: "1px",
  mx: 0,
};

const SplitReviewSkeleton = () => (
  <Box sx={{ width: "100%" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        mb: 0.75,
        alignItems: "stretch",
      }}
    >
      <Box sx={{ flex: { md: "6 1 0" }, width: { xs: "100%" }, minWidth: 0, pr: { md: 1.5 } }}>
        <Skeleton
          variant="text"
          width="50%"
          height={14}
          sx={{ transform: "none", borderRadius: "4px" }}
        />
      </Box>
      <Divider orientation="vertical" flexItem sx={desktopSplitDividerSx} />
      <Box sx={{ flex: { md: "4 1 0" }, width: { xs: "100%" }, minWidth: 0, pl: { md: 1.5 } }}>
        <Skeleton
          variant="text"
          width="58%"
          height={14}
          sx={{ transform: "none", borderRadius: "4px" }}
        />
      </Box>
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          flex: { md: "6 1 0" },
          width: { xs: "100%" },
          minWidth: 0,
          boxSizing: "border-box",
          pr: { md: 1.5 },
          pb: { xs: 1.25, md: 0 },
          borderBottom: {
            xs: (theme) => `1px solid ${alpha(theme.palette.neutral[400], 0.22)}`,
            md: "none",
          },
        }}
      >
        <Skeleton
          variant="text"
          width="72%"
          height={14}
          sx={{ transform: "none", borderRadius: "4px", mb: 0.75 }}
        />
        <Box
          sx={{
            borderRadius: "8px",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: 1,
          }}
        >
          <ItemFormSkeleton compact />
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={desktopSplitDividerSx} />

      <Box
        sx={{
          flex: { md: "4 1 0" },
          width: { xs: "100%" },
          minWidth: 0,
          boxSizing: "border-box",
          pl: { md: 1.5 },
        }}
      >
        <Skeleton
          variant="text"
          width="68%"
          height={14}
          sx={{ transform: "none", borderRadius: "4px", mb: 0.75 }}
        />
        <Box
          sx={{
            borderRadius: "8px",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: 1,
          }}
        >
          <DeliverymanFormSkeleton compact withCard={false} />
        </Box>
      </Box>
    </Box>

    <Stack
      direction="row"
      justifyContent={{ xs: "stretch", sm: "flex-end" }}
      mt={0.75}
    >
      <Skeleton
        variant="rounded"
        width="100%"
        height={32}
        sx={{ maxWidth: { sm: 120 }, borderRadius: "6px" }}
      />
    </Stack>
  </Box>
);

const Shimmer = ({ embedded = false, isItems = true, layout = "tabs" }) => {
  if (layout === "split") {
    return <SplitReviewSkeleton />;
  }

  return (
    <CustomStackFullWidth spacing={embedded ? 1.5 : 3} sx={{ width: "100%" }}>
      <InfoBannerSkeleton isItems={isItems} />
      {isItems ? (
        <ItemsReviewSkeleton embedded={embedded} />
      ) : (
        <DeliverymanFormSkeleton compact={embedded} />
      )}
    </CustomStackFullWidth>
  );
};

export default Shimmer;
