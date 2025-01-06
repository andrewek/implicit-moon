import { DateTime } from "luxon"
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"

export default async function(eleventyConfig) {
  // Use .eleventyignore in lieu of .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Highlight our syntax please
  eleventyConfig.addPlugin(syntaxHighlight)

  // Pass tailwind-generated styles through
  eleventyConfig.addPassthroughCopy({
    "./assets/out.css": "style.css"
  })

  eleventyConfig.addFilter("humanizedDate", (dateObj) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: "utc"}).toISODate()
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
