import * as v from "valibot"

export const valSignup = v.pipe(v.object({
    country: v.pipe(v.string(), v.uuid("Please select a valid country.")),
    callcode: v.pipe(v.string(), v.regex(/^\+[0-9]{2,4}$/, "+ and 2 - 4 numbers")),
    phone: v.pipe(v.string(), v.regex(/^[0-9]{10}$/, "The phone must contain only 10 numbers.")),
    email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
    terms: v.pipe(v.boolean(), v.literal(true, "You must accept the terms and conditions.")),
    nuip: v.pipe(v.string(), v.regex(/^[0-9]{6,12}$/, "The NUIP must contain only numbers between 6 and 12 digits.")),
    password: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters, letters and numbers, uppercase and lowercase letters and special characters.")),
    repassword: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long, letters and numbers, uppercase and lowercase letters and special characters."))
}), v.forward(
    v.partialCheck(
        [['password'], ['repassword']],
        (input: any) => input.password === input.repassword,
        'The two passwords do not match.'
    ),
    ['repassword']
))

export type Signup = v.InferInput<typeof valSignup>;

