import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { ExcelService } from './excel.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExcelData } from '../excel/excel-data.class';

describe('PatientService', () => {
	let patientService: PatientService;
	let patientRepository: Repository<Patient>;
	let excelService: ExcelService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PatientService,
				{
					provide: getRepositoryToken(Patient),
					useValue: {
						find: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: ExcelService,
					useValue: {
						createExcelData: jest.fn(),
					},
				},
			],
		}).compile();

		patientService = module.get<PatientService>(PatientService);
		patientRepository = module.get<Repository<Patient>>(
			getRepositoryToken(Patient),
		);
		excelService = module.get<ExcelService>(ExcelService);
	});

	it('Excel 중복 및 병합 처리 - 차트번호 없는 데이터 위로 병합', async () => {
		// given
		const worksheet = {
			'!ref': 'A1:F3',
			'A1': { v: '자료번호' },
			'B1': { v: '이름' },
			'C1': { v: '전화번호' },
			'D1': { v: '주민등록번호' },
			'E1': { v: '주소' },
			'F1': { v: '메모' },

			'A2': { v: '11111' },
			'B2': { v: '홍길동' },
			'C2': { v: '010-1111-1111' },
			'D2': { v: '971010-1111111' },
			'E2': { v: '경기도 수원시 영통구 영통동' },
			'F2': { v: '첫번째 데이터입니다' },

			'A3': { v: '22222' },
			'B3': { v: '이순신' },
			'C3': { v: '010-2222-2222' },
			'D3': { v: '790412-2222222' },
			'E3': { v: '제주도' },
			'F3': { v: '두번째 데이터입니다' },
		};
		// jest.spyOn(excelService, 'createExcelData').mockResolvedValueOnce(
		// );

		// when
		const result = await patientService.processPatientExcel(worksheet);

		// then
		expect(result).toEqual(1);
	});
});
