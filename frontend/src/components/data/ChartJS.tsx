import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

export type ChartJs = {
    type: string;
    id: string;
    data: any;
    options: any;
}

export const ChartJs = component$(({ type, id, data, options }: ChartJs) => {

    const chartType = useSignal(type);
    const chartId = useSignal(id);
    const chartData = useSignal(data);
    const chartOptions = useSignal(options);


    useVisibleTask$(async ({ track }) => {
        track(() => chartType.value)
        track(() => chartId.value)
        track(() => chartData.value)
        track(() => chartOptions.value)


        const chartCanvas = document.getElementById(chartId.value) as HTMLCanvasElement;

        let chart: Chart;

        if (chart) chart.destroy();
        chart = new Chart(chartCanvas, {
            type: chartType.value,
            data: chartData.value,
            options: chartOptions.value,
        });
    });

    return (
        <canvas id={chartId.value} class="w-full h-full"></canvas>
    );
});
