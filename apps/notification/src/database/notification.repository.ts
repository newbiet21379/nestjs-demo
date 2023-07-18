import {NotificationRepositoryPort} from "./notification.repository.port";
import {SqlRepositoryBase} from "@libs/common/db/sql-repository.base";
import {NotificationEntity} from "../domain/notification.entity";
import {z} from "zod";
import {Injectable, Logger} from "@nestjs/common";
import {InjectPool} from "nestjs-slonik/dist";
import {DatabasePool} from "slonik";
import {EventEmitter2} from "@nestjs/event-emitter";
import {NotificationMapper} from "../../notification.mapper";

export const messageSchema = z.object({
    id: z.string().uuid(),
    created_at: z.preprocess((val: any) => new Date(val), z.date()),
    updated_at: z.preprocess((val: any) => new Date(val), z.date()),
    account_id: z.string(),
    to: z.string(),
    content: z.string(),
    subject: z.string().min(1)
})

export type MessageModel = z.TypeOf<typeof messageSchema>;

@Injectable()
export class NotificationRepository
    extends SqlRepositoryBase<NotificationEntity, any>
    implements NotificationRepositoryPort {
    protected tableName = 'message';

    protected schema = messageSchema;

    constructor(
        @InjectPool()
            pool: DatabasePool,
        mapper: NotificationMapper,
        eventEmitter: EventEmitter2,
    ) {
        super(pool, mapper, eventEmitter, new Logger(NotificationRepository.name));
    }

}
