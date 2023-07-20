import {Module} from '@nestjs/common';
import {pbkdf2Sync} from 'crypto';

export interface PasswordGeneratorPort {
    generateKey: (secret: string) => string;
}

class PasswordGenerator implements PasswordGeneratorPort {
    generateKey(secret: string): string {
        return pbkdf2Sync(secret, 'salt', 100000, 256, 'sha512').toString();
    }
}

export const PASSWORD_GENERATOR = 'PasswordGenerator';

@Module({
    providers: [
        {
            provide: PASSWORD_GENERATOR,
            useClass: PasswordGenerator,
        },
    ],
    exports: [PASSWORD_GENERATOR],
})
export class PasswordModule {
}
