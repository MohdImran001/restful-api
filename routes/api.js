const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja')
const mongoose = require('mongoose');
const JWT = require('simple-jwt');
const config = require('../config');
const header = {
    typ: 'JWT',
    alg: 'HS512'
};
const saltSecret = config.secret;

router.get('/ninjas', (req,res) => {
  Ninja.aggregate().near({
     near: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
     maxDistance: 100000,
     spherical: true,
     distanceField: "dist.calculated"
    })﻿.then((ninjas) => {
      res.send(ninjas)
    })
})

router.put('/ninjas/changePassword/', (req, res, next) => {
    var token = req.headers.token;
    const isValid = JWT.verifyToken(token, saltSecret);
    if(isValid)
    {
        Ninja.findOne({'token':token}).then((ninja) => {
            if(ninja.pwd == req.body.oldPass)
            {
                ninja.update({ $set: { "pwd": req.body.pwd } }).then(() => {
                    res.send({msg:'Password Updated Successfully'});
                }).catch(next)
            }
            else {
                res.status(400).send({Error:'Invalid old Password'});
            }
        }).catch(next);
    }
    else
    {
        res.status(400).send({Error:'Invalid Token'})
    }
})

router.put('/ninjas/updateInfo/', (req, res, next) => {
    var token = req.headers.token;
    const isValid = JWT.verifyToken(token, saltSecret)
    if(isValid)
    {
        Ninja.findOneAndUpdate({token:token}, { $set: { rank: req.body.rank, geometry: req.body.geometry, available: req.body.available } }).then(() => {
                      res.send({msg:'Successfully Updated'});
        }).catch(next);
    }
    else
    {
        res.send({Error: 'error'});
    }
})

router.delete('/ninjas/deleteAccount/', (req, res, next) => {
    var token =  req.headers.token;
    const isValid = JWT.verifyToken(token, saltSecret);
    if(isValid)
    {
        Ninja.findOne({token:token}).then((ninja) => {
            if(req.body.pwd == ninja.pwd)
            {
              ninja.remove().then((result) => {
                  res.send({msg: "Account Deleted Successfully"});
              }).catch(next)
            }
            else
            {
                res.status(400).send({Error: 'Invalid Password'});
            }
        }).catch(next);

    }
    else
    {
        res.send({Error: 'Invalid Token'});
    }
})

module.exports = router










//
