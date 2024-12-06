# The Moon is Implicit

This is a static site. It publishes to
[https://implicitmoon.com](https://implictmoon.com) via Netlify.

It's all open-source. Please don't plagiarize the posts or content, but feel
free to use whatever of the source code you want however you want. It'll just be
entirely at your own risk, with no promise of support or anything like that.

## Running Locally

After you install, `yarn start` to run it, then off you go to `http://localhost:8080`. `CTRL+C` to stop the server. It should reload any time you make a change to the watched files.

## The Broad Lay of the Land

Main pages all live in `content/`, with blog posts specifically living in
`content/posts`.

The layouts all live in `_includes/layouts`.

Site metadata and other data elements (???) live in `_data`.

## Installation for Local Development

Pull the repo, then `asdf install` (or just install whatever's in the
`.tool-verisons` file however you want). After that, `yarn install`.
