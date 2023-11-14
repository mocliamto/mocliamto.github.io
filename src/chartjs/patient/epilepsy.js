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

    // Configuring the charts
    const seizureConfig = {
    type: 'bar',
    data: seizureData,
    options: { scales: { y: { beginAtZero: true } } }
};

    const medicationConfig = {
    type: 'line',
    data: medicationData,
    options: { scales: { y: { beginAtZero: true } } }
};

    // Creating the charts
    new Chart(document.getElementById('seizureChart'), seizureConfig);
    new Chart(document.getElementById('medicationChart'), medicationConfig);

// // Save the HTML content to a file
// html_file_path = '/mnt/data/epilepsy_monitoring_graph.html'
// with open(html_file_path, 'w') as file:
//     file.write(html_template)
//
// html_file_path
