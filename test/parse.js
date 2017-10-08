var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["Parse sample.eml"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/sample.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  emlformat.verbose = false;
  emlformat.parse(eml, function(error, result) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      //fs.writeFileSync("parse.json", JSON.stringify(result, " ", 2))    
      
      test.ok(typeof result == "object");
      test.ok(typeof result.headers == "object");
      test.ok(typeof result.body == "object");
      
      expected = "Wed, 29 Jan 2014 11:10:06 +0100";
      actual = result.headers["Date"];
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = "Winter promotions";
      actual = result.headers["Subject"];
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = 'multipart/related; type="text/html";\r\nboundary="b1_4afb675bba4c412783638afbee8e8c71"';
      actual = result.headers["Content-Type"];
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
      
      expected = 2;
      actual = result.body.length;
      test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
    }
    test.done();
  });  
};
