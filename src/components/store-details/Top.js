import { Heart as FavoriteIcon, Heart as FavoriteBorderIcon, Navigation as DirectionsIcon } from "lucide-react";
import {
  alpha,
  Grid,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Box, Stack } from "@mui/system";
import React, {useReducer, useState} from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {
  addWishListStore,
  removeWishListStore,
} from "redux/slices/wishList";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import ClosedNowScheduleWise from "../closed-now/ClosedNowScheduleWise";
import CustomImageContainer from "../CustomImageContainer";
import { StyledRating } from "../CustomMultipleRatings";
import LocationViewOnMap from "../Map/location-view/LocationViewOnMap";
import { RoundedIconButton } from "../product-details/product-details-section/ProductsThumbnailsSettings";
import H1 from "../typographies/H1";
import Link from "next/link";
import { useRouter } from "next/router";
import { getImageUrl } from "utils/CustomFunctions";
import StoreShare from "components/store-details/StoreShare";

const ContentWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  position: "relative",
  height: "250px",
  width: "50%",
  borderTopLeftRadius: "2px",
  borderBottomLeftRadius: "2px",
  overflow: "hidden",
}));

const ImageWrapper = styled(Box)(({ theme, smallScreen }) => ({
  position: "relative",
  maxWidth: "100px",
  width: "100%",
  height: "100px",
  [theme.breakpoints.down("lg")]: {
    height: "100px",
    maxWidth: "110px",
  },
  [theme.breakpoints.down("md")]: {
    //height: "120px",
    maxWidth: "110px",
  },
  [theme.breakpoints.down("sm")]: {
    height: smallScreen === "true" ? "100px" : "65px",
    maxWidth: smallScreen !== "true" && "85px",
    width: smallScreen === "true" && "100px",
  },
}));
const PrimaryWrapper = styled(Box)(({ theme, borderradius }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.whiteContainer.main,
  padding: "8px",
  borderRadius: "2px",
  cursor: "pointer",
}));
const ContentBox = styled(Box)(({ theme, borderradius }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  color: theme.palette.whiteContainer.main,
  borderRadius: "2px",
}));

const initialState = {
  viewMap: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setViewMap":
      return {
        ...state,
        viewMap: action.payload,
      };
    default:
      return state;
  }
};
const Top = (props) => {
  const {
    bannerCover,
    storeDetails,
    configData,
    logo,
    storeShare,
    bannersData,
    isLoading,
    setOpenReviewModal,
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [openShareModel,setOpenShareModel]=useState(false)
  const dispatchRedux = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const router = useRouter();
  const ACTION = {
    setViewMap: "setViewMap",
  };
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const openMapHandler = () => {
    dispatch({ type: ACTION.setViewMap, payload: true });
  };
  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(storeDetails?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishListStore(storeDetails));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const isInWishList = (id) => {
    return !!wishLists?.store?.find(
      (wishStore) => wishStore.id === storeDetails?.id
    );
  };
  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListStore(storeDetails?.id));
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
  const getModuleWiseBG = () => ({
    bgColor: theme.palette.primary.main,
  });
  const handleBannerClick = (link) => {
    if (link) {
      router.push(link);
    }
  };
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    toast(() => <span>{t('Your restaurant URL has been copied')}</span>)
  }
  const text1=t("discount will be applicable when  order amount exceeds is more than")
  const max=t("max")
  const text2=t("discount is applicable.")

  const content = () => {
    if (isSmall) {
      return (
        <CustomStackFullWidth>
          <CustomBoxFullWidth
            sx={{
              position: "relative",
              height: "122px",
              borderBottomRightRadius:"2px"
            }}
          >
            {storeDetails?.discount ? (
              <Stack
                sx={{
                  position: "absolute",
                  bottom: "6px",
                  left: 0,
                  right: 0,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.7),
                  color: (theme) => theme.palette.neutral[100],
                  padding: "10px",
                  borderRadius: "2px",
                }}
              >
                <Typography fontSize="13px" fontWeight="600" textAlign="center">
                  {`${storeDetails?.discount?.discount}% ${text1}  ${getAmountWithSign(
                    storeDetails?.discount?.min_purchase
                  )} ${max} ${getAmountWithSign(
                    storeDetails?.discount?.max_discount
                  )}, ${text2}`}

                </Typography>
              </Stack>
            ) : null}
            {bannersData?.length ? (
              <Slider {...settings}>
                {bannersData?.map((banner) => {
                  return (
                    <Stack
                      key={banner?.id}
                      onClick={() => handleBannerClick(banner?.default_link)}
                      sx={{
                        cursor: "pointer",
                        borderBottomRightRadius:"2px"
                      }}
                    >
                      <CustomImageContainer
                        src={banner?.image_full_url}
                        width="100%"
                        height="122px"
                        objectFit="cover"
                        borderRadius="2px"
                      />
                    </Stack>
                  );
                })}
              </Slider>
            ) : (
              <CustomImageContainer
                src={bannerCover}
                width="100%"
                height="100%"
                objectFit="cover"
                borderRadius="2px"
              />
            )}{" "}
          </CustomBoxFullWidth>
          <CustomStackFullWidth>
            <CustomBoxFullWidth
              sx={{
                backdropFilter: "blur(10px)",
                zIndex: 0,
              }}
            >
              <CustomBoxFullWidth
                sx={{
                  backgroundColor: getModuleWiseBG()?.bgColor,
                  zIndex: 999,
                  position: "relative",
                }}
              >
                <CustomBoxFullWidth
                  sx={{
                    background: " rgba(255, 255, 255, 0.1)",
                    boxShadow: "0px 2px 30px 2px rgba(0, 0, 0, 0.08)",
                    padding: "15px 20px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid
                      item
                      xs={4}
                      sm={2}
                      sx={{
                        mt: "22px",
                        mb: "30px",
                        position: "relative",
                      }}
                    >
                      <CustomBoxFullWidth
                        sx={{ position: "absolute", top: -52 }}
                      >
                        <ImageWrapper smallScreen="true">
                          <CustomImageContainer
                            src={logo}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            borderRadius="50%"
                          />
                          <ClosedNowScheduleWise
                            active={storeDetails?.active}
                            schedules={storeDetails?.schedules}
                            borderRadius="50%"
                          />
                        </ImageWrapper>
                      </CustomBoxFullWidth>
                    </Grid>
                    <Grid item xs={8} sm={10}>
                      <CustomStackFullWidth
                        sx={{ color: "whiteContainer.main" }}
                        spacing={1}
                      >
                        <H1 text={storeDetails?.name} textAlign="flex-start" />

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.4}
                          >
                            <StyledRating
                              name="read-only"
                              value={
                                storeDetails?.avg_rating
                                  ? storeDetails.avg_rating
                                  : 5
                              }
                              readOnly
                              size="small"
                              hasRating="true"
                            />
                            {storeDetails?.rating_count !== 0 ? (
                              <Typography>{`(${storeDetails?.avg_rating})`}</Typography>
                            ) : null}
                          </Stack>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.neutral[600],
                            }}
                          >
                            |
                          </Typography>
                          {storeDetails?.rating_count !== 0 ? (
                            <Typography
                              textDecoration="underline"
                              fontWeight="700"
                              lineHeight="16.15px"
                              sx={{
                                fontSize: {
                                  xs: "10px",
                                  sm: "14px",
                                },
                                cursor: "pointer",
                              }}
                              onClick={() => setOpenReviewModal(true)}
                            >
                              {storeDetails?.reviews_comments_count}{" "}
                              {t("Reviews")}
                            </Typography>
                          ) : (
                            <Typography
                              fontSize={{ xs: "11px", md: "13.5px" }}
                              sx={{ textDecoration: "underLine" }}
                            >
                              {t("No reviews yet")}
                            </Typography>
                          )}
                        </Stack>
                        <Typography
                          textDecoration="underline"
                          fontWeight="400"
                          lineHeight="16.15px"
                          sx={{
                            fontSize: { xs: "12px", sm: "14px" },
                          }}
                        >
                          {storeDetails?.address}
                        </Typography>
                      </CustomStackFullWidth>
                    </Grid>
                  </Grid>
                </CustomBoxFullWidth>
              </CustomBoxFullWidth>
            </CustomBoxFullWidth>
            <CustomBoxFullWidth
              sx={{
                backgroundColor: getModuleWiseBG()?.bgColor,
                opacity: "0.9",
                padding: { xs: "14px 12px", sm: "13.5px 25px" },
                color: "whiteContainer.main",
              }}
            >
              <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                {storeDetails?.positive_rating !== 0 ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.35}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      px: 1,
                      borderRight: (th) =>
                        storeDetails?.minimum_order !== 0
                          ? `1px solid ${alpha(th.palette.common.white, 0.22)}`
                          : "none",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "18px", sm: "22px" },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}
                    >
                      {storeDetails?.positive_rating.toFixed(0)}%
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "11px", sm: "inherit" },
                        lineHeight: 1.25,
                        textAlign: "center",
                        opacity: 0.92,
                      }}
                    >
                      {t("Positive Review")}
                    </Typography>
                  </Stack>
                ) : null}
                {storeDetails?.minimum_order !== 0 ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.35}
                    sx={{ flex: 1, minWidth: 0, px: 1 }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "18px", sm: "22px" },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}
                    >
                      {getAmountWithSign(storeDetails?.minimum_order)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "11px", sm: "inherit" },
                        lineHeight: 1.25,
                        textAlign: "center",
                        opacity: 0.92,
                      }}
                    >
                      {t("Minimum Order Value")}
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      );
    } else {
      return (
        <CustomStackFullWidth
          direction="row"
          sx={{
            borderRadius: "6px",
            overflow: "hidden",
            minHeight: "220px",
            height: "235px",
            boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.06)",
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`,
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "100%",
              backgroundColor: getModuleWiseBG()?.bgColor,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: "14px 18px", md: "18px 22px" },
              color: theme.palette.whiteContainer.main,
            }}
          >
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={3.5} md={3}>
                <ImageWrapper>
                  <CustomImageContainer
                    src={logo}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    borderRadius="4px"
                  />
                  <ClosedNowScheduleWise
                    active={storeDetails?.active}
                    schedules={storeDetails?.schedules}
                    borderRadius="50%"
                  />
                </ImageWrapper>
              </Grid>
              <Grid item xs={6.5} md={7} alignSelf="center">
                <CustomStackFullWidth spacing={0.8}>
                  <H1 text={storeDetails?.name} textAlign="flex-start" />

                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.4}
                    >
                      <StyledRating
                        sx={{
                          color:
                            storeDetails?.avg_rating === 0
                              ? alpha(
                                  theme.palette.whiteContainer.main,
                                  0.6
                                )
                              : "warning.dark",
                        }}
                        name="read-only"
                        value={
                          storeDetails?.avg_rating
                            ? storeDetails?.avg_rating
                            : 5
                        }
                        readOnly
                        size="small"
                        hasRating={
                          storeDetails?.avg_rating === 0 ? true : false
                        }
                      />
                      {storeDetails?.rating_count !== 0 ? (
                        <Typography>{`(${storeDetails?.avg_rating})`}</Typography>
                      ) : null}
                    </Stack>
                    <Typography
                      sx={{
                        color: (theme) => theme.palette.neutral[600],
                      }}
                    >
                      |
                    </Typography>
                    {storeDetails?.rating_count !== 0 ? (
                      <Typography
                        onClick={() => setOpenReviewModal(true)}
                        fontSize="13px"
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        fontWeight="700"
                        lineHeight="16.15px"
                        component="span"
                      >
                        {storeDetails?.reviews_comments_count}
                        <Typography
                          component="span"
                          fontSize="13px"
                          fontWeight="400"
                        >
                          {t(" Reviews")}
                        </Typography>
                      </Typography>
                    ) : (
                      <Typography fontSize="13px">
                        {t("No reviews yet")}
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    fontSize="13px"
                    textDecoration="underline"
                    fontWeight="400"
                    lineHeight="16.15px"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {storeDetails?.address}
                  </Typography>
                </CustomStackFullWidth>
              </Grid>
              <Grid item xs={2} align="right">
                {!isInWishList(storeDetails?.id) && (
                  <Tooltip
                    title={"Add to wishlist"}
                    arrow
                    placement={"bottom"}
                  >
                    <RoundedIconButton
                      onClick={addToFavorite}
                      sx={{ color: "primary.main", borderRadius: "2px" }}
                    >
                      <FavoriteBorderIcon size={18} fill="none" />
                    </RoundedIconButton>
                  </Tooltip>
                )}
                {isInWishList(storeDetails?.id) && (
                  <Tooltip
                    title={"Remove from wishlist"}
                    arrow
                    placement={"bottom"}
                  >
                    <RoundedIconButton
                      onClick={() =>
                        deleteWishlistStore(storeDetails?.id)
                      }
                      sx={{ color: "error.main", borderRadius: "2px" }}
                    >
                      <FavoriteIcon size={18} fill="currentColor" />
                    </RoundedIconButton>
                  </Tooltip>
                )}

                <Box mt="8px">
                  <Tooltip title={"View on map"} arrow placement={"bottom"}>
                    <RoundedIconButton
                      onClick={openMapHandler}
                      sx={{ color: "primary.main", borderRadius: "2px" }}
                    >
                      <DirectionsIcon size={18} />
                    </RoundedIconButton>
                  </Tooltip>
                </Box>
                <Box mt="8px">
                  <Tooltip title={"Share"} arrow placement={"bottom"}>
                    <RoundedIconButton
                      onClick={() => setOpenShareModel(true)}
                      sx={{ color: "primary.main", borderRadius: "2px" }}
                    >
                      <ShareOutlinedIcon />
                    </RoundedIconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
            {(storeDetails?.positive_rating !== 0 || storeDetails?.minimum_order !== 0) ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{
                  pt: 1,
                  borderTop: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
                }}
              >
                {storeDetails?.positive_rating !== 0 ? (
                  <Stack alignItems="flex-start">
                    <Typography
                      textAlign="center"
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      {storeDetails?.positive_rating.toFixed(0)}%
                    </Typography>
                    <Typography fontSize="12px">{t("Positive Review")}</Typography>
                  </Stack>
                ) : null}
                {storeDetails?.minimum_order !== 0 ? (
                  <Stack alignItems="flex-start">
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      {getAmountWithSign(storeDetails?.minimum_order)}
                    </Typography>
                    <Typography fontSize="12px">{t("Minimum Order Value")}</Typography>
                  </Stack>
                ) : null}
              </Stack>
            ) : null}
          </Box>
          <Stack
            width="50%"
            sx={{
              position: "relative",
              backgroundColor: "background.default",
              overflow: "hidden",
              height: "100%",
            }}
          >
            {storeDetails?.discount ? (
              <Stack
                sx={{
                  position: "absolute",
                  bottom: "6px",
                  left: 0,
                  right: 0,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.7),
                  color: (theme) => theme.palette.neutral[100],
                  padding: "10px",
                  borderRadius: "0px",
                  zIndex: 999,
                }}
              >
                <Typography fontSize="13px" fontWeight="600" textAlign="center">
                  {`${storeDetails?.discount?.discount}% ${text1}  ${getAmountWithSign(
                    storeDetails?.discount?.min_purchase
                  )} ${max} ${getAmountWithSign(
                    storeDetails?.discount?.max_discount
                  )}, ${text2}`}
                </Typography>
              </Stack>
            ) : null}
            {!isLoading ? (
              <>
                {bannersData?.length ? (
                  <Slider {...settings}>
                    {bannersData?.map((banner) => {
                      return (
                        <Stack
                          key={banner?.id}
                          onClick={() =>
                            handleBannerClick(banner?.default_link)
                          }
                          sx={{
                            cursor: "pointer",
                            width: "100%",
                            height: "235px",
                          }}
                        >
                          <CustomImageContainer
                            src={banner?.image_full_url}
                            width="100%"
                            height="235px"
                            objectFit="cover"
                          />
                        </Stack>
                      );
                    })}
                  </Slider>
                ) : (
                  <Stack sx={{ width: "100%", height: "235px" }}>
                    <CustomImageContainer
                      src={bannerCover}
                      width="100%"
                      height="235px"
                      objectFit="cover"
                    />
                  </Stack>
                )}
              </>
            ) : (
              <Skeleton width="100%" height="100%" variant="rectangular" />
            )}
          </Stack>
        </CustomStackFullWidth>
      );
    }
  };
  return (
    <>
      {content()}
      {state.viewMap && (
        <LocationViewOnMap
          open={state.viewMap}
          handleClose={() =>
            dispatch({ type: ACTION.setViewMap, payload: false })
          }
          latitude={storeDetails?.latitude}
          longitude={storeDetails?.longitude}
          address={storeDetails?.address}
          storeDetails={storeDetails}
        />
      )}
      {openShareModel&&<StoreShare
        handleCopy={handleCopy}
        setOpenShareModal={setOpenShareModel}
        openShareModal={openShareModel}
      />}
    </>
  );
};

Top.propTypes = {};

export default Top;
