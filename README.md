# VisualRegressionTool
A Quick and Dirty tool to implement visual regression testing on your project

## How to install

Clone it in your favorite folder.

Start with `npm install`

## Create your config file

Duplicate the `config-example.json` file to a `config.json` file. Then customize it.

## How to launch tests

`npm test` will create the initial *screenshots-current* folder. Please rename it to *screenshot-baseline* to get your baseline screenshots.

Every time you will launch `npm test`, you will find your diffs in screenshots-diff.

## Roadmap

* [ ] Task to create baseline folder without testing.
* [ ] Cache HTML to avoid redownloading it at every test.
* [ ] Unf__k the mess with browser & page at every test.
* [ ] Generate HTML results with a compare image.

## Thanks

Based on this great tutorial by @notwaldorf : https://meowni.ca/posts/2017-puppeteer-tests/
