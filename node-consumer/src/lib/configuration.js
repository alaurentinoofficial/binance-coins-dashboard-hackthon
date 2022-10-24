let grpc = require('@grpc/grpc-js');
let protoLoader = require('@grpc/proto-loader');
let PROTO_PATH = './proto/conditions.proto';

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

let PORT = 'conditions-microsservice:50051';
let conditions = grpc.loadPackageDefinition(packageDefinition).conditions;

module.exports = {
    packageDefinition,
    conditions,
    grpc,
    PORT
}