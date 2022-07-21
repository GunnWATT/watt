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
Returns a [`Schedule`](https://github.com/GunnWATT/watt/blob/api/docs/types.md#schedule) object of the current day's 
schedule, and a boolean indicating whether the schedule is an alternate. This information is returned as
```ts
{periods: Schedule, alternate: boolean}
```

##### Example successful response:
```json
{"periods": null, "alternate": false}
```
