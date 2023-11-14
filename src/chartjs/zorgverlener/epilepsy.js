// Seizure Record Data
const seizureData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
        label: 'Number of Seizures',
        data: [3, 2, 5, 1],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

// Medication Data
const medicationData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
        label: 'Dosage (mg)',
        data: [300, 350, 320, 310],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

// PDD/DDD Data
const pddData = {
    labels: ['Drug A', 'Drug B', 'Drug C'],
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

// Lab Results Data
const labResultsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
        label: 'Lab Value',
        data: [1.2, 1.5, 1.3, 1.4],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }]
};

// Configuring the charts
const seizureConfig = {
    type: 'line',
    data: seizureData,
    options: { scales: { y: { beginAtZero: true } } }
};

const medicationConfig = {
    type: 'bar',
    data: medicationData,
    options: { scales: { y: { beginAtZero: true } } }
};

const pddConfig = {
    type: 'bar',
    data: pddData,
    options: { scales: { y: { beginAtZero: true } } }
};

const labResultsConfig = {
    type: 'line',
    data: labResultsData,
    options: { scales: { y: { beginAtZero: true } } }
};

// Creating the charts
new Chart(document.getElementById('seizureChart'), seizureConfig);
new Chart(document.getElementById('medicationChart'), medicationConfig);
new Chart(document.getElementById('pddChart'), pddConfig);
new Chart(document.getElementById('labResultssChart'), labResultsConfig);

// // Save the HTML content to a file
// html_file_path = '/mnt/data/epilepsy_monitoring_graph.html'
// with open(html_file_path, 'w') as file:
//     file.write(html_template)
//
// html_file_path

