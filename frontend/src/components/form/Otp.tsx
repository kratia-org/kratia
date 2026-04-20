import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import { speak } from "~/core/speak";

export const Otp = component$(({ id, digits }: { id: string, digits: number }) => {

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const div = document.getElementById(id) as HTMLDivElement;
        if (!div) return;

        const inputs = Array.from(div.querySelectorAll<HTMLInputElement>('input[type=text]'));
        const submit = document.querySelector<HTMLButtonElement>('button[type=submit]');

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLInputElement;
            const index = inputs.indexOf(target);

            if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey) {
                e.preventDefault();
            }

            if (e.key === 'Backspace') {
                if (target.value) {
                    // Si el input actual tiene valor, lo borramos
                    target.value = '';
                    inputs[index - 1].focus();
                } else if (index > 0) {
                    // Si está vacío, borramos el anterior y nos movemos
                    inputs[index - 1].value = '';
                    inputs[index - 1].focus();
                }
                e.preventDefault();
            }

            if (e.key === 'Delete') {
                target.value = '';
                e.preventDefault();
            }
        };

        const handleInput = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const index = inputs.indexOf(target);
            if (target.value) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    submit?.focus();
                    submit?.click();
                }
            }
        };

        const handleFocus = (e: Event) => {
            const target = e.target as HTMLInputElement;
            target.select();
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            const text = e.clipboardData?.getData('text') ?? '';
            if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) return;

            const digits = text.split('');
            inputs.forEach((input, index) => (input.value = digits[index]));
            submit?.focus();
        };

        inputs.forEach((input) => {
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeyDown);
            input.addEventListener('focus', handleFocus);
            input.addEventListener('paste', handlePaste);
        });
    });

    const { t } = speak();

    return (
        <div id={id} class="w-full flex flex-col justify-center gap-2 mt-4">
            <div class="flex flex-row w-full items-center p-2">
                <span class="text-md text-center">{t(`Enter the ${digits}-digits verification code that was sent to your phone number.`)}</span>
            </div>

            <div class="flex flex-row justify-center text-md p-2">
                <span>{t("Didn't receive code?")}</span>
                <a href="#" class="link link-primary">{t("Resend")}</a>
            </div>

            <div class="flex flex-row justify-center gap-4 font-bold py-6">
                <Slot />
            </div>
        </div>)
})