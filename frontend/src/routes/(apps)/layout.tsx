import { component$, isDev, Slot, useContext, useContextProvider, useSignal } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import Logo from '~/components/layout/Logo';
import { themeContext } from '~/contexts/theme';
import { api } from '@kratia/sdk/api';
import { type Locale, localeContext } from '~/hooks/useSpeak';
import { speak } from '~/core/speak';
import { useStructure } from '~/hooks/useStructure';

// Loader
export const useInitData = routeLoader$(async ({ pathname, error }) => {
    const [app, module, page] = pathname.split("/").slice(1, -1);
    const [getStructure, getLanguages,] = await Promise.all([
        useStructure(app).catch(() => null),
        api.get("/platform/geography/languages").catch((res) => res),
    ]);
    if (!getStructure || getLanguages.status !== 200) throw error(500, "Internal Server Error");
    const { data: languages } = await getLanguages.data;
    const { apps, modules } = getStructure;
    const currentApp = apps.find((a: any) => a.id === app);
    const currentModule = modules.find((m: any) => m.id === module);
    const currentPage = currentModule?.pages.find((p: any) => p.id === page);
    return {
        apps: apps,
        modules,
        languages,
        current: {
            app: currentApp,
            module: currentModule,
            page: currentPage
        }
    };
});

export default component$(() => {

    const [appId, moduleId, pageId] = useLocation().url.pathname.split("/").slice(1, -1)

    const { apps, modules, languages, current } = useInitData().value

    console.log(appId, moduleId, pageId, current.module?.id, current.page?.id)

    const theme = useContext(themeContext)

    const locale = useSignal<Locale>({
        language: languages.find((l: any) => l.iso_alpha2 === "en"),
        dateFormat: "medium",
        timeFormat: "long",
        datetimeFormat: "MMM D, YYYY HH:mm A",
    })

    useContextProvider(localeContext, locale)

    const { t } = speak()

    return (
        <>
            <header class="flex flex-row flex-wrap items-center bg-neutral p-1">
                <div class="w-[50%] md:w-[15%] p-1">
                    <span class="text-4xl text-primary font-bold">Kratia</span>
                </div>
                <div class="w-[50%] md:w-[15%] p-1">
                    <div class="dropdown dropdown-hover col-span-2 w-full">
                        <button tabindex={0} class="btn btn-primary w-full flex flex-row justify-between items-center">
                            <i translate="no" class="material-symbols-outlined">
                                {current.app?.icon}
                            </i>
                            <span class="grow capitalize">{current.app?.name}</span>
                            <i translate="no" class="material-symbols-outlined">keyboard_arrow_down</i>
                        </button>
                        <ul tabindex="0" class="menu dropdown-content rounded-box z-100 w-full p-1 shadow-sm bg-base-100">
                            {Array.isArray(apps) && apps.length > 0 && apps.map((app: any, key: number) => (
                                <li key={key}>
                                    <a href={`/${app.id}`} class="flex flex-row justify-between items-center">
                                        <i translate="no" class="material-symbols-outlined">{app.icon}</i>
                                        <span class="grow capitalize">{app.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div class="w-full md:w-[40%]">
                    <label class="w-full input input-primary">
                        <span class="label">
                            <i translate="no" class="material-symbols-outlined">search</i>
                        </span>
                        <input type="text" placeholder={t("search")} />
                    </label>
                </div>
                <div class="w-[50%] md:w-[15%] p-1 flex flex-row items-center space-x-1">
                    {languages.length > 0 &&
                        < details class="dropdown dropdown-hover w-32">
                            <summary role="button" class="btn btn-primary w-full">
                                <div class="flex flex-row items-center space-x-2">
                                    <i translate="no" class={`text-lg fi fi-${locale.value.language.country.toLowerCase()}`} />
                                    <span class="grow">{locale.value.language.name_native}</span>
                                </div>
                            </summary>
                            <ul class="dropdown-content menu bg-base-100 z-1 w-full shadow">
                                {languages.map((language: Record<string, any>, key: number) => language.name_native !== locale.value.language.name_native && (
                                    <li key={key}>
                                        <a href="#" class="flex flex-row justify-between items-center" onClick$={() => locale.value = { ...locale.value, language: language }}>
                                            <i translate="no" class={`text-lg fi fi-${language.country.toLowerCase()}`} />
                                            <span class="grow">{language.name_native}</span>
                                        </a>
                                    </li>
                                ))
                                }
                            </ul>
                        </details>
                    }
                    <label class="btn btn-ghost btn-circle swap swap-rotate">
                        <input
                            type="checkbox"
                            class="theme-controller"
                            checked={theme.value === "dark"}
                            onClick$={() => (theme.value = theme.value === "light" ? "dark" : "light")}
                        />

                        <i translate="no" class="swap-off fill-current material-symbols-outlined">sunny</i>
                        <i translate="no" class="swap-on fill-current material-symbols-outlined">bedtime</i>
                    </label>

                    <details class="dropdown dropdown-hover">
                        <summary role="button" class="btn btn-ghost btn-circle">
                            <div class="indicator">
                                <i translate="no" class="material-symbols-outlined">notifications</i>
                                <span class="badge badge-sm indicator-item">8</span>
                            </div>
                        </summary>
                        <ul class="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                            <li class="card-body">
                                <span class="text-lg font-bold">8 Items</span>
                                <span class="text-info">Subtotal: $999</span>
                                <div class="card-actions">
                                    <button class="btn btn-primary btn-block">View cart</button>
                                </div>
                            </li>
                        </ul>
                    </details>
                </div>
                <div class="w-[50%] md:w-[15%] flex flex-row justify-end p-1">
                    <div class="dropdown dropdown-hover items-end">
                        <div tabIndex={2} role="button" class="btn btn-ghost  p-2 flex flex-row items-center">
                            <div class="avatar">
                                <div class="rounded-full">
                                    <img
                                        class="w-7 h-7"
                                        alt="Avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col items-start px-2">
                                <span class="text-sm font-light">Fredy Romero</span>
                            </div>

                        </div>
                        <ul tabIndex={2} class="w-full menu menu-sm dropdown-content bg-base-100 rounded-box z-1 p-2 shadow">
                            <li>
                                <a href='' class="justify-between">
                                    Profile
                                    <span class="badge">New</span>
                                </a>
                            </li>
                            <li><a href=''>Settings</a></li>
                            <li><a href=''>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </header >
            <main class="drawer lg:drawer-open grow min-h-0">
                <input id="aside-left" type="checkbox" class="drawer-toggle" />
                <aside class="drawer-side is-drawer-close:overflow-visible h-full lg:relative lg:block lg:z-10">
                    <label for="aside-left" aria-label="close sidebar" class="drawer-overlay"></label>
                    <div class="flex flex-col justify-between h-full bg-primary text-primary-content is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-300">
                        <header class="menu w-full is-drawer-open:overflow-y-auto is-drawer-close:overflow-visible">
                            <li>
                                <a href={`/${current?.app?.id}`} class="p-2 m-0">
                                    <i class="material-symbols-outlined">{current?.app?.icon}</i>
                                    <span class="is-drawer-close:hidden truncate flex-1">{current?.app?.name}</span>
                                </a>
                            </li>
                        </header>
                        <main class="grow">
                            <ul class="menu w-full is-drawer-open:overflow-y-auto is-drawer-close:overflow-visible">
                                {Array.isArray(modules) && modules.length > 0 && modules.map((module, index) =>
                                    Array.isArray(module.pages) && module.pages.length > 0 ? (
                                        <li key={index} class="is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:tooltip-primary" data-tip={module.name}>
                                            <details>
                                                <summary class="p-2 m-0 is-drawer-close:after:hidden is-drawer-open:after:block">
                                                    <i translate="no" class="material-symbols-outlined shrink-0">{module.icon}</i>
                                                    <span class="is-drawer-close:hidden capitalize truncate flex-1">{module.name}</span>
                                                </summary>
                                                {/*  🔥 CORREGIDO: el submenu aparece cuando leftOpen es true */}
                                                <ul class="is-drawer-close:hidden is-drawer-open:block before:bg-white">
                                                    {module.pages.map((page: any, index: number) => (
                                                        <li key={index}>
                                                            <a href={`/${current?.app?.id}/${module.id}/${page.id}`} class="is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:tooltip-primary p-2 m-0 flex items-center gap-2 min-w-0" data-tip={page.name}>
                                                                <i translate="no" class="material-symbols-outlined shrink-0">{page.icon}</i>
                                                                <span class="capitalize truncate flex-1">{page.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        </li>
                                    ) : (
                                        <li key={index} class="is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:tooltip-primary" data-tip={module.name}>
                                            <a href={`/${current?.app?.id}/${module.id}`} class="p-2 m-0">
                                                <i translate="no" class="material-symbols-outlined shrink-0">{module.icon}</i>
                                                <span class="is-drawer-close:hidden capitalize truncate flex-1">{module.name}</span>
                                            </a>
                                        </li>
                                    )
                                )}
                            </ul>
                        </main>
                        <footer class="menu w-full is-drawer-open:overflow-y-auto is-drawer-close:overflow-visible">
                            <li>
                                <a href="/support" class="p-2 m-0">
                                    <i class="material-symbols-outlined shrink-0">support</i>
                                    <span class="is-drawer-close:hidden truncate flex-1">Support</span>
                                </a>
                            </li>
                        </footer>
                    </div>
                </aside>
                <div class="drawer-content drawer drawer-end lg:drawer-open flex-1 min-w-0 min-h-0">
                    <input id="aside-right" type="checkbox" class="drawer-toggle" />
                    <section class="drawer-content grow flex flex-col justify-between min-h-0">
                        <nav class="flex flex-row justify-between items-center w-full p-2 h-14 bg-primary text-primary-content">
                            <div class="flex flex-row items-center gap-4">
                                <label for="aside-left" aria-label="open sidebar" class="btn btn-square btn-ghost">
                                    <i class="material-symbols-outlined drawer-open:hidden">right_panel_open</i>
                                </label>
                                <div class="capitalize">
                                    {current.module?.id === moduleId && (
                                        current.page?.id === pageId
                                            ? current.page.name
                                            : current.module.name
                                    )}
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-4">
                                <div class="breadcrumbs text-sm">
                                    <ul>
                                        {current.app?.id === appId && (
                                            <li>
                                                <a href={`/${appId}`}>
                                                    <i class="material-symbols-outlined">{current.app?.icon}</i>
                                                    <span class="capitalize">{current.app?.name}</span>
                                                </a>
                                            </li>
                                        )}
                                        {current.module?.id === moduleId && (
                                            <li>
                                                <a href={`/${appId}/${moduleId}`}>
                                                    <i class="material-symbols-outlined">{current.module?.icon}</i>
                                                    <span class="capitalize">{current.module?.name}</span>
                                                </a>
                                            </li>
                                        )}
                                        {current.page?.id === pageId && (
                                            <li>
                                                <a href={`/${appId}/${moduleId}/${pageId}`}>
                                                    <i class="material-symbols-outlined">{current.page?.icon}</i>
                                                    <span class="capitalize">{current.page?.name}</span>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <label for="aside-right" aria-label="open sidebar" class="btn btn-square btn-ghost">
                                    <i class="material-symbols-outlined">menu</i>
                                </label>
                            </div>
                        </nav>
                        <div class="grow overflow-y-auto p-4">
                            <Slot />
                        </div>
                        <footer class="w-full h-14 bg-base-300">
                            Footer
                        </footer>
                    </section>
                    <aside class="drawer-side h-full">
                        <label for="aside-right" aria-label="close sidebar" class="drawer-overlay"></label>
                        <div class="flex h-full flex-col justify-between items-start bg-base-200 is-drawer-close:w-0 is-drawer-open:w-64">
                            <ul class="menu w-full grow overflow-y-auto">
                                <li>
                                    <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                        <i class="material-symbols-outlined is-drawer-open:hidden">right_panel_open</i>
                                        <i class="material-symbols-outlined is-drawer-close:hidden">right_panel_close</i>
                                        <span class="is-drawer-close:hidden">Homepage</span>
                                    </button>
                                </li>

                                <li>
                                    <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                        <span class="is-drawer-close:hidden">Settings</span>
                                    </button>
                                </li>
                            </ul>
                            <div class="p-4">
                                <button class="btn btn-square btn-ghost">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                    <span class="is-drawer-close:hidden">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main >
        </>
    );
});
