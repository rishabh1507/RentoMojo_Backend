const router = require('express').Router();
const phonebook = require('../models/phonebook');


router.route('/').get(paginatedResults(phonebook),(req, res) => {
    res.json(res.paginatedResults)
});

function paginatedResults(model) {
    return async (req,res,next) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const startIndex = (page - 1)*limit
        const endIndex = page*limit
        const results = {}

        if(endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

router.route('/').post(async (req, res) => {
    try {
        const email = req.body.email;

        const duplicate = await phonebook.findOne({ email:email });
        if (duplicate) {
            res.status(409).send('Duplicate Contact');
        }
        else {
            const Phonebook = new phonebook({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            });
            Phonebook.save()
                .then((data) => res.json(data))
                .catch(err => res.status(400).json('Error:' + err));
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

router.route('/:email').patch(async (req, res) => {
    try {
        const phone = await phonebook.findOne({ email: req.params.email })
        if (!phone) {
            res.status(404).send('Contact Not Exist');
        }
        else {
            phone.name = req.body.name;
            phone.phone = req.body.phone;
            const phone_num = await phone.save();
            res.json(phone_num);
            res.status(204).send('Contact Updated');
        }

    }
    catch (err) {
        res.status(404).send('404 Error');
    }
});

router.route('/:email').delete(async (req, res) => {
    try {
        const phone = await phonebook.findOne({ email:req.params.email })
        const delete_phone = await phone.delete()
        res.json(delete_phone);
    }
    catch (err) {
        res.send('Error in deleting');
    }
})

// search a contact
router.route('/:email').get((req, res) => {
    phonebook.findOne({ email: req.params.email })
        .then(phone => res.json(phone))
        .catch(err => res.status(404).json('404 Error:'));
}); 

module.exports = router;