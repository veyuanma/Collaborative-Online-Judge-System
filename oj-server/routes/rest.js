const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

//const EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

//add executor nginx proxy
const EXECUTOR_SERVER_URL = 'http://executor/build_and_run';

//register remote method
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

const problemService = require('../services/problemService');

//GET /api/v1/problems
router.get('/problems', function (req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

//GET /api/v1/problems:id
router.get('/problems/:id', function (req, res) {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

//POST /api/v1/problems
router.post('/problems', jsonParser, function (req, res) {
    problemService.addProblem(req.body)
        .then(function(problem){
            res.json(problem);
        }, function (err) {
            res.status(400).send('problem name already exists');
        });
});


//build and run
router.post('/build_and_run', jsonParser, function (req, res) {
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;
    console.log(lang + ' ' + userCodes);
    //res.json({'text':'hello from nodejs'});

    restClient.methods.build_and_run(
        {
            data: {
                code: userCodes,
                lang: lang
            },
            headers: {
                'Content-Type': 'application/json'
            }
        },
        (data, response) => {
            console.log('received response from executor service..');
            const text = `Build output: ${data['build']}     Run output: ${data['run']}`;
            console.log('text is ...', text);
            data['text'] = text;
            res.json(data);
        }
    )
    
});

module.exports = router;