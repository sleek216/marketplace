import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import { Button, Tooltip, alpha } from "@mui/material";
import toast from "react-hot-toast";
import { Copy, Check } from "lucide-react";
import { useTheme } from "@emotion/react";

const CustomCopyWithTooltip = (props) => {
  const { t, value, forModal, companyName, referralCode } = props;
  const theme = useTheme();
  const [copy, setCopy] = useState(false);
  const copyReferCode = async (text) => {
    if (typeof window !== undefined) {
      await window.navigator.clipboard.writeText(text);
    }
  };
  const handleCopy = (coupon_code) => {
    navigator.clipboard
      .writeText(coupon_code)
      .then(() => {
        setCopy(true);
        toast(() => (
          <span>
            {t("Code")}
            <b style={{ marginLeft: "4px", marginRight: "4px" }}>
              {referralCode}
            </b>
            {t("has been copied")}
          </span>
        ));
        setTimeout(() => setCopy(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy code:", error);
      });
  };
  return (
    <Tooltip arrow placement="top" title={copy ? t("Copied") : t("Copy")}>
      {forModal ? (
        <Button
          variant="contained"
          onMouseEnter={() => copy && setCopy(false)}
          onClick={() => handleCopy(value)}
        >
          Copy
        </Button>
      ) : (
        <IconButton
          onMouseEnter={() => copy && setCopy(false)}
          onClick={() => handleCopy(value)}
          sx={{ 
            p: { xs: "6px", sm: "8px" }, 
            m: { xs: "0px", sm: "0px" },
            backgroundColor: copy 
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.primary.main, 0.1),
            color: copy 
              ? theme.palette.success.main
              : theme.palette.primary.main,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: copy 
                ? alpha(theme.palette.success.main, 0.15)
                : alpha(theme.palette.primary.main, 0.15),
              transform: "scale(1.05)",
            },
          }}
        >
          {copy ? <Check size={18} /> : <Copy size={18} />}
        </IconButton>
      )}
    </Tooltip>
  );
};

CustomCopyWithTooltip.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

export default CustomCopyWithTooltip;
