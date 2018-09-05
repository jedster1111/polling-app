## Api Design
All routes go through `/api/`, eg: `www.polling-app.com/api/polls` <br>

### `/polls`
| GET | POST |
| --- | --- |
| returns list of polls | adds poll, requires Name, Description, Options |

### `/polls/:id`
| GET | POST | DELETE |
| --- | --- | --- |
| return poll | update poll with new Name, Description, Options or Votes | remove poll |
