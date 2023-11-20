function processGrowData(data) {
    return data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden)
        .map(item => ({x: item.LeeftijdInMaanden, y: item.Lengte}));
}

function processTnoData(data, valueKey) {
    return data.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer))
        .map(item => ({x: parseFloat(item.StapNummer), y: parseFloat(item[valueKey])}));
}

// Fetch data (assuming you have a similar setup)
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}: `, error);
        throw error;
    }
}

async function initializeChart() {
    try {
        const [growData, tnoData] = await Promise.all([
            fetchData('../../assets/grow1-15.json'),
            fetchData('../../assets/tno.json')
        ]);

        const processedGrowData = processGrowData(growData);

        const lineConfigurations = [
            {name: '-3', valueKey: 'ValueMin30'},
            {name: '-2,5', valueKey: 'ValueMin25'},
            {name: '-2', valueKey: 'ValueMin20'},
            {name: '-1', valueKey: 'ValueMin10'},
            {name: '0', valueKey: 'Value0'},
            {name: '+1', valueKey: 'ValuePlus10'},
            {name: '+2', valueKey: 'ValuePlus20'},
            {name: '+2,5', valueKey: 'ValuePlus25'},
        ];

        const lines = lineConfigurations.map(config => ({
            label: config.name,
            data: processTnoData(tnoData, config.valueKey),
            borderColor: ['#83fa62', 'green', '#5ac95a', '#6eee5a', 'rgba(161,243,149,0.59)', 'green', 'rgba(157,252,136,0.73)', '#5ac95a', '#ef0606'],
            fill: false
        }));

        const ctx = document.getElementById('growChartJs').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Gemeten waarde',
                        data: processedGrowData,
                        borderColor: '#ef0606',
                        fill: false
                    },
                    ...lines
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Leeftijd in Maanden'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Lengte in cm'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error in initializing chart: ', error);
    }
}

initializeChart();

// const months = Array.from({length: 16}, (_, i) => i); // Leeftijden in maanden (0-15)
//
// function processTnoData(data, valueKey) {
//     return data
//         .sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer))
//         .map(item => {
//         return {
//             x: parseFloat(item.StapNummer),
//             y: parseFloat(item[valueKey])
//         };
//     });
// }
// function fetchData(url) {
//     return fetch(url)
//         .then(response => response.json())
//         .catch(error => console.error(`Error fetching data from ${url}: `, error));
// }
// function getLastDataPoint(seriesData) {
//     return seriesData[seriesData.length - 1];
// }
// Promise.all([fetchData('../../assets/grow1-15.json'), fetchData('../../assets/tno.json')])
//     .then(([growData, tnoData]) => {
//         if (!growData || !tnoData) {
//             throw new Error('One or more datasets could not be loaded');
//         }
//
//         const userValues = months.map(month => {
//             const record = growData.find(d => d.LeeftijdInMaanden === month);
//             return record ? record.Lengte : null;
//         });
//
//         const lineConfigurations = [
//             {name: '-3', valueKey: 'ValueMin30'},
//             {name: '-2,5', valueKey: 'ValueMin25'},
//             {name: '-2', valueKey: 'ValueMin20'},
//             {name: '-1', valueKey: 'ValueMin10'},
//             {name: '0', valueKey: 'Value0'},
//             {name: '+1', valueKey: 'ValuePlus10'},
//             {name: '+2', valueKey: 'ValuePlus20'},
//             {name: '+2,5', valueKey: 'ValuePlus25'},
//         ];
//
//         const lineColors = ['#83fa62', 'green', '#5ac95a', '#6eee5a', 'rgba(161,243,149,0.59)', 'green', 'rgba(157,252,136,0.73)', '#5ac95a', '#ef0606']
//
//         const ctx = document.getElementById('growChartJs').getContext('2d');
//
//         const config = {
//             type: 'line',
//             data: {
//                 labels: months,
//                 datasets: [
//                     {
//                         label: 'Gebruikerswaarden',
//                         data: userValues,
//                         borderColor: 'rgba(255, 99, 132, 1)',
//                         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                         fill: false,
//                     },
//                     ...lineConfigurations.map((config, index) => ({
//                         label: config.name,
//                         data: processTnoData(tnoData, config.valueKey),
//                         borderColor: lineColors[index],
//                         backgroundColor: 'rgba(0, 0, 0, 0)', // transparent
//                         fill: false,
//                     }))
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Groeigrafiek 0-15 maanden',
//                     },
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Leeftijd (maanden)',
//                         },
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Lengte (cm)',
//                         },
//                     },
//                 },
//             },
//         };
//
//         new Chart(ctx, config);
//         lineConfigurations.forEach(config => {
//             const seriesData = processTnoData(tnoData, config.valueKey);
//             const lastDataPoint = getLastDataPoint(seriesData);
//             chart.addYaxisAnnotation({
//                 y: lastDataPoint[1],
//                 label: {
//                     text: config.name,
//                     style: {
//                         background: '#a1c2a3'
//                     }
//                 },
//                 opacity: 0
//             });
//         });
//     })
//     .catch(error => console.error('Error in processing data: ', error));



// fetch('../../assets/grow1-15.json')
//     .then(response => response.json())
//     .then(data => {
//         const userValues = months.map(month => {
//             const record = data.find(d => d.LeeftijdInMaanden === month);
//             return record ? record.Lengte : null;
//         });
//
//         const tnoValues = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92];
//         const HighTnoValues = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92];
//
//         const ctx = document.getElementById('growChartJs').getContext('2d');
//
//         const config = {
//             type: 'line',
//             data: {
//                 labels: months,
//                 datasets: [
//                     {
//                         label: 'Gebruikerswaarden',
//                         data: userValues,
//                         borderColor: 'rgba(255, 99, 132, 1)',
//                         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                         fill: false,
//                     },
//                     {
//                         label: 'Laag Referentiewaarden TNO',
//                         data: tnoValues,
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Hoog Referentiewaarden TNO',
//                         data: HighTnoValues,
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                         fill: true,
//                     }
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Groeigrafiek 0-15 maanden',
//                     },
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Leeftijd (maanden)',
//                         },
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Lengte (cm)',
//                         },
//                     },
//                 },
//             },
//         };
//
//         new Chart(ctx, config);
//     })
//     .catch(error => console.error('Error loading user values:', error));

