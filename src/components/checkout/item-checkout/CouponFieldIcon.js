import React from "react";
import { Box } from "@mui/material";

/** Muted ticket + % mark for coupon field (decorative). */
const CouponFieldIcon = ({ sx }) => (
	<Box
		component="span"
		aria-hidden
		sx={{
			display: "inline-flex",
			flexShrink: 0,
			color: "text.secondary",
			opacity: 0.72,
			"& svg": { display: "block" },
			...sx,
		}}
	>
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="M5.5 7.5h13c.83 0 1.5.67 1.5 1.5v1.15a1.05 1.05 0 01-.52.91 1.05 1.05 0 010 1.88c.32.18.52.51.52.91v1.15c0 .83-.67 1.5-1.5 1.5h-13A1.5 1.5 0 014 15V13.85c0-.4.2-.73.52-.91a1.05 1.05 0 010-1.88A1.05 1.05 0 014 10.15V9a1.5 1.5 0 011.5-1.5z"
				stroke="currentColor"
				strokeWidth="1.25"
				fill="none"
				strokeLinejoin="round"
			/>
			<text
				x="12"
				y="15"
				textAnchor="middle"
				fontSize="7.5"
				fontWeight="700"
				fill="currentColor"
			>
				%
			</text>
		</svg>
	</Box>
);

export default CouponFieldIcon;
