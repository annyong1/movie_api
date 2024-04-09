require('dotenv').config();

const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models');

const express = require('express');
const app = express();

 
let auth = require('./auth')(app);

const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: true }));
uuid = require('uuid');

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());


const Movies = Models.Movie;
const Users = Models.User;


//const dbUrl = process.env.CONNECTION_URI;
const port = process.env.PORT || 8080;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//require('dotenv').config();

//const uri = process.env.CONNECTION_URI;

//const connectionString = 'mongodb+srv://jduncan:guesswho@duncandb.c8hefkw.mongodb.net/?retryWrites=true&w=majority&appName=DuncanDB';


let allowedOrigins = [];
  
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//mongoose.connect('mongodb://127.0.0.1:27017/DuncanDB');



//CREATE

app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()
});
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
           .create({
             Username: req.body.Username,
             Password: hashedPassword,
             Email: req.body.Email,
             Birthday: req.body.Birthday
           })
           .then((user) => {res.status(201).json(user) })
           .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// //UPDATE

// app.put('/users/:id', (req,res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find( user => user.id == id );
  
//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//     } else {
//       res.status(400).send('no such user')
//     }
// })

//CREATE

app.post('/users/:id/:movieTitle', (req,res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id );
  
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
    } else {
      res.status(400).send('no such user')                                                                                               
    }
})  

//DELETE

// app.delete('/users/:id/:movieTitle', (req,res) => {
//   const { id, movieTitle } = req.params;
  
// let user = users.find( user => user.id == id );
  
//   if (user) {
//     user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//     res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
//     } else {
//       res.status(400).send('no such user')                                                                                               
//     }
// })  

app.delete('/users/:id/:movieID', (req, res) => {
  const { id, movieID } = req.params;

  // Find the user by ID and update the favoriteMovies array
  User.findByIdAndUpdate(id, { $pull: { favoriteMovies: movieID } }, { new: true }, (err, user) => {
    if (err) {
      // Handle database errors
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (!user) {
      // If user not found, send a 404 response
      res.status(404).send('User not found');
    } else {
      // Successfully removed the movie from the user's favoriteMovies array
      res.status(200).send(`${movieID} has been removed from user ${id}'s array`);
    }
  });
});

//Delete user - mongoose

app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//DELETE

app.delete('/users/:id', (req,res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id );
  
  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
    } else {
      res.status(400).send('no such user')                                                                                               
    }
})  

app.get('/', (req, res) => {
  res.send('Hello, world!'); // Send a response to the client
});

//Get all users - mongooser

app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username - mongoose

app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//Update user by username - mongoose

// app.put('/users/:Username', async (req, res) => {
//   await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
//     {
//       Username: req.body.Username,
//       Password: req.body.Password,
//       Email: req.body.Email,
//       Birthday: req.body.Birthday
//     }
//   },
//   { new: true })
//   .then((updatedUser) => {
//     res.json(updatedUser); 
//   })
//   .catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   })
// });

app.post('/users/:Username/movies/:MovieID', async (req,res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//JWT CONDITION ADDED

app.put('/users/:Username', passport.authenticate('jwt', {
session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error: ' + err);
    })
});

//Update list of favorite movies for a user - mongoose

app.post('/users/:Username/movies/:movieTitle', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.movieTitle }
  },
  { new: true})
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ


//READ or GET W/ JWT AUTHENTICATION

app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//READ

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        if (!movie) {
          return res.status(404).send('Error: ' + req.params.Title + ' was not found');
        }
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    }
);

//READ

app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  const genreName = req.params.genreName;

  console.log("Genre requested:", req.params.genreName);
  
  Movies.findOne({ "Genre.Name": genreName })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('Error: ' + genreName + ' was not found');
      }
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  }
);

//READ

app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  const directorName = req.params.directorName;

   console.log("Director requested:", req.params.directorName);
  
  Movies.findOne({ "Director.Name": directorName })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('Error: ' + directorName + ' was not found');
      }
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  }
);

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});
  
app.use(express.static("public"));
  
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});