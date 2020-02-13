// bands in town
$("#submit-button").on("click", function(e) {
  e.preventDefault();

  let artist = $("#input-box").val();
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // Useless code now; i just threw some stuff up when we had to present
    //
    // $("#information").empty();
    // console.log(response[0].artist);
    // let artistName = response[0].artist.name;
    // let header = $("<h1>");
    // header.text(artistName);
    // $("#information").prepend(header);
    // let artistImage = $("<img>");
    // artistImage.attr("src", response[0].artist.image_url);
    // artistImage.attr("alt", "Artist image");
    // artistImage.attr("width", "400");
    // artistImage.attr("height", "400");
    // $("#information").append(artistImage);
    // let anchorTag = $("<a>");
    // anchorTag.text("Visit the artist's facebook page");
    // anchorTag.attr("href", response[0].artist.facebook_page_url);
    // anchorTag.attr("target", "_blank");
    // $("#information").append("<br>");
    // $("#information").append(anchorTag);
  });
});

// Youtube functionality
$(function() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    //prepare the request
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
      maxResults: 5,
      order: "viewCount"
    });
    //execute request
    request.execute(function(response) {
      console.log(response);
    });
  });
});

function init() {
  gapi.client.setApiKey("AIzaSyApyK0pdQLdwW4lBRGeKowZn5DG1h4l7Do");
  gapi.client.load("youtube", "v3", function() {
    //yt api is ready
  });
}
// Youtube functionality
