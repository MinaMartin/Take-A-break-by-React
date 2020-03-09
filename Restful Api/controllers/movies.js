const Movie = require('../models/movie');

exports.getMovies = (req, res, next) => {
    let moviesPerPage = 0;
    let pageNumber = 1;
    const searchObject = {};
    const nameSearchValue = req.query.name ? req.query.name : '';
    const genreSearchValue = req.query.genre ? searchObject.genre = req.query.genre : '';
    const releaseYearSearchValue = req.query.releaseYear ? searchObject.releaseYear = +req.query.releaseYear : NaN;

    if (req.query.page) {
        pageNumber = +req.query.page;
        moviesPerPage = 3;
    }
    //Mentioning query parameter page = (Number) in the get request will trigger the pagination 
    //but all movies are returned by default 
    console.log(searchObject);
    if (nameSearchValue || genreSearchValue || releaseYearSearchValue) {
        //http://localhost:8080/movies?name=fr&page=1 will give us movies containg Fr (search by name)
        //adding options = i means a case insensitive search 
        //by default it is case sensitive 
        //http://localhost:8080/movies?releaseYear=2010  --> search by release Year
        //http://localhost:8080/movies?genre=Horror --> search by genre
        //pagination is always set on search case
        Movie.find({
            name: { "$regex": nameSearchValue, "$options": "i" },
            ...searchObject
        })
            .skip(3 * (pageNumber - 1))
            .limit(3)
            .then(movies => {
                //console.log(movies);
                res.status(201).json({ message: "Matched movies", movies: movies })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        Movie.find()
            .skip(moviesPerPage * (pageNumber - 1))
            .limit(moviesPerPage)
            .then(movies => {
                //console.log(movies);
                res.status(201).json({ message: "All the movies", movies: movies })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }
}

exports.getMovie = (req, res, next) => {
    const movieId = req.params.movieId;
    Movie.findById(movieId)
        .then(movie => {
            //console.log(movies);
            res.status(201).json({ message: "The movie You requested", movie: movie })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.addMovie = (req, res, next) => {
    const name = req.body.name;
    const genre = req.body.genre;
    const releaseYear = req.body.releaseYear;
    let yearYouWatchedIn, watchedOrNot = false;
    if (req.body.yearYouWatchedIn) {
        yearYouWatchedIn = req.body.yearYouWatchedIn;
    }
    if (req.body.watchedOrNot) {
        watchedOrNot = true;
    }
    //note that movies are unwatched by default and year of watch by default is 0
    //if req body contain year of watch or watched = true that will update the default ofcourse
    const movie = new Movie({
        name: name,
        genre: genre,
        releaseYear: releaseYear,
        watchedOrNot: watchedOrNot,
        yearYouWatchedIn: yearYouWatchedIn
    })

    movie.save()
        .then(response => {
            console.log(response);
            res.status(200).json({
                message: "Movie Created Successfully ",
                createdMovie: movie
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.editMovie = (req, res, next) => {
    const movieId = req.params.movieId;
    let updatedwatchedOrNot = false, updatedYearYouWatchedIn = 0;
    if (req.body.yearYouWatchedIn) {
        updatedYearYouWatchedIn = req.body.yearYouWatchedIn;
    }
    if (req.body.yearYouWatchedIn) {
        yearYouWatchedIn = req.body.yearYouWatchedIn;
    }
    const updatedName = req.body.name;
    const updatedGenre = req.body.genre;
    const updatedReleaseYear = req.body.releaseYear;

    Movie.updateOne({ _id: movieId }, {
        $set: {
            name: updatedName,
            genre: updatedGenre,
            releaseYear: updatedReleaseYear,
            watchedOrNot: updatedwatchedOrNot,
            yearYouWatchedIn: updatedYearYouWatchedIn
        }
    })
        .then(response => {
            console.log(response);
            res.status(200).json({
                message: "Movie Updated Successfully "
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteMovie = (req, res, next) => {
    const movieId = req.params.movieId;

    Movie.deleteOne({ _id: movieId })
        .then(response => {
            console.log(response);
            res.status(200).json({
                message: "Movie Deleted Successfully"
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/**************************************************** */
exports.orderMovies = (req, res, next) => {
    Movie.find().sort()
}

exports.getWatchedMovies = (req, res, next) => {
    let moviesPerPage = 3;
    let pageNumber = 1;
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    //http://localhost:8080/movies/watched
    //http://localhost:8080/movies/watched?page=1 same result as the above end point
    //http://localhost:8080/movies/watched?page=2 --> page = 2
    Movie.find({ watchedOrNot: true })
        .skip((pageNumber - 1) * moviesPerPage)
        .limit(moviesPerPage)
        .then(movies => {
            res.status(200).json({
                message: 'Watched movies',
                movies: movies
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getToBeWatchedMovies = (req, res, next) => {
    let moviesPerPage = 3;
    let pageNumber = 1;
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    //http://localhost:8080/movies/toBeWatched
    //http://localhost:8080/movies/toBeWatched?page=1 same result as the above end point
    //http://localhost:8080/movies/toBeWatched?page=2 --> page = 2
    Movie.find({ watchedOrNot: false })
        .skip((pageNumber - 1) * moviesPerPage)
        .limit(moviesPerPage)
        .then(movies => {
            res.status(200).json({
                message: 'ToBeWatched movies',
                movies: movies
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.addToWatchedList = (req, res, next) => {
    const movieId = req.params.movieId;
    const yearYouWatchedIn = req.body.yearYouWatchedIn ? +req.body.yearYouWatchedIn : new Date().getFullYear();
    //http://localhost:8080/movies/addToWatchedList/5e5beb0d69f38813b4ea1a78 -> request body contains {yearYouWatchedIn : number}
    Movie.updateOne({ _id: movieId }, {
        $set: {
            watchedOrNot: true,
            yearYouWatchedIn: yearYouWatchedIn
        }
    })
        .then(response => {
            res.status(200).json({
                message: 'Movie added to watched Movies'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}