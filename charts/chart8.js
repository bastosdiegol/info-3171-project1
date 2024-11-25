/**
 * @function getChart8
 * @description The country that has the most youtubers in the top 100 list
 * @see {@link
 * https://www.d3indepth.com/}
 */
function getChart8() {
  const width = 540;
  const height = 320;
  const margin = {top: 40, right: 30, bottom: 60, left: 60};
  const chartTitle = "Country with Most YouTubers in Top 100";

  const svg = d3
      .select("#chart-8")
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
      .attr("class", "chart-title")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", PRIMARY_COLOUR)
      .text(chartTitle);

  d3.csv("../data/top_100_youtubers.csv").then((data) => {
    // Count YouTubers by country
    const countryCount = d3.rollup(
        data,
        v => v.length,
        d => d.Country
    );

    // Get country with most YouTubers
    const topCountry = Array.from(countryCount.entries())
        .sort((a, b) => b[1] - a[1])[0];

    // Create container for result
    const resultGroup = svg
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    // Display country name
    resultGroup
        .append("text")
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(getFullCountryName(topCountry[0]));

    // Display count
    resultGroup
        .append("text")
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .style("fill", PRIMARY_COLOUR)
        .text(`${topCountry[1]} YouTubers`);

    // Add flag image (using country-flags CDN)
    resultGroup
        .append("image")
        .attr("x", -40)
        .attr("y", -100)
        .attr("width", 80)
        .attr("height", 80)
        .attr("href", `https://flagcdn.com/${topCountry[0].toLowerCase()}.svg`);
  });

}

// Helper function to get full country names
function getFullCountryName(countryCode) {
  const countryNames = {
    'BR': 'Brazil',
    'BY': 'Belarus',
    'CA': 'Canada',
    'CL': 'Chile',
    'IN': 'India',
    'KR': 'South Korea',
    'MX': 'Mexico',
    'NO': 'Norway',
    'PH': 'Philippines',
    'PR': 'Puerto Rico',
    'SV': 'El Salvador',
    'TH': 'Thailand',
    'UK': 'United Kingdom',
    'US': 'United States',
  };
  return countryNames[countryCode] || countryCode;
}
