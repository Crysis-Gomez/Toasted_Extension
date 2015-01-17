var currentObject = null;
var shows = {"feeds":[]};
var de;

function parseObject(result,element){
  $(result).find("item").each(function () { // or "item" or whatever suits your feed
      var el = $(this);
      de = el.find("description");
      var description = el.find("description").text();
      description =  description.substring(0,description.indexOf('</p>'))+"</p>";
      if(description.length > 250)description = description.substring(0,250)+"...";
      var html = "<div class='show'><div class=title>"+ el.find("title").text() +"</div><button id='show_button' class='bt' value='"+el.find("link").text() +"'>go to show</button> <div class='description'>"+ description +"</div><div class='date'>"+el.find("pubDate").text().substring(0,16) +"</div></div>";
        
      $(element).append(html);
  });
  shows.feeds.splice(shows.feeds.length-1,1)
  loadFeed();
}

function loadFeed(){

  if(shows.feeds.length == 0){

    $( ".wrapper" ).fadeIn( "slow" );
    $(".overlay").hide();
    $(".loading").hide();
    $(document).on('click', '.bt', function(el){
       var newURL = el.target.value;
      chrome.tabs.create({ url: newURL });
    });
    return;
  }
  $.get(shows.feeds[shows.feeds.length-1].link , function (result) {     
        parseObject(result,shows.feeds[shows.feeds.length-1].show);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get({
    sunday_service: true,
    movie_review: true,
    roast_n_toast:true,
    movie_review_extravaganza:true
    }, function(items) {
      if(items.sunday_service == true){
        shows.feeds.push({"show":".sunday_service","link":"http://doubletoasted.com/shows/the-sunday-service/feed/"});
        var html = '<div class="container"><div class="show_info"><p>The Sunday Service </p><img src="images/Sunday-Service.png"></div><div class="show_container sunday_service"></div></div>';
         $('.wrapper').append(html);   
      }
      if(items.roast_n_toast == true){
        shows.feeds.push({"show":".roast_n_toast","link":"http://doubletoasted.com/shows/roast-and-toast/feed/"});
        var html = '<div class="container"><div class="show_info"><p>Roast &amp; Toast</p><img src="images/roast-n-toast.png"></div><div class="show_container roast_n_toast"></div></div>';
        $('.wrapper').append(html);   
      }

      if(items.movie_review == true){
        shows.feeds.push({"show":".movie_review","link":"http://doubletoasted.com/shows/reviews/feed/"});
        var html = '<div class="container"><div class="show_info"><p>Movie Review</p><img src="images/movie-review.png"></div><div class="show_container movie_review"></div></div>';
        $('.wrapper').append(html);   
      }

      if(items.movie_review_extravaganza == true){
        shows.feeds.push({"show":".movie_review_extravaganza","link":"http://doubletoasted.com/shows/movie-review-extravaganza/feed/"});
        var html = '<div class="container"><div class="show_info "><p>Movie review extravaganza</p><img src="images/movie-review-show.png"></div><div class="show_container movie_review_extravaganza"></div></div>';
         $('.wrapper').append(html);   
      }

      loadFeed();

    document.getElementById('options').addEventListener("click",function(el){
      var url = "chrome-extension://"+chrome.runtime.id+"/options/options.html";
      chrome.tabs.create({ url: url });
   })
  });
});
