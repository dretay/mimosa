"use strict";

var path = require( 'path' )
  , _ = require( 'lodash' )
  , compilerLib = null
  , setCompilerLib = function ( _compilerLib ) {
    compilerLib = _compilerLib;
  };

var compile = function ( mimosaConfig, file, cb ) {
  var error
    , output
    , sourceMap
    , conf = _.extend( {}, mimosaConfig.coffeescript, { sourceFiles:[ path.basename( file.inputFileName ) + ".src" ] } );

  if ( !compilerLib ) {
    compilerLib = require( 'coffee-script' );
  }

  conf.literate = compilerLib.helpers.isLiterate( file.inputFileName );

  if ( conf.sourceMap ) {
    if ( conf.sourceMapExclude && conf.sourceMapExclude.indexOf( file.inputFileName ) > -1 ) {
      conf.sourceMap = false;
    } else {
      if ( conf.sourceMapExcludeRegex && file.inputFileName.match( conf.sourceMapExcludeRegex ) ) {
        conf.sourceMap = false;
      }
    }
  }

  try {
    output = compilerLib.compile( file.inputFileText, conf );
    if ( output.v3SourceMap ) {
      sourceMap = output.v3SourceMap;
      output = output.js;
    }
  } catch ( err ) {
    var line = "unknown";
    var column = "unknown";
    if ( err.location ) {
      line = err.location.first_line;
      column = err.location.first_column;
    }
    error = err + " line " + line + ", column " + column;
  }

  cb ( error, output, mimosaConfig.coffeescript, sourceMap );
};


module.exports = {
  base: "coffee",
  compilerType: "javascript",
  defaultExtensions: ["coffee", "litcoffee"],
  cleanUpSourceMaps: true,
  compile: compile,
  setCompilerLib: setCompilerLib
};