# Frequently Asked Questions

These frequent asked questions are collected from issues, emails and chats. Feel free to ask more questions via [issue](https://github.com/zhenghaoz/gorse/issues), [email](support@gorse.io), [Discord](https://discord.com/channels/830635934210588743/) (for English) or [QQ](https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi) (for Chinese).

### 1. How to address the cold-start problem?

Use `explore_recommend` to inject the latest items or recently popular items into a recommendation. Also, item labels are helpful to rank new items in a recommendation. For example:

```toml
explore_recommend = { popular = 0.1, latest = 0.2 }
```

It means latest items are inserted into recommended items list in a probability of 0.1 and recently popular items are inserted into recommended items list in a probability of 0.2.

### 2. How to keep track of items recommended to each user?

There are two options:

1. Insert read-type feedback to Gorse when an item is shown to a user. This is the way the official demo [zhenghaoz/gitrec](https://github.com/zhenghaoz/gitrec) tracks user-seen recommendations.
2. Use `write-back-type` and `write-back-delay` parameter to write back recommendations as read feedbacks to Gorse, eg:

```bash
curl -i -H "Accept: application/json" \
    -X GET http://127.0.0.1:8088//api/recommend/0?write-back-type=read&write-back-delay=10
```

The 1st option is more accurate since it is done by the front end but the 2nd option is more convenient. Read [2.3 Recommendation Strategies](ch02-03-strategy.md) for detailed information.

### 3. What does "no feedback found" mean?

If "collaborative filtering" tasks report no feedback found. It means there is no positive feedback in the database. The definition of positive feedback types and read feedback type is in the configuration file:

```toml
# The feedback types for positive events.
positive_feedback_types = ["star","like"]

# The feedback types for read events.
read_feedback_types = ["read"]
```

If "click-through rate prediction" tasks report no feedback found. It means there is no negative feedback in the database. The negative feedback are these read feedback without positive feedback.

If you don't have any feedback, don't worry. There are fallback recommenders to handle cold-start problem.
