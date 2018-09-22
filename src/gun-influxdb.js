const {NodeAdapter} = require('gun-flint');
const Influxdb = require('influxdb-nodejs');

module.exports = new NodeAdapter({

    /**
     * @type {boolean}  Whether or not the adapter has been properly initialized and can attempt DB connections
     */
    initialized: false,

    /**
     * Handle Initialization options passed during Gun initialization of <code>opt</code> calls.
     * 
     * Prepare the adapter to create a connection to the Mongo server
     * 
     * @param {object}  context    The full Gun context during initialization/opt call
     * @param {object}  opt        Options pulled from fully context
     * 
     * @return {void}
     */
    opt: function(context, opt) {
        let influx = opt.influx || null;
        if (influx) {
            this.initialized = true;
            let database = influx.database || 'gun';
            let port = influx.port || '8086';
            let host = influx.host || 'localhost';
            let schema: [
                {
                    measurement: let query = influx.query ? '?' + influx.query : '';
            this.measurement = influx.measurement || 'gun-influx'; //this.collection = influx.collection || 'gun-mongo';
            this.db = Influxdb(`http://${host}:${port}/${database}`);

            //this.indexInBackground = influx.indexInBackground || false;
        } else {
            this.initialized = false
        }
    },

    /**
     * Retrieve results from the DB
     * 
     * @param {string}   key    The key for the node to retrieve
     * @param {function} done   Call after retrieval (or error)
     *
     * @return {void}
     */
    get: function(key, done) {
        if (this.initialized) {
            this.db.query(this.measurement)
                .fields(this.fields)
                .tags(this.tags)
                .time(Date.now(),'ms')//.findOne({_id: key}, {}, (err, result) => {
                if (err) {
                    done(this.errors.internal)
                } else if (!result) {
                    done(this.errors.lost);
                } else {
                    done(null, result.val);
                }
            });
        }
    },

    /**
     * Write nodes to the DB
     * 
     * @param {string}   key   The key for the node
     * @param {object}   node  The full node with metadata
     * @param {function} done  Called when the node has been written
     * 
     * @return {void}
     */
    put: function(key, node, done) {
        if (this.initialized) {
            this.getCollection(key).findAndModify(
                {
                    query: {_id: key},
                    update: { 
                        key: key,
                        val: node
                    },
                    upsert: true
                }, done
            );
        }
    },

    /**
     * Retrieve the collection for querying
     * 
     * @return {object}   A collection to query
     */
    getCollection: function() {
        return this.db.collection(this.collection);
    },

    /**
     * Ensure indexes are created on the proper fields
     * 
     * @return {void}
     */
    _ensureIndex() {
        this._getCollection().createIndex({
            _id: 1,
        }, {
            background: this.indexInBackground
        });
   }
});
