import {
	InvalidExcelDataException,
	InvalidIdentifyNumberException,
} from 'src/_common/exceptions/invalid-excel-data.exception';
import { ExcelData } from './excel-data.class';

describe('ExcelData', () => {
	let chartNumber;
	let name;
	let phoneNumber;
	let identifyNumber;
	let address;
	let memo;

	beforeEach(() => {
		chartNumber = '396834';
		name = '손흥민';
		phoneNumber = '01012345678';
		identifyNumber = '990101-1234567';
		address = '서울시 강남구';
		memo = '재방문 필요';
	});

	describe('이름 검증 및 변환', () => {
		it('1자 이상 문자열 255자 이하의 문자열 - 성공', () => {
			// given
			name = '가'.repeat(100);

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.name).toBe(name);
		});

		it('256자 이상의 문자열 - 실패', () => {
			// given
			name = '가'.repeat(256);

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});

		it('빈 문자열 - 실패', () => {
			// given
			name = '';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});
	});

	describe('전화번호 검증 및 변환', () => {
		it('11자: Hyphen(-)이 제외된 대한민국 휴대폰 번호 - 성공', () => {
			// given
			phoneNumber = '01000000000';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.phoneNumber).toBe(phoneNumber);
		});

		it('12자: 휴대폰 번호 - 실패', () => {
			// given
			phoneNumber = '010000000000';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});

		it('13자: Hyphen(-)이 포함된 대한민국 휴대폰 번호 - 성공', () => {
			// given
			phoneNumber = '010-0000-0000';
			const transformedPhoneNumber = '01000000000';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.phoneNumber).toBe(transformedPhoneNumber);
		});

		it('13자: Hyphen(-)이 포함되지 않은 대한민국 휴대폰 번호 - 실패', () => {
			// given
			phoneNumber = '0100000000000';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});

		it('14자 이상: 휴대폰 번호 - 실패', () => {
			// given
			phoneNumber = '01000000000000';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});
	});

	describe('주민등록번호 검증 및 변환', () => {
		it('생년월일: 존재할 수 없는 월 - 실패', () => {
			// given
			identifyNumber = '991301';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});

		it('생년월일: 존재할 수 없는 일 - 실패', () => {
			// given
			identifyNumber = '990341';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});

		it('6자: 생년월일 - 성공', () => {
			// given
			// identifyNumber = '900101';
			// const transformedIdentifyNumber = '900101-0';
			identifyNumber = '990101-1234567';
			const transformedIdentifyNumber = '990101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('7자: 생년월일 및 성별 식별값 - 성공', () => {
			// given
			identifyNumber = '9001011';
			const transformedIdentifyNumber = '900101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('7자: 생년월일 및 하이픈 - 실패', () => {
			// given
			identifyNumber = '990101-';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});

		it('8자: 생년월일 및 성별 식별값 - 성공', () => {
			// given
			identifyNumber = '900101-1';
			const transformedIdentifyNumber = '900101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('8자 이상, 14자리 이하: 하이픈없이 생년월일 및 성별 식별값 - 실패', () => {
			// given
			identifyNumber = '9901011111';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});

		it('9자 이상, 14자리 이하: 생년월일 및 성별 식별값 - 성공', () => {
			// given
			identifyNumber = '900101-1111';
			const transformedIdentifyNumber = '900101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('9자 이상, 14자리 이하: 생년월일 및 성별 식별값 - 성공', () => {
			// given
			identifyNumber = '900101-1111111';
			const transformedIdentifyNumber = '900101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('9자 이상, 14자리 이하: 생년월일 및 성별 식별값. *로 마스킹 된 경우 - 성공', () => {
			// given
			identifyNumber = '900101-1******';
			const transformedIdentifyNumber = '900101-1';

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.identifyNumber).toBe(transformedIdentifyNumber);
		});

		it('15자 이상: 하이픈 포함했을 때 최대 자리수를 넘어가는 경우 - 실패', () => {
			// given
			identifyNumber = '990101-11111119';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});

		it('15자 이상: 하이픈 포함했을 때 최대 자리수를 넘어가는 경우(* 마스킹 시) - 실패', () => {
			// given
			identifyNumber = '990101-1*******';

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidIdentifyNumberException);
		});
	});

	describe('차트번호 검증 및 변환', () => {
		it('255자 이하의 문자열 - 성공', () => {
			// given
			chartNumber = '가'.repeat(100);

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.chartNumber).toBe(chartNumber);
		});

		it('256자 이상의 문자열 - 실패', () => {
			// given
			chartNumber = '가'.repeat(256);

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});
	});

	describe('주소 검증 및 변환', () => {
		it('255자 이하의 문자열 - 성공', () => {
			// given
			address = '가'.repeat(100);

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.address).toBe(address);
		});

		it('256자 이상의 문자열 - 실패', () => {
			// given
			address = '가'.repeat(256);

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});
	});

	describe('메모 검증 및 변환', () => {
		it('255자 이하의 문자열 - 성공', () => {
			// given
			memo = '가'.repeat(100);

			// when
			const excelData = new ExcelData(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			// then
			expect(excelData.memo).toBe(memo);
		});

		it('256자 이상의 문자열 - 실패', () => {
			// given
			memo = '가'.repeat(256);

			// when & then
			expect(
				() =>
					new ExcelData(
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					),
			).toThrow(InvalidExcelDataException);
		});
	});
});
