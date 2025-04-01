import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { ExcelService } from './excel.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExcelData } from '../excel/excel-data.class';

describe('ExcelService', () => {
	let excelService: ExcelService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ExcelService],
		}).compile();

		excelService = module.get<ExcelService>(ExcelService);
	});

	describe('노션에 적힌 케이스', () => {
		it('Excel 중복 및 병합 처리 - 차트번호 없는 데이터 위로 병합 (2)', async () => {
			// given
			const worksheet = {
				'!ref': 'A1:F7',
				'A1': { v: '자료번호' },
				'B1': { v: '이름' },
				'C1': { v: '전화번호' },
				'D1': { v: '주민등록번호' },
				'E1': { v: '주소' },
				'F1': { v: '메모' },

				'A2': { v: 'C_1001' },
				'B2': { v: '김환자1' },
				'C2': { v: '010-0000-0000' },
				'D2': { v: '010101-1111111' },
				'E2': { v: '서울특별시 성동구' },
				'F2': { v: '3.6 방문' },

				'B3': { v: '김환자1' },
				'C3': { v: '010-0000-0000' },
				'D3': { v: '010101-1111111' },
				'F3': { v: '3.7 방문' },

				'A4': { v: 'C_1002' },
				'B4': { v: '김환자1' },
				'C4': { v: '010-0000-0000' },
				'D4': { v: '010101-1111111' },
				'E4': { v: '서울특별시 성동구' },
				'F4': { v: '노쇼' },

				'B5': { v: '김환자1' },
				'C5': { v: '010-0000-0000' },
				'D5': { v: '010101-2' },
				'F5': { v: '3.7 방문' },

				'A6': { v: 'C_1002' },
				'B6': { v: '김환자1' },
				'C6': { v: '010-0000-0000' },
				'D6': { v: '010101-1' },
				'E6': { v: '서울특별시 강동구' },

				'B7': { v: '김환자2' },
				'C7': { v: '010-0000-0000' },
				'D7': { v: '010101-1' },
			};

			// when
			const { patientMap, numberOfErrorData } =
				excelService.processWorksheet(worksheet);

			// then
			expect(patientMap).toEqual(
				new Map([
					[
						'C_1001|김환자1|01000000000',
						expect.objectContaining({
							address: '서울특별시 성동구',
							chartNumber: 'C_1001',
							identifyNumber: '010101-1',
							memo: '3.7 방문',
							name: '김환자1',
							phoneNumber: '01000000000',
						}),
					],
					[
						'C_1002|김환자1|01000000000',
						expect.objectContaining({
							address: '서울특별시 강동구',
							chartNumber: 'C_1002',
							identifyNumber: '010101-1',
							memo: '3.7 방문',
							name: '김환자1',
							phoneNumber: '01000000000',
						}),
					],
					[
						'김환자2|01000000000',
						expect.objectContaining({
							address: '',
							chartNumber: '',
							identifyNumber: '010101-1',
							memo: '',
							name: '김환자2',
							phoneNumber: '01000000000',
						}),
					],
				]),
			);

			expect(numberOfErrorData).toEqual(0);
		});
	});

	describe('Excel 중복 및 병합 처리', () => {
		it('차트번호 없는 경우 데이터 위로 병합 - 성공', async () => {
			// given
			const worksheet = {
				'!ref': 'A1:F4',
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

				'B3': { v: '홍길동' },
				'C3': { v: '010-1111-1111' },
				'D3': { v: '790412-2222222' },
				'E3': { v: '제주도' },
				'F3': { v: '두번째 데이터입니다' },

				'A4': { v: '22222' },
				'B4': { v: '손흥민' },
				'C4': { v: '010-1111-1111' },
				'D4': { v: '971010-1111111' },
				'E4': { v: '경기도 수원시 영통구 영통동' },
			};

			// when
			const { patientMap, numberOfErrorData } =
				excelService.processWorksheet(worksheet);

			// then
			expect(patientMap).toEqual(
				new Map([
					[
						'11111|홍길동|01011111111',
						expect.objectContaining({
							address: '제주도',
							chartNumber: '11111',
							identifyNumber: '790412-2',
							memo: '두번째 데이터입니다',
							name: '홍길동',
							phoneNumber: '01011111111',
						}),
					],
					[
						'22222|손흥민|01011111111',
						expect.objectContaining({
							address: '경기도 수원시 영통구 영통동',
							chartNumber: '22222',
							identifyNumber: '971010-1',
							memo: '',
							name: '손흥민',
							phoneNumber: '01011111111',
						}),
					],
				]),
			);
			expect(numberOfErrorData).toEqual(0);
		});
	});
});
