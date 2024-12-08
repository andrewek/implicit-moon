---
title: "Eleventy: Deploying to Netlify"
description: "Let's show the world"
date: 2024-12-07
layout: "layouts/base.njk"
tags:
  - posts
  - Eleventy
---

In our [last step, we added posts](/posts/2024-12-07-our-first-post). Now we're
going to get those posts up on the internet for the world to see.

Specifically, we'll use [Netlify](https://netlify.com), which is a very fine
static site hosting platform.

Our steps will broadly follow the [official Netlify + Eleventy
guide](https://docs.netlify.com/frameworks/eleventy/).

## The Basic Flow from Here Onward

Given a git-tracked repository holding our static site, basically from here
forward what we want is:

1. You make 1 or more changes to your Eleventy site
1. You commit and push to GitHub on whatever your trunk branch is (e.g. `main`)
1. Netlify picks up the push automatically, then builds and deploys the new
   site

We might (correctly) call this a "CI/CD" pipeline.

Netlify also offers things like preview builds (if you push to a non-trunk
branch), but we're not going to worry about those.

## Configure the Build

Before we move further with Netlify, we're going to make sure we specify, in
advance, the desired build command. Create a new file in your project root
called `netlify.toml` (TOML is sort of like YAML), and put the following content
into it:

```toml
[build]
  publish = "_site"
  command = "npm run build"
```

Remember the `build` script we defined in `package.json`? This is where that
comes in (for the `command` key). And since our output files all go into
`_site`, we'll add `publish = "_site"`.

If you're not sure whether you did that or not, compare and contrast your
`package.json` [with
mine](https://github.com/andrewek/implicit-moon/blob/main/package.json),
specifically looking at the `"scripts"` key.

## Assumptions

We're starting with the assumption that you're using GitHub or equivalent, and
that you've got all of this code up in a public repo. If that's not the case,
either make the change or come back to this later when you're ready.

## Get Set Up on Netlify

To start, you'll need to make a free Netlify account. If you want to use a
private repository, or if you want some of the cooler features, you'll need to
make a paid account instead.

I have literally nothing to hide here and next to zero traffic, so it's a public
repo and a free account.

The easiest way to kick this off is to [import your site from an existing
repository](https://docs.netlify.com/welcome/add-new-site/#import-from-an-existing-repository)
once you've created a new site.

You'll give it some name, and you'll get a public domain that ends with
`.netlify.app`. Mine, for example, is `https://implicitmoon.netlify.app`. It's
not too bad to configure a custom domain here (assuming you've purchased one),
but that's outside the bounds of what we're doing here.

## Check It Out

After you import the site, you should see a new production deploy kicking off.
It'll hopefully take just a minute or so. As soon as that's ready, go view your
site at the provided domain!

What you should see is your home page. Then if you type in the path for one of
your posts, e.g. [https://implicitmoon.netlify.app/posts/2024-12-05-eleventy-start/](https://implicitmoon.netlify.app/posts/2024-12-05-eleventy-start/), you'll see that post as well.

(In a near-future step we'll get a "posts" index page).

## Testing the Deploy

Once you make changes locally, commit those changes, and push to your trunk
branch, you should see Netlify kick off a build within a minute or two. At this
time these builds should take well under a minute. Then once they're done and
you refresh the page on your live site, you'll see the changes. Cool, huh? Doing
it this way way lets you iterate fairly quickly.

As we increase content and increase the number of steps in our builds, the
builds will naturally slow down. It will still be a long time before those build
times are anything other than "pretty stinking fast".

## Draft Posts Strike Back!

If you wanted to experiment with draft posts (which we discussed briefly in the
previous step), now's the chance. Make a new post (call it whatever you want; or
you can update an existing post), and include `draft: true` in the YAML
front-matter. Once you commit and push, you'll see that this page _doesn't_ get
built as part of the Netlify build process and won't publish.

Once you either delete `draft: true` or change it to `draft: false`, then commit
and push, you'll see on the next build/deploy that the post is now accessible by
its URL.

## Other Hosting Options

You can host on lots of different platforms. I've got direct experience with
Netlify, CloudCannon (some of the nicest developers I've ever met, plus WYSIWYG
editing right in the browser for if you're working with a marketing team that
wants to go change images, swap copy text, etc.), and GitHub Pages. I hear good
things about Vercel.

[Check the official Eleventy deployment
guides](https://www.11ty.dev/docs/deployment/).

## More JAM-stack with a CMS?

If you're really feeling wild, you can go one step further. Instead of keeping
your content in the file system (with your template files and so on), you could
manage your content with a "headless CMS" (content management system).

In a "headless" CMS, you write your content but don't worry about presentation;
it's just text held in a database somewhere. Then every time you publish an
update, your CMS would fire a webhook off to Netlify (or wherever) and to
trigger a rebuild of the site. The eleventy build process, instead of scanning
your local file system for blog posts (etc.), would fetch those from some API.

Headless CMSs are pretty cool, in that they would allow for a marketing team
(for example) to update pages without ever needing to learn HTML or Git or
things like that, and the developers can pretty tightly control the experience.
The downside is that there's a bigger gap between content-in-progress and its
presentation. It's harder to see what a draft looks like without just publishing
it.

I prefer doing my editing locally, with just the file system. But I'm spoiled.

## What's Next?

We have some pages and we have a running site accessible to the world. Next
let's get some styling in and build a "posts" page.
