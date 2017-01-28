var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StockSchema   = new Schema({
                        Symbol: String,
                        Name: String
                    },
                    {
                        collection:'stock_names'
                    });

module.exports = mongoose.model('Stock', StockSchema);