const express = require('express');
const moviesController = require('../controllers/movies');
const { body } = require('express-validator');
const isAuthMiddleWare = require('../middlewares/isAuth');

const router = express.Router();

router.get('/', isAuthMiddleWare, moviesController.getMovies);

router.get('/watched', isAuthMiddleWare, moviesController.getWatchedMovies);

router.get('/toBeWatched', isAuthMiddleWare, moviesController.getToBeWatchedMovies);

router.get('/:movieId', isAuthMiddleWare, moviesController.getMovie);

router.post('/add-movie', isAuthMiddleWare, moviesController.addMovie);

router.patch('/addToWatchedList/:movieId', isAuthMiddleWare, moviesController.addToWatchedList);

router.patch('/edit-movie/:movieId', isAuthMiddleWare, moviesController.editMovie);

router.delete('/:movieId', isAuthMiddleWare, moviesController.deleteMovie);

module.exports = router;