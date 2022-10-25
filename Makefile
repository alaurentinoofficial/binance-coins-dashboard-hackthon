.PHONY: docker-build
docker-build:
	docker-compose build

.PHONY: pinot-setup
pinot-setup:
	docker-compose up -d pinot-server pinot-controller pinot-broker
	curl -F aggregated_coins_price_schema=@apache-pinot/aggregated_coins_price_schema.json  localhost:9000/schemas
	curl -i -X POST -H 'Content-Type: application/json' -d @apache-pinot/aggregated_coins_price_table.json  localhost:9000/tables