// Select Input Default Option
var selectedCountry = "IN";
var selectedCountryName;

// Access CSS variables
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue("--primary").trim();
const secondaryColor = rootStyles.getPropertyValue("--secondary").trim();
const infoColor = rootStyles.getPropertyValue("--info").trim();
const darkColor = rootStyles.getPropertyValue("--dark").trim();
const lightColor = rootStyles.getPropertyValue("--light").trim();

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
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const padding = 10;
  const legendOffset = 10;
  const chartTitle = `YouTube Channels in ${selectedCountryName} by Category`;
  const xOffset = margin.left + (width - innerWidth) / 2;
  const yOffset = margin.top + (height - innerHeight) / 2;

  // Chart Settings
  const svg = d3
    .select("#chart-6")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", lightColor)
    .style("border", `1px solid ${darkColor}`)
    .style("border-radius", "5px");

  // Reading CSV
  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    // Create Input For Countries without duplicates
    const countries = [...new Set(data.map((d) => d.Country))];

    // Append Select Label
    svg
      .append("foreignObject")
      .attr("x", padding)
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
      .attr("x", padding + 55)
      .attr("y", 1)
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

    // Update Function
    function update() {
      // Update selectedCountry
      selectedCountry = d3.select("#country-select").property("value");
      selectedCountryName = getCountryName(selectedCountry);

      // Filter data
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

      // Clear current chart
      svg.selectAll(".bar").remove();
      svg.selectAll(".axis").remove();
      svg.selectAll(".chart-title").remove();

      // Update chart title
      svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", padding * 2)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", primaryColor)
        .text(`YouTube Channels in ${selectedCountryName} by Category`);

      // Scales
      const xScale = d3
        .scaleBand()
        .domain(categoryCounts.map((d) => d.category))
        .range([margin.left, innerWidth])
        .padding(0.1);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(categoryCounts, (d) => d.count)])
        .range([innerHeight, margin.top]);

      // Axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(d3.max(categoryCounts, (d) => d.count))
        .tickFormat((d) => (Number.isInteger(d) ? d : ""));

      // Append x-axis
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      // Append y-axis
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

      // Define Gradient for Bars
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
        .attr("stop-color", primaryColor);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", secondaryColor);

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
        .attr("height", (d) => innerHeight - yScale(d.count))
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
