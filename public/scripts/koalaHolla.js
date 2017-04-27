console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // load existing koalas on page load
  getKoalas();

  // add koala button click
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    var koalaToSend = {
      name: $('#nameIn').val(),
      sex: $('#sexIn').val(),
      age: $('#ageIn').val(),
      transfer: $('#readyForTransferIn').val(),
      notes: $('#notesIn').val(),
    };
    console.log(koalaToSend);
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); //end addButton on click
}); // end doc ready

var getKoalas = function(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    url: '/getKoalas',
    type: 'GET',
    success: function( data ){
      console.log( 'got some koalas: ', data );
      $( '#viewKoalas' ).empty();
      for (var i = 0; i < data.length; i++) {
        $( '#viewKoalas' ).append( '<p>' + data[i].name + ' ' + data[i].sex + ' ' + data[i].age +' '+data[i].transfer+' '+data[i].notes+'</p>' );
      }
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
}; // end getKoalas

var saveKoala = function( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    url: '/addKoala',
    type: 'post',
    data: newKoala, //sending koalaToSend object created at button click
    success: function( data ){
      getKoalas();
    } // end success
  }); //end ajax
};
