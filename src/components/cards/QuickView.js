import { useTheme } from "@emotion/react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { alpha, IconButton, Stack, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Loading from "../custom-loading/Loading";

const getModuleWiseData = (theme) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return theme.palette.toolTipColor;
    case ModuleTypes.PHARMACY:
      return theme.palette.toolTipColor;
    case ModuleTypes.ECOMMERCE:
      return theme.palette.toolTipColor;
    case ModuleTypes.FOOD:
      return theme.palette.toolTipColor;
  }
};
export const PrimaryToolTip = ({ children, text, placement, arrow }) => {
  return (
    <Tooltip
      title={t(text)}
      arrow
      placement={placement ?? "top"}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: (theme) => getModuleWiseData(theme),
            "& .MuiTooltip-arrow": {
              color: (theme) => getModuleWiseData(theme),
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export const IconButtonStyled = styled(IconButton)(
  ({ theme, color, bgColor, border, width, height, margin }) => ({
    backgroundColor: bgColor || "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(2px)",
    borderRadius: "4px",
    padding: "4px",
    color: color || theme.palette.whiteContainer.main,
    border: border || 0,
    height: height || "36px",
    width: width || "36px",
    marginInlineEnd: margin || "6px",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      border: `0.5px solid ${theme.palette.neutral[100]}`,
    },
  })
);

const getCornerButtonSx = (theme, { circular = false, white = false } = {}) => ({
  width: 32,
  height: 32,
  minWidth: 32,
  padding: 0,
  margin: 0,
  borderRadius: circular ? "50%" : "10px",
  backgroundColor: white
    ? alpha(theme.palette.common.white, 0.82)
    : alpha(theme.palette.neutral[100], 0.78),
  backdropFilter: "blur(6px)",
  border: `1px solid ${alpha(
    white ? theme.palette.neutral[300] : theme.palette.neutral[400],
    white ? 0.5 : 0.35
  )}`,
  color: theme.palette.text.primary,
  boxShadow: `0 2px 8px ${alpha(theme.palette.neutral[900], 0.1)}`,
  "&:hover": {
    backgroundColor: white
      ? alpha(theme.palette.common.white, 0.95)
      : alpha(theme.palette.neutral[100], 0.92),
    color: theme.palette.primary.main,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "17px",
  },
});

const QuickView = ({
  quickViewHandleClick,
  noQuickview,
  noWishlist,
  showAddtocart,
  handleCart,
  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
  addToCartHandler,
  isLoading,
  setOpenLocationAlert,
  onShareClick,
  cornerLayout,
}) => {
  const theme = useTheme();

  let location = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
  }

  const cartAddToCartClick = (e) => {
    if (location) {
      e.stopPropagation();
      addToCartHandler?.(e);
      handleCart?.(e);
    } else {
      e.stopPropagation();
      setOpenLocationAlert(true);
    }
  };

  const Wrapper = cornerLayout ? Stack : CustomStackFullWidth;
  const wrapperProps = cornerLayout
    ? {
        direction: "row",
        alignItems: "center",
        spacing: 0.75,
        onClick: (e) => e.stopPropagation(),
      }
    : {
        direction: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      };

  const renderActionButton = (child, { circular, white, tooltip, onClick }) => {
    if (cornerLayout) {
      const button = (
        <IconButton sx={getCornerButtonSx(theme, { circular, white })} onClick={onClick}>
          {child}
        </IconButton>
      );
      return tooltip ? (
        <PrimaryToolTip text={tooltip} placement="top">
          {button}
        </PrimaryToolTip>
      ) : (
        button
      );
    }

    return child;
  };

  return (
    <Wrapper {...wrapperProps}>
      {!noQuickview &&
        (cornerLayout
          ? renderActionButton(<RemoveRedEyeIcon />, {
              circular: true,
              tooltip: "Quick View",
              onClick: (e) => quickViewHandleClick(e),
            })
          : (
            <PrimaryToolTip text="Quick View">
              <IconButtonStyled onClick={(e) => quickViewHandleClick(e)}>
                <RemoveRedEyeIcon />
              </IconButtonStyled>
            </PrimaryToolTip>
          ))}
      {!noWishlist &&
        (cornerLayout ? (
          renderActionButton(
            isWishlisted ? (
              <FavoriteIcon sx={{ color: "primary.main" }} />
            ) : (
              <FavoriteBorderIcon />
            ),
            {
              tooltip: isWishlisted ? "Remove from wishlist" : "Add to wishlist",
              onClick: (e) =>
                isWishlisted
                  ? removeFromWishlistHandler(e)
                  : addToWishlistHandler(e),
            }
          )
        ) : (
          <>
            {isWishlisted ? (
              <PrimaryToolTip text="Remove from wishlist">
                <IconButtonStyled onClick={(e) => removeFromWishlistHandler(e)}>
                  <FavoriteIcon color={theme.palette.primary.main} />
                </IconButtonStyled>
              </PrimaryToolTip>
            ) : (
              <PrimaryToolTip text="Add to wishlist">
                <IconButtonStyled onClick={(e) => addToWishlistHandler(e)}>
                  <FavoriteBorderIcon />
                </IconButtonStyled>
              </PrimaryToolTip>
            )}
          </>
        ))}
      {onShareClick &&
        (cornerLayout
          ? renderActionButton(<ShareOutlinedIcon />, {
              white: true,
              tooltip: "Share",
              onClick: onShareClick,
            })
          : (
            <PrimaryToolTip text="Share">
              <IconButtonStyled onClick={onShareClick}>
                <ShareOutlinedIcon />
              </IconButtonStyled>
            </PrimaryToolTip>
          ))}
      {showAddtocart &&
        (cornerLayout ? (
          isLoading ? (
            <IconButton sx={getCornerButtonSx(theme, { circular: true })} disabled>
              <Loading color={theme.palette.text.primary} />
            </IconButton>
          ) : (
            renderActionButton(<ShoppingBagIcon />, {
              circular: true,
              tooltip: "Add to cart",
              onClick: cartAddToCartClick,
            })
          )
        ) : (
          <>
            {isLoading ? (
              <IconButtonStyled>
                <Loading color={theme.palette.neutral[100]} />
              </IconButtonStyled>
            ) : (
              <PrimaryToolTip text="Add to cart">
                <IconButtonStyled onClick={(e) => cartAddToCartClick?.(e)}>
                  <ShoppingBagIcon />
                </IconButtonStyled>
              </PrimaryToolTip>
            )}
          </>
        ))}
    </Wrapper>
  );
};

export default QuickView;
