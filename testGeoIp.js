var geoip = require('geoip-lite');


var ip = "96.255.55.124";
var geo = geoip.lookup(ip);

console.log(geo);
console.log("The IP is %s", geoip.pretty(ip));

