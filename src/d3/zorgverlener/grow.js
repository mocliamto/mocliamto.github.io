const valueRanges = [
    'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
    'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
];
const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
const lineWidth = [2, 2, 2, 2, 3];
const margin = {top: 20, right: 35, bottom: 30, left: 35};

let growData, tnoData;

function createLineChart() {
    const element = document.getElementById('growthCurveChart');
    const width = element.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#growthCurveChart").select("svg").remove();

    const svg = d3.select("#growthCurveChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

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
        .attr("stroke-width", 3)
        .attr("d", line);

    svg.selectAll("dot")
        .data(userValues)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.value))
        .attr("r", 3.5)
        .attr("fill", "black");
}

Promise.all([
    fetch('../../assets/grow.json').then(response => response.json()),
    fetch('../../assets/tno.json').then(response => response.json())
]).then(([dataGrow, dataTno]) => {
    growData = dataGrow;
    tnoData = dataTno;
    createLineChart();
}).catch(error => {
    console.error('Error loading data:', error);
});

window.addEventListener("resize", createLineChart);


// d3.json('../../assets/grow.json').then(function(growthData) {
//
// // Define dimensions and margins for the chart
//         const margin = {top: 10, right: 30, bottom: 30, left: 50},
//             width = 460 - margin.left - margin.right,
//             height = 400 - margin.top - margin.bottom;
//
// // Append the svg object to the div
//         const svg = d3.select("#growthCurveChart")
//             .append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
// // Parse data to ensure the types are correct
//         growthData.forEach(d => {
//             d.LeeftijdInMaanden = +d.LeeftijdInMaanden; // Convert to number if necessary
//             d.Lengte = +d.Lengte; // Convert to number if necessary
//         });
//
// // Add X axis
//         const x = d3.scaleLinear()
//             .domain([0, d3.max(growthData, d => d.LeeftijdInMaanden)])
//             .range([0, width]);
//         svg.append("g")
//             .attr("transform", `translate(0, ${height})`)
//             .call(d3.axisBottom(x));
//
// // Add Y axis
//         const y = d3.scaleLinear()
//             .domain([0, d3.max(growthData, d => d.Lengte)])
//             .range([height, 0]);
//         svg.append("g")
//             .call(d3.axisLeft(y));
//
// // Add the line
//         svg.append("path")
//             .datum(growthData)
//             .attr("fill", "none")
//             .attr("stroke", "steelblue")
//             .attr("stroke-width", 1.5)
//             .attr("d", d3.line()
//                 .x(d => x(d.LeeftijdInMaanden))
//                 .y(d => y(d.Lengte))
//             );
//
// // Add dots
//         svg.selectAll("dot")
//             .data(growthData)
//             .enter()
//             .append("circle")
//             .attr("cx", d => x(d.LeeftijdInMaanden))
//             .attr("cy", d => y(d.Lengte))
//             .attr("r", 5)
//             .attr("fill", "green");
//     })
//     .catch(error => console.error('Error fetching the JSON data:', error));