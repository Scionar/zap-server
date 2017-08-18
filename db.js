const async = require('async');
const redis = require('redis');

const state = {
  client: null,
}

module.exports.connect = (cb) => {
  state.client = redis.createClient();

  state.client.on("error", function (err) {
    console.log(err);
  });

  cb();
}

module.exports.get = () => {
  return state.client;
}

module.exports.flush = (cb) => {
  if (state.client) {
    state.client.flushdb((error) => {
      if (error) throw error;
      cb();
    }
  } else {
    cb();
  }
}

module.exports.input = (data, cb) => {
  if (!state.client) return cb(new Error('No database connection.'));
  async.each(data.collections, (value) => {
    if (error) throw error;
    state.client[value[0]](...data.slice(1));
  }, cb);
}
