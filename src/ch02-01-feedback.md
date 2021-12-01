# Feedback Collection

In a recommender system, data is the foundation of all recommendation results, and this section will briefly introduce how to collect user data for the Gorse recommender system. The recommender system relies on the feedback between users and items as training data, and the quality of training data determines the quality of recommendations.

## Users, Items, and Feedback

The recommender system is complex, but to maximize reusability, Gorse has abstracted the data used in a recommender system as a collection of three entities: users, items, and feedback.

- **User:** A user entity consists of a user ID and labels describing the user. The user labels can be empty, but these labels help to improve the recommendation accuracy of the recommender system.

```go
type User struct {
    UserId    string
    Labels    []string
}
```

- **Item:** A item entity consists of an item ID, an item timestamp, and labels describing the item. The timestamp and labels can be empty, and similarly based on labels information helps to improve the recommendation accuracy of the recommender system, while the timestamp is used to estimate the freshness of the item.

```go
type Item struct {
    ItemId    string
    Timestamp time.Time
    Labels    []string
}
```

- **Feedback:** A feedback entity consists of user ID, item ID, feedback type, and feedback timestamp, where the triad of user ID, item ID, and feedback type is required to be unique in the database.

Feedback represents events that happened between users and items, which can be positive or negative. For example, sharing and liking are the user's positive feedback to an item. If the user does not have further positive feedback after reading, the user's feedback on the item is considered negative. If the user views the item, read feedback will be recorded. Then, if the user gives positive feedback to the item, the read feedback will be overwritten by the positive feedback. Conversely, if the user does not give positive feedback, then the read feedback is considered negative feedback.

```go
type Feedback struct {
    FeedbackType string
    UserId       string
    ItemId       string
    Timestamp    time.Time
}
```

Gorse's server node provides RESTful APIs for inserting users, items, and feedback, as well as getting a recommendation for users. Please refer to the RESTful API documentation for a detailed description.

| METHOD |  URL |   DESCRIPTION |
|-|-|-|
| POST |    /api/item | Insert item. |
| POST |    /api/user | Insert user. |
| POST |    /api/feedback | Insert feedback if the feedback not exist. |
| PUT | /api/feedback | Insert feedback, and overwrites existed feedback. |

## Define Positive Feedback and Read Feedback

Before inserting feedback into the Gorse recommender system, it is necessary to define which of the user's behaviors are positive feedback and which are read feedback. Read feedback is relatively easy to define, as it can be recorded as read feedback when a user has seen the recommended item. However, the definition of positive feedback depends more on the specific scenario. For TikTok, users can be considered as positive feedback if they “like” or “share” the current video; for YouTube, users can be considered as positive feedback if they watch the video to a certain proportion of completion, “like“ the video, or "share" the video. To summarize, positive feedback and read feedback are defined by the following rules.

- **Read Feedback:** The user sees the item.
- **Positive feedback:** The user action that is expected to do by the service provider.

For example, if Gabe Newell wants to build a recommender system for Steam based on Gorse, clicking into the game introduction page could be treated as read feedback (the game list page has too little information to determine that the user has read it), and then actions such as adding a wish list and adding a shopping cart are treated as positive feedback. Finally, set them in the configuration file as follows.

```toml
# Add to wishlist or cart
positive_feedback_types = ["wish_list", "cart"]

# Read the game introduction page
read_feedback_types = ["read"]
```

## Insert Positive Feedback

For positive feedback, it can be inserted when the user performs the action, where the timestamp is the current timestamp.

```bash
curl -X POST "http://127.0.0.1:8088/api/feedback" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d '[ { "FeedbackType": "read", "ItemId": "10086", "Timestamp": "2021-10-24T06:42:20.207Z", "UserId": "jack" }]'
```

## Insert Read Feedback

For read feedback, the timestamp can be used to set the timeout of the recommendation results, in addition to recording the read time.

### Proactive Insertion

Positive feedback can be inserted into the recommender system when the user takes the action, while read feedback requires the application to detect the user's "read" behavior. The methods for displaying recommendations vary by application but can be generally grouped into two categories.

- **Full-screen mode:** The most typical application is TikTok, where the user is considered "read" when the full-screen content is shown to them. That is, the application can write a "read" feedback to the recommender system when the recommended content is shown to the user, and the read content will no longer be shown to the user.

<img src="/img/ch2/tiktok.jpg" width="300">
<img src="/img/ch2/youtube.jpg" width="300">

- **List mode:** The most typical application is YouTube, where the user is not considered "read" after looking at multiple videos in the list. When there are more than one videos, the user's attention is not able to browse the whole list. Moreover, if the read content is quickly discarded in the list mode, the recommended content is consumed too fast. Therefore, the best solution is to write a "read" feedback with a future timestamp to the recommender system when the item is presented to the user in the stream, and the "read" feedback will take effect when the time has reached the timestamp, and the read content will no longer be presented to the user.

### Automatic Insertion

Proactively inserting read feedback to the recommender system requires the application to be able to accurately capture user browsing behavior. This task is easier for mobile applications but more difficult for web applications. To address this problem, Gorse's API for getting recommendation results provides two parameters: `write−back−type` and `write−back−delay`.

- **In full-screen mode:** Get a recommendation and write a "read" feedback, the recommendation will not appear again afterward.

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&n=1" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

- **In list mode:** Get 10 recommendations and write "read" feedback with timestamps of 10 minutes later. The 10 recommendations will not be discarded until after 10 minutes.

```bash
curl -X GET "http://172.18.0.3:8087/api/recommend/zhenghaoz?write-back-type=read&write-back-delay=10&n=10" \
    -H "accept: application/json" \
    -H "X-API-Key: 19260817"
```

The `write−back−type` and `write−back−delay` parameters of the recommendation API provide a convenient way to insert read feedback, but of course, if you want the read feedback to be more accurate, it should be written to the recommender system by the application.
