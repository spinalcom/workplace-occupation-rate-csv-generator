"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
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
exports.getTimeSeriesAsync = exports.getNodeControlEndpointAsync = exports.getWorkPlaceAttributAsync = exports.getWorkPlacesAsync = void 0;
const config_1 = require("../config");
const http_config_1 = require("./http-config");
const moment = require("moment");
const today = moment();
today.hours(0);
today.minutes(0);
today.seconds(0);
// Positions de travail
function getWorkPlacesAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (yield http_config_1.HTTP.get(`/equipementsGroup/list`)).data.find((c) => c.name === config_1.default.position.context);
        const category = (yield http_config_1.HTTP.get(`/equipementsGroup/${context.dynamicId}/category_list`)).data.find((c) => c.name === config_1.default.position.category);
        const group = (yield http_config_1.HTTP.get(`/equipementsGroup/${context.dynamicId}/category/${category.dynamicId}/group_list`)).data.find((g) => g.name === config_1.default.position.group);
        return (yield http_config_1.HTTP.get(`/equipementsGroup/${context.dynamicId}/category/${category.dynamicId}/group/${group.dynamicId}/equipementList`)).data.filter((p) => p.name.startsWith(config_1.default.position.equipement));
    });
}
exports.getWorkPlacesAsync = getWorkPlacesAsync;
// Attributs
function getWorkPlaceAttributAsync(workplaceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const category_attribut = (yield http_config_1.HTTP.get(`/node/${workplaceId}/attributsList`)).data.find((a) => a.name === config_1.default.attribute.category);
        category_attribut.attributs = category_attribut.attributs.find((a) => a.label === config_1.default.attribute.name);
        return category_attribut;
    });
}
exports.getWorkPlaceAttributAsync = getWorkPlaceAttributAsync;
// Points de contrôle
function getNodeControlEndpointAsync(nodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield http_config_1.HTTP.get(`/node/${nodeId}/control_endpoint_list`);
        const profile = result.data.find((d) => d.profileName === config_1.default.endpoint.profile);
        return profile.endpoints.find((p) => p.name === config_1.default.endpoint.name);
    });
}
exports.getNodeControlEndpointAsync = getNodeControlEndpointAsync;
// Time series
function getTimeSeriesAsync(endpointId) {
    return __awaiter(this, void 0, void 0, function* () {
        const begin = moment(today).subtract(1, "year");
        const result = yield http_config_1.HTTP.get(`/endpoint/${endpointId}/timeSeries/readCurrentYear`);
        /*await HTTP.get(
          `/endpoint/${endpointId}/timeSeries/read/${begin.format(
            "DD-MM-YYYY HH:mm:ss"
          )}/${today.format("DD-MM-YYYY HH:mm:ss")}`
        );*/
        return result.data;
    });
}
exports.getTimeSeriesAsync = getTimeSeriesAsync;
//# sourceMappingURL=index.js.map