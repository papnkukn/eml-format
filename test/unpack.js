var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["Unpack sample.eml"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/sample.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  var dst = path.join(__dirname, "./unpack");
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst);
  }
  
  emlformat.verbose = false;
  emlformat.unpack(eml, dst, function(error, result) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      test.ok(fs.readdirSync(dst).length > 0, "Expected at least one output file!");
    }
    test.done();
  });  
};
