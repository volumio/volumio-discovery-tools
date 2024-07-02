var mdns = require('mdns');
var http = require('http');
var onlineVolumioDevicesArray = [];


startMDNSBrowser();

function startMDNSBrowser() {

    var sequence = [
        mdns.rst.DNSServiceResolve(),
        'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
        mdns.rst.makeAddressesUnique()
    ];

    var serviceName = 'Volumio';

    var browser = mdns.createBrowser(mdns.tcp(serviceName), {resolverSequence: sequence});

    browser.on('error', function (error) {
        console.error('Discovery: Browse raised the following error ' + error);
    });

    browser.on('serviceUp', function (service) {
        newVolumioDeviceUp(service);
    });

    browser.on('serviceDown', function (service) {
        volumioDeviceDown(service);
    });

    browser.start();
}

function newVolumioDeviceUp(device) {
    var device = {
        deviceName : device.txtRecord.volumioName,
        deviceUUID : device.txtRecord.UUID,
        address : parseDeviceAddress(device.addresses)
    }

    pingDevice(device.address).then((delay) => {
        device.latency = delay;
        onlineVolumioDevicesArray.push(device);
        printDevicesTable();
    }).catch((err) => {
        console.error('Error pinging device: ' + device.deviceName + ' at ' + device.address, err.code);
    });

}

function parseDeviceAddress(addresses) {

    if (addresses.length === 1) {
        return addresses[0];
    } else {
        var filteredNetworkArray = addresses.filter(function(e) { return e !== '192.168.211.1' });
        return filteredNetworkArray[0];
    }
}

function pingDevice(address) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        http.get(`http://${address}/api/v1/ping`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const delay = Date.now() - start;
                if (data === 'pong') {
                    resolve(delay);
                } else {
                    reject();
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}


function volumioDeviceDown(device) {
    console.log('A device has disappeared, refreshing list');
    updateDevicesListAfterDeviceDown();
}

function updateDevicesListAfterDeviceDown() {
    var refreshedOnlineVolumioDevicesArray = [];
    Promise.all(onlineVolumioDevicesArray.map(device => pingDevice(device.address).then((delay) => {
        device.latency = delay;
        refreshedOnlineVolumioDevicesArray.push(device);
    }).catch((err) => {
        
    }))).then(() => {
        onlineVolumioDevicesArray = refreshedOnlineVolumioDevicesArray;
        printDevicesTable();
    });
}


function printDevicesTable() {
console.table(onlineVolumioDevicesArray.map(device => ({
    Name: device.deviceName,
    UUID: device.deviceUUID,
    IP: device.address,
    LATENCY: device.latency
})));
}