# RESTful APIs

RESTful APIs provided by the Gorse server are listed in this section. For more detailed information, please browse the interactive API document at `http://<server node IP>:<server node port>/apidocs`.

## Authorization

By default, there is no authorization required for RESTful APIs. Authorization can be enabled by set `api_key` in config file:

```toml
[server]

# Secret key for RESTful APIs (SSL required).
api_key = "*****"
```

The API key is passed through `X-API-Key` header.

```bash
curl -H "X-API-Key: *****"  http://127.0.0.1:8087/api/recommend/bob?n=10
```

## Default Length of Returned List

There are RESTful APIs returns collections (users, items or feedbacks). The default number of returned elements is specified in configuration file:

```toml
[server]

# Default number of returned items. The default value is 10.
default_n = 10
```

## Clock Error

Gorse use timestamps to invalid recommended items and etc.. However, clocks on different nodes might differ from each other. The maximal clock error is specified in config file to ensure the system works properly.

```toml
[server]

# Clock error in the cluster. The default value is 5s.
clock_error = "5s"
```

## Item APIs

| Method | URL | Description |
|-|-|-|
| POST | /item | Insert an item.<br>Overwrite if the item exists. |
| GET | /item/{item-id} | Get an item. |
| PATCH | /item/{item-id} | Modify an item. |
| DELETE | /item/{item-id} | Delete an item and its feedbacks. |
| POST | /items | Insert items. Overwrite if items exist. |
| GET | /items | Get items. |
| PUT | /item/{item-id}/category/{category} | Append a category to an item. |
| DELETE | /item/{item-id}/category/{category} | Delete a category from an item. |

## User APIs

| Method | URL | Description |
|-|-|-|
| POST | /user | Insert a user. Overwrite if the user exists. |
| GET | /user/{user-id} | Get a user. |
| PATCH | /user/{user-id} | Modify a user. |
| DELETE | /user/{user-id} | Delete a user and his or her feedbacks. |
| GET | /users | Get users. |

## Feedback APIs

| Method | URL | Description |
|-|-|-|
| POST | /feedback | Insert feedbacks.<br>Ignore if exists. |
| PUT | /feedback | Insert feedbacks.<br>Overwrite if exists. |
| GET | /feedback | Get feedbacks. |
| GET | /feedback/{feedback-type} | Get feedbacks with<br>feedback type. |
| GET | /feedback/{user-id}/{item-id} | Get feedbacks between<br>a user and a item. |
| DELETE | /feedback/{user-id}/{item-id} | Delete feedbacks between<br>a user and a item. |
| GET | /feedback/{feedback-type}/{user-id}/{item-id} | Get feedbacks between<br>a user and a item<br>with feedback type.. |
| DELETE | /feedback/{feedback-type}/{user-id}/{item-id} | Delete feedbacks between<br>a user and a item<br>with feedback type.. |
| GET | /user/{user-id}/feedback | Get feedback by user id. |
| GET | /user/{user-id}/feedback/{feedback-type} | Get feedbacks by user id<br>with feedback type. |
| GET | /item/{item-id}/feedback | Get feedback by item id. |
| GET | /item/{item-id}/feedback/{feedback-type} | Get feedbacks by item id<br>with feedback type. |

## Recommendation APIs

| Method | URL | Description |
|-|-|-|
| GET | /popular | Get popular items. |
| GET | /popular/{category} | Get popular items in category. |
| GET | /latest | Get latest items. |
| GET | /latest/{category} | Get latest items in category. |
| GET | /item/{item-id} | Get neighbors of an item. |
| GET | /item/{item-id}/{category} | Get neighbors of an item in category. |
| GET | /user/{user-id}/neighbors | Get neighbors of a user. |
| GET | /recommend/{user-id} | Get recommendations for a user. |
| GET | /recommend/{user-id}/{category} | Get recommendations for a user<br>in category. |
