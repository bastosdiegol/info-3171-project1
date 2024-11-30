/**
 * @function getChart4
 * @description The top 5 YouTube channels' average view changes every year, grouped by channel
 */
function getChart4() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = { top: 50, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const chartTitle = "Top 5 YouTube Channels' Views by Year";

  // Chart Settings: Create a responsive SVG inside #chart-4
  const svg = d3
    .select("#chart-4")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Group for the chart
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Chart Title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("fill", PRIMARY_COLOUR)
    .text(chartTitle);

  // Reading CSV
  d3.csv("../data/avg_view_every_year.csv").then((data) => {
    // Parse numeric values and extract channels and years
    data.forEach((d) => {
      d.Views = +d.Views;
    });

    const channels = [...new Set(data.map((d) => d.Channel))];
    const years = [...new Set(data.map((d) => d.Year))];

    // Colours from project palette + additional colour
    const colours = [
      PRIMARY_COLOUR,
      INFO_COLOUR,
      DARK_COLOUR,
      SECONDARY_COLOUR,
      "#E97132",
      "#B3A913",
    ];

    // Scales
    const yScale = d3
      .scaleBand()
      .domain(channels)
      .range([0, innerHeight])
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Views)])
      .range([0, innerWidth]);

    // Axes
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).ticks(6);

    // Append Axes
    chartGroup.append("g")
      .call(yAxis)
      .selectAll(".tick text")
      .text((d) => (d.length > 10 ? `${d.substring(0, 10)}...` : d))
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .append("title")
      .text((d) => d);

    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    // Group data by channel
    const groupedData = d3.group(data, (d) => d.Channel);

    // Bars and labels
    groupedData.forEach((channelData, channel, index) => {
      const group = chartGroup
        .append("g")
        .attr("transform", `translate(0, ${yScale(channel)})`);

      group
        .selectAll("rect")
        .data(channelData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => yScale.bandwidth() * (years.indexOf(d.Year) / years.length))
        .attr("width", (d) => xScale(d.Views))
        .attr("height", yScale.bandwidth() / years.length - 2)
        .attr("fill", (d) => colours[years.indexOf(d.Year) % colours.length]);

      group
        .selectAll("text")
        .data(channelData)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.Views) + 5)
        .attr("y", (d) => yScale.bandwidth() * (years.indexOf(d.Year) / years.length) + yScale.bandwidth() / years.length / 2)
        .attr("dy", "0.35em")
        .style("font-size", "8px")
        .style("fill", DARK_COLOUR)
        .text((d) => d.Views.toLocaleString());
    });

    // Legends under x-axis
    const legendGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left}, ${height - margin.bottom + 20})`
      );

    years.forEach((year, i) => {
      const legend = legendGroup
        .append("g")
        .attr("transform", `translate(${i * 80}, 0)`);

      legend
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colours[i % colours.length]);

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "12px")
        .text(year);
    });
  });
}