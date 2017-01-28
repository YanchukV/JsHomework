'use strict';

function ConvertJSONToICS(option) {

	let rootId = option.root;
	let stack = option.startArray;
	let url = option.urlJson;

	let downloadURL = function (text, name) {
		let link = document.createElement('a');
		let Blobs = new Blob([text], {type: 'text/plain;charset=utf-8,%EF%BB%BF'});
		let contentUrl = URL.createObjectURL(Blobs);
		link.setAttribute('href', contentUrl);
		link.setAttribute('download', name);
		link.setAttribute('value', stack);
		link.textContent = 'Скачать файл';
		rootId.append(link);
	};

	function shellJson(urlString) {

		let xhr = new XMLHttpRequest();
		xhr.open('GET', decodeURIComponent(urlString));
		xhr.send();

		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {

				try {
					var result = JSON.parse(xhr.responseText);
				} catch (e) {
					alert( "Некорректный ответ " + e.message );
				}

				for (var i = 0; i < result.length; i++) {

					let resHtml = '';

					for (let item in result[i]) {

						if (item === 'id') {
							item = 'u' + item;
							result[i][item] = result[i][item.slice(1)];
						}

						if (item === 'start' || item === 'end') {

							if (item === 'start') {
								resHtml += 'DTSTAMP:' + result[i][item].replace(/[^T0-9]/gim, '').slice(0, -4) + '\r\n';
							}

							item = 'dt' + item;
							result[i][item] = result[i][item.slice(2)].replace(/[^T0-9]/gim, '');
							result[i][item] = result[i][item].slice(0, -4);

						}

						resHtml += item.toUpperCase() + ":" + result[i][item] + "\r\n";
					}

					stack.push('BEGIN:VEVENT\r\n' + resHtml + 'END:VEVENT\r\n');

					if (i === (result.length - 1)) {
						stack.push('END:VCALENDAR\r\n');
					}
				}

			} else {

				console.log( xhr.status + ': ' + xhr.statusText );
				return;
			}

			let content = stack.join('');

			downloadURL( content, 'calendar.ics' );

		};
	}

	shellJson(url);
}

var converterJSONtoICS = new ConvertJSONToICS({
	root : document.getElementById('root'),
	urlJson : 'http://javascript.kiev.ua/attach/icalendar/google_events.json',
	startArray : [  'BEGIN:VCALENDAR\r\n',
					'VERSION:2.0\r\n',
					'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\n',
					'X-WR-CALNAME;CHARSET=utf-8:XP Days Ukraine 2016 schedule\r\n',
					'METHOD:PUBLISH\r\n',
					'X-MS-OLK-FORCEINSPECTOROPEN:TRUE\r\n']
});


//
//let rootId = document.getElementById('root');
//let stack = ['BEGIN:VCALENDAR\r\n',
//			'VERSION:2.0\r\n',
//			'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\n',
//			'X-WR-CALNAME;CHARSET=utf-8:XP Days Ukraine 2016 schedule\r\n',
//			'METHOD:PUBLISH\r\n',
//			'X-MS-OLK-FORCEINSPECTOROPEN:TRUE\r\n'];
//
//let downloadURL = function (text, name) {
//
//
//	let link = document.createElement('a');
//
//	let Blobs = new Blob([text], {type: 'text/plain;charset=utf-8,%EF%BB%BF'});
//	let contentUrl = URL.createObjectURL(Blobs);
//	link.setAttribute('href', contentUrl);
//	link.setAttribute('download', name);
//	link.setAttribute('value', stack);
//	link.textContent = 'Скачать файл';
//	rootId.append(link);
//};
//
//let xhr = new XMLHttpRequest();
//xhr.open('GET', decodeURIComponent('http://javascript.kiev.ua/attach/icalendar/google_events.json'));
//xhr.send();
//
//xhr.onreadystatechange = function() {
//
//	if (xhr.readyState == 4 && xhr.status == 200) {
//
//		try {
//
//			var result = JSON.parse(xhr.responseText);
//
//		} catch (e) {
//
//			alert( "Некорректный ответ " + e.message );
//
//		}
//
//		for (var i = 0; i < result.length; i++) {
//
//			let resHtml = '';
//
//			for (let item in result[i]) {
//
//				if (item === 'id') {
//					item = 'u' + item;
//					result[i][item] = result[i][item.slice(1)];
//				}
//
//				if (item === 'start' || item === 'end') {
//
//					if (item === 'start') {
//						resHtml += 'DTSTAMP:' + result[i][item].replace(/[^T0-9]/gim, '').slice(0, -4) + '\r\n';
//					}
//
//					item = 'dt' + item;
//					result[i][item] = result[i][item.slice(2)].replace(/[^T0-9]/gim, '');
//					result[i][item] = result[i][item].slice(0, -4);
//
//				}
//
//				resHtml += item.toUpperCase() + ":" + result[i][item] + "\r\n";
//
//			}
//			stack.push('BEGIN:VEVENT\r\n' + resHtml + 'END:VEVENT\r\n');
//
//			if (i === (result.length - 1)) {
//				stack.push('END:VCALENDAR\r\n');
//			}
//
//
//		}
//
//	} else {
//
//		console.log(xhr.status + ': ' + xhr.statusText);
//		return;
//
//	}
//
//	let content = stack.join('');
//
//
//		downloadURL(content, 'calendar.ics');
//
//
//};



