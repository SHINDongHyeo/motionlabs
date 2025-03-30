import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

@Entity()
@Unique(['chartNumber', 'name', 'phoneNumber'])
export class Patient {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 11 })
	chartNumber: string;

	@Column({ type: 'varchar', length: 15 })
	name: string;

	@Column({ type: 'varchar', length: 11 })
	phoneNumber: string;

	@Column({ type: 'varchar', length: 8 })
	identifyNumber: string;

	@Column({ type: 'varchar', length: 50 })
	address: string;

	@Column({ type: 'varchar', length: 20 })
	memo: string;
}
