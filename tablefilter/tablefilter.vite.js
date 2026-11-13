(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.TableFilter = {}));
})(this, function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region libs/sortabletable.js?raw
	var sortabletable_default = "/*----------------------------------------------------------------------------\\\n|                            Sortable Table 1.12                              |\n|-----------------------------------------------------------------------------|\n|                         Created by Erik Arvidsson                           |\n|                  (http://webfx.eae.net/contact.html#erik)                   |\n|                      For WebFX (http://webfx.eae.net/)                      |\n|-----------------------------------------------------------------------------|\n| A DOM 1 based script that allows an ordinary HTML table to be sortable.     |\n|-----------------------------------------------------------------------------|\n|                  Copyright (c) 1998 - 2006 Erik Arvidsson                   |\n|-----------------------------------------------------------------------------|\n| Licensed under the Apache License, Version 2.0 (the \"License\"); you may not |\n| use this file except in compliance with the License.  You may obtain a copy |\n| of the License at http://www.apache.org/licenses/LICENSE-2.0                |\n| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |\n| Unless  required  by  applicable law or  agreed  to  in  writing,  software |\n| distributed under the License is distributed on an  \"AS IS\" BASIS,  WITHOUT |\n| WARRANTIES OR  CONDITIONS OF ANY KIND,  either express or implied.  See the |\n| License  for the  specific language  governing permissions  and limitations |\n| under the License.                                                          |\n|-----------------------------------------------------------------------------|\n| 2003-01-10 | First version                                                  |\n| 2003-01-19 | Minor changes to the date parsing                              |\n| 2003-01-28 | JScript 5.0 fixes (no support for 'in' operator)               |\n| 2003-02-01 | Sloppy typo like error fixed in getInnerText                   |\n| 2003-07-04 | Added workaround for IE cellIndex bug.                         |\n| 2003-11-09 | The bDescending argument to sort was not correctly working     |\n|            | Using onclick DOM0 event if no support for addEventListener    |\n|            | or attachEvent                                                 |\n| 2004-01-13 | Adding addSortType and removeSortType which makes it a lot     |\n|            | easier to add new, custom sort types.                          |\n| 2004-01-27 | Switch to use descending = false as the default sort order.    |\n|            | Change defaultDescending to suit your needs.                   |\n| 2004-03-14 | Improved sort type None look and feel a bit                    |\n| 2004-08-26 | Made the handling of tBody and tHead more flexible. Now you    |\n|            | can use another tHead or no tHead, and you can chose some      |\n|            | other tBody.                                                   |\n| 2006-04-25 | Changed license to Apache Software License 2.0                 |\n|-----------------------------------------------------------------------------|\n| Created 2003-01-10 | All changes are in the log above. | Updated 2006-04-25 |\n\\----------------------------------------------------------------------------*/\n\n\nfunction SortableTable(oTable, oSortTypes) {\n\n	this.sortTypes = oSortTypes || [];\n\n	this.sortColumn = null;\n	this.descending = null;\n\n	var oThis = this;\n	this._headerOnclick = function (e) {\n		oThis.headerOnclick(e);\n	};\n\n	if (oTable) {\n		this.setTable( oTable );\n		this.document = oTable.ownerDocument || oTable.document;\n	}\n	else {\n		this.document = document;\n	}\n\n\n	// only IE needs this\n	var win = this.document.defaultView || this.document.parentWindow;\n	this._onunload = function () {\n		oThis.destroy();\n	};\n	if (win && typeof win.attachEvent != \"undefined\") {\n		win.attachEvent(\"onunload\", this._onunload);\n	}\n}\n\nSortableTable.gecko = navigator.product == \"Gecko\";\nSortableTable.msie = /msie/i.test(navigator.userAgent);\n// Mozilla is faster when doing the DOM manipulations on\n// an orphaned element. MSIE is not\nSortableTable.removeBeforeSort = SortableTable.gecko;\n\nSortableTable.prototype.onsort = function () {};\n\n// default sort order. true -> descending, false -> ascending\nSortableTable.prototype.defaultDescending = false;\n\n// shared between all instances. This is intentional to allow external files\n// to modify the prototype\nSortableTable.prototype._sortTypeInfo = {};\n\nSortableTable.prototype.setTable = function (oTable) {\n	if ( this.tHead )\n		this.uninitHeader();\n	this.element = oTable;\n	this.setTHead( oTable.tHead );\n	this.setTBody( oTable.tBodies[0] );\n};\n\nSortableTable.prototype.setTHead = function (oTHead) {\n	if (this.tHead && this.tHead != oTHead )\n		this.uninitHeader();\n	this.tHead = oTHead;\n	this.initHeader( this.sortTypes );\n};\n\nSortableTable.prototype.setTBody = function (oTBody) {\n	this.tBody = oTBody;\n};\n\nSortableTable.prototype.setSortTypes = function ( oSortTypes ) {\n	if ( this.tHead )\n		this.uninitHeader();\n	this.sortTypes = oSortTypes || [];\n	if ( this.tHead )\n		this.initHeader( this.sortTypes );\n};\n\n// adds arrow containers and events\n// also binds sort type to the header cells so that reordering columns does\n// not break the sort types\nSortableTable.prototype.initHeader = function (oSortTypes) {\n	if (!this.tHead) return;\n	var cells = this.tHead.rows[0].cells;\n	var doc = this.tHead.ownerDocument || this.tHead.document;\n	this.sortTypes = oSortTypes || [];\n	var l = cells.length;\n	var img, c;\n	for (var i = 0; i < l; i++) {\n		c = cells[i];\n		if (this.sortTypes[i] != null && this.sortTypes[i] != \"None\") {\n			img = doc.createElement(\"IMG\");\n			img.src = \"images/blank.png\";\n			c.appendChild(img);\n			if (this.sortTypes[i] != null)\n				c._sortType = this.sortTypes[i];\n			if (typeof c.addEventListener != \"undefined\")\n				c.addEventListener(\"click\", this._headerOnclick, false);\n			else if (typeof c.attachEvent != \"undefined\")\n				c.attachEvent(\"onclick\", this._headerOnclick);\n			else\n				c.onclick = this._headerOnclick;\n		}\n		else\n		{\n			c.setAttribute( \"_sortType\", oSortTypes[i] );\n			c._sortType = \"None\";\n		}\n	}\n	this.updateHeaderArrows();\n};\n\n// remove arrows and events\nSortableTable.prototype.uninitHeader = function () {\n	if (!this.tHead) return;\n	var cells = this.tHead.rows[0].cells;\n	var l = cells.length;\n	var c;\n	for (var i = 0; i < l; i++) {\n		c = cells[i];\n		if (c._sortType != null && c._sortType != \"None\") {\n			c.removeChild(c.lastChild);\n			if (typeof c.removeEventListener != \"undefined\")\n				c.removeEventListener(\"click\", this._headerOnclick, false);\n			else if (typeof c.detachEvent != \"undefined\")\n				c.detachEvent(\"onclick\", this._headerOnclick);\n			c._sortType = null;\n			c.removeAttribute( \"_sortType\" );\n		}\n	}\n};\n\nSortableTable.prototype.updateHeaderArrows = function () {\n	if (!this.tHead) return;\n	var cells = this.tHead.rows[0].cells;\n	var l = cells.length;\n	var img;\n	for (var i = 0; i < l; i++) {\n		if (cells[i]._sortType != null && cells[i]._sortType != \"None\") {\n			img = cells[i].lastChild;\n			if (i == this.sortColumn)\n				img.className = \"sort-arrow \" + (this.descending ? \"descending\" : \"ascending\");\n			else\n				img.className = \"sort-arrow\";\n		}\n	}\n};\n\nSortableTable.prototype.headerOnclick = function (e) {\n	// find TD element\n	var el = e.target || e.srcElement;\n	while (el.tagName != \"TD\")\n		el = el.parentNode;\n\n	this.sort(SortableTable.msie ? SortableTable.getCellIndex(el) : el.cellIndex);\n};\n\n// IE returns wrong cellIndex when columns are hidden\nSortableTable.getCellIndex = function (oTd) {\n	var cells = oTd.parentNode.childNodes\n	var l = cells.length;\n	var i;\n	for (i = 0; cells[i] != oTd && i < l; i++)\n		;\n	return i;\n};\n\nSortableTable.prototype.getSortType = function (nColumn) {\n	return this.sortTypes[nColumn] || \"String\";\n};\n\n// only nColumn is required\n// if bDescending is left out the old value is taken into account\n// if sSortType is left out the sort type is found from the sortTypes array\n\nSortableTable.prototype.sort = function (nColumn, bDescending, sSortType) {\n	if (!this.tBody) return;\n	if (sSortType == null)\n		sSortType = this.getSortType(nColumn);\n\n	// exit if None\n	if (sSortType == \"None\")\n		return;\n\n	if (bDescending == null) {\n		if (this.sortColumn != nColumn)\n			this.descending = this.defaultDescending;\n		else\n			this.descending = !this.descending;\n	}\n	else\n		this.descending = bDescending;\n\n	this.sortColumn = nColumn;\n\n	if (typeof this.onbeforesort == \"function\")\n		this.onbeforesort();\n\n	var f = this.getSortFunction(sSortType, nColumn);\n	var a = this.getCache(sSortType, nColumn);\n	var tBody = this.tBody;\n\n	a.sort(f);\n\n	if (this.descending)\n		a.reverse();\n\n	if (SortableTable.removeBeforeSort) {\n		// remove from doc\n		var nextSibling = tBody.nextSibling;\n		var p = tBody.parentNode;\n		p.removeChild(tBody);\n	}\n\n	// insert in the new order\n	var l = a.length;\n	for (var i = 0; i < l; i++)\n		tBody.appendChild(a[i].element);\n\n	if (SortableTable.removeBeforeSort) {\n		// insert into doc\n		p.insertBefore(tBody, nextSibling);\n	}\n\n	this.updateHeaderArrows();\n\n	this.destroyCache(a);\n\n	if (typeof this.onsort == \"function\")\n		this.onsort();\n};\n\nSortableTable.prototype.asyncSort = function (nColumn, bDescending, sSortType) {\n	var oThis = this;\n	this._asyncsort = function () {\n		oThis.sort(nColumn, bDescending, sSortType);\n	};\n	window.setTimeout(this._asyncsort, 1);\n};\n\nSortableTable.prototype.getCache = function (sType, nColumn) {\n	if (!this.tBody) return [];\n	var rows = this.tBody.rows;\n	var l = rows.length;\n	var a = new Array(l);\n	var r;\n	for (var i = 0; i < l; i++) {\n		r = rows[i];\n		a[i] = {\n			value:		this.getRowValue(r, sType, nColumn),\n			element:	r\n		};\n	};\n	return a;\n};\n\nSortableTable.prototype.destroyCache = function (oArray) {\n	var l = oArray.length;\n	for (var i = 0; i < l; i++) {\n		oArray[i].value = null;\n		oArray[i].element = null;\n		oArray[i] = null;\n	}\n};\n\nSortableTable.prototype.getRowValue = function (oRow, sType, nColumn) {\n	// if we have defined a custom getRowValue use that\n	if (this._sortTypeInfo[sType] && this._sortTypeInfo[sType].getRowValue)\n		return this._sortTypeInfo[sType].getRowValue(oRow, nColumn);\n\n	var s;\n	var c = oRow.cells[nColumn];\n	if (typeof c.innerText != \"undefined\")\n		s = c.innerText;\n	else\n		s = SortableTable.getInnerText(c);\n	return this.getValueFromString(s, sType);\n};\n\nSortableTable.getInnerText = function (oNode) {\n	var s = \"\";\n	var cs = oNode.childNodes;\n	var l = cs.length;\n	for (var i = 0; i < l; i++) {\n		switch (cs[i].nodeType) {\n			case 1: //ELEMENT_NODE\n				s += SortableTable.getInnerText(cs[i]);\n				break;\n			case 3:	//TEXT_NODE\n				s += cs[i].nodeValue;\n				break;\n		}\n	}\n	return s;\n};\n\nSortableTable.prototype.getValueFromString = function (sText, sType) {\n	if (this._sortTypeInfo[sType])\n		return this._sortTypeInfo[sType].getValueFromString( sText );\n	return sText;\n	/*\n	switch (sType) {\n		case \"Number\":\n			return Number(sText);\n		case \"CaseInsensitiveString\":\n			return sText.toUpperCase();\n		case \"Date\":\n			var parts = sText.split(\"-\");\n			var d = new Date(0);\n			d.setFullYear(parts[0]);\n			d.setDate(parts[2]);\n			d.setMonth(parts[1] - 1);\n			return d.valueOf();\n	}\n	return sText;\n	*/\n	};\n\nSortableTable.prototype.getSortFunction = function (sType, nColumn) {\n	if (this._sortTypeInfo[sType])\n		return this._sortTypeInfo[sType].compare;\n	return SortableTable.basicCompare;\n};\n\nSortableTable.prototype.destroy = function () {\n	this.uninitHeader();\n	var win = this.document.parentWindow;\n	if (win && typeof win.detachEvent != \"undefined\") {	// only IE needs this\n		win.detachEvent(\"onunload\", this._onunload);\n	}\n	this._onunload = null;\n	this.element = null;\n	this.tHead = null;\n	this.tBody = null;\n	this.document = null;\n	this._headerOnclick = null;\n	this.sortTypes = null;\n	this._asyncsort = null;\n	this.onsort = null;\n};\n\n// Adds a sort type to all instance of SortableTable\n// sType : String - the identifier of the sort type\n// fGetValueFromString : function ( s : string ) : T - A function that takes a\n//    string and casts it to a desired format. If left out the string is just\n//    returned\n// fCompareFunction : function ( n1 : T, n2 : T ) : Number - A normal JS sort\n//    compare function. Takes two values and compares them. If left out less than,\n//    <, compare is used\n// fGetRowValue : function( oRow : HTMLTRElement, nColumn : int ) : T - A function\n//    that takes the row and the column index and returns the value used to compare.\n//    If left out then the innerText is first taken for the cell and then the\n//    fGetValueFromString is used to convert that string the desired value and type\n\nSortableTable.prototype.addSortType = function (sType, fGetValueFromString, fCompareFunction, fGetRowValue) {\n	this._sortTypeInfo[sType] = {\n		type:				sType,\n		getValueFromString:	fGetValueFromString || SortableTable.idFunction,\n		compare:			fCompareFunction || SortableTable.basicCompare,\n		getRowValue:		fGetRowValue\n	};\n};\n\n// this removes the sort type from all instances of SortableTable\nSortableTable.prototype.removeSortType = function (sType) {\n	delete this._sortTypeInfo[sType];\n};\n\nSortableTable.basicCompare = function compare(n1, n2) {\n	if (n1.value < n2.value)\n		return -1;\n	if (n2.value < n1.value)\n		return 1;\n	return 0;\n};\n\nSortableTable.idFunction = function (x) {\n	return x;\n};\n\nSortableTable.toUpperCase = function (s) {\n	return s.toUpperCase();\n};\n\nSortableTable.toDate = function (s) {\n	var parts = s.split(\"-\");\n	var d = new Date(0);\n	d.setFullYear(parts[0]);\n	d.setDate(parts[2]);\n	d.setMonth(parts[1] - 1);\n	return d.valueOf();\n};\n\n\n// add sort types\nSortableTable.prototype.addSortType(\"Number\", Number);\nSortableTable.prototype.addSortType(\"CaseInsensitiveString\", SortableTable.toUpperCase);\nSortableTable.prototype.addSortType(\"Date\", SortableTable.toDate);\nSortableTable.prototype.addSortType(\"String\");\n// None is a special case\n";
	//#endregion
	//#region src/string.js
	var import_diacritics = (/* @__PURE__ */ __commonJSMin(((exports) => {
		exports.remove = removeDiacritics;
		var replacementList = [
			{
				base: " ",
				chars: "\xA0"
			},
			{
				base: "0",
				chars: "߀"
			},
			{
				base: "A",
				chars: "ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
			},
			{
				base: "AA",
				chars: "Ꜳ"
			},
			{
				base: "AE",
				chars: "ÆǼǢ"
			},
			{
				base: "AO",
				chars: "Ꜵ"
			},
			{
				base: "AU",
				chars: "Ꜷ"
			},
			{
				base: "AV",
				chars: "ꜸꜺ"
			},
			{
				base: "AY",
				chars: "Ꜽ"
			},
			{
				base: "B",
				chars: "ⒷＢḂḄḆɃƁ"
			},
			{
				base: "C",
				chars: "ⒸＣꜾḈĆCĈĊČÇƇȻ"
			},
			{
				base: "D",
				chars: "ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ"
			},
			{
				base: "Dh",
				chars: "Ð"
			},
			{
				base: "DZ",
				chars: "ǱǄ"
			},
			{
				base: "Dz",
				chars: "ǲǅ"
			},
			{
				base: "E",
				chars: "ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ"
			},
			{
				base: "F",
				chars: "ꝼⒻＦḞƑꝻ"
			},
			{
				base: "G",
				chars: "ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ"
			},
			{
				base: "H",
				chars: "ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
			},
			{
				base: "I",
				chars: "ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
			},
			{
				base: "J",
				chars: "ⒿＪĴɈȷ"
			},
			{
				base: "K",
				chars: "ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
			},
			{
				base: "L",
				chars: "ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
			},
			{
				base: "LJ",
				chars: "Ǉ"
			},
			{
				base: "Lj",
				chars: "ǈ"
			},
			{
				base: "M",
				chars: "ⓂＭḾṀṂⱮƜϻ"
			},
			{
				base: "N",
				chars: "ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ"
			},
			{
				base: "NJ",
				chars: "Ǌ"
			},
			{
				base: "Nj",
				chars: "ǋ"
			},
			{
				base: "O",
				chars: "ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
			},
			{
				base: "OE",
				chars: "Œ"
			},
			{
				base: "OI",
				chars: "Ƣ"
			},
			{
				base: "OO",
				chars: "Ꝏ"
			},
			{
				base: "OU",
				chars: "Ȣ"
			},
			{
				base: "P",
				chars: "ⓅＰṔṖƤⱣꝐꝒꝔ"
			},
			{
				base: "Q",
				chars: "ⓆＱꝖꝘɊ"
			},
			{
				base: "R",
				chars: "ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
			},
			{
				base: "S",
				chars: "ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
			},
			{
				base: "T",
				chars: "ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
			},
			{
				base: "Th",
				chars: "Þ"
			},
			{
				base: "TZ",
				chars: "Ꜩ"
			},
			{
				base: "U",
				chars: "ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
			},
			{
				base: "V",
				chars: "ⓋＶṼṾƲꝞɅ"
			},
			{
				base: "VY",
				chars: "Ꝡ"
			},
			{
				base: "W",
				chars: "ⓌＷẀẂŴẆẄẈⱲ"
			},
			{
				base: "X",
				chars: "ⓍＸẊẌ"
			},
			{
				base: "Y",
				chars: "ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
			},
			{
				base: "Z",
				chars: "ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
			},
			{
				base: "a",
				chars: "ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"
			},
			{
				base: "aa",
				chars: "ꜳ"
			},
			{
				base: "ae",
				chars: "æǽǣ"
			},
			{
				base: "ao",
				chars: "ꜵ"
			},
			{
				base: "au",
				chars: "ꜷ"
			},
			{
				base: "av",
				chars: "ꜹꜻ"
			},
			{
				base: "ay",
				chars: "ꜽ"
			},
			{
				base: "b",
				chars: "ⓑｂḃḅḇƀƃɓƂ"
			},
			{
				base: "c",
				chars: "ｃⓒćĉċčçḉƈȼꜿↄ"
			},
			{
				base: "d",
				chars: "ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ"
			},
			{
				base: "dh",
				chars: "ð"
			},
			{
				base: "dz",
				chars: "ǳǆ"
			},
			{
				base: "e",
				chars: "ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ"
			},
			{
				base: "f",
				chars: "ⓕｆḟƒ"
			},
			{
				base: "ff",
				chars: "ﬀ"
			},
			{
				base: "fi",
				chars: "ﬁ"
			},
			{
				base: "fl",
				chars: "ﬂ"
			},
			{
				base: "ffi",
				chars: "ﬃ"
			},
			{
				base: "ffl",
				chars: "ﬄ"
			},
			{
				base: "g",
				chars: "ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ"
			},
			{
				base: "h",
				chars: "ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
			},
			{
				base: "hv",
				chars: "ƕ"
			},
			{
				base: "i",
				chars: "ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
			},
			{
				base: "j",
				chars: "ⓙｊĵǰɉ"
			},
			{
				base: "k",
				chars: "ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
			},
			{
				base: "l",
				chars: "ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ"
			},
			{
				base: "lj",
				chars: "ǉ"
			},
			{
				base: "m",
				chars: "ⓜｍḿṁṃɱɯ"
			},
			{
				base: "n",
				chars: "ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"
			},
			{
				base: "nj",
				chars: "ǌ"
			},
			{
				base: "o",
				chars: "ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ"
			},
			{
				base: "oe",
				chars: "œ"
			},
			{
				base: "oi",
				chars: "ƣ"
			},
			{
				base: "oo",
				chars: "ꝏ"
			},
			{
				base: "ou",
				chars: "ȣ"
			},
			{
				base: "p",
				chars: "ⓟｐṕṗƥᵽꝑꝓꝕρ"
			},
			{
				base: "q",
				chars: "ⓠｑɋꝗꝙ"
			},
			{
				base: "r",
				chars: "ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
			},
			{
				base: "s",
				chars: "ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ"
			},
			{
				base: "ss",
				chars: "ß"
			},
			{
				base: "t",
				chars: "ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
			},
			{
				base: "th",
				chars: "þ"
			},
			{
				base: "tz",
				chars: "ꜩ"
			},
			{
				base: "u",
				chars: "ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
			},
			{
				base: "v",
				chars: "ⓥｖṽṿʋꝟʌ"
			},
			{
				base: "vy",
				chars: "ꝡ"
			},
			{
				base: "w",
				chars: "ⓦｗẁẃŵẇẅẘẉⱳ"
			},
			{
				base: "x",
				chars: "ⓧｘẋẍ"
			},
			{
				base: "y",
				chars: "ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
			},
			{
				base: "z",
				chars: "ⓩｚźẑżžẓẕƶȥɀⱬꝣ"
			}
		];
		var diacriticsMap = {};
		for (var i = 0; i < replacementList.length; i += 1) {
			var chars = replacementList[i].chars;
			for (var j = 0; j < chars.length; j += 1) diacriticsMap[chars[j]] = replacementList[i].base;
		}
		function removeDiacritics(str) {
			return str.replace(/[^\u0000-\u007e]/g, function(c) {
				return diacriticsMap[c] || c;
			});
		}
	})))();
	/**
	* String utilities
	*/
	/**
	* Removes whitespace from both sides of passed string
	* @param  {String} text
	* @return {String}
	*/
	var trim = (text) => {
		if (text.trim) return text.trim();
		return text.replace(/^\s*|\s*$/g, "");
	};
	/**
	* Checks if passed string is empty
	* @param {String} text
	* @return {Boolean}
	*/
	var isEmpty$1 = (text) => trim(text) === "";
	/**
	* Makes regex safe string by escaping special characters from passed string
	* @param {String} text
	* @return {String} escaped string
	*/
	var rgxEsc = (text) => {
		return String(text).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	};
	/**
	* Returns passed string as lowercase if caseSensitive flag set false. By
	* default it returns the string with no casing changes.
	* @param {String} text
	* @return {String} string
	*/
	var matchCase = (text, caseSensitive = false) => {
		if (!caseSensitive) return text.toLowerCase();
		return text;
	};
	/**
	* Checks if passed data contains the searched term
	* @param  {String} term                Searched term
	* @param  {String} data                Data string
	* @param  {Boolean} exactMatch         Exact match
	* @param  {Boolean} caseSensitive      Case sensitive
	* @param  {Boolean} ignoreDiacritics   Ignore diacritics
	* @return {Boolean}
	*/
	var contains = (term, data, exactMatch = false, caseSensitive = false, ignoreDiacritics = false) => {
		let regexp;
		let modifier = caseSensitive ? "g" : "gi";
		if (ignoreDiacritics) {
			term = (0, import_diacritics.remove)(term);
			data = (0, import_diacritics.remove)(data);
		}
		if (exactMatch) regexp = new RegExp("(^\\s*)" + rgxEsc(term) + "(\\s*$)", modifier);
		else regexp = new RegExp(rgxEsc(term), modifier);
		return regexp.test(data);
	};
	/**
	* Camelize a string, cutting the string by multiple separators like
	* hyphens, underscores and spaces.
	* @param  {String} text text to camelize
	* @return {String}      camelized text
	*/
	var toCamelCase = (text = "") => {
		return text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
			if (p2) return p2.toUpperCase();
			return p1.toLowerCase();
		});
	};
	/**
	* Generate a string in the format of a UUID (Universally Unique IDentifier).
	* NOTE: This format of 8 chars, followed by 3 groups of 4 chars, followed by 12
	* chars is known as a UUID and is defined in RFC4122 and is a standard for
	* generating unique IDs. This function DOES NOT implement this standard.
	* It simply outputs a string that looks similar. The standard is found here:
	* https://www.ietf.org/rfc/rfc4122.txt
	* source: https://gist.github.com/gordonbrander/2230317
	* @return {String}
	*/
	var uuid = () => {
		const chr4 = () => Math.random().toString(16).slice(-4);
		return chr4() + chr4() + "-" + chr4() + "-" + chr4() + "-" + chr4() + "-" + chr4() + chr4() + chr4();
	};
	//#endregion
	//#region src/feature.js
	var NOT_IMPLEMENTED = "Not implemented.";
	/**
	* Base class defining the interface of a TableFilter feature
	*/
	var Feature = class {
		/**
		* Creates an instance of Feature
		* @param {Object} tf TableFilter instance
		* @param {Class} feature Feature class for TableFilter registration
		*/
		constructor(tf, cls) {
			cls.meta = cls.meta || {};
			/**
			* TableFilter instance
			* @type {TableFilter}
			*/
			this.tf = tf;
			/**
			* Feature name is the camelised class name as per TableFilter's
			* convention
			* @type {String}
			*/
			this.feature = cls.meta.altName || cls.meta.name || toCamelCase(cls.name);
			/**
			* TableFilter feature setting
			* @type {Boolean}
			*/
			this.enabled = tf[this.feature];
			/**
			* TableFilter configuration
			* @type {Object}
			*/
			this.config = tf.config();
			/**
			* TableFilter emitter instance
			* @type {Emitter}
			*/
			this.emitter = tf.emitter;
			/**
			* Field indicating whether Feature is initialized
			* @type {Boolean}
			*/
			this.initialized = false;
			/** Subscribe to destroy event */
			this.emitter.on(["destroy"], () => this.destroy());
		}
		/**
		* Initialize the feature
		*/
		init() {
			throw new Error(NOT_IMPLEMENTED);
		}
		/**
		* Reset the feature after being disabled
		*/
		reset() {
			this.enable();
			this.init();
		}
		/**
		* Destroy the feature
		*/
		destroy() {
			throw new Error(NOT_IMPLEMENTED);
		}
		/**
		* Enable the feature
		*/
		enable() {
			this.enabled = true;
		}
		/**
		* Disable the feature
		*/
		disable() {
			this.enabled = false;
		}
		/**
		* Indicate whether the feature is enabled or not
		* @returns {Boolean}
		*/
		isEnabled() {
			return this.enabled === true;
		}
	};
	//#endregion
	//#region src/types.js
	/**
	* Types utilities
	*/
	var UNDEFINED = void 0;
	/**
	* Return an empty function
	* @return {Function}
	*/
	var EMPTY_FN = function() {};
	/**
	* Check passed argument is an object
	* @param  {Object}  obj
	* @return {Boolean}
	*/
	var isObj = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
	/**
	* Check passed argument is a function
	* @param  {Function} obj
	* @return {Boolean}
	*/
	var isFn = (obj) => Object.prototype.toString.call(obj) === "[object Function]";
	/**
	* Check passed argument is an array
	* @param  {Array}  obj
	* @return {Boolean}
	*/
	var isArray = (obj) => Object.prototype.toString.call(obj) === "[object Array]";
	/**
	* Check passed argument is a string
	* @param {String} obj obj
	* @returns {Boolean}
	*/
	var isString = (obj) => Object.prototype.toString.call(obj) === "[object String]";
	/**
	* Check passed argument is a number
	* @param {Number} obj
	* @returns {Boolean}
	*/
	var isNumber = (obj) => Object.prototype.toString.call(obj) === "[object Number]";
	/**
	* Check passed argument is a boolean
	* @param {Boolean} obj
	* @returns {Boolean}
	*/
	var isBoolean = (obj) => Object.prototype.toString.call(obj) === "[object Boolean]";
	/**
	* Check passed argument is undefined
	* @param  {Any}  obj
	* @return {Boolean}
	*/
	var isUndef = (obj) => obj === UNDEFINED;
	/**
	* Check passed argument is null
	* @param  {Any}  obj
	* @return {Boolean}
	*/
	var isNull = (obj) => obj === null;
	/**
	* Check passed argument is empty (undefined, null or empty string)
	* @param  {Any}  obj
	* @return {Boolean}
	*/
	var isEmpty = (obj) => isUndef(obj) || isNull(obj) || obj.length === 0;
	//#endregion
	//#region src/root.js
	/**
	* Export window or global object depending on the environment
	*/
	var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global || void 0;
	//#endregion
	//#region src/dom.js
	/**
	* DOM utilities
	*/
	var doc$2 = root.document;
	/**
	* Returns text + text of children of given node
	* @param  {NodeElement} node
	* @return {String}
	*/
	var getText = (node) => {
		if (isUndef(node.textContent)) return trim(node.innerText);
		return trim(node.textContent);
	};
	/**
	* Returns the first text node contained in the supplied node
	* @param  {NodeElement} node node
	* @return {String}
	*/
	var getFirstTextNode = (node) => {
		for (let i = 0; i < node.childNodes.length; i++) {
			let n = node.childNodes[i];
			if (n.nodeType === 3) return n.data;
		}
	};
	/**
	* Creates an html element with given collection of attributes
	* @param  {String} tag html tag name
	* @param  {Array} an undetermined number of arrays containing the with 2
	*                    items, the attribute name and its value ['id','myId']
	* @return {Object}     created element
	*/
	var createElm = (...args) => {
		let tag = args[0];
		if (!isString(tag)) return null;
		let el = doc$2.createElement(tag);
		for (let i = 0; i < args.length; i++) {
			let arg = args[i];
			if (isArray(arg) && arg.length === 2) el.setAttribute(arg[0], arg[1]);
		}
		return el;
	};
	/**
	* Removes passed node from DOM
	* @param  {DOMElement} node
	* @return {DOMElement} old node reference
	*/
	var removeElm = (node) => node.parentNode.removeChild(node);
	/**
	* Returns a text node with given text
	* @param  {String} txt
	* @return {Object}
	*/
	var createText = (txt) => doc$2.createTextNode(txt);
	/**
	* Determine whether the passed elements is assigned the given class
	* @param {DOMElement} ele DOM element
	* @param {String} cls CSS class name
	* @returns {Boolean}
	*/
	var hasClass = (ele, cls) => {
		if (isUndef(ele)) return false;
		if (supportsClassList()) return ele.classList.contains(cls);
		return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
	};
	/**
	* Adds the specified class to the passed element
	* @param {DOMElement} ele DOM element
	* @param {String} cls CSS class name
	*/
	var addClass = (ele, cls) => {
		if (isUndef(ele)) return;
		if (supportsClassList()) {
			ele.classList.add(cls);
			return;
		}
		if (ele.className === "") ele.className = cls;
		else if (!hasClass(ele, cls)) ele.className += " " + cls;
	};
	/**
	* Removes the specified class to the passed element
	* @param {DOMElement} ele DOM element
	* @param {String} cls CSS class name
	*/
	var removeClass = (ele, cls) => {
		if (isUndef(ele)) return;
		if (supportsClassList()) {
			ele.classList.remove(cls);
			return;
		}
		let reg = new RegExp("(\\s|^)" + cls + "(\\s|$)", "g");
		ele.className = ele.className.replace(reg, "");
	};
	/**
	* Creates and returns an option element
	* @param  {String}  text  option text
	* @param  {String}  value option value
	* @param  {Boolean} isSel whether option is selected
	* @return {Object}        option element
	*/
	var createOpt = (text, value, isSel) => {
		let opt = (isSel ? true : false) ? createElm("option", ["value", value], ["selected", "true"]) : createElm("option", ["value", value]);
		opt.appendChild(createText(text));
		return opt;
	};
	/**
	* Creates and returns a checklist item
	* @param  {String} id  index of check item
	* @param  {String} chkValue  check item value
	* @param  {String} labelText check item label text
	* @param  {Array} extraAttr  array containing attribute name and its value
	* @return {Object}           li DOM element
	*/
	var createCheckItem = (id, chkValue, labelText, extraAttr = []) => {
		let li = createElm("li");
		let label = createElm("label", ["for", id]);
		let check = createElm("input", ["id", id], ["name", id], ["type", "checkbox"], ["value", chkValue], extraAttr);
		label.appendChild(check);
		label.appendChild(createText(labelText));
		li.appendChild(label);
		li.label = label;
		li.check = check;
		return li;
	};
	/**
	* Returns the element matching the supplied Id
	* @param  {String} id  Element identifier
	* @return {DOMElement}
	*/
	var elm = (id) => doc$2.getElementById(id);
	/**
	* Returns list of element matching the supplied tag name
	* @param  {String} tagname  Tag name
	* @return {NodeList}
	*/
	var tag = (o, tagname) => o.getElementsByTagName(tagname);
	function supportsClassList() {
		return doc$2.documentElement.classList;
	}
	//#endregion
	//#region src/event.js
	/**
	* DOM event utilities
	*/
	/**
	* Add event handler for specified event on passed element
	*
	* @param {DOMElement} obj Element
	* @param {String} type Event type
	* @param {Function} Handler
	* @param {Boolean} capture Specifiy whether the event should be executed in
	* the capturing or in the bubbling phase
	*/
	var addEvt = (obj, type, func, capture) => {
		if (obj.addEventListener) obj.addEventListener(type, func, capture);
		else if (obj.attachEvent) obj.attachEvent("on" + type, func);
		else obj["on" + type] = func;
	};
	/**
	* Remove event handler for specified event on passed element
	*
	* @param {DOMElement} obj Element
	* @param {String} type Event type
	* @param {Function} Handler
	* @param {Boolean} capture Specifiy whether the event should be executed in
	* the capturing or in the bubbling phase
	*/
	var removeEvt = (obj, type, func, capture) => {
		if (obj.removeEventListener) obj.removeEventListener(type, func, capture);
		else if (obj.detachEvent) obj.detachEvent("on" + type, func);
		else obj["on" + type] = null;
	};
	/**
	* Prevents further propagation of the current event in the bubbling phase
	*
	* @param {Event} evt Event on the DOM
	*/
	var stopEvt = (evt) => {
		if (!evt) evt = root.event;
		if (evt.stopPropagation) evt.stopPropagation();
		else evt.cancelBubble = true;
	};
	/**
	* Cancels the event if it is cancelable, without stopping further
	* propagation of the event.
	*
	* @param {Event} evt Event on the DOM
	*/
	var cancelEvt = (evt) => {
		if (!evt) evt = root.event;
		if (evt.preventDefault) evt.preventDefault();
		else evt.returnValue = false;
	};
	/**
	* Reference to the object that dispatched the event
	*
	* @param {Event} evt Event on the DOM
	* @returns {DOMElement}
	*/
	var targetEvt = (evt) => {
		if (!evt) evt = root.event;
		return evt.target || evt.srcElement;
	};
	/**
	* Returns the Unicode value of pressed key
	*
	* @param {Event} evt Event on the DOM
	* @returns {Number}
	*/
	var keyCode = (evt) => {
		return evt.charCode ? evt.charCode : evt.keyCode ? evt.keyCode : evt.which ? evt.which : 0;
	};
	/**
	* Check code of pressed key is one of the expected key codes
	*
	* @param {Event} evt key event
	* @param {Array} keyCodes list of keycodes to check
	*/
	var isKeyPressed = (evt, keyCodes = []) => {
		return keyCodes.indexOf(keyCode(evt)) !== -1;
	};
	/**
	* Bind passed function to passed scope
	* @param {Function} fn function
	* @param {Object} scope object instance
	*/
	function bound(fn, scope) {
		let boundFnName = `${fn.name}_bound`;
		if (!scope[boundFnName]) scope[boundFnName] = fn.bind(scope);
		return scope[boundFnName];
	}
	//#endregion
	//#region src/number.js
	/**
	* Formats a numeric value with configurable separators and affixes.
	*
	* Supported options: `locale`, `decimal`, `integerSeparator`, `precision`,
	* `round`, `prefix` and `suffix`. The `format-number` options `truncate`,
	* `padLeft`, `padRight`, `negativeType`, `negativeLeftSymbol`,
	* `negativeRightSymbol`, `negativeOut`, `decimalsSeparator` and `noUnits`
	* have no effect. `integerSeparator: null` disables grouping. Values of
	* magnitude 1e21 and above are rendered in full instead of exponential
	* notation.
	*
	* Requires `Intl.NumberFormat.prototype.formatToParts` (Chrome 64+, Edge 79+,
	* Firefox 58+, Safari 11+, Node 10+).
	* @param {Number|String} value Numeric value
	* @param {Object} [options={}] Formatting options
	* @param {String} [options.locale='en'] Intl locale
	* @param {String} [options.decimal] Decimal separator override
	* @param {String|null} [options.integerSeparator] Thousands separator override:
	* `undefined` uses locale default grouping, `null` or `''` disables grouping
	* @param {Number} [options.precision] Fixed number of fraction digits
	* @param {Number} [options.round] Maximum number of fraction digits
	* @param {String} [options.prefix=''] Value prefix
	* @param {String} [options.suffix=''] Value suffix
	* @returns {String} Formatted number
	*/
	var formatNumberValue = (value, options = {}) => {
		if (value === null || value === void 0 || typeof value === "string" && value.trim() === "") return "";
		const num = Number(value);
		if (isNaN(num) || !isFinite(num)) return "";
		const locale = options.locale || "en";
		const prefix = options.prefix || "";
		const suffix = options.suffix || "";
		const numericText = typeof value === "string" ? value.trim() : num.toString();
		const coefficient = numericText.toLowerCase().split("e")[0];
		const exponent = Number(numericText.toLowerCase().split("e")[1] || 0);
		const decimalIndex = coefficient.indexOf(".");
		const inputPrecision = Math.max(0, decimalIndex < 0 ? 0 : coefficient.length - decimalIndex - 1 - exponent);
		const maximumPrecision = options.round !== void 0 ? options.round : options.precision !== void 0 ? options.precision : inputPrecision;
		const minimumPrecision = options.precision !== void 0 ? Math.min(options.precision, maximumPrecision) : Math.min(inputPrecision, maximumPrecision);
		const formatter = new Intl.NumberFormat(locale, {
			useGrouping: options.integerSeparator === void 0 || Boolean(options.integerSeparator),
			minimumFractionDigits: minimumPrecision,
			maximumFractionDigits: maximumPrecision
		});
		let sign = "";
		const formatted = formatter.formatToParts(num).map((part) => {
			if (part.type === "group") return options.integerSeparator === void 0 ? part.value : options.integerSeparator;
			if (part.type === "decimal") return options.decimal || part.value;
			if (part.type === "minusSign") {
				sign = part.value;
				return "";
			}
			return part.value;
		}).join("");
		return `${sign}${prefix}${formatted}${suffix}`;
	};
	/**
	* Takes a string, removes all formatting/cruft and returns the raw float value
	* @param {String} Formatted number
	* @param {String} Decimal type '.' or ','
	* @return {Number} Unformatted number
	*
	* https://github.com/openexchangerates/accounting.js/blob/master/accounting.js
	*/
	var parse = (value, decimal = ".") => {
		if (isNumber(value)) return value;
		let regex = new RegExp("[^0-9-" + decimal + "]", ["g"]);
		let unformatted = parseFloat(("" + value).replace(/\((.*)\)/, "-$1").replace(regex, "").replace(decimal, "."));
		return !isNaN(unformatted) ? unformatted : 0;
	};
	//#endregion
	//#region src/const.js
	/**
	* Filter types
	*/
	/**
	* Input filter type
	* @type {String}
	*/
	var INPUT = "input";
	/**
	* Select filter type
	* @type {String}
	*/
	var SELECT = "select";
	/**
	* Multiple select filter type
	* @type {String}
	*/
	var MULTIPLE = "multiple";
	/**
	* Checklist filter type
	* @type {String}
	*/
	var CHECKLIST = "checklist";
	/**
	* None filter type
	* @type {String}
	*/
	var NONE = "none";
	/**
	* Data types
	*/
	/**
	* String
	* @type {String}
	*/
	var STRING = "string";
	/**
	* Formatted number
	* @type {String}
	*/
	var FORMATTED_NUMBER = "formatted-number";
	/**
	* Date
	* @type {String}
	*/
	var DATE = "date";
	/**
	* IP address
	* @type {String}
	*/
	var IP_ADDRESS = "ipaddress";
	//#endregion
	//#region src/settings.js
	/** Configuration settings helpers  */
	/**
	* If passed value is not of boolean type return the default value
	* otherwise return the value itself
	* @param  {Boolean|Any}  value
	* @param  {Boolean} default value
	* @return {Boolean|Any}
	*/
	var defaultsBool = (val, defaultVal) => isBoolean(val) ? val : defaultVal;
	/**
	* If passed value is not of string type return the default value
	* otherwise return the value itself
	* @param  {String|Any}  value
	* @param  {String} default value
	* @return {String|Any}
	*/
	var defaultsStr = (val, defaultVal) => isString(val) ? val : defaultVal;
	/**
	* If passed value is not of number type return the default value
	* otherwise return the value itself
	* @param  {Number|Any}  value
	* @param  {Number} default value
	* @return {Number|Any}
	*/
	var defaultsNb = (val, defaultVal) => isNaN(val) ? defaultVal : val;
	/**
	* If passed value is not of array type return the default value
	* otherwise return the value itself
	* @param  {Array|Any}  value
	* @param  {Array} default value
	* @return {Array|Any}
	*/
	var defaultsArr = (val, defaultVal) => isArray(val) ? val : defaultVal;
	/**
	* If passed value is not of function type return the default value
	* otherwise return the value itself
	* @param  {Function|Any}  value
	* @param  {Function} default value
	* @return {Function|Any}
	*/
	var defaultsFn = (val, defaultVal) => isFn(val) ? val : defaultVal;
	//#endregion
	//#region src/extensions/sort/adapterSortabletable.js
	/**
	* SortableTable Adapter module
	*/
	var AdapterSortableTable = class AdapterSortableTable extends Feature {
		/**
		* Creates an instance of AdapterSortableTable
		* @param {TableFilter} tf TableFilter instance
		* @param {Object} opts Configuration object
		*/
		constructor(tf, opts) {
			super(tf, AdapterSortableTable);
			/**
			* Module name
			* @type {String}
			*/
			this.name = opts.name;
			/**
			* Module description
			* @type {String}
			*/
			this.desc = defaultsStr(opts.description, "Sortable table");
			/**
			* Indicate whether table previously sorted
			* @type {Boolean}
			* @private
			*/
			this.sorted = false;
			/**
			* List of sort type per column basis
			* @type {Array}
			*/
			this.sortTypes = defaultsArr(opts.types, tf.colTypes);
			/**
			* Column to be sorted at initialization, ie:
			* sort_col_at_start: [1, true]
			* @type {Array}
			*/
			this.sortColAtStart = defaultsArr(opts.sort_col_at_start, null);
			/**
			* Enable asynchronous sort, if triggers are external
			* @type {Boolean}
			*/
			this.asyncSort = Boolean(opts.async_sort);
			/**
			* List of element IDs triggering sort on a per column basis
			* @type {Array}
			*/
			this.triggerIds = defaultsArr(opts.trigger_ids, []);
			/**
			* Path to images
			* @type {String}
			*/
			this.imgPath = defaultsStr(opts.images_path, tf.themesPath);
			/**
			* Blank image file name
			* @type {String}
			*/
			this.imgBlank = defaultsStr(opts.image_blank, "blank.png");
			/**
			* Css class for sort indicator image
			* @type {String}
			*/
			this.imgClassName = defaultsStr(opts.image_class_name, "sort-arrow");
			/**
			* Css class for ascending sort indicator image
			* @type {String}
			*/
			this.imgAscClassName = defaultsStr(opts.image_asc_class_name, "ascending");
			/**
			* Css class for descending sort indicator image
			* @type {String}
			*/
			this.imgDescClassName = defaultsStr(opts.image_desc_class_name, "descending");
			/**
			* Cell attribute key storing custom value used for sorting
			* @type {String}
			*/
			this.customKey = defaultsStr(opts.custom_key, "data-tf-sortKey");
			/**
			* Callback fired when sort extension is instanciated
			* @type {Function}
			*/
			this.onSortLoaded = defaultsFn(opts.on_sort_loaded, EMPTY_FN);
			/**
			* Callback fired before a table column is sorted
			* @type {Function}
			*/
			this.onBeforeSort = defaultsFn(opts.on_before_sort, EMPTY_FN);
			/**
			* Callback fired after a table column is sorted
			* @type {Function}
			*/
			this.onAfterSort = defaultsFn(opts.on_after_sort, EMPTY_FN);
			/**
			* SortableTable instance
			* @private
			*/
			this.stt = null;
			this.enable();
		}
		/**
		* Initializes AdapterSortableTable instance
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			let adpt = this;
			if (isUndef(SortableTable)) throw new Error("SortableTable class not found.");
			this.emitter.emit("add-date-type-formats", this.tf, this.sortTypes);
			this.overrideSortableTable();
			this.setSortTypes();
			this.onSortLoaded(tf, this);
			/*** SortableTable callbacks ***/
			this.stt.onbeforesort = function() {
				adpt.onBeforeSort(tf, adpt.stt.sortColumn);
				/*** sort behaviour for paging ***/
				if (tf.paging) tf.feature("paging").disable();
			};
			this.stt.onsort = function() {
				adpt.sorted = true;
				if (tf.paging) {
					let paginator = tf.feature("paging");
					tf.getValidRows(true);
					paginator.enable();
					paginator.setPage(paginator.getPage());
				}
				adpt.onAfterSort(tf, adpt.stt.sortColumn, adpt.stt.descending);
				adpt.emitter.emit("column-sorted", tf, adpt.stt.sortColumn, adpt.stt.descending);
			};
			let sortColAtStart = adpt.sortColAtStart;
			if (sortColAtStart) this.stt.sort(sortColAtStart[0], sortColAtStart[1]);
			this.emitter.on(["sort"], bound(this.sortByColumnIndexHandler, this));
			/** @inherited */
			this.initialized = true;
			this.emitter.emit("sort-initialized", tf, this);
		}
		/**
		* Sort specified column
		* @param {Number} colIdx Column index
		* @param {Boolean} desc Optional: descending manner
		*/
		sortByColumnIndex(colIdx, desc) {
			this.stt.sort(colIdx, desc);
		}
		/** @private */
		sortByColumnIndexHandler(tf, colIdx, desc) {
			this.sortByColumnIndex(colIdx, desc);
		}
		/**
		* Set SortableTable overrides for TableFilter integration
		*/
		overrideSortableTable() {
			let adpt = this, tf = this.tf;
			/**
			* Overrides headerOnclick method in order to handle th event
			* @param  {Object} e [description]
			*/
			SortableTable.prototype.headerOnclick = function(evt) {
				if (!adpt.initialized) return;
				let el = evt.target || evt.srcElement;
				while (el.tagName !== "TD" && el.tagName !== "TH") el = el.parentNode;
				this.sort(SortableTable.msie ? SortableTable.getCellIndex(el) : el.cellIndex);
			};
			/**
			* Overrides getCellIndex IE returns wrong cellIndex when columns are
			* hidden
			* @param  {Object} oTd TD element
			* @return {Number}     Cell index
			*/
			SortableTable.getCellIndex = function(oTd) {
				let cells = oTd.parentNode.cells, l = cells.length, i = 0;
				for (; cells[i] !== oTd && i < l; i++);
				return i;
			};
			/**
			* Overrides initHeader in order to handle filters row position
			* @param  {Array} oSortTypes
			*/
			SortableTable.prototype.initHeader = function(oSortTypes) {
				let stt = this;
				if (!stt.tHead) {
					if (tf.gridLayout) stt.tHead = tf.feature("gridLayout").headTbl.tHead;
					else return;
				}
				stt.headersRow = tf.headersRow;
				let cells = stt.tHead.rows[stt.headersRow].cells;
				stt.sortTypes = oSortTypes || [];
				let l = cells.length;
				let img, c;
				for (let i = 0; i < l; i++) {
					c = cells[i];
					if (stt.sortTypes[i] !== null && stt.sortTypes[i] !== "None") {
						c.style.cursor = "pointer";
						img = createElm("img", ["src", adpt.imgPath + adpt.imgBlank]);
						c.appendChild(img);
						if (stt.sortTypes[i] !== null) c.setAttribute("_sortType", stt.sortTypes[i]);
						addEvt(c, "click", stt._headerOnclick);
					} else {
						c.setAttribute("_sortType", oSortTypes[i]);
						c._sortType = "None";
					}
				}
				stt.updateHeaderArrows();
			};
			/**
			* Overrides updateHeaderArrows in order to handle arrows indicators
			*/
			SortableTable.prototype.updateHeaderArrows = function() {
				let stt = this;
				let cells, l, img;
				if (adpt.asyncSort && adpt.triggerIds.length > 0) {
					let triggers = adpt.triggerIds;
					cells = [];
					l = triggers.length;
					for (let j = 0; j < l; j++) cells.push(elm(triggers[j]));
				} else {
					if (!this.tHead) return;
					cells = stt.tHead.rows[stt.headersRow].cells;
					l = cells.length;
				}
				for (let i = 0; i < l; i++) {
					let cell = cells[i];
					if (!cell) continue;
					let cellAttr = cell.getAttribute("_sortType");
					if (cellAttr !== null && cellAttr !== "None") {
						img = cell.lastChild || cell;
						if (img.nodeName.toLowerCase() !== "img") {
							img = createElm("img", ["src", adpt.imgPath + adpt.imgBlank]);
							cell.appendChild(img);
						}
						if (i === stt.sortColumn) img.className = adpt.imgClassName + " " + (this.descending ? adpt.imgDescClassName : adpt.imgAscClassName);
						else img.className = adpt.imgClassName;
					}
				}
			};
			/**
			* Overrides getRowValue for custom key value feature
			* @param  {Object} oRow    Row element
			* @param  {String} sType
			* @param  {Number} nColumn
			* @return {String}
			*/
			SortableTable.prototype.getRowValue = function(oRow, sType, nColumn) {
				let stt = this;
				let sortTypeInfo = stt._sortTypeInfo[sType];
				if (sortTypeInfo && sortTypeInfo.getRowValue) return sortTypeInfo.getRowValue(oRow, nColumn);
				let c = oRow.cells[nColumn];
				let s = SortableTable.getInnerText(c);
				return stt.getValueFromString(s, sType);
			};
			/**
			* Overrides getInnerText in order to avoid Firefox unexpected sorting
			* behaviour with untrimmed text elements
			* @param  {Object} cell DOM element
			* @return {String}       DOM element inner text
			*/
			SortableTable.getInnerText = function(cell) {
				if (!cell) return;
				if (cell.getAttribute(adpt.customKey)) return cell.getAttribute(adpt.customKey);
				else return tf.getCellValue(cell);
			};
		}
		/**
		* Adds a sort type
		*/
		addSortType(...args) {
			let [id, caster, sorter, getRowValue] = args;
			SortableTable.prototype.addSortType(id, caster, sorter, getRowValue);
		}
		/**
		* Sets the sort types on a column basis
		* @private
		*/
		setSortTypes() {
			let tf = this.tf, sortTypes = this.sortTypes, _sortTypes = [];
			tf.eachCol((i) => {
				let colType;
				if (sortTypes[i]) {
					colType = sortTypes[i];
					if (isObj(colType)) {
						if (colType.type === "date") colType = this._addDateType(i, sortTypes);
						else if (colType.type === "formatted-number") {
							let decimal = colType.decimal || tf.decimalSeparator;
							colType = this._addNumberType(i, decimal);
						}
					} else {
						colType = colType.toLowerCase();
						if (colType === "date") colType = this._addDateType(i, sortTypes);
						else if (colType === "formatted-number" || colType === "number") colType = this._addNumberType(i, tf.decimalSeparator);
						else if (colType === "none") colType = "None";
					}
				} else colType = STRING;
				_sortTypes.push(colType);
			});
			this.addSortType("caseinsensitivestring", SortableTable.toUpperCase);
			this.addSortType(STRING);
			this.addSortType(IP_ADDRESS, ipAddress, sortIP);
			this.stt = new SortableTable(tf.dom(), _sortTypes);
			/*** external table headers adapter ***/
			if (this.asyncSort && this.triggerIds.length > 0) {
				let triggers = this.triggerIds;
				for (let j = 0; j < triggers.length; j++) {
					if (triggers[j] === null) continue;
					let trigger = elm(triggers[j]);
					if (trigger) {
						trigger.style.cursor = "pointer";
						addEvt(trigger, "click", (evt) => {
							let elm = evt.target;
							if (!this.tf.sort) return;
							this.stt.asyncSort(triggers.indexOf(elm.id));
						});
						trigger.setAttribute("_sortType", _sortTypes[j]);
					}
				}
			}
		}
		_addDateType(colIndex, types) {
			let tf = this.tf;
			let dateType = tf.feature("dateType");
			let locale = dateType.getOptions(colIndex, types).locale || tf.locale;
			let colType = `${DATE}-${locale}`;
			this.addSortType(colType, (value) => {
				let parsedDate = dateType.parse(value, locale);
				return isNaN(+parsedDate) ? /* @__PURE__ */ new Date(-864e11) : parsedDate;
			});
			return colType;
		}
		_addNumberType(colIndex, decimal) {
			let colType = `${FORMATTED_NUMBER}${decimal === "." ? "" : "-custom"}`;
			this.addSortType(colType, (value) => {
				return parse(value, decimal);
			});
			return colType;
		}
		/**
		* Remove extension
		*/
		destroy() {
			if (!this.initialized) return;
			let tf = this.tf;
			this.emitter.off(["sort"], bound(this.sortByColumnIndexHandler, this));
			this.sorted = false;
			this.stt.destroy();
			let ids = tf.getFiltersId();
			for (let idx = 0; idx < ids.length; idx++) {
				let header = tf.getHeaderElement(idx);
				let img = tag(header, "img");
				if (img.length === 1) header.removeChild(img[0]);
			}
			this.initialized = false;
		}
	};
	AdapterSortableTable.meta = { altName: "sort" };
	function ipAddress(value) {
		let vals = value.split(".");
		for (let x in vals) {
			let val = vals[x];
			while (3 > val.length) val = "0" + val;
			vals[x] = val;
		}
		return vals.join(".");
	}
	function sortIP(a, b) {
		let aa = ipAddress(a.value.toLowerCase());
		let bb = ipAddress(b.value.toLowerCase());
		if (aa === bb) return 0;
		else if (aa < bb) return -1;
		else return 1;
	}
	//#endregion
	//#region src/extensions/sort/sort.js
	if (typeof SortableTable === "undefined") (0, eval)(sortabletable_default);
	if (!root.SortableTable) {
		if (typeof require !== "undefined") {}
	}
	var sort_default = AdapterSortableTable;
	//#endregion
	//#region src/modules/toolbar.js
	var EVENTS$2 = ["initializing-feature", "initializing-extension"];
	/** Left position in toolbar */
	var LEFT = "left";
	/** Right position in toolbar */
	var RIGHT = "right";
	/** Center position in toolbar */
	var CENTER = "center";
	/**
	* Toolbar UI component
	* @export
	* @class Toolbar
	* @extends {Feature}
	*/
	var Toolbar = class Toolbar extends Feature {
		/**
		* Create an instance of Toolbar
		* @param {TableFilter} tf TableFilter instance
		* @memberof Toolbar
		*/
		constructor(tf) {
			super(tf, Toolbar);
			let f = this.config.toolbar || {};
			/**
			* Css class for toolbar's container DOM element
			* @type {String}
			*/
			this.contCssClass = defaultsStr(f.container_css_class, "inf");
			/**
			* Css class for left-side inner container DOM element
			* @type {String}
			*/
			this.lContCssClass = defaultsStr(f.left_cont_css_class, "ldiv");
			/**
			* Css class for right-side inner container DOM element
			* @type {String}
			*/
			this.rContCssClass = defaultsStr(f.right_cont_css_class, "rdiv");
			/**
			* Css class for middle inner container DOM element
			* @type {String}
			*/
			this.cContCssClass = defaultsStr(f.center_cont_css_class, "mdiv");
			/**
			* Toolbar's custom container ID
			* @type {String}
			*/
			this.tgtId = defaultsStr(f.target_id, null);
			/**
			* Toolbar's container DOM element
			* @type {DOMElement}
			* @private
			*/
			this.cont = null;
			/**
			* Left-side inner container DOM element (rows counter in toolbar)
			* @type {DOMElement}
			* @private
			*/
			this.lCont = null;
			/**
			* Right-side inner container DOM element (reset button,
			* page length selector in toolbar)
			* @type {DOMElement}
			* @private
			*/
			this.rCont = null;
			/**
			* Middle inner container DOM element (paging elements in toolbar)
			* @type {DOMElement}
			* @private
			*/
			this.cCont = null;
			/**
			* Container elements inside toolbar
			* @private
			*/
			this.innerCont = {
				left: null,
				center: null,
				right: null
			};
			this.emitter.on(EVENTS$2, (feature, isExternal) => this.init(isExternal));
			/** @inherited */
			this.enabled = true;
		}
		/**
		* Initialize toolbar components
		* @param {Boolean} isExternal initialize only if component belongs
		* to toolbar
		*/
		init(isExternal) {
			if (this.initialized || isExternal) return;
			let tf = this.tf;
			let container = createElm("div");
			container.className = this.contCssClass;
			if (this.tgtId) elm(this.tgtId).appendChild(container);
			else if (tf.gridLayout) {
				let gridLayout = tf.Mod.gridLayout;
				gridLayout.tblMainCont.appendChild(container);
				container.className = gridLayout.infDivCssClass;
			} else {
				let cont = createElm("caption");
				cont.appendChild(container);
				tf.dom().insertBefore(cont, tf.dom().firstChild);
			}
			this.cont = container;
			this.lCont = this.createContainer(container, this.lContCssClass);
			this.rCont = this.createContainer(container, this.rContCssClass);
			this.cCont = this.createContainer(container, this.cContCssClass);
			this.innerCont = {
				left: this.lCont,
				center: this.cCont,
				right: this.rCont
			};
			/** @inherited */
			this.initialized = true;
			if (isUndef(tf.help)) {
				tf.Mod.help.enable();
				this.emitter.emit("init-help", tf);
			}
		}
		/**
		* Return the container based on requested position inside the toolbar
		* @param {String} [position=RIGHT] 3 possible positions: 'left', 'center',
		* 'right'
		* @param {DOMElement} el optional DOM element to be inserter in container
		* @returns {DOMElement}
		*/
		container(position = RIGHT, el) {
			let cont = this.innerCont[position];
			if (el) cont.appendChild(el);
			return cont;
		}
		/**
		* Create DOM element inside passed container
		* @param {DOMElement} container
		* @param {String} css
		* @private
		*/
		createContainer(container, css) {
			let div = createElm("div", ["class", css]);
			container.appendChild(div);
			return div;
		}
		/**
		* Destroy Toolbar instance
		*/
		destroy() {
			if (!this.initialized) return;
			let tf = this.tf;
			removeElm(this.cont);
			this.cont = null;
			let captions = tag(tf.dom(), "caption");
			[].forEach.call(captions, (el) => removeElm(el));
			/** @inherited */
			this.initialized = false;
		}
	};
	Toolbar.meta = { alwaysInstantiate: true };
	//#endregion
	//#region src/extensions/colsVisibility/colsVisibility.js
	/**
	* Columns Visibility extension
	*/
	var ColsVisibility = class ColsVisibility extends Feature {
		/**
		* Creates an instance of ColsVisibility
		* @param {TableFilter} tf TableFilter instance
		* @param {Object} Configuration object
		*/
		constructor(tf, f) {
			super(tf, ColsVisibility);
			let cfg = this.config;
			/**
			* Module name
			* @type {String}
			*/
			this.name = f.name;
			/**
			* Module description
			* @type {String}
			*/
			this.desc = defaultsStr(f.description, "Columns visibility manager");
			/**
			* show/hide columns container element
			* @private
			*/
			this.spanEl = null;
			/**
			* show/hide columns button element
			* @private
			*/
			this.btnEl = null;
			/**
			* show/hide columns main container element
			* @private
			*/
			this.contEl = null;
			/**
			* Enable tick to hide a column, defaults to true
			* @type {Boolean}
			*/
			this.tickToHide = defaultsBool(f.tick_to_hide, true);
			/**
			* Enable columns manager UI, defaults to true
			* @type {Boolean}
			*/
			this.manager = defaultsBool(f.manager, true);
			/**
			* Headers HTML table reference only if headers are external
			* @type {DOMElement}
			*/
			this.headersTbl = f.headers_table || null;
			/**
			* Headers row index only if headers are external
			* @type {Number}
			*/
			this.headersIndex = defaultsNb(f.headers_index, 1);
			/**
			* ID of main container element
			* @type {String}
			*/
			this.contElTgtId = defaultsStr(f.container_target_id, null);
			/**
			* Alternative text for column headers in column manager UI
			* @type {Array}
			*/
			this.headersText = defaultsArr(f.headers_text, []);
			/**
			* ID of button's container element
			* @type {String}
			*/
			this.btnTgtId = defaultsStr(f.btn_target_id, null);
			/**
			* Button's text, defaults to Columns&#9660;
			* @type {String}
			*/
			this.btnText = defaultsStr(f.btn_text, "Columns&#9660;");
			/**
			* Button's inner HTML
			* @type {String}
			*/
			this.btnHtml = defaultsStr(f.btn_html, null);
			/**
			* Css class for button
			* @type {String}
			*/
			this.btnCssClass = defaultsStr(f.btn_css_class, "colVis");
			/**
			* Columns manager UI close link text, defaults to 'Close'
			* @type {String}
			*/
			this.btnCloseText = defaultsStr(f.btn_close_text, "Close");
			/**
			* Columns manager UI close link HTML
			* @type {String}
			*/
			this.btnCloseHtml = defaultsStr(f.btn_close_html, null);
			/**
			* Css for columns manager UI close link
			* @type {String}
			*/
			this.btnCloseCssClass = defaultsStr(f.btn_close_css_class, this.btnCssClass);
			/**
			* Extension's stylesheet filename
			* @type {String}
			*/
			this.stylesheet = defaultsStr(f.stylesheet, "colsVisibility.css");
			/**
			* Css for columns manager UI span
			* @type {String}
			*/
			this.spanCssClass = defaultsStr(f.span_css_class, "colVisSpan");
			/**
			* Css for columns manager UI main container
			* @type {String}
			*/
			this.contCssClass = defaultsStr(f.cont_css_class, "colVisCont");
			/**
			* Css for columns manager UI checklist (ul)
			* @type {String}
			*/
			this.listCssClass = defaultsStr(cfg.list_css_class, "cols_checklist");
			/**
			* Css for columns manager UI checklist item (li)
			* @type {String}
			*/
			this.listItemCssClass = defaultsStr(cfg.checklist_item_css_class, "cols_checklist_item");
			/**
			* Css for columns manager UI checklist item selected state (li)
			* @type {String}
			*/
			this.listSlcItemCssClass = defaultsStr(cfg.checklist_selected_item_css_class, "cols_checklist_slc_item");
			/**
			* Text preceding the columns list, defaults to 'Hide' or 'Show'
			* depending on tick mode (tick_to_hide option)
			* @type {String}
			*/
			this.text = defaultsStr(f.text, this.tickToHide ? "Hide: " : "Show: ");
			/**
			* List of columns indexes to be hidden at initialization
			* @type {Array}
			*/
			this.atStart = defaultsArr(f.at_start, []);
			/**
			* Enable hover behaviour on columns manager button/link
			* @type {Boolean}
			*/
			this.enableHover = Boolean(f.enable_hover);
			/**
			* Enable select all option, disabled by default
			* @type {Boolean}
			*/
			this.enableTickAll = Boolean(f.enable_tick_all);
			/**
			* Text for select all option, defaults to 'Select all:'
			* @type {String}
			*/
			this.tickAllText = defaultsStr(f.tick_all_text, "Select all:");
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, RIGHT);
			/**
			* List of indexes of hidden columns
			* @private
			*/
			this.hiddenCols = [];
			/**
			* Bound mouseup wrapper
			* @private
			*/
			this.boundMouseup = null;
			/**
			* Callback fired when the extension is initialized
			* @type {Function}
			*/
			this.onLoaded = defaultsFn(f.on_loaded, EMPTY_FN);
			/**
			* Callback fired before the columns manager is opened
			* @type {Function}
			*/
			this.onBeforeOpen = defaultsFn(f.on_before_open, EMPTY_FN);
			/**
			* Callback fired after the columns manager is opened
			* @type {Function}
			*/
			this.onAfterOpen = defaultsFn(f.on_after_open, EMPTY_FN);
			/**
			* Callback fired before the columns manager is closed
			* @type {Function}
			*/
			this.onBeforeClose = defaultsFn(f.on_before_close, EMPTY_FN);
			/**
			* Callback fired after the columns manager is closed
			* @type {Function}
			*/
			this.onAfterClose = defaultsFn(f.on_after_close, EMPTY_FN);
			/**
			* Callback fired before a column is hidden
			* @type {Function}
			*/
			this.onBeforeColHidden = defaultsFn(f.on_before_col_hidden, EMPTY_FN);
			/**
			* Callback fired after a column is hidden
			* @type {Function}
			*/
			this.onAfterColHidden = defaultsFn(f.on_after_col_hidden, EMPTY_FN);
			/**
			* Callback fired before a column is displayed
			* @type {Function}
			*/
			this.onBeforeColDisplayed = defaultsFn(f.on_before_col_displayed, EMPTY_FN);
			/**
			* Callback fired after a column is displayed
			* @type {Function}
			*/
			this.onAfterColDisplayed = defaultsFn(f.on_after_col_displayed, EMPTY_FN);
			if (tf.gridLayout) {
				this.headersTbl = tf.feature("gridLayout").headTbl;
				this.headersIndex = 0;
			}
			tf.import(f.name + "Style", tf.getStylePath() + this.stylesheet, null, "link");
			this.enable();
		}
		/**
		* Mouse-up event handler handling popup auto-close behaviour
		* @private
		*/
		onMouseup(evt) {
			let targetElm = targetEvt(evt);
			while (targetElm && targetElm !== this.contEl && targetElm !== this.btnEl) targetElm = targetElm.parentNode;
			if (targetElm !== this.contEl && targetElm !== this.btnEl) this.toggle();
		}
		/**
		* Toggle columns manager UI
		*/
		toggle() {
			removeEvt(root, "mouseup", this.boundMouseup);
			let contDisplay = this.contEl.style.display;
			if (contDisplay !== "inline") this.onBeforeOpen(this);
			if (contDisplay === "inline") this.onBeforeClose(this);
			this.contEl.style.display = contDisplay === "inline" ? NONE : "inline";
			if (contDisplay !== "inline") {
				this.onAfterOpen(this);
				addEvt(root, "mouseup", this.boundMouseup);
			}
			if (contDisplay === "inline") this.onAfterClose(this);
		}
		/**
		* Check an item in columns manager UI
		* @private
		*/
		checkItem(lbl) {
			let li = lbl.parentNode;
			if (!li || !lbl) return;
			let isChecked = lbl.firstChild.checked;
			let colIndex = lbl.firstChild.getAttribute("id").split("_")[1];
			colIndex = parseInt(colIndex, 10);
			if (isChecked) addClass(li, this.listSlcItemCssClass);
			else removeClass(li, this.listSlcItemCssClass);
			let hide = false;
			if (this.tickToHide && isChecked || !this.tickToHide && !isChecked) hide = true;
			this.setHidden(colIndex, hide);
		}
		/**
		* Initializes ColsVisibility instance
		*/
		init() {
			if (this.initialized || !this.manager) return;
			this.emitter.emit("initializing-extension", this, !isNull(this.btnTgtId));
			this.emitter.on(["hide-column"], (tf, colIndex) => this.hideCol(colIndex));
			this.buildBtn();
			this.buildManager();
			/** @inherited */
			this.initialized = true;
			this.boundMouseup = this.onMouseup.bind(this);
			this.emitter.emit("columns-visibility-initialized", this.tf, this);
			this.emitter.emit("extension-initialized", this);
			this._hideAtStart();
		}
		/**
		* Build main button UI
		*/
		buildBtn() {
			if (this.btnEl) return;
			let tf = this.tf;
			let span = createElm("span");
			span.className = this.spanCssClass;
			let targetEl = !this.btnTgtId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.btnTgtId);
			if (!this.btnTgtId) {
				let firstChild = targetEl.firstChild;
				firstChild.parentNode.insertBefore(span, firstChild);
			} else targetEl.appendChild(span);
			if (!this.btnHtml) {
				let btn = createElm("a", ["href", "javascript:;"]);
				btn.className = this.btnCssClass;
				btn.title = this.desc;
				btn.innerHTML = this.btnText;
				span.appendChild(btn);
				if (!this.enableHover) addEvt(btn, "click", (evt) => this.toggle(evt));
				else addEvt(btn, "mouseover", (evt) => this.toggle(evt));
			} else {
				span.innerHTML = this.btnHtml;
				let colVisEl = span.firstChild;
				if (!this.enableHover) addEvt(colVisEl, "click", (evt) => this.toggle(evt));
				else addEvt(colVisEl, "mouseover", (evt) => this.toggle(evt));
			}
			this.spanEl = span;
			this.btnEl = this.spanEl.firstChild;
			this.onLoaded(this);
		}
		/**
		* Build columns manager UI
		*/
		buildManager() {
			let tf = this.tf;
			let container = !this.contElTgtId ? createElm("div") : elm(this.contElTgtId);
			container.className = this.contCssClass;
			let extNameLabel = createElm("p");
			extNameLabel.innerHTML = this.text;
			container.appendChild(extNameLabel);
			let ul = createElm("ul");
			ul.className = this.listCssClass;
			let tbl = this.headersTbl || tf.dom();
			let headerIndex = this.headersTbl ? this.headersIndex : tf.getHeadersRowIndex();
			let headerRow = tbl.rows[headerIndex];
			if (this.enableTickAll) {
				let li = createCheckItem("col__" + tf.id, this.tickAllText, this.tickAllText);
				addClass(li, this.listItemCssClass);
				ul.appendChild(li);
				li.check.checked = !this.tickToHide;
				addEvt(li.check, "click", () => {
					for (let h = 0; h < headerRow.cells.length; h++) {
						let itm = elm("col_" + h + "_" + tf.id);
						if (itm && li.check.checked !== itm.checked) {
							itm.click();
							itm.checked = li.check.checked;
						}
					}
				});
			}
			for (let i = 0; i < headerRow.cells.length; i++) {
				let cell = headerRow.cells[i];
				let cellText = this.headersText[i] || this._getHeaderText(cell);
				let liElm = createCheckItem("col_" + i + "_" + tf.id, cellText, cellText);
				addClass(liElm, this.listItemCssClass);
				if (!this.tickToHide) addClass(liElm, this.listSlcItemCssClass);
				ul.appendChild(liElm);
				if (!this.tickToHide) liElm.check.checked = true;
				addEvt(liElm.check, "click", (evt) => {
					let lbl = targetEvt(evt).parentNode;
					this.checkItem(lbl);
				});
			}
			let p = createElm("p", ["align", "center"]);
			let btn;
			if (!this.btnCloseHtml) {
				btn = createElm("a", ["href", "javascript:;"]);
				btn.className = this.btnCloseCssClass;
				btn.innerHTML = this.btnCloseText;
				addEvt(btn, "click", (evt) => this.toggle(evt));
				p.appendChild(btn);
			} else {
				p.innerHTML = this.btnCloseHtml;
				btn = p.firstChild;
				addEvt(btn, "click", (evt) => this.toggle(evt));
			}
			container.appendChild(ul);
			container.appendChild(p);
			this.btnEl.parentNode.insertBefore(container, this.btnEl);
			this.contEl = container;
		}
		/**
		* Hide or show specified columns
		* @param {Number} colIndex Column index
		* @param {Boolean} hide    Hide column if true or show if false
		*/
		setHidden(colIndex, hide) {
			let tf = this.tf;
			let tbl = tf.dom();
			if (hide) this.onBeforeColHidden(this, colIndex);
			else this.onBeforeColDisplayed(this, colIndex);
			this._hideElements(tbl, colIndex, hide);
			if (this.headersTbl) this._hideElements(this.headersTbl, colIndex, hide);
			let itemIndex = this.hiddenCols.indexOf(colIndex);
			if (hide) {
				if (itemIndex === -1) this.hiddenCols.push(colIndex);
			} else if (itemIndex !== -1) this.hiddenCols.splice(itemIndex, 1);
			if (hide) {
				this.onAfterColHidden(this, colIndex);
				this.emitter.emit("column-hidden", tf, this, colIndex, this.hiddenCols);
			} else {
				this.onAfterColDisplayed(this, colIndex);
				this.emitter.emit("column-shown", tf, this, colIndex, this.hiddenCols);
			}
		}
		/**
		* Show specified column
		* @param  {Number} colIndex Column index
		*/
		showCol(colIndex) {
			if (isUndef(colIndex) || !this.isColHidden(colIndex)) return;
			if (this.manager && this.contEl) {
				let itm = elm("col_" + colIndex + "_" + this.tf.id);
				if (itm) itm.click();
			} else this.setHidden(colIndex, false);
		}
		/**
		* Hide specified column
		* @param  {Number} colIndex Column index
		*/
		hideCol(colIndex) {
			if (isUndef(colIndex) || this.isColHidden(colIndex)) return;
			if (this.manager && this.contEl) {
				let itm = elm("col_" + colIndex + "_" + this.tf.id);
				if (itm) itm.click();
			} else this.setHidden(colIndex, true);
		}
		/**
		* Determine if specified column is hidden
		* @param  {Number} colIndex Column index
		*/
		isColHidden(colIndex) {
			if (this.hiddenCols.indexOf(colIndex) !== -1) return true;
			return false;
		}
		/**
		* Toggle visibility of specified column
		* @param  {Number} colIndex Column index
		*/
		toggleCol(colIndex) {
			if (isUndef(colIndex) || this.isColHidden(colIndex)) this.showCol(colIndex);
			else this.hideCol(colIndex);
		}
		/**
		* Return the indexes of the columns currently hidden
		* @return {Array} column indexes
		*/
		getHiddenCols() {
			return this.hiddenCols;
		}
		/**
		* Remove the columns manager
		*/
		destroy() {
			if (!this.initialized) return;
			if (elm(this.contElTgtId)) elm(this.contElTgtId).innerHTML = "";
			else {
				this.contEl.innerHTML = "";
				removeElm(this.contEl);
				this.contEl = null;
			}
			this.btnEl.innerHTML = "";
			removeElm(this.btnEl);
			this.btnEl = null;
			this.emitter.off(["hide-column"], (tf, colIndex) => this.hideCol(colIndex));
			this.boundMouseup = null;
			this.initialized = false;
		}
		_getHeaderText(cell) {
			if (!cell.hasChildNodes) return "";
			for (let i = 0; i < cell.childNodes.length; i++) {
				let n = cell.childNodes[i];
				if (n.nodeType === 3) return n.nodeValue;
				else if (n.nodeType === 1) {
					if (n.id && n.id.indexOf("popUp") !== -1) continue;
					else return getText(n);
				}
			}
			return "";
		}
		_hideElements(tbl, colIdx, hide) {
			this._hideCells(tbl, colIdx, hide);
			this._hideCol(tbl, colIdx, hide);
		}
		_hideCells(tbl, colIdx, hide) {
			for (let i = 0; i < tbl.rows.length; i++) {
				let cell = tbl.rows[i].cells[colIdx];
				if (cell) cell.style.display = hide ? NONE : "";
			}
		}
		_hideCol(tbl, colIdx, hide) {
			let colElms = tag(tbl, "col");
			if (colElms.length === 0) return;
			colElms[colIdx].style.display = hide ? NONE : "";
		}
		_hideAtStart() {
			this.atStart.forEach((colIdx) => {
				this.hideCol(colIdx);
			});
		}
	};
	//#endregion
	//#region node_modules/sugar-core/sugar-core.js
	var require_sugar_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function() {
			"use strict";
			/***
			* @module Core
			* @description Core functionality including the ability to define methods and
			*              extend onto natives.
			*
			***/
			var Sugar;
			var SUGAR_GLOBAL = "Sugar";
			var NATIVE_NAMES = "Object Number String Array Date RegExp Function";
			var STATIC = 1;
			var INSTANCE = 2;
			var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);
			var globalContext = getGlobal();
			var allowObjectPrototype = false;
			var namespacesByName = {};
			var namespacesByClassString = {};
			// istanbul ignore next
			var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ? Object.defineProperty : definePropertyShim;
			var DefaultChainable = getNewChainableClass("Chainable");
			function getGlobal() {
				return testGlobal(typeof global !== "undefined" && global) || testGlobal(typeof window !== "undefined" && window);
			}
			function testGlobal(obj) {
				return obj && obj.Object === Object ? obj : null;
			}
			function setupGlobal() {
				Sugar = globalContext[SUGAR_GLOBAL];
				// istanbul ignore if
				if (Sugar) return;
				Sugar = function(arg) {
					forEachProperty(Sugar, function(sugarNamespace, name) {
						if (hasOwn(namespacesByName, name)) sugarNamespace.extend(arg);
					});
					return Sugar;
				};
				// istanbul ignore else
				if (typeof module !== "undefined" && module.exports) module.exports = Sugar;
				else try {
					globalContext[SUGAR_GLOBAL] = Sugar;
				} catch (e) {}
				forEachProperty(NATIVE_NAMES.split(" "), function(name) {
					createNamespace(name);
				});
				setGlobalProperties();
			}
			/***
			* @method createNamespace(name)
			* @returns SugarNamespace
			* @namespace Sugar
			* @short Creates a new Sugar namespace.
			* @extra This method is for plugin developers who want to define methods to be
			*        used with natives that Sugar does not handle by default. The new
			*        namespace will appear on the `Sugar` global with all the methods of
			*        normal namespaces, including the ability to define new methods. When
			*        extended, any defined methods will be mapped to `name` in the global
			*        context.
			*
			* @example
			*
			*   Sugar.createNamespace('Boolean');
			*
			* @param {string} name - The namespace name.
			*
			***/
			function createNamespace(name) {
				var isObject = name === "Object";
				var sugarNamespace = getNewChainableClass(name, true);
				/***
				* @method extend([opts])
				* @returns Sugar
				* @namespace Sugar
				* @short Extends Sugar defined methods onto natives.
				* @extra This method can be called on individual namespaces like
				*        `Sugar.Array` or on the `Sugar` global itself, in which case
				*        [opts] will be forwarded to each `extend` call. For more,
				*        see `extending`.
				*
				* @options
				*
				*   methods           An array of method names to explicitly extend.
				*
				*   except            An array of method names or global namespaces (`Array`,
				*                     `String`) to explicitly exclude. Namespaces should be the
				*                     actual global objects, not strings.
				*
				*   namespaces        An array of global namespaces (`Array`, `String`) to
				*                     explicitly extend. Namespaces should be the actual
				*                     global objects, not strings.
				*
				*   enhance           A shortcut to disallow all "enhance" flags at once
				*                     (flags listed below). For more, see `enhanced methods`.
				*                     Default is `true`.
				*
				*   enhanceString     A boolean allowing String enhancements. Default is `true`.
				*
				*   enhanceArray      A boolean allowing Array enhancements. Default is `true`.
				*
				*   objectPrototype   A boolean allowing Sugar to extend Object.prototype
				*                     with instance methods. This option is off by default
				*                     and should generally not be used except with caution.
				*                     For more, see `object methods`.
				*
				* @example
				*
				*   Sugar.Array.extend();
				*   Sugar.extend();
				*
				* @option {Array<string>} [methods]
				* @option {Array<string|NativeConstructor>} [except]
				* @option {Array<NativeConstructor>} [namespaces]
				* @option {boolean} [enhance]
				* @option {boolean} [enhanceString]
				* @option {boolean} [enhanceArray]
				* @option {boolean} [objectPrototype]
				* @param {ExtendOptions} [opts]
				*
				***
				* @method extend([opts])
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Extends Sugar defined methods for a specific namespace onto natives.
				* @param {ExtendOptions} [opts]
				*
				***/
				var extend = function(opts) {
					var nativeClass = globalContext[name], nativeProto = nativeClass.prototype;
					var staticMethods = {}, instanceMethods = {}, methodsByName;
					function objectRestricted(name, target) {
						return isObject && target === nativeProto && (!allowObjectPrototype || name === "get" || name === "set");
					}
					function arrayOptionExists(field, val) {
						var arr = opts[field];
						if (arr) {
							for (var i = 0, el; el = arr[i]; i++) if (el === val) return true;
						}
						return false;
					}
					function arrayOptionExcludes(field, val) {
						return opts[field] && !arrayOptionExists(field, val);
					}
					function disallowedByFlags(methodName, target, flags) {
						if (!target[methodName] || !flags) return false;
						for (var i = 0; i < flags.length; i++) if (opts[flags[i]] === false) return true;
					}
					function namespaceIsExcepted() {
						return arrayOptionExists("except", nativeClass) || arrayOptionExcludes("namespaces", nativeClass);
					}
					function methodIsExcepted(methodName) {
						return arrayOptionExists("except", methodName);
					}
					function canExtend(methodName, method, target) {
						return !objectRestricted(methodName, target) && !disallowedByFlags(methodName, target, method.flags) && !methodIsExcepted(methodName);
					}
					opts = opts || {};
					methodsByName = opts.methods;
					if (namespaceIsExcepted()) return;
					else if (isObject && typeof opts.objectPrototype === "boolean") allowObjectPrototype = opts.objectPrototype;
					forEachProperty(methodsByName || sugarNamespace, function(method, methodName) {
						if (methodsByName) {
							methodName = method;
							method = sugarNamespace[methodName];
						}
						if (hasOwn(method, "instance") && canExtend(methodName, method, nativeProto)) instanceMethods[methodName] = method.instance;
						if (hasOwn(method, "static") && canExtend(methodName, method, nativeClass)) staticMethods[methodName] = method;
					});
					extendNative(nativeClass, staticMethods);
					extendNative(nativeProto, instanceMethods);
					if (!methodsByName) setProperty(sugarNamespace, "active", true);
					return sugarNamespace;
				};
				function defineWithOptionCollect(methodName, instance, args) {
					setProperty(sugarNamespace, methodName, function(arg1, arg2, arg3) {
						var opts = collectDefineOptions(arg1, arg2, arg3);
						defineMethods(sugarNamespace, opts.methods, instance, args, opts.last);
						return sugarNamespace;
					});
				}
				/***
				* @method defineStatic(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines static methods on the namespace that can later be extended
				*        onto the native globals.
				* @extra Accepts either a single object mapping names to functions, or name
				*        and function as two arguments. If `extend` was previously called
				*        with no arguments, the method will be immediately mapped to its
				*        native when defined.
				*
				* @example
				*
				*   Sugar.Number.defineStatic({
				*     isOdd: function (num) {
				*       return num % 2 === 1;
				*     }
				*   });
				*
				* @signature defineStatic(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				defineWithOptionCollect("defineStatic", STATIC);
				/***
				* @method defineInstance(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines methods on the namespace that can later be extended as
				*        instance methods onto the native prototype.
				* @extra Accepts either a single object mapping names to functions, or name
				*        and function as two arguments. All functions should accept the
				*        native for which they are mapped as their first argument, and should
				*        never refer to `this`. If `extend` was previously called with no
				*        arguments, the method will be immediately mapped to its native when
				*        defined.
				*
				*        Methods cannot accept more than 4 arguments in addition to the
				*        native (5 arguments total). Any additional arguments will not be
				*        mapped. If the method needs to accept unlimited arguments, use
				*        `defineInstanceWithArguments`. Otherwise if more options are
				*        required, use an options object instead.
				*
				* @example
				*
				*   Sugar.Number.defineInstance({
				*     square: function (num) {
				*       return num * num;
				*     }
				*   });
				*
				* @signature defineInstance(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				defineWithOptionCollect("defineInstance", INSTANCE);
				/***
				* @method defineInstanceAndStatic(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short A shortcut to define both static and instance methods on the namespace.
				* @extra This method is intended for use with `Object` instance methods. Sugar
				*        will not map any methods to `Object.prototype` by default, so defining
				*        instance methods as static helps facilitate their proper use.
				*
				* @example
				*
				*   Sugar.Object.defineInstanceAndStatic({
				*     isAwesome: function (obj) {
				*       // check if obj is awesome!
				*     }
				*   });
				*
				* @signature defineInstanceAndStatic(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				defineWithOptionCollect("defineInstanceAndStatic", 3);
				/***
				* @method defineStaticWithArguments(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines static methods that collect arguments.
				* @extra This method is identical to `defineStatic`, except that when defined
				*        methods are called, they will collect any arguments past `n - 1`,
				*        where `n` is the number of arguments that the method accepts.
				*        Collected arguments will be passed to the method in an array
				*        as the last argument defined on the function.
				*
				* @example
				*
				*   Sugar.Number.defineStaticWithArguments({
				*     addAll: function (num, args) {
				*       for (var i = 0; i < args.length; i++) {
				*         num += args[i];
				*       }
				*       return num;
				*     }
				*   });
				*
				* @signature defineStaticWithArguments(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				defineWithOptionCollect("defineStaticWithArguments", STATIC, true);
				/***
				* @method defineInstanceWithArguments(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines instance methods that collect arguments.
				* @extra This method is identical to `defineInstance`, except that when
				*        defined methods are called, they will collect any arguments past
				*        `n - 1`, where `n` is the number of arguments that the method
				*        accepts. Collected arguments will be passed to the method as the
				*        last argument defined on the function.
				*
				* @example
				*
				*   Sugar.Number.defineInstanceWithArguments({
				*     addAll: function (num, args) {
				*       for (var i = 0; i < args.length; i++) {
				*         num += args[i];
				*       }
				*       return num;
				*     }
				*   });
				*
				* @signature defineInstanceWithArguments(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				defineWithOptionCollect("defineInstanceWithArguments", INSTANCE, true);
				/***
				* @method defineStaticPolyfill(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines static methods that are mapped onto the native if they do
				*        not already exist.
				* @extra Intended only for use creating polyfills that follow the ECMAScript
				*        spec. Accepts either a single object mapping names to functions, or
				*        name and function as two arguments. Note that polyfill methods will
				*        be immediately mapped onto their native prototype regardless of the
				*        use of `extend`.
				*
				* @example
				*
				*   Sugar.Object.defineStaticPolyfill({
				*     keys: function (obj) {
				*       // get keys!
				*     }
				*   });
				*
				* @signature defineStaticPolyfill(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				setProperty(sugarNamespace, "defineStaticPolyfill", function(arg1, arg2, arg3) {
					var opts = collectDefineOptions(arg1, arg2, arg3);
					extendNative(globalContext[name], opts.methods, true, opts.last);
					return sugarNamespace;
				});
				/***
				* @method defineInstancePolyfill(methods)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Defines instance methods that are mapped onto the native prototype
				*        if they do not already exist.
				* @extra Intended only for use creating polyfills that follow the ECMAScript
				*        spec. Accepts either a single object mapping names to functions, or
				*        name and function as two arguments. This method differs from
				*        `defineInstance` as there is no static signature (as the method
				*        is mapped as-is to the native), so it should refer to its `this`
				*        object. Note that polyfill methods will be immediately mapped onto
				*        their native prototype regardless of the use of `extend`.
				*
				* @example
				*
				*   Sugar.Array.defineInstancePolyfill({
				*     indexOf: function (arr, el) {
				*       // index finding code here!
				*     }
				*   });
				*
				* @signature defineInstancePolyfill(methodName, methodFn)
				* @param {Object} methods - Methods to be defined.
				* @param {string} methodName - Name of a single method to be defined.
				* @param {Function} methodFn - Function body of a single method to be defined.
				***/
				setProperty(sugarNamespace, "defineInstancePolyfill", function(arg1, arg2, arg3) {
					var opts = collectDefineOptions(arg1, arg2, arg3);
					extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
					forEachProperty(opts.methods, function(fn, methodName) {
						defineChainableMethod(sugarNamespace, methodName, fn);
					});
					return sugarNamespace;
				});
				/***
				* @method alias(toName, from)
				* @returns SugarNamespace
				* @namespace SugarNamespace
				* @short Aliases one Sugar method to another.
				*
				* @example
				*
				*   Sugar.Array.alias('all', 'every');
				*
				* @signature alias(toName, fn)
				* @param {string} toName - Name for new method.
				* @param {string|Function} from - Method to alias, or string shortcut.
				***/
				setProperty(sugarNamespace, "alias", function(name, source) {
					setMethod(sugarNamespace, name, typeof source === "string" ? sugarNamespace[source] : source);
					return sugarNamespace;
				});
				setProperty(sugarNamespace, "extend", extend);
				namespacesByName[name] = sugarNamespace;
				namespacesByClassString["[object " + name + "]"] = sugarNamespace;
				mapNativeToChainable(name);
				mapObjectChainablesToNamespace(sugarNamespace);
				return Sugar[name] = sugarNamespace;
			}
			function setGlobalProperties() {
				setProperty(Sugar, "VERSION", "2.0.6");
				setProperty(Sugar, "extend", Sugar);
				setProperty(Sugar, "toString", toString);
				setProperty(Sugar, "createNamespace", createNamespace);
				setProperty(Sugar, "util", {
					"hasOwn": hasOwn,
					"getOwn": getOwn,
					"setProperty": setProperty,
					"classToString": classToString,
					"defineProperty": defineProperty,
					"forEachProperty": forEachProperty,
					"mapNativeToChainable": mapNativeToChainable
				});
			}
			function toString() {
				return SUGAR_GLOBAL;
			}
			function defineMethods(sugarNamespace, methods, type, args, flags) {
				forEachProperty(methods, function(method, methodName) {
					var instanceMethod, staticMethod = method;
					if (args) staticMethod = wrapMethodWithArguments(method);
					if (flags) staticMethod.flags = flags;
					if (type & INSTANCE && !method.instance) {
						instanceMethod = wrapInstanceMethod(method, args);
						setProperty(staticMethod, "instance", instanceMethod);
					}
					if (type & STATIC) setProperty(staticMethod, "static", true);
					setMethod(sugarNamespace, methodName, staticMethod);
					if (sugarNamespace.active) sugarNamespace.extend(methodName);
				});
			}
			function collectDefineOptions(arg1, arg2, arg3) {
				var methods, last;
				if (typeof arg1 === "string") {
					methods = {};
					methods[arg1] = arg2;
					last = arg3;
				} else {
					methods = arg1;
					last = arg2;
				}
				return {
					last,
					methods
				};
			}
			function wrapInstanceMethod(fn, args) {
				return args ? wrapMethodWithArguments(fn, true) : wrapInstanceMethodFixed(fn);
			}
			function wrapMethodWithArguments(fn, instance) {
				var startCollect = fn.length - 1 - (instance ? 1 : 0);
				return function() {
					var args = [], collectedArgs = [], len;
					if (instance) args.push(this);
					len = Math.max(arguments.length, startCollect);
					for (var i = 0; i < len; i++) if (i < startCollect) args.push(arguments[i]);
					else collectedArgs.push(arguments[i]);
					args.push(collectedArgs);
					return fn.apply(this, args);
				};
			}
			function wrapInstanceMethodFixed(fn) {
				switch (fn.length) {
					case 0:
					case 1: return function() {
						return fn(this);
					};
					case 2: return function(a) {
						return fn(this, a);
					};
					case 3: return function(a, b) {
						return fn(this, a, b);
					};
					case 4: return function(a, b, c) {
						return fn(this, a, b, c);
					};
					case 5: return function(a, b, c, d) {
						return fn(this, a, b, c, d);
					};
				}
			}
			function extendNative(target, source, polyfill, override) {
				forEachProperty(source, function(method, name) {
					if (polyfill && !override && target[name]) return;
					setProperty(target, name, method);
				});
			}
			function setMethod(sugarNamespace, methodName, method) {
				sugarNamespace[methodName] = method;
				if (method.instance) defineChainableMethod(sugarNamespace, methodName, method.instance, true);
			}
			function getNewChainableClass(name) {
				var fn = function SugarChainable(obj, arg) {
					if (!(this instanceof fn)) return new fn(obj, arg);
					if (this.constructor !== fn) obj = this.constructor.apply(obj, arguments);
					this.raw = obj;
				};
				setProperty(fn, "toString", function() {
					return SUGAR_GLOBAL + name;
				});
				setProperty(fn.prototype, "valueOf", function() {
					return this.raw;
				});
				return fn;
			}
			function defineChainableMethod(sugarNamespace, methodName, fn) {
				var wrapped = wrapWithChainableResult(fn), existing, collision, dcp = DefaultChainable.prototype;
				existing = dcp[methodName];
				collision = existing && existing !== Object.prototype[methodName];
				if (!existing || !existing.disambiguate) dcp[methodName] = collision ? disambiguateMethod(methodName) : wrapped;
				sugarNamespace.prototype[methodName] = wrapped;
				if (sugarNamespace === Sugar.Object) mapObjectChainableToAllNamespaces(methodName, wrapped);
			}
			function mapObjectChainablesToNamespace(sugarNamespace) {
				forEachProperty(Sugar.Object && Sugar.Object.prototype, function(val, methodName) {
					if (typeof val === "function") setObjectChainableOnNamespace(sugarNamespace, methodName, val);
				});
			}
			function mapObjectChainableToAllNamespaces(methodName, fn) {
				forEachProperty(namespacesByName, function(sugarNamespace) {
					setObjectChainableOnNamespace(sugarNamespace, methodName, fn);
				});
			}
			function setObjectChainableOnNamespace(sugarNamespace, methodName, fn) {
				var proto = sugarNamespace.prototype;
				if (!hasOwn(proto, methodName)) proto[methodName] = fn;
			}
			function wrapWithChainableResult(fn) {
				return function() {
					return new DefaultChainable(fn.apply(this.raw, arguments));
				};
			}
			function disambiguateMethod(methodName) {
				var fn = function() {
					var raw = this.raw, sugarNamespace;
					if (raw != null) sugarNamespace = namespacesByClassString[classToString(raw)];
					if (!sugarNamespace) sugarNamespace = Sugar.Object;
					return new sugarNamespace(raw)[methodName].apply(this, arguments);
				};
				fn.disambiguate = true;
				return fn;
			}
			function mapNativeToChainable(name, methodNames) {
				var sugarNamespace = namespacesByName[name], nativeProto = globalContext[name].prototype;
				if (!methodNames && ownPropertyNames) methodNames = ownPropertyNames(nativeProto);
				forEachProperty(methodNames, function(methodName) {
					if (nativeMethodProhibited(methodName)) return;
					try {
						var fn = nativeProto[methodName];
						if (typeof fn !== "function") return;
					} catch (e) {
						return;
					}
					defineChainableMethod(sugarNamespace, methodName, fn);
				});
			}
			function nativeMethodProhibited(methodName) {
				return methodName === "constructor" || methodName === "valueOf" || methodName === "__proto__";
			}
			var ownPropertyNames = Object.getOwnPropertyNames, internalToString = Object.prototype.toString, internalHasOwnProperty = Object.prototype.hasOwnProperty;
			var forEachProperty = function(obj, fn) {
				for (var key in obj) {
					if (!hasOwn(obj, key)) continue;
					if (fn.call(obj, obj[key], key, obj) === false) break;
				}
			};
			// istanbul ignore next
			function definePropertyShim(obj, prop, descriptor) {
				obj[prop] = descriptor.value;
			}
			function setProperty(target, name, value, enumerable) {
				defineProperty(target, name, {
					value,
					enumerable: !!enumerable,
					configurable: true,
					writable: true
				});
			}
			function classToString(obj) {
				return internalToString.call(obj);
			}
			function hasOwn(obj, prop) {
				return !!obj && internalHasOwnProperty.call(obj, prop);
			}
			function getOwn(obj, prop) {
				if (hasOwn(obj, prop)) return obj[prop];
			}
			setupGlobal();
			var NATIVE_TYPES = "Boolean Number String Date RegExp Function Array Error Set Map";
			var NO_KEYS_IN_STRING_OBJECTS = !("0" in Object("a"));
			var PRIVATE_PROP_PREFIX = "_sugar_";
			var TRIM_CHARS = "	\n\v\f\r \xA0 ᠎             \u2028\u2029　﻿", HALF_WIDTH_ZERO = 48, FULL_WIDTH_ZERO = 65296, HALF_WIDTH_PERIOD = ".", FULL_WIDTH_PERIOD = "．", HALF_WIDTH_COMMA = ",", sugarObject = Sugar.Object, sugarArray = Sugar.Array, sugarDate = Sugar.Date, sugarString = Sugar.String;
			Sugar.Number;
			var sugarFunction = Sugar.Function;
			Sugar.RegExp;
			var isString, isFunction, isArray;
			function buildClassChecks() {
				var knownTypes = {};
				function addCoreTypes() {
					var names = spaceSplit(NATIVE_TYPES);
					buildPrimitiveClassCheck(names[0]);
					buildPrimitiveClassCheck(names[1]);
					isString = buildPrimitiveClassCheck(names[2]);
					buildClassCheck(names[3]);
					buildClassCheck(names[4]);
					isFunction = buildClassCheck(names[5]);
					// istanbul ignore next
					isArray = Array.isArray || buildClassCheck(names[6]);
					buildClassCheck(names[7]);
					buildClassCheck(names[8], typeof Set !== "undefined" && Set);
					buildClassCheck(names[9], typeof Map !== "undefined" && Map);
					addKnownType("Arguments");
					addKnownType(names[0]);
					addKnownType(names[1]);
					addKnownType(names[2]);
					addKnownType(names[3]);
					addKnownType(names[4]);
					addKnownType(names[6]);
				}
				function addArrayTypes() {
					forEach(spaceSplit("Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64"), function(str) {
						addKnownType(str + "Array");
					});
				}
				function addKnownType(className) {
					var str = "[object " + className + "]";
					knownTypes[str] = true;
				}
				function buildClassCheck(className, globalObject) {
					// istanbul ignore if
					if (globalObject && isClass(new globalObject(), "Object")) return getConstructorClassCheck(globalObject);
					else return getToStringClassCheck(className);
				}
				// istanbul ignore next
				function getConstructorClassCheck(obj) {
					var ctorStr = String(obj);
					return function(obj) {
						return String(obj.constructor) === ctorStr;
					};
				}
				function getToStringClassCheck(className) {
					return function(obj, str) {
						return isClass(obj, className, str);
					};
				}
				function buildPrimitiveClassCheck(className) {
					var type = className.toLowerCase();
					return function(obj) {
						var t = typeof obj;
						return t === type || t === "object" && isClass(obj, className);
					};
				}
				addCoreTypes();
				addArrayTypes();
			}
			function isClass(obj, className, str) {
				if (!str) str = classToString(obj);
				return str === "[object " + className + "]";
			}
			function wrapNamespace(method) {
				return function(sugarNamespace, arg1, arg2) {
					sugarNamespace[method](arg1, arg2);
				};
			}
			var defineStaticPolyfill = wrapNamespace("defineStaticPolyfill"), defineInstancePolyfill = wrapNamespace("defineInstancePolyfill");
			function assertCallable(obj) {
				if (!isFunction(obj)) throw new TypeError("Function is not callable");
			}
			function isDefined(o) {
				return o !== void 0;
			}
			function privatePropertyAccessor(key) {
				var privateKey = PRIVATE_PROP_PREFIX + key;
				return function(obj, val) {
					if (arguments.length > 1) {
						setProperty(obj, privateKey, val);
						return obj;
					}
					return obj[privateKey];
				};
			}
			function isPrimitive(obj, type) {
				type = type || typeof obj;
				return obj == null || type === "string" || type === "number" || type === "boolean";
			}
			function coercePrimitiveToObject(obj) {
				if (isPrimitive(obj)) obj = Object(obj);
				// istanbul ignore next
				if (NO_KEYS_IN_STRING_OBJECTS && isString(obj)) forceStringCoercion(obj);
				return obj;
			}
			// istanbul ignore next
			function forceStringCoercion(obj) {
				var i = 0, chr;
				while (chr = obj.charAt(i)) obj[i++] = chr;
			}
			function isArrayIndex(n) {
				return n >>> 0 == n && n != 4294967295;
			}
			function iterateOverSparseArray(arr, fn, fromIndex, loop) {
				var indexes = getSparseArrayIndexes(arr, fromIndex, loop), index;
				for (var i = 0, len = indexes.length; i < len; i++) {
					index = indexes[i];
					fn.call(arr, arr[index], index, arr);
				}
				return arr;
			}
			function getSparseArrayIndexes(arr, fromIndex, loop, fromRight) {
				var indexes = [], i;
				for (i in arr)
 // istanbul ignore next
				if (isArrayIndex(i) && (loop || (fromRight ? i <= fromIndex : i >= fromIndex))) indexes.push(+i);
				indexes.sort(function(a, b) {
					var aLoop = a > fromIndex;
					// istanbul ignore if
					if (aLoop !== b > fromIndex) return aLoop ? -1 : 1;
					return a - b;
				});
				return indexes;
			}
			function spaceSplit(str) {
				return str.split(" ");
			}
			function forEach(arr, fn) {
				for (var i = 0, len = arr.length; i < len; i++) {
					if (!(i in arr)) return iterateOverSparseArray(arr, fn, i);
					fn(arr[i], i);
				}
			}
			// istanbul ignore next
			var trunc = Math.trunc || function(n) {
				if (n === 0 || !isFinite(n)) return n;
				return n < 0 ? ceil(n) : floor(n);
			};
			function padNumber(num, place, sign, base, replacement) {
				var str = abs(num).toString(base || 10);
				str = repeatString(replacement || "0", place - str.replace(/\.\d+/, "").length) + str;
				if (sign || num < 0) str = (num < 0 ? "-" : "+") + str;
				return str;
			}
			var fullWidthNumberMap;
			function buildFullWidthNumber() {
				var fwp = FULL_WIDTH_PERIOD, hwp = HALF_WIDTH_PERIOD, hwc = HALF_WIDTH_COMMA, fwn = "";
				fullWidthNumberMap = {};
				for (var i = 0, digit; i <= 9; i++) {
					digit = chr(i + FULL_WIDTH_ZERO);
					fwn += digit;
					fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
				}
				fullWidthNumberMap[hwc] = "";
				fullWidthNumberMap[fwp] = hwp;
				fullWidthNumberMap[hwp] = hwp;
				allCharsReg(fwn + fwp + hwc + hwp);
			}
			var abs = Math.abs, ceil = Math.ceil, floor = Math.floor;
			var chr = String.fromCharCode;
			function repeatString(str, num) {
				var result = "";
				str = str.toString();
				while (num > 0) {
					if (num & 1) result += str;
					if (num >>= 1) str += str;
				}
				return result;
			}
			function allCharsReg(src) {
				return RegExp("[" + src + "]", "g");
			}
			privatePropertyAccessor("utc");
			buildClassChecks();
			buildFullWidthNumber();
			/***
			* @module ES5
			* @description Functions and polyfill methods that fix ES5 functionality. This
			*              module is excluded from default builds, and can be included if
			*              you need legacy browser support (IE8 and below).
			*
			***/
			var DONT_ENUM_PROPS = [
				"valueOf",
				"toString",
				"constructor",
				"isPrototypeOf",
				"hasOwnProperty",
				"toLocaleString",
				"propertyIsEnumerable"
			];
			/***
			* @fix
			* @short Fixes DontEnum bug for iteration methods in < IE9.
			***/
			function buildDontEnumFix() {
				if (!{ toString: 1 }.propertyIsEnumerable("toString")) {
					var forEachEnumerableProperty = forEachProperty;
					forEachProperty = function(obj, fn) {
						forEachEnumerableProperty(obj, fn);
						for (var i = 0, key; key = DONT_ENUM_PROPS[i]; i++) if (hasOwn(obj, key)) {
							if (fn.call(obj, obj[key], key, obj) === false) break;
						}
					};
				}
			}
			/***
			* @fix
			* @short Adds native methods to chainables in < IE9.
			***/
			function buildChainableNativeMethodsFix() {
				if (!Object.getOwnPropertyNames) defineNativeMethodsOnChainable();
			}
			function defineNativeMethodsOnChainable() {
				var nativeTokens = {
					"Function": "apply,call",
					"RegExp": "compile,exec,test",
					"Number": "toExponential,toFixed,toLocaleString,toPrecision",
					"Object": "hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString",
					"Array": "concat,join,pop,push,reverse,shift,slice,sort,splice,toLocaleString,unshift",
					"Date": "getTime,getTimezoneOffset,setTime,toDateString,toGMTString,toLocaleDateString,toLocaleString,toLocaleTimeString,toTimeString,toUTCString",
					"String": "anchor,big,blink,bold,charAt,charCodeAt,concat,fixed,fontcolor,fontsize,indexOf,italics,lastIndexOf,link,localeCompare,match,replace,search,slice,small,split,strike,sub,substr,substring,sup,toLocaleLowerCase,toLocaleUpperCase,toLowerCase,toUpperCase"
				};
				var dateTokens = "FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds".split(",");
				function addDateTokens(prefix, arr) {
					for (var i = 0; i < dateTokens.length; i++) arr.push(prefix + dateTokens[i]);
				}
				forEachProperty(nativeTokens, function(str, name) {
					var tokens = str.split(",");
					if (name === "Date") {
						addDateTokens("get", tokens);
						addDateTokens("set", tokens);
						addDateTokens("getUTC", tokens);
						addDateTokens("setUTC", tokens);
					}
					tokens.push("toString");
					mapNativeToChainable(name, tokens);
				});
			}
			buildDontEnumFix();
			buildChainableNativeMethodsFix();
			/*** @namespace Object ***/
			function assertNonNull(obj) {
				if (obj == null) throw new TypeError("Object required");
			}
			defineStaticPolyfill(sugarObject, { "keys": function(obj) {
				var keys = [];
				assertNonNull(obj);
				forEachProperty(coercePrimitiveToObject(obj), function(val, key) {
					keys.push(key);
				});
				return keys;
			} });
			/*** @namespace Array ***/
			function arrayIndexOf(arr, search, fromIndex, fromRight) {
				var length = arr.length, defaultFromIndex, index, increment = fromRight ? -1 : 1;
				defaultFromIndex = fromRight ? length - 1 : 0;
				fromIndex = trunc(fromIndex);
				if (!fromIndex && fromIndex !== 0) fromIndex = defaultFromIndex;
				if (fromIndex < 0) fromIndex = length + fromIndex;
				if (!fromRight && fromIndex < 0 || fromRight && fromIndex >= length) fromIndex = defaultFromIndex;
				index = fromIndex;
				while (fromRight && index >= 0 || !fromRight && index < length) {
					if (!(index in arr)) return sparseIndexOf(arr, search, fromIndex, fromRight);
					if (isArrayIndex(index) && arr[index] === search) return index;
					index += increment;
				}
				return -1;
			}
			function sparseIndexOf(arr, search, fromIndex, fromRight) {
				var indexes = getSparseArrayIndexes(arr, fromIndex, false, fromRight), index;
				indexes.sort(function(a, b) {
					return fromRight ? b - a : a - b;
				});
				while ((index = indexes.shift()) !== void 0) if (arr[index] === search) return +index;
				return -1;
			}
			function arrayReduce(arr, fn, initialValue, fromRight) {
				var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
				assertCallable(fn);
				if (length == 0 && !defined) throw new TypeError("Reduce called on empty array with no initial value");
				else if (defined) result = initialValue;
				else {
					result = arr[fromRight ? length - 1 : count];
					count++;
				}
				while (count < length) {
					index = fromRight ? length - count - 1 : count;
					if (index in arr) result = fn(result, arr[index], index, arr);
					count++;
				}
				return result;
			}
			defineStaticPolyfill(sugarArray, { 
			/***
			*
			* @method isArray(obj)
			* @returns Boolean
			* @polyfill ES5
			* @static
			* @short Returns true if `obj` is an Array.
			*
			* @example
			*
			*   Array.isArray(3)        -> false
			*   Array.isArray(true)     -> false
			*   Array.isArray('wasabi') -> false
			*   Array.isArray([1,2,3])  -> true
			*
			***/
"isArray": function(obj) {
				return isArray(obj);
			} });
			defineInstancePolyfill(sugarArray, {
				"every": function(fn) {
					arguments.length;
					var context = arguments[1];
					var length = this.length, index = 0;
					assertCallable(fn);
					while (index < length) {
						if (index in this && !fn.call(context, this[index], index, this)) return false;
						index++;
					}
					return true;
				},
				"some": function(fn) {
					arguments.length;
					var context = arguments[1];
					var length = this.length, index = 0;
					assertCallable(fn);
					while (index < length) {
						if (index in this && fn.call(context, this[index], index, this)) return true;
						index++;
					}
					return false;
				},
				"map": function(fn) {
					arguments.length;
					var context = arguments[1];
					var length = this.length, index = 0, result = new Array(length);
					assertCallable(fn);
					while (index < length) {
						if (index in this) result[index] = fn.call(context, this[index], index, this);
						index++;
					}
					return result;
				},
				"filter": function(fn) {
					arguments.length;
					var context = arguments[1];
					var length = this.length, index = 0, result = [];
					assertCallable(fn);
					while (index < length) {
						if (index in this && fn.call(context, this[index], index, this)) result.push(this[index]);
						index++;
					}
					return result;
				},
				/***
				* @method indexOf(search, [fromIndex] = 0)
				* @returns Number
				* @polyfill ES5
				* @short Searches the array and returns the first index where `search` occurs,
				*        or `-1` if the element is not found.
				* @extra [fromIndex] is the index from which to begin the search. This
				*        method performs a simple strict equality comparison on `search`.
				*        Sugar does not enhance this method to support `enhanced matching`.
				*        For such functionality, use the `findIndex` method instead.
				*
				* @example
				*
				*   [1,2,3].indexOf(3) -> 1
				*   [1,2,3].indexOf(7) -> -1
				*
				***/
				"indexOf": function(search) {
					arguments.length;
					var fromIndex = arguments[1];
					if (isString(this)) return this.indexOf(search, fromIndex);
					return arrayIndexOf(this, search, fromIndex);
				},
				/***
				* @method lastIndexOf(search, [fromIndex] = array.length - 1)
				* @returns Number
				* @polyfill ES5
				* @short Searches the array from the end and returns the first index where
				*        `search` occurs, or `-1` if the element is not found.
				* @extra [fromIndex] is the index from which to begin the search. This method
				*        performs a simple strict equality comparison on `search`.
				*        Sugar does not enhance this method to support `enhanced matching`.
				*
				* @example
				*
				*   [1,2,1].lastIndexOf(1) -> 2
				*   [1,2,1].lastIndexOf(7) -> -1
				*
				***/
				"lastIndexOf": function(search) {
					arguments.length;
					var fromIndex = arguments[1];
					if (isString(this)) return this.lastIndexOf(search, fromIndex);
					return arrayIndexOf(this, search, fromIndex, true);
				},
				/***
				* @method forEach([eachFn], [context])
				* @polyfill ES5
				* @short Iterates over the array, calling [eachFn] on each loop.
				* @extra [context] becomes the `this` object.
				*
				* @callback eachFn
				*
				*   el   The element of the current iteration.
				*   i    The index of the current iteration.
				*   arr  A reference to the array.
				*
				* @example
				*
				*   ['a','b','c'].forEach(function(a) {
				*     // Called 3 times: 'a','b','c'
				*   });
				*
				***/
				"forEach": function(eachFn) {
					arguments.length;
					var context = arguments[1];
					var length = this.length, index = 0;
					assertCallable(eachFn);
					while (index < length) {
						if (index in this) eachFn.call(context, this[index], index, this);
						index++;
					}
				},
				/***
				* @method reduce(reduceFn, [init])
				* @returns Mixed
				* @polyfill ES5
				* @short Reduces the array to a single result.
				* @extra This operation is sometimes called "accumulation", as it takes the
				*        result of the last iteration of `reduceFn` and passes it as the first
				*        argument to the next iteration, "accumulating" that value as it goes.
				*        The return value of this method will be the return value of the final
				*        iteration of `reduceFn`. If [init] is passed, it will be the initial
				*        "accumulator" (the first argument). If [init] is not passed, then it
				*        will take the first element in the array, and `reduceFn` will not be
				*        called for that element.
				*
				* @callback reduceFn
				*
				*   acc  The "accumulator". Either [init], the result of the last iteration
				*        of `reduceFn`, or the first element of the array.
				*   el   The current element for this iteration.
				*   idx  The current index for this iteration.
				*   arr  A reference to the array.
				*
				* @example
				*
				*   [1,2,3].reduce(function(a, b) {
				*     return a - b; // 1 - 2 - 3
				*   });
				*
				*   [1,2,3].reduce(function(a, b) {
				*     return a - b; // 100 - 1 - 2 - 3
				*   }, 100);
				*
				***/
				"reduce": function(reduceFn) {
					arguments.length;
					var context = arguments[1];
					return arrayReduce(this, reduceFn, context);
				},
				/***
				* @method reduceRight([reduceFn], [init])
				* @returns Mixed
				* @polyfill ES5
				* @short Similar to `Array#reduce`, but operates on the elements in reverse.
				*
				* @callback reduceFn
				*
				*   acc  The "accumulator", either [init], the result of the last iteration
				*        of `reduceFn`, or the last element of the array.
				*   el   The current element for this iteration.
				*   idx  The current index for this iteration.
				*   arr  A reference to the array.
				*
				* @example
				*
				*   [1,2,3].reduceRight(function(a, b) {
				*     return a - b; // 3 - 2 - 1
				*   });
				*
				*   [1,2,3].reduceRight(function(a, b) {
				*     return a - b; // 100 - 3 - 2 - 1
				*   }, 100);
				*
				*
				***/
				"reduceRight": function(reduceFn) {
					arguments.length;
					var context = arguments[1];
					return arrayReduce(this, reduceFn, context, true);
				}
			});
			/*** @namespace String ***/
			var TRIM_REG = RegExp("^[" + TRIM_CHARS + "]+|[" + TRIM_CHARS + "]+$", "g");
			defineInstancePolyfill(sugarString, { 
			/***
			* @method trim()
			* @returns String
			* @polyfill ES5
			* @short Removes leading and trailing whitespace from the string.
			* @extra Whitespace is defined as line breaks, tabs, and any character in the
			*        "Space, Separator" Unicode category, conforming to the the ES5 spec.
			*
			* @example
			*
			*   '   wasabi   '.trim()      -> 'wasabi'
			*   '   wasabi   '.trimLeft()  -> 'wasabi   '
			*   '   wasabi   '.trimRight() -> '   wasabi'
			*
			***/
"trim": function() {
				return this.toString().replace(TRIM_REG, "");
			} });
			/*** @namespace Function ***/
			defineInstancePolyfill(sugarFunction, { 
			/***
			* @method bind(context, [arg1], ...)
			* @returns Function
			* @polyfill ES5
			* @short Binds `context` as the `this` object for the function when it is
			*        called. Also allows currying an unlimited number of parameters.
			* @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of
			*        time so that they are passed when the function is called later. If
			*        you pass additional parameters when the function is actually called,
			*        they will be added to the end of the curried parameters.
			*
			* @example
			*
			*   logThis.bind('woof')()   -> logs 'woof' as its this object
			*   addArgs.bind(1, 2, 3)()  -> returns 5 with 1 as the this object
			*   addArgs.bind(1)(2, 3, 4) -> returns 9
			*
			***/
"bind": function(context) {
				var boundArgs = [];
				for (var $i = 1, $len = arguments.length; $i < $len; $i++) boundArgs.push(arguments[$i]);
				var fn = this, bound;
				assertCallable(this);
				bound = function() {
					var args = [];
					for (var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
					return fn.apply(fn.prototype && this instanceof fn ? this : context, boundArgs.concat(args));
				};
				bound.prototype = this.prototype;
				return bound;
			} });
			/*** @namespace Date ***/
			defineStaticPolyfill(sugarDate, { 
			/***
			* @method now()
			* @returns String
			* @polyfill ES5
			* @static
			* @short Returns the current time as a Unix timestamp.
			* @extra The number of milliseconds since January 1st, 1970 00:00:00 (UTC).
			*
			* @example
			*
			*   Date.now() -> ex. 1311938296231
			*
			***/
"now": function() {
				return (/* @__PURE__ */ new Date()).getTime();
			} });
			function hasISOSupport() {
				var d = new Date(Date.UTC(2e3, 0));
				return !!d.toISOString && d.toISOString() === "2000-01-01T00:00:00.000Z";
			}
			defineInstancePolyfill(sugarDate, {
				/***
				* @method toISOString()
				* @returns String
				* @polyfill ES5
				* @short Formats the string to ISO8601 format.
				* @extra This will always format as UTC time.
				*
				* @example
				*
				*   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
				*
				***/
				"toISOString": function() {
					return padNumber(this.getUTCFullYear(), 4) + "-" + padNumber(this.getUTCMonth() + 1, 2) + "-" + padNumber(this.getUTCDate(), 2) + "T" + padNumber(this.getUTCHours(), 2) + ":" + padNumber(this.getUTCMinutes(), 2) + ":" + padNumber(this.getUTCSeconds(), 2) + "." + padNumber(this.getUTCMilliseconds(), 3) + "Z";
				},
				/***
				* @method toJSON([key])
				* @returns String
				* @polyfill ES5
				* @short Returns a JSON representation of the date.
				* @extra This is effectively an alias for `toISOString`. Will always return
				*        the date in UTC time. [key] is ignored.
				*
				* @example
				*
				*   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
				*
				***/
				"toJSON": function(key) {
					arguments.length;
					return this.toISOString(key);
				}
			}, !hasISOSupport());
		}).call(exports);
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/EnglishLocaleBaseDefinition.js
	var require_EnglishLocaleBaseDefinition = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			"code": "en",
			"plural": true,
			"timeMarkers": "at",
			"ampm": "AM|A.M.|a,PM|P.M.|p",
			"units": "millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s",
			"months": "Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|",
			"weekdays": "Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|+weekend",
			"numerals": "zero,one|first,two|second,three|third,four:|th,five|fifth,six:|th,seven:|th,eight:|h,nin:e|th,ten:|th",
			"articles": "a,an,the",
			"tokens": "the,st|nd|rd|th,of|in,a|an,on",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{num} {unit} {sign}",
			"duration": "{num} {unit}",
			"modifiers": [
				{
					"name": "half",
					"src": "half",
					"value": .5
				},
				{
					"name": "midday",
					"src": "noon",
					"value": 12
				},
				{
					"name": "midday",
					"src": "midnight",
					"value": 24
				},
				{
					"name": "day",
					"src": "yesterday",
					"value": -1
				},
				{
					"name": "day",
					"src": "today|tonight",
					"value": 0
				},
				{
					"name": "day",
					"src": "tomorrow",
					"value": 1
				},
				{
					"name": "sign",
					"src": "ago|before",
					"value": -1
				},
				{
					"name": "sign",
					"src": "from now|after|from|in|later",
					"value": 1
				},
				{
					"name": "edge",
					"src": "first day|first|beginning",
					"value": -2
				},
				{
					"name": "edge",
					"src": "last day",
					"value": 1
				},
				{
					"name": "edge",
					"src": "end|last",
					"value": 2
				},
				{
					"name": "shift",
					"src": "last",
					"value": -1
				},
				{
					"name": "shift",
					"src": "the|this",
					"value": 0
				},
				{
					"name": "shift",
					"src": "next",
					"value": 1
				}
			],
			"parse": [
				"(?:just)? now",
				"{shift} {unit:5-7}",
				"{months?} {year}",
				"{midday} {4?} {day|weekday}",
				"{months},?[-.\\/\\s]?{year?}",
				"{edge} of (?:day)? {day|weekday}",
				"{0} {num}{1?} {weekday} {2} {months},? {year?}",
				"{shift?} {day?} {weekday?} (?:at)? {midday}",
				"{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}",
				"{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {months?},? {year?}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift} {unit:5?} {weekday}",
				"{0?} {date}{1?} {2?} {months?}",
				"{weekday} {2?} {shift} {unit:5}",
				"{0?} {num} {2?} {months}\\.?,? {year?}",
				"{num?} {unit:4-5} {sign} {day|weekday}",
				"{0|months} {date?}{1?} of {shift} {unit:6-7}",
				"{0?} {num}{1?} {weekday} of {shift} {unit:6}",
				"{year?}[-.\\/\\s]?{months}[-.\\/\\s]{date}",
				"{date}[-.\\/\\s]{months}(?:[-.\\/\\s]{year|yy})?",
				"{weekday?}\\.?,? {months}\\.?,? {date}{1?},? {year?}",
				"{weekday?}\\.?,? {date} {months} {year}"
			],
			"timeFrontParse": [
				"{sign} {num} {unit}",
				"{num} {unit} {sign}",
				"{4?} {day|weekday}"
			]
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/coreUtilityAliases.js
	var require_coreUtilityAliases = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		module.exports = {
			hasOwn: Sugar.util.hasOwn,
			getOwn: Sugar.util.getOwn,
			setProperty: Sugar.util.setProperty,
			classToString: Sugar.util.classToString,
			defineProperty: Sugar.util.defineProperty,
			forEachProperty: Sugar.util.forEachProperty,
			mapNativeToChainable: Sugar.util.mapNativeToChainable
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/simpleMerge.js
	var require_simpleMerge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var forEachProperty = require_coreUtilityAliases().forEachProperty;
		function simpleMerge(target, source) {
			forEachProperty(source, function(val, key) {
				target[key] = val;
			});
			return target;
		}
		module.exports = simpleMerge;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/simpleClone.js
	var require_simpleClone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var simpleMerge = require_simpleMerge();
		function simpleClone(obj) {
			return simpleMerge({}, obj);
		}
		module.exports = simpleClone;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getEnglishVariant.js
	var require_getEnglishVariant = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var EnglishLocaleBaseDefinition = require_EnglishLocaleBaseDefinition();
		var simpleMerge = require_simpleMerge();
		var simpleClone = require_simpleClone();
		function getEnglishVariant(v) {
			return simpleMerge(simpleClone(EnglishLocaleBaseDefinition), v);
		}
		module.exports = getEnglishVariant;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/BritishEnglishDefinition.js
	var require_BritishEnglishDefinition = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = require_getEnglishVariant()({
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} {Month} {yyyy}",
			"long": "{d} {Month} {yyyy} {H}:{mm}",
			"full": "{Weekday}, {d} {Month}, {yyyy} {time}",
			"stamp": "{Dow} {d} {Mon} {yyyy} {time}"
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/AmericanEnglishDefinition.js
	var require_AmericanEnglishDefinition = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = require_getEnglishVariant()({
			"mdy": true,
			"firstDayOfWeek": 0,
			"firstDayOfWeekYear": 1,
			"short": "{MM}/{dd}/{yyyy}",
			"medium": "{Month} {d}, {yyyy}",
			"long": "{Month} {d}, {yyyy} {time}",
			"full": "{Weekday}, {Month} {d}, {yyyy} {time}",
			"stamp": "{Dow} {Mon} {d} {yyyy} {time}",
			"time": "{h}:{mm} {TT}"
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/CanadianEnglishDefinition.js
	var require_CanadianEnglishDefinition = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = require_getEnglishVariant()({
			"short": "{yyyy}-{MM}-{dd}",
			"medium": "{d} {Month}, {yyyy}",
			"long": "{d} {Month}, {yyyy} {H}:{mm}",
			"full": "{Weekday}, {d} {Month}, {yyyy} {time}",
			"stamp": "{Dow} {d} {Mon} {yyyy} {time}"
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/LazyLoadedLocales.js
	var require_LazyLoadedLocales = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var BritishEnglishDefinition = require_BritishEnglishDefinition();
		module.exports = {
			"en-US": require_AmericanEnglishDefinition(),
			"en-GB": BritishEnglishDefinition,
			"en-AU": BritishEnglishDefinition,
			"en-CA": require_CanadianEnglishDefinition()
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/LOCALE_ARRAY_FIELDS.js
	var require_LOCALE_ARRAY_FIELDS = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = [
			"months",
			"weekdays",
			"units",
			"numerals",
			"placeholders",
			"articles",
			"tokens",
			"timeMarkers",
			"ampm",
			"timeSuffixes",
			"parse",
			"timeParse",
			"timeFrontParse",
			"modifiers"
		];
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/ISODefaults.js
	var require_ISODefaults = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			ISO_FIRST_DAY_OF_WEEK: 1,
			ISO_FIRST_DAY_OF_WEEK_YEAR: 4
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/CoreParsingTokens.js
	var require_CoreParsingTokens = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			"yyyy": {
				param: "year",
				src: "[-−+]?\\d{4,6}"
			},
			"yy": {
				param: "year",
				src: "\\d{2}"
			},
			"y": {
				param: "year",
				src: "\\d"
			},
			"ayy": {
				param: "year",
				src: "'\\d{2}"
			},
			"MM": {
				param: "month",
				src: "(?:1[012]|0?[1-9])"
			},
			"dd": {
				param: "date",
				src: "(?:3[01]|[12][0-9]|0?[1-9])"
			},
			"hh": {
				param: "hour",
				src: "(?:2[0-4]|[01]?[0-9])"
			},
			"mm": {
				param: "minute",
				src: "[0-5]\\d"
			},
			"ss": {
				param: "second",
				src: "[0-5]\\d(?:[,.]\\d+)?"
			},
			"tzHour": { src: "[-−+](?:2[0-4]|[01]?[0-9])" },
			"tzMinute": { src: "[0-5]\\d" },
			"iyyyy": {
				param: "year",
				src: "(?:[-−+]?\\d{4}|[-−+]\\d{5,6})"
			},
			"ihh": {
				param: "hour",
				src: "(?:2[0-4]|[01][0-9])(?:[,.]\\d+)?"
			},
			"imm": {
				param: "minute",
				src: "[0-5]\\d(?:[,.]\\d+)?"
			},
			"GMT": {
				param: "utc",
				src: "GMT"
			},
			"Z": {
				param: "utc",
				src: "Z"
			},
			"timestamp": { src: "\\d+" }
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/CoreParsingFormats.js
	var require_CoreParsingFormats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = [
			{ src: "{MM}[-.\\/]{yyyy}" },
			{
				time: true,
				src: "{dd}[-\\/]{MM}(?:[-\\/]{yyyy|yy|y})?",
				mdy: "{MM}[-\\/]{dd}(?:[-\\/]{yyyy|yy|y})?"
			},
			{
				time: true,
				src: "{dd}\\.{MM}(?:\\.{yyyy|yy|y})?",
				mdy: "{MM}\\.{dd}(?:\\.{yyyy|yy|y})?",
				localeCheck: function(loc) {
					return loc.timeSeparator !== ".";
				}
			},
			{
				time: true,
				src: "{yyyy}[-.\\/]{MM}(?:[-.\\/]{dd})?"
			},
			{ src: "\\\\/Date\\({timestamp}(?:[-+]\\d{4,4})?\\)\\\\/" },
			{ src: "{iyyyy}(?:-?{MM}(?:-?{dd}(?:T{ihh}(?::?{imm}(?::?{ss})?)?)?)?)?{tzOffset?}" }
		];
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/LocalizedParsingTokens.js
	var require_LocalizedParsingTokens = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			"year": {
				base: "yyyy|ayy",
				requiresSuffix: true
			},
			"month": {
				base: "MM",
				requiresSuffix: true
			},
			"date": {
				base: "dd",
				requiresSuffix: true
			},
			"hour": {
				base: "hh",
				requiresSuffixOr: ":"
			},
			"minute": { base: "mm" },
			"second": { base: "ss" },
			"num": {
				src: "\\d+",
				requiresNumerals: true
			}
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/map.js
	var require_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function map(arr, fn) {
			var result = [];
			for (var i = 0, len = arr.length; i < len; i++) if (i in arr) result.push(fn(arr[i], i));
			return result;
		}
		module.exports = map;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/filter.js
	var require_filter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function filter(arr, fn) {
			var result = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				var el = arr[i];
				if (i in arr && fn(el, i)) result.push(el);
			}
			return result;
		}
		module.exports = filter;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isArrayIndex.js
	var require_isArrayIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function isArrayIndex(n) {
			return n >>> 0 == n && n != 4294967295;
		}
		module.exports = isArrayIndex;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/getSparseArrayIndexes.js
	var require_getSparseArrayIndexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isArrayIndex = require_isArrayIndex();
		function getSparseArrayIndexes(arr, fromIndex, loop, fromRight) {
			var indexes = [], i;
			for (i in arr)
 // istanbul ignore next
			if (isArrayIndex(i) && (loop || (fromRight ? i <= fromIndex : i >= fromIndex))) indexes.push(+i);
			indexes.sort(function(a, b) {
				var aLoop = a > fromIndex;
				// istanbul ignore if
				if (aLoop !== b > fromIndex) return aLoop ? -1 : 1;
				return a - b;
			});
			return indexes;
		}
		module.exports = getSparseArrayIndexes;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/iterateOverSparseArray.js
	var require_iterateOverSparseArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getSparseArrayIndexes = require_getSparseArrayIndexes();
		function iterateOverSparseArray(arr, fn, fromIndex, loop) {
			var indexes = getSparseArrayIndexes(arr, fromIndex, loop), index;
			for (var i = 0, len = indexes.length; i < len; i++) {
				index = indexes[i];
				fn.call(arr, arr[index], index, arr);
			}
			return arr;
		}
		module.exports = iterateOverSparseArray;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/forEach.js
	var require_forEach = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var iterateOverSparseArray = require_iterateOverSparseArray();
		function forEach(arr, fn) {
			for (var i = 0, len = arr.length; i < len; i++) {
				if (!(i in arr)) return iterateOverSparseArray(arr, fn, i);
				fn(arr[i], i);
			}
		}
		module.exports = forEach;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isDefined.js
	var require_isDefined = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function isDefined(o) {
			return o !== void 0;
		}
		module.exports = isDefined;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/CommonChars.js
	var require_CommonChars = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			HALF_WIDTH_ZERO: 48,
			FULL_WIDTH_ZERO: 65296,
			HALF_WIDTH_PERIOD: ".",
			FULL_WIDTH_PERIOD: "．",
			HALF_WIDTH_COMMA: ",",
			OPEN_BRACE: "{",
			CLOSE_BRACE: "}"
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/commaSplit.js
	var require_commaSplit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var HALF_WIDTH_COMMA = require_CommonChars().HALF_WIDTH_COMMA;
		function commaSplit(str) {
			return str.split(HALF_WIDTH_COMMA);
		}
		module.exports = commaSplit;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/NATIVE_TYPES.js
	var require_NATIVE_TYPES = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = "Boolean Number String Date RegExp Function Array Error Set Map";
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isClass.js
	var require_isClass = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var classToString = require_coreUtilityAliases().classToString;
		function isClass(obj, className, str) {
			if (!str) str = classToString(obj);
			return str === "[object " + className + "]";
		}
		module.exports = isClass;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/spaceSplit.js
	var require_spaceSplit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function spaceSplit(str) {
			return str.split(" ");
		}
		module.exports = spaceSplit;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isObjectType.js
	var require_isObjectType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function isObjectType(obj, type) {
			return !!obj && (type || typeof obj) === "object";
		}
		module.exports = isObjectType;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/hasOwnEnumeratedProperties.js
	var require_hasOwnEnumeratedProperties = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var hasOwn = require_coreUtilityAliases().hasOwn;
		function hasOwnEnumeratedProperties(obj) {
			var objectProto = Object.prototype;
			for (var key in obj) {
				var val = obj[key];
				if (!hasOwn(obj, key) && val !== objectProto[key]) return false;
			}
			return true;
		}
		module.exports = hasOwnEnumeratedProperties;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/hasValidPlainObjectPrototype.js
	var require_hasValidPlainObjectPrototype = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var hasOwn = require_coreUtilityAliases().hasOwn;
		function hasValidPlainObjectPrototype(obj) {
			var hasToString = "toString" in obj;
			var hasConstructor = "constructor" in obj;
			return !hasConstructor && !hasToString || hasConstructor && !hasOwn(obj, "constructor") && hasOwn(obj.constructor.prototype, "isPrototypeOf");
		}
		module.exports = hasValidPlainObjectPrototype;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isPlainObject.js
	var require_isPlainObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isClass = require_isClass();
		var isObjectType = require_isObjectType();
		var hasOwnEnumeratedProperties = require_hasOwnEnumeratedProperties();
		var hasValidPlainObjectPrototype = require_hasValidPlainObjectPrototype();
		function isPlainObject(obj, className) {
			return isObjectType(obj) && isClass(obj, "Object", className) && hasValidPlainObjectPrototype(obj) && hasOwnEnumeratedProperties(obj);
		}
		module.exports = isPlainObject;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/classChecks.js
	var require_classChecks = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var NATIVE_TYPES = require_NATIVE_TYPES();
		var forEach = require_forEach();
		var isClass = require_isClass();
		var spaceSplit = require_spaceSplit();
		var isPlainObject = require_isPlainObject();
		var isSerializable;
		var isBoolean;
		var isNumber;
		var isString;
		var isDate;
		var isRegExp;
		var isFunction;
		var isArray;
		var isSet;
		var isMap;
		var isError;
		function buildClassChecks() {
			var knownTypes = {};
			function addCoreTypes() {
				var names = spaceSplit(NATIVE_TYPES);
				isBoolean = buildPrimitiveClassCheck(names[0]);
				isNumber = buildPrimitiveClassCheck(names[1]);
				isString = buildPrimitiveClassCheck(names[2]);
				isDate = buildClassCheck(names[3]);
				isRegExp = buildClassCheck(names[4]);
				isFunction = buildClassCheck(names[5]);
				// istanbul ignore next
				isArray = Array.isArray || buildClassCheck(names[6]);
				isError = buildClassCheck(names[7]);
				isSet = buildClassCheck(names[8], typeof Set !== "undefined" && Set);
				isMap = buildClassCheck(names[9], typeof Map !== "undefined" && Map);
				addKnownType("Arguments");
				addKnownType(names[0]);
				addKnownType(names[1]);
				addKnownType(names[2]);
				addKnownType(names[3]);
				addKnownType(names[4]);
				addKnownType(names[6]);
			}
			function addArrayTypes() {
				forEach(spaceSplit("Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64"), function(str) {
					addKnownType(str + "Array");
				});
			}
			function addKnownType(className) {
				var str = "[object " + className + "]";
				knownTypes[str] = true;
			}
			function isKnownType(className) {
				return knownTypes[className];
			}
			function buildClassCheck(className, globalObject) {
				// istanbul ignore if
				if (globalObject && isClass(new globalObject(), "Object")) return getConstructorClassCheck(globalObject);
				else return getToStringClassCheck(className);
			}
			// istanbul ignore next
			function getConstructorClassCheck(obj) {
				var ctorStr = String(obj);
				return function(obj) {
					return String(obj.constructor) === ctorStr;
				};
			}
			function getToStringClassCheck(className) {
				return function(obj, str) {
					return isClass(obj, className, str);
				};
			}
			function buildPrimitiveClassCheck(className) {
				var type = className.toLowerCase();
				return function(obj) {
					var t = typeof obj;
					return t === type || t === "object" && isClass(obj, className);
				};
			}
			addCoreTypes();
			addArrayTypes();
			isSerializable = function(obj, className) {
				return isKnownType(className) || isPlainObject(obj, className);
			};
		}
		buildClassChecks();
		module.exports = {
			isSerializable,
			isBoolean,
			isNumber,
			isString,
			isDate,
			isRegExp,
			isFunction,
			isArray,
			isSet,
			isMap,
			isError
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/mathAliases.js
	var require_mathAliases = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			abs: Math.abs,
			pow: Math.pow,
			min: Math.min,
			max: Math.max,
			ceil: Math.ceil,
			floor: Math.floor,
			round: Math.round
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/isUndefined.js
	var require_isUndefined = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function isUndefined(o) {
			return o === void 0;
		}
		module.exports = isUndefined;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/getOrdinalSuffix.js
	var require_getOrdinalSuffix = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function getOrdinalSuffix(num) {
			if (num >= 11 && num <= 13) return "th";
			else switch (num % 10) {
				case 1: return "st";
				case 2: return "nd";
				case 3: return "rd";
				default: return "th";
			}
		}
		module.exports = getOrdinalSuffix;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getArrayWithOffset.js
	var require_getArrayWithOffset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function getArrayWithOffset(arr, n, alternate, offset) {
			var val;
			if (alternate > 1) val = arr[n + (alternate - 1) * offset];
			return val || arr[n];
		}
		module.exports = getArrayWithOffset;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getRegNonCapturing.js
	var require_getRegNonCapturing = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function getRegNonCapturing(src, opt) {
			if (src.length > 1) src = "(?:" + src + ")";
			if (opt) src += "?";
			return src;
		}
		module.exports = getRegNonCapturing;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/PRIVATE_PROP_PREFIX.js
	var require_PRIVATE_PROP_PREFIX = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = "_sugar_";
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/privatePropertyAccessor.js
	var require_privatePropertyAccessor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var PRIVATE_PROP_PREFIX = require_PRIVATE_PROP_PREFIX();
		var setProperty = require_coreUtilityAliases().setProperty;
		function privatePropertyAccessor(key) {
			var privateKey = PRIVATE_PROP_PREFIX + key;
			return function(obj, val) {
				if (arguments.length > 1) {
					setProperty(obj, privateKey, val);
					return obj;
				}
				return obj[privateKey];
			};
		}
		module.exports = privatePropertyAccessor;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/_utc.js
	var require__utc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = require_privatePropertyAccessor()("utc");
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/callDateGet.js
	var require_callDateGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _utc = require__utc();
		function callDateGet(d, method) {
			return d["get" + (_utc(d) ? "UTC" : "") + method]();
		}
		module.exports = callDateGet;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getYear.js
	var require_getYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateGet = require_callDateGet();
		function getYear(d) {
			return callDateGet(d, "FullYear");
		}
		module.exports = getYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getMonth.js
	var require_getMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateGet = require_callDateGet();
		function getMonth(d) {
			return callDateGet(d, "Month");
		}
		module.exports = getMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDaysInMonth.js
	var require_getDaysInMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getYear = require_getYear();
		var getMonth = require_getMonth();
		var callDateGet = require_callDateGet();
		function getDaysInMonth(d) {
			return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), "Date");
		}
		module.exports = getDaysInMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/DateUnits.js
	var require_DateUnits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getDaysInMonth = require_getDaysInMonth();
		module.exports = [
			{
				name: "millisecond",
				method: "Milliseconds",
				multiplier: 1,
				start: 0,
				end: 999
			},
			{
				name: "second",
				method: "Seconds",
				multiplier: 1e3,
				start: 0,
				end: 59
			},
			{
				name: "minute",
				method: "Minutes",
				multiplier: 6e4,
				start: 0,
				end: 59
			},
			{
				name: "hour",
				method: "Hours",
				multiplier: 36e5,
				start: 0,
				end: 23
			},
			{
				name: "day",
				alias: "date",
				method: "Date",
				ambiguous: true,
				multiplier: 864e5,
				start: 1,
				end: function(d) {
					return getDaysInMonth(d);
				}
			},
			{
				name: "week",
				method: "ISOWeek",
				ambiguous: true,
				multiplier: 6048e5
			},
			{
				name: "month",
				method: "Month",
				ambiguous: true,
				multiplier: 26298e5,
				start: 0,
				end: 11
			},
			{
				name: "year",
				method: "FullYear",
				ambiguous: true,
				multiplier: 315576e5,
				start: 0
			}
		];
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/DateUnitIndexes.js
	var require_DateUnitIndexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			HOURS_INDEX: 3,
			DAY_INDEX: 4,
			WEEK_INDEX: 5,
			MONTH_INDEX: 6,
			YEAR_INDEX: 7
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/iterateOverDateUnits.js
	var require_iterateOverDateUnits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var DateUnitIndexes = require_DateUnitIndexes();
		var isUndefined = require_isUndefined();
		var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
		function iterateOverDateUnits(fn, startIndex, endIndex) {
			endIndex = endIndex || 0;
			if (isUndefined(startIndex)) startIndex = YEAR_INDEX;
			for (var index = startIndex; index >= endIndex; index--) if (fn(DateUnits[index], index) === false) break;
		}
		module.exports = iterateOverDateUnits;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/escapeRegExp.js
	var require_escapeRegExp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isString = require_classChecks().isString;
		function escapeRegExp(str) {
			if (!isString(str)) str = String(str);
			return str.replace(/([\\/'*+?|()[\]{}.^$-])/g, "\\$1");
		}
		module.exports = escapeRegExp;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/arrayToRegAlternates.js
	var require_arrayToRegAlternates = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var map = require_map();
		var escapeRegExp = require_escapeRegExp();
		function arrayToRegAlternates(arr) {
			var joined = arr.join("");
			if (!arr || !arr.length) return "";
			if (joined.length === arr.length) return "[" + joined + "]";
			return map(arr, escapeRegExp).join("|");
		}
		module.exports = arrayToRegAlternates;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/chr.js
	var require_chr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = String.fromCharCode;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/allCharsReg.js
	var require_allCharsReg = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function allCharsReg(src) {
			return RegExp("[" + src + "]", "g");
		}
		module.exports = allCharsReg;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/fullwidthNumberHelpers.js
	var require_fullwidthNumberHelpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var CommonChars = require_CommonChars();
		var chr = require_chr();
		var allCharsReg = require_allCharsReg();
		var HALF_WIDTH_ZERO = CommonChars.HALF_WIDTH_ZERO;
		var FULL_WIDTH_ZERO = CommonChars.FULL_WIDTH_ZERO;
		var HALF_WIDTH_PERIOD = CommonChars.HALF_WIDTH_PERIOD;
		var FULL_WIDTH_PERIOD = CommonChars.FULL_WIDTH_PERIOD;
		var HALF_WIDTH_COMMA = CommonChars.HALF_WIDTH_COMMA;
		var fullWidthNumberReg;
		var fullWidthNumberMap;
		var fullWidthNumbers;
		function buildFullWidthNumber() {
			var fwp = FULL_WIDTH_PERIOD, hwp = HALF_WIDTH_PERIOD, hwc = HALF_WIDTH_COMMA, fwn = "";
			fullWidthNumberMap = {};
			for (var i = 0, digit; i <= 9; i++) {
				digit = chr(i + FULL_WIDTH_ZERO);
				fwn += digit;
				fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
			}
			fullWidthNumberMap[hwc] = "";
			fullWidthNumberMap[fwp] = hwp;
			fullWidthNumberMap[hwp] = hwp;
			fullWidthNumberReg = allCharsReg(fwn + fwp + hwc + hwp);
			fullWidthNumbers = fwn;
		}
		buildFullWidthNumber();
		module.exports = {
			fullWidthNumberReg,
			fullWidthNumberMap,
			fullWidthNumbers
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/trunc.js
	var require_trunc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var mathAliases = require_mathAliases();
		var ceil = mathAliases.ceil;
		var floor = mathAliases.floor;
		module.exports = Math.trunc || function(n) {
			if (n === 0 || !isFinite(n)) return n;
			return n < 0 ? ceil(n) : floor(n);
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/withPrecision.js
	var require_withPrecision = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var mathAliases = require_mathAliases();
		var abs = mathAliases.abs;
		var pow = mathAliases.pow;
		var round = mathAliases.round;
		function withPrecision(val, precision, fn) {
			var multiplier = pow(10, abs(precision || 0));
			fn = fn || round;
			if (precision < 0) multiplier = 1 / multiplier;
			return fn(val * multiplier) / multiplier;
		}
		module.exports = withPrecision;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getAdjustedUnit.js
	var require_getAdjustedUnit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var mathAliases = require_mathAliases();
		var iterateOverDateUnits = require_iterateOverDateUnits();
		var abs = mathAliases.abs;
		function getAdjustedUnit(ms, fn) {
			var unitIndex = 0, value = 0;
			iterateOverDateUnits(function(unit, i) {
				value = abs(fn(unit));
				if (value >= 1) {
					unitIndex = i;
					return false;
				}
			});
			return [
				value,
				unitIndex,
				ms
			];
		}
		module.exports = getAdjustedUnit;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getAdjustedUnitForNumber.js
	var require_getAdjustedUnitForNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var trunc = require_trunc();
		var withPrecision = require_withPrecision();
		var getAdjustedUnit = require_getAdjustedUnit();
		function getAdjustedUnitForNumber(ms) {
			return getAdjustedUnit(ms, function(unit) {
				return trunc(withPrecision(ms / unit.multiplier, 1));
			});
		}
		module.exports = getAdjustedUnitForNumber;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getParsingTokenWithSuffix.js
	var require_getParsingTokenWithSuffix = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocalizedParsingTokens = require_LocalizedParsingTokens();
		var getRegNonCapturing = require_getRegNonCapturing();
		function getParsingTokenWithSuffix(field, src, suffix) {
			var token = LocalizedParsingTokens[field];
			if (token.requiresSuffix) src = getRegNonCapturing(src + getRegNonCapturing(suffix));
			else if (token.requiresSuffixOr) src += getRegNonCapturing(token.requiresSuffixOr + "|" + suffix);
			else src += getRegNonCapturing(suffix, true);
			return src;
		}
		module.exports = getParsingTokenWithSuffix;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getNewLocale.js
	var require_getNewLocale = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LOCALE_ARRAY_FIELDS = require_LOCALE_ARRAY_FIELDS();
		var ISODefaults = require_ISODefaults();
		var CoreParsingTokens = require_CoreParsingTokens();
		var CoreParsingFormats = require_CoreParsingFormats();
		var LocalizedParsingTokens = require_LocalizedParsingTokens();
		var map = require_map();
		var filter = require_filter();
		var forEach = require_forEach();
		var isDefined = require_isDefined();
		var commaSplit = require_commaSplit();
		var classChecks = require_classChecks();
		var mathAliases = require_mathAliases();
		var isUndefined = require_isUndefined();
		var simpleMerge = require_simpleMerge();
		var getOrdinalSuffix = require_getOrdinalSuffix();
		var getArrayWithOffset = require_getArrayWithOffset();
		var getRegNonCapturing = require_getRegNonCapturing();
		var coreUtilityAliases = require_coreUtilityAliases();
		var iterateOverDateUnits = require_iterateOverDateUnits();
		var arrayToRegAlternates = require_arrayToRegAlternates();
		var fullwidthNumberHelpers = require_fullwidthNumberHelpers();
		var getAdjustedUnitForNumber = require_getAdjustedUnitForNumber();
		var getParsingTokenWithSuffix = require_getParsingTokenWithSuffix();
		var hasOwn = coreUtilityAliases.hasOwn;
		var getOwn = coreUtilityAliases.getOwn;
		var forEachProperty = coreUtilityAliases.forEachProperty;
		var fullWidthNumberMap = fullwidthNumberHelpers.fullWidthNumberMap;
		var fullWidthNumbers = fullwidthNumberHelpers.fullWidthNumbers;
		var pow = mathAliases.pow;
		var max = mathAliases.max;
		var ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK;
		var ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR;
		var isString = classChecks.isString;
		var isFunction = classChecks.isFunction;
		function getNewLocale(def) {
			function Locale(def) {
				this.init(def);
			}
			Locale.prototype = {
				getMonthName: function(n, alternate) {
					if (this.monthSuffix) return n + 1 + this.monthSuffix;
					return getArrayWithOffset(this.months, n, alternate, 12);
				},
				getWeekdayName: function(n, alternate) {
					return getArrayWithOffset(this.weekdays, n, alternate, 7);
				},
				parseValue: function(str, param) {
					var map = this[param + "Map"];
					if (hasOwn(map, str)) return map[str];
					return this.parseNumber(str, param);
				},
				parseNumber: function(str, param) {
					var val;
					if (hasOwn(this.numeralMap, str)) val = this.numeralMap[str];
					if (isNaN(val)) val = this.parseRegularNumerals(str);
					if (isNaN(val)) val = this.parseIrregularNumerals(str);
					if (param === "month") val -= 1;
					return val;
				},
				parseRegularNumerals: function(str) {
					str = str.replace(/^−/, "-").replace(/,/, ".");
					return +str;
				},
				parseIrregularNumerals: function(str) {
					var place = 1, num = 0, lastWasPlace, isPlace, numeral, digit, arr = str.split("");
					for (var i = arr.length - 1; numeral = arr[i]; i--) {
						digit = getOwn(this.numeralMap, numeral);
						if (isUndefined(digit)) digit = getOwn(fullWidthNumberMap, numeral) || 0;
						isPlace = digit > 0 && digit % 10 === 0;
						if (isPlace) {
							if (lastWasPlace) num += place;
							if (i) place = digit;
							else num += digit;
						} else {
							num += digit * place;
							place *= 10;
						}
						lastWasPlace = isPlace;
					}
					return num;
				},
				getOrdinal: function(n) {
					return this.ordinalSuffix || getOrdinalSuffix(n);
				},
				getRelativeFormat: function(adu, type) {
					return this.convertAdjustedToFormat(adu, type);
				},
				getDuration: function(ms) {
					return this.convertAdjustedToFormat(getAdjustedUnitForNumber(max(0, ms)), "duration");
				},
				getFirstDayOfWeek: function() {
					var val = this.firstDayOfWeek;
					return isDefined(val) ? val : ISO_FIRST_DAY_OF_WEEK;
				},
				getFirstDayOfWeekYear: function() {
					return this.firstDayOfWeekYear || ISO_FIRST_DAY_OF_WEEK_YEAR;
				},
				convertAdjustedToFormat: function(adu, type) {
					var sign, unit, mult, num = adu[0], u = adu[1], ms = adu[2], format = this[type] || this.relative;
					if (isFunction(format)) return format.call(this, num, u, ms, type);
					mult = !this.plural || num === 1 ? 0 : 1;
					unit = this.units[mult * 8 + u] || this.units[u];
					sign = this[ms > 0 ? "fromNow" : "ago"];
					return format.replace(/\{(.*?)\}/g, function(full, match) {
						switch (match) {
							case "num": return num;
							case "unit": return unit;
							case "sign": return sign;
						}
					});
				},
				cacheFormat: function(dif, i) {
					this.compiledFormats.splice(i, 1);
					this.compiledFormats.unshift(dif);
				},
				addFormat: function(format) {
					var loc = this, src, to;
					function getTokenSrc(token) {
						var suffix, src, tmp, opt = token.match(/\?$/), nc = token.match(/^(\d+)\??$/), slice = token.match(/(\d)(?:-(\d))?/), param = token.replace(/[^a-z]+$/i, "");
						if (tmp = getOwn(loc.parsingAliases, param)) {
							src = formatToSrc(tmp);
							if (opt) src = getRegNonCapturing(src, true);
							return src;
						}
						if (nc) src = loc.tokens[nc[1]];
						else if (tmp = getOwn(CoreParsingTokens, param)) {
							src = tmp.src;
							param = tmp.param || param;
						} else {
							tmp = getOwn(loc.parsingTokens, param) || getOwn(loc, param);
							param = param.replace(/s$/, "");
							if (!tmp) tmp = getOwn(loc.parsingTokens, param) || getOwn(loc, param + "s");
							if (isString(tmp)) {
								src = tmp;
								suffix = loc[param + "Suffix"];
							} else {
								if (param === "weekday" && loc.code === "ko") tmp = filter(tmp, function(str) {
									return str.length > 1;
								});
								if (slice) tmp = filter(tmp, function(m, i) {
									var mod = i % (loc.units ? 8 : tmp.length);
									return mod >= slice[1] && mod <= (slice[2] || slice[1]);
								});
								src = arrayToRegAlternates(tmp);
							}
						}
						if (!src) return "";
						if (nc) src = getRegNonCapturing(src);
						else {
							to.push(param);
							src = "(" + src + ")";
						}
						if (suffix) src = getParsingTokenWithSuffix(param, src, suffix);
						if (opt) src += "?";
						return src;
					}
					function formatToSrc(str) {
						str = str.replace(/ /g, " ?");
						str = str.replace(/\{([^,]+?)\}/g, function(match, token) {
							var tokens = token.split("|");
							if (tokens.length > 1) return getRegNonCapturing(map(tokens, getTokenSrc).join("|"));
							else return getTokenSrc(token);
						});
						return str;
					}
					function parseInputFormat() {
						to = [];
						src = formatToSrc(format);
					}
					parseInputFormat();
					loc.addRawFormat(src, to);
				},
				addRawFormat: function(format, to) {
					this.compiledFormats.unshift({
						reg: RegExp("^ *" + format + " *$", "i"),
						to
					});
				},
				init: function(def) {
					var loc = this;
					function initFormats() {
						loc.compiledFormats = [];
						loc.parsingAliases = {};
						loc.parsingTokens = {};
					}
					function initDefinition() {
						simpleMerge(loc, def);
					}
					function initArrayFields() {
						forEach(LOCALE_ARRAY_FIELDS, function(name) {
							var val = loc[name];
							if (isString(val)) loc[name] = commaSplit(val);
							else if (!val) loc[name] = [];
						});
					}
					function buildValueArray(name, mod, map, fn) {
						var field = name, all = [], setMap;
						if (!loc[field]) field += "s";
						if (!map) {
							map = {};
							setMap = true;
						}
						forAllAlternates(field, function(alt, j, i) {
							var idx = j * mod + i, val = fn ? fn(i) : i;
							map[alt] = val;
							map[alt.toLowerCase()] = val;
							all[idx] = alt;
						});
						loc[field] = all;
						if (setMap) loc[name + "Map"] = map;
					}
					function forAllAlternates(field, fn) {
						forEach(loc[field], function(str, i) {
							forEachAlternate(str, function(alt, j) {
								fn(alt, j, i);
							});
						});
					}
					function forEachAlternate(str, fn) {
						forEach(map(str.split("+"), function(split) {
							return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
								return map(suffixes.split("|"), function(suffix) {
									return base + suffix;
								}).join("|");
							});
						}).join("|").split("|"), fn);
					}
					function buildNumerals() {
						var map = {};
						buildValueArray("numeral", 10, map);
						buildValueArray("article", 1, map, function() {
							return 1;
						});
						buildValueArray("placeholder", 4, map, function(n) {
							return pow(10, n + 1);
						});
						loc.numeralMap = map;
					}
					function buildTimeFormats() {
						loc.parsingAliases["time"] = getTimeFormat();
						loc.parsingAliases["tzOffset"] = getTZOffsetFormat();
					}
					function getTimeFormat(standalone) {
						var src, sep = getTimeSeparatorSrc(standalone);
						if (loc.ampmFront) src = "{ampm?} {hour} (?:{minute} (?::?{second})?)?";
						else if (loc.ampm.length) src = "{hour}(?:" + sep + "{minute?}(?:" + sep + "{second?})? {ampm?}| {ampm})";
						else src = "{hour}(?:" + sep + "{minute?}(?:" + sep + "{second?})?)";
						return src;
					}
					function getTimeSeparatorSrc() {
						if (loc.timeSeparator) return "[:" + loc.timeSeparator + "]";
						else return ":";
					}
					function getTZOffsetFormat() {
						return "(?:{Z}|{GMT?}(?:{tzHour}(?::?{tzMinute}(?: \\([\\w\\s]+\\))?)?)?)?";
					}
					function buildParsingTokens() {
						forEachProperty(LocalizedParsingTokens, function(token, name) {
							var src = token.base ? getCoreTokensForBase(token.base) : token.src, arr;
							if (token.requiresNumerals || loc.numeralUnits) src += getNumeralSrc();
							arr = loc[name + "s"];
							if (arr && arr.length) src += "|" + arrayToRegAlternates(arr);
							loc.parsingTokens[name] = src;
						});
					}
					function getCoreTokensForBase(base) {
						return map(base.split("|"), function(key) {
							return CoreParsingTokens[key].src;
						}).join("|");
					}
					function getNumeralSrc() {
						var all, src = "";
						all = loc.numerals.concat(loc.placeholders).concat(loc.articles);
						if (loc.allowsFullWidth) all = all.concat(fullWidthNumbers.split(""));
						if (all.length) src = "|(?:" + arrayToRegAlternates(all) + ")+";
						return src;
					}
					function buildTimeSuffixes() {
						iterateOverDateUnits(function(unit, i) {
							var token = loc.timeSuffixes[i];
							if (token) loc[(unit.alias || unit.name) + "Suffix"] = token;
						});
					}
					function buildModifiers() {
						forEach(loc.modifiers, function(modifier) {
							var name = modifier.name, mapKey = name + "Map", map = loc[mapKey] || {};
							forEachAlternate(modifier.src, function(alt, j) {
								var token = getOwn(loc.parsingTokens, name), val = modifier.value;
								map[alt] = val;
								loc.parsingTokens[name] = token ? token + "|" + alt : alt;
								if (modifier.name === "sign" && j === 0) loc[val === 1 ? "fromNow" : "ago"] = alt;
							});
							loc[mapKey] = map;
						});
					}
					function addCoreFormats() {
						forEach(CoreParsingFormats, function(df) {
							var src = df.src;
							if (df.localeCheck && !df.localeCheck(loc)) return;
							if (df.mdy && loc.mdy) src = df.mdy;
							if (df.time) {
								loc.addFormat(getFormatWithTime(src, true));
								loc.addFormat(getFormatWithTime(src));
							} else loc.addFormat(src);
						});
						loc.addFormat("{time}");
					}
					function addLocaleFormats() {
						addFormatSet("parse");
						addFormatSet("timeParse", true);
						addFormatSet("timeFrontParse", true, true);
					}
					function addFormatSet(field, allowTime, timeFront) {
						forEach(loc[field], function(format) {
							if (allowTime) format = getFormatWithTime(format, timeFront);
							loc.addFormat(format);
						});
					}
					function getFormatWithTime(baseFormat, timeBefore) {
						if (timeBefore) return getTimeBefore() + baseFormat;
						return baseFormat + getTimeAfter();
					}
					function getTimeBefore() {
						return getRegNonCapturing("{time}[,\\s\\u3000]", true);
					}
					function getTimeAfter() {
						var markers = ",?[\\s\\u3000]", localized = arrayToRegAlternates(loc.timeMarkers);
						if (localized) markers += "| (?:" + localized + ") ";
						markers = getRegNonCapturing(markers, loc.timeMarkerOptional);
						return getRegNonCapturing(markers + "{time}{tzOffset}", true);
					}
					initFormats();
					initDefinition();
					initArrayFields();
					buildValueArray("month", 12);
					buildValueArray("weekday", 7);
					buildValueArray("unit", 8);
					buildValueArray("ampm", 2);
					buildNumerals();
					buildTimeFormats();
					buildParsingTokens();
					buildTimeSuffixes();
					buildModifiers();
					addCoreFormats();
					addLocaleFormats();
				}
			};
			return new Locale(def);
		}
		module.exports = getNewLocale;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/LocaleHelpers.js
	var require_LocaleHelpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LazyLoadedLocales = require_LazyLoadedLocales();
		var AmericanEnglishDefinition = require_AmericanEnglishDefinition();
		var getNewLocale = require_getNewLocale();
		var English;
		var localeManager;
		function buildLocales() {
			function LocaleManager(loc) {
				this.locales = {};
				this.add(loc);
			}
			LocaleManager.prototype = {
				get: function(code, fallback) {
					var loc = this.locales[code];
					if (!loc && LazyLoadedLocales[code]) loc = this.add(code, LazyLoadedLocales[code]);
					else if (!loc && code) loc = this.locales[code.slice(0, 2)];
					return loc || fallback === false ? loc : this.current;
				},
				getAll: function() {
					return this.locales;
				},
				set: function(code) {
					var loc = this.get(code, false);
					if (!loc) throw new TypeError("Invalid Locale: " + code);
					return this.current = loc;
				},
				add: function(code, def) {
					if (!def) {
						def = code;
						code = def.code;
					} else def.code = code;
					var loc = def.compiledFormats ? def : getNewLocale(def);
					this.locales[code] = loc;
					if (!this.current) this.current = loc;
					return loc;
				},
				remove: function(code) {
					if (this.current.code === code) this.current = this.get("en");
					return delete this.locales[code];
				}
			};
			English = getNewLocale(AmericanEnglishDefinition);
			localeManager = new LocaleManager(English);
		}
		buildLocales();
		module.exports = {
			English,
			localeManager
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addLocale.js
	var require_addLocale = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Date.defineStatic({ "addLocale": function(code, set) {
			return localeManager.add(code, set);
		} });
		module.exports = Sugar.Date.addLocale;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/MINUTES.js
	var require_MINUTES = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = 6e4;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/ABBREVIATED_YEAR_REG.js
	var require_ABBREVIATED_YEAR_REG = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = /^'?(\d{1,2})$/;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/tzOffset.js
	var require_tzOffset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function tzOffset(d) {
			return d.getTimezoneOffset();
		}
		module.exports = tzOffset;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/callDateSet.js
	var require_callDateSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _utc = require__utc();
		var callDateGet = require_callDateGet();
		function callDateSet(d, method, value, safe) {
			if (safe && value === callDateGet(d, method, value)) return;
			d["set" + (_utc(d) ? "UTC" : "") + method](value);
		}
		module.exports = callDateSet;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getLowerUnitIndex.js
	var require_getLowerUnitIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var HOURS_INDEX = DateUnitIndexes.HOURS_INDEX;
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX;
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		function getLowerUnitIndex(index) {
			if (index === MONTH_INDEX) return DAY_INDEX;
			else if (index === WEEK_INDEX) return HOURS_INDEX;
			return index - 1;
		}
		module.exports = getLowerUnitIndex;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/walkUnitDown.js
	var require_walkUnitDown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var getLowerUnitIndex = require_getLowerUnitIndex();
		function walkUnitDown(unitIndex, fn) {
			while (unitIndex >= 0) {
				if (fn(DateUnits[unitIndex], unitIndex) === false) break;
				unitIndex = getLowerUnitIndex(unitIndex);
			}
		}
		module.exports = walkUnitDown;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setUnitAndLowerToEdge.js
	var require_setUnitAndLowerToEdge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isDefined = require_isDefined();
		var classChecks = require_classChecks();
		var callDateSet = require_callDateSet();
		var walkUnitDown = require_walkUnitDown();
		var isFunction = classChecks.isFunction;
		function setUnitAndLowerToEdge(d, startIndex, stopIndex, end) {
			walkUnitDown(startIndex, function(unit, i) {
				var val = end ? unit.end : unit.start;
				if (isFunction(val)) val = val(d);
				callDateSet(d, unit.method, val);
				return !isDefined(stopIndex) || i > stopIndex;
			});
			return d;
		}
		module.exports = setUnitAndLowerToEdge;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/resetTime.js
	var require_resetTime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		var HOURS_INDEX = DateUnitIndexes.HOURS_INDEX;
		function resetTime(d) {
			return setUnitAndLowerToEdge(d, HOURS_INDEX);
		}
		module.exports = resetTime;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/defaultNewDate.js
	var require_defaultNewDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function defaultNewDate() {
			return /* @__PURE__ */ new Date();
		}
		module.exports = defaultNewDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/DATE_OPTIONS.js
	var require_DATE_OPTIONS = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = { "newDateInternal": require_defaultNewDate() };
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/namespaceAliases.js
	var require_namespaceAliases = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		module.exports = {
			sugarObject: Sugar.Object,
			sugarArray: Sugar.Array,
			sugarDate: Sugar.Date,
			sugarString: Sugar.String,
			sugarNumber: Sugar.Number,
			sugarFunction: Sugar.Function,
			sugarRegExp: Sugar.RegExp
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/defineAccessor.js
	var require_defineAccessor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var setProperty = require_coreUtilityAliases().setProperty;
		function defineAccessor(namespace, name, fn) {
			setProperty(namespace, name, fn);
		}
		module.exports = defineAccessor;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/defineOptionsAccessor.js
	var require_defineOptionsAccessor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var simpleClone = require_simpleClone();
		var defineAccessor = require_defineAccessor();
		var forEachProperty = require_coreUtilityAliases().forEachProperty;
		function defineOptionsAccessor(namespace, defaults) {
			var obj = simpleClone(defaults);
			function getOption(name) {
				return obj[name];
			}
			function setOption(arg1, arg2) {
				var options;
				if (arguments.length === 1) options = arg1;
				else {
					options = {};
					options[arg1] = arg2;
				}
				forEachProperty(options, function(val, name) {
					if (val === null) val = defaults[name];
					obj[name] = val;
				});
			}
			defineAccessor(namespace, "getOption", getOption);
			defineAccessor(namespace, "setOption", setOption);
			return getOption;
		}
		module.exports = defineOptionsAccessor;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/_dateOptions.js
	var require__dateOptions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DATE_OPTIONS = require_DATE_OPTIONS();
		var namespaceAliases = require_namespaceAliases();
		var defineOptionsAccessor = require_defineOptionsAccessor();
		var sugarDate = namespaceAliases.sugarDate;
		module.exports = defineOptionsAccessor(sugarDate, DATE_OPTIONS);
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getNewDate.js
	var require_getNewDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _dateOptions = require__dateOptions();
		function getNewDate() {
			return _dateOptions("newDateInternal")();
		}
		module.exports = getNewDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setDate.js
	var require_setDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateSet = require_callDateSet();
		function setDate(d, val) {
			callDateSet(d, "Date", val);
		}
		module.exports = setDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDate.js
	var require_getDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateGet = require_callDateGet();
		function getDate(d) {
			return callDateGet(d, "Date");
		}
		module.exports = getDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getWeekday.js
	var require_getWeekday$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateGet = require_callDateGet();
		function getWeekday(d) {
			return callDateGet(d, "Day");
		}
		module.exports = getWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setWeekday.js
	var require_setWeekday$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var setDate = require_setDate();
		var getDate = require_getDate();
		var getWeekday = require_getWeekday$1();
		var classChecks = require_classChecks();
		var mathAliases = require_mathAliases();
		var isNumber = classChecks.isNumber;
		var abs = mathAliases.abs;
		function setWeekday(d, dow, dir) {
			if (!isNumber(dow)) return;
			var currentWeekday = getWeekday(d);
			if (dir) {
				var ndir = dir > 0 ? 1 : -1;
				var offset = dow % 7 - currentWeekday;
				if (offset && offset / abs(offset) !== ndir) dow += 7 * ndir;
			}
			setDate(d, getDate(d) + dow - currentWeekday);
			return d.getTime();
		}
		module.exports = setWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/resetLowerUnits.js
	var require_resetLowerUnits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getLowerUnitIndex = require_getLowerUnitIndex();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		function resetLowerUnits(d, unitIndex) {
			return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
		}
		module.exports = resetLowerUnits;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getHigherUnitIndex.js
	var require_getHigherUnitIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		function getHigherUnitIndex(index) {
			return index === DAY_INDEX ? MONTH_INDEX : index + 1;
		}
		module.exports = getHigherUnitIndex;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setYear.js
	var require_setYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateSet = require_callDateSet();
		function setYear(d, val) {
			callDateSet(d, "FullYear", val);
		}
		module.exports = setYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setMonth.js
	var require_setMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateSet = require_callDateSet();
		function setMonth(d, val) {
			callDateSet(d, "Month", val);
		}
		module.exports = setMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/cloneDate.js
	var require_cloneDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _utc = require__utc();
		function cloneDate(d) {
			var clone = new Date(d.getTime());
			_utc(clone, !!_utc(d));
			return clone;
		}
		module.exports = cloneDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/moveToBeginningOfWeek.js
	var require_moveToBeginningOfWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var setWeekday = require_setWeekday$1();
		var getWeekday = require_getWeekday$1();
		var floor = require_mathAliases().floor;
		function moveToBeginningOfWeek(d, firstDayOfWeek) {
			setWeekday(d, floor((getWeekday(d) - firstDayOfWeek) / 7) * 7 + firstDayOfWeek);
			return d;
		}
		module.exports = moveToBeginningOfWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/moveToFirstDayOfWeekYear.js
	var require_moveToFirstDayOfWeekYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var setDate = require_setDate();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		var moveToBeginningOfWeek = require_moveToBeginningOfWeek();
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		function moveToFirstDayOfWeekYear(d, firstDayOfWeek, firstDayOfWeekYear) {
			setUnitAndLowerToEdge(d, MONTH_INDEX);
			setDate(d, firstDayOfWeekYear);
			moveToBeginningOfWeek(d, firstDayOfWeek);
		}
		module.exports = moveToFirstDayOfWeekYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setISOWeekNumber.js
	var require_setISOWeekNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var ISODefaults = require_ISODefaults();
		var getDate = require_getDate();
		var setDate = require_setDate();
		var setYear = require_setYear();
		var getYear = require_getYear();
		var getMonth = require_getMonth();
		var setMonth = require_setMonth();
		var cloneDate = require_cloneDate();
		var getWeekday = require_getWeekday$1();
		var setWeekday = require_setWeekday$1();
		var classChecks = require_classChecks();
		var moveToFirstDayOfWeekYear = require_moveToFirstDayOfWeekYear();
		var isNumber = classChecks.isNumber;
		var ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK;
		var ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR;
		function setISOWeekNumber(d, num) {
			if (isNumber(num)) {
				var isoWeek = cloneDate(d), dow = getWeekday(d);
				moveToFirstDayOfWeekYear(isoWeek, ISO_FIRST_DAY_OF_WEEK, ISO_FIRST_DAY_OF_WEEK_YEAR);
				setDate(isoWeek, getDate(isoWeek) + 7 * (num - 1));
				setYear(d, getYear(isoWeek));
				setMonth(d, getMonth(isoWeek));
				setDate(d, getDate(isoWeek));
				setWeekday(d, dow || 7);
			}
			return d.getTime();
		}
		module.exports = setISOWeekNumber;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/callDateSetWithWeek.js
	var require_callDateSetWithWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateSet = require_callDateSet();
		var setISOWeekNumber = require_setISOWeekNumber();
		function callDateSetWithWeek(d, method, value, safe) {
			if (method === "ISOWeek") setISOWeekNumber(d, value);
			else callDateSet(d, method, value, safe);
		}
		module.exports = callDateSetWithWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/getOwnKey.js
	var require_getOwnKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var hasOwn = require_coreUtilityAliases().hasOwn;
		function getOwnKey(obj, key) {
			if (hasOwn(obj, key)) return key;
		}
		module.exports = getOwnKey;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDateParamKey.js
	var require_getDateParamKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getOwnKey = require_getOwnKey();
		function getDateParamKey(params, key) {
			return getOwnKey(params, key) || getOwnKey(params, key + "s") || key === "day" && getOwnKey(params, "date");
		}
		module.exports = getDateParamKey;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDateParam.js
	var require_getDateParam = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getDateParamKey = require_getDateParamKey();
		var getOwn = require_coreUtilityAliases().getOwn;
		function getDateParam(params, key) {
			return getOwn(params, getDateParamKey(params, key));
		}
		module.exports = getDateParam;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/iterateOverDateParams.js
	var require_iterateOverDateParams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var isDefined = require_isDefined();
		var getDateParam = require_getDateParam();
		var iterateOverDateUnits = require_iterateOverDateUnits();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		function iterateOverDateParams(params, fn, startIndex, endIndex) {
			function run(name, unit, i) {
				var val = getDateParam(params, name);
				if (isDefined(val)) fn(name, val, unit, i);
			}
			iterateOverDateUnits(function(unit, i) {
				var result = run(unit.name, unit, i);
				if (result !== false && i === DAY_INDEX) result = run("weekday", unit, i);
				return result;
			}, startIndex, endIndex);
		}
		module.exports = iterateOverDateParams;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/updateDate.js
	var require_updateDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var DateUnitIndexes = require_DateUnitIndexes();
		var trunc = require_trunc();
		var setDate = require_setDate();
		var getDate = require_getDate();
		var getMonth = require_getMonth();
		var getNewDate = require_getNewDate();
		var setWeekday = require_setWeekday$1();
		var mathAliases = require_mathAliases();
		var callDateGet = require_callDateGet();
		var classChecks = require_classChecks();
		var resetLowerUnits = require_resetLowerUnits();
		var getLowerUnitIndex = require_getLowerUnitIndex();
		var getHigherUnitIndex = require_getHigherUnitIndex();
		var callDateSetWithWeek = require_callDateSetWithWeek();
		var iterateOverDateParams = require_iterateOverDateParams();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX;
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
		var round = mathAliases.round;
		var isNumber = classChecks.isNumber;
		function updateDate(d, params, reset, advance, prefer, weekdayDir, contextDate) {
			var upperUnitIndex;
			function setUpperUnit(unitName, unitIndex) {
				if (prefer && !upperUnitIndex) {
					if (unitName === "weekday") upperUnitIndex = WEEK_INDEX;
					else upperUnitIndex = getHigherUnitIndex(unitIndex);
				}
			}
			function setSpecificity(unitIndex) {
				if (unitIndex > params.specificity) return;
				params.specificity = unitIndex;
			}
			function canDisambiguate() {
				if (!upperUnitIndex || upperUnitIndex > YEAR_INDEX) return;
				switch (prefer) {
					case -1: return d >= (contextDate || getNewDate());
					case 1: return d <= (contextDate || getNewDate());
				}
			}
			function disambiguateHigherUnit() {
				var unit = DateUnits[upperUnitIndex];
				advance = prefer;
				setUnit(unit.name, 1, unit, upperUnitIndex);
			}
			function handleFraction(unit, unitIndex, fraction) {
				if (unitIndex) {
					var lowerUnit = DateUnits[getLowerUnitIndex(unitIndex)];
					var val = round(unit.multiplier / lowerUnit.multiplier * fraction);
					params[lowerUnit.name] = val;
				}
			}
			function monthHasShifted(d, targetMonth) {
				if (targetMonth < 0) targetMonth = targetMonth % 12 + 12;
				return targetMonth % 12 !== getMonth(d);
			}
			function setUnit(unitName, value, unit, unitIndex) {
				var method = unit.method, checkMonth, fraction;
				setUpperUnit(unitName, unitIndex);
				setSpecificity(unitIndex);
				fraction = value % 1;
				if (fraction) {
					handleFraction(unit, unitIndex, fraction);
					value = trunc(value);
				}
				if (unitName === "weekday") {
					if (!advance) setWeekday(d, value, weekdayDir);
					return;
				}
				checkMonth = unitIndex === MONTH_INDEX && getDate(d) > 28;
				if (advance && !unit.ambiguous) {
					d.setTime(d.getTime() + value * advance * unit.multiplier);
					return;
				} else if (advance) {
					if (unitIndex === WEEK_INDEX) {
						value *= 7;
						method = DateUnits[DAY_INDEX].method;
					}
					value = value * advance + callDateGet(d, method);
				}
				callDateSetWithWeek(d, method, value, advance);
				if (checkMonth && monthHasShifted(d, value)) setDate(d, 0);
			}
			if (isNumber(params) && advance) params = { millisecond: params };
			else if (isNumber(params)) {
				d.setTime(params);
				return d;
			}
			iterateOverDateParams(params, setUnit);
			if (reset && params.specificity) resetLowerUnits(d, params.specificity);
			if (canDisambiguate()) disambiguateHigherUnit();
			return d;
		}
		module.exports = updateDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/advanceDate.js
	var require_advanceDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var updateDate = require_updateDate();
		function advanceDate(d, unit, num, reset) {
			var set = {};
			set[unit] = num;
			return updateDate(d, set, reset, 1);
		}
		module.exports = advanceDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/dateIsValid.js
	var require_dateIsValid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function dateIsValid(d) {
			return !isNaN(d.getTime());
		}
		module.exports = dateIsValid;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/moveToEndOfWeek.js
	var require_moveToEndOfWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var setWeekday = require_setWeekday$1();
		var getWeekday = require_getWeekday$1();
		var ceil = require_mathAliases().ceil;
		function moveToEndOfWeek(d, firstDayOfWeek) {
			var target = firstDayOfWeek - 1;
			setWeekday(d, ceil((getWeekday(d) - target) / 7) * 7 + target);
			return d;
		}
		module.exports = moveToEndOfWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/moveToEndOfUnit.js
	var require_moveToEndOfUnit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var DateUnitIndexes = require_DateUnitIndexes();
		var moveToEndOfWeek = require_moveToEndOfWeek();
		var getLowerUnitIndex = require_getLowerUnitIndex();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX;
		var localeManager = LocaleHelpers.localeManager;
		function moveToEndOfUnit(d, unitIndex, localeCode, stopIndex) {
			if (unitIndex === WEEK_INDEX) moveToEndOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
			return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex), stopIndex, true);
		}
		module.exports = moveToEndOfUnit;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/deleteDateParam.js
	var require_deleteDateParam = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getDateParamKey = require_getDateParamKey();
		function deleteDateParam(params, key) {
			delete params[getDateParamKey(params, key)];
		}
		module.exports = deleteDateParam;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/moveToBeginningOfUnit.js
	var require_moveToBeginningOfUnit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var DateUnitIndexes = require_DateUnitIndexes();
		var getLowerUnitIndex = require_getLowerUnitIndex();
		var moveToBeginningOfWeek = require_moveToBeginningOfWeek();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX;
		var localeManager = LocaleHelpers.localeManager;
		function moveToBeginningOfUnit(d, unitIndex, localeCode) {
			if (unitIndex === WEEK_INDEX) moveToBeginningOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
			return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
		}
		module.exports = moveToBeginningOfUnit;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getYearFromAbbreviation.js
	var require_getYearFromAbbreviation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getYear = require_getYear();
		var abs = require_mathAliases().abs;
		function getYearFromAbbreviation(str, d, prefer) {
			var val = +str, delta;
			val += val < 50 ? 2e3 : 1900;
			if (prefer) {
				delta = val - getYear(d);
				if (delta / abs(delta) !== prefer) val += prefer * 100;
			}
			return val;
		}
		module.exports = getYearFromAbbreviation;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/iterateOverHigherDateParams.js
	var require_iterateOverHigherDateParams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var iterateOverDateParams = require_iterateOverDateParams();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
		function iterateOverHigherDateParams(params, fn) {
			iterateOverDateParams(params, fn, YEAR_INDEX, DAY_INDEX);
		}
		module.exports = iterateOverHigherDateParams;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getExtendedDate.js
	var require_getExtendedDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var MINUTES = require_MINUTES();
		var ABBREVIATED_YEAR_REG = require_ABBREVIATED_YEAR_REG();
		var LocaleHelpers = require_LocaleHelpers();
		var DateUnitIndexes = require_DateUnitIndexes();
		var _utc = require__utc();
		var trunc = require_trunc();
		var forEach = require_forEach();
		var tzOffset = require_tzOffset();
		var isDefined = require_isDefined();
		var resetTime = require_resetTime();
		var getNewDate = require_getNewDate();
		var updateDate = require_updateDate();
		var setWeekday = require_setWeekday$1();
		var simpleMerge = require_simpleMerge();
		var advanceDate = require_advanceDate();
		var isUndefined = require_isUndefined();
		var classChecks = require_classChecks();
		var dateIsValid = require_dateIsValid();
		var simpleClone = require_simpleClone();
		var isObjectType = require_isObjectType();
		var moveToEndOfUnit = require_moveToEndOfUnit();
		var deleteDateParam = require_deleteDateParam();
		var coreUtilityAliases = require_coreUtilityAliases();
		var moveToBeginningOfUnit = require_moveToBeginningOfUnit();
		var iterateOverDateParams = require_iterateOverDateParams();
		var getYearFromAbbreviation = require_getYearFromAbbreviation();
		var iterateOverHigherDateParams = require_iterateOverHigherDateParams();
		var isNumber = classChecks.isNumber;
		var isString = classChecks.isString;
		var isDate = classChecks.isDate;
		var getOwn = coreUtilityAliases.getOwn;
		var English = LocaleHelpers.English;
		var localeManager = LocaleHelpers.localeManager;
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX;
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
		function getExtendedDate(contextDate, d, opt, forceClone) {
			var date, set, loc, afterCallbacks, relative, weekdayDir;
			var optPrefer, optLocale, optFromUTC, optSetUTC, optParams, optClone;
			afterCallbacks = [];
			setupOptions(opt);
			function setupOptions(opt) {
				opt = isString(opt) ? { locale: opt } : opt || {};
				optPrefer = +!!getOwn(opt, "future") - +!!getOwn(opt, "past");
				optLocale = getOwn(opt, "locale");
				optFromUTC = getOwn(opt, "fromUTC");
				optSetUTC = getOwn(opt, "setUTC");
				optParams = getOwn(opt, "params");
				optClone = getOwn(opt, "clone");
			}
			function parseFormatValues(match, dif) {
				var set = optParams || {};
				forEach(dif.to, function(param, i) {
					var str = match[i + 1], val;
					if (!str) return;
					val = parseIrregular(str, param);
					if (isUndefined(val)) val = loc.parseValue(str, param);
					set[param] = val;
				});
				return set;
			}
			function parseIrregular(str, param) {
				if (param === "utc") return 1;
				else if (param === "year") {
					var match = str.match(ABBREVIATED_YEAR_REG);
					if (match) return getYearFromAbbreviation(match[1], date, optPrefer);
				}
			}
			function cloneDateByFlag(d, clone) {
				if (_utc(d) && !isDefined(optFromUTC)) optFromUTC = true;
				if (_utc(d) && !isDefined(optSetUTC)) optSetUTC = true;
				if (clone) d = new Date(d.getTime());
				return d;
			}
			function afterDateSet(fn) {
				afterCallbacks.push(fn);
			}
			function fireCallbacks() {
				forEach(afterCallbacks, function(fn) {
					fn.call();
				});
			}
			function parseStringDate(str) {
				str = str.toLowerCase();
				loc = localeManager.get(optLocale);
				for (var i = 0, dif, match; dif = loc.compiledFormats[i]; i++) {
					match = str.match(dif.reg);
					if (match) {
						loc.cacheFormat(dif, i);
						set = parseFormatValues(match, dif);
						if (isDefined(set.timestamp)) {
							date.setTime(set.timestamp);
							break;
						}
						if (isDefined(set.ampm)) handleAmpm(set.ampm);
						if (set.utc || isDefined(set.tzHour)) handleTimezoneOffset(set.tzHour, set.tzMinute);
						if (isDefined(set.shift) && isUndefined(set.unit)) handleUnitlessShift();
						if (isDefined(set.num) && isUndefined(set.unit)) handleUnitlessNum(set.num);
						if (set.midday) handleMidday(set.midday);
						if (isDefined(set.day)) handleRelativeDay(set.day);
						if (isDefined(set.unit)) handleRelativeUnit(set.unit);
						if (set.edge) handleEdge(set.edge, set);
						break;
					}
				}
				if (!set) {
					date = new Date(str);
					if (optFromUTC && dateIsValid(date)) date.setTime(date.getTime() + tzOffset(date) * MINUTES);
				} else if (relative) updateDate(date, set, false, 1);
				else updateDate(date, set, true, 0, optPrefer, weekdayDir, contextDate);
				fireCallbacks();
				return date;
			}
			function handleAmpm(ampm) {
				if (ampm === 1 && set.hour < 12) set.hour += 12;
				else if (ampm === 0 && set.hour === 12) set.hour = 0;
			}
			function handleTimezoneOffset(tzHour, tzMinute) {
				_utc(date, true);
				if (tzHour < 0) tzMinute *= -1;
				var offset = tzHour * 60 + (tzMinute || 0);
				if (offset) set.minute = (set.minute || 0) - offset;
			}
			function handleUnitlessShift() {
				if (isDefined(set.month)) set.unit = YEAR_INDEX;
				else if (isDefined(set.weekday)) set.unit = WEEK_INDEX;
			}
			function handleUnitlessNum(num) {
				if (isDefined(set.weekday)) setOrdinalWeekday(num);
				else if (isDefined(set.month)) set.date = set.num;
			}
			function handleMidday(hour) {
				set.hour = hour % 24;
				if (hour > 23) afterDateSet(function() {
					advanceDate(date, "date", trunc(hour / 24));
				});
			}
			function handleRelativeDay() {
				resetTime(date);
				if (isUndefined(set.unit)) {
					set.unit = DAY_INDEX;
					set.num = set.day;
					delete set.day;
				}
			}
			function handleRelativeUnit(unitIndex) {
				var num;
				if (isDefined(set.num)) num = set.num;
				else if (isDefined(set.edge) && isUndefined(set.shift)) num = 0;
				else num = 1;
				if (isDefined(set.weekday)) {
					if (unitIndex === MONTH_INDEX) {
						setOrdinalWeekday(num);
						num = 1;
					} else {
						updateDate(date, { weekday: set.weekday }, true);
						delete set.weekday;
					}
				}
				if (set.half) num *= set.half;
				if (isDefined(set.shift)) num *= set.shift;
				else if (set.sign) num *= set.sign;
				if (isDefined(set.day)) {
					num += set.day;
					delete set.day;
				}
				separateAbsoluteUnits(unitIndex);
				set[English.units[unitIndex]] = num;
				relative = true;
			}
			function handleEdge(edge, params) {
				var edgeIndex = params.unit, weekdayOfMonth;
				if (!edgeIndex) iterateOverHigherDateParams(params, function(unitName, val, unit, i) {
					if (unitName === "weekday" && isDefined(params.month)) return;
					edgeIndex = i;
				});
				if (edgeIndex === MONTH_INDEX && isDefined(params.weekday)) {
					weekdayOfMonth = params.weekday;
					delete params.weekday;
				}
				afterDateSet(function() {
					var stopIndex;
					if (edge < 0) moveToBeginningOfUnit(date, edgeIndex, optLocale);
					else if (edge > 0) {
						if (edge === 1) {
							stopIndex = DAY_INDEX;
							moveToBeginningOfUnit(date, DAY_INDEX);
						}
						moveToEndOfUnit(date, edgeIndex, optLocale, stopIndex);
					}
					if (isDefined(weekdayOfMonth)) {
						setWeekday(date, weekdayOfMonth, -edge);
						resetTime(date);
					}
				});
				if (edgeIndex === MONTH_INDEX) params.specificity = DAY_INDEX;
				else params.specificity = edgeIndex - 1;
			}
			function setOrdinalWeekday(num) {
				set.weekday = 7 * (num - 1) + set.weekday;
				set.date = 1;
				weekdayDir = 1;
			}
			function separateAbsoluteUnits(unitIndex) {
				var params;
				iterateOverDateParams(set, function(name, val, unit, i) {
					if (i >= unitIndex) {
						date.setTime(NaN);
						return false;
					} else if (i < unitIndex) {
						params = params || {};
						params[name] = val;
						deleteDateParam(set, name);
					}
				});
				if (params) {
					afterDateSet(function() {
						updateDate(date, params, true, 0, false, weekdayDir);
						if (optParams) simpleMerge(optParams, params);
					});
					if (set.edge) {
						handleEdge(set.edge, params);
						delete set.edge;
					}
				}
			}
			if (contextDate && d) date = cloneDateByFlag(contextDate, true);
			else date = getNewDate();
			_utc(date, optFromUTC);
			if (isString(d)) date = parseStringDate(d);
			else if (isDate(d)) date = cloneDateByFlag(d, optClone || forceClone);
			else if (isObjectType(d)) {
				set = simpleClone(d);
				updateDate(date, set, true);
			} else if (isNumber(d) || d === null) date.setTime(d);
			_utc(date, !!optSetUTC);
			return {
				set,
				date
			};
		}
		module.exports = getExtendedDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/createDate.js
	var require_createDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getExtendedDate = require_getExtendedDate();
		function createDate(d, options, forceClone) {
			return getExtendedDate(null, d, options, forceClone).date;
		}
		module.exports = createDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/setChainableConstructor.js
	var require_setChainableConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function setChainableConstructor(sugarNamespace, createFn) {
			sugarNamespace.prototype.constructor = function() {
				return createFn.apply(this, arguments);
			};
		}
		module.exports = setChainableConstructor;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/setDateChainableConstructor.js
	var require_setDateChainableConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var createDate = require_createDate();
		var namespaceAliases = require_namespaceAliases();
		var setChainableConstructor = require_setChainableConstructor();
		var sugarDate = namespaceAliases.sugarDate;
		function setDateChainableConstructor() {
			setChainableConstructor(sugarDate, createDate);
		}
		module.exports = setDateChainableConstructor;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/build/setDateChainableConstructorCall.js
	var require_setDateChainableConstructorCall = /* @__PURE__ */ __commonJSMin((() => {
		require_setDateChainableConstructor()();
	}));
	//#endregion
	//#region node_modules/sugar-date/date/create.js
	var require_create = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDate = require_createDate();
		require_setDateChainableConstructorCall();
		Sugar.Date.defineStatic({ "create": function(d, options) {
			return createDate(d, options);
		} });
		module.exports = Sugar.Date.create;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/getKeys.js
	var require_getKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function getKeys(obj) {
			return Object.keys(obj);
		}
		module.exports = getKeys;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getAllLocaleCodes.js
	var require_getAllLocaleCodes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var LocaleHelpers = require_LocaleHelpers();
		var getKeys = require_getKeys();
		var localeManager = LocaleHelpers.localeManager;
		Sugar.Date.defineStatic({ "getAllLocaleCodes": function() {
			return getKeys(localeManager.getAll());
		} });
		module.exports = Sugar.Date.getAllLocaleCodes;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getAllLocales.js
	var require_getAllLocales = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Date.defineStatic({ "getAllLocales": function() {
			return localeManager.getAll();
		} });
		module.exports = Sugar.Date.getAllLocales;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getLocale.js
	var require_getLocale = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Date.defineStatic({ "getLocale": function(code) {
			return localeManager.get(code, !code);
		} });
		module.exports = Sugar.Date.getLocale;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/removeLocale.js
	var require_removeLocale = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Date.defineStatic({ "removeLocale": function(code) {
			return localeManager.remove(code);
		} });
		module.exports = Sugar.Date.removeLocale;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/setLocale.js
	var require_setLocale = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Date.defineStatic({ "setLocale": function(code) {
			return localeManager.set(code);
		} });
		module.exports = Sugar.Date.setLocale;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/wrapNamespace.js
	var require_wrapNamespace = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function wrapNamespace(method) {
			return function(sugarNamespace, arg1, arg2) {
				sugarNamespace[method](arg1, arg2);
			};
		}
		module.exports = wrapNamespace;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/methodDefineAliases.js
	var require_methodDefineAliases = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var wrapNamespace = require_wrapNamespace();
		module.exports = {
			alias: wrapNamespace("alias"),
			defineStatic: wrapNamespace("defineStatic"),
			defineInstance: wrapNamespace("defineInstance"),
			defineStaticPolyfill: wrapNamespace("defineStaticPolyfill"),
			defineInstancePolyfill: wrapNamespace("defineInstancePolyfill"),
			defineInstanceAndStatic: wrapNamespace("defineInstanceAndStatic"),
			defineInstanceWithArguments: wrapNamespace("defineInstanceWithArguments")
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/collectSimilarMethods.js
	var require_collectSimilarMethods = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var forEach = require_forEach();
		var spaceSplit = require_spaceSplit();
		var isString = require_classChecks().isString;
		function collectSimilarMethods(set, fn) {
			var methods = {};
			if (isString(set)) set = spaceSplit(set);
			forEach(set, function(el, i) {
				fn(methods, el, i);
			});
			return methods;
		}
		module.exports = collectSimilarMethods;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/defineInstanceSimilar.js
	var require_defineInstanceSimilar = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var methodDefineAliases = require_methodDefineAliases();
		var collectSimilarMethods = require_collectSimilarMethods();
		var defineInstance = methodDefineAliases.defineInstance;
		function defineInstanceSimilar(sugarNamespace, set, fn, flags) {
			defineInstance(sugarNamespace, collectSimilarMethods(set, fn), flags);
		}
		module.exports = defineInstanceSimilar;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/buildNumberUnitMethods.js
	var require_buildNumberUnitMethods = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var createDate = require_createDate();
		var mathAliases = require_mathAliases();
		var advanceDate = require_advanceDate();
		var namespaceAliases = require_namespaceAliases();
		var defineInstanceSimilar = require_defineInstanceSimilar();
		var sugarNumber = namespaceAliases.sugarNumber;
		var round = mathAliases.round;
		function buildNumberUnitMethods() {
			defineInstanceSimilar(sugarNumber, DateUnits, function(methods, unit) {
				var name = unit.name, base = function(n) {
					return round(n * unit.multiplier);
				}, after = function(n, d, options) {
					return advanceDate(createDate(d, options, true), name, n);
				}, before = function(n, d, options) {
					return advanceDate(createDate(d, options, true), name, -n);
				};
				methods[name] = base;
				methods[name + "s"] = base;
				methods[name + "Before"] = before;
				methods[name + "sBefore"] = before;
				methods[name + "Ago"] = before;
				methods[name + "sAgo"] = before;
				methods[name + "After"] = after;
				methods[name + "sAfter"] = after;
				methods[name + "FromNow"] = after;
				methods[name + "sFromNow"] = after;
			});
		}
		module.exports = buildNumberUnitMethods;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/build/buildNumberUnitMethodsCall.js
	var require_buildNumberUnitMethodsCall = /* @__PURE__ */ __commonJSMin((() => {
		require_buildNumberUnitMethods()();
	}));
	//#endregion
	//#region node_modules/sugar-date/number/day.js
	var require_day = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.day;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/dayAfter.js
	var require_dayAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.dayAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/dayAgo.js
	var require_dayAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.dayAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/dayBefore.js
	var require_dayBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.dayBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/dayFromNow.js
	var require_dayFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.dayFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/days.js
	var require_days$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.days;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/daysAfter.js
	var require_daysAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.daysAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/daysAgo.js
	var require_daysAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.daysAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/daysBefore.js
	var require_daysBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.daysBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/daysFromNow.js
	var require_daysFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.daysFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/duration.js
	var require_duration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var localeManager = require_LocaleHelpers().localeManager;
		Sugar.Number.defineInstance({ "duration": function(n, localeCode) {
			return localeManager.get(localeCode).getDuration(n);
		} });
		module.exports = Sugar.Number.duration;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hour.js
	var require_hour = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hour;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hourAfter.js
	var require_hourAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hourAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hourAgo.js
	var require_hourAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hourAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hourBefore.js
	var require_hourBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hourBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hourFromNow.js
	var require_hourFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hourFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hours.js
	var require_hours$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hours;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hoursAfter.js
	var require_hoursAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hoursAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hoursAgo.js
	var require_hoursAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hoursAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hoursBefore.js
	var require_hoursBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hoursBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/hoursFromNow.js
	var require_hoursFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.hoursFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecond.js
	var require_millisecond = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecond;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondAfter.js
	var require_millisecondAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondAgo.js
	var require_millisecondAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondBefore.js
	var require_millisecondBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondFromNow.js
	var require_millisecondFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/milliseconds.js
	var require_milliseconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.milliseconds;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondsAfter.js
	var require_millisecondsAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondsAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondsAgo.js
	var require_millisecondsAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondsBefore.js
	var require_millisecondsBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondsBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/millisecondsFromNow.js
	var require_millisecondsFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.millisecondsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minute.js
	var require_minute = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minute;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minuteAfter.js
	var require_minuteAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minuteAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minuteAgo.js
	var require_minuteAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minuteAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minuteBefore.js
	var require_minuteBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minuteBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minuteFromNow.js
	var require_minuteFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minuteFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minutes.js
	var require_minutes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minutes;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minutesAfter.js
	var require_minutesAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minutesAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minutesAgo.js
	var require_minutesAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minutesAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minutesBefore.js
	var require_minutesBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minutesBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/minutesFromNow.js
	var require_minutesFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.minutesFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/month.js
	var require_month = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.month;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthAfter.js
	var require_monthAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthAgo.js
	var require_monthAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthBefore.js
	var require_monthBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthFromNow.js
	var require_monthFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/months.js
	var require_months$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.months;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthsAfter.js
	var require_monthsAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthsAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthsAgo.js
	var require_monthsAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthsBefore.js
	var require_monthsBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthsBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/monthsFromNow.js
	var require_monthsFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.monthsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/second.js
	var require_second = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.second;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondAfter.js
	var require_secondAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondAgo.js
	var require_secondAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondBefore.js
	var require_secondBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondFromNow.js
	var require_secondFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/seconds.js
	var require_seconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.seconds;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondsAfter.js
	var require_secondsAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondsAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondsAgo.js
	var require_secondsAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondsBefore.js
	var require_secondsBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondsBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/secondsFromNow.js
	var require_secondsFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.secondsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/week.js
	var require_week = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.week;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weekAfter.js
	var require_weekAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weekAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weekAgo.js
	var require_weekAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weekAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weekBefore.js
	var require_weekBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weekBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weekFromNow.js
	var require_weekFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weekFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weeks.js
	var require_weeks$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weeks;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weeksAfter.js
	var require_weeksAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weeksAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weeksAgo.js
	var require_weeksAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weeksAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weeksBefore.js
	var require_weeksBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weeksBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/weeksFromNow.js
	var require_weeksFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.weeksFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/year.js
	var require_year = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.year;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearAfter.js
	var require_yearAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearAgo.js
	var require_yearAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearBefore.js
	var require_yearBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearFromNow.js
	var require_yearFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/years.js
	var require_years$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.years;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearsAfter.js
	var require_yearsAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearsAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearsAgo.js
	var require_yearsAgo$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearsBefore.js
	var require_yearsBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearsBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/number/yearsFromNow.js
	var require_yearsFromNow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildNumberUnitMethodsCall();
		module.exports = Sugar.Number.yearsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/compareDate.js
	var require_compareDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var MINUTES = require_MINUTES();
		var DateUnits = require_DateUnits();
		var DateUnitIndexes = require_DateUnitIndexes();
		var _utc = require__utc();
		var tzOffset = require_tzOffset();
		var cloneDate = require_cloneDate();
		var isDefined = require_isDefined();
		var advanceDate = require_advanceDate();
		var dateIsValid = require_dateIsValid();
		var moveToEndOfUnit = require_moveToEndOfUnit();
		var getExtendedDate = require_getExtendedDate();
		var moveToBeginningOfUnit = require_moveToBeginningOfUnit();
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		function compareDate(date, d, margin, localeCode, options) {
			var loMargin = 0, hiMargin = 0, timezoneShift, compareEdges, override, min, max, p, t;
			function getTimezoneShift() {
				if (p.set && p.set.specificity) return 0;
				return (tzOffset(p.date) - tzOffset(date)) * MINUTES;
			}
			function addSpecificUnit() {
				var unit = DateUnits[p.set.specificity];
				return advanceDate(cloneDate(p.date), unit.name, 1).getTime() - 1;
			}
			if (_utc(date)) {
				options = options || {};
				options.fromUTC = true;
				options.setUTC = true;
			}
			p = getExtendedDate(null, d, options, true);
			if (margin > 0) {
				loMargin = hiMargin = margin;
				override = true;
			}
			if (!dateIsValid(p.date)) return false;
			if (p.set && p.set.specificity) {
				if (isDefined(p.set.edge) || isDefined(p.set.shift)) {
					compareEdges = true;
					moveToBeginningOfUnit(p.date, p.set.specificity, localeCode);
				}
				if (compareEdges || p.set.specificity === MONTH_INDEX) max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity, localeCode).getTime();
				else max = addSpecificUnit();
				if (!override && isDefined(p.set.sign) && p.set.specificity) {
					loMargin = 50;
					hiMargin = -50;
				}
			}
			t = date.getTime();
			min = p.date.getTime();
			max = max || min;
			timezoneShift = getTimezoneShift();
			// istanbul ignore if
			if (timezoneShift) {
				min -= timezoneShift;
				max -= timezoneShift;
			}
			return t >= min - loMargin && t <= max + hiMargin;
		}
		module.exports = compareDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/simpleCapitalize.js
	var require_simpleCapitalize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function simpleCapitalize(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
		module.exports = simpleCapitalize;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getTimeDistanceForUnit.js
	var require_getTimeDistanceForUnit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var trunc = require_trunc();
		var cloneDate = require_cloneDate();
		var advanceDate = require_advanceDate();
		function getTimeDistanceForUnit(d1, d2, unit) {
			var fwd = d2 > d1, num, tmp;
			if (!fwd) {
				tmp = d2;
				d2 = d1;
				d1 = tmp;
			}
			num = d2 - d1;
			if (unit.multiplier > 1) num = trunc(num / unit.multiplier);
			if (unit.ambiguous) {
				d1 = cloneDate(d1);
				if (num) {
					num -= 1;
					advanceDate(d1, unit.name, num);
				}
				while (d1 < d2) {
					advanceDate(d1, unit.name, 1);
					if (d1 > d2) break;
					num += 1;
				}
			}
			return fwd ? -num : num;
		}
		module.exports = getTimeDistanceForUnit;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/buildDateUnitMethods.js
	var require_buildDateUnitMethods = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var DateUnitIndexes = require_DateUnitIndexes();
		var forEach = require_forEach();
		var createDate = require_createDate();
		var compareDate = require_compareDate();
		var advanceDate = require_advanceDate();
		var moveToEndOfUnit = require_moveToEndOfUnit();
		var namespaceAliases = require_namespaceAliases();
		var simpleCapitalize = require_simpleCapitalize();
		var moveToBeginningOfUnit = require_moveToBeginningOfUnit();
		var defineInstanceSimilar = require_defineInstanceSimilar();
		var getTimeDistanceForUnit = require_getTimeDistanceForUnit();
		var sugarDate = namespaceAliases.sugarDate;
		var HOURS_INDEX = DateUnitIndexes.HOURS_INDEX;
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		function buildDateUnitMethods() {
			defineInstanceSimilar(sugarDate, DateUnits, function(methods, unit, index) {
				var name = unit.name, caps = simpleCapitalize(name);
				if (index > DAY_INDEX) forEach([
					"Last",
					"This",
					"Next"
				], function(shift) {
					methods["is" + shift + caps] = function(d, localeCode) {
						return compareDate(d, shift + " " + name, 0, localeCode, { locale: "en" });
					};
				});
				if (index > HOURS_INDEX) {
					methods["beginningOf" + caps] = function(d, localeCode) {
						return moveToBeginningOfUnit(d, index, localeCode);
					};
					methods["endOf" + caps] = function(d, localeCode) {
						return moveToEndOfUnit(d, index, localeCode);
					};
				}
				methods["add" + caps + "s"] = function(d, num, reset) {
					return advanceDate(d, name, num, reset);
				};
				var since = function(date, d, options) {
					return getTimeDistanceForUnit(date, createDate(d, options, true), unit);
				};
				var until = function(date, d, options) {
					return getTimeDistanceForUnit(createDate(d, options, true), date, unit);
				};
				methods[name + "sAgo"] = methods[name + "sUntil"] = until;
				methods[name + "sSince"] = methods[name + "sFromNow"] = since;
			});
		}
		module.exports = buildDateUnitMethods;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/build/buildDateUnitMethodsCall.js
	var require_buildDateUnitMethodsCall = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateUnitMethods()();
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addDays.js
	var require_addDays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addDays;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addHours.js
	var require_addHours = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addHours;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addMilliseconds.js
	var require_addMilliseconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addMilliseconds;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addMinutes.js
	var require_addMinutes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addMinutes;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addMonths.js
	var require_addMonths = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addMonths;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addSeconds.js
	var require_addSeconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addSeconds;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addWeeks.js
	var require_addWeeks = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addWeeks;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/addYears.js
	var require_addYears = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.addYears;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDateParamsFromString.js
	var require_getDateParamsFromString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isUndefined = require_isUndefined();
		function getDateParamsFromString(str) {
			var match, num, params = {};
			match = str.match(/^(-?\d*[\d.]\d*)?\s?(\w+?)s?$/i);
			if (match) {
				if (isUndefined(num)) num = match[1] ? +match[1] : 1;
				params[match[2].toLowerCase()] = num;
			}
			return params;
		}
		module.exports = getDateParamsFromString;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/collectDateParamsFromArguments.js
	var require_collectDateParamsFromArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnitIndexes = require_DateUnitIndexes();
		var isDefined = require_isDefined();
		var walkUnitDown = require_walkUnitDown();
		var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
		function collectDateParamsFromArguments(args) {
			var params = {}, index = 0;
			walkUnitDown(YEAR_INDEX, function(unit) {
				var arg = args[index++];
				if (isDefined(arg)) params[unit.name] = arg;
			});
			return params;
		}
		module.exports = collectDateParamsFromArguments;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/collectUpdateDateArguments.js
	var require_collectUpdateDateArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var classChecks = require_classChecks();
		var simpleClone = require_simpleClone();
		var isObjectType = require_isObjectType();
		var getDateParamsFromString = require_getDateParamsFromString();
		var collectDateParamsFromArguments = require_collectDateParamsFromArguments();
		var isNumber = classChecks.isNumber;
		var isString = classChecks.isString;
		function collectUpdateDateArguments(args, allowDuration) {
			var arg1 = args[0], arg2 = args[1], params, reset;
			if (allowDuration && isString(arg1)) {
				params = getDateParamsFromString(arg1);
				reset = arg2;
			} else if (isNumber(arg1) && isNumber(arg2)) params = collectDateParamsFromArguments(args);
			else {
				params = isObjectType(arg1) ? simpleClone(arg1) : arg1;
				reset = arg2;
			}
			return [params, reset];
		}
		module.exports = collectUpdateDateArguments;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/advanceDateWithArgs.js
	var require_advanceDateWithArgs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var updateDate = require_updateDate();
		var collectUpdateDateArguments = require_collectUpdateDateArguments();
		function advanceDateWithArgs(d, args, dir) {
			args = collectUpdateDateArguments(args, true);
			return updateDate(d, args[0], args[1], dir);
		}
		module.exports = advanceDateWithArgs;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/advance.js
	var require_advance = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var advanceDateWithArgs = require_advanceDateWithArgs();
		Sugar.Date.defineInstanceWithArguments({ "advance": function(d, args) {
			return advanceDateWithArgs(d, args, 1);
		} });
		module.exports = Sugar.Date.advance;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/beginningOfDay.js
	var require_beginningOfDay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.beginningOfDay;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/beginningOfISOWeek.js
	var require_beginningOfISOWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var resetTime = require_resetTime();
		var getWeekday = require_getWeekday$1();
		var setWeekday = require_setWeekday$1();
		Sugar.Date.defineInstance({ "beginningOfISOWeek": function(date) {
			var day = getWeekday(date);
			if (day === 0) day = -6;
			else if (day !== 1) day = 1;
			setWeekday(date, day);
			return resetTime(date);
		} });
		module.exports = Sugar.Date.beginningOfISOWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/beginningOfMonth.js
	var require_beginningOfMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.beginningOfMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/beginningOfWeek.js
	var require_beginningOfWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.beginningOfWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/beginningOfYear.js
	var require_beginningOfYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.beginningOfYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/clone.js
	var require_clone$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var cloneDate = require_cloneDate();
		Sugar.Date.defineInstance({ "clone": function(date) {
			return cloneDate(date);
		} });
		module.exports = Sugar.Date.clone;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/daysAgo.js
	var require_daysAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.daysAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/daysFromNow.js
	var require_daysFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.daysFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/daysInMonth.js
	var require_daysInMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var getDaysInMonth = require_getDaysInMonth();
		Sugar.Date.defineInstance({ "daysInMonth": function(date) {
			return getDaysInMonth(date);
		} });
		module.exports = Sugar.Date.daysInMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/daysSince.js
	var require_daysSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.daysSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/daysUntil.js
	var require_daysUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.daysUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/endOfDay.js
	var require_endOfDay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.endOfDay;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/endOfISOWeek.js
	var require_endOfISOWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var DateUnitIndexes = require_DateUnitIndexes();
		var getWeekday = require_getWeekday$1();
		var setWeekday = require_setWeekday$1();
		var moveToEndOfUnit = require_moveToEndOfUnit();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		Sugar.Date.defineInstance({ "endOfISOWeek": function(date) {
			if (getWeekday(date) !== 0) setWeekday(date, 7);
			return moveToEndOfUnit(date, DAY_INDEX);
		} });
		module.exports = Sugar.Date.endOfISOWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/endOfMonth.js
	var require_endOfMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.endOfMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/endOfWeek.js
	var require_endOfWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.endOfWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/endOfYear.js
	var require_endOfYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.endOfYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/CoreOutputFormats.js
	var require_CoreOutputFormats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			"ISO8601": "{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}",
			"RFC1123": "{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {ZZ}",
			"RFC1036": "{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {ZZ}"
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/TIMEZONE_ABBREVIATION_REG.js
	var require_TIMEZONE_ABBREVIATION_REG = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = /\(([-+]\d{2,4}|\w{3,5})\)$/;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getHours.js
	var require_getHours = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var callDateGet = require_callDateGet();
		function getHours(d) {
			return callDateGet(d, "Hours");
		}
		module.exports = getHours;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/repeatString.js
	var require_repeatString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function repeatString(str, num) {
			var result = "";
			str = str.toString();
			while (num > 0) {
				if (num & 1) result += str;
				if (num >>= 1) str += str;
			}
			return result;
		}
		module.exports = repeatString;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/padNumber.js
	var require_padNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var mathAliases = require_mathAliases();
		var repeatString = require_repeatString();
		var abs = mathAliases.abs;
		function padNumber(num, place, sign, base, replacement) {
			var str = abs(num).toString(base || 10);
			str = repeatString(replacement || "0", place - str.replace(/\.\d+/, "").length) + str;
			if (sign || num < 0) str = (num < 0 ? "-" : "+") + str;
			return str;
		}
		module.exports = padNumber;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getWeekNumber.js
	var require_getWeekNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var ISODefaults = require_ISODefaults();
		var setDate = require_setDate();
		var getDate = require_getDate();
		var cloneDate = require_cloneDate();
		var isUndefined = require_isUndefined();
		var moveToEndOfWeek = require_moveToEndOfWeek();
		var moveToBeginningOfWeek = require_moveToBeginningOfWeek();
		var moveToFirstDayOfWeekYear = require_moveToFirstDayOfWeekYear();
		var ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK;
		var ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR;
		function getWeekNumber(d, allowPrevious, firstDayOfWeek, firstDayOfWeekYear) {
			var isoWeek, n = 0;
			if (isUndefined(firstDayOfWeek)) firstDayOfWeek = ISO_FIRST_DAY_OF_WEEK;
			if (isUndefined(firstDayOfWeekYear)) firstDayOfWeekYear = ISO_FIRST_DAY_OF_WEEK_YEAR;
			isoWeek = moveToEndOfWeek(cloneDate(d), firstDayOfWeek);
			moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
			if (allowPrevious && d < isoWeek) {
				isoWeek = moveToBeginningOfWeek(cloneDate(d), firstDayOfWeek);
				moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
			}
			while (isoWeek <= d) {
				setDate(isoWeek, getDate(isoWeek) + 7);
				n++;
			}
			return n;
		}
		module.exports = getWeekNumber;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getWeekYear.js
	var require_getWeekYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var getYear = require_getYear();
		var getMonth = require_getMonth();
		var getWeekNumber = require_getWeekNumber();
		var localeManager = LocaleHelpers.localeManager;
		function getWeekYear(d, localeCode, iso) {
			var year = getYear(d), month = getMonth(d), firstDayOfWeek, firstDayOfWeekYear, week, loc;
			if (month === 0 || month === 11) {
				if (!iso) {
					loc = localeManager.get(localeCode);
					firstDayOfWeek = loc.getFirstDayOfWeek(localeCode);
					firstDayOfWeekYear = loc.getFirstDayOfWeekYear(localeCode);
				}
				week = getWeekNumber(d, false, firstDayOfWeek, firstDayOfWeekYear);
				if (month === 0 && week === 0) year -= 1;
				else if (month === 11 && week === 1) year += 1;
			}
			return year;
		}
		module.exports = getWeekYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getUTCOffset.js
	var require_getUTCOffset$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _utc = require__utc();
		var trunc = require_trunc();
		var tzOffset = require_tzOffset();
		var padNumber = require_padNumber();
		var abs = require_mathAliases().abs;
		function getUTCOffset(d, iso) {
			var offset = _utc(d) ? 0 : tzOffset(d), hours, mins, colon = iso === true ? ":" : "";
			if (!offset && iso) return "Z";
			hours = padNumber(trunc(-offset / 60), 2, true);
			mins = padNumber(abs(offset % 60), 2);
			return hours + colon + mins;
		}
		module.exports = getUTCOffset;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getDaysSince.js
	var require_getDaysSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DateUnits = require_DateUnits();
		var DateUnitIndexes = require_DateUnitIndexes();
		var getTimeDistanceForUnit = require_getTimeDistanceForUnit();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		function getDaysSince(d1, d2) {
			return getTimeDistanceForUnit(d1, d2, DateUnits[DAY_INDEX]);
		}
		module.exports = getDaysSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getMeridiemToken.js
	var require_getMeridiemToken = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var trunc = require_trunc();
		var getHours = require_getHours();
		var localeManager = LocaleHelpers.localeManager;
		function getMeridiemToken(d, localeCode) {
			var hours = getHours(d);
			return localeManager.get(localeCode).ampm[trunc(hours / 12)] || "";
		}
		module.exports = getMeridiemToken;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/FormatTokensBase.js
	var require_FormatTokensBase = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var TIMEZONE_ABBREVIATION_REG = require_TIMEZONE_ABBREVIATION_REG();
		var LocaleHelpers = require_LocaleHelpers();
		var DateUnitIndexes = require_DateUnitIndexes();
		var trunc = require_trunc();
		var getDate = require_getDate();
		var getYear = require_getYear();
		var getHours = require_getHours();
		var getMonth = require_getMonth();
		var cloneDate = require_cloneDate();
		var padNumber = require_padNumber();
		var getWeekday = require_getWeekday$1();
		var callDateGet = require_callDateGet();
		var mathAliases = require_mathAliases();
		var getWeekYear = require_getWeekYear();
		var getUTCOffset = require_getUTCOffset$1();
		var getDaysSince = require_getDaysSince();
		var getWeekNumber = require_getWeekNumber();
		var getMeridiemToken = require_getMeridiemToken();
		var setUnitAndLowerToEdge = require_setUnitAndLowerToEdge();
		var localeManager = LocaleHelpers.localeManager;
		var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
		var ceil = mathAliases.ceil;
		module.exports = [
			{
				ldml: "Dow",
				strf: "a",
				lowerToken: "dow",
				get: function(d, localeCode) {
					return localeManager.get(localeCode).getWeekdayName(getWeekday(d), 2);
				}
			},
			{
				ldml: "Weekday",
				strf: "A",
				lowerToken: "weekday",
				allowAlternates: true,
				get: function(d, localeCode, alternate) {
					return localeManager.get(localeCode).getWeekdayName(getWeekday(d), alternate);
				}
			},
			{
				ldml: "Mon",
				strf: "b h",
				lowerToken: "mon",
				get: function(d, localeCode) {
					return localeManager.get(localeCode).getMonthName(getMonth(d), 2);
				}
			},
			{
				ldml: "Month",
				strf: "B",
				lowerToken: "month",
				allowAlternates: true,
				get: function(d, localeCode, alternate) {
					return localeManager.get(localeCode).getMonthName(getMonth(d), alternate);
				}
			},
			{
				strf: "C",
				get: function(d) {
					return getYear(d).toString().slice(0, 2);
				}
			},
			{
				ldml: "d date day",
				strf: "d",
				strfPadding: 2,
				ldmlPaddedToken: "dd",
				ordinalToken: "do",
				get: function(d) {
					return getDate(d);
				}
			},
			{
				strf: "e",
				get: function(d) {
					return padNumber(getDate(d), 2, false, 10, " ");
				}
			},
			{
				ldml: "H 24hr",
				strf: "H",
				strfPadding: 2,
				ldmlPaddedToken: "HH",
				get: function(d) {
					return getHours(d);
				}
			},
			{
				ldml: "h hours 12hr",
				strf: "I",
				strfPadding: 2,
				ldmlPaddedToken: "hh",
				get: function(d) {
					return getHours(d) % 12 || 12;
				}
			},
			{
				ldml: "D",
				strf: "j",
				strfPadding: 3,
				ldmlPaddedToken: "DDD",
				get: function(d) {
					return getDaysSince(d, setUnitAndLowerToEdge(cloneDate(d), MONTH_INDEX)) + 1;
				}
			},
			{
				ldml: "M",
				strf: "m",
				strfPadding: 2,
				ordinalToken: "Mo",
				ldmlPaddedToken: "MM",
				get: function(d) {
					return getMonth(d) + 1;
				}
			},
			{
				ldml: "m minutes",
				strf: "M",
				strfPadding: 2,
				ldmlPaddedToken: "mm",
				get: function(d) {
					return callDateGet(d, "Minutes");
				}
			},
			{
				ldml: "Q",
				get: function(d) {
					return ceil((getMonth(d) + 1) / 3);
				}
			},
			{
				ldml: "TT",
				strf: "p",
				get: function(d, localeCode) {
					return getMeridiemToken(d, localeCode);
				}
			},
			{
				ldml: "tt",
				strf: "P",
				get: function(d, localeCode) {
					return getMeridiemToken(d, localeCode).toLowerCase();
				}
			},
			{
				ldml: "T",
				lowerToken: "t",
				get: function(d, localeCode) {
					return getMeridiemToken(d, localeCode).charAt(0);
				}
			},
			{
				ldml: "s seconds",
				strf: "S",
				strfPadding: 2,
				ldmlPaddedToken: "ss",
				get: function(d) {
					return callDateGet(d, "Seconds");
				}
			},
			{
				ldml: "S ms",
				strfPadding: 3,
				ldmlPaddedToken: "SSS",
				get: function(d) {
					return callDateGet(d, "Milliseconds");
				}
			},
			{
				ldml: "e",
				strf: "u",
				ordinalToken: "eo",
				get: function(d) {
					return getWeekday(d) || 7;
				}
			},
			{
				strf: "U",
				strfPadding: 2,
				get: function(d) {
					return getWeekNumber(d, false, 0);
				}
			},
			{
				ldml: "W",
				strf: "V",
				strfPadding: 2,
				ordinalToken: "Wo",
				ldmlPaddedToken: "WW",
				get: function(d) {
					return getWeekNumber(d, true);
				}
			},
			{
				strf: "w",
				get: function(d) {
					return getWeekday(d);
				}
			},
			{
				ldml: "w",
				ordinalToken: "wo",
				ldmlPaddedToken: "ww",
				get: function(d, localeCode) {
					var loc = localeManager.get(localeCode);
					return getWeekNumber(d, true, loc.getFirstDayOfWeek(localeCode), loc.getFirstDayOfWeekYear(localeCode));
				}
			},
			{
				strf: "W",
				strfPadding: 2,
				get: function(d) {
					return getWeekNumber(d, false);
				}
			},
			{
				ldmlPaddedToken: "gggg",
				ldmlTwoDigitToken: "gg",
				get: function(d, localeCode) {
					return getWeekYear(d, localeCode);
				}
			},
			{
				strf: "G",
				strfPadding: 4,
				strfTwoDigitToken: "g",
				ldmlPaddedToken: "GGGG",
				ldmlTwoDigitToken: "GG",
				get: function(d, localeCode) {
					return getWeekYear(d, localeCode, true);
				}
			},
			{
				ldml: "year",
				ldmlPaddedToken: "yyyy",
				ldmlTwoDigitToken: "yy",
				strf: "Y",
				strfPadding: 4,
				strfTwoDigitToken: "y",
				get: function(d) {
					return getYear(d);
				}
			},
			{
				ldml: "ZZ",
				strf: "z",
				get: function(d) {
					return getUTCOffset(d);
				}
			},
			{
				ldml: "X",
				get: function(d) {
					return trunc(d.getTime() / 1e3);
				}
			},
			{
				ldml: "x",
				get: function(d) {
					return d.getTime();
				}
			},
			{
				ldml: "Z",
				get: function(d) {
					return getUTCOffset(d, true);
				}
			},
			{
				ldml: "z",
				strf: "Z",
				get: function(d) {
					var match = d.toString().match(TIMEZONE_ABBREVIATION_REG);
					// istanbul ignore next
					return match ? match[1] : "";
				}
			},
			{
				strf: "D",
				alias: "%m/%d/%y"
			},
			{
				strf: "F",
				alias: "%Y-%m-%d"
			},
			{
				strf: "r",
				alias: "%I:%M:%S %p"
			},
			{
				strf: "R",
				alias: "%H:%M"
			},
			{
				strf: "T",
				alias: "%H:%M:%S"
			},
			{
				strf: "x",
				alias: "{short}"
			},
			{
				strf: "X",
				alias: "{time}"
			},
			{
				strf: "c",
				alias: "{stamp}"
			}
		];
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/STRING_FORMAT_REG.js
	var require_STRING_FORMAT_REG = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = /([{}])\1|{([^}]*)}|(%)%|(%(\w*))/g;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/var/INTERNAL_MEMOIZE_LIMIT.js
	var require_INTERNAL_MEMOIZE_LIMIT = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = 1e3;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/memoizeFunction.js
	var require_memoizeFunction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var INTERNAL_MEMOIZE_LIMIT = require_INTERNAL_MEMOIZE_LIMIT();
		var hasOwn = require_coreUtilityAliases().hasOwn;
		function memoizeFunction(fn) {
			var memo = {}, counter = 0;
			return function(key) {
				if (hasOwn(memo, key)) return memo[key];
				// istanbul ignore if
				if (counter === INTERNAL_MEMOIZE_LIMIT) {
					memo = {};
					counter = 0;
				}
				counter++;
				return memo[key] = fn(key);
			};
		}
		module.exports = memoizeFunction;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/createFormatMatcher.js
	var require_createFormatMatcher = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var STRING_FORMAT_REG = require_STRING_FORMAT_REG();
		var CommonChars = require_CommonChars();
		var memoizeFunction = require_memoizeFunction();
		var OPEN_BRACE = CommonChars.OPEN_BRACE;
		var CLOSE_BRACE = CommonChars.CLOSE_BRACE;
		function createFormatMatcher(bracketMatcher, percentMatcher, precheck) {
			var reg = STRING_FORMAT_REG;
			var compileMemoized = memoizeFunction(compile);
			function getToken(format, match) {
				var get, token, literal, fn;
				var bKey = match[2];
				var pLit = match[3];
				var pKey = match[5];
				if (match[4] && percentMatcher) {
					token = pKey;
					get = percentMatcher;
				} else if (bKey) {
					token = bKey;
					get = bracketMatcher;
				} else if (pLit && percentMatcher) literal = pLit;
				else literal = match[1] || match[0];
				if (get) {
					assertPassesPrecheck(precheck, bKey, pKey);
					fn = function(obj, opt) {
						return get(obj, token, opt);
					};
				}
				format.push(fn || getLiteral(literal));
			}
			function getSubstring(format, str, start, end) {
				if (end > start) {
					var sub = str.slice(start, end);
					assertNoUnmatched(sub, OPEN_BRACE);
					assertNoUnmatched(sub, CLOSE_BRACE);
					format.push(function() {
						return sub;
					});
				}
			}
			function getLiteral(str) {
				return function() {
					return str;
				};
			}
			function assertPassesPrecheck(precheck, bt, pt) {
				if (precheck && !precheck(bt, pt)) throw new TypeError("Invalid token " + (bt || pt) + " in format string");
			}
			function assertNoUnmatched(str, chr) {
				if (str.indexOf(chr) !== -1) throw new TypeError("Unmatched " + chr + " in format string");
			}
			function compile(str) {
				var format = [], lastIndex = 0, match;
				reg.lastIndex = 0;
				while (match = reg.exec(str)) {
					getSubstring(format, str, lastIndex, match.index);
					getToken(format, match);
					lastIndex = reg.lastIndex;
				}
				getSubstring(format, str, lastIndex, str.length);
				return format;
			}
			return function(str, obj, opt) {
				var format = compileMemoized(str), result = "";
				for (var i = 0; i < format.length; i++) result += format[i](obj, opt);
				return result;
			};
		}
		module.exports = createFormatMatcher;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/var/formattingTokens.js
	var require_formattingTokens = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var FormatTokensBase = require_FormatTokensBase();
		var CoreOutputFormats = require_CoreOutputFormats();
		var forEach = require_forEach();
		var padNumber = require_padNumber();
		var spaceSplit = require_spaceSplit();
		var namespaceAliases = require_namespaceAliases();
		var coreUtilityAliases = require_coreUtilityAliases();
		var createFormatMatcher = require_createFormatMatcher();
		var defineInstanceSimilar = require_defineInstanceSimilar();
		var localeManager = LocaleHelpers.localeManager;
		var hasOwn = coreUtilityAliases.hasOwn;
		var getOwn = coreUtilityAliases.getOwn;
		var forEachProperty = coreUtilityAliases.forEachProperty;
		var sugarDate = namespaceAliases.sugarDate;
		var ldmlTokens;
		var strfTokens;
		function buildDateFormatTokens() {
			function addFormats(target, tokens, fn) {
				if (tokens) forEach(spaceSplit(tokens), function(token) {
					target[token] = fn;
				});
			}
			function buildLowercase(get) {
				return function(d, localeCode) {
					return get(d, localeCode).toLowerCase();
				};
			}
			function buildOrdinal(get) {
				return function(d, localeCode) {
					var n = get(d, localeCode);
					return n + localeManager.get(localeCode).getOrdinal(n);
				};
			}
			function buildPadded(get, padding) {
				return function(d, localeCode) {
					return padNumber(get(d, localeCode), padding);
				};
			}
			function buildTwoDigits(get) {
				return function(d, localeCode) {
					return get(d, localeCode) % 100;
				};
			}
			function buildAlias(alias) {
				return function(d, localeCode) {
					return dateFormatMatcher(alias, d, localeCode);
				};
			}
			function buildAlternates(f) {
				for (var n = 1; n <= 5; n++) buildAlternate(f, n);
			}
			function buildAlternate(f, n) {
				var alternate = function(d, localeCode) {
					return f.get(d, localeCode, n);
				};
				addFormats(ldmlTokens, f.ldml + n, alternate);
				if (f.lowerToken) ldmlTokens[f.lowerToken + n] = buildLowercase(alternate);
			}
			function getIdentityFormat(name) {
				return function(d, localeCode) {
					var loc = localeManager.get(localeCode);
					return dateFormatMatcher(loc[name], d, localeCode);
				};
			}
			ldmlTokens = {};
			strfTokens = {};
			forEach(FormatTokensBase, function(f) {
				var get = f.get, getPadded;
				if (f.lowerToken) ldmlTokens[f.lowerToken] = buildLowercase(get);
				if (f.ordinalToken) ldmlTokens[f.ordinalToken] = buildOrdinal(get, f);
				if (f.ldmlPaddedToken) ldmlTokens[f.ldmlPaddedToken] = buildPadded(get, f.ldmlPaddedToken.length);
				if (f.ldmlTwoDigitToken) ldmlTokens[f.ldmlTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
				if (f.strfTwoDigitToken) strfTokens[f.strfTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
				if (f.strfPadding) getPadded = buildPadded(get, f.strfPadding);
				if (f.alias) get = buildAlias(f.alias);
				if (f.allowAlternates) buildAlternates(f);
				addFormats(ldmlTokens, f.ldml, get);
				addFormats(strfTokens, f.strf, getPadded || get);
			});
			forEachProperty(CoreOutputFormats, function(src, name) {
				addFormats(ldmlTokens, name, buildAlias(src));
			});
			defineInstanceSimilar(sugarDate, "short medium long full", function(methods, name) {
				var fn = getIdentityFormat(name);
				addFormats(ldmlTokens, name, fn);
				methods[name] = fn;
			});
			addFormats(ldmlTokens, "time", getIdentityFormat("time"));
			addFormats(ldmlTokens, "stamp", getIdentityFormat("stamp"));
		}
		var dateFormatMatcher;
		function buildDateFormatMatcher() {
			function getLdml(d, token, localeCode) {
				return getOwn(ldmlTokens, token)(d, localeCode);
			}
			function getStrf(d, token, localeCode) {
				return getOwn(strfTokens, token)(d, localeCode);
			}
			function checkDateToken(ldml, strf) {
				return hasOwn(ldmlTokens, ldml) || hasOwn(strfTokens, strf);
			}
			dateFormatMatcher = createFormatMatcher(getLdml, getStrf, checkDateToken);
		}
		buildDateFormatTokens();
		buildDateFormatMatcher();
		module.exports = {
			ldmlTokens,
			strfTokens,
			dateFormatMatcher
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/assertDateIsValid.js
	var require_assertDateIsValid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var dateIsValid = require_dateIsValid();
		function assertDateIsValid(d) {
			if (!dateIsValid(d)) throw new TypeError("Date is not valid");
		}
		module.exports = assertDateIsValid;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/dateFormat.js
	var require_dateFormat = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var CoreOutputFormats = require_CoreOutputFormats();
		var formattingTokens = require_formattingTokens();
		var assertDateIsValid = require_assertDateIsValid();
		var dateFormatMatcher = formattingTokens.dateFormatMatcher;
		function dateFormat(d, format, localeCode) {
			assertDateIsValid(d);
			format = CoreOutputFormats[format] || format || "{long}";
			return dateFormatMatcher(format, d, localeCode);
		}
		module.exports = dateFormat;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/format.js
	var require_format = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var dateFormat = require_dateFormat();
		Sugar.Date.defineInstance({ "format": function(date, f, localeCode) {
			return dateFormat(date, f, localeCode);
		} });
		module.exports = Sugar.Date.format;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/createDateWithContext.js
	var require_createDateWithContext = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getExtendedDate = require_getExtendedDate();
		function createDateWithContext(contextDate, d, options, forceClone) {
			return getExtendedDate(contextDate, d, options, forceClone).date;
		}
		module.exports = createDateWithContext;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/get.js
	var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDateWithContext = require_createDateWithContext();
		Sugar.Date.defineInstance({ "get": function(date, d, options) {
			return createDateWithContext(date, d, options);
		} });
		module.exports = Sugar.Date.get;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getISOWeek.js
	var require_getISOWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var getWeekNumber = require_getWeekNumber();
		Sugar.Date.defineInstance({ "getISOWeek": function(date) {
			return getWeekNumber(date, true);
		} });
		module.exports = Sugar.Date.getISOWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getUTCOffset.js
	var require_getUTCOffset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var getUTCOffset = require_getUTCOffset$1();
		Sugar.Date.defineInstance({ "getUTCOffset": function(date, iso) {
			return getUTCOffset(date, iso);
		} });
		module.exports = Sugar.Date.getUTCOffset;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getUTCWeekday.js
	var require_getUTCWeekday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		Sugar.Date.defineInstance({ "getUTCWeekday": function(date) {
			return date.getUTCDay();
		} });
		module.exports = Sugar.Date.getUTCWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getWeekday.js
	var require_getWeekday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var getWeekday = require_getWeekday$1();
		Sugar.Date.defineInstance({ "getWeekday": function(date) {
			return getWeekday(date);
		} });
		module.exports = Sugar.Date.getWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/hoursAgo.js
	var require_hoursAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.hoursAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/hoursFromNow.js
	var require_hoursFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.hoursFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/hoursSince.js
	var require_hoursSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.hoursSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/hoursUntil.js
	var require_hoursUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.hoursUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/trim.js
	var require_trim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function trim(str) {
			return str.trim();
		}
		module.exports = trim;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/compareDay.js
	var require_compareDay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var setDate = require_setDate();
		var getDate = require_getDate();
		var getYear = require_getYear();
		var getMonth = require_getMonth();
		var getNewDate = require_getNewDate();
		function compareDay(d, shift) {
			var comp = getNewDate();
			if (shift) setDate(comp, getDate(comp) + shift);
			return getYear(d) === getYear(comp) && getMonth(d) === getMonth(comp) && getDate(d) === getDate(comp);
		}
		module.exports = compareDay;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/fullCompareDate.js
	var require_fullCompareDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var trim = require_trim();
		var getMonth = require_getMonth();
		var isDefined = require_isDefined();
		var getNewDate = require_getNewDate();
		var compareDay = require_compareDay();
		var getWeekday = require_getWeekday$1();
		var dateIsValid = require_dateIsValid();
		var classChecks = require_classChecks();
		var compareDate = require_compareDate();
		var isString = classChecks.isString;
		var English = LocaleHelpers.English;
		function fullCompareDate(date, d, margin) {
			var tmp;
			if (!dateIsValid(date)) return;
			if (isString(d)) {
				d = trim(d).toLowerCase();
				switch (true) {
					case d === "future": return date.getTime() > getNewDate().getTime();
					case d === "past": return date.getTime() < getNewDate().getTime();
					case d === "today": return compareDay(date);
					case d === "tomorrow": return compareDay(date, 1);
					case d === "yesterday": return compareDay(date, -1);
					case d === "weekday": return getWeekday(date) > 0 && getWeekday(date) < 6;
					case d === "weekend": return getWeekday(date) === 0 || getWeekday(date) === 6;
					case isDefined(tmp = English.weekdayMap[d]): return getWeekday(date) === tmp;
					case isDefined(tmp = English.monthMap[d]): return getMonth(date) === tmp;
				}
			}
			return compareDate(date, d, margin);
		}
		module.exports = fullCompareDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/is.js
	var require_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var fullCompareDate = require_fullCompareDate();
		Sugar.Date.defineInstance({ "is": function(date, d, margin) {
			return fullCompareDate(date, d, margin);
		} });
		module.exports = Sugar.Date.is;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isAfter.js
	var require_isAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDate = require_createDate();
		Sugar.Date.defineInstance({ "isAfter": function(date, d, margin) {
			return date.getTime() > createDate(d).getTime() - (margin || 0);
		} });
		module.exports = Sugar.Date.isAfter;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isBefore.js
	var require_isBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDate = require_createDate();
		Sugar.Date.defineInstance({ "isBefore": function(date, d, margin) {
			return date.getTime() < createDate(d).getTime() + (margin || 0);
		} });
		module.exports = Sugar.Date.isBefore;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isBetween.js
	var require_isBetween = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDate = require_createDate();
		var mathAliases = require_mathAliases();
		var min = mathAliases.min;
		var max = mathAliases.max;
		Sugar.Date.defineInstance({ "isBetween": function(date, d1, d2, margin) {
			var t = date.getTime();
			var t1 = createDate(d1).getTime();
			var t2 = createDate(d2).getTime();
			var lo = min(t1, t2);
			var hi = max(t1, t2);
			margin = margin || 0;
			return lo - margin <= t && hi + margin >= t;
		} });
		module.exports = Sugar.Date.isBetween;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/buildRelativeAliases.js
	var require_buildRelativeAliases = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var spaceSplit = require_spaceSplit();
		var fullCompareDate = require_fullCompareDate();
		var namespaceAliases = require_namespaceAliases();
		var defineInstanceSimilar = require_defineInstanceSimilar();
		var English = LocaleHelpers.English;
		var sugarDate = namespaceAliases.sugarDate;
		function buildRelativeAliases() {
			var special = spaceSplit("Today Yesterday Tomorrow Weekday Weekend Future Past");
			var weekdays = English.weekdays.slice(0, 7);
			var months = English.months.slice(0, 12);
			defineInstanceSimilar(sugarDate, special.concat(weekdays).concat(months), function(methods, name) {
				methods["is" + name] = function(d) {
					return fullCompareDate(d, name);
				};
			});
		}
		module.exports = buildRelativeAliases;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/build/buildRelativeAliasesCall.js
	var require_buildRelativeAliasesCall = /* @__PURE__ */ __commonJSMin((() => {
		require_buildRelativeAliases()();
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isFriday.js
	var require_isFriday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isFriday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isFuture.js
	var require_isFuture = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isFuture;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isLastMonth.js
	var require_isLastMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isLastMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isLastWeek.js
	var require_isLastWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isLastWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isLastYear.js
	var require_isLastYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isLastYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isLeapYear.js
	var require_isLeapYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var getYear = require_getYear();
		Sugar.Date.defineInstance({ "isLeapYear": function(date) {
			var year = getYear(date);
			return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
		} });
		module.exports = Sugar.Date.isLeapYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isMonday.js
	var require_isMonday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isMonday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isNextMonth.js
	var require_isNextMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isNextMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isNextWeek.js
	var require_isNextWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isNextWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isNextYear.js
	var require_isNextYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isNextYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isPast.js
	var require_isPast = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isPast;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isSaturday.js
	var require_isSaturday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isSaturday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isSunday.js
	var require_isSunday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isSunday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isThisMonth.js
	var require_isThisMonth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isThisMonth;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isThisWeek.js
	var require_isThisWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isThisWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isThisYear.js
	var require_isThisYear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.isThisYear;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isThursday.js
	var require_isThursday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isThursday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isToday.js
	var require_isToday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isToday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isTomorrow.js
	var require_isTomorrow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isTomorrow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isTuesday.js
	var require_isTuesday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isTuesday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/isUTC.js
	var require_isUTC$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var _utc = require__utc();
		var tzOffset = require_tzOffset();
		function isUTC(d) {
			return !!_utc(d) || tzOffset(d) === 0;
		}
		module.exports = isUTC;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isUTC.js
	var require_isUTC = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var isUTC = require_isUTC$1();
		Sugar.Date.defineInstance({ "isUTC": function(date) {
			return isUTC(date);
		} });
		module.exports = Sugar.Date.isUTC;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isValid.js
	var require_isValid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var dateIsValid = require_dateIsValid();
		Sugar.Date.defineInstance({ "isValid": function(date) {
			return dateIsValid(date);
		} });
		module.exports = Sugar.Date.isValid;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isWednesday.js
	var require_isWednesday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isWednesday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isWeekday.js
	var require_isWeekday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isWeekend.js
	var require_isWeekend = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isWeekend;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/isYesterday.js
	var require_isYesterday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildRelativeAliasesCall();
		module.exports = Sugar.Date.isYesterday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/iso.js
	var require_iso = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		Sugar.Date.defineInstance({ "iso": function(date) {
			return date.toISOString();
		} });
		module.exports = Sugar.Date.iso;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/millisecondsAgo.js
	var require_millisecondsAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.millisecondsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/millisecondsFromNow.js
	var require_millisecondsFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.millisecondsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/millisecondsSince.js
	var require_millisecondsSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.millisecondsSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/millisecondsUntil.js
	var require_millisecondsUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.millisecondsUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/minutesAgo.js
	var require_minutesAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.minutesAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/minutesFromNow.js
	var require_minutesFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.minutesFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/minutesSince.js
	var require_minutesSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.minutesSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/minutesUntil.js
	var require_minutesUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.minutesUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/monthsAgo.js
	var require_monthsAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.monthsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/monthsFromNow.js
	var require_monthsFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.monthsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/monthsSince.js
	var require_monthsSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.monthsSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/monthsUntil.js
	var require_monthsUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.monthsUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getAdjustedUnitForDate.js
	var require_getAdjustedUnitForDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var getNewDate = require_getNewDate();
		var mathAliases = require_mathAliases();
		var getAdjustedUnit = require_getAdjustedUnit();
		var getTimeDistanceForUnit = require_getTimeDistanceForUnit();
		var abs = mathAliases.abs;
		function getAdjustedUnitForDate(d, dRelative) {
			var ms;
			if (!dRelative) {
				dRelative = getNewDate();
				if (d > dRelative) dRelative = /* @__PURE__ */ new Date(dRelative.getTime() - 10);
			}
			ms = d - dRelative;
			return getAdjustedUnit(ms, function(u) {
				return abs(getTimeDistanceForUnit(d, dRelative, u));
			});
		}
		module.exports = getAdjustedUnitForDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/dateRelative.js
	var require_dateRelative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var LocaleHelpers = require_LocaleHelpers();
		var dateFormat = require_dateFormat();
		var classChecks = require_classChecks();
		var assertDateIsValid = require_assertDateIsValid();
		var getAdjustedUnitForDate = require_getAdjustedUnitForDate();
		var isFunction = classChecks.isFunction;
		var localeManager = LocaleHelpers.localeManager;
		function dateRelative(d, dRelative, arg1, arg2) {
			var adu, format, type, localeCode, fn;
			assertDateIsValid(d);
			if (isFunction(arg1)) fn = arg1;
			else {
				localeCode = arg1;
				fn = arg2;
			}
			adu = getAdjustedUnitForDate(d, dRelative);
			if (fn) {
				format = fn.apply(d, adu.concat(localeManager.get(localeCode)));
				if (format) return dateFormat(d, format, localeCode);
			}
			if (adu[1] === 0) {
				adu[1] = 1;
				adu[0] = 1;
			}
			if (dRelative) type = "duration";
			else if (adu[2] > 0) type = "future";
			else type = "past";
			return localeManager.get(localeCode).getRelativeFormat(adu, type);
		}
		module.exports = dateRelative;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/relative.js
	var require_relative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var dateRelative = require_dateRelative();
		Sugar.Date.defineInstance({ "relative": function(date, localeCode, relativeFn) {
			return dateRelative(date, null, localeCode, relativeFn);
		} });
		module.exports = Sugar.Date.relative;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/relativeTo.js
	var require_relativeTo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var createDate = require_createDate();
		var dateRelative = require_dateRelative();
		Sugar.Date.defineInstance({ "relativeTo": function(date, d, localeCode) {
			return dateRelative(date, createDate(d), localeCode);
		} });
		module.exports = Sugar.Date.relativeTo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/internal/getUnitIndexForParamName.js
	var require_getUnitIndexForParamName = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var iterateOverDateParams = require_iterateOverDateParams();
		function getUnitIndexForParamName(name) {
			var params = {}, unitIndex;
			params[name] = 1;
			iterateOverDateParams(params, function(name, val, unit, i) {
				unitIndex = i;
				return false;
			});
			return unitIndex;
		}
		module.exports = getUnitIndexForParamName;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/reset.js
	var require_reset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var DateUnitIndexes = require_DateUnitIndexes();
		var moveToBeginningOfUnit = require_moveToBeginningOfUnit();
		var getUnitIndexForParamName = require_getUnitIndexForParamName();
		var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
		Sugar.Date.defineInstance({ "reset": function(date, unit, localeCode) {
			moveToBeginningOfUnit(date, unit ? getUnitIndexForParamName(unit) : DAY_INDEX, localeCode);
			return date;
		} });
		module.exports = Sugar.Date.reset;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/rewind.js
	var require_rewind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var advanceDateWithArgs = require_advanceDateWithArgs();
		Sugar.Date.defineInstanceWithArguments({ "rewind": function(d, args) {
			return advanceDateWithArgs(d, args, -1);
		} });
		module.exports = Sugar.Date.rewind;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/secondsAgo.js
	var require_secondsAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.secondsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/secondsFromNow.js
	var require_secondsFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.secondsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/secondsSince.js
	var require_secondsSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.secondsSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/secondsUntil.js
	var require_secondsUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.secondsUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/set.js
	var require_set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var updateDate = require_updateDate();
		var collectUpdateDateArguments = require_collectUpdateDateArguments();
		Sugar.Date.defineInstanceWithArguments({ "set": function(d, args) {
			args = collectUpdateDateArguments(args);
			return updateDate(d, args[0], args[1]);
		} });
		module.exports = Sugar.Date.set;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/setISOWeek.js
	var require_setISOWeek = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var setISOWeekNumber = require_setISOWeekNumber();
		Sugar.Date.defineInstance({ "setISOWeek": function(date, num) {
			return setISOWeekNumber(date, num);
		} });
		module.exports = Sugar.Date.setISOWeek;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/setUTC.js
	var require_setUTC = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var _utc = require__utc();
		Sugar.Date.defineInstance({ "setUTC": function(date, on) {
			return _utc(date, on);
		} });
		module.exports = Sugar.Date.setUTC;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/setWeekday.js
	var require_setWeekday = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var setWeekday = require_setWeekday$1();
		Sugar.Date.defineInstance({ "setWeekday": function(date, dow) {
			return setWeekday(date, dow);
		} });
		module.exports = Sugar.Date.setWeekday;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/weeksAgo.js
	var require_weeksAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.weeksAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/weeksFromNow.js
	var require_weeksFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.weeksFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/weeksSince.js
	var require_weeksSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.weeksSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/weeksUntil.js
	var require_weeksUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.weeksUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/yearsAgo.js
	var require_yearsAgo = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.yearsAgo;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/yearsFromNow.js
	var require_yearsFromNow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.yearsFromNow;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/yearsSince.js
	var require_yearsSince = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.yearsSince;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/yearsUntil.js
	var require_yearsUntil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require_buildDateUnitMethodsCall();
		module.exports = Sugar.Date.yearsUntil;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/getOption.js
	var require_getOption = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require__dateOptions();
		module.exports = Sugar.Date.getOption;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/setOption.js
	var require_setOption = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		require__dateOptions();
		module.exports = Sugar.Date.setOption;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/index.js
	var require_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		require_addLocale();
		require_create();
		require_getAllLocaleCodes();
		require_getAllLocales();
		require_getLocale();
		require_removeLocale();
		require_setLocale();
		require_day();
		require_dayAfter();
		require_dayAgo();
		require_dayBefore();
		require_dayFromNow();
		require_days$1();
		require_daysAfter();
		require_daysAgo$1();
		require_daysBefore();
		require_daysFromNow$1();
		require_duration();
		require_hour();
		require_hourAfter();
		require_hourAgo();
		require_hourBefore();
		require_hourFromNow();
		require_hours$1();
		require_hoursAfter();
		require_hoursAgo$1();
		require_hoursBefore();
		require_hoursFromNow$1();
		require_millisecond();
		require_millisecondAfter();
		require_millisecondAgo();
		require_millisecondBefore();
		require_millisecondFromNow();
		require_milliseconds$1();
		require_millisecondsAfter();
		require_millisecondsAgo$1();
		require_millisecondsBefore();
		require_millisecondsFromNow$1();
		require_minute();
		require_minuteAfter();
		require_minuteAgo();
		require_minuteBefore();
		require_minuteFromNow();
		require_minutes$1();
		require_minutesAfter();
		require_minutesAgo$1();
		require_minutesBefore();
		require_minutesFromNow$1();
		require_month();
		require_monthAfter();
		require_monthAgo();
		require_monthBefore();
		require_monthFromNow();
		require_months$1();
		require_monthsAfter();
		require_monthsAgo$1();
		require_monthsBefore();
		require_monthsFromNow$1();
		require_second();
		require_secondAfter();
		require_secondAgo();
		require_secondBefore();
		require_secondFromNow();
		require_seconds$1();
		require_secondsAfter();
		require_secondsAgo$1();
		require_secondsBefore();
		require_secondsFromNow$1();
		require_week();
		require_weekAfter();
		require_weekAgo();
		require_weekBefore();
		require_weekFromNow();
		require_weeks$1();
		require_weeksAfter();
		require_weeksAgo$1();
		require_weeksBefore();
		require_weeksFromNow$1();
		require_year();
		require_yearAfter();
		require_yearAgo();
		require_yearBefore();
		require_yearFromNow();
		require_years$1();
		require_yearsAfter();
		require_yearsAgo$1();
		require_yearsBefore();
		require_yearsFromNow$1();
		require_addDays();
		require_addHours();
		require_addMilliseconds();
		require_addMinutes();
		require_addMonths();
		require_addSeconds();
		require_addWeeks();
		require_addYears();
		require_advance();
		require_beginningOfDay();
		require_beginningOfISOWeek();
		require_beginningOfMonth();
		require_beginningOfWeek();
		require_beginningOfYear();
		require_clone$1();
		require_daysAgo();
		require_daysFromNow();
		require_daysInMonth();
		require_daysSince();
		require_daysUntil();
		require_endOfDay();
		require_endOfISOWeek();
		require_endOfMonth();
		require_endOfWeek();
		require_endOfYear();
		require_format();
		require_get();
		require_getISOWeek();
		require_getUTCOffset();
		require_getUTCWeekday();
		require_getWeekday();
		require_hoursAgo();
		require_hoursFromNow();
		require_hoursSince();
		require_hoursUntil();
		require_is();
		require_isAfter();
		require_isBefore();
		require_isBetween();
		require_isFriday();
		require_isFuture();
		require_isLastMonth();
		require_isLastWeek();
		require_isLastYear();
		require_isLeapYear();
		require_isMonday();
		require_isNextMonth();
		require_isNextWeek();
		require_isNextYear();
		require_isPast();
		require_isSaturday();
		require_isSunday();
		require_isThisMonth();
		require_isThisWeek();
		require_isThisYear();
		require_isThursday();
		require_isToday();
		require_isTomorrow();
		require_isTuesday();
		require_isUTC();
		require_isValid$1();
		require_isWednesday();
		require_isWeekday();
		require_isWeekend();
		require_isYesterday();
		require_iso();
		require_millisecondsAgo();
		require_millisecondsFromNow();
		require_millisecondsSince();
		require_millisecondsUntil();
		require_minutesAgo();
		require_minutesFromNow();
		require_minutesSince();
		require_minutesUntil();
		require_monthsAgo();
		require_monthsFromNow();
		require_monthsSince();
		require_monthsUntil();
		require_relative();
		require_relativeTo();
		require_reset();
		require_rewind();
		require_secondsAgo();
		require_secondsFromNow();
		require_secondsSince();
		require_secondsUntil();
		require_set();
		require_setISOWeek();
		require_setUTC();
		require_setWeekday();
		require_weeksAgo();
		require_weeksFromNow();
		require_weeksSince();
		require_weeksUntil();
		require_yearsAgo();
		require_yearsFromNow();
		require_yearsSince();
		require_yearsUntil();
		require_getOption();
		require_setOption();
		module.exports = require_sugar_core();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getRangeMemberPrimitiveValue.js
	var require_getRangeMemberPrimitiveValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isDate = require_classChecks().isDate;
		function getRangeMemberPrimitiveValue(m) {
			if (m == null) return m;
			return isDate(m) ? m.getTime() : m.valueOf();
		}
		module.exports = getRangeMemberPrimitiveValue;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/cloneRangeMember.js
	var require_cloneRangeMember = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var classChecks = require_classChecks();
		var getRangeMemberPrimitiveValue = require_getRangeMemberPrimitiveValue();
		var isDate = classChecks.isDate;
		function cloneRangeMember(m) {
			if (isDate(m)) return new Date(m.getTime());
			else return getRangeMemberPrimitiveValue(m);
		}
		module.exports = cloneRangeMember;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/Range.js
	var require_Range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var cloneRangeMember = require_cloneRangeMember();
		function Range(start, end) {
			this.start = cloneRangeMember(start);
			this.end = cloneRangeMember(end);
		}
		module.exports = Range;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getDateForRange.js
	var require_getDateForRange = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var classChecks = require_classChecks();
		var namespaceAliases = require_namespaceAliases();
		var isDate = classChecks.isDate;
		var sugarDate = namespaceAliases.sugarDate;
		function getDateForRange(d) {
			if (isDate(d)) return d;
			else if (d == null) return /* @__PURE__ */ new Date();
			else if (sugarDate.create) return sugarDate.create(d);
			return new Date(d);
		}
		module.exports = getDateForRange;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/DURATION_UNITS.js
	var require_DURATION_UNITS = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = "year|month|week|day|hour|minute|second|millisecond";
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/FULL_CAPTURED_DURATION.js
	var require_FULL_CAPTURED_DURATION = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = "((?:\\d+)?\\s*(?:" + require_DURATION_UNITS() + "))s?";
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/DurationTextFormats.js
	var require_DurationTextFormats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var FULL_CAPTURED_DURATION = require_FULL_CAPTURED_DURATION();
		module.exports = {
			RANGE_REG_FROM_TO: /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i,
			RANGE_REG_REAR_DURATION: RegExp("(.+)\\s*for\\s*" + FULL_CAPTURED_DURATION, "i"),
			RANGE_REG_FRONT_DURATION: RegExp("(?:for)?\\s*" + FULL_CAPTURED_DURATION + "\\s*(?:starting)?\\s(?:at\\s)?(.+)", "i")
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/MULTIPLIERS.js
	var require_MULTIPLIERS = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			"Hours": 36e5,
			"Minutes": 6e4,
			"Seconds": 1e3,
			"Milliseconds": 1
		};
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/incrementDate.js
	var require_incrementDate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var MULTIPLIERS = require_MULTIPLIERS();
		var callDateSet = require_callDateSet();
		var callDateGet = require_callDateGet();
		function incrementDate(src, amount, unit) {
			var mult = MULTIPLIERS[unit], d;
			if (mult) d = new Date(src.getTime() + amount * mult);
			else {
				d = new Date(src);
				callDateSet(d, unit, callDateGet(src, unit) + amount);
			}
			return d;
		}
		module.exports = incrementDate;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/DURATION_REG.js
	var require_DURATION_REG = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DURATION_UNITS = require_DURATION_UNITS();
		module.exports = RegExp("(\\d+)?\\s*(" + DURATION_UNITS + ")s?", "i");
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getDateIncrementObject.js
	var require_getDateIncrementObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var DURATION_REG = require_DURATION_REG();
		var classChecks = require_classChecks();
		var simpleCapitalize = require_simpleCapitalize();
		var isNumber = classChecks.isNumber;
		function getDateIncrementObject(amt) {
			var match, val, unit;
			if (isNumber(amt)) return [amt, "Milliseconds"];
			match = amt.match(DURATION_REG);
			val = +match[1] || 1;
			unit = simpleCapitalize(match[2].toLowerCase());
			if (unit.match(/hour|minute|second/i)) unit += "s";
			else if (unit === "Year") unit = "FullYear";
			else if (unit === "Week") {
				unit = "Date";
				val *= 7;
			} else if (unit === "Day") unit = "Date";
			return [val, unit];
		}
		module.exports = getDateIncrementObject;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/createDateRangeFromString.js
	var require_createDateRangeFromString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Range = require_Range();
		var DurationTextFormats = require_DurationTextFormats();
		var incrementDate = require_incrementDate();
		var getDateForRange = require_getDateForRange();
		var namespaceAliases = require_namespaceAliases();
		var getDateIncrementObject = require_getDateIncrementObject();
		var sugarDate = namespaceAliases.sugarDate;
		var RANGE_REG_FROM_TO = DurationTextFormats.RANGE_REG_FROM_TO;
		var RANGE_REG_REAR_DURATION = DurationTextFormats.RANGE_REG_REAR_DURATION;
		var RANGE_REG_FRONT_DURATION = DurationTextFormats.RANGE_REG_FRONT_DURATION;
		function createDateRangeFromString(str) {
			var match, datetime, duration, dio, start, end;
			if (sugarDate.get && (match = str.match(RANGE_REG_FROM_TO))) {
				start = getDateForRange(match[1].replace("from", "at"));
				end = sugarDate.get(start, match[2]);
				return new Range(start, end);
			}
			if (match = str.match(RANGE_REG_FRONT_DURATION)) {
				duration = match[1];
				datetime = match[2];
			}
			if (match = str.match(RANGE_REG_REAR_DURATION)) {
				datetime = match[1];
				duration = match[2];
			}
			if (datetime && duration) {
				start = getDateForRange(datetime);
				dio = getDateIncrementObject(duration);
				end = incrementDate(start, dio[0], dio[1]);
			} else start = str;
			return new Range(getDateForRange(start), getDateForRange(end));
		}
		module.exports = createDateRangeFromString;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/var/DateRangeConstructor.js
	var require_DateRangeConstructor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Range = require_Range();
		var classChecks = require_classChecks();
		var getDateForRange = require_getDateForRange();
		var createDateRangeFromString = require_createDateRangeFromString();
		var isString = classChecks.isString;
		var DateRangeConstructor = function(start, end) {
			if (arguments.length === 1 && isString(start)) return createDateRangeFromString(start);
			return new Range(getDateForRange(start), getDateForRange(end));
		};
		module.exports = DateRangeConstructor;
	}));
	//#endregion
	//#region node_modules/sugar-date/date/range.js
	var require_range$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Sugar = require_sugar_core();
		var DateRangeConstructor = require_DateRangeConstructor();
		Sugar.Date.defineStatic({ "range": DateRangeConstructor });
		module.exports = Sugar.Date.range;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/rangeClamp.js
	var require_rangeClamp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var cloneRangeMember = require_cloneRangeMember();
		function rangeClamp(range, obj) {
			var clamped, start = range.start, end = range.end, min = end < start ? end : start, max = start > end ? start : end;
			if (obj < min) clamped = min;
			else if (obj > max) clamped = max;
			else clamped = obj;
			return cloneRangeMember(clamped);
		}
		module.exports = rangeClamp;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/defineOnPrototype.js
	var require_defineOnPrototype = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var forEachProperty = require_coreUtilityAliases().forEachProperty;
		function defineOnPrototype(ctor, methods) {
			var proto = ctor.prototype;
			forEachProperty(methods, function(val, key) {
				proto[key] = val;
			});
		}
		module.exports = defineOnPrototype;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/clamp.js
	var require_clamp = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var rangeClamp = require_rangeClamp();
		require_defineOnPrototype()(Range, { "clamp": function(el) {
			return rangeClamp(this, el);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/clone.js
	var require_clone = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		require_defineOnPrototype()(Range, { "clone": function() {
			return new Range(this.start, this.end);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/contains.js
	var require_contains = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		require_defineOnPrototype()(Range, { "contains": function(el) {
			if (el == null) return false;
			if (el.start && el.end) return el.start >= this.start && el.start <= this.end && el.end >= this.start && el.end <= this.end;
			else return el >= this.start && el <= this.end;
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/valueIsNotInfinite.js
	var require_valueIsNotInfinite = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		function valueIsNotInfinite(m) {
			return m !== -Infinity && m !== Infinity;
		}
		module.exports = valueIsNotInfinite;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/isValidRangeMember.js
	var require_isValidRangeMember = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var valueIsNotInfinite = require_valueIsNotInfinite();
		var getRangeMemberPrimitiveValue = require_getRangeMemberPrimitiveValue();
		function isValidRangeMember(m) {
			var val = getRangeMemberPrimitiveValue(m);
			return (!!val || val === 0) && valueIsNotInfinite(m);
		}
		module.exports = isValidRangeMember;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/rangeIsValid.js
	var require_rangeIsValid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isValidRangeMember = require_isValidRangeMember();
		function rangeIsValid(range) {
			return isValidRangeMember(range.start) && isValidRangeMember(range.end) && typeof range.start === typeof range.end;
		}
		module.exports = rangeIsValid;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/incrementNumber.js
	var require_incrementNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var withPrecision = require_withPrecision();
		function incrementNumber(current, amount, precision) {
			return withPrecision(current + amount, precision);
		}
		module.exports = incrementNumber;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/incrementString.js
	var require_incrementString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var chr = require_chr();
		function incrementString(current, amount) {
			return chr(current.charCodeAt(0) + amount);
		}
		module.exports = incrementString;
	}));
	//#endregion
	//#region node_modules/sugar-date/common/internal/periodSplit.js
	var require_periodSplit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var HALF_WIDTH_PERIOD = require_CommonChars().HALF_WIDTH_PERIOD;
		function periodSplit(str) {
			return str.split(HALF_WIDTH_PERIOD);
		}
		module.exports = periodSplit;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getPrecision.js
	var require_getPrecision = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var periodSplit = require_periodSplit();
		function getPrecision(n) {
			var split = periodSplit(n.toString());
			return split[1] ? split[1].length : 0;
		}
		module.exports = getPrecision;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getGreaterPrecision.js
	var require_getGreaterPrecision = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var mathAliases = require_mathAliases();
		var getPrecision = require_getPrecision();
		var max = mathAliases.max;
		function getGreaterPrecision(n1, n2) {
			return max(getPrecision(n1), getPrecision(n2));
		}
		module.exports = getGreaterPrecision;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/rangeEvery.js
	var require_rangeEvery = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var classChecks = require_classChecks();
		var rangeIsValid = require_rangeIsValid();
		var incrementDate = require_incrementDate();
		var incrementNumber = require_incrementNumber();
		var incrementString = require_incrementString();
		var getGreaterPrecision = require_getGreaterPrecision();
		var getDateIncrementObject = require_getDateIncrementObject();
		var isNumber = classChecks.isNumber;
		var isString = classChecks.isString;
		var isDate = classChecks.isDate;
		var isFunction = classChecks.isFunction;
		function rangeEvery(range, step, countOnly, fn) {
			var increment, precision, dio, unit, start = range.start, end = range.end, inverse = end < start, current = start, index = 0, result = [];
			if (!rangeIsValid(range)) return countOnly ? NaN : [];
			if (isFunction(step)) {
				fn = step;
				step = null;
			}
			step = step || 1;
			if (isNumber(start)) {
				precision = getGreaterPrecision(start, step);
				increment = function() {
					return incrementNumber(current, step, precision);
				};
			} else if (isString(start)) increment = function() {
				return incrementString(current, step);
			};
			else if (isDate(start)) {
				dio = getDateIncrementObject(step);
				step = dio[0];
				unit = dio[1];
				increment = function() {
					return incrementDate(current, step, unit);
				};
			}
			if (inverse && step > 0) step *= -1;
			while (inverse ? current >= end : current <= end) {
				if (!countOnly) result.push(current);
				if (fn) fn(current, index, range);
				current = increment();
				index++;
			}
			return countOnly ? index - 1 : result;
		}
		module.exports = rangeEvery;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/buildDateRangeUnits.js
	var require_buildDateRangeUnits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var MULTIPLIERS = require_MULTIPLIERS();
		var DURATION_UNITS = require_DURATION_UNITS();
		var Range = require_Range();
		var trunc = require_trunc();
		var forEach = require_forEach();
		var rangeEvery = require_rangeEvery();
		var simpleCapitalize = require_simpleCapitalize();
		var defineOnPrototype = require_defineOnPrototype();
		function buildDateRangeUnits() {
			var methods = {};
			forEach(DURATION_UNITS.split("|"), function(unit, i) {
				var name = unit + "s", mult, fn;
				if (i < 4) fn = function() {
					return rangeEvery(this, unit, true);
				};
				else {
					mult = MULTIPLIERS[simpleCapitalize(name)];
					fn = function() {
						return trunc((this.end - this.start) / mult);
					};
				}
				methods[name] = fn;
			});
			defineOnPrototype(Range, methods);
		}
		module.exports = buildDateRangeUnits;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/build/buildDateRangeUnitsCall.js
	var require_buildDateRangeUnitsCall = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnits()();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/days.js
	var require_days = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/every.js
	var require_every = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var rangeEvery = require_rangeEvery();
		require_defineOnPrototype()(Range, { "every": function(amount, everyFn) {
			return rangeEvery(this, amount, false, everyFn);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/hours.js
	var require_hours = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/intersect.js
	var require_intersect = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		require_defineOnPrototype()(Range, { "intersect": function(range) {
			if (range.start > this.end || range.end < this.start) return new Range(NaN, NaN);
			return new Range(this.start > range.start ? this.start : range.start, this.end < range.end ? this.end : range.end);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/isValid.js
	var require_isValid = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var rangeIsValid = require_rangeIsValid();
		require_defineOnPrototype()(Range, { "isValid": function() {
			return rangeIsValid(this);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/milliseconds.js
	var require_milliseconds = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/minutes.js
	var require_minutes = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/months.js
	var require_months = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/seconds.js
	var require_seconds = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/internal/getRangeMemberNumericValue.js
	var require_getRangeMemberNumericValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var isString = require_classChecks().isString;
		function getRangeMemberNumericValue(m) {
			return isString(m) ? m.charCodeAt(0) : m;
		}
		module.exports = getRangeMemberNumericValue;
	}));
	//#endregion
	//#region node_modules/sugar-date/range/span.js
	var require_span = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var mathAliases = require_mathAliases();
		var rangeIsValid = require_rangeIsValid();
		var defineOnPrototype = require_defineOnPrototype();
		var getRangeMemberNumericValue = require_getRangeMemberNumericValue();
		var abs = mathAliases.abs;
		defineOnPrototype(Range, { "span": function() {
			var n = getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start);
			return rangeIsValid(this) ? abs(n) + 1 : NaN;
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/toArray.js
	var require_toArray = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var rangeEvery = require_rangeEvery();
		require_defineOnPrototype()(Range, { "toArray": function() {
			return rangeEvery(this);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/toString.js
	var require_toString = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		var rangeIsValid = require_rangeIsValid();
		require_defineOnPrototype()(Range, { "toString": function() {
			return rangeIsValid(this) ? this.start + ".." + this.end : "Invalid Range";
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/union.js
	var require_union = /* @__PURE__ */ __commonJSMin((() => {
		var Range = require_Range();
		require_defineOnPrototype()(Range, { "union": function(range) {
			return new Range(this.start < range.start ? this.start : range.start, this.end > range.end ? this.end : range.end);
		} });
	}));
	//#endregion
	//#region node_modules/sugar-date/range/weeks.js
	var require_weeks = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/years.js
	var require_years = /* @__PURE__ */ __commonJSMin((() => {
		require_buildDateRangeUnitsCall();
	}));
	//#endregion
	//#region node_modules/sugar-date/range/index.js
	var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		require_range$1();
		require_clamp();
		require_clone();
		require_contains();
		require_days();
		require_every();
		require_hours();
		require_intersect();
		require_isValid();
		require_milliseconds();
		require_minutes();
		require_months();
		require_seconds();
		require_span();
		require_toArray();
		require_toString();
		require_union();
		require_weeks();
		require_years();
		module.exports = require_sugar_core();
	}));
	//#endregion
	//#region src/sort.js
	var import_sugar_date = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
		require_date();
		require_range();
		module.exports = require_sugar_core();
	})))();
	/** Sorting utilities */
	/**
	* Case insensitive compare function for passed strings
	* @param  {String} First string
	* @param  {String} Second string
	* @return {Number} -1 if first string lower than second one
	*                  0 if first string same order as second one
	*                  1 if first string greater than second one
	*/
	var ignoreCase = (a, b) => {
		let x = a.toLowerCase();
		let y = b.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
	};
	/**
	* Compare function for sorting passed numbers in ascending manner
	* @param {Number} First number
	* @param {Number} Second number
	* @return {Number} Negative, zero or positive number
	*/
	var numSortAsc = (a, b) => a - b;
	/**
	* Compare function for sorting passed numbers in descending manner
	* @param {Number} First number
	* @param {Number} Second number
	* @return {Number} Negative, zero or positive number
	*/
	var numSortDesc = (a, b) => b - a;
	/**
	* Compare function for sorting passed dates in ascending manner according to
	* the corresponding UTC numeric value (returned by getTime)
	* @param {Date} First date object
	* @param {Date} Second date object
	* @return {Number} Negative, zero or positive number
	*/
	var dateSortAsc = (date1, date2) => date1.getTime() - date2.getTime();
	/**
	* Compare function for sorting passed dates in descending manner according to
	* the corresponding UTC numeric value (returned by getTime)
	* @param {Date} First date object
	* @param {Date} Second date object
	* @return {Number} Negative, zero or positive number
	*/
	var dateSortDesc = (date1, date2) => date2.getTime() - date1.getTime();
	/**
	* Curried compare function for sorting passed formatted numbers in desired
	* fashion according to supplied compare function and decimal separator
	* @param {Function} Compare function
	* @param {String} [decimal=','] Decimal separator
	* @return {Function} Compare function receiving parsed numeric arguments
	*/
	var sortNumberStr = (compareFn, decimal = ",") => {
		return (numStr1, numStr2) => {
			return compareFn(parse(numStr1, decimal), parse(numStr2, decimal));
		};
	};
	/**
	* Curried compare function for sorting passed formatted dates in desired
	* fashion according to supplied compare function and locale
	* @param {Function} Compare function
	* @param {String} [locale='en-us'] Locale code
	* @return {Function} Compare function receiving parsed date arguments
	*/
	var sortDateStr = (compareFn, locale = "en-us") => {
		return (dateStr1, dateStr2) => {
			return compareFn(import_sugar_date.Date.create(dateStr1, locale), import_sugar_date.Date.create(dateStr2, locale));
		};
	};
	//#endregion
	//#region src/extensions/colOps/colOps.js
	var EVENTS$1 = [
		"after-filtering",
		"after-page-change",
		"after-page-length-change"
	];
	var SUM = "sum";
	var MEAN = "mean";
	var MIN = "min";
	var MAX = "max";
	var MEDIAN = "median";
	var Q1 = "q1";
	var Q3 = "q3";
	/**
	* Column calculations extension
	*/
	var ColOps = class ColOps extends Feature {
		/**
		* Creates an instance of ColOps
		*
		* @param {TableFilter} tf TableFilter instance
		* @param {Object} opts Configuration object
		*/
		constructor(tf, opts) {
			super(tf, ColOps);
			/**
			* Callback fired before columns operations start
			* @type {Function}
			*/
			this.onBeforeOperation = defaultsFn(opts.on_before_operation, EMPTY_FN);
			/**
			* Callback fired after columns operations are completed
			* @type {Function}
			*/
			this.onAfterOperation = defaultsFn(opts.on_after_operation, EMPTY_FN);
			/**
			* Configuration options
			* @type {Object}
			*/
			this.opts = opts;
			/**
			* List of DOM element IDs containing column's calculation result
			* @type {Array}
			*/
			this.labelIds = defaultsArr(opts.id, []);
			/**
			* List of columns' indexes for calculations
			* @type {Array}
			*/
			this.colIndexes = defaultsArr(opts.col, []);
			/**
			* List of operations - possible values: 'sum', 'mean', 'min', 'max',
			* 'median', 'q1', 'q3'
			* @type {Array}
			*/
			this.operations = defaultsArr(opts.operation, []);
			/**
			* List of write methods used to write the result - possible values:
			* 'innerHTML', 'setValue', 'createTextNode'
			* @type {Array}
			*/
			this.outputTypes = defaultsArr(opts.write_method, []);
			/**
			* List of format objects used for formatting the result - see
			* formatNumberValue in number.js for the supported options
			* @type {Array}
			*/
			this.formatResults = defaultsArr(opts.format_result, []);
			/**
			* List of row indexes displaying the results
			* @type {Array}
			*/
			this.totRowIndexes = defaultsArr(opts.tot_row_index, []);
			/**
			* List of row indexes excluded from calculations
			* @type {Array}
			*/
			this.excludeRows = defaultsArr(opts.exclude_row, []);
			/**
			* List of decimal precision for calculation results
			* @type {Array}
			*/
			this.decimalPrecisions = defaultsArr(opts.decimal_precision, 2);
			this.enable();
		}
		/**
		* Initializes ColOps instance
		*/
		init() {
			if (this.initialized) return;
			this.emitter.on(EVENTS$1, bound(this.calcAll, this));
			this.calcAll();
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Calculates columns' values
		* Configuration options are stored in 'opts' property
		* - 'id' contains ids of elements showing result (array)
		* - 'col' contains the columns' indexes (array)
		* - 'operation' contains operation type (array, values: 'sum', 'mean',
		*   'min', 'max', 'median', 'q1', 'q3')
		* - 'write_method' array defines which method to use for displaying the
		*    result (innerHTML, setValue, createTextNode) - default: 'innerHTML'
		* - 'tot_row_index' defines in which row results are displayed
		*   (integers array)
		*
		* - changes made by Nuovella:
		* (1) optimized the routine (now it will only process each column once),
		* (2) added calculations for the median, lower and upper quartile.
		*/
		calcAll() {
			let tf = this.tf;
			if (!tf.isInitialized()) return;
			this.onBeforeOperation(tf, this);
			this.emitter.emit("before-column-operation", tf, this);
			let { colIndexes, operations: colOperations, outputTypes, totRowIndexes, excludeRows, formatResults, decimalPrecisions } = this;
			let uIndexes = [];
			colIndexes.forEach((val) => {
				if (uIndexes.indexOf(val) === -1) uIndexes.push(val);
			});
			let nbCols = uIndexes.length, rows = tf.dom().rows, colValues = [];
			for (let u = 0; u < nbCols; u++) {
				colValues.push(tf.getVisibleColumnData(uIndexes[u], false, excludeRows));
				let curValues = colValues[u];
				let result = 0, operations = [], precisions = [], labels = [], writeType, formatResult = [], idx = 0;
				for (let k = 0; k < colIndexes.length; k++) {
					if (colIndexes[k] !== uIndexes[u]) continue;
					operations[idx] = (colOperations[k] || "sum").toLowerCase();
					precisions[idx] = decimalPrecisions[k];
					labels[idx] = this.labelIds[k];
					writeType = isArray(outputTypes) ? outputTypes[k] : null;
					formatResult[idx] = this.configureFormat(uIndexes[u], formatResults[k]);
					idx++;
				}
				for (let i = 0; i < idx; i++) {
					this.emitter.emit("before-column-calc", tf, this, uIndexes[u], curValues, operations[i], precisions[i]);
					result = Number(this.calc(curValues, operations[i], null));
					this.emitter.emit("column-calc", tf, this, uIndexes[u], result, operations[i], precisions[i]);
					this.writeResult(result, labels[i], writeType, precisions[i], formatResult[i]);
				}
				let totRow = totRowIndexes && totRowIndexes[u] ? rows[totRowIndexes[u]] : null;
				if (totRow) totRow.style.display = "";
			}
			this.onAfterOperation(tf, this);
			this.emitter.emit("after-column-operation", tf, this);
		}
		/**
		* Make desired calculation on specified column.
		* @param {Number} colIndex Column index
		* @param {String} [operation=SUM] Operation type
		* @param {Number} precision Decimal precision
		* @returns {Number}
		*/
		columnCalc(colIndex, operation = SUM, precision) {
			let excludeRows = this.excludeRows || [];
			let colValues = tf.getVisibleColumnData(colIndex, false, excludeRows);
			return Number(this.calc(colValues, operation, precision));
		}
		/**
		* Make calculation on passed values.
		* @param {Array} values List of values
		* @param {String} [operation=SUM] Optional operation type
		* @param {Number} precision Optional result precision
		* @returns {Number}
		* @private
		*/
		calc(colValues, operation = SUM, precision) {
			let result = 0;
			if (operation === Q1 || operation === Q3 || operation === MEDIAN) colValues = this.sortColumnValues(colValues, numSortAsc);
			switch (operation) {
				case MEAN:
					result = this.calcMean(colValues);
					break;
				case SUM:
					result = this.calcSum(colValues);
					break;
				case MIN:
					result = this.calcMin(colValues);
					break;
				case MAX:
					result = this.calcMax(colValues);
					break;
				case MEDIAN:
					result = this.calcMedian(colValues);
					break;
				case Q1:
					result = this.calcQ1(colValues);
					break;
				case Q3: result = this.calcQ3(colValues);
			}
			return isEmpty(precision) ? result : result.toFixed(precision);
		}
		/**
		* Calculate the sum of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcSum(values = []) {
			if (isEmpty(values)) return 0;
			return values.reduce((x, y) => Number(x) + Number(y));
		}
		/**
		* Calculate the mean of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcMean(values = []) {
			let result = this.calcSum(values) / values.length;
			return Number(result);
		}
		/**
		* Calculate the max value of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcMax(values = []) {
			return Math.max.apply(null, values);
		}
		/**
		* Calculate the min value of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcMin(values = []) {
			return Math.min.apply(null, values);
		}
		/**
		* Calculate the median of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcMedian(values = []) {
			let nbValues = values.length;
			let aux = 0;
			if (nbValues % 2 === 1) {
				aux = Math.floor(nbValues / 2);
				return Number(values[aux]);
			}
			return (Number(values[nbValues / 2]) + Number(values[nbValues / 2 - 1])) / 2;
		}
		/**
		* Calculate the lower quartile of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcQ1(values = []) {
			let nbValues = values.length;
			let posa = 0;
			posa = Math.floor(nbValues / 4);
			if (4 * posa === nbValues) return (Number(values[posa - 1]) + Number(values[posa])) / 2;
			return Number(values[posa]);
		}
		/**
		* Calculate the upper quartile of passed values.
		* @param {Array} [values=[]] List of values
		* @returns {Number}
		*/
		calcQ3(values = []) {
			let nbValues = values.length;
			let posa = 0;
			let posb = 0;
			posa = Math.floor(nbValues / 4);
			if (4 * posa === nbValues) {
				posb = 3 * posa;
				return (Number(values[posb]) + Number(values[posb - 1])) / 2;
			}
			return Number(values[nbValues - posa - 1]);
		}
		/**
		* Sort passed values with supplied sorter function.
		* @param {Array} [values=[]] List of values to be sorted
		* @param {Function} sorter Sorter function
		* @returns {Array}
		*/
		sortColumnValues(values = [], sorter) {
			return values.sort(sorter);
		}
		/**
		* Write calculation result in passed DOM element with supplied write method
		* and decimal precision.
		* @param {Number} [result=0] Calculation result
		* @param {DOMElement} label DOM element
		* @param {String} [writeType='innerhtml'] Write method
		* @param {Number} [precision=2] Applied decimal precision
		* @private
		*/
		writeResult(result = 0, label, writeType = "innerhtml", precision = 2, format = {}) {
			let labelElm = elm(label);
			if (!labelElm) return;
			result = formatNumberValue(result.toFixed(precision), format);
			switch (writeType.toLowerCase()) {
				case "innerhtml":
					labelElm.innerHTML = result;
					break;
				case "setvalue":
					labelElm.value = result;
					break;
				case "createtextnode":
					let oldNode = labelElm.firstChild;
					let txtNode = createText(result);
					labelElm.replaceChild(txtNode, oldNode);
			}
		}
		/**
		* Configure the format options used to format the operation result based
		* on column type.
		* @param {Number} colIndex Column index
		* @param {Object} [format={}] Format object
		* @returns {Object}
		* @private
		*/
		configureFormat(colIndex, format = {}) {
			let tf = this.tf;
			if (tf.hasType(colIndex, ["formatted-number"])) {
				let colType = tf.colTypes[colIndex];
				if (colType.decimal && !format.decimal) format.decimal = colType.decimal;
				if (colType.thousands && !format.integerSeparator) format.integerSeparator = colType.thousands;
			} else {
				format.decimal = format.decimal || "";
				format.integerSeparator = format.integerSeparator || "";
			}
			return format;
		}
		/** Remove extension */
		destroy() {
			if (!this.initialized) return;
			this.emitter.off(EVENTS$1, bound(this.calcAll, this));
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/extensions/advancedGrid/adapterEzEditTable.js
	var INSTANTIATION_ERROR = `Failed to instantiate EditTable object.
    \n"ezEditTable" dependency not found.`;
	/**
	* Adapter module for ezEditTable, an external library providing advanced
	* grid features (selection and edition):
	* http://codecanyon.net/item/ezedittable-enhance-html-tables/2425123?ref=koalyptus
	*/
	var AdapterEzEditTable = class AdapterEzEditTable extends Feature {
		/**
		* Creates an instance of AdapterEzEditTable
		*
		* @param {TableFilter} tf TableFilter instance
		* @param {Object} cfg Configuration options for ezEditTable library
		*/
		constructor(tf, cfg) {
			super(tf, AdapterEzEditTable);
			/**
			* Module description
			* @type {String}
			*/
			this.desc = defaultsStr(cfg.description, "ezEditTable adapter");
			/**
			* Filename of ezEditTable library
			* @type {String}
			*/
			this.filename = defaultsStr(cfg.filename, "ezEditTable.js");
			/**
			* Path to ezEditTable library
			* @type {String}
			*/
			this.vendorPath = cfg.vendor_path;
			/**
			* Load ezEditTable stylesheet
			* @type {Boolean}
			*/
			this.loadStylesheet = Boolean(cfg.load_stylesheet);
			/**
			* Path to ezEditTable stylesheet
			* @type {String}
			*/
			this.stylesheet = defaultsStr(cfg.stylesheet, this.vendorPath + "ezEditTable.css");
			/**
			* Name of ezEditTable stylesheet
			* @type {String}
			*/
			this.stylesheetName = defaultsStr(cfg.stylesheet_name, "ezEditTableCss");
			cfg.scroll_into_view = cfg.scroll_into_view === false ? false : tf.gridLayout;
			/**
			* ezEditTable instance
			* @type {EditTable}
			* @private
			*/
			this._ezEditTable = null;
			/**
			* ezEditTable configuration
			* @private
			*/
			this.cfg = cfg;
			this.enable();
		}
		/**
		* Conditionally load ezEditTable library and set advanced grid
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			if (root.EditTable) this._setAdvancedGrid();
			else {
				let path = this.vendorPath + this.filename;
				tf.import(this.filename, path, () => this._setAdvancedGrid());
			}
			if (this.loadStylesheet && !tf.isImported(this.stylesheet, "link")) tf.import(this.stylesheetName, this.stylesheet, null, "link");
			this.emitter.on(["filter-focus", "filter-blur"], () => this._toggleForInputFilter());
			/**
			* @inherited
			*/
			this.initialized = true;
		}
		/**
		* Instantiate ezEditTable component for advanced grid features
		* @private
		*/
		_setAdvancedGrid() {
			let tf = this.tf;
			let startRow, cfg = this.cfg;
			if (tag(tf.dom(), "thead").length > 0 && !cfg.startRow) startRow = void 0;
			else startRow = cfg.startRow || tf.refRow;
			cfg.base_path = cfg.base_path || tf.basePath + "ezEditTable/";
			let editable = cfg.editable;
			let selectable = cfg.selection;
			if (selectable) cfg.default_selection = cfg.default_selection || "row";
			cfg.active_cell_css = cfg.active_cell_css || "ezETSelectedCell";
			let _lastValidRowIndex = 0;
			let _lastRowIndex = 0;
			if (selectable) {
				let onAfterSelection = function(et, selectedElm, e) {
					let slc = et.Selection;
					let doSelect = function(nextRowIndex) {
						if (et.defaultSelection === "row") slc.SelectRowByIndex(nextRowIndex);
						else {
							et.ClearSelections();
							let cellIndex = selectedElm.cellIndex, row = tf.dom().rows[nextRowIndex];
							if (et.defaultSelection === "both") slc.SelectRowByIndex(nextRowIndex);
							if (row) slc.SelectCell(row.cells[cellIndex]);
						}
						if (tf.validRowsIndex.length !== tf.getRowsNb()) {
							let r = tf.dom().rows[nextRowIndex];
							if (r) r.scrollIntoView(false);
							if (cell) {
								if (cell.cellIndex === tf.getCellsNb() - 1 && tf.gridLayout) tf.tblCont.scrollLeft = 1e8;
								else if (cell.cellIndex === 0 && tf.gridLayout) tf.tblCont.scrollLeft = 0;
								else cell.scrollIntoView(false);
							}
						}
					};
					if (!tf.validRowsIndex) return;
					let validIndexes = tf.validRowsIndex, validIdxLen = validIndexes.length, row = et.defaultSelection !== "row" ? selectedElm.parentNode : selectedElm, cell = selectedElm.nodeName === "TD" ? selectedElm : null, keyCode = e !== void 0 ? et.Event.GetKey(e) : 0, isRowValid = validIndexes.indexOf(row.rowIndex) !== -1, nextRowIndex, paging = tf.feature("paging"), d = keyCode === 34 || keyCode === 33 ? paging && paging.pageLength || et.nbRowsPerPage : 1;
					if (!isRowValid) {
						if (row.rowIndex > _lastRowIndex) {
							if (row.rowIndex >= validIndexes[validIdxLen - 1]) nextRowIndex = validIndexes[validIdxLen - 1];
							else {
								let calcRowIndex = _lastValidRowIndex + d;
								if (calcRowIndex > validIdxLen - 1) nextRowIndex = validIndexes[validIdxLen - 1];
								else nextRowIndex = validIndexes[calcRowIndex];
							}
						} else if (row.rowIndex <= validIndexes[0]) nextRowIndex = validIndexes[0];
						else {
							let v = validIndexes[_lastValidRowIndex - d];
							nextRowIndex = v ? v : validIndexes[0];
						}
						_lastRowIndex = row.rowIndex;
						doSelect(nextRowIndex);
					} else if (keyCode !== 34 && keyCode !== 33) {
						_lastValidRowIndex = validIndexes.indexOf(row.rowIndex);
						_lastRowIndex = row.rowIndex;
					} else {
						if (keyCode === 34) {
							if (_lastValidRowIndex + d <= validIdxLen - 1) nextRowIndex = validIndexes[_lastValidRowIndex + d];
							else nextRowIndex = [validIdxLen - 1];
						} else if (_lastValidRowIndex - d <= validIndexes[0]) nextRowIndex = validIndexes[0];
						else nextRowIndex = validIndexes[_lastValidRowIndex - d];
						_lastRowIndex = nextRowIndex;
						_lastValidRowIndex = validIndexes.indexOf(nextRowIndex);
						doSelect(nextRowIndex);
					}
				};
				let onBeforeSelection = function(et, selectedElm) {
					let row = et.defaultSelection !== "row" ? selectedElm.parentNode : selectedElm;
					if (tf.paging) {
						if (tf.feature("paging").nbPages > 1) {
							let paging = tf.feature("paging");
							et.nbRowsPerPage = paging.pageLength;
							let validIndexes = tf.validRowsIndex, validIdxLen = validIndexes.length, pagingEndRow = parseInt(paging.startPagingRow, 10) + parseInt(paging.pageLength, 10);
							let rowIndex = row.rowIndex;
							if (rowIndex === validIndexes[validIdxLen - 1] && paging.currentPageNb !== paging.nbPages) paging.setPage("last");
							else if (rowIndex === validIndexes[0] && paging.currentPageNb !== 1) paging.setPage("first");
							else if (rowIndex > validIndexes[pagingEndRow - 1] && rowIndex < validIndexes[validIdxLen - 1]) paging.setPage("next");
							else if (rowIndex < validIndexes[paging.startPagingRow] && rowIndex > validIndexes[0]) paging.setPage("previous");
						}
					}
				};
				if (tf.paging) tf.feature("paging").onAfterChangePage = function(paging) {
					let slc = paging.tf.extension("advancedGrid")._ezEditTable.Selection;
					let row = slc.GetActiveRow();
					if (row) row.scrollIntoView(false);
					let cell = slc.GetActiveCell();
					if (cell) cell.scrollIntoView(false);
				};
				if (cfg.default_selection === "row") {
					let fnB = cfg.on_before_selected_row;
					cfg.on_before_selected_row = function() {
						var args = arguments;
						onBeforeSelection(args[0], args[1], args[2]);
						if (fnB) fnB.call(null, args[0], args[1], args[2]);
					};
					let fnA = cfg.on_after_selected_row;
					cfg.on_after_selected_row = function() {
						var args = arguments;
						onAfterSelection(args[0], args[1], args[2]);
						if (fnA) fnA.call(null, args[0], args[1], args[2]);
					};
				} else {
					let fnD = cfg.on_before_selected_cell;
					cfg.on_before_selected_cell = function() {
						var args = arguments;
						onBeforeSelection(args[0], args[1], args[2]);
						if (fnD) fnD.call(null, args[0], args[1], args[2]);
					};
					let fnC = cfg.on_after_selected_cell;
					cfg.on_after_selected_cell = function() {
						var args = arguments;
						onAfterSelection(args[0], args[1], args[2]);
						if (fnC) fnC.call(null, args[0], args[1], args[2]);
					};
				}
			}
			if (editable) {
				let fnE = cfg.on_added_dom_row;
				cfg.on_added_dom_row = function() {
					var args = arguments;
					tf.nbFilterableRows++;
					if (!tf.paging) tf.emitter.emit("rows-changed", tf, this);
					else {
						tf.nbFilterableRows++;
						tf.paging = false;
						tf.feature("paging").destroy();
						tf.feature("paging").reset();
					}
					if (tf.alternateRows) tf.feature("alternateRows").init();
					if (fnE) fnE.call(null, args[0], args[1], args[2]);
				};
				if (cfg.actions && cfg.actions["delete"]) {
					let fnF = cfg.actions["delete"].on_after_submit;
					cfg.actions["delete"].on_after_submit = function() {
						var args = arguments;
						tf.nbFilterableRows--;
						if (!tf.paging) tf.emitter.emit("rows-changed", tf, this);
						else {
							tf.nbFilterableRows--;
							tf.paging = false;
							tf.feature("paging").destroy();
							tf.feature("paging").reset(false);
						}
						if (tf.alternateRows) tf.feature("alternateRows").init();
						if (fnF) fnF.call(null, args[0], args[1]);
					};
				}
			}
			try {
				this._ezEditTable = new EditTable(tf.id, cfg, startRow);
				this._ezEditTable.Init();
			} catch (e) {
				throw new Error(INSTANTIATION_ERROR);
			}
			this.initialized = true;
		}
		/**
		* Reset advanced grid when previously removed
		*/
		reset() {
			let ezEditTable = this._ezEditTable;
			if (ezEditTable) {
				if (this.cfg.selection) ezEditTable.Selection.Set();
				if (this.cfg.editable) ezEditTable.Editable.Set();
			}
		}
		/**
		* Toggle behaviour
		*/
		toggle() {
			let ezEditTable = this._ezEditTable;
			if (ezEditTable.editable) ezEditTable.Editable.Remove();
			else ezEditTable.Editable.Set();
			if (ezEditTable.selection) ezEditTable.Selection.Remove();
			else ezEditTable.Selection.Set();
		}
		_toggleForInputFilter() {
			let tf = this.tf;
			if (!tf.getActiveFilterId()) return;
			let colIndex = tf.getColumnIndexFromFilterId(tf.getActiveFilterId());
			if (tf.getFilterType(colIndex) === "input") this.toggle();
		}
		/**
		* Remove advanced grid
		*/
		destroy() {
			if (!this.initialized) return;
			let ezEditTable = this._ezEditTable;
			if (ezEditTable) {
				if (this.cfg.selection) {
					ezEditTable.Selection.ClearSelections();
					ezEditTable.Selection.Remove();
				}
				if (this.cfg.editable) ezEditTable.Editable.Remove();
			}
			this.emitter.off(["filter-focus", "filter-blur"], () => this._toggleForInputFilter());
			this.initialized = false;
		}
	};
	AdapterEzEditTable.meta = { altName: "advancedGrid" };
	//#endregion
	//#region src/extensions/advancedGrid/advancedGrid.js
	var advancedGrid_default = AdapterEzEditTable;
	//#endregion
	//#region src/extensions/filtersVisibility/filtersVisibility.js
	/**
	* Filters Visibility extension
	*/
	var FiltersVisibility = class FiltersVisibility extends Feature {
		/**
		* Creates an instance of FiltersVisibility
		* @param {TableFilter} tf TableFilter instance
		* @param {Object} Configuration object
		*/
		constructor(tf, f) {
			super(tf, FiltersVisibility);
			/**
			* Module name
			* @type {String}
			*/
			this.name = f.name;
			/**
			* Module description
			* @type {String}
			*/
			this.desc = defaultsStr(f.description, "Filters row visibility manager");
			/**
			* Extension's stylesheet filename
			* @type {String}
			*/
			this.stylesheet = defaultsStr(f.stylesheet, "filtersVisibility.css");
			/**
			* Expand icon filename
			* @type {String}
			*/
			this.icnExpand = defaultsStr(f.expand_icon_name, "icn_exp.png");
			/**
			* Collapse icon filename
			* @type {String}
			*/
			this.icnCollapse = defaultsStr(f.collapse_icon_name, "icn_clp.png");
			/**
			* Main container element
			* @private
			*/
			this.contEl = null;
			/**
			* Button element
			* @private
			*/
			this.btnEl = null;
			/**
			* Expand icon HTML
			* @private
			*/
			this.icnExpandHtml = "<img src=\"" + tf.themesPath + this.icnExpand + "\" alt=\"Expand filters\" >";
			/**
			* Collapse icon HTML
			* @private
			*/
			this.icnCollapseHtml = "<img src=\"" + tf.themesPath + this.icnCollapse + "\" alt=\"Collapse filters\" >";
			/**
			* Default text
			* @private
			*/
			this.defaultText = "Toggle filters";
			/**
			* ID of main container element
			* @type {String}
			*/
			this.targetId = f.target_id || null;
			/**
			* Enable expand/collapse icon, defaults to true
			* @type {Boolean}
			*/
			this.enableIcon = defaultsBool(f.enable_icon, true);
			/**
			* Custom text for button
			* @type {String}
			*/
			this.btnText = defaultsStr(f.btn_text, "");
			/**
			* Collapse button HTML
			* @private
			*/
			this.collapseBtnHtml = this.enableIcon ? this.icnCollapseHtml + this.btnText : this.btnText || this.defaultText;
			/**
			* Expand button HTML
			* @private
			*/
			this.expandBtnHtml = this.enableIcon ? this.icnExpandHtml + this.btnText : this.btnText || this.defaultText;
			/**
			* Button's custom HTML
			* @type {String}
			*/
			this.btnHtml = defaultsStr(f.btn_html, null);
			/**
			* Css class for expand/collapse filters button
			* @type {String}
			*/
			this.btnCssClass = defaultsStr(f.btn_css_class, "btnExpClpFlt");
			/**
			* Css class for main container
			* @type {String}
			*/
			this.contCssClass = defaultsStr(f.cont_css_class, "expClpFlt");
			/**
			* Filters row index
			* @type {Number}
			*/
			this.filtersRowIndex = defaultsNb(f.filters_row_index, tf.getFiltersRowIndex());
			/**
			* Make filters visible at initialization, defaults to true
			* @type {Boolean}
			*/
			this.visibleAtStart = defaultsNb(f.visible_at_start, true);
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, RIGHT);
			/**
			* Callback fired before filters row is shown
			* @type {Function}
			*/
			this.onBeforeShow = defaultsFn(f.on_before_show, EMPTY_FN);
			/**
			* Callback fired after filters row is shown
			* @type {Function}
			*/
			this.onAfterShow = defaultsFn(f.on_after_show, EMPTY_FN);
			/**
			* Callback fired before filters row is hidden
			* @type {Function}
			*/
			this.onBeforeHide = defaultsFn(f.on_before_hide, EMPTY_FN);
			/**
			* Callback fired after filters row is hidden
			* @type {Function}
			*/
			this.onAfterHide = defaultsFn(f.on_after_hide, EMPTY_FN);
			tf.import(f.name + "Style", tf.getStylePath() + this.stylesheet, null, "link");
			this.enable();
		}
		/**
		* Initialise extension
		*/
		init() {
			if (this.initialized) return;
			this.emitter.emit("initializing-extension", this, !isNull(this.targetId));
			this.buildUI();
			/** @inherited */
			this.initialized = true;
			this.emitter.on(["show-filters"], (tf, visible) => this.show(visible));
			this.emitter.emit("filters-visibility-initialized", this.tf, this);
			this.emitter.emit("extension-initialized", this);
		}
		/**
		* Build UI elements
		*/
		buildUI() {
			let tf = this.tf;
			let span = createElm("span");
			span.className = this.contCssClass;
			let targetEl = !this.targetId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.targetId);
			if (!this.targetId) {
				let firstChild = targetEl.firstChild;
				firstChild.parentNode.insertBefore(span, firstChild);
			} else targetEl.appendChild(span);
			let btn;
			if (!this.btnHtml) {
				btn = createElm("a", ["href", "javascript:void(0);"]);
				btn.className = this.btnCssClass;
				btn.title = this.btnText || this.defaultText;
				btn.innerHTML = this.collapseBtnHtml;
				span.appendChild(btn);
			} else {
				span.innerHTML = this.btnHtml;
				btn = span.firstChild;
			}
			addEvt(btn, "click", () => this.toggle());
			this.contEl = span;
			this.btnEl = btn;
			if (!this.visibleAtStart) this.toggle();
		}
		/**
		* Toggle filters visibility
		*/
		toggle() {
			let tf = this.tf;
			let isDisplayed = (tf.gridLayout ? tf.feature("gridLayout").headTbl : tf.dom()).rows[this.filtersRowIndex].style.display === "";
			this.show(!isDisplayed);
		}
		/**
		* Show or hide filters
		*
		* @param {boolean} [visible=true] Visibility flag
		*/
		show(visible = true) {
			let tf = this.tf;
			let fltRow = (tf.gridLayout ? tf.feature("gridLayout").headTbl : tf.dom()).rows[this.filtersRowIndex];
			if (visible) this.onBeforeShow(this);
			if (!visible) this.onBeforeHide(this);
			fltRow.style.display = visible ? "" : "none";
			if (this.enableIcon && !this.btnHtml) this.btnEl.innerHTML = visible ? this.collapseBtnHtml : this.expandBtnHtml;
			if (visible) this.onAfterShow(this);
			if (!visible) this.onAfterHide(this);
			this.emitter.emit("filters-toggled", tf, this, visible);
		}
		/**
		* Destroy the UI
		*/
		destroy() {
			if (!this.initialized) return;
			this.emitter.off(["show-filters"], (tf, visible) => this.show(visible));
			this.btnEl.innerHTML = "";
			removeElm(this.btnEl);
			this.btnEl = null;
			this.contEl.innerHTML = "";
			removeElm(this.contEl);
			this.contEl = null;
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/emitter.js
	/**
	* Event emitter class
	*/
	var Emitter = class {
		/**
		* Creates an instance of Emitter.
		*/
		constructor() {
			/**
			* Events object
			* @type {Object}
			*/
			this.events = {};
		}
		/**
		* Subscribe to an event
		* @param  {Array}   evts Collection of event names
		* @param  {Function} fn  Function invoked when event is emitted
		*/
		on(evts, fn) {
			evts.forEach((evt) => {
				this.events[evt] = this.events[evt] || [];
				this.events[evt].push(fn);
			});
		}
		/**
		* Unsubscribe to an event
		* @param  {Array}   evts Collection of event names
		* @param  {Function} fn  Function invoked when event is emitted
		*/
		off(evts, fn) {
			evts.forEach((evt) => {
				if (evt in this.events) this.events[evt].splice(this.events[evt].indexOf(fn), 1);
			});
		}
		/**
		* Emit an event
		* @param  {String} evt Event name followed by any other argument passed to
		* the invoked function
		*/
		emit(evt) {
			if (evt in this.events) for (let i = 0; i < this.events[evt].length; i++) this.events[evt][i].apply(this, [].slice.call(arguments, 1));
		}
	};
	//#endregion
	//#region src/modules/baseDropdown.js
	/**
	* Base class for Dropdown and CheckList UI components
	* @export
	* @class BaseDropdown
	* @extends {Feature}
	*/
	var BaseDropdown = class extends Feature {
		/**
		* Creates an instance of BaseDropdown
		* @param {TableFilter} tf
		*/
		constructor(tf, cls) {
			super(tf, cls);
			let f = this.config;
			/**
			* Filter options custom sorter on a column basis
			* @type {Object}
			*/
			this.customSorter = isObj(f.filter_options_sorter) && isArray(f.filter_options_sorter.col) && isArray(f.filter_options_sorter.comparer) ? f.filter_options_sorter : null;
			/**
			* Has custom options
			* @type {Boolean}
			* @private
			*/
			this.isCustom = false;
			/**
			* List of options values
			* @type {Array}
			* @private
			*/
			this.opts = [];
			/**
			* List of options texts for custom values
			* @type {Array}
			* @private
			*/
			this.optsTxt = [];
			/**
			* List of options to be excluded from the checklist filter
			* @type {Array}
			* @private
			*/
			this.excludedOpts = [];
		}
		/**
		* Sort passed options based on the type of the specified column
		* @param {Number} colIndex Column index
		* @param {Array} [options=[]] Collection of values
		* @return {Array} Sorted values
		* @private
		*/
		sortOptions(colIndex, options = []) {
			let { tf } = this;
			if (tf.isCustomOptions(colIndex) || !tf.sortSlc || isArray(tf.sortSlc) && tf.sortSlc.indexOf(colIndex) === -1) return options;
			let { caseSensitive, sortFilterOptionsDesc } = tf;
			let isSortDesc = sortFilterOptionsDesc.indexOf(colIndex) !== -1;
			let compareFn;
			if (this.customSorter && this.customSorter.col.indexOf(colIndex) !== -1) {
				var idx = this.customSorter.col.indexOf(colIndex);
				compareFn = this.customSorter.comparer[idx];
			} else if (tf.hasType(colIndex, ["number", "formatted-number"])) {
				let decimal = tf.getDecimal(colIndex);
				compareFn = sortNumberStr(isSortDesc ? numSortDesc : numSortAsc, decimal);
			} else if (tf.hasType(colIndex, ["date"])) {
				let locale = tf.feature("dateType").getLocale(colIndex);
				compareFn = sortDateStr(isSortDesc ? dateSortDesc : dateSortAsc, locale);
			} else {
				compareFn = caseSensitive ? void 0 : ignoreCase;
				if (isSortDesc) return options.sort(compareFn).reverse();
			}
			return options.sort(compareFn);
		}
		/**
		* Regenerate filters of specified columns and maintain selection if any
		* @param {Array} colIndexes Collection of column indexes
		* @private
		*/
		refreshFilters(colIndexes) {
			colIndexes.forEach((colIdx) => {
				let values = this.getValues(colIdx);
				this.build(colIdx, this.tf.linkedFilters);
				this.selectOptions(colIdx, values);
			});
		}
		/**
		* Check passed row contains a valid linked value
		* @param {Number} rowIdx Row index
		* @param {Number} activeFilterIdx Current active filter index
		* @returns {Boolean}
		*/
		isValidLinkedValue(rowIdx, activeFilterIdx) {
			let tf = this.tf;
			if (tf.disableExcludedOptions) return true;
			if (tf.paging) {
				if (!isEmpty(activeFilterIdx) && tf.isRowValid(rowIdx)) return true;
			} else if (tf.isRowDisplayed(rowIdx)) return true;
			return false;
		}
		/**
		* Refresh linked filters to offer only selected options
		*/
		linkFilters() {
			let tf = this.tf;
			if (!tf.linkedFilters || !tf.activeFilterId) return;
			this.refreshAll();
		}
	};
	//#endregion
	//#region src/array.js
	/**
	* Array utilities
	*/
	/**
	* Checks if given item can be found in the passed collection
	* @param  {Array} arr  collection
	* @param  {Any} val  item to search
	* @param  {Boolean} caseSensitive respects case if true
	* @return {Boolean}
	*/
	var has = (arr, val, caseSensitive) => {
		let sCase = Boolean(caseSensitive);
		for (var i = 0, l = arr.length; i < l; i++) if (matchCase(arr[i].toString(), sCase) === val) return true;
		return false;
	};
	//#endregion
	//#region src/modules/dropdown.js
	/**
	* Dropdown filter UI component
	* @export
	* @class Dropdown
	* @extends {BaseDropdown}
	*/
	var Dropdown = class Dropdown extends BaseDropdown {
		/**
		* Creates an instance of Dropdown
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, Dropdown);
			let f = this.config;
			/**
			* Enable the reset filter option as first item
			* @type {Boolean}
			*/
			this.enableSlcResetFilter = defaultsBool(f.enable_slc_reset_filter, true);
			/**
			* Non empty option text
			* @type {String}
			*/
			this.nonEmptyText = defaultsStr(f.non_empty_text, "(Non empty)");
			/**
			* Tooltip text appearing on multiple select
			* @type {String}
			*/
			this.multipleSlcTooltip = defaultsStr(f.multiple_slc_tooltip, "Use Ctrl/Cmd key for multiple selections");
		}
		/**
		* Drop-down filter focus event handler
		* @param {Event} e DOM Event
		* @private
		*/
		onSlcFocus(e) {
			let elm = targetEvt(e);
			let tf = this.tf;
			if (tf.loadFltOnDemand && elm.getAttribute("filled") === "0") {
				let ct = elm.getAttribute("ct");
				this.build(ct);
			}
			this.emitter.emit("filter-focus", tf, elm);
		}
		/**
		* Drop-down filter change event handler
		* @private
		*/
		onSlcChange() {
			if (this.tf.onSlcChange) this.tf.filter();
		}
		/**
		* Refresh all drop-down filters
		*/
		refreshAll() {
			let selectFlts = this.tf.getFiltersByType(SELECT, true);
			let multipleFlts = this.tf.getFiltersByType(MULTIPLE, true);
			let colIdxs = selectFlts.concat(multipleFlts);
			this.refreshFilters(colIdxs);
		}
		/**
		* Initialize drop-down filter
		* @param  {Number}     colIndex   Column index
		* @param  {Boolean}    isExternal External filter flag
		* @param  {DOMElement} container  Dom element containing the filter
		*/
		init(colIndex, isExternal, container) {
			let tf = this.tf;
			let col = tf.getFilterType(colIndex);
			let externalFltTgtId = isExternal ? tf.externalFltIds[colIndex] : null;
			let slc = createElm(SELECT, ["id", tf.buildFilterId(colIndex)], ["ct", colIndex], ["filled", "0"]);
			if (col === "multiple") {
				slc.multiple = MULTIPLE;
				slc.title = this.multipleSlcTooltip;
			}
			slc.className = col.toLowerCase() === "select" ? tf.fltCssClass : tf.fltMultiCssClass;
			if (externalFltTgtId) elm(externalFltTgtId).appendChild(slc);
			else container.appendChild(slc);
			tf.fltIds.push(slc.id);
			if (!tf.loadFltOnDemand) this.build(colIndex);
			else {
				let opt0 = createOpt(tf.getClearFilterText(colIndex), "");
				slc.appendChild(opt0);
			}
			addEvt(slc, "change", () => this.onSlcChange());
			addEvt(slc, "focus", (e) => this.onSlcFocus(e));
			this.emitter.on(["build-select-filter"], (tf, colIndex, isLinked, isExternal) => this.build(colIndex, isLinked, isExternal));
			this.emitter.on(["select-options"], (tf, colIndex, values) => this.selectOptions(colIndex, values));
			this.emitter.on(["rows-changed"], () => this.refreshAll());
			this.emitter.on(["after-filtering"], () => this.linkFilters());
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Build drop-down filter UI
		* @param  {Number}  colIndex    Column index
		* @param  {Boolean} isLinked    Enable linked filters behaviour
		*/
		build(colIndex, isLinked = false) {
			let tf = this.tf;
			colIndex = Number(colIndex);
			this.emitter.emit("before-populating-filter", tf, colIndex);
			/** @inherited */
			this.opts = [];
			/** @inherited */
			this.optsTxt = [];
			let slc = tf.getFilterElement(colIndex);
			/** @inherited */
			this.isCustom = tf.isCustomOptions(colIndex);
			if (this.isCustom) {
				let customValues = tf.getCustomOptions(colIndex);
				this.opts = customValues[0];
				this.optsTxt = customValues[1];
			}
			let activeIdx;
			let activeFilterId = tf.getActiveFilterId();
			if (isLinked && activeFilterId) activeIdx = tf.getColumnIndexFromFilterId(activeFilterId);
			let excludedOpts = null, filteredDataCol = null;
			if (isLinked && tf.disableExcludedOptions) {
				excludedOpts = [];
				filteredDataCol = [];
			}
			tf.eachRow()((row) => {
				let cellValue = tf.getCellValue(row.cells[colIndex]);
				let cellString = matchCase(cellValue, tf.caseSensitive);
				if (!has(this.opts, cellString, tf.caseSensitive)) this.opts.push(cellValue);
				if (isLinked && tf.disableExcludedOptions) {
					let filteredCol = filteredDataCol[colIndex];
					if (!filteredCol) filteredCol = tf.getVisibleColumnValues(colIndex);
					if (!has(filteredCol, cellString, tf.caseSensitive) && !has(excludedOpts, cellString, tf.caseSensitive)) excludedOpts.push(cellValue);
				}
			}, (row, k) => {
				if (tf.excludeRows.indexOf(k) !== -1) return true;
				if (row.cells.length !== tf.nbCells || this.isCustom) return true;
				if (isLinked && !this.isValidLinkedValue(k, activeIdx)) return true;
			});
			this.opts = this.sortOptions(colIndex, this.opts);
			if (excludedOpts) excludedOpts = this.sortOptions(colIndex, excludedOpts);
			this.addOptions(colIndex, slc, isLinked, excludedOpts);
			this.emitter.emit("after-populating-filter", tf, colIndex, slc);
		}
		/**
		* Add drop-down options
		* @param {Number} colIndex     Column index
		* @param {Object} slc          Select Dom element
		* @param {Boolean} isLinked    Enable linked refresh behaviour
		* @param {Array} excludedOpts  Array of excluded options
		*/
		addOptions(colIndex, slc, isLinked, excludedOpts) {
			let tf = this.tf, slcValue = slc.value;
			slc.innerHTML = "";
			slc = this.addFirstOption(slc);
			for (let y = 0; y < this.opts.length; y++) {
				if (this.opts[y] === "") continue;
				let val = this.opts[y];
				let lbl = this.isCustom ? this.optsTxt[y] : val;
				let isDisabled = false;
				if (isLinked && tf.disableExcludedOptions && has(excludedOpts, matchCase(val, tf.caseSensitive), tf.caseSensitive)) isDisabled = true;
				let opt;
				if (tf.loadFltOnDemand && slcValue === this.opts[y] && tf.getFilterType(colIndex) === "select") opt = createOpt(lbl, val, true);
				else opt = createOpt(lbl, val, false);
				if (isDisabled) opt.disabled = true;
				slc.appendChild(opt);
			}
			slc.setAttribute("filled", "1");
		}
		/**
		* Add drop-down header option
		* @param {Object} slc Select DOM element
		*/
		addFirstOption(slc) {
			let tf = this.tf;
			let colIdx = tf.getColumnIndexFromFilterId(slc.id);
			let opt0 = createOpt(!this.enableSlcResetFilter ? "" : tf.getClearFilterText(colIdx), "");
			if (!this.enableSlcResetFilter) opt0.style.display = NONE;
			slc.appendChild(opt0);
			if (tf.enableEmptyOption) {
				let opt1 = createOpt(tf.emptyText, tf.emOperator);
				slc.appendChild(opt1);
			}
			if (tf.enableNonEmptyOption) {
				let opt2 = createOpt(tf.nonEmptyText, tf.nmOperator);
				slc.appendChild(opt2);
			}
			return slc;
		}
		/**
		* Select filter options programmatically
		* @param  {Number} colIndex Column index
		* @param  {Array}  values   Array of option values to select
		*/
		selectOptions(colIndex, values = []) {
			let tf = this.tf;
			if (values.length === 0) return;
			let slc = tf.getFilterElement(colIndex);
			[].forEach.call(slc.options, (option) => {
				if (values[0] === "" || option.value === "") option.selected = false;
				if (option.value !== "" && has(values, option.value, true)) option.selected = true;
			});
		}
		/**
		* Get filter values for a given column index
		* @param {Number} colIndex Column index
		* @returns {Array}  values  Array of selected values
		*/
		getValues(colIndex) {
			let slc = this.tf.getFilterElement(colIndex);
			let values = [];
			if (slc.selectedOptions) [].forEach.call(slc.selectedOptions, (option) => values.push(option.value));
			else [].forEach.call(slc.options, (option) => {
				if (option.selected) values.push(option.value);
			});
			return values;
		}
		/**
		* Destroy Dropdown instance
		*/
		destroy() {
			this.emitter.off(["build-select-filter"], (colIndex, isLinked, isExternal) => this.build(colIndex, isLinked, isExternal));
			this.emitter.off(["select-options"], (tf, colIndex, values) => this.selectOptions(colIndex, values));
			this.emitter.off(["rows-changed"], () => this.refreshAll());
			this.emitter.off(["after-filtering"], () => this.linkFilters());
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/checkList.js
	/**
	* Checklist filter UI component
	* @export
	* @class CheckList
	* @extends {BaseDropdown}
	*/
	var CheckList = class CheckList extends BaseDropdown {
		/**
		* Creates an instance of CheckList
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, CheckList);
			let f = this.config;
			/**
			* List of container DOM elements
			* @type {Array}
			*/
			this.containers = [];
			/**
			* `<tf-checklist>` hosts, when the bridge is active
			* @type {Array}
			* @private
			*/
			this.ceElms = [];
			/**
			* Handlers bound to each `<tf-checklist>` host
			* @type {Array}
			* @private
			*/
			this.ceEvt = [];
			/**
			* Selected values reported by each `<tf-checklist>` host
			* @type {Array}
			* @private
			*/
			this.ceValues = [];
			/**
			* Trigger names cached per column for `<tf-checklist>` hosts
			* @type {Array}
			* @private
			*/
			this.ceNames = [];
			/**
			* Css class for the container of the checklist filter (div)
			* @type {String}
			*/
			this.containerCssClass = defaultsStr(f.div_checklist_css_class, "div_checklist");
			/**
			* Css class for the checklist filter element (ul)
			* @type {String}
			*/
			this.filterCssClass = defaultsStr(f.checklist_css_class, "flt_checklist");
			/**
			* Css class for the item of a checklist (li)
			* @type {String}
			*/
			this.itemCssClass = defaultsStr(f.checklist_item_css_class, "flt_checklist_item");
			/**
			* Css class for a selected item of a checklist (li)
			* @type {String}
			*/
			this.selectedItemCssClass = defaultsStr(f.checklist_selected_item_css_class, "flt_checklist_slc_item");
			/**
			* Text placed in the filter's container when load filter on demand
			* feature is enabled
			* @type {String}
			*/
			this.activateText = defaultsStr(f.activate_checklist_text, "Click to load filter data");
			/**
			* Css class for a disabled item of a checklist (li)
			* @type {String}
			*/
			this.disabledItemCssClass = defaultsStr(f.checklist_item_disabled_css_class, "flt_checklist_item_disabled");
			/**
			* Enable the reset filter option as first item
			* @type {Boolean}
			*/
			this.enableResetOption = defaultsBool(f.enable_checklist_reset_filter, true);
			/**
			* Prefix for container element ID
			* @type {String}
			* @private
			*/
			this.prfx = "chkdiv_";
		}
		/**
		* Checklist option click event handler
		* @param {Event} evt
		* @private
		*/
		optionClick(evt) {
			let elm = targetEvt(evt);
			let tf = this.tf;
			this.emitter.emit("filter-focus", tf, elm);
			this.setItemOption(elm);
			tf.filter();
		}
		/**
		* Checklist container click event handler for load-on-demand feature
		* @param {Event} evt
		* @private
		*/
		onCheckListClick(evt) {
			let elm = targetEvt(evt);
			if (this.tf.loadFltOnDemand && elm.getAttribute("filled") === "0") {
				let ct = elm.getAttribute("ct");
				let div = this.containers[ct];
				this.build(ct);
				removeEvt(div, "click", (evt) => this.onCheckListClick(evt));
			}
		}
		/**
		* `<tf-checklist>` selection event handler
		* @param {Number} colIndex Column index
		* @param {Event} evt `selection-change` event
		* @private
		*/
		onCESelectionChange(colIndex, evt) {
			let tf = this.tf;
			let host = this.ceElms[colIndex];
			let values = evt.detail && isArray(evt.detail.values) ? evt.detail.values.slice() : [];
			values = this.normalizeCESelection(colIndex, values);
			this.ceValues[colIndex] = values;
			this.syncCEText(colIndex);
			this.emitter.emit("filter-focus", tf, host);
			tf.filter();
		}
		/**
		* `<tf-checklist>` open event handler used by the load-on-demand
		* feature: the options are rendered on the first expansion
		* @param {Number} colIndex Column index
		* @param {Event} evt `open-change` event
		* @private
		*/
		onCEOpenChange(colIndex, evt) {
			let host = this.ceElms[colIndex];
			if (!evt.detail || !evt.detail.open || !host) return;
			if (host.getAttribute("filled") !== "1") this.build(colIndex);
		}
		/**
		* Keep the reset option exclusive. The element toggles every option
		* independently, while the legacy checklist clears the other
		* selections when the reset item is picked and unchecks the reset
		* item when another option is picked (checkList.js:391-425).
		* @param {Number} colIndex Column index
		* @param {Array} values Selected values reported by the element
		* @returns {Array} Normalized selection
		* @private
		*/
		normalizeCESelection(colIndex, values) {
			let host = this.ceElms[colIndex];
			let previous = this.ceValues[colIndex] || [];
			let hasReset = values.indexOf("") !== -1;
			if (!host || !hasReset || values.length === 1) return values;
			let normalized = previous.indexOf("") === -1 ? [""] : values.filter((value) => value !== "");
			host.setSelectedValues(normalized);
			return normalized;
		}
		/**
		* Render the trigger text from the column name and the selection
		* count, and name the listbox from the same column name
		* (v1-webcomponents-investigation.md:247-289)
		* @param {Number} colIndex Column index
		* @private
		*/
		syncCEText(colIndex) {
			let host = this.ceElms[colIndex];
			if (!host) return;
			let name = this.getCEName(colIndex);
			let count = (this.ceValues[colIndex] || []).filter((value) => value !== "").length;
			host.setAttribute("trigger-text", count ? `${name} (${count})` : name);
			host.setAttribute("listbox-label", `${name} options`);
		}
		/**
		* Return the trigger name for a column: its header text, or a
		* position-based fallback when the header is empty
		* @param {Number} colIndex Column index
		* @returns {String} Column name
		* @private
		*/
		getCEName(colIndex) {
			let name = this.ceNames[colIndex];
			if (!name) {
				name = this.tf.getHeadersText()[colIndex] || `Column ${colIndex + 1}`;
				this.ceNames[colIndex] = name;
			}
			return name;
		}
		/**
		* Refresh all checklist filters
		*/
		refreshAll() {
			let colIdxs = this.tf.getFiltersByType(CHECKLIST, true);
			this.refreshFilters(colIdxs);
		}
		/**
		* Initialize checklist filter
		* @param  {Number}     colIndex   Column index
		* @param  {Boolean}    isExternal External filter flag
		* @param  {DOMElement} container  Dom element containing the filter
		*/
		init(colIndex, isExternal, container) {
			if (!this.initialized) {
				this.onBuildChecklistFilter = (tf, colIndex, isLinked) => this.build(colIndex, isLinked);
				this.onSelectChecklistOptions = (tf, colIndex, values) => this.selectOptions(colIndex, values);
				this.onRowsChanged = () => this.refreshAll();
				this.onAfterFiltering = () => this.linkFilters();
				this.emitter.on(["build-checklist-filter"], this.onBuildChecklistFilter);
				this.emitter.on(["select-checklist-options"], this.onSelectChecklistOptions);
				this.emitter.on(["rows-changed"], this.onRowsChanged);
				this.emitter.on(["after-filtering"], this.onAfterFiltering);
				/** @inherited */
				this.initialized = true;
			}
			if (typeof customElements !== "undefined" && customElements.get("tf-checklist")) this.initCE(colIndex, isExternal, container);
			else this.initLegacy(colIndex, isExternal, container);
		}
		/**
		* Initialize using the <tf-checklist> custom element
		* @param  {Number}     colIndex   Column index
		* @param  {Boolean}    isExternal External filter flag
		* @param  {DOMElement} container  Dom element containing the filter
		* @private
		*/
		initCE(colIndex, isExternal, container) {
			let tf = this.tf;
			let externalFltTgtId = isExternal ? tf.externalFltIds[colIndex] : null;
			let host = document.createElement("tf-checklist");
			host.id = tf.buildFilterId(colIndex);
			host.className = this.containerCssClass;
			host.setAttribute("col", String(colIndex));
			if (externalFltTgtId) elm(externalFltTgtId).appendChild(host);
			else container.appendChild(host);
			this.containers[colIndex] = host;
			this.ceElms[colIndex] = host;
			this.ceValues[colIndex] = [];
			tf.fltIds.push(host.id);
			let evt = this.ceEvt[colIndex] = {
				selectionChange: (e) => this.onCESelectionChange(colIndex, e),
				openChange: (e) => this.onCEOpenChange(colIndex, e)
			};
			addEvt(host, "selection-change", evt.selectionChange);
			addEvt(host, "open-change", evt.openChange);
			if (!tf.loadFltOnDemand) this.build(colIndex);
			else {
				host.setAttribute("trigger-text", this.activateText);
				host.setAttribute("listbox-label", `${this.activateText} options`);
			}
		}
		/**
		* Initialize using the legacy div/ul/li structure
		* @param  {Number}     colIndex   Column index
		* @param  {Boolean}    isExternal External filter flag
		* @param  {DOMElement} container  Dom element containing the filter
		* @private
		*/
		initLegacy(colIndex, isExternal, container) {
			let tf = this.tf;
			let externalFltTgtId = isExternal ? tf.externalFltIds[colIndex] : null;
			let divCont = createElm("div", ["id", `${this.prfx}${colIndex}_${tf.id}`], ["ct", colIndex], ["filled", "0"]);
			divCont.className = this.containerCssClass;
			if (externalFltTgtId) elm(externalFltTgtId).appendChild(divCont);
			else container.appendChild(divCont);
			this.containers[colIndex] = divCont;
			tf.fltIds.push(tf.buildFilterId(colIndex));
			if (!tf.loadFltOnDemand) this.build(colIndex);
			else {
				addEvt(divCont, "click", (evt) => this.onCheckListClick(evt));
				divCont.appendChild(createText(this.activateText));
			}
		}
		/**
		* Build checklist UI
		* @param  {Number}  colIndex   Column index
		* @param  {Boolean} isLinked    Enable linked filters behaviour
		*/
		build(colIndex, isLinked = false) {
			let tf = this.tf;
			colIndex = Number(colIndex);
			this.emitter.emit("before-populating-filter", tf, colIndex);
			/** @inherited */
			this.opts = [];
			/** @inherited */
			this.optsTxt = [];
			let caseSensitive = tf.caseSensitive;
			/** @inherited */
			this.isCustom = tf.isCustomOptions(colIndex);
			if (this.isCustom) {
				let customValues = tf.getCustomOptions(colIndex);
				this.opts = customValues[0];
				this.optsTxt = customValues[1];
			}
			let activeIdx;
			let activeFilterId = tf.getActiveFilterId();
			if (isLinked && activeFilterId) activeIdx = tf.getColumnIndexFromFilterId(activeFilterId);
			let filteredDataCol = [];
			if (isLinked && tf.disableExcludedOptions)
 /** @inherited */
			this.excludedOpts = [];
			tf.eachRow()((row) => {
				let cellValue = tf.getCellValue(row.cells[colIndex]);
				let cellString = matchCase(cellValue, caseSensitive);
				if (!has(this.opts, cellString, caseSensitive)) this.opts.push(cellValue);
				let filteredCol = filteredDataCol[colIndex];
				if (isLinked && tf.disableExcludedOptions) {
					if (!filteredCol) filteredCol = tf.getVisibleColumnValues(colIndex);
					if (!has(filteredCol, cellString, caseSensitive) && !has(this.excludedOpts, cellString, caseSensitive)) this.excludedOpts.push(cellValue);
				}
			}, (row, k) => {
				if (tf.excludeRows.indexOf(k) !== -1) return true;
				if (row.cells.length !== tf.nbCells || this.isCustom) return true;
				if (isLinked && !this.isValidLinkedValue(k, activeIdx)) return true;
			});
			this.opts = this.sortOptions(colIndex, this.opts);
			if (this.excludedOpts) this.excludedOpts = this.sortOptions(colIndex, this.excludedOpts);
			if (this.ceElms[colIndex]) this.buildCE(colIndex);
			else this.buildLegacy(colIndex);
		}
		/**
		* Render the options into a <tf-checklist> host
		* @param {Number} colIndex Column index
		* @private
		*/
		buildCE(colIndex) {
			let tf = this.tf;
			let host = this.ceElms[colIndex];
			host.setOptions(this.getOptionEntries(colIndex).filter((entry) => !entry.hidden).map((entry) => ({
				value: entry.value,
				text: entry.text,
				disabled: entry.disabled
			})));
			host.setAttribute("filled", "1");
			this.ceValues[colIndex] = [];
			this.syncCEText(colIndex);
			this.emitter.emit("after-populating-filter", tf, colIndex, host);
		}
		/**
		* Render the options into the legacy ul element
		* @param {Number} colIndex Column index
		* @private
		*/
		buildLegacy(colIndex) {
			let tf = this.tf;
			let flt = this.containers[colIndex];
			let ul = createElm("ul", ["id", tf.fltIds[colIndex]], ["colIndex", colIndex]);
			ul.className = this.filterCssClass;
			flt.innerHTML = "";
			this.addChecks(colIndex, ul);
			if (tf.loadFltOnDemand) flt.innerHTML = "";
			flt.appendChild(ul);
			flt.setAttribute("filled", "1");
			this.emitter.emit("after-populating-filter", tf, colIndex, flt);
		}
		/**
		* Return the checklist entries in render order: the reset option,
		* the optional empty and non-empty options, then the column values.
		* A `hidden` entry is rendered with `display: none` by the legacy
		* path and skipped by `<tf-checklist>`, which has no hidden option
		* state (checkList.js:321-324, :345-347).
		* @param {Number} colIndex Column index
		* @returns {Array} Option entries
		* @private
		*/
		getOptionEntries(colIndex) {
			let tf = this.tf;
			let entries = [{
				value: "",
				text: tf.getClearFilterText(colIndex),
				hidden: !this.enableResetOption
			}];
			if (tf.enableEmptyOption) entries.push({
				value: tf.emOperator,
				text: tf.emptyText
			});
			if (tf.enableNonEmptyOption) entries.push({
				value: tf.nmOperator,
				text: tf.nonEmptyText
			});
			this.opts.forEach((val, y) => {
				entries.push({
					value: val,
					text: this.isCustom ? this.optsTxt[y] : val,
					disabled: tf.linkedFilters && tf.disableExcludedOptions && has(this.excludedOpts, matchCase(val, tf.caseSensitive), tf.caseSensitive),
					hidden: val === ""
				});
			});
			return entries;
		}
		/**
		* Add checklist options
		* @param {Number} colIndex  Column index
		* @param {Object} ul        Ul element
		* @private
		*/
		addChecks(colIndex, ul) {
			let fltId = this.tf.fltIds[colIndex];
			this.getOptionEntries(colIndex).forEach((entry, idx) => {
				let li = createCheckItem(`${fltId}_${idx}`, entry.value, entry.text, ["data-idx", idx]);
				li.className = this.itemCssClass;
				if (entry.disabled) {
					addClass(li, this.disabledItemCssClass);
					li.check.disabled = true;
					li.disabled = true;
				} else addEvt(li.check, "click", (evt) => this.optionClick(evt));
				ul.appendChild(li);
				if (entry.hidden) li.style.display = NONE;
			});
		}
		/**
		* Set/unset value of passed item option in filter's DOM element attribute
		* @param {Object} o checklist option DOM element
		* @private
		*/
		setItemOption(o) {
			if (!o) return;
			let tf = this.tf;
			let chkValue = o.value;
			let chkIndex = o.dataset.idx;
			let colIdx = tf.getColumnIndexFromFilterId(o.id);
			let n = tf.getFilterElement(parseInt(colIdx, 10));
			let items = n.childNodes;
			let li = items[chkIndex];
			let slcValues = n.getAttribute("value") || "";
			let slcIndexes = n.getAttribute("indexes") || "";
			if (o.checked) {
				if (chkValue === "") {
					slcIndexes.split(tf.separator).forEach((idx) => {
						idx = Number(idx);
						let li = items[idx];
						let chx = tag(li, "input")[0];
						if (chx && idx > 0) {
							chx.checked = false;
							removeClass(li, this.selectedItemCssClass);
						}
					});
					n.setAttribute("value", "");
					n.setAttribute("indexes", "");
				} else {
					let indexes = slcIndexes + chkIndex + tf.separator;
					let values = trim(slcValues + " " + chkValue + " " + tf.orOperator);
					n.setAttribute("value", values);
					n.setAttribute("indexes", indexes);
					let chx0 = tag(items[0], "input")[0];
					if (chx0) chx0.checked = false;
				}
				removeClass(items[0], this.selectedItemCssClass);
				addClass(li, this.selectedItemCssClass);
			} else {
				let replaceValue = new RegExp(rgxEsc(chkValue + " " + tf.orOperator));
				let values = slcValues.replace(replaceValue, "");
				let replaceIndex = new RegExp(rgxEsc(chkIndex + tf.separator));
				let indexes = slcIndexes.replace(replaceIndex, "");
				n.setAttribute("value", trim(values));
				n.setAttribute("indexes", indexes);
				removeClass(li, this.selectedItemCssClass);
			}
		}
		/**
		* Select filter options programmatically
		* @param  {Number} colIndex Column index
		* @param  {Array}  values   Array of option values to select
		*/
		selectOptions(colIndex, values = []) {
			if (this.ceElms[colIndex]) {
				this.selectOptionsCE(colIndex, values);
				return;
			}
			let tf = this.tf;
			let flt = tf.getFilterElement(colIndex);
			if (!flt || values.length === 0) return;
			let lis = tag(flt, "li");
			flt.setAttribute("value", "");
			flt.setAttribute("indexes", "");
			[].forEach.call(lis, (li) => {
				let chk = tag(li, "input")[0];
				let chkVal = matchCase(chk.value, tf.caseSensitive);
				if (chkVal !== "" && has(values, chkVal, tf.caseSensitive)) chk.checked = true;
				else if (values.indexOf(tf.nmOperator) !== -1 && chkVal === matchCase(tf.nonEmptyText, tf.caseSensitive)) chk.checked = true;
				else if (values.indexOf(tf.emOperator) !== -1 && chkVal === matchCase(tf.emptyText, tf.caseSensitive)) chk.checked = true;
				else chk.checked = false;
				this.setItemOption(chk);
			});
		}
		/**
		* Select options on a <tf-checklist> host. Values are matched against
		* the rendered entries the way the legacy `selectOptions()` matches
		* the checkbox values, and the reset value (`''`) clears the
		* selection instead of being selected (checkList.js:457-477).
		* @param  {Number} colIndex Column index
		* @param  {Array}  values   Array of option values to select
		* @private
		*/
		selectOptionsCE(colIndex, values) {
			let tf = this.tf;
			let host = this.ceElms[colIndex];
			if (!host) return;
			if (isArray(values) && values.length === 0) return;
			let requested = (isArray(values) ? values : []).filter((value) => String(value) !== "");
			let selected = [];
			this.getOptionEntries(colIndex).filter((entry) => !entry.hidden).forEach((entry) => {
				let value = matchCase(String(entry.value), tf.caseSensitive);
				if (has(requested, value, tf.caseSensitive)) selected.push(entry.value);
			});
			host.setSelectedValues(selected);
			this.ceValues[colIndex] = selected;
			this.syncCEText(colIndex);
		}
		/**
		* Get filter values for a given column index
		* @param {Number} colIndex Column index
		* @returns {Array} values Collection of selected values
		*/
		getValues(colIndex) {
			let host = this.ceElms[colIndex];
			if (host) {
				let values = host.getSelectedValues();
				return values.length === 0 ? [""] : values;
			}
			let tf = this.tf;
			let flt = tf.getFilterElement(colIndex);
			if (!flt) return [];
			let fltAttr = flt.getAttribute("value");
			let values = isEmpty(fltAttr) ? "" : fltAttr;
			values = values.substr(0, values.length - 3);
			values = values.split(" " + tf.orOperator + " ");
			return values;
		}
		/**
		* Remove the <tf-checklist> hosts and the handlers bound to them
		* @private
		*/
		destroyCE() {
			this.ceElms.forEach((host, colIndex) => {
				if (!host) return;
				let evt = this.ceEvt[colIndex];
				if (evt) {
					removeEvt(host, "selection-change", evt.selectionChange);
					removeEvt(host, "open-change", evt.openChange);
				}
				if (host.parentNode) removeElm(host);
			});
			this.ceElms = [];
			this.ceEvt = [];
			this.ceValues = [];
		}
		/**
		* Destroy CheckList instance
		*/
		destroy() {
			if (!this.initialized) return;
			this.emitter.off(["build-checklist-filter"], this.onBuildChecklistFilter);
			this.emitter.off(["select-checklist-options"], this.onSelectChecklistOptions);
			this.emitter.off(["rows-changed"], this.onRowsChanged);
			this.emitter.off(["after-filtering"], this.onAfterFiltering);
			this.destroyCE();
			this.initialized = false;
		}
	};
	//#endregion
	//#region node_modules/sugar-date/locales/ca.js
	var require_ca = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("ca", {
			"plural": true,
			"units": "milisegon:|s,segon:|s,minut:|s,hor:a|es,di:a|es,setman:a|es,mes:|os,any:|s",
			"months": "gen:er|,febr:er|,mar:ç|,abr:il|,mai:g|,jun:y|,jul:iol|,ag:ost|,set:embre|,oct:ubre|,nov:embre|,des:embre|",
			"weekdays": "diumenge|dg,dilluns|dl,dimarts|dt,dimecres|dc,dijous|dj,divendres|dv,dissabte|ds",
			"numerals": "zero,un,dos,tres,quatre,cinc,sis,set,vuit,nou,deu",
			"tokens": "el,la,de",
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {month} {yyyy} {time}",
			"full": "{weekday} {d} {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{sign} {num} {unit}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"timeMarkers": "a las",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "abans d'ahir",
					"value": -2
				},
				{
					"name": "day",
					"src": "ahir",
					"value": -1
				},
				{
					"name": "day",
					"src": "avui",
					"value": 0
				},
				{
					"name": "day",
					"src": "demà|dema",
					"value": 1
				},
				{
					"name": "sign",
					"src": "fa",
					"value": -1
				},
				{
					"name": "sign",
					"src": "en",
					"value": 1
				},
				{
					"name": "shift",
					"src": "passat",
					"value": -1
				},
				{
					"name": "shift",
					"src": "el proper|la propera",
					"value": 1
				}
			],
			"parse": [
				"{sign} {num} {unit}",
				"{num} {unit} {sign}",
				"{0?}{1?} {unit:5-7} {shift}",
				"{0?}{1?} {shift} {unit:5-7}"
			],
			"timeParse": [
				"{shift} {weekday}",
				"{weekday} {shift}",
				"{date?} {2?} {months}\\.? {2?} {year?}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/da.js
	var require_da = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("da", {
			"plural": true,
			"units": "millisekund:|er,sekund:|er,minut:|ter,tim:e|er,dag:|e,ug:e|er|en,måned:|er|en+maaned:|er|en,år:||et+aar:||et",
			"months": "jan:uar|,feb:ruar|,mar:ts|,apr:il|,maj,jun:i|,jul:i|,aug:ust|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",
			"weekdays": "søn:dag|+son:dag|,man:dag|,tir:sdag|,ons:dag|,tor:sdag|,fre:dag|,lør:dag|+lor:dag|",
			"numerals": "nul,en|et,to,tre,fire,fem,seks,syv,otte,ni,ti",
			"tokens": "den,for",
			"articles": "den",
			"short": "{dd}-{MM}-{yyyy}",
			"medium": "{d}. {month} {yyyy}",
			"long": "{d}. {month} {yyyy} {time}",
			"full": "{weekday} d. {d}. {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "forgårs|i forgårs|forgaars|i forgaars",
					"value": -2
				},
				{
					"name": "day",
					"src": "i går|igår|i gaar|igaar",
					"value": -1
				},
				{
					"name": "day",
					"src": "i dag|idag",
					"value": 0
				},
				{
					"name": "day",
					"src": "i morgen|imorgen",
					"value": 1
				},
				{
					"name": "day",
					"src": "over morgon|overmorgen|i over morgen|i overmorgen|iovermorgen",
					"value": 2
				},
				{
					"name": "sign",
					"src": "siden",
					"value": -1
				},
				{
					"name": "sign",
					"src": "om",
					"value": 1
				},
				{
					"name": "shift",
					"src": "i sidste|sidste",
					"value": -1
				},
				{
					"name": "shift",
					"src": "denne",
					"value": 0
				},
				{
					"name": "shift",
					"src": "næste|naeste",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{1?} {num} {unit} {sign}",
				"{shift} {unit:5-7}"
			],
			"timeParse": ["{day|weekday}", "{date} {months?}\\.? {year?}"],
			"timeFrontParse": ["{shift} {weekday}", "{0?} {weekday?},? {date}\\.? {months?}\\.? {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/de.js
	var require_de = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("de", {
			"plural": true,
			"units": "Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en|e",
			"months": "Jan:uar|,Feb:ruar|,M:är|ärz|ar|arz,Apr:il|,Mai,Juni,Juli,Aug:ust|,Sept:ember|,Okt:ober|,Nov:ember|,Dez:ember|",
			"weekdays": "So:nntag|,Mo:ntag|,Di:enstag|,Mi:ttwoch|,Do:nnerstag|,Fr:eitag|,Sa:mstag|",
			"numerals": "null,ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn",
			"tokens": "der",
			"short": "{dd}.{MM}.{yyyy}",
			"medium": "{d}. {Month} {yyyy}",
			"long": "{d}. {Month} {yyyy} {time}",
			"full": "{Weekday}, {d}. {Month} {yyyy} {time}",
			"stamp": "{Dow} {d} {Mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{sign} {num} {unit}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"timeMarkers": "um",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "vorgestern",
					"value": -2
				},
				{
					"name": "day",
					"src": "gestern",
					"value": -1
				},
				{
					"name": "day",
					"src": "heute",
					"value": 0
				},
				{
					"name": "day",
					"src": "morgen",
					"value": 1
				},
				{
					"name": "day",
					"src": "übermorgen|ubermorgen|uebermorgen",
					"value": 2
				},
				{
					"name": "sign",
					"src": "vor:|her",
					"value": -1
				},
				{
					"name": "sign",
					"src": "in",
					"value": 1
				},
				{
					"name": "shift",
					"src": "letzte:|r|n|s",
					"value": -1
				},
				{
					"name": "shift",
					"src": "nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s+kommende:n|r",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{sign} {num} {unit}",
				"{num} {unit} {sign}",
				"{shift} {unit:5-7}"
			],
			"timeParse": ["{shift?} {day|weekday}", "{weekday?},? {date}\\.? {months?}\\.? {year?}"],
			"timeFrontParse": ["{shift} {weekday}", "{weekday?},? {date}\\.? {months?}\\.? {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/es.js
	var require_es = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("es", {
			"plural": true,
			"units": "milisegundo:|s,segundo:|s,minuto:|s,hora:|s,día|días|dia|dias,semana:|s,mes:|es,año|años|ano|anos",
			"months": "ene:ro|,feb:rero|,mar:zo|,abr:il|,may:o|,jun:io|,jul:io|,ago:sto|,sep:tiembre|,oct:ubre|,nov:iembre|,dic:iembre|",
			"weekdays": "dom:ingo|,lun:es|,mar:tes|,mié:rcoles|+mie:rcoles|,jue:ves|,vie:rnes|,sáb:ado|+sab:ado|",
			"numerals": "cero,uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez",
			"tokens": "el,la,de",
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} de {Month} de {yyyy}",
			"long": "{d} de {Month} de {yyyy} {time}",
			"full": "{weekday}, {d} de {month} de {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{sign} {num} {unit}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"timeMarkers": "a las",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "anteayer",
					"value": -2
				},
				{
					"name": "day",
					"src": "ayer",
					"value": -1
				},
				{
					"name": "day",
					"src": "hoy",
					"value": 0
				},
				{
					"name": "day",
					"src": "mañana|manana",
					"value": 1
				},
				{
					"name": "sign",
					"src": "hace",
					"value": -1
				},
				{
					"name": "sign",
					"src": "dentro de",
					"value": 1
				},
				{
					"name": "shift",
					"src": "pasad:o|a",
					"value": -1
				},
				{
					"name": "shift",
					"src": "próximo|próxima|proximo|proxima",
					"value": 1
				}
			],
			"parse": [
				"{months} {2?} {year?}",
				"{sign} {num} {unit}",
				"{num} {unit} {sign}",
				"{0?}{1?} {unit:5-7} {shift}",
				"{0?}{1?} {shift} {unit:5-7}"
			],
			"timeParse": ["{shift?} {day|weekday} {shift?}", "{date} {2?} {months?}\\.? {2?} {year?}"],
			"timeFrontParse": ["{shift?} {weekday} {shift?}", "{date} {2?} {months?}\\.? {2?} {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/fi.js
	var require_fi = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("fi", {
			"plural": true,
			"units": "millisekun:ti|tia|nin|teja|tina,sekun:ti|tia|nin|teja|tina,minuut:ti|tia|in|teja|tina,tun:ti|tia|nin|teja|tina,päiv:ä|ää|än|iä|änä,viik:ko|koa|on|olla|koja|kona,kuukau:si|tta|den+kuussa,vuo:si|tta|den|sia|tena|nna",
			"months": "tammi:kuuta||kuu,helmi:kuuta||kuu,maalis:kuuta||kuu,huhti:kuuta||kuu,touko:kuuta||kuu,kesä:kuuta||kuu,heinä:kuuta||kuu,elo:kuuta||kuu,syys:kuuta||kuu,loka:kuuta||kuu,marras:kuuta||kuu,joulu:kuuta||kuu",
			"weekdays": "su:nnuntai||nnuntaina,ma:anantai||anantaina,ti:istai||istaina,ke:skiviikko||skiviikkona,to:rstai||rstaina,pe:rjantai||rjantaina,la:uantai||uantaina",
			"numerals": "nolla,yksi|ensimmäinen,kaksi|toinen,kolm:e|as,neljä:|s,vii:si|des,kuu:si|des,seitsemä:n|s,kahdeksa:n|s,yhdeksä:n|s,kymmene:n|s",
			"short": "{d}.{M}.{yyyy}",
			"medium": "{d}. {month} {yyyy}",
			"long": "{d}. {month} {yyyy} klo {time}",
			"full": "{weekday} {d}. {month} {yyyy} klo {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}.{mm}",
			"timeMarkers": "klo,kello",
			"timeSeparator": ".",
			"ordinalSuffix": ".",
			"relative": function(num, unit, ms, format) {
				var units = this["units"];
				function numberWithUnit(mult) {
					return num + " " + units[8 * mult + unit];
				}
				function baseUnit() {
					return numberWithUnit(num === 1 ? 0 : 1);
				}
				switch (format) {
					case "duration": return baseUnit();
					case "past": return baseUnit() + " sitten";
					case "future": return numberWithUnit(2) + " kuluttua";
				}
			},
			"modifiers": [
				{
					"name": "day",
					"src": "toissa päivänä",
					"value": -2
				},
				{
					"name": "day",
					"src": "eilen|eilistä",
					"value": -1
				},
				{
					"name": "day",
					"src": "tänään",
					"value": 0
				},
				{
					"name": "day",
					"src": "huomenna|huomista",
					"value": 1
				},
				{
					"name": "day",
					"src": "ylihuomenna|ylihuomista",
					"value": 2
				},
				{
					"name": "sign",
					"src": "sitten|aiemmin",
					"value": -1
				},
				{
					"name": "sign",
					"src": "päästä|kuluttua|myöhemmin",
					"value": 1
				},
				{
					"name": "edge",
					"src": "lopussa",
					"value": 2
				},
				{
					"name": "edge",
					"src": "ensimmäinen|ensimmäisenä",
					"value": -2
				},
				{
					"name": "shift",
					"src": "edel:linen|lisenä",
					"value": -1
				},
				{
					"name": "shift",
					"src": "viime",
					"value": -1
				},
				{
					"name": "shift",
					"src": "tä:llä|ssä|nä|mä",
					"value": 0
				},
				{
					"name": "shift",
					"src": "seuraava|seuraavana|tuleva|tulevana|ensi",
					"value": 1
				}
			],
			"parse": ["{months} {year?}", "{shift} {unit:5-7}"],
			"timeParse": ["{shift?} {day|weekday}", "{weekday?},? {date}\\.? {months?}\\.? {year?}"],
			"timeFrontParse": [
				"{shift?} {day|weekday}",
				"{num?} {unit} {sign}",
				"{weekday?},? {date}\\.? {months?}\\.? {year?}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/fr.js
	var require_fr = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("fr", {
			"plural": true,
			"units": "milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee",
			"months": "janv:ier|,févr:ier|+fevr:ier|,mars,avr:il|,mai,juin,juil:let|,août,sept:embre|,oct:obre|,nov:embre|,déc:embre|+dec:embre|",
			"weekdays": "dim:anche|,lun:di|,mar:di|,mer:credi|,jeu:di|,ven:dredi|,sam:edi|",
			"numerals": "zéro,un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix",
			"tokens": "l'|la|le,er",
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {month} {yyyy} {time}",
			"full": "{weekday} {d} {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{sign} {num} {unit}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"timeMarkers": "à",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "hier",
					"value": -1
				},
				{
					"name": "day",
					"src": "aujourd'hui",
					"value": 0
				},
				{
					"name": "day",
					"src": "demain",
					"value": 1
				},
				{
					"name": "sign",
					"src": "il y a",
					"value": -1
				},
				{
					"name": "sign",
					"src": "dans|d'ici",
					"value": 1
				},
				{
					"name": "shift",
					"src": "derni:èr|er|ère|ere",
					"value": -1
				},
				{
					"name": "shift",
					"src": "prochain:|e",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{sign} {num} {unit}",
				"{0?} {unit:5-7} {shift}"
			],
			"timeParse": ["{day|weekday} {shift?}", "{weekday?},? {0?} {date}{1?} {months}\\.? {year?}"],
			"timeFrontParse": ["{0?} {weekday} {shift}", "{weekday?},? {0?} {date}{1?} {months}\\.? {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/it.js
	var require_it = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("it", {
			"plural": true,
			"units": "millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i",
			"months": "gen:naio|,feb:braio|,mar:zo|,apr:ile|,mag:gio|,giu:gno|,lug:lio|,ago:sto|,set:tembre|,ott:obre|,nov:embre|,dic:embre|",
			"weekdays": "dom:enica|,lun:edì||edi,mar:tedì||tedi,mer:coledì||coledi,gio:vedì||vedi,ven:erdì||erdi,sab:ato|",
			"numerals": "zero,un:|a|o|',due,tre,quattro,cinque,sei,sette,otto,nove,dieci",
			"tokens": "l'|la|il",
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {month} {yyyy} {time}",
			"full": "{weekday}, {d} {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{num} {unit} {sign}",
			"duration": "{num} {unit}",
			"timeMarkers": "alle",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "ieri",
					"value": -1
				},
				{
					"name": "day",
					"src": "oggi",
					"value": 0
				},
				{
					"name": "day",
					"src": "domani",
					"value": 1
				},
				{
					"name": "day",
					"src": "dopodomani",
					"value": 2
				},
				{
					"name": "sign",
					"src": "fa",
					"value": -1
				},
				{
					"name": "sign",
					"src": "da adesso",
					"value": 1
				},
				{
					"name": "shift",
					"src": "scors:o|a",
					"value": -1
				},
				{
					"name": "shift",
					"src": "prossim:o|a",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{num} {unit} {sign}",
				"{0?} {unit:5-7} {shift}",
				"{0?} {shift} {unit:5-7}"
			],
			"timeParse": ["{day|weekday} {shift?}", "{weekday?},? {date} {months?}\\.? {year?}"],
			"timeFrontParse": ["{day|weekday} {shift?}", "{weekday?},? {date} {months?}\\.? {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/ja.js
	var require_ja = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("ja", {
			"ampmFront": true,
			"numeralUnits": true,
			"allowsFullWidth": true,
			"timeMarkerOptional": true,
			"firstDayOfWeek": 0,
			"firstDayOfWeekYear": 1,
			"units": "ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年|年度",
			"weekdays": "日:曜日||曜,月:曜日||曜,火:曜日||曜,水:曜日||曜,木:曜日||曜,金:曜日||曜,土:曜日||曜",
			"numerals": "〇,一,二,三,四,五,六,七,八,九",
			"placeholders": "十,百,千,万",
			"timeSuffixes": ",秒,分,時,日,,月,年度?",
			"short": "{yyyy}/{MM}/{dd}",
			"medium": "{yyyy}年{M}月{d}日",
			"long": "{yyyy}年{M}月{d}日{time}",
			"full": "{yyyy}年{M}月{d}日{time} {weekday}",
			"stamp": "{yyyy}年{M}月{d}日 {H}:{mm} {dow}",
			"time": "{tt}{h}時{mm}分",
			"past": "{num}{unit}{sign}",
			"future": "{num}{unit}{sign}",
			"duration": "{num}{unit}",
			"ampm": "午前,午後",
			"modifiers": [
				{
					"name": "day",
					"src": "一昨々日|前々々日",
					"value": -3
				},
				{
					"name": "day",
					"src": "一昨日|おととい|前々日",
					"value": -2
				},
				{
					"name": "day",
					"src": "昨日|前日",
					"value": -1
				},
				{
					"name": "day",
					"src": "今日|当日|本日",
					"value": 0
				},
				{
					"name": "day",
					"src": "明日|翌日|次日",
					"value": 1
				},
				{
					"name": "day",
					"src": "明後日|翌々日",
					"value": 2
				},
				{
					"name": "day",
					"src": "明々後日|翌々々日",
					"value": 3
				},
				{
					"name": "sign",
					"src": "前",
					"value": -1
				},
				{
					"name": "sign",
					"src": "後",
					"value": 1
				},
				{
					"name": "edge",
					"src": "始|初日|頭",
					"value": -2
				},
				{
					"name": "edge",
					"src": "末|尻",
					"value": 2
				},
				{
					"name": "edge",
					"src": "末日",
					"value": 1
				},
				{
					"name": "shift",
					"src": "一昨々|前々々",
					"value": -3
				},
				{
					"name": "shift",
					"src": "一昨|前々|先々",
					"value": -2
				},
				{
					"name": "shift",
					"src": "先|昨|去|前",
					"value": -1
				},
				{
					"name": "shift",
					"src": "今|本|当",
					"value": 0
				},
				{
					"name": "shift",
					"src": "来|明|翌|次",
					"value": 1
				},
				{
					"name": "shift",
					"src": "明後|翌々|次々|再来|さ来",
					"value": 2
				},
				{
					"name": "shift",
					"src": "明々後|翌々々",
					"value": 3
				}
			],
			"parse": [
				"{month}{edge}",
				"{num}{unit}{sign}",
				"{year?}{month}",
				"{year}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift}{unit:5}{weekday?}",
				"{shift}{unit:7}{month}{edge}",
				"{shift}{unit:7}{month?}{date?}",
				"{shift}{unit:6}{edge?}{date?}",
				"{year?}{month?}{date}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/ko.js
	var require_ko = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("ko", {
			"ampmFront": true,
			"numeralUnits": true,
			"units": "밀리초,초,분,시간,일,주,개월|달,년|해",
			"weekdays": "일:요일|,월:요일|,화:요일|,수:요일|,목:요일|,금:요일|,토:요일|",
			"numerals": "영|제로,일|한,이,삼,사,오,육,칠,팔,구,십",
			"short": "{yyyy}.{MM}.{dd}",
			"medium": "{yyyy}년 {M}월 {d}일",
			"long": "{yyyy}년 {M}월 {d}일 {time}",
			"full": "{yyyy}년 {M}월 {d}일 {weekday} {time}",
			"stamp": "{yyyy}년 {M}월 {d}일 {H}:{mm} {dow}",
			"time": "{tt} {h}시 {mm}분",
			"past": "{num}{unit} {sign}",
			"future": "{num}{unit} {sign}",
			"duration": "{num}{unit}",
			"timeSuffixes": ",초,분,시,일,,월,년",
			"ampm": "오전,오후",
			"modifiers": [
				{
					"name": "day",
					"src": "그저께",
					"value": -2
				},
				{
					"name": "day",
					"src": "어제",
					"value": -1
				},
				{
					"name": "day",
					"src": "오늘",
					"value": 0
				},
				{
					"name": "day",
					"src": "내일",
					"value": 1
				},
				{
					"name": "day",
					"src": "모레",
					"value": 2
				},
				{
					"name": "sign",
					"src": "전",
					"value": -1
				},
				{
					"name": "sign",
					"src": "후",
					"value": 1
				},
				{
					"name": "shift",
					"src": "지난|작",
					"value": -1
				},
				{
					"name": "shift",
					"src": "이번|올",
					"value": 0
				},
				{
					"name": "shift",
					"src": "다음|내",
					"value": 1
				}
			],
			"parse": [
				"{num}{unit} {sign}",
				"{shift?} {unit:5-7}",
				"{year?} {month}",
				"{year}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift} {unit:5?} {weekday}",
				"{year?} {month?} {date} {weekday?}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/nl.js
	var require_nl = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("nl", {
			"plural": true,
			"units": "milliseconde:|n,seconde:|n,minu:ut|ten,uur,dag:|en,we:ek|ken,maand:|en,jaar",
			"months": "jan:uari|,feb:ruari|,maart|mrt,apr:il|,mei,jun:i|,jul:i|,aug:ustus|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",
			"weekdays": "zondag|zo,maandag|ma,dinsdag|di,woensdag|wo|woe,donderdag|do,vrijdag|vr|vrij,zaterdag|za",
			"numerals": "nul,een,twee,drie,vier,vijf,zes,zeven,acht,negen,tien",
			"short": "{dd}-{MM}-{yyyy}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {Month} {yyyy} {time}",
			"full": "{weekday} {d} {Month} {yyyy} {time}",
			"stamp": "{dow} {d} {Mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{num} {unit} {sign}",
			"duration": "{num} {unit}",
			"timeMarkers": "'s,om",
			"modifiers": [
				{
					"name": "day",
					"src": "gisteren",
					"value": -1
				},
				{
					"name": "day",
					"src": "vandaag",
					"value": 0
				},
				{
					"name": "day",
					"src": "morgen",
					"value": 1
				},
				{
					"name": "day",
					"src": "overmorgen",
					"value": 2
				},
				{
					"name": "sign",
					"src": "geleden",
					"value": -1
				},
				{
					"name": "sign",
					"src": "vanaf nu",
					"value": 1
				},
				{
					"name": "shift",
					"src": "laatste|vorige|afgelopen",
					"value": -1
				},
				{
					"name": "shift",
					"src": "volgend:|e",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{num} {unit} {sign}",
				"{0?} {unit:5-7} {shift}",
				"{0?} {shift} {unit:5-7}"
			],
			"timeParse": ["{shift?} {day|weekday}", "{weekday?},? {date} {months?}\\.? {year?}"],
			"timeFrontParse": ["{shift?} {day|weekday}", "{weekday?},? {date} {months?}\\.? {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/no.js
	var require_no = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("no", {
			"plural": true,
			"units": "millisekund:|er,sekund:|er,minutt:|er,tim:e|er,dag:|er,uk:e|er|en,måned:|er|en+maaned:|er|en,år:||et+aar:||et",
			"months": "januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember",
			"weekdays": "søndag|sondag,mandag,tirsdag,onsdag,torsdag,fredag,lørdag|lordag",
			"numerals": "en|et,to,tre,fire,fem,seks,sju|syv,åtte,ni,ti",
			"tokens": "den,for",
			"articles": "den",
			"short": "d. {d}. {month} {yyyy}",
			"long": "den {d}. {month} {yyyy} {H}:{mm}",
			"full": "{Weekday} den {d}. {month} {yyyy} {H}:{mm}:{ss}",
			"past": "{num} {unit} {sign}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "forgårs|i forgårs|forgaars|i forgaars",
					"value": -2
				},
				{
					"name": "day",
					"src": "i går|igår|i gaar|igaar",
					"value": -1
				},
				{
					"name": "day",
					"src": "i dag|idag",
					"value": 0
				},
				{
					"name": "day",
					"src": "i morgen|imorgen",
					"value": 1
				},
				{
					"name": "day",
					"src": "overimorgen|overmorgen|over i morgen",
					"value": 2
				},
				{
					"name": "sign",
					"src": "siden",
					"value": -1
				},
				{
					"name": "sign",
					"src": "om",
					"value": 1
				},
				{
					"name": "shift",
					"src": "i siste|siste",
					"value": -1
				},
				{
					"name": "shift",
					"src": "denne",
					"value": 0
				},
				{
					"name": "shift",
					"src": "neste",
					"value": 1
				}
			],
			"parse": [
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{1?} {num} {unit} {sign}",
				"{shift} {unit:5-7}"
			],
			"timeParse": [
				"{date} {month}",
				"{shift} {weekday}",
				"{0?} {weekday?},? {date?} {month}\\.? {year}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/pl.js
	var require_pl = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("pl", {
			"plural": true,
			"units": "milisekund:a|y|,sekund:a|y|,minut:a|y|,godzin:a|y|,dzień|dni|dni,tydzień|tygodnie|tygodni,miesiąc|miesiące|miesięcy,rok|lata|lat",
			"months": "sty:cznia||czeń,lut:ego||y,mar:ca||zec,kwi:etnia||ecień,maj:a|,cze:rwca||rwiec,lip:ca||iec,sie:rpnia||rpień,wrz:eśnia||esień,paź:dziernika||dziernik,lis:topada||topad,gru:dnia||dzień",
			"weekdays": "nie:dziela||dzielę,pon:iedziałek|,wt:orek|,śr:oda||odę,czw:artek|,piątek|pt,sobota|sb|sobotę",
			"numerals": "zero,jeden|jedną,dwa|dwie,trzy,cztery,pięć,sześć,siedem,osiem,dziewięć,dziesięć",
			"tokens": "w|we,roku",
			"short": "{dd}.{MM}.{yyyy}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {month} {yyyy} {time}",
			"full": "{weekday}, {d} {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"timeMarkers": "o",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "przedwczoraj",
					"value": -2
				},
				{
					"name": "day",
					"src": "wczoraj",
					"value": -1
				},
				{
					"name": "day",
					"src": "dzisiaj|dziś",
					"value": 0
				},
				{
					"name": "day",
					"src": "jutro",
					"value": 1
				},
				{
					"name": "day",
					"src": "pojutrze",
					"value": 2
				},
				{
					"name": "sign",
					"src": "temu|przed",
					"value": -1
				},
				{
					"name": "sign",
					"src": "za",
					"value": 1
				},
				{
					"name": "shift",
					"src": "zeszły|zeszła|ostatni|ostatnia",
					"value": -1
				},
				{
					"name": "shift",
					"src": "następny|następna|następnego|przyszły|przyszła|przyszłego",
					"value": 1
				}
			],
			"relative": function(num, unit, ms, format) {
				if (unit === 4) {
					if (num === 1 && format === "past") return "wczoraj";
					if (num === 1 && format === "future") return "jutro";
					if (num === 2 && format === "past") return "przedwczoraj";
					if (num === 2 && format === "future") return "pojutrze";
				}
				var mult;
				var last = +num.toFixed(0).slice(-1);
				var last2 = +num.toFixed(0).slice(-2);
				switch (true) {
					case num === 1:
						mult = 0;
						break;
					case last2 >= 12 && last2 <= 14:
						mult = 2;
						break;
					case last >= 2 && last <= 4:
						mult = 1;
						break;
					default: mult = 2;
				}
				var text = this["units"][mult * 8 + unit];
				var prefix = num + " ";
				if ((format === "past" || format === "future") && num === 1) text = text.replace(/a$/, "ę");
				text = prefix + text;
				switch (format) {
					case "duration": return text;
					case "past": return text + " temu";
					case "future": return "za " + text;
				}
			},
			"parse": [
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{months} {year?}",
				"{shift} {unit:5-7}",
				"{0} {shift?} {weekday}"
			],
			"timeFrontParse": [
				"{day|weekday}",
				"{date} {months} {year?} {1?}",
				"{0?} {shift?} {weekday}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/pt.js
	var require_pt = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("pt", {
			"plural": true,
			"units": "milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,mês|mêses|mes|meses,ano:|s",
			"months": "jan:eiro|,fev:ereiro|,mar:ço|,abr:il|,mai:o|,jun:ho|,jul:ho|,ago:sto|,set:embro|,out:ubro|,nov:embro|,dez:embro|",
			"weekdays": "dom:ingo|,seg:unda-feira|,ter:ça-feira|,qua:rta-feira|,qui:nta-feira|,sex:ta-feira|,sáb:ado||ado",
			"numerals": "zero,um:|a,dois|duas,três|tres,quatro,cinco,seis,sete,oito,nove,dez",
			"tokens": "a,de",
			"short": "{dd}/{MM}/{yyyy}",
			"medium": "{d} de {Month} de {yyyy}",
			"long": "{d} de {Month} de {yyyy} {time}",
			"full": "{Weekday}, {d} de {Month} de {yyyy} {time}",
			"stamp": "{Dow} {d} {Mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"timeMarkers": "às",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "anteontem",
					"value": -2
				},
				{
					"name": "day",
					"src": "ontem",
					"value": -1
				},
				{
					"name": "day",
					"src": "hoje",
					"value": 0
				},
				{
					"name": "day",
					"src": "amanh:ã|a",
					"value": 1
				},
				{
					"name": "sign",
					"src": "atrás|atras|há|ha",
					"value": -1
				},
				{
					"name": "sign",
					"src": "daqui a",
					"value": 1
				},
				{
					"name": "shift",
					"src": "passad:o|a",
					"value": -1
				},
				{
					"name": "shift",
					"src": "próximo|próxima|proximo|proxima",
					"value": 1
				}
			],
			"parse": [
				"{months} {1?} {year?}",
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{0?} {unit:5-7} {shift}",
				"{0?} {shift} {unit:5-7}"
			],
			"timeParse": [
				"{shift?} {day|weekday}",
				"{0?} {shift} {weekday}",
				"{date} {1?} {months?} {1?} {year?}"
			],
			"timeFrontParse": ["{shift?} {day|weekday}", "{date} {1?} {months?} {1?} {year?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/ru.js
	var require_ru = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("ru", {
			"firstDayOfWeekYear": 1,
			"units": "миллисекунд:а|у|ы|,секунд:а|у|ы|,минут:а|у|ы|,час:||а|ов,день|день|дня|дней,недел:я|ю|и|ь|е,месяц:||а|ев|е,год|год|года|лет|году",
			"months": "янв:аря||.|арь,фев:раля||р.|раль,мар:та||т,апр:еля||.|ель,мая|май,июн:я||ь,июл:я||ь,авг:уста||.|уст,сен:тября||т.|тябрь,окт:ября||.|ябрь,ноя:бря||брь,дек:абря||.|абрь",
			"weekdays": "воскресенье|вс,понедельник|пн,вторник|вт,среда|ср,четверг|чт,пятница|пт,суббота|сб",
			"numerals": "ноль,од:ин|ну,дв:а|е,три,четыре,пять,шесть,семь,восемь,девять,десять",
			"tokens": "в|на,г\\.?(?:ода)?",
			"short": "{dd}.{MM}.{yyyy}",
			"medium": "{d} {month} {yyyy} г.",
			"long": "{d} {month} {yyyy} г., {time}",
			"full": "{weekday}, {d} {month} {yyyy} г., {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"timeMarkers": "в",
			"ampm": " утра, вечера",
			"modifiers": [
				{
					"name": "day",
					"src": "позавчера",
					"value": -2
				},
				{
					"name": "day",
					"src": "вчера",
					"value": -1
				},
				{
					"name": "day",
					"src": "сегодня",
					"value": 0
				},
				{
					"name": "day",
					"src": "завтра",
					"value": 1
				},
				{
					"name": "day",
					"src": "послезавтра",
					"value": 2
				},
				{
					"name": "sign",
					"src": "назад",
					"value": -1
				},
				{
					"name": "sign",
					"src": "через",
					"value": 1
				},
				{
					"name": "shift",
					"src": "прошл:ый|ой|ом",
					"value": -1
				},
				{
					"name": "shift",
					"src": "следующ:ий|ей|ем",
					"value": 1
				}
			],
			"relative": function(num, unit, ms, format) {
				var numberWithUnit, last = num.toString().slice(-1), mult;
				switch (true) {
					case num >= 11 && num <= 15:
						mult = 3;
						break;
					case last == 1:
						mult = 1;
						break;
					case last >= 2 && last <= 4:
						mult = 2;
						break;
					default: mult = 3;
				}
				numberWithUnit = num + " " + this["units"][mult * 8 + unit];
				switch (format) {
					case "duration": return numberWithUnit;
					case "past": return numberWithUnit + " назад";
					case "future": return "через " + numberWithUnit;
				}
			},
			"parse": [
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{months} {year?}",
				"{0?} {shift} {unit:5-7}"
			],
			"timeParse": [
				"{day|weekday}",
				"{0?} {shift} {weekday}",
				"{date} {months?} {year?} {1?}"
			],
			"timeFrontParse": ["{0?} {shift} {weekday}", "{date} {months?} {year?} {1?}"]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/sv.js
	var require_sv = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("sv", {
			"plural": true,
			"units": "millisekund:|er,sekund:|er,minut:|er,timm:e|ar,dag:|ar,veck:a|or|an,månad:|er|en+manad:|er|en,år:||et+ar:||et",
			"months": "jan:uari|,feb:ruari|,mar:s|,apr:il|,maj,jun:i|,jul:i|,aug:usti|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",
			"weekdays": "sön:dag|+son:dag|,mån:dag||dagen+man:dag||dagen,tis:dag|,ons:dag|,tor:sdag|,fre:dag|,lör:dag||dag",
			"numerals": "noll,en|ett,två|tva,tre,fyra,fem,sex,sju,åtta|atta,nio,tio",
			"tokens": "den,för|for",
			"articles": "den",
			"short": "{yyyy}-{MM}-{dd}",
			"medium": "{d} {month} {yyyy}",
			"long": "{d} {month} {yyyy} {time}",
			"full": "{weekday} {d} {month} {yyyy} {time}",
			"stamp": "{dow} {d} {mon} {yyyy} {time}",
			"time": "{H}:{mm}",
			"past": "{num} {unit} {sign}",
			"future": "{sign} {num} {unit}",
			"duration": "{num} {unit}",
			"ampm": "am,pm",
			"modifiers": [
				{
					"name": "day",
					"src": "förrgår|i förrgår|iförrgår|forrgar|i forrgar|iforrgar",
					"value": -2
				},
				{
					"name": "day",
					"src": "går|i går|igår|gar|i gar|igar",
					"value": -1
				},
				{
					"name": "day",
					"src": "dag|i dag|idag",
					"value": 0
				},
				{
					"name": "day",
					"src": "morgon|i morgon|imorgon",
					"value": 1
				},
				{
					"name": "day",
					"src": "över morgon|övermorgon|i över morgon|i övermorgon|iövermorgon|over morgon|overmorgon|i over morgon|i overmorgon|iovermorgon",
					"value": 2
				},
				{
					"name": "sign",
					"src": "sedan|sen",
					"value": -1
				},
				{
					"name": "sign",
					"src": "om",
					"value": 1
				},
				{
					"name": "shift",
					"src": "i förra|förra|i forra|forra",
					"value": -1
				},
				{
					"name": "shift",
					"src": "denna",
					"value": 0
				},
				{
					"name": "shift",
					"src": "nästa|nasta",
					"value": 1
				}
			],
			"parse": [
				"{months} {year?}",
				"{num} {unit} {sign}",
				"{sign} {num} {unit}",
				"{1?} {num} {unit} {sign}",
				"{shift} {unit:5-7}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift} {weekday}",
				"{0?} {weekday?},? {date} {months?}\\.? {year?}"
			],
			"timeFrontParse": [
				"{day|weekday}",
				"{shift} {weekday}",
				"{0?} {weekday?},? {date} {months?}\\.? {year?}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/zh-CN.js
	var require_zh_CN = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("zh-CN", {
			"ampmFront": true,
			"numeralUnits": true,
			"allowsFullWidth": true,
			"timeMarkerOptional": true,
			"units": "毫秒,秒钟,分钟,小时,天,个星期|周,个月,年",
			"weekdays": "星期日|日|周日|星期天,星期一|一|周一,星期二|二|周二,星期三|三|周三,星期四|四|周四,星期五|五|周五,星期六|六|周六",
			"numerals": "〇,一,二,三,四,五,六,七,八,九",
			"placeholders": "十,百,千,万",
			"short": "{yyyy}-{MM}-{dd}",
			"medium": "{yyyy}年{M}月{d}日",
			"long": "{yyyy}年{M}月{d}日{time}",
			"full": "{yyyy}年{M}月{d}日{weekday}{time}",
			"stamp": "{yyyy}年{M}月{d}日{H}:{mm}{dow}",
			"time": "{tt}{h}点{mm}分",
			"past": "{num}{unit}{sign}",
			"future": "{num}{unit}{sign}",
			"duration": "{num}{unit}",
			"timeSuffixes": ",秒,分钟?,点|时,日|号,,月,年",
			"ampm": "上午,下午",
			"modifiers": [
				{
					"name": "day",
					"src": "大前天",
					"value": -3
				},
				{
					"name": "day",
					"src": "前天",
					"value": -2
				},
				{
					"name": "day",
					"src": "昨天",
					"value": -1
				},
				{
					"name": "day",
					"src": "今天",
					"value": 0
				},
				{
					"name": "day",
					"src": "明天",
					"value": 1
				},
				{
					"name": "day",
					"src": "后天",
					"value": 2
				},
				{
					"name": "day",
					"src": "大后天",
					"value": 3
				},
				{
					"name": "sign",
					"src": "前",
					"value": -1
				},
				{
					"name": "sign",
					"src": "后",
					"value": 1
				},
				{
					"name": "shift",
					"src": "上|去",
					"value": -1
				},
				{
					"name": "shift",
					"src": "这",
					"value": 0
				},
				{
					"name": "shift",
					"src": "下|明",
					"value": 1
				}
			],
			"parse": [
				"{num}{unit}{sign}",
				"{shift}{unit:5-7}",
				"{year?}{month}",
				"{year}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift}{weekday}",
				"{year?}{month?}{date}"
			]
		});
	}));
	//#endregion
	//#region node_modules/sugar-date/locales/zh-TW.js
	var require_zh_TW = /* @__PURE__ */ __commonJSMin((() => {
		require_addLocale()("zh-TW", {
			"ampmFront": true,
			"numeralUnits": true,
			"allowsFullWidth": true,
			"timeMarkerOptional": true,
			"units": "毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年",
			"weekdays": "星期日|日|週日|星期天,星期一|一|週一,星期二|二|週二,星期三|三|週三,星期四|四|週四,星期五|五|週五,星期六|六|週六",
			"numerals": "〇,一,二,三,四,五,六,七,八,九",
			"placeholders": "十,百,千,万",
			"short": "{yyyy}/{MM}/{dd}",
			"medium": "{yyyy}年{M}月{d}日",
			"long": "{yyyy}年{M}月{d}日{time}",
			"full": "{yyyy}年{M}月{d}日{weekday}{time}",
			"stamp": "{yyyy}年{M}月{d}日{H}:{mm}{dow}",
			"time": "{tt}{h}點{mm}分",
			"past": "{num}{unit}{sign}",
			"future": "{num}{unit}{sign}",
			"duration": "{num}{unit}",
			"timeSuffixes": ",秒,分鐘?,點|時,日|號,,月,年",
			"ampm": "上午,下午",
			"modifiers": [
				{
					"name": "day",
					"src": "大前天",
					"value": -3
				},
				{
					"name": "day",
					"src": "前天",
					"value": -2
				},
				{
					"name": "day",
					"src": "昨天",
					"value": -1
				},
				{
					"name": "day",
					"src": "今天",
					"value": 0
				},
				{
					"name": "day",
					"src": "明天",
					"value": 1
				},
				{
					"name": "day",
					"src": "後天",
					"value": 2
				},
				{
					"name": "day",
					"src": "大後天",
					"value": 3
				},
				{
					"name": "sign",
					"src": "前",
					"value": -1
				},
				{
					"name": "sign",
					"src": "後",
					"value": 1
				},
				{
					"name": "shift",
					"src": "上|去",
					"value": -1
				},
				{
					"name": "shift",
					"src": "這",
					"value": 0
				},
				{
					"name": "shift",
					"src": "下|明",
					"value": 1
				}
			],
			"parse": [
				"{num}{unit}{sign}",
				"{shift}{unit:5-7}",
				"{year?}{month}",
				"{year}"
			],
			"timeParse": [
				"{day|weekday}",
				"{shift}{weekday}",
				"{year?}{month?}{date}"
			]
		});
	}));
	(/* @__PURE__ */ __commonJSMin(((exports, module) => {
		require_ca();
		require_da();
		require_de();
		require_es();
		require_fi();
		require_fr();
		require_it();
		require_ja();
		require_ko();
		require_nl();
		require_no();
		require_pl();
		require_pt();
		require_ru();
		require_sv();
		require_zh_CN();
		require_zh_TW();
		module.exports = require_sugar_core();
	})))();
	/**
	* Wrapper for Sugar Date module providing datetime helpers and locales
	* @export
	* @class DateType
	*/
	var DateType = class DateType extends Feature {
		/**
		* Creates an instance of DateType
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, DateType);
			/**
			* Global locale
			* @type {String}
			*/
			this.locale = tf.locale;
			/**
			* Sugar Date instance
			* @type {Object}
			*/
			this.datetime = import_sugar_date.Date;
			this.enable();
		}
		/**
		* Initialize DateType instance
		*/
		init() {
			if (this.initialized) return;
			this.datetime.setLocale(this.locale);
			this.addConfigFormats(this.tf.colTypes);
			this.emitter.on(["add-date-type-formats"], (tf, types) => this.addConfigFormats(types));
			this.emitter.emit("date-type-initialized", this.tf, this);
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Parse a string representation of a date for a specified locale and return
		* a date object
		* @param {String} dateStr String representation of a date
		* @param {String} localeCode Locale code (ie 'en-us')
		* @returns {Date}
		*/
		parse(dateStr, localeCode) {
			return this.datetime.create(dateStr, localeCode);
		}
		/**
		* Check string representation of a date for a specified locale is valid
		* @param {any} dateStr String representation of a date
		* @param {any} localeCode Locale code (ie 'en-us')
		* @returns {Boolean}
		*/
		isValid(dateStr, localeCode) {
			return this.datetime.isValid(this.parse(dateStr, localeCode));
		}
		/**
		* Return the type object of a specified column as per configuration or
		* passed collection
		* @param {Number} colIndex Column index
		* @param {Array} types Collection of column types, optional
		* @returns {Object}
		*/
		getOptions(colIndex, types) {
			types = types || this.tf.colTypes;
			let colType = types[colIndex];
			return isObj(colType) ? colType : {};
		}
		/**
		* Return the locale code for supplied column index as per configuration
		* or global setting
		* @param {Number} colIndex Column index
		* @returns {String} Locale code (ie: 'en-us')
		*/
		getLocale(colIndex) {
			return this.getOptions(colIndex).locale || this.locale;
		}
		/**
		* Add date time format(s) to a locale as specified by the passed
		* collection of column types, ie:
		*  [
		*      'string',
		*      'number',
		*      { type: 'date', locale: 'en', format: ['{dd}/{MM}/{yyyy}']}
		* ]
		*
		* @param {Array} [types=[]] Collection of column types
		*/
		addConfigFormats(types = []) {
			types.forEach((type, idx) => {
				let options = this.getOptions(idx, types);
				if (options.type === "date" && options.hasOwnProperty("format")) {
					let locale = this.datetime.getLocale(options.locale || this.locale);
					let formats = isArray(options.format) ? options.format : [options.format];
					try {
						formats.forEach((format) => {
							locale.addFormat(format);
						});
					} catch (ex) {
						root.console.error(ex);
					}
				}
			});
		}
		/**
		* Remove DateType instance
		*/
		destroy() {
			if (!this.initialized) return;
			this.emitter.off(["add-date-type-formats"], (tf, types) => this.addConfigFormats(types));
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/help.js
	/**
	* Help UI component
	*/
	var Help = class Help extends Feature {
		/**
		* Creates an instance of Help
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, Help);
			let f = this.config.help_instructions || {};
			/**
			* ID of main custom container element
			* @type {String}
			*/
			this.tgtId = defaultsStr(f.target_id, null);
			/**
			* ID of custom container element for instructions
			* @type {String}
			*/
			this.contTgtId = defaultsStr(f.container_target_id, null);
			/**
			* Instructions text (accepts HTML)
			* @type {String}
			*/
			this.instrText = !isEmpty(f.text) ? f.text : "Use the filters above each column to filter and limit table data. Advanced searches can be performed by using the following operators: <br /><b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>=</b>, <b>*</b>, <b>!</b>, <b>{</b>, <b>}</b>, <b>||</b>,<b>&amp;&amp;</b>, <b>[empty]</b>, <b>[nonempty]</b>, <b>rgx:</b><br/><a href=\"https://github.com/koalyptus/TableFilter/wiki/4.-Filter-operators\" target=\"_blank\">Learn more</a><hr/>";
			/**
			* Instructions HTML
			* @type {String}
			*/
			this.instrHtml = defaultsStr(f.html, null);
			/**
			* Help button text ('?')
			* @type {String}
			*/
			this.btnText = defaultsStr(f.btn_text, "?");
			/**
			* Custom help button HTML
			* @type {String}
			*/
			this.btnHtml = defaultsStr(f.btn_html, null);
			/**
			* Css class for help button
			* @type {String}
			*/
			this.btnCssClass = defaultsStr(f.btn_css_class, "helpBtn");
			/**
			* Css class for help container element
			* @type {String}
			*/
			this.contCssClass = defaultsStr(f.container_css_class, "helpCont");
			/**
			* Button DOM element
			* @type {DOMElement}
			*/
			this.btn = null;
			/**
			* Help container DOM element
			* @type {DOMElement}
			*/
			this.cont = null;
			/**
			* Adjust container left position when table's horizontal scroll is
			* on, typically when `responsive` option is enabled.
			* @type {Number}
			* @defaultValue 25
			*/
			this.contAdjustLeftPosition = defaultsNb(f.container_adjust_left_position, 25);
			/**
			* Bound mouseup wrapper
			* @private
			*/
			this.boundMouseup = null;
			/**
			* Default HTML appended to instructions text
			* @type {String}
			*/
			this.defaultHtml = "<div class=\"helpFooter\"><h4>TableFilter v" + tf.version + "</h4><a href=\"https://www.tablefilter.com/\" target=\"_blank\">https://www.tablefilter.com/</a><br/><span>&copy;2015-" + tf.year + " Max Guglielmi</span><div align=\"center\" style=\"margin-top:8px;\"><a href=\"javascript:void(0);\" class=\"close\">Close</a></div></div>";
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, RIGHT);
			this.emitter.on(["init-help"], () => this.init());
		}
		/**
		* Mouse-up event handler handling popup auto-close behaviour
		* @private
		*/
		onMouseup(evt) {
			let targetElm = targetEvt(evt);
			while (targetElm && targetElm !== this.cont && targetElm !== this.btn) targetElm = targetElm.parentNode;
			if (targetElm !== this.cont && targetElm !== this.btn) this.toggle();
		}
		/**
		* Initialise Help instance
		*/
		init() {
			if (this.initialized) return;
			this.emitter.emit("initializing-feature", this, !isNull(this.tgtId));
			let tf = this.tf;
			let btn = createElm("span");
			let cont = createElm("div");
			this.boundMouseup = this.onMouseup.bind(this);
			(!this.tgtId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.tgtId)).appendChild(btn);
			let divContainer = !this.contTgtId ? btn : elm(this.contTgtId);
			if (!this.btnHtml) {
				divContainer.appendChild(cont);
				let helplink = createElm("a", ["href", "javascript:void(0);"]);
				helplink.className = this.btnCssClass;
				helplink.appendChild(createText(this.btnText));
				btn.appendChild(helplink);
				addEvt(helplink, "click", () => this.toggle());
			} else {
				btn.innerHTML = this.btnHtml;
				let helpEl = btn.firstChild;
				addEvt(helpEl, "click", () => this.toggle());
				divContainer.appendChild(cont);
			}
			if (!this.instrHtml) {
				cont.innerHTML = this.instrText;
				cont.className = this.contCssClass;
			} else {
				if (this.contTgtId) divContainer.appendChild(cont);
				cont.innerHTML = this.instrHtml;
				if (!this.contTgtId) cont.className = this.contCssClass;
			}
			cont.innerHTML += this.defaultHtml;
			addEvt(cont, "click", () => this.toggle());
			this.cont = cont;
			this.btn = btn;
			/** @inherited */
			this.initialized = true;
			this.emitter.emit("feature-initialized", this);
		}
		/**
		* Toggle help pop-up
		*/
		toggle() {
			if (!this.isEnabled()) return;
			removeEvt(root, "mouseup", this.boundMouseup);
			let divDisplay = this.cont.style.display;
			if (divDisplay === "" || divDisplay === "none") {
				this.cont.style.display = "inline";
				if (this.tf.dom().scrollLeft > 0) this.cont.style.left = `${this.btn.offsetLeft - this.tf.dom().scrollLeft + this.contAdjustLeftPosition}px`;
				addEvt(root, "mouseup", this.boundMouseup);
			} else {
				this.cont.style.display = NONE;
				this.cont.style.left = "";
			}
		}
		/**
		* Remove help UI
		*/
		destroy() {
			if (!this.initialized) return;
			removeElm(this.btn);
			this.btn = null;
			removeElm(this.cont);
			this.cont = null;
			this.boundMouseup = null;
			this.initialized = false;
		}
	};
	Help.meta = { alwaysInstantiate: true };
	//#endregion
	//#region src/modules/hash.js
	var JSON$1 = root.JSON;
	var location$1 = root.location;
	var decodeURIComponent = root.decodeURIComponent;
	var encodeURIComponent = root.encodeURIComponent;
	/**
	* Checks if browser has onhashchange event
	*/
	var hasHashChange = () => {
		let docMode = root.documentMode;
		return "onhashchange" in root && (docMode === void 0 || docMode > 7);
	};
	/**
	* Manages state via URL hash changes
	*
	* @export
	* @class Hash
	*/
	var Hash = class {
		/**
		* Creates an instance of Hash
		*
		* @param {State} state Instance of State
		*/
		constructor(state) {
			/**
			* State object
			* @type {State}
			*/
			this.state = state;
			/**
			* Cached URL hash
			* @type {String} Hash string
			* @private
			*/
			this.lastHash = null;
			/**
			* Application event emitter instance
			* @type {Emitter}
			*/
			this.emitter = state.emitter;
			/**
			* Bound sync wrapper for future use
			* @private
			*/
			this.boundSync = null;
		}
		/**
		* Initializes the Hash object
		*/
		init() {
			if (!hasHashChange()) return;
			this.lastHash = location$1.hash;
			this.boundSync = this.sync.bind(this);
			this.emitter.on(["state-changed"], (tf, state) => this.update(state));
			this.emitter.on(["initialized"], this.boundSync);
			addEvt(root, "hashchange", this.boundSync);
		}
		/**
		* Updates the URL hash based on a state change
		*
		* @param {State} state Instance of State
		*/
		update(state) {
			let hash = `#${encodeURIComponent(JSON$1.stringify(state))}`;
			if (this.lastHash === hash) return;
			location$1.hash = hash;
			this.lastHash = hash;
		}
		/**
		* Converts a URL hash into a JSON object
		*
		* @param {String} hash URL hash fragment
		* @returns {Object} JSON object
		*/
		parse(hash) {
			if (hash.indexOf("#") === -1) return null;
			hash = hash.substr(1);
			return JSON$1.parse(decodeURIComponent(hash));
		}
		/**
		* Applies current hash state to features
		*/
		sync() {
			let state = this.parse(location$1.hash);
			if (!state) return;
			this.state.overrideAndSync(state);
		}
		/**
		* Release Hash event subscriptions and clear fields
		*/
		destroy() {
			this.emitter.off(["state-changed"], (tf, state) => this.update(state));
			this.emitter.off(["initialized"], this.boundSync);
			removeEvt(root, "hashchange", this.boundSync);
			this.state = null;
			this.lastHash = null;
			this.emitter = null;
		}
	};
	//#endregion
	//#region src/cookie.js
	/**
	* Cookie utilities
	*/
	var doc$1 = root.document;
	var cookie_default = {
		/**
		* Write a cookie
		* @param {String} name Name of the cookie
		* @param {String} value Value of the cookie
		* @param {Number} hours Cookie duration in hours
		*/
		write(name, value, hours) {
			let expire = "";
			if (hours) {
				expire = new Date((/* @__PURE__ */ new Date()).getTime() + hours * 36e5);
				expire = "; expires=" + expire.toGMTString();
			}
			doc$1.cookie = name + "=" + escape(value) + expire;
		},
		/**
		* Read a cookie
		* @param {String} name Name of the cookie
		* @returns {String} Value of the cookie
		*/
		read(name) {
			let cookieValue = "", search = name + "=";
			if (doc$1.cookie.length > 0) {
				let cookie = doc$1.cookie, offset = cookie.indexOf(search);
				if (offset !== -1) {
					offset += search.length;
					let end = cookie.indexOf(";", offset);
					if (end === -1) end = cookie.length;
					cookieValue = unescape(cookie.substring(offset, end));
				}
			}
			return cookieValue;
		},
		/**
		* Remove a cookie
		* @param {String} name Name of the cookie
		*/
		remove(name) {
			this.write(name, "", -1);
		}
	};
	//#endregion
	//#region src/modules/storage.js
	var JSON = root.JSON;
	var localStorage = root.localStorage;
	var location = root.location;
	/**
	* Checks if browser has Storage feature
	*/
	var hasStorage = () => {
		return "Storage" in root;
	};
	/**
	* Stores the features state in browser's local storage or cookie
	*
	* @export
	* @class Storage
	*/
	var Storage = class {
		/**
		* Creates an instance of Storage
		*
		* @param {State} state Instance of State
		*/
		constructor(state) {
			/**
			* State object
			* @type {State}
			* @private
			*/
			this.state = state;
			/**
			* TableFilter object
			* @type {TableFilter}
			* @private
			*/
			this.tf = state.tf;
			/**
			* Persist with local storage
			* @type {Boolean}
			* @private
			*/
			this.enableLocalStorage = state.enableLocalStorage && hasStorage();
			/**
			* Persist with cookie
			* @type {Boolean}
			* @private
			*/
			this.enableCookie = state.enableCookie && !this.enableLocalStorage;
			/**
			* Emitter object
			* @type {Emitter}
			* @private
			*/
			this.emitter = state.emitter;
			/**
			* Cookie duration in hours from state object
			* @type {Number}
			* @private
			*/
			this.duration = state.cookieDuration;
		}
		/**
		* Initializes the Storage object
		*/
		init() {
			this.emitter.on(["state-changed"], (tf, state) => this.save(state));
			this.emitter.on(["initialized"], () => this.sync());
		}
		/**
		* Persists the features state on state changes
		*
		* @param {State} state Instance of State
		*/
		save(state) {
			if (this.enableLocalStorage) localStorage[this.getKey()] = JSON.stringify(state);
			else cookie_default.write(this.getKey(), JSON.stringify(state), this.duration);
		}
		/**
		* Turns stored string into a State JSON object
		*
		*  @returns {Object} JSON object
		*/
		retrieve() {
			let state = null;
			if (this.enableLocalStorage) state = localStorage[this.getKey()];
			else state = cookie_default.read(this.getKey());
			if (!state) return null;
			return JSON.parse(state);
		}
		/**
		* Removes persisted state from storage
		*/
		remove() {
			if (this.enableLocalStorage) localStorage.removeItem(this.getKey());
			else cookie_default.remove(this.getKey());
		}
		/**
		* Applies persisted state to features
		*/
		sync() {
			let state = this.retrieve();
			if (!state) return;
			this.state.overrideAndSync(state);
		}
		/**
		* Returns the storage key
		*
		* @returns {String} Key
		*/
		getKey() {
			return JSON.stringify({
				key: `${this.tf.prfxTf}_${this.tf.id}`,
				path: location.pathname
			});
		}
		/**
		* Release Storage event subscriptions and clear fields
		*/
		destroy() {
			this.emitter.off(["state-changed"], (tf, state) => this.save(state));
			this.emitter.off(["initialized"], () => this.sync());
			this.remove();
			this.state = null;
			this.emitter = null;
		}
	};
	//#endregion
	//#region src/modules/state.js
	/**
	* Features state object persistable with localStorage, cookie or URL hash
	*
	* @export
	* @class State
	* @extends {Feature}
	*/
	var State = class State extends Feature {
		/**
		* Creates an instance of State
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, State);
			let cfg = this.config.state || {};
			/**
			* Determines whether state is persisted with URL hash
			* @type {Boolean}
			*/
			this.enableHash = cfg === true || isArray(cfg.types) && cfg.types.indexOf("hash") !== -1;
			/**
			* Determines whether state is persisted with localStorage
			* @type {Boolean}
			*/
			this.enableLocalStorage = isArray(cfg.types) && cfg.types.indexOf("local_storage") !== -1;
			/**
			* Determines whether state is persisted with localStorage
			* @type {Boolean}
			*/
			this.enableCookie = isArray(cfg.types) && cfg.types.indexOf("cookie") !== -1;
			/**
			* Persist filters values, enabled by default
			* @type {Boolean}
			*/
			this.persistFilters = defaultsBool(cfg.filters, true);
			/**
			* Persist current page number when paging is enabled
			* @type {Boolean}
			*/
			this.persistPageNumber = Boolean(cfg.page_number);
			/**
			* Persist page length when paging is enabled
			* @type {Boolean}
			*/
			this.persistPageLength = Boolean(cfg.page_length);
			/**
			* Persist column sorting
			* @type {Boolean}
			*/
			this.persistSort = Boolean(cfg.sort);
			/**
			* Persist columns visibility
			* @type {Boolean}
			*/
			this.persistColsVisibility = Boolean(cfg.columns_visibility);
			/**
			* Persist filters row visibility
			* @type {Boolean}
			*/
			this.persistFiltersVisibility = Boolean(cfg.filters_visibility);
			/**
			* Cookie duration in hours
			* @type {Boolean}
			*/
			this.cookieDuration = defaultsNb(parseInt(cfg.cookie_duration, 10), 87600);
			/**
			* Enable Storage if localStorage or cookie is required
			* @type {Boolean}
			* @private
			*/
			this.enableStorage = this.enableLocalStorage || this.enableCookie;
			/**
			* Storage instance if storage is required
			* @type {Storage}
			* @private
			*/
			this.storage = null;
			/**
			* Hash instance if URL hash is required
			* @type {Boolean}
			* @private
			*/
			this.hash = null;
			/**
			* Current page number
			* @type {Number}
			* @private
			*/
			this.pageNb = null;
			/**
			* Current page length
			* @type {Number}
			* @private
			*/
			this.pageLength = null;
			/**
			* Current column sorting
			* @type {Object}
			* @private
			*/
			this.sort = null;
			/**
			* Current hidden columns
			* @type {Object}
			* @private
			*/
			this.hiddenCols = null;
			/**
			* Filters row visibility
			* @type {Boolean}
			* @private
			*/
			this.filtersVisibility = null;
			/**
			* State object
			* @type {Object}
			* @private
			*/
			this.state = {};
			/**
			* Prefix for column ID
			* @type {String}
			* @private
			*/
			this.prfxCol = "col_";
			/**
			* Prefix for page number ID
			* @type {String}
			* @private
			*/
			this.pageNbKey = "page";
			/**
			* Prefix for page length ID
			* @type {String}
			* @private
			*/
			this.pageLengthKey = "page_length";
			/**
			* Prefix for filters visibility ID
			* @type {String}
			* @private
			*/
			this.filtersVisKey = "filters_visibility";
		}
		/**
		* Initializes State instance
		*/
		init() {
			if (this.initialized) return;
			this.emitter.on(["after-filtering"], () => this.update());
			this.emitter.on(["after-page-change", "after-clearing-filters"], (tf, pageNb) => this.updatePage(pageNb));
			this.emitter.on(["after-page-length-change"], (tf, pageLength) => this.updatePageLength(pageLength));
			this.emitter.on(["column-sorted"], (tf, index, descending) => this.updateSort(index, descending));
			this.emitter.on(["sort-initialized"], () => this._syncSort());
			this.emitter.on(["columns-visibility-initialized"], () => this._syncColsVisibility());
			this.emitter.on(["column-shown", "column-hidden"], (tf, feature, colIndex, hiddenCols) => this.updateColsVisibility(hiddenCols));
			this.emitter.on(["filters-visibility-initialized"], () => this._syncFiltersVisibility());
			this.emitter.on(["filters-toggled"], (tf, extension, visible) => this.updateFiltersVisibility(visible));
			if (this.enableHash) {
				this.hash = new Hash(this);
				this.hash.init();
			}
			if (this.enableStorage) {
				this.storage = new Storage(this);
				this.storage.init();
			}
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Update state object based on current features state
		*/
		update() {
			if (!this.isEnabled()) return;
			let state = this.state;
			let tf = this.tf;
			if (this.persistFilters) tf.getFiltersValue().forEach((val, idx) => {
				let key = `${this.prfxCol}${idx}`;
				if (isString(val) && isEmpty$1(val)) {
					if (state.hasOwnProperty(key)) state[key].flt = void 0;
				} else {
					state[key] = state[key] || {};
					state[key].flt = val;
				}
			});
			if (this.persistPageNumber) {
				if (isNull(this.pageNb)) state[this.pageNbKey] = void 0;
				else state[this.pageNbKey] = this.pageNb;
			}
			if (this.persistPageLength) {
				if (isNull(this.pageLength)) state[this.pageLengthKey] = void 0;
				else state[this.pageLengthKey] = this.pageLength;
			}
			if (this.persistSort) {
				if (!isNull(this.sort)) {
					Object.keys(state).forEach((key) => {
						if (key.indexOf(this.prfxCol) !== -1 && state[key]) state[key].sort = void 0;
					});
					let key = `${this.prfxCol}${this.sort.column}`;
					state[key] = state[key] || {};
					state[key].sort = { descending: this.sort.descending };
				}
			}
			if (this.persistColsVisibility) {
				if (!isNull(this.hiddenCols)) {
					Object.keys(state).forEach((key) => {
						if (key.indexOf(this.prfxCol) !== -1 && state[key]) state[key].hidden = void 0;
					});
					this.hiddenCols.forEach((colIdx) => {
						let key = `${this.prfxCol}${colIdx}`;
						state[key] = state[key] || {};
						state[key].hidden = true;
					});
				}
			}
			if (this.persistFiltersVisibility) {
				if (isNull(this.filtersVisibility)) state[this.filtersVisKey] = void 0;
				else state[this.filtersVisKey] = this.filtersVisibility;
			}
			this.emitter.emit("state-changed", tf, state);
		}
		/**
		* Refresh page number field on page number changes
		*
		* @param {Number} pageNb Current page number
		*/
		updatePage(pageNb) {
			this.pageNb = pageNb;
			this.update();
		}
		/**
		* Refresh page length field on page length changes
		*
		* @param {Number} pageLength Current page length value
		*/
		updatePageLength(pageLength) {
			this.pageLength = pageLength;
			this.update();
		}
		/**
		* Refresh column sorting information on sort changes
		*
		* @param index {Number} Column index
		* @param {Boolean} descending Descending manner
		*/
		updateSort(index, descending) {
			this.sort = {
				column: index,
				descending
			};
			this.update();
		}
		/**
		* Refresh hidden columns information on columns visibility changes
		*
		* @param {Array} hiddenCols Columns indexes
		*/
		updateColsVisibility(hiddenCols) {
			this.hiddenCols = hiddenCols;
			this.update();
		}
		/**
		* Refresh filters visibility on filters visibility change
		*
		* @param {Boolean} visible Visibility flad
		*/
		updateFiltersVisibility(visible) {
			this.filtersVisibility = visible;
			this.update();
		}
		/**
		* Override state field
		*
		* @param state State object
		*/
		override(state) {
			this.state = state;
			this.emitter.emit("state-changed", this.tf, state);
		}
		/**
		* Sync stored features state
		*/
		sync() {
			let state = this.state;
			let tf = this.tf;
			this._syncFilters();
			if (this.persistPageNumber) {
				let pageNumber = state[this.pageNbKey];
				this.emitter.emit("change-page", tf, pageNumber);
			}
			if (this.persistPageLength) {
				let pageLength = state[this.pageLengthKey];
				this.emitter.emit("change-page-results", tf, pageLength);
			}
			this._syncSort();
			this._syncColsVisibility();
			this._syncFiltersVisibility();
		}
		/**
		* Override current state with passed one and sync features
		*
		* @param {Object} state State object
		*/
		overrideAndSync(state) {
			this.disable();
			this.override(state);
			this.sync();
			this.enable();
		}
		/**
		* Sync filters with stored values and filter table
		*
		* @private
		*/
		_syncFilters() {
			if (!this.persistFilters) return;
			let state = this.state;
			let tf = this.tf;
			tf.eachCol((colIdx) => tf.setFilterValue(colIdx, ""));
			Object.keys(state).forEach((key) => {
				if (key.indexOf(this.prfxCol) !== -1) {
					let colIdx = parseInt(key.replace(this.prfxCol, ""), 10);
					let val = state[key].flt;
					tf.setFilterValue(colIdx, val);
				}
			});
			tf.filter();
		}
		/**
		* Sync sorted column with stored sorting information and sort table
		*
		* @private
		*/
		_syncSort() {
			if (!this.persistSort) return;
			let state = this.state;
			let tf = this.tf;
			Object.keys(state).forEach((key) => {
				if (key.indexOf(this.prfxCol) !== -1) {
					let colIdx = parseInt(key.replace(this.prfxCol, ""), 10);
					if (!isUndef(state[key].sort)) {
						let sort = state[key].sort;
						this.emitter.emit("sort", tf, colIdx, sort.descending);
					}
				}
			});
		}
		/**
		* Sync hidden columns with stored information
		*
		* @private
		*/
		_syncColsVisibility() {
			if (!this.persistColsVisibility) return;
			let state = this.state;
			let tf = this.tf;
			let hiddenCols = [];
			Object.keys(state).forEach((key) => {
				if (key.indexOf(this.prfxCol) !== -1) {
					let colIdx = parseInt(key.replace(this.prfxCol, ""), 10);
					if (!isUndef(state[key].hidden)) hiddenCols.push(colIdx);
				}
			});
			hiddenCols.forEach((colIdx) => {
				this.emitter.emit("hide-column", tf, colIdx);
			});
		}
		/**
		* Sync filters visibility with stored information
		*
		* @private
		*/
		_syncFiltersVisibility() {
			if (!this.persistFiltersVisibility) return;
			let state = this.state;
			let tf = this.tf;
			let filtersVisibility = state[this.filtersVisKey];
			this.filtersVisibility = filtersVisibility;
			this.emitter.emit("show-filters", tf, filtersVisibility);
		}
		/**
		* Destroy State instance
		*/
		destroy() {
			if (!this.initialized) return;
			this.state = {};
			this.emitter.off(["after-filtering"], () => this.update());
			this.emitter.off(["after-page-change", "after-clearing-filters"], (tf, pageNb) => this.updatePage(pageNb));
			this.emitter.off(["after-page-length-change"], (tf, index) => this.updatePageLength(index));
			this.emitter.off(["column-sorted"], (tf, index, descending) => this.updateSort(index, descending));
			this.emitter.off(["sort-initialized"], () => this._syncSort());
			this.emitter.off(["columns-visibility-initialized"], () => this._syncColsVisibility());
			this.emitter.off(["column-shown", "column-hidden"], (tf, feature, colIndex, hiddenCols) => this.updateColsVisibility(hiddenCols));
			this.emitter.off(["filters-visibility-initialized"], () => this._syncFiltersVisibility());
			this.emitter.off(["filters-toggled"], (tf, extension, visible) => this.updateFiltersVisibility(visible));
			if (this.enableHash) {
				this.hash.destroy();
				this.hash = null;
			}
			if (this.enableStorage) {
				this.storage.destroy();
				this.storage = null;
			}
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/gridLayout.js
	/**
	* Grid layout, table with fixed headers
	*/
	var GridLayout = class GridLayout extends Feature {
		/**
		* Creates an instance of GridLayout
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, GridLayout);
			let f = this.config.grid_layout || {};
			/**
			* Grid-layout container width as CSS string
			* @type {String}
			*/
			this.width = defaultsStr(f.width, null);
			/**
			* Grid-layout container height as CSS string
			* @type {String}
			*/
			this.height = defaultsStr(f.height, null);
			/**
			* Css class for main container element
			* @type {String}
			*/
			this.mainContCssClass = defaultsStr(f.cont_css_class, "grd_Cont");
			/**
			* Css class for body table container element
			* @type {String}
			*/
			this.contCssClass = defaultsStr(f.tbl_cont_css_class, "grd_tblCont");
			/**
			* Css class for headers table container element
			* @type {String}
			*/
			this.headContCssClass = defaultsStr(f.tbl_head_css_class, "grd_headTblCont");
			/**
			* Css class for toolbar container element (rows counter, paging etc.)
			* @type {String}
			*/
			this.infDivCssClass = defaultsStr(f.inf_grid_css_class, "grd_inf");
			/**
			* Index of the headers row, default: 0
			* @type {Number}
			*/
			this.headRowIndex = defaultsNb(f.headers_row_index, 0);
			/**
			* Collection of the header row indexes to be moved into headers table
			* @type {Array}
			*/
			this.headRows = defaultsArr(f.headers_rows, [0]);
			/**
			* Enable or disable column filters generation, default: true
			* @type {Boolean}
			*/
			this.filters = defaultsBool(f.filters, true);
			/**
			* Enable or disable column headers, default: false
			* @type {Boolean}
			*/
			this.noHeaders = Boolean(f.no_headers);
			/**
			* Grid-layout default column widht as CSS string
			* @type {String}
			*/
			this.defaultColWidth = defaultsStr(f.default_col_width, "100px");
			/**
			* List of column elements
			* @type {Array}
			* @private
			*/
			this.colElms = [];
			/**
			* Prefix for grid-layout filter's cell ID
			* @type {String}
			* @private
			*/
			this.prfxGridFltTd = "_td_";
			/**
			* Prefix for grid-layout header's cell ID
			* @type {String}
			* @private
			*/
			this.prfxGridTh = "tblHeadTh_";
			/**
			* Mark-up of original HTML table
			* @type {String}
			* @private
			*/
			this.sourceTblHtml = tf.dom().outerHTML;
			/**
			* Indicates if working table has column elements
			* @type {Boolean}
			* @private
			*/
			this.tblHasColTag = tag(tf.dom(), "col").length > 0 ? true : false;
			/**
			* Main container element
			* @private
			*/
			this.tblMainCont = null;
			/**
			* Table container element
			* @private
			*/
			this.tblCont = null;
			/**
			* Headers' table container element
			* @private
			*/
			this.headTblCont = null;
			/**
			* Headers' table element
			* @private
			*/
			this.headTbl = null;
			tf.fltGrid = this.filters;
		}
		/**
		* Generates a grid with fixed headers
		* TODO: reduce size of init by extracting single purposed methods
		*/
		init() {
			let tf = this.tf;
			let tbl = tf.dom();
			if (this.initialized) return;
			this.setOverrides();
			this.setDefaultColWidths();
			this.tblMainCont = this.createContainer("div", this.mainContCssClass);
			if (this.width) this.tblMainCont.style.width = this.width;
			tbl.parentNode.insertBefore(this.tblMainCont, tbl);
			this.tblCont = this.createContainer("div", this.contCssClass);
			this.setConfigWidth(this.tblCont);
			if (this.height) this.tblCont.style.height = this.height;
			tbl.parentNode.insertBefore(this.tblCont, tbl);
			let t = removeElm(tbl);
			this.tblCont.appendChild(t);
			if (tbl.style.width === "") {
				let tblW = this.initialTableWidth();
				tbl.style.width = (contains("%", tblW) ? tbl.clientWidth : tblW) + "px";
			}
			let d = removeElm(this.tblCont);
			this.tblMainCont.appendChild(d);
			this.headTblCont = this.createContainer("div", this.headContCssClass);
			this.headTbl = createElm("table");
			let tH = createElm("tHead");
			let hRow = tbl.rows[this.headRowIndex];
			let sortTriggers = this.getSortTriggerIds(hRow);
			let filtersRow = this.createFiltersRow();
			this.setHeadersRow(tH);
			this.headTbl.appendChild(tH);
			if (tf.filtersRowIndex === 0) tH.insertBefore(filtersRow, hRow);
			else tH.appendChild(filtersRow);
			this.headTblCont.appendChild(this.headTbl);
			this.tblCont.parentNode.insertBefore(this.headTblCont, this.tblCont);
			let thead = tag(tbl, "thead");
			if (thead.length > 0) tbl.removeChild(thead[0]);
			this.headTbl.style.tableLayout = "fixed";
			tbl.style.tableLayout = "fixed";
			tf.setColWidths(this.headTbl);
			this.headTbl.style.width = tbl.style.width;
			addEvt(this.tblCont, "scroll", (evt) => {
				let scrollLeft = targetEvt(evt).scrollLeft;
				this.headTblCont.scrollLeft = scrollLeft;
			});
			let sort = tf.extension("sort");
			if (sort) {
				sort.asyncSort = true;
				sort.triggerIds = sortTriggers;
			}
			this.setColumnElements();
			if (tf.popupFilters) filtersRow.style.display = NONE;
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Overrides TableFilter instance properties to adjust to grid layout mode
		* @private
		*/
		setOverrides() {
			let tf = this.tf;
			tf.refRow = 0;
			tf.headersRow = 0;
			tf.filtersRowIndex = 1;
		}
		/**
		* Set grid-layout default column widths if column widths are not defined
		* @private
		*/
		setDefaultColWidths() {
			let tf = this.tf;
			if (tf.colWidths.length > 0) return;
			tf.eachCol((k) => {
				let colW;
				let cell = tf.dom().rows[tf.getHeadersRowIndex()].cells[k];
				if (cell.width !== "") colW = cell.width;
				else if (cell.style.width !== "") colW = parseInt(cell.style.width, 10);
				else colW = this.defaultColWidth;
				tf.colWidths[k] = colW;
			});
			tf.setColWidths();
		}
		/**
		* Initial table width
		* @returns {Number}
		* @private
		*/
		initialTableWidth() {
			let tbl = this.tf.dom();
			let width;
			if (tbl.width !== "") width = tbl.width;
			else if (tbl.style.width !== "") width = tbl.style.width;
			else width = tbl.clientWidth;
			return parseInt(width, 10);
		}
		/**
		* Creates container element
		* @param {String} tag Tag name
		* @param {String} className Css class to assign to element
		* @returns {DOMElement}
		* @private
		*/
		createContainer(tag, className) {
			let element = createElm(tag);
			element.className = className;
			return element;
		}
		/**
		* Creates filters row with cells
		* @returns {HTMLTableRowElement}
		* @private
		*/
		createFiltersRow() {
			let tf = this.tf;
			let filtersRow = createElm("tr");
			if (this.filters && tf.fltGrid) {
				tf.externalFltIds = [];
				tf.eachCol((j) => {
					let fltTdId = `${tf.prfxFlt + j + this.prfxGridFltTd + tf.id}`;
					let cl = createElm(tf.fltCellTag, ["id", fltTdId]);
					filtersRow.appendChild(cl);
					tf.externalFltIds[j] = fltTdId;
				});
			}
			return filtersRow;
		}
		/**
		* Generates column elements if necessary and assigns their widths
		* @private
		*/
		setColumnElements() {
			let tf = this.tf;
			let cols = tag(tf.dom(), "col");
			this.tblHasColTag = cols.length > 0;
			for (let k = tf.getCellsNb() - 1; k >= 0; k--) {
				let col;
				if (!this.tblHasColTag) {
					col = createElm("col");
					tf.dom().insertBefore(col, tf.dom().firstChild);
				} else col = cols[k];
				col.style.width = tf.colWidths[k];
				this.colElms[k] = col;
			}
			this.tblHasColTag = true;
		}
		/**
		* Sets headers row in headers table
		* @param {HTMLHeadElement} tableHead Table head element
		* @private
		*/
		setHeadersRow(tableHead) {
			if (this.noHeaders) tableHead.appendChild(createElm("tr"));
			else for (let i = 0; i < this.headRows.length; i++) {
				let row = this.tf.dom().rows[this.headRows[i]];
				tableHead.appendChild(row);
			}
		}
		/**
		* Sets width defined in configuration to passed element
		* @param {DOMElement} element DOM element
		* @private
		*/
		setConfigWidth(element) {
			if (!this.width) return;
			if (this.width.indexOf("%") !== -1) element.style.width = "100%";
			else element.style.width = this.width;
		}
		/**
		* Returns a list of header IDs used for specifing external sort triggers
		* @param {HTMLTableRowElement} row DOM row element
		* @returns {Array} List of IDs
		* @private
		*/
		getSortTriggerIds(row) {
			let tf = this.tf;
			let sortTriggers = [];
			tf.eachCol((n) => {
				let c = row.cells[n];
				let thId = c.getAttribute("id");
				if (!thId || thId === "") {
					thId = `${this.prfxGridTh + n}_${tf.id}`;
					c.setAttribute("id", thId);
				}
				sortTriggers.push(thId);
			});
			return sortTriggers;
		}
		/**
		* Removes the grid layout
		*/
		destroy() {
			let tf = this.tf;
			let tbl = tf.dom();
			if (!this.initialized) return;
			let t = removeElm(tbl);
			this.tblMainCont.parentNode.insertBefore(t, this.tblMainCont);
			removeElm(this.tblMainCont);
			this.tblMainCont = null;
			this.headTblCont = null;
			this.headTbl = null;
			this.tblCont = null;
			tbl.outerHTML = this.sourceTblHtml;
			this.tf.tbl = elm(tf.id);
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/loader.js
	var BEFORE_ACTION_EVENTS = [
		"before-filtering",
		"before-populating-filter",
		"before-page-change",
		"before-clearing-filters",
		"before-page-length-change",
		"before-reset-page",
		"before-reset-page-length",
		"before-loading-extensions",
		"before-loading-themes"
	];
	var AFTER_ACTION_EVENTS = [
		"after-filtering",
		"after-populating-filter",
		"after-page-change",
		"after-clearing-filters",
		"after-page-length-change",
		"after-reset-page",
		"after-reset-page-length",
		"after-loading-extensions",
		"after-loading-themes"
	];
	/**
	* Activity indicator
	*
	* @export
	* @class Loader
	* @extends {Feature}
	*/
	var Loader = class Loader extends Feature {
		/**
		* Creates an instance of Loader.
		*
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, Loader);
			let f = this.config.loader || {};
			/**
			* ID of custom container element
			* @type {String}
			*/
			this.targetId = defaultsStr(f.target_id, null);
			/**
			* Loader container DOM element
			* @type {DOMElement}
			*/
			this.cont = null;
			/**
			* Text displayed when indicator is visible
			* @type {String}
			*/
			this.text = defaultsStr(f.text, "Loading...");
			/**
			* Custom HTML injected in Loader's container element
			* @type {String}
			*/
			this.html = defaultsStr(f.html, null);
			/**
			* Css class for Loader's container element
			* @type {String}
			*/
			this.cssClass = defaultsStr(f.css_class, "loader");
			/**
			* Close delay in milliseconds
			* @type {Number}
			*/
			this.closeDelay = 250;
			/**
			* Callback fired when loader is displayed
			* @type {Function}
			*/
			this.onShow = defaultsFn(f.on_show_loader, EMPTY_FN);
			/**
			* Callback fired when loader is closed
			* @type {Function}
			*/
			this.onHide = defaultsFn(f.on_hide_loader, EMPTY_FN);
		}
		/**
		* Initializes Loader instance
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			let emitter = this.emitter;
			let containerDiv = createElm("div");
			containerDiv.className = this.cssClass;
			let targetEl = !this.targetId ? tf.dom().parentNode : elm(this.targetId);
			if (!this.targetId) targetEl.insertBefore(containerDiv, tf.dom());
			else targetEl.appendChild(containerDiv);
			this.cont = containerDiv;
			if (!this.html) this.cont.appendChild(createText(this.text));
			else this.cont.innerHTML = this.html;
			this.show(NONE);
			emitter.on(BEFORE_ACTION_EVENTS, () => this.show(""));
			emitter.on(AFTER_ACTION_EVENTS, () => this.show(NONE));
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Shows or hides activity indicator
		* @param {String} Two possible values: '' or 'none'
		*/
		show(p) {
			if (!this.isEnabled()) return;
			function displayLoader() {
				if (!this.cont) return;
				if (p !== "none") this.onShow(this);
				this.cont.style.display = p;
				if (p === "none") this.onHide(this);
			}
			let t = p === "none" ? this.closeDelay : 1;
			root.setTimeout(displayLoader.bind(this), t);
		}
		/**
		* Removes feature
		*/
		destroy() {
			if (!this.initialized) return;
			let emitter = this.emitter;
			removeElm(this.cont);
			this.cont = null;
			emitter.off(BEFORE_ACTION_EVENTS, () => this.show(""));
			emitter.off(AFTER_ACTION_EVENTS, () => this.show(NONE));
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/highlightKeywords.js
	/**
	* Highlight matched keywords upon filtering
	*
	* @export
	* @class HighlightKeyword
	*/
	var HighlightKeyword = class {
		/**
		* Creates an instance of HighlightKeyword
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			let f = tf.config();
			/**
			* Css class for highlighted term
			* @type {String}
			*/
			this.highlightCssClass = defaultsStr(f.highlight_css_class, "keyword");
			/**
			* TableFilter instance
			* @type {TableFilter}
			*/
			this.tf = tf;
			/**
			* TableFilter's emitter instance
			* @type {Emitter}
			*/
			this.emitter = tf.emitter;
		}
		/**
		* Initializes HighlightKeyword instance
		*/
		init() {
			this.emitter.on(["before-filtering", "destroy"], () => this.unhighlightAll());
			this.emitter.on(["highlight-keyword"], (tf, cell, term) => this._processTerm(cell, term));
		}
		/**
		* Highlight occurences of searched term in passed node
		* @param  {Node} node
		* @param  {String} term     Searched term
		* @param  {String} cssClass Css class name
		*
		* TODO: refactor this method
		*/
		highlight(node, term, cssClass) {
			if (node.hasChildNodes) {
				let children = node.childNodes;
				for (let i = 0; i < children.length; i++) this.highlight(children[i], term, cssClass);
			}
			if (node.nodeType === 3) {
				let termIdx = node.nodeValue.toLowerCase().indexOf(term.toLowerCase());
				if (termIdx !== -1) {
					let pn = node.parentNode;
					if (pn && pn.className !== cssClass) {
						let nv = node.nodeValue, before = createText(nv.substr(0, termIdx)), value = nv.substr(termIdx, term.length), after = createText(nv.substr(termIdx + term.length)), text = createText(value), container = createElm("span");
						container.className = cssClass;
						container.appendChild(text);
						pn.insertBefore(before, node);
						pn.insertBefore(container, node);
						pn.insertBefore(after, node);
						pn.removeChild(node);
					}
				}
			}
		}
		/**
		* Removes highlight to nodes matching passed string
		* @param  {String} term
		* @param  {String} cssClass Css class to remove
		*/
		unhighlight(term, cssClass) {
			let highlightedNodes = this.tf.dom().querySelectorAll(`.${cssClass}`);
			for (let i = 0; i < highlightedNodes.length; i++) {
				let n = highlightedNodes[i];
				let nodeVal = getText(n);
				if (isNull(term) || nodeVal.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
					let parentNode = n.parentNode;
					parentNode.replaceChild(createText(nodeVal), n);
					parentNode.normalize();
				}
			}
		}
		/**
		* Clear all occurrences of highlighted nodes
		*/
		unhighlightAll() {
			if (!this.tf.highlightKeywords) return;
			this.unhighlight(null, this.highlightCssClass);
		}
		/**  Remove feature */
		destroy() {
			this.emitter.off(["before-filtering", "destroy"], () => this.unhighlightAll());
			this.emitter.off(["highlight-keyword"], (tf, cell, term) => this._processTerm(cell, term));
		}
		/**
		* Ensure filtering operators are handled before highlighting any match
		* @param {any} Table cell to look searched term into
		* @param {any} Searched termIdx
		*/
		_processTerm(cell, term) {
			let tf = this.tf;
			let reLk = new RegExp(rgxEsc(tf.lkOperator));
			let reEq = new RegExp(tf.eqOperator);
			let reSt = new RegExp(tf.stOperator);
			let reEn = new RegExp(tf.enOperator);
			let reLe = new RegExp(tf.leOperator);
			let reGe = new RegExp(tf.geOperator);
			let reL = new RegExp(tf.lwOperator);
			let reG = new RegExp(tf.grOperator);
			let reD = new RegExp(tf.dfOperator);
			term = term.replace(reLk, "").replace(reEq, "").replace(reSt, "").replace(reEn, "");
			if (reLe.test(term) || reGe.test(term) || reL.test(term) || reG.test(term) || reD.test(term)) term = getText(cell);
			if (term === "") return;
			this.highlight(cell, term, this.highlightCssClass);
		}
	};
	HighlightKeyword.meta = {
		name: "highlightKeyword",
		altName: "highlightKeywords"
	};
	//#endregion
	//#region src/modules/popupFilter.js
	/**
	* Pop-up filter component
	* @export
	* @class PopupFilter
	* @extends {Feature}
	*/
	var PopupFilter = class PopupFilter extends Feature {
		/**
		* Creates an instance of PopupFilter
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, PopupFilter);
			let f = this.config.popup_filters || {};
			/**
			* Close active popup filter upon filtering, enabled by default
			* @type {Boolean}
			*/
			this.closeOnFiltering = defaultsBool(f.close_on_filtering, true);
			/**
			* Filter icon path
			* @type {String}
			*/
			this.iconPath = defaultsStr(f.image, tf.themesPath + "icn_filter.gif");
			/**
			* Active filter icon path
			* @type {string}
			*/
			this.activeIconPath = defaultsStr(f.image_active, tf.themesPath + "icn_filterActive.gif");
			/**
			* HTML for the filter icon
			* @type {string}
			*/
			this.iconHtml = defaultsStr(f.image_html, "<img src=\"" + this.iconPath + "\" alt=\"Column filter\" />");
			/**
			* Css class assigned to the popup container element
			* @type {String}
			*/
			this.placeholderCssClass = defaultsStr(f.placeholder_css_class, "popUpPlaceholder");
			/**
			* Css class assigned to filter container element
			* @type {String}
			*/
			this.containerCssClass = defaultsStr(f.div_css_class, "popUpFilter");
			/**
			* Ensure filter's container element width matches column width, enabled
			* by default
			* @type {Boolean}
			*/
			this.adjustToContainer = defaultsBool(f.adjust_to_container, true);
			/**
			* Callback fired before a popup filter is opened
			* @type {Function}
			*/
			this.onBeforeOpen = defaultsFn(f.on_before_popup_filter_open, EMPTY_FN);
			/**
			* Callback fired after a popup filter is opened
			* @type {Function}
			*/
			this.onAfterOpen = defaultsFn(f.on_after_popup_filter_open, EMPTY_FN);
			/**
			* Callback fired before a popup filter is closed
			* @type {Function}
			*/
			this.onBeforeClose = defaultsFn(f.on_before_popup_filter_close, EMPTY_FN);
			/**
			* Callback fired after a popup filter is closed
			* @type {Function}
			*/
			this.onAfterClose = defaultsFn(f.on_after_popup_filter_close, EMPTY_FN);
			/**
			* Collection of filters spans
			* @type {Array}
			* @private
			*/
			this.fltSpans = [];
			/**
			* Collection of filters icons
			* @type {Array}
			* @private
			*/
			this.fltIcons = [];
			/**
			* Collection of filters icons cached after pop-up filters are removed
			* @type {Array}
			* @private
			*/
			this.filtersCache = null;
			/**
			* Collection of filters containers
			* @type {Array}
			* @private
			*/
			this.fltElms = defaultsArr(this.filtersCache, []);
			/**
			* Prefix for pop-up filter container ID
			* @type {String}
			* @private
			*/
			this.prfxDiv = "popup_";
			/**
			* Column index of popup filter currently active
			* @type {Number}
			* @private
			*/
			this.activeFilterIdx = -1;
		}
		/**
		* Click event handler for pop-up filter icon
		* @private
		*/
		onClick(evt) {
			let elm = targetEvt(evt).parentNode;
			let colIndex = parseInt(elm.getAttribute("ci"), 10);
			this.closeAll(colIndex);
			this.toggle(colIndex);
			if (this.adjustToContainer) {
				let cont = this.fltElms[colIndex], headerWidth = this.tf.getHeaderElement(colIndex).clientWidth * .95;
				cont.style.width = parseInt(headerWidth, 10) + "px";
			}
			cancelEvt(evt);
			stopEvt(evt);
		}
		/**
		* Mouse-up event handler handling popup filter auto-close behaviour
		* @private
		*/
		onMouseup(evt) {
			if (this.activeFilterIdx === -1) return;
			let targetElm = targetEvt(evt);
			let activeFlt = this.fltElms[this.activeFilterIdx];
			if (this.fltIcons[this.activeFilterIdx] === targetElm) return;
			while (targetElm && targetElm !== activeFlt) targetElm = targetElm.parentNode;
			if (targetElm !== activeFlt) this.close(this.activeFilterIdx);
		}
		/**
		* Initialize DOM elements
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			tf.externalFltIds = [""];
			tf.filtersRowIndex = 0;
			if (tf.headersRow <= 1 && isNaN(tf.config().headers_row_index)) tf.headersRow = 0;
			if (tf.gridLayout) {
				tf.headersRow--;
				this.buildIcons();
			}
			this.emitter.on(["before-filtering"], () => this.setIconsState());
			this.emitter.on(["after-filtering"], () => this.closeAll());
			this.emitter.on(["cell-processed"], (tf, cellIndex) => this.changeState(cellIndex, true));
			this.emitter.on(["filters-row-inserted"], () => this.buildIcons());
			this.emitter.on(["before-filter-init"], (tf, colIndex) => this.build(colIndex));
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Reset previously destroyed feature
		*/
		reset() {
			this.enable();
			this.init();
			this.buildIcons();
			this.buildAll();
		}
		/**
		* Build all filters icons
		*/
		buildIcons() {
			let tf = this.tf;
			tf.headersRow++;
			tf.eachCol((i) => {
				let icon = createElm("span", ["ci", i]);
				icon.innerHTML = this.iconHtml;
				tf.getHeaderElement(i).appendChild(icon);
				addEvt(icon, "click", (evt) => this.onClick(evt));
				this.fltSpans[i] = icon;
				this.fltIcons[i] = icon.firstChild;
			}, (i) => tf.getFilterType(i) === NONE);
		}
		/**
		* Build all pop-up filters elements
		*/
		buildAll() {
			for (let i = 0; i < this.filtersCache.length; i++) this.build(i, this.filtersCache[i]);
		}
		/**
		* Build a specified pop-up filter elements
		* @param  {Number} colIndex Column index
		* @param  {Object} div      Optional container DOM element
		*/
		build(colIndex, div) {
			let tf = this.tf;
			let contId = `${this.prfxDiv}${tf.id}_${colIndex}`;
			let placeholder = createElm("div", ["class", this.placeholderCssClass]);
			let cont = div || createElm("div", ["id", contId], ["class", this.containerCssClass]);
			tf.externalFltIds[colIndex] = cont.id;
			placeholder.appendChild(cont);
			let header = tf.getHeaderElement(colIndex);
			header.insertBefore(placeholder, header.firstChild);
			addEvt(cont, "click", (evt) => stopEvt(evt));
			this.fltElms[colIndex] = cont;
		}
		/**
		* Toggle visibility of specified filter
		* @param  {Number} colIndex Column index
		*/
		toggle(colIndex) {
			if (!this.isOpen(colIndex)) this.open(colIndex);
			else this.close(colIndex);
		}
		/**
		* Open popup filter of specified column
		* @param {Number} colIndex Column index
		*/
		open(colIndex) {
			let tf = this.tf, container = this.fltElms[colIndex];
			this.onBeforeOpen(this, container, colIndex);
			container.style.display = "block";
			this.activeFilterIdx = colIndex;
			addEvt(root, "mouseup", (evt) => this.onMouseup(evt));
			if (tf.getFilterType(colIndex) === "input") {
				let flt = tf.getFilterElement(colIndex);
				if (flt) flt.focus();
			}
			this.onAfterOpen(this, container, colIndex);
		}
		/**
		* Close popup filter of specified column
		* @param {Number} colIndex Column index
		*/
		close(colIndex) {
			let container = this.fltElms[colIndex];
			this.onBeforeClose(this, container, colIndex);
			container.style.display = NONE;
			if (this.activeFilterIdx === colIndex) this.activeFilterIdx = -1;
			removeEvt(root, "mouseup", (evt) => this.onMouseup(evt));
			this.onAfterClose(this, container, colIndex);
		}
		/**
		* Check if popup filter for specified column is open
		* @param {Number} colIndex Column index
		* @returns {Boolean}
		*/
		isOpen(colIndex) {
			return this.fltElms[colIndex].style.display === "block";
		}
		/**
		* Close all filters excepted for the specified one if any
		* @param  {Number} exceptIdx Column index of the filter to not close
		*/
		closeAll(exceptIdx) {
			if (isUndef(exceptIdx) && !this.closeOnFiltering) return;
			for (let i = 0; i < this.fltElms.length; i++) {
				if (i === exceptIdx) continue;
				let fltType = this.tf.getFilterType(i);
				if (!(fltType === "checklist" || fltType === "multiple") || !isUndef(exceptIdx)) this.close(i);
			}
		}
		/**
		* Build all the icons representing the pop-up filters
		*/
		setIconsState() {
			for (let i = 0; i < this.fltIcons.length; i++) this.changeState(i, false);
		}
		/**
		* Apply specified icon state
		* @param  {Number} colIndex Column index
		* @param  {Boolean} active   Apply active state
		*/
		changeState(colIndex, active) {
			let icon = this.fltIcons[colIndex];
			if (icon) icon.src = active ? this.activeIconPath : this.iconPath;
		}
		/**
		* Remove pop-up filters
		*/
		destroy() {
			if (!this.initialized) return;
			this.filtersCache = [];
			for (let i = 0; i < this.fltElms.length; i++) {
				let container = this.fltElms[i], placeholder = container.parentNode, icon = this.fltSpans[i], iconImg = this.fltIcons[i];
				if (container) {
					removeElm(container);
					this.filtersCache[i] = container;
				}
				container = null;
				if (placeholder) removeElm(placeholder);
				placeholder = null;
				if (icon) removeElm(icon);
				icon = null;
				if (iconImg) removeElm(iconImg);
				iconImg = null;
			}
			this.fltElms = [];
			this.fltSpans = [];
			this.fltIcons = [];
			this.tf.externalFltIds = [];
			this.emitter.off(["before-filtering"], () => this.setIconsState());
			this.emitter.off(["after-filtering"], () => this.closeAll());
			this.emitter.off(["cell-processed"], (tf, cellIndex) => this.changeState(cellIndex, true));
			this.emitter.off(["filters-row-inserted"], () => this.buildIcons());
			this.emitter.off(["before-filter-init"], (tf, colIndex) => this.build(colIndex));
			this.initialized = false;
		}
	};
	PopupFilter.meta = { altName: "popupFilters" };
	//#endregion
	//#region src/modules/markActiveColumns.js
	/**
	* Visual indicator for filtered columns
	* @export
	* @class MarkActiveColumns
	* @extends {Feature}
	*/
	var MarkActiveColumns = class MarkActiveColumns extends Feature {
		/**
		* Create an instance of MarkActiveColumns
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, MarkActiveColumns);
			let config = this.config.mark_active_columns || {};
			/**
			* Css class for filtered (active) columns
			* @type {String}
			*/
			this.headerCssClass = defaultsStr(config.header_css_class, "activeHeader");
			/**
			* Css class for filtered (active) column cells
			* @type {String}
			*/
			this.cellCssClass = defaultsStr(config.cell_css_class, "activeCell");
			/**
			* Enable/disable column highlighting
			* @type {Boolean}
			*/
			this.highlightColumn = Boolean(config.highlight_column);
			/**
			* Callback fired before a column is marked as filtered
			* @type {Function}
			*/
			this.onBeforeActiveColumn = defaultsFn(config.on_before_active_column, EMPTY_FN);
			/**
			* Callback fired after a column is marked as filtered
			* @type {Function}
			*/
			this.onAfterActiveColumn = defaultsFn(config.on_after_active_column, EMPTY_FN);
		}
		/**
		* Initialise MarkActiveColumns instance
		*/
		init() {
			if (this.initialized) return;
			this.emitter.on(["before-filtering"], () => this.clearActiveColumns());
			this.emitter.on(["cell-processed"], (tf, colIndex) => this.markActiveColumn(colIndex));
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Clear filtered columns visual indicator (background color)
		*/
		clearActiveColumns() {
			let tf = this.tf;
			tf.eachCol((idx) => {
				removeClass(tf.getHeaderElement(idx), this.headerCssClass);
				if (this.highlightColumn) this.eachColumnCell(idx, (cell) => removeClass(cell, this.cellCssClass));
			});
		}
		/**
		* Mark currently filtered column
		* @param  {Number} colIndex Column index
		*/
		markActiveColumn(colIndex) {
			let header = this.tf.getHeaderElement(colIndex);
			if (hasClass(header, this.headerCssClass)) return;
			this.onBeforeActiveColumn(this, colIndex);
			addClass(header, this.headerCssClass);
			if (this.highlightColumn) this.eachColumnCell(colIndex, (cell) => addClass(cell, this.cellCssClass));
			this.onAfterActiveColumn(this, colIndex);
		}
		/**
		* Column cells iterator
		* TODO: make public and move into TableFilter if used elsewhere
		* @param {Number} colIndex
		* @param {Function} fn
		* @param {DOMElement} tbl
		* @private
		*/
		eachColumnCell(colIndex, fn = EMPTY_FN, tbl = this.tf.dom()) {
			[].forEach.call(tbl.querySelectorAll(`tbody td:nth-child(${colIndex + 1})`), fn);
		}
		/**
		* Remove feature
		*/
		destroy() {
			if (!this.initialized) return;
			this.clearActiveColumns();
			this.emitter.off(["before-filtering"], () => this.clearActiveColumns());
			this.emitter.off(["cell-processed"], (tf, colIndex) => this.markActiveColumn(colIndex));
			/** @inherited */
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/rowsCounter.js
	/**
	* Rows counter UI component
	* @export
	* @class RowsCounter
	* @extends {Feature}
	*/
	var RowsCounter = class RowsCounter extends Feature {
		/**
		* Creates an instance of RowsCounter
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, RowsCounter);
			let f = this.config.rows_counter || {};
			/**
			* ID of custom container element
			* @type {String}
			*/
			this.targetId = defaultsStr(f.target_id, null);
			/**
			* Container DOM element
			* @type {DOMElement}
			* @private
			*/
			this.container = null;
			/**
			* Container DOM element for label displaying the total number of rows
			* @type {DOMElement}
			* @private
			*/
			this.label = null;
			/**
			* Text preceding the total number of rows
			* @type {String}
			*/
			this.text = defaultsStr(f.text, "Rows: ");
			/**
			* Separator symbol appearing between the first and last visible rows of
			* current page when paging is enabled. ie: Rows: 31-40 / 70
			* @type {String}
			*/
			this.fromToTextSeparator = defaultsStr(f.separator, "-");
			/**
			* Separator symbol appearing between the first and last visible rows of
			* current page and the total number of filterable rows when paging is
			* enabled. ie: Rows: 31-40 / 70
			* @type {String}
			*/
			this.overText = defaultsStr(f.over_text, " / ");
			/**
			* Css class for container element
			* @type {String}
			*/
			this.cssClass = defaultsStr(f.css_class, "tot");
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, LEFT);
			/**
			* Callback fired before the counter is refreshed
			* @type {Function}
			*/
			this.onBeforeRefreshCounter = defaultsFn(f.on_before_refresh_counter, EMPTY_FN);
			/**
			* Callback fired after the counter is refreshed
			* @type {Function}
			*/
			this.onAfterRefreshCounter = defaultsFn(f.on_after_refresh_counter, EMPTY_FN);
		}
		/**
		* Initializes RowsCounter instance
		*/
		init() {
			if (this.initialized) return;
			this.emitter.emit("initializing-feature", this, !isNull(this.targetId));
			let tf = this.tf;
			const targetEl = !this.targetId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.targetId);
			if (typeof customElements !== "undefined" && customElements.get("tf-rows-counter")) this.initCE(targetEl);
			else this.initLegacy(targetEl);
			this.emitter.on(["after-filtering", "grouped-by-page"], () => this.refresh(tf.getValidRowsNb()));
			this.emitter.on(["rows-changed"], () => this.refresh());
			/** @inherited */
			this.initialized = true;
			this.refresh();
			this.emitter.emit("feature-initialized", this);
		}
		/**
		* Initialize using the <tf-rows-counter> custom element
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initCE(targetEl) {
			const countEl = document.createElement("tf-rows-counter");
			countEl.className = this.cssClass;
			if (this.text) countEl.setAttribute("text", this.text);
			targetEl.appendChild(countEl);
			this.container = countEl;
			this.label = countEl.shadowRoot.querySelector("[part=count]");
		}
		/**
		* Initialize using the legacy div/span structure
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initLegacy(targetEl) {
			const countDiv = createElm("div");
			countDiv.className = this.cssClass;
			const countText = createElm("span");
			countText.appendChild(createText(this.text));
			const countSpan = createElm("span");
			countDiv.appendChild(countText);
			countDiv.appendChild(countSpan);
			targetEl.appendChild(countDiv);
			this.container = countDiv;
			this.label = countSpan;
		}
		/**
		* Refreshes the rows counter
		* @param {Number} p Optional parameter the total number of rows to display
		*/
		refresh(p) {
			if (!this.initialized || !this.isEnabled()) return;
			let tf = this.tf;
			this.onBeforeRefreshCounter(tf, this.label);
			let totTxt;
			if (!tf.paging) {
				if (p && p !== "") totTxt = p;
				else totTxt = tf.getFilterableRowsNb() - tf.nbHiddenRows;
			} else {
				let paging = tf.feature("paging");
				if (paging) {
					let nbValidRows = tf.getValidRowsNb();
					let pagingStartRow = parseInt(paging.startPagingRow, 10) + (nbValidRows > 0 ? 1 : 0);
					let pagingEndRow = pagingStartRow + paging.pageLength - 1 <= nbValidRows ? pagingStartRow + paging.pageLength - 1 : nbValidRows;
					totTxt = pagingStartRow + this.fromToTextSeparator + pagingEndRow + this.overText + nbValidRows;
				}
			}
			this.label.innerHTML = totTxt;
			this.onAfterRefreshCounter(tf, this.label, totTxt);
		}
		/**
		* Remove feature
		*/
		destroy() {
			if (!this.initialized) return;
			removeElm(this.container);
			this.label = null;
			this.container = null;
			this.emitter.off(["after-filtering", "grouped-by-page"], () => this.refresh(tf.getValidRowsNb()));
			this.emitter.off(["rows-changed"], () => this.refresh());
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/statusBar.js
	var EVENTS = [
		"after-filtering",
		"after-populating-filter",
		"after-page-change",
		"after-clearing-filters",
		"after-page-length-change",
		"after-reset-page",
		"after-reset-page-length",
		"after-loading-extensions",
		"after-loading-themes"
	];
	/**
	* Status bar UI component
	* @export
	* @class StatusBar
	* @extends {Feature}
	*/
	var StatusBar = class StatusBar extends Feature {
		/**
		* Creates an instance of StatusBar
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, StatusBar);
			let f = this.config.status_bar || {};
			/**
			* ID of custom container element
			* @type {String}
			*/
			this.targetId = defaultsStr(f.target_id, null);
			/**
			* Container DOM element
			* @type {DOMElement}
			* @private
			*/
			this.container = null;
			/**
			* Message container DOM element
			* @type {DOMElement}
			* @private
			*/
			this.msgContainer = null;
			/**
			* Label container DOM element
			* @type {DOMElement}
			* @private
			*/
			this.labelContainer = null;
			/**
			* Text preceding status message
			* @type {String}
			*/
			this.text = defaultsStr(f.text, "");
			/**
			* Css class for container element
			* @type {String}
			*/
			this.cssClass = defaultsStr(f.css_class, "status");
			/**
			* Message visibility duration in milliseconds
			* @type {Number}
			* @private
			*/
			this.delay = 250;
			/**
			* Callback fired before the message is displayed
			* @type {Function}
			*/
			this.onBeforeShowMsg = defaultsFn(f.on_before_show_msg, EMPTY_FN);
			/**
			* Callback fired after the message is displayed
			* @type {Function}
			*/
			this.onAfterShowMsg = defaultsFn(f.on_after_show_msg, EMPTY_FN);
			/**
			* Message appearing upon filtering
			* @type {String}
			*/
			this.msgFilter = defaultsStr(f.msg_filter, "Filtering data...");
			/**
			* Message appearing when a drop-down filter is populated
			* @type {String}
			*/
			this.msgPopulate = defaultsStr(f.msg_populate, "Populating filter...");
			/**
			* Message appearing when a checklist filter is populated
			* @type {String}
			*/
			this.msgPopulateCheckList = defaultsStr(f.msg_populate_checklist, "Populating list...");
			/**
			* Message appearing when a pagination page is changed
			* @type {String}
			*/
			this.msgChangePage = defaultsStr(f.msg_change_page, "Collecting paging data...");
			/**
			* Message appearing when filters are cleared
			* @type {String}
			*/
			this.msgClear = defaultsStr(f.msg_clear, "Clearing filters...");
			/**
			* Message appearing when the page length is changed
			* @type {String}
			*/
			this.msgChangeResults = defaultsStr(f.msg_change_results, "Changing results per page...");
			/**
			* Message appearing when the page is re-set
			* @type {String}
			*/
			this.msgResetPage = defaultsStr(f.msg_reset_page, "Re-setting page...");
			/**
			* Message appearing when the page length is re-set
			* @type {String}
			*/
			this.msgResetPageLength = defaultsStr(f.msg_reset_page_length, "Re-setting page length...");
			/**
			* Message appearing upon column sorting
			* @type {String}
			*/
			this.msgSort = defaultsStr(f.msg_sort, "Sorting data...");
			/**
			* Message appearing when extensions are loading
			* @type {String}
			*/
			this.msgLoadExtensions = defaultsStr(f.msg_load_extensions, "Loading extensions...");
			/**
			* Message appearing when themes are loading
			* @type {String}
			*/
			this.msgLoadThemes = defaultsStr(f.msg_load_themes, "Loading theme(s)...");
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, LEFT);
		}
		/**
		* Initializes StatusBar instance
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			let emitter = this.emitter;
			emitter.emit("initializing-feature", this, !isNull(this.targetId));
			const targetEl = !this.targetId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.targetId);
			if (typeof customElements !== "undefined" && customElements.get("tf-status")) this.initCE(targetEl);
			else this.initLegacy(targetEl);
			emitter.on(["before-filtering"], () => this.message(this.msgFilter));
			emitter.on(["before-populating-filter"], () => this.message(this.msgPopulate));
			emitter.on(["before-page-change"], () => this.message(this.msgChangePage));
			emitter.on(["before-clearing-filters"], () => this.message(this.msgClear));
			emitter.on(["before-page-length-change"], () => this.message(this.msgChangeResults));
			emitter.on(["before-reset-page"], () => this.message(this.msgResetPage));
			emitter.on(["before-reset-page-length"], () => this.message(this.msgResetPageLength));
			emitter.on(["before-loading-extensions"], () => this.message(this.msgLoadExtensions));
			emitter.on(["before-loading-themes"], () => this.message(this.msgLoadThemes));
			emitter.on(EVENTS, () => this.message(""));
			/** @inherited */
			this.initialized = true;
			emitter.emit("feature-initialized", this);
		}
		/**
		* Initialize using the <tf-status> custom element
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initCE(targetEl) {
			const statusEl = document.createElement("tf-status");
			statusEl.className = this.cssClass;
			if (this.text) statusEl.setAttribute("text", this.text);
			targetEl.appendChild(statusEl);
			this.container = statusEl;
			this.statusEl = statusEl;
			this.msgContainer = statusEl.shadowRoot.querySelector("[part=message]");
			this.labelContainer = statusEl.shadowRoot.querySelector("[part=label]");
		}
		/**
		* Initialize using the legacy div/span structure
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initLegacy(targetEl) {
			const statusDiv = createElm("div");
			statusDiv.className = this.cssClass;
			const msgSpan = createElm("span");
			const labelSpan = createElm("span");
			labelSpan.appendChild(createText(this.text));
			statusDiv.appendChild(labelSpan);
			statusDiv.appendChild(msgSpan);
			targetEl.appendChild(statusDiv);
			this.container = statusDiv;
			this.statusEl = statusDiv;
			this.msgContainer = msgSpan;
			this.labelContainer = labelSpan;
		}
		/**
		* Display status message
		* @param {String} [t=''] Message to be displayed
		*/
		message(t = "") {
			if (!this.isEnabled()) return;
			this.onBeforeShowMsg(this.tf, t);
			let d = t === "" ? this.delay : 1;
			root.setTimeout(() => {
				if (!this.initialized) return;
				if (this.statusEl.setMessage) this.statusEl.setMessage(t);
				else this.msgContainer.innerHTML = t;
				this.onAfterShowMsg(this.tf, t);
			}, d);
		}
		/**
		* Destroy StatusBar instance
		*/
		destroy() {
			if (!this.initialized) return;
			let emitter = this.emitter;
			removeElm(this.container);
			this.statusEl = null;
			this.msgContainer = null;
			this.labelContainer = null;
			this.container = null;
			emitter.off(["before-filtering"], () => this.message(this.msgFilter));
			emitter.off(["before-populating-filter"], () => this.message(this.msgPopulate));
			emitter.off(["before-page-change"], () => this.message(this.msgChangePage));
			emitter.off(["before-clearing-filters"], () => this.message(this.msgClear));
			emitter.off(["before-page-length-change"], () => this.message(this.msgChangeResults));
			emitter.off(["before-reset-page"], () => this.message(this.msgResetPage));
			emitter.off(["before-reset-page-length"], () => this.message(this.msgResetPageLength));
			emitter.off(["before-loading-extensions"], () => this.message(this.msgLoadExtensions));
			emitter.off(["before-loading-themes"], () => this.message(this.msgLoadThemes));
			emitter.off(EVENTS, () => this.message(""));
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/clearButton.js
	/**
	* Clear button UI component
	*/
	var ClearButton = class ClearButton extends Feature {
		/**
		* Creates an instance of ClearButton
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, ClearButton);
			let f = this.config.btn_reset || {};
			/**
			* Container element ID
			* @type {String}
			*/
			this.targetId = defaultsStr(f.target_id, null);
			/**
			* Text for the clear button
			* @type {String}
			*/
			this.text = defaultsStr(f.text, null);
			/**
			* Css class for reset button
			* @type {String}
			*/
			this.cssClass = defaultsStr(f.css_class, "reset");
			/**
			* Tooltip text for the clear button
			* @type {String}
			*/
			this.tooltip = f.tooltip || "Clear filters";
			/**
			* Custom Html string for the clear button
			* @type {String}
			*/
			this.html = defaultsStr(f.html, !tf.enableIcons || this.text ? null : "<input type=\"button\" value=\"\" class=\"" + this.cssClass + "\" title=\"" + this.tooltip + "\" />");
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, RIGHT);
			/**
			* Clear button container element
			* @type {DOMElement}
			* @private
			*/
			this.container = null;
			/**
			* Clear button element
			* @type {DOMElement}
			* @private
			*/
			this.element = null;
		}
		/**
		* Click event handler for clear button
		* @private
		*/
		onClick() {
			if (!this.isEnabled()) return;
			this.tf.clearFilters();
		}
		/**
		* Initialize clear button component
		*/
		init() {
			let tf = this.tf;
			if (this.initialized) return;
			this.emitter.emit("initializing-feature", this, !isNull(this.targetId));
			const targetEl = !this.targetId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.targetId);
			if (typeof customElements !== "undefined" && customElements.get("tf-clear-button") && !this.html) this.initCE(targetEl);
			else this.initLegacy(targetEl);
			/** @inherited */
			this.initialized = true;
			this.emitter.emit("feature-initialized", this);
		}
		/**
		* Initialize using the <tf-clear-button> custom element
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initCE(targetEl) {
			let cont = document.createElement("tf-clear-button");
			cont.className = this.cssClass;
			if (this.text) cont.setAttribute("text", this.text);
			if (this.tooltip) {
				cont.setAttribute("label", this.tooltip);
				cont.setAttribute("title", this.tooltip);
			}
			targetEl.appendChild(cont);
			let resetEl = cont.shadowRoot ? cont.shadowRoot.querySelector("button") : null;
			if (!resetEl) resetEl = cont;
			if (resetEl) addEvt(resetEl, "click", () => this.onClick());
			this.element = resetEl;
			this.container = cont;
		}
		/**
		* Initialize using the legacy span/input|a structure
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initLegacy(targetEl) {
			let cont = createElm("span");
			targetEl.appendChild(cont);
			if (!this.html) {
				let fltReset = createElm("a", ["href", "javascript:void(0);"]);
				fltReset.className = this.cssClass;
				fltReset.appendChild(createText(this.text));
				cont.appendChild(fltReset);
				addEvt(fltReset, "click", () => this.onClick());
			} else {
				cont.innerHTML = this.html;
				let resetElLegacy = cont.firstChild;
				addEvt(resetElLegacy, "click", () => this.onClick());
			}
			this.element = cont.firstChild;
			this.container = cont;
		}
		/**
		* Destroy ClearButton instance
		*/
		destroy() {
			if (!this.initialized) return;
			removeElm(this.container);
			this.element = null;
			this.container = null;
			this.initialized = false;
		}
	};
	ClearButton.meta = { altName: "btnReset" };
	//#endregion
	//#region src/modules/alternateRows.js
	/**
	* Rows with alternating background color for improved readability
	*/
	var AlternateRows = class AlternateRows extends Feature {
		/**
		* Creates an instance of AlternateRows.
		*
		* @param {Object} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, AlternateRows);
			let config = this.config;
			/**
			* Css class for even rows (default: 'even')
			* @type {String}
			*/
			this.evenCss = defaultsStr(config.even_row_css_class, "even");
			/**
			* Css class for odd rows (default: 'odd')
			* @type {String}
			*/
			this.oddCss = defaultsStr(config.odd_row_css_class, "odd");
		}
		/**
		* Sets alternating rows color
		*/
		init() {
			if (this.initialized) return;
			this.processAll();
			this.emitter.on(["row-processed", "row-paged"], bound(this.processRowHandler, this));
			this.emitter.on(["column-sorted", "rows-changed"], bound(this.processAll, this));
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Apply background to all valid rows
		*/
		processAll() {
			if (!this.isEnabled()) return;
			let validRowsIndex = this.tf.getValidRows(true);
			let indexLen = validRowsIndex.length;
			let idx = 0;
			for (let j = 0; j < indexLen; j++) {
				let rowIdx = validRowsIndex[j];
				this.setRowBg(rowIdx, idx);
				idx++;
			}
		}
		/**
		* Set/remove row background based on row validation
		* @param  {Number}  rowIdx  Row index
		* @param  {Number}  arrIdx  Array index
		* @param  {Boolean} isValid Valid row flag
		*/
		processRow(rowIdx, arrIdx, isValid) {
			if (isValid) this.setRowBg(rowIdx, arrIdx);
			else this.removeRowBg(rowIdx);
		}
		/**
		* Sets row background color
		* @param {Number} rowIdx Row index
		* @param {Number} idx    Valid rows collection index needed to calculate bg
		* color
		* @private
		*/
		setRowBg(rowIdx, idx) {
			if (!this.isEnabled() || isNaN(rowIdx)) return;
			let rows = this.tf.dom().rows;
			let i = isNaN(idx) ? rowIdx : idx;
			this.removeRowBg(rowIdx);
			addClass(rows[rowIdx], i % 2 ? this.evenCss : this.oddCss);
		}
		/**
		* Removes row background color
		* @param  {Number} idx Row index
		* @private
		*/
		removeRowBg(idx) {
			if (isNaN(idx)) return;
			let rows = this.tf.dom().rows;
			removeClass(rows[idx], this.oddCss);
			removeClass(rows[idx], this.evenCss);
		}
		/** @private */
		processRowHandler(tf, rowIndex, arrIndex, isValid) {
			this.processRow(rowIndex, arrIndex, isValid);
		}
		/**
		* Removes all alternating backgrounds
		*/
		destroy() {
			if (!this.initialized) return;
			this.tf.eachRow(0)((row, i) => this.removeRowBg(i));
			this.emitter.off(["row-processed", "row-paged"], bound(this.processRowHandler, this));
			this.emitter.off(["column-sorted", "rows-changed"], bound(this.processAll, this));
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/noResults.js
	/**
	* UI when filtering yields no matches
	* @export
	* @class NoResults
	* @extends {Feature}
	*/
	var NoResults = class NoResults extends Feature {
		/**
		* Creates an instance of NoResults
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, NoResults);
			let f = this.config.no_results_message || {};
			/**
			* Text (accepts HTML)
			* @type {String}
			*/
			this.content = defaultsStr(f.content, "No results");
			/**
			* Custom container DOM element
			* @type {DOMElement}
			*/
			this.customContainer = defaultsStr(f.custom_container, null);
			/**
			* ID of custom container element
			* @type {String}
			*/
			this.customContainerId = defaultsStr(f.custom_container_id, null);
			/**
			* Indicates if UI is contained in a external element
			* @type {Boolean}
			* @private
			*/
			this.isExternal = !isEmpty(this.customContainer) || !isEmpty(this.customContainerId);
			/**
			* Css class assigned to container element
			* @type {String}
			*/
			this.cssClass = defaultsStr(f.css_class, "no-results");
			/**
			* Stores container DOM element
			* @type {DOMElement}
			*/
			this.cont = null;
			/**
			* Callback fired before the message is displayed
			* @type {Function}
			*/
			this.onBeforeShow = defaultsFn(f.on_before_show_msg, EMPTY_FN);
			/**
			* Callback fired after the message is displayed
			* @type {Function}
			*/
			this.onAfterShow = defaultsFn(f.on_after_show_msg, EMPTY_FN);
			/**
			* Callback fired before the message is hidden
			* @type {Function}
			*/
			this.onBeforeHide = defaultsFn(f.on_before_hide_msg, EMPTY_FN);
			/**
			* Callback fired after the message is hidden
			* @type {Function}
			*/
			this.onAfterHide = defaultsFn(f.on_after_hide_msg, EMPTY_FN);
		}
		/**
		* Initializes NoResults instance
		*/
		init() {
			if (this.initialized) return;
			let tf = this.tf;
			let target = this.customContainer || elm(this.customContainerId) || tf.dom();
			let cont = createElm("div");
			cont.className = this.cssClass;
			cont.innerHTML = this.content;
			if (this.isExternal) target.appendChild(cont);
			else target.parentNode.insertBefore(cont, target.nextSibling);
			this.cont = cont;
			this.emitter.on(["initialized", "after-filtering"], () => this.toggle());
			/** @inherited */
			this.initialized = true;
		}
		/**
		* Toggle no results message
		*/
		toggle() {
			if (this.tf.getValidRowsNb() > 0) this.hide();
			else this.show();
		}
		/**
		* Show no results message
		*/
		show() {
			if (!this.initialized || !this.isEnabled()) return;
			this.onBeforeShow(this.tf, this);
			this.setWidth();
			this.cont.style.display = "block";
			this.onAfterShow(this.tf, this);
		}
		/**
		* Hide no results message
		*/
		hide() {
			if (!this.initialized || !this.isEnabled()) return;
			this.onBeforeHide(this.tf, this);
			this.cont.style.display = NONE;
			this.onAfterHide(this.tf, this);
		}
		/**
		* Sets no results container width
		* @private
		*/
		setWidth() {
			if (!this.initialized || this.isExternal || !this.isEnabled()) return;
			let tf = this.tf;
			if (tf.gridLayout) {
				let gridLayout = tf.feature("gridLayout");
				this.cont.style.width = gridLayout.headTbl.clientWidth + "px";
			} else this.cont.style.width = (tf.dom().tHead ? tf.dom().tHead.clientWidth : tf.dom().tBodies[0].clientWidth) + "px";
		}
		/** Remove feature */
		destroy() {
			if (!this.initialized) return;
			removeElm(this.cont);
			this.cont = null;
			this.emitter.off(["after-filtering"], () => this.toggle());
			this.initialized = false;
		}
	};
	//#endregion
	//#region src/modules/paging.js
	/**
	* Paging UI component
	* @export
	* @class Paging
	* @extends {Feature}
	*/
	var Paging = class Paging extends Feature {
		/**
		* Creates an instance of Paging
		* @param {TableFilter} tf TableFilter instance
		*/
		constructor(tf) {
			super(tf, Paging);
			let f = this.config.paging || {};
			/**
			* Css class for the paging buttons (previous, next, etc.)
			* @type {String}
			*/
			this.btnCssClass = defaultsStr(f.btn_css_class, "pgInp");
			/**
			* Main select DOM element
			* @type {DOMElement}
			*/
			this.pageSlc = null;
			/**
			* Results per page select DOM element
			* @type {DOMElement}
			*/
			this.pageLengthSlc = null;
			/**
			* ID of custom container element
			* @type {String}
			*/
			this.tgtId = defaultsStr(f.target_id, null);
			/**
			* Number of rows contained in a page
			* @type {Number}
			*/
			this.pageLength = defaultsNb(f.length, 10);
			/**
			* ID of custom container element for the results per page selector
			* @type {String}
			*/
			this.pageLengthTgtId = defaultsStr(f.results_per_page_target_id, null);
			/**
			* Css class for the paging select element
			* @type {String}
			*/
			this.pgSlcCssClass = defaultsStr(f.slc_css_class, "pgSlc");
			/**
			* Css class for the paging input element
			* @type {String}
			*/
			this.pgInpCssClass = defaultsStr(f.inp_css_class, "pgNbInp");
			/**
			* Label and values for the results per page select, example of usage:
			* ['Records: ', [10,25,50,100]]
			* @type {Array}
			*/
			this.resultsPerPage = defaultsArr(f.results_per_page, null);
			/**
			* Determines if results per page is configured
			* @type {Boolean}
			*/
			this.hasResultsPerPage = isArray(this.resultsPerPage);
			/**
			* Css class for the results per page select
			* @type {String}
			*/
			this.resultsSlcCssClass = defaultsStr(f.results_slc_css_class, "rspg");
			/**
			* Css class for the label preceding results per page select
			* @type {String}
			*/
			this.resultsSpanCssClass = defaultsStr(f.results_span_css_class, "rspgSpan");
			/**
			* Index of the first row of current page
			* @type {Number}
			* @private
			*/
			this.startPagingRow = 0;
			/**
			* Total number of pages
			* @type {Number}
			* @private
			*/
			this.nbPages = 0;
			/**
			* Current page number
			* @type {Number}
			* @private
			*/
			this.currentPageNb = 1;
			/**
			* Next page button text
			* @type {String}
			*/
			this.btnNextPageText = defaultsStr(f.btn_next_page_text, ">");
			/**
			* Previous page button text
			* @type {String}
			*/
			this.btnPrevPageText = defaultsStr(f.btn_prev_page_text, "<");
			/**
			* Last page button text
			* @type {String}
			*/
			this.btnLastPageText = defaultsStr(f.btn_last_page_text, ">|");
			/**
			* First page button text
			* @type {String}
			*/
			this.btnFirstPageText = defaultsStr(f.btn_first_page_text, "|<");
			/**
			* Next page button HTML
			* @type {String}
			*/
			this.btnNextPageHtml = defaultsStr(f.btn_next_page_html, !tf.enableIcons ? null : "<input type=\"button\" value=\"\" class=\"" + this.btnCssClass + " nextPage\" title=\"Next page\" />");
			/**
			* Previous page button HTML
			* @type {String}
			*/
			this.btnPrevPageHtml = defaultsStr(f.btn_prev_page_html, !tf.enableIcons ? null : "<input type=\"button\" value=\"\" class=\"" + this.btnCssClass + " previousPage\" title=\"Previous page\" />");
			/**
			* First page button HTML
			* @type {String}
			*/
			this.btnFirstPageHtml = defaultsStr(f.btn_first_page_html, !tf.enableIcons ? null : "<input type=\"button\" value=\"\" class=\"" + this.btnCssClass + " firstPage\" title=\"First page\" />");
			/**
			* Last page button HTML
			* @type {String}
			*/
			this.btnLastPageHtml = defaultsStr(f.btn_last_page_html, !tf.enableIcons ? null : "<input type=\"button\" value=\"\" class=\"" + this.btnCssClass + " lastPage\" title=\"Last page\" />");
			/**
			* Text preceeding page selector drop-down
			* @type {String}
			*/
			this.pageText = defaultsStr(f.page_text, " Page ");
			/**
			* Text after page selector drop-down
			* @type {String}
			*/
			this.ofText = defaultsStr(f.of_text, " of ");
			/**
			* Css class for the span containing total number of pages
			* @type {String}
			*/
			this.nbPgSpanCssClass = defaultsStr(f.nb_pages_css_class, "nbpg");
			/**
			* Determines if paging buttons are enabled (default: true)
			* @type {Boolean}
			*/
			this.hasBtns = defaultsBool(f.btns, true);
			/**
			* Defines page selector type, two possible values: 'select', 'input'
			* @type {String}
			*/
			this.pageSelectorType = defaultsStr(f.page_selector_type, SELECT);
			/**
			* Default position in toolbar ('left'|'center'|'right')
			* @type {String}
			*/
			this.toolbarPosition = defaultsStr(f.toolbar_position, CENTER);
			/**
			* Callback fired before the page is changed
			* @type {Function}
			*/
			this.onBeforeChangePage = defaultsFn(f.on_before_change_page, EMPTY_FN);
			/**
			* Callback fired after the page is changed
			* @type {Function}
			*/
			this.onAfterChangePage = defaultsFn(f.on_after_change_page, EMPTY_FN);
			/**
			* Label preciding results per page select
			* @type {DOMElement}
			* @private
			*/
			this.slcResultsTxt = null;
			/**
			* Span containing next page button
			* @type {DOMElement}
			* @private
			*/
			this.btnNextCont = null;
			/**
			* Span containing previous page button
			* @type {DOMElement}
			* @private
			*/
			this.btnPrevCont = null;
			/**
			* Span containing last page button
			* @type {DOMElement}
			* @private
			*/
			this.btnLastCont = null;
			/**
			* Span containing first page button
			* @type {DOMElement}
			* @private
			*/
			this.btnFirstCont = null;
			/**
			* Span for tot nb pages
			* @type {DOMElement}
			* @private
			*/
			this.pgCont = null;
			/**
			* Span preceding pages select (contains 'Page')
			* @type {DOMElement}
			* @private
			*/
			this.pgBefore = null;
			/**
			* Span following pages select (contains ' of ')
			* @type {DOMElement}
			* @private
			*/
			this.pgAfter = null;
			/**
			* <tf-pager> custom element host, when the bridge is active
			* @type {DOMElement}
			* @private
			*/
			this.pagerEl = null;
			let startRow = tf.refRow;
			let nrows = tf.getRowsNb(true);
			this.nbPages = Math.ceil((nrows - startRow) / this.pageLength);
			let o = this;
			/**
			* Paging DOM events handlers
			* @type {String}
			* @private
			*/
			this.evt = {
				slcIndex() {
					return o.pageSelectorType === "select" ? o.pageSlc.options.selectedIndex : parseInt(o.pageSlc.value, 10) - 1;
				},
				nbOpts() {
					return o.pageSelectorType === "select" ? parseInt(o.pageSlc.options.length, 10) - 1 : o.nbPages - 1;
				},
				next() {
					let nextIndex = o.evt.slcIndex() < o.evt.nbOpts() ? o.evt.slcIndex() + 1 : 0;
					o.changePage(nextIndex);
				},
				prev() {
					let prevIndex = o.evt.slcIndex() > 0 ? o.evt.slcIndex() - 1 : o.evt.nbOpts();
					o.changePage(prevIndex);
				},
				last() {
					o.changePage(o.evt.nbOpts());
				},
				first() {
					o.changePage(0);
				},
				_detectKey(e) {
					if (isKeyPressed(e, [13])) {
						if (tf.sorted) {
							tf.filter();
							o.changePage(o.evt.slcIndex());
						} else o.changePage();
						this.blur();
					}
				},
				slcPagesChange: null,
				pagerPageChange: null,
				nextEvt: null,
				prevEvt: null,
				lastEvt: null,
				firstEvt: null
			};
		}
		/**
		* Initialize DOM elements
		*/
		init() {
			let tf = this.tf;
			if (this.initialized) return;
			this.emitter.emit("initializing-feature", this, !isNull(this.tgtId));
			if (this.hasResultsPerPage) {
				if (this.resultsPerPage.length < 2) this.hasResultsPerPage = false;
				else {
					this.pageLength = this.resultsPerPage[1][0];
					this.setResultsPerPage();
				}
			}
			let targetEl = !this.tgtId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.tgtId);
			if (typeof customElements !== "undefined" && customElements.get("tf-pager") && !tf.enableIcons && !this.hasBtnHtml()) this.initCE(targetEl);
			else this.initLegacy(targetEl);
			this.setPagingInfo();
			if (!tf.fltGrid) {
				tf.validateAllRows();
				this.setPagingInfo(tf.validRowsIndex);
			}
			this.emitter.on(["after-filtering"], bound(this.resetPagingInfo, this));
			this.emitter.on(["change-page"], bound(this.changePageHandler, this));
			this.emitter.on(["change-page-results"], bound(this.changePageResultsHandler, this));
			/** @inherited */
			this.initialized = true;
			this.emitter.emit("feature-initialized", this);
		}
		/**
		* Initialize using the <tf-pager> custom element
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initCE(targetEl) {
			let evt = this.evt;
			let tf = this.tf;
			let pagerEl = document.createElement("tf-pager");
			pagerEl.className = this.pgCssClass();
			pagerEl.setAttribute("selector-type", this.pageSelectorType);
			pagerEl.setAttribute("page-text", this.pageText);
			pagerEl.setAttribute("of-text", this.ofText);
			if (!this.hasBtns) pagerEl.setAttribute("buttons", "false");
			this.setPagerButtons(pagerEl);
			if (!this.isEnabled()) pagerEl.setAttribute("disabled", "");
			targetEl.appendChild(pagerEl);
			this.pagerEl = pagerEl;
			this.pageSlc = pagerEl.shadowRoot.querySelector(this.pageSelectorType === "input" ? "[part=\"page-input\"]" : "[part=\"page-select\"]");
			this.bindPagerButton("first", evt.first);
			this.bindPagerButton("prev", evt.prev);
			this.bindPagerButton("next", evt.next);
			this.bindPagerButton("last", evt.last);
			evt.pagerPageChange = (event) => {
				let page = parseInt(event.detail.page, 10);
				if (isNaN(page)) return;
				if (this.pageSelectorType === "input" && tf.sorted) tf.filter();
				this.changePage(page - 1);
			};
			addEvt(pagerEl, "page-change", evt.pagerPageChange);
		}
		/**
		* Initialize using the legacy spans, controls and select
		* @param {DOMElement} targetEl Target container element
		* @private
		*/
		initLegacy(targetEl) {
			let slcPages;
			let evt = this.evt;
			evt.slcPagesChange = (event) => {
				let slc = event.target;
				this.changePage(slc.selectedIndex);
			};
			if (this.pageSelectorType === "select") {
				slcPages = createElm(SELECT);
				slcPages.className = this.pgSlcCssClass;
				addEvt(slcPages, "change", evt.slcPagesChange);
			}
			if (this.pageSelectorType === "input") {
				slcPages = createElm(INPUT, ["value", this.currentPageNb]);
				slcPages.className = this.pgInpCssClass;
				addEvt(slcPages, "keypress", evt._detectKey);
			}
			let btnNextSpan = createElm("span");
			let btnPrevSpan = createElm("span");
			let btnLastSpan = createElm("span");
			let btnFirstSpan = createElm("span");
			if (this.hasBtns) {
				if (!this.btnNextPageHtml) {
					let btnNext = createElm(INPUT, ["type", "button"], ["value", this.btnNextPageText], ["title", "Next"]);
					btnNext.className = this.btnCssClass;
					addEvt(btnNext, "click", evt.next);
					btnNextSpan.appendChild(btnNext);
				} else {
					btnNextSpan.innerHTML = this.btnNextPageHtml;
					addEvt(btnNextSpan, "click", evt.next);
				}
				if (!this.btnPrevPageHtml) {
					let btnPrev = createElm(INPUT, ["type", "button"], ["value", this.btnPrevPageText], ["title", "Previous"]);
					btnPrev.className = this.btnCssClass;
					addEvt(btnPrev, "click", evt.prev);
					btnPrevSpan.appendChild(btnPrev);
				} else {
					btnPrevSpan.innerHTML = this.btnPrevPageHtml;
					addEvt(btnPrevSpan, "click", evt.prev);
				}
				if (!this.btnLastPageHtml) {
					let btnLast = createElm(INPUT, ["type", "button"], ["value", this.btnLastPageText], ["title", "Last"]);
					btnLast.className = this.btnCssClass;
					addEvt(btnLast, "click", evt.last);
					btnLastSpan.appendChild(btnLast);
				} else {
					btnLastSpan.innerHTML = this.btnLastPageHtml;
					addEvt(btnLastSpan, "click", evt.last);
				}
				if (!this.btnFirstPageHtml) {
					let btnFirst = createElm(INPUT, ["type", "button"], ["value", this.btnFirstPageText], ["title", "First"]);
					btnFirst.className = this.btnCssClass;
					addEvt(btnFirst, "click", evt.first);
					btnFirstSpan.appendChild(btnFirst);
				} else {
					btnFirstSpan.innerHTML = this.btnFirstPageHtml;
					addEvt(btnFirstSpan, "click", evt.first);
				}
			}
			targetEl.appendChild(btnFirstSpan);
			targetEl.appendChild(btnPrevSpan);
			let pgBeforeSpan = createElm("span");
			pgBeforeSpan.appendChild(createText(this.pageText));
			pgBeforeSpan.className = this.nbPgSpanCssClass;
			targetEl.appendChild(pgBeforeSpan);
			targetEl.appendChild(slcPages);
			let pgAfterSpan = createElm("span");
			pgAfterSpan.appendChild(createText(this.ofText));
			pgAfterSpan.className = this.nbPgSpanCssClass;
			targetEl.appendChild(pgAfterSpan);
			let pgSpan = createElm("span");
			pgSpan.className = this.nbPgSpanCssClass;
			pgSpan.appendChild(createText(" " + this.nbPages + " "));
			targetEl.appendChild(pgSpan);
			targetEl.appendChild(btnNextSpan);
			targetEl.appendChild(btnLastSpan);
			this.btnNextCont = btnNextSpan;
			this.btnPrevCont = btnPrevSpan;
			this.btnLastCont = btnLastSpan;
			this.btnFirstCont = btnFirstSpan;
			this.pgCont = pgSpan;
			this.pgBefore = pgBeforeSpan;
			this.pgAfter = pgAfterSpan;
			this.pageSlc = slcPages;
		}
		/**
		* The legacy paging classes, applied to the <tf-pager> host
		* @return {String} Space-separated class list
		* @private
		*/
		pgCssClass() {
			return [
				this.btnCssClass,
				this.pgSlcCssClass,
				this.pgInpCssClass,
				this.nbPgSpanCssClass
			].join(" ");
		}
		/**
		* Whether a `btn_*_page_html` value is set
		* @return {Boolean} True when any button HTML is configured
		* @private
		*/
		hasBtnHtml() {
			return Boolean(this.btnFirstPageHtml || this.btnPrevPageHtml || this.btnNextPageHtml || this.btnLastPageHtml);
		}
		/**
		* Set the `btn_*_page_text` captions on the <tf-pager> buttons
		* (paging.js:390-444).
		* @param {DOMElement} pagerEl <tf-pager> host
		* @private
		*/
		setPagerButtons(pagerEl) {
			[
				{
					part: "first",
					text: this.btnFirstPageText
				},
				{
					part: "prev",
					text: this.btnPrevPageText
				},
				{
					part: "next",
					text: this.btnNextPageText
				},
				{
					part: "last",
					text: this.btnLastPageText
				}
			].forEach((btn) => {
				pagerEl.setAttribute(`${btn.part}-text`, btn.text);
			});
		}
		/**
		* Bind a paging handler to a <tf-pager> button
		* @param {String} part Button part name
		* @param {Function} handler Paging handler
		* @private
		*/
		bindPagerButton(part, handler) {
			addEvt(this.pagerEl.shadowRoot.querySelector(`[part="${part}"]`), "click", handler);
		}
		/**
		* Remove a paging handler from a <tf-pager> button
		* @param {String} part Button part name
		* @param {Function} handler Paging handler
		* @private
		*/
		unbindPagerButton(part, handler) {
			removeEvt(this.pagerEl.shadowRoot.querySelector(`[part="${part}"]`), "click", handler);
		}
		/**
		* Paging entries shared by the legacy select and <tf-pager>: page
		* number as visible text, start row as value
		* @return {Array<Object>} Page entries
		* @private
		*/
		pageEntries() {
			let entries = [];
			for (let z = 0; z < this.nbPages; z++) entries.push({
				text: String(z + 1),
				value: String(z * this.pageLength)
			});
			return entries;
		}
		/**
		* Reset paging when filters are already instantiated
		* @param {Boolean} filterTable Execute filtering once paging instanciated
		*/
		reset(filterTable = false) {
			this.enable();
			this.init();
			if (filterTable) this.tf.filter();
		}
		/**
		* Reset paging info from scratch after a filtering process
		*/
		resetPagingInfo() {
			this.startPagingRow = 0;
			this.currentPageNb = 1;
			this.setPagingInfo(this.tf.validRowsIndex);
		}
		/**
		* Calculate number of pages based on valid rows
		* Refresh paging select according to number of pages
		* @param {Array} validRows Collection of valid rows
		*/
		setPagingInfo(validRows) {
			let tf = this.tf;
			let cont = !this.tgtId ? tf.feature("toolbar").container(this.toolbarPosition) : elm(this.tgtId);
			tf.validRowsIndex = validRows || tf.getValidRows(true);
			this.nbPages = Math.ceil(tf.validRowsIndex.length / this.pageLength);
			if (this.pagerEl) {
				this.pagerEl.setTotalPages(this.nbPages);
				this.pagerEl.setPages(this.pageEntries());
				this.pagerEl.setPage(this.currentPageNb);
			} else {
				this.pgCont.innerHTML = this.nbPages;
				if (this.pageSelectorType === "select") this.pageSlc.innerHTML = "";
			}
			if (this.nbPages > 0) {
				cont.style.visibility = "visible";
				if (!this.pagerEl) {
					if (this.pageSelectorType === "select") this.pageEntries().forEach((entry, z) => {
						this.pageSlc.options[z] = createOpt(entry.text, entry.value, false);
					});
					else this.pageSlc.value = this.currentPageNb;
				}
			} else
 /*** if no results paging select and buttons are hidden ***/
			cont.style.visibility = "hidden";
			this.groupByPage(tf.validRowsIndex);
		}
		/**
		* Group table rows by page and display valid rows
		* @param  {Array} validRows Collection of valid rows
		*/
		groupByPage(validRows) {
			let tf = this.tf;
			let rows = tf.dom().rows;
			let startPagingRow = parseInt(this.startPagingRow, 10);
			let endPagingRow = startPagingRow + parseInt(this.pageLength, 10);
			if (validRows) tf.validRowsIndex = validRows;
			for (let h = 0, len = tf.getValidRowsNb(true); h < len; h++) {
				let validRowIdx = tf.validRowsIndex[h];
				let r = rows[validRowIdx];
				let isRowValid = r.getAttribute("validRow");
				let rowDisplayed = false;
				if (h >= startPagingRow && h < endPagingRow) {
					if (isNull(isRowValid) || Boolean(isRowValid === "true")) {
						r.style.display = "";
						rowDisplayed = true;
					}
				} else r.style.display = NONE;
				this.emitter.emit("row-paged", tf, validRowIdx, h, rowDisplayed);
			}
			this.emitter.emit("grouped-by-page", tf, this);
		}
		/**
		* Return the current page number
		* @return {Number} Page number
		*/
		getPage() {
			return this.currentPageNb;
		}
		/**
		* Show page defined by passed argument (string or number):
		* @param {String}/{Number} cmd possible string values: 'next',
		*   'previous', 'last', 'first' or page number as per param
		*/
		setPage(cmd) {
			if (!this.tf.isInitialized() || !this.isEnabled()) return;
			let btnEvt = this.evt, cmdtype = typeof cmd;
			if (cmdtype === "string") switch (cmd.toLowerCase()) {
				case "next":
					btnEvt.next();
					break;
				case "previous":
					btnEvt.prev();
					break;
				case "last":
					btnEvt.last();
					break;
				case "first":
					btnEvt.first();
					break;
				default: btnEvt.next();
			}
			else if (cmdtype === "number") this.changePage(cmd - 1);
		}
		/**
		* Generates UI elements for the number of results per page drop-down
		*/
		setResultsPerPage() {
			let tf = this.tf;
			let evt = this.evt;
			if (this.pageLengthSlc || !this.resultsPerPage) return;
			evt.slcResultsChange = (ev) => {
				this.onChangeResultsPerPage();
				ev.target.blur();
			};
			let slcR = createElm(SELECT);
			slcR.className = this.resultsSlcCssClass;
			let slcRText = this.resultsPerPage[0], slcROpts = this.resultsPerPage[1];
			let slcRSpan = createElm("span");
			slcRSpan.className = this.resultsSpanCssClass;
			let targetEl = !this.pageLengthTgtId ? tf.feature("toolbar").container(RIGHT) : elm(this.pageLengthTgtId);
			slcRSpan.appendChild(createText(slcRText));
			let help = tf.feature("help");
			if (help && help.btn) {
				help.btn.parentNode.insertBefore(slcRSpan, help.btn);
				help.btn.parentNode.insertBefore(slcR, help.btn);
			} else {
				targetEl.appendChild(slcRSpan);
				targetEl.appendChild(slcR);
			}
			for (let r = 0; r < slcROpts.length; r++) {
				let currOpt = new Option(slcROpts[r], slcROpts[r], false, false);
				slcR.options[r] = currOpt;
			}
			addEvt(slcR, "change", evt.slcResultsChange);
			this.slcResultsTxt = slcRSpan;
			this.pageLengthSlc = slcR;
		}
		/**
		* Remove number of results per page UI elements
		*/
		removeResultsPerPage() {
			if (!this.tf.isInitialized() || !this.pageLengthSlc || !this.resultsPerPage) return;
			if (this.pageLengthSlc) removeElm(this.pageLengthSlc);
			if (this.slcResultsTxt) removeElm(this.slcResultsTxt);
			this.pageLengthSlc = null;
			this.slcResultsTxt = null;
		}
		/**
		* Change the page based on passed index
		* @param {Number} index Index of the page (0-n)
		*/
		changePage(index) {
			let tf = this.tf;
			if (!this.isEnabled()) return;
			this.emitter.emit("before-page-change", tf, index + 1);
			if (index === null) index = this.pageSelectorType === "select" ? this.pageSlc.options.selectedIndex : this.pageSlc.value - 1;
			if (index >= 0 && index <= this.nbPages - 1) {
				this.onBeforeChangePage(this, index + 1);
				this.currentPageNb = parseInt(index, 10) + 1;
				if (this.pagerEl) this.pagerEl.setPage(this.currentPageNb);
				else if (this.pageSelectorType === "select") this.pageSlc.options[index].selected = true;
				else this.pageSlc.value = this.currentPageNb;
				this.startPagingRow = this.pageSelectorType === "select" ? this.pageSlc.value : index * this.pageLength;
				this.groupByPage();
				this.onAfterChangePage(this, index + 1);
			}
			this.emitter.emit("after-page-change", tf, index + 1);
		}
		/**
		* Change the number of results per page based on passed value
		* @param {String} val The number of results per page
		*/
		changeResultsPerPage(val) {
			if (!this.isEnabled() || isNaN(val)) return;
			this.pageLengthSlc.value = val;
			this.onChangeResultsPerPage();
		}
		/**
		* Change rows according to page results drop-down
		*/
		onChangeResultsPerPage() {
			let tf = this.tf;
			if (!this.isEnabled() || tf.getValidRowsNb() === 0) return;
			let { pageLengthSlc: slcR, pageSelectorType, pageSlc, emitter } = this;
			emitter.emit("before-page-length-change", tf);
			let slcIndex = slcR.selectedIndex;
			let slcPagesSelIndex = pageSelectorType === "select" ? pageSlc.selectedIndex : parseInt(pageSlc.value - 1, 10);
			this.pageLength = parseInt(slcR.options[slcIndex].value, 10);
			this.startPagingRow = this.pageLength * slcPagesSelIndex;
			if (!isNaN(this.pageLength)) {
				if (this.startPagingRow >= tf.nbFilterableRows) this.startPagingRow = tf.nbFilterableRows - this.pageLength;
				this.setPagingInfo();
				if (this.pagerEl) this.pagerEl.setPage(Math.min(slcPagesSelIndex, this.nbPages - 1) + 1);
				else if (pageSelectorType === "select") {
					let slcIdx = pageSlc.options.length - 1 <= slcPagesSelIndex ? pageSlc.options.length - 1 : slcPagesSelIndex;
					pageSlc.options[slcIdx].selected = true;
				}
			}
			emitter.emit("after-page-length-change", tf, this.pageLength);
		}
		/**
		* Re-set page nb at page re-load
		*/
		resetPage() {
			let tf = this.tf;
			if (!this.isEnabled()) return;
			this.emitter.emit("before-reset-page", tf);
			let pgNb = tf.feature("store").getPageNb();
			if (pgNb !== "") this.changePage(pgNb - 1);
			this.emitter.emit("after-reset-page", tf, pgNb);
		}
		/**
		* Re-set page length value at page re-load
		*/
		resetPageLength() {
			let tf = this.tf;
			if (!this.isEnabled()) return;
			this.emitter.emit("before-reset-page-length", tf);
			let pglenIndex = tf.feature("store").getPageLength();
			if (pglenIndex !== "") {
				this.pageLengthSlc.options[pglenIndex].selected = true;
				this.changeResultsPerPage();
			}
			this.emitter.emit("after-reset-page-length", tf, pglenIndex);
		}
		/** @private */
		changePageHandler(tf, pageNumber) {
			this.setPage(pageNumber);
		}
		/** @private */
		changePageResultsHandler(tf, pageLength) {
			this.changeResultsPerPage(pageLength);
		}
		/**
		* Disable paging and reflect the state on the pager element
		*/
		disable() {
			super.disable();
			if (this.pagerEl) this.pagerEl.setAttribute("disabled", "");
		}
		/**
		* Enable paging and reflect the state on the pager element
		*/
		enable() {
			super.enable();
			if (this.pagerEl) this.pagerEl.removeAttribute("disabled");
		}
		/**
		* Remove paging feature
		*/
		destroy() {
			if (!this.initialized) return;
			if (this.pagerEl) this.destroyCE();
			else this.destroyLegacy();
			if (this.hasResultsPerPage) this.removeResultsPerPage();
			this.emitter.off(["after-filtering"], bound(this.resetPagingInfo, this));
			this.emitter.off(["change-page"], bound(this.changePageHandler, this));
			this.emitter.off(["change-page-results"], bound(this.changePageResultsHandler, this));
			this.pageSlc = null;
			this.nbPages = 0;
			this.initialized = false;
		}
		/**
		* Remove the <tf-pager> element and the handlers bound to it
		* @private
		*/
		destroyCE() {
			let evt = this.evt;
			removeEvt(this.pagerEl, "page-change", evt.pagerPageChange);
			this.unbindPagerButton("first", evt.first);
			this.unbindPagerButton("prev", evt.prev);
			this.unbindPagerButton("next", evt.next);
			this.unbindPagerButton("last", evt.last);
			removeElm(this.pagerEl);
			this.pagerEl = null;
		}
		/**
		* Remove the legacy paging controls and the handlers bound to them
		* @private
		*/
		destroyLegacy() {
			let evt = this.evt;
			if (this.pageSlc) {
				if (this.pageSelectorType === "select") removeEvt(this.pageSlc, "change", evt.slcPagesChange);
				else if (this.pageSelectorType === "input") removeEvt(this.pageSlc, "keypress", evt._detectKey);
				removeElm(this.pageSlc);
			}
			if (this.btnNextCont) {
				removeEvt(this.btnNextCont, "click", evt.next);
				removeElm(this.btnNextCont);
				this.btnNextCont = null;
			}
			if (this.btnPrevCont) {
				removeEvt(this.btnPrevCont, "click", evt.prev);
				removeElm(this.btnPrevCont);
				this.btnPrevCont = null;
			}
			if (this.btnLastCont) {
				removeEvt(this.btnLastCont, "click", evt.last);
				removeElm(this.btnLastCont);
				this.btnLastCont = null;
			}
			if (this.btnFirstCont) {
				removeEvt(this.btnFirstCont, "click", evt.first);
				removeElm(this.btnFirstCont);
				this.btnFirstCont = null;
			}
			if (this.pgBefore) {
				removeElm(this.pgBefore);
				this.pgBefore = null;
			}
			if (this.pgAfter) {
				removeElm(this.pgAfter);
				this.pgAfter = null;
			}
			if (this.pgCont) {
				removeElm(this.pgCont);
				this.pgCont = null;
			}
		}
	};
	//#endregion
	//#region src/tablefilter.js
	var __deferInit = (Ctor) => class extends Ctor {
		init() {
			const args = arguments;
			if (this.tf && this.tf.initialized) return Ctor.prototype.init.apply(this, args);
			Promise.resolve().then(() => Ctor.prototype.init.apply(this, args));
		}
	};
	var EXTENSIONS = {
		sort: __deferInit(sort_default),
		colsVisibility: __deferInit(ColsVisibility),
		colOps: __deferInit(ColOps),
		advancedGrid: __deferInit(advancedGrid_default),
		filtersVisibility: __deferInit(FiltersVisibility)
	};
	var doc = root.document;
	var FEATURES = [
		DateType,
		Help,
		State,
		MarkActiveColumns,
		GridLayout,
		Loader,
		HighlightKeyword,
		PopupFilter,
		RowsCounter,
		StatusBar,
		ClearButton,
		AlternateRows,
		NoResults,
		Paging,
		Toolbar
	];
	/**
	* Makes HTML tables filterable and a bit more :)
	*
	* @export
	* @class TableFilter
	*/
	var TableFilter = class {
		/**
		* Creates an instance of TableFilter
		* requires `table` or `id` arguments, `row` and `configuration` optional
		* @param {HTMLTableElement} table Table DOM element
		* @param {String} id Table id
		* @param {Number} row index indicating the 1st row
		* @param {Object} configuration object
		*/
		constructor(...args) {
			/**
			* ID of current instance
			* @type {String}
			* @private
			*/
			this.id = null;
			/**
			* Current version
			* @type {String}
			*/
			this.version = "0.7.8";
			/**
			* Current year
			* @type {Number}
			* @private
			*/
			this.year = (/* @__PURE__ */ new Date()).getFullYear();
			/**
			* HTML Table DOM element
			* @type {DOMElement}
			* @private
			*/
			this.tbl = null;
			/**
			* Calculated row's index from which starts filtering once filters
			* are generated
			* @type {Number}
			*/
			this.refRow = null;
			/**
			* Index of the headers row
			* @type {Number}
			* @private
			*/
			this.headersRow = null;
			/**
			* Configuration object
			* @type {Object}
			* @private
			*/
			this.cfg = {};
			/**
			* Number of rows that can be filtered
			* @type {Number}
			* @private
			*/
			this.nbFilterableRows = 0;
			/**
			* Number of cells in the reference row
			* @type {Number}
			* @private
			*/
			this.nbCells = null;
			/**
			* Has a configuration object
			* @type {Object}
			* @private
			*/
			this.hasConfig = false;
			/** @private */
			this.initialized = false;
			let startRow;
			args.forEach((arg) => {
				if (typeof arg === "object" && arg.nodeName === "TABLE") {
					this.tbl = arg;
					this.id = arg.id || `tf_${uuid()}`;
					this.tbl.id = this.id;
				} else if (isString(arg)) {
					this.id = arg;
					this.tbl = elm(arg);
				} else if (isNumber(arg)) startRow = arg;
				else if (isObj(arg)) {
					this.cfg = arg;
					this.hasConfig = true;
				}
			});
			if (!this.tbl || this.tbl.nodeName !== "TABLE") throw new Error(`Could not instantiate TableFilter: HTML table
                DOM element not found.`);
			if (this.getRowsNb(true) === 0) throw new Error(`Could not instantiate TableFilter: HTML table
                requires at least 1 row.`);
			let f = this.cfg;
			/**
			* Event emitter instance
			* @type {Emitter}
			*/
			this.emitter = new Emitter();
			this.refRow = isUndef(startRow) ? 2 : startRow + 1;
			/**
			* Collection of filter type by column
			* @type {Array}
			* @private
			*/
			this.filterTypes = [].map.call((this.dom().rows[this.refRow] || this.dom().rows[0]).cells, (cell, idx) => {
				let colType = this.cfg[`col_${idx}`];
				return !colType ? INPUT : colType.toLowerCase();
			});
			/**
			* Base path for static assets
			* @type {String}
			*/
			this.basePath = defaultsStr(f.base_path, "tablefilter/");
			/*** filters' grid properties ***/
			/**
			* Enable/disable filters
			* @type {Boolean}
			*/
			this.fltGrid = defaultsBool(f.grid, true);
			/**
			* Enable/disable grid layout (fixed headers)
			* @type {Object|Boolean}
			*/
			this.gridLayout = isObj(f.grid_layout) || Boolean(f.grid_layout);
			/**
			* Filters row index
			* @type {Number}
			*/
			this.filtersRowIndex = defaultsNb(f.filters_row_index, 0);
			/**
			* Headers row index
			* @type {Number}
			*/
			this.headersRow = defaultsNb(f.headers_row_index, this.filtersRowIndex === 0 ? 1 : 0);
			/**
			* Define the type of cell containing a filter (td/th)
			* @type {String}
			*/
			this.fltCellTag = defaultsStr(f.filters_cell_tag, "TD");
			/**
			* List of filters IDs
			* @type {Array}
			* @private
			*/
			this.fltIds = [];
			/**
			* List of valid rows indexes (rows visible upon filtering)
			* @type {Array}
			* @private
			*/
			this.validRowsIndex = [];
			/*** filters' grid appearance ***/
			/**
			* Path for stylesheets
			* @type {String}
			*/
			this.stylePath = this.getStylePath();
			/**
			* Main stylesheet path
			* @type {String}
			*/
			this.stylesheet = this.getStylesheetPath();
			/**
			* Main stylesheet ID
			* @type {String}
			* @private
			*/
			this.stylesheetId = this.id + "_style";
			/**
			* Css class for the filters row
			* @type {String}
			*/
			this.fltsRowCssClass = defaultsStr(f.flts_row_css_class, "fltrow");
			/**
			* Enable/disable icons (paging, reset button)
			* @type {Boolean}
			*/
			this.enableIcons = defaultsBool(f.enable_icons, true);
			/**
			* Enable/disable alternating rows
			* @type {Boolean}
			*/
			this.alternateRows = Boolean(f.alternate_rows);
			/**
			* Columns widths array
			* @type {Array}
			*/
			this.colWidths = defaultsArr(f.col_widths, []);
			/**
			* Default column width when column widths are defined
			*/
			this.defaultColWidth = defaultsNb(f.default_col_width, 100);
			/**
			* Css class for a filter element
			* @type {String}
			*/
			this.fltCssClass = defaultsStr(f.flt_css_class, "flt");
			/**
			* Css class for multiple select filters
			* @type {String}
			*/
			this.fltMultiCssClass = defaultsStr(f.flt_multi_css_class, "flt_multi");
			/**
			* Css class for small filter (when submit button is active)
			* @type {String}
			*/
			this.fltSmallCssClass = defaultsStr(f.flt_small_css_class, "flt_s");
			/**
			* Css class for single filter type
			* @type {String}
			*/
			this.singleFltCssClass = defaultsStr((f.single_filter || {}).css_class, "single_flt");
			/*** filters' grid behaviours ***/
			/**
			* Enable/disable enter key for input type filters
			* @type {Boolean}
			*/
			this.enterKey = defaultsBool(f.enter_key, true);
			/**
			* Callback fired before filtering process starts
			* @type {Function}
			*/
			this.onBeforeFilter = defaultsFn(f.on_before_filter, EMPTY_FN);
			/**
			* Callback fired after filtering process is completed
			* @type {Function}
			*/
			this.onAfterFilter = defaultsFn(f.on_after_filter, EMPTY_FN);
			/**
			* Enable/disable case sensitivity for filtering, default false
			* @type {Boolean}
			*/
			this.caseSensitive = Boolean(f.case_sensitive);
			/**
			* Indicate whether exact match filtering is enabled on a per column
			* basis
			* @type {Boolean}
			* @private
			*/
			this.hasExactMatchByCol = isArray(f.columns_exact_match);
			/**
			* Exact match filtering per column array
			* @type {Array}
			*/
			this.exactMatchByCol = this.hasExactMatchByCol ? f.columns_exact_match : [];
			/**
			* Globally enable/disable exact match filtering
			* @type {Boolean}
			*/
			this.exactMatch = Boolean(f.exact_match);
			/**
			* Ignore diacritics globally or on a column basis
			* @type {Boolean|Array}
			*/
			this.ignoreDiacritics = f.ignore_diacritics;
			/**
			* Enable/disable linked filters filtering mode
			* @type {Boolean}
			*/
			this.linkedFilters = Boolean(f.linked_filters);
			/**
			* Enable/disable readonly state for excluded options when
			* linked filters filtering mode is on
			* @type {Boolean}
			*/
			this.disableExcludedOptions = Boolean(f.disable_excluded_options);
			/**
			* Active filter ID
			* @type {String}
			* @private
			*/
			this.activeFilterId = null;
			/**
			* Determine if there are excluded rows from filtering
			* @type {Boolean}
			* @private
			*/
			this.hasExcludedRows = Boolean(isArray(f.exclude_rows) && f.exclude_rows.length > 0);
			/**
			* List of row indexes to be excluded from filtering
			* @type {Array}
			*/
			this.excludeRows = defaultsArr(f.exclude_rows, []);
			/**
			* List of containers IDs where external filters will be generated
			* @type {Array}
			*/
			this.externalFltIds = defaultsArr(f.external_flt_ids, []);
			/**
			* Callback fired after filters are generated
			* @type {Function}
			*/
			this.onFiltersLoaded = defaultsFn(f.on_filters_loaded, EMPTY_FN);
			/**
			* Enable/disable single filter mode
			* @type {Boolean|Object}
			*/
			this.singleFlt = isObj(f.single_filter) || Boolean(f.single_filter);
			/**
			* Specify columns to be excluded from single filter search, by default
			* searching in all columns:
			* single_filter: {
			*      exclude_cols: [2, 7]
			* }
			*/
			this.singleFltExcludeCols = isObj(f.single_filter) && isArray(f.single_filter.exclude_cols) ? f.single_filter.exclude_cols : [];
			/**
			* Callback fired after a row is validated during filtering
			* @type {Function}
			*/
			this.onRowValidated = defaultsFn(f.on_row_validated, EMPTY_FN);
			/**
			* Specify which column implements a custom cell parser to retrieve the
			* cell value:
			* cell_parser: {
			*     cols: [0, 2],
			*     parse: function(tf, cell, colIndex) {
			*         // custom cell parser logic here
			*         return cellValue;
			*     }
			* }
			* @type {Object}
			*/
			this.cellParser = isObj(f.cell_parser) && isFn(f.cell_parser.parse) && isArray(f.cell_parser.cols) ? f.cell_parser : {
				cols: [],
				parse: EMPTY_FN
			};
			/**
			* Global watermark text for input filter type or watermark for each
			* filter if an array is supplied
			* @type {String|Array}
			*/
			this.watermark = f.watermark || "";
			/**
			* Indicate whether watermark is on a per column basis
			* @type {Boolean}
			* @private
			*/
			this.isWatermarkArray = isArray(this.watermark);
			/**
			* Indicate whether help UI component is disabled
			* @type {Boolean}
			*/
			this.help = isUndef(f.help_instructions) ? void 0 : isObj(f.help_instructions) || Boolean(f.help_instructions);
			/**
			* Indicate whether pop-up filters UI is enabled
			* @type {Boolean|Object}
			*/
			this.popupFilters = isObj(f.popup_filters) || Boolean(f.popup_filters);
			/**
			* Indicate whether filtered (active) columns indicator is enabled
			* @type {Boolean}
			*/
			this.markActiveColumns = isObj(f.mark_active_columns) || Boolean(f.mark_active_columns);
			/*** select filter's customisation and behaviours ***/
			/**
			* Text for clear option in drop-down filter types (1st option)
			* @type {String|Array}
			*/
			this.clearFilterText = isArray(f.clear_filter_text) ? f.clear_filter_text : defaultsStr(f.clear_filter_text, "Clear");
			/**
			* Indicate whether empty option is enabled in drop-down filter types
			* @type {Boolean}
			*/
			this.enableEmptyOption = Boolean(f.enable_empty_option);
			/**
			* Text for empty option in drop-down filter types
			* @type {String}
			*/
			this.emptyText = defaultsStr(f.empty_text, "(Empty)");
			/**
			* Indicate whether non-empty option is enabled in drop-down filter
			* types
			* @type {Boolean}
			*/
			this.enableNonEmptyOption = Boolean(f.enable_non_empty_option);
			/**
			* Text for non-empty option in drop-down filter types
			* @type {String}
			*/
			this.nonEmptyText = defaultsStr(f.non_empty_text, "(Non empty)");
			/**
			* Indicate whether drop-down filter types filter the table by default
			* on change event
			* @type {Boolean}
			*/
			this.onSlcChange = defaultsBool(f.on_change, true);
			/**
			* Make drop-down filter types options sorted in alpha-numeric manner
			* by default globally or on a column basis
			* @type {Boolean|Array}
			*/
			this.sortSlc = isUndef(f.sort_select) ? true : defaultsArr(f.sort_select, Boolean(f.sort_select));
			/**
			* List of columns implementing filter options sorting in ascending
			* manner based on column data type
			* @type {Array}
			*/
			this.sortFilterOptionsAsc = defaultsArr(f.sort_filter_options_asc, []);
			/**
			* List of columns implementing filter options sorting in descending
			* manner based on column data type
			* @type {Array}
			*/
			this.sortFilterOptionsDesc = defaultsArr(f.sort_filter_options_desc, []);
			/**
			* Indicate whether drop-down filter types are populated on demand at
			* first usage
			* @type {Boolean}
			*/
			this.loadFltOnDemand = Boolean(f.load_filters_on_demand);
			/**
			* Indicate whether custom drop-down filter options are implemented
			* @type {Boolean}
			*/
			this.hasCustomOptions = isObj(f.custom_options);
			/**
			* Custom options definition of a per column basis, ie:
			*	custom_options: {
			*      cols:[0, 1],
			*      texts: [
			*          ['a0', 'b0', 'c0'],
			*          ['a1', 'b1', 'c1']
			*      ],
			*      values: [
			*          ['a0', 'b0', 'c0'],
			*          ['a1', 'b1', 'c1']
			*      ],
			*      sorts: [false, true]
			*  }
			*
			* @type {Object}
			*/
			this.customOptions = f.custom_options;
			/*** Filter operators ***/
			/**
			* Regular expression operator for input filter. Defaults to 'rgx:'
			* @type {String}
			*/
			this.rgxOperator = defaultsStr(f.regexp_operator, "rgx:");
			/**
			* Empty cells operator for input filter. Defaults to '[empty]'
			* @type {String}
			*/
			this.emOperator = defaultsStr(f.empty_operator, "[empty]");
			/**
			* Non-empty cells operator for input filter. Defaults to '[nonempty]'
			* @type {String}
			*/
			this.nmOperator = defaultsStr(f.nonempty_operator, "[nonempty]");
			/**
			* Logical OR operator for input filter. Defaults to '||'
			* @type {String}
			*/
			this.orOperator = defaultsStr(f.or_operator, "||");
			/**
			* Logical AND operator for input filter. Defaults to '&&'
			* @type {String}
			*/
			this.anOperator = defaultsStr(f.and_operator, "&&");
			/**
			* Greater than operator for input filter. Defaults to '>'
			* @type {String}
			*/
			this.grOperator = defaultsStr(f.greater_operator, ">");
			/**
			* Lower than operator for input filter. Defaults to '<'
			* @type {String}
			*/
			this.lwOperator = defaultsStr(f.lower_operator, "<");
			/**
			* Lower than or equal operator for input filter. Defaults to '<='
			* @type {String}
			*/
			this.leOperator = defaultsStr(f.lower_equal_operator, "<=");
			/**
			* Greater than or equal operator for input filter. Defaults to '>='
			* @type {String}
			*/
			this.geOperator = defaultsStr(f.greater_equal_operator, ">=");
			/**
			* Inequality operator for input filter. Defaults to '!'
			* @type {String}
			*/
			this.dfOperator = defaultsStr(f.different_operator, "!");
			/**
			* Like operator for input filter. Defaults to '*'
			* @type {String}
			*/
			this.lkOperator = defaultsStr(f.like_operator, "*");
			/**
			* Strict equality operator for input filter. Defaults to '='
			* @type {String}
			*/
			this.eqOperator = defaultsStr(f.equal_operator, "=");
			/**
			* Starts with operator for input filter. Defaults to '='
			* @type {String}
			*/
			this.stOperator = defaultsStr(f.start_with_operator, "{");
			/**
			* Ends with operator for input filter. Defaults to '='
			* @type {String}
			*/
			this.enOperator = defaultsStr(f.end_with_operator, "}");
			/**
			* Stored values separator
			* @type {String}
			*/
			this.separator = defaultsStr(f.separator, ",");
			/**
			* Enable rows counter UI component
			* @type {Boolean|Object}
			*/
			this.rowsCounter = isObj(f.rows_counter) || Boolean(f.rows_counter);
			/**
			* Enable status bar UI component
			* @type {Boolean|Object}
			*/
			this.statusBar = isObj(f.status_bar) || Boolean(f.status_bar);
			/**
			* Enable activity/spinner indicator UI component
			* @type {Boolean|Object}
			*/
			this.loader = isObj(f.loader) || Boolean(f.loader);
			/*** validation - reset buttons/links ***/
			/**
			* Enable filters submission button
			* @type {Boolean}
			*/
			this.displayBtn = Boolean(f.btn);
			/**
			* Define filters submission button text
			* @type {String}
			*/
			this.btnText = defaultsStr(f.btn_text, !this.enableIcons ? "Go" : "");
			/**
			* Css class for filters submission button
			* @type {String}
			*/
			this.btnCssClass = defaultsStr(f.btn_css_class, !this.enableIcons ? "btnflt" : "btnflt_icon");
			/**
			* Enable clear button
			* @type {Object|Boolean}
			*/
			this.btnReset = isObj(f.btn_reset) || Boolean(f.btn_reset);
			/**
			* Callback fired before filters are cleared
			* @type {Function}
			*/
			this.onBeforeReset = defaultsFn(f.on_before_reset, EMPTY_FN);
			/**
			* Callback fired after filters are cleared
			* @type {Function}
			*/
			this.onAfterReset = defaultsFn(f.on_after_reset, EMPTY_FN);
			/**
			* Enable paging component
			* @type {Object|Boolean}
			*/
			this.paging = isObj(f.paging) || Boolean(f.paging);
			/**
			* Number of hidden rows
			* @type {Number}
			* @private
			*/
			this.nbHiddenRows = 0;
			/**
			* Enable auto-filter behaviour, table is filtered when a user
			* stops typing
			* @type {Object|Boolean}
			*/
			this.autoFilter = isObj(f.auto_filter) || Boolean(f.auto_filter);
			/**
			* Auto-filter delay in milliseconds
			* @type {Number}
			*/
			this.autoFilterDelay = isObj(f.auto_filter) && isNumber(f.auto_filter.delay) ? f.auto_filter.delay : 750;
			/**
			* Indicate whether user is typing
			* @type {Boolean}
			* @private
			*/
			this.isUserTyping = null;
			/**
			* Auto-filter interval ID
			* @type {String}
			* @private
			*/
			this.autoFilterTimer = null;
			/**
			* Enable keyword highlighting behaviour
			* @type {Boolean}
			*/
			this.highlightKeywords = Boolean(f.highlight_keywords);
			/**
			* Enable no results message UI component
			* @type {Object|Boolean}
			*/
			this.noResults = isObj(f.no_results_message) || Boolean(f.no_results_message);
			/**
			* Enable state persistence
			* @type {Object|Boolean}
			*/
			this.state = isObj(f.state) || Boolean(f.state);
			/*** data types ***/
			/**
			* Enable date type module
			* @type {Boolean}
			* @private
			*/
			this.dateType = true;
			/**
			* Define default locale, default to 'en' as per Sugar Date module:
			* https://sugarjs.com/docs/#/DateLocales
			* @type {String}
			*/
			this.locale = defaultsStr(f.locale, "en");
			/**
			* Define thousands separator ',' or '.', defaults to ','
			* @type {String}
			*/
			this.thousandsSeparator = defaultsStr(f.thousands_separator, ",");
			/**
			* Define decimal separator ',' or '.', defaults to '.'
			* @type {String}
			*/
			this.decimalSeparator = defaultsStr(f.decimal_separator, ".");
			/**
			* Define data types on a column basis, possible values 'string',
			* 'number', 'formatted-number', 'date', 'ipaddress' ie:
			* col_types : [
			*  'string', 'date', 'number',
			*  { type: 'formatted-number', decimal: ',', thousands: '.' },
			*  { type: 'date', locale: 'en-gb' },
			*  { type: 'date', format: ['{dd}-{months}-{yyyy|yy}'] }
			* ]
			*
			* Refer to https://sugarjs.com/docs/#/DateParsing for exhaustive
			* information on date parsing formats supported by Sugar Date
			* @type {Array}
			*/
			this.colTypes = isArray(f.col_types) ? f.col_types : [];
			/*** ids prefixes ***/
			/**
			* Main prefix
			* @private
			*/
			this.prfxTf = "TF";
			/**
			* Filter's ID prefix (inputs - selects)
			* @private
			*/
			this.prfxFlt = "flt";
			/**
			* Button's ID prefix
			* @private
			*/
			this.prfxValButton = "btn";
			/**
			* Responsive Css class
			* @private
			*/
			this.prfxResponsive = "resp";
			/** @private */
			this.stickyCssClass = "sticky";
			/*** extensions ***/
			/**
			* List of loaded extensions
			* @type {Array}
			*/
			this.extensions = defaultsArr(f.extensions, []);
			/*** themes ***/
			/**
			* Enable default theme
			* @type {Boolean}
			*/
			this.enableDefaultTheme = Boolean(f.enable_default_theme);
			/**
			* Determine whether themes are enables
			* @type {Boolean}
			* @private
			*/
			this.hasThemes = this.enableDefaultTheme || isArray(f.themes);
			/**
			* List of themes, ie:
			* themes: [{ name: 'skyblue' }]
			* @type {Array}
			*/
			this.themes = defaultsArr(f.themes, []);
			/**
			* Define path to themes assets, defaults to
			* 'tablefilter/style/themes/'. Usage:
			* themes: [{ name: 'skyblue' }]
			* @type {Array}
			*/
			this.themesPath = this.getThemesPath();
			/**
			* Enable responsive layout
			* @type {Boolean}
			*/
			this.responsive = Boolean(f.responsive);
			/**
			* Enable toolbar component
			* @type {Object|Boolean}
			*/
			this.toolbar = isObj(f.toolbar) || Boolean(f.toolbar);
			/**
			* Enable sticky headers
			* @type {Boolean}
			*/
			this.stickyHeaders = Boolean(f.sticky_headers);
			/**
			* Features registry
			* @private
			*/
			this.Mod = {};
			/**
			* Extensions registry
			* @private
			*/
			this.ExtRegistry = {};
			this.instantiateFeatures(FEATURES);
		}
		/**
		* Initialise features and layout
		*/
		init() {
			if (this.initialized) return;
			this.import(this.stylesheetId, this.getStylesheetPath(), null, "link");
			let Mod = this.Mod;
			let inpclass;
			this.loadThemes();
			this.initFeatures([
				DateType,
				Help,
				State,
				MarkActiveColumns,
				GridLayout,
				Loader,
				HighlightKeyword,
				PopupFilter
			]);
			if (!this.fltGrid) this._initNoFilters();
			else {
				let fltrow = this._insertFiltersRow();
				this.nbCells = this.getCellsNb(this.refRow);
				this.nbFilterableRows = this.getRowsNb();
				let n = this.singleFlt ? 1 : this.nbCells;
				for (let i = 0; i < n; i++) {
					this.emitter.emit("before-filter-init", this, i);
					let fltCell = createElm(this.fltCellTag), col = this.getFilterType(i);
					if (this.singleFlt) fltCell.colSpan = this.nbCells;
					if (!this.gridLayout) fltrow.appendChild(fltCell);
					inpclass = i === n - 1 && this.displayBtn ? this.fltSmallCssClass : this.fltCssClass;
					if (this.singleFlt) {
						col = INPUT;
						inpclass = this.singleFltCssClass;
					}
					if (col === "select" || col === "multiple") {
						Mod.dropdown = Mod.dropdown || new Dropdown(this);
						Mod.dropdown.init(i, this.isExternalFlt(), fltCell);
					} else if (col === "checklist") {
						Mod.checkList = Mod.checkList || new CheckList(this);
						Mod.checkList.init(i, this.isExternalFlt(), fltCell);
					} else this._buildInputFilter(i, inpclass, fltCell);
					if (i === n - 1 && this.displayBtn) this._buildSubmitButton(this.isExternalFlt() ? elm(this.externalFltIds[i]) : fltCell);
					this.emitter.emit("after-filter-init", this, i);
				}
				this.emitter.on(["filter-focus"], (tf, filter) => this.setActiveFilterId(filter.id));
			}
			if (this.hasExcludedRows) {
				this.emitter.on(["after-filtering"], () => this.setExcludeRows());
				this.setExcludeRows();
			}
			this.initFeatures([
				RowsCounter,
				StatusBar,
				ClearButton,
				AlternateRows,
				NoResults,
				Paging,
				Toolbar
			]);
			this.setColWidths();
			if (!this.gridLayout) {
				addClass(this.dom(), this.prfxTf);
				if (this.responsive) addClass(this.dom(), this.prfxResponsive);
				if (this.colWidths.length > 0) this.setFixedLayout();
				if (this.stickyHeaders && this.dom().tHead) addClass(this.dom(), this.stickyCssClass);
			}
			this.initExtensions();
			this.initialized = true;
			this.onFiltersLoaded(this);
			this.emitter.emit("initialized", this);
		}
		/**
		* Detect <enter> key
		* @param {Event} evt
		*/
		detectKey(evt) {
			if (!this.enterKey) return;
			if (isKeyPressed(evt, [13])) {
				this.filter();
				cancelEvt(evt);
				stopEvt(evt);
			} else {
				this.isUserTyping = true;
				root.clearInterval(this.autoFilterTimer);
				this.autoFilterTimer = null;
			}
		}
		/**
		* Filter's keyup event: if auto-filter on, detect user is typing and filter
		* columns
		* @param {Event} evt
		*/
		onKeyUp(evt) {
			if (!this.autoFilter) return;
			this.isUserTyping = false;
			function filter() {
				root.clearInterval(this.autoFilterTimer);
				this.autoFilterTimer = null;
				if (!this.isUserTyping) {
					this.filter();
					this.isUserTyping = null;
				}
			}
			if (isKeyPressed(evt, [
				13,
				9,
				27,
				38,
				40
			])) {
				root.clearInterval(this.autoFilterTimer);
				this.autoFilterTimer = null;
			} else {
				if (this.autoFilterTimer !== null) return;
				this.autoFilterTimer = root.setInterval(filter.bind(this), this.autoFilterDelay);
			}
		}
		/**
		* Filter's keydown event: if auto-filter on, detect user is typing
		*/
		onKeyDown() {
			if (this.autoFilter) this.isUserTyping = true;
		}
		/**
		* Filter's focus event
		* @param {Event} evt
		*/
		onInpFocus(evt) {
			let elm = targetEvt(evt);
			this.emitter.emit("filter-focus", this, elm);
		}
		/**
		* Filter's blur event: if auto-filter on, clear interval on filter blur
		*/
		onInpBlur() {
			if (this.autoFilter) {
				this.isUserTyping = false;
				root.clearInterval(this.autoFilterTimer);
			}
			this.emitter.emit("filter-blur", this);
		}
		/**
		* Insert filters row at initialization
		*/
		_insertFiltersRow() {
			if (this.gridLayout) return;
			let fltrow;
			let thead = tag(this.dom(), "thead");
			if (thead.length > 0) fltrow = thead[0].insertRow(this.filtersRowIndex);
			else fltrow = this.dom().insertRow(this.filtersRowIndex);
			fltrow.className = this.fltsRowCssClass;
			if (this.isExternalFlt()) fltrow.style.display = NONE;
			this.emitter.emit("filters-row-inserted", this, fltrow);
			return fltrow;
		}
		/**
		* Initialize filtersless table
		*/
		_initNoFilters() {
			if (this.fltGrid) return;
			this.refRow = this.refRow > 0 ? this.refRow - 1 : 0;
			this.nbFilterableRows = this.getRowsNb();
		}
		/**
		* Build input filter type
		* @param  {Number} colIndex      Column index
		* @param  {String} cssClass      Css class applied to filter
		* @param  {DOMElement} container Container DOM element
		*/
		_buildInputFilter(colIndex, cssClass, container) {
			let col = this.getFilterType(colIndex);
			let externalFltTgtId = this.isExternalFlt() ? this.externalFltIds[colIndex] : null;
			let inpType = col === "input" ? "text" : "hidden";
			let inp = createElm(INPUT, ["id", this.buildFilterId(colIndex)], ["type", inpType], ["ct", colIndex]);
			if (inpType !== "hidden" && this.watermark) inp.setAttribute("placeholder", this.isWatermarkArray ? this.watermark[colIndex] || "" : this.watermark);
			inp.className = cssClass || this.fltCssClass;
			addEvt(inp, "focus", (evt) => this.onInpFocus(evt));
			if (externalFltTgtId) elm(externalFltTgtId).appendChild(inp);
			else container.appendChild(inp);
			this.fltIds.push(inp.id);
			addEvt(inp, "keypress", (evt) => this.detectKey(evt));
			addEvt(inp, "keydown", () => this.onKeyDown());
			addEvt(inp, "keyup", (evt) => this.onKeyUp(evt));
			addEvt(inp, "blur", () => this.onInpBlur());
		}
		/**
		* Build submit button
		* @param  {DOMElement} container Container DOM element
		*/
		_buildSubmitButton(container) {
			let btn = createElm(INPUT, ["type", "button"], ["value", this.btnText]);
			btn.className = this.btnCssClass;
			container.appendChild(btn);
			addEvt(btn, "click", () => this.filter());
		}
		/**
		* Conditionally istantiate each feature class in passed collection if
		* required by configuration and add it to the features registry. A feature
		* class meta information contains a `name` field and optional `altName` and
		* `alwaysInstantiate` fields
		* @param {Array} [features=[]]
		* @private
		*/
		instantiateFeatures(features = []) {
			features.forEach((featureCls) => {
				let Cls = featureCls;
				Cls.meta = Cls.meta || {
					name: null,
					altName: null
				};
				Cls.meta.name = toCamelCase(Cls.name);
				let { name, altName, alwaysInstantiate } = Cls.meta;
				let prop = altName || name;
				if (!this.hasConfig || this[prop] === true || Boolean(alwaysInstantiate)) this.Mod[name] = this.Mod[name] || new Cls(this);
			});
		}
		/**
		* Initialise each feature class in passed collection.
		* @param {Array} [features=[]]
		* @private
		*/
		initFeatures(features = []) {
			features.forEach((featureCls) => {
				let { name, altName } = featureCls.meta;
				let prop = altName || name;
				if (this[prop] === true && this.Mod[name]) this.Mod[name].init();
			});
		}
		/**
		* Return a feature instance for a given name
		* @param  {String} name Name of the feature
		* @return {Object}
		*/
		feature(name) {
			return this.Mod[name];
		}
		/**
		* Initialise all the extensions defined in the configuration object
		*/
		initExtensions() {
			let exts = this.extensions;
			if (exts.length === 0) return;
			if (typeof __webpack_public_path__ !== "undefined") __webpack_public_path__ = this.basePath;
			this.emitter.emit("before-loading-extensions", this);
			exts.forEach((ext) => {
				this.loadExtension(ext);
			});
			this.emitter.emit("after-loading-extensions", this);
		}
		/**
		* Load an extension module
		* @param  {Object} ext Extension config object
		*/
		loadExtension(ext) {
			if (!ext || !ext.name || this.hasExtension(ext.name)) return;
			let { name, path } = ext;
			let modulePath;
			if (name && path) modulePath = ext.path + name;
			else {
				name = name.replace(".js", "");
				modulePath = "extensions/{}/{}".replace(/{}/g, name);
			}
			if (typeof EXTENSIONS !== "undefined" && EXTENSIONS[name]) {
				let inst = new EXTENSIONS[name](this, ext);
				inst.init();
				this.ExtRegistry[name] = inst;
				return;
			}
			if (typeof require !== "undefined") try {
				require(["./" + modulePath], (mod) => {
					let inst = new mod.default(this, ext);
					inst.init();
					this.ExtRegistry[name] = inst;
				});
			} catch (e) {
				console.warn("TableFilter: extension \"" + name + "\" could not be loaded outside a webpack bundle.");
			}
		}
		/**
		* Get an extension instance
		* @param  {String} name Name of the extension
		* @return {Object}      Extension instance
		*/
		extension(name) {
			return this.ExtRegistry[name];
		}
		/**
		* Check passed extension name exists
		* @param  {String}  name Name of the extension
		* @return {Boolean}
		*/
		hasExtension(name) {
			return !isEmpty(this.ExtRegistry[name]);
		}
		/**
		* Register the passed extension instance with associated name
		* @param {Object} inst Extension instance
		* @param {String} name Name of the extension
		*/
		registerExtension(inst, name) {
			this.ExtRegistry[name] = inst;
		}
		/**
		* Destroy all the extensions store in extensions registry
		*/
		destroyExtensions() {
			let reg = this.ExtRegistry;
			Object.keys(reg).forEach((key) => {
				reg[key].destroy();
				reg[key] = void 0;
			});
		}
		/**
		* Load themes defined in the configuration object
		*/
		loadThemes() {
			if (!this.hasThemes) return;
			let themes = this.themes;
			this.emitter.emit("before-loading-themes", this);
			if (this.enableDefaultTheme) this.themes.push({ name: "default" });
			themes.forEach((theme, i) => {
				let { name, path } = theme;
				let styleId = this.prfxTf + name;
				if (name && !path) path = this.themesPath + name + "/" + name + ".css";
				else if (!name && theme.path) name = "theme{0}".replace("{0}", i);
				if (!this.isImported(path, "link")) this.import(styleId, path, null, "link");
			});
			this.loader = true;
			this.emitter.emit("after-loading-themes", this);
		}
		/**
		* Return stylesheet DOM element for a given theme name
		* @return {DOMElement} stylesheet element
		*/
		getStylesheet(name = "default") {
			return elm(this.prfxTf + name);
		}
		/**
		* Destroy filter grid
		*/
		destroy() {
			if (!this.initialized) return;
			let emitter = this.emitter;
			if (this.isExternalFlt() && !this.popupFilters) this.removeExternalFlts();
			this.destroyExtensions();
			this.validateAllRows();
			emitter.emit("destroy", this);
			if (this.fltGrid && !this.gridLayout) this.dom().deleteRow(this.filtersRowIndex);
			if (this.hasExcludedRows) emitter.off(["after-filtering"], () => this.setExcludeRows());
			this.emitter.off(["filter-focus"], (tf, filter) => this.setActiveFilterId(filter.id));
			removeClass(this.dom(), this.prfxTf);
			removeClass(this.dom(), this.prfxResponsive);
			if (this.dom().tHead) removeClass(this.dom().tHead, this.stickyCssClass);
			this.nbHiddenRows = 0;
			this.validRowsIndex = [];
			this.fltIds = [];
			this.initialized = false;
		}
		/**
		* Remove all the external column filters
		*/
		removeExternalFlts() {
			if (!this.isExternalFlt()) return;
			this.externalFltIds.forEach((id) => {
				let externalFlt = elm(id);
				if (externalFlt) externalFlt.innerHTML = "";
			});
		}
		/**
		* Check if given column implements a filter with custom options
		* @param  {Number}  colIndex Column's index
		* @return {Boolean}
		*/
		isCustomOptions(colIndex) {
			return this.hasCustomOptions && this.customOptions.cols.indexOf(colIndex) !== -1;
		}
		/**
		* Returns an array [[value0, value1 ...],[text0, text1 ...]] with the
		* custom options values and texts
		* @param  {Number} colIndex Column's index
		* @return {Array}
		*/
		getCustomOptions(colIndex) {
			if (isEmpty(colIndex) || !this.isCustomOptions(colIndex)) return;
			let customOptions = this.customOptions;
			let cols = customOptions.cols;
			let optTxt = [], optArray = [];
			let index = cols.indexOf(colIndex);
			let slcValues = customOptions.values[index];
			let slcTexts = customOptions.texts[index];
			let slcSort = customOptions.sorts[index];
			for (let r = 0, len = slcValues.length; r < len; r++) {
				optArray.push(slcValues[r]);
				if (slcTexts[r]) optTxt.push(slcTexts[r]);
				else optTxt.push(slcValues[r]);
			}
			if (slcSort) {
				optArray.sort();
				optTxt.sort();
			}
			return [optArray, optTxt];
		}
		/**
		* Filter the table by retrieving the data from each cell in every single
		* row and comparing it to the search term for current column. A row is
		* hidden when all the search terms are not found in inspected row.
		*/
		filter() {
			if (!this.fltGrid || !this.initialized) return;
			let emitter = this.emitter;
			this.onBeforeFilter(this);
			emitter.emit("before-filtering", this);
			let hiddenRows = 0;
			this.validRowsIndex = [];
			let searchArgs = this.getFiltersValue();
			this.eachRow()((row, k) => {
				row.style.display = "";
				let cells = row.cells;
				let nbCells = cells.length;
				let occurence = [], isMatch = true, isSingleFltMatch = false;
				for (let j = 0; j < nbCells; j++) {
					let sA = searchArgs[this.singleFlt ? 0 : j];
					if (sA === "") continue;
					let cellValue = matchCase(this.getCellValue(cells[j]), this.caseSensitive);
					let sAOrSplit = sA.toString().split(this.orOperator), hasMultiOrSA = sAOrSplit.length > 1, sAAndSplit = sA.toString().split(this.anOperator), hasMultiAndSA = sAAndSplit.length > 1;
					if (isArray(sA) || hasMultiOrSA || hasMultiAndSA) {
						let cS, s;
						let found = false;
						if (isArray(sA)) s = sA;
						else s = hasMultiOrSA ? sAOrSplit : sAAndSplit;
						for (let w = 0, len = s.length; w < len; w++) {
							cS = trim(s[w]);
							found = this._match(cS, cellValue, cells[j]);
							if (found) emitter.emit("highlight-keyword", this, cells[j], cS);
							if (hasMultiOrSA && found || hasMultiAndSA && !found) break;
							if (isArray(sA) && found) break;
						}
						occurence[j] = found;
					} else {
						occurence[j] = this._match(trim(sA), cellValue, cells[j]);
						if (occurence[j]) emitter.emit("highlight-keyword", this, cells[j], sA);
					}
					if (!occurence[j]) isMatch = false;
					if (this.singleFlt && this.singleFltExcludeCols.indexOf(j) === -1 && occurence[j]) isSingleFltMatch = true;
					emitter.emit("cell-processed", this, j, cells[j]);
				}
				if (isSingleFltMatch) isMatch = true;
				this.validateRow(k, isMatch);
				if (!isMatch) hiddenRows++;
				emitter.emit("row-processed", this, k, this.validRowsIndex.length - 1, isMatch);
			}, (row) => row.cells.length !== this.nbCells);
			this.nbHiddenRows = hiddenRows;
			this.onAfterFilter(this);
			emitter.emit("after-filtering", this, searchArgs);
		}
		/**
		* Match search term in cell data
		* @param {String} term       Search term
		* @param {String} cellValue  Cell data
		* @param {DOMElement} cell   Current cell
		* @return {Boolean}
		* @private
		*/
		_match(term, cellValue, cell) {
			let numData;
			let colIdx = cell.cellIndex;
			let decimal = this.getDecimal(colIdx);
			let reLe = new RegExp(this.leOperator), reGe = new RegExp(this.geOperator), reL = new RegExp(this.lwOperator), reG = new RegExp(this.grOperator), reD = new RegExp(this.dfOperator), reLk = new RegExp(rgxEsc(this.lkOperator)), reEq = new RegExp(this.eqOperator), reSt = new RegExp(this.stOperator), reEn = new RegExp(this.enOperator), reEm = this.emOperator, reNm = this.nmOperator, reRe = new RegExp(rgxEsc(this.rgxOperator));
			term = matchCase(term, this.caseSensitive);
			let occurence = false;
			let hasLO = reL.test(term), hasLE = reLe.test(term), hasGR = reG.test(term), hasGE = reGe.test(term), hasDF = reD.test(term), hasEQ = reEq.test(term), hasLK = reLk.test(term), hasST = reSt.test(term), hasEN = reEn.test(term), hasEM = reEm === term, hasNM = reNm === term, hasRE = reRe.test(term);
			if (this.hasType(colIdx, ["date"])) {
				let dte1, dte2;
				let dateType = this.Mod.dateType;
				let isValidDate = dateType.isValid.bind(dateType);
				let parseDate = dateType.parse.bind(dateType);
				let locale = dateType.getLocale(colIdx);
				let isLDate = hasLO && isValidDate(term.replace(reL, ""), locale);
				let isLEDate = hasLE && isValidDate(term.replace(reLe, ""), locale);
				let isGDate = hasGR && isValidDate(term.replace(reG, ""), locale);
				let isGEDate = hasGE && isValidDate(term.replace(reGe, ""), locale);
				let isDFDate = hasDF && isValidDate(term.replace(reD, ""), locale);
				let isEQDate = hasEQ && isValidDate(term.replace(reEq, ""), locale);
				dte1 = parseDate(cellValue, locale);
				if (isLEDate) {
					dte2 = parseDate(term.replace(reLe, ""), locale);
					occurence = dte1 <= dte2;
				} else if (isLDate) {
					dte2 = parseDate(term.replace(reL, ""), locale);
					occurence = dte1 < dte2;
				} else if (isGEDate) {
					dte2 = parseDate(term.replace(reGe, ""), locale);
					occurence = dte1 >= dte2;
				} else if (isGDate) {
					dte2 = parseDate(term.replace(reG, ""), locale);
					occurence = dte1 > dte2;
				} else if (isDFDate) {
					dte2 = parseDate(term.replace(reD, ""), locale);
					occurence = dte1.toString() !== dte2.toString();
				} else if (isEQDate) {
					dte2 = parseDate(term.replace(reEq, ""), locale);
					occurence = dte1.toString() === dte2.toString();
				} else if (reLk.test(term)) occurence = contains(term.replace(reLk, ""), cellValue, false, this.caseSensitive);
				else if (isValidDate(term)) {
					dte2 = parseDate(term, locale);
					occurence = dte1.toString() === dte2.toString();
				} else if (hasEM) occurence = !cell.hasChildNodes() || isEmpty(cellValue);
				else if (hasNM) occurence = cell.hasChildNodes() && !isEmpty(cellValue);
				else occurence = contains(term, cellValue, this.isExactMatch(colIdx), this.caseSensitive);
			} else {
				numData = parse(cellValue, decimal) || Number(cellValue);
				if (hasRE) try {
					let srchArg = term.replace(reRe, "");
					occurence = new RegExp(srchArg).test(cellValue);
				} catch (ex) {
					occurence = false;
				}
				else if (hasLE) occurence = numData <= parse(term.replace(reLe, ""), decimal);
				else if (hasGE) occurence = numData >= parse(term.replace(reGe, ""), decimal);
				else if (hasLO) occurence = numData < parse(term.replace(reL, ""), decimal);
				else if (hasGR) occurence = numData > parse(term.replace(reG, ""), decimal);
				else if (hasDF) occurence = contains(term.replace(reD, ""), cellValue, false, this.caseSensitive) ? false : true;
				else if (hasLK) occurence = contains(term.replace(reLk, ""), cellValue, false, this.caseSensitive);
				else if (hasEQ) occurence = contains(term.replace(reEq, ""), cellValue, true, this.caseSensitive);
				else if (hasST) occurence = cellValue.indexOf(term.replace(reSt, "")) === 0 ? true : false;
				else if (hasEN) {
					let searchArg = term.replace(reEn, "");
					occurence = cellValue.lastIndexOf(searchArg, cellValue.length - 1) === cellValue.length - 1 - (searchArg.length - 1) && cellValue.lastIndexOf(searchArg, cellValue.length - 1) > -1 ? true : false;
				} else if (hasEM) occurence = !cell.hasChildNodes() || isEmpty(cellValue);
				else if (hasNM) occurence = cell.hasChildNodes() && !isEmpty(cellValue);
				else if (numData && this.hasType(colIdx, ["number", "formatted-number"]) && !this.singleFlt) {
					term = parse(term, decimal) || term;
					occurence = numData === term || contains(term.toString(), numData.toString(), this.isExactMatch(colIdx), this.caseSensitive);
				} else occurence = contains(term, cellValue, this.isExactMatch(colIdx), this.caseSensitive, this.ignoresDiacritics(colIdx));
			}
			return occurence;
		}
		/**
		* Return the data of a specified column
		* @param {Number} colIndex Column index
		* @param {Boolean} [includeHeaders=false] Include headers row
		* @param {Array} [exclude=[]] List of row indexes to be excluded
		* @return Flat list of data for a column
		*/
		getColumnData(colIndex, includeHeaders = false, exclude = []) {
			return this.getColValues(colIndex, includeHeaders, true, exclude);
		}
		/**
		* Return the values of a specified column
		* @param {Number} colIndex Column index
		* @param {Boolean} [includeHeaders=false] Include headers row
		* @param {Array} [exclude=[]] List of row indexes to be excluded
		* @return Flat list of values for a column
		*/
		getColumnValues(colIndex, includeHeaders = false, exclude = []) {
			return this.getColValues(colIndex, includeHeaders, false, exclude);
		}
		/**
		* Return the data of a specified column
		* @param  {Number} colIndex Column index
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [typed=false] Return a typed value
		* @param  {Array} [exclude=[]] List of row indexes to be excluded
		* @return {Array}           Flat list of data for a column
		* @private
		*/
		getColValues(colIndex, includeHeaders = false, typed = false, exclude = []) {
			let colValues = [];
			let getContent = typed ? this.getCellData.bind(this) : this.getCellValue.bind(this);
			if (includeHeaders) colValues.push(this.getHeadersText()[colIndex]);
			this.eachRow()((row, i) => {
				let isExludedRow = exclude.indexOf(i) !== -1;
				let cells = row.cells;
				if (cells.length === this.nbCells && !isExludedRow) {
					let data = getContent(cells[colIndex]);
					colValues.push(data);
				}
			});
			return colValues;
		}
		/**
		* Return the filter's value of a specified column
		* @param  {Number} index Column index
		* @return {String}       Filter value
		*/
		getFilterValue(index) {
			if (!this.fltGrid) return;
			let fltValue = "";
			let flt = this.getFilterElement(index);
			if (!flt) return fltValue;
			let fltColType = this.getFilterType(index);
			if (fltColType !== "multiple" && fltColType !== "checklist") fltValue = flt.value;
			else if (fltColType === "multiple") fltValue = this.feature("dropdown").getValues(index);
			else if (fltColType === "checklist") fltValue = this.feature("checkList").getValues(index);
			if (isArray(fltValue) && fltValue.length === 0 || fltValue.length === 1 && fltValue[0] === "") fltValue = "";
			return fltValue;
		}
		/**
		* Return the filters' values
		* @return {Array} List of filters' values
		*/
		getFiltersValue() {
			if (!this.fltGrid) return;
			let searchArgs = [];
			this.fltIds.forEach((id, i) => {
				let fltValue = this.getFilterValue(i);
				if (isArray(fltValue)) searchArgs.push(fltValue);
				else searchArgs.push(trim(fltValue));
			});
			return searchArgs;
		}
		/**
		* Return the ID of a specified column's filter
		* @param  {Number} index Column's index
		* @return {String}       ID of the filter element
		*/
		getFilterId(index) {
			if (!this.fltGrid) return;
			return this.fltIds[index];
		}
		/**
		* Return the list of ids of filters matching a specified type.
		* Note: hidden filters are also returned
		*
		* @param  {String} type  Filter type string ('input', 'select', 'multiple',
		*                        'checklist')
		* @param  {Boolean} bool If true returns columns indexes instead of IDs
		* @return {[type]}       List of element IDs or column indexes
		*/
		getFiltersByType(type, bool) {
			if (!this.fltGrid) return;
			let arr = [];
			for (let i = 0, len = this.fltIds.length; i < len; i++) if (this.getFilterType(i) === type.toLowerCase()) {
				let a = bool ? i : this.fltIds[i];
				arr.push(a);
			}
			return arr;
		}
		/**
		* Return the filter's DOM element for a given column
		* @param  {Number} index     Column's index
		* @return {DOMElement}
		*/
		getFilterElement(index) {
			return elm(this.fltIds[index]);
		}
		/**
		* Return the number of cells for a given row index
		* @param  {Number} rowIndex Index of the row
		* @return {Number}          Number of cells
		*/
		getCellsNb(rowIndex = 0) {
			let tr = this.dom().rows[rowIndex >= 0 ? rowIndex : 0];
			return tr ? tr.cells.length : 0;
		}
		/**
		* Return the number of working rows starting from reference row if
		* defined
		* @param  {Boolean} includeHeaders Include the headers row(s)
		* @return {Number}                 Number of working rows
		*/
		getRowsNb(includeHeaders) {
			let nbRows = this.getWorkingRows().length;
			if (this.dom().tHead) return includeHeaders ? nbRows + this.dom().querySelectorAll("thead > tr").length : nbRows;
			return includeHeaders ? nbRows : nbRows - this.refRow;
		}
		/**
		* Return the collection of the working rows, that is, the rows belonging
		* to the tbody section(s)
		* @returns {Array}
		*/
		getWorkingRows() {
			return doc.querySelectorAll(`table#${this.id} > tbody > tr`);
		}
		/**
		* Return the text content of a given cell
		* @param {DOMElement} Cell's DOM element
		* @return {String}
		*/
		getCellValue(cell) {
			let idx = cell.cellIndex;
			let cellParser = this.cellParser;
			if (cellParser.cols.indexOf(idx) !== -1) return cellParser.parse(this, cell, idx);
			else return getText(cell);
		}
		/**
		* Return the typed data of a given cell based on the column type definition
		* @param  {DOMElement} cell Cell's DOM element
		* @return {String|Number|Date}
		*/
		getCellData(cell) {
			let colIndex = cell.cellIndex;
			let value = this.getCellValue(cell);
			if (this.hasType(colIndex, ["formatted-number"])) return parse(value, this.getDecimal(colIndex));
			else if (this.hasType(colIndex, ["number"])) return Number(value);
			else if (this.hasType(colIndex, ["date"])) {
				let dateType = this.Mod.dateType;
				return dateType.parse(value, dateType.getLocale(colIndex));
			}
			return value;
		}
		/**
		* Return the table data based on its columns data type definitions
		* with following structure:
		* [
		*     [rowIndex, [data0, data1...]],
		*     [rowIndex, [data0, data1...]]
		* ]
		* @param {Boolean} [includeHeaders=false] Include headers row
		* @param {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @return {Array}
		*/
		getData(includeHeaders = false, excludeHiddenCols = false) {
			return this.getTableData(includeHeaders, excludeHiddenCols, true);
		}
		/**
		* Return the table values with following structure:
		* [
		*     [rowIndex, [value0, value1...]],
		*     [rowIndex, [value0, value1...]]
		* ]
		* @param {Boolean} [includeHeaders=false] Include headers row
		* @param {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @return {Array}
		*/
		getValues(includeHeaders = false, excludeHiddenCols = false) {
			return this.getTableData(includeHeaders, excludeHiddenCols, false);
		}
		/**
		* Return the table data with following structure:
		* [
		*     [rowIndex, [value0, value1...]],
		*     [rowIndex, [value0, value1...]]
		* ]
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @param  {Boolean} [typed=false] Return typed value
		* @return {Array}
		* @private
		*
		* TODO: provide an API returning data in JSON format
		*/
		getTableData(includeHeaders = false, excludeHiddenCols = false, typed = false) {
			let tblData = [];
			let getContent = typed ? this.getCellData.bind(this) : this.getCellValue.bind(this);
			if (includeHeaders) {
				let headers = this.getHeadersText(excludeHiddenCols);
				tblData.push([this.getHeadersRowIndex(), headers]);
			}
			this.eachRow()((row, k) => {
				let rowData = [k, []];
				let cells = row.cells;
				for (let j = 0, len = cells.length; j < len; j++) {
					if (excludeHiddenCols && this.hasExtension("colsVisibility")) {
						if (this.extension("colsVisibility").isColHidden(j)) continue;
					}
					let cellContent = getContent(cells[j]);
					rowData[1].push(cellContent);
				}
				tblData.push(rowData);
			});
			return tblData;
		}
		/**
		* Return the filtered table data based on its columns data type definitions
		* with following structure:
		* [
		*     [rowIndex, [data0, data1...]],
		*     [rowIndex, [data0, data1...]]
		* ]
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @return {Array}
		*
		* TODO: provide an API returning data in JSON format
		*/
		getFilteredData(includeHeaders = false, excludeHiddenCols = false) {
			return this.filteredData(includeHeaders, excludeHiddenCols, true);
		}
		/**
		* Return the filtered table values with following structure:
		* [
		*     [rowIndex, [value0, value1...]],
		*     [rowIndex, [value0, value1...]]
		* ]
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @return {Array}
		*
		* TODO: provide an API returning data in JSON format
		*/
		getFilteredValues(includeHeaders = false, excludeHiddenCols = false) {
			return this.filteredData(includeHeaders, excludeHiddenCols, false);
		}
		/**
		* Return the filtered data with following structure:
		* [
		*     [rowIndex, [value0, value1...]],
		*     [rowIndex, [value0, value1...]]
		* ]
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [excludeHiddenCols=false] Exclude hidden columns
		* @param  {Boolean} [typed=false] Return typed value
		* @return {Array}
		* @private
		*
		* TODO: provide an API returning data in JSON format
		*/
		filteredData(includeHeaders = false, excludeHiddenCols = false, typed = false) {
			if (this.validRowsIndex.length === 0) return [];
			let rows = this.dom().rows, filteredData = [];
			let getContent = typed ? this.getCellData.bind(this) : this.getCellValue.bind(this);
			if (includeHeaders) {
				let headers = this.getHeadersText(excludeHiddenCols);
				filteredData.push([this.getHeadersRowIndex(), headers]);
			}
			let validRows = this.getValidRows(true);
			for (let i = 0; i < validRows.length; i++) {
				let rData = [this.validRowsIndex[i], []], cells = rows[this.validRowsIndex[i]].cells;
				for (let k = 0; k < cells.length; k++) {
					if (excludeHiddenCols && this.hasExtension("colsVisibility")) {
						if (this.extension("colsVisibility").isColHidden(k)) continue;
					}
					let cellValue = getContent(cells[k]);
					rData[1].push(cellValue);
				}
				filteredData.push(rData);
			}
			return filteredData;
		}
		/**
		* Return the filtered data for a given column index
		* @param {any} colIndex Colmun's index
		* @param {boolean} [includeHeaders=false] Optional Include headers row
		* @param {any} [exclude=[]] Optional List of row indexes to be excluded
		* @return {Array} Flat list of typed values [data0, data1, data2...]
		*
		* TODO: provide an API returning data in JSON format
		*/
		getFilteredColumnData(colIndex, includeHeaders = false, exclude = []) {
			return this.getFilteredDataCol(colIndex, includeHeaders, true, exclude, false);
		}
		/**
		* Return the filtered and visible data for a given column index
		* @param {any} colIndex Colmun's index
		* @param {boolean} [includeHeaders=false] Optional Include headers row
		* @param {any} [exclude=[]] Optional List of row indexes to be excluded
		* @return {Array} Flat list of typed values [data0, data1, data2...]
		*
		* TODO: provide an API returning data in JSON format
		*/
		getVisibleColumnData(colIndex, includeHeaders = false, exclude = []) {
			return this.getFilteredDataCol(colIndex, includeHeaders, true, exclude, true);
		}
		/**
		* Return the filtered values for a given column index
		* @param {any} colIndex Colmun's index
		* @param {boolean} [includeHeaders=false] Optional Include headers row
		* @param {any} [exclude=[]] Optional List of row indexes to be excluded
		* @return {Array} Flat list of values ['value0', 'value1', 'value2'...]
		*
		* TODO: provide an API returning data in JSON format
		*/
		getFilteredColumnValues(colIndex, includeHeaders = false, exclude = []) {
			return this.getFilteredDataCol(colIndex, includeHeaders, false, exclude, false);
		}
		/**
		* Return the filtered and visible values for a given column index
		* @param {any} colIndex Colmun's index
		* @param {boolean} [includeHeaders=false] Optional Include headers row
		* @param {any} [exclude=[]] Optional List of row indexes to be excluded
		* @return {Array} Flat list of values ['value0', 'value1', 'value2'...]
		*
		* TODO: provide an API returning data in JSON format
		*/
		getVisibleColumnValues(colIndex, includeHeaders = false, exclude = []) {
			return this.getFilteredDataCol(colIndex, includeHeaders, false, exclude, true);
		}
		/**
		* Return the filtered data for a given column index
		* @param  {Number} colIndex Colmun's index
		* @param  {Boolean} [includeHeaders=false] Include headers row
		* @param  {Boolean} [typed=false] Return typed value
		* @param  {Array} [exclude=[]] List of row indexes to be excluded
		* @param  {Boolean} [visible=true] Return only filtered and visible data
		*                           (relevant for paging)
		* @return {Array}           Flat list of values ['val0','val1','val2'...]
		* @private
		*
		* TODO: provide an API returning data in JSON format
		*/
		getFilteredDataCol(colIndex, includeHeaders = false, typed = false, exclude = [], visible = true) {
			if (isUndef(colIndex)) return [];
			let rows = this.dom().rows;
			let getContent = typed ? this.getCellData.bind(this) : this.getCellValue.bind(this);
			let validColValues = this.getValidRows(true).filter((rowIdx) => {
				return exclude.indexOf(rowIdx) === -1 && (visible ? this.getRowDisplay(rows[rowIdx]) !== "none" : true);
			}).map((rowIdx) => {
				return getContent(rows[rowIdx].cells[colIndex]);
			});
			if (includeHeaders) validColValues.unshift(this.getHeadersText()[colIndex]);
			return validColValues;
		}
		/**
		* Get the display value of a row
		* @param  {HTMLTableRowElement} row DOM element of the row
		* @return {String}     Usually 'none' or ''
		*/
		getRowDisplay(row) {
			return row.style.display;
		}
		/**
		* Validate/invalidate row by setting the 'validRow' attribute on the row
		* @param  {Number}  rowIndex Index of the row
		* @param  {Boolean} isValid
		*/
		validateRow(rowIndex, isValid) {
			let row = this.dom().rows[rowIndex];
			if (!row || !isBoolean(isValid)) return;
			if (this.excludeRows.indexOf(rowIndex) !== -1) isValid = true;
			let displayFlag = isValid ? "" : NONE, validFlag = isValid ? "true" : "false";
			row.style.display = displayFlag;
			if (this.paging) row.setAttribute("validRow", validFlag);
			if (isValid) {
				if (this.validRowsIndex.indexOf(rowIndex) === -1) this.validRowsIndex.push(rowIndex);
				this.onRowValidated(this, rowIndex);
				this.emitter.emit("row-validated", this, rowIndex);
			}
		}
		/**
		* Validate all filterable rows
		*/
		validateAllRows() {
			if (!this.initialized) return;
			this.validRowsIndex = [];
			for (let k = this.refRow; k < this.nbFilterableRows; k++) this.validateRow(k, true);
		}
		/**
		* Set search value to a given filter
		* @param {Number} index     Column's index
		* @param {String or Array} query  searcharg Search term
		*/
		setFilterValue(index, query = "") {
			if (!this.fltGrid) return;
			let slc = this.getFilterElement(index), fltColType = this.getFilterType(index);
			if (!slc) return;
			if (fltColType === "multiple") {
				let values = isArray(query) ? query : query.split(" " + this.orOperator + " ");
				if (this.loadFltOnDemand && !this.initialized) this.emitter.emit("build-select-filter", this, index, this.linkedFilters, this.isExternalFlt());
				this.emitter.emit("select-options", this, index, values);
			} else if (fltColType === "checklist") {
				let values = [];
				if (this.loadFltOnDemand && !this.initialized) this.emitter.emit("build-checklist-filter", this, index, this.linkedFilters);
				if (isArray(query)) values = query;
				else {
					query = matchCase(query, this.caseSensitive);
					values = query.split(" " + this.orOperator + " ");
				}
				this.emitter.emit("select-checklist-options", this, index, values);
			} else {
				if (this.loadFltOnDemand && !this.initialized) this.emitter.emit("build-select-filter", this, index, this.linkedFilters, this.isExternalFlt());
				slc.value = query;
			}
		}
		/**
		* Make passed or default working table element width fixed
		* @param {TableElement} tbl optional table DOM element
		*/
		setFixedLayout(tbl = this.dom()) {
			let colWidths = this.colWidths;
			let tableWidth = tbl.clientWidth;
			if (colWidths.length > 0) {
				let defaultWidth = this.defaultColWidth;
				tableWidth = colWidths.reduce((x, y) => parseInt(x || defaultWidth, 10) + parseInt(y || defaultWidth, 10));
			}
			tbl.style.width = `${tableWidth}px`;
			tbl.style.tableLayout = "fixed";
		}
		/**
		* Set passed or default working table columns' widths with configuration
		* values
		* @param {TableElement} tbl optional table DOM element
		*/
		setColWidths(tbl = this.dom()) {
			let colWidths = this.colWidths;
			if (colWidths.length === 0) return;
			let colTags = tag(tbl, "col");
			let tblHasColTag = colTags.length > 0;
			let frag = !tblHasColTag ? doc.createDocumentFragment() : null;
			this.eachCol((k) => {
				let col;
				if (tblHasColTag) col = colTags[k];
				else {
					col = createElm("col");
					frag.appendChild(col);
				}
				col.style.width = colWidths[k];
			});
			if (!tblHasColTag) tbl.insertBefore(frag, tbl.firstChild);
		}
		/**
		* Exclude rows from actions
		*/
		setExcludeRows() {
			if (!this.hasExcludedRows) return;
			this.excludeRows.forEach((rowIdx) => this.validateRow(rowIdx, true));
		}
		/**
		* Clear all the filters' values
		*/
		clearFilters() {
			if (!this.fltGrid) return;
			this.emitter.emit("before-clearing-filters", this);
			this.onBeforeReset(this, this.getFiltersValue());
			for (let i = 0, len = this.fltIds.length; i < len; i++) this.setFilterValue(i, "");
			this.filter();
			this.onAfterReset(this);
			this.emitter.emit("after-clearing-filters", this);
		}
		/**
		* Return the ID of the current active filter
		* @return {String}
		*/
		getActiveFilterId() {
			return this.activeFilterId;
		}
		/**
		* Set the ID of the current active filter
		* @param {String} filterId Element ID
		*/
		setActiveFilterId(filterId) {
			this.activeFilterId = filterId;
		}
		/**
		* Return the column index for a given filter ID
		* @param {string} [filterId=''] Filter ID
		* @return {Number} Column index
		*/
		getColumnIndexFromFilterId(filterId = "") {
			let idx = filterId.split("_")[0];
			idx = idx.split(this.prfxFlt)[1];
			return parseInt(idx, 10);
		}
		/**
		* Build filter element ID for a given column index
		* @param {any} colIndex
		* @return {String} Filter element ID string
		* @private
		*/
		buildFilterId(colIndex) {
			return `${this.prfxFlt}${colIndex}_${this.id}`;
		}
		/**
		* Check if has external filters
		* @returns {Boolean}
		* @private
		*/
		isExternalFlt() {
			return this.externalFltIds.length > 0;
		}
		/**
		* Returns styles path
		* @returns {String}
		* @private
		*/
		getStylePath() {
			return defaultsStr(this.config.style_path, this.basePath + "style/");
		}
		/**
		* Returns main stylesheet path
		* @returns {String}
		* @private
		*/
		getStylesheetPath() {
			return defaultsStr(this.config.stylesheet, this.getStylePath() + "tablefilter.css");
		}
		/**
		* Returns themes path
		* @returns {String}
		* @private
		*/
		getThemesPath() {
			return defaultsStr(this.config.themes_path, this.getStylePath() + "themes/");
		}
		/**
		* Make specified column's filter active
		* @param colIndex Index of a column
		*/
		activateFilter(colIndex) {
			if (isUndef(colIndex)) return;
			this.setActiveFilterId(this.getFilterId(colIndex));
		}
		/**
		* Determine if passed filter column implements exact query match
		* @param  {Number}  colIndex   Column index
		* @return {Boolean}
		*/
		isExactMatch(colIndex) {
			let fltType = this.getFilterType(colIndex);
			return this.exactMatchByCol[colIndex] || this.exactMatch || fltType !== "input";
		}
		/**
		* Check if passed row is valid
		* @param {Number} rowIndex Row index
		* @return {Boolean}
		*/
		isRowValid(rowIndex) {
			return this.getValidRows().indexOf(rowIndex) !== -1;
		}
		/**
		* Check if passed row is visible
		* @param {Number} rowIndex Row index
		* @return {Boolean}
		*/
		isRowDisplayed(rowIndex) {
			let row = this.dom().rows[rowIndex];
			return this.getRowDisplay(row) === "";
		}
		/**
		* Check if specified column filter ignores diacritics.
		* Note this is only applicable to input filter types.
		* @param {Number} colIndex    Column index
		* @return {Boolean}
		*/
		ignoresDiacritics(colIndex) {
			let ignoreDiac = this.ignoreDiacritics;
			if (isArray(ignoreDiac)) return ignoreDiac[colIndex];
			return Boolean(ignoreDiac);
		}
		/**
		* Return clear all text for specified filter column
		* @param {Number} colIndex    Column index
		* @return {String}
		*/
		getClearFilterText(colIndex) {
			let clearText = this.clearFilterText;
			if (isArray(clearText)) return clearText[colIndex];
			return clearText;
		}
		/**
		* Column iterator invoking continue and break condition callbacks if any
		* then calling supplied callback for each item
		* @param {Function} [fn=EMPTY_FN] callback
		* @param {Function} [continueFn=EMPTY_FN] continue condition callback
		* @param {Function} [breakFn=EMPTY_FN] break condition callback
		*/
		eachCol(fn = EMPTY_FN, continueFn = EMPTY_FN, breakFn = EMPTY_FN) {
			let len = this.getCellsNb(this.refRow);
			for (let i = 0; i < len; i++) {
				if (continueFn(i) === true) continue;
				if (breakFn(i) === true) break;
				fn(i);
			}
		}
		/**
		* Rows iterator starting from supplied row index or defaulting to reference
		* row index. Closure function accepts a callback function and optional
		* continue and break callbacks.
		* @param {Number} startIdx Row index from which filtering starts
		*/
		eachRow(startIdx = this.refRow) {
			return (fn = EMPTY_FN, continueFn = EMPTY_FN, breakFn = EMPTY_FN) => {
				let rows = this.dom().rows;
				let len = this.getRowsNb(true);
				for (let i = startIdx; i < len; i++) {
					if (continueFn(rows[i], i) === true) continue;
					if (breakFn(rows[i], i) === true) break;
					fn(rows[i], i);
				}
			};
		}
		/**
		* Check if passed script or stylesheet is already imported
		* @param  {String}  filePath Ressource path
		* @param  {String}  type     Possible values: 'script' or 'link'
		* @return {Boolean}
		*/
		isImported(filePath, type = "script") {
			let imported = false, attr = type === "script" ? "src" : "href", files = tag(doc, type);
			for (let i = 0, len = files.length; i < len; i++) {
				if (isUndef(files[i][attr])) continue;
				if (files[i][attr].match(filePath)) {
					imported = true;
					break;
				}
			}
			return imported;
		}
		/**
		* Import script or stylesheet
		* @param  {String}   fileId   Ressource ID
		* @param  {String}   filePath Ressource path
		* @param  {Function} callback Callback
		* @param  {String}   type     Possible values: 'script' or 'link'
		*/
		import(fileId, filePath, callback, type = "script") {
			if (this.isImported(filePath, type)) return;
			let o = this, isLoaded = false, file, head = tag(doc, "head")[0];
			if (type.toLowerCase() === "link") file = createElm("link", ["id", fileId], ["type", "text/css"], ["rel", "stylesheet"], ["href", filePath]);
			else file = createElm("script", ["id", fileId], ["type", "text/javascript"], ["src", filePath]);
			file.onload = file.onreadystatechange = () => {
				if (!isLoaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
					isLoaded = true;
					if (typeof callback === "function") callback.call(null, o);
				}
			};
			file.onerror = () => {
				throw new Error(`TableFilter could not load: ${filePath}`);
			};
			head.appendChild(file);
		}
		/**
		* Check if table has filters grid
		* @return {Boolean}
		*/
		isInitialized() {
			return this.initialized;
		}
		/**
		* Get list of filter IDs
		* @return {Array} List of filters ids
		*/
		getFiltersId() {
			return this.fltIds || [];
		}
		/**
		* Get filtered (valid) rows indexes
		* @param  {Boolean} reCalc Force calculation of filtered rows list
		* @return {Array}          List of row indexes
		*/
		getValidRows(reCalc) {
			if (!reCalc) return this.validRowsIndex;
			this.validRowsIndex = [];
			this.eachRow()((row) => {
				if (!this.paging) {
					if (this.getRowDisplay(row) !== "none") this.validRowsIndex.push(row.rowIndex);
				} else if (row.getAttribute("validRow") === "true" || row.getAttribute("validRow") === null) this.validRowsIndex.push(row.rowIndex);
			});
			return this.validRowsIndex;
		}
		/**
		* Get the index of the row containing the filters
		* @return {Number}
		*/
		getFiltersRowIndex() {
			return this.filtersRowIndex;
		}
		/**
		* Get the index of the headers row
		* @return {Number}
		*/
		getHeadersRowIndex() {
			return this.headersRow;
		}
		/**
		* Get the row index from where the filtering process start (1st filterable
		* row)
		* @return {Number}
		*/
		getStartRowIndex() {
			return this.refRow;
		}
		/**
		* Get the index of the last row
		* @return {Number}
		*/
		getLastRowIndex() {
			return this.getRowsNb(true) - 1;
		}
		/**
		* Determine whether the specified column has one of the passed types
		* @param {Number} colIndex Column index
		* @param {Array} [types=[]] List of column types
		* @return {Boolean}
		*/
		hasType(colIndex, types = []) {
			if (this.colTypes.length === 0) return false;
			let colType = this.colTypes[colIndex];
			if (isObj(colType)) colType = colType.type;
			return types.indexOf(colType) !== -1;
		}
		/**
		* Get the header DOM element for a given column index
		* @param  {Number} colIndex Column index
		* @return {Element}
		*/
		getHeaderElement(colIndex) {
			let table = this.gridLayout ? this.Mod.gridLayout.headTbl : this.dom();
			let tHead = tag(table, "thead");
			let rowIdx = this.getHeadersRowIndex();
			let header;
			if (tHead.length === 0) header = table.rows[rowIdx].cells[colIndex];
			if (tHead.length === 1) header = tHead[0].rows[rowIdx].cells[colIndex];
			return header;
		}
		/**
		* Return the list of headers' text
		* @param  {Boolean} excludeHiddenCols  Optional: exclude hidden columns
		* @return {Array} list of headers' text
		*/
		getHeadersText(excludeHiddenCols = false) {
			let headers = [];
			this.eachCol((j) => {
				let headerText = getFirstTextNode(this.getHeaderElement(j));
				headers.push(headerText);
			}, (j) => {
				if (excludeHiddenCols && this.hasExtension("colsVisibility")) return this.extension("colsVisibility").isColHidden(j);
				return false;
			});
			return headers;
		}
		/**
		* Return the filter type for a specified column
		* @param  {Number} colIndex Column's index
		* @return {String}
		*/
		getFilterType(colIndex) {
			return this.filterTypes[colIndex];
		}
		/**
		* Get the total number of filterable rows
		* @return {Number}
		*/
		getFilterableRowsNb() {
			return this.getRowsNb(false);
		}
		/**
		* Return the total number of valid rows
		* @param {Boolean} [reCalc=false] Forces calculation of filtered rows
		* @return {Number}
		*/
		getValidRowsNb(reCalc = false) {
			return this.getValidRows(reCalc).length;
		}
		/**
		* Return the working DOM element
		* @return {HTMLTableElement}
		*/
		dom() {
			return this.tbl;
		}
		/**
		* Return the decimal separator for supplied column as per column type
		* configuration or global setting
		* @param {Number} colIndex Column index
		* @returns {String} '.' or ','
		*/
		getDecimal(colIndex) {
			let decimal = this.decimalSeparator;
			if (this.hasType(colIndex, ["formatted-number"])) {
				let colType = this.colTypes[colIndex];
				if (colType.hasOwnProperty("decimal")) decimal = colType.decimal;
			}
			return decimal;
		}
		/**
		* Get the configuration object (literal object)
		* @return {Object}
		*/
		config() {
			return this.cfg;
		}
	};
	//#endregion
	exports.TableFilter = TableFilter;
});

if(typeof globalThis !== "undefined" && globalThis.TableFilter && globalThis.TableFilter.TableFilter) { globalThis.TableFilter = globalThis.TableFilter.TableFilter; }