/**
 * @function getChart3
 * @description Displays total number of YouTube channels by country
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart3() {
    // Chart Variables and Constants
    const width = 540;
    const height = 320;
    const margin = {top: 40, right: 30, bottom: 60, left: 60};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const chartTitle = "Total YouTube Channels by Country";

    // Create SVG container
    const svg = d3
        .select("#chart-3")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "auto")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")

    // Create chart group and apply margins
    const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", PRIMARY_COLOUR)
        .text(chartTitle);

    // Read and process data
    d3.csv("../data/top_100_youtubers.csv").then((data) => {
        // Count channels by country
        const countryTotals = d3.rollup(data, v => v.length, d => d.Country);

        // Convert Map to array and sort by count
        const countryData = Array.from(countryTotals, ([country, count]) => ({
            country, count
        })).sort((a, b) => b.count - a.count);

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(countryData.map(d => d.country))
            .range([0, chartWidth])
            .padding(0.2);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(countryData, d => d.count)])
            .range([chartHeight, 0])
            .nice();

        // Create and add axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Add X axis
        chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        // Add Y axis
        chart
            .append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add Y axis label
        chart
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -chartHeight / 2)
            .attr("text-anchor", "middle")
            .text("Number of Channels");

        // Create color scale
        const colorScale = d3
            .scaleSequential()
            .domain([0, d3.max(countryData, d => d.count)])
            .interpolator(d3.interpolateRgbBasis([INFO_COLOUR, SECONDARY_COLOUR, PRIMARY_COLOUR]));

        // Add bars
        chart
            .selectAll("rect")
            .data(countryData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.count))
            .attr("fill", d => colorScale(d.count))
            .attr("title", d => `${d.country}: ${d.count} channels`);

        // Add value labels on top of bars
        chart
            .selectAll(".value-label")
            .data(countryData)
            .enter()
            .append("text")
            .attr("class", "value-label")
            .attr("x", d => xScale(d.country) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.count) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(d => d.count);
    });
}