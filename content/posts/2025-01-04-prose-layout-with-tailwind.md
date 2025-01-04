---
title: "Eleventy: Prose Layout for Content"
description: "All about typography .... except not?"
date: 2025-01-04
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

{% raw %}

Now that we've got a base layout, we need to handle the problem of our prose
looking terrible.

It really doesn't look great right now.

Instead of styling, we just have unstyled prose that extends way too far. Let's
fix that.

## Styling Prose

With static pages (which we do technically have), one choice we have is to just
style everything by hand.

We could apply all of our styles by hand and really, really work those theme
skills.

For a perfectly crafted marketing page, sure. We should probably do something
like that.

For a blog, where what we probably want is the ability to just write in
Markdown and have stuff get styled the way it should, that's going to be tedious
and will likely keep us from doing much writing.

More generally, if we have "uncontrolled" content, that is, if we have a page
that's responsible for rendering content given to it rather than just
statically-coding HTML, we should be able to handle that. This could be like
what we have here, where Markdown becomes HTML. But it could also be like if
were using a "headless" CMS that provided content as data, from which our
Eleventy site would build all of the pages.

To fix this, we're going to use [Tailwind's Typography
plugin](https://github.com/tailwindlabs/tailwindcss-typography), which is
purpose-built for styling chunks of "uncontrolled" prose. It's what I'm using on
this site that you are reading, in fact!

What it will basically look like is this:

```njk
<main class="prose">
  {{ content | safe }}
</main>
```

Applying the `prose` utility class to the container around our content will give
us all sorts of pleasant enough (and overridable, if we so desire) default
styles.

## Order of Operations

1. Install the Tailwind Typography plugin
1. Get our `main` element looking the way it should
1. Apply some mild style enhancements
1. `prose` and `not-prose`

## Install Tailwind Typography

On the command line, after stopping your Eleventy server, you can run:

```sh
yarn install -D @tailwindcss/typography`
```

This will install the Tailwind Typography plugin as a dev dependency.

Then update your `tailwind.config.js` file's `plugins` entry:

```diff-js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["content/**/*.{njk,md}", "_includes/**/*.njk"],
  theme: {
    extend: {},
  },
  plugins: [
+    require("@tailwindcss/typography")
  ],
}
```

[Compare what you've done to the git commit here if you're
unsure](https://github.com/andrewek/implicit-moon/commit/e5f3aca08f86db32eba6ef1c299576c357b55fec).

Then you can restart your Eleventy server.

## Base Style for Our Main Element

Now that we've got the prose plugin, we can make use of it.

In `_includes/layouts/base.njk`, replace the existing `<main>` element with
this:

```njk
<main class="grow mx-auto w-full max-w-5xl prose prose-sm md:prose-base
             lg:prose-lg dark:prose-invert p-6 prose-a:text-blue-500">
  {{ content | safe }}
</main>
```

You'll recognize the `grow` utility class from our previous step.

Then we set up some container boundaries with `mx-auto w-full max-w-5xl p-6`:
this gives us a box of max-width `5xl`, that occupies the entire available width
(either the width of its parent or `5xl`, whichever is smaller). Then `mx-auto`
gives us even margins on either side, and `p-6` gives us internal padding of
1.5rem.

There's also `max-w-prose`, if you like, which is a bit narrower. I prefer the
look of `max-w-5xl` on full-sized screens.

The prose-specific classes merit some explanation:

+ `prose`: This modifier sets up the base prose stylings and is required for
  utilities further down this list to be available
+ `prose-sm`: We'll use a smaller text size by default from the [available type
  scales](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#applying-a-type-scale)
+ `md:prose-base`: On medium-sized screens and above, we'll use the "base" size
  of text, which is a bit bigger.
+ `lg:prose-lg`: On large screens, we'll use larger text.
+ `dark:prose-invert`: Normally `prose` gives us dark text. [`prose-invert`
  flips the colors from the
  theme](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#adapting-to-dark-mode).
  `dark:prose-invert` only inverts the prose colors when the browser is in dark
  mode. There are [other color themes
  available](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#choosing-a-gray-scale),
  like `prose-slate` or `prose-zinc`, and you can define your own color themes
  if you desire.

(We'll tackle `prose-a:text-blue-500` in the next session).

The prose utilities compose together; you'll always want `prose` to happen
first, then any other prose utility classes after that.

## Mild Style Enhancements

I decided that I wanted the links to have a little more pop than they were
getting, and so wanted to change the link color. One option here is to change
the color inline, e.g. putting `<a class="text-blue-500" href="/">Home</a>` in
our templates, rather than writing in markdown with `[Home](/)`; but I'd rather
still write in markdown and not have to remember to apply the class to all of my
links.

Good thing the Typography plugin lets us override [default element styles selectively](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#element-modifiers).

In this case, I'm using `prose-a:text-blue-500`: we can read this is "For anchor
tags within a prose block, apply 'text-blue-500'". We could similarly compose
with other modifiers, e.g. `hover:prose-a:underline` (to underline links on
hover when those links are inside a prose block).

There are a whole bunch of options. If you've got a bunch of prose blocks on
your site, you can also set [site-wide prose modifiers in your Tailwind
config](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#customizing-the-css).
Since we only have one actual prose block on our site, I'm choosing to not worry
about this approach.

## Gotchas, `prose`, and `not-prose`

Since `prose` style modifiers tend to take priority over other modifiers in a
chunk of text, you can get some really inconsistent results if you try to
selectively style elements within prose block (or more complex elements like
tables).

In those cases, you can do something like this:

```html
<div class="prose">
  <p>Some stuff</p>

  <div class="not-prose">
    <p>Some other stuff</p>
  </div>
</div>
```

The `not-prose` modifier just stops the default prose styling from getting
applied, which then lets you apply your own styles as you like. [Read more
here](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#undoing-typography-styles)

It's likely you won't ever need this.

## Wrapping Up

At the end of this step, we've got the Tailwind Typography plugin installed and
we got some prose going.

[Check out what your base layout should look
like](https://github.com/andrewek/implicit-moon/blob/218a457cc368ba8e3efbc6ff5c16ae948bd7a91f/_includes/layouts/base.njk#L41-L43),
if you want.

What we should be able to do from here is mostly author text and have it show up
as it should.

## Further Reading

If it's of interest to you, you might wish to [read more about the genesis of
this plugin](https://play.tailwindcss.com/uj1vGACRJA?layout=preview). In it, the
authors explain some of the design choices they made and why they made them. For
example, they talk about why the `prose` styling doesn't support `h5` or `h6`
headings.

Without offering any commentary on these particular choices, I'm a big fan of
seeing documents that explain what choices were made and why, rather than simply
outlining what's available.

## What's Next?

Now that you've got your typography displaying correctly, go check out the
pages you've built (your posts, as well as your [`/posts`](/posts) index page,
which is also rendered with `prose`. You might check out [our Markdown test-bed
post](/posts/2024-12-04-hello-world/) ([github
link](https://github.com/andrewek/implicit-moon/blob/main/content/posts/2024-12-04-hello-world.md)),
too, just to see how it plays with prose.

Up next, we're going to take a quick detour into the land of accessibility
checking and Lighthouse for our Eleventy site.

{% endraw %}
