# JualanSob Sync CLI

JualanSob Sync CLI Version.

Mendapatkan informasi harga dan stok dari supplier untuk dropshipper.

# Translations

* [English](README_en.md)

# Fitur

<ul>
  <li>Dapatkan informasi harga dan stok dari Jakmall</li>
  <li>Dapatkan informasi harga dan stok dari Shopee Indonesia</li>
  <li>Dapatkan informasi harga dan stok dari Tokopedia</li>
  <li>Membuat berkas laporan otomatis dalam fromat *.xlsx</li>
</ul>

# Daftar Isi

- [Pemasangan](#pemasangan)
- [Penggunaan](#penggunaan)
- [Berkas Daftar Produk](#berkas-daftar-produk)
- [Pilihan](#pilihan)
- [Bug yang Diketahui](#bug-yang-diketahui)
- [Compile dari Source](#compile-dari-source)
  - [Package yang Dibutuhkan](#package-yang-dibutuhkan)
  - [Menyiapkan Build Environment](#menyiapkan-build-environment)


# Pemasangan

Untuk menggunakan JualanSob Sync CLI, Anda harus mengunduh berkas pre-compiled atau
[compile dari source](#compile-dari-source).

Berkas pre-compiled tersedia untuk Linux, macOS (untested), dan Windows.

# Penggunaan

Membuka command prompt (cmd) atau terminal dan navigasi ke direktori tempat Anda menyimpan berkas executable, lalu

Untuk pengguna UNIX Like (Linux dan macOS), ketik:

    ./jualansob-sync-cli -f product-list-file.xlsx

Untuk pengguna Windows x86_64 (64-bit), ketik:

    jualansob-sync-cli.exe -f product-list-file.xlsx

JualanSob Sync CLI akan mengunduh Chromium ketika Anda menjalankan perintah tersebut untuk pertama kali.

Setelah perintah tersebut berhasil dijalankan, Anda akan mendapat berkas laporan dalam format *.xlsx yang bisa Anda gunakan untuk mengisi berkas mass product update template dari Shopee Indonesia dan Tokopedia.

Berkas laporan yang dihasilkan memiliki warna pada setiap baris. Berikut adalah warna-warna yang digunakan:

    Merah       Produk tidak ditemukan atau stok kosong.
                Anda harus memperbarui produk Anda secepatnya.
    Orange      Produk restok atau harga berubah.
                Anda sebaiknya memperbarui produk Anda.
    Hijau       Produk aman.
                Anda tidak perlu memperbarui produk Anda.

# Berkas Daftar Produk

Sebelum Anda mendapatkan informasi harga dan stok, Anda harus mengisi product-list-file.xlsx terlebih dahulu yang sudah disediakan ketika anda mengunduh JualanSob Sync CLI. Bagian ini akan menerangkan cara mengisi berkas tersebut.

    Varian ID Tokopedia (opsional)          Isi dengan Product ID produk Anda.
                                            Dari template mass product update Tokopedia.
                                            e.g 1234567890.0987654321

    Varian ID Shopee (opsional)             Isi dengan Kode Variasi produk Anda.
                                            Dari template mass product update Shopee Indonesia.
                                            e.g 12345678901

    Judul Produk                            Isi dengan judul produk Anda.
                                            e.g Kemeja Pria Lengan Panjang

    Varian Supplier (opsional)              Isi dengan nama varian pada produk supplier.
    (case-sensitive)                        Hanya berlaku untuk supplier dari Shopee Indonesia.
                                            e.g Merah

    Link Supplier                           Isi dengan alamat produk supplier.
                                            Jika produk memiliki varian, gunakan alamat varian.

    Harga Supplier                          Isi dengan harga supplier.
                                            Angka tanpa mata uang dan pemisah ribuan.
                                            -1 berarti produk tidak ditemukan.
                                            e.g 50000
    
    Stok                                    Isi dengan stok supplier.
                                            -1 berarti produk tidak ditemukan.
                                            0 berarti produk kosong.
                                            >1 berarti produk tersedia.
                                            e.g 10

# Pilihan

    -f, --file FILEDIR                    Cek dari berkas
    --show-browser                        Menampilkan jendela browser
    -v, --version                         Menampilkan versi program
    -h, --help                            Menampilkan dialog bantuan

# Bug yang Diketahui

- Jika alamat IP Anda dicap sebagai alamat IP mencurigakan oleh CDN Tokopedia, hasil fetch akan mengembalikan produk tidak ditemukan.
- Produk dari Shopee Indonesia yang memiliki tipe varian lebih dari satu (e.g warna dan ukuran) tidak dapat di-fetch. Hasil fetch akan mengembalikan produk tidak ditemukan.

# Compile dari Source

Anda dapat clone project ini untuk compile dari source.

## Package yang Dibutuhkan

- nodejs
- npm

## Menyiapkan Build Environment

Untuk Debian and Ubuntu, Anda dapat mengunduh nodejs dan npm dari terminal, ketik:

    sudo apt install -y nodejs npm

Untuk macOS, Anda dapat mengunduh nodejs dan npm dari
[sini](https://nodejs.org/en/download/) ataupun apabila Anda sudah install 
[homebrew](https://brew.sh/), ketik:

    brew install node

Untuk Windows, Anda dapat mengunduh nodejs dan npm dari
[sini](https://nodejs.org/en/download/).

Setelah memasang nodejs dan npm, Anda dapat menavigasi ke direktori tempat Anda menyimpan source code melalui command prompt (cmd) atau terminal, lalu ketik perintah-perintah ini untuk memasang dependencies:

    npm install
    npm install -g pkg

Setelah memasang dependencies, Anda dapat mengetik perintah-perintah ini untuk build dari source code:

    npm run build
    pkg dist/index.js -t {OS-PLATFORM} --public

Ganti {OS-PLATFORM} dengan:

    linux                   untuk build Linux executable
    macos                   untuk build macOS executable
    win-x64                 untuk build x86_64 Windows executable