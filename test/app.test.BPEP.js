async function BPEP_APP({
                            id:     id,
                            agent:  agent,
                            config: config,
                        }) {

    try {
        let
            process_model = config.process_model,
            result
        ;
        agent.enable_runtime_enforce_start     = true;
        agent.enable_runtime_enforce_end       = true;
        agent.enable_runtime_enforce_exception = true;

        agent.on('event', (data) => {
            console.warn(data);
            //debugger;
        });
        agent.on('runtime', (data) => {
            console.warn(data);
            //debugger;
        });

        //region TEST
        //result = await agent.enforce({id: undefined, param: undefined}); // REM : no identifier
        result = await agent.enforce({id: `${id}process_model/pool/ec_ids_tc/INF_01/start/`, param: undefined}); // REM : unknown identifier
        console.warn(result);
        debugger;
        //endregion TEST

    } catch (jex) {
        //console.error(jex);
        console.warn({
            id:        jex.id,
            type:      jex.type,
            kind:      jex.kind,
            prov:      jex.prov,
            code:      jex.code,
            target:    jex.target,
            message:   jex.message,
            timestamp: jex.timestamp
        });
        debugger;
        //throw(jex); // unhandled EXCEPTION
    } // if ()

} // BPEP_APP()

Object.defineProperties(BPEP_APP, {
    id: {value: "", enumerable: true}
})

module.exports = BPEP_APP;