import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export function excelFileConfig(destination: string) {
	const allowedExtensions = ['.xlsx'];

	return {
		storage: diskStorage({
			destination,
			filename: (req, file, callback) => {
				const newFilename = generateTimestampedFilename(
					file.originalname,
				);
				callback(null, newFilename);
			},
		}),
		fileFilter: (req, file, callback) => {
			const extension = file.originalname.slice(
				file.originalname.lastIndexOf('.'),
			);
			if (!allowedExtensions.includes(extension.toLowerCase())) {
				return callback(
					new BadRequestException(
						`파일 형식이 올바르지 않습니다. (${allowedExtensions.join(
							', ',
						)} 만 허용됨)`,
					),
					false,
				);
			}
			callback(null, true);
		},
	};
}

function generateTimestampedFilename(originalName: string): string {
	const now = new Date();

	const year = now.getFullYear().toString().slice(-2);
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	const timeSuffix = `${year}${month}${day}_${hours}${minutes}${seconds}`;
	const safeFilename = Buffer.from(originalName, 'latin1').toString('utf8');

	return `${timeSuffix}_${safeFilename}`;
}
