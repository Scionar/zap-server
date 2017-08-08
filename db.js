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
  return state.pool;
}
