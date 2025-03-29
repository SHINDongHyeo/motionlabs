import {
	Controller,
	Get,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { PatientService } from './services/patient.service';
import { GetPatientsReq } from './dto/patient.dto';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';

@ApiTags('환자')
@Controller('patient')
export class PatientController {
	constructor(private readonly patientService: PatientService) {}

	@Post('upload-excel')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					callback(null, uniqueSuffix + '-' + file.originalname);
				},
			}),
		}),
	)
	@ApiOperation({
		summary: 'Excel 파일 업로드를 통한 환자 등록',
		description:
			'사용자가 업로드한 Excel 파일을 파싱하여 환자 데이터를 데이터베이스에 저장합니다. 중복된 식별자는 업데이트. 전환번호는 하이픈 제거한 11자리만. 주민등록번호는 하이폰 포함히야 8자리만',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiResponse({ status: 201, description: '환자 등록 성공' })
	async uploadPatientExcel(@UploadedFile() file: Express.Multer.File) {
		return await this.patientService.uploadPatientExcel(file);
	}

	@Get()
	@ApiOperation({
		summary: '환자 목록 조회',
		description:
			'데이터베이스에 저장된 환자 목록을 조회합니다. 페이지, 이름, 차트번호, 전화번호를 사용해 필터링 가능',
	})
	@ApiResponse({ status: 200, description: '환자 목록 조회 성공' })
	async getPatients(@Query() getPatientsReq: GetPatientsReq) {
		return await this.patientService.getPatients(getPatientsReq);
	}
}
