import React from "react";
import { alpha, Avatar, Badge, Stack, styled, Typography } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { CustomTypographyEllipsis } from "styled-components/CustomTypographies.style";
import moment from "moment";
import { getAdminAvatarUrl } from "utils/chatAvatar";
import {
  getEffectiveUnreadCount,
  getProfileUserId,
  isLastMessageFromCurrentUser,
} from "utils/chatUnread";

export const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}));

/** Format message time like the design: "Now", "8:05 PM", "1 hour ago", "Yesterday" */
const formatMessageTime = (time) => {
	if (!time) return "";
	const msg = moment(time);
	const now = moment();
	const diffMins = now.diff(msg, "minutes");
	const diffHours = now.diff(msg, "hours");
	const diffDays = now.diff(msg, "days");
	if (diffMins < 2) return "Now";
	if (diffHours < 1) return `${diffMins}m ago`;
	if (diffHours < 24 && msg.isSame(now, "day")) return msg.format("h:mm A");
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return msg.format("ddd");
	return msg.format("MMM D");
};

const InfoCard = ({
	name,
	messageTime,
	receiver,
	userList,
	unRead,
	currentId,
	selectedId,
	last_message,
	adminImage,
	compact = false,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { configData } = useSelector((state) => state.configData);
	const { profileInfo } = useSelector((state) => state.profileInfo);
	const ChatImageUrl = () => {
		if (userList.receiver_type === "vendor") {
			return userList?.receiver?.image_full_url;
		}
		if (userList.receiver_type === "delivery_man") {
			return userList?.receiver?.image_full_url;
		}
		if (userList?.receiver_type === "admin") {
			return getAdminAvatarUrl(configData) || adminImage;
		}
	};

	const currentUserId = getProfileUserId(profileInfo);
	const isSender = isLastMessageFromCurrentUser(userList, currentUserId);
	const effectiveUnread = getEffectiveUnreadCount(userList, currentUserId, {
		selectedId,
		currentId,
	});
	const isRead = !isSender && effectiveUnread > 0;
	const language_direction = localStorage.getItem("direction");

	// Mobile-specific sizes
	const avatarSize = isMobile ? "56px" : compact ? "40px" : "48px";
	const badgeSize = isMobile ? 22 : 16;
	const badgeFontSize = isMobile ? "11px" : "12px";

	return (
		<CustomStackFullWidth
			direction="row"
			spacing={compact ? 1.1 : isMobile ? 1.5 : 2}
			alignItems="center"
			padding={
				isMobile
					? "12px 8px"
					: compact
					? "8px 10px 8px 8px"
					: "10px 15px 10px 10px"
			}
			sx={{
				background:
					selectedId === currentId &&
					alpha(theme.palette.primary.main, 0.2),
				borderRadius: isMobile ? "0px" : "2px",
				...(isMobile && {
					borderBottom: `1px solid ${alpha(theme.palette.neutral[400], 0.15)}`,
				}),
				...(compact &&
					!isMobile && {
						border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
						mb: 0.5,
						"&:hover": {
							backgroundColor: alpha(theme.palette.primary.main, 0.06),
						},
					}),
			}}
		>
			<StyledBadge
				overlap="circular"
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Avatar
					src={ChatImageUrl()}
					sx={{
						width: avatarSize,
						height: avatarSize,
						bgcolor: theme.palette.neutral[200],
						"& .MuiAvatar-img": {
							objectFit: "contain",
							objectPosition: "center",
						},
					}}
				/>
			</StyledBadge>
			<CustomStackFullWidth sx={{ minWidth: 0 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					marginRight={language_direction === "rtl" ? "1rem" : "0rem"}
				>
					<Typography
						fontSize={isMobile ? "15px" : "14px"}
						fontWeight={isMobile ? 700 : 500}
						noWrap
						sx={{ flex: 1, minWidth: 0, pr: 1 }}
					>
						{receiver}
					</Typography>
					<Typography
						fontSize={isMobile ? "12px" : compact ? "11px" : "12px"}
						color={theme.palette.neutral[500]}
						sx={{ flexShrink: 0, lineHeight: 1.6 }}
					>
						{formatMessageTime(messageTime)}
					</Typography>
				</Stack>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					mt={isMobile ? 0.25 : 0}
					color={
						selectedId === currentId
							? theme.palette.neutral[100]
							: theme.palette.neutral[1000]
					}
				>
					<CustomTypographyEllipsis
						sx={{
							flex: 1,
							minWidth: 0,
							pr: 1,
							color:
								isRead
									? theme.palette.neutral[700]
									: theme.palette.neutral[400],
							textTransform: "capitalize",
						}}
						fontSize={
							isMobile
								? "13px"
								: compact
								? isRead > 0
									? "13px"
									: "11px"
								: isRead > 0
								? "15px"
								: "12px"
						}
						fontWeight={isRead ? (isMobile ? 500 : 700) : 400}
					>
						{last_message?.message && last_message?.message}{" "}
					</CustomTypographyEllipsis>
					{effectiveUnread > 0 && (
						<Stack
							sx={{ flexShrink: 0 }}
							width={`${badgeSize}px`}
							height={`${badgeSize}px`}
							minWidth={`${badgeSize}px`}
							backgroundColor={theme.palette.primary.main}
							justifyContent="center"
							alignItems="center"
							borderRadius="50%"
							color={theme.palette.neutral[100]}
						>
							<Typography fontSize={badgeFontSize} lineHeight={1}>
								{effectiveUnread}
							</Typography>
						</Stack>
					)}
				</Stack>
			</CustomStackFullWidth>
		</CustomStackFullWidth>
	);
};
export default InfoCard;
