import { FormControlLabel, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyleCheckBox } from "./group-buttons/OutlinedGroupButtons";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { t } from "i18next";

const CustomCheckbox = ({ item, checkHandler, isChecked, seats }) => {
  const [checked, setChecked] = useState(false);

  const resolvedChecked =
    typeof isChecked === "function" ? Boolean(isChecked()) : Boolean(isChecked);

  useEffect(() => {
    setChecked(resolvedChecked);
  }, [resolvedChecked]);

  // useEffect(() => {
  //   checkboxRef.current.focus();
  // }, [checked]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    checkHandler?.({
      checked: event.target.checked,
      id: item?.id,
      value: item?.value,
    });
  };

  return (
    <FormControlLabel
      control={
        <StyleCheckBox
          module={getCurrentModuleType()}
          value={item?.value}
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={
        <Typography
          color={checked ? "primary.main" : "text.primary"}
          fontSize="13px"
          fontWeight={checked ? 600 : 500}
          noWrap
          sx={{ lineHeight: 1.3 }}
        >
          {seats ? `${t(item?.name)} ${t("Seats")}` : t(item?.name)}
        </Typography>
      }
      sx={{
        m: 0,
        width: "100%",
        minHeight: 36,
        alignItems: "center",
        columnGap: 0.5,
        "& .MuiFormControlLabel-label": {
          width: "100%",
        },
      }}
    />
  );
};

CustomCheckbox.propTypes = {};

export default CustomCheckbox;
