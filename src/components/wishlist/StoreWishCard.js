import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { useDispatch } from "react-redux";
import { Stack } from "@mui/system";
import {
  alpha,
  Box,
  Card,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import CustomRatings from "../search/CustomRatings";
import { removeWishListStore } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { useRouter } from "next/router";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

const StoreWishCard = ({ data, setSideDrawerOpen }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  const storeIdOrSlug = data?.id ? data?.id : data?.slug;

  const onStoreSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListStore(data?.id));
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate: storesMutate } = useWishListStoreDelete();
  const deleteWishlistStore = (e, id) => {
    e.stopPropagation();
    storesMutate(id, {
      onSuccess: onStoreSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  const handleCLick = (e) => {
    router.push(
      {
        pathname: "/store/[id]",
        query: {
          id: `${storeIdOrSlug}`,
          module_id: `${moduleId}`,
          store_zone_id: `${data?.zone_id}`,
        },
      },

    );

    setSideDrawerOpen(false);
  };
  return (
    <>
      <CustomStackFullWidth
        sx={{ marginTop: "1rem", cursor: "pointer" }}
        onClick={(e) => handleCLick(e)}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: "2px",
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.neutral[400], 0.16)}`,
            p: "10px",
            overflow: "hidden",
            boxShadow: "none",
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.35),
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: isSmall ? 200 : 220,
              borderRadius: "2px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: alpha(theme.palette.neutral[300], 0.25),
            }}
          >
            <CustomImageContainer
              src={data?.cover_photo_full_url || data?.logo_full_url}
              width="100%"
              height="100%"
              alt={data?.name}
              objectfit="cover"
            />
            <IconButton
              onClick={(e) => deleteWishlistStore(e, data?.id)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                borderRadius: "2px",
                backgroundColor: alpha(theme.palette.background.paper, 0.92),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
                color: theme.palette.primary.main,
                boxShadow: "none",
                "&:hover": {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.background.paper, 0.98),
                },
              }}
            >
              <FavoriteRoundedIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              mt: "-46px",
              mx: "12px",
              p: "12px",
              borderRadius: "2px",
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.neutral[400], 0.14)}`,
              position: "relative",
              zIndex: 2,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                minWidth: 52,
                borderRadius: "2px",
                border: `1px solid ${alpha(theme.palette.neutral[400], 0.25)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: alpha(theme.palette.neutral[200], 0.35),
              }}
            >
              <CustomImageContainer
                src={data?.logo_full_url}
                width="100%"
                height="100%"
                borderRadius="10px"
                objectfit="cover"
              />
            </Box>

            <Stack width="0px" flexGrow="1" spacing={0.7}>
              <Typography
                fontWeight="700"
                fontSize={{ xs: "14px", md: "16px" }}
                lineHeight={1.2}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.name}
              </Typography>

              <Typography
                fontWeight="400"
                fontSize={{ xs: "12px", md: "13px" }}
                color={theme.palette.neutral[400]}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.address}
              </Typography>

              <Stack direction="row" spacing={0.8} alignItems="center">
                <StorefrontRoundedIcon
                  sx={{ fontSize: "18px", color: theme.palette.neutral[600] }}
                />
                <CustomRatings
                  ratingValue={data?.avg_rating}
                  readOnly="true"
                  fontSize="16px"
                />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </CustomStackFullWidth>
    </>
  );
};

export default StoreWishCard;
