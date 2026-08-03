import { styled } from "@mui/material/styles";
import { alpha, Button, Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import { CouponStyle } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import amountDiscount from "./assets/amountDiscount.png";
import freeDelivery from "./assets/freeDelivery.png";
import couponImagePercentage from "./assets/couponPer.png";
import CouponVector from "./CouponVector";
import CouponButtonComponent from "./CouponButtonComponent";
import moment from "moment/moment";
import { resolveImageSrc } from "helper-functions/resolveImageSrc";

export const CouponButtonStyle = styled(Button)(({ theme }) => ({
  width: "111px",
  border: "1px  dotted",
  borderColor: theme.palette.primary.main,
  borderRadius: "2px",
  textAlign: "center",
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  padding: "5px 10px",
  fontSize: "12px",
  [theme.breakpoints.down("md")]: {
    fontSize: "11px",
    padding: "2px 5px",
  },
}));

const Coupon = (props) => {
  const { coupon, setCopy, copy, onSelect, disabled } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const isSelectable = typeof onSelect === "function";

  const couponType = (coupon) => {
    if (coupon?.coupon_type === "store_wise") {
      return (
        <>
          {t("On")} {coupon?.data}
        </>
      );
    }
    if (coupon?.coupon_type === "zone_wise") {
      return (
        <>
          {t("Only for some specific zones")}{" "}
          {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "free_delivery") {
      return (
        <>
          {t("Free delivery")} {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "first_order") {
      return (
        <>
          {t("Only for First Order")}{" "}
          {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "default") {
      return (
        <>
          {coupon?.coupon_type} {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
  };
  const imageHandler = () => {
    if (coupon?.coupon_type === "free_delivery") {
      return (
        <CustomImageContainer
          src={resolveImageSrc(freeDelivery)}
          width="30px"
          height="30px"
        />
      );
    } else {
      if (coupon?.discount_type === "percent") {
        return (
          <CustomImageContainer
            src={resolveImageSrc(couponImagePercentage)}
            width="30px"
            height="30px"
          />
        );
      } else {
        return (
          <CustomImageContainer
            src={resolveImageSrc(amountDiscount)}
            width="30px"
            height="30px"
          />
        );
      }
    }
  };

  const cardBody = (
    <Stack alignItems="center" direction="row">
      <Stack alignItems="center" justifyContent="center" width="220px">
        {imageHandler()}
        <Typography
          fontWeight="bold"
          fontSize={{ xs: "14px", md: "18px" }}
          mt="8px"
        >
          {coupon?.coupon_type === "free_delivery"
            ? t("Free Delivery")
            : coupon?.discount_type === "percent"
            ? `${coupon?.discount} %`
            : getAmountWithSign(coupon?.discount)}
          {coupon?.coupon_type === "free_delivery" ? "" : t("Off")}
        </Typography>
        <Typography fontSize="10px" color={theme.palette.neutral[500]}>
          {couponType(coupon)}
        </Typography>
      </Stack>
      <CouponStyle>
        <CouponVector />
      </CouponStyle>
      <Stack
        spacing={0.5}
        padding="8px"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <CouponButtonComponent
          value={coupon?.code}
          setCopy={isSelectable ? undefined : setCopy}
          copy={copy}
          readOnly={isSelectable}
        />
        <Typography fontSize={{ xs: "10px", md: "12px" }} fontWeight="500">
          {moment(coupon?.start_date)?.format("DD MMM, YYYY")} {t("to")}{" "}
          {moment(coupon?.end_date ?? coupon?.expire_date)?.format(
            "DD MMM, YYYY"
          )}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Card
      elevation={9}
      sx={{
        padding: ".5rem",
        boxShadow: `0px 2px 10px -3px ${(theme) =>
          alpha(theme.palette.primary.main, 0.1)}`,
        backgroundColor: theme.palette.neutral[100],
        backdropFilter: "blur(5px)",
        ...(isSelectable && {
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": disabled
            ? undefined
            : {
                boxShadow: `0px 4px 14px -2px ${alpha(
                  theme.palette.primary.main,
                  0.18
                )}`,
              },
        }),
      }}
    >
      {isSelectable ? (
        <CardActionArea
          disabled={disabled}
          onClick={() => onSelect(coupon)}
          sx={{ borderRadius: "2px" }}
        >
          {cardBody}
        </CardActionArea>
      ) : (
        cardBody
      )}
    </Card>
  );
};

Coupon.propTypes = {};

export default Coupon;
