/* eslint-disable react-hooks/exhaustive-deps */
import { Info as InfoOutlinedIcon, Coins as PaidIcon, Gift } from "lucide-react";
import {
	Button,
	Grid,
	Popover,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useGetLoyaltyPointTransactionsList from "../../api-manage/hooks/react-query/loyalty-points/useGetLoyaltyPointTransactionList";
import useGetProfile from "../../api-manage/hooks/react-query/profile/useGetProfile";
import { setUser } from "../../redux/slices/profileInfo";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import TransactionHistory from "../transaction-history";
import HowToUse from "../wallet/HowToUse";
import TransactionHistoryMobile from "../wallet/TransactionHistoryMobile";
import WalletBoxComponent from "../wallet/WalletBoxComponent";
import trophy from "./assets/loyaltyimg.png";
import LoyaltyModal from "./loyalty-modal";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

const LoyaltyPoints = (props) => {
	const { configData } = props;
	const [offset, setOffset] = useState(1);
	const [openModal, setOpenModal] = useState(false);
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useDispatch();
	const [openPopover, setOpenPopover] = useState(false);
	const anchorRef = useRef(null);
	const userOnSuccessHandler = (res) => {
		dispatch(setUser(res));
	};
	const { data: userData, refetch: profileRefetch } =
		useGetProfile(userOnSuccessHandler);
	let pageParams = { offset: offset };
	const { data, refetch, isLoading, isFetching } =
		useGetLoyaltyPointTransactionsList(pageParams);
	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		refetch();
	}, [offset]);

	const fetchData = async () => {
		await profileRefetch();
		await refetch();
	};
	const handleConvertCurrency = () => {
		setOpenModal(true);
	};

	const steps = [
		{
			label: "Convert your loyalty point to wallet money.",
		},
		{
			label: "Minimum 200 points required to convert into currency",
		},
	];
	return (
		<CustomStackFullWidth sx={{ minHeight: "60vh" }}>
			<ProfileSectionHeader
				icon={Gift}
				title={t("Loyalty Points")}
				subtitle={t("Track points and convert them to wallet money")}
			/>
			<Box sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 2, md: 2.5 } }}>
				<Grid container spacing={3} alignItems="flex-start">
					<Grid
						item
						xs={12}
						md={4.5}
						sx={{
							borderRight: {
								md: `1px solid ${theme.palette.divider}`,
							},
							pr: { md: 3 },
						}}
					>
						<Stack spacing={2.5}>
							{isSmall && (
								<Stack direction="row" justifyContent="flex-end">
									<InfoOutlinedIcon
										size={18}
										onClick={() => setOpenPopover(true)}
										style={{ cursor: "pointer" }}
									/>
								</Stack>
							)}
							<WalletBoxComponent
								balance={userData?.loyalty_point}
								title={t("Total points")}
								image={trophy}
								handleConvertCurrency={handleConvertCurrency}
								isSmall={isSmall}
							/>
							{!isSmall && <HowToUse steps={steps} />}
							{isSmall && (
								<Stack alignItems="center">
									<Button
										variant="contained"
										startIcon={<PaidIcon size={16} />}
										sx={{
											borderRadius: "2px",
											width: "186px",
											fontSize: "12px",
											textTransform: "none",
											boxShadow: "none",
										}}
										onClick={() => handleConvertCurrency()}
									>
										{t("Convert to Currency")}
									</Button>
								</Stack>
							)}
						</Stack>
					</Grid>

					<Grid item xs={12} md={7.5} sx={{ pl: { md: 1 } }}>
						{isSmall ? (
							<TransactionHistoryMobile
								data={data}
								isLoading={isLoading}
								page="loyalty"
								isFetching={isFetching}
								offset={offset}
								setOffset={setOffset}
							/>
						) : (
							<TransactionHistory
								data={data}
								isLoading={isLoading}
								page="loyalty"
								isFetching={isFetching}
								offset={offset}
								setOffset={setOffset}
							/>
						)}
					</Grid>
				</Grid>
			</Box>

			{openModal && (
				<LoyaltyModal
					configData={configData}
					theme={theme}
					t={t}
					openModal={openModal}
					handleClose={() => setOpenModal(false)}
					loyalitydata={userData?.loyalty_point}
					refetch={refetch}
					profileRefetch={profileRefetch}
				/>
			)}
			<Popover
				disableScrollLock={true}
				anchorEl={anchorRef}
				onClose={() => setOpenPopover(false)}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				keepMounted
				open={openPopover}
				PaperProps={{
					sx: {
						borderRadius: "2px",
						padding: "20px",
					},
				}}
				transitionDuration={2}
			>
				<Stack>
					<HowToUse steps={steps} />
				</Stack>
			</Popover>
		</CustomStackFullWidth>
	);
};

export default LoyaltyPoints;
