$(document).ready(function() {
  // $(".planet").on("hover", function() {
  // 	$(this).animate({ height: "250px", width: "250px" });
  // });

  // $(".planet").on("mouseleave", function() {
  // 	$(this).animate({ height: "150px", width: "150px"});
  // });

  $(".planet").hover(function(){
  	$(this).animate({ height: "250px", width: "250px"});
  	}, function(){
  	$(this).animate({ height: "150px", width: "150px"});
  	});
});

