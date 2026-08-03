import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/** Landing-matched section title — no underline accent */
const H2 = (props) => {
  const { text, textAlign, ...rest } = props;
  const { t } = useTranslation();

  return (
    <Typography
      component="h2"
      textAlign={
        textAlign === "left" || textAlign === "flex-start"
          ? "left"
          : textAlign
            ? textAlign
            : "left"
      }
      textTransform="none"
      sx={{
        fontWeight: 700,
        fontSize: { xs: "16px", md: "18px" },
        lineHeight: 1.2,
        color: "text.primary",
        display: "block",
        pb: 0,
      }}
      {...rest}
    >
      {t(text)}
    </Typography>
  );
};

H2.propTypes = {
  text: PropTypes.string.isRequired,
};

export default H2;
