export declare function downloadCSV(data: any): void;
export declare function parseSeries(workplaceId: string, workplaceCode: string, series: any[]): {
    "SpinalNode Id": string;
    "ID position de travail": string;
    Timestamp: number;
    valeur: number;
}[];
