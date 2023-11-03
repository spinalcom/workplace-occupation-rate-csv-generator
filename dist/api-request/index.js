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
exports.getTimeSeriesAsync = exports.getNodeControlEndpointAsync = exports.getWorkPlaceAttributAsync = exports.getPositionAsync = exports.getEquipementWorplacesAsync = exports.getEquipementGroupsAsync = exports.getEquipementCategoriesAsync = exports.getEquipementContextesAsync = exports.updateDate = void 0;
const config_1 = require("../config");
const http_config_1 = require("./http-config");
const moment = require("moment");
let today;
function updateDate() {
    today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
}
exports.updateDate = updateDate;
// Positions de travail
function getEquipementContextesAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/equipementsGroup/list`)).data;
    });
}
exports.getEquipementContextesAsync = getEquipementContextesAsync;
function getEquipementCategoriesAsync(contextId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/equipementsGroup/${contextId}/category_list`)).data;
    });
}
exports.getEquipementCategoriesAsync = getEquipementCategoriesAsync;
function getEquipementGroupsAsync(contextId, categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/equipementsGroup/${contextId}/category/${categoryId}/group_list`)).data;
    });
}
exports.getEquipementGroupsAsync = getEquipementGroupsAsync;
function getEquipementWorplacesAsync(contextId, categoryId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/equipementsGroup/${contextId}/category/${categoryId}/group/${groupId}/equipementList`)).data;
    });
}
exports.getEquipementWorplacesAsync = getEquipementWorplacesAsync;
function getPositionAsync(equipementId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/equipement/${equipementId}/get_postion`)).data;
    });
}
exports.getPositionAsync = getPositionAsync;
// Attributs
function getWorkPlaceAttributAsync(workplaceId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield http_config_1.HTTP.get(`/node/${workplaceId}/attributsList`)).data;
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
        const begin = moment(today).subtract(1, "day");
        const result = {
            data: [
                { date: 1698904801219, value: 0 },
                { date: 1698913983166, value: 1 },
                { date: 1698917641742, value: 1 },
                { date: 1698921693120, value: 1 },
                { date: 1698923641999, value: 0 },
                { date: 1698924005499, value: 0 },
                { date: 1698928141091, value: 0 },
                { date: 1698930229651, value: 1 },
                { date: 1698933004342, value: 0 },
                { date: 1698933345170, value: 1 },
                { date: 1698933959891, value: 0 },
                { date: 1698934174209, value: 1 },
                { date: 1698935161320, value: 0 },
                { date: 1698935440587, value: 1 },
                { date: 1698937070018, value: 1 },
                { date: 1698939480437, value: 0 },
                { date: 1698939516716, value: 1 },
                { date: 1698940320318, value: 0 },
                { date: 1698940469635, value: 1 },
                { date: 1698942300788, value: 0 },
                { date: 1698965722239, value: 0 },
            ],
        }; /*await HTTP.get(
          `/endpoint/${endpointId}/timeSeries/read/${begin.format(
            "DD-MM-YYYY HH:mm:ss"
          )}/${today.format("DD-MM-YYYY HH:mm:ss")}`
        );*/
        return result.data;
    });
}
exports.getTimeSeriesAsync = getTimeSeriesAsync;
//# sourceMappingURL=index.js.map