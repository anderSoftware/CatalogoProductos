const express = require('express');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/database');


const app = express();
const server = http.createServer(app);
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
  });
  
app.use(sessionMiddleware);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/', require('./routes/mainRoutes'));
app.use('/', require('./routes/authRoutes'));


app.get('/', (req, res) => {
    res.render('index');
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));