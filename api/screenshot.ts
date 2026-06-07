import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withProxy } from './utils/with_proxy.js';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export default withProxy(async (req: VercelRequest, res: VercelResponse) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'url query param is required' });
    }

    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 2000)) // extra wait for JS rendering
    const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    return res.status(200).json({ image: `data:image/png;base64,${screenshot}` });
})