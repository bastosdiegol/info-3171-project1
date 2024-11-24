/**
 * @function getChart4
 * @description The top 5 YouTube channels' average view changes every year
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart4() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const padding = 10;
  const legendOffset = 10;
  const chartTitle = "Chart 4: Placeholder";

  // Chart Settings
  const svg = d3
    .select("#chart-4")
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
  d3.csv("../data/avg_view_every_year.csv").then((data) => {
    console.log("Chart 4:", data);
  });
}
