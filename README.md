# Binance Dashboard
Dashboard using Binance public Websocket API to get realtime cryptocurrency ticks and load it in a chart and list format with mechanism to trigger webhooks with predefined actions.

## How to test?
Just run
```bash
docker compose up --build
```

## Dir structure
- apache-kafka - Message Broker mechanism
- apache-pinot - Kafka Topic SQL Database aggregator
- api-webhook-test - Webhook test endpoint
- binance-api-stream-processor - Aggregates and return the five minute moving average of the data 
- conditions-microsservice - Conditions microsservice
- dashboard-backend - Consumer Service, Websocket integration and Chart/Log dashboard
- data - Persisted data of kafka and zookeeper
- email_service - E-mail service for tests (Not used at now)
- node-consumer - Consumer Service, handling webhook triggers communicating with conditions microservice
- node-producer - Producer Service, handling Binance Websockets API to Kafka
- notification-ui - Notification Dashboard that controls conditions

## Dashboards
The dashboards are in the following ports:
- Port 3002 - Visualization UI (dashboard-backend)
- Port 3000 - Notification UI (notification-ui). If you're using Gitpod, you will need to make public the 3100 port too.