const toolData = require("./src/_data/tools.json");

const categoryDefinitions = [
  { name: "Tailwind", slug: "tailwind-tools", icon: "code", description: "Visual Tailwind and CSS generators for gradients, shadows, layouts, buttons, cards and colour palettes." },
  { name: "Developer", slug: "developer-tools-hub", icon: "code", description: "Format, convert, compare, encode and generate common developer data without sending it to a server." },
  { name: "Image", slug: "image-tools", icon: "crop", description: "Resize, edit, convert, animate and clean up images with browser-based tools." },
  { name: "Mail", slug: "mail-tools", icon: "link", description: "Read email files and build reliable mailto links." },
  { name: "Text", slug: "text-tools-hub", icon: "text", description: "Count, clean, convert, randomise and transform text for everyday creator work." },
  { name: "Video & Audio", slug: "video-audio-tools", icon: "film", description: "Trim, convert and prepare video, audio, subtitles and creator media." },
  { name: "Converters", slug: "converter-tools", icon: "swap", description: "Convert documents, images, media and structured data into the formats you need." },
  { name: "Misc", slug: "misc-tools", icon: "clock", description: "Practical generators, planners, tests and everyday browser utilities." }
];

const originalToolCategories = {
  "youtube-thumbnail-downloader": ["Image"],
  "image-resizer": ["Image"],
  "image-compressor": ["Image"],
  "srt-editor": ["Video & Audio", "Converters"],
  "youtube-chapters": ["Video & Audio"],
  "character-counter": ["Text"],
  "favicon-generator": ["Image"],
  "image-converter": ["Image", "Converters"],
  "image-to-base64": ["Developer", "Converters"],
  "qr-code-generator": ["Misc"],
  "meme-generator": ["Image"],
  "text-tools": ["Text"],
  "utm-link-builder": ["Misc"],
  "youtube-timestamp-link": ["Video & Audio"],
  "thumbnail-safe-zone": ["Image"],
  "title-preview": ["Text", "Image"],
  "developer-tools": ["Developer"],
  "color-contrast-checker": ["Developer", "Misc"],
  "video-trimmer": ["Video & Audio"],
  "video-to-gif": ["Video & Audio", "Converters"],
  "video-frame-grabber": ["Video & Audio"],
  "audio-extractor": ["Video & Audio", "Converters"],
  "audio-speed-pitch": ["Video & Audio"],
  "pdf-tools": ["Converters"],
  "pdf-to-images": ["Converters"],
  "background-remover": ["Image"]
};

const slugifyHeading = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("toolList", () => toolData.tools);
  eleventyConfig.addGlobalData("toolCategories", () => categoryDefinitions.map((category) => {
    const tools = toolData.tools.filter((tool) => {
      const assigned = originalToolCategories[tool.slug] || (tool.category ? [tool.category] : []);
      return assigned.includes(category.name);
    });
    return { ...category, count: tools.length, tools };
  }));
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  eleventyConfig.amendLibrary("md", (md) => {
    md.core.ruler.push("heading_ids", (state) => {
      const seen = new Map();
      for (let i = 0; i < state.tokens.length; i++) {
        const token = state.tokens[i];
        if (token.type !== "heading_open") continue;
        const inline = state.tokens[i + 1];
        const text = (inline && inline.children ? inline.children : [])
          .filter((child) => child.type === "text" || child.type === "code_inline")
          .map((child) => child.content)
          .join("");
        let id = slugifyHeading(text) || "section";
        const count = seen.get(id) || 0;
        seen.set(id, count + 1);
        if (count) id += "-" + (count + 1);
        token.attrSet("id", id);
      }
    });
  });

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

  eleventyConfig.addFilter("categoryLd", function (category, site, url) {
    const canonical = site.url + url;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": category.name + " Tools",
          "description": category.description,
          "url": canonical,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": category.tools.length,
            "itemListElement": category.tools.map((tool, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": tool.name,
              "url": site.url + tool.url
            }))
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ReelFlow Toolkit", "item": site.url + "/" },
            { "@type": "ListItem", "position": 2, "name": category.name + " Tools", "item": canonical }
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

  const toDate = (value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const isoDate = (value) => {
    const date = toDate(value);
    return date ? date.toISOString().slice(0, 10) : "";
  };

  eleventyConfig.addFilter("isoDate", isoDate);

  eleventyConfig.addFilter("longDate", function (value) {
    const date = toDate(value);
    return date
      ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)
      : "";
  });

  eleventyConfig.addFilter("rssDate", function (value) {
    const date = toDate(value);
    return date ? date.toUTCString() : "";
  });

  eleventyConfig.addFilter("assetUrl", function (value) {
    if (!value) return "";
    if (value.startsWith("http") || value.startsWith("/")) return value;
    return "/" + value;
  });

  eleventyConfig.addFilter("toc", function (html) {
    const items = [];
    const re = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
    let match;
    while ((match = re.exec(html || ""))) {
      const text = match[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
      if (text) items.push({ id: match[1], text });
    }
    return items;
  });

  eleventyConfig.addFilter("faqLd", function (faq) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": (faq || []).map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    };
  });

  eleventyConfig.addFilter("postLd", function (title, description, date, updated, cover, categories, site, url) {
    const canonical = site.url + url;
    const image = cover
      ? cover.startsWith("http")
        ? cover
        : site.url + (cover.startsWith("/") ? cover : "/" + cover)
      : site.ogImage;
    const published = isoDate(date);
    const keywords = Array.isArray(categories) ? categories : categories ? [categories] : [];
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "url": canonical,
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
          "datePublished": published,
          "dateModified": isoDate(updated) || published,
          "image": image,
          "inLanguage": "en",
          "keywords": keywords.join(", "),
          "author": { "@type": "Organization", "name": "ReelFlow Live Team", "url": site.url + "/" },
          "publisher": {
            "@type": "Organization",
            "name": "ReelFlow Toolkit",
            "url": site.url + "/",
            "logo": { "@type": "ImageObject", "url": site.url + "/favicon.svg" }
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ReelFlow Toolkit", "item": site.url + "/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": site.url + "/blog/" },
            { "@type": "ListItem", "position": 3, "name": title, "item": canonical }
          ]
        }
      ]
    };
  });

  eleventyConfig.addFilter("blogLd", function (posts, site) {
    const live = (posts || []).filter((post) => !post.data.draft);
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Blog",
          "name": "ReelFlow Toolkit blog",
          "url": site.url + "/blog/",
          "description": "Guides for YouTube, Shorts, Reels and TikTok creators.",
          "inLanguage": "en",
          "publisher": { "@type": "Organization", "name": "ReelFlow Toolkit", "url": site.url + "/" },
          "blogPost": live.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.data.title,
            "url": site.url + post.url,
            "datePublished": isoDate(post.data.date || post.date),
            "description": post.data.description
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "ReelFlow Toolkit", "item": site.url + "/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": site.url + "/blog/" }
          ]
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
