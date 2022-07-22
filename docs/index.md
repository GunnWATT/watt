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
requested day's schedule, and a boolean indicating whether that schedule is an alternate.

##### Response schema
```ts
{periods: Schedule, alternate: boolean}
```
- `periods`: The day's [`Schedule`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#schedule).
- `alternate`: Whether that schedule is an alternate.

##### Request parameters

| Parameter           | Type     | Description                                                                                                             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `date` *(optional)* | `string` | An ISO timestamp representing the day to return the schedule for. If no date is provided, the current day will be used. |

##### HTTP status codes

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
{"error": "Error parsing date string: the input \"aaa\" can't be parsed as ISO 8601."}
```

### GET /next-period
Returns a [`PeriodObj`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#periodobj) corresponding to the next or 
current period, the period immediately before it, and additional information for displaying those periods.

##### Response schema
```ts
{prev: PeriodObj | null, next: PeriodObj | null, startingIn: number, endingIn: number, nextSeconds: number}
```
- `prev`: A [`PeriodObj`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#periodobj) corresponding to the previous
  period, or `null` if there is none.
- `next`: A [`PeriodObj`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#periodobj) corresponding to the next or
  current period, or `null` is there is none.
- `startingIn`: The minutes until the `next` period starts, rounded down (if there is less than a minute left, this is `0`). 
  If the period has already started, this is negative. If there is no next period, this is `0`.
- `endingIn`: The minutes until the `next` period ends, rounded down. If there is no next period, this is `0`.
- `nextSeconds`: The seconds left in the current minute of the provided timestamp. When `startingIn` or `endingIn` are `0`
  and `next` is not null, you can use this to display `"ending in {...} seconds"` instead of `"ending in 0 minutes"`.

##### Request parameters

| Parameter           | Type     | Description                                                                                                                                 |
|---------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `date` *(optional)* | `string` | An ISO timestamp representing the date and time to get the next period for. If no date is provided, the current date and time will be used. |

##### HTTP status codes

| Status code | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| 200         | OK                                                                          |
| 400         | `query.date` was provided but not a string, or invalid as an ISO timestamp. |

##### Example successful response:
```json
{
  "prev": {"n": "B", "s": 635, "e": 640},
  "next": {"n": "6", "s": 650, "e": 740},
  "startingIn": 7,
  "endingIn": 97,
  "nextSeconds": 23
}
```

##### Example error response:
```json
{"error": "Error parsing date string: the input \"aaa\" can't be parsed as ISO 8601."}
```
