const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const path = require('path');
const weatherRoutes = require('./src/routes/weatherRoutes');

// Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
