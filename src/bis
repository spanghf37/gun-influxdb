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
            //this.measurement = influx.measurement || 'gun-influx'; //this.collection = influx.collection || 'gun-mongo';
            this.db = new Influx.InfluxDB(`http://${host}:${port}/${database}`);

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
            //console.log("recherche en cours key : " + key);
            this.db.query(`SELECT * FROM "metrics" WHERE "gunkey" = \'${key}\'`)
            .then(result => {
                //console.log(JSON.stringify(result));
                //var rlt = {"_":{"#":result[0].gunkey,">":{[result[0].fieldname]:result[0].lastupdate}},[result[0].fieldname]:result[0].fieldvalue}; 
                //var rlt = {"_":{"#":result[0].gunkey,">":{[result[0].fieldname]:result[0].fieldlastupdate}},[result[0].fieldname]:result[0].fieldvalue}; 
                //console.log(result[0].gunobject);
                var rlt = JSON.parse(result[0].gunobject)//console.log(JSON.stringify(result[0].gunkey));
                //console.log(JSON.stringify(rlt));
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
    //},

/*
    {"database" : "foo", "retentionPolicy" : "bar",
    "points" : [
        {"name" : "metrics",
        "tags" : {"unit" : "sna1", "bigramme" : "AG", "type": "huile"},
        "timestamp" : "2015-03-16T01:02:26.234Z",
        "fields" : {"keyuuid": gundbuuid, "temperature" : 55.4, "pression" : 4.5}}]}
*/
// SELECT * FROM "metrics" WHERE "keyuuid" = gundbuuid
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
            /*this.getCollection(key).findAndModify(
                {
                    query: {_id: key},
                    update: { 
                        key: key,
                        val: node
                    },
                    upsert: true
                }, done
            );*/
            //this.db.writeMeasurement('metrics', [
            //    {
            //        tags: node.tags,
            //        fields: node.fields,
            //        timestamp: node.timestamp
            //    }
            //], 
            //{
            //    database: 'gun'
            //})
            //console.log("key put  " + key);
            //console.log("test : " + JSON.stringify(node));
            //console.log(Object.getOwnPropertyNames(node));
            //console.log(node.tags);
            //var node_store = {main_node : '', main_key: '', tags_key: '', tags_node: '', fields_key: '', fields_node: '', main_ts: ''};
            if(node.gun_node_type === 'main') { //gun_main_node found
                console.log("main node key found " + key);
                this.db.writeMeasurement('metrics', [   // node.measurement // metrics variable : ajouter nouveau attribut à main gun node comme timestamp
                        {
                            tags: {gun_main_key: node._["#"]},
                            fields: {
                                gun_main_node: JSON.stringify(node),
                                gun_tags_key: node.tags["#"],
                                gun_fields_key: node.fields["#"]
                            },         
                            timestamp: node.timestamp
                        }
                    ],  {
                            database: 'gun'
                    }, done
                )
            }
            //else {
            //    thinode.tags !== undefined && node.fields !== undefineds.db.query(`SELECT * FROM "metrics" WHERE ("gun_tags_key" = \'${key}\' OR "gun_fields_key" = \'${key}\')`)
             //   .then(result => {
             //       node.tags !== undefined && node.fields !== undefined    //console.log(JSON.stringify(result));
                //var rlt = {"_":{"#":result[0].gunkey,">":{[result[0].fieldname]:result[0].lastupdate}},[result[0].fieldname]:result[0].fieldvalue}; 
                //var rlt = {"_":{"#":result[0].gunkey,">":{[result[0].fieldname]:result[0].fieldlastupdate}},[result[0].fieldname]:result[0].fieldvalue}; 
                //console.log(result[0].gunobject);
                //node_store.main_node = JSON.parse(result[0].gun_main_node);
                
                //node_store_ JSON.parse(result[0].gun_main_node)//console.log(JSON.stringify(result[0].gunkey));
                //console.log(JSON.stringify(rlt));
              //  console.log(result);
             //   console.log(JSON.stringify(node));
                if(node.gun_node_type === 'tags'){
                    console.log("tags node key found " + key);
                    //console.log("tags key " + JSON.stringify({[Object.getOwnPropertyNames(node)[1]]: node.Object.getOwnPropertyNames(node)[1]}));
                    this.db.writeMeasurement('metrics', [   // node.measurement // metrics variable : ajouter nouveau attribut à main gun node comme timestamp
                        {
                            tags: {
                                //gun_main_key: result[0].gun_main_key,
                                gun_main_key: node.gun_main_key,
                                [Object.getOwnPropertyNames(node)[2]]: node[Object.getOwnPropertyNames(node)[2]],
                                [Object.getOwnPropertyNames(node)[3]]: node[Object.getOwnPropertyNames(node)[3]]
                            },
                            fields: {
                                //gun_main_node: result[0].gun_main_node,
                                //gun_tags_key: result[0].gun_tags_key,
                                gun_node_type: 'tags',
                                gun_tags_key: node._["#"],

                                
                                //gun_fields_key: result[0].gun_fields_key
                            },         
                            timestamp: node.timestamp
                        }
                    ],  {
                            database: 'gun'
                    }, done
                )
                }
                if(node.gun_node_type === 'fields'){
                    console.log("fields node key found " + key);
                      
                    this.db.writeMeasurement('metrics', [   // node.measurement // metrics variable : ajouter nouveau attribut à main gun node comme timestamp
                        {
                            tags: {
                                gun_main_key: node.gun_main_key
                                //gun_main_key: result[0].gun_main_key,
                                //[Object.getOwnPropertyNames(JSON.stringify(result[0].gun_tags_node))[2]]: JSON.stringify(result[0].gun_tags_node).Object.getOwnPropertyNames(JSON.stringify(result[0].gun_tags_node))[2],
                                //[Object.getOwnPropertyNames(JSON.stringify(result[0].gun_tags_node))[3]]: JSON.stringify(result[0].gun_tags_node).Object.getOwnPropertyNames(JSON.stringify(result[0].gun_tags_node))[3]
                            },
                            fields: {
                                //gun_main_node: result[0].gun_main_node,
                                //gun_tags_key: result[0].gun_tags_key,
                                gun_node_type: 'fields',
                                gun_fields_key: node._["#"],
                                [Object.getOwnPropertyNames(node)[2]]: node[Object.getOwnPropertyNames(node)[2]],
                                [Object.getOwnPropertyNames(node)[3]]: node[Object.getOwnPropertyNames(node)[3]]
                                
                            },         
                            timestamp: node.timestamp
                        }
                    ],  {
                            database: 'gun'
                    }, done
                )
                }
            
        
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
