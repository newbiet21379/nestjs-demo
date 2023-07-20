import {ApiProperty} from "@nestjs/swagger";

export class JwtResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        description: 'Jwt Token',
    })
    jwt: string;

    @ApiProperty({
        example: 'joh-doe@gmail.com',
        description: "User's email address",
    })
    email: string;
}