import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye as Visibility, EyeOff as VisibilityOff } from "lucide-react";
import { InputAdornment, alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { CustomTextFieldContainer } from "styled-components/CustomStyles.style";
import { CustomTextFieldStyle } from "./CustomTextField.style";

const CustomTextFieldWithFormik = (props) => {
	const {
		label,
		type,
		required,
		touched,
		errors,
		value,
		fieldProps,
		multiline,
		onChangeHandler,
		triggerChangeOnType,
		rows,
		disabled,
		readOnly,
		placeholder,
		height,
		startIcon,
		autoFocus,
		onKeyDown,
		onPaste,
		fontSize,
		maxLength,
		backgroundColor,
		labelColor,
		id,
		mt,
		compact,
		/** When true, input text cannot be highlighted (read-only fields that should feel inert). */
		disableTextSelection,
	} = props;
	const theme = useTheme();
	const isControlledOnType = Boolean(triggerChangeOnType);
	const [inputValue, setInputValue] = useState(value ?? "");
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef(null);
	const displayValue = isControlledOnType ? (value ?? "") : inputValue;

	const syncDomValue = useCallback(() => {
		const domValue = inputRef.current?.value ?? "";
		if (!domValue || domValue === (value ?? "")) return;
		if (isControlledOnType) {
			onChangeHandler?.(domValue);
		} else {
			setInputValue(domValue);
			onChangeHandler?.(domValue);
		}
	}, [isControlledOnType, onChangeHandler, value]);

	useEffect(() => {
		if (!isControlledOnType) {
			setInputValue(value ?? "");
		}
	}, [value, isControlledOnType]);

	useEffect(() => {
		const inputElement = inputRef.current;
		if (!inputElement) return;
		const onAnimationStart = (event) => {
			if (event.animationName === "muiAutoFillStart") {
				syncDomValue();
			}
		};
		inputElement.addEventListener("animationstart", onAnimationStart);
		const timers = [50, 200, 500, 1000].map((delay) =>
			setTimeout(syncDomValue, delay)
		);
		return () => {
			inputElement.removeEventListener("animationstart", onAnimationStart);
			timers.forEach(clearTimeout);
		};
	}, [syncDomValue]);

	const onChangeHandlerForField = (e) => {
		if (readOnly) return;
		const nextValue = e.target.value;

		if (isControlledOnType) {
			onChangeHandler?.(nextValue);
		} else {
			setInputValue(nextValue);
		}
	};

	const onBlurHandler = () => {
		onChangeHandler?.(displayValue);
		props?.onBlurCallback?.(displayValue);
	};

	const passwordInputProps = useMemo(
		() => ({
			readOnly: Boolean(readOnly),
			inputProps: { min: 0, id: id, readOnly: Boolean(readOnly) },
			style: {
				height: "45px",
			},
			startAdornment: startIcon,
			endAdornment: (
				<InputAdornment position="end">
					<IconButton
						aria-label="toggle password visibility"
						onClick={() => setShowPassword((prevState) => !prevState)}
					>
						{showPassword ? (
							<Visibility
								sx={{
									color: alpha(theme.palette.neutral[500], 0.4),
								}}
							/>
						) : (
							<VisibilityOff
								sx={{
									color: alpha(theme.palette.neutral[500], 0.4),
								}}
							/>
						)}
					</IconButton>
				</InputAdornment>
			),
		}),
		[readOnly, id, startIcon, showPassword, theme.palette.neutral]
	);

	const textInputProps = useMemo(
		() => ({
			readOnly: Boolean(readOnly),
			startAdornment: startIcon,
			inputProps: {
				min: 0,
				id: id,
				readOnly: Boolean(readOnly),
				...(disableTextSelection
					? {
							style: {
								userSelect: "none",
								WebkitUserSelect: "none",
								MozUserSelect: "none",
							},
						}
					: {}),
			},
			style: {
				height: height || "45px",
			},
			...(disableTextSelection
				? {
						sx: {
							"& .MuiInputBase-input": {
								userSelect: "none",
								WebkitUserSelect: "none",
								MozUserSelect: "none",
								cursor: "default",
							},
						},
					}
				: {}),
		}),
		[readOnly, startIcon, id, disableTextSelection, height]
	);

	const fieldSx = useMemo(
		() => ({
			"& .MuiFormLabel-asterisk": {
				color: "red",
			},
			"& .MuiFormHelperText-root": {
				[theme.breakpoints.down("sm")]: {
					fontSize: "10px",
				},
			},
		}),
		[theme.breakpoints]
	);

	const renderHandler = () => {
		if (type === "password") {
			return (
				<CustomTextFieldContainer noheight={compact}>
					<CustomTextFieldStyle
						{...fieldProps}
						inputRef={inputRef}
						margin={compact ? "dense" : "normal"}
						labelColor={labelColor}
						height={height}
						backgroundColor={backgroundColor}
						disabled={disabled}
						fullWidth
						multiline={multiline}
						rows={rows ? rows : 4}
						label={label}
						name={id || label}
						required={required}
						error={Boolean(touched && errors)}
						helperText={touched && errors}
						value={displayValue}
						placeholder={placeholder ? placeholder : ""}
						onChange={onChangeHandlerForField}
						onBlur={onBlurHandler}
						onKeyDown={onKeyDown}
						onPaste={onPaste}
						type={showPassword ? "text" : type}
						sx={fieldSx}
						InputProps={passwordInputProps}
					/>
				</CustomTextFieldContainer>
			);
		} else {
			return (
				<CustomTextFieldContainer noheight={compact}>
					<CustomTextFieldStyle
						{...fieldProps}
						inputRef={inputRef}
						margin={compact ? "dense" : "normal"}
						id={id}
						labelColor={labelColor}
						backgroundColor={backgroundColor}
						fontSize={fontSize}
						disabled={disabled}
						autoFocus={autoFocus}
						fullWidth
						multiline={multiline}
						rows={rows ? rows : 6}
						label={label}
						placeholder={placeholder ? placeholder : ""}
						name={id || label}
						required={required}
						error={Boolean(touched && errors)}
						helperText={touched && errors}
						value={displayValue}
						onChange={onChangeHandlerForField}
						onBlur={onBlurHandler}
						onKeyDown={onKeyDown}
						onPaste={onPaste}
						type={type}
						height={height}
						InputProps={textInputProps}
						InputLabelProps={{
							shrink: true,
						}}
						sx={fieldSx}
					/>
				</CustomTextFieldContainer>
			);
		}
	};

	return (
		<Box
			sx={{
				width: "100%",
				minHeight: compact ? 0 : "55px",
				mt: mt ?? 0,
			}}
		>
			{renderHandler()}
		</Box>
	);
};

export default CustomTextFieldWithFormik;
