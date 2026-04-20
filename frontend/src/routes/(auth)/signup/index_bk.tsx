import { component$, isDev, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { formAction$, type FormResponse, type InitialValues, setValue, useForm, valiForm$, getValue, setValues } from "@modular-forms/qwik";
import * as v from "valibot";
import { Checkbox } from "~/components/form/Checkbox";
import { Otp } from "~/components/form/otp";
import { Select } from "~/components/form/select";
import { Wizard } from "~/components/navigation/Wizard";
import { api } from "@kratia/sdk/api";
import { i18n, localeContext } from "~/hooks/useSpeak";
import Input from '~/components/form/input';


export const head: DocumentHead = () => {
  return {
    title: "Kratia ERP",
  }
}


// ✅ Esquema de validación
const valProfile = v.pipe(
  v.object({
    country: v.pipe(v.string(), v.regex(/^[A-Z]{2}$/, "Please select a valid country.")),
    callcode: v.pipe(v.string(), v.regex(/^\+[0-9]{2,4}$/, "el codigo de pais debe contener + y de 2 a 4 numeros")),
    phone: v.pipe(v.string(), v.regex(/^[0-9]{10}$/, "The phone must contain only 10 numbers.")),
    email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
    terms: v.boolean("You must accept the terms and conditions."),
  })
)

const valAccount = v.pipe(v.object({
  ...valProfile.entries,
  ...v.object({
    nuip: v.pipe(v.string(), v.regex(/^[0-9]{6,12}$/, "The NUIP must contain only numbers between 6 and 12 digits.")),
    password: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters, letters and numbers, uppercase and lowercase letters and special characters.")),
    passwordConfirmation: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long, letters and numbers, uppercase and lowercase letters and special characters."))
  }).entries
}), v.forward(
  v.partialCheck(
    [['password'], ['passwordConfirmation']],
    (input) => input.password === input.passwordConfirmation,
    'The two passwords do not match.'
  ),
  ['passwordConfirmation']
))

const valCode = v.pipe(
  v.object({
    digits: v.pipe(
      v.array(
        v.optional(
          v.pipe(
            v.string(),
            v.regex(/^\d{6}$/, "The code must be exactly 6 digits")
          )
        )
      ),
      v.minLength(6, "The code must be exactly 6 digits"),
      v.maxLength(6, "The code must be exactly 6 digits")
    ),
  })
)

type ProfileTypes = v.InferInput<typeof valProfile>;
type AccountTypes = v.InferInput<typeof valAccount>;
type ActivateTypes = v.InferInput<typeof valCode>;

export const useProfileLoader = routeLoader$<InitialValues<ProfileTypes>>(() => ({
  country: "",
  callcode: "",
  phone: "",
  email: "",
  terms: undefined
}));


export const useAccountLoader = routeLoader$<InitialValues<AccountTypes>>(() => ({
  country: "",
  callcode: "",
  phone: "",
  email: "",
  terms: undefined,
  nuip: "",
  password: "",
  passwordConfirmation: ""
}));

export const useValidateLoader = routeLoader$<InitialValues<ActivateTypes>>(() => ({
  digits: ["", "", "", "", "", ""]
}));

export const useProfileAction = formAction$<ProfileTypes>(async (values) => {
  const response: FormResponse<any> = { status: "error", message: "Error validate Id" };
  try {
    response.status = "success"
    response.message = "Perfil creado exitosamente"
    response.data = values
  } catch (error) {
    if (isDev) console.error(error)
  }
  return response;
}, valiForm$(valProfile))




export const useAccountAction = formAction$<AccountTypes>(async (values) => {
  console.log(values)
  const response: FormResponse<any> = { status: "error", message: "Error al registarse" }
  try {
    const signup = await api.post("/auth/signup", values);
    if (signup.status === 200) {
      const { data } = signup.data;
      response.status = "success"
      response.message = "Registro exitoso"
      response.data = data
    }
  } catch (error) {
    if (isDev) console.error(values)
  }
  return response;
}, valiForm$(valAccount))

export const useValidateAction = formAction$<ActivateTypes>(async (values) => {
  const response: FormResponse<any> = { status: "error", message: "Error al activar la cuenta" }
  try {
    const validation = await api.post("/validate", values)
    if (validation.status === 200) {
      const { data } = validation.data
      response.status = "success"
      response.message = "Cuenta activada exitosamente"
      response.data = data
    }
  } catch (error) {
    if (isDev) console.error(error)
  }
  return response
}, valiForm$(valCode))



export const useCountries = routeLoader$(async ({ error }) => {
  try {
    const result = await api.get('/platform/geography/countries');
    if (result.status === 200) {
      const countries = await result.data
      return countries.data.filter((country: any) => country.enabled)
    }
  } catch (err) {
    if (isDev) console.error(err)
    throw error(404, "Error al obtener los paises")
  }
})


export default component$(() => {

  const currentLocale = useContext(localeContext)

  const countries = useCountries().value;

  const currentCountry = useSignal<any>(null);

  const [profileForm, { Form: ProfileForm, Field: ProfileField }] = useForm<ProfileTypes>({
    loader: useProfileLoader(),
    action: useProfileAction(),
    validate: valiForm$(valProfile)
  });


  const [accountForm, { Form: AccountForm, Field: AccountField }] = useForm<AccountTypes>({
    loader: useAccountLoader(),
    action: useAccountAction(),
    validate: valiForm$(valAccount)
  });

  const [validateForm, { Form: ValidateForm, Field: ValidateField, FieldArray: ValidateArray }] = useForm<ActivateTypes>({
    loader: useValidateLoader(),
    action: useValidateAction(),
    validate: valiForm$(valCode),
    fieldArrays: ['digits'],
  });

  useVisibleTask$(async ({ track }) => {
    if (track(() => currentCountry.value)) {
      setValue(profileForm, "callcode", currentCountry.value.callcode.replace(" ", ""));
      setValue(profileForm, "terms", true);
    }
    if (track(() => profileForm.response).status === "success" && profileForm.response?.data) {
      const { country, callcode, phone, email, terms } = profileForm.response.data
      setValue(accountForm, "country", country)
      setValue(accountForm, "callcode", callcode)
      setValue(accountForm, "phone", phone)
      setValue(accountForm, "email", email)
      setValue(accountForm, "terms", terms)
    }
  });

  const stepActive = useSignal(0);

  const steps = useSignal([
    {
      id: "profileForm",
      icon: "info",
      title: "Basic info",
      of: profileForm
    },
    {
      id: "accountForm",
      icon: "badge",
      title: "Identity",
      of: accountForm
    },
    {
      id: "validateForm",
      icon: "security",
      title: "Validate",
      of: validateForm
    },
  ]);

  const t = (t: string) => t;

  return (
    <div class="card w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] bg-base-100 text-base-content flex flex-col p-4">
      <div class="card-header flex flex-col p-4">
        <h1 class="text-center text-4xl">{t("Sign UP")}</h1>
      </div>
      <div class="card-body flex flex-col p-4 pt-0">
        <Wizard steps={steps} stepActive={stepActive}>
          <div q: slot="profileForm">
            <ProfileForm id="profileForm">
              <ProfileField name="country">
                {(field, props) => (
                  <Select {...props} value={field.value} error={field.error} label={currentCountry.value ? "flag-" + currentCountry.value.alpha2.toLowerCase() : "icon-globe"} class="select-primary" legend="Choose your country" placeholder="Select your country"
                    onChange$={(e, el) => {
                      currentCountry.value = countries.find((country: any) => country.alpha2 === el.value);
                    }}
                    options={countries.filter((country: any) => country.enabled).map((country: any) => ({
                      value: country.alpha2,
                      label: country.names.common
                    }))}
                  />
                )}
              </ProfileField>
              <div class="grid grid-cols-4 gap-2">
                <div class="col-span-1">
                  <ProfileField name="callcode">
                    {(field, props) => (
                      <Input type="text" disabled {...props} value={field.value} error={field.error} class="input-primary" legend="Code" label="icon-add_call" />
                    )}
                  </ProfileField>
                </div>
                <div class="col-span-3">
                  <ProfileField name="phone">
                    {(field, props) => (
                      <Input type="text" {...props} value={field.value} error={field.error} class="input-primary" legend="Phone" label="icon-phone" />
                    )}
                  </ProfileField>
                </div>
              </div>
              <ProfileField name="email">
                {(field, props) => (
                  <Input type="text" {...props} value={field.value} error={field.error} class="input-primary" legend="Email" label="icon-email" />
                )}
              </ProfileField>
              <ProfileField name="terms" type='boolean'>
                {(field, props) => (
                  <Checkbox {...props} class="checkbox-primary" checked={field.value} error={field.error} label={
                    <>
                      Acepto los{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" class="link link-secondary" > Términos y condiciones </a>
                    </>
                  } />
                )}
              </ProfileField>
            </ProfileForm>
          </div>
          <div q: slot="accountForm">
            <AccountForm id="accountForm">
              <AccountField name="nuip">
                {(field, props) => <input {...props} hidden type="text" name="nuip" value={field.value} />}
              </AccountField>
              <AccountField name="country">
                {(field, props) => <input {...props} hidden type="text" name="country" value={field.value} />}
              </AccountField>
              <AccountField name="callcode">
                {(field, props) => <input {...props} hidden type="text" name="callcode" value={field.value} />}
              </AccountField>
              <AccountField name="phone">
                {(field, props) => <input {...props} hidden type="text" name="phone" value={field.value} />}
              </AccountField>
              <AccountField name="email">
                {(field, props) => <input {...props} hidden type="text" name="email" value={field.value} />}
              </AccountField>
              <AccountField name="terms" type='boolean'>
                {(field, props) => <input {...props} hidden type="checkbox" name="terms" checked={field.value} />}
              </AccountField>
              <AccountField name="nuip">
                {(field, props) => (
                  <Input {...props} value={field.value} error={field.error} type="text" class="input-primary" legend="Number of identification" label="icon-badge" />
                )}
              </AccountField>
              <AccountField name="password">
                {(field, props) => (
                  <Input {...props} value={field.value} error={field.error} type="password" class="input-primary" legend="Password" label="icon-lock" />
                )}
              </AccountField>
              <AccountField name="passwordConfirmation">
                {(field, props) => (
                  <Input {...props} value={field.value} error={field.error} type="password" class="input-primary" legend="Confirm password" label="icon-lock" />
                )}
              </AccountField>
            </AccountForm>
          </div>
          <div q: slot="validateForm">
            <ValidateForm id="validateForm" class="flex flex-col">
              <ValidateArray name="digits">
                {(fieldArray) => (
                  <Otp id={"signinCode"} digits={fieldArray.items.length}>
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
                        <ValidateField name={`digits.${index}`} >
                          {(field, props) => (
                            <Input type="text" {...props} value={field.value} class="input-primary input-lg" pattern="\d*" maxLength={1} justify="center" />
                          )}
                        </ValidateField>
                      </div>
                    ))}
                  </Otp>
                )}
              </ValidateArray>
            </ValidateForm>
          </div>
        </Wizard>
      </div >
      <div class="grid grid-cols-2 gap-2 card-actions p-4 text-sm">
        <div class="flex flex-col items-center justify-center">
          <p>{t("You already have an account,")}</p>
          <a class="link link-secondary" href="/signin">{t("Sign In")}</a>
        </div>
        <div class="flex flex-col items-center justify-center">
          <p>{t("You lost your password?")}</p>
          <a class="link link-secondary" href="/recovery">{t("Recovery")}</a>
        </div>
      </div>
    </div >
  );
});
