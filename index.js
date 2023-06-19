const express = require('express');
const app = express();

const cors = require("cors");
const jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

app.use(express.json());


var corsOptions = {
    //origin: "http://localhost:4200"
    origin: "*"
};

app.use(cors(corsOptions));

// 1) mettre le serveur à l'écoute(en marche) sur le port 85
app.listen(
    83,
    () => { console.log("Serveur Express a l ecoute sur le port 83"); }
);

// 2) connexion de notre serveur à la base mongo
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1';  // ou 127.0.0.1 pour certains
const dbName = 'monapi';


let db

MongoClient.connect(url, function (err, client) {
    console.log("Connexion réussi avec Mongo DB et compass");
    db = client.db(dbName);
});


// 3) Application du JWT

// // 3) Création api (endpoints)

//     // SECRET FOR JWT
let secret = 'plb2023'; // a secret key is set here

/* Create token to be used */
app.post('/token/sign', (req, res) => {
    let credentials =  req.body;
    if((credentials.email==="ksentinihaitham@gmail.com") && (credentials.password==="1234")){
    // vérifier si un user admet le login et le mot de passe
    var userData = {
        "name": "Ksentini Haitham",
        "id": "1234",
        "Poste actuel":"Ingénieur  génie logiciel",
        "role":"Chef de projet"
    }
        let token = jwt.sign(userData, secret, { expiresIn: '10000s'})
        res.status(200).json({"token": token});
    }
    else
       res.status(401).json({"Message": "Invalide login/password"});
});

app.use(expressJWT({ secret: secret, algorithms: ['HS256']})
    .unless( // This allows access to /token/sign without token authentication
        { path: [
            //'/token/sign','/countries'
            '/token/sign',
        ]}
    ));

    
// // 3.1)Get All countries
app.get('/countries', (req, res) => {
    db.collection('country').find({}).toArray(function (err, data) {
        if (err) {
            console.log(err)
            throwerr
        }
        res.status(200).json(data)
    })
})

// //3.2) Post new Country
app.post('/countries', async (req, res) => {
    try {
        const countryData = req.body
        const country = await db.collection('country').insertOne(countryData)
        res.status(201).json(country)
    } catch (err) {
        console.log(err)
        throw err
    }
})