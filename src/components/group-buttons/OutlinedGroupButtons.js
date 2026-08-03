import React from "react";
import PropTypes from "prop-types";
import { Stack, styled } from "@mui/system";
import { buttonsData } from "../store-details/buttonsData";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CustomCheckbox from "../CustomCheckbox";

export const StyleCheckBox = styled(({ checkedColor, ...other }) => (
  <Checkbox {...other} />
))(({ checkedColor, module, theme }) => ({
  padding: "6px",
  borderRadius: "2px",
  color: alpha(theme.palette.text.secondary, 0.55),
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));
const VegNonVegCheckBox = (props) => {
  const { data, selected, handleSelection, setCheckState, checkState } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const handleChange = (event) => {
    setCheckState({
      ...checkState,
      [event.target.name]: event.target.checked,
    });
  };
  const getModule = () => {
    return JSON.parse(window.localStorage.getItem("module"));
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2} width="100%">
      <FormControlLabel
        control={
          <StyleCheckBox
            module={getModule()?.module_type}
            checked={checkState?.veg}
            onChange={handleChange}
            name="veg"
          />
        }
        label={t("Veg")}
      />
      <FormControlLabel
        control={
          <StyleCheckBox
            module={getModule()?.module_type}
            checked={checkState?.non_veg}
            onChange={handleChange}
            name="non_veg"
          />
        }
        label={t("Non-Veg")}
      />

      {/*{buttonsData?.length > 0 &&*/}
      {/*  buttonsData?.map((item, index) => {*/}
      {/*    return (*/}
      {/*      <CustomCheckbox*/}
      {/*        item={item}*/}
      {/*        key={index}*/}
      {/*        checkHandler={handleSelection}*/}
      {/*      />*/}
      {/*      // <Button*/}
      {/*      //   key={index}*/}
      {/*      //   sx={{*/}
      {/*      //     borderRadius: "2px",*/}
      {/*      //     borderBottom: "3px solid",*/}
      {/*      //     borderBottomColor:*/}
      {/*      //       selected === item?.value*/}
      {/*      //         ? (theme) => theme.palette.primary.main*/}
      {/*      //         : "transparent",*/}
      {/*      //   }}*/}
      {/*      //   onClick={() => handleSelection(item.value)}*/}
      {/*      // >*/}
      {/*      //   <Typography*/}
      {/*      //     variant="h6"*/}
      {/*      //     sx={{*/}
      {/*      //       color:*/}
      {/*      //         selected === item?.value*/}
      {/*      //           ? (theme) => theme.palette.primary.main*/}
      {/*      //           : (theme) => theme.palette.neutral[1000],*/}
      {/*      //     }}*/}
      {/*      //   >*/}
      {/*      //     {t(item?.title)}*/}
      {/*      //   </Typography>*/}
      {/*      // </Button>*/}
      {/*    );*/}
      {/*  })}*/}
    </Stack>
  );
};

VegNonVegCheckBox.propTypes = {};

export default VegNonVegCheckBox;
