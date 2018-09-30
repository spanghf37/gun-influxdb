const {NodeAdapter} = require('gun-flint');
const Influx = require('influx');


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
            let query = influx.query ? '?' + influx.query : '';
            this.db = new Influx.InfluxDB(`http://${host}:${port}/${database}`);
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
            //console.log("recherche en cours key : " + key);
            this.db.query(`SELECT * FROM "metrics" WHERE "fields_gunkey" = \'${key}\'`)
            .then(result => {
                var rlt = JSON.parse(result[0].fields_gunobject);
                done(null,rlt)})
            .catch(error => done(this.errors.internal));
                
                //done(null,results)})
            //.catch(error => done(this.errors.internal))
                // (err, result) => {
                /*if (error) {
                    done(this.errors.internal)
                } else if (!result) {
                    done(this.errors.lost);
                } else {
                    done(null, result);
                }*/
            };
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
            
            let i;
            let tags_object = {};
            let fields_object = {fields_gunkey: node._["#"], fields_gunobject: JSON.stringify(node)};
            for (i = Object.keys(node).indexOf("tags")+1; i < Object.keys(node).indexOf("fields"); i++){
                tags_object[Object.keys(node)[i]] = node[Object.keys(node)[i]];
            }
            
            
            for (i = Object.keys(node).indexOf("fields")+1; i < Object.keys(node).indexOf("timestamp"); i++){
                fields_object[Object.keys(node)[i]] = node[Object.keys(node)[i]];
            }

            this.db.writeMeasurement('metrics', [   
                    {
                        tags: tags_object,
                        fields: fields_object,         
                        timestamp: node.timestamp
                    }
                ],  {
                        database: 'gun'
                }, done
            ).catch(err => {
                console.error('Error saving data to InfluxDB! ${err.stack}')
            })
        }
    },

    /**
     * Retrieve the collection for querying
     * 
     * @return {object}   A collection to query
     */
    /**
     * getCollection: function() {
        return this.db.collection(this.collection);
    },

    /**
     * Ensure indexes are created on the proper fields
     * 
     * @return {void}
     */
    /**
     _ensureIndex() {
        this._getCollection().createIndex({
            _id: 1,
        }, {
            background: this.indexInBackground
        });
   }
   */
});
