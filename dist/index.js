"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = require("node-cron");
const config_1 = require("./config");
const functions_1 = require("./functions");
const api_request_1 = require("./api-request");
function generateTable1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Generating static table");
        const workplaces = yield (0, functions_1.getWorkPlaces)();
        console.log("\tLoaded from captor group");
        const serviceWorkplaces = yield (0, functions_1.getWorkPlacesFromServices)();
        console.log("\tLoaded from service group");
        const areaWorkplaces = yield (0, functions_1.getWorkPlacesFromAreas)();
        console.log("\tLoaded from area group");
        const to_download = (0, functions_1.mergeWorkplaces)((0, functions_1.mergeWorkplaces)(workplaces, areaWorkplaces), serviceWorkplaces);
        (0, functions_1.downloadCSV)(config_1.default.table.static, to_download);
    });
}
function generateTable2() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Generating dynamic table");
        let nbErr = 0;
        const workplaces = yield (0, functions_1.getWorkPlaces)();
        const table = yield Promise.all(workplaces.map((workplace) => __awaiter(this, void 0, void 0, function* () {
            try {
                const attr = (yield (0, api_request_1.getWorkPlaceAttributAsync)(workplace.dynamicId))
                    .find((a) => a.name === config_1.default.attribute.category)
                    .attributs.find((a) => a.label === config_1.default.attribute.name);
                const cp = yield (0, api_request_1.getNodeControlEndpointAsync)(workplace.dynamicId);
                const ts = yield (0, api_request_1.getTimeSeriesAsync)(cp.dynamicId);
                const table = (0, functions_1.parseSeries)(workplace.staticId, attr.value, ts);
                return table;
            }
            catch (e) {
                nbErr++;
                return [
                    {
                        "SpinalNode Id": workplace.staticId,
                        "ID position de travail": undefined,
                        Timestamp: undefined,
                        valeur: undefined,
                    },
                ];
            }
        })));
        (0, functions_1.downloadCSV)(config_1.default.table.dynamic, table.reduce((e1, e2) => [...e1, ...e2], []));
        console.log(nbErr, "errors");
    });
}
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield generateTable1();
        cron.schedule("0 1 * * *", () => {
            (0, api_request_1.updateDate)();
            generateTable2();
        });
    });
}
Main();
//# sourceMappingURL=index.js.map