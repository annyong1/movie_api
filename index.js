  const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
    uuid = require('uuid');

app.use(bodyParser.json());

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

app.post('/users', (req,res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

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

// READ

app.get('/topMovies', (req, res) => {
    res.status(200).json(topMovies);
})

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

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });