const margin = {top: 20, right: 50, bottom: 50, left: 50};
let width, height;

const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
const parseGrensvalRange = grensval => grensval.split('-').map(Number);

function createOrUpdateChart() {
    const container = d3.select('#labChartD3');
    if (!container.node()) {
        console.error('Container #labChart does not exist');
        return;
    }

    width = parseInt(container.style('width')) - ((margin.left - margin.right)-75);
    height = width;
    container.select('svg').remove();

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    processData(svg, x, y);
}

function processData(svg, x, y) {
    fetch('../assets/data/lab.json')
        .then(response => response.json())
        .then(data => {
            prepareData(data);
            setScalesDomain(x, y, data);
            drawChart(svg, x, y, data);
        }).catch(handleError);
}

function prepareData(data) {
    data.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
    data.forEach(d => {
        d.date = parseTime(d.DateTime);
        d.uitslag = +d.UITSLAG;
        d.grensval = parseGrensvalRange(d.GRENSVAL);
    });
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

    // Area
    svg.append("path")
        .data([data])
        .attr("class", "area-grensval")
        .style("fill", "orange")
        .style("opacity", 0.5)
        .attr("d", areaBetweenGrensval);

    // Line
    svg.append("path")
        .data([data])
        .attr("class", "line uitslag")
        .style("fill", "none")
        .style("stroke", "red")
        .attr("stroke-width", 2.3)
        .attr("d", valueline);

    // Dots
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.uitslag))
        .attr("r", 3)
        .style("fill", "red");

    addAxes(svg, x, y);
    addGridLines(svg, x, y);

    // Legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 10}, 10)`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "orange");

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Grensval Range");

    legend.append("path")
        .datum(data)
        .attr("class", "line uitslag-legend")
        .style("fill", "none")
        .style("stroke", "red")
        .attr("stroke-width", 2.3)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.uitslag))
        );

    legend.append("text")
        .attr("x", 24)
        .attr("y", 30)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("fill", "red")
        .text("Uitslag Line");
}

function addAxes(svg, x, y) {
    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%dT%H:%M:%S"));

    const yAxis = d3.axisLeft(y).tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1));

    const rightYAxis = d3.axisRight(y).tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1));

    // x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    // y-axis (left)
    svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", "15px")
        .text("Glucose(POCT) mmol/L");

    // y-axis (right)
    svg.append("g")
        .attr("class", "axis axis--right")
        .attr("transform", `translate(${width}, 0)`)
        .call(rightYAxis);
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