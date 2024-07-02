# volumio-discovery-tools
This is a tool for discovering Volumio devices on your network. It uses mDNS to discover devices and HTTP to ping them to determine their latency.

## Installation

### Installation of MDNS libraries

On Linux and other systems using the avahi daemon the avahi dns_sd compat library and its header files are required.  On debianesque systems the package name is `libavahi-compat-libdnssd-dev`, on fedoraesque systems the package is `avahi-compat-libdns_sd-devel`.  On other platforms Apple's [mDNSResponder](http://opensource.apple.com/tarballs/mDNSResponder/) is recommended. Care should be taken not to install more than one mDNS stack on a system.

On Windows you are going to need Apples "Bonjour SDK for Windows". You can download it either from [Apple](https://developer.apple.com/download/more/?=Bonjour%20SDK%20for%20Windows) (registration required) or various unofficial sources. Take your pick. After installing the SDK restart your computer and make sure the `BONJOUR_SDK_HOME` environment variable is set. You'll also need a compiler. Microsoft Visual Studio Express will do. On Windows node >=0.7.9 is required.

### Required NodeJS version

This tool requires NodeJS version 14.15.4, which aligns with the current Volumio version.

### Install

To install the necessary dependencies, run the following command:

```
npm install 
```


## Run

To run 

```
node index.js
```





