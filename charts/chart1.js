/**
 * @function getChart1
 * @description The proportion of Top 100 YouTube Channels by Category
 */
function getChart1() {
  //Chart Variables and Constants
  const width = 540;
  const height = 320;
  const radius = Math.min(width, height) / 2 - 50;
  const colors = ["#ffbd59", "#dcd21a", "#e4e6c3"];
  const chartTitle = "The Proportion of Top 100 YouTube Channels by Category";

  //Chart Settings: Create a responsive SVG inside #chart-1
  const svg = d3
    .select("#chart-1")
    .append("svg")
    .attr("width", "100%") 
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`) 
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("background-color", "lightgray")
    .style("border", "1px solid black");

  //Group for the chart
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2 - 20})`);

  //Chart Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text(chartTitle);

  //Function to Draw Chart
  function drawChart(data) {
    //Generate the Pie Chart
    const pie = d3.pie().value((d) => d.count);

    //Pie Settings
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    //Join New Data
    const slices = chartGroup.selectAll("path").data(pie(data));

    //Exit
    slices.exit().remove();

    //Update
    slices
      .transition()
      .duration(500)
      .attr("d", arc)
      .attr("fill", (d) => d.data.color);

    //Enter
    slices
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#F7F7F2")
      .attr("stroke-width", "2px");
  }

  //Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((csvData) => {
    //Adding Data by Category
    const categoryCounts = d3.rollups(
      csvData,
      (v) => v.length,
      (d) => d.Category
    );

    //Compute Total for Percentage Calculation
    let pieData = categoryCounts.map(([category, count], i) => ({
      category,
      count,
      percentage: (count / d3.sum(categoryCounts, (d) => d[1])) * 100,
      color: colors[i % colors.length],
      active: true,
    }));

    //Draw Initial Chart
    drawChart(pieData);

    //Add Legend
    const legendGroup = svg
      .append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${20}, ${height / 2 - 40})`);

    const legendItems = legendGroup
      .selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    //Legend Rectangles
    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#000")
      .style("cursor", "pointer");

    //Legend Text
    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", "12px")
      .attr("fill", "#261C15")
      .text((d) => `${d.category}`)
      .style("cursor", "pointer");

    //Add Interactive Behavior to Legend
    legendItems.on("click", function (event, d) {
      //Toggle Active State
      d.active = !d.active;

      //Filter Active Data
      const activeData = pieData.filter((entry) => entry.active);

      //Recalculate Percentages
      const totalActive = d3.sum(activeData, (d) => d.count);
      activeData.forEach((entry) => {
        entry.percentage = (entry.count / totalActive) * 100;
      });

      //Redraw Chart
      drawChart(activeData);

      //Update Legend Style
      d3.select(this)
        .select("text")
        .style("opacity", d.active ? 1 : 0.5)
        .style("text-decoration", d.active ? "none" : "line-through");
    });
  });
}