function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

fetch('../assets/data/lab.json')
    .then(response => response.json())
    .then(data => {
        const dates = data.map(entry => new Date(entry.DateTime));
        const uitslagData = data.map(entry => Number(entry.UITSLAG));
        const grensvalRanges = data.map(entry => parseGrensvalRange(entry.GRENSVAL));

        const grensvalLowData = grensvalRanges.map(range => range[0]);
        const grensvalHighData = grensvalRanges.map(range => range[1]);

        const series = [{
            name: 'Uitslag',
            type: 'line',
            data: uitslagData.map((value, index) => ({
                x: dates[index],
                y: value
            }))
        }, {
            name: 'Referentiewaarde Hoog',
            type: 'line',
            data: grensvalHighData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: true
        }, {
            name: 'Referentiewaarde Laag',
            type: 'line',
            data: grensvalLowData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: true
        }];

        const optionsMainChart = {
            chart: {
                type: 'line',
                height: 350,
                id: 'chart2',
            },
            series: series,
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
                },
            },
            yaxis: {
                title: {
                    text: 'Glucose(POCT) mmol/L',
                },
                tickAmount: 6,
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy HH:mm',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [4, 2, 2],
            }
        };

        const chart = new ApexCharts(document.querySelector("#labChart"), optionsMainChart);
        chart.render();

        const optionsLineChart = {
            series: [{
                data: series[0].data
            }],
            chart: {
                id: 'chart1',
                height: 150,
                type: 'area',
                brush: {
                    target: 'chart2',
                    enabled: true,
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        min: new Date('07 Jun 2017').getTime(),
                        max: new Date('01 Mar 2023').getTime()
                    }
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#0998f1'],
            xaxis: {
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
            yaxis: {
                tickAmount: 4,
                forceNiceScale: true,
                decimalsInFloat: 0,
            }
        };

        const chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLineChart);
        chartLine.render();

    })
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });