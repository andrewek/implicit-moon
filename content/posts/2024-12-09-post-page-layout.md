---
title: "Eleventy: Post Page Layout"
description: "Let's make our posts look nicer"
date: 2024-12-09
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

{% raw %}

In our [previous step](/posts/2024-12-08-posts-index-page/), we built an "index"
page for our posts. It lists the posts by title and provides a nice link to
each.

In the next few steps, we're going to make our posts look nicer and be easier to
navigate by:

1. Add a "Date Published" element on the page
1. Add a "Next" and "Previous" link when there is a next post or previous post
   to go to.

If you don't have one already, you're going to need a post. Consult [this
step](/posts/2024-12-07-our-first-post/) for help with that. You only need one.
Make sure it's got a `title`, `description`, `date`, and `tags` field in the
YAML front-matter.

You'll preferably have at least three posts. If you are unsure what to write,
consider some [lorem ipsum text](https://loremipsum.io/) for the post body, and
just give them different dates. You can delete these posts when we are done.

## A New Post Layout

We're going to start by creating a new layout: `_includes/layouts/post.njk` (it
should be in the same folder as `_includes/layouts/base.njk`

To start, let's just give it this:

```njk
<main>
  {{ content | safe }}
</main>
```

(Recall that `{{ some_stuff }}` is how we interpolate a string from data into
the HTML, that `content` is the body of the post as defined in the post file,
and that `{{ content | safe }}` does some HTML-escaping and all of that).

Pick a post, and update it to `layout: "layouts/post.njk"` (from `layout:
"layouts/base.njk"`), then view the page in the browser. If you inspect the
HTML, you'll see that everything in our `<head>` is gone!

Change it back to `layout: "layouts/base.njk"` and inspect the HTML again; our
head is back!

There's a simple solution here: we'll just copy the entirety of
`_includes/layouts/base.njk` _into_ `_includes/layouts/post.njk`. Easy, right?

Do that, then change your post's layout again (back to `layout:
"layouts/post.njk"`), then refresh the page. The title shows up as desired, as
does the content of the `<head>`.

And all we have to do is make sure that for every layout we add, and every
layout change we make, we propagate those changes everywhere. And otherwise our
layouts will be duplicate?!

Surely there's a better way!

### DRY the Layouts Up

Instead of duplicating everything, we're going to [chain our
layouts](https://www.11ty.dev/docs/layout-chaining/), that is, let's keep `base`
as our top-level layout, then render the `post` layout (with just post-specific
markup) inside of `base`, then render the post content inside of the post
layout.

Delete all the content inside of `_includes/layouts/post.njk`, but keep the
file, as we're going to work with it.

Let's start over. If it's not already, make sure that your test post has
`layout: "layouts/post.njk"` in its metadata.

Now we'll chain. Posts render inside of `layouts/post.njk`. We want this layout
to render inside of `layouts/base.njk`. Let's do that. Update
`_includes/layouts/post.njk` so that it looks like this:

```njk
---
layout: "layouts/base.njk"
---

<h1>This is my post</h1>

<article>
  {{content | safe}}
</article>
```

Once you refresh the page and inspect the HTML, you should see:

1. The `<head>` element with proper contents
1. The `<h1>` with the title (which comes from our base layout)
1. The `<h1>This is my post</h1>` element right below it (which comes from our
   layout)
1. The post content as written inside an `article` tag.

We can delete the `<h1>This is my post</h1>` element (if you want!), but we'll
keep the rest.

## Date Published

Let's start by getting the published date in there. We'll put it in a `<time>`
element so our markup is nice and semantic.  ([MDN docs in case you're not
familiar](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time))

But how?

The key is the [`page.date` field from our Page
Data](https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable-contents)

Let's modify our post layout so it looks like this:

```njk
---
layout: "layouts/post.njk"
---
<time datetime="{{ page.date }}">
  {{ page.date }}
</time>

<article>
  {{content | safe }}
</article>
```

When you look at the page, you'll see something like this:

```html
<time datetime="Sun Dec 08 2024 18:00:00 GMT-0600 (Central Standard Time)">
 Sun Dec 08 2024 18:00:00 GMT-0600 (Central Standard Time)
</time>
```

(Assuming that you've got `date: 2024-12-09` in your post's YAML front-matter.

This is better than it was, but it needs fixing on three counts:

1. We want the `datetime` attribute of the `time` element to be an ISO-8601
   datetime string, e.g. `2024-12-09`, whereas what we have is the string
   representation of the JS `Date` object.
1. The actual displayed value should be nicer: something like "December 9, 2024"
1. It's probably off by a day! What's happening here is the `date: 2024-12-09`
   is assumed to be UTC, then gets converted to the local time of whatever
   system is doing the page build... most likely your machine. [Read more here
   if you're interested](https://www.11ty.dev/docs/dates/#dates-off-by-one-day).

We need to fix these. "Need" is a strong word, but I would like to fix these
issues.

The fixes will require:

1. We assume a UTC datetime through the whole process, instead of converting to
   local time (or we assume local time throughout -- either way works)
1. We introduce some code that lets us convert the JS `Date` object into an
   ISO-8601 string (for the sake of markup)
1. We introduce some code that lets us take our JS `Date` object and make it a
   pleasant, human-readable string.

In the world of Eleventy, we use _filters_ to translate data (a string, a JSON
object, a date, etc.) into something more presentable. Filters are (or should
be) pure functions; they take an input and produce an output deterministically
and idempotently.

[Here's a brief overview of Eleventy
filters](https://www.11ty.dev/docs/filters/).

Where we're going is going to be something like:

```njk
<time datetime="{{ page.date | machineDate }}">
  {{ page.date | humanizedDate }}
</time>
```

But this won't work quite yet. Read on and we'll make it work

### Human Readable Date Filter

We'll use [Luxon](https://github.com/moment/luxon) to work with our dates. If
you've used `Moment.js` before, Luxon might feel familiar. We could also just
write raw JS, but Luxon's convenience helpers are probably worth it.

Stop your Eleventy server before we do this step, since we're adding packages.

On the command line, `yarn add luxon` should get you set.

Next we'll add our filter.

In `eleventy.config.js`, we're going to import our DateTime helper:

```diff-js
+ import { DateTime } from "luxon"

export default async function(eleventyConfig) {
  // .... more stuff here
```

Then we'll write the actual helper. What we first need is a function that takes
a JS Date object and formats it appropriately:

```js
const humanizedDate = (dateObj) => {
  // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
};
```

This will give us something like "December 9, 2024". It will also, thanks to
`{ zone: utc }`, give avoid the incorrect date shift (due to time zone
weirdness) that we had earlier.

You can check out the function in your browser console if you like.

But in order for us to use it as a filter, we need to lightly modify it:

```diff-js
- const humanizedDate = (dateObj) => {
+ eleventyConfig.addFilter("humanizedDate", (dateObj) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
- };
+ });
```

(Put this inside the `export default function(eleventyConfig)` block)

If you're not sure you got it quite right, check out [this
commit](https://github.com/andrewek/implicit-moon/commit/b1b410a63063fccb26928e747bdf192062e4c12a)
for what your Eleventy config file should look like at this point.

Restart your Eleventy server (`CTRL + C` to stop it, then `yarn start` to start
it again) to pick up the dependency change. Now we can go back into our post
template (`_includes/layouts/post.njk`):

```diff-njk
<time datetime="{{ page.date }}">
-  {{ page.date }}
+  {{ page.date | humanizedDate }}
</time>
```

What we should see when you refresh the page in your browser is something like
this:

```html
<time datetime="Sun Dec 08 2024 18:00:00 GMT-0600 (Central Standard Time)">
  December 9, 2024
</time>
```

Now we have "December 9, 2024" instead of a much gnarlier string. Awesome!

### Machine Readable Date Filters

Let's do the same thing for our machine-readable date; we'll just represent that
JS DateTime object as an ISO-8601 date string.

Right below our human readable date filter in the Eleventy config, let's add
another filter:

```js
eleventyConfig.addFilter("machineDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj, {zone: "utc"}).toISODate()
});
```

Next, we'll update our template

```diff-njk
- <time datetime="{{ page.date }}">
+ <time datetime="{{ page.date | machineDate }}">
    {{ page.date | humanizedDate }}
  </time>
```

Refresh the page, and what you should see is this:

```html
<time datetime="2024-12-09">
  December 9, 2024
</time>
```

Perfection! If you get stuck, compare and contrast with [this
commit](https://github.com/andrewek/implicit-moon/commit/60fd73fa5d6f62fa468d96c653b703b4e213b418).

## A "Next" and "Previous" Link

Rather than asking users to go back to the Posts index and click to the go to
the previous or next article, we can just let them go straight to the next or
previous post.

More generically, for any collection (recall that in Eleventy we use tags to
define collections, and also we define collections in other ways), we can let
them go to the previous or next item in that collection.

(We worked with collections in [our previous step where we built a "posts" index
page](/posts/2024-12-08-posts-index-page/))

We'll do so with [the `getPreviousCollectionItem` and `getNextCollectionItem`
filters](https://www.11ty.dev/docs/filters/collection-items/#getpreviouscollectionitem-and-getnextcollectionitem).

Since we're in the `posts` collection (for our posts!) we'll work it like so, in
our `_includes/layouts/post.njk` file (put it at the end of the file):

```njk
{% set previousPost = collections.posts | getPreviousCollectionItem(page) %}
{% set nextPost = collections.posts | getNextCollectionItem(page) %}

<ul>
  {% if previousPost %}
    <li>Previous: <a href="{{previousPost.url}}">{{previousPost.data.title}}</a></li>
  {% endif %}

  {% if nextPost %}
    <li>Next: <a href="{{nextPost.url}}">{{nextPost.data.title}}</a></li>
  {% endif %}
</ul>
```

The first two lines define the `previousPost` and `nextPost` variables, which
will either be null or a page object. The next lines just set up an unordered
list with 0 or more items; if we've got a previous post, we'll have a link to
that post. If not, we won't. If we have a next post, we'll have a link to that
post; otherwise, that item just won't be there.

We'll worry about styling later.

Assuming you have several posts, go to one of your posts that uses the Post
layout and check it out. You should see the previous and next links.

Compare and contrast with [this
commit](https://github.com/andrewek/implicit-moon/commit/7d041c4b5f1e707ea2d6f3ba434a00e8f68e9288)
if you get stuck.

## Getting the Rest of Our Posts Fixed

Next, we just need to make sure the rest of our posts make use of the Post
layout. In every file in your `content/posts` directory, you'll want to ensure
that you've got front-matter that looks like:

```yaml
layout: "layouts/post.njk"
tags:
  - posts
  - My Other Cool Tag
  - Something Else
```

The `posts` tag is the only one that definitely matters here. You'll keep your
title, publication date, etc. just as they were if you like.

## Wrapping Up

## What's Next?

We have some good content. It's probably worth thinking about styling. We might
also create a tags list on the post as well as a "Tags" page (and perhaps the
ability to generate a page for each tag that lists posts with those tags).

{% endraw %}
