#!/usr/bin/env node
const process = require('process');
const puppeteer = require('puppeteer');

const readStream = (buffer, cb) => {
	return new Promise((resolve, reject) => {
		let content = '';

		process.stdin.on('readable', () => {
			const chunk = process.stdin.read();
			if ( chunk != null ) {
				content += chunk;
			}
		});

		process.stdin.on('end', () => resolve(cb(content)));
	});
}

(async () => {
	const pdfBuffer = await readStream(process.stdin, stdin => {
		return new Promise((async (resolve, reject) => {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.setContent(stdin, { waitUntil: [ 'domcontentloaded', 'networkidle0' ] });

			const pdfBuffer = await page.pdf({format: 'A4'});

			await browser.close();

			resolve(pdfBuffer);
		}));
	});

	process.stdout.write(pdfBuffer);
})();
