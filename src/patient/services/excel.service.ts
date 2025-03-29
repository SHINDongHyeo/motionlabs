import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { Repository } from 'typeorm';
import { ExcelData } from '../excel/excel-data.class';

@Injectable()
export class ExcelService {
	constructor() {}

	createExcelData(
		chartNumber: string,
		name: string,
		phoneNumber: string,
		identifyNumber: string,
		address: string,
		memo: string,
	): ExcelData {
		return new ExcelData(
			chartNumber,
			name,
			phoneNumber,
			identifyNumber,
			address,
			memo,
		);
	}
}
