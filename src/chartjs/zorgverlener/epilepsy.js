fetch('../../assets/epilepsy.json')
    .then(response => response.json())
    .then(data => {
        const aanvalsregistratieData = {
            labels: data.Aanvalsregistratie
                .sort((a, b) => new Date(a.datum) - new Date(b.datum))
                .map(entry => entry.datum),
            datasets: [{
                label: 'Aanvalsregistratie',
                data: data.Aanvalsregistratie.map(item => item.aantal),
                backgroundColor: 'rgb(246,187,200)',
            }]
        };

        const medicatieData = {
            labels: data.Medicatie
                .sort((a, b) => new Date(a.datum) - new Date(b.datum))
                .map(entry => entry.datum),
            datasets: [{
                label: 'Medicatie (mg)',
                data: data.Medicatie.map(item => item.dosis),
                fill: false,
                borderColor: 'rgba(54, 162, 235, 1)',
            }]
        };

        const pddDddData = {
            labels: data.PDD_DDD
                .sort((a, b) => new Date(a.datum) - new Date(b.datum))
                .map(entry => entry.datum),
            datasets: [{
                label: 'PDD/DDD (mg)',
                data: data.PDD_DDD.map(item => item.PDD_DDD_waarde),
                borderColor: 'rgb(177,238,153)',
                fill: false,
            }]
        };

        const labKetonenData = {
            labels: data.Labuitslagen_en_ketonen
                .sort((a, b) => new Date(a.datum) - new Date(b.datum))
                .map(entry => entry.datum),
            datasets: [{
                label: 'Labuitslagen en ketonen',
                data: data.Labuitslagen_en_ketonen.map(item => item.ketonen_mmol_l),
                fill: false,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
            }]
        }

        const chartOptions = {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'YY-MM-DD HH:mm',
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
            }
        };

        new Chart(document.getElementById('seizureChart'), {
            type: 'bar',
            data: aanvalsregistratieData,
            options: chartOptions
        });

        new Chart(document.getElementById('medicationChart'), {
            type: 'line',
            data: medicatieData,
            options: chartOptions
        });
        new Chart(document.getElementById('pddChart'), {
            type: 'line',
            data: pddDddData,
            options: chartOptions
        });
        new Chart(document.getElementById('labResultssChart'), {
            type: 'line',
            data: labKetonenData,
            options: chartOptions
        });
    })
    .catch(error => {
        console.error("Error fetching the data: ", error);
    });


// const seizureConfig = {
//     type: 'bar',
//     data: seizureData,
//     options: {
//         responsive: true, plugins: {title: {display: true, text: 'Aanvalsregistratie'}},
//         scales: {y: {beginAtZero: true}}
//     }
// };
//
// const medicationConfig = {
//     type: 'line',
//     data: medicationData,
//     options: {
//         responsive: true, plugins: {title: {display: true, text: 'Medicatie'}},
//         scales: {y: {beginAtZero: true}}}
// };
//
// const pddConfig = {
//     type: 'line',
//     data: pddData,
//     options: {
//         responsive: true, plugins: {title: {display: true, text: 'PDD/DDD'}},
//         scales: {y: {beginAtZero: true}}}
// };
//
// const labResultsConfig = {
//     type: 'line',
//     data: labResultsData,
//     options: {
//         responsive: true, plugins: {title: {display: true, text: 'Labuitslagen en ketonen'}},
//         scales: {y: {beginAtZero: true}}}
// };
//
// // Creating the charts
// new Chart(document.getElementById('seizureChart'), seizureConfig);
// new Chart(document.getElementById('medicationChart'), medicationConfig);
// new Chart(document.getElementById('pddChart'), pddConfig);
// new Chart(document.getElementById('labResultssChart'), labResultsConfig);
