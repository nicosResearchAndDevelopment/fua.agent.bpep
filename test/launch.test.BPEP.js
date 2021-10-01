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
            hasNode: bpep_agent.hasNode
        }),
        doAddNode: true
    });

    //BPMN.doAddNode    = true;
    let
        process_model = {
            ec:        {
                type: "bpmn:SwimLane",
                gax:  {
                    type: "bpmn:SwimLane"

                },
                ids:  {
                    type:   "bpmn:SwimLane",
                    INF_01: {
                        type: "bpmn:SubProcess"
                    }
                },
                ip:   {
                    type: "bpmn:SwimLane",
                    ping: {
                        type: "bpmn:SubProcess"
                    }
                },
                net:  {
                    type:  "bpmn:SwimLane",
                    sniff: {
                        type: "bpmn:SubProcess"
                    }
                }
            },
            swim_lane: {
                id:       `${app_uri}process_model/swim_lane/`,
                type:     "bpmn:SwimLane",
                marzipan: {
                    id:         `${app_uri}process_model/swim_lane/marzipan/`,
                    type:       "bpmn:SwimLane",
                    start:      {
                        id:   `${app_uri}process_model/swim_lane/marzipan#start`,
                        type: "bpmn:Start"
                    },
                    mammahinne: {
                        id:   `${app_uri}process_model/swim_lane/marzipan/mammahinne/`,
                        type: "bpmn:Activity"
                    },
                    end:        {
                        id:   `${app_uri}process_model/swim_lane/marzipan#end`,
                        type: "bpmn:End"
                    }
                }
            }
        },
        start         = undefined,
        activity      = undefined,
        end           = undefined
    ;
    try {
        start    = BPMN.Start({
            id:   process_model.swim_lane.marzipan.start.id,
            exit: process_model.swim_lane.marzipan.mammahinne.id
        });
        activity = BPMN.Activity({
            id:   process_model.swim_lane.marzipan.mammahinne.id,
            exec: async ({param: param}) => {
                console.warn(param);
                //debugger;
                let result = {mahl: "zeit"};
                return result;
            },
            exit: process_model.swim_lane.marzipan.end.id
        });
        //bpep_agent.addNode(start);
        end      = BPMN.End({
            id:   process_model.swim_lane.marzipan.end.id,
            exit: /** callback */(token) => { // REM : functions will NOT be replaced by 'renderTargets''...
                console.warn(token);
                //debugger;
            }
        });
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
