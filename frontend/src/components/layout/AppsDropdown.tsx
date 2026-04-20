import { component$ } from "@builder.io/qwik";

export default component$((data:Array) => {
    return (
        <div class="w-full dropdown dropdown-hover">
            <div tabIndex={0} role="button" class="w-full flex flex-row justify-between btn btn-primary">
                <i class="material-symbols-outlined">apps </i>
                <span class="flex-1">App</span>
                <i class="material-symbols-outlined">apps </i>
            </div>
            <ul tabIndex={0} class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
                <li>
                    <a href="">
                        <i class="material-symbols-outlined">apps </i>
                        <span class="ml-2">Left Menu</span>
                    </a>
                </li>
            </ul>
        </div>
    )
})