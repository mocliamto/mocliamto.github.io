const valueRanges = [
    'ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10',
    'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'
];
const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
const lineWidth = [2, 2, 2, 2, 3];
const margin = {top: 30, right: 45, bottom: 60, left: 45};

let growData, tnoData;

function createLineChart() {
    const element = document.getElementById('growthCurveChart');
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientWidth - margin.top - margin.bottom;

    d3.select("#growthCurveChart").select("svg").remove();

    const svg = d3.select("#growthCurveChart")
        .append("svg")
        .attr("width", "100%")
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
        const dataset = tnoData.map(d => ({ month: d.StapNummer, value: d[range] }));

        svg.append("path")
            .data([dataset])
            .attr("stroke", lineColors[index % lineColors.length])
            .attr("stroke-width", lineWidth[index % lineWidth.length])
            .attr("fill", "rgba(222,236,220,0.55)")
            .attr("d", line);
    });

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("fill", "#000")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Leeftijd (maanden)");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 3)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Lengte (cm)");

    svg.append("text")
        .attr("class", "chart-title")
        .attr("fill", "#000")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Lengte-Leeftijd 0-15 maanden");

    const userValues = growData.map(d => ({ month: d.LeeftijdInMaanden, value: d.Lengte }));
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

    // gridline
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15).tickSize(-height).tickFormat(""));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks((92 - 40) / 2).tickSize(-width).tickFormat(""));

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight).ticks((92 - 40) / 2).tickSize(-width).tickFormat(""));

}

async function loadData() {
    try {
        const [dataGrow, dataTno] = await Promise.all([
            fetch('../assets/data/grow.json').then(response => response.json()),
            fetch('../assets/data/tno.json').then(response => response.json())
        ]);

        growData = dataGrow;
        tnoData = dataTno;
        createLineChart();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

loadData();

window.addEventListener("resize", createLineChart);