import { ElementHandle, Page } from "puppeteer";

interface IScrapeResult {
  stock: number;
  price: number;
}

export default class Shopee {
  private static PRICE_ELEMENT = "div._3e_UQT";

  static scrape = async (
    page: Page,
    url: string,
    variant: string | undefined = undefined
  ): Promise<IScrapeResult> => {
    if (!variant) {
      await page.goto(url, { waitUntil: "networkidle2" });
      return Shopee.scrapeSingle(page);
    } else {
      if (page.url() !== url)
        await page.goto(url, { waitUntil: "networkidle2" });
      return Shopee.scrapeVariant(page, variant);
    }
  };

  private static scrapeSingle = async (page: Page): Promise<IScrapeResult> => {
    let element: ElementHandle<Element> | null;
    let text: string | null;

    // Produk Kosong
    element = await page.$("button.btn-solid-primary[aria-disabled=true]");
    if (element) return { stock: 0, price: 0 };

    // Produk Tersedia
    element = await page.$(Shopee.PRICE_ELEMENT);
    if (element) {
      text = await element.evaluate((e) => e.textContent);
      if (text) {
        text = text.replace(/[^0-9]+/g, "");
        return { stock: 0, price: parseInt(text) };
      }
    }
    return { stock: -1, price: -1 };
  };

  private static scrapeVariant = async (
    page: Page,
    variant: string
  ): Promise<IScrapeResult> => {
    let element: ElementHandle<Element> | null;
    let elements: ElementHandle<Element>[] = [];
    let text: string | null;

    elements = await page.$$("button.product-variation");
    for (const variation of elements) {
      text = (await variation.evaluate((e) => e.textContent)) + "";
      if (text.trim() === variant) {
        element = variation;
        text = await element.evaluate((e) => e.className);
        // Varian Kosong
        if (text.includes("product-variation--disabled"))
          return { stock: 0, price: 0 };

        // Varian Tersedia
        if (!text.includes("product-variation--selected"))
          await element.click();
        element = await page.$(Shopee.PRICE_ELEMENT);
        if (element) {
          text = await element.evaluate((e) => e.textContent);
          if (text) {
            text = text.replace(/[^0-9]+/g, "");
            return { stock: 1, price: parseInt(text) };
          }
        }
        break;
      }
    }
    return { stock: -1, price: -1 };
  };
}
