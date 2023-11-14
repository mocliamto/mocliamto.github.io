// Define dimensions and margins for the chart
const margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the div
const svg = d3.select("#growthCurveChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Mock TNO reference values for child growth (0-15 months)
// These values are illustrative and need to be replaced with actual TNO reference data
const growthData = [
    {age: 0, height: 50},
    {age: 1, height: 54},
    {age: 2, height: 58},
    {age: 3, height: 61},
    {age: 4, height: 63},
    {age: 5, height: 65},
    {age: 6, height: 67},
    {age: 7, height: 69},
    {age: 8, height: 70},
    {age: 9, height: 72},
    {age: 10, height: 73},
    {age: 11, height: 74},
    {age: 12, height: 76},
    {age: 13, height: 77},
    {age: 14, height: 78},
    {age: 15, height: 80}
];

// Add X axis
const x = d3.scaleLinear()
    .domain([0, 15])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
    .domain([45, 85])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// Add the line
svg.append("path")
    .datum(growthData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(d => x(d.age))
        .y(d => y(d.height))
    );

// Add dots
svg.selectAll("dot")
    .data(growthData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.age))
    .attr("cy", d => y(d.height))
    .attr("r", 5)
    .attr("fill", "red");
