import {Mapper} from "@libs/common/ddd";
import {NotificationEntity} from "./domain/notification.entity";
import {NotificationModel, notificationSchema} from "./database/notification.repository";
import {NotificationResponseDto} from "./dtos/notification.response.dto";

export class NotificationMapper
    implements Mapper<NotificationEntity, NotificationModel, NotificationResponseDto>{
    toDomain(record: NotificationModel): NotificationEntity {
        const entity = new NotificationEntity({
            id: record.id,
            updatedAt: new Date(record.updated_at),
            createdAt: new Date(record.created_at),
            props: {
                accountId: record.account_id,
                to: record.to,
                content: record.content,
                subject: record.subject,
            }
        })
        return entity;
    }

    toPersistence(entity: NotificationEntity): NotificationModel {
        const copy = entity.getProps();
        const record: NotificationModel = {
            id: copy.id,
            account_id: copy.accountId,
            subject: copy.subject,
            content: copy.content,
            to: copy.to,
            created_at: copy.createdAt,
            updated_at: copy.updatedAt,
        };
        return notificationSchema.parse(record);
    }

    toResponse(entity: NotificationEntity): NotificationResponseDto {
        const props = entity.getProps();
        const response = new NotificationResponseDto(entity);
        response.content = props.content;
        response.to = props.to;
        response.content = props.content;
        response.subject = props.subject;
        return response;
    }

}