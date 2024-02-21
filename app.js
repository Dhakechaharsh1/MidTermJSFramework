var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var Contact = require('./models/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection setup
mongoose.connect('mongodb+srv://Harsh:Harsh1234@cluster0.90h16vu.mongodb.net/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the Mongoose schema and model for Student
const studentSchema = new mongoose.Schema({
    name: String,
    studentID: String,
    program: String
});
const Student = mongoose.model('Student', studentSchema);

// Routes
app.get('/', function(req, res, next) {
  res.render('home', { title: 'home' });
});

app.get('/student', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('student', { students: students });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

app.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});


app.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, studentID, program } = req.body;
  try {
      await Student.findByIdAndUpdate(id, { name, studentID, program });
      res.redirect('/student'); 
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
      // Assuming you have a Contact model defined
      await Contact.create({ name, email, message });
      res.send('Contact form submitted successfully!');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// Contact route
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Assuming you have a Contact model defined
    await Contact.create({ name, email, message });
    res.send('Contact form submitted successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
