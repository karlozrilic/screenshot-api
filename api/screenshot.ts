import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withProxy } from './utils/with_proxy.js';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default withProxy(async (req: VercelRequest, res: VercelResponse) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'url query param is required' });
    }

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    return res.status(200).json({ image: `data:image/png;base64,${screenshot}` });
})