const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ninja = require('../models/ninja');
const JWT = require('simple-jwt');
const config = require('../config');
const header = {
    typ: 'JWT',
    alg: 'HS512'
};
const saltSecret = config.secret;

// TODO: set timer for token after 1 hour both tokens at both ends will expire
// TODO: hash the passwords in singup api
router.post('/login', (req, res, next) => {

    Ninja.findOne({name:req.body.name}).then((ninja) => {
        //compare the pwds
        if(ninja.pwd == req.body.pwd)
        {
            var payload = {
                iss: 'http://localhost:4000/',
                accessLevel: 'user',
                userID: ninja._id
            }

            const token = JWT.getToken(header, payload, saltSecret);
            ninja.token = token;
            ninja.save().then((result) => {
                res.send({"token":token});
            }).catch(next);
        }
        else
        {
            res.status(403).send({Error: 'Invalid Password'});
        }
    }).catch((err) => {
        res.status(403).send({Error: 'Invalid User'});
    })
})

router.post('/logout', (req, res, next) => {
    var token = req.headers.token;
    const isValid = JWT.verifyToken(token, saltSecret);
    if(isValid)
    {
        Ninja.findOne({token: token}).then((ninja) => {
            ninja.token = false;
            ninja.save().then((result) => {
            }).catch(next)
        })
        res.send({msg:'logged out'});
    }
    else
    {
        res.status(400).send({Error:'invalid token'});
    }
})

router.post('/retrieveUser', (req, res, next) => {
    var token = req.headers.token;
    const isValid = JWT.verifyToken(token, saltSecret);
    if(isValid)
    {
        Ninja.findOne({token: token}).then((ninja) => {
            var sendNinjaObj = {
                name:ninja.name,
                id: ninja._id,
                rank: ninja.rank,
                available: ninja.available,
                lat: ninja.geometry.coordinates[0],
                lng: ninja.geometry.coordinates[1]
            }
            res.send(sendNinjaObj);
        }).catch(next);
    }
    else {
       res.status(400).send({'Error':'Invalid token'});
    }
})

router.post('/signup', (req, res, next) => {
    var name = typeof(req.body.name) == 'string' && req.body.name.length > 0 ? req.body.name : false;
    var rank = typeof(req.body.rank) == 'string' && req.body.rank.length > 0 ? req.body.rank : false;
    var pwd = typeof(req.body.rank) == 'string' && req.body.rank.length > 0 ? req.body.pwd : false;
    var geometry = typeof(req.body.geometry) == 'object' && req.body.geometry !== null ? req.body.geometry : false;
    var available = typeof(req.body.available) == 'boolean' ? req.body.available : false;
    if(name && rank && pwd && geometry)
    {
        console.log(req.body);
        var ninja = new Ninja(req.body);
        ninja.save().then((result) => {
            res.send({name: ninja.name, pwd: ninja.pwd});
        }).catch(next)
    }
    else
    {
        res.status(400).send({Error:'invalid details'});
    }
})


module.exports = router;
