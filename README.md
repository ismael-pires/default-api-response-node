# default-api-response-node
Default response model for API requests.

## Usage

```ts
import response from 'default-api-response-node';

app.use(response);
```

## Optional settings

You can control whether `version` and `endpoint` are included by default:

```ts
import response from 'default-api-response-node';

app.use(
	response({
		includeVersion: false,
		includeEndpoint: false,
	})
);
```

Per response call, you can still override these flags:

```ts
res.default(200, 'OK', data, true, false);
```
