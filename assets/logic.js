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
    console.log(response);
    if (artist === "" || response.length === 0) {
      // Modal
    } else {
      $(".display-none").attr("class", "display-all");
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
    }
  });
});

// Youtube functionality
function youtubeCall() {
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
}

function init() {
  gapi.client.setApiKey("AIzaSyApyK0pdQLdwW4lBRGeKowZn5DG1h4l7Do");
  gapi.client.load("youtube", "v3", function() {
    //yt api is ready
  });
}
// Youtube functionality
