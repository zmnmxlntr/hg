// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @author      Virginia
// @version     3.3.5
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @include     /^(https?://)?boards\.4chan(nel)?\.org/.*/(res|thread)/.*$/
// @include     /^(https?://)?(www\.)?brantsteele\.net/hungergames/(edit|personal)\.php$/
// @grant       GM_setValue
// @grant       GM_getValue
// @icon        data:image/png;base64,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
// ==/UserScript==

// Copyright ZMNMXLNTR 2017-2021
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/* eslint no-multi-spaces:off */

/* ToDo:
 - Should those @include regexes end with a forward slash, or should the intermediate forward slashes be escaped? Not sure what's going on there but I guess it works
 - Finish nomenclature changes
 - Remove "number of tributes" setting and simply save 48 and load as many as needed on reaping page
 - Add automatic form saving and reset button
 - Automatically draw entry forms for new entries upon page update done in-pace by extensions if draw is shown
 - Retain page position when pressing draw keyboard shortcut
 - Async/thread?
 - Review unused stuff
 - Display genders on finalized reaping page
 - Finish placing class names etc. into variables
 - Implement data binding to simplify option values and displays and reduce room for error
 - Make a CSS file or section
*/

if(window.location.hostname === "boards.4chan.org" || window.location.hostname === "boards.4channel.org") {
    var hgReapingSize = 24;
    var hgEntriesDrawn = 0;

    // ToDO: Fix insufficiently descriptive to the point of sometimes being misleading
    // Tribute form elements
    const class_hgForm      = "hg-form";
    const class_hgCheckbox  = "hg-checkbox";
    const class_hgField     = "hg-field";
    const class_hgGender    = "hg-gender";
    const class_hgTributeNo = "hg-tributeNo";

    // ToDO: Pretty sure this can just be a global assignment instead of a function, the value will change if the element's value does. If not, we can use onChange to update the value automatically.
    function hgSize() {
        hgReapingSize = document.getElementById("hgTribsNo").value;
    }

    // Depending on whether "tributeCounter" is enabled, either number/renumber tributes or remove any currently rendered numbering
    function hgNumberTributes() {
        hgSize();

        const hgForms = document.getElementsByClassName(class_hgForm);

        if(GM_getValue("options_tributeCounter", true) === true) {
            for(let i = 0, count = 1; i < hgForms.length; i++) {
                const hgForm = hgForms[i].getElementsByClassName(class_hgTributeNo)[0];
                if(hgForms[i][0].checked) {
                    hgForm.innerHTML = count <= hgReapingSize ? " <span style='color:white;'>(" + count + ")</span>" : " <span style='color:gray;'><i>(" + count + ")</i></span>";
                    hgForm.title = "Tribute #" + count;
                    if(count > hgReapingSize) hgForm.title += " (Currently only " + hgReapingSize + " tributes are to be in the reaping)";
                    count++;
                } else {
                    hgForm.innerHTML = "";
                }
            }
        } else {
            for(let i = 0; i < hgForms.length; i++) {
                hgForms[i].getElementsByClassName(class_hgTributeNo)[0].innerHTML = "";
            }
        }
    }

    function hgDraw() {
        const start = new Date().getTime();

        hgSize();
        hgShow();

        const hgNameMaxLength = 26;

        const optSkipEmpty     = GM_getValue("options_skipEmpty", true);
        const optDetectGender  = GM_getValue("options_detectGender", true);
        const optUnlimitLength = GM_getValue("options_unlimitLength", true);

        // ToDO: Relax form validation, combine quote regexes
        const validRegex  = /[^a-zA-Z0-9úóãíáéêç.,:'\-\s]+/g;
        const genderRegex = /(\([FM]\))|(\(Female\))|(\(Male\))/gi;
        const quoteRegex1 = /^(>>[0-9]+)(\s\(OP\))?/;
        const quoteRegex2 = /(>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?/g;
        const quoteRegex  = /(^(>>[0-9]+)(\s\(OP\))?)|((>>[0-9]+)(\s?\(You\))?(\s?\(OP\))?)/g; // ToDO: Try this combination out, baby

        // ToDO: Find escape codes for fancy characters in the regex.
        const threadPosts = document.getElementsByClassName("post reply");
        for(let i = 0; i < threadPosts.length; i++) {
            try {
                if(threadPosts[i].getElementsByClassName(class_hgCheckbox).length === 0) {
                    const postNumber = threadPosts[i].id;
                    const postImage  = threadPosts[i].getElementsByClassName("fileThumb");

                    if(postImage.length) {
                        if(!postImage[0].href || postImage[0].href.match(/(\.webm$)|(\.pdf$)/i)) continue;

                        hgEntriesDrawn++;

                        //let thumb = postImage[0].getElementsByTagName("img")[0].src; // ToDO: Not used?
                        //let img = postImage[0].href; // ToDO: Wtf not using this either?
                        let nom = threadPosts[i].getElementsByClassName("postMessage")[0].innerText.split('\n');

                        let female = false;

                        // ToDO: Think more about this when you're not drunk.
                        if(optDetectGender === true) { // ToDO: Can't remember if I was doing this later in the loop for an actual reason, should probably investigate
                            for(let k = 0; k < nom.length; k++) {
                                // ToDO: Search for (F) in filename, avoid (F) found in quotes and etc.
                                // ToDO: Avoid (F) found in quotes, etc.
                                //if(nom[k][0] != '>')
                                //if(!nom[k].match(/^>/)
                                if(nom[k].match(/(\(F\))|(\(Female\))/gi)) {
                                    female = true;
                                }
                            }
                        }

                        // Generate default tribute name:
                        let j = 0;
                        // Don't overwrite existing tributes as there's no reason to and their names might have been edited.
                        // ToDO: Might want to make these combined checks in opposite order?
                        while(j < nom.length && (nom[j].match(quoteRegex1) || nom[j].trim().length === 0)) {
                            j++;
                        }
                        // Strip gender identifiers, quotes, and invalid characters from names.
                        // ToDO: if(j < nom.length)??? that doesn't seem right, why does this work?
                        if(j < nom.length) {
                            nom = nom[j].replace(genderRegex, '').replace(validRegex, '').trim();
                        } else {
                            nom = nom.join(' ').replace(genderRegex, '').replace(quoteRegex2, '').replace(validRegex, '').trim();
                        }
                        // ToDO: Not sure if this is still necessary, or perhaps now implemented in a stupid way.
                        // ToDO: Ensure this use of hgNameMaxLength doesn't result in one-off errors
                        if(optUnlimitLength === false) {
                            nom = nom.substring(0, hgNameMaxLength - 1);
                        }
                        /*
                        // ToDO: does not seem to work
                        //if(nom.length > 15 && nom.match(/\s/g) === null) {
                            if(nom.length >= hgNameMaxLength - 1) {
                                nom[hgNameMaxLength - 1] = ' ';
                            } else {
                                nom += ' ';
                            }
                            //nom.length >= hgNameMaxLength - 1 ? nom[hgNameMaxLength - 1] = ' ' : nom += ' ';
                        //}
                        */

                        // Span in which tribute number is displayed
                        const hgNumber_span = document.createElement('span');
                        hgNumber_span.className = class_hgTributeNo;

                        // Checkbox for entry
                        const hgEntry_checkbox = document.createElement('input');
                        hgEntry_checkbox.type = "checkbox";
                        hgEntry_checkbox.className = class_hgCheckbox;
                        hgEntry_checkbox.title = "Image #" + hgEntriesDrawn;
                        hgEntry_checkbox.style = "display:inline!important;";
                        hgEntry_checkbox.onchange = hgNumberTributes;
                        if((optSkipEmpty === true && nom === "") === false) hgEntry_checkbox.checked = true;

                        // Text input field for tribute name
                        const hgName_text = document.createElement('input');
                        hgName_text.type = "text";
                        hgName_text.size = 36;
                        hgName_text.className = class_hgField;
                        hgName_text.title = "Tribute name";
                        hgName_text.value = nom;
                        if(optUnlimitLength === false) hgName_text.maxLength = hgNameMaxLength;

                        // Radio buttons for gender
                        const hgMale_radio = document.createElement('input');
                        hgMale_radio.type = "radio";
                        hgMale_radio.name = class_hgGender;
                        hgMale_radio.className = class_hgGender;
                        hgMale_radio.value = "M";
                        hgMale_radio.title = "Male";
                        const hgFemale_radio = document.createElement('input');
                        hgFemale_radio.type = "radio";
                        hgFemale_radio.name = class_hgGender;
                        hgFemale_radio.className = class_hgGender;
                        hgFemale_radio.value = "F";
                        hgFemale_radio.title = "Female";
                        optDetectGender === true && (female === true || grills.includes(nom.toLowerCase())) ? hgFemale_radio.checked = true : hgMale_radio.checked = true;

                        // Tribute form that contains previous elements
                        const hgForm_form = document.createElement('form');
                        hgForm_form.className = class_hgForm;
                        //hgForm_form.setAttribute("postNumber", postNumber); // ToDO: Use this somewhere to make things more efficient? Or just access this info through parent.id
                        hgForm_form.appendChild(hgEntry_checkbox);
                        hgForm_form.appendChild(hgName_text);
                        hgForm_form.appendChild(hgMale_radio);
                        hgForm_form.appendChild(hgFemale_radio);
                        hgForm_form.appendChild(hgNumber_span);

                        threadPosts[i].prepend(hgForm_form);
                    }
                }
            } catch(e) {
                console.log("Exception encountered at i=" + i + ": " + e.toString());
            }
        }

        hgNumberTributes();

        console.log(new Date().getTime() - start);
    }

    function hgSave() {
        const start = new Date().getTime();

        hgSize();

        const tributeForms = document.getElementsByClassName(class_hgForm);

        // Invoke hgDraw automatically if it has not yet been evoked and the user attempts to invoke hgSave
        if(tributeForms.length === 0) {
            hgDraw();
            hgHide();
            tributeForms = document.getElementsByClassName(class_hgForm);
            window.scrollTo(0, document.body.scrollHeight);
        }

        let nomsStr = "";
        let gensStr = "";
        let imgsStr = "";

        // ToDO: Separate into three loops
        const optFullImgs = GM_getValue("options_fullImages", true);
        for(let i = 0, count = 0; i < tributeForms.length && count < hgReapingSize; i++) {
            if(tributeForms[i].getElementsByClassName(class_hgCheckbox)[0].checked === true) {
                // ToDO: Possibly change retrieval from getElementByWhatever to simple index accesses since we have a set order of elements
                nomsStr += tributeForms[i].getElementsByClassName(class_hgField)[0].value + "|";
                tributeForms[i].getElementsByClassName(class_hgGender)[0].checked === true ? gensStr += "1|" : gensStr += "0|";
                if(optFullImgs === true) {
                    imgsStr += tributeForms[i].parentElement.getElementsByClassName("fileThumb")[0].href + "|";
                } else {
                    imgsStr += tributeForms[i].parentElement.getElementsByTagName("img")[0].src + "|";
                }

                count++;
            }
        }

        GM_setValue("reapingSize", hgReapingSize);
        GM_setValue("nomsStr", nomsStr);
        GM_setValue("gensStr", gensStr);
        GM_setValue("imgsStr", imgsStr);

        console.log(new Date().getTime() - start);
    }

    //================================================================================================================//
    //== Keybind Functionalities =====================================================================================//
    //================================================================================================================//

    document.onkeydown = function(key) {
        key = key || window.event;

        switch(key.keyCode) {
            case 112:
            case 115:
                hgDraw();
                break;
            case 113:
                hgHide();
                break;
            case 119:
                hgSave();
                break;
            default:
                return;
        }

        window.event.preventDefault();
    };

    //================================================================================================================//
    //== Controls ====================================================================================================//
    //================================================================================================================//

    // Show tribute forms
    function hgShow() {
        const gens = document.getElementsByClassName(class_hgForm);
        for(let i = 0; i < gens.length; i++) {
            gens[i].hidden = false;
        }
    }

    // Hide tribute forms
    function hgHide() {
        const gens = document.getElementsByClassName(class_hgForm);
        for(let i = 0; i < gens.length; i++) {
            gens[i].hidden = true;
        }
    }

    // Deselect all selected tributes
    function hgDeselect() {
        if(document.getElementsByClassName(class_hgForm).length === 0) {
            hgDraw();
            hgHide();
            window.scrollTo(0, document.body.scrollHeight);
        }

        const imgs = document.getElementsByClassName(class_hgCheckbox);
        for(let i = 0; i < imgs.length; i++) {
            imgs[i].checked = false;
        }

        hgNumberTributes();
    }

    // Show or hide options panel
    function hgTogglePanel(panel) {
        const hgOptions_elementStyle = document.getElementsByClassName(panel)[0].style;
        hgOptions_elementStyle.display = hgOptions_elementStyle.display === "none" ? "block" : "none";
        window.scrollTo(0, document.body.scrollHeight);
    }

    // ToDO: Change functionality to hide all panels, and just stick it at the beginning of hgTogglePanel instead
    // Hide a given panel
    function hgHidePanel(panel) {
        document.getElementsByClassName(panel)[0].style.display = "none";
    }

    // ToDO: Create structure to store these relationships
    // Load saved values for options and set their checkboxes appropriately
    function hgLoadOptions() {
        document.getElementById("hgOptions-greyDead").checked = GM_getValue("options_greyDead", true);
        document.getElementById("hgOptions-skipEmpty").checked = GM_getValue("options_skipEmpty", true);
        document.getElementById("hgOptions-fullImages").checked = GM_getValue("options_fullImages", true);
        document.getElementById("hgOptions-rememberSize").checked = GM_getValue("options_rememberSize", true);
        document.getElementById("hgOptions-detectGender").checked = GM_getValue("options_detectGender", true);
        document.getElementById("hgOptions-unlimitLength").checked = GM_getValue("options_unlimitLength", true);
        document.getElementById("hgOptions-tributeCounter").checked = GM_getValue("options_tributeCounter", true);
    }

    //================================================================================================================//
    //== Element Creation Wrappers ===================================================================================//
    //================================================================================================================//

    function hgCreateElement_Div(className, style=null, innerHTML=null) {
        const hgElement_div = document.createElement("div");

        hgElement_div.className = className;
        if(style) hgElement_div.style = style; // ToDO: This is shit. Does style assignment append instead of overwrite? If so, we can lose the check.
        if(innerHTML) hgElement_div.innerHTML = innerHTML; // ToDO: So is this. Are the checks even necessary?

        return hgElement_div;
    }


    // ToDO: Do away with the Name field? We don't seem to be using it.
    function hgCreateElement_Select(id, name, title, onchange) {
        const hgElement_select = document.createElement("select");

        hgElement_select.id = id;
        hgElement_select.name = name;
        hgElement_select.title = title;
        hgElement_select.onchange = onchange;

        return hgElement_select;
    }

    function hgCreateElement_Option(id, value) {
        const hgElement_option = document.createElement("option");

        hgElement_option.id = id;
        hgElement_option.text = value;
        hgElement_option.value = value;

        return hgElement_option;
    }

    function hgCreateElement_Span(id, action, value) {
        const hgElement_span = document.createElement("span");

        hgElement_span.id = id;
        hgElement_span.innerHTML = action + ": " + value;

        return hgElement_span;
    }

    // ToDO: Create and use standard option saving
    function hgCreateElement_Checkbox(element_id, element_title, element_text, element_function) {
        // Checkbox element accompanied by following text element
        const hgElement_checkbox = document.createElement("input");
        hgElement_checkbox.type = "checkbox";
        hgElement_checkbox.id = element_id;
        hgElement_checkbox.title = element_title;
        hgElement_checkbox.style = "display:inline!important;";
        if(element_function) hgElement_checkbox.onchange = function() { element_function(); };

        // Text immediately following and describing aforementioned checkbox
        const hgElement_innerSpan = document.createElement("span");
        hgElement_innerSpan.innerHTML = element_text;
        hgElement_innerSpan.title = element_title;

        // Span in which the checkbox and its text are contained
        const hgElement_outerSpan = document.createElement("span");
        hgElement_outerSpan.appendChild(hgElement_checkbox);
        hgElement_outerSpan.appendChild(hgElement_innerSpan);

        return hgElement_outerSpan;
    }

    //================================================================================================================//
    //== Tributes known to be grills =================================================================================//
    //================================================================================================================//

    // ToDO: Put this in a fucking hash map or BST or something you neanderthal
    const grills = [
        "megumi", "megumin", "sakuya", "unlucky girl", "unfortunate girl", "guild girl", "queen boo", "madotsuki",
        "hedenia", "reimu", "dorothy haze", "lain", "rebecca", "marin", "alien queen", "frisk", "kaokuma", "sayori",
        "dog tier jade", "dragon cunt", "X-23", "haruhi", "mao mao"
    ];

    //================================================================================================================//
    //== Options and Settings Creation ===============================================================================//
    //================================================================================================================//

    // ToDO: Finish changing "hgOptions*" to appropriate names
    // ToDO: Finish abstracting into functions
    // ToDO: Option: Customize keybinds
    // ToDO: Option: Hide "Deselect All" button

    // Create button to open settings, div to contain settings, and the settings themselves
    const hgSettings_btn = hgCreateElement_Button("Settings", "Settings panel", function() { hgHidePanel("hgUpcoming-panel"); hgHidePanel("hgChangelog-panel"); hgTogglePanel("hgOptions-panel"); });
    const hgSettings_div = hgCreateElement_Div("hgOptions-panel", "display:none;");
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
            "hgOptions-greyDead",
            "On Fallen Tributes pages, display the fallen tributes' images in black and white",
            "Display images of eliminated tributes in black and white<br>",
            function() { GM_setValue("options_greyDead", document.getElementById("hgOptions-greyDead").checked); }
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
    hgSettings_div.appendChild( // ToDO: Make it to where we can execute without refreshing upon enabling
        hgCreateElement_Checkbox(
            "hgOptions-detectGender",
            "For example, if a player wishes to enter a female tribute they would type <i>Name (F)</i> or <i>Name (Female)</i>, where <i>Name</i> is the desired entry name of the tribute",
            "Scan tribute posts for gender specifiers and automatically select them<br>",
            function() { GM_setValue("options_detectGender", document.getElementById("hgOptions-detectGender").checked); }
        )
    );

    // ToDO: Can we instead pass to the function the element as we already have it above? Doubt it, but worth looking into.
    const hgUpcoming_btn = hgCreateElement_Button("Upcoming", "Upcoming features and changes", function() { hgHidePanel("hgOptions-panel"); hgHidePanel("hgChangelog-panel"); hgTogglePanel("hgUpcoming-panel"); });
    const hgUpcoming_div = hgCreateElement_Div("hgUpcoming-panel", "display:none;", "Upcoming features and changes:<br>&nbsp;- Customize keybinds<br>&nbsp;- Retain edited forms through page refreshes<br>&nbsp;- Reset forms to original<br>&nbsp;- Retain page position when drawing new forms<br>&nbsp;- Safely relax input validation to be equally permissive to the simulator's back end<br>&nbsp;- Additional code refactoring for the sake of maintainability and readability (not that you care)<br><br>For bugs/suggestions/questions/feedback, contact me on Discord: ZMNMXLNTR#6271<br>Alternatively, submit an issue to the <a href='https://github.com/zmnmxlntr/hg' target='_blank'>repository</a>.");

    // ToDO: Same note as above.
    const hgChangelog_btn = hgCreateElement_Button("Changelog", "A log of recent changes per version", function() { hgHidePanel("hgOptions-panel"); hgHidePanel("hgUpcoming-panel"); hgTogglePanel("hgChangelog-panel"); });
    const hgChangelog_div = hgCreateElement_Div("hgChangelog-panel", "display:none;", "3.3.0:<br>&nbsp;- Discovered the existence of event.preventDefault (friendly reminder that I am not a web developer), so now Chrome users can use the F1 key without opening a help page. Rejoice! For legacy reasons, F4 will continue to invoke Draw<br>&nbsp;- Fixed an issue where the Load button on the Reaping page wouldn't default to the correct location, and then removed the option entirely as the original location is nonsensical<br>&nbsp;- Moved a bunch of half-finished functionality to a dev branch to allow for an easier update release process (yes, it is indeed revolting that I didn't do this from the beginning)<br>&nbsp;- Further cleanup/restructuring to eventually make this project less of a pain to update<br>&nbsp;- This log!<br><br>As for what hasn't changed: I'm not dead, just transient. Your old pal Virginia will drop by soon&trade; to catch up.<br><br>P.S., I discovered that the script works on the mobile Firefox browser. I bet it works on the mobile Chrome browser too, but I haven't tried it myself. Neat!<br>P.P.S., As a reminder, you can specify your character's gender in your post, and it will be set automatically if the host is using the script! Just include (F) or (M) anywhere in your post.");

    // Control: "Select" type element for number of tributes to be saved
    const hgTributes_select = hgCreateElement_Select("hgTribsNo", "tributes", "Number of tributes", function() { hgNumberTributes(); GM_setValue("options_lastSize", document.getElementById("hgTribsNo").value); });
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t24", "24"));
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t36", "36"));
    hgTributes_select.appendChild(hgCreateElement_Option("hg-t48", "48"));
    if(GM_getValue("options_rememberSize", true)) hgTributes_select.value = GM_getValue("options_lastSize", 24);

    // Controls div that contains controls and the settings button
    const hgCtrls_div = hgCreateElement_Div("hungergames");
    hgCtrls_div.appendChild(hgCreateElement_Button("Draw", "Draw the entry forms", function() { hgDraw(); window.scrollTo(0, document.body.scrollHeight); }));
    hgCtrls_div.appendChild(hgCreateElement_Button("Hide", "Hide the entry forms", hgHide));
    hgCtrls_div.appendChild(hgCreateElement_Button("Save", "Save the entries", hgSave));
    hgCtrls_div.appendChild(hgCreateElement_Button("Deselect All", "Deselect all tribute entry form checkboxes", function() { if(confirm("Deselect all tribute entry checkboxes?")) hgDeselect(); }));
    hgCtrls_div.appendChild(hgTributes_select);
    hgCtrls_div.appendChild(hgCreateElement_Button("Reaping", "Open the reaping page on Brantsteele's website in a new tab", function() { window.open("https://brantsteele.net/hungergames/reaping.php"); }));
    hgCtrls_div.appendChild(hgSettings_btn);
    hgCtrls_div.appendChild(hgUpcoming_btn);
    hgCtrls_div.appendChild(hgChangelog_btn);
    hgCtrls_div.appendChild(hgSettings_div);
    hgCtrls_div.appendChild(hgUpcoming_div);
    hgCtrls_div.appendChild(hgChangelog_div);

    document.getElementsByTagName("body")[0].appendChild(hgCtrls_div);

    hgLoadOptions();
} else if(window.location.hostname === "brantsteele.net" || window.location.hostname === "www.brantsteele.net") {
    // Apparently we can use whatever fucking name we want, there is no back end validation
    unsafeWindow.validateForm = function() {
        return true;
    };

    function hgUnlimitLengths() {
        // ToDO: Instead of simply returning when option is false, reinstate maxLength attribute
        if(GM_getValue("options_unlimitLength", false) === true) return;

        const capacity = (document.getElementsByTagName("select").length - 2) / 3;
        const inputs = document.getElementsByTagName("input");

        // ToDO: Checking against capacity is probably redundant and unnecessary
        for(let i = 2, j = 0; i < inputs.length && j < capacity; i += 4, j++) {
            // ToDO: check to make sure doing removeAttribute on an attribute that's not there doesn't break shit
            inputs[i].removeAttribute("maxLength");
            inputs[i + 2].removeAttribute("maxLength");
        }
    }

    function hgLoad() {
        const hgReapingSize = GM_getValue("reapingSize", 24);
        const optGreyDead = GM_getValue("options_greyDead", true);

        const noms = GM_getValue("nomsStr").split('|');
        const gens = GM_getValue("gensStr").split('|');
        const imgs = GM_getValue("imgsStr").split('|');

        const capacity = (document.getElementsByTagName("select").length - 2) / 3;
        const genders = document.getElementsByTagName("select");
        const inputs = document.getElementsByTagName("input");

        let i, j;

        hgUnlimitLengths();

        // Populate all saved values into the reaping form
        for(i = 2, j = 0; i < inputs.length && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 4, j++) {
            // ToDO: Check to make sure doing removeAttribute on an attribute that's not there doesn't break shit
            // ToDO: Unlimit length immediately upon page load if option is set, rather than waiting for Load
            inputs[i + 2].value = inputs[i].value = noms[j];
            inputs[i + 3].value = inputs[i + 1].value = imgs[j];
        }
        // Blank any entry forms that do not yet have a corresponding saved value
        for(null; i < inputs.length && j < capacity; i += 4, j++) {
            inputs[i + 3].value = inputs[i + 2].value = inputs[i + 1].value = inputs[i].value = "";
        }

        // ToDO: Also check while i < genders.length? Seems to work fine without this check though, so remove similar check from previous loop?
        // Assign genders to all saved tributes
        for(i = 1, j = 0; i < hgReapingSize * 3 + 1 && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 3, j++) {
            genders[i].value = gens[j];
        }
        // Set gender to '?' for any positions that have not yet been filled
        for(null; i < genders.length && j < capacity; i += 3, j++) {
            genders[i].value = '?';
        }

        // Set dead tribute images to BW if enabled
        if(optGreyDead === true) {
            for(i = 2, j = 0; i < inputs.length && j < hgReapingSize && j < capacity && j < imgs.length - 1; i += 4, j++) {
                inputs[i + 3].value = "BW";
            }
        }

        // Set season name to default value if empty
        const seasonName = document.getElementsByName("seasonname")[0];
        if(seasonName.value === "" || !seasonName.value.match(/\S/) || seasonName.value.length < 1) {
            seasonName.value = hgDefaultSeasonName;
        }
        // Set logo URL to default value if empty
        const logoUrl = document.getElementsByName("logourl")[0];
        if(logoUrl.value === "" || !logoUrl.value.match(/\S/) || logoUrl.value.length < 1) {
            logoUrl.value = hgDefaultLogoUrl;
        }
    }

    hgUnlimitLengths();

    // Default values of Season Name and Logo URL fields
    const hgDefaultSeasonName = document.getElementsByName("seasonname")[0].value;
    const hgDefaultLogoUrl    = document.getElementsByName("logourl")[0].value;

    // Button to load tribute data into simulator
    document.getElementsByClassName("personalHG")[0].prepend(hgCreateElement_Button("Load", "Load them tributes", hgLoad, null, "position:absolute;"));
}

function hgCreateElement_Button(innerHTML, title, onclick, id=null, style=null) {
    const hgElement_btn           = document.createElement("button");

    hgElement_btn.type            = "button"; // ToDO: Necessary?
    hgElement_btn.title           = title;
    hgElement_btn.innerHTML       = innerHTML;
    hgElement_btn.onclick         = onclick;
    if(id) hgElement_btn.id       = id;
    if(style) hgElement_btn.style = style;

    return hgElement_btn;
}
