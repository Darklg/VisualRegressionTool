# VisualRegressionTool
A Quick and Dirty tool to implement visual regression testing on your project

## How to install

Clone it in your favorite folder.

Start with `npm install`

Setup your URL

## How to launch tests

`npm test` will create the initial *screenshots-current* folder. Please rename it to *screenshot-baseline* to get your baseline screenshots.

Every time you will launch `npm test`, you will find your diffs in screenshots-diff.

## Roadmap

* [ ] Separate config file.
* [ ] Task to create baseline folder without testing.
* [ ] Cache HTML to avoid redownloading it at every test.
* [ ] Unf__k the mess with browser & page at every test.

## Thanks

Based on this great tutorial by @notwaldorf : https://meowni.ca/posts/2017-puppeteer-tests/
