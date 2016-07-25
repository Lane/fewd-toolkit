

module.exports = function(program, config) {

  var docs = function() { };

  program
    .command('docs')
    .description('not yet implemented')
    .option("--launch", "launches web server and opens browser to the documentation")
    .action(docs);

};
