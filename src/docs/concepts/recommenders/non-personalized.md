---
icon: rankfill
shortTitle: Non-personalized
---
# Non-personalized Recommenders

Gorse recommender system offers a default non-personalized recommenders, the latest recommender. However, it is not flexible enough. To improve the flexibility of non-personalized recommendations, Gorse provides a new implementation of non-personalized recommenders.

## Configuration

Non-personalized recommenders will traverse each item and its feedback, using expressions provided by the user to filtering and scoring. The configuration of a non-personalized recommender consists of three fields:
- `name` is the name of the recommender.
- `score` is the scoring function, represented in [Expr](https://expr-lang.org/) language, requiring output typed floating point or integer. Items are sorted in descending order. 
- `filter` is the filtering function, represented in [Expr](https://expr-lang.org/) language, requiring output typed boolean.

::: tip
If you want to sort items in ascending order, you need to add a negative sign yourself.
:::

In expressions, the `item` variable represents the current item while `feedback` variable represents positive feedback to the current item.

The type of `item` is the `Item` structure, and the syntax for accessing fields is consistent with Go language. For example, `item.Timestamp` will return the timestamp of the item.

```go
type Item struct {
    ItemId     string
    IsHidden   bool
    Categories []string
    Timestamp  time.Time
    Labels     any
    Comment    string
}
```

The type of `feedback` is `[]Feedback`, a slice of `Feedback`. The syntax for accessing the array is consistent with the Go language. For example, `feedback[0].FeedbackKey.FeedbackType` will return the feedback type of the first positive feedback.

```go
type Feedback struct {
    FeedbackType string
    UserId       string
    ItemId       string
    Timestamp   time.Time
    Comment     string
}
```

[Expr](https://expr-lang.org/) language provides a lot of built-in functions that are sufficient to write more complex calculation logic. In addition to built-in functions that handle single variables such as mathematical operators, comparison operators, logical operators, etc., it also provides many array-related built-in functions. To learn more about syntax please visit [Expr's official documentation](https://expr-lang.org/docs/language-definition).

## API

You can access non-personalized recommendations through the following API:

```bash
curl http://localhost:8087/api/non-personalized/<name>
```

## Examples

### Latest Items

You can sort the latest items directly by using timestamps.

```toml
[[recommend.non-personalized]]
name = "latest"
score = "item.Timestamp.Unix()"
```

Since `item.Timestamp` is a `time.Time` struct and cannot be used directly for sorting, it needs to call the `Unix()` method to convert it into `int64` type.

### Most Liked Items Updated within the Last Week

Use filter to exclude items from more than a week ago, and calculate the number of likes as the sorting score.

```toml
[[recommend.non-personalized]]
name = "most_liked_weekly"
score = "count(feedback, .FeedbackType == 'like')"
filter = "(now() - item.Timestamp).Hours() < 24 * 7"
```

The `count` function will calculate the length of the feedback slice, the second parameter indicates that it only counts when the feedback type is 'like'. The `now()` function gets the current time, subtracts item time and requires that the number of hours be within a week (24*7 hours).

### Hacker News

It is said that Hacker News uses the following formula to calculate scores for content ranking:

$$
\frac{p-1}{(T+2)^G}
$$

where $p$ is the number of upvotes for the content, $T$ is the time from posting to score calculation, and $G$ is the gravity value used to control the rate at which content popularity decays over time. If you set $G$ to 0.5, you can add the following configuration item:

```toml
[[recommend.non-personalized]]
name = "trending"
score = "(count(feedback, .FeedbackType == 'upvote')-1)/((now() - item.Timestamp).Seconds()+2)^0.5"
```
