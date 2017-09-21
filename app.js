var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var request = require("request");

var connectionString = process.env.deviceConnectionString;
var client = clientFromConnectionString(connectionString);

function switchPower(iotHubRequest, iotHubResponse) {
    var url =
        `http://${process.env.veraEdgeAddress}:3480/data_request?id=lu_action&output_format=xml&DeviceNum=
        ${iotHubRequest.payload.id}&serviceId=urn:upnp-org:serviceId:SwitchPower1&
        action=SetTarget&newTargetValue=${iotHubRequest.payload.target}`;

    request.get(url, (error, response, body) => {
        if (error) {
            iotHubResponse.send(500, 'Could not send target value: ' + error, function (err) {
                if (err) {
                    console.error('An error ocurred when sending a method response:\n' + err.toString());
                } else {
                    console.log('Response to method \'' + iotHubRequest.methodName + '\' sent successfully.');
                };
            });
        }
        else {
            iotHubResponse.send(200, 'Target value sent', function (err) {
                if (err) {
                    console.error('An error ocurred when sending a method response:\n' + err.toString());
                } else {
                    console.log('Response to method \'' + iotHubRequest.methodName + '\' sent successfully.');
                };
            });
        }
    });
}

var connectCallback = function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');

        client.onDeviceMethod('switchPower', switchPower);
    }
};

client.open(connectCallback);