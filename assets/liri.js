require("dotenv").config();

let keys = require("./keys.js");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let request = require("request");
let fs = require("fs");
let moment = require("moment");
moment().format();

let searchOption = process.argv[2];
let searchParameter = process.argv[3];



const searchInputs = function (searchOption, searchParameter) {
    switch (searchOption) {
        case "concert-this":
            concertThisInfo(searchParameter);
            break;
        case "spotify-this-song":
            spotifyThisInfo(searchParameter);
            break;
        case "movie-this":
            movieThisInfo(searchParameter);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Sorry that isn't an option.")
    }
}

// CONCERT-THIS---------------------------------------------------------------------
const concertThisInfo = function (searchParameter) {

    let URL = "https://rest.bandsintown.com/artists/" + searchParameter + "/events?app_id=codingbootcamp";

    request(URL, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            let concerts = JSON.parse(body);

            for (let i = 0; i < concerts.length; i++) {
                console.log("Event---------------------------");
                fs.appendFileSync("log.txt", "Event---------------------------\n");
                console.log(i);
                fs.appendFileSync("log.txt", i + "\n");
                console.log("Name of the Venue: " + concerts[i].venue.name);
                fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name + "\n");
                console.log("Venue Location: " + concerts[i].venue.city);
                fs.appendFileSync("log.txt", "Venue Location: " + concerts[i].venue.city + "\n");
                console.log("Date of the Event: " + concerts[i].datetime);
                fs.appendFileSync("log.txt", "Date of the Event: " + concerts[i].datetime + "\n");
                console.log("------------------------------------");
                fs.appendFileSync("log.txt", "------------------------------------" + "\n");
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

// SPOTIFY-THIS-SONG --------------------------------------------------------------
const spotifyThisInfo = function (searchParameter) {
    if (searchParameter === undefined) {
        searchParameter = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: searchParameter
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            let songs = data.tracks.items;

            for (let i = 0; i < songs.length; i++) {
                console.log("SONG------------------------");
                fs.appendFileSync("log.txt", "SONG------------------------\n");
                console.log(i);
                fs.appendFileSync("log.txt", i + "\n");
                console.log("Song name: " + songs[i].name);
                fs.appendFileSync("log.txt", "Song name: " + songs[i].name + "\n");
                console.log("Preview song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "Preview song: " + songs[i].preview_url + "\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "Album: " + songs[i].album.name + "\n");
                console.log("Artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "Artist(s): " + songs[i].artists[0].name + "\n");
            }
        }
    );
};

// MOVIE-THIS---------------------------------------------------------------------
const movieThisInfo = function (searchParameter) {

    if (searchParameter === undefined) {
        searchParameter = "Mr. Nobody"
        console.log("-----------------------");
        fs.appendFileSync("log.txt", "-----------------------\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" + "\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }

    let URL = "http://www.omdbapi.com/?t=" + searchParameter + "&y=&plot=short&apikey=b3c0b435";

    request(URL, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            let movies = JSON.parse(body);
            console.log("Movie--------------------------------------");
            fs.appendFileSync("log.txt", "Movie--------------------------------------\n");
            console.log("Title: " + movies.Title);
            fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
            console.log("Release Year: " + movies.Year);
            fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
            console.log("IMDB Rating: " + movies.imdbRating);
            fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
            console.log("Rotten Tomatoes Rating: " + rottenRatingInfo(movies));
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + rottenRatingInfo(movies) + "\n");
            console.log("Country of Production: " + movies.Country);
            fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
            console.log("Language: " + movies.Language);
            fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
            console.log("Plot: " + movies.Plot);
            fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
            console.log("Actors: " + movies.Actors);
            fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        }
    });
}

//Rotten Tomatoes Rating -------------------------------------------------------
const rottenRating = function (data) {
    return data.Ratings.find(function (item) {
        return item.Source === "Rotten Tomatoes";
    });
}

function rottenRatingInfo(data) {
    return rottenRating(data).Value;
}

// do-what-it-says---------------------------------------------------------------
const doWhatItSays = function () {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
    });
}

searchInputs(searchOption, searchParameter);