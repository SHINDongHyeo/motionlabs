import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPatientsReq {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@ApiProperty({ example: '1', description: '조회할 페이지' })
	page: number = 1;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '홍길동', description: '환자의 이름' })
	name?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({
		example: '01012345678',
		description: '환자의 전화번호(하이픈(-) 제거한 형태)',
	})
	phoneNumber?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: '100001', description: '환자의 차트번호' })
	chartNumber?: string;
}
