import chromium from '@sparticuz/chromium';
import puppeteer from "puppeteer-core";

const isLocal = !process.env.AWS_REGION && !process.env.VERCEL;
let executablePath;

if (isLocal) {
    const puppeteerLocal = await import('puppeteer');
    executablePath = puppeteerLocal.executablePath();
} else {
    executablePath = await chromium.executablePath();
}

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing ?url= parameter' });
    }

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const screenshot = await page.screenshot({ fullPage: true });

        await browser.close();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.end(screenshot, 'binary');
    } catch (error) {
        console.error('Error generating screenshot:', error);
        res.status(500).json({ error: error?.message || 'Failed to generate screenshot' });
    }
}