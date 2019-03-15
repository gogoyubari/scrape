'use strict';

const puppeteer = require('puppeteer');
const url = 'http://transcripts.cnn.com/TRANSCRIPTS/';
var fsExtra = require('fs-extra');

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
                    return item.innerText;
                });
            }
            if (await page.$('.cnnTransSubHead')) {
                var subhead = await page.$eval('.cnnTransSubHead', item => {
                    return item.innerText;
                });
            }
            if (await page.$('.cnnBodyText')) {
                var bodys = await page.$$eval('.cnnBodyText', list => {
                    return list.map(data => data.innerText);
                });
            }
            
            console.log(head, bodys[0]);
			var filename = `txt/${head}/${bodys[0]}`.replace(/\:|\?|\.|"|<|>|\|/g, '');
            fsExtra.outputFile(filename + '.txt', 
                `${head}\n${subhead}\n${bodys.join('\n')}\n`.replace(/\n/g, '\r\n'), 'utf-8', function (err) {
            });
        }
    }
    
    await browser.close();
})();
