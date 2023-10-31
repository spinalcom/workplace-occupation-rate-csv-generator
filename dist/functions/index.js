"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSeries = exports.downloadCSV = void 0;
const moment = require("moment");
const fs_1 = require("fs");
const path = require("path");
const hier = moment(new Date().setMonth(9, 20)).subtract(1, "day");
const dates = Array(24)
    .fill(0)
    .map((e, i) => moment(hier).hour(i).minutes(0).seconds(0).milliseconds(0).valueOf());
function downloadCSV(data) {
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
    const fileName = `${process.env.PREFIX_TABLE_2}${moment()
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
function parseSeries(workplaceId, workplaceCode, series) {
    const values = dates
        .map((date) => series.filter((s) => moment(s.date).isSame(date, "hour")))
        .map((val, i, array) => {
        var _a, _b;
        return val.length
            ? [{ date: dates[i], value: (val[0].value + 1) % 2 }, ...val].map((e, i, a) => {
                var _a;
                return ({
                    duration: (((_a = a[i + 1]) === null || _a === void 0 ? void 0 : _a.date) || new Date(e.date).setMinutes(59, 59, 59)) -
                        e.date,
                    value: e.value,
                });
            })
            : [
                {
                    duration: 1,
                    value: ((_b = (_a = array[i - 1]) === null || _a === void 0 ? void 0 : _a[array[i - 1].length - 1]) === null || _b === void 0 ? void 0 : _b.value) || 0,
                },
            ];
    })
        .map((e) => {
        let quot = 0;
        return Math.round((e.reduce((e1, e2) => {
            quot += e2.duration;
            return e1 + e2.duration * e2.value;
        }, 0) /
            quot) *
            100);
    });
    console.log("\tDONE ON WORKPLACE:", workplaceCode);
    return dates.map((date, i) => ({
        "SpinalNode Id": workplaceId,
        "ID position de travail": workplaceCode,
        Timestamp: date,
        valeur: values[i],
    }));
}
exports.parseSeries = parseSeries;
//# sourceMappingURL=index.js.map