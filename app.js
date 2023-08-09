//FRAMEWORK EXPRESS
var express = require('express');
var app = express();

var path = require('path'); //LIRE LES FICHIERS HTML

// RECUPERER LES DONNEES DE FORMULAIRE (REQ.BODY)
var bodyParser = require('body-parser');   
app.use(bodyParser.urlencoded({extended:false}));

//MODE API, POUR QUE REACT RECUPERE LES DONNEES
var cors = require('cors');
app.use(cors({credentials:true, origin:"http://localhost:3000"}));

//SYSTEME DE VUE: EJS 
// app.set('view engine', 'ejs');

const bcrypt = require('bcrypt'); //ENCODAGE DES MOTS DE PASSE

//METHOD PUT ET DELETE DANS LE FRONT AVEC EJS
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


//UTILISATION DES COOKIES
const cookieParser = require('cookie-parser'); 
app.use(cookieParser());

//IMPORT JWT
const {createTokens, validateToken} = require('./JWT');

//BDD
require('dotenv').config();
var mongoose = require('mongoose');
const url =process.env.DATABASE_URL;

mongoose.connect(url, {
    useNewUrlParser: true,   //UTILISATION DE LA NOUVELLE METHODE POUR ENVOYER LES FORMULAIRES
    useUnifiedTopology: true  //TOUTE LES DONNEES STOCKER DANS BODY
}).then(console.log("MongoDB connected"))
.catch(err => console.log(err)); 


//APPELLES DES MODELES
var User = require('./modeles/User');
var Spend = require('./modeles/Spend');
var multer = require('multer');   //PACKAGE DE GESTION DE FICHIER
var Categorie = require('./modeles/Categorie')




//INSCRIPTION
app.post('/api/signup', function(req, res){
    const Data = new User({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
        admin: false,
    })
    Data.save().then(()=>{
        console.log("Utilisateur ajouté");
        res.redirect('http://localhost:3000/login');

    }).catch(err => {console.log(err)});
})


// Affichage formulaire inscription
// app.get('/newuser', function(req, res){
//     res.render('Signup');
// })

// Afichage formulaire de connexion
// app.get('/login', function(req, res){
//     res.render('Login');
// })

app.post('/api/login', function(req, res){
    User.findOne(
      {  email: req.body.email
      }).then(user => {
        if(!user){ res.status(404).send("User not found");} 
        console.log(user);
        // if( user.password != req.body.password){
        //     res.status(404).send("Wrong password");
        // }

        if(!bcrypt.compareSync(req.body.password, user.password)){
            res.status(404).send("Wrong password");
        }
        const accessToken = createTokens(user);
        //JETON PERSONNALISE POUR ACCEDER AU SITE
        res.cookie("accessToken", accessToken, {
            maxAge: 1000* 60*60*24*30,  //1 mois:1000ms * 60s * 60min * 24h * 30j
            httpOnly: true
        });
       res.redirect("http://localhost:3000/portefeuille")


        //res.render('Userpage', {data : user})
    })
   .catch(err => {console.log(err)});
})

app.get('/getJWT', function(req, res){
    res.json(req.cookies.accessToken)
})

//1ER METHODE LOGOUT
app.get('/logout', (req, res) =>{
    res.clearCookie("accessToken");
    res.redirect('http://localhost:3000/')
})

//2EME METHODE POUR LOGOUT
// app.get('/logout', (req, res) =>{
//     res.cookie("accessToken");
//     res.redirect('http://localhost:3000/')
// })

app.get('/', function(req, res) {
   User.find().then((data)=>{
        res.json( {data : data})
    })
})



// app.get('/newspend', function(req, res){
//     res.render('NewSpend');
// });

app.post('/submit-spend', function(req, res){
    const Data = new Spend({
        date_depense: req.body.date_depense,
        montant_depense: req.body.montant_depense,
        remarque_depense: req.body.remarque_depense,
        logoName: req.body.logoName,
        nom_categorie: req.body.nom_categorie,
        type: req.body.type,
   } )
   Data.save().then(()=>{
    console.log("Dépense ajoutée");
    res.redirect('http://localhost:3000/portefeuille')
    
    }).catch(err => {console.log(err)});;
});

app.get('/allspend', function(req, res){
    Spend.find().then((data) => {
     
         //res.render('Allspend', {data: data});
     
     
         // res.json({data: data});
       res.json(data);
    })

})

app.get('/spend/:id', function(req, res){
    console.log(req.params.id);
    Spend.findOne({
       _id: req.params.id})
       .then(data => { res.json(data);})
       .catch(err =>{ console.log(err)});
   });

app.delete('/spend/delete/:id', function (req, res) {
    console.log(req.params.id);
    Spend.findOneAndDelete({
        _id: req.params.id
    }).then(() => { console.log("Data deleted successfully");
    res.redirect('http://localhost:3000/portefeuille');
     }).catch(err => {console.log(err)});
});

app.put('/spend/edit/:id', function (req, res) {
    const Data = {
        date_depense: req.body.date_depense,
        montant_depense: req.body.montant_depense,
        remarque_depense: req.body.remarque_depense,
        logoName: req.body.logoName,
        nom_categorie: req.body.nom_categorie,
        type: req.body.type,
        
    };
    Spend.updateOne({_id: req.params.id},{$set:Data}).then(
        (data) => {
        console.log(data);
        res.redirect('http://localhost:3000/portefeuille')
        }
      ).catch (err => console.log(err));
});
app.post('/submit-categorie', function(req,res){
    const Data = new Categorie({
        nom_categorie : req.body.nom_categorie,
        logoName : req.body.logoName, 
        type_categorie : req.body.type_categorie, 
     
});

Data.save().then(()=>{
    console.log('Catégorie Added successfully');
    res.redirect('http://localhost:3000/newspend')
}).catch(err => console.log(err));

});
app.get('/allcategories', function(req, res){
    Categorie.find().then((data) => {
       res.json(data);
    })

})


var server = app.listen(5000, function(){
    console.log('server listening on port 5000');
})
