---
title: "Eleventy: Our First Post"
description: "Blogging / Blogging / Blogging"
date: 2024-12-07
layout: "layouts/base.njk"
tags:
  - posts
  - Eleventy
---

Since we're building a personal site, we may as well put some blog posts in the
works. Nothing says "This is a great use of time" like spending a bunch of
effort on a personal site for blogging only to stop blogging after exactly
three posts.

Nonetheless, we charge forward.

Our goals here are relatively straightforward:

1. We have multiple posts, written in markdown
1. Those posts render correctly as HTML using the layout we defined earlier
1. We access those posts in the browser

Later, we will introduce a specific layout for just our posts. For now, we'll
use the base layout.

If you're not familiar with Markdown, [check out these
docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).
It's just a way of writing content that renders to HTML without having to
hand-write HTML.

## Our First Post

Let's add a post. Create a file called
`content/posts/2024-12-07-hello-world.md`, and give it the content of:

```markdown
---
title: "Our First Post"
description: "Hello to the world!"
date: 2024-12-07
layout: "layouts/base.njk"
tags:
  - posts
---

## Hello to the world!

Glad to see you all.

1. Here
1. Is
1. A
1. List

Okay, goodbye.
```

We start with our YAML front-matter, which establishes keys of `title`,
`description`, and `date`, names the layout, and applies a tag.

We'll talk in more detail about tags in a future post. For right now, think of
it as "`tags: posts` adds this post to a collection called `posts` that we can
reference later".

The `date` attribute doesn't have to match your file name. It does for me,
because I prefer the date to be part of the URL slug, but you could just as
easily name your file whatever you like. Eleventy (optionally) uses the date
attribute to deterministically sort posts, though it's not the only way to sort
them. [Read more about content dates in
Eleventy](https://www.11ty.dev/docs/dates/), if you like.

You may have noticed that the numbered list items all start with `1.` instead of
going 1, 2, 3, ... _n_. In Markdown, so long as your first list item starts with
`1`, the others can be literally any number in any order, and it'll still render
the correct numbers in the correct order in HTML. I go with `1.` because then I
can re-order easily.

Once you've saved your file, assuming you've got the Eleventy server running,
you should see output in the Eleventy server (in your terminal) like this:

```
[11ty] Writing ./_site/posts/2024-12-07-our-first-post/index.html from ./content/posts/2024-12-07-our-first-post.md (njk)
[11ty] Writing ./_site/index.html from ./content/index.njk
[11ty] Wrote 8 files in 0.04 seconds (v3.0.0)
[11ty] Watching…
```

Navigate your browser to
[http://localhost:8080/posts/2024-12-07-hello-world](http://localhost:8080/posts/2024-12-07-hello-world), and you should see it rendered in all of its glory.

... its plain text glory... but glory nonetheless.

If you update the title attribute in the YAML front-matter, you should see the
title on the page change. If you add or change some content otherwise, you
should see a change.

[Here's my first
post](https://github.com/andrewek/implicit-moon/commit/665d1bf3d6b1f7af42bf9208014a35bd1a3181dc),
which is mostly just a test-bed for some Markdown.

[Here's my second post](https://github.com/andrewek/implicit-moon/commit/68d0d6028706f77132a031526670fdfff3cef9ee) and my [third
post](https://github.com/andrewek/implicit-moon/commit/e000633c6cae3943346521f1bf72ee799d67eb83).

Note how they include the same YAML front-matter we described above, as well as
how they're just written in Markdown.

## Our Second Post and Beyond

If you want to, add a second post! I find it easiest to just copy a post over
with a new file name, delete the content, and update the YAML front-matter. You
can also build it by hand. No one will stop you except you. You should be able
to navigate to this post as well by typing in the URL.

You can make more posts if you want! But you don't have to.

## A Quick Note about Draft Posts

This doesn't matter yet, but you can add `draft: true` in the front-matter to
make a post visible in local development but not when we do the Eleventy build
(e.g. to publish it to our real website). Then when you're ready to publish,
just remove that line from the YAML front-matter.

You can also use git branches, but if you're a trunk-based development fan
(like me!) then the "draft" feature will be nice.

## Wrapping Up?

Now we've got a site, with a home page, and at least one post. Hopefully you've
also stayed hydrated through this process.

Up next we'll deploy to Netlify, install Tailwind (for styyyyyyles), and start
working on making our posts discoverable by just clicking around.
