const
    //path           = require('path'),
    {EventEmitter} = require('events'),
    //
    util           = require('@nrd/fua.core.util'),
    uuid           = require("@nrd/fua.core.uuid"),
    //
    prefix         = "bpep",
    error_kind     = "error",
    exception_kind = "exception",
    _enforceable   = new Map()
; // const

//region ERROR
const
    ERROR_SYM  = Symbol(),
    ERROR_CODE = {
        // errors
        InstanceErrorIdIsMissing_CODE: "urn:BPEP:agent:error:1",
        EnforceErrorIdIsMissing_CODE:  "urn:BPEP:agent:error:2",
        EnforceErrorUnkownTarget_CODE: "urn:BPEP:agent:error:3",
        // eceptions
        EnforceException_CODE: "urn:BPEP:agent:exception:1"
    }
; // const

class InstanceErrorIdIsMissing extends Error {
    constructor({
                    id: id
                }) {
        super(`BPEPAgent : instance : Identifier (id) is missing.`);
        this['id']        = id;
        this['type']      = `${prefix}:InstanceErrorIdIsMissing`;
        this['kind']      = error_kind;
        this['sym']       = ERROR_SYM;
        this['code']      = ERROR_CODE.InstanceErrorIdIsMissing_CODE;
        this['timestamp'] = util.timestamp();
        Object.freeze(this);
    }
} // InstanceErrorIdIsMissing

class EnforceErrorIdIsMissing extends Error {
    constructor({
                    id:   id,
                    prov: prov
                }) {
        super(`BPEPAgent.enforce : error : identifier (id) is missing.`);
        this['id']        = id;
        this['type']      = `${prefix}:EnforceErrorIdIsMissing`;
        this['kind']      = error_kind;
        this['sym']       = ERROR_SYM;
        this['prov']      = prov;
        this['code']      = ERROR_CODE.EnforceErrorIdIsMissing_CODE;
        this['timestamp'] = util.timestamp();
        Object.freeze(this);
    }
} // EnforceErrorIdIsMissing

class EnforceErrorUnkownTarget extends Error {
    constructor({
                    id:     id,
                    target: target,
                    prov:   prov
                }) {
        super(`BPEPAgent.enforce : error : identifier of target <${target}> is NOT registered.`);
        this['id']        = id;
        this['type']      = `${prefix}:EnforceErrorUnkownTarget`;
        this['kind']      = error_kind;
        this['sym']       = ERROR_SYM;
        this['prov']      = prov;
        this['code']      = ERROR_CODE.EnforceErrorUnkownTarget_CODE;
        this['target']    = target;
        this['timestamp'] = util.timestamp();
        Object.freeze(this);
    }
} // EnforceErrorUnkownTarget

class ExceptionEnforce extends Error {
    constructor({
                    exception: exception,
                    id:        id,
                    prov:      prov
                }) {
        super(`BPEPAgent.enforce : exception : ${exception.message}`);
        this['id']        = id;
        this['type']      = `${prefix}:ExceptionEnforce`;
        this['kind']      = exception_kind;
        this['sym']       = ERROR_SYM;
        this['prov']      = prov;
        this['code']      = ERROR_CODE.EnforceException_CODE;
        this['timestamp'] = util.timestamp();
        Object.freeze(this);
    }
} // ExceptionEnforce
//endregion ERROR

class BPEPAgent extends EventEmitter {

    #id      = undefined;
    #event   = (data) => {
        this.emit('event', data);
    };
    #runtime = (data) => {
        this.emit('runtime', data);
    };

    #enable_runtime_enforce_start     = false;
    #enable_runtime_enforce_end       = false;
    #enable_runtime_enforce_exception = false;

    constructor({
                    id: id = undefined
                }) {

        super(); // EventEmitter

        if (!id)
            throw(new InstanceErrorIdIsMissing({id: `${uuid.v1()}`}));
        this.#id = id;

        Object.defineProperties(this, {
            id:            {value: this.#id, enumerable: true},
            addNode:       {
                value:         (node) => {
                    try {

                        if (!node.id)
                            throw(new Error(``)); // TODO : better ERROR

                        if (_enforceable.get(node.id))
                            throw(new Error(`TODO :: id <${id}> ALREADY present.`)); // TODO : better ERROR

                        if (typeof node !== "function")
                            throw(new Error(`TODO :: node <${typeof node}> is NOT a function.`)); // TODO : better ERROR

                        _enforceable.set(node.id, node);
                    } catch (jex) {
                        throw(jex);
                    } // try
                }, enumerable: false
            }, // addNode
            hasNode:       {
                value:         (node) => {
                    try {

                        let id = ((typeof node === "string") ? node : node.id);
                        return ((_enforceable.get(id)) ? true : false);
                    } catch (jex) {
                        throw(jex);
                    } // try
                }, enumerable: false
            }, // hasNode
            getNode:       {
                value:         (id) => {
                    try {
                        return _enforceable.get(id);
                    } catch (jex) {
                        throw(jex);
                    } // try
                }, enumerable: false
            }, // getNode
            renderTargets: {
                value:         async ({param: param = undefined}) => {
                    try {
                        let result = [];
                        _enforceable.forEach((value, key, map) => {
                            console.log(`m[${key}] = ${value}`);
                            if (value.exit) {
                                for (const [exit_key, exit_value] of Object.entries(value.exit)) {
                                    if (typeof exit_value !== "function") {

                                        let target = map.get(exit_key);

                                        if (!target)
                                            throw(new Error(``)); // TODO : better Error
                                        if (typeof target !== "function")
                                            throw(new Error(``)); // TODO : better Error

                                        value.exit[exit_key] = target;

                                    } // if ()
                                } // for()
                            } // if ()
                            Object.freeze(value.exit);
                        });
                        return result;
                    } catch (jex) {
                        throw(jex); // TODO : better ERROR
                    } // try
                }, enumerable: false
            }, // renderTargets
            enforce:       {
                value:                                       (({enforceable: enforceable}) => {
                    return async ({
                                      id:    id = undefined,
                                      token: token
                                  }) => {
                        //this.#event({
                        //    id:        `${this.#id}event/#${uuid.v1()}`,
                        //    prov:      `${this.#id}enforce`,
                        //    step:      start,
                        //    timestamp: util.timestamp()
                        //});
                        if (this.#enable_runtime_enforce_start)
                            this.#runtime({
                                id:        `${this.#id}enforce/start/${uuid.v1()}`,
                                type:      "bpep:Runtime",
                                prov:      `${this.#id}enforce`,
                                step:      "start",
                                timestamp: util.timestamp()
                            });

                        try {

                            let
                                target = undefined,
                                error  = undefined,
                                result = undefined
                            ; // let

                            if (!id)
                                error = new EnforceErrorIdIsMissing({
                                    id:   `${this.#id}error/${uuid.v1()}`,
                                    prov: `${this.#id}enforce/`
                                });

                            target = enforceable.get(id);
                            if (!target)
                                error = new EnforceErrorUnkownTarget({
                                    id:     `${this.#id}error/${uuid.v1()}`,
                                    target: id,
                                    prov:   `${this.#id}enforce/`
                                });

                            result = await target({token: token});

                            if (error) {
                                throw(error);
                            } // if ()

                            if (this.#enable_runtime_enforce_end)
                                this.#runtime({
                                    id:        `${this.#id}enforce/exit/${uuid.v1()}`,
                                    prov:      `${this.#id}enforce`,
                                    step:      "end",
                                    timestamp: util.timestamp()
                                });

                            return result;

                        } catch (jex) {
                            if (this.#enable_runtime_enforce_exception)
                                this.#runtime({
                                    id:        `${this.#id}enforce/exception/${uuid.v1()}`,
                                    type:      "bpep:Runtime",
                                    prov:      `${this.#id}enforce/catch`,
                                    step:      "start",
                                    timestamp: util.timestamp()
                                });
                            if (jex.sym !== ERROR_SYM)
                                throw (new ExceptionEnforce({
                                    id:        `${this.#id}${uuid.v1()}`,
                                    prov:      `${this.#id}enforce/`,
                                    exception: jex
                                }));
                            throw(jex);
                        } // try
                    }; // return
                })({enforceable: _enforceable}), enumerable: false
            } // enforce
            ////
            //addTargets:    {
            //    value:         async (targets) => {
            //        try {
            //
            //        } catch (jex) {
            //        } // try
            //    }, enumerable: false
            //}, // addTargets

        }); // Object.defineProperties(BPEPAgent)

        //if (new.target === BPEPAgent)
        //    Object.freeze(this); // REM : not so good... EventEmitter...

    } // constructor

    set enable_runtime_enforce_start(value) {
        if (typeof value !== 'boolean')
            throw (new Error(`BPEPAgent.enable_runtime_enforce_start : value <${value}> has to be of type boolean.`));
        this.#enable_runtime_enforce_start = value;
    }

    set enable_runtime_enforce_end(value) {
        if (typeof value !== 'boolean')
            throw (new Error(`BPEPAgent.enable_runtime_enforce_end : value <${value}> has to be of type boolean.`));
        this.#enable_runtime_enforce_start = value;
    }

    set enable_runtime_enforce_exception(value) {
        if (typeof value !== 'boolean')
            throw (new Error(`BPEPAgent.enable_runtime_enforce_end : value <${value}> has to be of type boolean.`));
        this.#enable_runtime_enforce_exception = value;
    }
} // BPEPAgent

Object.defineProperties(BPEPAgent, {
    id: {value: "https://www.nicos-rd.com/fua/agent/BPEB/", enumerable: true}
}); // Object.defineProperties(BPEPAgent)

Object.freeze(BPEPAgent);
exports.BPEPAgent = BPEPAgent;

// EOF
