import * as Yup from "yup";

const deliveryManValidationSchema = () => {
  return Yup.object().shape({
    f_name: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name can only contain letters")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't exceed 50 characters"),

    l_name: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't exceed 50 characters"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    phone: Yup.string().required("Phone number is required"),

    password: Yup.string()
      .required("Password is required")
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
            errors.push("one special character.");
          }

          if (errors.length > 0) {
            return this.createError({ message: errors.join(" ") });
          }
          return true;
        }
      ),
    confirm_password: Yup.string()
      .required("Confirm Password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    earning: Yup.number()
      .typeError("Earning must be a number")
      .required("Earning is required"),

    zone_id: Yup.string().required("Zone selection is required"),

    vehicle_id: Yup.string().required("Vehicle selection is required"),

    identity_type: Yup.string()
      .required("Identity type is required")
      .oneOf(["passport", "driving_license", "cnic", "nid"], "Invalid identity type"),

    identity_number: Yup.string()
      .required("Identity number is required")
      .when("identity_type", (identityType, schema) => {
        const selectedType = Array.isArray(identityType) ? identityType[0] : identityType;
        if (selectedType === "passport") {
          return schema.matches(
            /^[A-Za-z0-9]{6,10}$/,
            "Passport format should be AB1234567 (6-10 characters)"
          );
        }
        if (selectedType === "driving_license") {
          return schema.matches(
            /^[A-Za-z]{2}\d{7}$/,
            "Driving license format should be AA-12-12345"
          );
        }
        if (selectedType === "cnic" || selectedType === "nid") {
          return schema.matches(
            /^\d{13}$/,
            "CNIC format should be 13 digits without dashes"
          );
        }
        return schema.matches(
          /^[A-Za-z0-9-]+$/,
          "Invalid identity number format"
        );
      }),
    image: Yup.mixed()
      .required("Profile image is required")
      .test("fileType", "Only images are allowed", (value) =>
        value
          ? ["image/jpeg", "image/png", "image/jpg" ,"image/webp"].includes(value.type)
          : false
      ),
    identity_image: Yup.array()
      .when("identity_type", (identityType, schema) => {
        const selectedType = Array.isArray(identityType) ? identityType[0] : identityType;
        if (selectedType === "passport") {
          return schema
            .min(1, "Passport image is required")
            .max(1, "Only 1 passport image is allowed")
            .required("Passport image is required");
        }
        if (selectedType === "cnic" || selectedType === "nid") {
          return schema
            .min(2, "Both CNIC front and back images are required")
            .max(2, "Only 2 CNIC images are allowed (front and back)")
            .required("Both CNIC images are required");
        }
        if (selectedType === "driving_license") {
          return schema
            .min(2, "Both driving license front and back images are required")
            .max(2, "Only 2 driving license images are allowed (front and back)")
            .required("Both driving license images are required");
        }
        return schema
          .min(1, "Identity image is required")
          .required("Identity image is required");
      })
      .test("fileType", "Only images and PDFs are allowed", (value) => {
        if (!value || value.length === 0) return true;
        return value.every(file => 
          file && ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"].includes(file.type)
        );
      }),

    tandc: Yup.boolean().oneOf([true], "Please accept terms and conditions"),
  });
};

export default deliveryManValidationSchema;
