---
title: "Eleventy: Base Site Layout"
description: "Headers and bodies and footers, oh my!"
date: 2025-01-02
tags:
  - Eleventy
---

{% raw %}

In our [last step](/posts/2024-12-12-installing-tailwind/), we got Tailwind
installed and were left with a wildly, _wildly_ unstyled site. All the CSS
resets (from [Tailwind's "preflight"](https://tailwindcss.com/docs/preflight))
kicked in. Everything is awful... but it will get better.

In this post, we're going to:

1. Establish a base layout that actually looks sort of decent
1. Define an upper nav bar
1. Define a footer that stays at the bottom of the page even if the page is very
   short
1. (Optional) make our site work in both light and dark mode.

We won't (yet) style our main body content; that will come very soon.

The layout and components here were lifted and modified (mostly simplified) from
[Tailwind UI](https://tailwindui.com/components#product-marketing), which I've
found to be completely and totally worth the money. You can use the layout as it
exists here or you can do something totally different with it.

If you're not yet comfortable with [Tailwind
CSS](https://tailwindcss.com/docs/installation) (this is the free CSS library),
absolutely cross-reference it as needed. I won't link for every utility class
(there are a lot of them), but I will link to ones that are gnarlier or just
more interesting.

## Some Setup

If you haven't already, give yourself:

- A post or page with very, very short content (should fit easily on the page
  with a lot of white-space below it)
- A post or page with very, very long content (should require quite a bit of
  scrolling to get to the end)
- A post or page with a very long title (at least 80 characters)
- A post or page with a very short title (3-5 characters)
- A post or page with a very long description, a very short description, or no
  description at all (in the YAML front-matter)

Use a [lorem ipsum generator](https://loremipsum.io/) if you want.

## A Brief Aside on Developing for Responsiveness and Defensive CSS

Regardless of whether the work we are doing is appealing to very many people, we
do have, I believe, a duty to make that work _accessible_ and _functional_ for
the people who do want to engage with it.

I'm not going to feel even a tiny bit sad if someone says "Andrew, I am glad you
have this website, but none of the things you write about are interesting to me
so I will not visit it."

I will feel _very responsible_ (and sad in a way that should spur action) if
someone says to me "I really want to read the things you're writing or use the
software you are building, but I cannot because it just doesn't work for me."

Part of this responsive design. Part of it is accessibility. Part of it is just
paying attention to where and how things break, and to how people interact with
the world.

Responsive design can and should go beyond "the site's layout adjusts as the
screen becomes wider or narrower" -- this was the original definition, and it's
good, but not sufficient.

Our designs should also adjust appropriately to account for:

- If the user's device or browser is set for light or dark mode
- If the user is on a phone, a laptop, or a very large screen
- If the user is using a screen reader
- If the user has cranked up the text size
- If the user wants to crank up the contrast to make text more visible
- If the user overrides the provided or system font
- If the user is on a very low-bandwidth connection
- If the user cannot make use of audio cues in our software

We should also account for content challenges like:

- Text or content that is too long (or short) for its container
- Images whose aspect ratios don't line up with their containers (Do they crop?
  Get smushed? Something else?)
- Situations like a flex-box list with too many items to fit on one line (Do we
  scroll? Do we wrap? Something else?)

This is not a complete list by any stretch. We can't always get all of these as
well as we might like. The key is to try to do a little better each time.

Resources like [Defensive CSS](https://defensivecss.dev/), and
[WUHCAG](https://www.wuhcag.com/) (which helps developers make sense of WCAG)
can be really useful here.

In general, my preference is to stress-test my designs by giving throwing a
variety of content at them, and also to exercise those designs fairly thoroughly
at a variety of screen sizes and configurations (in light mode, in dark mode, in
high-contrast mode, with the text sized way up, etc.).

I don't have a great sense of how to automate this. Mostly I just try to pay
attention to where things might break, and for whom, and under what
circumstances.

What you'll likely want to do as you work through this layout is have those test
posts open (one per tab), along with whatever you need to change your browser or
system from light to dark mode, and then just poke at it until we know what
breaks.

## Revisiting Our Base Layout

Recall that we want three main components here:

1. A top nav that's always at the top of the page
1. A footer that's always at the bottom of the content (and never higher than
   the bottom of the screen)
1. A section for our content.

Get that Eleventy server running locally, and open up
`_includes/layouts/base.njk`. All of our work today in this
file.

Right now our body looks like this:

```njk
  <body>
    <main>
      <h1>{{title or metadata.title}}</h1>

      {{ content | safe }}
    </main>

    <footer>
      <p>All content copyright 2024 {{metadata.author.name}}</p>
    </footer>
  </body>
```

([See it on
GitHub](https://github.com/andrewek/implicit-moon/blob/a48b4fd51f58bc37c3a842397096b2f3f3caca69/_includes/layouts/base.njk#L11-L20))

We'll start by making sure our body expands to fill the entire screen:

```diff-html
- <body>
+ <body class="min-w-screen bg-green-500">
```

Next, we'll wrap the `main` and `footer` elements in a div so that we can make
use of flex-box to force that footer down to the bottom of the page. We set the
minimum height to be the screen height, and then use `h-full` to set the height
to be the full content.

Note that the footer doesn't yet actually go down to the bottom of the page.

```diff-njk
<body class="min-w-screen bg-green-500">
+ <div class="flex flex-col px-4 w-full min-h-screen h-full">

    <main>
      <h1>{{title or metadata.title}}</h1>

      {{ content | safe }}
    </main>

    <footer>
      <p>All content copyright 2024 {{metadata.author.name}}</p>
    </footer>
+ </div>
</body>
```

What you should see right now is the entire screen is green (text is still
black), for both very short and very long pages. There will likely be a
horizontal scroll bar for your main content, but even if you scroll you should
still see that green background.

We'll cram the footer down at the bottom of the screen here in a bit.

Once you feel satisfied that the containing div (and body) encompass the entire
screen -- perhaps you checked all of your canary posts -- go ahead and change
all instance of `bg-green-500` to `bg-slate-50`.

## Building the Top Nav

Let's give ourselves a nice little top nav. It'll have:

- The site title
- A link to "Posts" and "Home"
- Responsive-enough design
- "Stickiness" to the top of the screen
- A neat little "blur" effect when you scroll

Immediately above our `<main>` and immediately below the top-level div in the
body, place the following:

```njk
  <header class="sticky top-0 bg-slate-50/70 backdrop-blur-sm">
    <nav class="mx-auto flex max-w-3xl sm:max-w-5xl items-center p-6
                lg:px-8" aria-label="global">
      <div class="flex flex-1 text-md font-semibold text-gray-900">
        <a href="/" class="-m-1.5 p-1.5">
          {{metadata.title}}
        </a>
      </div>
      <div class="flex gap-x-4 sm:gap-x-12">
        <a class="text-sm/6 text-gray-900 hover:underline"
           href="/">Home</a>
        <a class="text-sm/6 text-gray-900 hover:underline"
           href="/posts">Posts</a>
      </div>
    </nav>
  </header>
```

Play with it a bit at different screen widths. Remove the "Home" link if
you want.

One interesting aspect here is the use of
["backdrop-blur"](https://tailwindcss.com/docs/backdrop-blur#blurring-behind-an-element),
coupled with the `bg-green-500/70` color utility.

`bg-slate-50` is a color, as we've seen. Adding `/70` to the end of that
utility sets the opacity to 70%. [Learn more
here](https://tailwindcss.com/docs/background-color#changing-the-opacity).

The effect is that when we scroll, the navbar should stay at the top of the
screen *and* we can lightly see whatever was beneath it. We also get an implied
border at the transition-point between blurry and not-blurry.

You might also notice the `text-sm/6` (on the links). `text-sm` is a font size
utility. The `/6` modifier [sets the line
height](https://tailwindcss.com/docs/font-size#setting-the-line-height).

The final interesting piece might be `hover:underline`. Any time you see
`some-modifier:some-utility`, the bit before the colon is just a [utility that
wraps up a special
selector](https://tailwindcss.com/docs/hover-focus-and-other-states), e.g. a
psuedo-selector, or a media query, or something of the like. The same thing
happens with `lg:px-8` (`px-8` when the screen size is bigger than the `lg`
breakpoint) or `sm:max-w-5xl` (`max-w-5xl` when the screen is wider than the
`sm` breakpoint). You'll see these quite a bit in Tailwind. They're one of my
favorite parts of the library, to be honest, and can be composed in interesting
ways.

With that, we should have our navbar.

In a future post, we'll replace the hard-coded links with the [Eleventy
Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/). For right now
we have very few links to worry about, so we will just hard-code them.

## Building the Footer

We already have a footer. But we can make it a better footer. Replace what's
there with this:

```njk
  <footer class="w-full max-w-5xl mx-auto justify-self-end text-gray-600">
    <div class="px-6 py-8 text-sm/6">
      <p>All content &copy; 2025 {{metadata.author.name}}. All rights
      reserved.</p>
    </div>
  </footer>
```

The main thing of note here is `justify-self-end`. This is a flex-box utility
that just says "Put me at the very end of the list".

Unfortunately, this isn't *quite* sufficient to put the footer at the bottom of
the page (or screen) when the page's content is otherwise very short.

## Keeping the Footer at the Bottom

The last step for this edition of our base layout is to make our main content
"grow", that is, expand to fill all available space. We'll use [Tailwind's
`grow` utility](https://tailwindcss.com/docs/flex-grow).

Replace what we have right now for `main` with this:

```njk
<main class="grow p-6">
  {{content | safe}}
</main>
```

Now what we should see with very short content is the footer at the bottom of
the screen (and some blank space between our main content and the footer). For
much longer content, the footer will just be at the bottom of the page.

Note that our content still looks terrible. We'll fix it in a near-future step.

## Light and Dark Modes

Tailwind gives support for [browser light and dark mode
modifiers](https://tailwindcss.com/docs/dark-mode); we can do somethign like
`bg-slate-50 dark:bg-slate-900` to let the browser (and OS) determine whether
the site should be in dark or light mode. Light mode is the default. Dark mode
is optional. The documentation linked above also gives advice on how to build a
manual selector.

Everywhere you have `bg-slate-50`, add `dark:bg-slate-900` (ditto for
`bg-slate-50/70` and `dark:bg-slate-900/70`). Everywhere you have
`text-gray-900`, add `dark:text-white`.

Here's what your final body should look like:

```njk
  <body class="min-w-screen bg-slate-50 dark:bg-slate-900">
    <div class="flex flex-col px-4 w-full min-h-screen h-full">

      <header class="sticky top-0 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <nav class="mx-auto flex max-w-3xl sm:max-w-5xl items-center p-6
                    lg:px-8" aria-label="global">
          <div class="flex flex-1 text-md font-semibold text-gray-900 dark:text-white">
            <a href="/" class="-m-1.5 p-1.5">
              {{metadata.title}}
            </a>
          </div>
          <div class="flex gap-x-4 sm:gap-x-12">
            <a class="text-sm/6 text-gray-900 dark:text-white hover:underline"
               href="/">Home</a>
            <a class="text-sm/6 text-gray-900 dark:text-white hover:underline"
               href="/posts">Posts</a>
          </div>
        </nav>
      </header>

      <main class="grow p-6">
        {{content | safe}}
      </main>

      <footer class="w-full max-w-5xl mx-auto justify-self-end text-gray-600
                     dark:text-gray-400">
        <div class="px-6 py-8 text-sm/6">
          <p>All content &copy; 2025 {{metadata.author.name}}. All rights
          reserved.</p>
        </div>
      </footer>
    </div>
  </body>
```

If you swap your OS from light to dark mode (and back again) you should see the
site change smoothly. Note that we haven't yet done anything useful with the
text in our `main` block. In dark mode, it'll be basically illegible. We'll fix
that!

Absolutely play with colors, as well as light/dark mode, to your heart's
content.

## What's Next?

Up next we'll get more of this content styled. Then we'll move on to doing other
work.

{% endraw %}
