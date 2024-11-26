/**
 * @function getChart5
 * @description The top 5 YouTube channels’ Quarterly income
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart5() {
  const width = 540;
  const height = 320;
  const margin = { top: 50, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const padding = 20;
  const chartTitle = "Top 5 YouTube Channels' Quarterly Income";

  // SVG Container
  const svg = d3
    .select("#chart-5")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", padding)
    .attr("text-anchor", "middle")
    .text(chartTitle)
    .style("font-weight", "bold")
    .style("fill", PRIMARY_COLOUR);

  // Load CSV data
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    const top5Data = getTop5Channels(data);

    // Scales
    const allIncomes = top5Data.flatMap((d) => [
      +d["Income q1"],
      +d["Income q2"],
      +d["Income q3"],
      +d["Income q4"],
    ]);
    const xMin = Math.max(0, d3.min(allIncomes) * 0.9);
    const xMax = d3.max(allIncomes) * 1.1;

    const yScale = d3
      .scaleBand()
      .domain(top5Data.map((d) => d.ChannelName))
      .range([0, innerHeight])
      .padding(0.3);

    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .nice()
      .range([0, innerWidth]);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d3.format("~s")(d));
    const yAxis = d3.axisLeft(yScale);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Quarters
    const quarters = [
      { key: "Income q1", label: "1st Quarter" },
      { key: "Income q2", label: "2nd Quarter" },
      { key: "Income q3", label: "3rd Quarter" },
      { key: "Income q4", label: "4th Quarter" },
    ];
    const quarterColors = [
      PRIMARY_COLOUR,
      INFO_COLOUR,
      DARK_COLOUR,
      SECONDARY_COLOUR,
    ];
    const barWidth = yScale.bandwidth() / quarters.length;

    // Legend
    const legendGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left}, ${height - margin.bottom + 25})`
      );

    legendGroup
      .selectAll(".legend-item")
      .data(quarters)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${i * 120}, 0)`)
      .each(function (d, i) {
        const legendItem = d3.select(this);
        legendItem
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", quarterColors[i]);

        legendItem
          .append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text(d.label)
          .style("font-size", "12px")
          .attr("fill", DARK_COLOUR);
      });

    // Bars
    chartGroup
      .selectAll(".channel-group")
      .data(top5Data)
      .join("g")
      .attr("class", "channel-group")
      .attr("transform", (d) => `translate(0, ${yScale(d.ChannelName)})`)
      .selectAll(".bar")
      .data((d) =>
        quarters.map((quarter, i) => ({
          quarter: quarter.label,
          income: +d[quarter.key],
          index: i,
        }))
      )
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(0))
      .attr("y", (d) => d.index * barWidth)
      .attr("width", (d) => xScale(d.income) - xScale(0))
      .attr("height", barWidth)
      .style("fill", (d) => quarterColors[d.index]);

    // Axes
    chartGroup
      .append("g")
      .call(yAxis)
      .attr("class", "y-axis")
      .selectAll(".tick text")
      .attr("transform", "rotate(-45)")
      .text((d) => (d.length > 10 ? `${d.substring(0, 10)}...` : d))
      .append("title")
      .text((d) => d);

    chartGroup
      .append("g")
      .call(xAxis)
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`);
  });
}

/**
 * @function getTop5Channels
 * @description Get the top 5 YouTube channels
 * @param {Array} data - The dataset
 * @returns {Array} The top 5 YouTube channels
 */
function getTop5Channels(data) {
  // Calculate total income
  data.forEach((d) => {
    d.totalIncome =
      +d["Income q1"] + +d["Income q2"] + +d["Income q3"] + +d["Income q4"];
  });

  // Sort top 5
  const top5 = data.sort((a, b) => b.totalIncome - a.totalIncome).slice(0, 5);

  return top5;
}
