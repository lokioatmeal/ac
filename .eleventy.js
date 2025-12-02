const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

// Load Node's built-in file system module (lets us read folders and files)
const fs = require("fs");

// Load Node's built-in path module (helps build file paths safely)
const path = require("path");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/media");

    // This is the root folder where your site's content lives
    const contentRoot = "src";

    // A list of folders we do NOT want to turn into collections
    // These contain layouts, global data, assets, etc.
    const IGNORE_DIRS = new Set([
        "_includes",
        "_data",
        "css",
        "media"
    ]);

    // -----------------------------------------------
    // FUNCTION: Recursively get all folders inside src/
    // -----------------------------------------------
    function getAllDirs(dir) {

        // Read all items (files + folders) inside the current directory
        // "withFileTypes: true" gives us extra info about each entry
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        // This array will hold all directory names found
        let dirs = [];

        // Loop through every entry we found in this folder
        for (const entry of entries) {

        // Only process folders (skip files)
        if (entry.isDirectory()) {

            // Skip folders in the ignore list
            if (IGNORE_DIRS.has(entry.name)) continue;

            // Build the full filesystem path to this folder
            const fullPath = path.join(dir, entry.name);

            // Convert the full path into a "relative" path like:
            // "campaigns", "campaigns/alpha", etc.
            const relativePath = path.relative(contentRoot, fullPath);

            // Add this folder to the list
            dirs.push(relativePath);

            // Recursively scan this folder for subfolders
            // and add all of them to the list as well
            dirs = dirs.concat(getAllDirs(fullPath));
        }
        }

        // Return ALL folders we found inside this directory (and its children)
        return dirs;
    }

    // Run our function to get a list of every folder inside src/
    // Example result: ["campaigns", "campaigns/alpha", "campaigns/beta"]
    const allFolders = getAllDirs(contentRoot);

    // -----------------------------------------------
    // Create ONE Eleventy collection per folder found
    // -----------------------------------------------
    allFolders.forEach(folder => {

        // Create a collection named exactly like the folder path
        // e.g. collections["campaigns/alpha"]
        eleventyConfig.addCollection(folder, collectionApi => {

        // Return all files inside this folder (and subfolders)
        // This creates the actual items that appear in the collection
        return collectionApi.getFilteredByGlob(`${contentRoot}/${folder}/**/*.*`);
        });
    });

    // -----------------------------------------------
    // Tell Eleventy where your folders actually live
    // (IMPORTANT: This fixes the missing layout error)
    // -----------------------------------------------
    return {
        dir: {
        input: "src",        // All your content lives in the src/ folder
        includes: "_includes", // Layouts and partials are in src/_includes
        data: "_data",        // Optional data folder (if you create it)
        output: "public"      // Build the site into public/
        }
    };
};