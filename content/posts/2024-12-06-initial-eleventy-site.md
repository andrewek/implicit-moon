---
title: "Eleventy: Zero to Hello World"
description: "Zero to Hello World"
date: 2024-12-06
tags:
  - Eleventy
---

In the previous post in this series, [we laid out an initial
vision](/posts/2024-12-05-eleventy-start/) for what we want this Eleventy site
to look like. By "initial vision" we mean a "great whacking list of
things".

In this post, we're going to:

1. Establish the site and a home page
1. Get it building and running
1. Build a base layout with just a bit of metadata

We won't have blog posts yet, nor styles or really anything super interesting.
Not yet. Those will come with time.

If you want to skip ahead to the end, [check out the full
commit](https://github.com/andrewek/implicit-moon/commit/02f722d5051e696cadd9a8887198789d43b3b18e).

## Initial Directory Structure

Here is roughly what I like for these types of sites:

```
my-cool-site/
 + README.markdown
 + package.json
 + eleventy.config.js
 + content/
   + index.njk
   + posts/
 + _data/
   + metadata.js
 + _includes/
   + layouts/
     + base.njk
 + _site/
```

The four directories that matter are `content`, `_data`, `_includes`, and
`_site`.

`content` is where we put our content: our pages, our blog posts, etc. This is
where we'll do the vast majority of our work.

`_data` is where we'll put JS files that define some handy site-wide values. We
won't do a ton here at this time, though there are some neat tricks we can pull.

`_includes` is where we put our layout templates and potentially some view
helpers. At the basic level, this mostly just lets our content files focus
_only_ on content, rather than also on things like nav headers, footers,
`<head>` stuff. We can get fancier with these too, and probably will eventually.

`_site` is where Eleventy puts the built HTML and asset files every time it
builds. We won't commit this, but it's occasionally useful to go peek at 'em.

We may as well make these folders. Follow along if you like.

We'll start with a project directory:

```sh
mkdir my-cool-site
cd my-cool-site
```

(call yours whatever you want)

At this time I'll usually `git init` for the joy of version control.

Next we'll make our folders (make sure you're in the `my-cool-site` directory)

```sh
mkdir _site
mkdir -p _includes/layouts
mkdir _data
mkdir content
```

I like to put a `.keep` file at the root of any folders I'm wanting to keep,
just so the folders get tracked by git. `touch _data/.keep`, for example.
Folders without files in them do not get tracked by git.

I also typically put `_site` in my `.gitignore`. Ditto for `node_modules/`.

## Dependencies

We'll need NodeJS. I like [`asdf`](https://asdf-vm.com/) for managing my
dependencies, so it's a pretty easy `asdf local nodejs 22.12.0`, then `asdf
install`. This will create a `.tool-versions` file in the root directory of your
project. If you'd rather install NodeJS a different way, do that instead.

I like `yarn`, so we'll do `yarn init` to create our `package.json` file, also
in the root directory of our project. Follow the prompts on the screen. It's
okay to use the defaults if you're not sure. This is where we'll put our various
dev dependencies.

## Index.njk

Next we need a home page. When browsers try to resolve a path that doesn't end
with a file extension, e.g. `/blorp/`, they'll look for `/blorp/index.html`
first.

We'll do the same here, though instead of HTML, we're going to use
[nunjucks](https://mozilla.github.io/nunjucks/), which is a handlebars-like
templating markup language. The reason we're doing this is to let us (later) use
some of the cool templating features that nunjucks will give us.

To make the file: `touch content/index.njk` (or just do it in your text editor)

In that file, we'll want something like this:

```html
<h1>My Cool Site</h1>

<p>Welcome to my cool site</p>
```

Note that this is just HTML... *for now* ... we'll change that in a future
section.

Unfortunately our site still doesn't build, so we can't look at it in the
browser. YET.

## Install and Configure Eleventy

Now the fun begins. In the root directory (where our `package.json` file is),
we'll run `yarn add --dev @11ty/eleventy` (you can also modify `package.json`
directly).

We add Eleventy as a "dev dependency" because it only runs during our
build process; Eleventy doesn't run on the production web server. If there's a
JS package needed for client-side behavior on our production site, we'll add
that as a regular dependency.

Next, we'll add this section to our `package.json`, with `scripts` as a
top-level key:

```js
{
  // .... other stuff
  "scripts": {
    "build": "npx @11ty/eleventy",
    "start": "npx @11ty/eleventy --serve"
  },
  // more stuff
}
```

The `--serve` argument in the `start` script means that when we run `yarn
start`, the running Eleventy server will watch for file save events, rebuild the
site, and refresh our browser all at once. It's pretty cool. Some folks add
`--quiet` as well (you'll see this in the Eleventy base blog linked at the
bottom), but I prefer to see the build output, as it makes it easier to
spot-check that the output is correct.

Now we can run `yarn start` (on the command line) to build our site. But we have
one more thing we need to do!

## Eleventy Config

In the project root directory, create a file called `eleventy.config.js`, with
the following content:

```js
export default async function(eleventyConfig) {
  // We'll put stuff here soon
};

export const config = {
  templateFormats: [
    "md",
    "njk",
    "html"
  ],

  // Process *.md as NJK
  markdownTemplateEngine: "njk",

  // Process *.html as NJK
  htmlTemplateEngine: "njk",

  // Define the directory structure
  dir: {
    input: "content",
    includes: "../_includes", // relative to content/
    data: "../_data", // relative to content/
    output: "_site"
  },
}
```

In this file, we:

1. Specify that we're using Markdown (`.md`) and Nunjucks (`.njk`) as well as
   HTML (`.html`)
2. Specify that we should expect a pipeline that more or less looks like `MD ->
   NJK -> HTML`
3. Define our directory structure to match what we described above.

## Run the Server and Check Our Work

At this point, what we should be able to do is run `yarn start` on the command
line in the root of our project, then navigate our browser to `localhost:8080`
and see that page we set up earlier.

If you want to, make some updates to that `content/index.njk` page and watch the
update live in your browser. Or add another page, also in `content/` and
navigate there. If you add `content/blorp.njk` you'll navigate your browser to
`localhost:8080/blorp`. You can even experiment with nesting, e.g.
`content/foo/bar/baz.njk` will give you `localhost:8080/foo/bar/baz/`

Use `CTRL + C` to stop the Eleventy server. If you refresh the browser at
`localhost:8080`, you should see an error page.

## Base Layout and the Start of the Layout Chain

If you inspect the resultant HTML in the browser (or just check out the output
`_site/index.html` file), you'll notice that it's just some content but it's
nowhere close to semantically correct HTML. We're lacking a `<head>`, for one.

Let's fix that by creating a base layout. Create a file called `base.njk` in
`_includes/layouts`, and give it this content:

```njk
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title or metadata.title }}</title>
    <meta
      name="description"
      content="{{description or metadata.description}}"
    >
  </head>

  <body>
    <main>
      <h1>My Cool Site</h1>

      {{ content | safe }}
    </main>
  </body>
</html>
```

A lot of this will be familiar to you if you've hand-written HTML recently. The
parts that might be new are the Nunjucks lines, like:

```njk
<title>{{title or metadata.title}}</title>
```

or perhaps:

```njk
{{ content | safe }}
```

The former example, `{{title or metadata.title}}` looks for a page data
attribute called "title" (defined in front-matter, or a computed value), but
then falls back to a `metadata.title` value (which we'll define later).

The latter takes `content`, which is a computed data string representing the
rendered content of the page, and pipes it through the `safe` function, which
just ensures that it renders appropriately and we're not at risk of things like
cross-site-scripting.

Now that you've got this layout, we need to use it. Add this YAML front-matter
to `content/index.njk` at the very top of the file:

```yaml
---
layout: "layouts/base.njk"
title: "My Home Page"
description: "My cool site is a site that is cool"
---
```

(Note the triple dashes before and after; this is how we indicate front-matter)

Now when you look at the page in the browser again and inspect, you should see,
in the document's head, the values we defined. And whatever content you have in
that `index.njk` page should also still render as desired.

[See more about Eleventy layouts here](https://www.11ty.dev/docs/layouts/). In
later posts, we'll probably make use of [layout
chaining](https://www.11ty.dev/docs/layout-chaining/) to provide special layouts
for just certain types of pages. For now, one layout will suffice.

If you like, make a few more pages, or a second layout, and see how it changes
as you shift from one layout to the other layout, or even as you try to specify
a layout that doesn't exist at all.

## Just a Bit of Data

Remember the `{{title or metadata.title}}` line from above and how I said we
would get to it? Well. The AGE OF RECKONING is upon us, by which I mean we are
going to get to it.

For frequently used (or just convenient to have) values, we can define them in
data. We can also define functions that produce data, or consume data from some
other source (like a headless CMS) and build pages from it.

Right now we will just define some metadata. Create a file called
`_data/metadata.js` and give it the following contents:

```js
// _data/metadata.js
export default {
  title: "my cool site",
  url: "https://example.com",
  language: "en",
  description: "things",
  author: {
    name: "Your Name",
    email: "your@email.com",
    url: "https://example.com"
  }
}
```

Change the values if you like. Add other keys or values if you like.

Now we can access these data values as `metadata.title` (for example). If our
file were called something like `siteData.js`, then we'd access the values with
something like `siteData.title` or `siteData.author.name`

Let's play with this a bit. In `_includes/layouts/base.njk`, add something like
this right below the closing `<main>` tag but before the closing `<body>` tag:

```njk
<footer>
  <p>All content copyright {{metadata.author.name}}, 2024</p>
</footer>
```

Assuming you structured your metadata file like what we saw above, you should
see "All content copyright Glorfindale Balthazar, 2024" there.

If you like, play with more metadata values and see how they feel. Or define a
second data file and pull values from that. So long as those data files are in
`_data/`, Eleventy will pick them up during the build process.

## Wrapping Up

At this point, we've got a static site that we can run and view locally. It
parses NJK files (we've verified this), makes use of some data files, and lets
us define a layout.

Not bad at all!

## What's Next?

We still need to:

1. Get the site up on the internet for the world to see
1. Define our blog posts and render them and all that
1. Add some styling and maybe some client-side JS
1. Eat a snack
1. Maybe do some other things too

I'm going to start with a snack, then we'll just find out which of the others I
decide to tackle next.

## Further Reading and Examples

I based a lot of this work on a combination of the [Eleventy
docs](https://www.11ty.dev/docs/) and the [official Eleventy Base
Blog](https://github.com/11ty/eleventy-base-blog), plus some previous projects
I've done.

I'll suggest checking out the above links, as well as maybe experimenting with
the [Eleventy starter projects](https://www.11ty.dev/docs/starter/) if you feel
so inclined.
