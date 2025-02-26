const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  codigo: String,
  name: String,
  description: String,
  stock: Number,
  price: Number,
  image: String,
  status: Boolean,
}, { timestamps: true });

ProductSchema.pre('save', async function (next) {
  if (!this.codigo) {
    const lastProduct = await mongoose.model('Product').findOne({}, {}, { sort: { codigo: -1 } });
    let newCode = lastProduct ? parseInt(lastProduct.codigo) + 1 : 1;
    this.codigo = newCode.toString().padStart(5, '0');
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
