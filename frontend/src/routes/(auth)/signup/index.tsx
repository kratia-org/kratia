import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { formAction$, useForm, valiForm$, setValue, getValue, type ResponseData } from "@modular-forms/qwik";
import * as v from "valibot";
import { api } from "~/core//api";
import { speak } from "~/core/speak";
import { Input } from "~/components/form/Input";
import { Select } from "~/components/form/Select";
import { Checkbox } from "~/components/form/Checkbox";
import { Wizard } from "~/components/navigation/Wizard";
import { Otp } from "~/components/form/Otp";
import { valSignup, type Signup } from "@kratia/backend/routes/auth/signup"

export const useInitData = routeLoader$<Signup>(() => {
    return {
        country: "",
        callcode: "",
        phone: "",
        email: "",
        terms: false,
        nuip: "",
        password: "",
        repassword: ""
    }
})

export const useSignForm = formAction$<Signup>(async (data) => {
    const response: ResponseData = { status: "error", message: "Don't create account" }
    const { repassword, ...payload } = data
    console.log(payload)
    const query = await api.post("/platform/system/accounts", payload).catch((res) => res.response)
    const result = await query.data
    console.log(result)
    if (query.status !== 200) {
        switch (result.error) {
            case "validation_required":
                response.status = "info";
                response.message = result.message
                break;
            case "already_exists":
                response.status = "error";
                response.message = result.message
                response.data = { redirect: "/signin" };
                break;
            case "item_blocked" || "validation_error":
                response.status = "error";
                response.message = result.message
                response.data = { redirect: "https://kratia.org/support" };
                break;
            default:
                response.status = "error";
                response.message = "Don't create account"
                response.data = { redirect: "https://kratia.org/support" };
                break;

        }
    } else {
        response.status = "success"
        response.message = "Account created successfully, please validate code sent to your phone number"
    }
    return response
}, valiForm$(valSignup))

const valValidate = v.pipe(v.object({
    code: v.pipe(v.array(v.pipe(v.string(), v.regex(/^\d{1}$/, "The code must be exactly 1 digits"))),
        v.minLength(6, "The code must be exactly 6 digits"),
        v.maxLength(6, "The code must be exactly 6 digits")
    ),
})
)

export type Validate = v.InferInput<typeof valValidate>;

export const useInitValidate = routeLoader$<Validate>(() => {
    return {
        code: ["", "", "", "", "", ""]
    }
})

export const useValidateForm = formAction$<Validate>(async (data) => {
    const response: ResponseData = { status: "error", message: "Don't validate account" }
    console.log(data)
    const query = await api.post("/platform/security/validations", data).catch((res) => res.response)
    const result = await query.data
    console.log(result)
    if (query.status !== 200) {
        switch (result.error) {
            case "validation_error":
                response.status = "warning";
                response.message = result.message
                break;
            case "validation_expired":
                response.status = "error";
                response.message = result.message
                response.data = { redirect: "/signup" };
                break;
            case "blocked" || "validation_error":
                response.status = "error";
                response.message = result.message
                response.data = { redirect: "https://kratia.org/support" };
                break;
            default:
                response.status = "error";
                response.message = "Don't validate account"
                response.data = { redirect: "https://kratia.org/support" };
                break;
        }
        console.log(response)
    } else {
        response.status = "success"
        response.message = "Account validated successfully, you can login now"
        response.data = { redirect: "/signin" }
        console.log(response)
    }
    return response
}, valiForm$(valValidate))

export const useCountries = routeLoader$(async ({ error }) => {
    const result = await api.get("/platform/geography/countries").catch((res) => res)
    if (result.status !== 200) throw error(500, "Error al obtener los países")
    const { data: countries } = await result.data
    return countries
})

export default component$(() => {

    const countries = useCountries()

    const [signupForm, { Form, Field }] = useForm<Signup>({
        loader: useInitData(),
        action: useSignForm(),
        validate: valiForm$(valSignup)
    });

    const currentCountry = useSignal<any>({})

    useTask$(({ track }) => {
        track(() => getValue(signupForm, "country"))
        currentCountry.value = countries.value.find((country: any) => country.uuid === getValue(signupForm, "country"))
        if (currentCountry.value) {
            setValue(signupForm, "callcode", currentCountry.value.call_code)
        }
    })

    const [validateForm, { Form: ValidateForm, Field: ValidateField, FieldArray: ValidateFieldArray }] = useForm<Validate>({
        loader: useInitValidate(),
        action: useValidateForm(),
        validate: valiForm$(valValidate),
        fieldArrays: ["code"]
    });

    const stepActive = useSignal(0);

    const steps = useSignal([
        {
            id: "signupForm",
            icon: "person",
            title: "Basic info",
            of: signupForm
        },
        {
            id: "validateForm",
            icon: "security",
            title: "Validate",
            of: validateForm
        }
    ]);

    const { t } = speak();

    return (
        <div class="card w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-h-[90%] flex flex-col p-4 shadow-2xl overflow-y-auto">
            <div class="card-title flex flex-col justify-center items-center p-2">
                <h1 class="text-4xl font-bold text-primary">Sign Up</h1>
                <p class="text-sm font-light">Sign up to get started</p>
            </div>
            <div class="card-body">
                <Wizard steps={steps} stepActive={stepActive} redirect="/signin">
                    <div q:slot="signupForm">
                        <Form id="signupForm">
                            <Field name="country">
                                {(field, props) => (
                                    <Select {...props} name={field.name} value={field.value} error={field.error}
                                        class="input-primary w-[30%]"
                                        label={getValue(signupForm, "country") && Object.keys(currentCountry.value).length > 0 ? `flag-${currentCountry.value.iso_alpha2.toLowerCase()}` : "icon-globe"}
                                        legend="Country"
                                        placeholder="Select a country"
                                        options={countries.value.map((country: any) => ({ value: country.uuid, label: country.name_common }))}
                                    />
                                )}
                            </Field>
                            <Field name="nuip" type="string">
                                {(field, props) => (
                                    <Input {...props} name={field.name} value={field.value} error={field.error}
                                        type="text"
                                        class="input-primary"
                                        label="icon-badge"
                                        legend="NUIP"
                                        placeholder="Personal Identification"
                                    />
                                )}
                            </Field>
                            <div class="flex flex-row gap-2">
                                <Field name="callcode">
                                    {(field, props) => (
                                        <Input {...props} name={field.name} value={field.value} error={field.error}
                                            type="text"
                                            class="input-primary"
                                            label={getValue(signupForm, "country") && Object.keys(currentCountry.value).length > 0 ? `flag-${currentCountry.value.iso_alpha2.toLowerCase()}` : "icon-call_quality"}
                                            legend="Call Code"
                                            placeholder="Code"
                                            width="w-[40%]"
                                            readonly
                                        />
                                    )}
                                </Field>
                                <Field name="phone">
                                    {(field, props) => (
                                        <Input {...props} name={field.name} value={field.value} error={field.error}
                                            type="text"
                                            class="input-primary"
                                            label="icon-phone"
                                            legend="Phone"
                                            placeholder="Phone Number"
                                        />
                                    )}
                                </Field>
                            </div>
                            <Field name="email">
                                {(field, props) => (
                                    <Input {...props} name={field.name} value={field.value} error={field.error}
                                        type="text"
                                        class="input-primary"
                                        label="icon-email"
                                        legend="Email"
                                        placeholder="Email Address"
                                    />
                                )}
                            </Field>
                            <Field name="password">
                                {(field, props) => (
                                    <Input {...props} name={field.name} value={field.value} error={field.error}
                                        type="password"
                                        class="input-primary"
                                        label="icon-lock"
                                        legend="Password"
                                        placeholder="Password"
                                    />
                                )}
                            </Field>
                            <Field name="repassword">
                                {(field, props) => (
                                    <Input {...props} name={field.name} value={field.value} error={field.error}
                                        type="password"
                                        class="input-primary"
                                        label="icon-lock"
                                        legend="Retype password"
                                        placeholder="Retype password"
                                    />
                                )}
                            </Field>
                            <Field name="terms" type="boolean">
                                {(field, props) => (
                                    <Checkbox {...props} name={field.name} checked={field.value} error={field.error}
                                        class="input-primary"
                                        legend="Terms"
                                        label={
                                            <>
                                                I agree to the{' '}
                                                <a href="/terms" target="_blank" rel="noopener noreferrer" class="link link-secondary" > terms and conditions </a>
                                            </>
                                        }
                                    />
                                )}
                            </Field>
                        </Form>
                    </div>

                    <div q:slot="validateForm">
                        <ValidateForm id="validateForm">
                            <ValidateFieldArray name="code">
                                {(fieldArray) =>
                                    <Otp id={"code"} digits={fieldArray.items.length}>
                                        {fieldArray.items.map((item, index) => (
                                            <div key={item}>
                                                <ValidateField name={`code.${index}`} >
                                                    {(field, props) => (
                                                        <Input type="text" {...props} value={field.value} class="input-primary input-lg" pattern="\d*" maxLength={1} justify="center" />
                                                    )}
                                                </ValidateField>
                                            </div>
                                        ))}
                                    </Otp>
                                }
                            </ValidateFieldArray>
                        </ValidateForm>
                    </div>
                </Wizard>
            </div>
            <div class="grid grid-cols-2 gap-2 card-actions px-2 text-sm">
                <div class="flex flex-col items-center justify-center">
                    <p>{t("You already have an account,")}</p>
                    <a class="link link-secondary" href="/signin">{t("Sign In")}</a>
                </div>
                <div class="flex flex-col items-center justify-center">
                    <p>{t("You lost your password?")}</p>
                    <a class="link link-secondary" href="/recovery">{t("Recovery")}</a>
                </div>
            </div>
        </div>
    )
})