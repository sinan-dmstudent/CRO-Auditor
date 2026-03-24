const https = require('https');

https.get('https://pureheart.com', (res) => {
    let html = '';
    res.on('data', (d) => { html += d; });
    res.on('end', () => {
        let clean = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '')
            .replace(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gim, '[icon]')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="[base64]"')
            .replace(/\s+/g, ' ').trim();

        console.log('Cleaned length:', clean.length);
        const index = clean.toLowerCase().indexOf('youtube');
        console.log('Index of youtube:', index);
        console.log('Is inside first 5000 chars?', index > -1 && index < 5000);
    });
});
