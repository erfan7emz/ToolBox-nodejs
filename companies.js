const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Company, validateCompany } = require('../models/company');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multer({storage: storage})

router.get('/', async (req, res) => {
    const companies = await Company.find();
    res.send(companies)
});

// add [auth, admin]
router.post('/', upload.single('logo'), async (req, res) => {
    const { error } = validateCompany(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let company = new Company({
        name: req.body.name,
        sector: req.body.sector,
        //review: review,
        description: req.body.description,
        website: req.body.website,
    });
    company = await company.save();
    res.send(company)
});

//[auth, admin]
router.put('/:id', upload.single('logo'),async (req, res) => {
    const { error } = validateCompany(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const company = await Company.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        sector: req.body.sector,
        //review: review,
        description: req.body.description,
        website: req.body.website
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

//[auth, admin]
router.delete('/:id', async (req, res) => {
    const company = await Company.findByIdAndRemove(req.params.id)
    if(!company) return res.status(404).send('The company was not found');
    res.send(company)
});


module.exports = router
