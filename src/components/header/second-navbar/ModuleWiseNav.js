import { alpha, Avatar, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "utils/CustomFunctions";
import useGetModule from "../../../api-manage/hooks/react-query/useGetModule";
import { getLanguage } from "helper-functions/getLanguage";
import { setModules } from "redux/slices/configData";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import AddressReselect from "../top-navbar/address-reselect/AddressReselect";
import DrawerMenu from "../top-navbar/drawer-menu/DrawerMenu";
import CustomLogo from "components/logo/CustomLogo";
import { useRouter } from "next/router";
import { getUserInitials } from "helper-functions/userDisplay";
import { resolveImageSrc } from "helper-functions/resolveImageSrc";
import { safeRouterPush } from "helper-functions/safeRouterPush";

const ModuleWiseNav = (props) => {
	const {

		configData,
		token,
		setToggled,
		location,
		setOpenSignIn,
		setModalFor,
	} = props;
	const router = useRouter()
	const { modules } = useSelector((state) => state.configData);
	const [openDrawer, setOpenDrawer] = useState(false);
	const { data, refetch } = useGetModule();
	const { profileInfo } = useSelector((state) => state.profileInfo);
	const resolvedProfileImage = resolveImageSrc(profileInfo?.image_full_url);
	const hasProfileImage = Boolean(
		resolvedProfileImage || profileInfo?.image
	);
	const profileImageUrl =
		resolvedProfileImage ??
		(profileInfo?.image
			? `${getImageUrl(
					profileInfo?.storage,
					"customer_image_url",
					configData
			  )}/${profileInfo?.image}`
			: undefined);
	const favIcon = configData?.logo_full_url;
	const lanDirection = getLanguage();
	const dispatch = useDispatch();
	useEffect(() => {
		if (modules?.length === 0) {
			refetch();
		}
		// Mount-only — empty module list must not loop refetch.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (data?.length > 0) {
			dispatch(setModules(data));
		}
	}, [data]);
	const handleProfileClick = () => {
		if (token) {
			router.push(
				{ pathname: "/profile", query: { page: "profile-settings" } },
				undefined,
				{ shallow: true }
			);
		} else {
			setModalFor("sign-in");
			setOpenSignIn(true);
		}
	};

	const handleFlexendSide = () => (
		<CustomStackFullWidth
			direction="row"
			justifyContent="flex-end"
			alignItems="center"
		>
			<Avatar
				src={profileImageUrl}
				sx={{
					width: 24,
					height: 24,
					cursor: "pointer",
					fontSize: 11,
					bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
					color: "primary.main",
				}}
				onClick={handleProfileClick}
			>
				{!hasProfileImage && getUserInitials(profileInfo)}
			</Avatar>
			<DrawerMenu
				setToggled={setToggled}
				setOpenDrawer={setOpenDrawer}
				openDrawer={openDrawer}
			/>
		</CustomStackFullWidth>
	);
	const handleIconClick = () => {
		if (location) {
			safeRouterPush(router, "/home");
		} else {
			safeRouterPush(router, "/");
		}
	};
	const getIcon = () => (
		<Box
			onClick={handleIconClick}
			sx={{
				height: "40px",
				position: "relative",
				cursor: "pointer",
				display: "flex",
				justifyContent: "flex-start", // aligns left
				alignItems: "center",
				p: 0, // remove padding
				m: 0, // remove margin
				"& img": {
					maxHeight: "100%",
					display: "block",
				},
			}}
		>
			<CustomLogo
				atlText="logo"
				logoImg={favIcon}
				width="150px"
				height="40px"
				objectFit="contain"
				style={{ marginLeft: 0 }} // force left if needed
			/>
		</Box>
	);
	return (
		<CustomStackFullWidth>
			{!!modules && (
				<Grid container alignItems="center">
					<Grid
						item
						xs={10}
						align={
							lanDirection
								? lanDirection === "ltr"
									? "left"
									: "right"
								: "left"
						}
						container
					>
						<CustomBoxFullWidth>
							<Grid
								container
								justifyContent="flex-start"
								alignItems="center"
								spacing={0.5}
							>
								<Grid
									item
									xs="auto"
									sm="auto"
									align="left"
									justifyItems="flex-start"
								>
									{getIcon()}
								</Grid>
								{location ? (
									<Grid
										item
										align="left"
										sx={{
											flex: 1,
											minWidth: 0,
											pl: { xs: 0.5, sm: 1 },
										}}
									>
										<AddressReselect
											setOpenDrawer={setOpenDrawer}
											location={location}
											openDrawer={openDrawer}
										/>
									</Grid>
								) : (
									<Grid
										item
										sx={{ flex: 1, minWidth: 0 }}
									></Grid>
								)}
							</Grid>
						</CustomBoxFullWidth>
					</Grid>
					<Grid item xs={2} align="right">
						{handleFlexendSide()}
					</Grid>
				</Grid>
			)}
		</CustomStackFullWidth>
	);
};

ModuleWiseNav.propTypes = {};

export default React.memo(ModuleWiseNav);
