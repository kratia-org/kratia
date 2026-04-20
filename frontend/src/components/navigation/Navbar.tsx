import { component$, Slot } from '@builder.io/qwik';

interface NavbarProps {
  title?: string;
  logoUrl?: string;
  class?: string;
}

export const Navbar = component$<NavbarProps>(({ title, logoUrl, class: customClass }) => {
  const classes = [
    'navbar bg-base-100 shadow-md px-4 lg:px-8 h-16',
    customClass || '',
  ].join(' ');

  return (
    <div class={classes}>
      <div class="flex-1">
        <a class="btn btn-ghost text-xl font-bold flex items-center gap-2">
          {logoUrl && <img src={logoUrl} alt="Logo" class="w-8 h-8 rounded-full" />}
          {title || 'Kratia'}
        </a>
      </div>
      <div class="flex-none gap-2">
        <Slot name="menu" />
        <div class="dropdown dropdown-end">
          <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span class="text-lg">U</span>
            </div>
          </label>
          <ul tabIndex={0} class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Perfil</a></li>
            <li><a>Configuración</a></li>
            <li><a>Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
});
