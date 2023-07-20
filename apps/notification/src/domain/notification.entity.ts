import {Directive, ObjectType} from "@nestjs/graphql";
import {AggregateID, AggregateRoot} from "@libs/common/ddd";
import {MessageProps} from "./notification.types";
import {v4} from "uuid";

@ObjectType()
@Directive('@key(fields: "id")')
export class NotificationEntity extends AggregateRoot<MessageProps> {
    protected readonly _id: AggregateID;

    static create(create: MessageProps): NotificationEntity {
        const id = v4();
        const props: MessageProps = {...create};
        return new NotificationEntity({id, props});
    }

    validate(): void {
        // entity business rules validation to protect it's invariant before saving entity to a database
    }
}