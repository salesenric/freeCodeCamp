const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

d3.json(url).then(data => {
    const width = 800;
    const height = 600;

    const svg = d3.select('#chart')
        .attr('width', width)
        .attr('height', height);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(1)(root);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const tiles = svg.selectAll('.tile')
        .data(root.leaves())
        .enter().append('g')
        .attr('class', 'tile')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`${d.data.name}<br>Value: ${d.data.value}`)
                .attr('data-value', d.data.value)
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
            d3.select('#tooltip').style('opacity', 0);
        });

    tiles.append('rect')
        .attr('class', 'tile')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('fill', d => colorScale(d.data.category));

    // Create the legend
    const legend = d3.select('#legend');
    const categories = [...new Set(root.leaves().map(d => d.data.category))];
    
    categories.forEach((category, i) => {
        const legendItem = legend.append('div')
            .attr('class', 'legend-item')
            .style('background-color', colorScale(category))
            .text(category);

        legendItem.append('rect')
            .attr('class', 'legend-item')
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', colorScale(category));
    });
});
