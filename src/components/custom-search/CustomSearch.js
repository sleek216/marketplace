import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Search,
  StyledInputBase,
  SearchIconWrap,
  SearchActionButton,
} from "./CustomSearch.style";

const CustomSearch = ({
  handleSearchResult,
  label,
  isLoading,
  selectedValue,
  setIsEmpty,
  setSearchValue,
  type2,
  compact = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  let language_direction = undefined;
  if (typeof window !== "undefined") {
    language_direction = localStorage.getItem("direction");
  }

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    } else {
      setValue("");
    }
  }, [selectedValue]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchResult?.(e.target.value);
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value?.trim()) {
      handleSearchResult?.(value.trim());
    }
  };

  const handleReset = () => {
    setValue("");
    handleSearchResult?.("", "true");
    setIsEmpty?.(true);
  };

  const handleChange = (next) => {
    if (next === "") {
      handleSearchResult?.("");
      setIsEmpty?.(true);
    } else {
      setIsEmpty?.(false);
    }
    setValue(next);
    setSearchValue?.(next);
  };

  const iconSize = isSmall ? (compact ? 17 : 18) : compact ? 18 : 20;

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Search
        direction="row"
        alignItems="center"
        type2={type2}
        compact={compact}
      >
        <SearchIconWrap active={focused || Boolean(value)}>
          <SearchIcon sx={{ fontSize: iconSize }} />
        </SearchIconWrap>

        <StyledInputBase
          id="search-input"
          placeholder={t(label)}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          language_direction={language_direction}
          compact={compact}
          inputProps={{ "aria-label": t(label) || "Search" }}
        />

        {isLoading ? (
          <LoadingButton
            loading
            variant="text"
            sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
          />
        ) : value ? (
          <SearchActionButton
            onClick={handleReset}
            aria-label={t("Clear")}
            size="small"
          >
            <CloseIcon sx={{ fontSize: isSmall ? 16 : 18 }} />
          </SearchActionButton>
        ) : null}
      </Search>
    </form>
  );
};

CustomSearch.propTypes = {};

export default CustomSearch;
