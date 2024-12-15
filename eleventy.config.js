import { DateTime } from "luxon"

export default async function(eleventyConfig) {
  eleventyConfig.addFilter("humanizedDate", (dateObj) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
  });

};

export const config = {
  templateFormats: [
    "md",
    "njk",
    "html"
  ],

  // Process *.md as NJK
  markdownTemplateEngine: "njk",

  // Process *.html as NJK
  htmlTemplateEngine: "njk",

  dir: {
    input: "content",
    includes: "../_includes",
    data: "../_data",
    output: "_site"
  },
}
