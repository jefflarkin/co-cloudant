'use strict';
var assert   = require('assert'),
    mocha    = require('co-mocha');

// Ensure that I'm able to connect to Cloudant. This requires the following environment variables:
//
// * CLOUDANT_USER     - The cloudant username
// * CLOUDANT_KEY      - The API key
// * CLOUDANT_PASSWORD - The API key password
// * CLOUDANT_DATABASE - A Database to use
describe('Cloudant Connection', function(){
  // Sanity check that cloudant connects without the wrappers.
  it('should connect successfully with a callback', function(done){
    var Cloudant = require('cloudant')({account: process.env.CLOUDANT_USER,
                                        key:process.env.CLOUDANT_KEY,
                                        password:process.env.CLOUDANT_PASSWORD},
                                        function(err, cloudant, reply){
                                          if(err) return done(err);
                                          done();
                                        });
  });
});
describe('Wrapped Cloudant Connection', function(){
  var options = {account: process.env.CLOUDANT_USER,
                 key:process.env.CLOUDANT_KEY,
                 password:process.env.CLOUDANT_PASSWORD}
  var Cloudant, _cloudant, _db;
  var wrap = require('../lib/co-cloudant');
  before(function(done)
  {
    Cloudant = require('cloudant')({account: process.env.CLOUDANT_USER,
                                        key:process.env.CLOUDANT_KEY,
                                        password:process.env.CLOUDANT_PASSWORD},
                                        function(err, cloudant, reply){
                                          _cloudant = cloudant;
                                          if(err) return done(err);
                                          done();
                                        });
  });
  var inserted_id0, inserted_id1;
  it('should connect', function()
  {
    assert(_cloudant);
  });
  it('should respond to ping', function()
  {
    _cloudant.ping(function(err,response)
    {
      assert(response.couchdb);
    });
  });
  it('should create a database');
  it('should wrap a database', function()
  {
    _db = wrap(_cloudant.use(process.env.CLOUDANT_DATABASE));
    assert(_db);
  });
  it('should insert a record without a key', function *()
  {
    
    var resp = yield _db.insert({name: "test"});
    assert(resp[0].ok === true);
    assert(resp[0].id);
    inserted_id0 = resp[0];
  });
  it('should insert a record with a key', function *()
  {
    var resp = yield _db.insert({name: "test"},'testkey0');
    assert(resp[0].ok === true);
    assert(resp[0].id);
    inserted_id1 = resp[0];
  });
  it('should get a record by id', function *()
  {
    var body = yield _db.get(inserted_id0.id);                           
    assert(body[0]._id === inserted_id0.id);
    assert(body[0].name === "test");
  });
  it('should delete a record', function *()
  {
    var resp = yield _db.destroy(inserted_id0.id, inserted_id0.rev);
    assert(resp[0].ok === true);
    resp = yield _db.destroy(inserted_id1.id, inserted_id1.rev);
    assert(resp[0].ok === true);
  });
  it('should list records', function *()
  {
    var body = yield _db.list();
    assert(body[0].total_rows === body[0].rows.length);
  });
  it('should create a view');
  it('should fetch views', function *()
  {
    var pages = yield _db.view('posts','pages',{});
    assert(pages[0].total_rows === pages[0].rows.length);
  });
  it('should delete a database');
});
