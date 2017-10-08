var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["Build .eml file"] = function(test) {
  //E-mail data
  var data = {
    from: "no-reply@bar.com",
    to: {
      name: "Foo Bar",
      email: "foo@bar.com"
    },
    subject: "Winter promotions",
    text: "Lorem ipsum...",
    html: '<html><head></head><body>Lorem ipsum...<br /><img src="nodejs.png" alt="" /></body></html>',
    attachments: [
      {
        name: "sample.txt",
        contentType: "text/plain; charset=utf-8",
        data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget elit turpis. Aliquam lorem nunc, dignissim in risus at, tempus aliquet justo. In in libero pharetra, tristique est sed, semper diam. Phasellus faucibus eleifend neque. Etiam vitae dolor non turpis finibus condimentum id vitae dolor. Pellentesque vulputate nisi erat, porttitor iaculis ligula euismod nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed laoreet, turpis at blandit consequat, mauris enim volutpat augue, vel congue nisi quam quis nibh. Pellentesque ultrices tellus eget ullamcorper accumsan. Suspendisse mattis sit amet enim eu congue."
      },
      {
        name: "nodejs.png",
        contentType: "image/png",
        data: fs.readFileSync(path.join(__dirname, "./fixtures/nodejs.png")),
        inline: true
      }
    ]
  };
  
  emlformat.verbose = false;
  emlformat.build(data, function(error, eml) {
    if (error) {
      test.ok(false, error.message);
    }
    else {
      //fs.writeFileSync("build.eml", eml);
      test.ok(typeof eml == "string", "Expected to be string");
      test.ok(eml.length > 0, "Expected string length > 0");
      test.ok(eml.indexOf("From: no-reply@bar.com\r\n") >= 0, "Expected the 'From' header");
      test.ok(eml.indexOf("To: \"Foo Bar\" <foo@bar.com>\r\n") >= 0, "Expected the 'To' header");
      test.ok(eml.indexOf("\r\n\r\n") >= 0, "Expected new lines between header and body");
    }
    test.done();
  });  
};

exports["Rebuild sample.eml"] = function(test) {
  var expected, actual;
  var src = path.join(__dirname, "./fixtures/sample.eml");
  var eml = fs.readFileSync(src, "utf-8");
  
  emlformat.verbose = false;
  emlformat.read(eml, function(error, data) {
    if (error) {
      test.ok(false, error.message);
      test.done();
      return;
    }
    
    emlformat.build(data, function(error, eml) {
      if (error) {
        test.ok(false, error.message);
      }
      else {
        //fs.writeFileSync("rebuild.eml", eml);
        test.ok(typeof eml == "string", "Expected to be string");
        test.ok(eml.length > 0, "Expected string length > 0");
        test.ok(eml.indexOf("From: " + data.headers["From"] + "\r\n") >= 0, "Expected the 'From' header");
        test.ok(eml.indexOf("To: " + data.headers["To"] + "\r\n") >= 0, "Expected the 'To' header");
        test.ok(eml.indexOf("Subject: " + data.headers["Subject"] + "\r\n") >= 0, "Expected the 'Subject' header");
        test.ok(eml.indexOf("\r\n\r\n") >= 0, "Expected new lines between header and body");
      }
      test.done();
    });
  });
};
