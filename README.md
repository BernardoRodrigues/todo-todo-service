
## GET service/todo/

Fetches all reminders based on user id

### Request Headers
	* Authorization: Bearer token

Response:
* HTTP code 200
```json
[
	{
		"id": "2fa93254-184a-11ec-9621-0242ac130002",
		"userId": "4e129b14-18ad-11ec-9621-0242ac130002",
		"title": "Reminder",
		"startDate": "\"2021-08-18T18:24:15.509Z\"",
		"endDate": "\"2021-09-18T18:24:15.509Z\"",
		"priorityID": "1", 
		"priorityValue": "HIGH",
		"isDone": "false",
		"isCancelled": "false"
	},
	...
]
```

* HTTP code 405
```json
{ "message": "Unauthorized" }
```
* HTTP code 500
```json
{ "message": "Server Error" }
```

## POST service/todo/
Creates a reminder

### Request Headers
	* Authorization: Bearer token

Request body:
```json
{
	 "title": "Reminder",
	"startDate": "\"2021-08-18T18:24:15.509Z\"",
	"endDate": "\"2021-09-18T18:24:15.509Z\"",
	"priorityID": "1", 
}
```
Response:
* HTTP code 201
```json
{ 
	"id": "54fdf009-0270-461a-beeb-89d57ed3bc42"
 }
```

* HTTP code 400 
```json
{ "message": "$$name$$ cannot be null" }
```

* HTTP code 405
```json
{ "message": "Unauthorized" }
```

* HTTP code 500
```json
{ "message": "Server error" }
```


## PUT service/todo/:id
Updates reminder values

### Request Headers
	* Authorization: Bearer token

Request body:
```json
{
	 "title": "Reminder",
	"startDate": "\"2021-08-18T18:24:15.509Z\"",
	"endDate": "\"2021-09-18T18:24:15.509Z\"",
	"priorityID": "1", 
}
```
Response:
* HTTP code 200
```json
{
    "id": "54fdf009-0270-461a-beeb-89d57ed3bc42"
}
```

* HTTP code 400 
```json
{ "message": "$$name$$ cannot be null" }
```

* HTTP code 405
```json
{ "message": "Unauthorized" }
```

* HTTP code 500
```json
{ "message": "Server error" }
```

## PUT service/todo/status/:id
Sets reminder to done or not done

### Request Headers
	* Authorization: Bearer token

Request body:
```json
{
	 "status": "true"
}
```
Response:
* HTTP code 200
```json
{
    "id": "54fdf009-0270-461a-beeb-89d57ed3bc42"
}
```

* HTTP code 400 
```json
{ "message": "$$name$$ cannot be null" }
```

* HTTP code 405
```json
{ "message": "Unauthorized" }
```

* HTTP code 500
```json
{ "message": "Server error" }
```

## PUT service/todo/cancel/:id
Cancels reminder

### Request Headers
	* Authorization: Bearer token

Response:
* HTTP code 200
```json
{
    "id": "54fdf009-0270-461a-beeb-89d57ed3bc42"
}
```

* HTTP code 400 
```json
{ "message": "$$name$$ cannot be null" }
```

* HTTP code 405
```json
{ "message": "Unauthorized" }
```

* HTTP code 500
```json
{ "message": "Server error" }
```
