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


app.use((req, res, next) => {
    res.statusCode = 404
    next(Error('not found'))
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(res.statusCode || 500)
    res.json({
        result: false,
        error: err.message || 'internal server error'
    })
})

module.exports = app