const express = require('express');
const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
uuid = require('uuid');

const { check, validationResult } = require('express-validator');

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
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

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://127.0.0.1:27017/DuncanDB');

mongoose.connect('mongodb+srv://jduncan:Guesswho1!@duncandb.c8hefkw.mongodb.net/duncandb?retryWrites=true&w=majority')

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

let users = [ 
   {
     id: 1,
     name: "Michael Scott",
     favoriteMovies: []  //["Threat Level Midnight"]
   },
   {
     id: 2,
     name: "Jim Halpert",
     favoriteMovies: ["Office Space"]
   },
]

let topMovies = [
    {
      title: 'Back to the Future',
      director: 'Robert Zemeckis',
      genre: {
        name:'Comedy'
      }
    },
    {
      title: 'District 9',
      director: 'Neil Blomkamp',
      genre: {
        name:'Sci-Fi'
      }
    },
    {
      title: 'Mad Max: Fury Road',
      director: 'George Miller',
      genre: {
        name:'Sci=Fi'
      }
    },
    {
      _id: '5c3bd189515a081b363cb7e4',
      title: 'Godfather',
      director: 'Francis Ford Coppola',
      genre: {
        name:'Drama'
      }
    },
    {
      title: 'Godfather 2',
      director: {
        name: 'Francis Ford Coppola'
      },
      genre: {
        name:'Drama'
      }
    },
    {
      title: 'The Third Man',
      director: {
        name: 'Carol Reed'
      },
      genre: {
        name:'Drama'
      }
    },
    {
      title: 'This is Spinal Tap',
      director: {
        name: 'Rob Reiner'
      },
      genre: {
        name:'Comedy'
      }
    },
    {
      title: 'North by Northwest',
      director: {
        name: 'Alfred Hitchcock'
      },
      genre: {
        name:'Action'
      }
    },
    {
      title: 'The Bridge on the River Kwai',
      director: {
        name: 'David Lean'
      },
      genre: {
        name:'Action'
      }
    },
    {
      title: "Schindler's List",
      director: {
        name: 'Steven Spielberg'
      },
      genre: {
        name:'Drama'
      }
    }
  ];

//CREATE

app.post('/users',
  [
    check('Username', 'Username is required.').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ], async (req,res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); 
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
       return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) 
})
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

//UPDATE

app.put('/users/:id', (req,res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );
  
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
    } else {
      res.status(400).send('no such user')
    }
})

//POST/UPDATE


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

app.delete('/users/:id/:movieTitle', (req,res) => {
  const { id, movieTitle } = req.params;
  
let user = users.find( user => user.id == id );
  
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
      res.status(400).send('no such user')                                                                                               
    }
})  

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
    res.status(500).send('Error: ' + error);
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

//Get all users - mongoose

app.get('/users', async (req, res) => {
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

app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
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
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
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

// app.get('/topMovies', (req, res) => {
//     res.status(200).json(topMovies);
// })

//READ or GET W/ JWT AUTHENTICATION

app.get('/topMovies', passport.authenticate('jwt', {session: false }), async (req, res) => {
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

app.get('/topMovies/:title', (req, res) => {
  const {title} = req.params;
  const movie = topMovies.find( movie => movie.title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }

})

//READ

app.get('/topMovies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = topMovies.find( movie => movie.genre.name === genreName ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }

})

//READ

app.get('/topMovies/director/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = topMovies.find( movie => movie.director.name === directorName ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }

})

  //   res.send('Welcome to my movie listing!');
  // });
  
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});
  
//   app.get('/movies', (req, res) => {
//     res.json(topMovies);
//   });
  
app.use(express.static("public"));
  
  // listen for requests
  
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});