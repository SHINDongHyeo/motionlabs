import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Patient } from '../entities/patient.entity';

export class GetPatientsReq {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	@ApiProperty({
		example: '1',
		description: '조회할 페이지',
		required: false,
	})
	page: number = 1;

	@IsOptional()
	@IsString()
	@ApiProperty({
		example: '이예원',
		description: '이름',
		required: false,
	})
	name?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({
		example: '01018556059',
		description: '전화번호(하이픈(-) 제거한 형태)',
		required: false,
	})
	phoneNumber?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({
		example: '95573',
		description: '차트번호',
		required: false,
	})
	chartNumber?: string;
}

export class GetPatientsRes {
	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({ example: '150', description: '조회한 전체 데이터 개수' })
	total: number;

	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({ example: '1', description: '조회한 페이지' })
	page: number;

	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({
		example: '10',
		description: '해당 페이지에 조회된 데이터 개수',
	})
	count: number;

	@Expose()
	@ApiProperty({
		example: `[{
      "id": 90973,
      "chartNumber": "95573",
      "name": "이예원",
      "phoneNumber": "01018556059",
      "identifyNumber": "870218-1",
      "address": "undefined",
      "memo": "수술 이력 있음"
    },
    {
      "id": 91154,
      "chartNumber": "441996",
      "name": "이예원",
      "phoneNumber": "01039399395",
      "identifyNumber": "921014-3",
      "address": "경상남도 양주시 가락10거리 33-62 (현정이면)",
      "memo": "약물 알레르기"
    },
    {
      "id": 91553,
      "chartNumber": "818974",
      "name": "이예원",
      "phoneNumber": "01033831199",
      "identifyNumber": "940226-2",
      "address": "인천광역시 남구 백제고분가 지하877 (정훈강허리)",
      "memo": "undefined"
    },
    {
      "id": 91689,
      "chartNumber": "323060",
      "name": "이예원",
      "phoneNumber": "01040449174",
      "identifyNumber": "780302-0",
      "address": "대전광역시 서구 반포대794로 497",
      "memo": "당뇨"
    },
    {
      "id": 91719,
      "chartNumber": "720258",
      "name": "이예원",
      "phoneNumber": "01097227506",
      "identifyNumber": "871228-2",
      "address": "경상북도 용인시 기흥구 영동대41가 400-54",
      "memo": "당뇨"
    },
    {
      "id": 92839,
      "chartNumber": "370728",
      "name": "이예원",
      "phoneNumber": "01036155758",
      "identifyNumber": "981107-2",
      "address": "서울특별시 남구 서초대길 211",
      "memo": "undefined"
    },
    {
      "id": 92974,
      "chartNumber": "310045",
      "name": "이예원",
      "phoneNumber": "01078391851",
      "identifyNumber": "580122-0",
      "address": "전라남도 평택시 학동가 423-53 (진호이박마을)",
      "memo": "undefined"
    },
    {
      "id": 94633,
      "chartNumber": "55414",
      "name": "이예원",
      "phoneNumber": "01048182436",
      "identifyNumber": "820817-1",
      "address": "세종특별자치시 영등포구 서초중앙6거리 517",
      "memo": "undefined"
    },
    {
      "id": 95013,
      "chartNumber": "752161",
      "name": "이예원",
      "phoneNumber": "01076994178",
      "identifyNumber": "771209-2",
      "address": "대구광역시 동작구 삼성618길 지하258",
      "memo": "수술 이력 있음"
    },
    {
      "id": 95427,
      "chartNumber": "21260",
      "name": "이예원",
      "phoneNumber": "01038536656",
      "identifyNumber": "890203-0",
      "address": "충청남도 수원시 팔달구 삼성977로 644 (서연김박면)",
      "memo": "당뇨"
    }]`,
		description: '조호된 count 개수만큼의 환자 데이터',
	})
	data: Patient[];
}

export class UploadPatientExcelRes {
	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({ example: '150', description: '전체 데이터 개수' })
	totalRows: number;

	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({
		example: '146',
		description: '데이터베이스 반영된 데이터 개수',
	})
	processedRows: number;

	@Expose()
	@IsInt()
	@Min(0)
	@ApiProperty({
		example: '4',
		description: '데이터베이스 반영되지 않은 데이터 개수',
	})
	skippedRows: number;
}
