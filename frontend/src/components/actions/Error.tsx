import { component$ } from "@builder.io/qwik";

interface ErrorProps {
  code?: number;
  message?: string;
  link?: string;
}

export const Error = component$<ErrorProps>(({ code = 404, message = "No se encontró la página solicitada.", link = "/dashboard", }) => {
  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-primary to-secondary text-white p-6">
      {/* Código grande */}
      <h1 class="text-9xl font-extrabold drop-shadow-lg">{code}</h1>

      {/* Mensaje */}
      <p class="mt-4 text-2xl font-light text-center max-w-xl">
        {message}
      </p>

      {/* Imagen o icono decorativo */}
      <div class="mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          class="w-32 h-32 opacity-80"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Botón */}
      <a
        href={link}
        class="btn btn-accent mt-10 shadow-lg shadow-black/20 text-lg px-8"
      >
        Return
      </a>
    </div>
  );
}
);
