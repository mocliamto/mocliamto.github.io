/*Lengte + leeftijd in maanden */

function processGrowData(data) {
    const sortedData = data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden);
    return sortedData.map(item => [item.LeeftijdInMaanden, item.Lengte]);
}

fetch('../../assets/grow.json')
    .then(response => response.json())
    .then(growData => {
        const referenceDate = '2018-01-01';

        var options = {
            series: [
                {
                    name: 'Lengte',
                    data: processGrowData(growData, referenceDate)
                },
            ],
            chart: {
                type: 'area',
                height: 350,
                stacked: true,
                events: {
                    selection: function (chart, e) {
                        console.log(new Date(e.xaxis.min));
                    }
                },
            },

            colors: ['#b5e6d1', '#CED4DC', '#b5e6d1'],
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
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    })
    .catch(error => {
        console.error('Fout bij het ophalen van de gegevens: ', error);
    });

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
