const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/media");

  eleventyConfig.addCollection("dragonlance", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/campaigns/dragonlance/s*.md");
  });

  eleventyConfig.addCollection("characters", (collectionApi) => {
    return collectionApi.getFilteredByTag("characters");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
