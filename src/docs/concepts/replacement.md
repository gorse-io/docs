---
icon: download
---
# Replacement

In some cases, read items should be recommended to users again but with lower (or higher) priorities. If `enable_replacement` is set, read items would be placed back to recommendations. The priority decay factors for positive feedback and read feedback are controlled by `positive_replacement_decay` and `read_replacement_decay`.

```toml
[recommend.replacement]

# Replace historical items back to recommendations.
enable_replacement = false

# Decay the weights of replaced items from positive feedbacks.
positive_replacement_decay = 0.8

# Decay the weights of replaced items from read feedbacks.
read_replacement_decay = 0.6
```

Set decay factor greater than 1.0 if you want to increase the priority of read items.
