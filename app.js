'use strict';

const puppeteer = require('puppeteer');
const url = 'http://transcripts.cnn.com/TRANSCRIPTS/';

(async() => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setJavaScriptEnabled(false);
	await page.goto(url);
	console.log(await page.title());
	
	const links = await page.$$eval('.cnnTransCal > a', links => {
        return links.map((link) => link.href);
    });	
	console.log(links.join('\n'));
	
	for(let link of links) {
		await page.goto(link);
		
		const links = await page.$$eval('.cnnSectBulletItems > a', links => {
            return links.map((link) => link.href);
        });
		console.log(links.join('\n'));
		
		for(let link of links) {
			await page.goto(link);
			
			if (await page.$('.cnnTransStoryHead')) {
			    var head = await page.$eval('.cnnTransStoryHead', item => {
                    return item.textContent;
                });
			}
			if (await page.$('.cnnTransSubHead')) {
			    var subhead = await page.$eval('.cnnTransSubHead', item => {
                    return item.textContent;
                });
			}
			if (await page.$('.cnnBodyText')) {
			    var bodys = await page.$$eval('.cnnBodyText', list => {
                    return list.map(data => data.textContent);
                });
			}
			
			console.log(head, bodys[0]);
			//console.log(subhead);
			//console.log(bodys[0]);
		}
	}
	
	await browser.close();
})();
