import { Workbook } from "exceljs";

export interface IProduct {
  tokopedia_id?: string;
  shopee_id?: string;
  title: string;
  supplier_variant?: string;
  supplier_link: string;
  supplier_price: number;
  stock: number;
  supplier_type: string;
}

export interface IProductReport extends IProduct {
  status: number;
}

export default class Product {
  static readFromFile = async (fileDir: string): Promise<IProduct[]> => {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(fileDir);
    const worksheet = workbook.getWorksheet(1);

    // Check Template
    const headers = [
      "Varian ID Tokopedia",
      "Varian ID Shopee",
      "Judul Produk",
      "Varian Supplier",
      "Link Supplier",
      "Harga Supplier",
      "Stok",
    ];

    worksheet.getRow(1).eachCell((cell, colNum) => {
      if (!cell.value) throw new Error("File Template Tidak Sesuai!");
      if (headers[colNum - 1] !== cell.value.toString())
        throw new Error("File Template Tidak Sesuai!");
    });

    // Filter Empty Row
    let rows = worksheet.getRows(2, worksheet.rowCount - 1);
    if (rows) {
      rows = rows.filter((row) => {
        if (row.hasValues) return row;
      });
    } else {
      rows = [];
    }

    // Read Content
    const products: IProduct[] = [];
    rows.forEach((row) => {
      let product: IProduct = {
        tokopedia_id: undefined,
        shopee_id: undefined,
        title: "",
        supplier_variant: undefined,
        supplier_link: "",
        supplier_price: -1,
        stock: -1,
        supplier_type: "",
      };

      // Tokopedia Varian ID
      let cellValue = row.getCell(1).toString().trim();
      if (cellValue !== "") product.tokopedia_id = cellValue;

      // Shopee Varian ID
      cellValue = row.getCell(2).toString().trim();
      if (cellValue !== "") product.shopee_id = cellValue;

      // Judul
      cellValue = row.getCell(3).toString().trim();
      if (cellValue === "") throw new Error("Judul Tidak Boleh Kosong!");
      product.title = cellValue;

      // Varian Supplier
      cellValue = row.getCell(4).toString().trim();
      if (cellValue !== "") product.supplier_variant = cellValue;

      // Link Supplier
      cellValue = row.getCell(5).toString().trim();
      if (cellValue === "")
        throw new Error("Link Supplier Tidak Boleh Kosong!");

      if (cellValue.includes("jakmall.com")) {
        product.supplier_link = cellValue;
        product.supplier_type = "jakmall";
      } else if (cellValue.includes("shopee.co.id")) {
        product.supplier_link = cellValue;
        product.supplier_type = "shopee";
      } else if (cellValue.includes("tokopedia.com")) {
        product.supplier_link = cellValue;
        product.supplier_type = "tokopedia";
      } else {
        throw new Error("Supplier Tidak Didukung!");
      }

      // Harga Supplier
      cellValue = row.getCell(6).toString().trim();
      if (cellValue === "")
        throw new Error("Harga Supplier Tidak Boleh Kosong!");
      cellValue = cellValue.replace(/[^0-9]+/g, "");
      product.supplier_price = parseInt(cellValue);

      // Stok
      cellValue = row.getCell(7).toString().trim();
      if (cellValue === "")
        throw new Error("Stok Supplier Tidak Boleh Kosong!");
      cellValue = cellValue.replace(/[^0-9]+/g, "");
      product.stock = parseInt(cellValue);

      products.push(product);
    });
    return products;
  };

  static writeToFile = async (
    reports: IProductReport[],
    newFileDir: string
  ) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();

    worksheet.columns = [
      { header: "Varian ID Tokopedia" },
      { header: "Varian ID Shopee" },
      { header: "Judul Produk" },
      { header: "Varian Supplier" },
      { header: "Link Supplier" },
      { header: "Harga Supplier" },
      { header: "Stok" },
      { header: "Status" },
    ];

    reports.forEach((report) => {
      let strStatus = "";
      let fgColor = { argb: "FFFF0000" };
      if (report.status === 0) {
        strStatus = "Stok Kosong";
        fgColor.argb = "FFFF0000";
      } else if (report.status === 1) {
        strStatus = "OK";
        fgColor.argb = "FF00FF00";
      } else if (report.status === 2) {
        strStatus = "Restock";
        fgColor.argb = "FFFFA500";
      } else if (report.status === 3) {
        strStatus = "Harga Berubah";
        fgColor.argb = "FFFFA500";
      } else if (report.status === -1) {
        strStatus = "Produk Tidak Tersedia";
        fgColor.argb = "FFFF0000";
      }
      const row = worksheet.addRow([
        report.tokopedia_id,
        report.shopee_id,
        report.title,
        report.supplier_variant,
        report.supplier_link,
        report.supplier_price,
        report.stock,
        strStatus,
      ]);

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: fgColor,
        };
      });
    });
    await workbook.xlsx.writeFile(newFileDir);
  };
}
