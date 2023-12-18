// const margin = {top: 20, right: 55, bottom: 60, left: 55};
// let width, height;
//
// const parseGrensvalRange = grensval => grensval.split('-').map(Number);
//
// function createOrUpdateChart() {
//     const container = d3.select('#labChartD3');
//     if (!container.node()) {
//         console.error('Container #labChart does not exist');
//         return;
//     }
//
//     width = parseInt(container.style('width')) - (margin.left - margin.right) - 75;
//     height = width;
//     container.select('svg').remove();
//
//     const svg = container
//         .append("svg")
//         .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
//
//     const x = d3.scaleTime().range([0, width]);
//     const y = d3.scaleLinear().range([height, 0]);
//
//     fetchDataAndProcess(svg, x, y);
// }
//
//
// function fetchDataAndProcess(svg, x, y) {
//     fetch('../assets/data/lab.json')
//         .then(response => response.json())
//         .then(data => {
//             const processedData = prepareData(data);
//             setScalesDomain(x, y, processedData);
//             drawChart(svg, x, y, processedData);
//         })
//         .catch(handleError);
// }
//
// function prepareData(data) {
//     const processedData = data.map(d => ({
//         date: new Date(d.DateTime),
//         uitslag: +d.UITSLAG,
//         grensval: parseGrensvalRange(d.GRENSVAL),
//         dateString: d.DateTime,
//     }));
//
//     processedData.sort((a, b) => a.date - b.date);
//     return processedData;
// }
//
// function setScalesDomain(x, y, data) {
//     x.domain(d3.extent(data, d => d.date));
//     const yMin = Math.floor(d3.min(data, d => Math.min(d.uitslag, d.grensval[0])));
//     const yMax = Math.ceil(d3.max(data, d => Math.max(d.uitslag, d.grensval[1])));
//     y.domain([yMin, yMax]);
// }
//
// function drawChart(svg, x, y, data) {
//     const valueline = d3.line()
//         .x(d => x(d.date))
//         .y(d => y(d.uitslag));
//
//     const areaBetweenGrensval = d3.area()
//         .x(d => x(d.date))
//         .y0(d => y(d.grensval[0]))
//         .y1(d => y(d.grensval[1]));
//
//     svg.append("path")
//         .data([data])
//         .attr("class", "area-grensval")
//         .style("fill", "lightgray")
//         .style("opacity", 0.5)
//         .style("stroke", "black")
//         .attr("d", areaBetweenGrensval);
//
//     svg.append("path")
//         .data([data])
//         .attr("class", "line uitslag")
//         .style("fill", "none")
//         .style("stroke", "black")
//         .attr("stroke-width", 3.5)
//         .attr("d", valueline);
//
//     svg.selectAll(".dot")
//         .data(data)
//         .enter().append("circle")
//         .attr("class", "dot")
//         .attr("cx", d => x(d.date))
//         .attr("cy", d => y(d.uitslag))
//         .attr("r", 3)
//         .style("fill", "red");
//
//     addAxes(svg, x, y);
//     addGridLines(svg, x, y);
// }
//
// function addAxes(svg, x, y) {
//     const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y"));
//
//     const yAxis = d3.axisLeft(y)
//         .tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1))
//         .tickFormat(d3.format(".0f"));
//
//     const rightYAxis = d3.axisRight(y)
//         .tickValues(d3.range(Math.floor(y.domain()[0]), Math.ceil(y.domain()[1]) + 1))
//         .tickFormat(d3.format(".0f"));
//
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(xAxis)
//         .style("font-size", "14px")
//         .selectAll("text")
//         .attr("transform", "rotate(-20)")
//         .style("text-anchor", "end");
//
//     svg.append("g")
//         .call(yAxis)
//         .style("font-size", "14px")
//         .append("text")
//         .attr("fill", "#000")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -52)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .style("font-size", "14px")
//         .text("Glucose(POCT) mmol/L");
//
//     svg.append("g")
//         .attr("class", "axis axis--right")
//         .attr("transform", `translate(${width}, 0)`)
//         .call(rightYAxis)
//         .style("font-size", "14px");
// }
//
// function addGridLines(svg, x, y) {
//     const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(10);
//     const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(10);
//
//     svg.append('g').attr('class', 'grid').call(yAxisGrid);
//     svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height})`).call(xAxisGrid);
// }
//
// function handleError(error) {
//     console.error('Error fetching the lab data:', error);
// }
//
// window.addEventListener('resize', createOrUpdateChart);
// document.addEventListener('DOMContentLoaded', createOrUpdateChart);

const margin = {top: 10, right: 55, bottom: 60, left: 55};
let globalData;

let currentPage = 0;
const yearsPerPage = 5;

function updateChart() {
    const startIndex = currentPage * yearsPerPage;
    const endIndex = startIndex + yearsPerPage;
    const slicedData = globalData.slice(startIndex, endIndex);
    createLabChart(slicedData);
}

function goToPreviousPage() {
    currentPage = Math.max(0, currentPage - 1);
    updateChart();
}

function goToNextPage() {
    const maxPages = Math.ceil(globalData.length / yearsPerPage) - 1;
    currentPage = Math.min(maxPages, currentPage + 1);
    updateChart();
}

async function fetchData() {
    try {
        const response = await d3.json('../assets/data/lab.json');
        globalData = response;
        globalData.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));

        const mostRecentDate = new Date(globalData[0].DateTime);
        const currentDate = new Date();
        const timeDifferenceInYears = (currentDate - mostRecentDate) / (365 * 24 * 60 * 60 * 1000);
        currentPage = Math.floor(timeDifferenceInYears / yearsPerPage);

        updateChart();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function createLabChart(data) {
    const elementId = 'labChartD3';

    const element = document.getElementById(elementId);
    const width = element.clientWidth - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    d3.select("#" + elementId).select("svg").remove();

    const svg = d3.select("#" + elementId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const processedData = data
        .sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime))
        .map(d => ({
            date: new Date(d.DateTime),
            valueUitslag: parseFloat(d.UITSLAG),
            valueGrensval: parseFloat(d.GRENSVAL)
        }));

    const x = d3.scaleBand().range([0, width]).domain(processedData.map(d => d.date));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .style("font-size", "13px")
        .selectAll("text")
        .attr("dy", "1em")
        .attr("dx", "3em")
        .style("text-anchor", "end");

    const yMax = 12;
    const yMin = 4;
    const yStep = 1;

    const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    addGridLines(svg, x, y, width, height);

    const yAxisRight = d3.axisRight(y)
        .tickValues(d3.range(yMin, yMax + yStep, yStep));

    svg.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(yAxisRight)
        .style("font-size", "14px")
        .append("text")
        .attr("fill", "#000")
        .attr("text-anchor", "end");

    const yAxis = d3.axisLeft(y)
        .tickValues(d3.range(yMin, yMax + yStep, yStep));

    svg.append("g")
        .call(yAxis)
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
        .attr("stroke-width", 3)
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
        .attr("r", 3)
        .attr("fill", "red");

    const areaBetweenGrensval = d3.area()
        .x(d => x(d.date))
        .y0(d => y(d.valueGrensval + 2.4))
        .y1(d => y(d.valueGrensval - 0));

    svg.append("path")
        .data([processedData])
        .attr("class", "area-grensval")
        .style("fill", "lightgray")
        .style("opacity", 0.3)
        .style("stroke", "black")
        .attr("d", areaBetweenGrensval);
}

function addGridLines(svg, x, y, width, height) {
    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(20);
    const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(10);

    svg.append('g').attr('class', 'grid').call(yAxisGrid);
    svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height})`).call(xAxisGrid);
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