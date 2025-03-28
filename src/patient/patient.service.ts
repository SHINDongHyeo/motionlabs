import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { OffsetWithoutLimitNotSupportedError, Repository } from 'typeorm';
import { GetPatientsReq } from './dto/patient.dto';

@Injectable()
export class PatientService {
	constructor(
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>,
	) {}

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

	async test() {
		this.getPatients({ page: 1 });
		return 1;
	}
}
