//FRAMEWORK EXPRESS
var express = require('express');
var app = express();

var path = require('path'); //LIRE LES FICHIERS HTML

//ENREGISTREMENT FORMULAIRE
var bodyParser = require('body-parser');   
app.use(bodyParser.urlencoded({extended:false}));

//MODE API, POUR QUE REACT RECUPERE LES DONNEES
var cors = require('cors');
app.use(cors());

//SYSTEME DE VUE: EJS 
app.set('view engine', 'ejs');

const bcrypt = require('bcrypt'); //ENCODAGE DES MOTS DE PASSE

//METHOD PUT ET DELETE DANS LE FRONT
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
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(console.log("MongoDB connected"))
.catch(err => console.log(err)); 


//APPELLES DES MODELES
var User = require('./modeles/User');
var Spend = require('./modeles/Spend');




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
        res.redirect('/login');

    }).catch(err => {console.log(err)});
})


//Affichage formulaire inscription
app.get('/newuser', function(req, res){
    res.render('Signup');
})

//Afichage formulaire de connexion
app.get('/login', function(req, res){
    res.render('Login');

})

app.post('/api/login', function(req, res){
    User.findOne(
      {  email: req.body.email
      }).then(user => {
        if(!user){
            res.status(404).send("User not found");
        } 
        console.log(user);


        // if( user.password != req.body.password){
        //     res.status(404).send("Wrong password");
        // }


        if(!bcrypt.compareSync(req.body.password, user.password)){
            res.status(404).send("Wrong password");
        }
        const accessToken = createTokens(user);
        res.cookie("accessToken", accessToken, {
            maxAge: 60*60*24*30, //1 mois: 60s * 60min * 24h * 30j
            httpOnly: true
        });
       res.redirect("http://localhost:3000/allspend")


        //res.render('Userpage', {data : user})
    })
   .catch(err => {console.log(err)});
})



app.get('/',validateToken, function(req, res) {
   User.find().then((data)=>{
        res.json( {data : data})
    })
})

app.get('/newspend', function(req, res){
    res.render('NewSpend');
});

app.post('/submit-spend', function(req, res){
    const Data = new Spend({
       date: req.body.date,
       montant: req.body.montant,
       remarque: req.body.remarque,
   } )
   Data.save().then(()=>{
    console.log("Dépense ajoutée");
    res.redirect('http://localhost:3000/allspend')
    
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
       .then(data => { res.render('SpendEdit', {data:data});})
       .catch(err =>{ console.log(err)});
   });

app.delete('/spend/delete/:id', function (req, res) {
    console.log(req.params.id);
    Spend.findOneAndDelete({
        _id: req.params.id
    }).then(() => { console.log("Data deleted successfully");
    res.redirect('http://localhost:3000/allspend');
     }).catch(err => {console.log(err)});
});

app.put('/spend/edit/:id', function (req, res) {
    const Data = {
        date: req.body.date,
        montant: req.body.montant,
        remarque: req.body.remarque,
        
    };
    Spend.updateOne({_id: req.params.id},{$set:Data}).then(
        (data) => {
        console.log(data);
        res.redirect('http://localhost:3000/allspend')
        }
      ).catch (err => console.log(err));
});


var server = app.listen(5000, function(){
    console.log('server listening on port 5000');
})
