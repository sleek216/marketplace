import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allData: {},
  activeStep: 0,
  inZone: null,
  /** Inline Formik errors to apply when returning to step 0 from a later step. */
  fieldErrors: null,
};

// Action creators are generated for each case reducer function
export const storedResDataSlice = createSlice({
  name: "mple",
  initialState,
  reducers: {
    setAllData: (state, action) => {
      state.allData = action.payload;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setInZone: (state, action) => {
      state.inZone = action.payload;
    },
    setFieldErrors: (state, action) => {
      state.fieldErrors = action.payload;
    },
  },
});

export const { setAllData, setActiveStep, setInZone, setFieldErrors } =
  storedResDataSlice.actions;

export default storedResDataSlice.reducer;
