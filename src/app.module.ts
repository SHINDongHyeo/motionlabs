import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('MYSQL_HOST'),
				port: configService.get<number>('MYSQL_PORT'),
				username: configService.get<string>('MYSQL_USERNAME'),
				password: configService.get<string>('MYSQL_PASSWORD'),
				database: configService.get<string>('MYSQL_DATABASE'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
				logging: false,
			}),
		}),
		PatientModule,
	],
})
export class AppModule {}
