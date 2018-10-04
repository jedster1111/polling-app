# Polling App

## Setup

- To install dependencies run: `yarn install`
- In order for the github authentication to work, you must
  - Follow  [github's tutorial for creating an OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)  
    - Homepage Url might be `http://127.0.0.1:8000` while developing locally
    - Authorization callback URL would then be
      `http://127.0.0.1:8000/auth/github/callback`  
      ![github OAuth example](http://puu.sh/BExqF/c1e010896b.png)
  - You will then be provided with a clientId and a clientSecret.
  - create a secret file in `${rootDirectory}/secret/github.ts`.
    It must contain the following constants:
    ```json
      export const clientId = "githubProvidedClientId";
      export const clientSecret = "githubProvidedClientSecret";
      export const secret = "aUserGeneratedSecretKey";
    ```

## Development Server

- To start the server run: `yarn start`  
  _By default server will run on port 8000, you can change
  this by setting a `PORT` environment variable._  
  _Note that the server restarts on changes in the working directory and browser
  hot reloads_
- Visit `localhost:8000` to see the website

## Testing

- To execute tests with jest, run: `yarn test`
- To execute tests using testcafe, first ensure development server is running
  and run: `yarn run testcafe`

## Other Commands

- To start Storybook run: `yarn run storybook`
- To build, run: `yarn run build`  
  To run in watch mode, run `yarn run build -w`  
  _Note as ts-node is installed there's no need to build during development_
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

Create a new poll.

#### Expects

```json
{
  "creatorId": "1234",
  "pollName": "What furniture?",
  "description": "We are going to get some new furniture in the office!",
  "options": ["bean bags", "rocking chairs", "garden bench"]
}
```

#### Returns

Response code: `201`  
Description: Succesfully created a new poll  
Json:

```json
{
  "poll": {
    "pollId": "1",
    "creator": { "displayName": "Roy", "id": "1234" },
    "pollName": "What furniture?",
    "description": "We are going to get some new furniture in the office!",
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
      "options": [
        {
          "optionId": "1",
          "value": "rocking chairs",
          "votes": [{ "id": "2345", "displayName": "Jed" }]
        },
        { "optionId": "2", "value": "garden bench", "votes": [] }
      ]
    },
    {
      "pollId": "2",
      "creator": { "id": "2345", "displayName": "Jed" },
      "pollName": "New monitors?",
      "description": "What type of monitor would you guys like?",
      "options": [
        {
          "optionId": "1",
          "value": "dell",
          "votes": [
            { "id": "1234", "displayName": "Roy" },
            { "id": "2345", "displayName": "Jed" }
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
    "options": [
      {
        "optionId": 1,
        "value": "new option value",
        "votes": [
          { "id": "1234", "displayName": "Roy" },
          { "id": "1234", "displayName": "Jed" }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy" }]
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
    "options": [
      {
        "optionId": 1,
        "value": "bean-bags",
        "votes": [
          { "id": "2345", "displayName": "Jed" },
          { "id": "3456", "displayName": "Joy" }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [{ "id": "1234", "displayName": "Roy" }]
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

Casts a vote on an option within a specific poll.  
If the user has already voted on the option chosen, his previous vote should be removed.

#### Expects

```json
{
  "voterName": "Jimmy",
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
    "options": [
      {
        "optionId": 1,
        "value": "bean-bags",
        "votes": [
          { "id": "1234", "displayName": "Roy" },
          { "id": "2345", "displayName": "Jed" }
        ]
      },
      {
        "optionId": 2,
        "value": "rocking chairs",
        "votes": [
          { "id": "1234", "displayName": "Roy" },
          { "id": "4567", "displayName": "Jimmy" }
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
