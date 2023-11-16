function parseGrensvalRange(grensval) {
    return grensval.split('-').map(Number);
}

fetch('../../assets/lab.json')
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
            name: 'Hoog waarde',
            type: 'line',
            borderColor: 'orange',
            data: grensvalHighData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: false
        }, {
            name: 'Laag waarde',
            type: 'line',
            borderColor: 'orange',
            data: grensvalLowData.map((value, index) => ({
                x: dates[index],
                y: value
            })),
            fill: '+1'
        }];

        const optionsMainChart = {
            chart: {
                type: 'line',
                height: '100%',
                id: 'chart2'
            },
            series: series,
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                title: {
                    text: 'mmol/L'
                }
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy HH:mm'
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0,
                    opacityTo: 0.5
                }
            },
            stroke: {
                width: [3, 2, 2]
            },
            title: {
                text: 'Labuitslag Glucose (POCT)'
            }
        };

        const chart = new ApexCharts(document.querySelector("#labChart"), optionsMainChart);
        chart.render();

        const seriesLineChart = [{
            data: series[0].data
        }];

        const optionsLineChart = {
            series: seriesLineChart,
            chart: {
                id: 'chart1',
                height: 130,
                type: 'area',
                brush: {
                    target: 'chart2',
                    enabled: true
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        min: new Date(dates[0]).getTime(),
                        max: new Date(dates[dates.length - 1]).getTime()
                    }
                },
            },
            colors: ['#008FFB'],
            xaxis: {
                type: 'datetime',
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                tickAmount: 2
            }
        };

        const chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLineChart);
        chartLine.render();
    })
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });