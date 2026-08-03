import { store } from "redux/store";

// export const getAmountWithSign = (amount, needDecimal = true) => {
//   const stores = store?.getState();
//   const { configData } = stores?.configData || {};
//   let newAmount = needDecimal
//     ? ((amount * 100) / 100).toFixed(
//         Number.parseInt(configData?.digit_after_decimal_point)
//       )
//     : (amount * 100) / 100;
//   if (configData?.currency_symbol_direction === "left") {
//     return `${configData?.currency_symbol}${newAmount}`;
//   } else if (configData?.currency_symbol_direction === "right") {
//     return `${newAmount}${configData?.currency_symbol}`;
//   }
//   return amount;
// };

export const getAmountWithSign = (amount, needDecimal = true) => {
  if (amount == null || isNaN(Number(amount))) return "";

  const { configData } = store?.getState()?.configData || {};
  const decimals = configData?.digit_after_decimal_point ?? 2;
  let symbol = (configData?.currency_symbol || "Rs").trim();
  // Ensure trailing dot: Rs.25.00 (not Rs25.00)
  if (symbol && !symbol.endsWith(".")) {
    symbol = `${symbol}.`;
  }

  // Function to format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 100_000) return (num / 1_000).toFixed(1) + "K";
    return needDecimal ? num.toFixed(decimals) : num;
  };

  const formattedAmount = formatLargeNumber(Number(amount));

  // Always prefix: Rs.25.00 (never 25.00Rs)
  return `${symbol}${formattedAmount}`;
};


export const getDiscountedAmount = (
  price,
  discount,
  discountType,
  storeDiscount,
  quantity
) => {
  //product wise discount
  let mainPrice = price;
  let q = quantity ? quantity : 1;
  if (discount > 0) {
    if (discountType === "amount") {
      mainPrice = price - discount * q;
    } else if (discountType === "percent" || discountType === "fixed") {
      mainPrice = price - (discount / 100) * price;
    }
  }
  return mainPrice;
};

/** Discount badge percent for product cards (percent type or derived from prices). */
export const getProductDiscountPercent = (item) => {
  const price = Number(item?.price);
  if (!Number.isFinite(price) || price <= 0) return 0;

  const discounted = getDiscountedAmount(
    item?.price,
    item?.discount,
    item?.discount_type,
    item?.store_discount,
    item?.quantity
  );

  if (discounted === item?.price) return 0;

  if (item?.discount_type === "percent" && Number(item?.discount) > 0) {
    return Math.round(Number(item.discount));
  }

  return Math.round(((price - discounted) / price) * 100);
};

export const getSelectedAddOn = (add_ons) => {
  let add_on = "";
  if (add_ons?.length > 0) {
    add_ons?.map((item, index) => {
      if (item?.isChecked) {
        add_on += `${index !== 0 ? ", " : ""}${item.name}`;
      }
    });
  }
  return add_on;
};

// export const getDiscountAmount = (
//   price,
//   discount,
//   discountType,
//   storeDiscount
// ) => {
//   //product wise discount
//   let mainPrice = price;
//
//   if (Number.parseInt(storeDiscount) === 0) {
//     if (discountType === "amount") {
//       mainPrice = discount;
//     } else if (discountType === "percent") {
//       mainPrice = price * (discount / 100);
//     }
//   } else {
//     if (discountType === "amount" || discountType === "fixed") {
//       mainPrice = storeDiscount;
//     } else if (discountType === "percent") {
//       mainPrice = price * (storeDiscount / 100);
//     }
//   }
//   return mainPrice;
// };
export const getReferDiscount = (
  totalAmountForRefer,
  refDiscount,
  refPercentage
) => {
  if (refPercentage === "percentage") {
    return (refDiscount / 100) * totalAmountForRefer;
  } else {
    return refDiscount;
  }
};
