function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

fetch('../assets/data/lab.json')
    .then(response => response.json())
    .then(data => {
        const dates = data.map(entry => new Date(entry.DateTime));
        const uitslagData = data.map(entry => Number(entry.UITSLAG));
        const grensvalRanges = data.map(entry => parseGrensvalRange(entry.GRENSVAL));

        const grensvalLowData = grensvalRanges.map(range => range[0]);
        const grensvalHighData = grensvalRanges.map(range => range[1]);

        const series = [{
            name: 'Uitslag',
            type: 'line',
            data: uitslagData.map((value, index) => ({
                x: dates[index],
                y: value
            }))
        }, {
            name: 'Referentiewaarde Hoog',
            type: 'line',
            data: grensvalHighData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: true
        }, {
            name: 'Referentiewaarde Laag',
            type: 'line',
            data: grensvalLowData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: true
        }];

        const optionsMainChart = {
            chart: {
                type: 'line',
                height: 350,
                id: 'chart2',
            },
            series: series,
            // colors: ['#030303', '#45c0f5', '#5ac95a'],
            xaxis: {
                type: 'datetime',
            },
            yaxis: {
                title: {
                    text: 'Glucose(POCT) mmol/L'
                },
                tickAmount: 6,
                // forceNiceScale: true,
                // decimalsInFloat: 0,
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy HH:mm'
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [4, 2, 2]
            }
        };

        const chart = new ApexCharts(document.querySelector("#labChart"), optionsMainChart);
        chart.render();

        const optionsLineChart = {
            series: [{
                data: series[0].data
            }],
            chart: {
                id: 'chart1',
                height: 150,
                type: 'area',
                brush: {
                    target: 'chart2',
                    enabled: true,
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        // min: new Date(dates[0]).getTime(),
                        // max: new Date(dates[dates.length - 1]).getTime()
                        min: new Date('19 Jun 2017').getTime(),
                        max: new Date('26 Feb 2023').getTime()
                    }
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#0998f1'],
            xaxis: {
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
            yaxis: {
                tickAmount: 4,
                forceNiceScale: true,
                decimalsInFloat: 0,
            }
        };

        const chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLineChart);
        chartLine.render();
    })
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });


//
// let currentStartDate = new Date();
// let maxDate;
//
// function parseGrensvalRange(grensval) {
//     return grensval.split('-').map(Number);
// }
//
// function loadNext5Years() {
//     if (!currentStartDate) {
//         console.error('Current start date is not set.');
//         return;
//     }
//     currentStartDate.setFullYear(currentStartDate.getFullYear() + 5); // Update currentStartDate
//     fetchLabData(currentStartDate);
// }
//
// function loadPrevious5Years() {
//     if (!currentStartDate) {
//         console.error('Current start date is not set.');
//         return;
//     }
//     currentStartDate.setFullYear(currentStartDate.getFullYear() - 5); // Update currentStartDate
//     fetchLabData(currentStartDate);
// }
//
// function createChart() {
//     const loadNextButton = document.createElement('button');
//     loadNextButton.textContent = '5 Years ->';
//     loadNextButton.addEventListener('click', loadNext5Years);
//
//     const loadPreviousButton = document.createElement('button');
//     loadPreviousButton.textContent = '<- 5 Years';
//     loadPreviousButton.addEventListener('click', loadPrevious5Years);
//
//     const labChartContainer = document.querySelector('#labChart');
//     labChartContainer.appendChild(loadPreviousButton);
//     labChartContainer.appendChild(loadNextButton);
//
//     const optionsLineChart = {
//         series: [{
//             data: series[0].data
//         }],
//         chart: {
//             id: 'chart1',
//             height: 150,
//             type: 'area',
//             brush: {
//                 target: 'chart2',
//                 enabled: true,
//             },
//             selection: {
//                 enabled: true,
//                 xaxis: {
//                     min: maxDate.setFullYear(maxDate.getFullYear() - 5),
//                     max: maxDate.getTime()
//                 }
//             },
//         },
//         dataLabels: {
//             enabled: false
//         },
//         colors: ['#0998f1'],
//         xaxis: {
//             type: 'datetime',
//             tooltip: {
//                 enabled: true
//             }
//         },
//         yaxis: {
//             tickAmount: 4,
//         }
//     };
//
//     const chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLineChart);
//     chartLine.render();
// }
//
// function fetchLabData(startDate) {
//     if (!startDate) {
//         console.error('Start date is not set.');
//         return;
//     }
//
//     const endDate = new Date(startDate);
//     endDate.setFullYear(endDate.getFullYear() + 5);
//
//     fetch('../assets/data/lab.json')
//         .then(response => response.json())
//         .then(data => {
//             data.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
//
//             maxDate = new Date(Math.max.apply(null, data.map(entry => new Date(entry.DateTime))));
//             const filteredData = data.filter(entry => {
//                 const entryDate = new Date(entry.DateTime);
//                 return entryDate >= startDate && entryDate < endDate;
//             });
//
//             processData(filteredData);
//             createChart();
//         })
//         .catch(handleError);
// }
//
// function handleError(error) {
//     console.error('Error:', error);
// }
//
// function processData(data) {
//     const dates = data.map(entry => new Date(entry.DateTime));
//     const uitslagData = data.map(entry => Number(entry.UITSLAG));
//     const grensvalRanges = data.map(entry => parseGrensvalRange(entry.GRENSVAL));
//
//     const grensvalLowData = grensvalRanges.map(range => range[0]);
//     const grensvalHighData = grensvalRanges.map(range => range[1]);
//
//     const series = [{
//         name: 'Uitslag',
//         type: 'line',
//         data: uitslagData.map((value, index) => ({
//             x: dates[index],
//             y: value
//         }))
//     }, {
//         name: 'Referentiewaarde Hoog',
//         type: 'line',
//         data: grensvalHighData.map((value, index) => ({
//             x: dates[index],
//             y: value
//         })),
//         fill: true
//     }, {
//         name: 'Referentiewaarde Laag',
//         type: 'line',
//         data: grensvalLowData.map((value, index) => ({
//             x: dates[index],
//             y: value
//         })),
//         fill: true
//     }];
//
//     const optionsMainChart = {
//         chart: {
//             type: 'line',
//             height: 350,
//             id: 'chart2',
//         },
//         series: series,
//         // colors: ['#030303', '#45c0f5', '#5ac95a'],
//         xaxis: {
//             type: 'datetime',
//         },
//         yaxis: {
//             title: {
//                 text: 'Glucose(POCT) mmol/L'
//             },
//             tickAmount: 6,
//         },
//         tooltip: {
//             x: {
//                 format: 'dd MMM yyyy HH:mm'
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             width: [4, 2, 2]
//         }
//     };
//
//     const chart = new ApexCharts(document.querySelector("#labChart"), optionsMainChart);
//     chart.render();
//
//     const maxDate = new Date(Math.max.apply(null, data.map(entry => new Date(entry.DateTime))));
//
//     const optionsLineChart = {
//         series: [{
//             data: series[0].data
//         }],
//         chart: {
//             id: 'chart1',
//             height: 150,
//             type: 'area',
//             brush: {
//                 target: 'chart2',
//                 enabled: true,
//             },
//             selection: {
//                 enabled: true,
//                 xaxis: {
//                     min: maxDate.setFullYear(maxDate.getFullYear() - 5),
//                     max: maxDate.getTime()
//                 }
//             },
//         },
//         dataLabels: {
//             enabled: false
//         },
//         colors: ['#0998f1'],
//         xaxis: {
//             type: 'datetime',
//             tooltip: {
//                 enabled: true
//             }
//         },
//         yaxis: {
//             tickAmount: 4,
//         }
//     };
//
//     const chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLineChart);
//     chartLine.render();
//
//     chartLine.updateSeries([{
//         data: series[0].data
//     }]);
// }
//
// createChart();
//
// fetchLabData(currentStartDate);