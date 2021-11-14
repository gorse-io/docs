# Chapter 3: Monitoring

For an online system in production, "observability" is important. Real-time monitoring of an online system can identify flaws or performance issues before they affect users on a large scale. This chapter will introduce how to monitor the Gorse recommender system for logs and metrics, with the logs capturing abnormal events and the metrics monitoring observing the performance of the system. This chapter will only introduce some key configuration, for a complete configuration sample please refer to the official demo project [GitRec](https://github.com/zhenghaoz/gitrec).

The overview architecture of monitoring infrastructure is as follows:

- Gorse nodes write logs to log files.
- **Promtail** reads logs from file and push to **Loki**.
- **Prometheus** scrapes metrics from Gorse nodes.
- **Grafana** visualizes logs from **Loki** and metrics from **Prometheus** in dashboards.

<img src="img/ch3/monitoring.png" width="600">
