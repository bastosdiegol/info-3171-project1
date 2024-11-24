// Select Input Default Option
var selectedCountry = "IN";
var selectedCountryName;

/**
 * @function getChart6
 * @description The number of YouTube channels by category
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart6() {
  // Chart Variables and Constants
  const defaultWidth = 540;
  const defaultHeight = 320;
  let margin = { top: 50, right: 40, bottom: 50, left: 60 };

  // Responsive SVG dimensions
  const width = Math.min(defaultWidth, window.innerWidth * 0.9);
  const height = Math.min(defaultHeight, window.innerHeight * 0.7);

  // Chart Settings
  const svg = d3
    .select("#chart-6")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    const countries = [...new Set(data.map((d) => d.Country))];

    // Append Select Label
    svg
      .append("foreignObject")
      .attr("x", 10)
      .attr("y", 1)
      .attr("width", 120)
      .attr("height", 30)
      .append("xhtml:div")
      .append("label")
      .attr("for", "country-select")
      .text("Country:");

    // Append Select
    svg
      .append("foreignObject")
      .attr("x", 65)
      .attr("y", 2)
      .attr("width", 120)
      .attr("height", 30)
      .append("xhtml:div")
      .append("select")
      .attr("id", "country-select")
      .style("border-radius", "5px")
      .on("change", function () {
        update();
      })
      .selectAll("option")
      .data(countries)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Draw initial chart
    update();

    // Inner Function for Chart Update on Select Change
    function update() {
      // Get selected country name
      selectedCountry = d3.select("#country-select").property("value");
      selectedCountryName = getCountryName(selectedCountry);

      // Filter data by selected country
      const filteredData = data.filter((d) => d.Country === selectedCountry);
      // Count channels by category
      const categoryCounts = Array.from(
        d3.rollup(
          filteredData,
          (v) => v.length,
          (d) => d.Category
        ),
        ([category, count]) => ({ category, count })
      );

      // Clear previous chart
      svg.selectAll(".bar, .axis, .chart-title").remove();

      // Measure label sizes for dynamic margins
      const xLabels = categoryCounts.map((d) => d.category);
      const maxLabelLength = Math.max(...xLabels.map((label) => label.length));

      margin.bottom = Math.max(50, maxLabelLength * 5);
      margin.left = Math.max(60, 40);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Update chart title
      svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", PRIMARY_COLOUR)
        .text(`YouTube Channels in ${selectedCountryName} by Category`);

      // Scales
      const xScale = d3
        .scaleBand()
        .domain(categoryCounts.map((d) => d.category))
        .range([margin.left, margin.left + innerWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(categoryCounts, (d) => d.count)])
        .range([margin.top + innerHeight, margin.top]);

      // Axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(6)
        .tickFormat((d) => (Number.isInteger(d) ? d : ""));

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${margin.top + innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

      // Gradient Colours for Bars
      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "bar-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", PRIMARY_COLOUR);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", SECONDARY_COLOUR);

      // Bars
      svg
        .selectAll(".bar")
        .data(categoryCounts)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.category))
        .attr("y", (d) => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => margin.top + innerHeight - yScale(d.count)) // Adjusted to start from the X-axis
        .attr("fill", "url(#bar-gradient)");
    }
  });
}

/**
 * @function getCountryName
 * @description Get the country name from the country code
 * @param {string} countryCode - The country code
 * @returns {string} The country name
 */
function getCountryName(countryCode) {
  switch (countryCode) {
    case "IN":
      return "India";
    case "US":
      return "United States";
    case "KR":
      return "South Korea";
    case "CA":
      return "Canada";
    case "BR":
      return "Brazil";
    case "MX":
      return "Mexico";
    case "SV":
      return "El Salvador";
    case "CL":
      return "Chile";
    case "NO":
      return "Norway";
    case "PR":
      return "Puerto Rico";
    case "BY":
      return "Belarus";
    case "RU":
      return "Russia";
    case "PH":
      return "Philippines";
    case "TH":
      return "Thailand";
    default:
      return "Unknown Country";
  }
}
