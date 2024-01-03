const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const API_KEY = 'c93137e5c16bc23ca7873742bfe7e2cd';

app.use(express.json());
const corsOptions = {
  origin: 'https://frontend-muvd.vercel.app/', // Troque para a URL do seu frontend
  credentials: true, // Permite o envio de cookies
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Backend muvd');
});

app.post('/api/moviesearch', async (req, res) => {
  const { query } = req.body;

  async function consultAPI(API_KEY, query) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=1`);
      const movies = response.data.results; 

      const resultado = await Promise.all(
        movies.map(async (movie) => {
          
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          const videos = videoResponse.data.results;

          async function getMovieDetails(API_KEY, movieId) {
            try {
              const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              const movieDetails = response.data;
          
              
              const averageRating = movieDetails.vote_average.toFixed(1);
          
              return averageRating;
            } catch (error) {
              throw error;
            }
          }
          const averageRating = await getMovieDetails(API_KEY, movie.id);

          
          const trailers = videos.filter((video) => video.type === 'Trailer');

          
          trailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

          
          const latestTrailerKey = trailers.length > 0 ? trailers[0].key : null;

          return {
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            latestTrailerKey,
            averageRating,
          };
        })
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }

  try {
    const resultado = await consultAPI(API_KEY, query);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});

app.post('/api/popularmovies', async (req, res) => {
  const { page } = req.body;
  console.log(page);
  async function consultAPI(API_KEY, page) {
    try {                               
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`);
      const movies = response.data.results; 

      const resultado = await Promise.all(
        movies.map(async (movie) => {
         
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          const videos = videoResponse.data.results;

          async function getMovieDetails(API_KEY, movieId) {
            try {
              const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              const movieDetails = response.data;
          
           
              const averageRating = movieDetails.vote_average.toFixed(1);
          
              return averageRating;
            } catch (error) {
              throw error;
            }
          }
          const averageRating = await getMovieDetails(API_KEY, movie.id);


          
          const trailers = videos.filter((video) => video.type === 'Trailer');

          
          trailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

          
          const latestTrailerKey = trailers.length > 0 ? trailers[0].key : null;

          return {
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            latestTrailerKey,
            averageRating,
          };
        })
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }

  try {
    const resultado = await consultAPI(API_KEY, page);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});

app.post('/api/topratedmovies', async (req, res) => {
  const { page } = req.body;
  console.log(page);
  async function consultAPI(API_KEY, page) {
    try {                               
      const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`);
      const movies = response.data.results; 

      const resultado = await Promise.all(
        movies.map(async (movie) => {
          
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          const videos = videoResponse.data.results;

          async function getMovieDetails(API_KEY, movieId) {
            try {
              const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              const movieDetails = response.data;
          
             
              const averageRating = movieDetails.vote_average.toFixed(1);
          
              return averageRating;
            } catch (error) {
              throw error;
            }
          }
          const averageRating = await getMovieDetails(API_KEY, movie.id);

         
          const trailers = videos.filter((video) => video.type === 'Trailer');

          
          trailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

          
          const latestTrailerKey = trailers.length > 0 ? trailers[0].key : null;

          return {
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            latestTrailerKey,
            averageRating,
          };
        })
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }
  try {
    const resultado = await consultAPI(API_KEY, page);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});

app.post('/api/moviecategory', async (req, res) => {
  const { page } = req.body;
  console.log(page);
  const { query } = req.body;

  async function consultAPI(API_KEY, query, page) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${query}&page=${page}`);
      const movies = response.data.results; 

      const resultado = await Promise.all(
        movies.map(async (movie) => {
          
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          const videos = videoResponse.data.results;

          async function getMovieDetails(API_KEY, movieId) {
            try {
              const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              const movieDetails = response.data;
          
             
              const averageRating = movieDetails.vote_average.toFixed(1);
          
              return averageRating;
            } catch (error) {
              throw error;
            }
          }
          const averageRating = await getMovieDetails(API_KEY, movie.id);

          
          const trailers = videos.filter((video) => video.type === 'Trailer');

          
          trailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

         
          const latestTrailerKey = trailers.length > 0 ? trailers[0].key : null;

          return {
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            latestTrailerKey,
            averageRating,
          };
        })
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }

  try {
    const resultado = await consultAPI(API_KEY, query, page);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});

app.post('/api/moremoviecategory', async (req, res) => {
  const { page } = req.body;
  const { query } = req.body;

  console.log(page);
  async function consultAPI(API_KEY, query, page) {
    try {                               
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${query}&page=${page}`);
      const movies = response.data.results; 

      const resultado = await Promise.all(
        movies.map(async (movie) => {
         
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          const videos = videoResponse.data.results;

          async function getMovieDetails(API_KEY, movieId) {
            try {
              const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              const movieDetails = response.data;
          
              
              const averageRating = movieDetails.vote_average.toFixed(1);
          
              return averageRating;
            } catch (error) {
              throw error;
            }
          }
          const averageRating = await getMovieDetails(API_KEY, movie.id);

         
          const trailers = videos.filter((video) => video.type === 'Trailer');

         
          trailers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

          
          const latestTrailerKey = trailers.length > 0 ? trailers[0].key : null;

          return {
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            latestTrailerKey,
            averageRating,
          };
        })
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }
  try {
    const resultado = await consultAPI(API_KEY, query, page);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});
app.listen(PORT, () => {
  console.log(`O servidor está ouvindo na porta ${PORT}`);
});
