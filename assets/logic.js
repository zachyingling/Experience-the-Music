// bands in town
$("#submit-button").on("click", function(e) {
  e.preventDefault();

  let artist = $("#input-box").val();
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
      url: queryURL,
      method: "GET",
      error: function() {
        $("#alert-message").text("Your artist wasn't found.");
        $("#alert-message").attr("class", "alert alert-danger display-all");
        setTimeout(function() {
          $("#alert-message").attr("class", "alert alert-danger display-none");
        }, 5000);
      }
    }).then(function(response) {
      console.log(response);
      // Fix this; response gets a 404 not 0 length
      $(".display-none").attr("class", "display-all");
      $("#alert-message").attr("class", "alert alert-danger display-none");
      let numEvents = response.length;
      // Putting artist info from bands in town on page
      $("#img").attr("src", response[0].artist.image_url);

      // Adding all of the artists tour dates to the table
      for (let i = 0; i < numEvents; i++) {
        let newRow = $("<tr>");
        let newNumber = $("<th>");
        newNumber.text(i + 1);
        let newDate = $("<td>");
        newDate.text(response[i].datetime);
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
        newTickets.append(ticketsAnchor);

        newRow.append(newNumber);
        newRow.append(newDate);
        newRow.append(newVenue);
        newRow.append(newLocation);
        newRow.append(newTickets);
        $("#tour-dates").append(newRow);
      }
      youtubeCall();
    });
  }
});

// Youtube functionality
function youtubeCall() {
  //prepare the request
  var request = gapi.client.youtube.search.list({
    part: "snippet",
    type: "video",
    q: encodeURIComponent($("#input-box").val()).replace(/%20/g, "+"),
    maxResults: 5,
    order: "viewCount"
  });
  //execute request
  request.execute(function(response) {
    console.log(response);
    console.log(response.items[0].id.videoId);

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
