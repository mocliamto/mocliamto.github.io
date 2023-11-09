// import { initLabCharts } from './src/apex/labResults.js';
// import { initGrowCharts } from './src/apex/grow.js';
//
// // Fetch data from a JSON file
// async function fetchJsonData(path) {
//     try {
//         const response = await fetch(path);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(`Error loading ${path}:`, error);
//         return []; // Return an empty array as a fallback
//     }
// }

// fetch('assets/grow.json')
//     .then(response => response.json())
//     .then(data => {
//         const labels = data.map(entry => entry.timestamp);
//         const values = data.map(entry => entry.value);
//
//         const ctx = document.getElementById('grow-chart-js').getContext('2d');
//         const growChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Growth',
//                     data: values,
//                     fill: false,
//                     borderColor: 'rgb(75, 192, 192)',
//                     tension: 0.1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error loading the data:', error));
//
// fetch('assets/lab.json')
//     .then(response => response.json())
//     .then(data => {
//         const labels = data.map(entry => entry.timestamp);
//         const values = data.map(entry => entry.value);
//
//         const ctx = document.getElementById('lab-results-chart').getContext('2d');
//         const growChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Lab',
//                     data: values,
//                     fill: false,
//                     borderColor: 'rgb(75, 192, 192)',
//                     tension: 0.1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error loading the data:', error));



// // Format the fetched data
// function formatLabData(labData) {
//     return labData.map(item => {
//         return [new Date(item.DateTime).getTime(), parseFloat(item.UITSLAG)];
//     });
// }
//
// function formatGrowData(growData) {
//    return growData.map(item => {
//         return {
//             date: new Date(item.DateTime).getTime(),
//             length: item.Lengte,
//             weight: item.Gewicht,
//             ageInMonths: item.LeeftijdInMaanden
//         };
//     });
// }
//
// // Main function to load data and initialize charts
// async function loadDataAndInitializeCharts() {
//     // Fetch and format lab data
//     const labData = await fetchJsonData('assets/lab.json');
//     const formattedLabData = formatLabData(labData);
//
//     // Initialize the lab charts with the formatted lab data
//     initLabCharts(formattedLabData);
//
//     // Fetch and format grow data
//     const growData = await fetchJsonData('assets/grow.json');
//     const formattedGrowData = formatGrowData(growData);
//
//     initGrowCharts(formattedGrowData);
// }
//
// // load the data and initialize the charts
// loadDataAndInitializeCharts();