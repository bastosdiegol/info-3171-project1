/**
 * @function getChart3
 * @description Each country's number of youtubers
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart3() {
  // Chart Variables and Constants
  const width = 540;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const chartTitle = "Chart 3: Placeholder";

  // Chart Settings
  const svg = d3
    .select("#chart-3")
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
    console.log("Chart 3:", data);
  });
}
