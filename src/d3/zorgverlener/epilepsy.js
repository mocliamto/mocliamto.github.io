// Define dimensions and margins for the charts
const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Mock data
const seizureData = [3, 2, 5, 1];
const medicationData = [300, 350, 320, 310];
const pddData = [{name: 'Drug A', PDD: 300, DDD: 250}, {name: 'Drug B', PDD: 200, DDD: 250}, {
    name: 'Drug C',
    PDD: 400,
    DDD: 500
}];
const labResultsData = [1.2, 1.5, 1.3, 1.4];

// Seizure chart
createBarChart('seizureChart', seizureData, 'Seizures');

// Medication chart
createBarChart('medicationChart', medicationData, 'Dosage (mg)');

// PDD/DDD chart
createGroupedBarChart('pddChart', pddData);

// Lab results chart
createLineChart('labResultsChart', labResultsData, 'Lab Value');

// Function to create a basic bar chart
function createBarChart(id, data, label) {
    const svg = d3.select('#' + id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d, i) => 'Week ' + (i + 1)))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x('Week ' + (i + 1)))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", "#69b3a2");
}

// Function to create a grouped bar chart
function createGroupedBarChart(id, data) {
    // TODO: Implement the grouped bar chart function
}

// Function to create a line chart
function createLineChart(id, data, label) {
    // TODO: Implement the line chart function
}

//
// // save the D3.js content to a file
// d3_file_path = '/mnt/data/epilepsy_monitoring_graph_d3.html'
// with open(d3_file_path, 'w') as file:
//     file.write(d3_template)
//
// d3_file_path

