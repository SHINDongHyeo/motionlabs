import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPatientsReq {
	@Transform(({ value }) => parseInt(value, 10))
	@IsNumber()
	page: number;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@IsString()
	@IsOptional()
	chartNumber?: string;
}
