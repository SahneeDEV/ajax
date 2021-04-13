# @sahnee/ajax

A dependency-free utility library for making AJAX requests in JavaScript & TypeScript.

## Installation

```
npm install @sahnee/ajax
```

## Usage

This library provides a simple to use API to make AJAX calls using fetch. If your browser does not support fetch (e.g. IE11) you need to provide a polyfill on your end.

This readme will provide a short overview of many basic functions, however your are urged to read the documentation included in the source before using.

### Simple AJAX request

The `ajax` funtcion is a thin wrapper over `fetch`:

```js
import { ajax } from '@sahnee/ajax';

const response = await ajax('account.sahnee.dev/api/flow/public_key');
const publicKey = await response.text();
// publicKey = ---- BEGIN PUBLIC KEY ---- \n [...]
```

The response is simply a plain JS `Response` in the same format as it would be returned by `fetch`.

### JSON AJAX request

This is one of the primary reasons this library was created. JSON AJAX requests have a nice abstraction around them by using the `json` function.

```js
import { json } from '@sahnee/ajax';

const todo = await json('https://jsonplaceholder.typicode.com/todos/1');
// todo = { userId: 1, id: 1, title: "delectus aut autem", completed: false }
```

Furthermore it allows you to easily send JSON data aswell:


```js
import { json } from '@sahnee/ajax';

const blogPost = await json('https://example.com/api/createBlogPost', {
  method: 'POST',
  json: {
    title: 'HTTP requests in depth',
    content: 'Lorem ipsum dolor sit amet [...]',
    tags: ['http', 'tutorial']
  }
});
// blogPost = whatever JSON your endpoint returned
```

### Flexible URL format

Specifying URLs can be annoying and a security risk if not done properly (query string injection, etc...). For this reason the library allows you to specify URLs as granular as possible while taking care of correctly escaping them.

The following examples all request data from the same URL `https://example.com/api/listUsers?page=42&sortBy=name&sortBy=mail`:

```js
import { ajax } from '@sahnee/ajax';

ajax('https://example.com/api/listUsers?page=42&sortBy=name&sortBy=mail');
ajax({ url: 'https://example.com/api/listUsers', search: { page: 42, sortBy: ['name', 'mail'] } });
ajax({ origin: 'https://example.com', url: ['api', 'listUsers'], search: { page: 42, sortBy: ['name', 'mail'] }});
```

Even more options are available:

- `url`: A string specifying the relevative (to the current origin) or absolute URL of the resource. (A string or a list of URL components which will be escaped and joined)
- `origin`: The origin domain the `url` is relative to. By default the current domain. (A string)
- `username`: The username for making the request. (A string, for HTTP authentication)
- `password`: The password for making the request. (A string, for HTTP authentication)
- `protocol`: The protocol to use. (A string, only `http` and `https` are officially supported)
- `port`: The port to use. (A number)
- `hash`: The hash to use.
- `search`: The search query parameters. (An object of strings to an URL component or a list of URL components)

There is also a function called `url` that simply returns the fully formatted URL without making any requests.

### Default options

You can set default options that will be applied to every request in the `defaultInit` object:

```js
import { defaultInit } from '@sahnee/ajax';

defaultInit.headers['x-auth'] = 'my-auth-token-123';
```

The default options will also be applied to the result of the `url` function.

## Important differences to fetch

- By default non success status codes will raise an `APIError`. This can be disabled by setting the `allowNonSuccessStatusCode` option to `true`.
- The `json` function fully abstracts the `Response` object away from the user.
