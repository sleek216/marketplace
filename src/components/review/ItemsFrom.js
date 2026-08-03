import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";

import { Avatar, Grid, Rating, Stack, TextField, Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";

import toast from "react-hot-toast";

import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useSubmitItemReview } from "api-manage/hooks/react-query/review/useSubmitItemReview";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const ItemForm = ({
  data,
  onReviewSubmitted,
  compact = false,
  batchMode = false,
  onDraftChange,
}) => {
  const { t } = useTranslation();

  const extractReviewData = (item) => {
    const reviewBlock =
      item?.review ||
      item?.review_data ||
      item?.item_review ||
      item?.customer_review ||
      null;

    const rating =
      reviewBlock?.rating ??
      item?.rating ??
      (item?.is_reviewed ? 5 : 0);

    const comment =
      reviewBlock?.comment ??
      item?.comment ??
      "";

    const reviewed =
      Boolean(
        item?.is_reviewed_item ||
        item?.is_reveiewed_item ||
        item?.is_reviewed ||
        item?.is_review ||
        item?.reviewed ||
        item?.review_id ||
        item?.item_review_id ||
        reviewBlock
      );

    return { reviewed, rating, comment };
  };

  const initialReviewData = useMemo(() => extractReviewData(data), [data]);
  const [locallyReviewed, setLocallyReviewed] = useState(initialReviewData.reviewed);
  const [submittedReview, setSubmittedReview] = useState({
    rating: initialReviewData.rating,
    comment: initialReviewData.comment,
  });
  const isAlreadyReviewed = locallyReviewed;

  const { mutate, isLoading } = useSubmitItemReview();
  const formik = useFormik({
    initialValues: {
      rating: initialReviewData.rating || "",
      comment: initialReviewData.comment || "",
    },
    onSubmit: async (values, helpers) => {
      try {
        handleFormsubmit(values);
      } catch (err) {}
    },
  });
  const handleChangeRatings = (value) => {
    formik.setFieldValue("rating", value);
  };
  const handleFormsubmit = (values) => {
    const formData = {
      ...values,
      delivery_man_id: null,
      item_id: data?.item_id,
      order_id: data?.order_id,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setSubmittedReview({
          rating: values?.rating,
          comment: values?.comment,
        });
        setLocallyReviewed(true);
        onReviewSubmitted?.(data?.order_id);
      },
      onError: onErrorResponse,
    });
  };
  useEffect(() => {
    const payload = {
      item_id: data?.item_id,
      order_id: data?.order_id,
      rating: isAlreadyReviewed ? submittedReview?.rating : formik.values.rating,
      comment: isAlreadyReviewed ? submittedReview?.comment : formik.values.comment,
      isAlreadyReviewed,
    };
    onDraftChange?.(payload);
  }, [
    data?.item_id,
    data?.order_id,
    formik.values.rating,
    formik.values.comment,
    isAlreadyReviewed,
    submittedReview?.rating,
    submittedReview?.comment,
    onDraftChange,
  ]);

  return (
    <CustomStackFullWidth>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={compact ? 0.75 : 2}>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={compact ? 1.25 : 2}
              sx={{
                width: "100%",
                p: compact && batchMode ? 0 : compact ? "6px" : "12px",
                borderRadius: compact ? "8px" : "12px",
              }}
            >
              <Avatar
                src={data?.image_full_url}
                alt={data?.item_details?.name || t("product photo")}
                variant="rounded"
                sx={{
                  width: compact ? 52 : 86,
                  height: compact ? 52 : 86,
                  borderRadius: compact ? "10px" : "16px",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: (theme) => theme.palette.background.default,
                }}
              />
              <Stack sx={{ flex: 1, minWidth: 0 }} spacing={compact ? 0.35 : 0.75}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={0.75}
                >
                  <Typography
                    sx={{
                      fontSize: compact ? "13px" : "18px",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      maxWidth: "68%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {data?.item_details?.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: compact ? "12px" : "16px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getAmountWithSign(data?.item_details?.price)}
                  </Typography>
                </Stack>
                <Rating
                  size={compact ? "small" : "medium"}
                  precision={0.5}
                  value={Number(isAlreadyReviewed ? submittedReview?.rating : formik.values.rating) || 0}
                  onChange={(_, nextValue) => handleChangeRatings(nextValue ?? 0)}
                  readOnly={isAlreadyReviewed}
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#F4C430" },
                    "& .MuiRating-iconEmpty": {
                      color: (theme) => theme.palette.neutral[400],
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              multiline
              minRows={compact ? 2 : 3}
              maxRows={compact ? 3 : 5}
              size={compact ? "small" : "medium"}
              name="comment"
              placeholder={t("Tell us about product quality and condition")}
              value={
                isAlreadyReviewed ? submittedReview?.comment : formik.values.comment
              }
              onChange={formik.handleChange}
              disabled={isAlreadyReviewed}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: compact ? "10px" : "14px",
                  backgroundColor: (theme) => theme.palette.background.default,
                  fontSize: compact ? "13px" : "inherit",
                },
              }}
            />
          </Grid>
          {!isAlreadyReviewed && !batchMode && (
            <Grid item xs={12} md={12} mt="1rem">
              <LoadingButton
                fullWidth
                variant="contained"
                type="submit"
                loading={isLoading}
              >
                {t("Submit")}
              </LoadingButton>
            </Grid>
          )}
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

ItemForm.propTypes = {};

export default ItemForm;
