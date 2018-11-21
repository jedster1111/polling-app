# Polling App

An application to create and vote on polls, written in Typescript.  

[See the live version here.](https://polling-app-jed.herokuapp.com) 

![Polling app run through](https://s2.gifyu.com/images/runThrough.gif)

## Table of Contents

- [Polling App](#polling-app)
  - [Table of Contents](#table-of-contents)
  - [Technology Used](#technology-used)
  - [Setup](#setup)
  - [Development Server](#development-server)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Other Commands](#other-commands)
  - [Auth](#auth)
    - [`/auth/github`](#authgithub)
      - [`/auth/logout`](#authlogout)
      - [`/test`](#test)
  - [Api Design](#api-design)
  - [`/api/polls`](#apipolls)
    - [`POST`](#post)
      - [Usage](#usage)
      - [Expects](#expects)
      - [Returns](#returns)
    - [`GET`](#get)
      - [Usage](#usage-1)
      - [Expects](#expects-1)
      - [Returns](#returns-1)
  - [`/api/polls/:id`](#apipollsid)
    - [`POST`](#post-1)
      - [Usage](#usage-2)
      - [Expects](#expects-2)
      - [Returns](#returns-2)
    - [`GET`](#get-1)
      - [Usage](#usage-3)
      - [Expects](#expects-3)
      - [Returns](#returns-3)
    - [`DELETE`](#delete)
      - [Usage](#usage-4)
      - [Expects](#expects-4)
      - [Returns](#returns-4)
  - [`/api/polls/:id/vote`](#apipollsidvote)
    - [`POST`](#post-2)
      - [Usage](#usage-5)
      - [Expects](#expects-5)
      - [Returns](#returns-5)
  - [`/api/polls/:id/remove-vote`](#apipollsidremove-vote)
    - [`POST`](#post-3)
      - [Usage](#usage-6)
      - [Expects](#expects-6)
      - [Returns](#returns-6)
  - [`/api/polls/:id/open`](#apipollsidopen)
    - [`POST`](#post-4)
      - [Usage](#usage-7)
      - [Expects](#expects-7)
      - [Returns](#returns-7)
  - [`/api/polls/:id/close`](#apipollsidclose)
    - [`POST`](#post-5)
      - [Usage](#usage-8)
      - [Expects](#expects-8)
      - [Returns](#returns-8)
  - [`/api/users`](#apiusers)
    - [`GET`](#get-2)
      - [Usage](#usage-9)
      - [Expects](#expects-9)
      - [Returns](#returns-9)
  - [`/api/users/:id`](#apiusersid)
    - [`GET`](#get-3)
      - [Usage](#usage-10)
      - [Expects](#expects-10)
      - [Returns](#returns-10)
  - [`/api/users/me`](#apiusersme)
    - [`GET`](#get-4)
      - [Usage](#usage-11)
      - [Expects](#expects-11)
      - [Returns](#returns-11)

## Technology Used

- Frontend
  - React
  - Redux
  - Redux-Saga
  - styled components
  - Ant Design
  - Axios
- Backend
  - Express
  - Passport (Github & JWT auth)
  - LokiJS
- Testing
  - Jest
  - SuperTest
  - TestCafe



## Setup

- To install dependencies run: `yarn` or `yarn install`
- In order for the github authentication to work, you must
  - Follow [github's tutorial for creating an OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
    - Homepage Url might be `http://127.0.0.1:8000` while developing locally
    - Authorization callback URL would then be
      `http://127.0.0.1:8000/auth/github/callback`  
      ![github OAuth example](http://puu.sh/BExqF/c1e010896b.png)
  - You will then be provided with a clientId and a clientSecret.
  - You must then set the following environment variables in order for the app
    to run in both development and production.  
    _Note the `URL` must match the `Homepage URL` provided when creating your
    GitHub OAuth app_
    ```txt
    CLIENT_ID=YourGitHubProvidedClientId
    Client_SECRET=YoutGitHubProvidedClientSecret
    SECRET_KEY=ASecretKeyGeneratedByYou
    URL=http://127.0.0.1:8000
    ```
    - Dotenv is set up, so create a file in the root directory called `dev.env`
      and store the env variables in there as shown above. They will be loaded into
      your code automatically.

## Development Server

- To start the server run: `yarn start`  
  _By default server will run on port 8000, you can change
  this by setting a `PORT` environment variable._  
  _Note that the server restarts on changes in the working directory and browser
  hot reloads_
- Visit `localhost:8000` to see the website

## Testing

- To execute unit/integration tests with jest, run: `yarn test`
- To execute end-to-end tests using testcafe, first ensure development server is running
  and run: `yarn testcafe`
  - **Add the github account you'd like to use for testing to `dev.env` file in the format shown below**  
    Probably best not to use your real github account especially if you share passwords between multiple accounts.

  ```
    TEST_USERNAME=YourGithubUsername
    TEST_PASSWORD=YourPassword
  ```

## Deployment

On the deployment server, run `yarn build` to bundle all the front end
code using webpack, and compile the server to javascript.  
Run `yarn start:prod` to run the server.

## Other Commands

- To start Storybook run: `yarn run storybook` - _hasn't been kept up to date though_
- To launch a debug Chrome instance, run: `yarn start chrome`  
  Attach to port `9222` using your debugger and you can debug in your IDE now!

## Auth

### `/auth/github`

Allows you to login using your github account and redirects to `/`.

#### `/auth/logout`

Logs you out and removes cookies.

#### `/test`

If logged in will display your user data stored in the databse.

## Api Design

All routes go through `/api/`, eg: `localhost:8000/api/polls`

---

## `/api/polls`

### `POST`

#### Usage

Create a new poll. If no namespace is provided, it will be created in `/public`

#### Expects

```json
{
  "creatorId": "1234",
  "pollName": "What furniture?",
  "description": "We are going to get some new furniture in the office!",
  "options": ["bean bags", "rocking chairs", "garden bench"],
  "voteLimit": 1,
  "optionVoteLimit": 1
}
```

#### Returns

Response code: `201`  
Description: Succesfully created a new poll in public.
Json:

```json
{
  "poll": {
    "pollId": "1",
    "creator": { "displayName": "Roy", "id": "1234" },
    "pollName": "What furniture?",
    "description": "We are going to get some new furniture in the office!",
    "isOpen": true,
    "voteLimit": 1,
    "optionVoteLimit": 1,
    "options": [
      { "optionId": 1, "value": "bean bags", "votes": [] },
      { "optionId": 2, "value": "rocking chairs", "votes": [] },
      { "optionId": 3, "value": "garden bench", "votes": [] }
    ]
  }
}
```

Response code: `400`  
Description: Failed to create poll, could be due to an issue with the
sent information  
Json: N/A

Response code: `401`  
Description: Unauthorized, authenitcation failed. Either you are not logged in
or JWT is invalid.  
Json: N/A

---

### `GET`

#### Usage

Gets a list of existing polls and their information.

#### Expects

N/A

#### Returns

Response code: `200`  
Description: Got a list of polls  
Json:

```json
{
  "polls": [
    {
      "pollId": "1",
      "creator": { "id": "1234", "displayName": "Roy" },
      "pollName": "What furniture?",
      "description": "We are going to get some new furniture in the office!",
      "isOpen": true,
      "voteLimit": 1,
      "optionVoteLimit": 1,
      "options": [
        {
          "optionId": "1",
          "value": "rocking chairs",
          "votes": [{ "id": "2345", "displayName": "Jed", "numberOfVotes": 1 }]
        },
        { "optionId": "2", "value": "garden bench", "votes": [] }
      ]
    },
    {
      "pollId": "2",
      "creator": { "id": "2345", "displayName": "Jed" },
      "pollName": "New monitors?",
      "description": "What type of monitor would you guys like?",
      "isOpen": true,
      "voteLimit": 2,
      "optionVoteLimit": 1,
      "options": [
        {
          "optionId": "1",
          "value": "dell",
          "votes": [
            { "id": "1234", "displayName": "Roy", "numberOfVotes": 2 },
            { "id": "2345", "displayName": "Jed", "numberOfVotes": 0 }
          ]
        },
        { "optionId": "2", "value": "acer", "votes": [] }
      ]
    }
  ]
}
```

---

## `/api/polls/:id`

### `POST`

#### Usage

Updates a specific poll

- You are only required to enter in the information that you wish to change.
- Id can not be changed, it can only be used for identification.
- You will only be able to update polls that you have created.
- If you provide an option without an optionId, a new option will be created.

#### Expects

```json
{
  "description": "What furniture do you want?",
  "pollName": "Changed Name",
  "voteLimit": 3,
  "optionVoteLimit": 1,
  "options": [
    { "optionId": "1", "value": "new option value" },
    { "optionId": "3", "value": "updated option 3" },
    { "optionId": "", "value": "new option!" }
  ]
}
```

#### Returns

Response Code: `200`  
Description: Succesfully updated poll information  
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creatorName": "Changed Name",
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": true,
    "voteLimit": 3,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "new option value",
        "votes": [
          { "id": "1234", "displayName": "Roy", "numberOfVotes": 1 },
          { "id": "1234", "displayName": "Jed", "numberOfVotes": 1 }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy", "numberOfVotes": 1 }]
      },
      { "optionId": 3, "value": "updated option 3", "votes": [] },
      { "optionId": 4, "value": "new option!", "votes": [] }
    ]
  }
}
```

Response Code: `400`  
Description: Failed to update poll, maybe syntax is invalid or poll with id
doesn't exist  
JSON: N/A

Response Code: `401`  
Description: Unauthorized, either you are not logged in or you are trying to
modify a poll that you did not create.  
JSON: N/A

---

### `GET`

#### Usage

Gets the data for a specific poll

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Got specific poll information  
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creator": { "id": "1234", "displayName": "Roy" },
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": true,
    "voteLimit": 3,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "bean-bags",
        "votes": [
          { "id": "2345", "displayName": "Jed", "numberOfVotes": 3 },
          { "id": "3456", "displayName": "Joy", "numberOfVotes": 0 }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy", "numberOfVotes": 2 }]
      },
      { "optionId": 3, "value": "garden bench", "votes": [] }
    ]
  }
}
```

Response Code: `400`  
Description: Failed to get poll information, poll with that id might not exist  
JSON: N/A

---

### `DELETE`

#### Usage

Deletes a specific poll

- You can only delete polls that you created

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Succesfully deleted poll  
JSON: N/A

Response Code: `400`  
Description: Failed to delete poll, maybe the poll with that id doesn't exist  
JSON: N/A

Response Code: `401`  
Description: Unauthorized, either you are trying to delete a poll you didn't
create, or JWT is invalid.  
JSON: N/A

---

## `/api/polls/:id/vote`

### `POST`

#### Usage

Casts a vote on an option within a specific poll and returns the updated poll.  
If the user has already voted on the option chosen, his previous vote should be removed.

#### Expects

```json
{
  "voterId": "4567",
  "optionId": "2"
}
```

#### Returns

Response Code: `200`  
Description: Succesfully voted for option in poll  
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creator": { "id": "1234", "displayName": "Roy" },
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": true,
    "voteLimit": 2,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "bean-bags",
        "votes": [
          { "id": "1234", "displayName": "Roy", "numberOfVotes": 1 },
          { "id": "2345", "displayName": "Jed", "numberOfVotes": 1 }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [
          { "id": "1234", "displayName": "Roy", "numberOfVotes": 1 },
          { "id": "4567", "displayName": "Jimmy", "numberOfVotes": 1 }
        ]
      },
      { "optionId": 3, "value": "garden bench", "votes": [] }
    ]
  }
}
```

Response Code: `400`  
Description: Vote was rejected, possibly due to invalid option id  
JSON: N/A

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
JSON: N/A

## `/api/polls/:id/remove-vote`

### `POST`

#### Usage

Rmoves a vote on an option within a specific poll and returns the updated poll.  
If the user does not have any votes on the option chosen, a 400 error will be returned.

#### Expects

```json
{
  "voterId": "4567",
  "optionId": "2"
}
```

#### Returns

Response Code: `200`
Description: Succesfully removed a vote on an option in a poll.
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creator": { "id": "1234", "displayName": "Roy" },
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": true,
    "voteLimit": 3,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "bean-bags",
        "votes": [
          { "id": "1234", "displayName": "Roy", "numberOfVotes": 1 },
          { "id": "2345", "displayName": "Jed", "numberOfVotes": 1 }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy", "numberOfVotes": 1 }]
      },
      { "optionId": 3, "value": "garden bench", "votes": [] }
    ]
  }
}
```

## `/api/polls/:id/open`

### `POST`

#### Usage

Sets a poll as open (users are able to vote on it) and returns the updated poll.

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Poll was successfully set to open  
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creatorName": "Changed Name",
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": true,
    "voteLimit": 2,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "new option value",
        "votes": []
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy", "numberOfVotes": 1 }]
      },
      { "optionId": 3, "value": "updated option 3", "votes": [] },
      { "optionId": 4, "value": "new option!", "votes": [] }
    ]
  }
}
```

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
JSON: N/A

## `/api/polls/:id/close`

### `POST`

#### Usage

Sets a poll as closed (users will be unable to vote on it) and returns the updated poll.

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Poll was successfully set to closed  
JSON:

```json
{
  "poll": {
    "pollId": "1",
    "creatorName": "Changed Name",
    "pollName": "What furniture?",
    "description": "What furniture do you want?",
    "isOpen": false,
    "voteLimit": 3,
    "optionVoteLimit": 1,
    "options": [
      {
        "optionId": 1,
        "value": "new option value",
        "votes": []
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy", "numberOfVotes": 1 }]
      },
      { "optionId": 3, "value": "updated option 3", "votes": [] },
      { "optionId": 4, "value": "new option!", "votes": [] }
    ]
  }
}
```

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
JSON: N/A

---

## `/api/users`

### `GET`

#### Usage

Gets an array of all existing users, or if query is provided,
returns an array of specified users data.  
For example `users?ids=25291974&ids=43615036`

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Got users  
JSON:

```json
{
  "users": [
    {
      "id": "1234",
      "displayName": "Jed",
      "userName": "jedsUsername",
      "emails": [
        {
          "value": "someEmail@hotmail.co.uk"
        }
      ]
    },
    {
      "id": "2345",
      "displayName": "Roy",
      "userName": "roysUsername",
      "emails": [
        {
          "value": "someOtherEmail@hotmail.co.uk"
        }
      ]
    }
  ]
}
```

---

## `/api/users/:id`

### `GET`

#### Usage

Gets an existing user by id

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Got a user  
JSON:

```json
{
  "user": {
    "id": "1234",
    "displayName": "Jed",
    "userName": "jedsUsername",
    "emails": [
      {
        "value": "someEmail@hotmail.co.uk"
      }
    ]
  }
}
```

---

## `/api/users/me`

### `GET`

#### Usage

Gets the currently logged in user's data

#### Expects

N/A

#### Returns

Response Code: `200`  
Description: Got a user  
JSON:

```json
{
  "user": {
    "id": "1234",
    "displayName": "Jed",
    "userName": "jedsUsername",
    "emails": [
      {
        "value": "someEmail@hotmail.co.uk"
      }
    ]
  }
}
```

Response Code: `401`  
Description: Unauthorized, not logged in or JWT is invalid  
JSON: N/A
