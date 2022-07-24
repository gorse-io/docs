# Introduction

Gorse is an open-source recommendation system written in Go. Gorse aims to be a universal open-source recommender system that can be easily introduced into a wide variety of online services. By importing items, users, and interaction data into Gorse, the system will automatically train models to generate recommendations for each user. Project features are as follows.

- **Multi-source Recommendation:** For a user, recommended items are collected from different ways (popular, latest, user-based, item-based, and collaborative filtering) and ranked by click-through rate prediction.
- **AutoML:** Choose the best recommendation model and strategy automatically by model searching in the background.
- **Distributed Recommendation:** Single node training, distributed prediction, and ability to achieve horizontal scaling in the recommendation stage.
- **RESTful API:** Provide RESTful APIs for data CRUD and recommendation requests.
- **Dashboard:** Provide dashboard for data import and export, monitoring, and cluster status checking.

Gorse is a single node training and distributed prediction recommender system. Gorse stores data in MySQL, MongoDB, PostgresSQL, or ClickHouse, with intermediate data cached in Redis.

1. The cluster consists of a master node, multiple worker nodes, and server nodes.
2. The master node is responsible for model training, non-personalized item recommendation, configuration management, and membership management.
3. The server node is responsible for exposing the RESTful APIs and online real-time recommendations.
4. Worker nodes are responsible for offline recommendations for each user.

In addition, the administrator can perform system monitoring, data import and export, and system status checking via the dashboard on the master node.

![Architecture](../img/architecture.png)
