const publicIp = require('public-ip');
const geoip = require('geoip-lite');
const loc = require('./models/loc');

(async () => {
    ip = await publicIp.v4();
    location = geoip.lookup(ip);
    console.log(ip);
    console.log(location);

    let loc_already = await loc.findOne({ip : ip});
    if(loc_already.length == 0)
    {
        var d = new Date().toString();
        var newLoc = new loc({
            ipv4 : ip , 
            lat: location.ll[0],
            long: location.ll[1],
            country : location.country,
            timezone : location.timezone
        });
        await newLoc.save();
    }
})();


