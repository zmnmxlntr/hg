// ==UserScript==
// @name        Virginia's Hunger Games Script
// @description Hunger Games hosting made easy
// @namespace   https://github.com/zmnmxlntr
// @author      Virginia
// @version     3.4.3
// @downloadURL https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @updateURL   https://github.com/zmnmxlntr/hg/raw/master/hg.user.js
// @iconURL     https://github.com/zmnmxlntr/hg/raw/master/icon.png
// @include     /^(https?://)?boards\.4chan(nel)?\.org/.*/(res|thread)/.*$/
// @include     /^(https?://)?(www\.)?brantsteele\.net/hungergames/(edit|personal)\.php$/
// @grant       GM_setValue
// @grant       GM_getValue
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
 - Make sure element is rendered/not deleted or hidden before selecting as tribute to avoid posts filtered by 4chan X aren't "invisibly" selected
 - Ask /b/, /trash/, Discords and whatever communities there might be if they'd be interested in having the script scrape tributes' names from filename if post is empty (tricky to safeguard against spam)
 - Allow users to create a local list of grills
*/

if(window.location.hostname === "boards.4chan.org" || window.location.hostname === "boards.4channel.org") {
    var hgReapingSize = 24;
    var hgEntriesDrawn = 0;

    // ToDO: Insufficiently descriptive to the point of sometimes being misleading; fix
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
                        optDetectGender === true && (female === true || nom.toLowerCase() in grills_dict) ? hgFemale_radio.checked = true : hgMale_radio.checked = true;

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
        const hgElement_label = document.createElement("label");
        hgElement_label.innerHTML = element_text;
        hgElement_label.title = element_title;
        hgElement_label.setAttribute("for", element_id); // ToDO: Remember what this was for

        // Span in which the checkbox and its text are contained
        const hgElement_outerSpan = document.createElement("span");
        hgElement_outerSpan.appendChild(hgElement_checkbox);
        hgElement_outerSpan.appendChild(hgElement_label);

        return hgElement_outerSpan;
    }

    //================================================================================================================//
    //== Tributes known to be grills =================================================================================//
    //================================================================================================================//

    const grills_dict = [], grills_array = [
        '2b', '6', 'a', 'alien queen', 'ami mizuno', 'anal avengers daughter', 'angelica', 'angry zelda', 'arcoic', 'awoo girl', 'bismarck', 'blitz the bun', 'bonby', 'bronya zaychik', 'buddy',
        'calcium', 'catra', 'charlotte', 'cherri', 'chiaki nanami', 'chinatsu', 'cindy', 'cute', 'devilica', 'devilman lady', 'dog tier jade', 'dog-tier jade', 'dorothy haze', 'dragon cunt', 'edra',
        'edra glamcock', 'elf', 'elvina', 'emmy', 'ena', 'exusiai', 'fat chick', 'frank girl', 'frankie', 'frankie foster', 'frisk', 'goblin', 'gravel', 'guild girl', 'gwen', 'harley quinn', 'haruhi',
        'hat kid', 'hatsune miku', 'hedenia', 'hestia', 'homeless girl', 'ida', 'ifrit', 'index', 'jennette mccurdy', 'jennette mccurdy ', 'jenny', 'kaokuma', 'kiana kaslana', 'kino', 'kizuna ai',
        'klee', 'kurohime', 'kuroko', 'la', 'lain', 'lammy', 'lavie', 'liz', 'lona', 'loone', 'mabel', 'madotsuki', 'mae', 'mae borrowski', 'maga girl', 'mao mao', 'marie antoinette', 'marin',
        'megumi', 'megumin', 'merry', 'miku', 'miranda cosgrove', 'motifa', 'nil sunna', 'nitori kawashiro', 'nobu', 'nutella girl', 'okku', 'platinum', 'princess zelda', 'psycho chan', 'psycho-chan',
        'queen boo', 'rap(e)', 'rape snake', 'rebecca', 'reimu', 'relm', 'sailor mercury', 'sakuya', 'samsung sam', 'sayori', 'scully', 'senko san', 'serena', 'six', 'skeleton', 'sophia', 'suzumi',
        'sword', 'teleporter', 'tsuyu', 'ty lee', 'unfortunate girl', 'unlucky girl', 'utharu', 'veruca salt', 'vex', 'warspite', 'wendy', 'x-23', 'zelda'
    ];
    for(let i = 0; i < grills_array.length; i++) {
        grills_dict[grills_array[i]] = '';
    }

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
    const hgUpcoming_div = hgCreateElement_Div("hgUpcoming-panel", "display:none;", "<br>Upcoming features and changes:<br>&nbsp;- Add support for Murder Games and the new version of Brantsteele's simulator<br>&nbsp;- Add locally modifiable list of autogrills<br>&nbsp;- Customize keybinds<br>&nbsp;- Retain edited forms through page refreshes<br>&nbsp;- Reset forms to original<br>&nbsp;- Retain page position when drawing new forms<br>&nbsp;- Safely relax input validation to be equally permissive to the simulator's back end<br>&nbsp;- Additional code refactoring for the sake of maintainability and readability (not that you care)<br><br>For bugs/suggestions/questions/feedback, contact me on Discord: ZMNMXLNTR#6271<br>Alternatively, submit an issue to the <a href='https://github.com/zmnmxlntr/hg' target='_blank'>repository</a>.");

    // ToDO: Same note as above.
    const hgChangelog_btn = hgCreateElement_Button("Changelog", "A log of recent changes per version", function() { hgHidePanel("hgOptions-panel"); hgHidePanel("hgUpcoming-panel"); hgTogglePanel("hgChangelog-panel"); });
    const hgChangelog_div = hgCreateElement_Div("hgChangelog-panel", "display:none;", "<br>3.4.0:<br>&nbsp;- You can now click an setting's text to toggle it.<br>3.3.6:<br>&nbsp;- Remembered I made a changelog.<br>&nbsp;- Made automatic gender checking infinitely more efficient.<br>3.3.0:<br>&nbsp;- Discovered the existence of event.preventDefault (friendly reminder that I am not a web developer), so now Chrome users can use the F1 key without opening a help page. Rejoice! For legacy reasons, F4 will continue to invoke Draw.<br>&nbsp;- Fixed an issue where the Load button on the Reaping page wouldn't default to the correct location, and then removed the option entirely as the original location is nonsensical.<br>&nbsp;- Moved a bunch of half-finished functionality to a dev branch to allow for an easier update release process (yes, it is indeed revolting that I didn't do this from the beginning).<br>&nbsp;- Further cleanup/restructuring to eventually make this project less of a pain to update.<br>&nbsp;- This log!<br><br>As for what hasn't changed: I'm not dead, just transient. I'm online approximately twice a year.<br><br>P.S., I discovered that the script works on the mobile Firefox browser. I bet it works on the mobile Chrome browser too, but I haven't tried it myself. Neat!<br>P.P.S., As a reminder, you can specify your character's gender in your post, and it will be set automatically if the host is using the script! Just include (F) or (M) anywhere in your post.");

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
