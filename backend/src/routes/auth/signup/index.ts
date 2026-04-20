import * as v from "valibot"

export const valSignup = v.pipe(v.object({
    country: v.string("Please select a country"),
    callcode: v.string("Please select a country code"),
    phone: v.pipe(
        v.string("The phone number is required"),
        v.minLength(7, "The phone number must be at least 7 digits"),
        v.maxLength(15, "The phone number must be less than 15 digits"),
        v.regex(/^[0-9]+$/, "Only numbers are allowed")
    ),
    email: v.pipe(
        v.string("The email is required"),
        v.minLength(3, "The email must be at least 3 characters"),
        v.maxLength(254, "The email must not exceed 254 characters"),
        v.email("The email must be a valid email address"),
    ),
    terms: v.boolean("You must accept the terms and conditions"),
    nuip: v.pipe(
        v.string("The NUIP is required"),
        v.minLength(6, "The NUIP must be at least 6 characters"),
        v.maxLength(20, "The NUIP must not exceed 20 characters"),
        v.regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    ),
    password: v.pipe(
        v.string("The password is required"),
        v.minLength(8, "The password must be at least 8 characters"),
        v.maxLength(20, "The password must not exceed 20 characters"),
        v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    ),
    repassword: v.pipe(
        v.string("The password is required"),
        v.minLength(8, "The password must be at least 8 characters"),
        v.maxLength(20, "The password must not exceed 20 characters"),
        v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    )
}),
    (values) => values.password === values.repassword ? null : { repassword: "The passwords do not match" }
)

export type Signup = v.InferInput<typeof valSignup>;

