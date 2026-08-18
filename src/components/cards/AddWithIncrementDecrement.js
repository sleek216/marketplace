import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { alpha, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import Loading from "../custom-loading/Loading";
import { PrimaryToolTip } from "./QuickView";

const CustomButton = styled(Box)(({ theme, fill }) => ({
  width: "36px",
  height: "36px",
  borderRadius: "4px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    fill === "true"
      ? getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main
      : alpha(
          getCurrentModuleType() === ModuleTypes.FOOD
            ? theme.palette.moduleTheme.food
            : theme.palette.primary.main,
          0.1
        ),
  color:
    fill === "true"
      ? theme.palette.whiteContainer.main
      : getCurrentModuleType() === ModuleTypes.FOOD
      ? theme.palette.moduleTheme.food
      : theme.palette.primary.main,
  "&:hover": {
    filter: "brightness(0.6)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "25px",
    height: "25px",
  },
}));

const AddWithIncrementDecrement = (props) => {
  const {
    onHover,
    handleCardHoverFromCartIconClick,
    verticalCard,
    setIsButtonClicked,
    setShowAddtocart,
    setIsHover,
    addToCartHandler,
    isProductExist,
    handleIncrement,
    handleDecrement,
    count,
    isLoading,
    updateLoading: _updateLoading,
    stacked,
    desktopPillMode,
    mobileCircularAdd,
    mobileOverlayActions,
    compactActions,
  } = props;
  const theme = useTheme();
  const [isAdded, setIsAdded] = useState(false);
  const [showIncDec, setShowIncDec] = useState(false);
  const [expandDesktopAddCta, setExpandDesktopAddCta] = useState(false);

  const handleCart = (e) => {
    e.stopPropagation();
    handleCardHoverFromCartIconClick?.(e);
    addToCartHandler?.(e);
  };

  const incrementHandler = (e) => {
    e.stopPropagation();
    handleIncrement?.();
  };

  const decrementHandler = (e) => {
    e.stopPropagation();
    handleDecrement?.();
    if (count === 1) {
      if (verticalCard) {
        setIsButtonClicked?.(false);
        setShowAddtocart?.(true);
        setIsAdded(false);
      } else {
        setIsAdded(false);
      }
    } else {
    }
  };

  const handleMouseLeave = () => {
    if (verticalCard) {
      setTimeout(() => {
        setShowIncDec(false);
      }, 500);
    }
  };

  const handleMouseEnter = () => {
    if (verticalCard) {
      setIsHover(false);
      setShowIncDec(true);
    }
  };

  const handleBackgroundColor = () => {
    if (verticalCard) {
      return theme.palette.neutral[300];
    } else {
      return alpha(theme.palette.neutral[400], 0.1);
    }
  };

  const mobileOverlaySurface = mobileOverlayActions
    ? {
        border: `1px solid ${alpha(theme.palette.neutral[400], 0.35)}`,
        backgroundColor: alpha(theme.palette.neutral[100], 0.78),
        backdropFilter: "blur(6px)",
        color: theme.palette.text.primary,
        boxShadow: `0 2px 8px ${alpha(theme.palette.neutral[900], 0.1)}`,
      }
    : {
        border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
        boxShadow: `0 2px 6px ${alpha(theme.palette.neutral[900], 0.12)}`,
      };

  const compact = Boolean(compactActions);
  const mobileActionSize = compact ? "26px" : "32px";
  const mobileIncDecMinWidth = compact ? "64px" : "72px";
  const mobileIncDecHeight = compact ? "26px" : "32px";
  const mobileIncDecSide = compact ? "18px" : "22px";
  const mobileIncDecCountWidth = compact ? "20px" : "24px";
  const mobileAddIconSize = compact ? "15px" : "18px";
  const mobileStepIconSize = compact ? "12px" : "14px";
  const mobileCountFontSize = compact ? "11px" : "12px";
  const desktopPillSize = compact ? "24px" : "30px";
  const desktopExpandedMinWidth = compact ? "98px" : "126px";
  const desktopExpandedHeight = compact ? "24px" : "30px";
  const desktopExpandedFontSize = compact ? "8px" : "10px";
  const desktopExpandedIconSize = compact ? "13px" : "16px";
  const desktopExpandedDividerHeight = compact ? "14px" : "18px";
  const desktopExpandedPaddingX = compact ? "6px" : "8px";
  const desktopInCartMinWidth = compact ? "78px" : "94px";
  const desktopInCartSide = compact ? "20px" : "26px";
  const desktopInCartCountWidth = compact ? "32px" : "40px";
  const desktopInCartFontSize = compact ? "11px" : "13px";
  const desktopStepIconSize = compact ? "12px" : "15px";

  const cardWiseManage = () => {
    if (mobileCircularAdd) {
      if (isProductExist) {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              minWidth: mobileIncDecMinWidth,
              height: mobileIncDecHeight,
              borderRadius: "999px",
              overflow: "hidden",
              ...mobileOverlaySurface,
            }}
          >
            <Stack
              onClick={(e) => decrementHandler(e)}
              alignItems="center"
              justifyContent="center"
              sx={{ width: mobileIncDecSide, height: "100%", cursor: "pointer" }}
            >
              <RemoveIcon sx={{ fontSize: mobileStepIconSize }} />
            </Stack>
            <Typography
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: mobileIncDecCountWidth,
                textAlign: "center",
                fontSize: mobileCountFontSize,
                fontWeight: 700,
              }}
            >
              {count}
            </Typography>
            <Stack
              onClick={(e) => incrementHandler(e)}
              alignItems="center"
              justifyContent="center"
              sx={{ width: mobileIncDecSide, height: "100%", cursor: "pointer" }}
            >
              <AddIcon sx={{ fontSize: mobileStepIconSize }} />
            </Stack>
          </Stack>
        );
      }

      if (isLoading) {
        return (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: mobileActionSize,
              height: mobileActionSize,
              borderRadius: "50%",
              overflow: "hidden",
              "& > *": { transform: "scale(0.55)", transformOrigin: "center" },
              ...mobileOverlaySurface,
            }}
          >
            <Loading
              color={
                mobileOverlayActions
                  ? theme.palette.text.primary
                  : theme.palette.primary.main
              }
            />
          </Stack>
        );
      }

      return (
        <Stack
          onClick={(e) => handleCart(e)}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: mobileActionSize,
            height: mobileActionSize,
            borderRadius: "50%",
            cursor: "pointer",
            ...mobileOverlaySurface,
          }}
        >
          <AddIcon sx={{ fontSize: mobileAddIconSize }} />
        </Stack>
      );
    }

    if (desktopPillMode) {
      if (isProductExist) {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              minWidth: desktopInCartMinWidth,
              height: desktopExpandedHeight,
              borderRadius: "999px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.55)}`,
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.common.white, 0.35),
              backdropFilter: "blur(5px)",
              overflow: "hidden",
            }}
          >
            <Stack
              onClick={(e) => decrementHandler(e)}
              alignItems="center"
              justifyContent="center"
              sx={{
                width: desktopInCartSide,
                height: "100%",
                cursor: "pointer",
              }}
            >
              <RemoveIcon sx={{ fontSize: desktopStepIconSize }} />
            </Stack>
            <Box
              sx={{
                width: "1px",
                height: "60%",
                borderLeft: `1px dashed ${alpha(theme.palette.primary.main, 0.45)}`,
              }}
            />
            <Typography
              onClick={(e) => e.stopPropagation()}
              textAlign="center"
              sx={{
                width: desktopInCartCountWidth,
                fontSize: desktopInCartFontSize,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {count}
            </Typography>
            <Box
              sx={{
                width: "1px",
                height: "60%",
                borderLeft: `1px dashed ${alpha(theme.palette.primary.main, 0.45)}`,
              }}
            />
            <Stack
              onClick={(e) => incrementHandler(e)}
              alignItems="center"
              justifyContent="center"
              sx={{
                width: desktopInCartSide,
                height: "100%",
                cursor: "pointer",
              }}
            >
              <AddIcon sx={{ fontSize: desktopStepIconSize }} />
            </Stack>
          </Stack>
        );
      }

      if (isLoading) {
        return (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: desktopPillSize,
              height: desktopPillSize,
              borderRadius: "999px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              backgroundColor: alpha(theme.palette.common.white, 0.35),
              backdropFilter: "blur(6px)",
              overflow: "hidden",
              "& > *": {
                transform: "scale(0.55)",
                transformOrigin: "center",
              },
            }}
          >
            <Loading color={theme.palette.primary.main} />
          </Stack>
        );
      }

      if (expandDesktopAddCta) {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onMouseLeave={() => setExpandDesktopAddCta(false)}
            onClick={(e) => handleCart(e)}
            sx={{
              minWidth: desktopExpandedMinWidth,
              height: desktopExpandedHeight,
              borderRadius: "999px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.65)}`,
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.common.white, 0.35),
              backdropFilter: "blur(6px)",
              overflow: "hidden",
              cursor: "pointer",
              px: desktopExpandedPaddingX,
            }}
          >
            <Typography sx={{ fontSize: desktopExpandedFontSize, fontWeight: 700, letterSpacing: 0.1 }}>
              ADD TO CART
            </Typography>
            <Stack direction="row" alignItems="center" spacing={compact ? 0.5 : 1}>
              <Box
                sx={{
                  width: "1px",
                  height: desktopExpandedDividerHeight,
                  borderLeft: `1px dashed ${alpha(theme.palette.primary.main, 0.55)}`,
                }}
              />
              <AddIcon sx={{ fontSize: desktopExpandedIconSize }} />
            </Stack>
          </Stack>
        );
      }

      return (
        <Stack
          onMouseEnter={() => setExpandDesktopAddCta(true)}
          onClick={(e) => handleCart(e)}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: desktopPillSize,
            height: desktopPillSize,
            borderRadius: "999px",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.65)}`,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.common.white, 0.35),
            backdropFilter: "blur(6px)",
            cursor: "pointer",
          }}
        >
          <AddIcon sx={{ fontSize: desktopExpandedIconSize }} />
        </Stack>
      );
    }

    if (verticalCard) {
      if (isProductExist) {
        if (showIncDec) {
          return (
            <Stack
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{
                backgroundColor: handleBackgroundColor(),
                borderRadius: "4px",
                transition: "all ease 0.5s",
              }}
            >
              <CustomButton
                onClick={(e) => decrementHandler(e)}
                sx={{
                  transition: "all ease 0.5s",
                }}
              >
                <RemoveIcon sx={{ fontSize: { xs: "15px", md: "20px" } }} />
              </CustomButton>

              <Typography
                onClick={(e) => e.stopPropagation()}
                textAlign="center"
                sx={{
                  width: { xs: "30px", md: "50px" },
                  transition: "all ease 0.5s",
                }}
              >
                {count}
              </Typography>

              <CustomButton fill="true" onClick={(e) => incrementHandler(e)}>
                <AddIcon
                  sx={{
                    fontSize: { xs: "15px", md: "20px" },
                    transition: "all ease 0.5s",
                  }}
                />
              </CustomButton>
            </Stack>
          );
        } else {
          return (
            <Stack
              onMouseEnter={handleMouseEnter}
              onClick={(e) => handleCart(e)}
              alignItems="center"
              justifyContent="center"
              sx={{
                backgroundColor: (theme) =>
                  onHover ? "primary.main" : theme.palette.neutral[100],
                color: (theme) =>
                  onHover ? "whiteContainer.main" : "primary.main",
                height: { xs: "25px", md: "35px" },
                width: { xs: "25px", md: "35px" },
                transition: "all ease 0.5s",
                borderRadius: "5px",
                border: (theme) =>
                  onHover
                    ? "none"
                    : `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                "&:hover": {
                  backgroundColor: verticalCard && "primary.main",
                  color: verticalCard && "whiteContainer.main",
                },
              }}
            >
              <PrimaryToolTip text="Add to cart">
                {}
                <ShoppingBagIcon fontSize="small" />
              </PrimaryToolTip>
            </Stack>
          );
        }
      }
    } else {
      if (isProductExist) {
        return (
          <Stack
            onMouseLeave={handleMouseLeave}
            direction={stacked ? "column" : "row"}
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: handleBackgroundColor(),
              borderRadius: stacked ? "8px" : "10px",
              gap: stacked ? 0.2 : 0,
              py: stacked ? 0.2 : 0,
            }}
          >
            <CustomButton onClick={(e) => decrementHandler(e)}>
              <RemoveIcon
                sx={{
                  fontSize: { xs: "15px", md: "20px" },
                  transition: "all ease 0.5s",
                }}
              />
            </CustomButton>

            <Typography
              onClick={(e) => e.stopPropagation()}
              textAlign="center"
              sx={{
                width: stacked ? "24px" : { xs: "30px", md: "50px" },
                fontSize: stacked ? { xs: "12px", md: "13px" } : undefined,
                lineHeight: stacked ? 1 : undefined,
                transition: "all ease 0.5s",
              }}
            >
              {count}
            </Typography>

            <CustomButton fill="true" onClick={(e) => incrementHandler(e)}>
              <AddIcon
                sx={{
                  fontSize: { xs: "15px", md: "20px" },
                  transition: "all ease 0.5s",
                }}
              />
            </CustomButton>
          </Stack>
        );
      } else {
        return (
          <>
            {isLoading ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  backgroundColor: (theme) => theme.palette.neutral[100],
                  color: (theme) => theme.palette.primary.main,
                  height: stacked ? "25px" : { xs: "25px", md: "35px" },
                  width: stacked ? "25px" : { xs: "25px", md: "35px" },
                  borderRadius: "5px",
                  transition: "all ease 0.5s",
                  overflow: "hidden",
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                  "& > *": {
                    transform: stacked ? "scale(0.5)" : "scale(0.7)",
                    transformOrigin: "center",
                  },
                }}
              >
                <Loading color={theme.palette.primary.main} />
              </Stack>
            ) : (
              <PrimaryToolTip text="Add to cart">
                <Stack
                  onMouseEnter={handleMouseEnter}
                  onClick={(e) => handleCart(e)}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    backgroundColor: (theme) =>
                      onHover
                        ? getCurrentModuleType() === ModuleTypes.FOOD
                          ? theme.palette.moduleTheme.food
                          : "primary.main"
                        : theme.palette.neutral[100],
                    color: (theme) =>
                      onHover
                        ? "whiteContainer.main"
                        : getCurrentModuleType() === ModuleTypes.FOOD
                        ? theme.palette.moduleTheme.food
                        : "primary.main",
                    height: { xs: "25px", md: "35px" },
                    width: { xs: "25px", md: "35px" },
                    borderRadius: "5px",
                    transition: "all ease 0.5s",
                    border: (theme) =>
                      getCurrentModuleType() === ModuleTypes.FOOD
                        ? "none"
                        : onHover
                        ? "none"
                        : `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
                  }}
                >
                  <ShoppingBagIcon fontSize="small" />
                </Stack>
              </PrimaryToolTip>
            )}
          </>
        );
      }
    }
  };

  return <>{cardWiseManage()}</>;
};

AddWithIncrementDecrement.propTypes = {};

export default AddWithIncrementDecrement;
