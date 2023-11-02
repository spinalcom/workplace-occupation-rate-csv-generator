import * as cron from "node-cron";
import { downloadCSV, parseSeries } from "./functions";
import {
  getNodeControlEndpointAsync,
  getTimeSeriesAsync,
  getWorkPlaceAttributAsync,
  getWorkPlacesAsync,
  updateDate,
} from "./api-request";

async function generateTable2() {
  const workplaces = await getWorkPlacesAsync();
  const table = await Promise.all(
    workplaces.map(async (workplace: any) => {
      try {
        const attr = await getWorkPlaceAttributAsync(workplace.dynamicId);
        const cp = await getNodeControlEndpointAsync(workplace.dynamicId);
        const ts = await getTimeSeriesAsync(cp.dynamicId);
        console.log("\tTIME SERIES LOADED ON WORKPLACE:", workplace.name);
        const table = parseSeries(workplace.staticId, attr.attributs.value, ts);
        console.log("\tDONE ON WORKPLACE:", workplace.name, "\n");
        return table;
      } catch (e) {
        console.log("\tFAILED TO LOAD ON WORKPLACE:", workplace.name, "\n");
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
  cron.schedule("0 1 * * *", () => {
    updateDate();
    generateTable2();
  });
}

Main();
