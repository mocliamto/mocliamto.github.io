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

const medicationData = {
    labels: [' ', ' ', ' ', ' '],
    datasets: [{
        label: 'Medicatie (mg)',
        data: [200, 400, 600, 800],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

const pddData = {
    labels: [' ', ' ', ' ', ' '],
    datasets: [{
        label: 'PDD (mg)',
        data: [300, 200, 400],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }, {
        label: 'DDD (mg)',
        data: [250, 250, 500],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    }]
};

const labResultsData = {
    labels: [' ', ' ', ' ', ' '],
    datasets: [{
        label: 'Labuitslag',
        data: [1.2, 1.5, 1.3, 1.4],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }]
};

const seizureConfig = {
    type: 'bar',
    data: seizureData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'Aanvalsregistratie'}},
        scales: {y: {beginAtZero: true}}
    }
};

const medicationConfig = {
    type: 'line',
    data: medicationData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'Medicatie'}},
        scales: {y: {beginAtZero: true}}}
};

const pddConfig = {
    type: 'line',
    data: pddData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'PDD/DDD'}},
        scales: {y: {beginAtZero: true}}}
};

const labResultsConfig = {
    type: 'line',
    data: labResultsData,
    options: {
        responsive: true, plugins: {title: {display: true, text: 'Labuitslagen en ketonen'}},
        scales: {y: {beginAtZero: true}}}
};

// Creating the charts
new Chart(document.getElementById('seizureChart'), seizureConfig);
new Chart(document.getElementById('medicationChart'), medicationConfig);
new Chart(document.getElementById('pddChart'), pddConfig);
new Chart(document.getElementById('labResultssChart'), labResultsConfig);
