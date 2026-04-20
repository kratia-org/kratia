import { $, component$, type Signal, useSignal, useVisibleTask$, Resource, ResourceFn } from "@builder.io/qwik";
import AirDatepicker from "air-datepicker";
import localeEn from 'air-datepicker/locale/en';
import { useSpeak } from "~/hooks/useSpeak";

export type Query = {
    page: number;
    filter: Record<string, string>[];
    order: Record<string, string>[];
    limit: number;
};

export type Row = {
    header: string;
    field: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date';
    filter?: boolean;
    order?: boolean;
};

export type ACL = {
    get: boolean;
    post: boolean;
    put: boolean;
    patch: boolean;
    delete: boolean;
    export: boolean;
    import: boolean;
};

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;

export type Pagination = {
    total: number;
    pages: number;
};

interface Datatable {
    data?: Signal<any>;
    limits?: number[];
    pagination?: Signal<Pagination>;
    rows?: Row[];
    acl?: Signal<ACL>;
    current?: Signal<any>;
    open?: Signal<{
        get: "modal" | "page";
        post: "modal" | "page";
        put: "modal" | "page";
        patch: "modal" | "page";
        delete: "modal" | "page";
    }>;
    query?: Signal<Query>;
    params?: Signal<URLSearchParams>;
}

export default component$<Datatable>(({
    data = useSignal([]),
    params = useSignal(new URLSearchParams()),
    current = useSignal({}),
    open = useSignal({}),
    limits = [25, 50, 100, 200],
    pagination = useSignal({ total: 0, pages: 0 }),
    rows = [],
    acl = useSignal({ get: false, post: false, put: false, patch: false, delete: false, export: false, import: false }),
    query = useSignal({ page: 1, filter: [], order: [], limit: 25 }) }) => {



    params.value.append("page", "1");
    params.value.append("limit", "25");

    // Añadir columnas
    if (!rows.find(row => row.field === "uuid")) {
        rows.unshift({ header: "Select", field: "uuid", type: "text" });
    }

    if (!rows.find(row => row.field === "actions")) {
        rows.push({ header: "Actions", field: "actions", type: "text" });
    }

    // Selected
    const selected = useSignal<string[]>([]);

    // Ordenar
    const order = $((field: string, direction: "asc" | "desc") => {
        const exists = query.value.order.find(s => s[field]);
        // Si ya existe el campo en el array de sorts
        if (exists) {
            const current = exists[field];
            // Si clic en misma dirección ⇒ quitarla
            if (current === direction) {
                query.value.order = query.value.order.filter(s => !s[field]);
                return;
            }
            // Si clic en la otra dirección ⇒ cambiarla
            query.value.order = query.value.order.map(s =>
                s[field] ? { [field]: direction } : s
            );
            return;
        }
        // Si no existe ⇒ agregarlo sin eliminar los anteriores
        query.value.order = [...query.value.order, { [field]: direction }];
    });

    const debounceTimer = useSignal<NodeJS.Timeout | undefined>(undefined);

    // En lugar de: params.filters = { ... }
    // Asegúrate de que esta función use el nuevo 'debounceTimer'
    const setInput = $((field: string, value: string) => {
        const trimmedValue = value.trim();
        // 1. Limpiar el temporizador anterior
        if (debounceTimer.value) {
            clearTimeout(debounceTimer.value);
        }
        // 2. Establecer un nuevo temporizador
        // Usamos el 'useSignal' de Qwik para guardar el ID del timer
        debounceTimer.value = setTimeout(() => {
            // --- Lógica de Actualización del Filtro (Solo se ejecuta después de 300ms) ---
            let newFilters = query.value.filter.filter(f => !f[field]);
            if (trimmedValue) {
                newFilters = [...newFilters, { [field]: trimmedValue }];
            }
            query.value.filter = newFilters;
            query.value.page = 1;
            // -----------------------------------------------------------------------------
            // Opcional: limpiar el timer una vez ejecutado
            debounceTimer.value = undefined;
        }, 300); // Retraso de 300 milisegundos
    });

    // Toggle selection
    const toggleSelection = $((uuid: string) => {
        const indexSelected = selected.value.indexOf(uuid);
        if (indexSelected > -1) {
            // Si ya está seleccionado -> quitarlo
            selected.value = selected.value.filter(id => id !== uuid);
        } else {
            // Si no está -> agregarlo
            selected.value = [...selected.value, uuid];
        }
    });

    // Toggle select all
    const toggleSelectAll = $(() => {
        // Asegúrate de usar el nombre correcto de la señal que contiene las filas visibles
        // En tu código original la señal se llama `data`:
        const visibleIds = data.value.map((item: any) => item.uuid);
        // Si ya están todos seleccionados -> deseleccionar todos
        const allSelected = visibleIds.length > 0 && visibleIds.every((id: string) => selected.value.includes(id));
        if (allSelected) {
            selected.value = [];
            return;
        }
        // Sino -> seleccionar todos los visibles (sin duplicados)
        selected.value = Array.from(new Set([...selected.value, ...visibleIds]));
    });

    // Open modal
    const handleAction = $<(method: string, row: any) => void>((method, row) => {
        if (open.value.method && open.value.on === "modal") {
            const modal = document.getElementById("modal") as HTMLDialogElement;
            if (modal) {
                modal.showModal()
            }
        }
    })

    const { t, tdt } = useSpeak();


    useVisibleTask$(() => {
        for (const row of rows) {
            if (row.type === "date") {
                const picker = document.getElementById(row.field) as HTMLInputElement;
                new AirDatepicker(picker, {
                    locale: localeEn,
                    dateFormat: 'yyyy-MM-dd',
                    onSelect: ({ formattedDate }) => {
                        console.log(formattedDate)
                        picker.value = formattedDate.toString()
                        setInput(row.field, picker.value)
                    },

                })
            }
        }
    });


    useVisibleTask$(({ track }) => {
        track(() => query.value.filter)
        console.log(JSON.stringify(query.value.filter))
    })



    return (
        <div class="card flex flex-col justify-between w-full h-full">
            <div class="card-header text-sm font-light flex flex-row justify-between items-center px-2">
                <div class="flex flex-row items-center gap-4">
                    <div class="flex flex-row items-center gap-2">
                        <span>Show </span>
                        <select class="select select-sm select-primary w-18" onChange$={(_, el) => query.value.limit = Number(el.value)}>
                            {limits.map((limit, index) => (
                                <option key={index} value={limit}>{limit.toString()}</option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-4">
                    {acl.value.export &&
                        <>
                            <i class="bi bi-filetype-csv text-2xl"></i>
                            <i class="bi bi-filetype-xls text-2xl"></i>
                            <i class="bi bi-filetype-pdf text-2xl"></i>
                        </>
                    }
                </div>
            </div>
            <div class="grow card-body p-2 grow min-h-0 overflow-y-auto">
                <table class="table table-pin-rows">
                    <thead>
                        <tr class="bg-base-200">
                            {rows.map((row, index) =>
                                <td key={index} class="p-2">
                                    <span class="flex justify-center">{row.header}</span>
                                </td>
                            )}
                        </tr>
                        <tr class="bg-neutral text-neutral-content font-semibold">
                            {rows.map((row, index) => row.field === "uuid" ?
                                <td key={index} class="p-2">
                                    <div class="flex justify-center">
                                        <input
                                            type="checkbox"
                                            class="checkbox checkbox-sm checkbox-primary"
                                            // Marca como chequeado si todos los visibles están seleccionados
                                            checked={selected.value.length === data.value.length}
                                            // Llama a la función al hacer clic
                                            onClick$={toggleSelectAll}
                                        />
                                    </div>
                                </td>
                                : row.field !== "actions" ?
                                    <td key={index} class="p-2">
                                        <div class="w-full flex flex-row justify-center items-center">
                                            {row.filter ?
                                                <label class="input input-primary input-sm w-full focus:outline-none focus-within:outline-none">
                                                    <span class="label px-1">
                                                        <i class="material-symbols-outlined text-xs">search</i>
                                                    </span>
                                                    <input id={row.field} type={row.type}
                                                        class="input-primary input-sm font-light pika-single" placeholder={row.header}
                                                        onInput$={(_, el) => setInput(row.field, el.value)} onChange$={(_, el) => setInput(row.field, el.value)}
                                                    />
                                                </label>
                                                : ""}
                                            {row.sort ?
                                                <div class="flex flex-col px-1 leading-none">
                                                    <i translate="no" class="bi bi-caret-up-fill" onClick$={() => order(row.field, "asc")}></i>
                                                    <i translate="no" class="bi bi-caret-down-fill" onClick$={() => order(row.field, "desc")}></i>
                                                </div>
                                                : ""}
                                        </div>
                                    </td>
                                    :
                                    <td key={index} class="p-2">
                                        {acl.value.post &&
                                            <div class="flex justify-center">
                                                {open.value.on === "modal" ?
                                                    <button class="btn btn-primary btn-sm" onClick$={() => { open.value.method = "POST"; current.value = {}; open.value.on = true }}>
                                                        <span>Add</span>
                                                        <i class="bi bi-plus text-lg"></i>
                                                    </button>
                                                    :
                                                    <a href="/add" class="btn btn-primary btn-sm">
                                                        <span>Add</span>
                                                        <i class="bi bi-plus text-lg"></i>
                                                    </a>
                                                }
                                            </div>
                                        }
                                    </td>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <Resource
                            value={data}
                            onPending={() => <tr><td colSpan={rows.length} class="text-center">Loading...</td></tr>}
                            onRejected={() => <tr><td colSpan={rows.length} class="text-center">Error loading data</td></tr>}
                            onResolved={(d) => d.map((item: any, index: number) => (
                                <tr key={index} class={selected.value.includes(item["uuid"]) || current.value["uuid"] === item["uuid"] ? "bg-base-200" : ""}>
                                    {rows.map((row: any) => (
                                        <>
                                            {row.field === "uuid" ?
                                                <td key={index} class="p-2">
                                                    <div class="flex justify-center">
                                                        <input
                                                            type="checkbox"
                                                            class="checkbox checkbox-sm checkbox-primary"
                                                            // Marca como chequeado si el ID de esta fila está en el array 'selected'
                                                            checked={selected.value.includes(item[row.field])}
                                                            // Llama a la función al hacer clic
                                                            onClick$={() => toggleSelection(item[row.field])}
                                                        />
                                                    </div>
                                                </td>
                                                : row.field !== "actions" ?
                                                    <td key={index} class="p-2">
                                                        {Array.isArray(item[row.field]) ?
                                                            <div class="w-full flex flex-row justify-center items-center gap-2">
                                                                {item[row.field].length} item{item[row.field].length === 1 ? "" : "s"}
                                                            </div>
                                                            : row.field.includes(".") ?
                                                                <div class="w-full flex flex-row items-center gap-2">
                                                                    {String(row.field.split(".").reduce((acc: any, key: number) => acc?.[key], item) ?? "")}
                                                                </div>
                                                                : typeof item[row.field] === "boolean" ?
                                                                    <div class="w-full flex flex-row justify-center items-center gap-2">
                                                                        <div class="inline-grid *:[grid-area:1/1]">
                                                                            <div class={["status animate-ping", item[row.field] ? "status-success" : "status-error"]}></div>
                                                                            <div class={["status", item[row.field] ? "status-success" : "status-error"]}></div>
                                                                        </div>
                                                                    </div>
                                                                    : typeof item[row.field] === "string" && row.type === "date" ?
                                                                        <div class="w-full flex flex-row items-center gap-2 capitalize">
                                                                            {tdt(item[row.field])}
                                                                        </div>
                                                                        :
                                                                        <div class="w-full flex flex-row items-center gap-2 capitalize">
                                                                            {item[row.field]}
                                                                        </div>
                                                        }
                                                    </td>
                                                    :
                                                    <td key={index} class="p-2">
                                                        <div class="flex flex-row justify-center gap-4">
                                                            {acl.value.get &&
                                                                <div class="lg:tooltip tooltip-info on-hover:tooltip-open" data-tip="View">
                                                                    <i class="cursor-pointer bi bi-eye font-xl"
                                                                        onClick$={() => { handleAction(); current.value = { crud: "view", row: item } }}
                                                                    />
                                                                </div>
                                                            }
                                                            {acl.value.patch &&
                                                                <div class="lg:tooltip tooltip-warning on-hover:tooltip-open" data-tip="Edit">
                                                                    <i class="cursor-pointer bi bi-pencil font-xl"
                                                                        onClick$={() => { handleAction(); current.value = { crud: "update", row: item } }}
                                                                    />
                                                                </div>
                                                            }
                                                            {acl.value.delete &&
                                                                <div class="lg:tooltip tooltip-error on-hover:tooltip-open" data-tip="Delete">
                                                                    <i class="cursor-pointer bi bi-trash font-xl"
                                                                        onClick$={() => { handleAction(); current.value = { crud: "delete", row: item } }}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>

                                            }
                                        </>
                                    ))}
                                </tr>
                            )
                            )}
                        />
                    </tbody>
                </table>
            </div>
            <div class="card-actions flex flex-row justify-between items-center px-2">
                <div class="join">
                    <button disabled={query.value.page <= 1} class="join-item btn btn-sm text-base-content font-light"
                        onClick$={() => query.value.page = 1}
                    >
                        <i class="bi bi-chevron-bar-left"></i>
                    </button>
                    <button disabled={query.value.page <= 1} class="join-item btn btn-sm text-base-content font-light"
                        onClick$={() => query.value.page = query.value.page - 1}
                    >
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    {Array.from({ length: pagination.value.pages }, (_, page) =>
                        <button class={["join-item btn btn-sm text-base-content font-light", query.value.page === page + 1 ? "btn-active" : ""]}
                            onClick$={() => query.value.page = page + 1}
                        >
                            {page + 1}
                        </button>
                    )}
                    <button disabled={query.value.page >= pagination.value.pages} class="join-item btn btn-sm text-base-content font-light"
                        onClick$={() => query.value.page = query.value.page + 1}
                    >
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button disabled={query.value.page >= pagination.value.pages} class="join-item btn btn-sm text-base-content font-light"
                        onClick$={() => query.value.page = pagination.value.pages}
                    >
                        <i class="bi bi-chevron-bar-right"></i>
                    </button>
                </div>
                <div class="text-sm">
                    Showing {((query.value.page - 1) * query.value.limit) + 1} to {Math.min(query.value.page * query.value.limit, pagination.value.total)} of {pagination.value.total} entries
                </div>
            </div >
        </div>
    );
})