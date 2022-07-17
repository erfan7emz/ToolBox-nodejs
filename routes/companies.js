const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Company, validateCompany } = require('../models/company');
const router = express.Router();


router.get('/', async (req, res) => {
    const companies = await Company.find();
    res.send(companies)
});

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateCompany(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let company = new Company({
        name: req.body.name,
        sector: req.body.sector,
        //review: review,
        description: req.body.description,
    });
    company = await company.save();
    res.send(company)
});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateCompany(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const company = await Company.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        sector: req.body.sector,
        //review: review,
        description: req.body.description
    },{
        new: true
    })

    if(!company) return res.status(404).send('The company was not found');

    res.send(company)
});


router.get('/:id', async (req, res) => {
    const company = await Company.findById(req.params.id)
    if(!company) return res.status(404).send('The company was not found');
    res.send(company);
});


router.delete('/:id', [auth, admin], async (req, res) => {
    const company = await Company.findByIdAndRemove(req.params.id)
    if(!company) return res.status(404).send('The company was not found');
    res.send(company)
});


module.exports = router
