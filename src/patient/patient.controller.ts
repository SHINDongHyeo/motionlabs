import { Controller, Get, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { GetPatientsReq } from './dto/patient.dto';

@Controller('patient')
export class PatientController {
	constructor(private readonly patientService: PatientService) {}

	@Get()
	async getPatients(@Query() getPatientsReq: GetPatientsReq) {
		return await this.patientService.getPatients(getPatientsReq);
	}

	@Get('test')
	async test() {
		return await this.patientService.test();
	}
}
