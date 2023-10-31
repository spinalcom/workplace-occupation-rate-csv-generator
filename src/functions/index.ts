import * as moment from "moment";
import { writeFile } from "fs";
import * as path from "path";

export function downloadCSV(data) {
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

  writeFile(path.resolve(`./output/${fileName}`), tableur.join(""), (e) => {
    if (e) console.log(e);
    else console.log(`${fileName} downloaded`);
  });
}

export function parseSeries(
  workplaceId: string,
  workplaceCode: string,
  series: any[]
) {
  const hier = moment(new Date().setHours(0, 0, 0, 0)).subtract(1, "day");
  const dates = Array(24)
    .fill(0)
    .map((e, i) => moment(hier).valueOf());

  const values = dates
    .map((date) => series.filter((s) => moment(s.date).isSame(date, "hour")))
    .map((val, i, array) =>
      val.length
        ? [{ date: dates[i], value: (val[0].value + 1) % 2 }, ...val].map(
            (e, i, a) => ({
              duration:
                (a[i + 1]?.date || new Date(e.date).setMinutes(59, 59, 59)) -
                e.date,
              value: e.value,
            })
          )
        : [
            {
              duration: 1,
              value: array[i - 1]?.[array[i - 1].length - 1]?.value || 0,
            },
          ]
    )
    .map((e) => {
      let quot = 0;
      return Math.round(
        (e.reduce((e1, e2) => {
          quot += e2.duration;
          return e1 + e2.duration * e2.value;
        }, 0) /
          quot) *
          100
      );
    });
  console.log("\tDONE ON WORKPLACE:", workplaceCode);

  return dates.map((date, i) => ({
    "SpinalNode Id": workplaceId,
    "ID position de travail": workplaceCode,
    Timestamp: date,
    valeur: values[i],
  }));
}
