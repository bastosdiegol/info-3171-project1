/**
 * @function getChart9
 * @description The name of the channel with the most subscribers
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart9() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = {top: 40, right: 30, bottom: 60, left: 60};
  const chartTitle = "Channel with the most subscribers";

  // Chart Settings
  const svg = d3
    .select("#chart-9")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")

  // Chart Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", PRIMARY_COLOUR)
    .text(chartTitle);


  // Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    // Count Subscribers by channel name
    const followersCount = d3.rollup(
      data,
      v => d3.sum(v, d => parseInt(d.followers)),  // Sum followers in each category
      d => d.ChannelName
  );

  const topChannel = Array.from(followersCount.entries())
  .sort((a, b) => b[1] - a[1])[0];

  const formattedFollowers = topChannel[1].toLocaleString();

  // Create container for result
  const resultGroup = svg
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

  // Displaty category name
  resultGroup
  .append("text")
  .attr("y", -20)
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("fill", SECONDARY_COLOUR)
  .text(topChannel[0]);

// Display count
resultGroup
  .append("text")
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .style("font-size", "26px")
  .style("font-weight", "bold")
  .style("fill", PRIMARY_COLOUR)
  .text(`${formattedFollowers} Subscribers`);
  });
}

