var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["Read sample.eml"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/sample.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  emlformat.verbose = false;
  emlformat.read(eml, function(error, result) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      //fs.writeFileSync("read.json", JSON.stringify(result, " ", 2))    
      
      test.ok(typeof result == "object");
      test.ok(typeof result.headers == "object");
      test.ok(typeof result.subject == "string");
      test.ok(typeof result.from == "object");
      test.ok(typeof result.to == "object");
      test.ok(typeof result.text == "string");
      test.ok(typeof result.html == "string");
      
      expected = "Winter promotions";
      actual = result.subject;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Foo Bar";
      actual = result.to.name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "foo.bar@example.com";
      actual = result.to.email;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Online Shop";
      actual = result.from.name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "no-reply@example.com";
      actual = result.from.email;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Lorem ipsum dolor sit amet";
      actual = result.text;
      test.ok(actual.indexOf(expected) == 0, 'Expected "' + expected + '" but got "' + actual + '"');
      
      actual = result.text;
      test.ok(actual.indexOf("=") == -1, 'Expected quoted-printable string to be decoded!');
      
      expected = "<!DOCTYPE html>";
      actual = result.html;
      test.ok(actual.indexOf(expected) == 0, 'Expected "' + expected + '" but got "' + actual + '"');
    }
    test.done();
  });  
};

exports["Read multi-part boundaries"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/multipart.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  emlformat.verbose = false;
  emlformat.read(eml, function(error, result) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      test.ok(typeof result == "object");
      test.ok(typeof result.headers == "object");
      test.ok(typeof result.subject == "string");
      test.ok(typeof result.from == "object");
      test.ok(typeof result.to == "object");
      test.ok(typeof result.text == "string");
      test.ok(typeof result.attachments != "undefined");
      test.ok(result.attachments.length == 1);
      
      expected = "Multi-part boundary";
      actual = result.subject;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Foo Bar";
      actual = result.from.name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "foo.bar@example.com";
      actual = result.to.email;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "please see attached";
      actual = result.text;
      test.ok(actual.indexOf(expected) == 0, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "tired_boot.FJ010019.jpeg";
      actual = result.attachments[0].name;
      test.ok(actual.indexOf(expected) == 0, 'Expected "' + expected + '" but got "' + actual + '"');
    }
    test.done();
  });  
};

exports["Read multiple To and Cc"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/cc.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  emlformat.verbose = false;
  emlformat.read(eml, function(error, result) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      test.ok(typeof result == "object");
      test.ok(typeof result.headers == "object");
      test.ok(typeof result.from == "object");
      test.ok(typeof result.to == "object");
      test.ok(typeof result.cc == "object");
      test.ok(Array.isArray(result.to), "Expected array from 'To' header");
      test.ok(result.to.length == 2, "Expected two e-mail in 'To' header");
      test.ok(Array.isArray(result.cc), "Expected array from 'Cc' header");
      test.ok(result.cc.length == 2, "Expected two e-mail in 'Cc' header");
      
      expected = "Foo_Bar";
      actual = result.from.name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Foo Bar";
      actual = result.to[0].name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "foo.bar@example.com";
      actual = result.to[0].email;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Bar";
      actual = result.cc[1].name;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "bar@example.com";
      actual = result.cc[1].email;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
    }
    test.done();
  });  
};
