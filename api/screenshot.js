import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing ?url= parameter" });
    }

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const screenshot = await page.screenshot({ fullPage: true });
        await browser.close();

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        res.end(screenshot, "binary");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to take screenshot" });
    }
}