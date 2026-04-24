const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    img: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderDateIST: {
        type: String,
        default: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    },
    status: {
        type: String,
        default: 'Processing'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
