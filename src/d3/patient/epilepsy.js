const margin = {top: 20, right: 30, bottom: 50, left: 50};
let globalData;

function createBarChart(data, elementId, xValue, yValue) {
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
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
        .map(d => ({date: new Date(d[xValue]), value: d[yValue]}));

    // X as
    const x = d3.scaleBand()
        .range([0, width])
        .domain(processedData.map(d => d.date))
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y as
    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    const yRight = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight));

    svg.selectAll("bars")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "rgb(246,187,200)");
}

function createLineChart(data, elementId, xValue, yValue) {
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
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
        .map(d => ({date: new Date(d[xValue]), value: d[yValue]}));

    // X as
    const x = d3.scaleTime()
        // .domain(d3.extent(processedData, d => d.date))
        .domain(d3.extent(data, d => new Date(d[xValue])))
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y as
    const y = d3.scaleLinear()
        // .domain([0, d3.max(processedData, d => d.value)])
        .domain([0, d3.max(data, d => d[yValue])])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    const yRight = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yValue])])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight));

    svg.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.selectAll("dot")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", "steelblue");
}

function redrawCharts() {
    createBarChart(globalData.Aanvalsregistratie, 'seizureChart', 'datum', 'aantal');
    createLineChart(globalData.Medicatie, 'medicationChart', 'datum', 'dosis');
}

d3.json('../../assets/epilepsy.json').then(function (data) {
    globalData = data;
    redrawCharts();
}).catch(error => {
    console.error("Error fetching the data: ", error);
});

window.addEventListener("resize", redrawCharts);