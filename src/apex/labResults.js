var data = [
    [1486684800000, 34],
    [1486771200000, 43],
    [1486857600000, 31],
    [1486944000000, 43],
    [1487030400000, 33],
    [1487116800000, 52]
];

var options = {
    series: [{
        data: data
    }],
    chart: {
        id: 'chart2',
        type: 'line',
        height: 230,
        toolbar: {
            autoSelected: 'pan',
            show: false
        }
    },
    colors: ['#546E7A'],
    stroke: {
        curve: 'smooth',
        width: 3
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        opacity: 1,
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'datetime'
    }
};

var chart = new ApexCharts(document.querySelector("#lab-chart-line2"), options);
chart.render();

var optionsLine = {
    series: [{
        data: data
    }],
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
                min: new Date('19 Jun 2017').getTime(),
                max: new Date('14 Aug 2017').getTime()
            }
        },
    },
    colors: ['#008FFB'],
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
        }
    },
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

var chartLine = new ApexCharts(document.querySelector("#lab-chart-line"), optionsLine);
chartLine.render();