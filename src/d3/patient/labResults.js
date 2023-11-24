// const margin = {top: 30, right: 30, bottom: 80, left: 60};
// let labData;
//
// function parseDateTime(dateTime) {
//     return d3.isoParse(dateTime);
// }
//
// function parseGrensval(grensval) {
//     const [low, high] = grensval.split('-').map(Number);
//     return (low + high) / 2;
// }
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
//     // X as
//     const x = d3.scaleTime()
//         .domain(d3.extent(data, d => parseDateTime(d.DateTime)))
//         .range([0, width]);
//
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
//
//         .selectAll("text")
//         .attr("transform", "rotate(-45)")
//         .style("text-anchor", "end");
//
//     // Y as
//     const y = d3.scaleLinear()
//         .domain([
//             d3.min(data, d => Number(d.UITSLAG)),
//             d3.max(data, d => parseGrensval(d.GRENSVAL))
//         ])
//         .range([height, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(y));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "#ffeda0")
//         .attr("stroke", "none")
//         .attr("d", d3.area()
//             .x(d => x(parseDateTime(d.DateTime)))
//             .y0(height)
//             .y1(d => y(parseGrensval(d.GRENSVAL)))
//         );
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "red")
//         .attr("stroke-width", 1.5)
//         .attr("d", d3.line()
//             .x(d => x(parseDateTime(d.DateTime)))
//             .y(d => y(Number(d.UITSLAG)))
//         );
// }
//
// d3.json('../../assets/lab.json').then(function (data) {
//     labData = data;
//     createLabChart(labData);
// })
//     .catch(error => {
//         console.error('Error fetching the lab data:', error);
//     });
//
// window.addEventListener("resize", function () {
//     createLabChart(labData);
// });

function parseDateTime(dateTime) {
    return d3.isoParse(dateTime);
}

function parseGrensvalRange(grensval) {
    if (typeof grensval === 'string') {
        return grensval.split('-').map(Number);
    }
    return grensval;
}

const margin = {top: 30, right: 30, bottom: 80, left: 60};
let labData;

function createLabChart(data) {
    const element = document.getElementById('labChart');
    const width = element.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#labChart").select("svg").remove();

    const svg = d3.select("#labChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setting the x-axis domain based on the DateTime range
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => parseDateTime(d.DateTime)))
        .range([0, width]);

    // Setting the y-axis domain based on the min and max of GRENSVAL
    const y = d3.scaleLinear()
        .domain([
            d3.min(data, d => d.GRENSVAL[0]),
            d3.max(data, d => d.GRENSVAL[1])
        ])
        .range([height, 0])

    // Adding x-axis with short date notation
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Adding y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Line for UITSLAG
    const lineUitslag = d3.line()
        .x(d => x(parseDateTime(d.DateTime)))
        .y(d => y(Number(d.UITSLAG)));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", lineUitslag);

    // Lines for GRENSVAL
    const lineGrensvalLow = d3.line()
        .x(d => x(parseDateTime(d.DateTime)))
        .y(d => y(parseGrensvalRange(d.GRENSVAL)[0]));

    const lineGrensvalHigh = d3.line()
        .x(d => x(parseDateTime(d.DateTime)))
        .y(d => y(parseGrensvalRange(d.GRENSVAL)[1]));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ef3402")
        .attr("stroke-width", 1)
        .attr("d", lineGrensvalLow);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#fa4515")
        .attr("stroke-width", 1)
        .attr("d", lineGrensvalHigh);
}

d3.json('../../assets/lab.json').then(function (data) {
    labData = data.map(d => ({
        ...d,
        DateTime: parseDateTime(d.DateTime),
        UITSLAG: Number(d.UITSLAG),
        GRENSVAL: parseGrensvalRange(d.GRENSVAL)
    }));
    labData.sort((a, b) => a.DateTime - b.DateTime);
    createLabChart(labData);
}).catch(error => {
    console.error('Error fetching the lab data:', error);
});

window.addEventListener("resize", function() {
    createLabChart(labData);
});


// Fetching and processing data

//
// window.addEventListener("resize", function() {
//     createLabChart(labData);
// });

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
//                 // .domain([
//                 //     d3.min(data, d => Math.min(...parseGrensvalRange(d.GRENSVAL))),
//                 //     d3.max(data, d => Math.max(...parseGrensvalRange(d.GRENSVAL)))
//                 // ])
//         ])
//         .range([height, 0]);
//
//     // Adding x-axis with short date notation
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d"))); // Short date format
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
//
