const  mongoose = require('mongoose');

const spendSchema = mongoose.Schema({
    date_depense : {type: String},
    montant_depense : {type: Number},
    remarque_depense : {type: String},
    logoName : {type: String},
    nom_categorie : {type: String},
    type: {type: String}

});
module.exports = mongoose.model('Spend', spendSchema);
