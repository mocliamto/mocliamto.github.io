fetch("../../assets/grow.json")
    .then(response => response.json())
    .then(growthData => {

// Define dimensions and margins for the chart
        const margin = {top: 10, right: 30, bottom: 30, left: 50},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

// Append the svg object to the div
        const svg = d3.select("#growthCurveChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse data to ensure the types are correct
        growthData.forEach(d => {
            d.LeeftijdInMaanden = +d.LeeftijdInMaanden; // Convert to number if necessary
            d.Lengte = +d.Lengte; // Convert to number if necessary
        });

// Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(growthData, d => d.LeeftijdInMaanden)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

// Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(growthData, d => d.Lengte)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

// Add the line
        svg.append("path")
            .datum(growthData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.LeeftijdInMaanden))
                .y(d => y(d.Lengte))
            );

// Add dots
        svg.selectAll("dot")
            .data(growthData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.LeeftijdInMaanden))
            .attr("cy", d => y(d.Lengte))
            .attr("r", 5)
            .attr("fill", "green");
    })
    .catch(error => console.error('Error fetching the JSON data:', error));