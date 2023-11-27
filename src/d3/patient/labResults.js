// function parseDateTime(dateTime) {
//     return d3.isoParse(dateTime);
// }

function parseGrensvalRange(grensval) {
    if (typeof grensval === 'string') {
        return grensval.split('-').map(Number);
    }
    return grensval;
}

const margin = {top: 30, right: 30, bottom: 80, left: 60};

function createLabChart(data, xValue, yValue) {
    const element = document.getElementById('labChart');
    const width = element.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#labChart").select("svg").remove();

    const svg = d3.select("#labChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const processedData = data.map(d => ({
        date: new Date(d[xValue]),
        value: d[yValue],
        grensval: parseGrensvalRange(d.GRENSVAL)
    })).sort((a, b) => a.date - b.date);

    const x = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%dT%H:%M:%S")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    svg.append("path")
        .datum(processedData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    processedData.forEach(d => {
        svg.append("line")
            .attr("x1", x(d.date))
            .attr("x2", x(d.date))
            // .attr("fill", "+1")
            .attr("y1", y(d.grensval[0]))
            .attr("y2", y(d.grensval[1]))
            .attr("stroke", "orange")
            .attr("stroke-width", 1);
    });
}

let labData;
d3.json('../../assets/lab.json').then(function (data) {
    labData = data.map(d => ({
        ...d,
        UITSLAG: Number(d.UITSLAG),
        GRENSVAL: parseGrensvalRange(d.GRENSVAL)
    }));
    createLabChart(labData, "DateTime", "UITSLAG");
}).catch(error => {
    console.error('Error fetching the lab data:', error);
});

window.addEventListener("resize", () => createLabChart(labData, "DateTime", "UITSLAG"));

// function parseDateTime(dateTime) {
//     return d3.isoParse(dateTime);
// }
//
// function parseGrensvalRange(grensval) {
//     return grensval.split('-').map(Number);
// }
//
// let labData;
// const margin = {top: 30, right: 30, bottom: 80, left: 60};
//
//
// function createLabChart(data) {
//     const element = document.getElementById('labChart');
//     const width = element.clientWidth - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;
//
//     d3.select("#labChart").select("svg").remove();
//
//     const svg = d3.select("#labChart")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     // Setting the x-axis domain based on the DateTime range
//     const x = d3.scaleTime()
//         .domain(d3.extent(data, d => parseDateTime(d.DateTime)))
//         .range([0, width]);
//
//     const y = d3.scaleLinear()
//         .domain([
//             d3.min(data, d => d.GRENSVAL[0]),
//             d3.max(data, d => d.GRENSVAL[1])
//
//             // .domain([
//             //     d3.min(data, d => Math.min(...parseGrensvalRange(d.GRENSVAL))),
//             //     d3.max(data, d => Math.max(...parseGrensvalRange(d.GRENSVAL)))
//             // ])
//         ])
//         .range([height, 0]);
//
//     // Adding x-axis with short date notation
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).tickFormat(d3.timeParse("%Y-%m-%dT%H:%M:%S")));
//
//     // Adding y-axis
//     svg.append("g").call(d3.axisLeft(y));
//
//     // Line for UITSLAG
//     const lineUitslag = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(Number(d.UITSLAG)));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "red")
//         .attr("stroke-width", 1.5)
//         .attr("d", lineUitslag);
//
//     // Lines for GRENSVAL
//     const lineGrensvalLow = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(parseGrensvalRange(d.GRENSVAL)[0]));
//
//     const lineGrensvalHigh = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(parseGrensvalRange(d.GRENSVAL)[1]));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#ef3402")
//         .attr("stroke-width", 1)
//         .attr("d", lineGrensvalLow);
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#fa4515")
//         .attr("stroke-width", 1)
//         .attr("d", lineGrensvalHigh);
// }
//
// d3.json('../../assets/lab.json').then(function (data) {
//     labData = data.map(d => ({
//         ...d,
//         DateTime: parseDateTime(d.DateTime),
//         UITSLAG: Number(d.UITSLAG),
//         GRENSVAL: parseGrensvalRange(d.GRENSVAL) // Parse here
//     }));
//     labData.sort((a, b) => a.DateTime - b.DateTime);
//     createLabChart(labData);
// }).catch(error => {
//     console.error('Error fetching the lab data:', error);
// });
//
// window.addEventListener("resize", function () {
//     createLabChart(labData);
// });

// function parseGrensvalRange(grensval) {
//     if (typeof grensval === 'string') {
//         return grensval.split('-').map(Number);
//     }
//     return grensval;
// }
//
// const margin = {top: 30, right: 30, bottom: 80, left: 60};
// let labData;
//
// function createLabChart(data) {
//     const element = document.getElementById('labChart');
//     const width = element.clientWidth - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;
//
//     d3.select("#labChart").select("svg").remove();
//
//     const svg = d3.select("#labChart")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     // Setting the x-axis domain based on the DateTime range
//     const x = d3.scaleTime()
//         .domain(d3.extent(data, d => parseDateTime(d.DateTime)))
//         .range([0, width]);
//
//     // Setting the y-axis domain based on the min and max of GRENSVAL
//     const y = d3.scaleLinear()
//         .domain([
//             d3.min(data, d => d.GRENSVAL[0]),
//             d3.max(data, d => d.GRENSVAL[1])
//         ])
//         .range([height, 0])
//
//     // Adding x-axis with short date notation
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
//         .selectAll("text")
//         .attr("transform", "rotate(-45)")
//         .style("text-anchor", "end");
//
//     // Adding y-axis
//     svg.append("g").call(d3.axisLeft(y));
//
//     // Line for UITSLAG
//     const lineUitslag = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(Number(d.UITSLAG)));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "red")
//         .attr("stroke-width", 1.5)
//         .attr("d", lineUitslag);
//
//     // Lines for GRENSVAL
//     const lineGrensvalLow = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(parseGrensvalRange(d.GRENSVAL)[0]));
//
//     const lineGrensvalHigh = d3.line()
//         .x(d => x(parseDateTime(d.DateTime)))
//         .y(d => y(parseGrensvalRange(d.GRENSVAL)[1]));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#ef3402")
//         .attr("stroke-width", 1)
//         .attr("d", lineGrensvalLow);
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#fa4515")
//         .attr("stroke-width", 1)
//         .attr("d", lineGrensvalHigh);
// }
//
// d3.json('../../assets/lab.json').then(function (data) {
//     labData = data.map(d => ({
//         ...d,
//         DateTime: parseDateTime(d.DateTime),
//         UITSLAG: Number(d.UITSLAG),
//         GRENSVAL: parseGrensvalRange(d.GRENSVAL)
//     }));
//     labData.sort((a, b) => a.DateTime - b.DateTime);
//     createLabChart(labData);
// }).catch(error => {
//     console.error('Error fetching the lab data:', error);
// });
// window.addEventListener("resize", function() {
//     createLabChart(labData);
// });

// const svg = d3.select('body').append('svg')
//     .attr('width', '100%')
//     .attr('height', '500')
//     .attr('viewBox', '0 0 960 500');
//
// // Parse the date / time
// const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
//
// // Set the ranges
// const x = d3.scaleTime().range([0, 960]);
// const y = d3.scaleLinear().range([500, 0]);
//
// // Define the line
// const valueline = d3.line()
//     .x(function(d) { return x(d.DateTime); })
//     .y(function(d) { return y(d.UITSLAG); });
//
// // Get the data (here we would use the JSON you provided)
// d3.json('../../assets/lab.json').then(function(data) {
//
//     // Format the data
//     data.forEach(function(d) {
//         d.DateTime = parseTime(d.DateTime);
//         d.UITSLAG = +d.UITSLAG;
//     });
//
//     // Scale the range of the data
//     x.domain(d3.extent(data, function(d) { return d.DateTime; }));
//     y.domain([0, d3.max(data, function(d) { return d.UITSLAG; })]);
//
//     // Add the valueline path
//     svg.append('path')
//         .data([data])
//         .attr('class', 'line')
//         .attr('d', valueline);
//
//     // Add the X Axis
//     svg.append('g')
//         .attr('transform', 'translate(0,' + 500 + ')')
//         .call(d3.axisBottom(x));
//
//     // Add the Y Axis
//     svg.append('g')
//         .call(d3.axisLeft(y));
// });
