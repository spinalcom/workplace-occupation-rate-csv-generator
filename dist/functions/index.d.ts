export declare function downloadCSV(prefixTable: string, data: any[]): void;
export declare function parseSeries(workplaceId: string, workplaceCode: string, series: any[]): {
    "SpinalNode Id": string;
    "ID position de travail": string;
    Timestamp: number;
    valeur: number;
}[];
export declare function getWorkPlaces(): Promise<any>;
export declare function getStaticWorkplace(): Promise<any[]>;
export declare function getWorkPlacesFromServices(): Promise<any>;
export declare function getWorkPlacesFromAreas(): Promise<any>;
export declare function mergeWorkplaces(src: any[], to_merge: any[]): any[];
