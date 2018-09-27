## Setup

- To install dependencies run: `yarn install`

### Development Server

- To start the server run: `yarn start` <br>
  *By default server will run on port 8000, you can change this by setting a `PORT` environment variable.*
  <br>
  _Note that the server restarts on changes in the working directory and browser hot reloads_ <br>
- Visit `localhost:8000` to see the website <br>

### Testing

- To execute tests with jest, run: `yarn test` <br>
- To execute tests using testcafe, first ensure development server is running and run: `yarn run testcafe`

### Other Commands

- To start Storybook run: `yarn run storybook` <br>
- To build, run: `yarn run build` <br>
  To run in watch mode, run `yarn run build -- -w` <br>
  _Note as ts-node is installed there's no need to build during development_ <br>
- To launch a debug Chrome instance, run: `yarn start chrome` <br>
  Attach to port `9222` using your debugger and you can debug in your IDE now!

## Auth

#### `/auth/github`

Allows you to login using your github account and redirects to `/`.

#### `/auth/logout`

Logs you out and removes cookies/deletes session.

#### `/test`

If logged in will display your user data stored in the databse.

## Api Design

All routes go through `/api/`, eg: `localhost:8000/api/polls` <br>

---

### `POST /api/polls`

#### Usage

Create a new poll.

#### Expects

```
{
	creatorId: "1234",
	pollName: "What furniture?",
	description: "We are going to get some new furniture in the office!",
	options: [
		"bean bags",
		"rocking chairs",
		"garden bench"
	]
}
```

#### Returns

Response code: `201` <br>
Description: Succesfully created a new poll <br>
Json:

```
{
	poll: {
		pollId: "1",
		creator: {displayName: "Roy", id: "1234"},
		pollName: "What furniture?",
		description: "We are going to get some new furniture in the office!",
		options: [
			{optionId: 1, value: "bean bags", votes: []},
			{optionId: 2, value: "rocking chairs", votes: []},
			{optionId: 3, value: "garden bench", votes: []},
		]
	}
}
```

---

Response code: `400` <br>
Description: Failed to create poll, could be due to an issue with the sent information <br>
Json: N/A

---

### `GET /api/polls`

#### Usage

Gets a list of existing polls and their information.

#### Expects

N/A

#### Returns

Response code: `200` <br>
Description: Got a list of polls <br>
Json:

```
{
	polls: {[
		{
			pollId: "1",
			creatorName: "Roy",
			pollName: "What furniture?",
			description: "We are going to get some new furniture in the office!",
			options: [
				{optionId: 1, value: "bean bags", votes: ["Jed", "James"]},
				{optionId: 2, value: "rocking chairs", votes: ["Roy"]},
				{optionId: 3, value: "garden bench", votes: []},
			]
		},
		{
			pollId: "2",
			creatorName: "Jed",
			pollName: "New monitors?",
			description: "What type of monitor would you guys like?",
			options: [
				{optionId: 1, value: "dell", votes: ["Jed", "James"]},
				{optionId: 2, value: "acer", votes: ["Roy"]}
			]
		}
	]}
}
```

---

### `POST /api/polls/:id`

#### Usage

Updates a specific poll <br>
You are only required to enter in the information that you wish to change. <br>
Id can not be changed, it can only be used for identification. <br>

#### Expects

```
{
	description: "What furniture do you want?",
	pollName: "Changed Name",
	options: [
		{optionId: "1", value: "new option value"},
		{optionId: "3", value: "updated option 3"},
		{optionId: "", value: "new option!"}
	]
}
```

#### Returns

Response Code: `200` <br>
Description: Succesfully updated poll information <br>
JSON:

```
{
	poll: {
		pollId: "1",
		creatorName: "Changed Name",
		pollName: "What furniture?",
		description: "What furniture do you want?",
		options: [
			{optionId: 1, value: "new option value", votes: ["Jed", "James"]},
			{optionId: 2, value: "rocking chairs", votes: ["Roy"]},
			{optionId: 3, value: "updated option 3", votes: []},
			{optionId: 4, value: "new option!", votes: []}
		]
	}
}
```

---

Response Code: `400` <br>
Description: Failed to update poll, maybe syntax is invalid or poll with id doesn't exist <br>
JSON: N/A

---

### `GET /api/polls/:id`

#### Usage

Gets the data for a specific poll

#### Expects

N/A

#### Returns

Response Code: `200` <br>
Description: Got specific poll information <br>
JSON:

```
{
	poll: {
		pollId: "1",
		creatorName: "Roy",
		pollName: "What furniture?",
		description: "What furniture do you want?",
		options: [
			{optionId: 1, value: "bean-bags", votes: ["Jed", "James"]},
			{optionId: 2, value: "rocking chairs", votes: ["Roy"]},
			{optionId: 3, value: "garden bench", votes: []},
		]
	}
}
```

---

Response Code: `400` <br>
Description: Failed to get poll information, poll with that id might not exist <br>
JSON: N/A

---

### `DELETE /api/polls/:id`

#### Usage

Deletes a specific poll

#### Expects

N/A

#### Returns

Response Code: `200` <br>
Description: Succesfully deleted poll <br>
JSON: N/A

---

Response Code: `400` <br>
Description: Failed to delete poll, maybe the poll with that id doesn't exist <br>
JSON: N/A

---

### `POST /api/polls/:id/vote`

#### Usage

Casts a vote on an option within a specific poll. <br>
If the user has already voted on the option chosen, his previous vote should be removed.

#### Expects

```
{
	voterName: "Jimmy",
	optionId: "2"
}
```

#### Returns

Response Code: `200` <br>
Description: Succesfully voted for option in poll <br>
JSON:

```
{
	poll: {
		pollId: "1",
		creatorName: "Roy",
		pollName: "What furniture?",
		description: "What furniture do you want?",
		options: [
			{optionId: 1, value: "bean-bags", votes: ["Jed", "James"]},
			{optionId: 2, value: "rocking chairs", votes: ["Roy", "Jimmy"]},
			{optionId: 3, value: "garden bench", votes: []},
		]
	}
}
```

---

Response Code: `400` <br>
Description: Vote was rejected, possibly due to invalid option id <br>
JSON: N/A

---

### `GET /api/users` or `GET /api/users?ids=25291974`

#### Usage

Gets an array of all existing users, or if query is provided, returns an array of specified users data.

#### Expects

N/A

#### Returns

Response Code: `200` <br>
Description: Got users <br>
JSON:

```
{
	users: [
		{
			id: "25291974",
			displayName: "Jed Thompson",
			userName: "jedster1111",
			emails: [{"value":"jedster1111@hotmail.co.uk"}]
		}
	]
}
```

---

### `GET /api/users/:id`

#### Usage

Gets an existing user by id

#### Expects

N/A

#### Returns

Response Code: `200` <br>
Description: Got a user <br>
JSON:

```
{
	user: {
		id: "25291974",
		displayName: "Jed Thompson",
		userName: "jedster1111",
		emails: [
			{
				value: "jedster1111@hotmail.co.uk"
			}
		],
	}
}
```

---

### `GET /api/users/me`

#### Usage

Gets the currently logged in user's data

#### Expects

N/A

#### Returns

Response Code: `200` <br>
Description: Got a user <br>
JSON:

```
{
	user: {
		id: "25291974",
		displayName: "Jed Thompson",
		userName: "jedster1111",
		emails: [
			{
				value: "jedster1111@hotmail.co.uk"
			}
		],
	}
}
```
