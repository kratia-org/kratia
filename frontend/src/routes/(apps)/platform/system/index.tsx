import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import ApexCharts from "apexcharts";

export const manifest = {
    name: "Platform",
    icon: "bi bi-laptop",
    description: "Platform",
}

export default component$(() => {
    const chartRef = useSignal<HTMLDivElement>();

    const data = useSignal<{ x: number; y: number }[]>([]);

    useVisibleTask$(({ track, cleanup }) => {
        if (!chartRef.value) return;
        let currentData = Array.from({ length: 10 }, (_, i) => ({
            x: Date.now() - (9 - i) * 1000,
            y: 0 // o un valor inicial
        }));

        // 1. Configuración inicial del gráfico
        const chart = new ApexCharts(chartRef.value, {
            chart: {
                type: "line",
                height: 280,
                animations: {
                    enabled: true,
                    easing: "linear",
                    dynamicAnimation: {
                        speed: 5000,
                    },
                },
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            series: [
                {
                    name: "Datos en vivo",
                    data: currentData,
                },
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            markers: {
                size: 0,
            },
            xaxis: {
                type: "datetime",
            },
            yaxis: {
                min: 0,
                max: 100,
            },
            grid: {
                borderColor: "#eee",
            },
        });

        chart.render();


        // 2. Crear un intervalo que simule la entrada de datos
        const interval = setInterval(() => {
            const now = Date.now();

            // Añadimos el nuevo punto
            currentData.push({
                x: now,
                y: Math.floor(Math.random() * 100),
            });

            // Mantenemos el array corto para no saturar la memoria, 
            // aunque el 'range' ya controla la vista, es buena práctica limpiar
            if (currentData.length > 20) {
                currentData.shift();
            }

            // Actualizamos la serie
            chart.updateSeries([{ data: currentData }], true);
        }, 5000);


        cleanup(() => {
            chart.destroy();
            clearInterval(interval);
        });
    });

    return (
        <div class="w-full h-full flex flex-col p-2">
            <div class="grid grid-cols-4 gap-4 p-2">
                <div class="stats shadow">

                    <div class="stat">
                        <div class="stat-figure text-primary">
                            <i class="bi bi-heart"></i>
                        </div>
                        <div class="stat-title text-2xl">Total Likes</div>
                        <div class="stat-value text-primary">25.6K</div>
                        <div class="stat-desc">21% more than last month</div>
                    </div>

                </div><div class="stats shadow">
                    <div class="stat">
                        <div class="stat-title">Total Page Views</div>
                        <div class="stat-value">89,400</div>
                        <div class="stat-desc">21% more than last month</div>
                    </div>
                </div><div class="stats shadow">
                    <div class="stat">
                        <div class="stat-title">Total Page Views</div>
                        <div class="stat-value">89,400</div>
                        <div class="stat-desc">21% more than last month</div>
                    </div>
                </div><div class="stats shadow">
                    <div class="stat">
                        <div class="stat-title">Total Page Views</div>
                        <div class="stat-value">89,400</div>
                        <div class="stat-desc">21% more than last month</div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 p-2">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body p-2">
                        <div class="grid grid-cols-[70%_30%] gap-4">
                            <div class="">
                                <div class="p-2">
                                    <h2>Card title</h2>
                                    <p>If a dog chews shoes whose shoes does he choose?</p>
                                </div>
                                <div ref={chartRef} />
                            </div>
                            <div>
                                <div class="card-header p-2">
                                    <h2 class="card-title">Card title</h2>
                                    <p>If a dog chews shoes whose shoes does he choose?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-header p-4">
                        <h2>Card title</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                    </div>
                    <div class="card-body">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 p-2">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-header p-4">
                        <h2 class="card-title">Card title</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                    </div>
                    <div class="card-body p-2">
                        <div class="grid grid-cols-[70%_30%] gap-4">
                            <div class="">
                            </div>
                            <div>gdfgds</div>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-header p-4">
                        <h2 class="card-title">Card title</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                    </div>
                    <div class="card-body">
                        <div class="overflow-x-auto">
                            <table class="table table-xs">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Job</th>
                                        <th>Favorite Color</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>1</th>
                                        <td>Cy Ganderton</td>
                                        <td>Quality Control Specialist</td>
                                        <td>Blue</td>
                                    </tr>
                                    <tr class="hover:bg-base-300">
                                        <th>2</th>
                                        <td>Hart Hagerty</td>
                                        <td>Desktop Support Technician</td>
                                        <td>Purple</td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td>Brice Swyre</td>
                                        <td>Tax Accountant</td>
                                        <td>Red</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});