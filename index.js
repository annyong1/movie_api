const express = require('express');
const app = express();

let topMovies = [
    {
      title: 'Back to the Future',
      director: 'Robert Zemeckis'
    },
    {
      title: 'District 9',
      director: 'Neil Blomkamp'
    },
    {
      title: 'Mad Max: Fury Road',
      director: 'George Miller'
    },
    {
      title: 'Godfather',
      director: 'Francis Ford Coppola'
    },
    {
      title: 'Godfather 2',
      director: 'Francis Ford Coppola'
    },
    {
      title: 'The Third Man',
      director: 'Carol Reed'
    },
    {
      title: 'This is Spinal Tap',
      director: 'Rob Reiner'
    },
    {
      title: 'North by Northwest',
      director: 'Alfred Hitchcock'
    },
    {
      title: 'The Bridge on the River Kwai',
      director: 'David Lean'
    },
    {
      title: "Schindler's List",
      director: 'Steven Spielberg'
    }
  ];
  
  app.get('/', (req, res) => {
    res.send('Welcome to my movie listing!');
  });
  
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