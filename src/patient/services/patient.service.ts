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

		// chartNumber, name, phoneNumber 중복되면 update, 중복되지 않으면 insert
		const result = await this.patientRepository.upsert(patientsData, [
			'chartNumber',
			'name',
			'phoneNumber',
		]);

		// TODO: 이거 더 명확하게 알아내느 방법 필요할듯?
		const processedRows = Number(result['raw']['affectedRows']);

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
