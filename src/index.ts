import * as cron from "node-cron";
import { downloadCSV, parseSeries } from "./functions";
import {
  getNodeControlEndpointAsync,
  getTimeSeriesAsync,
  getWorkPlaceAttributAsync,
  getWorkPlacesAsync,
} from "./api-request";

async function generateTable1() {
  let nbErr = 0;
  const workplaces = await getWorkPlacesAsync();
  const table = await Promise.all(
    workplaces.map(async (workplace: any) => {
      try {
        const attr = await getWorkPlaceAttributAsync(workplace.dynamicId);
        const cp = await getNodeControlEndpointAsync(workplace.dynamicId);
        const ts = await getTimeSeriesAsync(cp.dynamicId);
        console.log(
          "\tTIME SERIES LOADED ON WORKPLACE:",
          workplace.name,
          " | ",
          attr.attributs.value
        );
        return parseSeries(workplace.staticId, attr.attributs.value, ts);
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

  downloadCSV(table.reduce((e1, e2) => [...e1, ...e2], []));
}

async function Main() {
  //cron.schedule("0 1 * * *", () => {
  generateTable1();
  //});
}

Main();
