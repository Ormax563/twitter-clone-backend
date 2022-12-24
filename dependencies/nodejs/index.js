const { DataMapper } = require('@aws/dynamodb-data-mapper');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');
const { v4 } = require('uuid');

const mapper = new DataMapper({
  client: new DynamoDB({region: 'us-east-1'})
});
 
/* Class for the tweets dynamodb table */
class TweetsEntity {

}

Object.defineProperties(TweetsEntity.prototype, {
  [DynamoDbTable]: {
      value: 'tweets-table'
  },
  [DynamoDbSchema]: {
      value: {
          user: {
              type: 'String',
              keyType: 'HASH',
              defaultProvider: v4
          },
          tweetId: {
              type: 'String',
              keyType: 'RANGE'
          },
          tweet: {
              type: 'String'
          },
          nickname: {
              type: 'String'
          },
          createdAt: {
              type: 'String'
          }
      },
  },
});

exports.putItem = async(data) => {
  const tweet = new TweetsEntity();
  tweet.user = data.user;
  tweet.tweetId = data.tweetId;
  tweet.tweet = data.tweet;
  tweet.nickname = data.nickname;
  tweet.createdAt = data.createdAt;
  return await mapper.put({item: tweet});
}

exports.deleteItem = async(data) => {
  const tweet = new TweetsEntity();
  tweet.user = data.user;
  tweet.tweetId = data.tweetId;
  return await mapper.delete({item: tweet})
}

exports.updateItem = async(data) => {
  const tweetFetch = new TweetsEntity();
  tweetFetch.user = data.user;
  tweetFetch.tweetId = data.tweetId;
  const tweetUpdate = await mapper.get({item: tweetFetch});
  tweetUpdate.tweet = data.tweet;
  return await mapper.update({item: tweetUpdate})
}

exports.scanItems = async(data) => {
  const tweets = [];
  const scanParams = { limit: data.limit };
  if(data.lastKey) scanParams.startKey = data.lastKey;
  const iterator = mapper.scan(TweetsEntity, scanParams);
  let lastKey;
  for await (const tweet of iterator) {
    tweets.push(tweet);
    if(tweets.length === data.limit){
      lastKey = {
        user: tweet.user,
        tweetId: tweet.tweetId
      };
    }
  }
  return { tweets, lastKey };
}

exports.getItems = async(data) => {
  const tweets = [];
  const keyCondition = {
    user: data.user
  };
  const queryParams = {
    limit: data.limit
  }
  if(data.lastKey) queryParams.startKey = data.lastKey;
  let lastKey;
  const iterator = mapper.query(TweetsEntity,keyCondition, queryParams);
  for await (const tweet of iterator) {
    tweets.push(tweet);
    if(tweets.length === data.limit){
      lastKey = {
        user: tweet.user,
        tweetId: tweet.tweetId
      };
    }
  }
  return { tweets, lastKey }
}

/* Class for the followers dynamodb table */
class FollowersEntity {

}

Object.defineProperties(FollowersEntity.prototype, {
  [DynamoDbTable]: {
      value: 'followers-table'
  },
  [DynamoDbSchema]: {
      value: {
          user: {
              type: 'String',
              keyType: 'HASH',
              defaultProvider: v4
          },
          follow: {
              type: 'String',
              keyType: 'RANGE'
          }
      },
  },
});

exports.putFollower = async(data) => {
  const follower = new FollowersEntity();
  follower.user = data.user;
  follower.follow = data.follow;
  return await mapper.put({item: follower});
}

exports.getFollowers = async(data) => {
  const followers = [];
  const keyCondition = {
    follow: data.user
  };
  const queryParams = {
    limit: data.limit,
    indexName: 'FollowersGSI'
  }
  if(data.lastKey) queryParams.startKey = data.lastKey;
  let lastKey;
  const iterator = mapper.query(FollowersEntity,keyCondition, queryParams);
  for await (const follow of iterator) {
    followers.push(follow);
    if(followers.length === data.limit){
      lastKey = {
        user: follow.user,
        follow: follow.follow
      };
    }
  }
  return { followers, lastKey }
}

exports.deleteFollower = async(data) => {
  const follower = new FollowersEntity();
  follower.user = data.user;
  follower.follow = data.follow;
  return await mapper.delete({item: follower})
}

 exports.HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

