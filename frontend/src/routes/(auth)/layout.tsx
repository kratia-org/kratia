import { component$, Slot, useContextProvider, useSignal, useContext, Resource } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { localeContext } from "~/contexts/locale";
import { themeContext } from "~/contexts/theme";
import { translationsContext } from "~/contexts/trasnlations";
import { api } from "~/core//api";
import { getStructure } from "~/core/structure";


export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const token = cookie.get("token");
  if (!token) return;
  const getSession = await api.get("/platform/security/session", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (getSession.status !== 200) return;
  const { data } = await getSession;
  if (!data) return;
  const session = data;
  if (!session.status) redirect(302, "/login");
  if (session.status) redirect(302, "/dashboard");
  return;
}

// Loader
export const useInitData = routeLoader$(async ({ pathname, error }) => {
  try {
    const currentApp = pathname.split("/").slice(1, -1)[0] as string;
    const structure = getStructure(currentApp);
    const languages = await api.get("/platform/geography/languages").json<any>()
    return {
      apps: structure?.apps.filter((app: any) => app.id !== "auth"),
      app: structure?.apps.filter((app: any) => app.id === "auth")[0],
      module: structure?.modules.filter((module: any) => module.id === currentApp)[0],
      languages: languages ? languages.rows : []
    };
  } catch (err) {
    console.error(err);
    throw error(500, "Error al obtener los idiomas");
  }
});

export const head: DocumentHead = ({ resolveValue }) => {
  const initData: any = resolveValue(useInitData);
  return {
    title: initData.app.name + " - " + initData.module.name,
    meta: [
      { name: "description", content: initData.module.description },
    ],
  };
};


export default component$(() => {

  const initData: any = useInitData();

  const currentLocale = useSignal<Locale>({
    language: initData.value.languages.filter((l: any) => l.iso_alpha2 === "en")[0],
    dateFormat: "",
    timeFormat: "",
    datetimeFormat: "",
    currency: {},
    timezone: {},
  });

  useContextProvider(localeContext, currentLocale);
  const theme = useContext(themeContext);
  const translations = useSignal<any>({})

  useContextProvider(translationsContext, translations)

  const t = (key: string) => key;

  return <Resource
    value={initData}
    onPending={() => <div>Loading...</div>}
    onResolved={(data) => {
      const { apps, app, module, languages } = data as { apps: any[], app: any, module: any, languages: any[] };
      return (
        <main class="w-full h-full grid grid-cols-1 lg:grid-cols-2">
          {/* Columna izquierda */}
          <div class="hidden lg:flex w-full h-full flex-col bg-primary justify-center items-center p-8 text-white">
            <div class="flex flex-col w-[80%] h-full py-8 justify-around items-center">
              <div class="self-center">
                <img src="/Kratia.png" class="w-40 h-auto" alt="Kratia Logo" />
              </div>
              <div class="text-center">
                <h1 class="text-4xl p-4">{t(app.name + " - " + module.name)}</h1>
                <h4 class="font-extralight">{t(module.description)}</h4>
              </div>
              <div class="grid grid-cols-6 gap-8">
                {apps.length > 0 && apps.map((app: any, index: number) => (
                  <div key={index} class="flex flex-col gap-2 items-center">
                    <i translate="no" class="material-symbols-outlined" style={{ fontSize: "40px" }}>{app.icon}</i>
                    <span class="capitalize">{t(`${app.name}`)}</span>
                  </div>
                ))}
              </div>
              <div class="p-8 text-justify">
                <h5 class="font-extralight">{t(app.description)}</h5>
              </div>
            </div>
          </div>
          {/* Columna derecha */}
          <div class="flex flex-col w-full h-full justify-between items-center relative">
            {/* Barra superior */}
            <div class="flex flex-row  w-full items-center justify-end gap-4 p-2">
              <label class="flex items-center cursor-pointer gap-1">
                <i translate="no" class="material-symbols-outlined" style={{ fontSize: "20px" }}>light_mode</i>
                <input class="toggle theme-controller" id="theme" name="theme" type="checkbox" onClick$={() => theme.value = theme.value === "dark" ? "light" : "dark"} />
                <i translate="no" class="material-symbols-outlined" style={{ fontSize: "20px" }}>dark_mode</i>
              </label>
              {Array.isArray(languages) && languages.length > 0 && (
                <div class="dropdown dropdown-hover">
                  <div tabIndex={0} class="flex flex-row items-center btn btn-primary w-32 cursor-pointer">
                    <i class={`fi fi-${currentLocale.value.language.country_iso_alpha_2.toLowerCase()}`} />
                    <span class="grow text-left capitalize">{t(`${currentLocale.value.language.name_native}`)}</span>
                  </div>
                  <ul tabIndex={0} class="menu dropdown-content bg-base-100 rounded-box w-full z-1 p-1 shadow-sm">
                    {languages.length > 0 && languages.filter((language: any) => language.iso_alpha2 !== currentLocale.value.language.iso_alpha2).map((language: any, index: number) => (
                      <li key={index} class="flex flex-row gap-2 items-center hover:bg-base-300" onClick$={() => currentLocale.value = { ...currentLocale.value, language: language }}>
                        <div class="w-full">
                          <i class={`fi fi-${language.country.toLowerCase()}`} />
                          <span class="p-0 capitalize">{t(`${language.name_native}`)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Contenido */}
            <div class="flex flex-col w-full h-full justify-center items-center">
              <Slot />
            </div>
          </div>
        </main >
      )
    }}
  />;
});
