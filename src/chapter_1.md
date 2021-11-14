# Chapter 1: Quick Start

Gorse is an open source recommendation system written in Go. Gorse aims to be an universal open source recommender system that can be easily introduced into a wide variety of online services. By importing items, users and interaction data into Gorse, the system will automatically train models to generate recommendations for each user. Project features are as follows.

- **AutoML**: Choose the best recommendation model and stargety automatically by model searching in the background.
- **Distributed Recommendation**: Single node training, distributed prediction, and ability to achieve horizontal scaling in the recommendation stage.
- **RESTful API**: Provide RESTful APIs for data CRUD and recommendation requests.
- **Dashboard**: Provide dashboard for data import and export, monitoring, and cluster status checking.

Gorse is a single node training and distributed prediction recommender system. Gorse stores data in MySQL or MongoDB, with intermediate data cached in Redis. The cluster consists of a master node, multiple worker nodes, and server nodes. The master node is responsible for model training, non-personalized item recommendation, configuration management, and membership management. The server node is responsible for exposing the RESTful APIs and online real-time recommendations. Worker nodes are responsible for offline recommendation for each user. In addition, administrator can perform system monitoring, data import and export, and system status checking via the dashboard on the master node.

<center><img width=480 src="img/architecture.png"/></center>
