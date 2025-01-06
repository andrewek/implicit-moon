---
title: "Eleventy: Syntax Highlighting Our Code Samples"
description: "Just a splash of color"
date: 2025-01-05
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

It'd be cool get some syntax highlighting on our code samples within our
Eleventy site.

For that, we'll use the [official Eleventy syntax highlighting
plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/).

This plugin uses [PrismJS](https://prismjs.com/) to parse our code blocks and
produce style-able output HTML with syntax highlighting included. [Here's the
full list of supported languages](https://prismjs.com/#supported-languages),
though there are plugins for even more than that.

One difference between the Eleventy plugin and Prism-as-described (in the Prism
docs) is that in our case, we're going to do our syntax highlighting at build
time, rather than in the browser at runtime.

## Order of Operations

1. Install the plugin
1. Add the stylesheets
1. Add some code samples
1. Play with extensions

## Code Blocks in Markdown

To add a code block in Markdown, we'll use triple back-ticks, like so:

{% highlight "markdown" %}
```elixir
"hey there"
|> String.capitalize()
|> IO.puts()
```
{% endhighlight %}

The triple backtick, followed by "elixir" says "this is a code block, and the
language is Elixir".

{% raw %}

We can also use the `{% highlight "elixir" %}` (or whatever language) filter,
like so:

```njk
{% highlight "elixir" %}
"hey there"
|> String.capitalize()
|> IO.puts()
{% endhighlight %}
```

{% endraw %}

Check out the [list of supported languages
here](https://prismjs.com/#supported-languages).

## Installing

To install the plugin, we'll first add the syntax highlighter as a dev
dependency:

```sh
yarn add -D @11ty/eleventy-plugin-syntaxhighlight
```

Then we'll add it to our Eleventy config (`eleventy.config.js`):

```javascript
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"

export default async function(eleventyConfig) {
  // Highlight our syntax please
  eleventyConfig.addPlugin(syntaxHighlight)

  // ... and all our other stuff
}
```

Next we'll restart our Eleventy server (`yarn start`).

If we have a syntax block like so:

```elixir
"hi there"
|> String.capitalize()
|> IO.puts()
```

Before our syntax highlighting plugin, Eleventy's build would render HTML like
this (you can inspect and see it in the browser)

```html
<code class="language-elixir">"hi there"
|&gt; String.capitalize()
|&gt; IO.puts()
</code>
```

(`&gt;` renders as `>`; we do this to avoid mucking with the browser)

After our syntax highlighter, we get HTML sort of like this (except each chunk
is all on the same line; I broke it out here for readability):

```html
<pre class="language-elixir">
  <code class="language-elixir">
    <span class="token string">"hi there"</span>

    <span class="token operator">|&gt;</span>
    <span class="token module class-name">String</span>
    <span class="token punctuation">.</span>
    <span class="token function">capitalize</span>
    <span class="token punctuation">(</span>
    <span class="token punctuation">)</span>

    <span class="token operator">|&gt;</span>
    <span class="token module class-name">IO</span>
    <span class="token punctuation">.</span>
    <span class="token function">puts</span>
    <span class="token punctuation">(</span>
    <span class="token punctuation">)</span>
  </code>
</pre>
```

Classes like `token operator` and `token punctuation` get used to apply the
correct CSS.

One thing you might notice is that we still don't have actual styling -- our
text is all just the same color.

To fix this, we need to include a theme.

## Making It Pop With Style

Let's rock the "Twilight" theme, perhaps. In `_includes/layouts/base.njk`, in
the `<head>`, add this line to grab the one served by a CDN.

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-twilight.min.css"
/>
```

Here's a [list of "official" Prism CSS
files](https://cdnjs.com/libraries/prism). You could also use one of [many other
themes](https://github.com/PrismJS/prism-themes). You'd just need to follow the
steps for adding [CSS files to an Eleventy
site](https://www.11ty.dev/docs/assets/).

Once we reload our page, we should see some cool syntax highlighting. Cooool.

## Highlighting Specific Lines

If we want to highlight specific lines, we can use the highlight notation:

{% highlight "markdown" %}
```elixir/0,2-3,5
"hi"
"hi"
"hi"
"hi"
"hi"
"hi"
```
{% endhighlight %}

In the above example, `elixir/0,2-3,5` says "This is Elixir / highlight lines 0,
2-3, and 5", which makes it look like this:

```elixir/0,2-3,5
"hi"
"hi"
"hi"
"hi"
"hi"
"hi"
```

I'm not pleased with how it looks on the screen, but I'm not going to worry (at
this time) about improving it. That'll be a fun topic for later.

## Further Exploration

One opportunity we have is to make use of the "diff" syntax provided by the
plugin
([docs](https://www.11ty.dev/docs/plugins/syntaxhighlight/#show-changes-using-diff-syntax)).
This lets us indicate lines added and removed.

Or if we felt so inclined, we might play with something like the ["copy to
clipboard" button plugin for
PrismJS](https://prismjs.com/plugins/copy-to-clipboard/).

I'm not a fan yet of how the diff syntax styles play with Tailwind's typography,
nor of how line highlighting plays. We'll keep working it, but that's just a
note I have at this time.

There are a whole bunch of [official PrismJS
plugins](https://prismjs.com/#plugins).

## Possible Visual Bug

One thing to note about the syntax highlighting - it applies `z-index: 1` to all
tokens within a code sample. If you have a sticky header (like we created on our
site!) or other element behind or in front of which other elements pass, you'll
want to make sure it behaves as desired with your syntax highlighting. I added
`z-50` to the `<header>` element on this site, as otherwise the
syntax-highlighted lines would sneak in front of the header instead of blurring
behind like they should.

[See the commit
here](https://github.com/andrewek/implicit-moon/commit/8939a49569d2555c8d208195ae14873d5f135933)

## Wrapping Up

As of the end of this post, we can include syntax-highlighted code blocks into
our pages and posts. That's pretty cool.

It's not perfect. It also doesn't need to be at this time.
