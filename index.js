var thunkify = require('thunkify');

var methods = [
  "insert",
  "destroy",
  "get",
  "view",
  "list"
];

module.exports = function(db)
{
  methods.forEach(function(method)
  {
    db[method] = thunkify(db[method]);
  });
  return db;
};