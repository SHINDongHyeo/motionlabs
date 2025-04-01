import { BadRequestException, Injectable } from '@nestjs/common';
import { ExcelData } from '../excel/excel-data.class';
import * as XLSX from 'xlsx';
import { InvalidExcelDataException } from 'src/_common/exceptions/invalid-excel-data.exception';
import {
	InvalidRefException,
	InvalidWorksheetException,
	NoRefException,
} from 'src/_common/exceptions/invalid-worksheet.exception';

@Injectable()
export class ExcelService {
	constructor() {}

	getWorksheetFromExcel(
		file: Express.Multer.File,
		sheetIndex: number = 0,
	): XLSX.WorkSheet {
		// file 검증( Excel 여부 )
		const allowedMimeTypes = [
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		];
		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException('엑셀 파일만 업로드 가능합니다.');
		}

		const workbook = XLSX.readFile(file.path, { type: 'buffer' });
		const sheetName = workbook.SheetNames[sheetIndex];
		const worksheet = workbook.Sheets[sheetName];

		return worksheet;
	}

	private getRefFromWorksheet(worksheet: XLSX.WorkSheet): {
		startRow: number;
		endRow: number;
	} {
		// !ref 검증
		const ref = worksheet['!ref'];

		if (!ref) {
			throw new NoRefException('!ref 정보가 없습니다.');
		}

		const refRegex = /^[A-Z]+\d+:[A-Z]+\d+$/;
		if (!refRegex.test(ref)) {
			throw new InvalidRefException('유효하지 않은 !ref 입니다.');
		}

		// Cell 범위 추출
		const [startCell, endCell] = ref.split(':');
		const startRow = parseInt(startCell.match(/\d+/)?.[0] || '0', 10) + 1;
		const endRow = parseInt(endCell.match(/\d+/)?.[0] || '0', 10);

		return { startRow, endRow };
	}

	private getExcelData(
		worksheet: XLSX.WorkSheet,
		rowIndex: number,
	): ExcelData {
		// Excel 컬럼별 데이터 추출
		const chartNumber = String(worksheet[`A${rowIndex}`]?.['v'] ?? '');
		const name = String(worksheet[`B${rowIndex}`]?.['v'] ?? '');
		const phoneNumber = String(worksheet[`C${rowIndex}`]?.['v'] ?? '');
		const identifyNumber = String(worksheet[`D${rowIndex}`]?.['v'] ?? '');
		const address = String(worksheet[`E${rowIndex}`]?.['v'] ?? '');
		const memo = String(worksheet[`F${rowIndex}`]?.['v'] ?? '');

		return this.createExcelData(
			chartNumber,
			name,
			phoneNumber,
			identifyNumber,
			address,
			memo,
		);
	}

	private handleChartNumberExists(
		patientMap: Map<string, ExcelData>,
		idMapForNoChartNumber: Map<string, string>,
		shortId: string,
		excelData: ExcelData,
	) {
		const fullId = `${excelData.chartNumber}|${excelData.name}|${excelData.phoneNumber}`;
		idMapForNoChartNumber.set(shortId, fullId);

		if (patientMap.has(fullId)) {
			patientMap.set(
				fullId,
				this.updateExcelData(patientMap.get(fullId), excelData),
			);
		} else {
			patientMap.set(fullId, excelData);
		}
	}

	private handleNoChartNumber(
		patientMap: Map<string, ExcelData>,
		idMapForNoChartNumber: Map<string, string>,
		shortId: string,
		excelData: ExcelData,
	) {
		if (idMapForNoChartNumber.has(shortId)) {
			const fullId = idMapForNoChartNumber.get(shortId);
			patientMap.set(
				fullId,
				this.updateExcelData(patientMap.get(fullId), excelData),
			);
		} else {
			idMapForNoChartNumber.set(shortId, shortId);
			patientMap.set(shortId, excelData);
		}
	}

	processWorksheet(worksheet: XLSX.WorkSheet): {
		patientMap: Map<string, ExcelData>;
		numberOfErrorData: number;
	} {
		// 환자정보 Map. key는 차트번호, 이름, 전화번호로 이루어져 있음. value는 ExcelData 객체  ex) { "875112|홍길동|01023335988" : ExcelData 객체 }
		const patientMap = new Map<string, ExcelData>();
		// 차트번호 Map. key는 이름, 전화번호로 이루어져 있음. value는 차트번호, 이름, 전화번호로 이루어져 있음.  ex) { "홍길동|01023335988" : "875112|홍길동|01023335988" }
		const idMapForNoChartNumber = new Map<string, string>();
		// 검증 실패한 데이터 개수
		let numberOfErrorData: number = 0;

		const { startRow, endRow } = this.getRefFromWorksheet(worksheet);
		for (let i = startRow; i <= endRow; i++) {
			try {
				const excelData = this.getExcelData(worksheet, i);
				const shortId = `${excelData.name}|${excelData.phoneNumber}`;

				if (excelData.chartNumber !== '') {
					this.handleChartNumberExists(
						patientMap,
						idMapForNoChartNumber,
						shortId,
						excelData,
					);
				} else {
					this.handleNoChartNumber(
						patientMap,
						idMapForNoChartNumber,
						shortId,
						excelData,
					);
				}
			} catch (error) {
				if (error instanceof InvalidExcelDataException) {
					numberOfErrorData += 1;
				}
			}
		}

		return { patientMap, numberOfErrorData };
	}

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

	private updateExcelData(
		oldExcelData: ExcelData,
		newExcelData: ExcelData,
	): ExcelData {
		let chartNumber = oldExcelData.chartNumber;
		let name = oldExcelData.name;
		let phoneNumber = oldExcelData.phoneNumber;
		let identifyNumber = oldExcelData.identifyNumber;
		let address = oldExcelData.address;
		let memo = oldExcelData.memo;

		if (newExcelData.chartNumber) chartNumber = newExcelData.chartNumber;
		if (newExcelData.name) name = newExcelData.name;
		if (newExcelData.phoneNumber) phoneNumber = newExcelData.phoneNumber;
		if (newExcelData.identifyNumber)
			identifyNumber = newExcelData.identifyNumber;
		if (newExcelData.address) address = newExcelData.address;
		if (newExcelData.memo) memo = newExcelData.memo;

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
