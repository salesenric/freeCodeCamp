const width = 800;
const height = 500;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };

// Load data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(data => {
    const svg = d3.select("#scatterplot")
                  .attr("width", width)
                  .attr("height", height);

    // X Scale
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
                     .range([margin.left, width - margin.right]);

    // Y Scale
    const yScale = d3.scaleTime()
                     .domain([d3.min(data, d => new Date(d.Seconds * 1000)),
                              d3.max(data, d => new Date(d.Seconds * 1000))])
                     .range([height - margin.bottom, margin.top]);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(xAxis);

    // Y Axis
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(yAxis);

    // Scatterplot Dots
    svg.selectAll(".dot")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("data-xvalue", d => d.Year)
       .attr("data-yvalue", d => new Date(d.Seconds * 1000))
       .attr("cx", d => xScale(d.Year))
       .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
       .attr("r", 5)
       .attr("fill", "blue")
       .on("mouseover", (event, d) => {
         d3.select("#tooltip")
           .style("opacity", 1)
           .attr("data-year", d.Year)
           .html(`Year: ${d.Year}<br>Time: ${d.Time}`);
       })
       .on("mouseout", () => {
         d3.select("#tooltip").style("opacity", 0);
       });

    // Legend
    const legend = svg.append("g").attr("id", "legend");
    // Add legend items as necessary
  });
