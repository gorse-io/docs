# Chapter 1: Introduction

Recommender systems are mature technologies, and there are already many recommender system toolkits on the web and various recommenders published in various top conferences. Even though there is a lot of public information about recommender systems, there is a lack of an open source recommender system that works out of the box. Such a phenomenon is actually caused by the nature of the recommender system itself, which involves different technologies including storage, computation, and business. Gorse aims to be a universal open source recommender system that can be easily introduced into online services.

## [Recommendation Principles](ch01-01-principle.md)

The process of recommending items consists of two phases, **matching** and **ranking**. The matching phase finds a collection of candidate items from all items for subsequent ranking. Due to the large number of items, the recommender system is unable to perform the computational workload of ranking all items, so the matching phase uses simple strategies or models to collect the candidate items. At present, the system has implemented three matching strategies, namely "recent popular items", "latest items" and "collaborative filtering". The ranking phase ranks the matched items after removing duplicate items and historical items. The ranking model exploits the items and user features to improve recommendation accuracy.

<center><img src="img/dataflow.png" height="180"></center>

## [System Architecture](ch01-02-architect.md)

Gorse is a single node training and distributed prediction recommender system. Gorse stores data in MySQL or MongoDB, with intermediate data cached in Redis. The cluster consists of a master node, multiple worker nodes, and server nodes. The master node is responsible for ranking model training, collaborative filtering model training, non-personalized item matching, configuration management, and membership management. The server node is responsible for exposing the RESTful APIs and online real-time recommendations. Worker nodes are responsible for personalized matching for each user - currently only collaborative filtering is supported. In addition, administrator can perform model tuning, data import and export, and system status checking via the CLI.

<center><img src="img/arch.png" height="200"></center>
