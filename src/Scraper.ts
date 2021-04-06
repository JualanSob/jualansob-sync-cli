import puppeteer, { Browser, Page } from "puppeteer";

import { IProduct, IProductReport } from "./Product";
import Jakmall from "./supplier/Jakmall";
import Shopee from "./supplier/Shopee";
import Tokopedia from "./supplier/Tokopedia";

export interface IScraperOption {
  chromiumPath: string
  showBrowser: boolean
};

export default class Scraper {
  static browser: Browser;
  static page: Page;

  static init = async (scraperOption: IScraperOption) => {

    // Init Browser
    let browser: Browser;
    if (scraperOption.showBrowser) {
      browser = await puppeteer.launch({
        executablePath: scraperOption.chromiumPath,
        headless: false,
        defaultViewport: null,
      });
    } else {
      browser = await puppeteer.launch({
        executablePath: scraperOption.chromiumPath
      });
    }

    // Setting Page
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
    );
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (resourceType === "image") request.abort();
      else request.continue();
    });
    Scraper.browser = browser;
    Scraper.page = page;
  };

  static close = async () => {
    await Scraper.browser.close();
  };

  static bulkScrape = async (
    products: IProduct[]
  ): Promise<IProductReport[]> => {
    const reports: IProductReport[] = [];
    for (const product of products) {
      console.log(`Checking ${product.title}...`);
      const report: IProductReport = {
        tokopedia_id: product.tokopedia_id,
        shopee_id: product.shopee_id,
        title: product.title,
        supplier_variant: product.supplier_variant,
        supplier_link: product.supplier_link,
        stock: product.stock,
        supplier_price: product.supplier_price,
        supplier_type: product.supplier_type,
        status: -999,
      };

      // Fetch Result
      let result = { stock: -999, price: -999 };
      if (product.supplier_type === "jakmall") {
        result = await Jakmall.scrape(Scraper.page, product.supplier_link);
      } else if (product.supplier_type === "shopee") {
        result = await Shopee.scrape(
          Scraper.page,
          product.supplier_link,
          product.supplier_variant
        );
      } else if (product.supplier_type === "tokopedia") {
        result = await Tokopedia.scrape(Scraper.page, product.supplier_link);
      }

      // Update Result
      if (result.stock === 1 && report.stock >= 1 && result.price === report.supplier_price) {
        report.status = 1;
      } else if (result.stock === 0 && report.stock === 0) {
        report.status = 1;
      } else if (result.stock === 1 && report.stock <= 0 && result.price === report.supplier_price) {
        report.stock = 1;
        report.status = 2;
      } else if (result.stock === 1 && result.price !== report.supplier_price) {
        report.supplier_price = result.price;
        report.status = 3;
      } else if (result.stock === 0 && report.stock !== 0) {
        report.stock = 0;
        report.status = 0;
      } else if (result.stock === -1) {
        report.supplier_price = -1;
        report.stock = -1;
        report.status = -1;
      }
      reports.push(report);
    }
    return reports;
  };
}
