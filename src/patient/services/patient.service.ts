import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { OffsetWithoutLimitNotSupportedError, Repository } from 'typeorm';
import { GetPatientsReq } from '../dto/patient.dto';
import * as XLSX from 'xlsx';
import { ExcelService } from './excel.service';
import { InvalidExcelDataException } from 'src/_common/exceptions/invalid-excel-data.exception';

@Injectable()
export class PatientService {
	constructor(
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
		private readonly excelService: ExcelService,
	) {}

	async uploadPatientExcel(file: Express.Multer.File) {
		const workbook = XLSX.readFile(file.path, { type: 'buffer' });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];

		// 셀 범위
		const startRow = Number(worksheet['!ref'].split(':')[0].slice(1)) + 1;
		const endRow = Number(worksheet['!ref'].split(':')[1].slice(1));

		for (let i = startRow; i <= endRow; i++) {
			const chartNumber = worksheet[`A${i}`]['v'];
			const name = worksheet[`B${i}`]['v'];
			const phoneNumber = worksheet[`C${i}`]['v'];
			const identifyNumber = worksheet[`D${i}`]['v'];
			const address = worksheet[`E${i}`]['v'];
			const memo = worksheet[`F${i}`]['v'];

			try {
				const excelData = this.excelService.createExcelData(
					chartNumber,
					name,
					phoneNumber,
					identifyNumber,
					address,
					memo,
				);
				console.log(excelData);
			} catch (error) {
				if (error instanceof InvalidExcelDataException) {
					console.log(error.message);
					continue;
				}
			}

			console.log(
				chartNumber,
				name,
				phoneNumber,
				identifyNumber,
				address,
				memo,
			);

			if (i === 10) {
				break;
			}
		}
		return 1;
	}

	async getPatients(getPatientsReq: GetPatientsReq) {
		try {
			const { page, name, phoneNumber, chartNumber } = getPatientsReq;
			const numberOfPatientsPerPage = 10;

			return await this.patientRepository.find({
				take: page * numberOfPatientsPerPage,
				skip: (page - 1) * numberOfPatientsPerPage,
			});
		} catch (error) {
			throw error;
		}
	}
}
