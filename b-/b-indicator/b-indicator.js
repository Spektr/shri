$(function(){
   $('.b-indicator__percent').change(function(){
      $(this).prev('.b-indicator__line').css({'width':$(this).text()});
   });
});