---
title: "Eleventy: Site Header Section"
description: "I need a hero"
date: 2025-01-03
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

{% raw %}

In our [previous post](/posts/2025-01-02-base-layout-with-tailwind/) we
established a base layout. Let's go just a bit further and give ourselves a
better title section (like what you see on this page!).

I like a fun hero section. I am a simple human with relatively simple tastes.

Along the way we'll see a neat Tailwind trick.

## Setup

Just like in the last post, you'll want:

- A page with a very short title
- A page with a very long title
- A page with a medium-length title
- A page with a very short description
- A page with a very long description
- A page with no description at all

(Recall that we're setting these in the YAML front-matter of each page and post,
[like we demonstrate
here](/posts/2024-12-07-our-first-post/). Recall also that
we set up some metadata in `_data/metadata.js` in [this
article](/posts/2024-12-06-initial-eleventy-site/))

## Setting the Vision

We want something that looks like this:

<div class="not-prose">
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl/tight font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        My Very Cool Title Has a Neat Gradient Effect
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        ... And I am here for it!
      </p>
    </div>
  </div>
</div>

Fun, right? Right!

Let's start building. In `_includes/layouts/base.njk`, above the `main` and
below the `header`, put this:

```njk
<div class="px-6 py-12">
  <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900
               dark:text-white">
      {{title or metadata.title}}
    </h1>
    <p class="mt-8 text-pretty text-md font-medium text-gray-700
              dark:text-gray-200 sm:text-xl/8">
      {{description or metadata.description}}
    </p>
  </div>
</div>
```

You should see a reasonably readable chunk of text. It doesn't have the gradient
yet, but it should be readable enough.

Perhaps this is an example:

<div class="not-prose">
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900
                 dark:text-white">
        My Very Cool Hero Section Has a Gradient!
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        Except it doesn't. Not quite yet. We're getting there.
      </p>
    </div>
  </div>
</div>

## Adding the Gradient

Here is how we will make the gradient effect:

1. We'll use
   [`bg-clip-text`](https://tailwindcss.com/docs/background-clip#cropping-to-text)
   to crop the background to fit just around the text
1. We'll set `text-transparent` to make the text color, well, transparent.
1. We'll apply a gradient with `bg-gradient-to-r from-blue-600 to-purple-500`
   (or whatever colors or gradient direction your heart desires). [More on
   gradients here](https://tailwindcss.com/docs/gradient-color-stops).

Now our hero should look like this:

```njk
<div class="px-6 py-12">
  <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
    <h1 class="text-wrap text-4xl sm:text-6xl font-bold tracking-tight
      bg-clip-text text-transparent bg-gradient-to-r from-blue-600
      dark:from-blue-500 to-purple-600 dark:to-purple-500">
      {{title or metadata.title}}
    </h1>
    <p class="mt-8 text-pretty text-md font-medium text-gray-700
              dark:text-gray-200 sm:text-xl/8">
      {{description or metadata.description}}
    </p>
  </div>
</div>
```

Or, in action, like this:

<div class="not-prose">
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        My Very Cool Title Page Has a Fun Gradient!
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        Look at all the colors! They are colors!
      </p>
    </div>
  </div>
</div>

You can also use the `dark` modifier, e.g. `from-blue-600 dark:from-blue-500` to
set mode-specific variants of your gradients.

## We've Got a Sneaky Problem Yet!

Create a post with a title like "I think I am really going to eat more
yogurt?" (it needs a "y" and/or "g" on the last line, and preferably also on the
line above).

<div class="not-prose">
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        I am really going to eat significantly more jolly yogurt and go jogging
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        Something is screwy here. Look at those Y's and G's and J's!
      </p>
    </div>
  </div>
</div>

See how the bottom of the 'y', 'j', and 'g' gets cut off on the last line
(assuming you view on a larger screen than a phone)?

This is where defensively testing our content (which we mentioned in the
previous post) comes in handy.

The problem is the line height. The various text-size utilities carry with them
their own built-in line heights. For example, `text-6xl` has a `line-height: 1`
with it. If we bump that line height to 1.15 (in the browser's dev tools), it
looks fine. But if we try to apply a [line height
utility](https://tailwindcss.com/docs/line-height), e.g. `sm:text-6xl
sm:leading-tight` (which should apply a line height of `1.25`), the applied line
height gets overridden by what we get from `text-6xl`.

The solution is to use the text-size utility's [line-height
modifier](https://tailwindcss.com/docs/font-size#setting-the-line-height)
so that we maintain the right CSS order specificity and don't end up with styles
getting clobbered.

Replace `sm:text-6xl` (on the H1) with `sm:text-6xl/tight` to go from `line-height: 1` to
`line-height: 1.25`.

(Note that you'll need Tailwind 3 for this to work. Earlier versions of Tailwind
have their own ways of doing this and we're not going to worry about that right
now.)

Now what we should have is this:

```njk
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl/tight font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        {{title or metadata.title}}
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        {{description or metadata.description}}
      </p>
    </div>
  </div>
```

<div class="not-prose">
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl/tight font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        I am really going to eat significantly more jolly yogurt and go jogging
      </h1>
      <p class="mt-8 text-pretty text-md font-medium text-gray-700
                dark:text-gray-200 sm:text-xl/8">
        The text is much less screwy. We'll see how the yogurt and jogging are.
      </p>
    </div>
  </div>
</div>

Much better!

If we wanted to set a custom line height (honestly, 1.15 works pretty nicely),
we could do so [with
theming](https://tailwindcss.com/docs/line-height#customizing-your-theme), then
reference that new themed height in our font-size utility just like we did `/tight`.

Another solution would be to apply the [text-transform
`uppercase`](https://tailwindcss.com/docs/text-transform) to it all. If it's
all-caps, it doesn't have any little tails to get cut off. Sometimes the best
way to solve a problem is to sidestep it entirely (and go make new problems
elsewhere).

## Back to Testing

In the event that you've got a page without a title, what you should see is a
fallback to your site title (set in the metadata). Ditto for if you have a page
without a description.

One option you have is to use an `if` condition, like we did with our [next and
previous buttons](/posts/2024-12-09-post-page-layout/) to only render the
description box (or title heading) when they're present. Something like this:

```njk
{% if title %}
  <div class="px-6 py-12">
    <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
      <h1 class="text-wrap text-4xl sm:text-6xl/tight font-bold tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-blue-600
        dark:from-blue-500 to-purple-600 dark:to-purple-500">
        {{title}}
      </h1>
      {% if descripton %}
        <p class="mt-8 text-pretty text-md font-medium text-gray-700
                  dark:text-gray-200 sm:text-xl/8">
          {{description}}
        </p>
      {% endif %}
    </div>
  </div>
{% endif %}
```

I've chosen not to do it this way in my own site, but it felt useful to point
out the possibility.

## End Product

What we end up with is this:

```njk
<div class="px-6 py-12">
  <div class="mx-auto max-w-lg sm:max-w-2xl text-center">
    <h1 class="text-wrap text-4xl sm:text-6xl/tight font-bold tracking-tight
      bg-clip-text text-transparent bg-gradient-to-r from-blue-600
      dark:from-blue-500 to-purple-600 dark:to-purple-500">
      {{title or metadata.title}}
    </h1>
    <p class="mt-8 text-pretty text-md font-medium text-gray-700
              dark:text-gray-200 sm:text-xl/8">
      {{description or metadata.description}}
    </p>
  </div>
</div>
```

[See it on
GitHub](https://github.com/andrewek/implicit-moon/blob/218a457cc368ba8e3efbc6ff5c16ae948bd7a91f/_includes/layouts/base.njk#L14-L26)

## Wrapping Up

In this post we did some learning about typography, applied some neat background
effects, and figured out how to fix an annoying line-height issue.

## Next Steps

Up next we're going to style our body content.

{% endraw %}
