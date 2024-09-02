
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');

const PORT = 3001;
const ADMIN_USERNAME = 'aayush';
const ADMIN_PASSWORD = 'aayush@123';

let products = [
//   { id: 1, name: 'Gold Ring', price: 200, gender: 'Men', category: 'Rings', popularity: 10 },
//   { id: 2, name: 'Diamond Necklace', price: 500, gender: 'Women', category: 'Necklaces', popularity: 50 },
//   // Add more products here...
];

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return cb(new Error('Invalid file type. Only .xlsx files are allowed.'));
    }
    cb(null, true);
  }
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ token: 'admin-token', isAdmin: true });
  } else {
    res.json({ token: null, isAdmin: false });
  }
});

// Handle getting products
app.get('/products', (req, res) => {
  res.json(products);
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (token === 'admin-token') {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const oldPath = req.file.path;
    const newPath = path.join('uploads', req.file.originalname);

    fs.renameSync(oldPath, newPath);

    // Read and process the .xlsx file
    const workbook = xlsx.readFile(newPath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Update products array
    products = sheetData;

    res.json({ message: 'File uploaded and processed successfully!', data: sheetData });
    // redirectUrl: 'http://localhost:3000/products' 
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
