var thunkify = require('thunkify');

var methods = [
  "insert",
  "destroy",
  "get",
  "view",
  "list",
  "head",
  "copy",
  "bulk",
  "fetch",
  "fetch_revs",
  "show",
  "atomic",
  "search"
];

module.exports = function(db)
{
  methods.forEach(function(method)
  {
    db[method] = thunkify(db[method]);
  });
  return db;
};