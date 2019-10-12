var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["File extension"] = function(test) {
  var mimeType = "text/plain";
  var ext = emlformat.getFileExtension(mimeType);
  test.ok(ext == ".txt", "Expected .txt but got " + ext);
  test.done(); 
};

exports["Email address"] = function(test) {
  var email, data;
  
  email = "foo@bar.com";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com");
  
  email = "<foo_12.36@bar.com>";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo_12.36@bar.com");
  
  email = "Foo Bar <foo@bar.com>";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "Foo Bar", 'Expected "Foo Bar" but got ' + data.name);
  
  email = '"Foo Bar" <foo@bar.com>';
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "Foo Bar", 'Expected "Foo Bar" but got ' + data.name);
  
  email = '=?UTF-8?Q?You=E2=80=99re=20Foo=20Bar?= <foo@bar.com>';
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "You’re Foo Bar", 'Expected "You’re Foo Bar" but got ' + data.name);
  
  email = 'foo@example.com, "Bar" <bar@example.com>, =?UTF-8?Q?You=E2=80=99re=20Foo=20Bar?= <foo@bar.com>';
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(Array.isArray(data));
  test.ok(data.length == 3);
  test.ok(typeof data[0].name == "undefined");
  test.ok(typeof data[0].email == "string");
  test.ok(typeof data[1].name == "string");
  test.ok(typeof data[1].email == "string")
  test.ok(data[1].name == "Bar", 'Expected "Bar" but got ' + data[1].name);
  test.ok(typeof data[2].name == "string");
  test.ok(typeof data[2].email == "string")
  test.ok(data[2].name == "You’re Foo Bar", 'Expected "You’re Foo Bar" but got ' + data[2].name);
  
  //Build e-mail address string from array
  //expected = '<foo@example.com>, "Bar" <bar@example.com>, "You\'re Foo Bar" <foo@bar.com>';
  //actual = emlformat.toEmailAddress(data);
  //test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};

exports["Unquote string"] = function(test) {
  var fixture, expected, actual;
  
  //Q = Quoted
  fixture = "=?UTF-8?Q?You=E2=80=99ve_added_a_card?=";
  expected = "You’ve_added_a_card";
  actual = emlformat.unquoteString(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  //B = Base64
  fixture = "=?UTF-8?B?V2hhdOKAmXMgeW91ciBvbmxpbmUgc2hvcHBpbmcgc3R5bGU/?=";
  expected = "What’s your online shopping style?";
  actual = emlformat.unquoteString(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  //ISO 8859-2 character set
  fixture = "=?ISO-8859-2?Q?Po=B9ta?=";
  expected = "Pošta";
  actual = emlformat.unquoteString(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};


exports["Unquote UTF8"] = function(test) {
  var fixture, expected, actual;
  
  //Q = Quoted
  fixture = "=?UTF-8?Q?You=E2=80=99ve_added_a_card?=";
  expected = "You’ve_added_a_card";
  actual = emlformat.unquoteUTF8(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  //B = Base64
  fixture = "=?UTF-8?B?V2hhdOKAmXMgeW91ciBvbmxpbmUgc2hvcHBpbmcgc3R5bGU/?=";
  expected = "What’s your online shopping style?";
  actual = emlformat.unquoteUTF8(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};

exports["Unquote printable"] = function(test) {
  var fixture, expected, actual;
  
  fixture = "You=E2=80=99ve added a card";
  expected = "You’ve added a card";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  fixture = "A line=0D=0A";
  expected = "A line\r\n";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  fixture = "Join line 1=\r\n=20with line 2=0D=0A";
  expected = "Join line 1 with line 2\r\n";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};
