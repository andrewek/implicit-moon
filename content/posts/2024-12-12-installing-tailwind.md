---
title: "Eleventy: Installing Tailwind"
description: "Let's make our posts look nicer yet!"
date: 2024-12-12
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

{% raw %}

In our last step, we got a posts layout working.

In this step, we're going to introduce some styling and get away from the
browser defaults.

For our purposes here, we're going to use [Tailwind
CSS](https://tailwindcss.com/docs/installation), and get it set up so that:

1. We have some base styles that we can apply everywhere
1. When our site builds, Tailwind generates an appropritely minified CSS file
   (instead of everything that Tailwind includes)
1. It all looks nice live on production

If you don't want to use Tailwind, that's perfectly fine too. You'll want to
[follow the steps for including assets in an Eleventy
project](https://www.11ty.dev/docs/assets/), perhaps ... or just leave your site
raw and unstyled in the fashion of the Olde Gods. We do not judge here.

This will be a longer post with many steps.

## Notes on Tailwind and Utility-First CSS

When I am left to my own devices for styling, I choose Tailwind. Ordinarily I'd
be using some flavor of [utility-first
CSS](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/), but
rather than write my own inferior utility CSS classes, I just use (or modify)
the ones Tailwind provides. Tailwind is also close enough to base CSS that I can
pretty easily say "Okay, I know the name of the CSS property I want to use" and
then from that figure out the appropriate Tailwind utility.

The reason I do this instead of "semantic" or "component-based" CSS (or a CSS
pre-processor like SASS) is because I want to very precisely control the blast
radius of change.

What I mean by this is that I'd rather make the same edit several times (and
know exactly what is and isn't changing) than make an edit to my CSS that
inadvertently breaks something unrelated. I've been bitten by this too many
times, especially in very large sites, to want to fall victim to it again.

Long class names do not bother me. Duplication of class names does not bother
me. Accidentally breaking something unrelated *without knowing about it* bothers
me a whole lot.

Tailwind (or really any utility-first CSS approach) lets me avoid accidentally
breaking unrelated things.

Beyond a certain point of complexity, especially in a project where CSS is
either dynamically generated (e.g. with SCSS utilities) or where class names are
dynamically constructed (which you can pretty easily do in HEEX, JSX, ERB, etc.
with just regular old string interpolation), it's really, really hard to
definitively say that I know all the places where a given CSS class is getting
applied. Really, really hard. At some point in those projects I just start
adding classes instead of removing them because I'm too afraid of breaking
something by accident.

Tailwind lets me largely avoid this.

It's also often the case that my first stab at components is incorrect in some
meaningful way (like the examples in Adam Wathan's post above). In those cases,
especially if there's the pattern of a base class that does most of the
groundwork followed by several classes that either modify existing styling or
add further styling, then the blast radius of change can get pretty high
inadvertently. By just sticking with utility classes for a while, I can also
avoid "wrong abstraction" for longer when it comes to higher-order "semantic"
CSS.

If I'm working in with a skilled front-end dev who has their own approach, e.g.
BEM, SMACSS, OOCSS, or any of a million other variants, I'll use that instead.
There are lots of [really smart folks who don't use
Tailwind](https://joshcollinsworth.com/blog/tailwind-is-smart-steering) and who
purposefully choose to not use Tailwind. I'm not going to argue with those folks
that they should be doing things differently.

My only argument here is that when I am working by myself, or when I'm the one
who's setting the front-end direction, my order of operations is usually to
first use Tailwind's utility classes, then to make use of my framework's (React,
LiveView, ERB templates, etc.) ability to define components or partials, then to
eventually land on a useful design system.

If I were smarter, I could maybe get that design system faster. But I'm not. I
pick tools that don't require me to be smarter than I am.

It's not that I can't do this with regular CSS, or SCSS, or any of a million CSS
frameworks. I can do that too. I just like Tailwind the best.

## Installing Tailwind and First Styles

Our steps here are relatively straightforward. We will:

1. Get ourselves some "canary" styles
1. Install Tailwind
1. Put important files where they belong
1. Configure Tailwind to run every time we build the site
1. Set our site head so that it references relevant (generated) CSS files
1. Verify that it works on production

These are lightly modified from the [official Tailwind installation
guide](https://tailwindcss.com/docs/installation), and customized for our own
purposes.

## Set up a Canary So We Know When It Works

... Except this canary doesn't die, and instead will *sing*.

On pretty much any page you want, add something like this:

```html
<h4 class="text-red-500 text-xl">This is some test text</h4>
<h4 class="text-green-600 text-lg">This is more test text</h4>
```

What you should see (before we style) is this, that is, the H4s should be styled
with the default system fonts and no colors, etc.

> <h4>This is some test text</h4>
> <h4>This is more test text</h4>

What it will become after we get Tailwind working is this:

> <h4 class="text-red-500 text-xl">This is some test text</h4>
> <h4 class="text-green-600 text-lg">This is more test text</h4>

The top one should be larger than the second one, and should be red (while the
second one is green). We should also see that they're no longer in the system
font. But it won't work until we get through all of the steps below.

## Installation and Boilerplate Configuration

On the shell (after we stop our Eleventy dev server), we'll get Yarn to install
Tailwind's CLI for us:

```sh
yarn add -D tailwindcss
```

You'll see this add the package under `devDependencies` in your `package.json`
file and then install the dependency.

The CLI is responsible for several things, one of which is scanning all
generated HTML files for the relevant classes so that it can pull in only the
needed utility classes (rather than all of them).

Assuming this succeeds (it should!), we'll next give ourselves a blank Tailwind
config. In the base of our application root, on the shell in our terminal, run:

```sh
yarn run tailwindcss init
```

This should create a `tailwind.config.js` file for us, with some boilerplate
contents.

If you're feeling stuck, compare and contrast what you've done with [this
commit](https://github.com/andrewek/implicit-moon/commit/79f093afeb41d91ddf5a14c0dff224bcdd4a47e6)

## Set up a Base CSS File

In the project root, create a folder called `assets/` and within that, a file
called `base.css`. We'll apply the appropriate Tailwind directives in here:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

These ["directives"](https://tailwindcss.com/docs/functions-and-directives) just
signal to the Tailwind CLI that it should perform some command. Other Tailwind
directives include `@apply`, `@config`, and `@layer`, none of which we're going
to worry about here.

[Git commit in case you want to
compare/contrast](https://github.com/andrewek/implicit-moon/commit/9c229e288ba68485665922daca9ffd2b5f33c37b)

Later, we'll use this `assets/` folder for things like favicons, images, and
perhaps some Javascript if we're feeling really saucy. Perhaps.

## Run It Once ... Only Somewhat Successfully

We've got our input file at `assets/base.css`, and we want an output file in
`_site/style.css`, where we can pick it up on site render.

Along the way, we need to set up an intermediate "pass-through" copy; this is
just a way to signal to Eleventy that we want some file to be taken as-is from
its input source to its destination in `_site/`.

We'll set that pass-through now in our `eleventy.config.js` file:

```js
  eleventyConfig.addPassthroughCopy({
    "./assets/out.css": "style.css"
  })
```

This will take a file called `assets/out.css` and put it in `_site/style.css`
with the exact same contents.

We'll also add `assets/out.css` to our `.gitignore` because it's dynamically
generated and prone to changing frequently. This creates a sort of interesting
problem for us in that Eleventy will [ignore anything in `.gitignore` by
default](https://www.11ty.dev/docs/ignores/#defaults).

To fix that, we'll first add this line to our `eleventy.config.js` file:

```js
eleventyConfig.setUseGitIgnore(false)
```

Then we'll create an `.eleventyignore` file (like our `.gitignore`) with the
following contents:

```
.DS_Store
node_modules/
_site/
yarn.lock
.cache
```

Next, let's add the reference to the generated file in our base layout
(`_includes/layouts/base.njk`), inside the head:

```html
<link href="/style.css" rel="stylesheet" />
```

Next, let's run the Tailwind CLI so that it produces the desired output file. On
the terminal, do:

```sh
yarn run tailwindcss -i ./assets/base.css -o ./assets/out.css`
```

You should see output like this:

<pre>
Rebuilding...

warn - No utility classes were detected in your source files. If this is
       unexpected, double-check the `content` option in your Tailwind CSS
       configuration.
warn - https://tailwindcss.com/docs/content-configuration

Done in 86ms.
✨  Done in 0.72s.
</pre>

When we look in `_site/`, we should see `style.css` (it'll have some stuff in
it)

Now check it out in the browser. Almost all of our default system styling will
be _wrong_. Links won't look like links. Headers won't look like headers. It'll
all look like unstyled prose text (unless you've got some `<pre>` blocks or code
blocks in there: those will have a monospaced font).

Our canary lines above won't be styled the way we expect, either. Nor will our
ordered or un-ordered lists. Nor anything else.

What we need to do now is get Tailwind's CLI to pick up the actual classes we're
using in our files.

[Check out the git commit if you
want](https://github.com/andrewek/implicit-moon/commit/a48b4fd51f58bc37c3a842397096b2f3f3caca69)

## Tell Tailwind Where to Look

The Tailwind CLI works by scanning our files for `class="some class name"`; then
it produces the correct CSS file for just those class names. Thus, we need to
tell it where to look.

In `tailwind.config.js`, make the following changes:

```diff-js
  export default {
-   content: [],
+   content: ["content/**/*.{njk,md}", "_includes/**/*.njk"],
    theme: {
      extend: {},
    },
    plugins: [],
  }
```

What this basically is doing is saying "Hey Tailwind, scan all Nunjucks and
Markdown files in our `contents` and `_includes` directories for relevant
utility class names". This will pick up all of our pages, posts, and layouts.

With that change, make sure you've got your canary lines on-screen and re-run
the Tailwind build process:

```sh
yarn run tailwindcss -i ./assets/base.css -o ./assets/out.css`
```

You should see output like this:

<pre>
Rebuilding...

Done in 113ms.
✨  Done in 0.53s.
</pre>

After you refresh the page (you'll need to refresh the page here), you'll see
the desired canary text is now styled the way it should be! Cool!

(If you're stuck, compare with [this git
commit](https://github.com/andrewek/implicit-moon/commit/66fe5963912ebb6c174c27bb5d15304cd9bd7eb3))

If you check out the generated CSS file (in `_site/style.css`), you'll see:

```css
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
```

These are the exact colors we referenced earlier; you won't see any of the
[*many* other colors available](https://tailwindcss.com/docs/customizing-colors)
in Tailwind.

But if we change one of our canary lines to to `text-emerald-800` (a lovely
shade of green), we'll see the page refresh, but the color will go back to
black. This is because even though Eleventy is watching our file saves,
Tailwind's CLI is not.

We can manually re-run the Tailwind CLI command above to regenerate the CSS, but
that's tedious.

Let's fix it so it runs every time.

## Run Tailwind Every Time We Build!

```js
  "scripts": {
    "build": "npx @11ty/eleventy",
    "start": "npx @11ty/eleventy --serve"
  },
```

The `start` command (which we invoke with `yarn start` to run our dev server) is
responsible for rebuilding our site with every file-save so that it hot-reloads
for us.

The `build` command is what gets run on Netlify as part of our deployment.

Stop the eleventy server, then we'll change the `start` command to:

```js
"start": "npx @11ty/eleventy --serve & tailwindcss -i ./assets/base.css -o ./assets/out.css --watch"
```

When we restart the Eleventy server (with `yarn start`), we should see
Tailwind's output as well.

Once it's running, try adding a line like this near your canary lines:

```html
<h4 class="text-3xl text-violet-700 font-bold">Hi this is new text</h4>
```

What you should see, once you save, is something like this:

> <h4 class="text-3xl text-violet-700 font-bold">Hi this is new text</h4>

You should see the change immediately.

Test it out with some more changes, if you like!

[Here's the git
commit](https://github.com/andrewek/implicit-moon/commit/567fb84b23f3191d4d916368f708096b9c34b030),
in case you want to troubleshoot or compare your own work.

If we check out our site on production, what we'll still (unfortunately) see is
no styling, and a big old 404 error in our dev console for `style.css`. Let's
fix that.

## Tailwind in Production Too

We have Tailwind installed, so now we need it to actually run each time we build
the site and produce the relevant CSS.

In `package.json`, we've got our `build` script, which gets run by Netlify (or
whatever we're using to deploy):

```js
  "build": "npx @11ty/eleventy",
```

Now we need it to:

1. Build our CSS file as desired
1. Minify that CSS!
1. Put the file in the right place

Fortunately, we can do that pretty easily:

```js
"build": "npx @11ty/eleventy & tailwindcss -i ./assets/base.css -o ./assets/out.css --minify
```

Commit it all, then push. This should work, right?

(Spoiler: it won't)

On Netlify, you'll see an error that looks like this under the deploys tab:

<pre>
12:02:48 AM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:02:48 AM: Deploy site
12:02:48 AM: ────────────────────────────────────────────────────────────────
12:02:48 AM: ​
12:02:48 AM: Section completed: deploying
12:02:48 AM: ​
12:02:48 AM: Configuration error
12:02:48 AM: ────────────────────────────────────────────────────────────────
12:02:48 AM: ​
12:02:48 AM:   Error message
12:02:48 AM:   Deploy did not succeed: Deploy directory '_site' does not exist
12:02:48 AM: ​
12:02:48 AM:   Resolved config
12:02:48 AM:   build:
12:02:48 AM:     command: npm run build
12:02:48 AM:     commandOrigin: config
12:02:48 AM:     publish: /opt/build/repo/_site
12:02:48 AM:     publishOrigin: config
</pre>

What's happening is the Tailwind build completes and exits before the Eleventy
compilation is done. Netlify's deploy sees the exit code (from the Tailwind
build) and assumes the actual build is done; but it isn't. `_site` doesn't exist
yet because the Eleventy build hasn't yet happened. The site cannot be deployed.
We are all sad.

Let's fix this.

In our `package.json` file, we use `&` to chain together the Eleventy and
Tailwind commands. `&` in a bash script runs everything to the right in the
background, meaning it can exit early.

What we probably want instead is `&&`, which forces sequential running:

```js
"build": "npx @11ty/eleventy && tailwindcss -i ./assets/base.css -o ./assets/out.css --minify
```

Subtle, but useful to know. We'll still keep the regular `&` in our `start`
script because we want the Tailwind CLI and Eleventy's watcher to run
concurrently, instead of sequentially.

## Next Steps

Up next, we'll actually apply some styles to our templates. That one's going to
be a doozy.

{% endraw %}
