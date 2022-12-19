---
icon: dot-net
---

# .NET SDK

::: warning

.NET SDK 尚未发布。如有兴趣请联系我们：

[](https://discord.gg/x6gAtNNkAE)![Discord](https://img.shields.io/discord/830635934210588743) <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&amp;jump_from=webapi"></a><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" title="Gorse推荐系统交流群" alt="Gorse推荐系统交流群">

:::

## 用法

```cs
using Gorse.NET;

var client = new Gorse("http://127.0.0.1:8087", "api_key");

client.InsertFeedback(new Feedback[]
{
    new Feedback{FeedbackType="star", UserId="bob", ItemId="vuejs:vue", Timestamp="2022-02-24"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="d3:d3", Timestamp="2022-02-25"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="dogfalo:materialize", Timestamp="2022-02-26"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="mozilla:pdf.js", Timestamp="2022-02-27"},
    new Feedback{FeedbackType="star", UserId="bob", ItemId="moment:moment", Timestamp="2022-02-28"},
});

client.GetRecommend("10");
```
