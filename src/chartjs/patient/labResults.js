const ctx = document.getElementById('labResultsChart');

const data = {
    labels: [
        'Label 1',
        'Label 2',
        'Label 3',
        'Label 4',
        'Label 5',
        'Label 6',
        'Label 7'
    ],
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        data: [12, 19, 3, 5, 2, 3, 10],
    }, {
        label: 'My Second dataset',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        data: [8, 15, 6, 8, 5, 9, 15],
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Labuitslagen',
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        },
    },
};

new Chart(ctx, config);
