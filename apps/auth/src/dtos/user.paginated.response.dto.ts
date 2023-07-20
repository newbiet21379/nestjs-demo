import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.response.dto';
import {PaginatedResponseDto} from "@libs/common/api/paginated.response.base";

export class UserPaginatedResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  readonly data: readonly UserResponseDto[];
}
