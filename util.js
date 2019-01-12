let util = {
	firstUpCase: function(str) {
		return str.toLowerCase().replace(/( |^)[a-z]/g, function (head) { return head.toUpperCase(); } );
	},

	mixiSen: function(a = [], b = [], result = []) {
		let max = a.length > b.length ? a.length : b.length;

		for(let i=0; i<max; i++) {
			let asen = (a[i] || '').trim();
			let bsen = (b[i] || '').trim();

			if(!asen && !bsen) {
				continue;
			}

			if(i != 0) { result.push('>'); }

			if(asen) {
				result.push(asen.replace(/^/, '> ').replace(/$/, '。  '));
			}

			if(bsen) {
				result.push(bsen.replace(/^/, '> ').replace(/$/, '.  '));
			}
		}
	},
	mixiQuote: function(cnq = '', cna = '', enq = '', ena = '') {
		let result = [];

		result.push(`#### 引述 Quote by ${cna} (${ena})`);

		util.mixiSen(cnq.replace(/[“”"]/g, '').split(/[.。]/), enq.replace(/[“”"]/g, '').split(/[.。]/), result);

		result.push('');

		return result;
	},
	mixiShort: function(cns = '', ens = '') {
		let result = [];

		result.push('#### 简介 Short');

		util.mixiSen(cns.split(/[.。]/), ens.split(/[.。]/), result);

		result.push('');

		return result;
	},
	mixiFull: function(cnf = [], enf = []) {
		let max = cnf.length > enf.length ? cnf.length : enf.length;

		let result = [];
		let vaildSec = 0;

		for(let i=0; i<max; i++) {
			let cnsens;
			let ensens;

			let cnsec = (cnf[i] || '').trim();
			let ensec = (enf[i] || '').trim();

			if(!cnsec && !ensec) {
				continue;
			}

			if(i != 0) { result.push(''); }

			result.push('#### '+ ('00'+(i+1)).slice(-2));

			vaildSec++;

			if(cnsec) {
				cnsens = cnsec.replace(/^<p>/, '').split(/[.。]/);
			}

			if(ensec) {
				ensens = ensec.replace(/^<p>/, '').split(/[.。]/);
			}

			util.mixiSen(cnsens, ensens, result);
		}

		// 目录
		let catalog = '> ';
		for(let i=1; i<vaildSec+1; i++) {
			let text = ('00'+i).slice(-2);
			catalog += `[${text}](#${text}) | `;

			if(!(i % 10)) {
				catalog = catalog.replace(/ \| $/, '  \r\n> ');
			}
		}
		result.unshift(catalog.replace(/( \| | {2}\r\n> )$/, '\r\n'));
		result.unshift('#### 目录 Catalog');

		return result;
	},
	mixiStory: function(cnf = [], enf = []) {
		let max = cnf.length > enf.length ? cnf.length : enf.length;

		let result = [];
		let vaildSec = 0;

		for(let i=0; i<max; i++) {
			let cnsens;
			let ensens;

			let cnsec = (cnf[i] || '').trim();
			let ensec = (enf[i] || '').trim();

			if(!cnsec && !ensec) {
				continue;
			}

			if(i != 0) { result.push(''); }

			result.push('#### '+ ('00'+(i+1)).slice(-2));

			vaildSec++;

			if(cnsec) {
				cnsens = cnsec.replace(/^<p><i>/, '').split(/[.。]/);
			}

			if(ensec) {
				ensens = ensec.replace(/^<p><i>/, '').split(/[.。]/);
			}

			util.mixiSen(cnsens, ensens, result);
		}

		// 目录
		let catalog = '> ';
		for(let i=1; i<vaildSec+1; i++) {
			let text = ('00'+i).slice(-2);
			catalog += `[${text}](#${text}) | `;

			if(!(i % 10)) {
				catalog = catalog.replace(/ \| $/, '  \r\n> ');
			}
		}
		result.unshift(catalog.replace(/( \| | {2}\r\n> )$/, '\r\n'));
		result.unshift('#### 目录 Catalog');

		return result;
	}
};

module.exports = util;