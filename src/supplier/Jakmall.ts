import { ElementHandle, Page } from "puppeteer";

interface IScrapeResult {
  stock: number;
  price: number;
}

export default class Jakmall {
  static scrape = async (page: Page, url: string): Promise<IScrapeResult> => {
    await page.goto(url, { waitUntil: "networkidle2" });

    let element: ElementHandle<Element> | null;
    let text: string | null;

    // Varian Tidak Ditemukan
    if (page.url() != url) return { stock: -1, price: -1 };

    // Produk Kosong
    element = await page.$(".dp__stock--empty");
    if (element) {
      return { stock: 0, price: 0 };
    }

    // Produk Tersedia
    element = await page.$(".format__money");
    if (element) {
      text = await element.evaluate((e) => e.textContent);
      if (text) {
        let price = parseInt(text.replace(/[^0-9]+/g, ""));
        return { stock: 1, price: price };
      }
    }
    
    return { stock: -1, price: -1 };
  };
}
