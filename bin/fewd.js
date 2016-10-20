#!/usr/bin/env node
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let program = require( 'commander' );
let Fewd = require( '../index.js' );
let config = require( '../lib/config' );
let FewdItem = require( '../lib/fewd-item' );

// create a fewd instance
let fewdInst = Fewd( config );

// initialize program
program.version( '0.0.1' );

// set Commander as the CLI tool
fewdInst.setCLI( program );

// set console as the logger, for now.
// fewdInst.setLogger(console);


// add base commands
let command = fewdInst.createCommand("hello", "this will say hello to you");
command.beforeRun(() => { console.log("preparing to say hello"); });
command.addAction(() => { console.log("HELLO ", command.options.recipient); });
command.afterRun(() => { console.log("done saying hello. goodbye."); });

program.parse(process.argv);


var fewd = new FewdItem(null, config.name, "fewd-command", config.items, config.config);
