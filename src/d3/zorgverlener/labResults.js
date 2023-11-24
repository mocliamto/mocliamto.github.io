const margin = {top: 30, right: 30, bottom: 30, left: 60};
let labData;

function parseDateTime(dateTime) {
    return d3.isoParse(dateTime);
}

function parseGrensval(grensval) {
    const [low, high] = grensval.split('-').map(Number);
    return (low + high) / 2;
}

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

    // X as
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => parseDateTime(d.DateTime)))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Y as
    const y = d3.scaleLinear()
        .domain([
            d3.min(data, d => Number(d.UITSLAG)),
            d3.max(data, d => parseGrensval(d.GRENSVAL))
        ])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "#ffeda0")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(d => x(parseDateTime(d.DateTime)))
            .y0(height)
            .y1(d => y(parseGrensval(d.GRENSVAL)))
        );

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(parseDateTime(d.DateTime)))
            .y(d => y(Number(d.UITSLAG)))
        );
}

d3.json('../../assets/lab.json').then(function (data) {
    labData = data;
    createLabChart(labData);
})
    .catch(error => {
        console.error('Error fetching the lab data:', error);
    });

window.addEventListener("resize", function () {
    createLabChart(labData);
});
