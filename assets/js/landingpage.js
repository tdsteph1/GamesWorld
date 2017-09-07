$(document).ready(function() {

  $("span").hide();

  $("img").on("click",function() {
    var size = $(this).attr("size");
    if (size ==="small"){
      $(this).animate({ height:"250px", width: "250px"});
      $(this).attr("size", "large");
      $(this).css("border","5px solid white");
      $(this).next().show(500);}
      
    else{
      $(this).animate({ height:"150px", width: "150px"});
      $(this).attr("size", "small");
      $(this).css("border","none");
      $(this).next().hide();}
  });
  
  // $("a").on("mouseover", function() {
  // 	$(this).children("img").animate({ height: "250px", width: "250px" });
  //   $(this).children("span").show();
  // });

  // $("a").on("mouseout", function() {
  // 	$(this).children("img").animate({ height: "150px", width: "150px"});
  //   $(this).children("span").hide();
  // });
  
// Alternate code for above
  // $(".planet").hover(function(){
  // 	$(this).animate({ height: "250px", width: "250px"});
  // 	}, function(){
  // 	$(this).animate({ height: "150px", width: "150px"});
  // 	});
});

