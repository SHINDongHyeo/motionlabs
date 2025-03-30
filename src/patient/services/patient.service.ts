import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { OffsetWithoutLimitNotSupportedError, Repository } from 'typeorm';
import { GetPatientsReq } from '../dto/patient.dto';
import * as XLSX from 'xlsx';
import { ExcelService } from './excel.service';
import { InvalidExcelDataException } from 'src/_common/exceptions/invalid-excel-data.exception';
import { ExcelData } from '../excel/excel-data.class';

@Injectable()
export class PatientService {
	constructor(
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
		private readonly excelService: ExcelService,
	) {}

	processPatientExcel(worksheet): Map<string, ExcelData> {
		// Cell 범위
		const startRow = Number(worksheet['!ref'].split(':')[0].slice(1)) + 1;
		const endRow = Number(worksheet['!ref'].split(':')[1].slice(1));

		const worksheetMap = new Map<string, ExcelData>();
		const idMapForNoChartNumber = new Map<string, string>();
		for (let i = startRow; i <= endRow; i++) {
			const chartNumber = String(worksheet[`A${i}`]?.['v']);
			const name = String(worksheet[`B${i}`]?.['v']);
			const phoneNumber = String(worksheet[`C${i}`]?.['v']);
			const identifyNumber = String(worksheet[`D${i}`]?.['v']);
			const address = String(worksheet[`E${i}`]?.['v']);
			const memo = String(worksheet[`F${i}`]?.['v']);

			try {
				// Excel 데이터 검증
				const excelData = this.excelService.createExcelData(
					chartNumber,
					name,
					phoneNumber,
					identifyNumber,
					address,
					memo,
				);

				const shortId = `${excelData.name}|${excelData.phoneNumber}`;
				// 차트번호 존재 시
				if (excelData.chartNumber !== '') {
					const fullId = `${excelData.chartNumber}|${excelData.name}|${excelData.phoneNumber}`;
					idMapForNoChartNumber.set(shortId, fullId);

					if (worksheetMap.has(fullId)) {
						const oldExcelData = worksheetMap.get(fullId);
						const updatedExcelData =
							this.excelService.updateExcelData(
								oldExcelData,
								excelData,
							);

						worksheetMap.set(fullId, updatedExcelData);
					} else {
						worksheetMap.set(fullId, excelData);
					}
				}
				// 차트번호 존재하지 않을 시
				else {
					if (idMapForNoChartNumber.has(shortId)) {
						const fullId = idMapForNoChartNumber.get(shortId);

						const oldExcelData = worksheetMap.get(fullId);
						const updatedExcelData =
							this.excelService.updateExcelData(
								oldExcelData,
								excelData,
							);

						worksheetMap.set(fullId, updatedExcelData);
					} else {
						idMapForNoChartNumber.set(shortId, shortId);

						worksheetMap.set(shortId, excelData);
					}
				}
			} catch (error) {
				// Excel 데이터 검증 실패 시
				if (error instanceof InvalidExcelDataException) {
					console.log(
						'error난 데이터',
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					);
					console.log(error.message);
				}
				// 예측하지 못한 에러 시
				else {
					console.log(
						'알 수 없는error난 데이터',
						chartNumber,
						name,
						phoneNumber,
						identifyNumber,
						address,
						memo,
					);
					console.log(error.message);
				}
			}

			if (i === 20) {
				break;
			}
		}

		return worksheetMap;
	}

	async uploadPatientExcel(file: Express.Multer.File) {
		const workbook = XLSX.readFile(file.path, { type: 'buffer' });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];

		const patientExcelMap = this.processPatientExcel(worksheet);

		return await this.addPatientsByExcelMap(patientExcelMap);
	}

	async addPatientsByExcelMap(patientExcelMap: Map<string, ExcelData>) {
		console.log(patientExcelMap);

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
		const result = await this.patientRepository.upsert(patientsData, [
			'chartNumber',
			'name',
			'phoneNumber',
		]);
		console.log(result['raw']);
		const numberOfRows = Number(result['raw']['affectedRows']);
		const resultRawInfo = result['raw']['info'];
		const numberOfDuplicates = Number(
			resultRawInfo.match(/Duplicates:\s*(\d+)/)[1],
		);
		return {
			totalRows: numberOfRows,
			processedRows: numberOfRows - numberOfDuplicates,
			skippedRows: numberOfDuplicates,
		};
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
