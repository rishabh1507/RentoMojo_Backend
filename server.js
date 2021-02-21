const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uri = 'mongodb+srv://rishabh100:rishabh100@cluster0.aiswa.mongodb.net/rent_mojo?retryWrites=true&w=majority'
const Router = require('./routes/rent_mojo');
require('dotenv').config();

const swaggerDocument = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 8081;
app.use(bodyParser.json());
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection successful");
})
app.use('/phonebook',Router);
app.get('/',(req, res)=>{
    res.send('Rent Mojo Test');
});

app.listen(port, () => {
    console.log(`server running on ${port}`);
});