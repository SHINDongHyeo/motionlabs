import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidExcelDataException extends HttpException {
	constructor(message: string) {
		super(
			{ statusCode: HttpStatus.BAD_REQUEST, message },
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class InvalidIdentifyNumberException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidNameException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidPhoneNumberException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidChartNumberException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidAddressException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidMemoException extends InvalidExcelDataException {
	constructor(message: string) {
		super(message);
	}
}
