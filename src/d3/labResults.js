const margin = {top: 20, right: 55, bottom: 50, left: 55};
let width, height;

const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
const parseGrensvalRange = grensval => grensval.split('-').map(Number);

function createOrUpdateChart() {
    const container = d3.select('#labChartD3');
    if (!container.node()) {
        console.error('Container #labChart does not exist');
        return;
    }

    width = parseInt(container.style('width')) - (margin.left - margin.right) - 75;
    height = width;
    container.select('svg').remove();

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    fetchDataAndProcess(svg, x, y);
}

function fetchDataAndProcess(svg, x, y) {
    fetch('../assets/data/lab.json')
        .then(response => response.json())
        .then(data => {
            const processedData = prepareData(data);
            setScalesDomain(x, y, processedData);
            drawChart(svg, x, y, processedData);
        })
        .catch(handleError);
}

function prepareData(data) {
    const processedData = data.map(d => ({
        date: parseTime(d.DateTime),
        uitslag: +d.UITSLAG,
        grensval: parseGrensvalRange(d.GRENSVAL),
    }));

    processedData.sort((a, b) => a.date - b.date);
    return processedData;
}

function setScalesDomain(x, y, data) {
    x.domain(d3.extent(data, d => d.date));
    const yMin = Math.floor(d3.min(data, d => Math.min(d.uitslag, d.grensval[0])));
    const yMax = Math.ceil(d3.max(data, d => Math.max(d.uitslag, d.grensval[1])));
    y.domain([yMin, yMax]);
}

function drawChart(svg, x, y, data) {
    const valueline = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.uitslag));

    const areaBetweenGrensval = d3.area()
        .x(d => x(d.date))
        .y0(d => y(d.grensval[0]))
        .y1(d => y(d.grensval[1]));

    svg.append("path")
        .data([data])
        .attr("class", "area-grensval")
        .style("fill", "lightgray")
        .style("opacity", 0.5)
        .style("stroke", "black")
        .attr("d", areaBetweenGrensval);

    svg.append("path")
        .data([data])
        .attr("class", "line uitslag")
        .style("fill", "none")
        .style("stroke", "black")
        .attr("stroke-width", 3.5)
        .attr("d", valueline);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.uitslag))
        .attr("r", 3)
        .style("fill", "red");

    addAxes(svg, x, y);
    addGridLines(svg, x, y);
}

function addAxes(svg, x, y) {
    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y"));

    const yAxis = d3.axisLeft(y)
        .tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1))
        .tickFormat(d3.format(".0f"));

    const rightYAxis = d3.axisRight(y)
        .tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1))
        .tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .style("font-size", "14px")
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(yAxis)
        .style("font-size", "14px")
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -52)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .text("Glucose(POCT) mmol/L");

    svg.append("g")
        .attr("class", "axis axis--right")
        .attr("transform", `translate(${width}, 0)`)
        .call(rightYAxis)
        .style("font-size", "14px");
}

function addGridLines(svg, x, y) {
    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(10);
    const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(10);

    svg.append('g').attr('class', 'grid').call(yAxisGrid);
    svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height})`).call(xAxisGrid);
}

function handleError(error) {
    console.error('Error fetching the lab data:', error);
}

window.addEventListener('resize', createOrUpdateChart);
document.addEventListener('DOMContentLoaded', createOrUpdateChart);
