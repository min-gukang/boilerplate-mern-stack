const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    name : {
        type : String,
        maxlength : 50
    },
    description: {
        type : String,
    },
    price : {
        type : Number,
        default : 0
    },
    images : {
        type : Array,
        default : []
    },

    continents : {
        type : Number,
        default : 1
    },
    sold : { //몇개나 팔렸는지에 대한 정보
        type: Number,
        maxlength: 100,
        default : 0
    },
    views : { //사람들이 얼마나 봤는지에 대한 정보
        type : Number,
        default : 0
    }
}, {timestamps: true}) //자동으로 등록시간 설정됨. 

const Product = mongoose.model('Product', productSchema);
module.exports = { Product }