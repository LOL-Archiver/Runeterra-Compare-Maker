let articleDict = [ '传记 Biography', '故事 Story', '漫画 Manga' ];
let Moment = require('moment');

let util = {
	firstUpCase: function(str) {
		return str.toLowerCase().replace(/( |^)[a-z]/g, function (head) { return head.toUpperCase(); } );
	},

	// 混合句子
	makeSent: function(cnSents = [], enSents = []) {
		let result = [];

		let max = cnSents.length > enSents.length ? cnSents.length : enSents.length;

		for(let i=0; i<max; i++) {
			let cnSent = (cnSents[i] || '').trim();
			let enSent = (enSents[i] || '').trim();

			if(!cnSent && !enSent) {
				continue;
			}

			result.push('>');

			if(cnSent) {
				result.push(cnSent.replace(/^/, '> ').replace(/$/, '。  '));
			}

			if(enSent) {
				result.push(enSent.replace(/^/, '> ').replace(/$/, '.  '));
			}
		}

		result.shift();

		return result;
	},
	// 混合段落
	makePara: function(cnParas = [], enParas = [], isCount = false, isMakeCata = false, numCataWrap) {
		let max = cnParas.length > enParas.length ? cnParas.length : enParas.length;

		let result = [];
		let numCata = numCataWrap ? numCataWrap.start : 0;

		for(let i=0; i<max; i++) {
			let cnPara = (cnParas[i] || '').trim();
			let enPara = (enParas[i] || '').trim();

			if(!cnPara && !enPara) {
				continue;
			}

			if(i != 0) { result.push(''); }

			if(isCount || isMakeCata) {
				result.push('#### '+ ('00'+(++numCata)).slice(-2));
			}

			let cnSents;
			let enSents;

			if(cnPara) {
				cnSents = cnPara.replace(/^<p>/, '').replace(/^<i>|<\/i>$/g, '').split(/[.。]/);
			}

			if(enPara) {
				enSents = enPara.replace(/^<p>/, '').replace(/^<i>|<\/i>$/g, '').split(/[.。]/);
			}

			result = result.concat(util.makeSent(cnSents, enSents));
		}

		if(numCataWrap) {
			numCataWrap.start = numCata;
		}

		if(isMakeCata) {
			result = util.makeCata().concat(result);
		}

		return result;
	},
	makeHara: function(cnHaras = [], enHaras = [], isCount = false, isMakeCata = false, numHaraWrap) {
		let max = cnHaras.length > enHaras.length ? cnHaras.length : enHaras.length;

		let result = [];
		let numHara = numHaraWrap ? numHaraWrap.start : 0;

		for(let i=0; i<max; i++) {
			let cnPara = (cnHaras[i] || '').trim();
			let enPara = (enHaras[i] || '').trim();

			if(!cnPara && !enPara) {
				continue;
			}

			if(i != 0) { result.push(''); }

			if(isCount || isMakeCata) {
				result.push('#### '+ ('00'+(++numHara)).slice(-2));
			}

			let cnParas;
			let enParas;

			if(cnPara) {
				cnParas = cnPara.trim().split(/<\/p>/);
			}

			if(enPara) {
				enParas = enPara.trim().split(/<\/p>/);
			}

			result = result.concat(util.makePara(cnParas, enParas));
		}

		if(numHaraWrap) {
			numHaraWrap.start = numHara;
		}

		if(isMakeCata) {
			result = util.makeCata(numHara).concat(result);
		}

		return result;
	},

	// 传记引述
	makeQuote: function(cnQuote = '', cnAuthor = '', enQuote = '', enAuthor = '') {
		let result = [];

		result.push(`#### 引述 Quote by ${cnAuthor} (${enAuthor})`);

		result = result.concat(util.makeSent(cnQuote.replace(/[“”"]/g, '').split(/[.。]/), enQuote.replace(/[“”"]/g, '').split(/[.。]/)));

		result.push('');

		return result;
	},
	// 传记简介
	makeShort: function(cnShort = '', enShort = '') {
		let result = [];

		result.push('#### 简介 Short');

		result = result.concat(util.makeSent(cnShort.split(/[.。]/), enShort.split(/[.。]/)));

		result.push('');

		return result;
	},
	makeCata: function(count = 0) {
		let result = [ '#### 目录 Catalog' ];
		// 插入目录
		let catalog = '> ';
		for(let i=1; i<count+1; i++) {
			let text = ('00'+i).slice(-2);
			catalog += `[${text}](#${text}) | `;

			if(!(i % 20)) {
				catalog = catalog.replace(/ \| $/, '  \r\n> ');
			}
			else if(!(i % 10)) {
				catalog = catalog.replace(/ \| $/, ' || ');
			}
		}

		if(count) {
			result = result.concat(catalog.replace(/( \| | {2}\r\n> )$/, '').split('\r\n'));
		}

		result.push('');

		return result;
	},
	makeHead: function() {
		return [
			'● Runeterra Compare  ',
			'***',
			''
		];
	},
	makeTran: function() {
		return [
			'',
			'***',
			'● 可供参考的直译  ',
			'> 1: ',
		];
	},
	makeTail: function(type = 0) {
		return [
			'',
			'***',
			'● github.com/LOLArranger/Runeterra-Compare  ',
			`● ${articleDict[type]}  `,
			`● Version ${Moment().format('YYYY.MM.DD')}  `,
			'● All Based on League of Legends Universe(英雄联盟宇宙)  ',
		];
	}
};

module.exports = util;