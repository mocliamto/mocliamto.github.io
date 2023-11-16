function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

fetch('../../assets/lab.json')
    .then(response => response.json())
    .then(data => {
        // Sort data by DateTime from oldest to newest
        data.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));

        // Process data
        const labels = data.map(entry => entry.DateTime);
        const uitslagData = data.map(entry => Number(entry.UITSLAG));
        const grensvalData = data.map(entry => parseGrensvalRange(entry.GRENSVAL));

        // Split grensvalData into low and high for the area
        const grensvalLowData = grensvalData.map(range => range[0]);
        const grensvalHighData = grensvalData.map(range => range[1]);

        // Create the chart
        const ctx = document.getElementById('labChart').getContext('2d');
        const labChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'UITSLAG',
                    data: uitslagData,
                    borderColor: 'red',
                    fill: false,
                    tension: 0.1 // For smooth curves
                }, {
                    label: 'Normaal waarde laag',
                    data: grensvalLowData,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 235, 160, 0.5)',
                    fill: '+1', // Fill to next dataset
                    tension: 0.1 // For smooth curves
                }, {
                    label: 'Normaal waarde hoog',
                    data: grensvalHighData,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 235, 160, 0.5)',
                    fill: false,
                    tension: 0.1 // For smooth curves
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            parser: 'YYYY-MM-DDTHH:mm:ss',
                            unit: 'day',
                            tooltipFormat: 'll HH:mm'
                        },
                        title: {
                            display: true,
                            text: 'Date and Time'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        display: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });