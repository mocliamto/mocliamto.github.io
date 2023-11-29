const margin = {top: 20, right: 55, bottom: 50, left: 55};
let globalData;

function createChart(data, elementId, xValue, yValue, chartType) {
    const element = document.getElementById(elementId);
    const width = element.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    d3.select("#" + elementId).select("svg").remove();

    const svg = d3.select("#" + elementId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const processedData = data
        .sort((a, b) => new Date(a[xValue]) - new Date(b[xValue]))
        .map(d => ({date: new Date(d[xValue]), value: d[yValue]}));

    const x = (chartType === 'bar') ?
        d3.scaleBand().range([0, width]).domain(processedData.map(d => d.date)).padding(0.1) :
        d3.scaleTime().domain(d3.extent(data, d => new Date(d[xValue]))).range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .selectAll("text")
        .attr("transform", elementId === 'seizureChart' ? "rotate(-20)" : "rotate(-40)")
        .style("text-anchor", "end");

    // Y-as
    let yMax = d3.max(data, d => d[yValue]);
    let yMin = d3.min(data, d => d[yValue]);

    if (elementId === 'medicationChart') {
        yMax = Math.ceil(yMax / 500) * 500;
    } else if (elementId === 'seizureChart') {
        yMin = 0;
    }

    const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    if (elementId === 'medicationChart') {

        function y_medicationGridlines() {
            return d3.axisLeft(y)
                // .ticks(2)
                .tickValues(d3.range(0, yMax + 1, 500))
                .tickSize(-width)
                .tickFormat("");
        }

        svg.append("g").attr("class", "grid")
            .call(y_medicationGridlines().tickSize(-width).tickFormat(""))

        function x_medicationGridlines() {
            return d3.axisBottom(x)
        }

        svg.append("g").attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_medicationGridlines().tickSize(-height).tickFormat(""));

    } else {
        const yMax = d3.max(data, d => d[yValue]);
        let yMin = d3.min(data, d => d[yValue]);

        if (elementId === 'seizureChart') {
            yMin = 0;
        }
        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);

        let yAxisLeft = d3.axisLeft(y);
        let yAxisRight = d3.axisRight(y);

        if (elementId === 'seizureChart') {
            const yAxisValues = d3.range(Math.floor(yMin), Math.ceil(yMax) + 0.5, 0.5);
            yAxisLeft = yAxisLeft.tickValues(yAxisValues);
            yAxisRight = yAxisRight.tickValues(yAxisValues);
            // y-as links
            svg.append("g").call(yAxisLeft);

            // y-as rechts
            svg.append("g").attr("transform", `translate(${width},0)`).call(yAxisRight);
        }

        // rasterlijn Y-as
        function y_gridlines() {
            return d3.axisLeft(y).ticks(5)
        }

        svg.append("g").attr("class", "grid").call(y_gridlines().tickSize(-width).tickFormat(""))

        function x_gridlines() {
            return d3.axisBottom(x).ticks(5);
        }

        svg.append("g").attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_gridlines().tickSize(-height).tickFormat(""));
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    let colorMap = new Map();

    if (chartType === 'bar') {
        svg.selectAll("bars")
            .data(processedData).enter().append("rect")
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", function (d) {
                const wholeNumberValue = d.value;
                if (!colorMap.has(parseInt())) {
                    colorMap.set(wholeNumberValue, getRandomColor());
                }
                return colorMap.get(wholeNumberValue);
            });
    } else if (chartType === 'line') {
        const yMax = Math.ceil(d3.max(data, d => d[yValue]) / 500) * 500;
        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        const yAxisRight = d3.axisRight(y)
            .tickValues(d3.range(0, yMax + 1, 500))
            .tickFormat(d3.format('d'));

        svg.append("g").attr("transform", `translate(${width}, 0)`).call(yAxisRight);

        const yAxis = d3.axisLeft(y)
            .tickValues(d3.range(0, yMax + 1, 500))
            .tickFormat(d3.format('d'));

        svg.append("g").call(yAxis);

        svg.append("path")
            .datum(processedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line().x(d => x(d.date)).y(d => y(d.value)));

        svg.selectAll("dot")
            .data(processedData).enter()
            .append("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 3)
            .attr("fill", "steelblue");
    }
}

function redrawCharts() {
    createChart(globalData.Aanvalsregistratie, 'seizureChart', 'datum', 'aantal', 'bar');
    createChart(globalData.Medicatie, 'medicationChart', 'datum', 'dosis', 'line');
}

d3.json('../../assets/epilepsy.json').then(function (data) {
    globalData = data;
    redrawCharts();
}).catch(error => {
    console.error("Error fetching the data: ", error);
});

window.addEventListener("resize", redrawCharts);

//todo: per 1 getal een ander kleur van seizureChart ("Aanvalsregistratie": "aantal")
// niet hetzelfde kleur herdisplayen als het op het moment aan het displayen is,
// de kleuren onthouden wanneer de pagina refreshed
// display 1 int getal op de y as van seizureChart als het mogelijk is
//todo: andere aansluitende gridlijnen voor medicationChart
