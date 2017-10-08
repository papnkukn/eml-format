var os = require('os');
var fs = require('fs');
var path = require('path');
var emlformat = require('./lib/eml-format.js');

var config = {
  verbose: process.env.NODE_VERBOSE == "true" || process.env.NODE_VERBOSE == "1",
  json: false,
  unpack: true
};

//Prints help message
function help() {
  console.log("Usage:");
  console.log("  eml-unpack [options] [message.eml] [directory]");
  console.log("");
  console.log("Options:");
  console.log("  --help       Print this message");
  console.log("  --verbose    Enable detailed logging");
  console.log("  --version    Print version number");
  console.log("  --json       Create parsed.json and manifest.json");
  console.log("  --no-unpack  Used with --json to skip unpacking");
  console.log("");
  console.log("Examples:");
  console.log("  eml-unpack message.eml .");
  console.log("  eml-unpack --verbose sample.eml folder");
  console.log("  eml-unpack --json --no-unpack ./sample.eml ./folder");
}

//Command line arguments
var args = process.argv.slice(2);
for (var i = 0; i < args.length - 2; i++) {
  switch (args[i]) {
    case "--help":
      help();
      process.exit(0);
      break;
      
    case "--version":
      console.log(require('./package.json').version);
      process.exit(0);
      break;
      
    case "--version":
      config.verbose = true;
      break;
      
    case "--json":
      config.json = true;
      break;
      
    case "--no-unpack":
      config.unpack = false;
      break;
      
    default:
      console.error("Unknown command line argument: " + args[i]);
      process.exit(1);
      break;
  }
}

if (args.length < 2) {
  help();
  process.exit(1);
}

try {
  var src = args[args.length - 2];
  var dst = args[args.length - 1];

  if (!src) {
    throw new Error("Missing .eml file path!");
  }
  
  if (!dst) {
    throw new Error("Missing output directory path or folder name!");
  }
  
  var options = { };
  if (config.json) {
    options.parsedJsonFile = "parsed.json";
    options.readJsonFile = "manifest.json";
  }
  if (!config.unpack) {
    options.simulate = true;
  }
  
  var eml = fs.readFileSync(src, "utf-8");
  emlformat.verbose = config.verbose;
  emlformat.unpack(eml, dst, options, function(error, result) {
    if (error) {
      console.error(error);
      process.exit(1);
      return;
    }
    
    console.log("Done!");
  });
}
catch (e) {
  console.error(e);
  process.exit(1);
}