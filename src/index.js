const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.use('/user', userRouter);

app.get('/*', (req, res) => {
    res.send('404');
});

app.listen(port, () => {
    console.log('Server is up on port', port);
});