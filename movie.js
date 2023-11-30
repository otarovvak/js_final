
document.addEventListener('DOMContentLoaded', function () {
const mainMovies = document.querySelectorAll('.mainMovie')
const blocksOfMovies = document.querySelector('.explore-blocks') 
if (isUserLoggedIn()) {
  const loggedInUser = JSON.parse(localStorage.getItem('logged-in'))
  const loginElement = document.querySelector('.Login')
  loginElement.innerHTML = `Hi, ${loggedInUser.username}`;
}

const options2 = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Yjg1ZDM4ZmJjY2ZjZmExYTJkNDVkODdkYzUxZGQ0OSIsInN1YiI6IjY1NTVkY2MxNTM4NjZlMDBlMjkzMWQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ob5d2duWLBvtJQDwv_zRZfKOO3CtBartErco3uu1Kf0'
    }
};



const promiseBlocks = [
  fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options2)
    .then(response => response.json())
    .then(data => {
      const blocksOfMovies = document.querySelector('.explore-blocks')
      data.results.forEach(element => {
        const movieBlock = createMovieBlock(element)
        blocksOfMovies.append(movieBlock)
      })
    }),

  fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options2)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(element => {
        const movieBlock = createMovieBlock(element)
        blocksOfMovies.append(movieBlock)
      });
    })
];

Promise.all(promiseBlocks)
  .then(() => {
    const movieBlocks = document.querySelectorAll('.mainMovie')

    // search
    function search() {
      const input = document.getElementById('searchInput').value.toLowerCase()
      movieBlocks.forEach((movieBlock) => {
        const movieTitle = movieBlock.querySelector('.title').textContent.toLowerCase()

        if (movieTitle.includes(input)) {
          movieBlock.style.display = 'block';
        } else {
          movieBlock.style.display = 'none';
        }
      })
    }

    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('input', search)

    // Genres choose filter
    const genresChoose = document.querySelectorAll('.genre-filter li')

    genresChoose.forEach((element) => {
      element.addEventListener('click', () => {
        const selectedGenreId = element.dataset.value

        movieBlocks.forEach((genreByBlock) => {
          const blockGenreId = genreByBlock.dataset.genreId

          if (blockGenreId !== selectedGenreId) {
            genreByBlock.classList.add('hidden');
          } else {
            genreByBlock.classList.remove('hidden');
          }
        })
      })
    })

    const showAll = document.querySelector('.showAll')
    showAll.addEventListener('click', () => {
      movieBlocks.forEach(e => {
        e.classList.remove('hidden')
      });
    });

    // Select filtering options
      console.log(movieBlocks)
      const select = document.querySelector('#select-filter')
    
      select.addEventListener('change', () => {
        const selectOption = select.value
        console.log(selectOption)
    
        switch (selectOption) {
          case 'popularity':
            showAllMovies();
            break;
          case 'release-descending':
            sortAndDisplayByReleaseDate('desc');
            break;
          case 'release-ascending':
            sortAndDisplayByReleaseDate('asc');
            break;
          case 'rating-descending':
            sortAndDisplayByRating('desc');
            break;
          case 'rating-ascending':
            sortAndDisplayByRating('asc');
            break;
          case 'title-AZ':
            sortAndDisplayByTitle('asc');
            break;
          case 'title-ZA':
            sortAndDisplayByTitle('desc');
            break;
          default:
            break;
        }
      });
    
      function showAllMovies() {
        movieBlocks.forEach((movieBlock) => {
          movieBlock.classList.remove('hidden')
        })
      }
    
      function sortAndDisplayByReleaseDate(order) {
        const sortedArray = Array.from(movieBlocks).sort((a, b) => {
          const dateA = new Date(a.dataset.releaseDate)
          const dateB = new Date(b.dataset.releaseDate)
          return order === 'asc' ? dateA - dateB : dateB - dateA
        })
    
        displaySortedMovieBlocks(sortedArray)
      }
    
      function sortAndDisplayByRating(order) {
        const sortedArray = Array.from(movieBlocks).sort((a, b) => {
          const ratingA = parseFloat(a.dataset.rating)
          const ratingB = parseFloat(b.dataset.rating)
          return order === 'asc' ? ratingA - ratingB : ratingB - ratingA
        })
    
        displaySortedMovieBlocks(sortedArray)
      }
    
      function sortAndDisplayByTitle(order) {
        const sortedArray = Array.from(movieBlocks).sort((a, b) => {
          const titleA = a.dataset.title.toLowerCase()
          const titleB = b.dataset.title.toLowerCase()
          return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        });
    
        displaySortedMovieBlocks(sortedArray)
      }
    
    

  })
    

    

function createMovieBlock(element) {
  console.log(element)
  const mainMovie = document.createElement('div')
  const movieBlock = document.createElement('div')
  const movieTitleBlock = document.createElement('div')
  let realGenre

  const posterUrl = `https://image.tmdb.org/t/p/w500${element.poster_path}`
  const genreId = element.genre_ids[0]

  fetch(`https://api.themoviedb.org/3/genre/${element.media_type}/list?language=en`, options2)
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
function displaySortedMovieBlocks(sortedArray) {
  const exploreBlocks = document.querySelector('.explore-blocks')
  while (exploreBlocks.firstChild) {
      exploreBlocks.removeChild(exploreBlocks.firstChild)
  }

  sortedArray.forEach((sortedMovieBlock) => {
      exploreBlocks.appendChild(sortedMovieBlock)
  })
}

// Filter accordion
const filterBtn = document.querySelector('.btn-acd')
const filterContent = document.querySelector('.filter')

if (filterBtn) {
  filterBtn.addEventListener('click', function () {
    filterContent.classList.toggle('show')
  });
}



})
