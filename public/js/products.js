$(document).ready(function(){

  //when doc is ready add all the event listeners
  fnAddEventListeners()

  function fnAddEventListeners() {
    $(".product-input").on("change", function(){

      let oId = $(this).siblings("input[name='id']").first(),
          oContainer = $(this).closest(".container").first(),
          name = $(this).attr("name"), 
          val = $(this).val(),
          data = {} ;
  
      data[name] = val ;
  
      console.log("Product input changed!", data)
  
      $.ajax({
        method: oId.val() != "" ? "PATCH" : "POST" ,
        url: "http://localhost:3001/product/" + oId.val() ,
        data: data
      })
        .done(function( product ) {
          toastr.success("Product " +  (oId.val() != "" ? "updated" : "Added") )
          $(oId).val(product._id)
        });
        
    })
  
    $(".remove-control").on("click", function(){
      let oProductDiv = $(this).closest(".product").first() ;
  
      if(oProductDiv){
  
        let oId = oProductDiv.find("input[name='id']").first() ;
  
        $.ajax({
          method: "DELETE",
          url: "http://localhost:3001/product/" + oId.val() ,
          data: {}
        }).done(function(msg){
          oProductDiv.remove(); 
          toastr.success("Product Removed")
        })
  
      }
    })
  
    $(".product-add").on("click", function(){
      let oProductDiv = $.parseHTML(`
      <div class='product' >
        <input type="hidden" name='owner' placeholder='Owner' value="">
        <input type="hidden" name='id' placeholder='id' value="">
        <input class="product-input" name='name' placeholder='Name' value="">
        <input class="product-input" name='Type' placeholder='Type' value="">
        <textarea class="product-input" name="details"></textarea>
        <div class='button remove-control'>Delete</div>
      </div>
      `),
      oContainer = $(".container").first() ;
  
      oContainer.find(".product-add").after(oProductDiv)

      // re-add event listeners for newly created elements
      fnAddEventListeners()
    })

  }

})