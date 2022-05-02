const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config'); 
const authJwt = require('./helpers/jwt');
const erroHandler = require('./helpers/error-handler');
//cors
app.use(cors());
app.options('*', cors())


//Middlewares
// app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(erroHandler);




const api = process.env.API_URL;

const productsRouter = require('./routers/products');
const orderRouter = require('./routers/order');
const categoryRouter = require('./routers/category');
const usersRouter = require('./routers/user');
const res = require('express/lib/response');






app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, usersRouter);




mongoose.connect(process.env.CONNECTION_STRING)
.then(() =>{
    console.log('**Mongo DB Connection establish Successfully**')
})
.catch((err)=>{
    console.log('There was an err'+ err);
})


app.listen(3000, ()=>{ 
    
    console.log('Server is running http://localhost:3000'); 

})

