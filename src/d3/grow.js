const margin = {top: 40, right: 40, bottom: 60, left: 60};
let growData, tnoData;
const lineColors = ['#c3dec1', '#c3dec1', '#c3dec1', '#c3dec1', '#a1c2a3'];
const fills = [false, false, '+1', '+1', '+1', '+1', '+1'];
const lineWidth = [2, 2, 2, 2, 3];
const labelMapping = {
    'ValueMin30': '-3',
    'ValueMin25': '-2,5',
    'ValueMin20': '-2',
    'ValueMin10': '-1',
    'Value0': '0',
    'ValuePlus10': '+1',
    'ValuePlus20': '+2',
    'ValuePlus25': '+2,5'
};
const valueRanges = ['ValueMin30', 'ValueMin25', 'ValueMin20', 'ValueMin10', 'Value0', 'ValuePlus10', 'ValuePlus20', 'ValuePlus25'];

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

    x.domain([0, 15]);
    y.domain([40, 92]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15))
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks((92 - 40) / 2))
        .style("font-size", "12px");

    const yRight = d3.scaleLinear().range([height, 0]);
    yRight.domain([40, 92]);

    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight).ticks((92 - 40) / 2))
        .style("font-size", "12px");

    valueRanges.forEach((range, index) => {
        const dataset = tnoData.map(d => ({month: d.StapNummer, value: d[range]}));
        const curve = range.includes("grow") ? d3.curveLinear : d3.curveMonotoneX;
        const area = d3.area()
            .x(d => x(d.month))
            .y0(height)
            .y1(d => y(d.value))
            .curve(curve);

        svg.append("path")
            .data([dataset])
            .attr("class", `area-${range}`)
            .attr("fill", fills[index % fills.length] === '+1' ? "rgba(222,236,220,0.55)" : "none")
            .attr("d", area.y0(d => y(d.value.ValuePlus20)));

        svg.append("path")
            .data([dataset])
            .attr("class", `line-${range}`)
            .attr("stroke", lineColors[index % lineColors.length])
            .attr("stroke-width", lineWidth[index % lineWidth.length])
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(d => x(d.month))
                .y(d => y(d.value))
                .curve(curve)
            );

        const lastDataPoint = dataset[dataset.length - 1];
        if (lastDataPoint) {
            svg.append("text")
                .attr("class", `label-${range}`)
                .attr("x", x(lastDataPoint.month))
                .attr("y", y(lastDataPoint.value))
                .attr("dx", width * 0.17)
                .attr("dy", -height * 0.07)
                .style("font-size", "13px")
                .text(labelMapping[range]);
        }
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
        .style("font-size", "14px")
        .text("Lengte-Leeftijd 0-15 maanden");

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