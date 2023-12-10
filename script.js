const apiKey = '7c40afd8aecb90ec1633b859bf146961';
const apiUrlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const apiUrlGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
const apiUrlUpcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;

function displayMovies(movies, containerId) {
  const movieContainer = document.getElementById(containerId);

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieTitle);
    movieContainer.appendChild(movieCard);
  });
}

fetch(apiUrlPopular)
  .then(response => response.json())
  .then(data => {
    displayMovies(data.results, 'featured');
  })
  .catch(error => console.error('Error fetching popular movies:', error));

fetch(apiUrlGenres)
  .then(response => response.json())
  .then(data => {
    // For demonstration purposes, we'll display the first 10 genres as movie cards
    displayMovies(data.genres.slice(0, 10), 'genres');
  })
  .catch(error => console.error('Error fetching genres:', error));

fetch(apiUrlUpcoming)
  .then(response => response.json())
  .then(data => {
    displayMovies(data.results, 'upcoming');
  })
  .catch(error => console.error('Error fetching upcoming movies:', error));