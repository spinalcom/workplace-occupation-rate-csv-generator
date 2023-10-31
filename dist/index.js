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
const functions_1 = require("./functions");
const api_request_1 = require("./api-request");
function generateTable1() {
    return __awaiter(this, void 0, void 0, function* () {
        let nbErr = 0;
        const workplaces = yield (0, api_request_1.getWorkPlacesAsync)();
        const table = yield Promise.all(workplaces.map((workplace) => __awaiter(this, void 0, void 0, function* () {
            try {
                const attr = yield (0, api_request_1.getWorkPlaceAttributAsync)(workplace.dynamicId);
                const cp = yield (0, api_request_1.getNodeControlEndpointAsync)(workplace.dynamicId);
                const ts = yield (0, api_request_1.getTimeSeriesAsync)(cp.dynamicId);
                console.log("\tTIME SERIES LOADED ON WORKPLACE:", workplace.name, " | ", attr.attributs.value);
                return (0, functions_1.parseSeries)(workplace.staticId, attr.attributs.value, ts);
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
        (0, functions_1.downloadCSV)(table.reduce((e1, e2) => [...e1, ...e2], []));
    });
}
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        //cron.schedule("0 1 * * *", () => {
        generateTable1();
        //});
    });
}
Main();
//# sourceMappingURL=index.js.map