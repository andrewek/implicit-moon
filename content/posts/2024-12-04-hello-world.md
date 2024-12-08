---
title: Hello, World
description: Introductory test post
date: 2024-12-04
layout: "layouts/base.njk"
tags:
  - posts
---

Hello. This is a test post. It's also a place to put some test content so we can
see how it displays as we work on our styling and parsing and all of that.

## This is an H2

Ideally we'll have a table of contents generated from these.

### Here is an H3

It could have some stuff too?

#### Here is an H4.

We don't need more header levels than this. More than an H4 sure seems
excessive.

### What about another H3?

Why not?!

### And one more, just as a treat

It is a little treat.

#### Who else deserves a treat?

You do. You deserve a treat.

## Okay, but what about anchors?

Anchor links (On headers of various levels) would be _fantastic_.

## Formatted Prose

Here is a _line_ with some **formatted prose**. Consider some `inlineCode()`.
Consider [a hyperlink](https://implicitmoon.com). Consider some ~~strikethrough
text~~. Consider some _**bold and italic**_ text.

> Sometimes people say things. We appreciate the things they say sometimes.
>
> &mdash; A person.

We have more prose yet to go.

## What about lists?

Everyone loves a good list.

### Regular ordered and un-ordered lists

1. First item
2. Second item
  1. First sub-item
  2. Second sub-item
3. Third item

- Unordered item 1
- Unordered item 2
  - Sub-item 1
  - Sub-item 2
    - Sub-sub item 1
- Unordered item 3

### What about github-flavored markdown?

- [ ] To-do item 1
- [ ] To-do item 2
  - [ ] Oh no, a sub-task!
- [x] This one is done
- [ ] This one hasn't started yet

## Syntax Highlighting

What about a longer code sample? Here is some Ruby:

```ruby
puts "Hello, World"
```

Or maybe some JS?

```javascript
console.log("Heeeeyyyy")
```

Or perhaps some Elixir?

```elixir
"hi there"
|> String.capitalize()
|> IO.puts()
```

Or maybe some diffed code samples?

```diff-elixir
"hi there"
+ |> String.upcase()
- |> String.capitalize()
|> IO.puts()
```

## Diagrams

We might like a Mermaid diagram someday.

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

Or we could do something with GraphViz (very similar!).

It'd also be nice to be able to embed some MathJax right in there. Everyone
loves LaTeX and math notation, right?

## Tables?

It'd be cool to render tables.

### Here are some cats

| Name      | Color    | Age | How Silly? (1-10) |
|-----------|----------|-----|-------------------|
| Chief     | Orange   | 10  |  6                |
| Boomerang | Orange   |  3  | 10                |
| Tony      | Gray     | 12  |  5                |

### What about a chart?

It'd be cool if this rendered as an actual chart. Imagine if this is smacks per
month (from the above cats):

|           | Boomerang | Tony | Chief |
|-----------|-----------|------|-------|
| January   | 0         | 1    | 25    |
| February  | 0         | 2    | 27    |
| March     | 0         | 1    | 21    |
| April     | 0         | 1    | 24    |
| May       | 0         | 3    | 22    |
| June      | 0         | 1    | 31    |
| July      | 0         | 3    | 19    |
| August    | 0         | 1    | 25    |
| September | 0         | 1    | 26    |
| October   | 0         | 2    | 29    |
| November  | 0         | 1    | 22    |
| December  | 0         | 1    | 35    |

Something like [Chart.css](https://chartscss.org/) should help us here... IF WE
DARE.

## Media Embeds?

One of the cool features of Substack is that it offers a really nice embed
feature where you can just drop a Twitter, YouTube, etc. URL and it builds the
embed for you. That'd be cool to have here.

