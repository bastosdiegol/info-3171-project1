/**
 * @function getChart6
 * @description The number of YouTube channels by category
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart6() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const padding = 10;
  const legendOffset = 10;
  const chartTitle = "Chart 6: Placeholder";

  // Chart Settings
  const svg = d3
    .select("#chart-6")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Chart Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(chartTitle);

  // Chart Style
  svg.style("background-color", "lightgray");
  svg.style("border", "1px solid black");

  // Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    console.log("Chart 6:", data);
  });
}
