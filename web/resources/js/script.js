$(document).ready(function(){
   $(".dropdown-button").dropdown();
   $(".button-collapse").sideNav();
   $('.parallax').parallax();
   $("#navBack").click(function(){
      history.go(-1);
   });

   $("#table tr").click(function() {
      var selected = $(this);
      window.location.href='user.html';
   });

});

