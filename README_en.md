# JualanSob Sync CLI

JualanSob Sync CLI Version.

Get price and stock information from supplier for dropshipper.

# Translations

* [Bahasa Indonesia](README.md)

# Features

<ul>
  <li>Get price and stock information from Jakmall</li>
  <li>Get price and stock information from Shopee Indonesia</li>
  <li>Get price and stock information from Tokopedia</li>
  <li>Auto generate report file in *.xlsx format</li>
</ul>

# Contents

- [Installation](#installation)
- [Usage](#usage)
- [Product List File](#product-list-file)
- [Options](#options)
- [Known Bugs](#known-bugs)
- [Compile From Source](#compile-from-source)
  - [Required Packages](#required-packages)
  - [Preparing Build Environment](#preparing-build-environment)


# Installation

To use JualanSob Sync CLI you have to download pre-compiled binary file or
[compile from source](#compile-from-source).

Pre-compiled binaries are available for Linux, macOS (untested), and Windows.

# Usage

Open command prompt or terminal and navigate to where the executable file located, and then

For UNIX Like (Linux and macOS) users, you can type:

    ./jualansob-sync-cli -f product-list-file.xlsx

For Windows x86_64 (64-bit) users, you can type:

    jualansob-sync-cli.exe -f product-list-file.xlsx

JualanSob Sync CLI will download Chromium for the first time when you execute the command.

After the command run successfully, you will get report file in the *.xlsx format that you can use to fill mass product update template file from Shopee Indonesia and Tokopedia.

Generated report file has colors assigned to each row. Here are the colors:

    Red         Product is not found or empty stock.
                You have to update your listing ASAP.
    Orange      Product is restocked or product's price is changed.
                You should update your listing.
    Green       Product is okay.
                You don't have to update your listing.

# Product List File

Before you can fetch price and stock information, you have to fill product-list-file.xlsx which is included when you downloaded JualanSob Sync CLI. This section will explain how to fill the file.

    Varian ID Tokopedia (optional)          Filled with your product's Product ID.
                                            Found in mass product update template from Tokopedia.
                                            e.g 1234567890.0987654321

    Varian ID Shopee (optional)             Filled with your product's Kode Variasi.
                                            Found in mass product update template from Shopee Indonesia.
                                            e.g 12345678901

    Judul Produk                            Filled with product title in your listing.
                                            e.g Kemeja Pria Lengan Panjang

    Varian Supplier (optional)              Filled with variant name in your supplier's listing.
    (case-sensitive)                        Only applied for supplier from Shopee Indonesia.
                                            e.g Merah

    Link Supplier                           Filled with link to your supplier listing.
                                            If product has variants, link must be pointing to specific variant.

    Harga Supplier                          Filled with your supplier's product price.
                                            Must be numeric without currency and thousand separator.
                                            -1 means product is not found.
                                            e.g 50000
    
    Stok                                    Filled with your supplier's stock.
                                            -1 means product is not found.
                                            0 means product is empty.
                                            >1 means product is available.
                                            e.g 10

# Options

    -f, --file FILEDIR                    Check from file
    --show-browser                        Show browser window
    -v, --version                         Print program version
    -h, --help                            Print help dialog

# Known Bugs

- If your IP address is flagged as suspicious IP address by Tokopedia CDN, fetch result will return product is not found.
- Shopee Indonesia product with more than one variant type (e.g color and size) can't be fetched.

# Compile From Source

You can clone this project to compile from source.

## Required Packages

- nodejs
- npm

## Preparing Build Environment

For Debian and Ubuntu, you can download nodejs and npm from terminal, type:

    sudo apt install -y nodejs npm

For macOS, you can download nodejs and npm from
[here](https://nodejs.org/en/download/) or assumming you have 
[homebrew](https://brew.sh/) installed, type:

    brew install node

For Windows, you can download nodejs and npm from
[here](https://nodejs.org/en/download/).

After installing nodejs and npm, you can navigate to source code directory via command prompt or terminal, and then type these commands to install dependencies:

    npm install
    npm install -g pkg

After installing dependencies, you can type these command to build from source code:

    npm run build
    pkg dist/index.js -t {OS-PLATFORM} --public

Replace {OS-PLATFORM} with:

    linux                   to build Linux executable
    macos                   to build macOS executable
    win-x64                 to build x86_64 Windows executable