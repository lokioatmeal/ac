const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/media");

  // Recursively gather all folders under src
  function getAllFolders(dir, root = dir) {
    let results = [];
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {

        // Create a normalized relative path: "campaigns/dragonlance"
        const rel = fullPath.replace(root, "").replace(/\\/g, "/").replace(/^\//, "");
        if (rel) results.push(rel);

        // Dive deeper
        results = results.concat(getAllFolders(fullPath, root));
      }
    }
    return results;
  }

  const contentRoot = path.join(__dirname, "src");
  const folders = getAllFolders(contentRoot);

  // Create a collection for each folder found
  folders.forEach(folder => {
    eleventyConfig.addCollection(folder, function(collectionApi) {
      return collectionApi.getFilteredByGlob(`./src/${folder}/**/*.*`);
    });
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "public",
      includes: "_includes"
    }
  };
};
