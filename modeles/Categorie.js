const  mongoose = require('mongoose');

const categorieSchema = mongoose.Schema({
    nom_categorie : {type: String},
    logoName : {type: String},
    type_categorie : {type: Boolean},
  
  
});
module.exports = mongoose.model('Categorie', categorieSchema);
