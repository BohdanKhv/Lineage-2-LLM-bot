import L2Object from "./L2Object";
export default class L2ObjectCollection<T extends L2Object> extends Set<T> {
    closest(): T;
    containsObjectId(objId: number): boolean;
    containsId(id: number): boolean;
    containsName(name: string): boolean;
    getEntryByObjectId(objId: number): T | undefined;
    getEntryById(id: number): T | undefined;
    getEntryByName(name: string): T | undefined;
    removeById(id: number): void;
    removeByObjectId(objId: number): void;
    delete(value: T): boolean;
    clear(): void;
}
