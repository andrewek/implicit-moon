---
title: Laying Out the Technical Vision of the Site
description: Hopefully this helps us build the thing?
date: 2024-12-05
layout: "layouts/post.njk"
tags:
  - Eleventy
  - posts
---

I am building a site for myself, in the grand tradition of software developers
who really should be doing other things with their time. This site will be a
place to put things I write. I assume it will also be (in the grand tradition of
pretty much anyone who starts a blog) ignored 99% of the time, and the other 1%
of the time it will be "I should really write something..." but not actually
writing anything.

I am building this site with [Eleventy.js](https://www.11ty.dev/), which I've
used before and enjoy. Eleventy is a static site generator; it takes a bunch of
files in a bunch of formats and smushes 'em all together into a series of HTML
files (plus CSS, JS, and any assets) that can be placed somewhere useful and
served up directly. There's no database, no running web application (beyond
NGINX or Apache or whatever actually turns the computer into a web server), and
relatively little overhead.

(As a bonus, I believe I was the first person to deploy a production Eleventy
site on [CloudCannon](https://cloudcannon.com/), and almost certainly the first
to deploy a production Eleventy site with Alpine JS on CloudCannon.)

In the past, my process was to grab a starter project and then modify it
heavily. This time I am starting from scratch. I am doing so because there are
other things I should be doing instead. I am very committed to productive
procrastination, as one really must be in this day and age.

In this article series, I will describe the steps I am taking and do my best to
show how and why things are the way they are. The repo is public, and I'll link
to commits as they happen.

Here is our broad outline, though I make zero guarantees of the order here

1. The site exists, has a homepage, and can be accessed through the browser
1. We have some posts up and they can be found by clicking around
1. There are styles!
1. The site builds and deploys to Netlify with the right domain, etc.,
   automatically on push to the `main` branch
1. Code blocks have syntax highlighting
1. We handle important things like RSS, a sitemap, open-graph data (for social
   media embeds), proper handling of images, SEO tags, and so on
1. We can do stuff like find posts by tag, do some pagination of our posts page,
   go "next" and "previous" (when applicable), and so on
1. Is there full-text search? There could be full-text search
1. It'd be cool if we could string together a long series of posts into a "Part
   1, Part 2, ... Part N" list that automatically gets populated at the top of
   all posts in that series, and it just works.
1. It'd be cool if there were the ability to (optionally) apply a table of
   contents to longer posts.
1. It'd be cool if CI/CD did a Lighthouse (or general A11y) audit, checked
   dependencies, etc.
1. Maybe a nice little CLI utility script to produce a new blog post (blank, in draft
   state) in the right spot
1. Footnotes? Footnotes!
1. Analytics, etc. What is the point of having a personal website if I cannot
   see whether or not anyone other than me visited it this year?

No idea what order I'll tackle these in. The exact order likely does not matter
much, if at all.

In subsequent posts, we'll begin actually doing the work described above.
