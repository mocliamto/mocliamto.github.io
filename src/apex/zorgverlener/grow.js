function processGrowData(data) {
    const sortedData = data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden);
    return sortedData.map(item => [item.LeeftijdInMaanden, item.Lengte]);
}

function processTnoData(data, valueKey) {
    const sortedData = data.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
    return sortedData.map(item => [parseFloat(item.StapNummer), parseFloat(item[valueKey])]);
}

function fetchData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(`Error fetching data from ${url}: `, error));
}

function getLastDataPoint(seriesData) {
    return seriesData[seriesData.length - 1];
}

Promise.all([fetchData('../../assets/grow1-15.json'), fetchData('../../assets/tno.json')])
    .then(([growData, tnoData]) => {
        if (!growData || !tnoData) {
            throw new Error('One or more datasets could not be loaded');
        }

        const processedGrowData = processGrowData(growData);

        const lineConfigurations = [
            { name: '-3', valueKey: 'ValueMin30' },
            { name: '-2,5', valueKey: 'ValueMin25' },
            { name: '-2', valueKey: 'ValueMin20' },
            { name: '-1', valueKey: 'ValueMin10' },
            { name: '0', valueKey: 'Value0' },
            { name: '+1', valueKey: 'ValuePlus10' },
            { name: '+2', valueKey: 'ValuePlus20' },
            { name: '+2,5', valueKey: 'ValuePlus25' },
        ];

        const lines = lineConfigurations.map(config => ({
            name: config.name,
            data: processTnoData(tnoData, config.valueKey),
            type: 'line',
        }));
        const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];;

        const options = {
            series: [
                {
                    name: 'Gemeten waarde',
                    data: processedGrowData,
                    type: 'line',
                },
                ...lines.map((line, index) => ({
                    name: line.name,
                    data: line.data,
                    type: 'line',
                    color: lineColors[index % lineColors.length],
                }))
            ],
            chart: {},
            stroke: {
                curve: 'smooth',
                width: 3
            },
            legend: {
                show: false
            },
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Leeftijd (maanden)',
                },
                min: 0,
                max: 15,
                ticks: {
                    autoSkip: false,
                    stepSize: 1
                },
            },
            yaxis: {
                type: 'numeric',
                title: {
                    text: 'Lengte (cm)',
                },
                min: 40,
                max: 92,
                position: 'left',
                ticks: {
                    autoSkip: false,
                    stepSize: 2
                },
            },

            annotations: {
                // yaxis: [],
            },
        };

        const chart = new ApexCharts(document.querySelector("#growChart"), options);
        chart.render();

        lineConfigurations.forEach(config => {
            const seriesData = processTnoData(tnoData, config.valueKey);
            const lastDataPoint = getLastDataPoint(seriesData);
            chart.addYaxisAnnotation({
                y: lastDataPoint[1],
                label: {
                    text: config.name,
                    style: {
                        background: '#a1c2a3'
                    }
                },
                opacity: 0
            });
        });
    }
    )
    .catch(error => {
        console.error('Error in processing data: ', error);
    });
/** lengte + leeftijd in maanden */
// function processGrowData(data) {
//     const sortedData = data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden);
//     return sortedData.map(item => [item.LeeftijdInMaanden, item.Lengte]);
// }
//
// function processTnoData(data, valueKey) {
//     const sortedData = data.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
//     return sortedData.map(item => [parseFloat(item.StapNummer), parseFloat(item[valueKey])]);
// }
//
// fetch('../../assets/grow.json')
//     .then(response => response.json())
//     .then(growData => {
//         // Process the first dataset
//         const processedGrowData = processGrowData(growData);
//
//         fetch('../../assets/tno.json')
//             .then(response => response.json())
//             .then(tnoData => {
//                 // Create a series for each value in the TNO dataset
//                 var tnoSeries = ['ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10', 'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'].map(valueKey => {
//                     return {
//                         name: 'Lengte TNO ' + valueKey,
//                         data: processTnoData(tnoData, valueKey),
//                         type: 'area'
//                     };
//                 });
//
//                 var options = {
//                     series: [
//                         {
//                             name: 'Lengte Grow',
//                             data: processedGrowData
//                         },
//                         {
//                             name: '-3',
//                             data: processTnoData(tnoData, 'ValueMin30'),
//                             type: 'line',
//                         },
//                         {
//                             name: '-2,5',
//                             data: processTnoData(tnoData, 'ValueMin25'),
//                             type: 'line',
//                         },
//                         {
//                             name: '-2',
//                             data: processTnoData(tnoData, 'ValueMin20'),
//                             type: 'line',
//                         },
//                         {
//                             name: '-1',
//                             data: processTnoData(tnoData, 'ValueMin10'),
//                             type: 'line',
//                         },
//                         {
//                             name: '0',
//                             data: processTnoData(tnoData, 'Value0'),
//                             type: 'line',
//                         },
//                         {
//                             name: '+1',
//                             data: processTnoData(tnoData, 'ValuePlus10'),
//                             type: 'line',
//                         },
//                         {
//                             name: '+2',
//                             data: processTnoData(tnoData, 'ValuePlus20'),
//                             type: 'line',
//                         },
//                         {
//                             name: '+2,5',
//                             data: processTnoData(tnoData, 'ValuePlus25'),
//                             type: 'line',
//                         },
//                     ],
//                     chart: {
//                         type: 'line',
//                         height: 350,
//                         stacked: true,
//                         events: {
//                             selection: function (chart, e) {
//                                 console.log(new Date(e.xaxis.min));
//                             }
//                         },
//                     },
//                     colors: ['#ef0606', 'green', 'blue', 'yellow', 'purple', 'cyan', 'orange', 'pink'], // Different colors for each TNO series
//                     dataLabels: {
//                         enabled: false,
//                     },
//                     title: {
//                         text: 'Groeigrafiek 0 - 15 maanden',
//                         align: 'left'
//                     },
//                     stroke: {
//                         curve: 'smooth',
//                         width: 3
//                     },
//                     fill: {
//                         type: 'gradient',
//                         gradient: {
//                             opacityFrom: 0.6,
//                             opacityTo: 0.8,
//                         }
//                     },
//                     legend: {
//                         position: 'top',
//                         horizontalAlign: 'left'
//                     },
//                     xaxis: {
//                         type: 'numeric',
//                         title: {
//                             text: 'Leeftijd in Maanden'
//                         }
//                     },
//                     yaxis: {
//                         type: 'numeric',
//                         title: {
//                             text: 'Lengte in cm'
//                         }
//                     },
//                 };
//                 var chart = new ApexCharts(document.querySelector("#chart"), options);
//                 chart.render();
//             })
//             .catch(error => {
//                 console.error('Fout bij het ophalen van de TNO-gegevens: ', error);
//             });
//     })
//     .catch(error => {
//         console.error('Fout bij het ophalen van de grow-gegevens: ', error);
//     });


/** overige later misschien nodig */
// function calculateAgeInMonths(dateTime, referenceDate) {
//     const birthDate = new Date(referenceDate);
//     const date = new Date(dateTime);
//     let months;
//     months = (date.getFullYear() - birthDate.getFullYear()) * 12;
//     months -= birthDate.getMonth();
//     months += date.getMonth();
//     return months <= 0 ? 0 : months;
// }

// function processGrowData(data, referenceDate) {
//     const sortedData = data.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
//     return sortedData.map(item => {
//         return [
//             calculateAgeInMonths(item.DateTime, referenceDate),
//             item.Lengte
//         ];
//     });
// }

/** lengte + Datetime */
// function processGrowData(data) {
//     const sortedData = data.sort((a, b) => {
//         return new Date(a.DateTime) - new Date(b.DateTime);
//     });
//     return sortedData.map(item => {
//         return [
//             new Date(item.DateTime).getTime(), // Zet de datum om in milliseconden
//             item.Lengte
//         ];
//     });
// }
// fetch('../../assets/grow.json')
//     .then(response => response.json())
//     .then(growData => {
//
//         var options = {
//             series: [
//                 {
//                     name: 'Lengte',
//                     data: processGrowData(growData)
//                 },
//             ],
//             chart: {
//                 type: 'area',
//                 height: 350,
//                 stacked: true,
//                 events: {
//                     selection: function (chart, e) {
//                         console.log(new Date(e.xaxis.min));
//                     }
//                 },
//             },
//             colors: ['#b5e6d1', '#CED4DC', '#b5e6d1'],
//             dataLabels: {
//                 enabled: false,
//             },
//             title: {
//                 text: 'Groeigrafiek 0 - 15 maanden',
//                 align: 'left'
//             },
//             stroke: {
//                 curve: 'smooth',
//                 width: 3
//             },
//             fill: {
//                 type: 'gradient',
//                 gradient: {
//                     opacityFrom: 0.6,
//                     opacityTo: 0.8,
//                 }
//             },
//             legend: {
//                 position: 'top',
//                 horizontalAlign: 'left'
//             },
//             xaxis: {
//                 type: 'datetime'
//             },
//         };
//
//         var chart = new ApexCharts(document.querySelector("#chart"), options);
//         chart.render();
//     })
//     .catch(error => {
//         console.error('Fout bij het ophalen van de gegevens: ', error);
//     });
