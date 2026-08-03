import { Rating, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const CustomRatings = ({
	handleChangeRatings,
	ratingValue,
	readOnly,
	fontSize,
	color,
}) => {
	const theme = useTheme();
	const [value, setValue] = useState(0);
	const activeColor = color || theme.palette.primary.main;

	const handleChange = (event, newValue) => {
		if (!readOnly) {
			setValue(newValue);
			handleChangeRatings?.(newValue);
		}
	};
	useEffect(() => {
		setValue(ratingValue);
	}, [ratingValue]);

	return (
		<Stack direction="row" alignItems="center" justifyContent="flex-start">
			<Rating
				precision={0.5}
				readOnly={readOnly}
				value={value}
				onChange={(event, newValue) => handleChange(event, newValue)}
				sx={{
					fontSize: fontSize ? fontSize : "inherit",
					"& .MuiRating-iconFilled": {
						color: activeColor,
					},
					"& .MuiRating-iconHalf": {
						color: activeColor,
					},
					"& .MuiRating-iconEmpty": {
						color: alpha(activeColor, 0.28),
					},
				}}
			/>
		</Stack>
	);
};

CustomRatings.propTypes = {};

export default CustomRatings;
