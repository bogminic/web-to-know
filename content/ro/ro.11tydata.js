module.exports = {
  "lang": "ro",
  "permalink": function(data) {
    // Slug override is set in the post for localized URL slugs
    // e.g. /ro/blog/fourthpost.md will optionally write to
    //    /ro/blog/al-patrulea-post/ instead of /es/blog/fourth-post/
    if(data.slugOverride) {
      return `/${data.lang}/blog/${this.slugify(data.slugOverride)}/`;
    }
  }
}