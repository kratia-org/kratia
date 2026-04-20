import { component$, isDev, useContextProvider, useSignal } from "@builder.io/qwik";
import { ErrorBoundary, QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { Head } from "./components/layout/Head";
import { localeContext, type Locale } from "./contexts/locale";
import { themeContext } from "./contexts/theme";
import { translationsContext } from "./contexts/trasnlations";

import "./global.css";



export default component$(() => {

  const theme = useSignal<"light" | "dark">("light");
  useContextProvider(themeContext, theme);

  const locale = useSignal<Locale>({
    language: {
      iso_alpha2: "en"
    }
  })
  useContextProvider(localeContext, locale)

  const translations = useSignal<Record<string, string>>({})
  useContextProvider(translationsContext, translations)

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <Head />
      </head>
      <body
        lang="en"
        class="w-screen h-screen flex flex-col overflow-hidden bg-neutral text-neutral-content font-extralight"
        data-theme={theme.value}
      >
        <ErrorBoundary fallback$={(error) => (
          <div class="error-container">
            <h3>¡Ups! Algo salió mal</h3>
            <p>{error.message}</p>
          </div>
        )}>
          <RouterOutlet />
        </ErrorBoundary>
      </body>
    </QwikCityProvider>
  );
});
