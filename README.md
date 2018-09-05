## Commands
To run a file while watching for changes in tsDist directory to restart: `npm run nodemon -- (path to file)` <br>
For example: `npm run nodemon -- tsDist/server/server`

To compile ts files inside src directory into tsDist directory while watching for changes, run: `tsc -w`

## Api Design
All routes go through `/api/`, eg: `www.polling-app.com/api/polls` <br>

------
### `POST /polls`
#### Usage
Create a new poll.
#### Expects
```
{ 
	creatorName: "Roy",
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
Response code: `200` <br>
Description: Succesfully created a new poll <br>
Json:
```
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
}
```

------
Response code: `400` <br>
Description: Failed to create poll, could be due to an issue with the sent information <br>
Json: N/A

------
### `GET /polls`
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
	polls: [
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
	]
}
```
------
### `POST /polls/:id`
#### Usage
Updates a specific poll <br>
You are only required to enter in the information that you wish to change. <br>
Id can not be changed, it can only be used for identification.
#### Expects
```
{
	description: "What furniture do you want?",
	options: [
		{optionId: 1, value: "bar stools"},
	]
}
```
#### Returns
Response Code: `200` <br>
Description: Succesfully updated poll information <br>
JSON:
```
{
	pollId: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "What furniture do you want?",
	options: [
		{optionId: 1, value: "bar stools", votes: ["Jed", "James"]},
		{optionId: 2, value: "rocking chairs", votes: ["Roy"]},
		{optionId: 3, value: "garden bench", votes: []},
	]
}
```
------
Response Code: `400` <br>
Description: Failed to update poll, maybe syntax is invalid or poll with id doesn't exist <br>
JSON: N/A

------
### `GET /polls/:id`
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
```
------
Response Code: `400` <br>
Description: Failed to get poll information, poll with that id might not exist <br>
JSON: N/A

------
### `DELETE /polls/:id`
#### Usage
Deletes a specific poll
#### Expects
N/A
#### Returns
Response Code: `200` <br>
Description: Succesfully deleted poll <br>
JSON: N/A

------
Response Code: `400` <br>
Description: Failed to delete poll, maybe the poll with that id doesn't exist <br>
JSON: N/A

------
### `POST /polls/:id/vote`
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
```
------
Response Code: `400` <br>
Description: Vote was rejected, possibly due to invalid option id <br>
JSON:
```
{
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
```
------

