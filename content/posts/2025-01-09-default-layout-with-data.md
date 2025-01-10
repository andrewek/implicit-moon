---
title: "Eleventy: Setting a Default Layout (and Other Default Attributes) with Data"
description: "Something something don't repeat yourself something something"
date: 2025-01-09
tags:
  - Eleventy
---

Since we created our [default post layout](/posts/2024-12-09-post-page-layout/),
we've had to include this line in all of our posts to make them show up the way
we want:

```yaml
layout: "layouts/post.njk"
```

And in fact we've had to do that for _all_ of our pages, too.

This is fine, but it's also somewhat easy to forget. If ever we wanted to
rename one of our layouts, or change all pages within a directory from one base
layout to another, it'd get a little tedious.

We're going to fix that in this step.

## Order of Operations

1. Talk about the data cascade just a bit
1. Make a data file in the right spot
1. Remove that layout line from the front-matter of all of our posts
1. Consider more applications of the data files?

## The Eleventy Data Cascade

The way Eleventy broadly works is that, on the build, it constructs a great big
data object (from source files, from remote data sources, etc.) with various
collections and pages and all of that, which we then use to build the site.

We've defined page data, like `title` or `description` or `date`, in the YAML
front-matter, where it then gets merged with its parent layout (and then merged
with that parent layout, and then merged with global data). So far, we've just
trusted that it works.

The order of precedence for the [big data
cascade](https://www.11ty.dev/docs/data-cascade/) is:

1. Computed Data (we haven't used this yet)
1. Front-matter data from a template
1. Template data files (we haven't used these yet)
1. Directory data files (we're going to use these today!)
1. Front-matter data in layouts (we're using this already)
1. Configuation API global data (we've implicitly used this)
1. Global Data files (we've also used this one for metadata, but not really
   talked about it beyond that).

Any data attribute defined in a given level will override competing data
attributes from further down the list (if just one value; it'll merge into them
if it's an array).

## Making Our Data File

To start, pick a blog post and remove `layout: "layouts/post.njk"` from the
front-matter, then refresh the page in your browser. What you should see is that
it goes from being beautifully styled to being completely unstyled.

This is good! Now we'll go about fixing it for just this post, then for all
posts.

All of our posts live in `content/posts` at this time.

Per the [data template directory](https://www.11ty.dev/docs/data-template-dir/)
documentation, we need to define `content/posts/posts.11tydata.js`.

(The JS file should match in name to either a post within the directory or the
directory's name).

We're looking to define a base layout, so let's make it look like this:

```javascript
// content/posts/posts.11tydata.js
export default {
  "layout": "layouts/post.njk"
};
```

Once the file is in place, refresh the post in question in your browser (you may
need to restart your Eleventy server). What you should see is the page now uses
the correct layout in spite of not having a layout defined in the page's
front-matter. Awesome!

## Cleaning Up Posts

Assuming the above step worked, let's remove the `layout: "layouts/post.njk"`
from all of our posts. Then let's check 'em to make sure they look like they
should.

What we should see is that all of our posts render just like they did before,
but without us having to specify a default layout. Cool.

## More Data Application?

We can go a bit further.

Recall that we're using the `posts` tag to [get our posts into our
`collections.posts` data object](/posts/2024-12-08-posts-index-page/) (from
which we build the [posts page](/posts), [generate our next and previous
buttons](/posts/2025-01-06-better-next-and-previous-buttons/), and so on.

What if we didn't have to remember to do that, and instead could only have
_meaningful_ tags on our posts?

That'd be pretty cool.

It turns out we can.

```javascript
// content/posts/posts.11tydata.js
export default {
  "layout": "layouts/post.njk",
  "tags": ["posts"]
};
```

What this will do is merge `["posts"]` with any other tags we might apply in the
front-matter of the post. Cool, huh?

Now when we have front-matter like this:

```yaml
tags:
  - posts
  - Eleventy
```

We can instead do this:

```yaml
tags:
  - Eleventy
  - Cool Layouts
  - Dogs
```

(Note the absence of `posts`)

And it still shows up in our posts index page!

Check out the [git commit for this site where I make these
changes](https://github.com/andrewek/implicit-moon/commit/6bf1961602d2b7bd2564cf61a552312770c43da2)

We can do the same thing one level up, too.

For example, `content/posts.njk` (our posts index page) or `content/index.njk`
(our home page) both include `layout: "layouts/base.njk"`.

We could remove that line from the front-matter and create
`content/content.11tydata.js`:

```javascript
// content/content.11tydata.js
export default {
  "layout": "layouts/base.njk"
}
```

(See the [git commit
here](https://github.com/andrewek/implicit-moon/commit/26781aafe2ccfdfb98d5818bfad13311ab29d2db))

Then if we did want to override that layout on a per-page basis (or a
per-post basis, even!), we could. Or if we wanted some other data attribute in
there, we could absolutely do that as well. We'll play more with that in a
future post.

## Wrapping Up

In this post, we set a default layout for posts (and maybe pages), but what we
mostly did was set some cascading, overridable data attributes by following some
Eleventy conventions.

Neat!
