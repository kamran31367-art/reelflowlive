module.exports = {
  layout: "layouts/post.njk",
  contentType: "post",
  ldType: "post",
  ogType: "article",
  sitemap: true,
  mainClass: "wrap",
  author: "ReelFlow Live Team",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => (data.draft === true ? false : `/blog/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => data.draft === true,
    metaTitle: (data) => (data.title ? `${data.title} - ReelFlow Toolkit` : "Blog - ReelFlow Toolkit"),
    ogTitle: (data) => data.title,
    ogDescription: (data) => data.description
  }
};
