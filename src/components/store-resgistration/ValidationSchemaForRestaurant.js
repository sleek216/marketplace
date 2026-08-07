import React from "react";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const IMAGE_SUPPORTED_FORMATS = [
	"image/jpg",
	"image/jpeg",
	"image/gif",
	"image/png",
	"image/webp",
];

const ValidationSchemaForRestaurant = () => {
	const { t } = useTranslation();

	const FILE_SIZE = 5242880;

	return Yup.object({
		restaurant_name: Yup.object().test(
			"required",
			t("Restaurant name required"),
			(value) =>
				value &&
				Object.values(value).some((val) => val && val.trim().length > 0)
		),
		restaurant_address: Yup.mixed()
			.nullable()
			.test(
				"required",
				t("Restaurant address required"),
				(value) =>
					value &&
					Object.values(value).some((val) => val && val.trim().length > 0)
			),
		module_id: Yup.string().required(t("Module is required")),
		f_name: Yup.string().required(t("Name is required")),
		l_name: Yup.string().required(t("Last name required")),
		phone: Yup.string().required(t("Phone number required")),
		min_delivery_time: Yup.string().nullable(),
		max_delivery_time: Yup.string().nullable(),
		delivery_time_type: Yup.string().nullable(),
		lat: Yup.string().required(t("Latitude is required")),
		lng: Yup.string().required(t("Longitude is required")),
		logo: Yup.mixed()
			.required(t("The logo field is required."))
			.test(
				"filePresent",
				t("The logo field is required."),
				(value) => value instanceof File || (value && typeof value.size === "number")
			)
			.test(
				"fileSize",
				t("Image size must be less than 5MB"),
				(value) => !value || (value instanceof File && value.size <= FILE_SIZE)
			)
			.test(
				"fileFormat",
				t("Unsupported Format"),
				(value) =>
					value instanceof File &&
					IMAGE_SUPPORTED_FORMATS.includes(value.type)
			),
		cover_photo: Yup.mixed()
			.required(t("The cover photo field is required."))
			.test(
				"filePresent",
				t("The cover photo field is required."),
				(value) => value instanceof File || (value && typeof value.size === "number")
			)
			.test(
				"fileSize",
				t("Image size must be less than 5MB"),
				(value) => !value || (value instanceof File && value.size <= FILE_SIZE)
			)
			.test(
				"fileFormat",
				t("Unsupported Format"),
				(value) =>
					value instanceof File &&
					IMAGE_SUPPORTED_FORMATS.includes(value.type)
			),
		email: Yup.string()
			.email("Must be a valid email")
			.max(255)
			.required(t("Email is required")),

		password: Yup.string()
			.required("No password provided.")
			.test(
				"password-requirements",
				"Password requirements not met",
				function (value) {
					if (!value) return true; // Handled by required()

					const errors = [];
					if (value.length < 8) {
						errors.push(
							"Password is too short - should be 8 characters minimum."
						);
					}
					if (!/[0-9]/.test(value)) {
						errors.push("one number.");
					}
					if (!/[A-Z]/.test(value)) {
						errors.push("one uppercase letter.");
					}
					if (!/[a-z]/.test(value)) {
						errors.push("one lowercase letter.");
					}
					if (!/[!@#$%^&*(),.?":{}|<>+_=]/.test(value)) {
						errors.push(
							"one special character."
						);
					}

					if (errors.length > 0) {
						return this.createError({ message: errors.join(" ") });
					}
					return true;
				}
			),
		confirm_password: Yup.string()
			.required(t("Confirm Password required"))
			.oneOf([Yup.ref("password"), null], t("Passwords must match")),
		tandc: Yup.boolean().oneOf([true], t("Please accept terms and conditions")),
		// tin: Yup.string()
		// 	.required(t("Taxpayer Identification Number(TIN) is required"))
		// 	.matches(/^[0-9\W]*$/, t("TIN can only contain numbers and symbols"))
		// 	.min(3, t("TIN must be at least 3 characters"))
		// 	.max(20, t("TIN cannot exceed 20 characters")),
		//
		// tin_expire_date: Yup.date()
		// 	.nullable()
		// 	.transform((curr, orig) => (orig === "" ? null : curr))
		// 	.required(t("TIN Expire Date is required"))
		// 	.min(new Date(), t("TIN expire date cannot be in the past")),
		// tin_certificate_image: Yup.mixed()
		// 	.required(t("TIN Certificate Image is required"))
		// 	.test(
		// 		"fileSize",
		// 		t("File too large (max 20MB)"),
		// 		(value) => !value || (value && value.size <= FILE_SIZE)
		// 	)
	});
};

export default ValidationSchemaForRestaurant;
