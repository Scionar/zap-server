const async = require('async');
const db = require('./db');

const name1 = 'joona';
const name2 = 'tero';

function getAll(cb) {
  db.get().scan(0, 'match', 'player:profile:*', (error, keys) => {
    if (error) throw error;
    return keys[1].map((key, index, array) => {
      let profile;
      db.get().hgetallAsync(key).then((value) => {
        profile = value;
      });
      return profile;
    });
  });
}

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    db.flush(() => {
      db.get().hmset(`player:profile:${name1}`, 'name', name1, (error) => {
        if (error) throw error;
        db.get().lpush('player:all', name1, (error) => {
          if (error) throw error;
          console.log('User created!');

          db.get().hmset(`player:profile:${name2}`, 'name', name2, (error) => {
            if (error) throw error;
            db.get().lpush('player:all', name2, (error) => {
              if (error) throw error;
              console.log('User created!');

              // Get method
              // db.get().scan(0, 'match', 'player:profile:*', (error, keys) => {
              //   if (error) throw error;
              //   console.log('---');
              //   console.log('keys');
              //   console.log(keys);
              //   console.log('---');
              //   const result = [];
              //   async.each(keys[1], function (key, callback) {
              //     console.log('---');
              //     console.log('key');
              //     console.log(key);
              //     console.log('---');
              //     db.get().hgetall(key, (error, value) => {
              //       if (error) throw error;
              //       console.log('---');
              //       console.log('value');
              //       console.log(value);
              //       console.log('---');
              //       result.push(value);
              //       callback();
              //     });
              //   }, (error) => {
              //     if (error) throw error;
              //     console.log('---');
              //     console.log('result');
              //     console.log(result);
              //     console.log('---');
              //   });
              //   console.log('IT IS DONE!!!');
              // });

              console.log(async getAll(() => {console.log('asd')}));

            });
          });
        });
      });
    });
  }
});
