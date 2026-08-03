import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Box, Grid, Rating, Stack, TextField, Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useFormik } from "formik";
import toast from "react-hot-toast";

import { useSubmitDeliverymanReview } from "../../api-manage/hooks/react-query/review/useSubmitDeliverymanReview";
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";

const DeliverymanForm = ({
  data,
  orderId,
  isReviewedDeliveryman,
  onReviewSubmitted,
  compact = false,
  batchMode = false,
  onDraftChange,
}) => {
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const { mutate, isLoading, error } = useSubmitDeliverymanReview();
  const initialRating = isReviewedDeliveryman ? data?.rating || data?.review_data?.rating || 5 : "";
  const initialComment = isReviewedDeliveryman ? data?.comment || data?.review_data?.comment || "" : "";
  const [submittedReview, setSubmittedReview] = useState({
    rating: initialRating,
    comment: initialComment,
  });
  const formik = useFormik({
    initialValues: {
      rating: initialRating,
      comment: initialComment,
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
  const handleCommentChange = (value) => {
    formik.setFieldValue("comment", value);
  };
  const handleFormsubmit = (values) => {
    const formData = {
      ...values,
      delivery_man_id: data?.id,
      order_id: orderId,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setSubmittedReview({
          rating: values?.rating,
          comment: values?.comment,
        });
        onReviewSubmitted?.(orderId);
      },
      onError: onErrorResponse,
    });
  };
  useEffect(() => {
    onDraftChange?.({
      delivery_man_id: data?.id,
      order_id: orderId,
      rating: isReviewedDeliveryman ? submittedReview?.rating : formik.values.rating,
      comment: isReviewedDeliveryman ? submittedReview?.comment : formik.values.comment,
      isAlreadyReviewed: isReviewedDeliveryman,
    });
  }, [
    data?.id,
    orderId,
    formik.values.rating,
    formik.values.comment,
    isReviewedDeliveryman,
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
              spacing={compact ? 1.25 : 2}
              alignItems="flex-start"
              sx={{
                width: "100%",
                p: compact && batchMode ? 0 : compact ? "6px" : "14px",
                borderRadius: compact ? "8px" : "12px",
                backgroundColor: (theme) =>
                  compact && batchMode ? "transparent" : theme.palette.background.paper,
              }}
            >
              <Avatar
                src={data?.image_full_url}
                alt={`${data?.f_name || ""} ${data?.l_name || ""}`.trim() || "Delivery man"}
                sx={{
                  width: compact ? 44 : 84,
                  height: compact ? 44 : 84,
                }}
              />
              <Stack spacing={compact ? 0.5 : 1} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: compact ? "13px" : "18px",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  {`${data?.f_name || ""} ${data?.l_name || ""}`.trim() || t("DeliveryMan Name")}
                </Typography>
                <Rating
                  size={compact ? "small" : "medium"}
                  precision={0.5}
                  value={Number(isReviewedDeliveryman ? submittedReview?.rating : formik.values.rating) || 0}
                  onChange={(_, nextValue) => handleChangeRatings(nextValue ?? 0)}
                  readOnly={isReviewedDeliveryman}
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#F4C430" },
                    "& .MuiRating-iconEmpty": { color: (theme) => theme.palette.neutral[400] },
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={compact ? 2 : 2}
                  maxRows={compact ? 3 : 4}
                  size={compact ? "small" : "medium"}
                  placeholder={t("write a review")}
                  value={isReviewedDeliveryman ? submittedReview?.comment : formik.values.comment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  disabled={isReviewedDeliveryman}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: compact ? "10px" : "14px",
                      backgroundColor: (theme) => theme.palette.background.default,
                      fontSize: compact ? "13px" : "inherit",
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
          {!isReviewedDeliveryman && !batchMode && (
            <Grid item xs={12} md={12} mt="0.5rem">
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

DeliverymanForm.propTypes = {};

export default DeliverymanForm;
