import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { OffsetWithoutLimitNotSupportedError, Repository } from 'typeorm';
import {
	GetPatientsReq,
	GetPatientsRes,
	PatientRes,
	UploadPatientExcelRes,
} from '../dto/patient.dto';
import * as XLSX from 'xlsx';
import { ExcelService } from './excel.service';
import { InvalidExcelDataException } from 'src/_common/exceptions/invalid-excel-data.exception';
import { ExcelData } from '../excel/excel-data.class';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PatientService {
	constructor(
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
		private readonly excelService: ExcelService,
	) {}

	async uploadPatientExcel(
		file: Express.Multer.File,
	): Promise<UploadPatientExcelRes> {
		const worksheet = this.excelService.getWorksheetFromExcel(file);
		const { patientMap, numberOfErrorData } =
			this.excelService.processWorksheet(worksheet);
		const result = await this.addPatientsByPatientsMap(
			patientMap,
			numberOfErrorData,
		);

		return plainToInstance(UploadPatientExcelRes, result, {
			excludeExtraneousValues: true,
		});
	}

	async addPatientsByPatientsMap(
		patientExcelMap: Map<string, ExcelData>,
		numberOfErrorData: number,
		batchSize: number = 50000,
	): Promise<UploadPatientExcelRes> {
		const patientsData = Array.from(patientExcelMap.values()).map(
			(excelData) => ({
				chartNumber: excelData.chartNumber,
				name: excelData.name,
				phoneNumber: excelData.phoneNumber,
				identifyNumber: excelData.identifyNumber,
				address: excelData.address,
				memo: excelData.memo,
			}),
		);

		// 배치 단위로 데이터를 나누어서 처리
		const totalRows = patientsData.length;
		let processedRows = 0;

		for (let i = 0; i < totalRows; i += batchSize) {
			const batch = patientsData.slice(i, i + batchSize);

			// chartNumber, name, phoneNumber 중복되면 update, 중복되지 않으면 insert
			const result = await this.patientRepository.upsert(batch, [
				'chartNumber',
				'name',
				'phoneNumber',
			]);

			const affectedRows = Number(result['raw']['affectedRows']);
			processedRows += affectedRows;
		}

		return {
			totalRows: processedRows + numberOfErrorData,
			processedRows: processedRows,
			skippedRows: numberOfErrorData,
		};
	}

	async getPatients(getPatientsReq: GetPatientsReq): Promise<GetPatientsRes> {
		const { page, name, phoneNumber, chartNumber } = getPatientsReq;
		const NUMBER_OF_PATIENTS_PER_PAGE = 10;

		// 필터링
		let whereConditions = {};

		if (name) whereConditions['name'] = name;
		if (phoneNumber) whereConditions['phoneNumber'] = phoneNumber;
		if (chartNumber) whereConditions['chartNumber'] = chartNumber;

		// 조회
		const [patients, total] = await this.patientRepository.findAndCount({
			where: whereConditions,
			order: { id: 'DESC' },
			take: NUMBER_OF_PATIENTS_PER_PAGE,
			skip: (page - 1) * NUMBER_OF_PATIENTS_PER_PAGE,
		});

		return plainToInstance(
			GetPatientsRes,
			{
				total: total,
				page: page,
				count: patients.length,
				data: plainToInstance(PatientRes, patients, {
					excludeExtraneousValues: true,
				}),
			},
			{ excludeExtraneousValues: true },
		);
	}
}
