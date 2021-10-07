const
    path         = require('path'),
    util         = require('@nrd/fua.core.util'),
    uuid         = require("@nrd/fua.core.uuid"),
    //
    {BPEPAgent}  = require('../src/agent.BPEP'),
    BPMN_factory = require('../../module.BPMN-2.0/src/module.BPMN'),
    //
    app_uri      = "https://www.nicos-rd.com/test/BPEF_APP/"
; // const

let
    config = {}
;
(async () => {

    function endExit(token) {
        debugger;
    }

    const
        bpep_agent = new BPEPAgent({
            id: "https://www.nicos-rd.com/test/BPEFAgent/"
        }) // new BPEPAgent()
    ;

    let BPMN = BPMN_factory({
        //uri: "https://www.nicos-rd.com/fua/module/BPMN/" // REM : default
        //prefix: "bpmn", // REM : default
        bpep:      Object.freeze({
            id:      bpep_agent.id,
            addNode: bpep_agent.addNode,
            hasNode: bpep_agent.hasNode,
            getNode: bpep_agent.getNode
        }),
        doAddNode: true
    });

    //BPMN.doAddNode    = true;
    let
        BPEF_graph = /** @graph */ [
            {
                id:       `${app_uri}process_model/pool/ec_ids_tc/`,
                type:     "bpmn:Pool",
                label:    "IDS testcase",
                swimLane: [`${app_uri}process_model/pool/ec_ids_tc/INF_01/`]
            },
            {
                id:       `${app_uri}process_model/pool/ec_ids_tc/INF_01/`,
                type:     "bpmn:SwimLane",
                label:    "Testcase 'INF_01'",
                start:    {
                    id:   `${app_uri}process_model/pool/ec_ids_tc/INF_01/start/`,
                    exit: `${app_uri}process_model/pool/ec_ids_tc/INF_01/getSelfDescription/`
                },
                activity: [
                    {
                        id:    `${app_uri}process_model/pool/ec_ids_tc/INF_01/getSelfDescription/`,
                        type:  "bpmn:Activity",
                        label: "getSelfDescription",
                        exec:  async ({param: param}) => {
                            console.warn(param);
                            //debugger;
                            let result = {mahl: "zeit"};
                            return result;
                        },
                        exit:  `${app_uri}process_model/pool/ec_ids_tc/INF_01/end/`
                    }
                ],
                end:      {
                    id:   `${app_uri}process_model/pool/ec_ids_tc/INF_01/end/`,
                    exit: /** callback */(token) => { // REM : functions will NOT be replaced by 'renderTargets''...
                        console.warn(token);
                        //debugger;
                    }
                }
                //start:              {
                //    id:   `${app_uri}process_model/pool/ec_ids_tc/INF_01#start`,
                //    type: "bpmn:Start"
                //},
                //getSelfDescription: {
                //    id:   `${app_uri}process_model/pool/ec_ids_tc/INF_01#getSelfDescription`,
                //    type: "bpmn:Activity"
                //},
                //end:                {
                //    id:   `${app_uri}process_model/pool/ec_ids_tc/INF_01#end`,
                //    type: "bpmn:End"
                //}
            }
        ],

        start              = undefined,
        activity           = undefined,
        end                = undefined
    ;

    let BPMN_buildExecutableFromGraph_result = await BPMN.buildExecutableFromGraph(BPEF_graph);
    console.warn(BPMN_buildExecutableFromGraph_result);
    debugger;

    //process_model_two.set()
    try {
        //pool = BPMN.Pool({}),
        //start    = BPMN.Start({
        //    id:   process_model.swim_lane.marzipan.start.id,
        //    exit: process_model.swim_lane.marzipan.mammahinne.id
        //});
        //activity = BPMN.Activity({
        //    id:   process_model.swim_lane.marzipan.mammahinne.id,
        //    exec: async ({param: param}) => {
        //        console.warn(param);
        //        //debugger;
        //        let result = {mahl: "zeit"};
        //        return result;
        //    },
        //    exit: process_model.swim_lane.marzipan.end.id
        //});
        ////bpep_agent.addNode(start);
        //end      = BPMN.End({
        //    id:   process_model.swim_lane.marzipan.end.id,
        //    exit: /** callback */(token) => { // REM : functions will NOT be replaced by 'renderTargets''...
        //        console.warn(token);
        //        //debugger;
        //    }
        //});
        //bpep_agent.addNode(end);
    } catch (jex) {
        debugger;
    } // try
    let renderTargetsResult = await bpep_agent.renderTargets({param: undefined});
    config.process_model    = process_model;

    const BPEP_APP = require('./app.test.BPEP')({
        id:     app_uri,
        agent:  bpep_agent,
        config: config
    });

})().catch(console.error);
