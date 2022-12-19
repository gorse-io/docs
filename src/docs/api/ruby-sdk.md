---
icon: ruby
---
# Ruby SDK

::: warning

The Ruby SDK has not been released. Contact us if you are interested: 

[![Discord](https://img.shields.io/discord/830635934210588743)](https://discord.gg/x6gAtNNkAE)
<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=lOERnxfAM2U2rj4C9Htv9T68SLIXg6uk&jump_from=webapi"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="Gorse推荐系统交流群" title="Gorse推荐系统交流群"></a>

:::

## Usage

```ruby
require 'gorse'

client = Gorse.new('http://127.0.0.1:8087', 'api_key')

client.insert_feedback([
    Feedback.new("star", "bob", "vuejs:vue", "2022-02-24"),
    Feedback.new("star", "bob", "d3:d3", "2022-02-25"),
    Feedback.new("star", "bob", "dogfalo:materialize", "2022-02-26"),
    Feedback.new("star", "bob", "mozilla:pdf.js", "2022-02-27"),
    Feedback.new("star", "bob", "moment:moment", "2022-02-28")
])

client.get_recommend('10')
```
