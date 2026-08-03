import { alpha, Grid, Stack, styled, Tooltip, Typography, Box, IconButton } from "@mui/material";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import { not_logged_in_message } from "utils/toasterMessages";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomRatingBox from "../CustomRatingBox";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ClosedNow from "components/closed-now";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";
import { MapPin, Clock, Heart, Navigation } from "lucide-react";
import { useTheme } from "@mui/material/styles";

// ─── Styled Components ──────────────────────────────────────────────────────

const Wrapper = styled(CustomStackFullWidth)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "0",
  border: `1px solid ${alpha(theme.palette.neutral[400], 0.15)}`,
  borderRadius: "4px",
  cursor: "pointer",
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
  ".store-name-text": {
    transition: "color 0.2s ease",
  },
  "&:hover": {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
    transform: "translateY(-2px)",
    img: { transform: "scale(1.06)" },
    ".store-name-text": {
      color: theme.palette.primary.main,
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "150px",
  overflow: "hidden",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  "img": {
    width: "100%",
    height: "100%",
    transition: "transform 0.4s ease",
  },
  [theme.breakpoints.down("sm")]: {
    height: "130px",
  },
}));

// Gradient overlay at the bottom of the image for the logo to sit on
const ImageGradient = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60px",
  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
  zIndex: 1,
  pointerEvents: "none",
});

const DistanceBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  left: "10px",
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(6px)",
  borderRadius: "20px",
  padding: "3px 8px",
  fontSize: "11px",
  fontWeight: 600,
  color: theme.palette.primary.main,
  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
}));

const WishlistButton = styled(IconButton)(({ theme, isWishlisted }) => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  zIndex: 3,
  width: "30px",
  height: "30px",
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  color: isWishlisted ? theme.palette.error.main : theme.palette.neutral[500],
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
    color: theme.palette.error.main,
  },
}));

// Store logo floating over the image
const LogoCircle = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "-18px",
  left: "14px",
  zIndex: 4,
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  overflow: "hidden",
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
  "img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "none !important",
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  padding: "22px 14px 14px 14px",
  width: "100%",
}));

const InfoRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginTop: "6px",
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const timeAndDeliveryTypeHandler = (item) => {
  const time = item?.delivery_time !== null ? item?.delivery_time : "";
  const free_delivery =
    item?.free_delivery === true ? `. ${t("Free Delivery")}` : "";
  return time + free_delivery;
};

const normalizeDistanceKm = (distance) => {
  const parsed = Number(distance);
  if (!Number.isFinite(parsed)) return null;
  // Backend can return either meters or km across endpoints.
  // Treat large values as meters to avoid unrealistic km output.
  return parsed > 100 ? parsed / 1000 : parsed;
};

// ─── Component ──────────────────────────────────────────────────────────────

const StoreCard = (props) => {
  const classes = textWithEllipsis();
  const { item, imageUrl, topoffer } = props;
  const { wishLists } = useSelector((state) => state.wishList);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const { mutate } = useWishListStoreDelete();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const { ref: textRef, isEllipsed } = useTextEllipsis(item?.name);
  const { ref: textRef2, isEllipsed: isEllipsed2 } = useTextEllipsis(item?.name);

  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);

  const wishlistItemExistHandler = () => {
    if (wishLists?.store?.find((wishItem) => wishItem.id === item?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
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
            dispatch(addWishListStore(item));
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
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      dispatch(removeWishListStore(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, { id: "wishlist" });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const handleClick = () => {
    router.push({
      pathname:
        getCurrentModuleType() === "rental"
          ? `/rental/provider-details/${item?.id}`
          : `/store/[id]`,
      query: {
        id: `${item?.slug ? item?.slug : item?.id}`,
        module_id: `${item?.module_id}`,
        module_type: getCurrentModuleType(),
        store_zone_id: `${item?.zone_id}`,
        distance: item?.distance,
      },
    });
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlistHandler(e);
    } else {
      addToWishlistHandler(e);
    }
  };

  // ─── Default (non-topoffer) card layout ─────────────────────────────────
  const defaultCard = (
    <>
      {/* Image section */}
      <ImageWrapper>
        <NextImage
          alt={item?.name}
          src={imageUrl}
          height={150}
          width={260}
          objectFit="cover"
        />

        {/* Bottom gradient */}
        <ImageGradient />

        {/* Distance badge — top left */}
        {item?.distance !== undefined && item?.distance !== null && (
          <DistanceBadge>
            <Navigation size={10} />
            <span>
              {(() => {
                const distanceKm = normalizeDistanceKm(item?.distance);
                if (distanceKm === null) return null;
                return `${distanceKm === 0 ? "0km" : `${distanceKm.toFixed(1)}km`} ${t("From You")}`;
              })()}
            </span>
          </DistanceBadge>
        )}

        {/* Wishlist button — top right */}
        <WishlistButton
          isWishlisted={isWishlisted ? 1 : 0}
          onClick={handleWishlistClick}
          size="small"
        >
          <Heart
            size={14}
            fill={isWishlisted ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </WishlistButton>

        {/* Store logo floating at the bottom-left */}
        {item?.logo_full_url && (
          <LogoCircle>
            <NextImage
              src={item?.logo_full_url}
              alt={item?.name}
              height={44}
              width={44}
              objectFit="cover"
            />
          </LogoCircle>
        )}

        {/* Closed overlay */}
        <ClosedNow
          active={item?.active}
          open={item?.open}
          borderRadius="0"
        />
      </ImageWrapper>

      {/* Info section */}
      <InfoSection>
        {/* Store name + rating */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "6px",
          }}
        >
          <Tooltip
            title={item?.name || ""}
            placement="bottom"
            arrow
            disableHoverListener={!isEllipsed2}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: (t) => t.palette.toolTipColor,
                  "& .MuiTooltip-arrow": { color: (t) => t.palette.toolTipColor },
                },
              },
            }}
          >
            <Typography
              ref={textRef2}
              className={`${classes.singleLineEllipsis} store-name-text`}
              fontWeight="700"
              fontSize={{ xs: "13px", md: "14px" }}
              component="h3"
              sx={{ flex: 1, minWidth: 0 }}
            >
              {item?.name}
            </Typography>
          </Tooltip>

          {item?.avg_rating > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                flexShrink: 0,
                backgroundColor: (t) => alpha(t.palette.warning.main, 0.1),
                borderRadius: "6px",
                px: "6px",
                py: "2px",
              }}
            >
              <GradeRoundedIcon
                sx={{ fontSize: "12px", color: "warning.main" }}
              />
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "warning.dark",
                }}
              >
                {item?.avg_rating}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Address */}
        {item?.address && (
          <InfoRow>
            <MapPin size={12} color={theme.palette.text.disabled} style={{ flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: "11px",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
              }}
            >
              {item?.address}
            </Typography>
          </InfoRow>
        )}

        {/* Delivery time + free delivery */}
        {(item?.delivery_time || item?.free_delivery) && (
          <InfoRow>
            <Clock size={12} color={theme.palette.text.disabled} style={{ flexShrink: 0 }} />
            <Typography
              sx={{ fontSize: "11px", color: "text.secondary" }}
            >
              {item?.delivery_time}
              {item?.free_delivery && (
                <Box
                  component="span"
                  sx={{
                    ml: "6px",
                    px: "6px",
                    py: "1px",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: (t) => alpha(t.palette.success.main, 0.1),
                    color: "success.dark",
                  }}
                >
                  {t("Free Delivery")}
                </Box>
              )}
            </Typography>
          </InfoRow>
        )}
      </InfoSection>
    </>
  );

  // ─── Top-offer card layout ───────────────────────────────────────────────
  const topOfferCard = (
    <>
      <ImageWrapper>
        <NextImage
          alt={item?.name}
          src={imageUrl}
          height={150}
          width={260}
          objectFit="cover"
        />
        <ImageGradient />

        {/* Discount badge */}
        {item?.discount?.discount && (
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 3,
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "20px",
              px: "8px",
              py: "3px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {item?.discount?.discount}
            {item?.discount?.discount_type && "%"} {t("off")}
          </Box>
        )}

        <WishlistButton
          isWishlisted={isWishlisted ? 1 : 0}
          onClick={handleWishlistClick}
          size="small"
        >
          <Heart
            size={14}
            fill={isWishlisted ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </WishlistButton>

        {item?.logo_full_url && (
          <LogoCircle>
            <NextImage
              src={item?.logo_full_url}
              alt={item?.name}
              height={44}
              width={44}
              objectFit="cover"
            />
          </LogoCircle>
        )}

        <ClosedNow active={item?.active} open={item?.open} borderRadius="0" />
      </ImageWrapper>

      <InfoSection>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "6px",
          }}
        >
          <Tooltip
            title={item?.name || ""}
            arrow
            placement="bottom"
            disableHoverListener={!isEllipsed}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: (t) => t.palette.toolTipColor,
                  "& .MuiTooltip-arrow": { color: (t) => t.palette.toolTipColor },
                },
              },
            }}
          >
            <Typography
              ref={textRef}
              className="store-name-text"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "13px", sm: "14px" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
              }}
              component="h3"
            >
              {item?.name}
            </Typography>
          </Tooltip>

          {item?.avg_rating > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                flexShrink: 0,
                backgroundColor: (t) => alpha(t.palette.warning.main, 0.1),
                borderRadius: "6px",
                px: "6px",
                py: "2px",
              }}
            >
              <GradeRoundedIcon sx={{ fontSize: "12px", color: "warning.main" }} />
              <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "warning.dark" }}>
                {item?.avg_rating}
              </Typography>
            </Box>
          )}
        </Box>

        {(item?.delivery_time || item?.free_delivery) && (
          <InfoRow>
            <Clock size={12} color={theme.palette.text.disabled} style={{ flexShrink: 0 }} />
            <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
              {item?.delivery_time}
              {item?.free_delivery && (
                <Box
                  component="span"
                  sx={{
                    ml: "6px",
                    px: "6px",
                    py: "1px",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: 600,
                    backgroundColor: (t) => alpha(t.palette.success.main, 0.1),
                    color: "success.dark",
                  }}
                >
                  {t("Free Delivery")}
                </Box>
              )}
            </Typography>
          </InfoRow>
        )}
      </InfoSection>
    </>
  );

  return (
    <Wrapper onClick={handleClick}>
      {topoffer ? topOfferCard : defaultCard}
    </Wrapper>
  );
};

StoreCard.propTypes = {};

export default StoreCard;
