package com.something

import com.google.gson.Gson
import com.something.Models._
import com.something.Processes.AggregateTradesByWindow
import org.apache.flink.api.common.eventtime.{SerializableTimestampAssigner, WatermarkStrategy}
import org.apache.flink.api.common.serialization.SimpleStringSchema
import org.apache.flink.connector.base.DeliveryGuarantee
import org.apache.flink.connector.kafka.sink.{KafkaRecordSerializationSchema, KafkaSink}
import org.apache.flink.connector.kafka.source.KafkaSource
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer
import org.apache.flink.streaming.api.scala.{StreamExecutionEnvironment, createTypeInformation}
import org.apache.flink.streaming.api.windowing.assigners.TumblingProcessingTimeWindows
import org.apache.flink.streaming.api.windowing.time.Time

import java.time.Duration

object Main extends App {

  var env = StreamExecutionEnvironment.createLocalEnvironmentWithWebUI()

  val source = KafkaSource.builder()
    .setBootstrapServers("localhost:19091")
    .setTopics("binance_btc_price")
    .setGroupId("my-group")
    .setStartingOffsets(OffsetsInitializer.latest())
    .setValueOnlyDeserializer(new SimpleStringSchema())
    .build()

  val sink = KafkaSink.builder()
    .setBootstrapServers("localhost:19091")
    .setRecordSerializer(KafkaRecordSerializationSchema.builder()
      .setTopic("aggregated_coins_price")
      .setValueSerializationSchema(new SimpleStringSchema())
      .build()
    )
    .build()

  val inputStream = env
    .fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Souce")
    .map(new Gson().fromJson(_, classOf[BinanceTradeEvent]))

  val transformStream = inputStream
    .assignTimestampsAndWatermarks(
      WatermarkStrategy
        .forBoundedOutOfOrderness(Duration.ofMillis(500000))
        .withTimestampAssigner(new SerializableTimestampAssigner[BinanceTradeEvent] {
          override def extractTimestamp(element: BinanceTradeEvent,
                                        recordTimestamp: Long): Long = element.E
        })
    )
    .keyBy(_.s)
    .window(TumblingProcessingTimeWindows.of(Time.seconds(5)))
    .apply(new AggregateTradesByWindow)

  transformStream
    .map(new Gson().toJson(_))
    .sinkTo(sink)

  transformStream
    .print()

  env.execute()

}
