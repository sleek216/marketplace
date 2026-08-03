import React from "react";
import PropTypes from "prop-types";
import { MapPin as PlaceIcon } from "lucide-react";
const PlaceIconComponent = (props) => {
  const { fontSize, color } = props;
  return (
    <div>
      <PlaceIcon size={fontSize} color={color} />
    </div>
  );
};

export default PlaceIconComponent;
