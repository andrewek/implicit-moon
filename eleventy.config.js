export default async function(eleventyConfig) {

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
