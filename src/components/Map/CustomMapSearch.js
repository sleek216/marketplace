import React from "react";
import { SearchLocationTextField } from "../landing-page/hero-section/HeroSection.style";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Navigation as GpsFixedIcon, X as CloseIcon } from "lucide-react";
import { t } from "i18next";
import { Search as SearchIcon } from "lucide-react";
import { Stack } from "@mui/system";
import AnimationDots from "../spinner/AnimationDots";
import { Map as MapIcon } from "lucide-react";

const CustomMapSearch = ({
  showCurrentLocation,
  predictions,
  handleChange,
  HandleChangeForSearch,
  handleAgreeLocation,
  currentLocation,
  handleCloseLocation,
  frommap,
  placesIsLoading,
  currentLocationValue,
  /** When set with onInputChange, search text is controlled (e.g. sync from map/geocode) without breaking autocomplete */
  inputValue: controlledInputValue,
  onInputChange: controlledOnInputChange,
  fromparcel,
  isLoading,
  noleftborder,
  testLocation,
  borderRadius,
  toReceiver,
  sender,
  isLanding = false,
  isRefetching,
  searchHeight,
  handleOpen,
  setOpen,
}) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const useSyncedSearchInput =
    typeof controlledOnInputChange === "function" &&
    controlledInputValue !== undefined &&
    controlledInputValue !== null;
  return (
    <>
      {!showCurrentLocation ? (
        <Autocomplete
          fullWidth
          options={predictions || []}
          freeSolo={useSyncedSearchInput}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option?.description || ""
          }
          onChange={(event, value) => handleChange(event, value)}
          value={currentLocationValue ?? null}
          {...(useSyncedSearchInput
            ? {
                inputValue: controlledInputValue ?? "",
                onInputChange: (event, newInputValue, reason) => {
                  controlledOnInputChange(event, newInputValue, reason);
                },
              }
            : {})}
          clearOnBlur={false}
          loading={frommap === "true" ? placesIsLoading : null}
          // open={true}
          loadingText={
            frommap === "true" ? t("Search suggestions are loading...") : ""
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: searchHeight ? '0px' : '9px', // Adjust these values as needed
            },
          }}

          PaperComponent={(props) => (
            <Paper
              sx={{
                borderRadius: "0 0 5px px",

              }}
              {...props}

            >
              {props.children}
              <Box textAlign="center" p={1}>
                <Button
                  variant="text"
                  size="small"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleOpen?.();
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: theme.palette.neutral[300],
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <MapIcon />
                  <Typography variant="body1" onClick={() => setOpen(true)} color={theme.palette.text.main}>{t("Set from map")}</Typography>
                </Button>
              </Box>
            </Paper>
          )}
          renderInput={(params) => (
            <SearchLocationTextField
              toReceiver={toReceiver}
              searchHeight={searchHeight}
              noleftborder={noleftborder}
              frommap={frommap}
              fromparcel={fromparcel}
              id="outlined-basic"
              {...params}
              placeholder={t("Search location here...")}
              isLanding={isLanding}
              isXSmall={isXSmall}
              {...(!useSyncedSearchInput
                ? {
                    onChange: (event) => HandleChangeForSearch?.(event),
                  }
                : {})}
              backgroundColor
              InputProps={{
                ...params.InputProps,
                endAdornment:
                  frommap === "true" ? (
                    <IconButton
                      sx={{
                        mr: 0,
                        borderRadius: borderRadius ? borderRadius : "0px",
                        padding: "6px",
                      }}
                    // onClick={() => handleAgreeLocation()}
                    >
                      <SearchIcon />
                    </IconButton>
                  ) : currentLocationValue?.description ||
                    (useSyncedSearchInput && controlledInputValue) ? (
                    <IconButton
                      sx={{
                        mr: 0,
                        padding: "6px",
                      }}
                    >
                      <CloseIcon
                        style={{
                          cursor: "pointer",
                          height: "20px",
                        }}
                        onClick={() => handleCloseLocation?.()}
                      />
                    </IconButton>
                  ) : (
                    <>
                      {toReceiver === "true" || sender === "true" ? null : (
                        <IconButton
                          sx={{
                            mr: 0,
                            padding: "6px",
                            display: fromparcel !== "true" && "none",
                            marginTop: { xs: "3px", sm: "0px" }
                          }}
                          onClick={() => handleAgreeLocation?.()}
                        >
                          <GpsFixedIcon color="primary" />
                        </IconButton>
                        // )
                        // }
                        // </>
                      )}
                    </>
                  ),
              }}
              required={true}
            />
          )}
        />
      ) : (
        <SearchLocationTextField
          margin_top="true"
          size="small"
          variant="outlined"
          id="outlined-basic"
          placeholder={t("Search location here...")}
          value={testLocation ? testLocation : currentLocation}
          onChange={(event) => HandleChangeForSearch(event)}
          required={true}
          isLanding={isLanding}
          isXSmall={isXSmall}
          frommap={frommap}
          fromparcel={fromparcel}
          showCurrentLocation={showCurrentLocation}
          InputProps={{
            endAdornment: !showCurrentLocation ? (
              <IconButton onClick={() => handleAgreeLocation()}>
                <GpsFixedIcon color="primary" />
              </IconButton>
            ) : (
              <Stack mr={0}>
                {isLoading || isRefetching ? (
                  <IconButton sx={{
                    padding: "6px",

                  }}>
                    <AnimationDots />
                  </IconButton>

                ) : (
                  <IconButton
                    sx={{
                      padding: "6px",

                    }}
                  >
                    <CloseIcon
                      size={isXSmall ? 16 : 20}
                      style={{
                        cursor: "pointer",
                        display: "block",
                      }}
                      onClick={() => handleCloseLocation()}
                    />
                  </IconButton>
                )}
              </Stack>
            ),
          }}
        />
      )}
    </>
  );
};

export default CustomMapSearch;
