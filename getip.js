const publicIp = require('public-ip');
const geoip = require('geoip-lite');

(async () => {
    ip = await publicIp.v4();
    location = geoip.lookup(ip);
    console.log(ip);
    console.log(location);
})();