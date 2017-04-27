var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var port = process.env.PORT||3000;
var pg = require('pg');

//setup config for the pool
var config = {
  database: 'koalas',
  host: 'localhost',
  port: 5432,
  max: 12
};//end config

//create new pool using config
var pool = new pg.Pool( config );

// static folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile(path.resolve( 'index.html' ));
});

// get koalas
app.get( '/getKoalas', function( req, res ){
  console.log( 'getKoalas route hit' );
  // array of koalas to respond to ajax get
  var allKoalas=[];
  // connect to db
  pool.connect( function(err, connection, done) {
    //check if there was an error
    if(err) {
      console.log(JSON.stringify(err));
      //respond with PROBLEM!
      res.send( 400 );
    } else {
      console.log('connected to db');
    // send query for all koalas in the 'koala' table and hold in a variable (resultSet)
    var resultSet = connection.query( "SELECT * from koala" );
    // convert each row into an object in the allKoalas array
    // on each row, push the row into allKoalas
    resultSet.on( 'row', function( row ){
      allKoalas.push( row );
    }); //end on row
    // on end of rows send array as response
    resultSet.on( 'end', function(){
      // close connection to reopen spot in pool
      done();
      // res.send array of koalas
      res.send( allKoalas);
    }); //end on end
    } // end no error
  }); //end pool
});

// add koala
app.post( '/addKoala', urlencodedParser, function( req, res ){
  console.log( 'addKoala route hit' );
  // connect to db
  pool.connect( function(err, connection, done) {
    //check if there was an error
    if(err) {
      console.log('err');
      //respond with PROBLEM!
      res.send( 400 );
    } else {
      console.log('connected to db');
      // send query for all koalas in the 'koala' table and hold in a variable (resultSet)
      connection.query( "INSERT INTO koala (name,sex,age,transfer,notes) VALUES ($1,$2,$3,$4,$5)",[req.body.name,req.body.sex,req.body.age,req.body.transfer,req.body.notes] );
      // close connection to reopen spot in pool
      done();
    } //end on end
  }); //end pool
  res.send(200);
});

// // add koala
// app.post( '/editKoala', urlencodedParser, function( req, res ){
//   console.log( 'editKoala route hit' );
//   //assemble object to send
//   var objectToSend={
//     response: 'from editKoala route'
//   }; //end objectToSend
//   //send info back to client
//   res.send( objectToSend );
// });
