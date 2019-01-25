// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @author      Virginia
// @version     3.1.2
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @include     /^(https?://)?boards\.4chan(nel)?\.org/.*/(res|thread)/.*$/
// @include     /^(https?://)?(www\.)?brantsteele\.net/hungergames/(edit|personal)\.php$/
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

// ToDO: Should those @include regexes end with a forward slash, or should the intermediate forward slashes be escaped? Not sure what's going on there but I guess it works
// ToDO: Finish nomenclature changes
// ToDO: Remove "number of tributes" setting and simply save 48 and load as many as needed on reaping page
// ToDO: Add automatic form saving and reset button
// ToDO: Automatically draw entry forms for new entries upon page update done in-pace by extensions if draw is shown
// ToDO: Retain page position when pressing draw keyboard shortcut
// ToDO: Add contact info/instructions in GUI itself for purposes of feedback/bug reports

if(window.location.hostname === "boards.4chan.org" || window.location.hostname === "boards.4channel.org") {
    var hgReapingSize = 24;
    var hgEntriesDrawn = 0;

    // ToDO: Finish placing class names etc. into variables
    // Tribute form elements
    var class_hgForm     = "hg-form";
    var class_hgCheckbox = "hg-checkbox";
    var class_hgField    = "hg-field";
    var class_hgGender   = "hg-gender";
    var name_hgGender    = "hg-gender";

    function hgSize() {
        hgReapingSize = document.getElementById("hgTributes").value;
    }

    function hgNumberTributes() {
        hgSize();

        var hgForms = document.getElementsByClassName(class_hgForm);
        if(GM_getValue("options_tributeCounter", true) === true) {
            var count = 1;
            for(var i = 0; i < hgForms.length; i++) {
                if(hgForms[i][0].checked && count <= hgReapingSize) {
                    // ToDO: Do this more efficiently, rather than checking every fucking time when we know it's always the last one
                    hgForms[i].getElementsByClassName('hgTributeNumber')[0].innerHTML = (count == hgReapingSize) ? " <b>(" + count + ")</b>" : " (" + count + ")";
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

        var skipEmpty     = GM_getValue("options_skipEmpty", true);
        var detectGender  = GM_getValue("options_detectGender", true);
        var unlimitLength = GM_getValue("options_unlimitLength", true);

        // ToDO: Relax form validation
        var validRegex  = /[^úóãíáéêç,'.\:\-\sa-zA-Z0-9]+/g // Turns out it was Brantsteele who fucked up the regex, from whom I blindly copied it
        var genderRegex = /(\([FfMm]\))|(\([Ff]emale\))|(\([Mm]ale\))/g
        // ToDO: Combine
        var quoteRegex1 = /^(>>[0-9]+)(\s\(OP\))?/
        var quoteRegex2 = /(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g

        // ToDO: Find escape codes for fancy characters in the regex.
        // ToDO: WEBMs break shit. Figure out how to deal with that. Addendum: apparently I figured that shit out?
        var threadPosts = document.getElementsByClassName("post reply");
        for(var i = 0; i < threadPosts.length; i++) {
            try {
                if(threadPosts[i].getElementsByClassName(class_hgCheckbox).length === 0) {
                    var postNumber = threadPosts[i].getElementsByClassName("postNum desktop")[0].childNodes[1].innerHTML; // ToDO: A getElementsByTag('a')[1].innerHTML might be more robust
                    var postImage = threadPosts[i].getElementsByClassName("fileThumb");
                    if(postImage.length) {
                        if(postImage[0].href.match(/(\.webm$)|(\.pdf$)/i)) {
                            continue;
                        }

                        hgEntriesDrawn++;

                        var thumb = postImage[0].getElementsByTagName("img")[0].src; // ToDO: not used?
                        var img = postImage[0].href;
                        var nom = threadPosts[i].getElementsByClassName("postMessage")[0].innerText.split('\n');

                        var female = false;

                        // ToDO: think more about this when you're not drunk.
                        if(detectGender === true) { // ToDO: can't remember if I was doing this later in the loop for an actual reason, should probably investigate
                            for(var k = 0; k < nom.length; k++) {
                                // ToDO: search for (F) in filename, avoid (F) found in quotes and etc.
                                //if(nom[k][0] != '>') OPENCURLYBRACKET // ToDO: avoid (F) found in quotes, etc.
                                if(nom[k].match(/(\(F\))|(\(Female\))/g)) {
                                    female = true;
                                }
                            }
                        }

                        // Generate default tribute name:
                        var j = 0;
                        // Don't overwrite existing tributes whose names might have been edited.
                        //while(j < nom.length && (nom[j].match(/^(>>[0-9]+)(\s\(OP\))?/) || nom[j].trim().length === 0)) OPENCURLYBRACKET // ToDO: might need to make these combined checks in opposite order?
                        while(j < nom.length && (nom[j].match(quoteRegex1) || nom[j].trim().length === 0)) {
                            j++;
                        }
                        // Strip gender identifiers, quotes, and invalid characters from names.
                        if(j < nom.length) { // ToDO: if j < nom.length ??? that doesn't seem right, why does this work
                            //nom = nom[j].replace(/(\(F\))|(\(Female\))/g, '').replace(/[^ú\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength); // This regex somehow keeps getting gutted. Git/GitHub??
                            nom = nom[j].replace(genderRegex, '').replace(validRegex, '').trim();
                        } else {
                            //nom = nom.join(' ').replace(/(\(F\))|(\(Female\))|(\(M\))|(\(Male\))/g, '').replace(/(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g, '').replace(/[^ú\:\-\sa-zA-Z-z0-9]/g, '').trim().substring(0, hgNameMaxLength);
                            nom = nom.join(' ').replace(genderRegex, '').replace(quoteRegex2, '').replace(validRegex, '').trim();
                        }
                        // NOTE: Not sure if this is still necessary, or perhaps now implemented in a stupid way.
                        if(unlimitLength === false) {
                            nom = nom.substring(0, hgNameMaxLength - 1); // ToDO: maybe hgNameMaxLength - 1?
                        }
                        //if(nom.length > 15 && nom.match(/\s/g) === null) { // ToDO: does not seem to work
                            /*
                            if(nom.length >= hgNameMaxLength - 1) {
                                nom[hgNameMaxLength - 1] = ' ';
                            } else {
                                nom += ' ';
                            }
                            */
                            //nom.length >= hgNameMaxLength - 1 ? nom[hgNameMaxLength - 1] = ' ' : nom += ' ';
                        //}

                        // ???
                        var hgNumber_span = document.createElement('span');
                        hgNumber_span.className = "hgTributeNumber";

                        // Checkbox for entry
                        var hgEntry_checkbox = document.createElement('input');
                        hgEntry_checkbox.type = "checkbox";
                        hgEntry_checkbox.className = class_hgCheckbox;
                        hgEntry_checkbox.title = "Image #" + hgEntriesDrawn;
                        hgEntry_checkbox.style = "display:inline!important;";
                        hgEntry_checkbox.onchange = function() { hgNumberTributes(); };
                        if(skipEmpty === true) {
                            if(nom) hgEntry_checkbox.checked = true;
                        } else {
                            hgEntry_checkbox.checked = true;
                        }

                        // Text input field for tribute name
                        var hgName_text = document.createElement('input');
                        hgName_text.type = "text";
                        hgName_text.size = 36;
                        hgName_text.className = class_hgField;
                        hgName_text.title = "Tribute name";
                        hgName_text.value = nom;
                        if(unlimitLength === false) {
                            hgName_text.maxLength = hgNameMaxLength;
                        }

                        // Radio buttons for gender
                        var hgMale_radio = document.createElement('input');
                        hgMale_radio.type = "radio";
                        hgMale_radio.name = "gender";
                        hgMale_radio.className = class_hgGender;
                        hgMale_radio.value = "M";
                        hgMale_radio.title = "Male";
                        var hgFemale_radio = document.createElement('input');
                        hgFemale_radio.type = "radio";
                        hgFemale_radio.name = "gender";
                        hgFemale_radio.className = class_hgGender;
                        hgFemale_radio.value = "F";
                        hgFemale_radio.title = "Female";
                        if(detectGender === true && (female === true || grills.includes(nom.toLowerCase()))) {
                            hgFemale_radio.checked = true;
                        } else {
                            hgMale_radio.checked = true;
                        }

                        // Tribute form that contains previous elements
                        var hgForm_form = document.createElement('form');
                        hgForm_form.className = class_hgForm;
                        hgForm_form.setAttribute("postNumber", postNumber);
                        hgForm_form.appendChild(hgEntry_checkbox);
                        hgForm_form.appendChild(hgName_text);
                        hgForm_form.appendChild(hgMale_radio);
                        hgForm_form.appendChild(hgFemale_radio);
                        hgForm_form.appendChild(hgNumber_span);

                        threadPosts[i].prepend(hgForm_form);
                    }
                }
            } catch(e) {
                console.log("Exception encountered at i=" + i); // ToDO: Better debugging
            }
        }

        hgNumberTributes();
    }

    function hgSave() {
        hgSize();

        var tributeForms = document.getElementsByClassName(class_hgForm);

        // If some dumbass clicks save before having drawn forms yet, then draw and hide the forms and save all default values so he doesn't bitch about being a pea-brained illiterate.
        if(tributeForms.length == 0) {
            hgDraw();
            hgHide();
            tributeForms = document.getElementsByClassName(class_hgForm);
            window.scrollTo(0, document.body.scrollHeight);
        }

        // ToDO: Separate into three loops
        var imgsStr = "";
        var nomsStr = "";
        var gensStr = "";
        var useFullImgs = GM_getValue("options_fullImages", true);
        for(var i = 0, count = 0; i < tributeForms.length && count < hgReapingSize; i++) {
            if(tributeForms[i].getElementsByClassName(class_hgCheckbox)[0].checked === true) {
                count++;

                // ToDO: Store image URLs in memory instead of DOM or some shit
                // ToDO: Possibly change retrieval from getElementByEtc() to simple index accesses since we have a set order of elements
                if(useFullImgs === true) {
                    imgsStr += tributeForms[i].parentElement.getElementsByClassName("fileThumb")[0].href + "|";
                } else {
                    imgsStr += tributeForms[i].parentElement.getElementsByTagName("img")[0].src + "|";
                }

                nomsStr += tributeForms[i].getElementsByClassName(class_hgField)[0].value + "|";

                if(tributeForms[i].getElementsByClassName(class_hgGender)[0].checked === true) {
                    gensStr += "1|";
                } else {
                    gensStr += "0|";
                }
            }
        }

        GM_setValue("reapingSize", hgReapingSize);
        GM_setValue("imgsStr", imgsStr);
        GM_setValue("nomsStr", nomsStr);
        GM_setValue("gensStr", gensStr);
    }

    //================================================================================================================//
    //== Keybind Functionalities =====================================================================================//
    //================================================================================================================//

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

    //================================================================================================================//
    //== Controls ====================================================================================================//
    //================================================================================================================//

    // Show tribute forms
    function hgShow() {
        var gens = document.getElementsByClassName(class_hgForm);
        for(var i = 0; i < gens.length; i++) {
            gens[i].hidden = false;
        }
    }

    // Hide tribute forms
    function hgHide() {
        var gens = document.getElementsByClassName(class_hgForm);
        for(var i = 0; i < gens.length; i++) {
            gens[i].hidden = true;
        }
    }

    // Deselect all selected tributes
    function hgDeselect() {
        if(document.getElementsByClassName(class_hgForm).length == 0) {
            hgDraw();
            hgHide();
            window.scrollTo(0, document.body.scrollHeight);
        }

        var imgs = document.getElementsByClassName(class_hgCheckbox);
        for(var i = 0; i < imgs.length; i++) {
            imgs[i].checked = false;
        }

        hgNumberTributes();
    }

    // Show or hide options panel
    function hgTogglePanel(panel) {
        var hgOptions_element = document.getElementsByClassName(panel);
        if(hgOptions_element[0].style.display === "block") {
            hgOptions_element[0].style.display = "none";
        } else {
            hgOptions_element[0].style.display = "block";
        }

        window.scrollTo(0, document.body.scrollHeight);
    }

    // ToDO: Change functionality to hide all panels, and just stick it at the beginning of hgTogglePanel instead
    // Hide a given panel
    function hgHidePanel(panel) {
        document.getElementsByClassName(panel)[0].style.display = "none"
    }

    // ToDO: Create structure to store these relationships
    // Load saved values for options and set their checkboxes appropriately
    function hgLoadOptions() {
        document.getElementById("hgOptions-skipEmpty").checked = GM_getValue("options_skipEmpty", true);
        document.getElementById("hgOptions-fullImages").checked = GM_getValue("options_fullImages", true);
        document.getElementById("hgOptions-newLocation").checked = GM_getValue("options_newLocation", true);
        document.getElementById("hgOptions-rememberSize").checked = GM_getValue("options_rememberSize", true);
        document.getElementById("hgOptions-detectGender").checked = GM_getValue("options_detectGender", true);
        document.getElementById("hgOptions-unlimitLength").checked = GM_getValue("options_unlimitLength", true);
        document.getElementById("hgOptions-tributeCounter").checked = GM_getValue("options_tributeCounter", true);
    }

    //================================================================================================================//
    //== Element Creation Wrappers ===================================================================================//
    //================================================================================================================//

    function hgCreateElement_Div(className, style = null) {
        var hgElement_div = document.createElement("div");
        hgElement_div.className = className;
        if(style) hgElement_div.style = style; // ToDO: this is shit

        return hgElement_div;
    }

    // ToDO: create and use standard option saving
    function hgCreateElement_Checkbox(element_id, element_title, element_text, element_function) {
        var hgElement_checkbox = document.createElement("input");
        hgElement_checkbox.type = "checkbox";
        hgElement_checkbox.id = element_id;
        hgElement_checkbox.title = element_title;
        hgElement_checkbox.style = "display:inline!important;";
        if(element_function) hgElement_checkbox.onchange = function() { element_function(); };

        // ToDO: rename hgElement_anchor to hgElement_span or something?
        var hgElement_anchor = document.createElement("span");
        hgElement_anchor.innerHTML = element_text;
        hgElement_anchor.title = element_title;

        var hgElement_span = document.createElement("span");
        hgElement_span.appendChild(hgElement_checkbox);
        hgElement_span.appendChild(hgElement_anchor);

        return hgElement_span;
    }

    function hgCreateElement_Button(innerHTML, title, onclick, id = null) {
        var hgElement_button = document.createElement("button");
        hgElement_button.type = "button";
        hgElement_button.title = title;
        hgElement_button.innerHTML = innerHTML;
        hgElement_button.onclick = onclick;
        if(id) hgElement_button.id = id;

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

    // ToDO: Not being used?
    function hgCreateElement_Span(id, action, value) {
        var hgElement_span = document.createElement("span");
        hgElement_span.id = id;
        hgElement_span.innerHTML = action + ": " + value;

        return hgElement_span;
    }

    //================================================================================================================//
    //== Tributes known to be grills =================================================================================//
    //================================================================================================================//

    var grills = [ "megumi", "megumin", "sakuya", "unlucky girl", "unfortunate girl", "guild girl", "queen boo", "madotsuki", "hedenia" ];

    //================================================================================================================//
    //== Options and Settings Creation ===============================================================================//
    //================================================================================================================//

    // ToDO: finish changing "hgOptions*" to appropriate names
    // ToDO: finish abstracting into functions
    // ToDO: Option: customize keybinds
    // ToDO: Option: hide "Deselect All" button

    // Create settings button, div for settings, and the settings themselves
    var hgSettings_button = hgCreateElement_Button("Settings", "Settings panel", function() { hgHidePanel("hgUpcoming-panel"); hgTogglePanel("hgOptions-panel"); }); // Control button that expands/collapses settings panel
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
    hgSettings_div.appendChild( // Note: Default setting in ccd0's 4chan X seems to replace thumbnail link with full image regardless
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
            "Don't automatically include image posts with no text<br>",
            function() { GM_setValue("options_skipEmpty", document.getElementById("hgOptions-skipEmpty").checked); }
        )
    );
    hgSettings_div.appendChild(
        hgCreateElement_Checkbox(
            "hgOptions-unlimitLength",
            "Uncaps the name length restriction on both 4chan and BrantSteele",
            "Remove the 26 character restriction on tribute name lengths<br>",
            function() { GM_setValue("options_unlimitLength", document.getElementById("hgOptions-unlimitLength").checked); }
        )
    );
    hgSettings_div.appendChild( // ToDO: Make it to where we can execute without refreshing upon checking
        hgCreateElement_Checkbox(
            "hgOptions-detectGender",
            "For example, if a player wishes to enter a female tribute they would type \"Name (F)\" or \"Name (Female)\" (without quotation marks, where \"Name\" is the desired entry name of the tribute)",
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

    // ToDO: Can we instead pass to the function the element as we already have it above? Doubt it, but worth looking into.
    var hgUpcoming_button = hgCreateElement_Button("Upcoming", "Upcoming features and changes", function() {  hgHidePanel("hgOptions-panel"); hgTogglePanel("hgUpcoming-panel"); }); // Control button that expands/collapses panel
    var hgUpcoming_div = hgCreateElement_Div("hgUpcoming-panel", "display: none;"); // Div in which elements are placed
    hgUpcoming_div.innerHTML = "Upcoming features:<br>&nbsp;- Customize keybinds<br>&nbsp;- Retain edited forms through page refreshes<br>&nbsp;- Reset forms to original<br>&nbsp;- Retain page position when drawing new forms<br>&nbsp;- Safely relax input validation to be equally permissive to the simulator's back end<br>&nbsp;- Use original tribute image rather than greyscale image for death screen<br>&nbsp;- Additional code refactoring for the sake of maintainability and readability (not that you care)<br><br>For bugs/suggestions/questions/feedback, contact me on Discord: ZMNMXLNTR#6271<br>Alternatively, submit an issue to the <a href='https://github.com/zmnmxlntr/hg' target='_blank'>repository</a>.";

    /*
    // Create CDN setting
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
    var hgTributes_select = hgCreateElement_Select("hgTributes", "tributes", "Number of tributes", function() { hgNumberTributes(); GM_setValue("options_lastSize", document.getElementById("hgTributes").value); }); // ToDO: change name from "tributes" to something more specific
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t24", "24"));
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t36", "36"));
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t48", "48"));
    if(GM_getValue("options_rememberSize", true)) hgTributes_select.value = GM_getValue("options_lastSize", 24);
    // Controls div that contains controls and the settings button
    var hgCtrls_div = hgCreateElement_Div("hungergames");
    hgCtrls_div.appendChild(hgCreateElement_Button("Draw", "Draw the entry forms", function() { hgDraw(); window.scrollTo(0, document.body.scrollHeight); }));
    hgCtrls_div.appendChild(hgCreateElement_Button("Hide", "Hide the entry forms", function() { hgHide(); }));
    hgCtrls_div.appendChild(hgCreateElement_Button("Save", "Save the entries", function() { hgSave(); }));
    hgCtrls_div.appendChild(hgCreateElement_Button("Deselect All", "Deselect all entry forms", function() { hgDeselect(); }));
    hgCtrls_div.appendChild(hgTributes_select);
    hgCtrls_div.appendChild(hgCreateElement_Button("Reaping", "Open the reaping page on Brantsteele's website", function() { window.open("http://brantsteele.net/hungergames/reaping.php"); }));
    hgCtrls_div.appendChild(hgSettings_button);
    hgCtrls_div.appendChild(hgUpcoming_button);
    hgCtrls_div.appendChild(hgSettings_div);
    hgCtrls_div.appendChild(hgUpcoming_div);

    document.getElementsByTagName("body")[0].appendChild(hgCtrls_div);

    hgLoadOptions();
} else if(window.location.hostname == "brantsteele.net" || window.location.hostname == "www.brantsteele.net") {
    // Apparently we can use whatever fucking name we want, there is no back end validation.
    unsafeWindow.validateForm = function() {
        return true;
    }

    function unlimitLengths() {
        // ToDO: Instead of simply returning when option is false, reinstate maxLength attribute
        if(GM_getValue("options_unlimitLength", false) === true) {
            return;
        }

        var capacity = (document.getElementsByTagName("select").length - 2) / 3;
        var inputs   = document.getElementsByTagName("input");

        for(var i = 2, j = 0; i < inputs.length && j < capacity; i += 4, j++) { // ToDO: Checking against capacity is probably redundant and unnecessary
            // ToDO: check to make sure doing removeAttribute on an attribute that's not there doesn't break shit
            inputs[i].removeAttribute("maxLength");
            inputs[i + 2].removeAttribute("maxLength");
        }
    }

    function hgLoad() {
        var imgs = GM_getValue("imgsStr").split('|');
        var noms = GM_getValue("nomsStr").split('|');
        var gens = GM_getValue("gensStr").split('|');

        var hgReapingSize = GM_getValue("reapingSize", 24);

        var capacity = (document.getElementsByTagName("select").length - 2) / 3;

        var inputs  = document.getElementsByTagName("input");
        var genders = document.getElementsByTagName("select");

        unlimitLengths();

        var i, j;
        // ToDO: Always save 48, using empty strings for non-existent entries, so we can get rid of these awkward while loops and do away with the "select tribute size" option
        // Populate all saved values into the reaping form
        for(i = 2, j = 0; i < inputs.length && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 4, j++) {
            // ToDO: check to make sure doing removeAttribute on an attribute that's not there doesn't break shit
            // ToDO: unlimit length immediately upon page load if option is set, rather than waiting for Load
            inputs[i + 2].value = inputs[i].value = noms[j];
            inputs[i + 1].value = imgs[j];
            inputs[i + 3].value = "BW";
        }
        // Blank any entry forms that do not yet have a corresponding saved value
        for(null; i < inputs.length && j < capacity; i += 4, j++) {
            inputs[i + 3].value = inputs[i + 2].value = inputs[i + 1].value = inputs[i].value = "";
        }
        // Assign genders to all saved tributes
        for(i = 1, j = 0; i < hgReapingSize * 3 + 1 && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 3, j++) { // also check while i < genders.length? Seems to work fine without this check though, so remove similar check from previous loop?
            genders[i].value = gens[j];
        }
        // Set gender to '?' for any positions that have not yet been filled
        for(null; i < genders.length && j < capacity; i += 3, j++) {
            genders[i].value = '?';
        }

        var seasonName = document.getElementsByName("seasonname")[0];
        if(seasonName.value === "" || !seasonName.value.match(/\S/) || seasonName.value.length < 1) {
            seasonName.value = defaultSeasonName;
        }
        var logoUrl = document.getElementsByName("logourl")[0];
        if(logoUrl.value === "" || !logoUrl.value.match(/\S/) || logoUrl.value.length < 1) {
            logoUrl.value = defaultLogoUrl;
        }
    }

    unlimitLengths();

    // Default values of Season Name and Logo URL fields
    var defaultSeasonName = document.getElementsByName("seasonname")[0].value;
    var defaultLogoUrl    = document.getElementsByName("logourl")[0].value;

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
