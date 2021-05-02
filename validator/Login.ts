import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    password: Yup.string()
        .min(2, "Password must contain at least 8 characters")
        .required("Enter your password required"),
});