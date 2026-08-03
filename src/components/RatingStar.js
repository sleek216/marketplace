import React from "react";
import PropTypes from "prop-types";
import { Star as StarRateIcon } from "lucide-react";
const RatingStar = (props) => {
  const { fontSize, color } = props;
  return (
    <>
      <StarRateIcon size={fontSize} color={color} />
    </>
  );
};

RatingStar.propTypes = {};

export default RatingStar;
