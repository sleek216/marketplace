import React, { useEffect } from "react";
import { FoodDetailModalStyle } from "../food-details/foodDetail-modal/foodDetailModal.style";
import { alpha, Modal } from "@mui/material";
import ProductDetailsSection from "../product-details/product-details-section/ProductDetailsSection";
import { Scrollbar } from "../srollbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useTheme } from "@emotion/react";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";
import useTrackRecentlyViewed from "api-manage/hooks/react-query/recently-viewed/useTrackRecentlyViewed";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const R = "2px";

const ModuleModal = (props) => {
  const theme = useTheme();
  const {
    open,
    handleModalClose,
    productDetailsData,
    configData,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    productUpdate,
  } = props;

  const handleSuccess = () => {};
  const params = {
    id: productDetailsData?.id,
  };
  const { data } = useGetItemDetails(params, handleSuccess, productUpdate);
  const { mutate: trackRecentlyViewed } = useTrackRecentlyViewed();

  useEffect(() => {
    const itemId = productDetailsData?.id || data?.id;
    if (!open || !itemId) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const moduleType =
      productDetailsData?.module_type ||
      productDetailsData?.module?.module_type ||
      data?.module_type ||
      data?.module?.module_type ||
      getCurrentModuleType();
    trackRecentlyViewed({
      module: moduleType,
      entity_id: itemId,
      viewed_at: new Date().toISOString(),
      token,
    });
  }, [open, productDetailsData?.id, data?.id]);

  return (
    <Modal open={open} onClose={handleModalClose} disableAutoFocus={true}>
      <FoodDetailModalStyle
        sx={{
          bgcolor: "background.paper",
          borderRadius: R,
          border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
          boxShadow: `0 8px 28px ${alpha(theme.palette.common.black, 0.14)}`,
          padding: { xs: "12px", sm: "16px", md: "18px" },
          outline: "none",
          overflow: "hidden",
        }}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={handleModalClose}
            aria-label="close"
            sx={{
              zIndex: 99,
              position: "absolute",
              top: { xs: 0, md: -6 },
              right: { xs: 0, md: -6 },
              width: 28,
              height: 28,
              borderRadius: R,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, fontWeight: 700 }} />
          </IconButton>
        </CustomStackFullWidth>
        <Scrollbar style={{ maxHeight: "calc(100vh - 160px)" }}>
          <ProductDetailsSection
            productDetailsData={productUpdate ? productDetailsData : data}
            configData={configData}
            modalmanage="true"
            handleModalClose={handleModalClose}
            addToWishlistHandler={addToWishlistHandler}
            removeFromWishlistHandler={removeFromWishlistHandler}
            isWishlisted={isWishlisted}
          />
        </Scrollbar>
      </FoodDetailModalStyle>
    </Modal>
  );
};

ModuleModal.propTypes = {};

export default ModuleModal;
