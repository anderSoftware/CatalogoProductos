//Imports
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const PDFDocument = require('pdfkit');

//Models
const Product = require('../models/Product');
const FichaTecnicaForm = require('../models/FichaTecnicaForm');

//Multer
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/products');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProduct = multer({ storage: productStorage });

//Auth
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};


//Routes
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ status: true });
        res.render('index', { user: req.session.user, products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/productsAdministrator', { user: req.session.user, products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.post('/create-products', isAuthenticated, uploadProduct.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, status } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            image,
            status: true
        });

        await newProduct.save();
        res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.post('/edit-products/:id', isAuthenticated, uploadProduct.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const updateData = { name, description, price, stock };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.put('/delete-products/:id', isAuthenticated, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto desactivado', product });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del producto' });
    }
});


router.get('/download-pdf/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      const doc = new PDFDocument();
      const filename = `ficha-tecnica-${product.name}.pdf`;
      
      res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-type', 'application/pdf');
      doc.pipe(res);
  
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('FICHA TÉCNICA', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(18)
        .font('Helvetica-Bold')
        .text(product.name, { align: 'center' });
      doc.moveDown();
  
      const fechaCreacion = product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A';
      const fechaActualizacion = product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A';
      
      const tableData = [
        ['Característica', 'Detalle'],
        ['Código', product.codigo || 'N/A'],
        ['Descripción', product.description || 'N/A'],
        ['Precio', `$${product.price}` || 'N/A'],
        ['Stock', product.stock.toString() || 'N/A'],
        ['Categoría', product.category || 'N/A'],
        ['Fecha de Creación', fechaCreacion],
        ['Fecha de Actualización', fechaActualizacion]
      ];
  
      const margins = { left: 50, right: 50 };
      const tableWidth = doc.page.width - margins.left - margins.right;
      const colWidths = [tableWidth * 0.4, tableWidth * 0.6]; 
      
      function calculateTextHeight(text, fontSize, fontWidth, maxWidth) {
        const characterWidth = fontSize * fontWidth;
        const characters = maxWidth / characterWidth;
        const lines = Math.ceil(text.length / characters);
        return lines * (fontSize * 1.2); 
      }

      let y = 200; 
      
      tableData.forEach((row, rowIndex) => {
        doc.fontSize(12).font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica');
        
        const textHeight1 = calculateTextHeight(row[0], 12, 0.6, colWidths[0] - 20);
        const textHeight2 = calculateTextHeight(row[1], 12, 0.6, colWidths[1] - 20);
        const rowHeight = Math.max(30, textHeight1, textHeight2) + 16; 
        
        if (rowIndex % 2 === 1) {
          doc.fillColor('#f5f5f5')
             .rect(margins.left, y, tableWidth, rowHeight)
             .fill();
        }
        
        doc.strokeColor('#000000')
           .rect(margins.left, y, tableWidth, rowHeight)
           .stroke();
        
        doc.moveTo(margins.left + colWidths[0], y)
           .lineTo(margins.left + colWidths[0], y + rowHeight)
           .stroke();
    
        doc.fillColor('#000000')
           .text(row[0], margins.left + 10, y + 8, { 
              width: colWidths[0] - 20,
              align: 'left'
           });
           
        doc.text(row[1], margins.left + colWidths[0] + 10, y + 8, { 
              width: colWidths[1] - 20,
              align: 'left'
           });
        
        y += rowHeight;
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 50;
        }
      });
  
      
      doc.end();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      res.status(500).json({ error: 'Error al generar el PDF' });
    }
  });

router.post('/send-email', async (req, res) => {
    try {
        const { email, productId } = req.body;
        if (!email || !productId) {
            return res.status(400).json({ error: 'El correo electrónico y el ID del producto son requeridos' });
        }

        let fichaTecnica = await FichaTecnicaForm.findOne({ email });

        if (!fichaTecnica) {
            fichaTecnica = new FichaTecnicaForm({
                email
            });
            await fichaTecnica.save();
        }
        res.status(200).json({ success: true, message: 'Email registrado correctamente' });
    } catch (error) {
        console.error('Error al guardar el email:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});


module.exports = router;
