## EML file format

A pure Node.js library for parsing and building EML files, i.e. the e-mail message format described in [RFC 822](http://www.ietf.org/rfc/rfc0822.txt) ([another link](https://www.w3.org/Protocols/rfc822/)). EML is returned by the POP3 protocol and handled by many e-mail agents like Mozilla Thunderbird or Microsoft Outlook. An EML file consists of headers and body similar to the HTTP structure.

```
File extension: .eml
Mime type: message/rfc822
```

### What does EML look like?

```
Date: Wed, 29 Jan 2014 11:10:06 +0100
To: "Foo Bar" <foo.bar@example.com>
From: Online Shop <no-reply@example.com>
Subject: Winter promotions
Content-Type: text/plain; charset=utf-8

Lorem ipsum...
```

### Getting Started

Setup
```
npm install -g eml-format
```

Read EML file
```javascript
var fs = require('fs');
var emlformat = require('eml-format');

var eml = fs.readFileSync("sample.eml", "utf-8");
emlformat.read(eml, function(error, data) {
  if (error) return console.log(error);
  fs.writeFileSync("sample.json", JSON.stringify(data, " ", 2));
  console.log(data);
});
```

Output structure
```json
{
  "subject": "Winter promotions",
  "from": "Online Shop <no-reply@example.com>",
  "to": "\"Foo Bar\" <foo.bar@example.com>",
  "headers": {
    "Date": "Wed, 29 Jan 2014 11:10:06 +0100",
    "To": "\"Foo Bar\" <foo.bar@example.com>",
    "From": "Online Shop <no-reply@example.com>",
    "Subject": "Winter promotions",
    "Content-Type": "multipart/related; type=\"text/html\";\r\nboundary=\"b1_4afb675bba4c412783638afbee8e8c71\"",
    "MIME-Version": "1.0"
  },
  "html": "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n<title>Lorem ipsum</title>\r\n=09<meta name=\"description\" ...",
  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit....",
  "attachments": [
    {
      "name": "nodejs.png",
      "mimeType": "image/png",
      "data": {
        "type": "Buffer",
        "data": [ 137, 80, 78, 71, ... ]
      }
    }
  ]
}
```

### Command Line

A command line tool to extract an .eml file into a folder. The output directory will be populated with .txt and .html message and attachment files.
```
Usage:
  eml-unpack [options] [message.eml] [directory]

Options:
  --help       Print this message
  --verbose    Enable detailed logging
  --version    Print version number
  --json       Create parsed.json and manifest.json
  --no-unpack  Used with --json to skip unpacking

Examples:
  eml-unpack message.eml .
  eml-unpack --verbose sample.eml folder
  eml-unpack --json --no-unpack ./sample.eml ./folder
```

## Reference

### read(eml, [options], callback)

Parses EML file content and returns user-friendly object

| Argument | Type | Description |
|----------|------|-------------|
| eml | string or object | EML file content or object from 'parse' |
| options | object | Optional parameter, `{ headersOnly: true }` (`false` by default) |
| callback | function(error, data) | Callback function to be invoked when read is complete |

### parse(eml, [options], callback)

Parses EML file content and returns object-oriented representation of the content

| Argument | Type | Description |
|----------|------|-------------|
| eml | string | EML file content |
| options | object | Optional parameter, `{ headersOnly: true }` (`false` by default) |
| callback | function(error, data) | Callback function to be invoked when parse is complete |

### build(eml, callback)

Builds an EML message

| Argument | Type | Description |
|----------|------|-------------|
| data | object | E-mail data, see example |
| callback | function(error, eml) | Callback function to be invoked when build is complete |

### unpack(eml, directory, callback)

Unpacks EML message and attachments to a directory

| Argument | Type | Description |
|----------|------|-------------|
| eml | string or object | EML file content or object from 'parse' |
| directory | string | Folder name or directory path where to unpack |
| callback | function(error, data) | Callback function to be invoked when read is complete |

## Examples

### Read headers only
```javascript
var fs = require('fs');
var emlformat = require('eml-format');

var eml = fs.readFileSync("sample.eml", "utf-8");
emlformat.read(eml, { headersOnly: true }, function(error, data) {
  if (error) return console.log(error);
  fs.writeFileSync("headers.json", JSON.stringify(data, " ", 2));
  console.log(data);
  console.log("Done!");
});
```

### Read the complete EML file

The `parse` function parses raw EML content into a JavaScript object for further processing.
```javascript
var fs = require('fs');
var emlformat = require('eml-format');

var eml = fs.readFileSync("sample.eml", "utf-8");
emlformat.parse(eml, function(error, data) {
  if (error) return console.log(error);
  fs.writeFileSync("sample.json", JSON.stringify(data, " ", 2));
  console.log(data);
  console.log("Done!");
});
```

Or use `read` instead of `parse`. The `read` function decodes the **base64**, **quote-printable**, **=?UTF-8?...?=** encoded content and extracts plain text, html content and attachments. So this method is a little slower but more user friendly.
```javascript
emlformat.read(eml, function(error, data) {
  if (error) return console.log(error);
  fs.writeFileSync("user-friendly.json", JSON.stringify(data, " ", 2));
  console.log(data);
  console.log("Done!");
});
```

### Unpack files from an EML file

Extracts plain text, html content and attachments to a directory
```javascript
var fs = require('fs');
var emlformat = require('eml-format');

var dir = "unpacked"; //Output directory
var eml = fs.readFileSync("sample.eml", "utf-8");
emlformat.unpack(eml, dir, function(error, data) {
  if (error) return console.log(error);
  console.log(data); //List of files
  console.log("Done!");
});
```

### Create an EML file

```javascript
var fs = require('fs');
var emlformat = require('eml-format');

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
      data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget elit turpis. Aliquam lorem nunc, dignissim in risus at, tempus aliquet justo..."
    },
    {
      name: "nodejs.png",
      contentType: "image/png",
      data: fs.readFileSync("nodejs.png"),
      inline: true
    }
  ]
};

var eml = fs.readFileSync("sample.eml", "utf-8");
emlformat.build(data, function(error, eml) {
  if (error) return console.log(error);
  fs.writeFileSync("build.eml", eml);
  console.log("Done!");
});
```

### Multiple e-mail addresses

```javascript
var data = {
  from: "no-reply@bar.com",
  to: [ 
		{ name: "Foo", email: "foo@example.com" },
		{ name: "Bar", email: "bar@example.com" }
	],
	cc: [
		{ name: "Foo Bar", email: "foo@bar.com" },
		{ email: "info@bar.com" }
	],
  subject: "Winter promotions",
  ...
};
```

### Register a new mime type file extension

```javascript
var emlformat = require('eml-format');
emlformat.fileExtensions["application/zip"] = ".zip";
emlformat.fileExtensions["application/octet-stream"] = ".bin";
```

### Extract e-mail address and name

Plain text name
```javascript
var emlformat = require('eml-format');
var data = emlformat.getEmailAddress('"Foo Bar" <foo@bar.com>');
//data.name == "Foo Bar";
//data.email == "foo@bar.com";
```

UTF-8 encoded name
```javascript
var emlformat = require('eml-format');
var data = emlformat.getEmailAddress('=?UTF-8?Q?You=E2=80=99re=20Foo=20Bar?= <foo@bar.com>');
//data.name == "You’re Foo Bar";
//data.email == "foo@bar.com";
```

### Decode "quoted-printable"

```javascript
var emlformat = require('eml-format');
var message = emlformat.unquotePrintable("Join line 1=\r\n=20with line 2=0D=0A");
```

### Decode "=?UTF-8?...?=" string

```javascript
var emlformat = require('eml-format');
var message = emlformat.unquoteUTF8("=?UTF-8?B?V2hhdOKAmXMgeW91ciBvbmxpbmUgc2hvcHBpbmcgc3R5bGU/?=");
```

### Decode other character set

```javascript
var emlformat = require('eml-format');
var message = emlformat.unquoteString("=?ISO-8859-2?Q?Po=B9ta?=");
```
