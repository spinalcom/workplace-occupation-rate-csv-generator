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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
exports.default = {
    table: {
        static: process.env.PREFIX_TABLE_1,
        dynamic: process.env.PREFIX_TABLE_2,
    },
    position: {
        context: process.env.CONTEXT_NAME_POSITION_TRAVAIL,
        category: process.env.CATEGORY_NAME_POSITION_TRAVAIL,
        group: process.env.GROUP_NAME_POSITION_TRAVAIL,
        equipement: process.env.EQUIPEMENT_NAME_POSITION_TRAVAIL,
    },
    service: {
        context: process.env.CONTEXT_NAME_SERVICE,
    },
    quartier: {
        context: process.env.CONTEXT_NAME_QUARTIER,
        category: process.env.CATEGORY_NAME_QUARTIER,
    },
    attribute: {
        category: process.env.CATEGORY_ATTRIBUTE_NAME,
        name: process.env.ATTRIBUTE_NAME,
    },
    endpoint: {
        profile: process.env.PROFILE_NAME,
        name: process.env.ENDPOINT_NAME,
    },
};
//# sourceMappingURL=config.js.map