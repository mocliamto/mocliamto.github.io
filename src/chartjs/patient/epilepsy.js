// Seizure Record Data
const seizureData = {
    labels: [' ', ' ', ' ', ' '],
    datasets: [{
        label: 'Aanvalsregistratie',
        data: [3, 2, 5, 1],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

// Medication Data
const medicationData = {
    labels: [' ', ' ', ' ', ' '],
    datasets: [{
        label: 'Dosage (mg)',
        data: [200, 400, 600, 800],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

// Configuring the charts
const seizureConfig = {
    type: 'bar',
    data: seizureData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'Aanvalsregistratie'}},
        scales: {y: {beginAtZero: true}}}
};

const medicationConfig = {
    type: 'line',
    data: medicationData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'Medicatie'}},
        scales: {y: {beginAtZero: true}}}
};

// Creating the charts
new Chart(document.getElementById('seizureChart'), seizureConfig);
new Chart(document.getElementById('medicationChart'), medicationConfig);

