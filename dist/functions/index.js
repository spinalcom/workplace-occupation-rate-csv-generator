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
exports.mergeWorkplaces = exports.getWorkPlacesFromAreas = exports.getWorkPlacesFromServices = exports.getStaticWorkplace = exports.getWorkPlaces = exports.parseSeries = exports.downloadCSV = void 0;
const moment = require("moment");
const path = require("path");
const fs_1 = require("fs");
const config_1 = require("../config");
const api_request_1 = require("../api-request");
function downloadCSV(prefixTable, data) {
    // creation d'un tableau de string contenant les infos (et séparateurs)
    const entete = Object.keys(data[0]);
    let tableur = [];
    entete.forEach((el) => tableur.push(el, ","));
    tableur.push("\n");
    data.forEach((obj) => {
        entete.forEach((attr) => {
            tableur.push(obj[attr], ",");
        });
        tableur.push("\n");
    });
    const fileName = `${prefixTable}${moment()
        .subtract(1, "day")
        .format("DDMMYY")}.csv`;
    (0, fs_1.writeFile)(path.resolve(`./output/${fileName}`), tableur.join(""), (e) => {
        if (e)
            console.log(e);
        else
            console.log(`${fileName} downloaded`);
    });
}
exports.downloadCSV = downloadCSV;
function parseSeries(workplaceId, series, workplaceCode) {
    const hier = moment(new Date().setHours(0, 0, 0, 0)).subtract(1, "day");
    const dates = Array(24)
        .fill(0)
        .map((e, i) => moment(hier).add(i, "hours").valueOf());
    series.unshift({ date: dates[0], value: 0 });
    dates.forEach((date) => {
        const index = series.findIndex((t) => t.date >= date);
        if (index != -1 && series[index].date !== date)
            series.splice(index, 0, { date, value: series[index - 1].value });
    });
    const durations = series.map((el, ind, arr) => ind < arr.length - 1
        ? {
            date: el.date,
            duration: arr[ind + 1].date - el.date,
            value: el.value,
        }
        : {
            date: el.date,
            duration: new Date(el.date).setMinutes(59, 59, 59) - el.date,
            value: el.value,
        });
    const rates = dates
        .map((date) => durations.filter((d) => moment(d.date).isSame(date, "hour")))
        .map((e) => {
        let quot = 0;
        return Math.round((e.reduce((e1, e2) => {
            quot += e2.duration;
            return e1 + e2.duration * e2.value;
        }, 0) /
            quot) *
            100);
    });
    console.log(durations.map((e) => ({
        date: moment(e.date).format("HH[h]mm"),
        duree: moment(e.duration).format("mm[min]"),
        valeur: e.value,
    })));
    return dates.map((date, i) => ({
        "SpinalNode Id": workplaceId,
        "ID position de travail": workplaceCode,
        Timestamp: date,
        valeur: rates[i],
    }));
}
exports.parseSeries = parseSeries;
function getWorkPlaces() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (yield (0, api_request_1.getEquipementContextesAsync)()).find((c) => c.name === config_1.default.position.context);
        const category = (yield (0, api_request_1.getEquipementCategoriesAsync)(context.dynamicId)).find((c) => c.name === config_1.default.position.category);
        const group = (yield (0, api_request_1.getEquipementGroupsAsync)(context.dynamicId, category.dynamicId)).find((g) => g.name === config_1.default.position.group);
        return (yield (0, api_request_1.getEquipementWorplacesAsync)(context.dynamicId, category.dynamicId, group.dynamicId)).filter((p) => p.name.startsWith(config_1.default.position.equipement));
    });
}
exports.getWorkPlaces = getWorkPlaces;
function getStaticWorkplace() {
    return __awaiter(this, void 0, void 0, function* () {
        const workplaces = yield getWorkPlaces();
        return yield Promise.all(workplaces.map((workplace) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workplacePosition = (yield (0, api_request_1.getWorkPlaceAttributAsync)(workplace.dynamicId))
                    .find((a) => a.name === config_1.default.attribute.category)
                    .attributs.find((a) => a.label === config_1.default.attribute.name);
                try {
                    const workplaceFloor = (yield (0, api_request_1.getPositionAsync)(workplace.dynamicId))
                        .info.floor.name;
                    return {
                        "SpinalNode Id": workplace.staticId,
                        "ID position de travail": workplacePosition.value,
                        Étage: workplaceFloor,
                    };
                }
                catch (_a) {
                    return {
                        "SpinalNode Id": workplace.staticId,
                        "ID position de travail": workplacePosition.value,
                        Étage: undefined,
                    };
                }
            }
            catch (_b) {
                try {
                    const workplaceFloor = (yield (0, api_request_1.getPositionAsync)(workplace.dynamicId))
                        .info.floor.name;
                    return {
                        "SpinalNode Id": workplace.staticId,
                        "ID position de travail": undefined,
                        Étage: workplaceFloor,
                    };
                }
                catch (_c) {
                    return {
                        "SpinalNode Id": workplace.staticId,
                        "ID position de travail": undefined,
                        Étage: undefined,
                    };
                }
            }
        })));
    });
}
exports.getStaticWorkplace = getStaticWorkplace;
function getWorkPlacesFromServices() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (yield (0, api_request_1.getEquipementContextesAsync)()).find((c) => c.name === config_1.default.service.context);
        const categories = yield (0, api_request_1.getEquipementCategoriesAsync)(context.dynamicId);
        const groups = (yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
            return (yield (0, api_request_1.getEquipementGroupsAsync)(context.dynamicId, category.dynamicId)).map((g) => (Object.assign({ category: Object.assign({}, category) }, g)));
        }))))
            .filter((g) => g)
            .reduce((g1, g2) => [...g1, ...g2], []);
        const workplaces = (yield Promise.all(groups.map((group) => __awaiter(this, void 0, void 0, function* () {
            return (yield (0, api_request_1.getEquipementWorplacesAsync)(context.dynamicId, group.category.dynamicId, group.dynamicId))
                .filter((p) => p.name.startsWith(config_1.default.position.equipement))
                .map((wp) => ({
                "SpinalNode Id": wp.staticId,
                //"Service": group.category.name,
                Direction: group.name,
            }));
        }))))
            .filter((wp) => wp)
            .reduce((wp1, wp2) => [...wp1, ...wp2], []);
        return workplaces;
    });
}
exports.getWorkPlacesFromServices = getWorkPlacesFromServices;
function getWorkPlacesFromAreas() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (yield (0, api_request_1.getEquipementContextesAsync)()).find((c) => c.name === config_1.default.quartier.context);
        const category = (yield (0, api_request_1.getEquipementCategoriesAsync)(context.dynamicId)).find((c) => c.name === config_1.default.quartier.category);
        const groups = yield (0, api_request_1.getEquipementGroupsAsync)(context.dynamicId, category.dynamicId);
        const workplaces = (yield Promise.all(groups.map((group) => __awaiter(this, void 0, void 0, function* () {
            return (yield (0, api_request_1.getEquipementWorplacesAsync)(context.dynamicId, category.dynamicId, group.dynamicId))
                .filter((p) => p.name.startsWith(config_1.default.position.equipement))
                .map((wp) => ({
                "SpinalNode Id": wp.staticId,
                Quartier: group.name,
            }));
        }))))
            .filter((wp) => wp)
            .reduce((wp1, wp2) => [...wp1, ...wp2], []);
        return workplaces;
    });
}
exports.getWorkPlacesFromAreas = getWorkPlacesFromAreas;
function mergeWorkplaces(src, to_merge) {
    return src.map((wp) => {
        const found = to_merge.find((tm) => tm["SpinalNode Id"] === wp["SpinalNode Id"]);
        return Object.assign(Object.assign({}, wp), found);
    });
}
exports.mergeWorkplaces = mergeWorkplaces;
//# sourceMappingURL=index.js.map