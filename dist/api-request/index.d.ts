export declare function updateDate(): void;
export declare function getEquipementContextesAsync(): Promise<any>;
export declare function getEquipementCategoriesAsync(contextId: number): Promise<any>;
export declare function getEquipementGroupsAsync(contextId: number, categoryId: number): Promise<any>;
export declare function getEquipementWorplacesAsync(contextId: number, categoryId: number, groupId: number): Promise<any>;
export declare function getPositionAsync(equipementId: number): Promise<any>;
export declare function getWorkPlaceAttributAsync(workplaceId: number): Promise<any>;
export declare function getNodeControlEndpointAsync(nodeId: number): Promise<any>;
export declare function getTimeSeriesAsync(endpointId: number): Promise<any>;
