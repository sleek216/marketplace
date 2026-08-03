/* eslint-disable @next/next/no-img-element */
import { alpha, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { t } from "i18next";
import { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import CustomImageContainer from "../CustomImageContainer";
import CustomRatingBox from "../CustomRatingBox";
import OrganicTag from "../organic-tag";
import RecommendTag from "../recommendTag";
import AddWithIncrementDecrement from "./AddWithIncrementDecrement";
import QuickView, { PrimaryToolTip } from "./QuickView";
import NextImage from "components/NextImage";
import ProductShareAction from "components/share/ProductShareAction";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

const VegNonVegFlag = styled(Box)(({ theme, veg, rounded }) => ({
  height: "14px",
  width: "14px",
  color: veg === "true" ? theme.palette.primary.customType3 : "red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid",
  borderRadius: rounded ? rounded : "",
}));
const Circle = styled(Box)(({ theme, veg }) => ({
  height: "10px",
  width: "10px",
  backgroundColor: veg === "true" ? theme.palette.primary.customType3 : "red",
  borderRadius: "50%",
}));

export const FoodVegNonVegFlag = ({ veg }) => {
  return (
    <Tooltip
      arrow
      placement="top"
      title={veg === "true" ? t("Veg") : t("Non Veg")}
    >
      <VegNonVegFlag veg={veg}>
        <Circle veg={veg} />
      </VegNonVegFlag>
    </Tooltip>
  );
};

export const FoodHalalHaram = ({ position, width }) => {
  return (
    <PrimaryToolTip text={t("This product is Halal")}>
      <Stack
        sx={{
          position: position ? position : "absolute",
          bottom: position === "relative" ? "" : "10px",
          left: position === "relative" ? "" : "10px",
          zIndex: "999",
          img: {
            objectFit: "contain",
          },
        }}
      >
        <img
          src={"/static/halal.svg"}
          width={width ? width : 20}
          height={width ? width : 20}
          alt={t("Halal")}
        />
      </Stack>
    </PrimaryToolTip>
  );
};
const SpecialCard = (props) => {
  const {
    item,
    quickViewHandleClick,
    addToCart,
    handleBadge,
    isProductExist,
    handleIncrement,
    handleDecrement,
    count,
    handleClick,
    updateLoading,
    setOpenLocationAlert,
    isLoading,
    noRecommended,
    configData,
    onShareClick,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
  } = props;

  const classes = textWithEllipsis();
  const [isHover, setIsHover] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cornerActionsVisible = isHover || isMobile;
  const { ref: textRef, isEllipsed } = useTextEllipsis(item?.name);
  const resolvedModuleType = item?.module_type || item?.module?.module_type;
  const resolvedStock = Number(item?.stock);

  const getModuleWiseItemName = () => {
    if (getCurrentModuleType() === ModuleTypes.FOOD) {
      return (
        <Stack direction="row" alignItems="center" spacing={0.8}>
          {isEllipsed ? (
            <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
              <Typography
                ref={textRef}
                className={classes.singleLineEllipsis}
                fontSize={{ xs: "14px", md: "15px" }}
                fontWeight="500"
                width={0}
                flexGrow={1}
                component="h3"
              >
                {item?.name}
              </Typography>
            </PrimaryToolTip>
          ) : (
            <Typography
              ref={textRef}
              className={classes.singleLineEllipsis}
              fontSize={{ xs: "14px", md: "15px" }}
              fontWeight="500"
              width={0}
              flexGrow={1}
              component="h3"
            >
              {item?.name}
            </Typography>
          )}
          {configData?.configData?.toggle_veg_non_veg ? (
            <FoodVegNonVegFlag veg={item?.veg == 0 ? false : true} />
          ) : null}
        </Stack>
      );
    } else {
      return (
        isEllipsed ? (
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Typography
              ref={textRef}
              className={classes.singleLineEllipsis}
              fontSize={{ xs: "14px", md: "15px" }}
              fontWeight="500"
              component="h3"
            >
              {item?.name}
            </Typography>
          </PrimaryToolTip>
        ) : (
          <Typography
            ref={textRef}
            className={classes.singleLineEllipsis}
            fontSize={{ xs: "14px", md: "15px" }}
            fontWeight="500"
            component="h3"
          >
            {item?.name}
          </Typography>
        )
      );
    }
  };

  return (
    <CustomStackFullWidth
      sx={{
        padding: "12px",
        cursor: "pointer",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.neutral[900], 0.7)
            : theme.palette.background.paper,
        borderRadius: "4px",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        boxShadow: "none",
        // Daraz/AliExpress style: card stays put, only shadow lifts
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0px 6px 20px rgba(0, 0, 0, 0.4)"
              : "0px 6px 20px rgba(0, 0, 0, 0.12)",
          img: {
            transform: "scale(1.03)",
          },
        },
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
    >
      <CustomStackFullWidth
        sx={{
          position: "relative",
          height: { xs: "160px", md: "190px" },
        }}
      >
        {/* Industry standard: only the discount badge sits at the top-left */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {handleBadge()}
        </Box>
        {/* Secondary tags stay out of the way, at the bottom of the image */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: "absolute",
            bottom: 6,
            left: 8,
            zIndex: 5,
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {!noRecommended && (
            <RecommendTag status={item?.recommended} layout="inline" />
          )}
          <OrganicTag status={item?.organic} layout="inline" />
        </Stack>
        <Box
          borderRadius="4px"
          overflow="hidden"
          height="100%"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "10px",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(theme.palette.neutral[800], 0.5)
                : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            img: {
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          }}
        >
          <NextImage
            src={item?.image_full_url}
            height={190}
            alt={item?.name}
            width={230}
            objectFit="contain"
          />
        </Box>
        {item?.halal_tag_status && item?.is_halal ? (
          <FoodHalalHaram width={30} />
        ) : (
          ""
        )}
        {onShareClick && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              left: "auto",
              bottom: "auto",
              zIndex: 7,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductShareAction
              onClick={onShareClick}
              size="32px"
              iconSize="17px"
              sx={{
                borderRadius: "6px",
                border: `1px solid ${alpha(theme.palette.neutral[300], 0.5)}`,
                backgroundColor: alpha(theme.palette.common.white, 0.85),
                backdropFilter: "blur(4px)",
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            left: "auto",
            top: "auto",
            zIndex: 6,
            opacity: cornerActionsVisible ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: cornerActionsVisible ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <QuickView
              cornerLayout
              noQuickview
              quickViewHandleClick={quickViewHandleClick}
              addToWishlistHandler={addToWishlistHandler}
              removeFromWishlistHandler={removeFromWishlistHandler}
              isWishlisted={isWishlisted}
              addToCartHandler={addToCart}
              showAddtocart={!isProductExist}
              isLoading={isLoading}
              setOpenLocationAlert={setOpenLocationAlert}
            />
            {isProductExist && (
              <AddWithIncrementDecrement
                mobileCircularAdd
                mobileOverlayActions
                onHover={isHover}
                addToCartHandler={addToCart}
                isProductExist={isProductExist}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                count={count}
                isLoading={isLoading}
                updateLoading={updateLoading}
              />
            )}
          </Stack>
        </Box>
      </CustomStackFullWidth>
      {/* Daraz-style order: title → price → rating → store name */}
      <CustomStackFullWidth
        mt="10px"
        alignItems="flex-start"
        sx={{ padding: "2px 4px 4px 4px", flexGrow: 1, textAlign: "left" }}
        spacing={0.5}
      >
        <Box sx={{ minHeight: "38px", display: "flex", alignItems: "flex-start", width: "100%" }}>
          {getModuleWiseItemName()}
        </Box>
        <AmountWithDiscountedAmount item={item} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          gap={0.75}
        >
          <CustomRatingBox rating={item?.avg_rating} />
          <Typography
            fontSize="11px"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "60%",
            }}
          >
            {item?.store_name}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

SpecialCard.propTypes = {};

export default SpecialCard;
