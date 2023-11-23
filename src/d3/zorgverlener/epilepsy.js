const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const seizureData = [3, 2, 5, 1];
const medicationData = [300, 350, 320, 310];
const pddData = [{name: 'Drug A', PDD: 300, DDD: 250}, {name: 'Drug B', PDD: 200, DDD: 250}, {
    name: 'Drug C',
    PDD: 400,
    DDD: 500
}];
const labResultsData = [1.2, 1.5, 1.3, 1.4];

createBarChart('seizureChart', seizureData, 'Seizures');

createBarChart('medicationChart', medicationData, 'Dosage (mg)');

createGroupedBarChart('pddChart', pddData);

createLineChart('labResultsChart', labResultsData, 'Lab Value');

function createBarChart(id, data, label) {
    const svg = d3.select('#' + id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d, i) => 'Week ' + (i + 1)))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x('Week ' + (i + 1)))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", "#69b3a2");
}

function createGroupedBarChart(id, data) {
    const svg = d3.select('#' + id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x0 = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.name))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    const x1 = d3.scaleBand()
        .domain(['PDD', 'DDD'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.PDD, d.DDD))])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const group = svg.selectAll("g.layer")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x0(d.name)}, 0)`);

    group.selectAll("rect")
        .data(d => [{key: 'PDD', value: d.PDD}, {key: 'DDD', value: d.DDD}])
        .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => d.key === 'PDD' ? "#6b5b95" : "#feb236");
}

function createLineChart(id, data, label) {
    const svg = d3.select('#' + id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .domain([1, data.length])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(data.length));

    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ff6f61")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d, i) => x(i + 1))
            .y(d => y(d))
        );
}