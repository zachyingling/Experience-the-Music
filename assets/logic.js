var scroll = new SmoothScroll('a[href*="#"]', {
  // Selectors
  ignore: "[data-scroll-ignore]",
  header: null,
  topOnEmptyHash: true,

  // Speed & Duration
  speed: 500,
  speedAsDuration: false,
  durationMax: null,
  durationMin: null,
  clip: true,
  offset: 0,

  // Easing
  easing: "easeInOutCubic",
  customEasing: null,

  // History
  updateURL: true,
  popstate: true,

  // Custom Events
  emitEvents: true
});

$("#albums").on("click", function() {
  scroll.animateScroll(document.querySelector("#carouselExampleControls"));
});
$("#music-videos").on("click", function() {
  scroll.animateScroll(document.querySelector("#music-videos-header"));
});
$("#top-songs").on("click", function() {
  scroll.animateScroll(document.querySelector("#topSongs"));
});
$("#tour-dates-button").on("click", function() {
  scroll.animateScroll(document.querySelector("#tour-dates"));
});

var artistID = "";
var audioElement = "";
var albumIDs = [];

$("#submit-button").on("click", function(e) {
  e.preventDefault();
  $(".display-all").attr("class", "display-none");
  $("#tour-dates").empty();
  $("#trackTable").empty();
  $(".carousel-inner").empty();
  albumIDs = [];

  let artist = $("#input-box").val();

  //Tour Dates Call - Bandsintown
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  if (artist === "") {
    // Modal
    $("#alert-message").text("Please input an artist");
    $("#alert-message").attr("class", "alert alert-danger display-all");
    setTimeout(function() {
      $("#alert-message").attr("class", "alert alert-danger display-none");
    }, 5000);
  } else {
    $.ajax({
      url:
        "https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" +
        artist +
        "&api_key=4691f9a2169dfb0d38768c94b462b364&format=json",
      method: "GET"
    }).then(function(response) {
      console.log("last fm");
      console.log(response);
      if (response.error === 6) {
        $("#alert-message").text("Your artist wasn't found.");
        $("#alert-message").attr("class", "alert alert-danger display-all");
        setTimeout(function() {
          $("#alert-message").attr("class", "alert alert-danger display-none");
        }, 5000);
      } else {
        $("#bio").html(response.artist.bio.summary);
        bandsInTownCall();
      }
    });

    //BandsInTown API
    function bandsInTownCall() {
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log("Bandsintown");
        console.log(response);
        //
        // new conditonal needed here
        // nirvana, soundgarden, the beatles.. etc
        // bands with dead members don't work
        //
        $(".display-none").attr("class", "display-all");
        $("#alert-message").attr("class", "alert alert-danger display-none");
        let numEvents = response.length;
        // Putting artist info from bands in town on page

        // Adding all of the artists tour dates to the table
        for (let i = 0; i < numEvents; i++) {
          let newRow = $("<tr>");
          let newNumber = $("<th>");
          newNumber.text(i + 1);
          let newDate = $("<td>");
          let dateText = response[i].datetime;
          let tempDate = new Date(dateText);
          newDate.text(tempDate);
          let newVenue = $("<td>");
          newVenue.text(response[i].venue.name);
          let newLocation = $("<td>");
          newLocation.text(
            response[i].venue.city + ", " + response[i].venue.region
          );
          let newTickets = $("<td>");
          let ticketsAnchor = $("<a>");
          ticketsAnchor.attr("href", response[i].url);
          ticketsAnchor.text("Tickets");
          ticketsAnchor.attr("target", "_blank");
          ticketsAnchor.attr("class", "tickets");
          newTickets.append(ticketsAnchor);
          newRow.append(newNumber);
          newRow.append(newDate);
          newRow.append(newVenue);
          newRow.append(newLocation);
          newRow.append(newTickets);
          $("#tour-dates").append(newRow);
        }
        youtubeCall();
        napsterCall();
      });
    }

    //Napster API
    function napsterCall() {
      $.ajax({
        headers: {
          apikey: "ZTMwYmI4NjYtZTQ2OS00ZTA1LWE4OTQtYWE5NGFjYjkwYmEx"
        },
        url: `https://api.napster.com/v2.2/search?query=${artist}&type=artist&per_type_limit=1`,
        method: "GET",
        async: false,
        error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          console.log(err.Message);
          console.log(status);
          console.log(error);
          console.log("Napster Error");
        }
      }).then(function(response) {
        console.log("Napster");
        console.log(response);
        artistID = response.search.data.artists[0].id;
        console.log("ARTIST-ID: " + artistID);
        $("#img").attr(
          "src",
          `https://api.napster.com/imageserver/v2/artists/${artistID}/images/633x422.jpg`
        );
        tracks(artistID);
        albums(artistID);
      });
    }

    // Top 5 tracks
    function tracks(x) {
      console.log("top songs");
      $.ajax({
        headers: {
          apikey: "ZTMwYmI4NjYtZTQ2OS00ZTA1LWE4OTQtYWE5NGFjYjkwYmEx"
        },
        url:
          "https://api.napster.com/v2.2/artists/" + x + "/tracks/top?limit=5",
        method: "GET",
        error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          console.log(err.Message);
          console.log(status);
          console.log(error);
          console.log("Tracks Error");
        }
      }).then(function(response) {
        console.log(response);
        for (i = 0; i < response.tracks.length; i++) {
          $("#trackTable").append('<tr class="track' + i + '"></tr>');
          $(".track" + i).append('<th scope="row">' + (i + 1) + "</th>");
          $(".track" + i).append("<td>" + response.tracks[i].name + "</td>");
          $(".track" + i).append(
            "<td>" + response.tracks[i].albumName + "</td>"
          );
          audioElement = document.createElement("audio");

          $(".track" + i).append(
            '<td><button class="audio" data-play="' +
              response.tracks[i].previewURL +
              '">Preview</button></td>'
          );
        }
      });
    }

    // Artist album Ids
    function albums(x) {
      $.ajax({
        headers: {
          apikey: "ZTMwYmI4NjYtZTQ2OS00ZTA1LWE4OTQtYWE5NGFjYjkwYmEx"
        },
        url: `https://api.napster.com/v2.2/artists/${x}/albums/top?limit=5`,
        method: "GET",
        error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          console.log(err.Message);
          console.log(status);
          console.log(error);
          console.log("AlbumID Error");
        }
      }).then(function(response) {
        console.log(response);
        for (i = 0; i < response.albums.length; i++) {
          console.log(response.albums[i].id);
          albumIDs.push(response.albums[i].id);
        }

        albumImage();
      });
    }

    // Artist album images
    function albumImage(x) {
      for (let j = 0; j < albumIDs.length; j++) {
        $.ajax({
          headers: {
            apikey: "ZTMwYmI4NjYtZTQ2OS00ZTA1LWE4OTQtYWE5NGFjYjkwYmEx"
          },
          url: `https://api.napster.com/v2.2/albums/${albumIDs[j]}/images`,
          method: "GET",
          error: function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            console.log(err.Message);
            console.log(status);
            console.log(error);
            console.log("AlbumImage Error");
          }
        }).then(function(response) {
          console.log(response.images[4].url);
          console.log(j);
          let item = $('<div class="carousel-item">');
          if (j === 1) {
            item.attr("class", "carousel-item active");
          } else {
            item.attr("class", "carousel-item");
          }
          let tag = $("<img>");
          tag.attr("src", response.images[4].url);
          tag.attr("class", "d-block w-100 c-img");
          tag.attr("alt", "");
          item.append(tag);
          $(".carousel-inner").append(item);
        });
      }
    }
    //nothing after this
  }
});

$(document).on("click", ".audio", function() {
  console.log(this);
  audioElement.setAttribute("src", $(this).attr("data-play"));
  audioElement.play();
});

//NAPSTER API LINKS
// TOP 5 TRACKS: Ajax call returns object
// https://api.napster.com/v2.2/artists/{ARTIST-ID}/tracks/top?limit=5
// ARTIST IMAGE: Direct link to image
// https://api.napster.com/imageserver/v2/artists/{ARTIST-ID}/images/633x422.jpg
// ARTIST ALBUMS - Ajax call returns top albums with individual IDs and info
//           (?limit=#)<-optional
// ALBUM INFO - ajax call that shows all album info
// https://api.napster.com/v2.2/albums/{ALBUM-ID}
// ALBUM IMAGES - ajax call that returns several image links
// https://api.napster.com/v2.2/albums/{ALBUM-ID}/images
// ALBUM TRACKS -ajax call that returns album track info
// https://api.napster.com/v2.2/albums/{ALBUM-ID}/tracks

//Maybe we can load all this data into one giant object for each search and output it all to the DOM? The rate limit is 500 request per second..so we can go nuts if we want

// Youtube functionality
function youtubeCall() {
  //prepare the request
  var request = gapi.client.youtube.search.list({
    part: "snippet",
    type: "video",
    q: encodeURIComponent($("#input-box").val() + " official").replace(
      /%20/g,
      "+"
    ),
    maxResults: 5,
    order: "viewCount"
  });
  //execute request
  request.execute(function(response) {
    console.log("YouTube");
    console.log(response);
    // console.log(response.items[0].id.videoId);

    // Making a new iframe
    $("#iframe").empty();
    for (let i = 0; i < response.items.length; i++) {
      let newIframe = $("<iframe>");
      newIframe.attr("width", "250");
      newIframe.attr("height", "150");
      newIframe.attr(
        "src",
        "https://www.youtube.com/embed/" + response.items[i].id.videoId
      );
      newIframe.attr("frameborder", "0");
      newIframe.attr(
        "allow",
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      );
      newIframe.attr("allowfullscreen");
      $("#iframe").append(newIframe);
    }
  });
}

function init() {
  gapi.client.setApiKey("AIzaSyApyK0pdQLdwW4lBRGeKowZn5DG1h4l7Do");
  gapi.client.load("youtube", "v3", function() {
    //yt api is ready
  });
}
// Youtube functionality
