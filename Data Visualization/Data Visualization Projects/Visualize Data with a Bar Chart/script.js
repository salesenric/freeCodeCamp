const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const margin = { top: 50, right: 50, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(url).then(data => {
  const dataset = data.data;

  const parseDate = d3.timeParse("%Y-%m-%d");
  const dates = dataset.map(d => parseDate(d[0]));

  const xScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));

  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  // Create tooltip div once
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("padding", "8px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Create bars
  svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(parseDate(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", width / dataset.length)
    .attr("height", d => height - yScale(d[1]))
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip.html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
        .attr("data-date", d[0]) // Efficient date matching
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(100).style("opacity", 0);
    });
});
