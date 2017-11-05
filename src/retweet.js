const Twit = require('twit');
const strings = require('./strings');
const uniqueRandArray = require('unique-random-array');

const bot = new Twit(config);

const queryString = uniqueRandArray(strings.queryString);
const queryStringSubQuery = uniqueRandArray(strings.queryStringSubQuery);
const resultType = uniqueRandArray(strings.resultType);
const responseString = uniqueRandArray(strings.responseString);

function retweet() {
  var paramQueryString = queryString();
  paramQueryString += ' ' + queryStringSubQuery();
  var paramResultType = resultType();
  var params = {
      q: paramQueryString + paramBlockedStrings(),
      result_type: paramResultType, // mixed, recent, popular
      lang: 'en'
  };
  bot.get('search/tweets', params, function(err, data) {

    if (err) return callback(err);

    var tweets = data.statuses;
    var randomTweet = getRandomTweet(tweets);

    try {
      var retweetId = data.statuses[0].id_str;
      bot.post('statuses/retweet/:id', {
        id: randomTweet.id_str
      }, function(err, response) {
        if (response) {
          console.log('Rewteeted!', ' Query String: ' + paramQueryString);
        }

        if (err) {
          console.log('Retweet ERROR! Duplication maybe...: ', err, ' Query String: ' + paramQueryString);
        }
      });
    } catch (e) {
      console.log('retweetId ERROR! ', e.message, ' Query String: ' + paramQueryString);
      return;
    }
  });
}

function getRandomTweet(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function paramBlockedStrings() {
    var allBlockedStrings = '',
        arr = strings.blockedStrings,
        i, n
    for (i = 0, n = arr.length; i < n; i++) {
        allBlockedStrings += ' -' + arr[i];
    }
    return allBlockedStrings;
}
