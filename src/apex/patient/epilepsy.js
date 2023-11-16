function generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = baseval;
        var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000; // adding one day in milliseconds
        i++;
    }
    return series;
}

var options = { chart: {} };

var chart = new ApexCharts(document.querySelector("#epi-chart-line"), options);
chart.render();

var optionsLine2 = {
    series: [{
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 30
        })
    }],
    chart: {
        id: 'tw',
        group: 'social',
        type: 'line',
        height: 300
    },
    title: {
        text: 'Aanvalsregistratie',
        align: 'left'
    },
    colors: ['#546E7A'],
    stroke: {
        curve: 'smooth',
        width: 3
    }
};

var chartLine2 = new ApexCharts(document.querySelector("#epi-chart-line2"), optionsLine2);
chartLine2.render();

var optionsArea = {
    series: [{
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 60
        })
    }],
    chart: {
        id: 'yt',
        group: 'social',
        type: 'area',
        height: 300
    },
    title: {
        text: 'Medicatie',
        align: 'left'
    },
    colors: ['#00E396'],
    stroke: {
        curve: 'smooth',
        width: 3
    }
};

var chartArea = new ApexCharts(document.querySelector("#epi-chart-area"), optionsArea);
chartArea.render();
