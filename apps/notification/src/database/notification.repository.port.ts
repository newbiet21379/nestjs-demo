import {RepositoryPort} from "@libs/common/ddd";
import {NotificationEntity} from "../domain/notification.entity";

export interface NotificationRepositoryPort extends RepositoryPort<NotificationEntity>{
}
