# WATT API Docs
Welcome to WATT's API documentation! Information about the endpoints exposed by the API can be found here.
The base URL for WATT's REST API is `gunnwatt.web.app/api`.

### GET /alternates
<!-- TODO: replace all these URLs with ones linking to `main` when the PR is merged -->
Returns an [`Alternates`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#alternates) object corresponding
to WATT's current alternate schedules.

##### Example successful response:
```json
{"alternates": {}, "timestamp": "2022-04-30T19:15:30.052Z"}
```

### GET /schedule
Returns a [`Schedule`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#schedule) object corresponding to the 
requested day's schedule, and a boolean indicating whether that schedule is an alternate. This information is returned as
```ts
{periods: Schedule, alternate: boolean}
```

| Parameter           | Type     | Description                                                                                                             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `date` *(optional)* | `string` | An ISO timestamp representing the day to return the schedule for. If no date is provided, the current day will be used. |

| Status code | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| 200         | OK                                                                          |
| 400         | `query.date` was provided but not a string, or invalid as an ISO timestamp. |

##### Example successful response:
```json
{"periods": null, "alternate": false}
```

##### Example error response:
```json
{"message": "Error parsing date string: the input \"aaa\" can't be parsed as ISO 8601."}
```
