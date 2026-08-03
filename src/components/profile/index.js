import React from "react";
import BasicInformation from "./basic-information";
import { useTranslation } from "react-i18next";
import useCustomerProfileSync from "hooks/useCustomerProfileSync";

const Profile = (props) => {
	const {
		configData,
		setEditProfile,
		editProfile,
		setAddAddress,
		addAddress,
		editAddress,
		addressRefetch,
		setEditAddress,
	} = props;
	const { t } = useTranslation();
	const { data, refetch } = useCustomerProfileSync();
	return (
		<>
			<BasicInformation
				data={data}
				refetch={refetch}
				configData={configData}
				t={t}
				editProfile={editProfile}
				setEditProfile={setEditProfile}
				addAddress={addAddress}
				setAddAddress={setAddAddress}
				editAddress={editAddress}
				addressRefetch={addressRefetch}
				setEditAddress={setEditAddress}
			/>
		</>
	);
};

Profile.propTypes = {};

export default Profile;
