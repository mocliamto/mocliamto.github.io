fetch('../assets/data/epilepsy.json')
    .then(response => response.json())
    .then(data => {
        const sortedAanvalsregistratie = data.Aanvalsregistratie.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        const sortedMedicatie = data.Medicatie.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        const sortedPDD_DDD = data.PDD_DDD.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        const sortedLabuitslagen_en_ketonen = data.Labuitslagen_en_ketonen.sort((a, b) => new Date(a.datum) - new Date(b.datum));

        var optionsLine2 = {
            series: [{
                name: 'Aanvalsregistratie',
                data: sortedAanvalsregistratie.map(item => ({
                    x: new Date(item.datum),
                    y: item.aantal,
                }))
            }],
            chart: {
                id: 'tw',
                group: 'social',
                type: 'bar',
                height: 335
            },
            colors: ['#546E7A'],
            stroke: {
                width: 3
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                title: {
                    text: 'Aantal aanval'
                },
            },
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
                height: 335
            },
            colors: ['#00E396'],
            stroke: {
                width: 3
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                min: 0,
                max: 1000,
                tickAmount: 5,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(0);
                    }
                },
                title: {
                    text: 'Medicatie (mg)'
                },
            }
        };

        var chartArea = new ApexCharts(document.querySelector("#epi-chart-area"), optionsArea);
        chartArea.render();

        var optionsSmall = {
            series: [{
                name: 'PDD/DDD',
                data: sortedPDD_DDD.map(item => ({
                    x: new Date(item.datum),
                    y: item.PDD_DDD_waarde
                }))
            }],
            chart: {
                id: 'yt',
                group: 'social',
                type: 'line',
                height: 335
            },
            colors: ['#008FFB'],
            stroke: {
                width: 3
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                title: {
                    text: 'PDD/DDD (mg)'
                },
            },
        };

        const body = window.parent.document.querySelector("body");
        if (body.classList.contains("Zorgverlener")) {
            document.querySelector(".d-none").classList.remove("d-none");
            var chartSmall = new ApexCharts(document.querySelector("#epi-chart-small"), optionsSmall);
            chartSmall.render();

            var optionsSmall2 = {
                series: [{
                    name: 'Labuitslagen en ketonen',
                    data: sortedLabuitslagen_en_ketonen.map(item => ({
                        x: new Date(item.datum),
                        y: item.ketonen_mmol_l
                    }))
                }],
                chart: {
                    id: 'li',
                    group: 'social',
                    type: 'line',
                    height: 335
                },
                colors: ['#546E7A'],
                stroke: {
                    width: 3
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    title: {
                        text: 'Labuitslagen en ketonen'
                    },
                },
            };

            var chartSmall2 = new ApexCharts(document.querySelector("#epi-chart-small2"), optionsSmall2);
            chartSmall2.render();
        }
    })
    .catch(error => {
        console.error("Error fetching the data: ", error);
    });