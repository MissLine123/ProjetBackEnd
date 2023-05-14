const  mongoose = require('mongoose');

const spendSchema = mongoose.Schema({
    date : {type: String},
    montant : {type: Number},
    remarque : {type: String},
  
  
});
module.exports = mongoose.model('Spend', spendSchema);
