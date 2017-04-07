// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @version     1.1
// @include     https://boards.4chan.org/*/thread/*
// @include     http://brantsteele.net/hungergames/edit.php
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
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

		var x = document.getElementsByClassName("post reply"); // TODO: give a proper name

		for (i = 0; i < x.length; i++) {
			if(x[i].getElementsByClassName('hg-img').length == 0) {
				x[i].getAttribute('id'); // ???

				var y = x[i].getElementsByClassName("fileThumb")
				if(y.length) {
					entry += 1;

					var img = y[0].getElementsByTagName("img")[0]['src']
					var txt = x[i].getElementsByClassName("postMessage")[0].innerText.split('\n')
					
					// TODO: wow this is ugly
					var j = 0;
					while(j < txt.length && (txt[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || txt[j].trim().length == 0)) {
						j++;
					}
					if(j < txt.length) {
						txt = txt[j].replace(/[^ú\í\é\ç\'\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, maxLength);
					} else {
						txt = txt.join(' ').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\í\é\ç\'\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, maxLength);
					}
					if(txt.length > 15 && txt.match(/\s/g) == null) {
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
					checkbox.id = x[i].id; // ?
					checkbox.title = "Post #" + entry;
					checkbox.checked = true;

					var text = document.createElement('input')
					text.type = "text";
					text.maxlength = 26;
					text.size = 36;
					text.className = "hg-field";
					text.id = x[i].id; // ?
					text.title = "Tribute name";
					text.value = txt;

					var m = document.createElement('input');
					m.type = "radio";
					m.name = "gender";
					m.value = "M";
					m.title = "Male";
					m.checked = true;
					var f = document.createElement('input');
					f.type = "radio";
					f.name = "gender";
					f.value = "F";
					f.title = "Female";

					var form = document.createElement('form');
					form.className = "hg-gender"; // TODO: change this class name
					form.id = x[i].id; // ?

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

	function deselect() {
		var imgs = document.getElementsByClassName("hg-img");

		for(i = 0; i < imgs.length; i++) {
			imgs[i].checked = false;
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

				imgsStr += imgs[i].value + "|";
				txtsStr += txts[i].value + "|";

				// TODO: handle this garbage in a better way
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

		if(key.keyCode == 112 || key.keyCode == 115) {
			draw();
		} else if(key.keyCode == 113) {
			hide();
		}
	};

	var t24 = document.createElement('input');
	t24.type = "radio";
	t24.name = "tributes";
	t24.value = "24";
	t24.title = "24 Tributes";
	t24.checked = true;
	var t36 = document.createElement('input');
	t36.type = "radio";
	t36.name = "tributes";
	t36.value = "36";
	t36.title = "36 Tributes";
	var t48 = document.createElement('input');
	t48.type = "radio";
	t48.name = "tributes";
	t48.value = "48";
	t48.title = "48 Tributes";

	var button1 = document.createElement("button");
	button1.innerHTML = "Draw";
	button1.onclick = function() { draw(); };
	var button2 = document.createElement("button");
	button2.innerHTML = "Save";
	button2.onclick = function() { save(); };
	var button3 = document.createElement("button");
	button3.innerHTML = "Deselect All";
	button3.onclick = function() { deselect(); };

	var form = document.createElement('div');
	form.className = "hungergames";
	form.appendChild(button1);
	form.appendChild(button2);
	form.appendChild(button3);
	form.appendChild(t24);
	form.appendChild(t36);
	form.appendChild(t48);

	document.getElementsByTagName("body")[0].appendChild(form);
} else if(window.location.hostname == "brantsteele.net") {
	var seasonname = document.getElementsByName("seasonname")[0].value;
	var logourl = document.getElementsByName("logourl")[0].value;

	var button = document.createElement("button");
	button.innerHTML = "Load";
	button.onclick = function() {
		var tributes = GM_getValue("tributes");

		var imgs = GM_getValue("imgs").split('|');
		var txts = GM_getValue("txts").split('|');
		var gens = GM_getValue("gens").split('|');

		var capacity = (document.getElementsByTagName("select").length - 2) / 3

		var inputs = document.getElementsByTagName('input');
		for(i = 2, j = 0; i < inputs.length && j < tributes && j < capacity && j < imgs.length - 1; i += 4, j++) {
			inputs[i].value = txts[j];
			inputs[i + 2].value = txts[j];
			inputs[i + 1].value = imgs[j];
			inputs[i + 3].value = "BW";
		}
		var genders = document.getElementsByTagName("select");
		for(i = 1, j = 0; i < tributes * 3 + 1 && j < tributes && j < capacity && j < imgs.length - 1; i += 3, j++) {
			genders[i].value = gens[j];
		}

		if(document.getElementsByName("seasonname")[0].value == "") {
			document.getElementsByName("seasonname")[0].value = seasonname;
		}
		if(document.getElementsByName("logourl")[0].value == "") {
			document.getElementsByName("logourl")[0].value = logourl;
		}
	};
	document.getElementsByTagName("body")[0].prepend(button);
}
