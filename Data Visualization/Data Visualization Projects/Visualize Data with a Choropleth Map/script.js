const width = 960;
const height = 600;

const svg = d3.select("#choropleth");
const path = d3.geoPath();
const tooltip = d3.select("#tooltip");

const countiesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

Promise.all([d3.json(countiesURL), d3.json(educationURL)]).then(
  ([countyData, educationData]) => {
    const educationById = {};
    educationData.forEach((d) => {
      educationById[d.fips] = d;
    });

    const colorScale = d3
      .scaleQuantize()
      .domain([
        d3.min(educationData, (d) => d.bachelorsOrHigher),
        d3.max(educationData, (d) => d.bachelorsOrHigher)
      ])
      .range(d3.schemeBlues[9]); // Cumple con el User Story #4 y #9

    svg
      .append("g")
      .selectAll("path")
      .data(topojson.feature(countyData, countyData.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "county") // Cumple con el User Story #3
      .attr("d", path)
      .attr("fill", (d) => {
        const county = educationById[d.id];
        return county ? colorScale(county.bachelorsOrHigher) : "#ccc";
      })
      .attr("data-fips", (d) => d.id) // Cumple con el User Story #5
      .attr("data-education", (d) =>
        educationById[d.id] ? educationById[d.id].bachelorsOrHigher : 0
      ) // Cumple con el User Story #5
      .on("mouseover", (event, d) => {
        const county = educationById[d.id];
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
          )
          .attr("data-education", county.bachelorsOrHigher) // Cumple con el User Story #11
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Cumple con el User Story #6 y #7
    // Leyenda
    const legend = svg
      .append("g")
      .attr("id", "legend") // Cumple con el User Story #8
      .attr("transform", "translate(600, 40)");

    const legendScale = d3
      .scaleLinear()
      .domain([
        d3.min(educationData, (d) => d.bachelorsOrHigher),
        d3.max(educationData, (d) => d.bachelorsOrHigher)
      ])
      .range([0, 300]);

    const legendColors = d3.schemeBlues[9]; // Cumple con el User Story #9

    const legendStep =
      (d3.max(educationData, (d) => d.bachelorsOrHigher) -
        d3.min(educationData, (d) => d.bachelorsOrHigher)) /
      legendColors.length;

    legend
      .selectAll("rect")
      .data(legendColors)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 10)
      .attr("fill", (d) => d);

    legend
      .append("g")
      .selectAll("text")
      .data(legendColors)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * 30)
      .attr("y", 25)
      .text((d, i) => {
        return (
          Math.round(
            (d3.min(educationData, (d) => d.bachelorsOrHigher) +
              i * legendStep) *
              100
          ) / 100
        );
      });
  }
);
