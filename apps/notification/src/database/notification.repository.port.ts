import {RepositoryPort} from "@libs/common/ddd";
import {NotificationEntity} from "../domain/notification.entity";
import {FindNotificationRequestDto} from "../queries/find-notification/find-notification.request.dto";

export interface NotificationRepositoryPort extends RepositoryPort<NotificationEntity>{
    find(options: FindNotificationRequestDto): Promise<NotificationEntity[] | null>
}
