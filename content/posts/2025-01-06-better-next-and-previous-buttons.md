---
title: "Eleventy: Better Next and Previous Buttons"
description: "We're styling everything else, so why not this?"
date: 2025-01-06
layout: "layouts/post.njk"
tags:
  - posts
  - Eleventy
---

Right now our next and previous buttons [as of this
commit](https://github.com/andrewek/implicit-moon/commit/7a4f8ada024e788102ef60bc9974f39e271e82bf),
look like this:

{% raw %}

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

And when they render, they look like this:

- Previous: [My Cool Post](#)
- Next: [My Other Cool Post](#)

{% endraw %}

Thrilling, to be sure! It's not a terrible unordered list by any stretch. I've
seen and made many unordered lists that are far worse.

But we would like a little more style, I think.

What I think we want is something closer to this:

<div class="not-prose">
  <div class="flex items-center justify-between">
    <div class="flex w-0 flex-1">
      <a href="#" class="inline-flex items-center pr-1 pt-4 text-sm
                         text-gray-500 dark:text-gray-50 hover:underline">
        <svg class="mr-3 size-5 text-gray-500" viewBox="0 0 20 20"
             fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clip-rule="evenodd" />
        </svg>
        <span class="sr-only">Previous Post: </span>
        <span class="max-w-72 w-full">My Cool Post</span>
      </a>
    </div>

    <div class="flex w-0 flex-1 justify-end">
      <a href="#" class="inline-flex items-center pr-1 pt-4 text-sm
                         text-gray-500 dark:text-gray-50 hover:underline">
        <span class="sr-only">Next Post: </span>
        <span class="max-w-72 w-full">
          My Other Cool Post with an Incredibly Long Title and More Title After
          That and Even More Title After That
        </span>
        <svg class="ml-3 size-5 text-gray-500" viewBox="0 0 20 20"
             fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  </div>
</div>


Cool, right? Some possibly interesting things to notice:

1. It handles both relatively short and very long titles with roughly equal
   ease. The arrows, in particular, stay horizontally aligned.
1. It works on mobile-sized screens as well as desktop-sized screens.
1. There's a neat little hover effect that works well enough.
1. If you check it out in a screen reader, we add a little "Previous Post" and
   "Next Post" helper text that _only_ shows up for screen-readers, thanks to
   the `sr-only` class.

The most important part is that it can handle both very short and very long
titles without breaking. Just like with our [typography adventures with the
`prose` plugin](/posts/2025-01-04-prose-layout-with-tailwind/), we are in a
situation where we can't necessarily control all of the titles that come in (we
_can_, but I don't want to have to hand-check each one to see if it breaks the
layout).

Rather than constrain our titles because of our layout, we make our layout able
to handle whatever we throw at it.

Let's also check to see what it looks like if we have just a "previous" page (no
"next" ... perhaps we're at the most recent post?):

<div class="not-prose">
  <div class="flex items-center justify-between">
    <div class="flex w-0 flex-1">
      <a href="#" class="inline-flex items-center pr-1 pt-4 text-sm
                         text-gray-500 dark:text-gray-50 hover:underline">
        <svg class="mr-3 size-5 text-gray-500" viewBox="0 0 20 20"
             fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clip-rule="evenodd" />
        </svg>
        <span class="sr-only">Previous Post:</span> <span class="max-w-72 w-full">My Cool Post</span>
      </a>
    </div>
  </div>
</div>

That works!

<hr/>

Now how about no "previous" link but definitely a "next":

<div class="not-prose">
  <div class="flex items-center justify-between">

    <div class="flex w-0 flex-1 justify-end">
      <a href="#" class="inline-flex items-center pr-1 pt-4 text-sm
                         text-gray-500 dark:text-gray-50 hover:underline">
        <span class="sr-only>Next Post: </span>
        <span class="max-w-72 w-full">
          My Other Cool Post with an Incredibly Long Title and More Title After
          That and Even More Title After That
        </span>
        <svg class="ml-3 size-5 text-gray-500" viewBox="0 0 20 20"
             fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  </div>
</div>

That works too!

<hr/>

Now all that's left is to change our Post template
(`_includes/layouts/post.njk`) to meet handle our new layout.

What it looks like now is this:

{% raw %}
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
{% endraw %}

Here's what we'll replace that section with:

{% raw %}

```njk
{% set previousPost = collections.posts | getPreviousCollectionItem(page) %}
{% set nextPost = collections.posts | getNextCollectionItem(page) %}

<div class="flex items-center justify-between">
  {% if previousPost %}
    <div class="flex w-0 flex-1">
      <a href="{{previousPost.url}}"
         class="inline-flex items-center pr-1 pt-4 text-sm text-gray-500
                dark:text-gray-50 hover:underline">
        <svg class="mr-3 size-5 text-gray-500" viewBox="0 0 20 20"
          fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1
          1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1
          0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18
          10Z" clip-rule="evenodd" />
        </svg>
        <span class="sr-only">Previous Post: </span>
        <span class="max-w-72 w-full">{{previousPost.data.title}}</span>
      </a>
    </div>
  {% endif %}

  {% if nextPost %}
    <div class="flex w-0 flex-1 justify-end">
      <a href="{{nextPost.url}}"
         class="inline-flex items-center pr-1 pt-4 text-sm text-gray-500
                dark:text-gray-50 hover:underline">
        <span class="sr-only">Next Post: </span>
        <span class="max-w-72 w-full">
          {{nextPost.data.title}}
        </span>
        <svg class="ml-3 size-5 text-gray-500" viewBox="0 0 20 20"
             fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1
          .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0
          1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
          clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  {% endif %}
</div>
```

{% endraw %}

Just like before, we're setting a `previousPost` and `nextPost` variable (pulled
from our collections). We've just replaced the `ul` element with something more
thrilling.

## Wrapping Up

This particular post is just a stylistic enhancement. The fun thing about this
all is that we can just make stylistic enhancements for the joy of it and
really, really embrace hedonism in that regard.

Perhaps in a future post we'll get to something more substantial than hedonism
as expressed by minor stylistic enhancements to the footers of our posts.
