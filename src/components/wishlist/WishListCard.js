import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { Stack } from "@mui/system";
import { alpha, Box, IconButton, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "redux/slices/cart";
import toast from "react-hot-toast";
import {
  ACTION,
  initialState,
  reducer,
} from "../product-details/product-details-section/states";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";
import { t } from "i18next";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import ModuleModal from "../cards/ModuleModal";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { not_logged_in_message } from "utils/toasterMessages";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import { getGuestId } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useAddCartItem from "../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import Loading from "../custom-loading/Loading";

const actionButtonSx = (theme, variant = "default") => ({
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: "2px",
  border: `1px solid ${
    variant === "danger"
      ? alpha(theme.palette.error.main, 0.35)
      : alpha(theme.palette.divider, 0.85)
  }`,
  bgcolor: theme.palette.background.paper,
  boxShadow: "none",
  flexShrink: 0,
  color:
    variant === "danger"
      ? theme.palette.error.main
      : theme.palette.primary.main,
  "&:hover": {
    boxShadow: "none",
    bgcolor:
      variant === "danger"
        ? alpha(theme.palette.error.main, 0.08)
        : alpha(theme.palette.primary.main, 0.08),
    borderColor:
      variant === "danger"
        ? theme.palette.error.main
        : theme.palette.primary.main,
  },
});

const WishListCard = ({ item }) => {
  const theme = useTheme();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const reduxDispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { wishLists } = useSelector((state) => state.wishList);
  const { mutate } = useWishListDelete();
  const router = useRouter();
  const { mutate: addToMutate, isLoading } = useAddCartItem();

  const handleClose = () => {
    setOpenItemModal(false);
  };

  useEffect(() => {
    if (item) {
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...item,
          quantity: 1,
          price: item?.price,
          totalPrice: item?.price,
        },
      });
    }
  }, [item]);

  const handleSuccess = (res) => {
    if (res) {
      let product = {};
      res?.forEach((cartItem) => {
        product = {
          ...cartItem?.item,
          cartItemId: cartItem?.id,
          quantity: cartItem?.quantity,
          totalPrice: cartItem?.price,
          selectedOption: [],
        };
      });
      reduxDispatch(setCart(product));
      toast.success(t("Item added to cart"));
    }
  };

  const addToCartHandler = () => {
    const itemObject = {
      guest_id: getGuestId(),
      model: state.modalData[0]?.available_date_starts
        ? "ItemCampaign"
        : "Item",
      add_on_ids: [],
      add_on_qtys: [],
      item_id: state.modalData[0]?.id,
      price: state?.modalData[0]?.price,
      quantity: state?.modalData[0]?.quantity,
      variation: [],
    };
    addToMutate(itemObject, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };

  const addToCart = (e) => {
    if (item?.module_type === "ecommerce") {
      if (item?.variations.length > 0) {
        router.push(
          {
            pathname: "/product/[id]",
            query: {
              id: `${item?.slug ? item?.slug : item?.id}`,
              module_id: `${getModuleId()}`,
            },
          },
          undefined,
          { shallow: true }
        );
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    } else if (item?.food_variations.length > 0 || item?.variations.length > 0) {
      setOpenItemModal(true);
    } else {
      e.stopPropagation();
      addToCartHandler();
    }
  };

  const handleClick = () => {
    if (item?.module_type === "ecommerce") {
      router.push(
        {
          pathname: "/product/[id]",
          query: {
            id: `${item?.slug ? item?.slug : item?.id}`,
            module_id: `${getModuleId()}`,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      setOpenItemModal(true);
    }
  };

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.id, {
        onSuccess: (response) => {
          if (response) {
            reduxDispatch(addWishList(item));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };

  const removeFromWishlistHandler = (e) => {
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListItem(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  useEffect(() => {
    const wishlistItemExistHandler = () => {
      if (wishLists?.item?.find((wishItem) => wishItem.id === item?.id)) {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    };
    wishlistItemExistHandler();
  }, [wishLists, item?.id]);

  const handleDelete = (e) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          width: "100%",
          p: 1.25,
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.65)}`,
          bgcolor: theme.palette.background.paper,
          cursor: "pointer",
          transition: "border-color 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.35),
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            minWidth: 64,
            flexShrink: 0,
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <CustomImageContainer
            src={item?.image_full_url}
            width="100%"
            height="100%"
            borderRadius="2px"
            objectfit="cover"
          />
        </Box>

        <Stack flex={1} minWidth={0} justifyContent="center" spacing={0.35}>
          <Typography
            fontWeight={600}
            fontSize={{ xs: "14px", sm: "15px" }}
            lineHeight={1.35}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item?.name}
          </Typography>
        <AmountWithDiscountedAmount item={item} compact />
        </Stack>

        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          flexShrink={0}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={addToCart}
            aria-label={t("Add to cart")}
            sx={actionButtonSx(theme, "default")}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <IconButton
            onClick={handleDelete}
            aria-label={t("Delete")}
            sx={actionButtonSx(theme, "danger")}
          >
            <Trash2 size={17} strokeWidth={2.2} />
          </IconButton>
        </Stack>
      </Box>

      {openItemModal && getCurrentModuleType() === "food" ? (
        <FoodDetailModal
          product={item}
          imageBaseUrl={imageBaseUrl}
          open={openItemModal}
          handleModalClose={handleClose}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      ) : (
        <ModuleModal
          open={openItemModal}
          handleModalClose={handleClose}
          configData={configData}
          productDetailsData={item}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      )}
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to  delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={removeFromWishlistHandler}
      />
    </>
  );
};

export default WishListCard;
