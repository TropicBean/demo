window.addEventListener('resize', fnResize);

function fnResize(){

  windowHeight = $( ".main-layout" ).height();

  $(".navbar").height(0.1 * windowHeight)
  $(".home-body").height(0.8 * windowHeight)

}

$(document).ready(function(){
  fnResize();
})