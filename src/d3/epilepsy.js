const margin = {top: 40, right: 40, bottom: 60, left: 60};
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
        d3.scaleBand().range([0, width]).domain(processedData.map(d => d.date)).paddingInner(1).paddingOuter(0);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    // Y-as
    let yMax = d3.max(data, d => d[yValue]);
    let yMin = d3.min(data, d => d[yValue]);

    if (elementId === 'medicationChartD3') {
        yMax = Math.ceil(yMax / 500) * 500;

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 3)
            .attr("dy", "0.71em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Medicatie (mg)");
    } else if (elementId === 'seizureChartD3') {
        yMin = 0;
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 3)
            .attr("dy", "0.71em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Aantal aanvallen");
    } else if (elementId === 'pddChartD3') {
        yMax = 1;
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 3)
            .attr("dy", "0.71em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("PDD/DDD (mg)");
    } else {
        yMax = Math.ceil(d3.max(data, d => d[yValue]) / 200) * 2;
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 3)
            .attr("dy", "0.71em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Labuitslagen en ketonen");
    }

    const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    if (elementId === 'medicationChartD3') {
        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        function y_medicationGridlines() {
            return d3.axisLeft(y)
                .ticks(4)
                .tickSize(-width)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .call(y_medicationGridlines());

        function x_medicationGridlines() {
            return d3.axisBottom(x)
                .ticks(10)
                .tickSize(-height)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_medicationGridlines());

        const yAxisRight = d3.axisRight(y)
            .tickValues(d3.range(0, yMax + 1, 200))
            .tickFormat(d3.format('d'));

        svg.append("g").attr("transform", `translate(${width}, 0)`).call(yAxisRight);

        const yAxis = d3.axisLeft(y)
            .tickValues(d3.range(0, yMax + 1, 200))
            .tickFormat(d3.format('d'));

        svg.append("g").call(yAxis);

        svg.append("path")
            .datum(processedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value)));

        svg.selectAll("dot")
            .data(processedData).enter()
            .append("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 3)
            .attr("fill", "steelblue");

    } else if (elementId === 'pddChartD3') {
        yMax = 1;
        const yStep = 0.2;

        yMax = Math.ceil(yMax / yStep) * yStep;

        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        function y_medicationGridlines() {
            return d3.axisLeft(y)
                .ticks(4)
                .tickSize(-width)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .call(y_medicationGridlines());

        function x_medicationGridlines() {
            return d3.axisBottom(x)
                .ticks(10)
                .tickSize(-height)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_medicationGridlines());

        const yAxisRight = d3.axisRight(y)
            .tickValues(d3.range(0, yMax + yStep, yStep))
            .tickFormat(d3.format('.1f'));

        svg.append("g").attr("transform", `translate(${width}, 0)`).call(yAxisRight);

        const yAxis = d3.axisLeft(y)
            .tickValues(d3.range(0, yMax + yStep, yStep))
            .tickFormat(d3.format('.1f'));

        svg.append("g").call(yAxis);
    } else if (elementId === 'labResultsChart') {
        yMax = 20;
        const yStep = 1;

        yMax = Math.ceil(yMax / yStep) * yStep;

        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        function y_medicationGridlines() {
            return d3.axisLeft(y)
                .ticks(4)
                .tickSize(-width)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .call(y_medicationGridlines());

        function x_medicationGridlines() {
            return d3.axisBottom(x)
                .ticks(10)
                .tickSize(-height)
                .tickFormat("");
        }

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_medicationGridlines());

        const yAxisRight = d3.axisRight(y)
            .tickValues(d3.range(0, yMax + yStep, yStep))

        svg.append("g").attr("transform", `translate(${width}, 0)`).call(yAxisRight);

        const yAxis = d3.axisLeft(y)
            .tickValues(d3.range(0, yMax + yStep, yStep))

        svg.append("g").call(yAxis);
    } else {
        const yMax = d3.max(data, d => d[yValue]);
        let yMin = d3.min(data, d => d[yValue]);

        if (elementId === 'seizureChartD3') {
            yMin = 0;
        }
        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);

        let yAxisLeft = d3.axisLeft(y);
        let yAxisRight = d3.axisRight(y);

        if (elementId === 'seizureChartD3') {
            const yAxisValues = d3.range(Math.floor(yMin), Math.ceil(yMax) + 1, 1);
            yAxisLeft = yAxisLeft.tickValues(yAxisValues).tickFormat(d3.format(".0f"));
            yAxisRight = yAxisRight.tickValues(yAxisValues).tickFormat(d3.format(".0f"));

            // y-as links
            svg.append("g").call(yAxisLeft);

            // y-as rechts
            svg.append("g").attr("transform", `translate(${width},0)`).call(yAxisRight);
        }

        // rasterlijn Y-as
        function y_gridlines() {
            return d3.axisLeft(y).ticks(3)
        }

        svg.append("g").attr("class", "grid").call(y_gridlines().tickSize(-width).tickFormat(""))

        function x_gridlines() {
            return d3.axisBottom(x).ticks(5);
        }

        svg.append("g").attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(x_gridlines().tickSize(-height).tickFormat(""));
    }

    if (chartType === 'bar') {
        svg.selectAll("bars")
            .data(processedData).enter().append("rect")
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "#81bdb1")
    } else if (chartType === 'line') {
        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        const yAxisRight = d3.axisRight(y)
            .tickValues(d3.range(0, yMax + 1, 200))
            .tickFormat(d3.format('d'));

        svg.append("g").attr("transform", `translate(${width}, 0)`).call(yAxisRight);

        const yAxis = d3.axisLeft(y)
            .tickValues(d3.range(0, yMax + 1, 200))
            .tickFormat(d3.format('d'));

        svg.append("g").call(yAxis);

        svg.append("path")
            .datum(processedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value)));

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
    createChart(globalData.Aanvalsregistratie, 'seizureChartD3', 'datum', 'aantal', 'bar');
    createChart(globalData.Medicatie, 'medicationChartD3', 'datum', 'dosis', 'line');
    const body = window.parent.document.querySelector("body");
    if (body.classList.contains("Zorgverlener")) {
        document.querySelector(".d-none").classList.remove("d-none");
        createChart(globalData.PDD_DDD, 'pddChartD3', 'datum', 'PDD_DDD_waarde', 'line');
        createChart(globalData.Labuitslagen_en_ketonen, 'labResultsChart', 'datum', 'ketonen_mmol_l', 'line');
    }
}

d3.json('../assets/data/epilepsy.json').then(function (data) {
    globalData = data;
    redrawCharts();
}).catch(error => {
    console.error("Error fetching the data: ", error);
});

window.addEventListener("resize", redrawCharts);
