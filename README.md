## Api Design
All routes go through `/api/`, eg: `www.polling-app.com/api/polls` <br>

### `POST /polls`
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
Description: `Created a new poll` <br>
Json:
```
{
	id: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "We are going to get some new furniture in the office!",
	options: [
		{id: 1, value: "bean bags", votes: ["Jed", "James"]},
		{id: 2, value: "rocking chairs", votes: ["Roy"]},
		{id: 3, value: "garden bench", votes: []},
	]
}
```
### `GET /polls`
#### Expects
`N/A`
#### Returns
Response code: `200` <br>
Description: `Got a list of polls` <br>
Json:
```
{
	polls: [
		{
			id: "1",
			creatorName: "Roy",
			pollName: "What furniture?",
			description: "We are going to get some new furniture in the office!",
			options: [
				{id: 1, value: "bean bags", votes: ["Jed", "James"]},
				{id: 2, value: "rocking chairs", votes: ["Roy"]},
				{id: 3, value: "garden bench", votes: []},
			]
		},
		{
			id: "2",
			creatorName: "Jed",
			pollName: "New monitors?",
			description: "What type of monitor would you guys like?",
			options: [
				{id: 1, value: "dell", votes: ["Jed", "James"]},
				{id: 2, value: "acer", votes: ["Roy"]}
			]
		}
	]
}
```
### `POST /polls/:id`
#### Expects
```
{
	id: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "What furniture do you want?",
	options: [
		{id: 1, value: "bean-bags"},
	]
}
```
#### Returns
Response Code: `200` <br>
Description: `Succesfully updated poll information` <br>
JSON:
```
{
	id: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "What furniture do you want?",
	options: [
		{id: 1, value: "bean-bags", votes: ["Jed", "James"]},
		{id: 2, value: "rocking chairs", votes: ["Roy"]},
		{id: 3, value: "garden bench", votes: []},
	]
}
```
### `GET /polls/:id`
#### Expects
`N/A`
#### Returns
Response Code: `200` <br>
Description: `Succesfully updated poll information` <br>
JSON:
```
{
	id: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "What furniture do you want?",
	options: [
		{id: 1, value: "bean-bags", votes: ["Jed", "James"]},
		{id: 2, value: "rocking chairs", votes: ["Roy"]},
		{id: 3, value: "garden bench", votes: []},
	]
}
```
### `DELETE /polls/:id`
#### Expects
`N/A`
#### Returns
Response Code: `200` <br>
Description: `Succesfully updated poll information` <br>
JSON:
```
I deleted poll with id 2 in this example
{
	polls: [
		{
			id: "1",
			creatorName: "Roy",
			pollName: "What furniture?",
			description: "We are going to get some new furniture in the office!",
			options: [
				{id: 1, value: "bean bags", votes: ["Jed", "James"]},
				{id: 2, value: "rocking chairs", votes: ["Roy"]},
				{id: 3, value: "garden bench", votes: []},
			]
		}
	]
}
```
### `POST /polls/:id/vote`
#### Expects
```
{
	id: "1",
	voterName: "Jimmy",
	optionID: "2"
}
```
#### Returns
Response Code: `200` <br>
Description: `Succesfully updated poll information` <br>
JSON:
```
{
	id: "1",
	creatorName: "Roy",
	pollName: "What furniture?",
	description: "What furniture do you want?",
	options: [
		{id: 1, value: "bean-bags", votes: ["Jed", "James"]},
		{id: 2, value: "rocking chairs", votes: ["Roy", "Jimmy"]},
		{id: 3, value: "garden bench", votes: []},
	]
}
```

