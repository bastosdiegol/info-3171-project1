/**
 * @function getChart2
 * @description Relationship between the 'Likes' and 'followers' with a trend line
 */
function getChart2() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = { top: 50, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const chartTitle = "Likes vs Subscribers";

  // Chart Settings
  const svg = d3
    .select("#chart-2")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")

  // Chart Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", PRIMARY_COLOUR)
    .text(chartTitle);

  // Group for Chart Area
  const chartArea = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    // Ensure numeric data
    data.forEach((d) => {
      d.Likes = +d.Likes;
      d.followers = +d.followers;
    });

    // Define Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.followers)])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Likes)])
      .range([innerHeight, 0]);

    // Append Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => {
        if (d >= 1e9) return `${(d / 1e9).toFixed(1)}B`; // Billions
        if (d >= 1e6) return `${(d / 1e6).toFixed(1)}M`; // Millions
        if (d >= 1e3) return `${(d / 1e3).toFixed(1)}K`; // Thousands
        return d; // Smaller than 1000
      });

    const yAxis = d3.axisLeft(yScale)
      .ticks(6)
      .tickFormat((d) => {
        if (d >= 1e9) return `${(d / 1e9).toFixed(1)}B`; // Billions
        if (d >= 1e6) return `${(d / 1e6).toFixed(1)}M`; // Millions
        if (d >= 1e3) return `${(d / 1e3).toFixed(1)}K`; // Thousands
        return d; // Smaller than 1000
      });

    chartArea
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .append("text")
      .attr("fill", "black")
      .attr("x", innerWidth / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text("Subscribers");

    chartArea
      .append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .text("Likes");

    // Scatterplot Points
    chartArea
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.followers))
      .attr("cy", (d) => yScale(d.Likes))
      .attr("r", 5)
      .attr("fill", DARK_COLOUR)
      .attr("opacity", 0.7);

    // Calculate Linear Regression
    const xMean = d3.mean(data, (d) => d.followers);
    const yMean = d3.mean(data, (d) => d.Likes);
    const slope =
      d3.sum(data, (d) => (d.followers - xMean) * (d.Likes - yMean)) /
      d3.sum(data, (d) => Math.pow(d.followers - xMean, 2));
    const intercept = yMean - slope * xMean;

    // Line Data
    const lineData = [
      { x: d3.min(data, (d) => d.followers), y: intercept + slope * d3.min(data, (d) => d.followers) },
      { x: d3.max(data, (d) => d.followers), y: intercept + slope * d3.max(data, (d) => d.followers) },
    ];

    // Draw Regression Line
    chartArea
      .append("line")
      .attr("x1", xScale(lineData[0].x))
      .attr("y1", yScale(lineData[0].y))
      .attr("x2", xScale(lineData[1].x))
      .attr("y2", yScale(lineData[1].y))
      .attr("stroke", PRIMARY_COLOUR)
      .attr("stroke-width", 2);
  });
}
