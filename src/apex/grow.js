let chart;
let chartWrapper = document.getElementById('growChart');

function processGrowData(data) {
    const sortedData = data.sort((a, b) => a.LeeftijdInMaanden - b.LeeftijdInMaanden);
    return sortedData.map(item => [item.LeeftijdInMaanden, item.Lengte]);
}

function processTnoData(data, valueKey) {
    const sortedData = data.sort((a, b) => parseFloat(a.StapNummer) - parseFloat(b.StapNummer));
    return sortedData.map(item => [parseFloat(item.StapNummer), parseFloat(item[valueKey])]);
}

function fetchData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(`Error fetching data from ${url}: `, error));
}

function getLastDataPoint(seriesData) {
    return seriesData[seriesData.length - 1];
}



Promise.all([fetchData('../assets/data/grow.json'), fetchData('../assets/data/tno.json')])
    .then(([growData, tnoData]) => {
        if (!growData || !tnoData) {
            throw new Error('One or more datasets could not be loaded');
        }

        const processedGrowData = processGrowData(growData);

        const lineConfigurations = [
            { name: '-3', valueKey: 'ValueMin30' },
            { name: '-2,5', valueKey: 'ValueMin25' },
            { name: '-2', valueKey: 'ValueMin20' },
            { name: '-1', valueKey: 'ValueMin10' },
            { name: '0', valueKey: 'Value0' },
            { name: '+1', valueKey: 'ValuePlus10' },
            { name: '+2', valueKey: 'ValuePlus20' },
            { name: '+2,5', valueKey: 'ValuePlus25' },
        ];

        const lines = lineConfigurations.map(config => ({
            name: config.name,
            data: processTnoData(tnoData, config.valueKey),
            type: 'line',
        }));
        const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];

        const options = {
            series: [
                {
                    name: 'Gemeten waarde',
                    data: processedGrowData,
                    type: 'line',
                },
                ...lines.map((line, index) => ({
                    name: line.name,
                    data: line.data,
                    type: 'line',
                    color: lineColors[index % lineColors.length],
                }))
            ],
            chart: {
                height: '100%',
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            legend: {
                show: false
            },
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Leeftijd (maanden)',
                },
                min: 0,
                max: 15,
                tickAmount: 15,
                ticks: {
                    autoSkip: false,
                },
                forceNiceScale: false,
                decimalsInFloat: 0,
            },
            yaxis: {
                type: 'numeric',
                title: {
                    text: 'Lengte (cm)',
                },
                min: 40,
                max: 92,
                tickAmount: 26,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(0);
                    }
                },
                forceNiceScale: false,
            },
            annotations: {
                // yaxis: [],
            },
        };

        chart = new ApexCharts(chartWrapper, options);
        chart.render();

        lineConfigurations.forEach(config => {
            const seriesData = processTnoData(tnoData, config.valueKey);
            const lastDataPoint = getLastDataPoint(seriesData);
            chart.addYaxisAnnotation({
                y: lastDataPoint[1],
                label: {
                    text: config.name,
                    style: {
                        background: '#a1c2a3'
                    }
                },
                opacity: 0
            });
        });
    }
    )
    .catch(error => {
        console.error('Error in processing data: ', error);
    });

let debouncer = -1;
new ResizeObserver(() => {
    window.clearTimeout(debouncer);
    debouncer = window.setTimeout(() => {
        while (chartWrapper.firstChild) {
            chartWrapper.removeChild(chartWrapper.lastChild);
        }
        chart?.render();
    }, 0)
}).observe(chartWrapper)