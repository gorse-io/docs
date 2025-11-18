---
icon: php
---

# PHP SDK

::: warning

PHP SDK 尚未发布。如有兴趣请联系我们：

[](https://discord.gg/x6gAtNNkAE)![Discord](https://img.shields.io/discord/830635934210588743) <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&amp;jump_from=webapi"></a><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" title="Gorse推荐系统交流群" alt="Gorse推荐系统交流群">

:::

## 用法

```php
$client = new Gorse("http://127.0.0.1:8087/", "api_key");

$rowsAffected = $client->insertFeedback([
    new Feedback("star", "bob", "vuejs:vue", "2022-02-24"),
    new Feedback("star", "bob", "d3:d3", "2022-02-25"),
    new Feedback("star", "bob", "dogfalo:materialize", "2022-02-26"),
    new Feedback("star", "bob", "mozilla:pdf.js", "2022-02-27"),
    new Feedback("star", "bob", "moment:moment", "2022-02-28")
]);

$client->getRecommend('10');
```
