function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

fetch('../../assets/lab.json')
    .then(response => response.json())
    .then(data => {
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
                    fill: false
                }, {
                    label: 'GRENSVAL Laag',
                    data: grensvalLowData,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 235, 160, 0.5)',
                    pointRadius: 0,
                    pointHitRadius: 0,
                    fill: '+1'  // Fill to next dataset
                }, {
                    label: 'GRENSVAL Hoog',
                    data: grensvalHighData,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 235, 160, 0.5)',
                    pointRadius: 0,
                    pointHitRadius: 0,
                    fill: false
                }]
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
                                day: 'MMM dd, yyyy',
                                hour: 'MMM dd, yyyy, HH:mm',
                            }
                        },
                        title: {
                            display: true,
                        }
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
    })
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });
