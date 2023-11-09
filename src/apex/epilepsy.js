// var options = {
//     series: [{
//         data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
//             min: 10,
//             max: 60
//         })
//     }],
//     chart: {
//         id: 'fb',
//         group: 'social',
//         type: 'line',
//         height: 160
//     },
//     colors: ['#008FFB'],
//     stroke: {
//         curve: 'smooth',
//         width: 3
//     }
// };

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
    colors: ['#00E396'],
    stroke: {
        curve: 'smooth',
        width: 3
    }
};

var chartArea = new ApexCharts(document.querySelector("#epi-chart-area"), optionsArea);
chartArea.render();

var optionsSmall = {
    series: [{
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 60
        })
    }],
    chart: {
        id: 'ig',
        group: 'social',
        type: 'area',
        height: 300
    },
    colors: ['#008FFB'],
    stroke: {
        curve: 'smooth',
        width: 3
    }
};

var chartSmall = new ApexCharts(document.querySelector("#epi-chart-small"), optionsSmall);
chartSmall.render();

var optionsSmall2 = {
    series: [{
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 30
        })
    }],
    chart: {
        id: 'li',
        group: 'social',
        type: 'area',
        height: 300
    },
    colors: ['#546E7A'],
    stroke: {
        curve: 'smooth',
        width: 3
    }
};

var chartSmall2 = new ApexCharts(document.querySelector("#epi-chart-small2"), optionsSmall2);
chartSmall2.render();
