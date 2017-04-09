// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @version     1.4.2
// @include     boards.4chan.org/*/res/*
// @include     boards.4chan.org/*/thread/*
// @include     http://boards.4chan.org/*/res/*
// @include     http://boards.4chan.org/*/thread/*
// @include     https://boards.4chan.org/*/res/*
// @include     https://boards.4chan.org/*/thread/*
// @include     boards.4chan.org/*/res/*/
// @include     boards.4chan.org/*/thread/*/
// @include     http://boards.4chan.org/*/res/*/
// @include     http://boards.4chan.org/*/thread/*/
// @include     https://boards.4chan.org/*/res/*/
// @include     https://boards.4chan.org/*/thread/*/
// @include     www.brantsteele.net/hungergames/edit.php
// @include     www.brantsteele.net/hungergames/personal.php
// @include     http://www.brantsteele.net/hungergames/edit.php
// @include     http://www.brantsteele.net/hungergames/personal.php
// @include     https://www.brantsteele.net/hungergames/edit.php
// @include     https://www.brantsteele.net/hungergames/personal.php
// @include     brantsteele.net/hungergames/edit.php
// @include     brantsteele.net/hungergames/personal.php
// @include     http://brantsteele.net/hungergames/edit.php
// @include     http://brantsteele.net/hungergames/personal.php
// @include     https://brantsteele.net/hungergames/edit.php
// @include     https://brantsteele.net/hungergames/personal.php
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

// TODO: place class names, etc. into variables, finish nomenclature changes

if(window.location.hostname == "boards.4chan.org") {
	var tributes = 24;
	var hgEntry = 0;

	function hgSize() {
		var e = document.getElementsByName("tributes");

		if(e[0].checked) {
			tributes = 24;
		} else if(e[1].checked) {
			tributes = 36;
		} else {
			tributes = 48;
		}
	};

	function hgDraw() {
		hgSize();
		hgShow();

		var hgNameMaxLength = 26;

		var x = document.getElementsByClassName("post reply"); // TODO: give a proper name

		for (i = 0; i < x.length; i++) {
			if(x[i].getElementsByClassName('hg-img').length == 0) {
				var y = x[i].getElementsByClassName("fileThumb")
				if(y.length) {
					hgEntry += 1;

					// TODO: option of CDN
					var img = y[0].getElementsByTagName("img")[0]['src']
					var txt = x[i].getElementsByClassName("postMessage")[0].innerText.split('\n')
					
					// TODO: wow this is ugly
					var j = 0;
					while(j < txt.length && (txt[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || txt[j].trim().length == 0)) {
						j++;
					}
					if(j < txt.length) {
						txt = txt[j].replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength);
					} else {
						txt = txt.join(' ').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength);
					}
					// TODO: does not seem to work
					if(txt.length > 15 && txt.match(/\s/g) == null) {
						if(txt.length == hgNameMaxLength) {
							txt[hgNameMaxLength - 1] = ' ';
						} else {
							txt += ' ';
						}
					}

					var hgEntry_checkbox = document.createElement('input');
					hgEntry_checkbox.type = "checkbox";
					hgEntry_checkbox.value = img;
					hgEntry_checkbox.className = "hg-img";
					hgEntry_checkbox.id = x[i].id; // ?
					hgEntry_checkbox.title = "Post #" + hgEntry;
					hgEntry_checkbox.style = "display:inline!important;"
					hgEntry_checkbox.checked = true;

					var hgName_text = document.createElement('input')
					hgName_text.type = "text";
					hgName_text.maxlength = 26;
					hgName_text.size = 36;
					hgName_text.className = "hg-field";
					hgName_text.id = x[i].id; // ?
					hgName_text.title = "Tribute name";
					hgName_text.value = txt;

					var hgMale_radio = document.createElement('input');
					hgMale_radio.type = "radio";
					hgMale_radio.name = "gender";
					hgMale_radio.value = "M";
					hgMale_radio.title = "Male";
					hgMale_radio.checked = true;
					var hgFemale_radio = document.createElement('input');
					hgFemale_radio.type = "radio";
					hgFemale_radio.name = "gender";
					hgFemale_radio.value = "F";
					hgFemale_radio.title = "Female";

					var hgForm_form = document.createElement('form');
					hgForm_form.className = "hg-gender"; // TODO: change this class name
					hgForm_form.id = x[i].id; // ?
					hgForm_form.appendChild(hgEntry_checkbox);
					hgForm_form.appendChild(hgName_text);
					hgForm_form.appendChild(hgMale_radio);
					hgForm_form.appendChild(hgFemale_radio);

					x[i].prepend(hgForm_form);
				}
			}
		}
	};

	function hgShow() {
		var gens = document.getElementsByClassName("hg-gender");

		for(i = 0; i < gens.length; i++) {
			gens[i].hidden = false;
		}
	};

	function hgHide() {
		var gens = document.getElementsByClassName("hg-gender");

		for(i = 0; i < gens.length; i++) {
			gens[i].hidden = true;
		}
	};

	function hgDeselect() {
		var imgs = document.getElementsByClassName("hg-img");

		for(i = 0; i < imgs.length; i++) {
			imgs[i].checked = false;
		}
	};

	function hgSave() {
		hgSize();

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

	// TODO: customizable keybinds
	document.onkeydown = function(key) {
		key = key || window.event;

		if(key.keyCode == 112 || key.keyCode == 115) {
			hgDraw();
		} else if(key.keyCode == 113) {
			hgHide();
		}
	};

	// TODO: change to a select
	var hgT24_radio = document.createElement('input');
	hgT24_radio.type = "radio";
	hgT24_radio.name = "tributes";
	hgT24_radio.value = "24";
	hgT24_radio.title = "24 Tributes";
	hgT24_radio.checked = true;
	var hgT36_radio = document.createElement('input');
	hgT36_radio.type = "radio";
	hgT36_radio.name = "tributes";
	hgT36_radio.value = "36";
	hgT36_radio.title = "36 Tributes";
	var hgT48_radio = document.createElement('input');
	hgT48_radio.type = "radio";
	hgT48_radio.name = "tributes";
	hgT48_radio.value = "48";
	hgT48_radio.title = "48 Tributes";
	/*
	var hgTributes_select = document.createElement('select');
	hgTributes_select.name = "tributes";
	var hgT24_option = document.createElement('option');
	hgT24_option.text = "24";
	hgT24_option.value = "24";
	var hgT36_option = document.createElement('option');
	hgT36_option.text = "36";
	hgT36_option.value = "36";
	var hgT48_option = document.createElement('option');
	hgT48_option.text = "48";
	hgT48_option.value = "48";
	hgTributes_select.appendChild(hgT24_option);
	hgTributes_select.appendChild(hgT36_option);
	hgTributes_select.appendChild(hgT48_option);
	*/

	// TODO: set button types to "button"
	var hgDraw_btn = document.createElement("button");
	hgDraw_btn.type = "button";
	hgDraw_btn.innerHTML = "Draw";
	hgDraw_btn.onclick = function() { hgDraw(); window.scrollTo(0, document.body.scrollHeight); };
	var hgHide_btn = document.createElement("button");
	hgHide_btn.type = "button";
	hgHide_btn.innerHTML = "Hide";
	hgHide_btn.onclick = function() { hgHide(); };
	var hgSave_btn = document.createElement("button");
	hgSave_btn.type = "button";
	hgSave_btn.innerHTML = "Save";
	hgSave_btn.onclick = function() { hgSave(); };
	var hgDsel_btn = document.createElement("button");
	hgDsel_btn.type = "button";
	hgDsel_btn.innerHTML = "Deselect All";
	hgDsel_btn.onclick = function() { hgDeselect(); };

	var hgCtrls_div = document.createElement('div');
	hgCtrls_div.className = "hungergames";
	hgCtrls_div.appendChild(hgDraw_btn);
	hgCtrls_div.appendChild(hgHide_btn);
	hgCtrls_div.appendChild(hgSave_btn);
	hgCtrls_div.appendChild(hgDsel_btn);
	hgCtrls_div.appendChild(hgT24_radio);
	hgCtrls_div.appendChild(hgT36_radio);
	hgCtrls_div.appendChild(hgT48_radio);

	document.getElementsByTagName("body")[0].appendChild(hgCtrls_div);
} else if(window.location.hostname == "brantsteele.net" || window.location.hostname == "www.brantsteele.net") {
	var seasonname = document.getElementsByName("seasonname")[0].value;
	var logourl = document.getElementsByName("logourl")[0].value;

	var hgLoad_btn = document.createElement("button");
	hgLoad_btn.type = "button";
	//hgLoad_btn.style = "position:absolute;"; // TODO: implement alongside button move
	hgLoad_btn.innerHTML = "Load";
	hgLoad_btn.onclick = function() {
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
	document.getElementsByTagName("body")[0].prepend(hgLoad_btn);
	//document.getElementsByClassName("personalHG")[0].prepend(button); // TODO: implement this button location change alongside some major update
}
