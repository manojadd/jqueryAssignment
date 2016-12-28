$(document).ready(function() {
    $("#year_input").attr("max", new Date().getFullYear());    //for the range in input 
    $("#year_input").attr("value", new Date().getFullYear());  //for the default year input

    $("#submit_button").click(function(event) {                //after movie is entered this is clicked by user
        event.preventDefault();                                

        var title_value = document.getElementById("title_input").value; //for use in ajax call
        var year_value = document.getElementById("year_input").value;   //for use in ajax call
        if(document.getElementById("consider_year_input").checked)          
					$.ajax({
            url: "http://www.omdbapi.com/?s=" + title_value+"&y="+year_value,
            type: 'GET',
            success: find_movies,
            complete: click_wait
        	});
	      else
      	 $.ajax({
            url: "http://www.omdbapi.com/?s=" + title_value,
            type: 'GET',
            success: find_movies,
            complete: click_wait
      	 });



    });
});
function click_wait()  //after whole page is displayed. listeners are added to each show-more button
{

	$(".show-more").click(function(){                //when clicked will initiate a new ajax request to fetch the details of that specific movie.


	var clicked_button_id = this.id;                  //this.id is id of button clicked
	var imdb = $("#"+this.id).parent().find(".imdb-number").text();  //this field is hidden in html page and used now to get the imdb number the button is associated with.


   $.ajax({
                url: "http://www.omdbapi.com/?i="+imdb+"&plot=full&r=json",
                type: "GET",
                success:function(data){ expand(data,clicked_button_id);}     //using closure to get the clicked_button_id into the success callback since success allows only "data" from ajax request/

            });



	});
}
function expand(data,button_id) //button_id is used to get the reference of div to which the values are to be appended.
{
	
	$("#"+button_id).parent().find(".details").empty();    //emptying at start so that multiple clicks of show-more dont result in duplicate values on page.
	var $card = $("#"+button_id).parent().find(".details");

	var $parent = $("<ul></ul>").appendTo($card).attr({class:"list-group list-group-flush"});
	for (keys in data) {
		
		if(keys === "Response"||
			 keys === "Title"||
			 keys === "Type"||
			 keys === "Poster"||
			 keys === "imdbID")                     //do not display these properties that came from the ajax request
		{


		}
		else
				$("<li></li>").appendTo($parent).attr({class:"list-group-item"}).text(keys+" : "+data[keys]);

	}
	
}






var find_movies = function(data) {            //success callback for search 
    $("#hero").empty();
    if (data.Response === "True") {
        data.Search.forEach(each_movie);     //call each_movie for all the movies got from search which will display them in a row in html page
    } else {
        $("#hero").append("<div class=\"row\"><h3>NO MOVIES FOUND</h3></div>");
    }

};

var each_movie = function(data,index) {     //will display the search results in the page.
    var $hero=$('#hero');
    var html;
    var $parent;
 
    html = "<div></div>";
    $parent =  $(html).appendTo($hero).attr("class","row");
    html = "<div></div>";
    $parent = $(html).appendTo($parent).attr("class","card");
		html = "<img>";
  
    if(data.Poster=="N/A")
    	    $(html).appendTo($parent).attr({class:"card-img-top col-sm-4",alt:"Poster",src:"images/no-poster.png"});
    else
    	    $(html).appendTo($parent).attr({class:"card-img-top col-sm-4",alt:"Poster",src:data.Poster});
    html = "<div></div>";
    var $div = $(html).appendTo($parent).attr({class:"card-block"});
    $("<h4></h4>").appendTo($div).attr({class:"card-title"}).text(data.Title);
    $("<h4></h4>").appendTo($div).attr({class:"imdb-number"}).text(data.imdbID).hide();
    html="<button ></button>";
    $(html).appendTo($parent).attr({type:"submit",id:"submit_button"+index,class:"btn btn-default show-more"}).text("Show more");

    $("<div></div>").appendTo($parent).addClass("details");
    };