$(document).ready(function(){
   $(".dropdown-button").dropdown();
   $(".button-collapse").sideNav();
   $('.parallax').parallax();
   $("#navBack").click(function(){
      window.location.replace("overview.html");

   });

   $("#table tr").click(function() {
      var selected = $(this);
      window.location.href='user.html';
   });
});

