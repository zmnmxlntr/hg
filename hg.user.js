// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @version     2.2.0
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

// TODO: place class names, etc. into variables, finish nomenclature changes
// TODO: detect gender strings

if(window.location.hostname == "boards.4chan.org") {
    var tributes = 24;
    var hgEntry = 0;

    function hgSize() {
        tributes = document.getElementById("hgTributes").value;
    }

    function hgNumberTributes() {
        hgSize();

        var hgForms = document.getElementsByClassName("hg-gender");
        var count = 1;

        if(GM_getValue("options_tributeCounter", true) === true) {
            for(i = 0; i < hgForms.length; i++) {
                if(hgForms[i][0].checked && count <= tributes) {
                    hgForms[i].getElementsByClassName('hgTributeNumber')[0].innerHTML = " (" + count + ")";
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

        var x = document.getElementsByClassName("post reply"); // TODO: give a proper name

        for(i = 0; i < x.length; i++) {
            if(x[i].getElementsByClassName('hg-img').length === 0) {
                var y = x[i].getElementsByClassName("fileThumb");
                if(y.length) {
                    hgEntry++;

                    //if(GM_getValue("options_fullImages", false) === true) {
                    //  var img = y[0].href;
                    //} else {
                        var img = y[0].getElementsByTagName("img")[0].src;
                    //}
                    var txt = x[i].getElementsByClassName("postMessage")[0].innerText.split('\n');

                    var j = 0;
                    while(j < txt.length && (txt[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || txt[j].trim().length === 0)) {
                        j++;
                    }
                    // TODO: replace common gender matches
                    if(j < txt.length) {
                        txt = txt[j].replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength); // This regex somehow keeps getting gutted. Git??
                    } else {
                        txt = txt.join(' ').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\ç\.\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength);
                    }
                    // TODO: does not seem to work
                    if(txt.length > 15 && txt.match(/\s/g) === null) {
                        if(txt.length == hgNameMaxLength) {
                            txt[hgNameMaxLength - 1] = ' ';
                        } else {
                            txt += ' ';
                        }
                    }

                    var hgNumber_span = document.createElement('span');
                    hgNumber_span.className = "hgTributeNumber";

                    // Add a tag showing entry number
                    var hgEntry_checkbox = document.createElement('input');
                    hgEntry_checkbox.type = "checkbox";
                    hgEntry_checkbox.value = img;
                    hgEntry_checkbox.className = "hg-img";
                    hgEntry_checkbox.title = "Image #" + hgEntry;
                    hgEntry_checkbox.style = "display:inline!important;";
                    /*if(txt)*/ hgEntry_checkbox.checked = true;
                    hgEntry_checkbox.onchange = function() { hgNumberTributes(); };

                    var hgName_text = document.createElement('input');
                    hgName_text.type = "text";
                    hgName_text.maxLength = hgNameMaxLength;
                    hgName_text.size = 36;
                    hgName_text.className = "hg-field";
                    hgName_text.title = "Tribute name";
                    hgName_text.value = txt;

                    // TODO: stick these into their own form and change the outer element to a div
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
                    hgForm_form.appendChild(hgEntry_checkbox);
                    hgForm_form.appendChild(hgName_text);
                    hgForm_form.appendChild(hgMale_radio);
                    hgForm_form.appendChild(hgFemale_radio);
                    hgForm_form.appendChild(hgNumber_span);

                    x[i].prepend(hgForm_form);
                }
            }
        }

        hgNumberTributes();
    }

    function hgShow() {
        var gens = document.getElementsByClassName("hg-gender");

        for(i = 0; i < gens.length; i++) {
            gens[i].hidden = false;
        }
    }

    function hgHide() {
        var gens = document.getElementsByClassName("hg-gender");

        for(i = 0; i < gens.length; i++) {
            gens[i].hidden = true;
        }
    }

    function hgDeselect() {
        var imgs = document.getElementsByClassName("hg-img");

        for(i = 0; i < imgs.length; i++) {
            imgs[i].checked = false;
        }

        hgNumberTributes();
    }

    function hgSave() {
        hgSize();

        var useFullImgs = GM_getValue("options_fullImages", false);

        var imgs = document.getElementsByClassName("hg-img");
        var txts = document.getElementsByClassName("hg-field");
        var gens = document.getElementsByClassName("hg-gender");

        if(imgs.length == 0) {
            hgDraw();
            hgHide();
            window.scrollTo(0, document.body.scrollHeight);
        }

        // TODO: separate loop for each concatentation
        var imgsStr = "";
        var txtsStr = "";
        var gensStr = "";
        for(i = 0, count = 0; i < imgs.length && count < tributes; i++) {
            if(imgs[i].checked === true) {
                count++;

                // absolutely disgusting and will be changed once I shift DOM placement and how the checkbox behaves
                if(useFullImgs === true) {
                    try {
                        imgsStr += imgs[i].parentElement.parentElement.getElementsByClassName("fileThumb")[0].href + "|";
                    } catch(e) {
                        imgsStr += imgs[i].value + "|";
                    }
                } else {
                    imgsStr += imgs[i].value + "|";
                }
                txtsStr += txts[i].value + "|";

                // TODO: handle this garbage in a better way
                if(gens[i][2].checked === true) {
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
    }

    document.onkeydown = function(key) {
        key = key || window.event;

        if(key.keyCode == 112 || key.keyCode == 115) {
            hgDraw();
        } else if(key.keyCode == 113) {
            hgHide();
        }
    };

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
        document.getElementById("hgOptions-newLocation").checked = GM_getValue("options_newLocation", false);
        document.getElementById("hgOptions-rememberSize").checked = GM_getValue("options_rememberSize", true);
        document.getElementById("hgOptions-tributeCounter").checked = GM_getValue("options_tributeCounter", true);
        document.getElementById("hgOptions-fullImages").checked = GM_getValue("options_fullImages", false);
    }

    // TODO: create and hook standard option saving
    function hgCreateOption_Checkbox(opt_id, opt_title, opt_text, opt_function) {
        var hgOption_checkbox = document.createElement("input");
        hgOption_checkbox.type = "checkbox";
        hgOption_checkbox.id = opt_id;
        hgOption_checkbox.title = opt_title;
        hgOption_checkbox.style = "display:inline!important;";
        if(opt_function) hgOption_checkbox.onchange = function() { opt_function(); };

        var hgOption_anchor = document.createElement("span");
        hgOption_anchor.innerHTML = opt_text;
        hgOption_anchor.title = opt_title;

        var hgOption_span = document.createElement("span");
        hgOption_span.appendChild(hgOption_checkbox);
        hgOption_span.appendChild(hgOption_anchor);

        return hgOption_span;
    }

    // TODO: finish abstracting into functions
    // Options button
    var hgOptions_button = document.createElement("button");
    hgOptions_button.innerHTML = "Options";
    hgOptions_button.type = "button";
    hgOptions_button.onclick = function() { hgToggleOptionsPanel(); };
    // Draw options panel
    var hgOptions_cdn_anchor = document.createElement("span");
    hgOptions_cdn_anchor.innerHTML = "<br>&nbsp;CDN: ";
    var hgOptions_cdn_opt1 = document.createElement("option");
    hgOptions_cdn_opt1.id = "hgOptions-CDN0";
    hgOptions_cdn_opt1.text = "Default CDN";
    hgOptions_cdn_opt1.value = "0";
    var hgOptions_cdn_opt2 = document.createElement("option");
    hgOptions_cdn_opt2.id = "hgOptions-CDN1";
    hgOptions_cdn_opt2.text = "i.4cdn.org";
    hgOptions_cdn_opt2.value = "1";
    var hgOptions_cdn_opt3 = document.createElement("option");
    hgOptions_cdn_opt3.id = "hgOptions-CDN2";
    hgOptions_cdn_opt3.text = "is.4chan.org";
    hgOptions_cdn_opt3.value = "2";
    var hgOptions_cdn_opt4 = document.createElement("option");
    hgOptions_cdn_opt4.id = "hgOptions-CDN3";
    hgOptions_cdn_opt4.text = "is2.4chan.org";
    hgOptions_cdn_opt4.value = "3";
    var hgOptions_cdn_select = document.createElement("select");
    hgOptions_cdn_select.id = "hgOptions-CDN";
    hgOptions_cdn_select.title = "Manually select a CDN to use.";
    hgOptions_cdn_select.appendChild(hgOptions_cdn_opt1);
    hgOptions_cdn_select.appendChild(hgOptions_cdn_opt2);
    hgOptions_cdn_select.appendChild(hgOptions_cdn_opt3);
    hgOptions_cdn_select.appendChild(hgOptions_cdn_opt4);
    var hgOptions_cdn_span = document.createElement("span");
    hgOptions_cdn_span.appendChild(hgOptions_cdn_anchor);
    hgOptions_cdn_span.appendChild(hgOptions_cdn_select);
    //
    var hgOptions_div = document.createElement("div");
    hgOptions_div.style = "display: none;";
    hgOptions_div.className = "hgOptions-panel";
    hgOptions_div.appendChild(
        hgCreateOption_Checkbox(
            "hgOptions-tributeCounter",
            "Displays numbers for selected tributes",
            "Number the selected tributes<br>",
            function() { GM_setValue("options_tributeCounter", document.getElementById("hgOptions-tributeCounter").checked); hgNumberTributes(); }
        )
    );
    hgOptions_div.appendChild(
        hgCreateOption_Checkbox(
            "hgOptions-rememberSize",
            "Defaults number of tributes to previously selected number",
            "Remember last number of tributes selected<br>",
            function() { GM_setValue("options_rememberSize", document.getElementById("hgOptions-rememberSize").checked); }
        )
    );
    hgOptions_div.appendChild(
        hgCreateOption_Checkbox(
            "hgOptions-newLocation",
            "Move \"Load\" button on BrantSteele reaping edit page to just above the entry fields",
            "Move \"Load\" button on BrantSteele reaping edit page to just above the entry fields<br>",
            function() { GM_setValue("options_newLocation", document.getElementById("hgOptions-newLocation").checked); }
        )
    );
    hgOptions_div.appendChild(
        hgCreateOption_Checkbox(
            "hgOptions-fullImages",
            "Sorry this took so long",
            "Use full-sized images instead of thumbnails<br>",
            function() { GM_setValue("options_fullImages", document.getElementById("hgOptions-fullImages").checked); }
        )
    );
    //hgOptions_div.appendChild(hgOptions_cdn_span);
    // TODO: Option: don't check nameless images by default
    // TODO: Option: customize keybinds
    // TODO: Option: hide "Deselect All" button

    var hgTributes_select = document.createElement('select');
    hgTributes_select.id = "hgTributes";
    hgTributes_select.name = "tributes";
    hgTributes_select.title = "Tributes";
    hgTributes_select.onchange = function() { hgNumberTributes(); GM_setValue("options_lastSize", document.getElementById("hgTributes").value); };
    var hgT24_option = document.createElement('option');
    hgT24_option.id = "hg-t24";
    hgT24_option.text = "24";
    hgT24_option.value = "24";
    var hgT36_option = document.createElement('option');
    hgT36_option.id = "hg-t36";
    hgT36_option.text = "36";
    hgT36_option.value = "36";
    var hgT48_option = document.createElement('option');
    hgT48_option.id = "hg-t48";
    hgT48_option.text = "48";
    hgT48_option.value = "48";
    hgTributes_select.appendChild(hgT24_option);
    hgTributes_select.appendChild(hgT36_option);
    hgTributes_select.appendChild(hgT48_option);
    if(GM_getValue("options_rememberSize", true)) {
        hgTributes_select.value = GM_getValue("options_lastSize", 24);
    }

    var hgDraw_button = document.createElement("button");
    hgDraw_button.type = "button";
    hgDraw_button.innerHTML = "Draw";
    hgDraw_button.onclick = function() { hgDraw(); window.scrollTo(0, document.body.scrollHeight); };
    var hgHide_button = document.createElement("button");
    hgHide_button.type = "button";
    hgHide_button.innerHTML = "Hide";
    hgHide_button.onclick = function() { hgHide(); };
    var hgSave_button = document.createElement("button");
    hgSave_button.type = "button";
    hgSave_button.innerHTML = "Save";
    hgSave_button.onclick = function() { hgSave(); };
    var hgDsel_button = document.createElement("button");
    hgDsel_button.type = "button";
    hgDsel_button.innerHTML = "Deselect All";
    hgDsel_button.onclick = function() { hgDeselect(); };

    var hgCtrls_div = document.createElement('div');
    hgCtrls_div.className = "hungergames";
    hgCtrls_div.appendChild(hgDraw_button);
    hgCtrls_div.appendChild(hgHide_button);
    hgCtrls_div.appendChild(hgSave_button);
    hgCtrls_div.appendChild(hgDsel_button);
    hgCtrls_div.appendChild(hgTributes_select);
    hgCtrls_div.appendChild(hgOptions_button);
    hgCtrls_div.appendChild(hgOptions_div);

    document.getElementsByTagName("body")[0].appendChild(hgCtrls_div);

    hgLoadOptions();
} else if(window.location.hostname == "brantsteele.net" || window.location.hostname == "www.brantsteele.net") {
    var seasonname = document.getElementsByName("seasonname")[0].value;
    var logourl = document.getElementsByName("logourl")[0].value;

    var hgLoad_button = document.createElement("button");
    hgLoad_button.type = "button";
    hgLoad_button.innerHTML = "Load";
    hgLoad_button.onclick = function() { // TODO: blank entries without values to be loaded
        var tributes = GM_getValue("tributes");

        var imgs = GM_getValue("imgs").split('|');
        var txts = GM_getValue("txts").split('|');
        var gens = GM_getValue("gens").split('|');

        var capacity = (document.getElementsByTagName("select").length - 2) / 3;

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

        // TODO: better check
        if(document.getElementsByName("seasonname")[0].value == "") {
            document.getElementsByName("seasonname")[0].value = seasonname;
        }
        if(document.getElementsByName("logourl")[0].value == "") {
            document.getElementsByName("logourl")[0].value = logourl;
        }
    };

    if(GM_getValue("options_newLocation") === true) {
        hgLoad_button.style.position = "absolute";
        document.getElementsByClassName("personalHG")[0].prepend(hgLoad_button);
    } else {
        document.getElementsByTagName("body")[0].prepend(hgLoad_button);
    }
}
