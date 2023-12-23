//TMDB API USAGE AREA

const API_KEY = 'api_key=7c40afd8aecb90ec1633b859bf146961';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const genreURL = BASE_URL + '/genre/movie/list?' + API_KEY;

const main= document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

function getMovies(url){
  fetch(url).then(res => res.json()).then(data => {
    showMovies(data.results);
  })
}

function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
      const {title, poster_path, vote_average, overview, id} = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
           <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

          <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getColor(vote_average)}">${vote_average}</span>
          </div>

          <div class="overview">

              <h3>Overview</h3>
              ${overview}
              <br/> 
              <button class="know-more" id="${id}">Know More</button
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
  const searchTerm = search.value;

  if(searchTerm){
    getMovies(searchURL + '&query=' + searchTerm)
  } else {
    getMovies(API_URL);
  }
})