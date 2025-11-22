---
icon: faq
---
# Frequently Asked Questions

These frequently asked questions are collected from issues, emails, and chats. Feel free to ask more questions via [issue](https://github.com/gorse-io/gorse/issues), [Discord](https://discord.com/channels/830635934210588743/) (for English) or [WeChat](/weixin.jpg) (for Chinese).

### 1. How to keep track of items recommended to each user?

There are two options:

1. Insert read-type feedback to Gorse when an item is shown to a user. This is the way the official demo [gorse-io/gitrec](https://github.com/gorse-io/gitrec) tracks user-seen recommendations.
2. Use `write-back-type` and `write-back-delay` parameters to write back recommendations as read feedback to Gorse, e.g.

```bash
curl -i -H "Accept: application/json" \
    -X GET http://localhost:8088//api/recommend/0?write-back-type=read&write-back-delay=10s
```

The 1st option is more accurate since it is done by the frontend but the 2nd option is more convenient.

### 2. What does "no feedback found" mean?

If "training collaborative filtering model" tasks report no feedback found, it means there is no positive feedback in the database. The definition of positive feedback types and read feedback types are in the configuration file:

```toml
# The feedback types for positive events.
positive_feedback_types = ["star","like"]

# The feedback types for read events.
read_feedback_types = ["read"]
```

If "training click-through rate model" tasks report no feedback found. It means there is no negative feedback in the database. The negative feedback are these read feedback without positive feedback.

If you don't have any feedback, don't worry. There are fallback recommenders to handle the cold-start problem.
