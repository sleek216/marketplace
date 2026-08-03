import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChatSidebarDesktop } from "./Chat.style";
import ChatContent from "./ChatContent";
import Box from "@mui/material/Box";

import "simplebar-react/dist/simplebar.min.css";

const ChatSideBar = ({
	chatFrom,
	open,
	embedded = false,
	profileEmbed = false,
	isLoading,
	selectedId,
	handleReset,
	handleToggleSidebar,
	channelLoading,
	isFetched,
	channelList,
	handleChannelOnClick,
	searchSubmitHandler,
	setSearchValue,
	searchValue,
	handleSearch,
	userType,
	setUserType,
	setChannelId,
	setIsSidebarOpen,
	configData,
	setResetState,
}) => {
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

	const contentProps = {
		setIsSidebarOpen,
		isFetched,
		handleToggleSidebar,
		channelList,
		handleChannelOnClick,
		setSearchValue,
		searchValue,
		handleSearch,
		isLoading,
		handleReset,
		searchSubmitHandler,
		channelLoading,
		selectedId,
		userType,
		setUserType,
		setChannelId,
		configData,
		setResetState,
		compact: embedded,
		profileEmbed,
	};

	if (embedded) {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100%",
					minHeight: 0,
					bgcolor: "background.paper",
					borderRight: (theme) =>
						`1px solid ${theme.palette.divider}`,
				}}
			>
				<ChatContent {...contentProps} />
			</Box>
		);
	}

	if (mdUp) {
		return (
			<ChatSidebarDesktop
				variant="persistent"
				anchor="left"
				open={Boolean("true")}
				sx={
					profileEmbed
						? {
								width: "300px",
								"& .MuiDrawer-paper": {
									width: "300px",
									borderRight: "1px solid",
									borderColor: "divider",
								},
						  }
						: undefined
				}
			>
				<ChatContent {...contentProps} compact={false} />
			</ChatSidebarDesktop>
		);
	}
	return (
		<>
			{open && (
				<Box
					sx={{
						width: "100%",
						minHeight: profileEmbed ? "100%" : "70vh",
						height: profileEmbed ? "100%" : "auto",
						backgroundColor: "background.default",
					}}
				>
					<ChatContent {...contentProps} compact={false} />
				</Box>
			)}
		</>
	);
};
export default ChatSideBar;
