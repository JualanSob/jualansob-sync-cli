import { program } from "commander";
import path from "path";
import puppeteer from "puppeteer";
import Scraper, { IScraperOption } from "./Scraper";
import Product from "./Product";
import Progress from "progress";

program
  .option("-f, --file <fileDir>", "check from file")
  .version("0.0.1", "-v, --version")
  .option("--show-browser", "show browser window")
  .parse(process.argv);

const args = program.opts();

const chromiumDownload = async () => {
  /*
    Determine OS Platform & Chromium Revision Version
    https://storage.googleapis.com/chromium-browser-snapshots/index.html
  */
  const platform = process.platform;
  const arch = process.arch;
  let version: string;
  if (platform === "darwin") version = "869426";
  else if (platform === "linux") version = "869434";
  else if (platform === "win32" && arch === "ia32") version = "869404";
  else if (platform === "win32" && arch === "x64") version = "869408";
  else throw new Error("OS Tidak Didukung");

  // Download Chromium
  const chromiumPath = path.join(process.cwd(), "chromium");
  const browserFetcher = puppeteer.createBrowserFetcher({
    path: chromiumPath,
  });
  const progress = new Progress("Download Chromium [:bar] :percent", 100);
  const browserInfo = await browserFetcher.download(
    version,
    (downloaded, total) => {
      progress.update(downloaded / total);
    }
  );
  return browserInfo.executablePath;
};

const main = async () => {
  const scraperOption: IScraperOption = {
    chromiumPath: "",
    showBrowser: false,
  };

  if (!args.file) return program.outputHelp();
  if (args.showBrowser) scraperOption.showBrowser = true;

  scraperOption.chromiumPath = await chromiumDownload();

  await Scraper.init(scraperOption);
  const products = await Product.readFromFile(path.resolve(args.file));
  const reports = await Scraper.bulkScrape(products);
  const newFileDir = path.join(
    process.cwd(),
    `/report ${new Date().toISOString()}.xlsx`
  );
  await Product.writeToFile(reports, newFileDir);
  await Scraper.close();
  console.log("Finish");
};

(async () => {
  await main();
})();
