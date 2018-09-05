## Api Design
All routes go through `/api/`, eg: `www.polling-app.com/api/polls` <br>

### `/polls`
|  | GET | POST |
| --- | --- | --- |
| description | returns list of polls | adds poll, requires Name, Description, Options |
| expects | `N/A` | `{name: string, description: string, options: string[]}` |
| returns | `{ id: string, name: string, description: string }[]` | `{ id: string, name: string, description: string }[]` |

### `/polls/:id`
|  | GET | POST | DELETE |
| --- | --- | --- | --- |
| description | return poll | update poll with new Name, Description, Options or Votes | remove poll |
| expects | `N/A` | `{id: string, name: string, description: string}` | `N/A` |
| returns | `{id: string, name: string, description: string, options: string[]}` | `{id: string, name: string, description: string, options: string[]}` | `{id: string, name: string, description: string, options: string[]}` |
