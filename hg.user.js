// ==UserScript==
// @name        HG
// @namespace   None
// @include     https://boards.4chan.org/b/thread/*
// @include     https://boards.4chan.org/trash/thread/*
// @include     http://brantsteele.net/hungergames/edit.php
// @version     1.0
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

if(window.location.hostname == "boards.4chan.org") {
	var tributes = 24;
	var entry = 0;

	function size() {
		var e = document.getElementsByName("tributes");

		if(e[0].checked) {
			tributes = 24;
		} else if(e[1].checked) {
			tributes = 36;
		} else {
			tributes = 48;
		}
	};

	function draw() {
		size();
		show();

		var maxLength = 26;

		var x = document.getElementsByClassName("post reply");

		for (i = 0; i < x.length; i++) {
			if(x[i].getElementsByClassName('hg-img').length == 0) {
				x[i].getAttribute('id'); // ???

				var y = x[i].getElementsByClassName("fileThumb")
				if(y.length) {
					entry += 1;

					var img = y[0].getElementsByTagName("img")[0]['src']
					var txt = x[i].getElementsByClassName("postMessage")[0].innerText.split('\n')
					
					var j = 0;
					while(j < txt.length && (txt[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || txt[j].trim().length == 0)) {
						j++;
					}
					if(j < txt.length) {
						txt = txt[j].replace(/[^ú\í\é\ç\'\.\:\-\sa-zA-Z-z0-9]/g, ' ').trim().substring(0, maxLength);
					} else {
						txt = txt.join(' ').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\í\é\ç\'\.\:\-\sa-zA-Z-z0-9]/g, ' ').trim().substring(0, maxLength);
					}
					if(txt.length > 15 && txt.match(/\s/g) == 0) {
						if(txt.length == maxLength) {
							txt[maxLength - 1] = ' ';
						} else {
							txt += ' ';
						}
					}

					var checkbox = document.createElement('input');
					checkbox.type = "checkbox";
					checkbox.value = img;
					checkbox.className = "hg-img";
					checkbox.id = x[i].getAttribute('id');
					checkbox.title = "Entry " + entry;
					checkbox.checked = true;

					var text = document.createElement('input')
					text.setAttribute('type', 'text')
					text.setAttribute('maxlength', '26')
					text.setAttribute('size', '36')
					text.className = "hg-field";
					text.id = x[i].getAttribute('id');
					text.title = "Name";
					text.value = txt;

					var m = document.createElement('input');
					m.setAttribute('type', 'radio');
					m.setAttribute('name', 'gender');
					m.setAttribute('value', 'M');
					m.title = "Male";
					m.checked = true;
					var f = document.createElement('input');
					f.setAttribute('type', 'radio');
					f.setAttribute('name', 'gender');
					f.setAttribute('value', 'F');
					f.title = "Female";

					var form = document.createElement('form');
					form.className = "hg-gender";
					form.id = x[i].getAttribute('id');

					form.appendChild(checkbox);
					form.appendChild(text);
					form.appendChild(m);
					form.appendChild(f);

					x[i].prepend(form);
				}
			}
		}
	};

	function show() {
		var gens = document.getElementsByClassName("hg-gender");

		for(i = 0; i < gens.length; i++) {
			gens[i].hidden = false;
		}
	};

	function hide() {
		var gens = document.getElementsByClassName("hg-gender");

		for(i = 0; i < gens.length; i++) {
			gens[i].hidden = true;
		}
	};

	function save() {
		size();

		var imgs = document.getElementsByClassName("hg-img");
		var txts = document.getElementsByClassName("hg-field");
		var gens = document.getElementsByClassName("hg-gender");

		var imgsStr = "";
		var txtsStr = "";
		var gensStr = "";
		for(i = 0, count = 0; i < imgs.length && count < tributes; i++) {
			if(imgs[i].checked == true) {
				count++;
				imgsStr += imgs[i]['value'] + "|";
				txtsStr += txts[i]['value'] + "|";
				if(gens[i][2].checked == true) {
					gensStr += "1|";
				} else {
					gensStr += "0|";
				}
			}
		}

		GM_setValue("tributes", tributes);

		GM_setValue("imgs", imgsStr);
		GM_setValue("txts", txtsStr);
		GM_setValue("gens", gensStr);
	};

	document.onkeydown = function(key) {
		key = key || window.event;

		if(key.keyCode == 112) {
			draw();
		} else if(key.keyCode == 113) {
			hide();
		}
	};

	var t24 = document.createElement('input');
	t24.setAttribute('type', 'radio');
	t24.setAttribute('name', 'tributes');
	t24.setAttribute('value', '24');
	t24.title = "24 Tributes";
	t24.checked = true;
	var t36 = document.createElement('input');
	t36.setAttribute('type', 'radio');
	t36.setAttribute('name', 'tributes');
	t36.setAttribute('value', '36');
	t36.title = "36 Tributes";
	var t48 = document.createElement('input');
	t48.setAttribute('type', 'radio');
	t48.setAttribute('name', 'tributes');
	t48.setAttribute('value', '48');
	t48.title = "48 Tributes";

	var button3 = document.createElement("button");
	button3.innerHTML = "Save";
	button3.onclick = function() { save(); };

	var button1 = document.createElement("button");
	button1.innerHTML = "Draw";
	button1.onclick = function() { draw(); };

	var form = document.createElement('div');
	form.className = "hungergames";
	form.appendChild(button1);
	form.appendChild(button3);
	form.appendChild(t24);
	form.appendChild(t36);
	form.appendChild(t48);

	document.getElementsByTagName("body")[0].appendChild(form);
} else if(window.location.hostname == "brantsteele.net") {
	var seasonname = document.getElementsByName("seasonname")[0].value;
	var logourl = document.getElementsByName("logourl")[0].value;

	var button2 = document.createElement("button");
	button2.innerHTML = "Load";
	button2.onclick = function() {
		var tributes = GM_getValue("tributes");

		var imgs = GM_getValue("imgs").split('|');
		var txts = GM_getValue("txts").split('|');
		var gens = GM_getValue("gens").split('|');

		var inputs = document.getElementsByTagName('input');
		for(i = 2, j = 0; i < inputs.length && j < tributes && j < imgs.length - 1; i += 4, j++) {
			inputs[i]['value'] = txts[j];
			inputs[i + 2]['value'] = txts[j];
			inputs[i + 1]['value'] = imgs[j];
			inputs[i + 3]['value'] = "BW";
		}

		var genders = document.getElementsByTagName("select");
		for(i = 1, j = 0; i < tributes * 3 + 1 && j < tributes && j < imgs.length - 1; i += 3, j++) {
			genders[i].value = gens[j];
		}

		if(document.getElementsByName("seasonname")[0].value == "") {
			document.getElementsByName("seasonname")[0].value = seasonname;
		}
		if(document.getElementsByName("logourl")[0].value == "") {
			document.getElementsByName("logourl")[0].value = logourl;
		}
	};
	document.getElementsByTagName("body")[0].prepend(button2);
}
