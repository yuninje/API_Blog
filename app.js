const express = require('express'); 
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes')

const app = express();

app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(routes);
if(process.env.NODE_ENV !=='test'){
    app.use(morgan('dev'))
}
module.exports = app