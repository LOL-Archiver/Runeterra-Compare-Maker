// let L = (console || 1).log;

let _fs = require('fs');
let Axios = require('axios');
let U = require('./util');

let compBiogA = async function(name) {
	let result = [];

	let cnc = (await Axios.get(`https://yz.lol.qq.com/v1/zh_cn/champions/${name}/index.json`)).data.champion;
	let enc = (await Axios.get(`https://universe-meeps.leagueoflegends.com/v1/en_us/champions/${name}/index.json`)).data.champion;

	result.push(`# \\<${cnc.title}\\> ${cnc.name}\r\n### \\<${U.firstUpCase(enc.title)}\\> ${U.firstUpCase(enc.name)}`);
	result.push('');

	let full = U.mixiFull(
		cnc.biography.full.trim().split(/<\/p>/),
		enc.biography.full.trim().split(/<\/p>/)
	);

	let quote = U.mixiQuote(
		cnc.biography.quote.trim(), cnc.biography['quote-author'] || cnc.name,
		enc.biography.quote.trim(), enc.biography['quote-author'] || enc.name,
	);

	let short = U.mixiShort(
		cnc.biography.short.trim(),
		enc.biography.short.trim()
	);

	return result.concat(quote).concat(short).concat(full);
};
let compStoryA = async function(title) {
	let result = [];

	let cns = (await Axios.get(`https://yz.lol.qq.com/v1/zh_cn/story/${title}/index.json`)).data.story;
	let ens = (await Axios.get(`https://universe-meeps.leagueoflegends.com/v1/en_us/story/${title}/index.json`)).data.story;

	result.push(`# ${cns.title} ${U.firstUpCase(ens.title)}`);
	result.push(`> 作者 Author: ${ens.subtitle.replace(/^by ?/, '')}`);
	result.push('>');
	result.push(`> 相关英雄 Related Champion: ${cns['story-sections'][0]['featured-champions'][0].name} (${ens['story-sections'][0]['featured-champions'][0].name})`);
	result.push('>');

	for(let i=0; i<cns['story-sections'][0]['story-subsections'].length;i++) {
		let full = U.mixiStory(
			cns['story-sections'][0]['story-subsections'][i].content.trim().replace(/<p><hr class='story-divider' \/><\/p>/g, '').split(/<\/i><\/p>/),
			ens['story-sections'][0]['story-subsections'][i].content.trim().replace(/<p><hr class='story-divider' \/><\/p>/g, '').split(/<\/i><\/p>/)
		);

		result = result.concat(full);
	}

	return result;
};

(async function main() {
	// _fs.writeFileSync('./Biography.md', (await compBiogA('syndra')).join('\r\n'));
	_fs.writeFileSync('./Shtory.md', (await compStoryA('the-dreaming-pool')).join('\r\n'));
})();