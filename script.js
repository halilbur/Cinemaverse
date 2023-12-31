//TMDB API USAGE AREA
const API_KEY = 'api_key=7c40afd8aecb90ec1633b859bf146961';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY + '&language=en-US';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const searchURL = BASE_URL + '/search/movie?' + API_KEY + '&language=en-US';
const genreURL = BASE_URL + '/genre/movie/list?' + API_KEY + '&language=en-US';

const trendURL = BASE_URL + '/trending/movie/week?' + API_KEY + '&language=en-US';
const upcomingURL = BASE_URL + '/movie/upcoming?' + API_KEY + '&language=en-US';
const nowplayingURL = BASE_URL + '/movie/now_playing?' + API_KEY + '&language=en-US';

const main= document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const language = '&language=en-US';

getMoviesByCategory('Trending', trendURL, 5);
getMoviesByCategory('Upcoming', upcomingURL, 5);
getMoviesByCategory('NowPlaying', nowplayingURL, 5);
getGenres(genreURL);

function getMoviesByCategory(category, url, n) {
  fetch(url).then(res => res.json()).then(data => {
    displayMovies(category, data.results, n);
  });
}
function getGenres(genreURL){
  fetch(genreURL)
  .then(res => res.json())
  .then(data => {
    const genres = data.genres;
    const genreSelect = document.getElementById('genreSelect'); // Assuming you have a select element with id 'genreSelect'
    
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  });
}
function getMoviesByPopularity(url){
  fetch(url).then(res => res.json()).then(data => {
    // Sort movies by popularity in descending order
    data.results.sort((a, b) => b.popularity - a.popularity);
    showMovies(data.results);
  })
}

function getMoviesByVoteAverage(url, n){
  fetch(url).then(res => res.json()).then(data => {
    // Sort movies by vote average in descending order
    data.results.sort((a, b) => b.vote_average - a.vote_average);
    displayMovies_withoutcategory(data.results, n);
  })
}
function displayMovies_withoutcategory(movies, n) {
  main.innerHTML = '';
  // Use slice to get only the first 'n' movies
  const moviesToShow = movies.slice(0, n);
  moviesToShow.forEach(movie => {
    const { poster_path, title, vote_average, overview, id } = movie;
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : "https://fakeimg.pl/1080x1580?text=Movie+Poster"}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;
    main.appendChild(movieElement);
  });
}

function displayMovies(category, movies, n) {
  const main = document.getElementById('main');
 
  // Create and append the h2 header
  const header = document.createElement('h2');
  header.textContent = category + ' Movies';
  main.appendChild(header);
  
  // Create and append the section
  const section = document.createElement('section');
  section.id = category.toLowerCase();
  main.appendChild(section);
  
  // Use slice to get only the first 'n' movies
  const moviesToShow = movies.slice(0, n);
  moviesToShow.forEach(movie => {
    const { poster_path, title, vote_average, overview, id } = movie;
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : "https://fakeimg.pl/1080x1580?text=Movie+Poster"}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
        
        
      </div>
    `;
    section.appendChild(movieElement);
  });
}

function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
      const {title, poster_path, vote_average, overview, id} = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
           <img src="${poster_path? IMG_URL+poster_path: "https://fakeimg.pl/1080x1580?text=Movie+Poster" }" alt="${title}">

          <div class="movie-info">
              <h3>${title ? title : "Title not available"}</h3>
              <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
          </div>

          <div class="overview">

              <h3>Overview</h3>
              ${overview ? overview : "Overview not available"}
           
             
          </div>
      
      `

      main.appendChild(movieEl);

      document.getElementById(id).addEventListener('click', () => {
        console.log(id)
        openNav(movie)
      })
  })
}

function getColor(vote){
  if(vote>=8){
    return 'green'
  } else if(vote>= 5){
    return 'orange'
  } else {
    return 'red'
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();

  if (searchTerm) {
    main.innerHTML = '';
    getMoviesByVoteAverage(searchURL + '&query=' + searchTerm, 10);
  } else {
    main.innerHTML = ''; // Clear the main content area
    getMoviesByCategory('Trending', trendURL, 10);
    getMoviesByCategory('Upcoming', upcomingURL, 10);
    getMoviesByCategory('NowPlaying', nowplayingURL, 10);
  }
});
document.getElementById('genreSelect').addEventListener('change', function() {
  const genreId = this.value;
  const url = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${genreId}`;
  getMoviesByVoteAverage(url, 20);
});