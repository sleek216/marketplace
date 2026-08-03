import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Avatar, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../../CustomImageContainer";
import CustomModal from "../../modal";
import { X as CloseIcon } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import { getDateFormat } from "utils/CustomFunctions";
import { ReadMore } from "components/store-details/ReadMore";
import CustomRatings from "components/search/CustomRatings";

const ProductReviewCard = ({ review, storename }) => {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

  const customerName = review?.customer_name
    ? review?.customer_name
    : `${review?.customer?.f_name ?? ""} ${review?.customer?.l_name ?? ""}`.trim();

  const ratingValue = Number(review?.rating);
  const parsedRating = Number.isFinite(ratingValue) ? ratingValue : 0;

  return (
    <>
      <CustomStackFullWidth
        sx={{
          mb: 2.5,
          pb: 2.5,
          borderBottom: (t) =>
            `1px solid ${t.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            src={review?.customer_image || review?.customer?.image_full_url}
            alt={customerName}
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              bgcolor: "neutral.400",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {customerName?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                component="p"
                fontSize="13px"
                fontWeight="700"
                color="text.primary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {customerName || "Customer"}
              </Typography>
              {review?.created_at && (
                <Typography
                  component="span"
                  fontSize="11px"
                  color="text.secondary"
                  sx={{ flexShrink: 0 }}
                >
                  {getDateFormat(review.created_at)}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.75}>
              <CustomRatings
                readOnly
                ratingValue={parsedRating}
                fontSize="16px"
                color={theme.palette.warning.main}
              />
              <Typography
                component="span"
                fontSize="12px"
                fontWeight={600}
                color="text.secondary"
              >
                {parsedRating.toFixed(1)}
              </Typography>
            </Stack>

            {review?.comment && (
              <Typography
                component="p"
                fontSize="13px"
                lineHeight={1.55}
                color="text.primary"
                sx={{
                  mt: 0.25,
                  wordBreak: "break-word",
                }}
              >
                {review.comment}
              </Typography>
            )}

            {review?.reply && (
              <Box
                sx={{
                  mt: 0.5,
                  background: theme.palette.neutral[300],
                  padding: "12px 13px",
                  borderRadius: "9px",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    fontSize="12px"
                    fontWeight="600"
                    color={theme.palette.text.primary}
                  >
                    {storename}
                  </Typography>
                  {review.updated_at && (
                    <Typography
                      fontSize="10px"
                      fontWeight="400"
                      color="text.secondary"
                      sx={{ flexShrink: 0 }}
                    >
                      {getDateFormat(review.updated_at)}
                    </Typography>
                  )}
                </Stack>
                <Stack mt="6px">
                  <ReadMore
                    font="12px"
                    color={theme.palette.text.secondary}
                    limits="130"
                  >
                    {review.reply}
                  </ReadMore>
                </Stack>
              </Box>
            )}

            {review?.attachment?.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {JSON.parse(review?.attachment)?.map((item, index) => (
                  <CustomImageContainer
                    key={index}
                    src={item || review?.customer?.image_full_url}
                    width="55px"
                    height="55px"
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </CustomStackFullWidth>

      <CustomModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
      >
        <CustomStackFullWidth
          backgroundColor={theme.palette.neutral[300]}
          padding="20px"
          spacing={1.5}
          sx={{
            borderRadius: ".9rem",
            width: { xs: "300px", sm: "550px" },
            cursor: "pointer",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 0,
              right: 3,
              width: "45px",
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </IconButton>
          <CustomImageContainer
            src={review?.customer?.image_full_url}
            width="100%"
            height="100%"
          />
        </CustomStackFullWidth>
      </CustomModal>
    </>
  );
};

export default ProductReviewCard;
