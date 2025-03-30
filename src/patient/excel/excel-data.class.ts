import { InvalidExcelDataException } from 'src/_common/exceptions/invalid-excel-data.exception';

export class ExcelData {
	chartNumber: string;
	name: string;
	phoneNumber: string;
	identifyNumber: string;
	address: string;
	memo: string;

	constructor(
		chartNumber: string,
		name: string,
		phoneNumber: string,
		identifyNumber: string,
		address: string,
		memo: string,
	) {
		this.chartNumber = this.validateChartNumber(chartNumber);
		this.name = this.validateName(name);
		this.phoneNumber = this.validatePhoneNumber(phoneNumber);
		this.identifyNumber = this.validateIdentifyNumber(identifyNumber);
		this.address = this.validateAddress(address);
		this.memo = this.validateMemo(memo);
	}

	// 이름 유효성 검사: 1자 이상 255자 이하
	private validateName(name: string = ''): string {
		if (name.length < 1 || name.length > 255) {
			throw new InvalidExcelDataException('잘못된 이름 형식입니다.');
		}
		return name;
	}

	// 전화번호 유효성 검사: 대한민국 휴대폰 번호만 + 11자(하이픈X) / 13자(하이픈O) 둘 다 하이픈없는 11자리로 수정
	private validatePhoneNumber(phoneNumber: string = ''): string {
		const phoneRegex = /^010\d{8}$|^010-\d{4}-\d{4}$/;

		if (!phoneRegex.test(phoneNumber)) {
			throw new InvalidExcelDataException('잘못된 전화번호 형식입니다.');
		}

		if (phoneNumber.length === 13) {
			phoneNumber = phoneNumber.replace(/-/g, '');
		}

		if (phoneNumber.length === 11) {
			return phoneNumber;
		} else {
			throw new InvalidExcelDataException(
				'전화번호는 11자리여야 합니다.',
			);
		}
	}

	// 주민등록번호 유효성 검사
	private validateIdentifyNumber(identifyNumber: string = ''): string {
		const identifyNumberRegex =
			/^(?:\d{6}|\d{7}|\d{6}-\d{1,}|\d{6}-\d{1}\*+)$/;

		if (!identifyNumberRegex.test(identifyNumber)) {
			throw new InvalidExcelDataException(
				'잘못된 주민등록번호 형식입니다.',
			);
		}

		if (identifyNumber.length === 6) {
			return `${identifyNumber}-0`;
		}

		if (identifyNumber.length === 7) {
			return `${identifyNumber.slice(0, 6)}-${identifyNumber.slice(6)}`;
		}

		if (identifyNumber.length >= 8) {
			return `${identifyNumber.slice(0, 6)}-${identifyNumber.slice(
				7,
				8,
			)}`;
		}

		return identifyNumber;
	}

	// 차트번호 유효성 검사 (필요시 추가)
	private validateChartNumber(chartNumber: string = ''): string {
		if (chartNumber.length > 255) {
			throw new InvalidExcelDataException('잘못된 이름 형식입니다.');
		}
		return chartNumber;
	}

	// 주소 유효성 검사 (필요시 추가)
	private validateAddress(address: string = ''): string {
		if (address.length > 255) {
			throw new InvalidExcelDataException('잘못된 이름 형식입니다.');
		}
		return address;
	}

	// 메모 유효성 검사 (필요시 추가)
	private validateMemo(memo: string = ''): string {
		if (memo.length > 255) {
			throw new InvalidExcelDataException('잘못된 이름 형식입니다.');
		}
		return memo;
	}
}
