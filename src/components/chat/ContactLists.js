import { Box, List, Stack } from "@mui/material";
import React from "react";
import SimpleBar from "simplebar-react";
import {
	CustomListItem,
	CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import InfoCard from "./InfoCard";

import Skeleton from "@mui/material/Skeleton";
import { t } from "i18next";
import "simplebar-react/dist/simplebar.min.css";

import { useSelector } from "react-redux";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getConversationPartnerName } from "utils/chatDisplayName";

const ContactLists = ({
	channelList,
	handleChannelOnClick,
	channelLoading,
	selectedId,
	activeTab,
	setResetState,
	notAdmin,
	compact = false,
	fill = false,
}) => {
	const { configData } = useSelector((state) => state.configData);
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

	if (channelLoading) {
		return (
			<>
				{[...Array(1, 2, 3, 4)].map((_, index) => {
					return (
						<Box padding=".5rem" key={index}>
							<Stack direction="row" spacing={1}>
								<Skeleton
									animation="wave"
									variant="circular"
									width={isMobile ? 56 : 60}
									height={isMobile ? 56 : 50}
								/>
								<Stack direction="column" width="100%" justifyContent="center" spacing={0.8}>
									<Skeleton
										animation="wave"
										height={isMobile ? 14 : 15}
										width="40%"
									/>
									<Skeleton
										animation="wave"
										height={isMobile ? 12 : 15}
										width="65%"
									/>
								</Stack>
							</Stack>
						</Box>
					);
				})}
			</>
		);
	}
	const handleInfoCard = (item) => {
		const partnerName = getConversationPartnerName(item, configData);

		return (
			<InfoCard
				compact={compact}
				name={
					item.sender_type === "customer"
						? item.receiver_type.replaceAll("_", " ")
						: item.sender_type.replaceAll("_", " ")
				}
				messageTime={item.last_message_time}
				last_message={item?.last_message}
				receiver={partnerName}
				unRead={item.unread_message_count}
				userList={item}
				selectedId={selectedId}
				currentId={item.id}
				adminImage={configData?.fav_icon}
			/>
		);
	};

	// On mobile, use a plain scrollable container — no fixed height cap
	const simpleBarStyle = isMobile
		? { width: "100%" }
		: {
				maxHeight: fill
					? "100%"
					: compact
					? selectedId
						? "390px"
						: "240px"
					: selectedId
					? "430px"
					: "270px",
		  };

	return (
		<CustomStackFullWidth sx={fill ? { flex: 1, minHeight: 0 } : {}}>
			{channelList?.length > 0 && (
				<SimpleBar style={simpleBarStyle}>
					<List disablePadding>
						{channelList?.map(
							(item, index) =>
								(item?.receiver_type == activeTab ||
									item?.sender_type == activeTab) && (
									<CustomListItem
										key={index}
										disableGutters
										disablePadding
										cursor="true"
										onClick={() =>
											handleChannelOnClick(item)
										}
									>
										{handleInfoCard(item)}
									</CustomListItem>
								)
						)}
					</List>
				</SimpleBar>
			)}
			{channelList.length === 0 && (
				<Stack width="100%" justifyContent="center" alignItems="center" py={3}>
					<CustomTypography>
						{t("You have no channels.")}
					</CustomTypography>
				</Stack>
			)}
		</CustomStackFullWidth>
	);
};

export default ContactLists;
