// Function to process grow data
function processGrowData(data) {
    const sortedData = data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden);
    return sortedData.map(item => [item.LeeftijdInMaanden, item.Lengte]);
}

// Function to process TNO data
function processTnoData(data, valueKey) {
    const sortedData = data.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
    return sortedData.map(item => [parseFloat(item.StapNummer), parseFloat(item[valueKey])]);
}

// Function to fetch data
function fetchData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(`Error fetching data from ${url}: `, error));
}

// Fetch both datasets in parallel
Promise.all([fetchData('../../assets/grow.json'), fetchData('../../assets/tno.json')])
    .then(([growData, tnoData]) => {
        if (!growData || !tnoData) {
            throw new Error('One or more datasets could not be loaded');
        }

        // Process grow data
        const processedGrowData = processGrowData(growData);

        // Define TNO series names
        const tnoSeriesNames = ['ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10', 'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'];

        // Create chart options
        const options = {
            series: [
                {
                    name: 'Lengte Grow',
                    data: processedGrowData,
                    type: 'area'
                },
                ...tnoSeriesNames.map(valueKey => ({
                    name: `Lengte TNO ${valueKey}`,
                    data: processTnoData(tnoData, valueKey),
                    type: 'line'
                }))
            ],
            chart: {
                type: 'line',
                height: 350,
                stacked: true,
                events: {
                    selection: function (chart, e) {
                        console.log(new Date(e.xaxis.min));
                    }
                },
            },
            colors: ['#ef0606', 'green', 'blue', 'yellow', 'purple', 'cyan', 'orange', 'pink'], // Different colors for each TNO series
            dataLabels: {
                enabled: false,
            },
            title: {
                text: 'Groeigrafiek 0 - 15 maanden',
                align: 'left'
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.8,
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left'
            },
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Leeftijd in Maanden'
                }
            },
            yaxis: {
                type: 'numeric',
                title: {
                    text: 'Lengte in cm'
                }
            },
        };

        // Initialize chart
        const chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    })
    .catch(error => {
        console.error('Error in processing data: ', error);
    });

// /*Lengte + leeftijd in maanden */
//
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


/* overige later misschien nodig
* */
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

/** lengte + Datetime
 */
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
