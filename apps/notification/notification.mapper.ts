import {Mapper} from "@libs/common/ddd";
import {NotificationEntity} from "./src/domain/notification.entity";
import {MessageModel} from "./src/database/notification.repository";
import {NotificationResponseDto} from "./src/dtos/notification.response.dto";

export class NotificationMapper
    implements Mapper<NotificationEntity, MessageModel, NotificationResponseDto>{
    toDomain(record: any): NotificationEntity {
        return undefined;
    }

    toPersistence(entity: NotificationEntity): MessageModel {
        return undefined;
    }

    toResponse(entity: NotificationEntity): NotificationResponseDto {
        return undefined;
    }

}