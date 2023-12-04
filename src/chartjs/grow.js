async function fetchDataIfNeeded(url, key) {
    if (!window[key]) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        window[key] = await response.json();
    }
    return window[key];
}

async function renderChart(chartType) {
    highlightTab(chartType);
    try {
        const growData = await fetchDataIfNeeded('../assets/grow.json', 'growData');
        const additionalData = chartType === 'Lengte' ? await fetchDataIfNeeded('../assets/tno.json', 'tnoData')
            : await fetchDataIfNeeded('../assets/tnoWeight.json', 'tnoWeightData');
        const chartData = processChartData(growData, additionalData, chartType);
        createOrUpdateChart(chartData, chartType);
        updateChartDisplay(chartType);
    } catch (error) {
        console.error(`Error loading ${chartType.toLowerCase()} data:`, error);
    }
}

function updateChartDisplay(chartType) {
    document.getElementById('lengteChartJs').style.display = chartType === 'Lengte' ? 'block' : 'none';
    document.getElementById('gewichtChartJs').style.display = chartType === 'Gewicht' ? 'block' : 'none';
}

function createOrUpdateChart(chartData, chartType) {
    const chartId = `${chartType.toLowerCase()}ChartJs`;
    const ctx = document.getElementById(chartId).getContext('2d');
    if (window[`my${chartType}Chart`]) {
        window[`my${chartType}Chart`].destroy();
    }
    window[`my${chartType}Chart`] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        plugins: [ChartDataLabels],
        options: {
            ...getChartOptions(chartType),
            plugins: {
                ...getChartOptions(chartType).plugins,
                datalabels: {
                    display: function (context) {
                        return context.dataIndex === context.dataset.data.length - 1;
                    },
                }
            }
        }
    });
}

function setupChartButtons() {
    document.getElementById('Lengte').addEventListener('click', () => setChartTypeAndRender('Lengte'));
    document.getElementById('Gewicht').addEventListener('click', () => setChartTypeAndRender('Gewicht'));
}

function setChartTypeAndRender(chartType) {
    renderChart(chartType);
    localStorage.setItem('lastChartType', chartType);
}

function getLastChartType() {
    return localStorage.getItem('lastChartType') || 'Lengte';
}

document.addEventListener('DOMContentLoaded', () => {
    setupChartButtons();
    setupPrintChartButton();
    renderChart(getLastChartType());
});

function highlightTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('selected',
        tab.textContent === tabName));
}

function setupPrintChartButton() {
    document.getElementById('printChartBtn').addEventListener('click', printChart);
}

function printChart() {
    const parent = this.parentElement.parentElement;
    const activeTab = parent.querySelector("input:checked").value.toLowerCase();
    const chartCanvas = document.getElementById(`${activeTab.toLowerCase()}ChartJs`);

    if (chartCanvas) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${activeTab} grafiek</title>
                </head>
                <body>
                    <img src="${chartCanvas.toDataURL()}" style="width:100%; height:auto;">
                    <script type="text/javascript">
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    } else {
        console.error(`No chart found for the active tab: ${activeTab}`);
    }
}

function processChartData(growData, additionalData, chartType) {
    const months = Array.from({ length: 31 }, (_, i) => i * 0.5);
    const userValues = months.map(month => {
        const record = growData.find(d => parseFloat(d.LeeftijdInMaanden) === month);
        return record ? parseFloat(record[chartType === 'Gewicht' ? 'Gewicht' : 'Lengte']) : null;
    });

    const datasets = [{
        label: `Ingevoerde ${chartType.toLowerCase()} waarde`,
        data: userValues,
        borderColor: 'black',
        backgroundColor: 'black',
        spanGaps: true,
        fill: false
    }];

    const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
    const fills = [false, false, '+1', '+1', '+1', '+1', false, false];
    const lineWidth = [2, 2, 2, 2, 3];
    const labelMapping = {
        'ValueMin30': '-3',
        'ValueMin25': '-2,5',
        'ValueMin20': '-2',
        'ValueMin10': '-1',
        'Value0': '0',
        'ValuePlus10': '+1',
        'ValuePlus20': '+2',
        'ValuePlus25': '+2,5'
    };
    additionalData.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
    const valueRanges = ['ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10', 'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'];

    datasets.push(...valueRanges.map((range, index) => ({
        label: range,
        data: months.map(month => {
            const record = additionalData.find(d => parseFloat(d.StapNummer) === month);
            return record ? parseFloat(record[range]) : null;
        }),
        borderColor: lineColors[index % lineColors.length],
        borderWidth: lineWidth[index % lineWidth.length],
        backgroundColor: 'rgba(222,236,220,0.55)',
        fill: fills[index % fills.length],
        pointRadius: 0,
        pointHitRadius: 0,
    })));

    datasets.forEach(dataset => {
        const label = labelMapping[dataset.label];
        if (label) {
            dataset.datalabels = {
                formatter: function () {
                    return label;
                },
                color: 'black',
                backgroundColor: 'transparent',
                align: 'right',
                anchor: 'start',
                offset: -33,
                display: function (context) {
                    return context.dataIndex === context.dataset.data.length - 1;
                },
                font: {
                    size: 12,
                }
            };
        }
    });
    return {
        labels: months.map(month => month.toString()),
        datasets: datasets
    };
}

function getChartOptions(chartType) {
    return {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `${chartType}-Leeftijd 0-15 maanden`,
            },
            legend: {
                display: false
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Leeftijd (maanden)',
                },
                min: 0,
                max: 31,
                ticks: {
                    autoSkip: false,
                    callback: function (value) {
                        if (Number.isInteger(value * 0.5)) {
                            return value * 0.5;
                        }
                    },
                }
            },
            y: {
                title: {
                    display: true,
                    text: chartType === 'Gewicht' ? 'Gewicht (kg)' : 'Lengte (cm)',
                },
                min: chartType === 'Gewicht' ? 0 : 40,
                max: chartType === 'Gewicht' ? 16 : 92,
                position: 'left',
                ticks: {
                    autoSkip: false,
                    stepSize: chartType === 'Gewicht' ? 1 : 2
                }
            },
            yRight: {
                min: chartType === 'Gewicht' ? 0 : 40,
                max: chartType === 'Gewicht' ? 16 : 92,
                position: 'right',
                ticks: {
                    autoSkip: false,
                    stepSize: chartType === 'Gewicht' ? 1 : 2
                }
            }
        },
        layout: {
            padding: {
                right: 10
            }
        },
    };
}
