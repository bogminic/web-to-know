const { DateTime } = require("luxon");
const rosetta = require("rosetta");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyI18nPlugin, EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const timeToRead = require('eleventy-plugin-time-to-read');

const languageStrings = require("./i18n.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add("README.md");

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    "./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-theme.css",
  });

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginTOC);
  eleventyConfig.addPlugin(timeToRead, {
    output: function (data) {
    const numberOfEmoji = Math.max(1, Math.round(data.totalSeconds / 60));
    const emojiString = '🕒'.repeat(numberOfEmoji);
  
    return `${emojiString} ${data.timing}`; // 🕒🕒🕒 3 minutes to read
  }
  });

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "en",
    errorMode: "allow-fallback",
  });

  eleventyConfig.addFilter("readableDate", (dateObj, format = "dd LLLL yyyy") => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat(format);
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the authors added to a page
  eleventyConfig.addFilter("getAuthors", (undefined, authors, label) => {
		let labels = label.split(',');
		return authors.filter(a => labels.includes(a.key));
	});

	eleventyConfig.addFilter("getPostsByAuthor", (undefined, posts, author) => {
		return posts.filter(p => {
			if(!p.data.author) return false;
			let authors = p.data.author.split(',');
			return authors.includes(author);
		});
	});

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for(let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  });

  // Customize Markdown library and settings:
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "direct-link",
        symbol: "#",
      }),
      level: [1,2,3,4],
      slugify: eleventyConfig.getFilter("slug")
    });
  });

  // Override @11ty/eleventy-dev-server defaults (used only with --serve)
  eleventyConfig.setServerOptions({
    showVersion: true,
  });

  // i18n filter using Rosetta
  const rosettaLib = rosetta(languageStrings);

  eleventyConfig.addFilter("i18n", function (key, lang) {
    const I18N_PREFIX = "i18n.";
    if(key.startsWith(I18N_PREFIX)) {
      key = key.slice(I18N_PREFIX.length);
    }
    // depends on page.lang in 2.0.0-canary.14+
    let page = this.page || this.ctx?.page || this.context?.environments?.page || {};
    return rosettaLib.t(key, {}, lang || page.lang);
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
