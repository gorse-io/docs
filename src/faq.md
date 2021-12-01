# Frequently Asked Questions

These frequent asked questions are collected from issues, emails and chats. Feel free to ask more questions via [issue](https://github.com/zhenghaoz/gorse/issues), [email](support@gorse.io), [Discord](https://discord.com/channels/830635934210588743/) (for English) or [QQ](https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi) (for Chinese).

## Technical Questions

### 1. How to address the cold-start problem?

Use `explore_latest_num` to inject the latest items into a recommendation. Also, item labels are helpful to rank new items in a recommendation. For example:

```toml
explore_latest_num = 10
```

It means 10 latest items are inserted into recommended items list.

### 2. How to keep track of items recommended to each user?

There are two options:

1. Insert read-type feedback to Gorse when an item is shown to a user. This is the way the official demo [zhenghaoz/gitrec](https://github.com/zhenghaoz/gitrec) tracks user-seen recommendations.
2. Use `write-back` parameter to write back recommendations as read feedbacks to Gorse, eg:

```bash
curl -i -H "Accept: application/json" -X GET http://127.0.0.1:8088//api/recommend/0?write-back=read
```

The 1st option is more accurate since it is done by the front end but the 2nd option is more convenient.
