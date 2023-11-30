const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Yjg1ZDM4ZmJjY2ZjZmExYTJkNDVkODdkYzUxZGQ0OSIsInN1YiI6IjY1NTVkY2MxNTM4NjZlMDBlMjkzMWQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ob5d2duWLBvtJQDwv_zRZfKOO3CtBartErco3uu1Kf0'
  }
};

fetch(`https://api.themoviedb.org/3/movie/1022796?language=en-US`, options)  //pictures in header
  .then(response => response.json())
  .then(movieData => {
    const secondtrendingmovie=document.querySelector('.second-trending-movie') 
    secondtrendingmovie.style.backgroundImage=`url('https://image.tmdb.org/t/p/w500${movieData.poster_path}')`
fetch(`https://api.themoviedb.org/3/movie/569094?language=en-US`, options)  //pictures in header
  .then(response => response.json())
  .then(movieData => {
    const firsttrendingmovie=document.querySelector('.first-trending-movie') 
    firsttrendingmovie.style.backgroundImage=`url('https://image.tmdb.org/t/p/w500${movieData.poster_path}')`
})
})





        
        // fetch('https://api.themoviedb.org/3/movie/800158/videos?language=en-US', options)
        //   .then(response => response.json())
        //   .then(response => {
        //     const videoKey = response.results[0].key
        //     const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoKey}"></iframe>`

        //     document.getElementById('video-container').innerHTML = embedCode
        //   })


        





document.addEventListener('DOMContentLoaded', function () {
  const blocks = document.querySelector('.header-top-rated');
  const moviesLimit = 6;
  const tvShowsLimit = 6;

  if (blocks) {
    fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
      .then(response => response.json())
      .then(data => {
        data.results.slice(0, moviesLimit).forEach(element => {
          const movieBlock = createMovieBlock(element)
          blocks.append(movieBlock)
        })

        fetchTVBlocks()
      })
  }

  function fetchTVBlocks() {
    fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options)
      .then(response => response.json())
      .then(data => {
        data.results.slice(0, tvShowsLimit).forEach(element => {
          const movieBlock = createMovieBlock(element)
          blocks.append(movieBlock)
        })
    })
  }


  
});




function createMovieBlock(element) {
  console.log(element)
  const mainMovie = document.createElement('div')
  const movieBlock = document.createElement('div')
  const movieTitleBlock = document.createElement('div')
  let realGenre

  const posterUrl = `https://image.tmdb.org/t/p/w500${element.poster_path}`
  const genreId = element.genre_ids[0]

  fetch(`https://api.themoviedb.org/3/genre/${element.media_type}/list?language=en`, options)
    .then(response => response.json())
    .then(data => {
      const genre = data.genres.find(genre => genre.id === genreId);

      if (genre) {
        realGenre = genre.name;
        movieTitleBlock.innerHTML = `
          <p class="title">${element.title || element.name}</p>
          <div class="title-content">
            <div>
              <p class="genre">${realGenre}</p>
              <span class="fa-solid fa-star fa-xs" style="color: #f86eb6;"></span><span class="rating"> ${element.vote_average}</span>
            </div>
            <a class="cart-icon"><i class="fa-solid fa-cart-shopping" style="color: #f86eb6;"></i></a>
          </div>
        `;
      }
    })

  movieBlock.style.backgroundImage = `url('${posterUrl}')`

  movieBlock.classList.add('movieBlock')
  movieTitleBlock.classList.add('movieTitleBlock')
  mainMovie.classList.add('mainMovie')

  mainMovie.append(movieBlock)
  mainMovie.append(movieTitleBlock)
  mainMovie.dataset.id = element.id
  mainMovie.dataset.type = element.media_type
  mainMovie.dataset.genreId = element.genre_ids[0]
  mainMovie.dataset.rating = element.vote_average

  if (mainMovie.dataset.type === 'tv') {
    mainMovie.dataset.releaseDate = element.first_air_date
    mainMovie.dataset.title = element.name

  } else {
    mainMovie.dataset.releaseDate = element.release_date
    mainMovie.dataset.title = element.title
  }
  
  return mainMovie
}