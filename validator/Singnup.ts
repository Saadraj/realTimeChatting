import * as Yup from "yup";

export const signUpValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    password: Yup.string()
        .min(2, "Password must contain at least 8 characters")
        .required("Enter your password required"),
    confirmPassword: Yup.string()
        .required("Confirm your password required")
        .oneOf([Yup.ref("password")], "Password does not match"),
});