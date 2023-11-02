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

import config from "../config";
import { HTTP } from "./http-config";
import * as moment from "moment";

let today;

export function updateDate() {
  today = moment();
  today.hours(0);
  today.minutes(0);
  today.seconds(0);
}

// Positions de travail
export async function getEquipementContextesAsync() {
  return (await HTTP.get(`/equipementsGroup/list`)).data;
}

export async function getEquipementCategoriesAsync(contextId: number) {
  return (await HTTP.get(`/equipementsGroup/${contextId}/category_list`)).data;
}

export async function getEquipementGroupsAsync(
  contextId: number,
  categoryId: number
) {
  return (
    await HTTP.get(
      `/equipementsGroup/${contextId}/category/${categoryId}/group_list`
    )
  ).data;
}

export async function getEquipementWorplacesAsync(
  contextId: number,
  categoryId: number,
  groupId: number
) {
  return (
    await HTTP.get(
      `/equipementsGroup/${contextId}/category/${categoryId}/group/${groupId}/equipementList`
    )
  ).data;
}

export async function getPositionAsync(equipementId: number) {
  return (await HTTP.get(`/equipement/${equipementId}/get_postion`)).data;
}

// Attributs
export async function getWorkPlaceAttributAsync(workplaceId: number) {
  return (await HTTP.get(`/node/${workplaceId}/attributsList`)).data;
}

// Points de contrôle
export async function getNodeControlEndpointAsync(nodeId: number) {
  const result = await HTTP.get(`/node/${nodeId}/control_endpoint_list`);
  const profile = result.data.find(
    (d: any) => d.profileName === config.endpoint.profile
  );
  return profile.endpoints.find((p: any) => p.name === config.endpoint.name);
}

// Time series
export async function getTimeSeriesAsync(endpointId: number) {
  const begin = moment(today).subtract(1, "day");

  const result = await HTTP.get(
    `/endpoint/${endpointId}/timeSeries/read/${begin.format(
      "DD-MM-YYYY HH:mm:ss"
    )}/${today.format("DD-MM-YYYY HH:mm:ss")}`
  );
  return result.data;
}
