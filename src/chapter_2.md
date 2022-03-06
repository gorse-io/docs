# Chapter 2: Build Recommender

Recommender systems are complex. The overall workflow in Gorse is as follows:

<center><img width="500" src="img/ch2/overview.png"></center>

- Users, items and feedbacks are stored in **database** (a.k.a. `data_store` in config file). [Section 2.1 Item Management](ch02-01-items.md) introduces how to manage items in Gorse. Feedbacks are required to generate personalized recommendations for user, which is discussed in [Section 2.2 Feedback Collection](http://[::1]:3000/ch02-02-feedback.html).
- Latest items, popular items, user neighbors, item neighbors, recommendations and meta data are store in **cache** (a.k.a `cache_store` in config file).
- The **master node** loads data from database. In the process of loading data, popular items and latest items are write to cache. Then, the master node search neighbors and training recommendation models. In background, random search is used to find the optimal recommendation model for current data. The **worker nodes** pull recommendation models from the master node and generate recommendations for each user. The **server nodes** provides RESTful APis. 
    - [Section 2.3 Recommendation Strategies](ch02-03-strategy.md) shows how to define recommendation behaviors. 
    - [Section 2.4 Performance vs Precision](ch02-04-performance.md) discusses how to trade off between system performance and recommendation precision. 
    - The server nodes and worker nodes synchronize meta information from the master node. The address adn timeout of meta communication are specified in config file.

```toml
port = 8086                     # master port
host = "0.0.0.0"                # master host
meta_timeout = 10               # cluster meta timeout (second)
```

All data and status can be viewed in Gorse dashboard (read [Section 2.5 Gorse Dashboard](ch02-05-dashboard.md) for more information).
