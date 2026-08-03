import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useRouter } from "next/router";
import useGetOrderDetails from "../../api-manage/hooks/react-query/order/useGetOrderDetails";
import GroupButtonsRateAndReview from "./GroupButtonsRateAndReview";
import ItemForm from "./ItemsFrom";
import Shimmer from "./Shimmer";
import DeliverymanForm from "./DeliverymanForm";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { Divider, Grid, Typography, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "../../../public/static/nodata.png";
import { Stack } from "@mui/system";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import toast from "react-hot-toast";
import MainApi from "api-manage/MainApi";
import {
  submit_deliveryman_review_api,
  submit_items_review_api,
} from "api-manage/ApiRoutes";
import moment from "moment";

const getReviewSubmitErrorMessage = (error) => {
  const apiMessage = error?.response?.data?.message;
  if (apiMessage) return apiMessage;

  const apiErrors = error?.response?.data?.errors;
  if (Array.isArray(apiErrors) && apiErrors.length > 0) {
    const firstError = apiErrors[0];
    if (typeof firstError === "string") return firstError;
    if (typeof firstError?.message === "string") return firstError.message;
  }

  const fallback = error?.message;
  return fallback || "Failed to submit review.";
};

const RateAndReview = ({
  orderId,
  embedded = false,
  layout = embedded ? "split" : "tabs",
  orderMeta,
  onReviewSubmitted,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState("items");
  const router = useRouter();
  const id = orderId || router.query?.id;
  const { refetch, data, isRefetching } = useGetOrderDetails(id);
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
    isRefetching: refetchingTrackOrder,
  } = useGetTrackOrderData(id);
  const isReviewDataLoading =
    Boolean(id) && (isRefetching || refetchingTrackOrder || !data);
  const isReviewedDeliveryman = Boolean(
    trackOrderData?.is_reviewed_deliveryman ||
      trackOrderData?.is_reveiewed_deliveryman
  );
  const reviewItems = Array.isArray(data)
    ? data
    : data?.details || data?.items || [];
  const moduleType = data?.module_type || trackOrderData?.module_type;
  const showTabButtons = moduleType !== "parcel";
  const isSplitLayout = layout === "split";
  const [itemDrafts, setItemDrafts] = useState({});
  const [deliveryDraft, setDeliveryDraft] = useState(null);
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  const storeLabel = useMemo(() => {
    const storeName =
      orderMeta?.storeName ||
      data?.store?.name ||
      data?.store_name ||
      trackOrderData?.store?.name;
    const storeZone =
      orderMeta?.storeZone ||
      data?.store?.zone?.name ||
      data?.store?.address ||
      trackOrderData?.store?.zone?.name;
    if (!storeName) return null;
    return storeZone ? `${storeName} (${storeZone})` : storeName;
  }, [orderMeta, data, trackOrderData]);

  const deliveredLabel = useMemo(() => {
    const deliveredAt =
      orderMeta?.delivered || data?.delivered || trackOrderData?.delivered;
    if (!deliveredAt) return null;
    return moment(deliveredAt).format("DD MMM YYYY");
  }, [orderMeta, data, trackOrderData]);

  useEffect(() => {
    id && refetch() && refetchTrackOrder();
  }, [id]);

  useEffect(() => {
    setItemDrafts({});
    setDeliveryDraft(null);
  }, [id, type]);

  const handleItemDraftChange = useCallback((draft) => {
    const key = `${draft?.item_id}-${draft?.order_id}`;
    setItemDrafts((prev) => {
      const existing = prev[key];
      if (
        existing?.rating === draft?.rating &&
        existing?.comment === draft?.comment &&
        existing?.isAlreadyReviewed === draft?.isAlreadyReviewed
      ) {
        return prev;
      }
      return { ...prev, [key]: draft };
    });
  }, []);

  const submitItemReviews = async (pendingDrafts) => {
    await Promise.all(
      pendingDrafts.map((draft) =>
        MainApi.post(submit_items_review_api, {
          rating: draft.rating,
          comment: draft.comment,
          delivery_man_id: null,
          item_id: draft.item_id,
          order_id: draft.order_id,
        })
      )
    );
  };

  const submitDeliveryReview = async () => {
    await MainApi.post(submit_deliveryman_review_api, {
      rating: deliveryDraft.rating,
      comment: deliveryDraft.comment,
      delivery_man_id: deliveryDraft.delivery_man_id,
      order_id: deliveryDraft.order_id,
    });
  };

  const handleSplitSubmit = async () => {
    const pendingItemDrafts = Object.values(itemDrafts).filter(
      (draft) => !draft?.isAlreadyReviewed
    );
    const hasDeliveryMan = Boolean(trackOrderData?.delivery_man);
    const needsDeliveryReview =
      showTabButtons && hasDeliveryMan && !isReviewedDeliveryman;
    const needsItemReview =
      moduleType !== "parcel" && pendingItemDrafts.length > 0;

    if (!needsItemReview && !needsDeliveryReview) {
      toast.success(t("All reviews are already submitted."));
      onReviewSubmitted?.(id);
      return;
    }

    if (needsItemReview) {
      const hasInvalidItems = pendingItemDrafts.some(
        (draft) => !draft?.rating || !String(draft?.comment || "").trim()
      );
      if (hasInvalidItems) {
        toast.error(
          t("Please add rating and feedback for all purchased products.")
        );
        return;
      }
    }

    if (needsDeliveryReview) {
      if (!deliveryDraft?.rating) {
        toast.error(t("Please add rating for delivery man."));
        return;
      }
      if (!String(deliveryDraft?.comment || "").trim()) {
        toast.error(t("Please add feedback for delivery service."));
        return;
      }
    }

    try {
      setBatchSubmitting(true);
      const requests = [];
      if (needsItemReview) {
        requests.push(submitItemReviews(pendingItemDrafts));
      }
      if (needsDeliveryReview) {
        requests.push(submitDeliveryReview());
      }
      await Promise.all(requests);
      toast.success(t("Reviews submitted successfully."));
      onReviewSubmitted?.(id);
    } catch (error) {
      toast.error(getReviewSubmitErrorMessage(error));
    } finally {
      setBatchSubmitting(false);
    }
  };

  const handleBatchSubmit = async () => {
    if (isSplitLayout) {
      await handleSplitSubmit();
      return;
    }

    if (type === "delivery_man") {
      if (deliveryDraft?.isAlreadyReviewed) {
        toast.success(t("Delivery man review is already submitted."));
        return;
      }
      if (!deliveryDraft) {
        toast.error(t("Please add delivery man review details."));
        return;
      }
      if (!deliveryDraft?.rating) {
        toast.error(t("Please add rating for delivery man."));
        return;
      }
      if (!String(deliveryDraft?.comment || "").trim()) {
        toast.error(t("Please add feedback for delivery man."));
        return;
      }
      try {
        setBatchSubmitting(true);
        await submitDeliveryReview();
        toast.success(t("Review submitted successfully."));
        onReviewSubmitted?.(id);
      } catch (error) {
        toast.error(getReviewSubmitErrorMessage(error));
      } finally {
        setBatchSubmitting(false);
      }
      return;
    }

    const pendingDrafts = Object.values(itemDrafts).filter(
      (draft) => !draft?.isAlreadyReviewed
    );
    if (pendingDrafts.length === 0) {
      toast.success(t("All items are already reviewed."));
      return;
    }
    const hasInvalid = pendingDrafts.some(
      (draft) => !draft?.rating || !String(draft?.comment || "").trim()
    );
    if (hasInvalid) {
      toast.error(t("Please add rating and feedback for all items."));
      return;
    }
    try {
      setBatchSubmitting(true);
      await submitItemReviews(pendingDrafts);
      const shouldMoveToDeliveryReview =
        embedded && showTabButtons && !isReviewedDeliveryman;
      if (shouldMoveToDeliveryReview) {
        toast.success(
          t("Item reviews submitted. Please review delivery service next.")
        );
        setType("delivery_man");
        await refetchTrackOrder();
      } else {
        toast.success(t("Reviews submitted successfully."));
        onReviewSubmitted?.(id);
      }
    } catch (error) {
      toast.error(getReviewSubmitErrorMessage(error));
    } finally {
      setBatchSubmitting(false);
    }
  };

  const productColumnSx = {
    width: { xs: "100%", md: "auto" },
    flex: { md: "6 1 0" },
    minWidth: 0,
    boxSizing: "border-box",
    pr: { md: 1.5 },
    pb: { xs: 1.25, md: 0 },
    borderBottom: {
      xs: (theme) => `1px solid ${alpha(theme.palette.neutral[400], 0.22)}`,
      md: "none",
    },
  };
  const deliveryColumnSx = {
    width: { xs: "100%", md: "auto" },
    flex: { md: "4 1 0" },
    minWidth: 0,
    boxSizing: "border-box",
    pl: { md: 1.5 },
  };
  const desktopSplitDividerSx = {
    display: { xs: "none", md: "block" },
    alignSelf: "stretch",
    borderColor: (theme) => alpha(theme.palette.neutral[400], 0.22),
    borderRightWidth: "1px",
    mx: 0,
  };

  const renderSplitMetaRow = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        mb: 0.75,
        gap: 0.75,
      }}
    >
      <Box sx={{ ...productColumnSx, pr: { md: 1.5 }, pb: 0, borderBottom: "none" }}>
        {deliveredLabel && (
          <Typography fontSize="11px" color="text.secondary" lineHeight={1.3}>
            {t("Delivered on")} {deliveredLabel}
          </Typography>
        )}
      </Box>
      <Divider orientation="vertical" flexItem sx={desktopSplitDividerSx} />
      <Box sx={{ ...deliveryColumnSx, pl: { md: 1.5 } }}>
        {storeLabel && (
          <Typography
            fontSize="11px"
            fontWeight={600}
            color="primary.main"
            lineHeight={1.3}
            sx={{ textAlign: { xs: "left", md: "left" } }}
          >
            {t("Sold by")} {storeLabel}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderItemsColumn = () => (
    <Box sx={{ width: "100%" }}>
      <Typography fontSize="12px" fontWeight={600} mb={0.75} lineHeight={1.3}>
        {t("Rate and review purchased product:")}
      </Typography>
      {reviewItems?.length ? (
        <Stack
          spacing={0.75}
          divider={<Divider flexItem />}
          sx={{
            width: "100%",
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: "8px",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: 1,
          }}
        >
          {reviewItems.map((item, index) => (
            <Box
              key={item?.item_id ?? `${item?.order_id}-${index}`}
              sx={{ width: "100%" }}
            >
              <ItemForm
                data={item}
                compact
                batchMode
                onDraftChange={handleItemDraftChange}
                onReviewSubmitted={onReviewSubmitted}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <CustomPaperBigCard>
          <CustomEmptyResult
            label={t("No reviewable items found for this order.")}
            image={nodata}
          />
        </CustomPaperBigCard>
      )}
    </Box>
  );

  const renderDeliveryColumn = () => (
    <Box sx={{ width: "100%" }}>
      <Typography fontSize="12px" fontWeight={600} mb={0.75} lineHeight={1.3}>
        {t("Rate and review delivery service:")}
      </Typography>
      {trackOrderData?.delivery_man ? (
        <Box
          sx={{
            borderRadius: "8px",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: (theme) => theme.palette.background.paper,
            p: 1,
          }}
        >
          <DeliverymanForm
            data={trackOrderData?.delivery_man}
            orderId={id}
            isReviewedDeliveryman={isReviewedDeliveryman}
            compact
            batchMode
            onDraftChange={setDeliveryDraft}
            onReviewSubmitted={onReviewSubmitted}
          />
        </Box>
      ) : (
        <CustomPaperBigCard>
          <CustomEmptyResult
            label={t("No delivery man assigned for the delivery.")}
            image={nodata}
          />
        </CustomPaperBigCard>
      )}
    </Box>
  );

  const renderSplitContent = () => {
    if (isReviewDataLoading) {
      return <Shimmer layout="split" />;
    }

    if (moduleType === "parcel") {
      return (
        <Box sx={{ width: "100%" }}>
          {renderSplitMetaRow()}
          {renderDeliveryColumn()}
        </Box>
      );
    }

    return (
      <Box sx={{ width: "100%" }}>
        {renderSplitMetaRow()}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            alignItems: "stretch",
          }}
        >
          <Box sx={productColumnSx}>{renderItemsColumn()}</Box>
          <Divider orientation="vertical" flexItem sx={desktopSplitDividerSx} />
          <Box sx={deliveryColumnSx}>{renderDeliveryColumn()}</Box>
        </Box>
      </Box>
    );
  };

  const renderTabsContent = () => (
    <>
      {showTabButtons && (
        <GroupButtonsRateAndReview
          setType={setType}
          type={type}
          moduleType={moduleType}
        />
      )}

      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={embedded ? 1.5 : 3}
        sx={{ maxWidth: "600px" }}
      >
        {!isReviewDataLoading && (
          <Box
            sx={{
              width: "100%",
              px: 1.25,
              py: 1,
              borderRadius: "8px",
              backgroundColor: (theme) =>
                type === "items"
                  ? theme.palette.primary.light + "22"
                  : theme.palette.success.light + "22",
              border: (theme) =>
                `1px solid ${
                  type === "items"
                    ? theme.palette.primary.light
                    : theme.palette.success.light
                }`,
            }}
          >
            <Typography fontSize={{ xs: "12px", md: "13px" }} fontWeight={600}>
              {type === "items"
                ? t("Item Review")
                : t("Delivery Service Review")}
            </Typography>
            <Typography
              fontSize={{ xs: "11px", md: "12px" }}
              color="text.secondary"
            >
              {type === "items"
                ? t(
                    "Rate product quality, taste/condition, and item satisfaction."
                  )
                : t(
                    "Rate delivery speed, rider behavior, and handover experience."
                  )}
            </Typography>
          </Box>
        )}
        {isReviewDataLoading ? (
          <Shimmer embedded={embedded} isItems={type === "items"} />
        ) : type === "items" && moduleType !== "parcel" ? (
          reviewItems?.length ? (
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
                {reviewItems?.map((item, index) => (
                  <Box
                    key={item?.item_id ?? `${item?.order_id}-${index}`}
                    sx={{ width: "100%" }}
                  >
                    <ItemForm
                      data={item}
                      compact={embedded}
                      batchMode={embedded}
                      onDraftChange={handleItemDraftChange}
                      onReviewSubmitted={onReviewSubmitted}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <CustomPaperBigCard>
              <CustomEmptyResult
                label={t("No reviewable items found for this order.")}
                image={nodata}
              />
            </CustomPaperBigCard>
          )
        ) : (
          <CustomPaperBigCard>
            {trackOrderData?.delivery_man ? (
              <DeliverymanForm
                data={trackOrderData?.delivery_man}
                orderId={id}
                isReviewedDeliveryman={isReviewedDeliveryman}
                compact={embedded}
                batchMode={embedded}
                onDraftChange={setDeliveryDraft}
                onReviewSubmitted={onReviewSubmitted}
              />
            ) : (
              <CustomStackFullWidth justifyContent="center" alignItems="center">
                <Stack
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <CustomEmptyResult
                    label={t("No delivery man assigned for the delivery.")}
                    image={nodata}
                  />
                </Stack>
              </CustomStackFullWidth>
            )}
          </CustomPaperBigCard>
        )}
      </CustomStackFullWidth>
    </>
  );

  return (
    <CustomStackFullWidth
      alignItems="stretch"
      justifyContent="center"
      spacing={isSplitLayout ? 1 : 2}
      mt={embedded ? "0" : "1rem"}
      sx={{ width: "100%" }}
    >
      {isSplitLayout ? renderSplitContent() : renderTabsContent()}

      {(isSplitLayout ||
        (embedded &&
          ((type === "items" && moduleType !== "parcel") ||
            type === "delivery_man"))) && (
        <Box
          sx={{
            mt: isSplitLayout ? 0.75 : 1,
            pt: isSplitLayout ? 0 : 1,
            pb: 0,
            ...(isSplitLayout
              ? {}
              : {
                  position: "sticky",
                  bottom: 0,
                  zIndex: 5,
                  backgroundColor: (theme) => theme.palette.background.paper,
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }),
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            width="100%"
            justifyContent={{ xs: "stretch", sm: "flex-end" }}
          >
            <LoadingButton
              variant="contained"
              size="small"
              loading={batchSubmitting}
              onClick={handleBatchSubmit}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                py: 0.65,
                px: 2.5,
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {t("Submit")}
            </LoadingButton>
          </Stack>
        </Box>
      )}
    </CustomStackFullWidth>
  );
};

export default RateAndReview;
