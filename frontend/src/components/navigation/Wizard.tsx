import { component$, useSignal, type Signal, Slot, useTask$, } from "@builder.io/qwik";
import clsx from "clsx";
import { reset, type FormStore } from "@modular-forms/qwik";
import { Expandable } from "../actions/expandable";
import { speak } from "~/core/speak";
import Response from "../form/Response";
import { useNavigate } from "@builder.io/qwik-city";

type Step = {
  id: string;
  title: string;
  icon: string;
  of: FormStore<any, any>;
};

type WizardProps = {
  steps: Signal<Step[]>; // 👈 steps es una señal
  stepActive: Signal<number>;
  redirect?: string;
};

export const Wizard = component$(({ steps, stepActive, redirect }: WizardProps) => {

  const currentStep = useSignal<Step>(steps.value[stepActive.value]);

  const advancing = useSignal(false);

  const navigate = useNavigate();

  useTask$(({ track, cleanup }) => {
    const response = track(() => steps.value[stepActive.value]?.of.response);

    const finalStep = steps.value.length - 1;

    currentStep.value = steps.value[stepActive.value];

    let destination: string | undefined = undefined;

    if (stepActive.value === finalStep) {
      if (response.status === "success") {
        destination = redirect;
      }
    } else {
      if (response.data?.redirect) {
        destination = response.data.redirect;
      }
    }

    if (response.status && advancing.value) {
      const timeout = setTimeout(() => {
        if (destination) {
          navigate(destination);
        } else {
          stepActive.value++;
        }
        advancing.value = false; // reset
      }, 3000);
      cleanup(() => clearTimeout(timeout));
    }
  });

  const { t } = speak();


  return (
    <>
      <div class="relative flex flex-row items-center justify-around bg-transparent">
        <progress style={{ width: `${((90 / (steps.value.length + 1)) * steps.value.length)}%` }} class={`absolute top-5 progress progress-success`} value={90 / (steps.value.length - 1) * stepActive.value} max="100"></progress>
        {steps.value.map((step, index) => (
          <div key={index} class="flex z-10 flex-col items-center justify-center bg-transparent">
            <div class={clsx("flex items-center justify-center rounded-full w-12 h-12", index < stepActive.value ? "bg-success" : index === stepActive.value ? "bg-primary" : "bg-error")}>
              <i translate="no" style={{ fontSize: "32px" }} class={"text-white material-symbols-outlined"}>{step.icon}</i>
            </div>
            <span class="capitalize">{t(step.title)}</span>
          </div>
        ))}
      </div>

      {steps.value.map((step, index) => (
        <div key={step.id} class={clsx("transition-opacity duration-500 ease-in-out", index === stepActive.value ? "block" : "hidden")}>
          <Slot name={step.id} />
          <Response of={step.of} />
        </div>
      ))}

      <div class="flex flex-row gap-4 w-full">
        {stepActive.value > 0 && (
          <div class="w-full">
            <button class="btn w-full btn-primary" onClick$={(e) => { e.preventDefault(); reset(steps.value[stepActive.value - 1].of); stepActive.value-- }}>
              Previous
            </button>
          </div>
        )}
        <div class="w-full">
          <button class="btn w-full btn-primary" type="submit" form={currentStep.value?.id}
            onClick$={() => advancing.value = true}>
            {stepActive.value === steps.value.length - 1 ? t("Finish") : t("Next")}
          </button>
        </div>
      </div>
    </>
  );
});

