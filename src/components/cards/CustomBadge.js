import React from "react";
import PropTypes from "prop-types";
import { Badge, styled } from "@mui/material";

const px = (v) => (typeof v === "number" ? `${v}px` : v);

const pillShadow = "0 1px 4px rgba(0, 0, 0, 0.18)";

export const CustomBadgeWrapepr = styled(Badge, {
  shouldForwardProp: (prop) =>
    !["bg_color", "top", "left", "border_radius", "fontSize", "layout"].includes(
      prop
    ),
})(({ theme, bg_color, top, left, border_radius, fontSize, layout }) => {
  const isInline = layout === "inline";
  const base = {
    color: theme.palette.whiteContainer.main,
    backgroundColor: bg_color ? bg_color : theme.palette.error.deepLight,
    fontWeight: 600,
    lineHeight: 1.25,
    padding: "4px 10px",
    borderRadius: border_radius ?? "999px",
    boxShadow: pillShadow,
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
      padding: "3px 8px",
    },
  };

  if (isInline) {
    return {
      ...base,
      position: "relative",
      zIndex: 5,
      fontSize: fontSize ? fontSize : "11px",
      display: "inline-block",
    };
  }

  return {
    ...base,
    position: "absolute",
    top: top !== undefined && top !== null ? px(top) : "8px",
    left: left !== undefined && left !== null ? px(left) : "8px",
    zIndex: 5,
    fontSize: fontSize ? fontSize : "11px",
  };
});

const CustomBadge = (props) => {
  const { text, top, left, bg_color, fontSize, border_radius, layout } = props;
  return (
    <CustomBadgeWrapepr
      layout={layout}
      fontSize={fontSize}
      border_radius={border_radius}
      bg_color={bg_color}
      top={top}
      left={left}
    >
      {text}
    </CustomBadgeWrapepr>
  );
};

CustomBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomBadge;
