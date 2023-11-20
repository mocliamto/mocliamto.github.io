fetch('../../assets/epilepsy.json')
    .then(response => response.json())
    .then(data => {
        const sortedAanvalsregistratie = data.Aanvalsregistratie.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        const sortedMedicatie = data.Medicatie.sort((a, b) => new Date(a.datum) - new Date(b.datum));

        var optionsLine2 = {
            series: [{
                name: 'Aanvalsregistratie',
                data: sortedAanvalsregistratie.map(item => ({
                    x: new Date(item.datum),
                    y: item.aantal
                }))
            }],
            chart: {
                id: 'tw',
                group: 'social',
                type: 'bar',
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
            },
            xaxis: {
                type: 'datetime'
            }
        };

        var chartLine2 = new ApexCharts(document.querySelector("#epi-chart-line2"), optionsLine2);
        chartLine2.render();

        var optionsArea = {
            series: [{
                name: 'Medicatie',
                data: sortedMedicatie.map(item => ({
                    x: new Date(item.datum),
                    y: item.dosis
                }))
            }],
            chart: {
                id: 'yt',
                group: 'social',
                type: 'line',
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
            },
            xaxis: {
                type: 'datetime'
            }
        };

        var chartArea = new ApexCharts(document.querySelector("#epi-chart-area"), optionsArea);
        chartArea.render();
    })
    .catch(error => {
        console.error("Error fetching the data: ", error);
    });
