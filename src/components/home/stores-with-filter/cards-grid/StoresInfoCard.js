import { Trash2 as DeleteIcon, Heart as FavoriteIcon, HeartOff as FavoriteBorderIcon, MapPin as PlaceIcon } from "lucide-react";
import { alpha, Chip, IconButton, Paper, styled, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "../../../../api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "../../../../api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import {
  addWishListStore,
  removeWishListStore,
} from "../../../../redux/slices/wishList";
import { not_logged_in_message } from "../../../../utils/toasterMessages";
import ClosedNow from "../../../closed-now";
import CustomDialogConfirm from "../../../custom-dialog/confirm/CustomDialogConfirm";
import CustomImageContainer from "../../../CustomImageContainer";
import RatingStar from "../../../RatingStar";

const CardWrapper = styled(Paper)(({ theme }) => ({
  borderRadius: "4px",
  overflow: "hidden",
  height: "100%",
  cursor: "pointer",
  position: "relative",
  boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow: "0px 8px 28px rgba(0,0,0,0.14)",
    transform: "translateY(-2px)",
  },
}));

export const HeartWrapper = styled(IconButton)(({ theme, top, right }) => ({
  zIndex: 2,
  width: "34px",
  height: "34px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
  position: "absolute",
  top: top,
  right: right,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StoresInfoCard = (props) => {
  const { data, wishlistcard } = props;
  const id = data?.id ? data?.id : data?.slug;
  const { configData } = useSelector((state) => state.configData);
  const store_image_url = `${configData?.base_urls?.store_image_url}`;
  const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;

  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const gray = theme.palette.neutral[400];
  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishListStore(data));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const isInList = (id) => {
    return !!wishLists?.store?.find((wishStore) => wishStore.id === id);
  };
  const onSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListStore(id));
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate } = useWishListStoreDelete();
  const deleteWishlistStore = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  return (
    <Stack sx={{ position: "relative", height: "100%" }}>
      <Link
        href={{
          pathname: "/store/[id]",
          query: { id: `${id}`, module_id: `${moduleId}` },
          store_zone_id: `${data?.zone_id}`,
        }}
      >
        <CardWrapper>
          {/* ── Cover banner ── */}
          <Box sx={{ position: "relative", width: "100%", height: "160px", overflow: "hidden" }}>
            <CustomImageContainer
              src={data?.cover_photo_full_url || data?.logo_full_url}
              alt={data?.name}
              height="100%"
              width="100%"
              objectFit="cover"
            />

            {/* Heart button */}
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                wishlistcard === "true"
                  ? setOpenModal(true)
                  : isInList(id)
                  ? deleteWishlistStore(id)
                  : addToFavorite();
              }}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 2,
                width: 34,
                height: 34,
                backgroundColor: "background.paper",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                color: isInList(id) ? "primary.main" : "text.secondary",
                "&:hover": {
                  backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              {wishlistcard === "true" ? (
                <DeleteIcon size={16} color={theme.palette.error.light} />
              ) : isInList(id) ? (
                <FavoriteIcon size={16} />
              ) : (
                <FavoriteBorderIcon size={16} />
              )}
            </IconButton>

            {/* Closed overlay */}
            <ClosedNow active={data?.active} open={data?.open} />
          </Box>

          {/* ── Card body ── */}
          <Box sx={{ px: 1.5, pt: 0, pb: 1.5, position: "relative" }}>
            {/* Logo badge overlapping the banner */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "12px",
                overflow: "hidden",
                border: (theme) => `2.5px solid ${theme.palette.background.paper}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                mt: "-26px",
                mb: 0.75,
                backgroundColor: "background.paper",
                flexShrink: 0,
              }}
            >
              <CustomImageContainer
                src={data?.logo_full_url}
                alt={data?.name}
                height="100%"
                width="100%"
                objectFit="cover"
              />
            </Box>

            {/* Name */}
            <Typography
              fontWeight="700"
              fontSize="15px"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.3,
                mb: 0.4,
              }}
            >
              {data?.name}
            </Typography>

            {/* Address */}
            <Stack direction="row" alignItems="flex-start" spacing={0.4} mb={0.6}>
              <PlaceIcon size={13} color={gray} style={{ marginTop: 2, flexShrink: 0 }} />
              <Typography
                variant="body2"
                color={gray}
                fontSize="12px"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {data?.address}
              </Typography>
            </Stack>

            {/* Rating */}
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <RatingStar fontSize="14px" color="warning.dark" />
              <Typography fontSize="12px" fontWeight="600" color="text.secondary">
                {data?.avg_rating?.toFixed(1)}
              </Typography>
            </Stack>
          </Box>
        </CardWrapper>
      </Link>

      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => deleteWishlistStore(id)}
      />
    </Stack>
  );
};

StoresInfoCard.propTypes = {};

export default StoresInfoCard;
