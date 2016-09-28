const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

// ------------------------------------------------------------
// express

const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const IGNORE_HEADERS = [
  'host', 'user-agent', 'connection', 'content-length', 'user-agent', 'origin',
  'accept', 'referer', 'accept-encoding', 'accept-language'
];

['get', 'put', 'post', 'delete'].forEach(k => app[k](
  '/api/*',
  (req, res) => {
    const query = querystring.stringify(req.query);
    const path = req.params['0'] + (query ? '?' + query : '');
    const headers = _.omit(req.headers, IGNORE_HEADERS);
    fetch(path, {method: req.method, headers: headers})
      .then(x => x.json())
      .then(json => res.status(200).send(json))
      .catch(err => res.status(500).send(err))
    ;
  }
));

app.get('/', (req, res) => {
  res.status(200)
    .send(
      `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica Neue';
              }
              * {
                box-sizing: border-box;
              }
              h1 {
                color: blue;
              }
            </style>
          </head>
          <body>
            <h1>Ping Stepan to see what this does : )</h1>
          </body>
        </html>
      `
    );
})

app.listen(5000);
