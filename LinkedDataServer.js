// Very simple and fragile Linked Data server
//
// The content negotiation is incomplete but sufficient to understand the process:
// If agent requests text/html (most likely a web browser), render an HTML web page
// If agent requests application/rdf+xml (most likely an agent), pass RDF/XML directly
// In any other case, fail

var http = require('http');
var stardog = require('stardog');
var server = http.createServer();

// Port in which NodeJS server will listen
var port = 1337;

// Handle the HTTP request

var handleHTTPReq = function(req,res){
  // console.log(req.headers);
  // console.log(req.url);
  // console.log(req.headers['host']);

  // Configure (insecure) stardog connection and connect to stardog

  var endpoint_url = "http://localhost:5820/";
  var user = "admin";
  var passwd = "admin";

  var conn = new stardog.Connection();
  conn.setEndpoint(endpoint_url);
  conn.setCredentials(user, passwd);

  // Settings for the query to retrieve entities from stardog

  // The base uri is the uri that entities have in the dataset
  // Since the server is hosted in localhost, host uri is different from dataset uri
  var base_uri = "http://genomic-resources.eu";
  var host_uri = req.headers['host'];

  // Actual entity identifier (without host)
  var entity_uri = req.url;

  // The name of the DB at stardog
  var db = "um";

  // The query we for retrieving the triples related to the requested entity
  // Usually a describe
  var sparql_query = "describe " + "<" + base_uri + entity_uri + ">";
  console.log("SPARQL query: " + sparql_query);

  // Get the HTTP header accept clause
  var accept = req.headers['accept'];

  // Agent wants text/html
  // Query stardog and write HTML
  if (accept.search("text/html") != -1) {
    console.log("HTML");
    conn.query({
     database: db,
     query: sparql_query,

     // Retrieve results in turtle and convert them to HTML
     // Other possible mimetypes: "text/json", ...
     //
     mimetype: "text/turtle"
        },
        function (data) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          var triples = data.split(";");
          var main_triple = triples[0];
          var entities = main_triple.split(" ");
          var subject = entities[0];
          var subject_uri = subject.substring(2, subject.length-1);
          for (var i=1; i<triples.length; i++) {
            var triple = triples[i];
            var entities = triple.split(" ");
            var predicate = entities[0];
            var predicate_uri = predicate.substring(3, predicate.length-1);
            var object = entities[1];
            var object_uri = object.substring(1, object.length-1);

            // if the retrieved entity belongs to own dataset, re-map link URL to localhost
            // otherwise it will be a external entity so we don't care
            res.write("<p><a href=\"http://" + subject_uri.replace(base_uri,host_uri)+"\">" + subject_uri + "</a> - ");
            res.write("<a href=\"http://" + predicate_uri.replace(base_uri,host_uri) +"\">" + predicate_uri + "</a> - ");

            // if object is an rdfs:lable value don't render a link
            if(predicate.search("rdf-schema#label") != -1){
              res.write(object + "</p>");
            }
            else{
              res.write("<a href=\"http://" + object_uri.replace(base_uri,host_uri) +"\">" + object_uri + "</a></p>");
            }
          }
          res.end();
        }
    );
  }

  // Agent wants application/rdf+xml
  // Query stardog and pass data directly (!!! Without re-mapping: only external uris will resolve !!!)
  else if(accept.search("application/rdf\\+xml") != -1){
    console.log("RDF/XML");
    conn.query({
     database: db,
     query: sparql_query,

     // Retrieve results in RDF/XML and pass them directly to client
     // other mimetypes: "application/ld+json", ...
     //
     mimetype: "application/rdf+xml"
        },
        function (data) {
          res.writeHead(200, {'Content-Type': 'application/rdf+xml'});
          res.write(data);
          res.end();
        }
    );
  }
  else{
    // console.log("no header");
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.write("500 bad content negotiation");
    res.end();
  }
};

server.on('request', handleHTTPReq);
server.listen(port);
