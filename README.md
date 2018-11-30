# Polling App

An application to create and vote on polls, written in Typescript. Currently trying to set up CI!

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
    - [Models](#models)
      - [Poll](#poll)
      - [User](#user)
    - [`/api/polls`](#apipolls)
      - [`POST`](#post)
        - [Usage](#usage)
          - [Expects](#expects)
          - [Returns](#returns)
      - [`GET`](#get)
      - [Usage](#usage-1)
      - [Expects](#expects-1)
      - [Returns](#returns-1)
    - [`/api/polls/:namespace`](#apipollsnamespace)
      - [`POST`](#post-1)
        - [Usage](#usage-2)
          - [Expects](#expects-2)
          - [Returns](#returns-2)
      - [`GET`](#get-1)
        - [Usage](#usage-3)
          - [Expects](#expects-3)
          - [Returns](#returns-3)
    - [`/api/polls/:namespace/:id`](#apipollsnamespaceid)
      - [`POST`](#post-2)
        - [Usage](#usage-4)
          - [Expects](#expects-4)
          - [Returns](#returns-4)
      - [`GET`](#get-2)
        - [Usage](#usage-5)
          - [Expects](#expects-5)
          - [Returns](#returns-5)
      - [`DELETE`](#delete)
        - [Usage](#usage-6)
          - [Expects](#expects-6)
          - [Returns](#returns-6)
    - [`/api/polls/:namespace/:id/vote`](#apipollsnamespaceidvote)
      - [`POST`](#post-3)
        - [Usage](#usage-7)
          - [Expects](#expects-7)
          - [Returns](#returns-7)
    - [`/api/polls/:namespace/:id/remove-vote`](#apipollsnamespaceidremove-vote)
      - [`POST`](#post-4)
        - [Usage](#usage-8)
          - [Expects](#expects-8)
          - [Returns](#returns-8)
    - [`/api/polls/:namespace/:id/open`](#apipollsnamespaceidopen)
      - [`POST`](#post-5)
        - [Usage](#usage-9)
          - [Expects](#expects-9)
          - [Returns](#returns-9)
    - [`/api/polls/:namespace/:id/close`](#apipollsnamespaceidclose)
      - [`POST`](#post-6)
        - [Usage](#usage-10)
          - [Expects](#expects-10)
          - [Returns](#returns-10)
    - [`/api/users`](#apiusers)
      - [`GET`](#get-3)
        - [Usage](#usage-11)
          - [Expects](#expects-11)
          - [Returns](#returns-11)
    - [`/api/users/:id`](#apiusersid)
      - [`GET`](#get-4)
        - [Usage](#usage-12)
          - [Expects](#expects-12)
          - [Returns](#returns-12)
    - [`/api/users/me`](#apiusersme)
      - [`GET`](#get-5)
        - [Usage](#usage-13)
          - [Expects](#expects-13)
          - [Returns](#returns-13)

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

Allows you to login using your github account and then redirects to your previous location.

#### `/auth/logout`

Logs you out and removes cookies.

#### `/test`

If logged in will display your user data stored in the databse.

## Api Design

All routes go through `/api/`, eg: `localhost:8000/api/polls`

### Models

#### Poll

```
{
  description: string,
  pollId: string,
  pollName: string,
  voteLimit: number,
  creator: User,
  options: [
    {
      optionId: string,
      value: string,
      votes: []
    },
    {
      optionId: string,
      value: string,
      votes: []
    },
    {
      optionId: string,
      value: string,
      votes: []
    },
    {
      optionId: string,
      value: string,
      votes: []
    }
  ],
  isOpen: boolean,
  totalVotes: number,
  optionVoteLimit: number,
  namespace: string
}
```

#### User

```
{
  displayName?: string,
  id: string,
  userName: string,
  photos: [
    {
      value: string
    }
  ]
}
```

### `/api/polls`

#### `POST`

##### Usage

Create a new poll. If no namespace is provided, it will be created in `/public`

###### Expects

```
{
  poll: {
    pollName: string,
    description: string,
    options: string[],
    voteLimit: int,
    optionVoteLimit: int,
    namespace?: string
  }
}
```

###### Returns

Response code: `201`  
Description: Succesfully created a new poll in public.  
Returns:

```
{
  poll: Poll
}
```

---

#### `GET`

#### Usage

Gets a list of existing polls and their information.

#### Expects

N/A

#### Returns

Response code: `200`  
Description: Got a list of polls  
Returns:

```
{
  polls: Poll[]
}
```

---

### `/api/polls/:namespace`

#### `POST`

##### Usage

Create a new poll. If no namespace is provided, it will be created in the url provided namespace.

###### Expects

```
{
  poll: {
    pollName: string,
    description: string,
    options: string[],
    voteLimit: int,
    optionVoteLimit: int,
    namespace?: string
  }
}
```

###### Returns

Response code: `201`  
Description: Succesfully created a new poll in public.  
Returns:

```
{
  poll: Poll
}
```

---

#### `GET`

##### Usage

Gets a specific poll.

###### Expects

N/A

###### Returns

Response code: `200`  
Description: Got a poll  
Returns:

```
{
  polls: Poll
}
```

Response Code: `400`  
Description: Poll probably wasn't found  
Returns: N/A

---

### `/api/polls/:namespace/:id`

#### `POST`

##### Usage

Updates a specific poll

- You are only required to enter in the information that you wish to change.
- Id can not be changed, it can only be used for identification.
- You will only be able to update polls that you have created.
- If you provide an option without an optionId, a new option will be created.
- If you prived an option with an optionId but without a value, the option specfied will be deleted.

###### Expects

```
{
  description?: string,
  pollName?: string,
  voteLimit?: integer,
  optionVoteLimit?: integer,
  options?: [
    { optionId: string, value: string },
    { optionId: string, value: "" }, // --> This option will be removed
    { optionId: "", value: "new option!" } // -> This option will be added
  ]
}
```

###### Returns

Response Code: `200`  
Description: Succesfully updated poll information  
Returns:

```
{
  poll: Poll
}
```

Response Code: `400`  
Description: Failed to update poll, maybe syntax is invalid or poll with id
doesn't exist  
Returns: N/A

Response Code: `401`  
Description: Unauthorized, either you are not logged in or you are trying to
modify a poll that you did not create.  
Returns: N/A

---

#### `GET`

##### Usage

Gets the data for a specific poll

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Got specific poll information  
Returns:

```
{
  poll: Poll
}
```

Response Code: `400`  
Description: Failed to get poll information, poll with that id might not exist  
Returns: N/A

---

#### `DELETE`

##### Usage

Deletes a specific poll

- You can only delete polls that you created

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Succesfully deleted poll  
Returns: N/A

Response Code: `400`  
Description: Failed to delete poll, maybe the poll with that id doesn't exist  
Returns: N/A

Response Code: `401`  
Description: Unauthorized, either you are trying to delete a poll you didn't
create, or JWT is invalid.  
Returns: N/A

---

### `/api/polls/:namespace/:id/vote`

#### `POST`

##### Usage

Casts a vote on an option within a specific poll and returns the updated poll.

###### Expects

```
{
  optionId: string
}
```

###### Returns

Response Code: `200`  
Description: Succesfully voted for option in poll  
Returns:

```
{
  poll: Poll
}
```

Response Code: `400`  
Description: Vote was rejected, could be invalid optionId, poll not found, or you don't have any votes remaining.  
Returns: N/A

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
Returns: N/A

### `/api/polls/:namespace/:id/remove-vote`

#### `POST`

##### Usage

Rmoves a vote on an option within a specific poll and returns the updated poll.  
If the user does not have any votes on the option chosen, a 400 error will be returned.

###### Expects

```
{
  optionId: string
}
```

###### Returns

Response Code: `200`
Description: Succesfully removed a vote on an option in a poll.
Returns:

```
{
  poll: Poll
}
```

Response Code: `400`  
Description: Vote was rejected, could be invalid optionId, poll not found, or you don't have any votes to remove.  
Returns: N/A

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
Returns: N/A

### `/api/polls/:namespace/:id/open`

#### `POST`

##### Usage

Sets a poll as open (users are able to vote on it) and returns the updated poll.

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Poll was successfully set to open  
Returns:

```
{
  poll: Poll
}
```

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
Returns: N/A

### `/api/polls/:namespace/:id/close`

#### `POST`

##### Usage

Sets a poll as closed (users will be unable to vote on it) and returns the updated poll.

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Poll was successfully set to closed  
Returns:

```
{
  poll: Poll
}
```

Response Code: `401`  
Description: Unauthorized, you are not logged in or JWT is invalid  
Returns: N/A

---

### `/api/users`

#### `GET`

##### Usage

Gets an array of all existing users, or if query is provided,
returns an array of specified users data.  
For example `users?ids=25291974&ids=43615036`

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Got users  
Returns:

```
{
  users: User[]
}
```

---

### `/api/users/:id`

#### `GET`

##### Usage

Gets an existing user by id

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Got a user  
Returns:

```
{
  user: User
}
```

---

### `/api/users/me`

#### `GET`

##### Usage

Gets the currently logged in user's data

###### Expects

N/A

###### Returns

Response Code: `200`  
Description: Got a user  
Returns:

```
{
  user: User
}
```

Response Code: `401`  
Description: Unauthorized, not logged in or JWT is invalid  
Returns: N/A
