// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @version     2.2.1
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
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
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

// TODO: Finish nomenclature changes
// TODO: Remove "number of tributes" setting and simply save 48 and load as many as needed on reaping page

if(window.location.hostname == "boards.4chan.org") {
    var hgReapingSize = 24;
    var hgEntriesDrawn = 0;

    // TODO: Finish placing class names etc. into variables
	// Class names of tribute form elements
	var class_hgForm = "hg-form"
	var class_hgCheckbox = "hg-checkbox"
	var class_hgField = "hg-field"
	var class_hgGender = "hg-gender"
	var name_hgGender = "hg-gender"

    function hgSize() {
        hgReapingSize = document.getElementById("hgTributes").value;
    }

    function hgNumberTributes() {
        hgSize();

        var hgForms = document.getElementsByClassName(class_hgForm);
        if(GM_getValue("options_tributeCounter", true) === true) {
			var count = 1;
            for(i = 0; i < hgForms.length; i++) {
                if(hgForms[i][0].checked && count <= hgReapingSize) {
                    hgForms[i].getElementsByClassName('hgTributeNumber')[0].innerHTML = " (" + count + ")";
					hgForms[i].getElementsByClassName('hgTributeNumber')[0].title = "Entry #" + count;
                    count++;
                } else {
                    hgForms[i].getElementsByClassName('hgTributeNumber')[0].innerHTML = "";
                }
            }
        } else {
            for(i = 0; i < hgForms.length; i++) {
                hgForms[i].getElementsByClassName('hgTributeNumber')[0].innerHTML = "";
            }
        }
    }

    function hgDraw() {
        hgSize();
        hgShow();

        var hgNameMaxLength = 26;

        var skipEmpty = GM_getValue("options_skipEmpty", false);
        var detectGender = GM_getValue("options_detectGender", true);

        var threadPosts = document.getElementsByClassName("post reply");
        for(i = 0; i < threadPosts.length; i++) {
            if(threadPosts[i].getElementsByClassName(class_hgCheckbox).length === 0) {
                var postImage = threadPosts[i].getElementsByClassName("fileThumb");
                if(postImage.length) {
                    hgEntriesDrawn++;

					var thumb = postImage[0].getElementsByTagName("img")[0].src;
                    var img = postImage[0].href;
                    var txt = threadPosts[i].getElementsByClassName("postMessage")[0].innerText.split('\n');

					var female = false;

                    var j = 0;
                    while(j < txt.length && (txt[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || txt[j].trim().length === 0)) {
                        j++;
                    }
					if(j < txt.length && txt[j].length != 0 && txt[j].match(/(\(F\))|(\(Female\))/g)) {
						female = true;
					}
                    if(j < txt.length) { // if j < txt.length ??? that doesn't seem right why does this work
                        txt = txt[j].replace(/(\(F\))|(\(Female\))/g, '').replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength); // This regex somehow keeps getting gutted. Git/GitHub??
                    } else {
                        txt = txt.join(' ').replace(/(\(F\))|(\(Female\))/g, '').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength);
                    }
                    if(txt.length > 15 && txt.match(/\s/g) === null) { // TODO: does not seem to work
                        if(txt.length == hgNameMaxLength) {
                            txt[hgNameMaxLength - 1] = ' ';
                        } else {
                            txt += ' ';
                        }
                    }

                    var hgNumber_span = document.createElement('span');
                    hgNumber_span.className = "hgTributeNumber";

                    var hgEntry_checkbox = document.createElement('input');
                    hgEntry_checkbox.type = "checkbox";
                    hgEntry_checkbox.className = class_hgCheckbox;
                    hgEntry_checkbox.title = "Image #" + hgEntriesDrawn;
                    hgEntry_checkbox.style = "display:inline!important;";
                    hgEntry_checkbox.onchange = function() { hgNumberTributes(); };
					if(skipEmpty === true) {
						if(txt) hgEntry_checkbox.checked = true;
					} else {
						hgEntry_checkbox.checked = true;
					}

                    var hgName_text = document.createElement('input');
                    hgName_text.type = "text";
                    hgName_text.maxLength = hgNameMaxLength;
                    hgName_text.size = 36;
                    hgName_text.className = class_hgField;
                    hgName_text.title = "Tribute name";
                    hgName_text.value = txt;

                    var hgMale_radio = document.createElement('input');
                    hgMale_radio.type = "radio";
                    hgMale_radio.name = "gender";
					hgMale_radio.className = class_hgGender;
                    hgMale_radio.value = "M";
                    hgMale_radio.title = "Male";
                    hgMale_radio.checked = true;
                    var hgFemale_radio = document.createElement('input');
                    hgFemale_radio.type = "radio";
                    hgFemale_radio.name = "gender";
					hgFemale_radio.className = class_hgGender;
                    hgFemale_radio.value = "F";
                    hgFemale_radio.title = "Female";
					if(detectGender === true && female === true) {
                        hgFemale_radio.checked = true;
                    }

                    var hgForm_form = document.createElement('form');
                    hgForm_form.className = class_hgForm;
                    hgForm_form.appendChild(hgEntry_checkbox);
                    hgForm_form.appendChild(hgName_text);
					hgForm_form.appendChild(hgMale_radio);
					hgForm_form.appendChild(hgFemale_radio);
                    hgForm_form.appendChild(hgNumber_span);

                    threadPosts[i].prepend(hgForm_form);
                }
            }
        }

        hgNumberTributes();
    }

	function hgSave() {
		hgSize();

		var tributeForms = document.getElementsByClassName(class_hgForm);

        if(tributeForms.length == 0) {
            hgDraw();
            hgHide();
			tributeForms = document.getElementsByClassName(class_hgForm);
            window.scrollTo(0, document.body.scrollHeight);
        }

		// TODO: Separate into three loops
        var imgsStr = "";
        var txtsStr = "";
        var gensStr = "";
		var useFullImgs = GM_getValue("options_fullImages", false);
		for(i = 0, count = 0; i < tributeForms.length && count < hgReapingSize; i++) {
			if(tributeForms[i].getElementsByClassName(class_hgCheckbox)[0].checked === true) {
				count++;

				// TODO: Store image URLs in memory instead of DOM or some shit
				// TODO: Possibly change retrieval from getElementByEtc() to simple index accesses since we have a set order of elements
				if(useFullImgs === true) {
					imgsStr += tributeForms[i].parentElement.getElementsByClassName("fileThumb")[0].href + "|";
				} else {
					imgsStr += tributeForms[i].parentElement.getElementsByTagName("img")[0].src + "|";
				}

				txtsStr += tributeForms[i].getElementsByClassName(class_hgField)[0].value + "|";

				if(tributeForms[i].getElementsByClassName(class_hgGender)[0].checked === true) {
					gensStr += "1|";
				} else {
					gensStr += "0|";
				}
			}
		}

        GM_setValue("reapingSize", hgReapingSize);
        GM_setValue("imgsStr", imgsStr);
        GM_setValue("txtsStr", txtsStr);
        GM_setValue("gensStr", gensStr);
	}

    document.onkeydown = function(key) {
        key = key || window.event;

        if(key.keyCode == 112 || key.keyCode == 115) {
            hgDraw();
        } else if(key.keyCode == 113) {
            hgHide();
        } else if(key.keyCode == 119) {
			hgSave();
		}
    };

    function hgShow() {
        var gens = document.getElementsByClassName(class_hgForm);

        for(i = 0; i < gens.length; i++) {
            gens[i].hidden = false;
        }
    }

    function hgHide() {
        var gens = document.getElementsByClassName(class_hgForm);

        for(i = 0; i < gens.length; i++) {
            gens[i].hidden = true;
        }
    }

    function hgDeselect() {
        var imgs = document.getElementsByClassName(class_hgCheckbox);

        for(i = 0; i < imgs.length; i++) {
            imgs[i].checked = false;
        }

        hgNumberTributes();
    }

    // Show or hide options panel
    function hgToggleOptionsPanel() {
        var hgOptions_element = document.getElementsByClassName("hgOptions-panel");

        if(hgOptions_element[0].style.display === "block") {
            hgOptions_element[0].style.display = "none";
        } else {
            hgOptions_element[0].style.display = "block";
        }

        window.scrollTo(0, document.body.scrollHeight);
    }

    // Load saved values for options and set their checkboxes appropriately
    function hgLoadOptions() {
		document.getElementById("hgOptions-skipEmpty").checked = GM_getValue("options_skipEmpty", false);
        document.getElementById("hgOptions-fullImages").checked = GM_getValue("options_fullImages", false);
        document.getElementById("hgOptions-newLocation").checked = GM_getValue("options_newLocation", false);
        document.getElementById("hgOptions-rememberSize").checked = GM_getValue("options_rememberSize", true);
		document.getElementById("hgOptions-detectGender").checked = GM_getValue("options_detectGender", true);
		document.getElementById("hgOptions-tributeCounter").checked = GM_getValue("options_tributeCounter", true);
    }

	function hgCreateElement_Div(className, style) {
		var hgElement_div = document.createElement("div");
		hgElement_div.className = className;
		if(style) hgElement_div.style = style;

		return hgElement_div;
	}

    // TODO: create and use standard option saving
    function hgCreateElement_Checkbox(element_id, element_title, element_text, element_function) {
        var hgElement_checkbox = document.createElement("input");
        hgElement_checkbox.type = "checkbox";
        hgElement_checkbox.id = element_id;
        hgElement_checkbox.title = element_title;
        hgElement_checkbox.style = "display:inline!important;";
        if(element_function) hgElement_checkbox.onchange = function() { element_function(); };

        var hgElement_anchor = document.createElement("span");
        hgElement_anchor.innerHTML = element_text;
        hgElement_anchor.title = element_title;

        var hgElement_span = document.createElement("span");
        hgElement_span.appendChild(hgElement_checkbox);
        hgElement_span.appendChild(hgElement_anchor);

        return hgElement_span;
    }

	function hgCreateElement_Button(innerHTML, onclick) {
		var hgElement_button = document.createElement("button");
		hgElement_button.type = "button";
		hgElement_button.innerHTML = innerHTML;
		hgElement_button.onclick = onclick;

		return hgElement_button;
	}

	function hgCreateElement_Select(id, name, title, onchange) {
		var hgElement_select = document.createElement('select');
		hgElement_select.id = id;
		hgElement_select.name = name;
		hgElement_select.title = title;
		hgElement_select.onchange = onchange;

		return hgElement_select;
	}

	function hgCreateElement_Option(id, value) {
		var hgElement_option = document.createElement("option");
		hgElement_option.id = id;
		hgElement_option.text = value;
		hgElement_option.value = value;

		return hgElement_option;
	}

	// TODO: finish changing "hgOptions*" to appropriate names
    // TODO: finish abstracting into functions
    // TODO: Option: don't check nameless images by default
    // TODO: Option: customize keybinds
    // TODO: Option: hide "Deselect All" button
	// TODO: Option: don't truncate names to 26 characters
    // Settings button
	// Create settings button, div for settings, and the settings themselves
	var hgSettings_button = hgCreateElement_Button("Settings", function() { hgToggleOptionsPanel(); }); // Control button that expands/collapses settings panel
	var hgSettings_div = hgCreateElement_Div("hgOptions-panel", "display: none;"); // Div in which settings elements are placed
    hgSettings_div.appendChild(
        hgCreateElement_Checkbox(
            "hgOptions-tributeCounter",
            "Displays numbers for selected tributes",
            "Number the selected tributes<br>",
            function() { GM_setValue("options_tributeCounter", document.getElementById("hgOptions-tributeCounter").checked); hgNumberTributes(); }
        )
    );
    hgSettings_div.appendChild(
        hgCreateElement_Checkbox(
            "hgOptions-rememberSize",
            "Defaults number of tributes to previously selected number",
            "Remember last number of tributes selected<br>",
            function() { GM_setValue("options_rememberSize", document.getElementById("hgOptions-rememberSize").checked); }
        )
    );
    hgSettings_div.appendChild( // Note: default setting in ccd0's 4chan X seems to replace thumbnail link with full image regardless
        hgCreateElement_Checkbox(
            "hgOptions-fullImages",
            "Sorry this took so long",
            "Use full-sized images instead of thumbnails<br>",
            function() { GM_setValue("options_fullImages", document.getElementById("hgOptions-fullImages").checked); }
        )
    );
    hgSettings_div.appendChild(
        hgCreateElement_Checkbox(
            "hgOptions-skipEmpty",
			"If an image is posted but is not accompanied by text (e.g. a name), don't automatically select it for entry",
            "Don't automatically check entries with no post text<br>",
            function() { GM_setValue("options_skipEmpty", document.getElementById("hgOptions-skipEmpty").checked); }
        )
    );
    hgSettings_div.appendChild( // TODO: Make it to where we can execute without refreshing upon checking
        hgCreateElement_Checkbox(
            "hgOptions-detectGender",
            "For example, if a player wishes to enter a female tribute, they should type \"Name (F)\" or \"Name (Female)\" (without quotation marks, where \"Name\" is the desired entry name of the tribute)",
            "Scan tribute posts for gender specifiers and automatically select them<br>",
            function() { GM_setValue("options_detectGender", document.getElementById("hgOptions-detectGender").checked); }
        )
    );
    hgSettings_div.appendChild(
        hgCreateElement_Checkbox(
            "hgOptions-newLocation",
            "Moves load button on simulator's reaping edit page to a more sensible location",
            "Move \"Load\" button on simulator's \"Edit Cast\" page to just above the entry fields<br>",
            function() { GM_setValue("options_newLocation", document.getElementById("hgOptions-newLocation").checked); }
        )
    );
    // Create CDN setting
	/*
    var hgSettings_cdn_anchor = document.createElement("span");
    hgSettings_cdn_anchor.innerHTML = "<br>&nbsp;CDN: ";
    var hgSettings_cdn_opt1 = document.createElement("option");
    hgSettings_cdn_opt1.id = "hgOptions-CDN0";
    hgSettings_cdn_opt1.text = "Default CDN";
    hgSettings_cdn_opt1.value = "0";
    var hgSettings_cdn_opt2 = document.createElement("option");
    hgSettings_cdn_opt2.id = "hgOptions-CDN1";
    hgSettings_cdn_opt2.text = "i.4cdn.org";
    hgSettings_cdn_opt2.value = "1";
    var hgSettings_cdn_opt3 = document.createElement("option");
    hgSettings_cdn_opt3.id = "hgOptions-CDN2";
    hgSettings_cdn_opt3.text = "is.4chan.org";
    hgSettings_cdn_opt3.value = "2";
    var hgSettings_cdn_opt4 = document.createElement("option");
    hgSettings_cdn_opt4.id = "hgOptions-CDN3";
    hgSettings_cdn_opt4.text = "is2.4chan.org";
    hgSettings_cdn_opt4.value = "3";
    var hgSettings_cdn_select = document.createElement("select");
    hgSettings_cdn_select.id = "hgOptions-CDN";
    hgSettings_cdn_select.title = "Manually select a CDN to use.";
    hgSettings_cdn_select.appendChild(hgSettings_cdn_opt1);
    hgSettings_cdn_select.appendChild(hgSettings_cdn_opt2);
    hgSettings_cdn_select.appendChild(hgSettings_cdn_opt3);
    hgSettings_cdn_select.appendChild(hgSettings_cdn_opt4);
    var hgSettings_cdn_span = document.createElement("span");
    hgSettings_cdn_span.appendChild(hgSettings_cdn_anchor);
    hgSettings_cdn_span.appendChild(hgSettings_cdn_select);
    hgSettings_div.appendChild(hgSettings_cdn_span);
	*/

	// Control: "Select" type element for number of tributes to be saved
	var hgTributes_select = hgCreateElement_Select("hgTributes", "tributes", "Tributes", function() { hgNumberTributes(); GM_setValue("options_lastSize", document.getElementById("hgTributes").value); }); // TODO: change name from "tributes" to something more specific
	hgTributes_select.appendChild(hgCreateElement_Option("hg-t24", "24"));
	hgTributes_select.appendChild(hgCreateElement_Option("hg-t36", "36"));
	hgTributes_select.appendChild(hgCreateElement_Option("hg-t48", "48"));
    if(GM_getValue("options_rememberSize", true)) hgTributes_select.value = GM_getValue("options_lastSize", 24);
	// Controls div that contains controls and the settings button
	var hgCtrls_div = hgCreateElement_Div("hungergames", null);
    hgCtrls_div.appendChild(hgCreateElement_Button("Draw", function() { hgDraw(); window.scrollTo(0, document.body.scrollHeight); }));
	hgCtrls_div.appendChild(hgCreateElement_Button("Hide", function() { hgHide(); }));
    hgCtrls_div.appendChild(hgCreateElement_Button("Save", function() { hgSave(); }));
	hgCtrls_div.appendChild(hgCreateElement_Button("Deselect All", function() { hgDeselect(); }));
    hgCtrls_div.appendChild(hgTributes_select);
    hgCtrls_div.appendChild(hgSettings_button);
    hgCtrls_div.appendChild(hgSettings_div);

    document.getElementsByTagName("body")[0].appendChild(hgCtrls_div);

    hgLoadOptions();
} else if(window.location.hostname == "brantsteele.net" || window.location.hostname == "www.brantsteele.net") {
    // TODO: blank entries without values to be loaded
    function hgLoad() {
        var seasonname = document.getElementsByName("seasonname")[0].value;
        var logourl = document.getElementsByName("logourl")[0].value;

        var imgs = GM_getValue("imgsStr").split('|');
        var txts = GM_getValue("txtsStr").split('|');
        var gens = GM_getValue("gensStr").split('|');

        var hgReapingSize = GM_getValue("reapingSize");

        var capacity = (document.getElementsByTagName("select").length - 2) / 3;

        var inputs = document.getElementsByTagName("input");
        var genders = document.getElementsByTagName("select");

        // TODO: Always save 48, using empty strings for non-existent entries, so we can get rid of these awkward while loops and do away with the "select tribute size" option
        for(i = 2, j = 0; i < inputs.length && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 4, j++) {
            inputs[i].value = txts[j];
            inputs[i + 2].value = txts[j];
            inputs[i + 1].value = imgs[j];
            inputs[i + 3].value = "BW";
        }
        while(i < inputs.length && j < capacity) {
            inputs[i].value = "";
            inputs[i + 2].value = "";
            inputs[i + 1].value = "";
            inputs[i + 3].value = "";
            i += 4;
            j++;
        }

        for(i = 1, j = 0; i < hgReapingSize * 3 + 1 && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 3, j++) { // also check while i < genders.length? Seems to work fine without this check though, so remove similar check from previous loop?
            genders[i].value = gens[j];
        }
        while(i < genders.length && j < capacity) {
            genders[i].value = '?';
            i += 3;
            j++;
        }

        // TODO: better check
        if(document.getElementsByName("seasonname")[0].value == "") {
            document.getElementsByName("seasonname")[0].value = seasonname;
        }
        if(document.getElementsByName("logourl")[0].value == "") {
            document.getElementsByName("logourl")[0].value = logourl;
        }
    }

    var hgLoad_button = document.createElement("button");
    hgLoad_button.type = "button";
    hgLoad_button.innerHTML = "Load";
    hgLoad_button.onclick = function() { hgLoad(); };
    if(GM_getValue("options_newLocation") === true) {
        hgLoad_button.style.position = "absolute";
        document.getElementsByClassName("personalHG")[0].prepend(hgLoad_button);
    } else {
        document.getElementsByTagName("body")[0].prepend(hgLoad_button);
    }
}
