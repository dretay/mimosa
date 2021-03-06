"use strict"

module.exports = class CopyCompiler

  constructor: (config, @compiler) ->
    @extensions = @compiler.extensions(config)

  registration: (config, register) ->
    register ['add','update','buildFile'], 'compile', @compiler.compile, @extensions