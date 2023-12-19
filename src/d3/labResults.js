const margin = {top: 30, right: 30, bottom: 50, left: 60};
const {top, right, bottom, left} = margin;
let globalData;
let currentPage = 0;
const datasetsPerPage = 10;
let valueGrensval;
let lowerValue;
let upperValue;

function updateChart() {
    const startIndex = currentPage * datasetsPerPage;
    const endIndex = startIndex + datasetsPerPage;
    const slicedData = globalData.slice(startIndex, endIndex);
    createLabChart(slicedData);
}

function goToNextPage() {
    const maxPages = Math.ceil(globalData.length / datasetsPerPage) - 1;
    currentPage = Math.min(maxPages, currentPage + 1);
    updateChart();
}

function goToPreviousPage() {
    currentPage = Math.max(0, currentPage - 1);
    updateChart();
}

async function fetchData() {
    try {
        globalData = await d3.json('../assets/data/lab.json');
        processChartData();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processChartData() {
    globalData.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));
    const mostRecentDate = new Date(globalData[0].DateTime);
    const currentDate = new Date();
    const timeDifferenceInYears = (currentDate - mostRecentDate) / (365 * 24 * 60 * 60 * 1000);
    currentPage = Math.floor(timeDifferenceInYears / datasetsPerPage);

    const nearestDataPoint = globalData.reduce((nearest, dataPoint) => {
        const dateDifference = Math.abs(new Date(dataPoint.DateTime) - currentDate);
        const nearestDifference = Math.abs(new Date(nearest.DateTime) - currentDate);

        return dateDifference < nearestDifference ? dataPoint : nearest;
    }, globalData[0]);

    const rangeValues = nearestDataPoint.GRENSVAL.split('-');
    lowerValue = parseFloat(rangeValues[0]);
    upperValue = parseFloat(rangeValues[1]);
    valueGrensval = (lowerValue + upperValue) / 2;

    updateChart();
}

function createLabChart(data) {
    const elementId = 'labChartD3';
    const element = document.getElementById(elementId);
    const width = element.clientWidth - left - right;
    const height = element.clientWidth - top - bottom;

    d3.select("#" + elementId).select("svg").remove();

    const svg = d3.select("#" + elementId)
        .append("svg")
        .attr("width", width + left + right)
        .attr("height", height + top + bottom)
        .append("g")
        .attr("transform", `translate(${left},${top})`);

    const processedData = data
        .sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime))
        .map(d => ({
            date: new Date(d.DateTime),
            valueUitslag: parseFloat(d.UITSLAG),
            valueGrensval: parseFloat(d.GRENSVAL)
        }));

    const legendData = [
        {label: "Uitslag", color: "red"},
        {label: "Trend verloop", color: "black"},
        {label: "Referentiewaarde", color: "#ffde5c"}
    ];

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 470},${-30})`);

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 130)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 130 + 15)
        .attr("y", 5)
        .attr("dy", "0.5em")
        .style("font-size", "12px")
        .text(d => d.label);

    const x = d3.scaleBand().range([0, width]).domain(processedData.map(d => d.date)).paddingInner(1).paddingOuter(0);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(datasetsPerPage).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .style("font-size", "13px")
        .selectAll("text")
        .attr("dy", "0.5em")
        .attr("dx", "-0.5em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    const yMax = Math.ceil(d3.max(processedData, d => Math.max(d.valueUitslag, d.valueGrensval)));
    const yMin = Math.floor(d3.min(processedData, d => Math.min(d.valueUitslag, d.valueGrensval)));
    const yStep = 1;

    const y = d3.scaleLinear().domain([yMin - 1, yMax + 1]).range([height, 0]);

    addGridLines(svg, x, y, width, height, datasetsPerPage);

    const yAxisRight = d3.axisRight(y)
        .tickValues(d3.range(yMin, yMax + yStep, yStep))
        .tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(yAxisRight)
        .style("font-size", "14px")
        .append("text")
        .attr("fill", "#000")
        .attr("text-anchor", "end");

    const yAxis = d3.axisLeft(y)
        .tickValues(d3.range(yMin, yMax + yStep, yStep))
        .tickFormat(d3.format(".0f"));

    svg.select(".y-axis").remove();
    svg.append("g")
        .call(yAxis)
        .attr("class", "y-axis")
        .style("font-size", "14px")
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("dy", "-2.5em")
        .attr("text-anchor", "end")
        .text("Glucose(POCT) mmol/L");

    svg.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.valueUitslag)));

    svg.selectAll(".dot")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.valueUitslag))
        .attr("r", 3.5)
        .attr("fill", "red");

    const areaBetweenGrensval = d3.area()
        .x(d => x(d.date))
        .y0(y(upperValue))
        .y1(y(lowerValue));

    svg.append("path")
        .data([processedData])
        .attr("class", "area-grensval")
        .style("stroke", "#f8a403")
        .attr("stroke-width", 3.5)
        .style("fill", "#ffde5c")
        .style("opacity", 0.30)
        .attr("d", areaBetweenGrensval)
}

function addGridLines(svg, x, y, width, height, datasetsPerPage) {
    const numXTicks = datasetsPerPage + 1;
    const numYTicks = 10;

    const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(numXTicks);
    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(numYTicks);

    svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height})`).call(xAxisGrid);
    svg.append('g').attr('class', 'grid').call(yAxisGrid);
}

d3.select("#labChartD3")
    .style("text-align", "right")
    .append("button")
    .html("<i class='fas fa-angles-left'></i>")
    .on("click", goToNextPage);

d3.select("#labChartD3")
    .style("text-align", "right")
    .append("button")
    .html("<i class='fas fa-angles-right'></i>")
    .on("click", goToPreviousPage);

function redrawLabChart() {
    createLabChart(globalData);
}

fetchData();

window.addEventListener("resize", redrawLabChart);