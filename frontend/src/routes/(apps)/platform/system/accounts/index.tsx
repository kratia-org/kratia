import { component$, isDev, useResource$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Datatable from "~/components/data/Datatable"
import * as v from "valibot";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { ResponseData, formAction$, setValue, setValues, useForm, valiForm$ } from "@modular-forms/qwik";
import { Input } from "~/components/form/Input";
import { Checkbox } from "~/components/form/Checkbox";
import { api, type UUID, valUUID } from "~/sdk/api";
import FormResponse from "~/components/form/Response";
import { Modal } from "~/components/actions/Modal";


const valAccount = v.object({
    country: v.pipe(v.string(), v.uuid("Please input a valid country.")),
    nuip: v.pipe(v.string(), v.regex(/^[0-9]{6,12}$/, "The NUIP must contain only numbers between 6 and 12 digits.")),
    callcode: v.pipe(v.string(), v.regex(/^\+[0-9]{2,4}$/, "input a + and 2 - 4 numbers")),
    phone: v.pipe(v.string(), v.regex(/^[0-9]{10}$/, "The phone must contain only 10 numbers.")),
    email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
    terms: v.pipe(v.literal(true, "You must accept the terms and conditions.")),
    password: v.pipe(v.string(), v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters, letters and numbers, uppercase and lowercase letters and special characters."))
})

type Account = v.InferInput<typeof valAccount>;

export const usePostRegionsLoader = routeLoader$<Account>(async () => ({
    country: "",
    nuip: "",
    callcode: "",
    phone: "",
    email: "",
    terms: false,
    password: "",
    confirmPassword: "",
}));

export const usePostAccountAction = formAction$<Account>(async (values) => {
    let response: ResponseData = { status: "error", message: "Error al guardar" };
    try {
        const res = await api.post("/platform/system/accounts", values);
        if (res.status === 201) {
            const { status, message, data } = await res.data;
            response = { status: "success", message: message, data: data };
        }
        return response;
    } catch (error) {
        isDev && console.error(error);
        return response;
    }
}, valiForm$(valAccount));

export const useDeleteAccountLoader = routeLoader$<UUID>(async () => ({
    uuid: ""
}));

export const useDeleteAccountAction = formAction$<UUID>(async (values) => {
    let response: ResponseData = { status: "error", message: "Error al eliminar" };
    try {
        const res = await api.delete(`/platform/geography/countries?uuid=${values.uuid}`);
        if (res.status === 200) {
            const { status, message, data } = await res.data;
            response = { status: "success", message: message, data: data };
        }
        return response;
    } catch (error) {
        isDev && console.error(error);
        return response;
    }
}, valiForm$(valUUID));



export default component$(() => {

    const acl = useSignal({
        get: true,
        post: true,
        put: true,
        patch: true,
        delete: true,
        export: true,
        import: true
    })

    const current = useSignal<{
        crud: "create" | "update" | "delete" | "view" | "",
        row: Account | object
    }>({
        crud: "",
        row: {}
    });

    const [regionsForm, { Form: PostForm, Field: PostField }] = useForm<Account>({
        loader: usePostRegionsLoader(),
        action: usePostAccountAction(),
        validate: valiForm$(valAccount)
    });

    const [deleteRegionsForm, { Form: DeleteForm, Field: DeleteField }] = useForm<UUID>({
        loader: useDeleteAccountLoader(),
        action: useDeleteAccountAction(),
        validate: valiForm$(valUUID)
    });

    useVisibleTask$(({ track }) => {
        track(() => regionsForm.response);
        if (regionsForm.response.status === "success") {
            console.log("success");
            window.location.reload();
        }
    });

    useVisibleTask$(({ track }) => {
        track(() => deleteRegionsForm.response);
        if (deleteRegionsForm.response.status === "success") {
            console.log("success");
            window.location.reload();
        }
    });

    useVisibleTask$(({ track }) => {
        track(() => current.value.crud);
        if (current.value.crud === "create") {
            current.value.row = {};
            // limpiar el formulario
            setValue(regionsForm, "country", "");
            setValue(regionsForm, "nuip", "");
            setValue(regionsForm, "callcode", "");
            setValue(regionsForm, "phone", "");
            setValue(regionsForm, "email", "");
            setValue(regionsForm, "terms", false);
            setValue(regionsForm, "password", "");
            setValue(regionsForm, "confirmPassword", "");
        }
        if (current.value.crud === "delete") {
            setValue(deleteRegionsForm, "uuid", current.value.row.uuid as string);
        }
        if (current.value.crud === "update" || current.value.crud === "view") {
            setValue(regionsForm, "country", current.value.row.country as string);
            setValue(regionsForm, "nuip", current.value.row.nuip as string);
            setValue(regionsForm, "callcode", current.value.row.callcode as string);
            setValue(regionsForm, "phone", current.value.row.phone as string);
            setValue(regionsForm, "email", current.value.row.email as string);
            setValue(regionsForm, "terms", current.value.row.terms as boolean);
            setValue(regionsForm, "password", current.value.row.password as string);
            setValue(regionsForm, "confirmPassword", current.value.row.confirmPassword as string);
        }
    });


    const params = useSignal(new URLSearchParams());

    const pagination = useSignal({ total: 0, pages: 0 })

    const accounts = useResource$(async ({ track }) => {
        track(() => params.value);
        const res = await api.get(`/platform/system/accounts?${params.value.toString()}`);
        if (res.status === 200) {
            const { data, ...rest } = await res.data;
            pagination.value = rest;
            return data;
        }
    });

    const open = useSignal(false);


    return (
        <div class="w-full h-full card flex flex-col gap-4">
            <div class="flex-1 overflow-hidden">
                <Datatable params={params} acl={acl} current={current} data={accounts} rows={[
                    { header: "", field: "uuid", type: "text" },
                    { header: "country", field: "country", type: "text" },
                    { header: "photo", field: "profile.photo", type: "text" },
                    { header: "nuip", field: "username", type: "text", filter: true, sort: true },
                    { header: "names    ", field: "person.names", type: "text", filter: true, sort: true },
                    { header: "surnames", field: "person.surnames", type: "text", filter: true, sort: true },
                    { header: "phone", field: "profile.phone", type: "text", filter: true, sort: true },
                    { header: "email", field: "profile.email", type: "text", filter: true, sort: true },
                    { header: "status", field: "status", type: "text", filter: true, sort: true },
                ]} />
            </div>
            <Modal id="modal" title={current.value.crud + " Account"}
                accent={current.value.crud === "create" ? "success" : current.value.crud === "update" ? "warning" : current.value.crud === "delete" ? "error" : "info"}
            >
            </Modal>

        </div>
    )
})