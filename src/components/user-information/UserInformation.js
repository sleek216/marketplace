import { Typography, useMediaQuery, useTheme, Box, alpha } from "@mui/material";
import { Stack } from "@mui/system";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "redux/slices/profileInfo";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useCustomerProfileSync from "hooks/useCustomerProfileSync";
import PushNotificationLayout from "../PushNotificationLayout";
import CustomContainer from "../container";
import BodySection from "./BodySection";
import ProfileHero from "./ProfileHero";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";

const UserInformation = ({ page, configData, orderId }) => {
	const theme = useTheme();
	useScrollToTop();
	const [accountDeleteStatus, setAccountDeleteStatus] = useState(true);
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const isMobilePreview = useMediaQuery(theme.breakpoints.down("sm"));
	const isOrdersPage =
		page === "my-orders" || page?.startsWith?.("my-orders");
	const dispatch = useDispatch();
	const router = useRouter();
	const userToken = getToken();
	const { data, isLoading } = useCustomerProfileSync();
	const onSuccessHandlerForUserDelete = (res) => {
		if (res?.errors) {
			setAccountDeleteStatus(false);
		} else {
			localStorage.removeItem("token");
			toast.success(t("Account has been deleted"));
			dispatch(setUser(null));
			router.push("/", undefined, { shallow: true });
		}
	};
	const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
		onSuccessHandlerForUserDelete
	);
	const deleteUserHandler = () => {
		mutate();
	};

	const hideHero =
		Boolean(page && page !== "profile-settings") ||
		(isSmall && page === "inbox") ||
		(isMobilePreview && isOrdersPage);

	return (
		<PushNotificationLayout>
			<CustomStackFullWidth
				sx={
					isSmall && page === "inbox"
						? { padding: 0, margin: 0 }
						: {
								pt: { xs: 2.5, md: 4.5 },
								pb: { xs: 2, md: 3 },
							}
				}
			>
				<CustomContainer
					sx={
						isSmall && page === "inbox"
							? {
									px: 0,
									mx: 0,
									maxWidth: "100% !important",
									width: "100%",
								}
							: isMobilePreview && isOrdersPage
								? {
										px: 0,
										maxWidth: "100% !important",
									}
								: undefined
					}
				>
					{!userToken && (
						<Typography fontSize="16px" textAlign="center" mb={2}>
							{t("Order Details")}
						</Typography>
					)}

					{!hideHero && userToken && isSmall && (
						<Stack mb={2}>
							<ProfileHero
								data={data}
								isLoading={isLoading}
								page={page || "profile-settings"}
							/>
						</Stack>
					)}

					<Box
						sx={{
							bgcolor: (th) =>
								th.palette.mode === "dark"
									? "transparent"
									: alpha(th.palette.neutral[200], 0.35),
							borderRadius: { md: "2px" },
							overflow: "visible",
							width: "100%",
						}}
					>
						<BodySection
							page={page}
							configData={configData}
							orderId={orderId}
							userToken={userToken}
							deleteUserHandler={deleteUserHandler}
							accountDeleteStatus={accountDeleteStatus}
							setAccountDeleteStatus={setAccountDeleteStatus}
							isLoadingDelete={isLoadingDelete}
							profileData={data}
							profileLoading={isLoading}
							hideHero={hideHero}
						/>
					</Box>
				</CustomContainer>
			</CustomStackFullWidth>
		</PushNotificationLayout>
	);
};

export default UserInformation;
