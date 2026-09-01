"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class L2ObjectCollection extends Set {
    closest() {
        const mobs = Array.from(this);
        return mobs.reduce((m, p) => (p.Distance < m.Distance ? p : m), mobs[0]);
    }
    containsObjectId(objId) {
        for (const item of this) {
            if (item.ObjectId === objId) {
                return true;
            }
        }
        return false;
    }
    containsId(id) {
        for (const item of this) {
            if (item.Id === id) {
                return true;
            }
        }
        return false;
    }
    containsName(name) {
        for (const item of this) {
            if (item.Name === name) {
                return true;
            }
        }
        return false;
    }
    getEntryByObjectId(objId) {
        for (const item of this) {
            if (item.ObjectId === objId) {
                return item;
            }
        }
    }
    getEntryById(id) {
        for (const item of this) {
            if (item.Id === id) {
                return item;
            }
        }
    }
    getEntryByName(name) {
        for (const item of this) {
            if (item.Name === name) {
                return item;
            }
        }
    }
    removeById(id) {
        for (const item of this) {
            if (item.Id === id) {
                this.delete(item);
            }
        }
    }
    removeByObjectId(objId) {
        for (const item of this) {
            if (item.ObjectId === objId) {
                this.delete(item);
            }
        }
    }
    delete(value) {
        value.offAll();
        return super.delete(value);
    }
    clear() {
        this.forEach(item => item.offAll());
        return super.clear();
    }
}
exports.default = L2ObjectCollection;
