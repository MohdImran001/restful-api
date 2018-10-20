const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GeoSchema = new Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
})

var NinjaSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name field is required']
    },
    rank: {
      type: String,
      required: [true, 'Name field is required']
    },
    available: {
      type: Boolean,
      default: false
    },
    pwd: {
      type: String,
      required: [true, 'Name field is required']
    },
    token: {
      type: String,
      default: false
    },
    geometry: GeoSchema
})

var NinjaModel = mongoose.model('ninja', NinjaSchema)

module.exports = NinjaModel
