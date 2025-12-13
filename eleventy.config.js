import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPassthroughCopy("src/assets");

  // eleventyConfig.addDataExtension("json", (contents) => JSON.parse(contents)); // Revisit using _data for site-wide data.
  eleventyConfig.addCollection("dragonlance", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/campaigns/dragonlance/s*.md");
  });
  eleventyConfig.addCollection("characters", (collectionApi) => {
    return collectionApi.getFilteredByTag("characters");
  });

  return {
    dir: {
      input: "src",
      // data: "_data", // Currently unused, but can be added for data files.
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
    // pathPrefix in GitHub Action to support deployment to GitHub Pages.
  };
}
