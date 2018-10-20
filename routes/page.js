const express = require('express');
const router = express.Router()
const fs = require('fs')
const helpers = require('../helpers')

//// TODO: convert all in 1 func using loop
router.get('/', (req,res) => {
    var templateData = {
        'head.title': "Hire a Ninja"
    }
    helpers.miniTemp('hireNinja', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/login', (req,res) => {
    var templateData = {
        'head.title': "Ninja Login"
    }
    helpers.miniTemp('login', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/signup', (req,res) => {
    var templateData = {
        'head.title': "Become a Ninja"
    }
    helpers.miniTemp('signup', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/change-password', (req,res) => {
    var templateData = {
        'head.title': "Change Your Password"
    }
    helpers.miniTemp('changePassword', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/update-info', (req,res) => {
    var templateData = {
        'head.title': "Update your info"
    }
    helpers.miniTemp('updateInfo', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/delete-account', (req,res) => {
    var templateData = {
        'head.title': "Delete Account"
    }
    helpers.miniTemp('deleteAccount', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

router.get('/accountDeleted', (req,res) => {
    var templateData = {
        'head.title': "GOOD BYE"
    }
    helpers.miniTemp('accountDeleted', templateData, function(err, page) {
        if(!err && page && page.length > 0)
        {
            res.send(page);
        }
        else
        {
            res.status(404).send(err);
        }
    })
})

module.exports = router
