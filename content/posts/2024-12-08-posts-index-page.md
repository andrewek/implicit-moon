---
title: "Eleventy: Posts Index Page"
description: "Make Our Posts Findable"
date: 2024-12-08
layout: "layouts/base.njk"
tags:
  - posts
  - Eleventy
---

In our [last step, we got our site up on
Netlify](/posts/2024-12-08-deploying-to-netlify), presumably, so the world can
see our site.

In this step, we're going to build a "posts" index page, accessible at `/posts`,
that lists all of our posts, with their tags, and the newest post at the top of
the list.

## The Page, Sans Posts

First, we just need a page that lists our posts. But in order to do that, we
just need a page.

Create `content/posts.njk` with the following content:

```njk
---
title: All Posts
description: All the Posts Worth Posting
layout: "layouts/base.njk"
---

<h2>Here is where our posts will be</h2>

<p>... once we figure that out</p>
```

Now we can head to `localhost:8080/posts` to check it out!

The page renders, though it has no posts on it. Let's fix that.

## A Note about Collections

Eleventy handles groups of related content through the [Collections
API](https://www.11ty.dev/docs/collections/). We have a default collection of
`all`, but also when we apply tags to posts, those posts get added into
tag-specific collections (like `posts` or `Eleventy`. The collections are just
data compiled during the build process, and are used to build pages.

We can also build collections dynamically from data (on our file system, from a
remote API, generated at will by some code, etc.) during the build process,
though we won't worry about that right now.

For now, what we need to know is that we can access all pages with a `posts` tag
applied through `collections.posts` in our JS and in our NJK templates.

The next steps require that you've got 1 or more posts with "tag: posts" in the
front-matter. If you haven't done that yet, please do so.

## Getting Our Posts onto the Page

Open up `content/posts.njk` again, and replace the filler body (everything below
the YAML front-matter) with this:

{% raw %}

```njk
<ul>
  {%- for post in collections.posts -%}
    <li>This is a post</li>
  {%- endfor -%}
</ul>
```


The `for-each` loop should look familiar to you if you've done some coding
before. The `{%- -%}` NJK tag pair indicates that this line doesn't render or return, but
does execute. We've already seen `{{ some value }}`, which indicates that the
result of the expression gets interpolated right into the page.

When we refresh the page, we should see:

{% endraw %}

```html
<ul>
  <li>This is a post</li>
  <li>This is a post</li>
  <li>This is a post</li>
  <li>This is a post</li>
</ul>
```

Or something like it, with one `<li>This is a post</li>` for each post in our
collection.

What we actually want, though, is the post title. Let's replace our hard-coded
value with the post title. Since we have our `post` object, we can view data
about that post as `post.data`, and the title as `post.data.title`

{% raw %}

```njk
<ul>
  {%- for post in collections.posts %}
    <li>{{post.data.title}</li>
  {%- endfor -%}
</ul>
```

{% endraw %}

This is pretty good. We can make it even better by adding the URL.

{% raw %}
```njk
<ul>
  {%- for post in collections.posts -%}
    <li>
      <a href="{{post.url}}">{{post.data.title}}</a>
    </li>
  {%- endfor -%}
</ul>
```
{% endraw %}

Now we have a list of posts, in chronological order (oldest first) by date, with
clickable links!

## What About Newest First?

Imagine we want to show the newest posts first, instead of the oldest. We can do
that!

{% raw %}
```njk
<ul>
  {%- for post in collections.posts | reverse -%}
    <li>
      <a href="{{post.url}}">{{post.data.title}}</a>
    </li>
  {%- endfor -%}
</ul>
```
{% endraw %}

The `|` operator basically the same as the Unix pipe operator; it passes the
thing on the left to the function on the right. So we pass `collection.posts` to
`reverse`, which just returns the reversed list. With this change, our posts now
appear in reverse chronological order.

Just make sure we [don't use
`.reverse()`](https://www.11ty.dev/docs/collections/#do-not-use-array-reverse(\))
or other JS methods that mutate the list in place. Using something like
Nunjuck's `reverse` filter (a pure function) is a much better choice.

## Wrapping Up

Once we save and commit, we'll have a page that lists all of our posts. Cool!

## What's Next?

We should probably introduce some styling at some point.

We should probably also do a better treatment of filters and collections, and
maybe think about tasks like "Show the most recent 3 posts on the home screen"
or "List all posts by tag".
