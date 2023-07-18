import {v4} from 'uuid';

export class EntityId extends String {
    constructor() {
        super(v4().split('-').join(''));
    }
}

export const ENTITY_ID_TRANSFORMER = 'EntityIdTransformer';

export interface EntityIdTransformer {
    from: (dbData: Buffer) => string;
    to: (stringId: string) => Buffer;
}

class entityIdTransformerImpl implements EntityIdTransformer {
    from(dbData: Buffer): string {
        return Buffer.from(dbData.toString('binary'), 'ascii').toString('hex');
    }

    to(entityData: string): Buffer {
        return Buffer.from(entityData, 'hex');
    }
}