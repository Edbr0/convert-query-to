import { DatabaseEngines } from "@/utils";

export const databaseOptions = [
  { label: "Standard SQL", value: DatabaseEngines.SQL },
  { label: "GCP BigQuery", value: DatabaseEngines.BIGQUERY },
  { label: "IBM DB2", value: DatabaseEngines.DB2 },
  { label: "IBM DB2i (experimental)", value: DatabaseEngines.DB2I },
  { label: "Apache Hive", value: DatabaseEngines.HIVE },
  { label: "MariaDB", value: DatabaseEngines.MARIADB },
  { label: "MySQL", value: DatabaseEngines.MYSQL },
  { label: "TiDB", value: DatabaseEngines.TIDB },
  { label: "Couchbase N1QL", value: DatabaseEngines.N1QL },
  { label: "Oracle PL/SQL", value: DatabaseEngines.PLSQL },
  { label: "PostgreSQL", value: DatabaseEngines.POSTGRESQL },
  { label: "Amazon Redshift", value: DatabaseEngines.REDSHIFT },
  { label: "SingleStoreDB", value: DatabaseEngines.SINGLESTOREDB },
  { label: "Snowflake", value: DatabaseEngines.SNOWFLAKE },
  { label: "Spark", value: DatabaseEngines.SPARK },
  { label: "SQLite", value: DatabaseEngines.SQLITE },
  { label: "SQL Server Transact-SQL", value: DatabaseEngines.TRANSACTSQL },
  { label: "Trino", value: DatabaseEngines.TRINO },
];
