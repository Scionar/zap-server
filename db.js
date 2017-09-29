const async = require('async');
const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);

const state = {
  client: null,
};

module.exports.connect = (cb) => {
  state.client = redis.createClient();
  bluebird.promisifyAll(redis.RedisClient.prototype);

  state.client.on('error', (err) => {
    console.log(err);
  });

  cb();
};

module.exports.get = () => state.client;

module.exports.flush = (cb) => {
  if (state.client) {
    state.client.flushdb((error) => {
      if (error) throw error;
      cb();
    });
  } else {
    cb();
  }
};

/**
 * Takes data to input and callback.
 * @arg {array} data Two dimensional array of Redis commands.
 * @arg {requestCallback} cb The callback to be called after running all commands.
 */
module.exports.input = (data, cb) => {
  if (!state.client) throw new Error('No database connection.');
  async.each(data, (value, callback) => {
    state.client[value[0]](...value.slice(1));
    callback();
  }, cb);
};
