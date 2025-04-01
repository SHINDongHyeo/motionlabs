import {
	BadRequestException,
	Controller,
	Get,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { PatientService } from './services/patient.service';
import {
	GetPatientsReq,
	GetPatientsRes,
	UploadPatientExcelRes,
} from './dto/patient.dto';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelFileConfig } from 'src/_common/configs/diskStorageConfig';

@ApiTags('환자')
@Controller('patients')
export class PatientController {
	constructor(private readonly patientService: PatientService) {}

	@Post('upload-excel')
	@UseInterceptors(FileInterceptor('file', excelFileConfig('./uploads')))
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
	@ApiResponse({
		status: 201,
		description: '환자 등록 성공',
		type: UploadPatientExcelRes,
	})
	@ApiResponse({
		status: 400,
		description: '업로드 파일에 대한 에러',
		example: {
			'파일을 업로드해야함': {
				statusCode: 400,
				message: '업로드 파일이 비어있습니다.',
				error: 'Bad Request',
			},
			'허용되지 않은 파일 확장자': {
				statusCode: 400,
				message: '파일 형식이 올바르지 않습니다. (.xlsx 만 허용됨)',
				error: 'Bad Request',
			},
		},
	})
	async uploadPatientExcel(
		@UploadedFile() file: Express.Multer.File,
	): Promise<UploadPatientExcelRes> {
		if (!file) {
			throw new BadRequestException('엑셀 파일을 업로드해주세요.');
		}
		return await this.patientService.uploadPatientExcel(file);
	}

	@Get()
	@ApiOperation({
		summary: '환자 목록 조회',
		description:
			'데이터베이스에 저장된 환자 목록을 조회합니다. 페이지, 이름, 차트번호, 전화번호를 사용해 필터링 가능',
	})
	@ApiResponse({
		status: 200,
		description: '환자 목록 조회 성공',
		type: GetPatientsRes,
	})
	@ApiResponse({
		status: 400,
		description: '잘못된 요청 파라미터 형식',
		example: {
			statusCode: 400,
			message: [
				'page must not be less than 1',
				'page must be an integer number',
			],
			error: 'Bad Request',
		},
	})
	async getPatients(
		@Query() getPatientsReq: GetPatientsReq,
	): Promise<GetPatientsRes> {
		return await this.patientService.getPatients(getPatientsReq);
	}
}
