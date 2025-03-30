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

	updateExcelData(
		oldExcelData: ExcelData,
		newExcelData: ExcelData,
	): ExcelData {
		let chartNumber = oldExcelData.chartNumber;
		let name = oldExcelData.name;
		let phoneNumber = oldExcelData.phoneNumber;
		let identifyNumber = oldExcelData.identifyNumber;
		let address = oldExcelData.address;
		let memo = oldExcelData.memo;

		if (newExcelData.chartNumber) {
			chartNumber = newExcelData.chartNumber;
		}

		if (newExcelData.name) {
			name = newExcelData.name;
		}

		if (newExcelData.phoneNumber) {
			phoneNumber = newExcelData.phoneNumber;
		}

		if (newExcelData.identifyNumber) {
			identifyNumber = newExcelData.identifyNumber;
		}

		if (newExcelData.address) {
			address = newExcelData.address;
		}

		if (newExcelData.memo) {
			memo = newExcelData.memo;
		}
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
