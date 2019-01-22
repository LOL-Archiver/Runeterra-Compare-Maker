// let L = (console || 1).log;

let _fs = require('fs');
let Axios = require('axios');
let U = require('./util');

let compBiogA = async function(name) {
	let result = [];

	let cnc = (await Axios.get(`https://yz.lol.qq.com/v1/zh_cn/champions/${name}/index.json`)).data.champion;
	let enc = (await Axios.get(`https://universe-meeps.leagueoflegends.com/v1/en_us/champions/${name}/index.json`)).data.champion;

	result.push(`# &lt;${cnc.title}&gt; ${cnc.name}\r\n### &lt;${U.firstUpCase(enc.title)}&gt; ${U.firstUpCase(enc.name)}`);
	result.push('');

	let full = U.makePara(
		cnc.biography.full.trim().split(/<\/p>/),
		enc.biography.full.trim().split(/<\/p>/),
		true
	);

	let quote = U.makeQuote(
		cnc.biography.quote.trim(), cnc.biography['quote-author'] || cnc.name,
		enc.biography.quote.trim(), enc.biography['quote-author'] || enc.name,
	);

	let short = U.makeShort(
		cnc.biography.short.trim(),
		enc.biography.short.trim()
	);

	return U.makeHead().concat(result).concat(quote).concat(short).concat(full).concat(U.makeTran()).concat(U.makeTail());
};
let compStoryA = async function(title) {
	let header = [];

	let cns = (await Axios.get(`https://yz.lol.qq.com/v1/zh_cn/story/${title}/index.json`)).data.story;
	let ens = (await Axios.get(`https://universe-meeps.leagueoflegends.com/v1/en_us/story/${title}/index.json`)).data.story;

	header.push(`# ${cns.title} ${U.firstUpCase(ens.title)}`);
	header.push(`> 作者 Author: ${ens.subtitle.replace(/^by ?/, '')}`);
	header.push('>');
	header.push(`> 相关英雄 Related Champion: ${cns['story-sections'][0]['featured-champions'][0].name} (${ens['story-sections'][0]['featured-champions'][0].name})`);
	header.push('>');

	let counter = { start: 0 };

	let full = [];

	for(let i=0; i<cns['story-sections'][0]['story-subsections'].length;i++) {
		full = full.concat(U.makeHara(
			cns['story-sections'][0]['story-subsections'][i].content.trim().split(/<p><p><hr.*?story-divider.*?p><\/p>/g),
			ens['story-sections'][0]['story-subsections'][i].content.trim().split(/<p><p><hr.*?story-divider.*?p><\/p>/g),
			true,
			false,
			counter
		));
	}

	return U.makeHead().concat(header).concat(U.makeCata(counter.start)).concat(full).concat(U.makeTran()).concat(U.makeTail());
};

(async function main() {
	// _fs.writeFileSync('./Biography.md', (await compBiogA('kaisa')).join('\r\n'));
	_fs.writeFileSync('./Shtory.md', (await compStoryA('the-dreaming-pool')).join('\r\n'));
})();