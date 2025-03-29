import { Module } from '@nestjs/common';
import { PatientService } from './services/patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { ExcelService } from './services/excel.service';

@Module({
	imports: [TypeOrmModule.forFeature([Patient])],
	controllers: [PatientController],
	providers: [PatientService, ExcelService],
})
export class PatientModule {}
