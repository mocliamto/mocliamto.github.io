// // Configuration
// const valueRanges = [
//     'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
//     'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
// ];
// const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
// const lineWidth = [2, 2, 2, 2, 3];
//
// // Set initial dimensions and margins
// const margin = {top: 20, right: 20, bottom: 30, left: 50};
// let container = d3.select("#chart-container"); // The container for the chart
// let width = container.node().getBoundingClientRect().width - margin.left - margin.right;
// let height = 500 - margin.top - margin.bottom; // Set a fixed height
//
// // Scales
// const x = d3.scaleLinear().range([0, width]);
// const y = d3.scaleLinear().range([height, 0]);
// const yRight = d3.scaleLinear().range([height, 0]);
//
// // Line generator
// const line = d3.line()
//     .x(d => x(d.month))
//     .y(d => y(d.value))
//     .curve(d3.curveMonotoneX);
//
// // Append SVG to the container with viewBox
// const svg = container.append("svg")
//     .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
// // Data loading and chart construction
// Promise.all([
//     fetch('../../assets/grow.json').then(response => response.json()),
//     fetch('../../assets/tno.json').then(response => response.json())
// ]).then(([growData, tnoData]) => {
//     // Domain settings
//     x.domain([0, 15]);
//     y.domain([40, 92]);
//     yRight.domain([40, 92]);
//
//     // Axes
//     svg.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(x).ticks(15));
//     svg.append("g")
//         .call(d3.axisLeft(y).ticks((92 - 40) / 2));
//     svg.append("g")
//         .attr("transform", `translate(${width}, 0)`)
//         .call(d3.axisRight(yRight).ticks((92 - 40) / 2));
//
//     // Line plots
//     valueRanges.forEach((range, index) => {
//         const dataset = tnoData.map(d => ({month: d.StapNummer, value: d[range]}));
//         svg.append("path")
//             .data([dataset])
//             .attr("fill", "none")
//             .attr("stroke", lineColors[index % lineColors.length])
//             .attr("stroke-width", lineWidth[index % lineWidth.length])
//             .attr("d", line);
//     });
//     const userValues = growData.map(d => ({month: d.LeeftijdInMaanden, value: d.Lengte}));
//     svg.append("path")
//         .data([userValues])
//         .attr("fill", "none")
//         .attr("stroke", "black")
//         .attr("d", line);
// }).catch(error => {
//     console.error('Error loading data:', error);
// });
//
// // Resize functionality
// function updateChart() {
//     width = container.node().getBoundingClientRect().width - margin.left - margin.right;
//     svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
//     x.range([0, width]);
//     yRight.range([height, 0]);
//
// }
//
// d3.select(window).on("resize", updateChart);


const valueRanges = [
    'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
    'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
];
const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
const fills = [false, false, '+1', '+1', '+1', '+1'];
const lineWidth = [2, 2, 2, 2, 3];

const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const line = d3.line()
    .x(d => x(d.month))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

const svg = d3.select("#growthCurveChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
Promise.all([
    fetch('../../assets/grow.json').then(response => response.json()),
    fetch('../../assets/tno.json').then(response => response.json())
]).then(([growData, tnoData]) => {

    x.domain([0, 15]);
    y.domain([40, 92]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15));

    svg.append("g")
        .call(d3.axisLeft(y).ticks((92 - 40) / 2));

    const yRight = d3.scaleLinear().range([height, 0]);
    yRight.domain([40, 92]);

    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight).ticks((92 - 40) / 2));

    valueRanges.forEach((range, index) => {
        const dataset = tnoData.map(d => ({month: d.StapNummer, value: d[range]}));

        svg.append("path")
            .data([dataset])
            .attr("stroke", lineColors[index % lineColors.length])
            .attr("stroke-width", lineWidth[index % lineWidth.length])
            .attr("fill", "rgba(222,236,220,0.55)")
            .attr("d", line);
    });

    const userValues = growData.map(d => ({month: d.LeeftijdInMaanden, value: d.Lengte}));
    svg.append("path")
        .data([userValues])
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", line);


}).catch(error => {
    console.error('Error loading data:', error);
});

// fetch("../../assets/grow.json")
//     .then(response => response.json())
//     .then(growthData => {
//         fetch("../../assets/tno.json")
//             .then(response => response.json())
//             .then(tnoData => {
//                 // Define dimensions and margins for the chart
//                 const margin = {top: 10, right: 30, bottom: 30, left: 50},
//                     width = 460 - margin.left - margin.right,
//                     height = 400 - margin.top - margin.bottom;
//
//                 // Append the svg object to the div
//                 const svg = d3.select("#growthCurveChart")
//                     .append("svg")
//                     .attr("width", width + margin.left + margin.right)
//                     .attr("height", height + margin.top + margin.bottom)
//                     .append("g")
//                     .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
//                 growthData.forEach(d => {
//                     d.LeeftijdInMaanden = +d.LeeftijdInMaanden;
//                     d.Lengte = +d.Lengte;
//                 });
//
//                 // Define X and Y axes
//                 const x = d3.scaleLinear()
//                     .domain([0, d3.max(growthData, d => d.LeeftijdInMaanden)])
//                     .range([0, width]);
//                 svg.append("g")
//                     .attr("transform", `translate(0, ${height})`)
//                     .call(d3.axisBottom(x));
//
//                 const y = d3.scaleLinear()
//                     .domain([0, d3.max(growthData, d => d.Lengte)])
//                     .range([height, 0]);
//                 svg.append("g")
//                     .call(d3.axisLeft(y));
//
//                 // Add the line for growthData
//                 svg.append("path")
//                     .datum(growthData)
//                     .attr("fill", "none")
//                     .attr("stroke", "steelblue")
//                     .attr("stroke-width", 1.5)
//                     .attr("d", d3.line()
//                         .x(d => x(d.LeeftijdInMaanden))
//                         .y(d => y(d.Lengte)));
//
//                 // Add lines for tnoData
//                 tnoData.forEach(dataset => {
//                     svg.append("path")
//                         .datum(dataset.values) // Assuming each dataset has a 'values' array
//                         .attr("fill", "none")
//                         .attr("stroke", dataset.color) // Assuming each dataset has a 'color'
//                         .attr("stroke-width", 1.5)
//                         .attr("d", d3.line()
//                             .x(d => x(d.month)) // Adjust based on your data structure
//                             .y(d => y(d.value))); // Adjust based on your data structure
//                 });
//
//                 // Add dots for growthData
//                 svg.selectAll(".dot")
//                     .data(growthData)
//                     .enter()
//                     .append("circle")
//                     .attr("class", "dot")
//                     .attr("cx", d => x(d.LeeftijdInMaanden))
//                     .attr("cy", d => y(d.Lengte))
//                     .attr("r", 5)
//                     .attr("fill", "green");
//
//                 // Add additional features (like labels, legend, etc.) here
//
//             })
//             .catch(error => console.error('Error fetching the tno.json data:', error));
//     })
//     .catch(error => console.error('Error fetching the grow.json data:', error));
