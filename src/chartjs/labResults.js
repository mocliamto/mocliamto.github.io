// let globalData;
// let labChart;
// const datasetsPerPage = 10;
// let currentPage = 0;
//
// function parseGrensvalRange(grensval) {
//     return grensval.split('-').map(Number);
// }
//
// function updateChart() {
//     const startIndex = currentPage * datasetsPerPage;
//     const endIndex = startIndex + datasetsPerPage;
//     const slicedData = globalData.slice(startIndex, endIndex);
//     updateLabChart(slicedData);
// }
//
// function goToNextPage() {
//     const maxPages = Math.ceil(globalData.length / datasetsPerPage) - 1;
//     currentPage = Math.min(maxPages, currentPage + 1);
//     updateChart();
// }
//
// function goToPreviousPage() {
//     currentPage = Math.max(0, currentPage - 1);
//     updateChart();
// }
//
// function updateLabChart(data) {
//     const labels = data.map(entry => entry.DateTime);
//     const extractData = (key) => data.map(entry => Number(parseGrensvalRange(entry[key])[0]));
//
//     labChart.data.labels = labels;
//     labChart.data.datasets[0].data = data.map(entry => Number(entry.UITSLAG));
//     labChart.data.datasets[1].data = extractData('GRENSVAL');
//     labChart.data.datasets[2].data = extractData('GRENSVAL');
//
//     labChart.update();
// }
//
// function fetchData() {
//     return fetch('../assets/data/lab.json')
//         .then(response => response.json())
//         .then(data => {
//             globalData = data;
//             processChartData();
//         })
//         .catch(error => {
//             console.error('Error fetching the lab data:', error);
//         });
// }
//
// function processChartData() {
//     globalData.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
//     currentPage = 0;
//     updateChart();
// }
//
// document.addEventListener("DOMContentLoaded", function () {
//     const ctx = document.getElementById('labChartJs').getContext('2d');
//     labChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: [], // Initialize labels as an empty array
//             datasets: [{
//                 label: 'UITSLAG',
//                 data: [],
//                 borderColor: 'red',
//                 fill: false
//             }, {
//                 label: 'Referentiewaarde Laag',
//                 data: [],
//                 borderColor: 'orange',
//                 backgroundColor: 'rgba(255, 235, 160, 0.5)',
//                 pointRadius: 0,
//                 pointHitRadius: 0,
//                 fill: '+1'
//             }, {
//                 label: 'Referentiewaarde Hoog',
//                 data: [],
//                 borderColor: 'orange',
//                 backgroundColor: 'rgba(255, 235, 160, 0.5)',
//                 pointRadius: 0,
//                 pointHitRadius: 0,
//                 fill: false
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         parser: 'yyyy-MM-dd\'T\'HH:mm:ss',
//                         unit: 'day',
//                         tooltipFormat: 'PPPp',
//                         displayFormats: {
//                             day: 'dd-MM-yyyy',
//                             hour: 'dd-MM-yyyy HH:mm',
//                         }
//                     },
//                     title: {
//                         display: true,
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Glucose(POCT) mmol/L'
//                     }
//                 }
//             }
//         }
//     });
//
//     document.getElementById('nextPageBtn').addEventListener('click', goToNextPage);
//     document.getElementById('prevPageBtn').addEventListener('click', goToPreviousPage);
//
//     fetchData().then(() => {
//         if (globalData) {
//             const labels = globalData.map(entry => entry.DateTime);
//             const uitslagData = data.map(entry => Number(entry.UITSLAG));
//             const grensvalData = globalData.map(entry => parseGrensvalRange(entry.GRENSVAL));
//             const grensvalLowData = grensvalData.map(range => range[0]);
//             const grensvalHighData = grensvalData.map(range => range[1]);
//
//             labChart.data.labels = labels;
//             labChart.data.datasets[0].data = uitslagData;
//             labChart.data.datasets[1].data = grensvalLowData;
//             labChart.data.datasets[2].data = grensvalHighData;
//
//             labChart.update();
//         }
//     });
// });

// function setDefaultDateValues() {
//     const mostRecentDate = new Date(Math.max(...data.map(entry => new Date(entry.DateTime))));
//     const endDateInput = document.getElementById('endDate');
//     endDateInput.valueAsDate = mostRecentDate;
//
//     const defaultStartDate = new Date(mostRecentDate);
//     defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
//     const startDateInput = document.getElementById('startDate');
//     startDateInput.valueAsDate = defaultStartDate;
//
//     updateChartData();
// }
//
// function populateYearDropdown() {
//     const yearSelect = document.getElementById('yearSelect');
//     const uniqueYears = [...new Set(data.map(entry => new Date(entry.DateTime).getFullYear()))];
//
//     uniqueYears.forEach(year => {
//         const option = document.createElement('option');
//         option.value = year;
//         option.text = year;
//         yearSelect.add(option);
//     });
//
//     const currentYear = new Date().getFullYear();
//     yearSelect.value = currentYear;
// }
//
// function parseGrensvalRange(grensval) {
//     return grensval.split('-').map(Number);
// }
//
// const itemsPerPage = 12;
// let currentPage = 1;
// let data;
// let labChart;
//
// function fetchDataAndRender() {
//     fetch('../assets/data/lab.json')
//         .then(response => response.json())
//         .then(allData => {
//             data = allData;
//             populateYearDropdown();
//             setDefaultDateValues();
//             updateChartData();
//
//             document.getElementById('startDate').addEventListener('change', updateChartData);
//             document.getElementById('endDate').addEventListener('change', updateChartData);
//         })
//         .catch(error => {
//             console.error('Error fetching the lab data:', error);
//         });
// }
//
// function updateChartData() {
//     const startDate = document.getElementById('startDate').valueAsDate;
//     const endDate = document.getElementById('endDate').valueAsDate;
//
//     const filteredData = data.filter(entry => {
//         const entryDate = new Date(entry.DateTime);
//         return entryDate >= startDate && entryDate <= endDate;
//     });
//
//     const labels = filteredData.map(entry => entry.DateTime);
//     const uitslagData = filteredData.map(entry => Number(entry.UITSLAG));
//     const grensvalData = filteredData.map(entry => parseGrensvalRange(entry.GRENSVAL));
//     const grensvalLowData = grensvalData.map(range => range[0]);
//     const grensvalHighData = grensvalData.map(range => range[1]);
//
//     if (labChart) {
//         labChart.destroy();
//     }
//
//     const ctx = document.getElementById('labChartJs').getContext('2d');
//     labChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: 'UITSLAG',
//                     data: uitslagData,
//                     borderColor: 'black',
//                     fill: false
//                 },
//                 {
//                     label: 'Referentiewaarde Laag',
//                     data: grensvalLowData,
//                     borderColor: 'rgba(2,42,243,0.73)',
//                     backgroundColor: 'rgba(68,68,63,0.16)',
//                     pointRadius: 0,
//                     pointHitRadius: 0,
//                     fill: '+1'
//                 },
//                 {
//                     label: 'Referentiewaarde Hoog',
//                     data: grensvalHighData,
//                     borderColor: 'rgba(255,2,2,0.63)',
//                     pointRadius: 0,
//                     pointHitRadius: 0,
//                     fill: false
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         parser: 'yyyy-MM-dd\'T\'HH:mm:ss',
//                         unit: 'day',
//                         tooltipFormat: 'PPPp',
//                         displayFormats: {
//                             day: 'dd-MM-yyyy',
//                             hour: 'dd-MM-yyyy HH:mm',
//                         }
//                     },
//                     title: {
//                         display: true,
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Glucose(POCT) mmol/L'
//                     }
//                 }
//             }
//         }
//     });
//     document.getElementById('currentPage').textContent = currentPage;
//     document.getElementById('startDate').addEventListener('change', updateChartData);
//     document.getElementById('endDate').addEventListener('change', updateChartData);
// }
//
// function changePage(delta) {
//     currentPage += delta;
//     if (currentPage < 1) {
//         currentPage = 1;
//     } else if (currentPage > Math.ceil(data.length / itemsPerPage)) {
//         currentPage = Math.ceil(data.length / itemsPerPage);
//     }
//
//     updateChartData();
// }
//
// fetchDataAndRender();

// function parseGrensvalRange(grensval) {
//     return grensval.split('-').map(Number);
// }
//
// let chartData = [];
// let currentPage = 1;
// const itemsPerPage = 10;
//
// function updateChart() {
//     const startDate = document.getElementById('startDate').value;
//     const endDate = document.getElementById('endDate').value;
//
//     const filteredData = chartData.filter(entry => {
//         const entryDate = new Date(entry.DateTime);
//         return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
//     });
//
//     updateChartWithData(filteredData);
//     currentPage = 1;
//     updatePagination();
// }
//
// function previousPage() {
//     if (currentPage > 1) {
//         currentPage--;
//         updatePagination();
//         updateChartPage();
//     }
// }
//
// function nextPage() {
//     const totalPages = Math.ceil(chartData.length / itemsPerPage);
//     if (currentPage < totalPages) {
//         currentPage++;
//         updatePagination();
//         updateChartPage();
//     }
// }
//
// function updateChartWithData(data) {
//     if (labChart) {
//         labChart.destroy();
//     }
//
//     const latestGrensval = parseGrensvalRange(data[data.length - 1].GRENSVAL);
//
//     const labels = data.map(entry => entry.DateTime);
//     const uitslagData = data.map(entry => Number(entry.UITSLAG));
//
//     const grensvalLowData = Array(labels.length).fill(latestGrensval[0]);
//     const grensvalHighData = Array(labels.length).fill(latestGrensval[1]);
//
//     const ctx = document.getElementById('labChartJs').getContext('2d');
//
//     labChart = new Chart(ctx, {
//
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'UITSLAG',
//                 data: uitslagData,
//                 borderColor: 'black',
//                 fill: false
//             }, {
//                 label: 'Referentiewaarde Laag',
//                 data: grensvalLowData,
//                 borderColor: 'rgba(2,42,243,0.73)',
//                 backgroundColor: 'rgba(68,68,63,0.16)',
//                 pointRadius: 0,
//                 pointHitRadius: 0,
//                 fill: '+1'
//             }, {
//                 label: 'Referentiewaarde Hoog',
//                 data: grensvalHighData,
//                 borderColor: 'rgba(255,2,2,0.63)',
//                 pointRadius: 0,
//                 pointHitRadius: 0,
//                 fill: false
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         parser: 'yyyy-MM-dd\'T\'HH:mm:ss',
//                         unit: 'day',
//                         tooltipFormat: 'PPPp',
//                         displayFormats: {
//                             day: 'dd-MM-yyyy',
//                             hour: 'dd-MM-yyyy HH:mm',
//                         }
//                     },
//                     title: {
//                         display: true,
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Glucose(POCT) mmol/L'
//                     }
//                 }
//             }
//         }
//     });
//     labChart.update();
// }
//
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('prevButton').addEventListener('click', previousPage);
//     document.getElementById('nextButton').addEventListener('click', nextPage);
// });
//
// function updatePagination() {
//     const totalPages = Math.ceil(chartData.length / itemsPerPage);
//     document.getElementById('currentPage').textContent = `Page ${currentPage} of ${totalPages}`;
// }
//
// function updateChartPage() {
//     const endDate = document.getElementById('endDate').value;
//
//     const latestDate = new Date(chartData[chartData.length - 1].DateTime);
//     const defaultStartDate = `${latestDate.getFullYear()}-${(latestDate.getMonth() + 1).toString().padStart(2, '0')}-${latestDate.getDate().toString().padStart(2, '0')}`;
//
//     document.getElementById('startDate').value = defaultStartDate;
//
//     const startDate = document.getElementById('startDate').value;
//     const filteredData = chartData.filter(entry => {
//         const entryDate = new Date(entry.DateTime);
//         return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
//     });
//
//     updateChartWithData(filteredData);
//     currentPage = 1;
//     updatePagination();
// }
//
// function toggleLoader(show) {
//     const loader = document.querySelector('.loader');
//     loader.style.display = show ? 'block' : 'none';
// }
//
// toggleLoader(true);
// fetch('../assets/data/lab.json')
//     .then(response => response.json())
//     .then(data => {
//         chartData = data;
//         chartData.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
//         updateChartWithData(chartData);
//         updatePagination();
//     })
//     .catch(error => {
//         console.error('Error fetching the lab data:', error);
//     })
//     .finally(() => {
//         toggleLoader(false);
//     });

function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

async function fetchAndProcessLabData() {
    try {
        const response = await fetch('../assets/data/lab.json');
        const data = await response.json();

        data.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
        const latestGrensval = parseGrensvalRange(data[data.length - 1].GRENSVAL);

        const labels = data.map(entry => entry.DateTime);
        const uitslagData = data.map(entry => Number(entry.UITSLAG));

        const grensvalLowData = Array(labels.length).fill(latestGrensval[0]);
        const grensvalHighData = Array(labels.length).fill(latestGrensval[1]);

        configureAndCreateChart(labels, uitslagData, grensvalLowData, grensvalHighData);

    } catch (error) {
        console.error('Error fetching or processing the lab data:', error);
    }
}

function configureAndCreateChart(labels, uitslagData, grensvalLowData, grensvalHighData) {
    const ctx = document.getElementById('labChartJs').getContext('2d');

    const labChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'UITSLAG',
                    data: uitslagData,
                    borderColor: 'black',
                    fill: false
                },
                {
                    label: 'Referentiewaarde Laag',
                    data: grensvalLowData,
                    borderColor: 'rgba(2,42,243,0.73)',
                    backgroundColor: 'rgba(68,68,63,0.16)',
                    pointRadius: 0,
                    pointHitRadius: 0,
                    fill: '+1'
                },
                {
                    label: 'Referentiewaarde Hoog',
                    data: grensvalHighData,
                    borderColor: 'rgba(255,2,2,0.63)',
                    pointRadius: 0,
                    pointHitRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'yyyy-MM-dd\'T\'HH:mm:ss',
                        unit: 'day',
                        tooltipFormat: 'PPPp',
                        displayFormats: {
                            day: 'dd-MM-yyyy',
                            hour: 'dd-MM-yyyy HH:mm',
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Glucose(POCT) mmol/L'
                    }
                }
            }
        }
    });
}

fetchAndProcessLabData();

