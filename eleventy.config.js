const toolData = require("./src/_data/tools.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("toolList", () => toolData.tools);
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "/favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "/CNAME" });

  eleventyConfig.addFilter("toolBySlug", function (list, slug) {
    return (list || []).find((tool) => tool.slug === slug);
  });

  eleventyConfig.addFilter("jsonld", function (value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addFilter("toolLd", function (content, tool, site, url) {
    const canonical = site.url + url;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": tool.name,
          "url": canonical,
          "description": content.ldDescription || content.description,
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any (web browser)",
          "browserRequirements": "Requires JavaScript",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        },
        {
          "@type": "FAQPage",
          "mainEntity": (content.faq || []).map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a }
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ReelFlow Toolkit", "item": site.url + "/" },
            { "@type": "ListItem", "position": 2, "name": tool.name, "item": canonical }
          ]
        }
      ]
    };
  });

  eleventyConfig.addFilter("homeLd", function (list, site) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": "ReelFlow Toolkit",
          "url": site.url + "/",
          "description": site.description,
          "inLanguage": "en",
          "publisher": { "@type": "Organization", "name": "ReelFlow Toolkit", "url": site.url + "/" }
        },
        {
          "@type": "ItemList",
          "name": "Creator tools",
          "itemListElement": (list || []).map((tool, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": tool.name,
            "url": site.url + tool.url
          }))
        }
      ]
    };
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
