# Excel → Shopify CSV Converter

![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styles-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![Shopify](https://img.shields.io/badge/Shopify-CSV%20Compatible-7AB55C?logo=shopify&logoColor=white)
![SheetJS](https://img.shields.io/badge/SheetJS-XLSX%20Parser-2C3E50)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Web-based dashboard to convert Excel product files (.xlsx / .xls) into a fully compatible Shopify CSV import format.

This tool processes data directly in the browser and generates a CSV file based on Shopify’s official `product_template.csv` header.

---

## 📌 Overview

This project was built to streamline bulk product uploads into Shopify by:

- Parsing Excel files
- Mapping fields dynamically
- Generating Shopify-compliant CSV output
- Providing real-time validation and preview

No backend required. All processing happens client-side.

---

## 🗂 Project Structure


Carga_Productos/
│
├── index.html # Main dashboard UI
├── styles.css # Modern dashboard styling
├── app.js # Excel parsing & CSV generation logic
└── README.md # Documentation


---

## ⚙️ How It Works

### 1️⃣ Input (Excel)

The system automatically detects common column variations such as:

| Excel Column  | Shopify Field         |
|---------------|----------------------|
| Articulo      | SKU                  |
| Descripcion   | Title / Description  |
| Existencia    | Inventory quantity   |
| Linea         | Tags                 |
| Proveedor     | Vendor               |
| Bodega        | Tags                 |
| BU            | Tags                 |

It supports variations like:
- "Artículo"
- "Descripción"
- "Stock"
- "Inventario"

---

### 2️⃣ Processing

The script:

- Normalizes column names
- Generates unique URL handles
- Merges tags dynamically
- Validates required fields
- Escapes CSV correctly
- Initializes missing Shopify fields as empty

---

### 3️⃣ Output (Shopify CSV)

The generated file:

- Uses Shopify’s complete header template
- Populates essential fields
- Leaves non-required fields empty
- Sets default operational values:
  - Status → Active
  - Published → TRUE
  - Inventory tracker → shopify
  - Continue selling when out of stock → DENY
  - Requires shipping → TRUE
  - Fulfillment service → manual

---

## 🚀 Usage

1. Open `index.html` in your browser.
2. Drag & drop or select your Excel file.
3. Review the preview.
4. Click **Convert**.
5. Download `shopify_products.csv`.
6. Import into Shopify Admin.

---

## 🧠 Validation System

The dashboard includes:

- Required column verification
- Missing data warnings
- Real-time status indicator
- File metadata display
- Preview of first 12 rows
- Conversion log panel

---

## 🛠 Technologies

- HTML5
- CSS3 (Custom properties / modern dashboard UI)
- Vanilla JavaScript (ES6+)
- SheetJS (XLSX parser via CDN)

---

## 🔒 Security & Architecture

- 100% client-side processing
- No server required
- No external data storage
- No API calls
- Safe for internal or offline usage

---

## 📈 Potential Enhancements

- Direct Shopify API integration
- Automatic image URL mapping
- Price & cost handling
- Variant support
- Custom field configuration panel
- Multi-sheet support
- Batch validation reports

---

## 🏷 Use Case

Ideal for:

- Engineering suppliers
- Industrial distributors
- Inventory-heavy catalogs
- Shopify bulk migrations
- Internal automation workflows

---

## 📄 License

Private/Internal Use  
Modify and adapt as needed.

---

## 👨‍💻 Author

Developed as part of internal Shopify automation workflow.