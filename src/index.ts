import * as cron from "node-cron";
import config from "./config";
import {
  downloadCSV,
  getStaticWorkplace,
  getWorkPlaces,
  getWorkPlacesFromAreas,
  getWorkPlacesFromServices,
  mergeWorkplaces,
  parseSeries,
} from "./functions";
import {
  getNodeControlEndpointAsync,
  getTimeSeriesAsync,
  getWorkPlaceAttributAsync,
  updateDate,
} from "./api-request";

async function generateTable1() {
  console.log("Generating static table");
  const workplaces = await getStaticWorkplace();
  console.log("\tLoaded from captor group");
  const serviceWorkplaces = await getWorkPlacesFromServices();
  console.log("\tLoaded from service group");
  const areaWorkplaces = await getWorkPlacesFromAreas();
  console.log("\tLoaded from area group");
  const to_download = mergeWorkplaces(
    mergeWorkplaces(workplaces, areaWorkplaces),
    serviceWorkplaces
  );
  downloadCSV(config.table.static, to_download);
}

async function generateTable2() {
  console.log("Generating dynamic table");
  let nbErr = 0;
  const workplaces = await getWorkPlaces();
  const table = await Promise.all(
    workplaces.map(async (workplace: any) => {
      try {
        const attr = (await getWorkPlaceAttributAsync(workplace.dynamicId))
          .find((a: any) => a.name === config.attribute.category)
          .attributs.find((a: any) => a.label === config.attribute.name);
        const cp = await getNodeControlEndpointAsync(workplace.dynamicId);
        const ts = await getTimeSeriesAsync(cp.dynamicId);
        const table = parseSeries(workplace.staticId, attr.value, ts);
        return table;
      } catch (e) {
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
    })
  );

  downloadCSV(
    config.table.dynamic,
    table.reduce((e1, e2) => [...e1, ...e2], [])
  );
  console.log(nbErr, "errors");
}

async function Main() {
  await generateTable1();

  cron.schedule("0 1 * * *", () => {
    updateDate();
    generateTable2();
  });
}

Main();
