/* ----------------------------------------------------------
  Your config goes here
---------------------------------------------------------- */

const _page_url = 'http://soon.test/';
const _pages = {
    'index': '/',
    '404': '/404',
    'contact': '/contact',
};
const _breakpoints = {
    'wide': {
        width: 1280,
        height: 768
    },
    'tablet': {
        width: 768,
        height: 1024
    },
    'mobile': {
        width: 375,
        height: 667
    }
}

/* ----------------------------------------------------------
  Here be dragons
---------------------------------------------------------- */

const puppeteer = require('puppeteer');
const fs = require('fs');
const expect = require('chai').expect;
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const testDir = `${process.cwd()}/test/screenshots-current`;
const diffDir = `${process.cwd()}/test/screenshots-diff`;
const baselineDir = `${process.cwd()}/test/screenshots-baseline`;

describe('Screenshots are correct', function() {
    let browser, page;

    before(async function() {

        /* Create test dir */
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
        if (!fs.existsSync(diffDir)) fs.mkdirSync(diffDir);
        if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir);

        /* Create a dir for every resolution */
        for (_i in _breakpoints) {
            if (!fs.existsSync(`${testDir}/${_i}`)) fs.mkdirSync(`${testDir}/${_i}`);
            if (!fs.existsSync(`${diffDir}/${_i}`)) fs.mkdirSync(`${diffDir}/${_i}`);
            if (!fs.existsSync(`${baselineDir}/${_i}`)) fs.mkdirSync(`${baselineDir}/${_i}`);
        }
    });

    /* Test every breakpoint available */
    for (_i in _breakpoints) {
        describeTestingResolution(_i, _breakpoints[_i]);
    }

});

function describeTestingResolution(id, viewPort) {
    let browser, page;

    /* Run a test for every page needed */
    describe('Test ' + id + ' screen', function() {
        for (var i in _pages) {
            itTestScreenshot(page, i, _pages[i], id, viewPort);
        }
    });
}

function itTestScreenshot(page, pageId, route, filePrefix, viewPort) {

    it('test ' + filePrefix + ' ' + pageId, async function() {

        let fileName = filePrefix + '/' + pageId;

        // Start the browser, go to that page, and take a screenshot.
        browser = await puppeteer.launch();
        page = await browser.newPage();

        page.setViewport(viewPort);

        await page.goto(`${_page_url}/${route}`);

        await page.screenshot({
            fullPage: true,
            path: `${testDir}/${fileName}.png`
        });

        browser.close();

        // Test to see if it's right.
        return compareScreenshots(fileName);
    });
}

function compareScreenshots(fileName) {
    return new Promise((resolve, reject) => {
        const img1 = fs.createReadStream(`${testDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
        const img2 = fs.createReadStream(`${baselineDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

        let filesRead = 0;

        function doneReading() {
            // Wait until both files are read.
            if (++filesRead < 2) return;

            // The files should be the same size.
            expect(img1.width, 'image widths are the same').equal(img2.width);
            expect(img1.height, 'image heights are the same').equal(img2.height);

            // Do the visual diff.
            const diff = new PNG({
                width: img1.width,
                height: img2.height
            });
            const numDiffPixels = pixelmatch(
                img1.data, img2.data, diff.data, img1.width, img1.height, {
                    threshold: 0.1
                });

            /* Save diff */
            fs.writeFileSync(`${diffDir}/${fileName}.png`, PNG.sync.write(diff));

            // The files should look the same.
            expect(numDiffPixels, 'number of different pixels').equal(0);
            resolve();
        }
    });
}
