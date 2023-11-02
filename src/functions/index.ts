import * as moment from "moment";
import * as path from "path";
import { writeFile } from "fs";
import config from "../config";
import {
  getEquipementCategoriesAsync,
  getEquipementContextesAsync,
  getEquipementGroupsAsync,
  getEquipementWorplacesAsync,
  getPositionAsync,
  getWorkPlaceAttributAsync,
} from "../api-request";

export function downloadCSV(prefixTable: string, data: any[]) {
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

  writeFile(path.resolve(`./output/${fileName}`), tableur.join(""), (e) => {
    if (e) console.log(e);
    else console.log(`${fileName} downloaded`);
  });
}

export function parseSeries(
  workplaceId: string,
  series: any[],
  workplaceCode?: string
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

  return dates.map((date, i) => ({
    "SpinalNode Id": workplaceId,
    "ID position de travail": workplaceCode,
    Timestamp: date,
    valeur: values[i],
  }));
}

export async function getWorkPlaces() {
  const context = (await getEquipementContextesAsync()).find(
    (c: any) => c.name === config.position.context
  );
  const category = (await getEquipementCategoriesAsync(context.dynamicId)).find(
    (c: any) => c.name === config.position.category
  );
  const group = (
    await getEquipementGroupsAsync(context.dynamicId, category.dynamicId)
  ).find((g: any) => g.name === config.position.group);
  return (
    await getEquipementWorplacesAsync(
      context.dynamicId,
      category.dynamicId,
      group.dynamicId
    )
  ).filter((p: any) => p.name.startsWith(config.position.equipement));
}

export async function getStaticWorkplace() {
  const workplaces = await getWorkPlaces();
  return await Promise.all(
    workplaces.map(async (workplace) => {
      try {
        const workplacePosition = (
          await getWorkPlaceAttributAsync(workplace.dynamicId)
        )
          .find((a: any) => a.name === config.attribute.category)
          .attributs.find((a: any) => a.label === config.attribute.name);
        try {
          const workplaceFloor = (await getPositionAsync(workplace.dynamicId))
            .info.floor.name;
          return {
            "SpinalNode Id": workplace.staticId,
            "ID position de travail": workplacePosition.value,
            Étage: workplaceFloor,
          };
        } catch {
          return {
            "SpinalNode Id": workplace.staticId,
            "ID position de travail": workplacePosition.value,
            Étage: undefined,
          };
        }
      } catch {
        try {
          const workplaceFloor = (await getPositionAsync(workplace.dynamicId))
            .info.floor.name;
          return {
            "SpinalNode Id": workplace.staticId,
            "ID position de travail": undefined,
            Étage: workplaceFloor,
          };
        } catch {
          return {
            "SpinalNode Id": workplace.staticId,
            "ID position de travail": undefined,
            Étage: undefined,
          };
        }
      }
    })
  );
}

export async function getWorkPlacesFromServices() {
  const context = (await getEquipementContextesAsync()).find(
    (c: any) => c.name === config.service.context
  );

  const categories = await getEquipementCategoriesAsync(context.dynamicId);

  const groups = (
    await Promise.all(
      categories.map(async (category) =>
        (
          await getEquipementGroupsAsync(context.dynamicId, category.dynamicId)
        ).map((g) => ({ category: { ...category }, ...g }))
      )
    )
  )
    .filter((g) => g)
    .reduce((g1, g2) => [...g1, ...g2], []);

  const workplaces = (
    await Promise.all(
      groups.map(async (group) =>
        (
          await getEquipementWorplacesAsync(
            context.dynamicId,
            group.category.dynamicId,
            group.dynamicId
          )
        )
          .filter((p: any) => p.name.startsWith(config.position.equipement))
          .map((wp) => ({
            "SpinalNode Id": wp.staticId,
            //"Service": group.category.name,
            Direction: group.name,
          }))
      )
    )
  )
    .filter((wp) => wp)
    .reduce((wp1, wp2) => [...wp1, ...wp2], []);
  return workplaces;
}

export async function getWorkPlacesFromAreas() {
  const context = (await getEquipementContextesAsync()).find(
    (c: any) => c.name === config.quartier.context
  );

  const category = (await getEquipementCategoriesAsync(context.dynamicId)).find(
    (c) => c.name === config.quartier.category
  );

  const groups = await getEquipementGroupsAsync(
    context.dynamicId,
    category.dynamicId
  );

  const workplaces = (
    await Promise.all(
      groups.map(async (group) =>
        (
          await getEquipementWorplacesAsync(
            context.dynamicId,
            category.dynamicId,
            group.dynamicId
          )
        )
          .filter((p: any) => p.name.startsWith(config.position.equipement))
          .map((wp) => ({
            "SpinalNode Id": wp.staticId,
            Quartier: group.name,
          }))
      )
    )
  )
    .filter((wp) => wp)
    .reduce((wp1, wp2) => [...wp1, ...wp2], []);
  return workplaces;
}

export function mergeWorkplaces(src: any[], to_merge: any[]) {
  return src.map((wp) => {
    const found = to_merge.find(
      (tm) => tm["SpinalNode Id"] === wp["SpinalNode Id"]
    );
    return { ...wp, ...found };
  });
}
