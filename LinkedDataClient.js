// http://chimera.labs.oreilly.com/books/1234000001808/ch04.html#chap6_id35942512
// http://stackoverflow.com/questions/17690803/node-js-getaddrinfo-enotfound
// https://nodejs.org/api/http.html#http_http_request_options_callback

var http = require('http');


// http://127.0.0.1:1337/resource/Prot_A

var opts = {
  host: '127.0.0.1',
  port: 1337,
  path: '/resource/Prot_A',
  method: 'GET',
  headers: {
    'accept': 'application/rdf+xml'
  }
};

var req = http.request(opts, function(res) {
  res.on('data', function(data) {
    console.log(data.toString('utf8'));
  });
});

req.end();


// var http = require('http');

// var opts = {
//   host: 'www.google.com',
//   port: 80,
//   path: '/',
//   method: 'GET'
// };

// var req = http.request(opts, function(res) {
//   console.log(res);
//   res.on('data', function(data) {
//     console.log(data);
//   });
// });

// req.end();
