const margin = { top: 40, right: 20, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#heatmap")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#tooltip");

// Load data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(data => {
    const dataset = data.monthlyVariance;
    const baseTemperature = data.baseTemperature;

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from(new Set(dataset.map(d => d.year)));

    const xScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(months)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)]);

    // Create axes
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale));

    // Create cells
    svg.selectAll(".cell")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "cell")
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(months[d.month - 1]))
        .attr("fill", d => colorScale(d.variance))
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`Year: ${d.year}<br>Month: ${months[d.month - 1]}<br>Temperature: ${(baseTemperature + d.variance).toFixed(1)} °C`)
                .attr("data-year", d.year)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Create legend
    const legend = d3.select("#legend")
        .attr("id", "legend")
        .style("display", "flex")
        .style("justify-content", "center");

    const legendColors = colorScale.ticks().map(d => colorScale(d));

    legendColors.forEach(color => {
        legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color)
            .style("margin", "0 5px");
    });
});
