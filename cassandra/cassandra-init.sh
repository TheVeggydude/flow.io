CQL="""
  CREATE KEYSPACE pipeline
  WITH REPLICATION = {
   'class' : 'SimpleStrategy',
   'replication_factor' : 3
  };

  USE pipeline;

  CREATE TABLE ports (
    id text,
    ts timestamp,
    production float,
    desired float,
    delta float,
    primary key(id, ts)
  ) WITH COMPACTION = {
    'class': 'TimeWindowCompactionStrategy',
    'compaction_window_unit': 'DAYS',
    'compaction_window_size': 1
  } AND CLUSTERING ORDER BY (ts DESC);

  CREATE TABLE basins (
    id text,
    ts timestamp,
    load float,
    primary key(id, ts)
  ) WITH COMPACTION = {
    'class': 'TimeWindowCompactionStrategy',
    'compaction_window_unit': 'DAYS',
    'compaction_window_size': 1
  } AND CLUSTERING ORDER BY (ts DESC);
"""

until echo $CQL | cqlsh; do
  echo "cqlsh: Cassandra is unavailable to initialize - will retry later"
  sleep 5
done &

exec /docker-entrypoint.sh "$@"