import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withProxy } from './utils/with_proxy.js';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default withProxy(async (req: VercelRequest, res: VercelResponse) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'url query param is required' });
    }

    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 2000)) // extra wait for JS rendering

        const title = await page.title();
        const finalUrl = page.url();

        if (
            title.includes('Just a moment') ||
            title.includes('Attention Required') ||
            title.includes('Access denied') ||
            finalUrl.includes('challenge') ||
            finalUrl.includes('captcha')
        ) {
            return res.status(403).json({ error: 'Page is protected by Cloudflare or similar service' });
        }

        const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
        await browser.close();

        res.setHeader('Content-Type', 'image/png');
        return res.status(200).json({ image: `data:image/png;base64,${screenshot}` });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: message });
    } finally {
        if (browser) await browser.close();
    }
})