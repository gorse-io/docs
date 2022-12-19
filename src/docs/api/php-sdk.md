---
icon: php
---
# PHP SDK

::: warning

The PHP SDK has not been released. Contact us if you are interested: 

[![Discord](https://img.shields.io/discord/830635934210588743)](https://discord.gg/x6gAtNNkAE)
<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="Gorse推荐系统交流群" title="Gorse推荐系统交流群"></a>

:::

## Usage

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
