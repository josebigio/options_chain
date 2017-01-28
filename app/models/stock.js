var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StockSchema   = new Schema({
                        Symbol: String,
                        Name: String
                    },
                    {
                        collection:'stocks_info'
                    });

module.exports = mongoose.model('Stock', StockSchema);