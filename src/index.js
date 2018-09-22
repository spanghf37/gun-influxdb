const Flint = require('gun-flint');
const GunInfluxdb = require('./gun-influxdb');
module.exports = Flint.register(GunInfluxdb);
