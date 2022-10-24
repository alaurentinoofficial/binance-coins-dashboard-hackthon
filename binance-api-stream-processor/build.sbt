enablePlugins(
  JavaAppPackaging,
  DockerPlugin
)

ThisBuild / version := "0.1.0"
ThisBuild / scalaVersion := "2.12.10"

val flinkVersion = "1.15.2"

libraryDependencies ++= Seq(
  "org.apache.flink" % "flink-java-examples" % "0.10.2",
  "org.apache.flink" % "flink-connector-kafka" % flinkVersion,
  "org.apache.flink" % "flink-clients" % flinkVersion,
  "org.apache.flink" % "flink-connector-base" % flinkVersion,
  "org.apache.flink" %% "flink-scala" % flinkVersion,
  "org.apache.flink" %% "flink-streaming-scala" % flinkVersion % "provided",
  "com.google.code.gson" % "gson" % "2.9.1"
)

lazy val root = (project in file("."))
  .settings(
    name := "binance-api-stream-processor"
  )

artifactName := { (sv: ScalaVersion, module: ModuleID, artifact: Artifact) =>
  artifact.name + "_" + sv.binary + "_" + module.revision + "." + artifact.extension
}

enablePlugins(JavaAppPackaging)