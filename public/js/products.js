$(document).ready(function(){

  $(".product-input").on("change", function(){

    let oId = $(this).siblings("input[name='id']").first(),
        name = $(this).attr("name"), 
        val = $(this).val();

    switch(name){
      case "name" :
        data = { name : val}
        break;
      case "type" :
        data = {type : val}
        break;
      case "details":
        data = {details : val}
        break;
      default:
        data = {}
        break;
    }

    console.log("Product input changed!", data)

    $.ajax({
      method: "PATCH",
      url: "http://localhost:3001/product/" + oId.val() ,
      data: data
    })
      .done(function( msg ) {
        alert( "Data Saved: " + msg );
      });
      
  })

})