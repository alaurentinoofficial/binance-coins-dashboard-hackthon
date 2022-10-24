let grpc = require('@grpc/grpc-js');
let protoLoader = require('@grpc/proto-loader');
let PROTO_PATH = './conditions.proto';

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

let port = '0.0.0.0:50051';
let conditions = grpc.loadPackageDefinition(packageDefinition).conditions;

module.exports = {
    packageDefinition,
    conditions,
    grpc,
    port
}