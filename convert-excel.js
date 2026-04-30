// Install SheetJS: npm install xlsx
const XLSX = require('xlsx');

const workbook = XLSX.readFile('data/products.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

require('fs').writeFileSync('data/products.json', JSON.stringify(data, null, 2));
console.log('Excel converted to JSON successfully!');
