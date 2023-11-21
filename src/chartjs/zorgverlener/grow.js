const lineColors = ['#41be8c', '#41be8c', '#66c9a1', '#1bb275', '#0b650b', '#41be8c', '#41be8c', '#5ac95a', 'black'];

Promise.all([
    fetch('../../assets/grow.json').then(response => response.json()),
    fetch('../../assets/tno.json').then(response => response.json())
]).then(([growData, tnoData]) => {

    const months = Array.from({length: 31}, (_, i) => i * 0.5);

    const userValues = months.map(month => {
        const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
        return record ? parseFloat(record.Lengte) : null;
    });

    tnoData.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));

    const datasets = valueRanges.map((range, index) => ({
        label: `${index}: ${range}`,
        // label: range,
        data: months.map(month => {
            const record = tnoData.find(d => parseFloat(d.StapNummer) === month);
            return record ? parseFloat(record[range]) : null;
        }),
        borderColor: lineColors[index % lineColors.length],
        backgroundColor: lineColors[index % lineColors.length],
        fill: false,
        pointRadius: 0,
        pointHitRadius: 0,
    }));

    datasets.unshift({
        label: 'Gebruikerswaarden',
        data: userValues,
        borderColor: lineColors[lineColors.length - 1],
        backgroundColor: lineColors[lineColors.length - 1],
        fill: false,
    });

    const ctx = document.getElementById('growChartJs').getContext('2d');
    const config = {
        type: 'line',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Groeigrafiek 0-15 maanden',
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Leeftijd (maanden)',
                    },
                    min: 0,
                    max: 15,
                    ticks: {
                        autoSkip: false,
                        callback: function (value) {
                            if (Number.isInteger(value * 0.5)) {
                                return value * 0.5;
                            }
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Lengte (cm)',
                    },
                    min: 40,
                    max: 92,
                    position: 'left',
                    ticks: {
                        autoSkip: false,
                        stepSize: 2
                    }
                },
                yRight: {
                    min: 40,
                    max: 92,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        autoSkip: false,
                        stepSize: 2
                    }
                },
            },
        },
    };
    new Chart(ctx, config);
}).catch(error => {
    console.error('Error loading data:', error);
});

const valueRanges = [
    'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
    'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
];