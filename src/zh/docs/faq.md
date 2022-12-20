---
icon: faq
---

# 常见问题

这些常见问题是从工单、电子邮件和聊天中收集的。欢迎通过[工单](https://github.com/zhenghaoz/gorse/issues)、[电子邮件](mailto:support@gorse.io)、 [Discord](https://discord.com/channels/830635934210588743/) （英文）或[QQ](https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi) （中文）提出更多问题。

### 1. 如何解决冷启动问题？

Use `explore_recommend` to inject the latest items or recently popular items into a recommendation. Also, item labels are helpful to rank new items in a recommendation. For example:

```toml
explore_recommend = { popular = 0.1, latest = 0.2 }
```

It means latest items are inserted into recommended items list in a probability of 0.2 and recently popular items are inserted into recommended items list in a probability of 0.1.

### 2. 如何跟踪推荐给每个用户的项目？

有两种选择：

1. 当向用户显示推荐时，向 Gorse 插入已读反馈。这是官方示例[zhenghaoz/gitrec](https://github.com/zhenghaoz/gitrec)跟踪用户推荐项目的方式。
2. 使用`write-back-type`和`write-back-delay`参数将已读读反馈写回给 Gorse，例如：

```bash
curl -i -H "Accept: application/json" \
    -X GET http://127.0.0.1:8088//api/recommend/0?write-back-type=read&write-back-delay=10s
```

选项1更准确，因为它是由更靠近用户的前端完成的，但选项2更方便。

### 3.“no feedback found”是什么意思？

如果“协同过滤”任务报告“no feedback found”，则意味着数据库中没有正反馈。正反馈类型和已读反馈类型的定义在配置文件中设置：

```toml
# The feedback types for positive events.
positive_feedback_types = ["star","like"]

# The feedback types for read events.
read_feedback_types = ["read"]
```

如果“click-through rate prediction”任务报告“no feedback found”。这意味着数据库中没有负反馈。负反馈是没有产生正反馈的已读反馈。

如果您没有任何反馈，请不要担心。有后备推荐系统来处理冷启动问题。
