import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidWorksheetException extends HttpException {
	constructor(message: string) {
		super(
			{ statusCode: HttpStatus.BAD_REQUEST, message },
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class NoRefException extends InvalidWorksheetException {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidRefException extends InvalidWorksheetException {
	constructor(message: string) {
		super(message);
	}
}
