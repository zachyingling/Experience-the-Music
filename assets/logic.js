// Youtube functionality
$(function() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    //prepare the request
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      type: 'video',
      q: encodeURIComponent($('#search').val()).replace(/%20/g, '+'),
      maxResults: 5,
      order: 'viewCount'
    });
    //execute request
    request.execute(function(response) {
      console.log(response);
    });
  });
});

function init() {
  gapi.client.setApiKey('AIzaSyApyK0pdQLdwW4lBRGeKowZn5DG1h4l7Do');
  gapi.client.load('youtube', 'v3', function() {
    //yt api is ready
  });
}
// Youtube functionality
