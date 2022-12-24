# TwitterClone - Backend

A simple twitter clone with basic functionality (create tweets, follow users), built using AWS services such as Lambda, API Gateway, DynamoDB, Cognito, IAM, etc..

Note: In the future I will continue adding new features.
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [API Documentation](#setup)
## General info
This project is the Back-end component of my personal twitter clone project.

You can find the Front-end here: https://github.com/Ormax563/twitter-clone-frontend.

Link of the live app: https://master.d28wb0l6mr16n7.amplifyapp.com/

## Technologies
Project is created with:
* Lambda functions: Built in nodejs
* API Gateway: Access the lambda functions via http requests
* DynamoDB: Store data such as tweets and followers
* Cognito: Handle the users in the app
* IAM: Define proper access to the resources

## Setup
To deploy this project in your aws account, use the SAM CLI:

```
$ sam build
$ sam deploy --guided
```

## API Documentation

### Sign Up

Register a new user

```http
POST /sign-up
```

#### Payload

```javascript
{
  "email": string,
  "password": string, // 6 characters at least
  "username": string
}
```

#### Response

```javascript
{
  "message": string
}
```

### Sign In

Get an auth token

```http
POST /sign-in
```

#### Payload

```javascript
{
  "email": string,
  "password": string
}
```

#### Response

```javascript
{
  "message": string,
  "token": string
}
```

### Sign Out

Inavlidate all the active sessions

```http
POST /sign-out
```

#### Payload

```javascript
{
  "token": string
}
```

#### Response

```javascript
{
  "message": string
}
```

### Create Tweet

Create a new tweet

```http
POST /create-tweet
```

#### Payload

```javascript
{
  "token": string,
  "tweet": string
}
```

#### Response

```javascript
{
  "message": string
}
```

### Delete Tweet

Delete an existing tweet

```http
POST /delete-tweet
```

#### Payload

```javascript
{
  "token": string,
  "tweetID": string // id of the tweet you want to delete
}
```

#### Response

```javascript
{
  "message": string
}
```

### Edit Tweet

Update a tweet

```http
POST /edit-tweet
```

#### Payload

```javascript
{
  "token": string,
  "tweetID": string, // id of the tweet you want to delete
  "newTweet": string // tweet text you want to replace
}
```

#### Response

```javascript
{
  "message": string
}
```

### Get Tweets

Retrieve tweets of an specific user

```http
POST /get-tweets
```

#### Payload

```javascript
{
  "token": string,
  "limit": number, // optional, limit of records to retrieve. Default: 10
  "lastKey": object // optional, Key of the record from which you want to start retrieving
}
```

#### Response

```javascript
{
  "tweets": [{
    "tweetId": string,
    "user": string,
    "tweet": string,
    "nickname": string,
    "createdAt": string
    } ...],
  "lastKey":{
    "user": string,
    "tweetId": string
  } // Key of the last record fetched
}
```
### Scan Tweets

Retrieve all the tweets

```http
POST /scan-tweets
```

#### Payload

```javascript
{
  "limit": number, // optional, limit of records to retrieve. Default: 10
  "lastKey": object // optional, Key of the record from which you want to start retrieving
}
```

#### Response

```javascript
{
  "tweets": [{
    "tweetId": string,
    "user": string,
    "tweet": string,
    "nickname": string,
    "createdAt": string
    } ...],
  "lastKey": {
    "tweetId": string,
    "user": string,
    "tweet": string
  } // Key of the last record fetched
}
```
### Create Follower

Create a new follower

```http
POST /create-follower
```

#### Payload

```javascript
{
  "token": string,
  "follow": string // Username of the user you want to follow
}
```

#### Response

```javascript
{
  "message": string
}
```

### Delete Follower

Delete an existing follower

```http
POST /delete-follower
```

#### Payload

```javascript
{
  "token": string,
  "follow": string // Username of the user you want to unfollow
}
```

#### Response

```javascript
{
  "message": string
}
```

### List Followers

Retrieves the followers of a specific user

```http
POST /list-followers
```

#### Payload

```javascript
{
  "user": string, // email of the user you want to retrieve the followers
  "limit": number, // optional, limit of records to retrieve. Default: 10
  "lastKey": object // optional, Key of the record from which you want to start retrieving
}
```

#### Response

```javascript
{
  "followers": [{
    "follow": string,
    "user":  string
  } ...],
  "lastKey": {
      "follow": string,
      "user": string
  } // Key of the last record fetched
}
```






