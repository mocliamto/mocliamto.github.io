// import { Chart, registerables } from 'chart.js';
// import annotationPlugin from 'chartjs-plugin-annotation';
// Chart.register(...registerables, annotationPlugin);
//
// const valueRanges = [
//     'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
//     'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
// ];
// const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
// const fills = [false, false, '+1', '+1', '+1', '+1'];
// const lineWidth = [2, 2, 2, 2, 3];

function renderChartWithLengthData() {
    highlightTab('Lengte');

    const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
    const fills = [false, false, '+1', '+1', '+1', '+1', false, false];
    const lineWidth = [2, 2, 2, 2, 3];

    Promise.all([
        fetch('../../assets/grow.json').then(response => response.json()),
        fetch('../../assets/tno.json').then(response => response.json())
    ]).then(([growData, tnoData]) => {
        const months = Array.from({length: 31}, (_, i) => i * 0.5);

        const userValues = months.map(month => {
            const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
            return record ? parseFloat(record.Lengte) : null;
        });

        tnoData.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));

        const datasets = valueRanges.map((range, index) => ({
            label: range,
            data: months.map(month => {
                const record = tnoData.find(d => parseFloat(d.StapNummer) === month);
                return record ? parseFloat(record[range]) : null;
            }),
            borderColor: lineColors[index % lineColors.length],
            borderWidth: lineWidth[index % lineWidth.length],
            backgroundColor: 'rgba(222,236,220,0.55)',
            fill: fills[index % fills.length],
            pointRadius: 0,
            pointHitRadius: 0,
        }));

        datasets.unshift({
            label: 'Gebruikerswaarden',
            data: userValues,
            borderColor: 'black',
            backgroundColor: 'black',
            spanGaps: true,
        });

        const ctx = document.getElementById('growChartJs').getContext('2d');
        if (window.myGrowChart) {
            window.myGrowChart.destroy();
        }
        window.myGrowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Lengte-Leeftijd 0-15 maanden',
                    },
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Leeftijd (maanden)',
                        },
                        min: 0,
                        max: 15,
                        ticks: {
                            autoSkip: false,
                            callback: function (value) {
                                if (Number.isInteger(value * 0.5)) {
                                    return value * 0.5;
                                }
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Lengte (cm)',
                        },
                        min: 40,
                        max: 92,
                        position: 'left',
                        ticks: {
                            autoSkip: false,
                            stepSize: 2
                        }
                    },
                    yRight: {
                        min: 40,
                        max: 92,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            autoSkip: false,
                            stepSize: 2
                        }
                    },
                },
            },
        });
    }).catch(error => {
        console.error('Error loading data:', error);
    });

    const valueRanges = [
        'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
        'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
    ];
}

function renderChartWithWeightData() {
    // Highlight the selected tab
    highlightTab('Gewicht');

    // Fetch the data from grow.json and then render the weight chart
    fetch('../../assets/grow.json').then(response => response.json())
        .then(growData => {
            const months = Array.from({length: 31}, (_, i) => i * 0.5);

            const userWeightValues = months.map(month => {
                const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
                return record ? parseFloat(record.Gewicht) : null;
            });

            console.log('User Weight Values:', userWeightValues); // Debug the weight values

            const datasets = [{
                label: 'Gebruikerswaarden Gewicht',
                data: userWeightValues,
                borderColor: 'black',
                backgroundColor: 'black',
                spanGaps: true,
                fill: false
            }];

            const ctx = document.getElementById('growChartJs').getContext('2d');
            if (window.myGrowChart) {
                window.myGrowChart.destroy(); // Destroy the old chart instance
            }
            window.myGrowChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Gewicht-Leeftijd 0-15 maanden',
                        },
                        legend: {
                            display: false
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Leeftijd (maanden)',
                            },
                            min: 0,
                            max: 15,
                            ticks: {
                                autoSkip: false,
                                callback: function (value) {
                                    if (Number.isInteger(value * 0.5)) {
                                        return value * 0.5;
                                    }
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Gewicht (kg)',
                            },
                            min: 0, // Set this to the minimum weight you expect
                            max: 10, // Set this to the maximum weight you expect
                            position: 'left',
                            ticks: {
                                autoSkip: false,
                                stepSize: 0.5 // Adjust the step size as needed
                            }
                        }
                    },
                },
            });
        }).catch(error => {
        console.error('Error loading weight data:', error);
    });
}

function highlightTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('selected');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.textContent === tabName) {
            tab.classList.add('selected');
        }
    });
}

document.addEventListener('DOMContentLoaded', renderChartWithLengthData);

// const chartElement = document.getElementById('growChartJs');
// const ctx = chartElement.getContext('2d');
//
// const chartOptions = {
//     responsive: true,
//     plugins: {
//         title: {
//             display: true
//         },
//         legend: {
//             display: false
//         },
//     },
//     scales: {
//         x: {
//             title: {
//                 display: true,
//                 text: 'Leeftijd (maanden)',
//             },
//             min: 0,
//             max: 15,
//             ticks: {
//                 autoSkip: false,
//                 callback: function (value) {
//                     if (Number.isInteger(value * 0.5)) {
//                         return value * 0.5;
//                     }
//                 }
//             }
//         },
//         y: {
//             title: {
//                 display: true
//             },
//             min: 0,
//             max: 100,
//             position: 'left',
//             ticks: {
//                 autoSkip: false,
//                 stepSize: 1
//             }
//         }
//     },
// };
//
//
// function updateChartData(type, data, maxRange) {
//     highlightTab(type);
//
//     chartOptions.plugins.title.text = `${type} 0-15 maanden`;
//     chartOptions.scales.y.title.text = type === 'Lengte' ? 'Lengte (cm)' : 'Gewicht (kg)';
//     chartOptions.scales.y.max = maxRange;
//
//     if (window.myGrowChart) {
//         window.myGrowChart.destroy();
//     }
//     window.myGrowChart = new Chart(ctx, {
//         type: 'line',
//         data: data,
//         options: chartOptions
//     });
// }
//
// function fetchDataAndRenderChart(type) {
//     fetch('../../assets/grow.json').then(response => response.json())
//         .then(growData => {
//             const months = Array.from({length: 31}, (_, i) => i * 0.5);
//             const userValues = months.map(month => {
//                 const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
//                 return record ? parseFloat(record[type]) : null;
//             });
//
//             const datasets = [{
//                 label: `Gebruikerswaarden ${type}`,
//                 data: userValues,
//                 borderColor: 'black',
//                 backgroundColor: 'black',
//                 spanGaps: true,
//                 fill: false
//             }];
//
//             const data = {
//                 labels: months,
//                 datasets: datasets
//             };
//
//             // Define the max range based on whether it's length or weight
//             const maxRange = type === 'Lengte' ? 92 : 10;
//
//             updateChartData(type, data, maxRange);
//         })
//         .catch(error => {
//             console.error(`Error loading ${type} data:`, error);
//         });
// }
//
// function renderChartWithLengthData() {
//     fetchDataAndRenderChart('Lengte');
// }
//
// function renderChartWithWeightData() {
//     fetchDataAndRenderChart('Gewicht');
// }
//
// function highlightTab(tabName) {
//     document.querySelectorAll('.tab').forEach(tab => {
//         tab.classList.remove('selected');
//         if (tab.textContent === tabName) {
//             tab.classList.add('selected');
//         }
//     });
// }
//
// document.addEventListener('DOMContentLoaded', renderChartWithLengthData);




// Promise.all([
//     fetch('../../assets/grow.json').then(response => response.json()),
//     fetch('../../assets/tno.json').then(response => response.json())
// ]).then(([growData, tnoData]) => {
//
//     const months = Array.from({length: 31}, (_, i) => i * 0.5);
//
//     const userValues = months.map(month => {
//         const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
//         return record ? parseFloat(record.Lengte) : null;
//     });
//     tnoData.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
//
//     const datasets = valueRanges.map((range, index) => ({
//         label: range,
//         data: months.map(month => {
//             const record = tnoData.find(d => parseFloat(d.StapNummer) === month);
//             return record ? parseFloat(record[range]) : null;
//         }),
//         borderColor: lineColors[index % lineColors.length],
//         borderWidth: lineWidth[index % lineWidth.length],
//         backgroundColor: 'rgba(222,236,220,0.55)',
//         fill: fills[index % fills.length],
//         pointRadius: 0,
//         pointHitRadius: 0,
//     }));
//     datasets.unshift({
//         label: 'Gebruikerswaarden',
//         data: userValues,
//         borderColor: 'black',
//         backgroundColor: 'black',
//         spanGaps: true,
//     });
//
//     const ctx = document.getElementById('growChartJs').getContext('2d');
//     const config = {
//         type: 'line',
//         data: {
//             labels: months,
//             datasets: datasets
//         },
//         // plugins: [annotationPlugin],
//         options: {
//             responsive: true,
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Lengte-Leeftijd 0-15 maanden',
//                 },
//                 legend: {
//                     display: false
//                 },
//                 // TODO: labels position x 31 and y 85 etc. in graph with graph line [+2.5, +2, +1, 0, -1, -2, -2.5, -3]
//                 autocolors: false,
//                 // annotation: {
//                 //     annotations: {
//                 //         label1: {
//                 //             type: 'label',
//                 //             xValue: 2.5,
//                 //             yValue: 60,
//                 //             backgroundColor: 'rgba(245,245,245)',
//                 //             content: ['This is my text', 'This is my text, second line'],
//                 //             font: {
//                 //                 size: 18
//                 //             }
//                 //         }
//                 //     }
//                 // }
//             },
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Leeftijd (maanden)',
//                     },
//                     min: 0,
//                     max: 15,
//                     ticks: {
//                         autoSkip: false,
//                         callback: function (value) {
//                             if (Number.isInteger(value * 0.5)) {
//                                 return value * 0.5;
//                             }
//                         }
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Lengte (cm)',
//                     },
//                     min: 40,
//                     max: 92,
//                     position: 'left',
//                     ticks: {
//                         autoSkip: false,
//                         stepSize: 2
//                     }
//                 },
//                 yRight: {
//                     min: 40,
//                     max: 92,
//                     position: 'right',
//                     grid: {
//                         drawOnChartArea: false,
//                     },
//                     ticks: {
//                         autoSkip: false,
//                         stepSize: 2
//                     }
//                 },
//             },
//         },
//     };
//     // lineConfigurations.forEach(config => {
//     //     const seriesData = processTnoData(tnoData, config.valueKey);
//     //     const lastDataPoint = getLastDataPoint(seriesData);
//     //
//     //     chartConfig.options.plugins.annotation.annotations[config.name] = {
//     //         type: 'label',
//     //         yValue: lastDataPoint.y,
//     //         content: config.name,
//     //         backgroundColor: '#a1c2a3',
//     //         opacity: 0, // Chart.js ondersteunt mogelijk geen directe opacity-instelling voor annotaties
//     //         // Je moet misschien de alpha waarde in de backgroundColor gebruiken
//     //     };
//     // });
//
//     new Chart(ctx, config);
// }).catch(error => {
//     console.error('Error loading data:', error);
// });
//

// const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
// const fills = [false, false, '+1', '+1', '+1', '+1', false, false];
// const lineWidth = [2, 2, 2, 2, 3];
//
// async function fetchData(url) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch data from ${url}`);
//     }
//     return response.json();
// }
//
// async function loadData() {
//     try {
//         const [growData, tnoData] = await Promise.all([
//             fetchData('../../assets/grow.json'),
//             fetchData('../../assets/tno.json'),
//         ]);
//
//         const months = Array.from({ length: 31 }, (_, i) => i * 0.5);
//
//         const userValues = months.map((month) => {
//             const record = growData.find((d) => parseFloat(d.LeeftijdInMaanden) === month);
//             return record ? parseFloat(record.Lengte) : null;
//         });
//
//         tnoData.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
//
//         const valueRanges = [
//             'ValueMin30',
//             'ValueMin25',
//             'ValueMin20',
//             'ValueMin10',
//             'Value0',
//             'ValuePlus10',
//             'ValuePlus20',
//             'ValuePlus25',
//         ];
//
//         const datasets = valueRanges.map((range, index) => ({
//             label: range,
//             data: months.map((month) => {
//                 const record = tnoData.find((d) => parseFloat(d.StapNummer) === month);
//                 return record ? parseFloat(record[range]) : null;
//             }),
//             borderColor: lineColors[index % lineColors.length],
//             borderWidth: lineWidth[index % lineWidth.length],
//             backgroundColor: 'rgba(222,236,220,0.55)',
//             fill: fills[index % fills.length],
//             pointRadius: 0,
//             pointHitRadius: 0,
//         }));
//
//         datasets.unshift({
//             label: 'Gebruikerswaarden',
//             data: userValues,
//             borderColor: 'black',
//             backgroundColor: 'black',
//             fill: false,
//         });
//
//         const ctx = document.getElementById('growChartJs').getContext('2d');
//         const config = {
//             type: 'line',
//             data: {
//                 labels: months,
//                 datasets: datasets,
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Lengte-Leeftijd 0-15 maanden',
//                     },
//                     legend: {
//                         display: false,
//                     },
//                     autocolors: false,
//                     annotation: {
//                         annotations: {
//                             label1: {
//                                 type: 'label',
//                                 xValue: 3.5,
//                                 yValue: 60,
//                                 backgroundColor: 'rgba(245,245,245)',
//                                 content: ['This is', 'This is my text, second line'],
//                                 font: {
//                                     size: 18,
//                                 },
//                             },
//                         },
//                     },
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Leeftijd (maanden)',
//                         },
//                         min: 0,
//                         max: 15,
//                         ticks: {
//                             autoSkip: false,
//                             callback: (value) => (Number.isInteger(value * 0.5) ? value * 0.5 : ''),
//                         },
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Lengte (cm)',
//                         },
//                         min: 40,
//                         max: 92,
//                         position: 'left',
//                         ticks: {
//                             autoSkip: false,
//                             stepSize: 2,
//                         },
//                     },
//                     yRight: {
//                         min: 40,
//                         max: 92,
//                         position: 'right',
//                         grid: {
//                             drawOnChartArea: false,
//                         },
//                         ticks: {
//                             autoSkip: false,
//                             stepSize: 2,
//                         },
//                     },
//                 },
//             },
//         };
//
//         new Chart(ctx, config);
//     } catch (error) {
//         console.error('Error loading data:', error);
//     }
// }
//
// loadData();
