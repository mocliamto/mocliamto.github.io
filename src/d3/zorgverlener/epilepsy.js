const margin = {top: 20, right: 30, bottom: 50, left: 50},
    width = 550 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

function createBarChart(data, elementId, xValue, yValue) {
    const svg = d3.select("#" + elementId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const processedData = data
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
        .map(d => ({date: new Date(d[xValue]), value: d[yValue]}));

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(processedData.map(d => d.date))
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
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

    const svg = d3.select("#" + elementId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const processedData = data
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
        .map(d => ({date: new Date(d[xValue]), value: d[yValue]}));

    // Add X axis
    const x = d3.scaleTime()
        // .domain(d3.extent(processedData, d => d.date))
        .domain(d3.extent(data, d => new Date(d[xValue])))

        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));


    // Add Y axis
    const y = d3.scaleLinear()
        // .domain([0, d3.max(processedData, d => d.value)])
        .domain([0, d3.max(data, d => d[yValue])])

        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
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

d3.json('../../assets/epilepsy.json').then(function (data) {
    // Create Seizure Chart
    createBarChart(data.Aanvalsregistratie, 'seizureChart', 'datum', 'aantal');

    // Create Medication Chart
    createLineChart(data.Medicatie, 'medicationChart', 'datum', 'dosis');

    // Create PDD Chart
    createLineChart(data.PDD_DDD, 'pddChart', 'datum', 'PDD_DDD_waarde');

    // Create Lab Results Chart
    createLineChart(data.Labuitslagen_en_ketonen, 'labResultsChart', 'datum', 'ketonen_mmol_l');
}).catch(error => {
    console.error("Error fetching the data: ", error);
});


// // Common dimensions and margins
// const margin = { top: 20, right: 30, bottom: 40, left: 50 },
//     width = 600 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
//
// // Function to create a bar chart
// function createBarChart(data, elementId, xValue, yValue) {
//     const svg = d3.select('#' + id)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     const x = d3.scaleBand()
//         .range([0, width])
//         .domain(data.map((d, i) => 'Week ' + (i + 1)))
//         .padding(0.2);
//
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .style("text-anchor", "end");
//
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data)])
//         .range([height, 0]);
//
//     svg.append("g")
//         .call(d3.axisLeft(y));
//
//     svg.selectAll("mybar")
//         .data(data)
//         .join("rect")
//         .attr("x", (d, i) => x('Week ' + (i + 1)))
//         .attr("y", d => y(d))
//         .attr("width", x.bandwidth())
//         .attr("height", d => height - y(d))
//         .attr("fill", "#69b3a2");
// }
//
// function createLineChart(data, elementId, xValue, yValue) {
//     const svg = d3.select('#' + id)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     const x = d3.scaleLinear()
//         .domain([1, data.length])
//         .range([0, width]);
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).ticks(data.length));
//
//     const y = d3.scaleLinear()
//         .domain([d3.min(data), d3.max(data)])
//         .range([height, 0]);
//     svg.append("g").call(d3.axisLeft(y));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#ff6f61")
//         .attr("stroke-width", 1.5)
//         .attr("d", d3.line()
//             .x((d, i) => x(i + 1))
//             .y(d => y(d))
//         );
// }
//
// // Load and process data
// d3.json('../../assets/epilepsy.json').then(function(data) {
//     // Create Seizure Chart
//     createBarChart(data.Aanvalsregistratie, 'seizureChart', 'datum', 'aantal');
//
//     // Create Medication Chart
//     createLineChart(data.Medicatie, 'medicationChart', 'datum', 'dosis');
//
//     // Create PDD Chart
//     createLineChart(data.PDD_DDD, 'pddChart', 'datum', 'PDD_DDD_waarde');
//
//     // Create Lab Results Chart
//     createLineChart(data.Labuitslagen_en_ketonen, 'labResultsChart', 'datum', 'ketonen_mmol_l');
// }).catch(error => {
//     console.error("Error fetching the data: ", error);
// });

// d3.json('../../assets/epilepsy.json').then(function(data) {
//
//     const aanvalsregistratieData = data.Aanvalsregistratie
//         .sort((a, b) => new Date(a.datum) - new Date(b.datum))
//         .map(d => ({ date: new Date(d.datum), value: d.aantal }));
//
//     const medicatieData = data.Medicatie
//         .sort((a, b) => new Date(a.datum) - new Date(b.datum))
//         .map(d => ({ date: new Date(d.datum), value: d.dosis }));
//
//     // Set the dimensions and margins of the graph
//     const margin = { top: 10, right: 30, bottom: 30, left: 60 },
//         width = 460 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;
//
//     // Append the svg object to the body of the page
//     const svg = d3.select("#medicationChart")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
//
//     const svg = d3.select("#seizureChart")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
//
//     // X axis
//     const x = d3.scaleTime()
//         .domain(d3.extent(medicatieData, d => d.date))
//         .range([0, width]);
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x));
//
//     const x = d3.scaleBand()
//         .range([0, width])
//         .domain(aanvalsregistratieData.map(d => d.date))
//         .padding(0.2);
//     svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")))
//         .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-45)")
//         .style("text-anchor", "end");
//
//     // Y axis
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(medicatieData, d => d.value)])
//         .range([height, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(y));
//
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(aanvalsregistratieData, d => d.value)])
//         .range([height, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(y));
//
//     // the line
//     svg.append("path")
//         .datum(medicatieData)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5)
//         .attr("d", d3.line()
//             .x(d => x(d.date))
//             .y(d => y(d.value))
//         );
//
//     svg.selectAll("mybar")
//         .data(aanvalsregistratieData)
//         .join("rect")
//         .attr("x", d => x(d.date))
//         .attr("y", d => y(d.value))
//         .attr("width", x.bandwidth())
//         .attr("height", d => height - y(d.value))
//         .attr("fill", "#69b3a2");
//
// }).catch(error => {
//     console.error("Error fetching the data: ", error);
// });
//
//
// const margin = {top: 20, right: 30, bottom: 40, left: 50},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
//
// const seizureData = [3, 2, 5, 1];
// const medicationData = [300, 350, 320, 310];
// const pddData = [{name: 'Drug A', PDD: 300, DDD: 250}, {name: 'Drug B', PDD: 200, DDD: 250}, {
//     name: 'Drug C',
//     PDD: 400,
//     DDD: 500
// }];
// const labResultsData = [1.2, 1.5, 1.3, 1.4];
//
// createBarChart('seizureChart', seizureData, 'Seizures');
//
// createBarChart('medicationChart', medicationData, 'Dosage (mg)');
//
// createGroupedBarChart('pddChart', pddData);
//
// createLineChart('labResultsChart', labResultsData, 'Lab Value');
//
// function createBarChart(id, data, label) {
//     const svg = d3.select('#' + id)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     const x = d3.scaleBand()
//         .range([0, width])
//         .domain(data.map((d, i) => 'Week ' + (i + 1)))
//         .padding(0.2);
//
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .style("text-anchor", "end");
//
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data)])
//         .range([height, 0]);
//
//     svg.append("g")
//         .call(d3.axisLeft(y));
//
//     svg.selectAll("mybar")
//         .data(data)
//         .join("rect")
//         .attr("x", (d, i) => x('Week ' + (i + 1)))
//         .attr("y", d => y(d))
//         .attr("width", x.bandwidth())
//         .attr("height", d => height - y(d))
//         .attr("fill", "#69b3a2");
// }
//
// function createGroupedBarChart(id, data) {
//     const svg = d3.select('#' + id)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     const x0 = d3.scaleBand()
//         .range([0, width])
//         .domain(data.map(d => d.name))
//         .padding(0.2);
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x0));
//
//     const x1 = d3.scaleBand()
//         .domain(['PDD', 'DDD'])
//         .range([0, x0.bandwidth()])
//         .padding(0.05);
//
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data, d => Math.max(d.PDD, d.DDD))])
//         .range([height, 0]);
//     svg.append("g").call(d3.axisLeft(y));
//
//     const group = svg.selectAll("g.layer")
//         .data(data)
//         .join("g")
//         .attr("transform", d => `translate(${x0(d.name)}, 0)`);
//
//     group.selectAll("rect")
//         .data(d => [{key: 'PDD', value: d.PDD}, {key: 'DDD', value: d.DDD}])
//         .join("rect")
//         .attr("x", d => x1(d.key))
//         .attr("y", d => y(d.value))
//         .attr("width", x1.bandwidth())
//         .attr("height", d => height - y(d.value))
//         .attr("fill", d => d.key === 'PDD' ? "#6b5b95" : "#feb236");
// }
//
// function createLineChart(id, data, label) {
//     const svg = d3.select('#' + id)
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     const x = d3.scaleLinear()
//         .domain([1, data.length])
//         .range([0, width]);
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).ticks(data.length));
//
//     const y = d3.scaleLinear()
//         .domain([d3.min(data), d3.max(data)])
//         .range([height, 0]);
//     svg.append("g").call(d3.axisLeft(y));
//
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "#ff6f61")
//         .attr("stroke-width", 1.5)
//         .attr("d", d3.line()
//             .x((d, i) => x(i + 1))
//             .y(d => y(d))
//         );
// }