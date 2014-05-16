//>>built
require({cache:{
'dojox/mobile/ToolBarButton':function(){
define("dojox/mobile/ToolBarButton", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff",
	"./_ItemBase"
], function(declare, domClass, domConstruct, domStyle, has, ItemBase){
/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ToolBarButton
	// summary:
	//		A button widget that is placed in the Heading widget.

	return declare("dojox.mobile.ToolBarButton", ItemBase, {
		// summary:
		//		A button widget that is placed in the Heading widget.
		// description:
		//		ToolBarButton is a button that is placed in the Heading
		//		widget. It is a subclass of dojox.mobile._ItemBase just like
		//		ListItem or IconItem. So, unlike Button, it has basically the
		//		same capability as ListItem or IconItem, such as icon support,
		//		transition, etc.

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// arrow: String
		//		Specifies "right" or "left" to be an arrow button.
		arrow: "",

		// light: Boolean
		//		If true, this widget produces only a single <span> node when it
		// 		has only an icon or only a label, and has no arrow. In that
		// 		case, you cannot have both icon and label, or arrow even with
		// 		setters.
		light: true,

		/* internal properties */
		baseClass: "mblToolBarButton",

		defaultColor: "mblColorDefault",
		selColor: "mblColorDefaultSel",

		_selStartMethod: "touch",
		_selEndMethod: "touch",

		buildRendering: function(){
			if(!this.label && this.srcNodeRef){
				this.label = this.srcNodeRef.innerHTML;
			}
			this.domNode = (this.srcNodeRef && this.srcNodeRef.tagName === "SPAN") ?
				this.srcNodeRef : domConstruct.create("span");
			this.inherited(arguments);

			if(this.light && !this.arrow && (!this.icon || !this.label)){
				this.labelNode = this.tableNode = this.bodyNode = this.iconParentNode = this.domNode;
				domClass.add(this.domNode, this.defaultColor + " mblToolBarButtonBody" +
							 (this.icon ? " mblToolBarButtonLightIcon" : " mblToolBarButtonLightText"));
				return;
			}

			this.domNode.innerHTML = "";
			if(this.arrow === "left" || this.arrow === "right"){
				this.arrowNode = domConstruct.create("span", {
					className: "mblToolBarButtonArrow mblToolBarButton" +
					(this.arrow === "left" ? "Left" : "Right") + "Arrow"
				}, this.domNode);
				domClass.add(this.domNode, "mblToolBarButtonHas" +
					(this.arrow === "left" ? "Left" : "Right") + "Arrow");
			}
			this.bodyNode = domConstruct.create("span", {className:"mblToolBarButtonBody"}, this.domNode);
			this.tableNode = domConstruct.create("table", {cellPadding:"0",cellSpacing:"0",border:"0"}, this.bodyNode);

			var row = this.tableNode.insertRow(-1);
			this.iconParentNode = row.insertCell(-1);
			this.labelNode = row.insertCell(-1);
			this.iconParentNode.className = "mblToolBarButtonIcon";
			this.labelNode.className = "mblToolBarButtonLabel";

			if(this.icon && this.icon !== "none" && this.label){
				domClass.add(this.domNode, "mblToolBarButtonHasIcon");
				domClass.add(this.bodyNode, "mblToolBarButtonLabeledIcon");
			}

			domClass.add(this.bodyNode, this.defaultColor);
			var _this = this;
			setTimeout(function(){ // for programmatic instantiation
				_this._updateArrowColor();
			}, 0);
			if(!has("webkit")){
				var cntr = 0;
				this._timer = setInterval(function(){ // compat mode browsers need this
					if(_this._updateArrowColor() || cntr++ > 3){
						clearInterval(_this._timer);
					}
				}, 500);
			}
		},

		startup: function(){
			if(this._started){ return; }

			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				this.set("icon", this.icon); // retry applying the attribute
			}
		},

		_updateArrowColor: function(){
			if(this.arrowNode && !has("ie")){
				domStyle.set(this.arrowNode, "backgroundColor", domStyle.get(this.bodyNode, "backgroundColor"));
				var s = domStyle.get(this.bodyNode, "backgroundImage");
				if(s === "none"){ return false; }					
				domStyle.set(this.arrowNode, "backgroundImage",
							 s.replace(/\(top,/, "(top left,") // webkit new
							 .replace(/0% 0%, 0% 100%/, "0% 0%, 100% 100%") // webkit old
							 .replace(/50% 0%/, "0% 0%")); // moz
			}
			return true;
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setLabelAttr: function(/*String*/text){
			this.inherited(arguments);
			domClass.toggle(this.tableNode, "mblToolBarButtonText", text);
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			if(selected){
				domClass.replace(this.bodyNode, this.selColor, this.defaultColor);
			}else{
				domClass.replace(this.bodyNode, this.defaultColor, this.selColor);
			}
			domClass.toggle(this.domNode, "mblToolBarButtonSelected", selected);
			domClass.toggle(this.bodyNode, "mblToolBarButtonBodySelected", selected);
			this._updateArrowColor();
		}
	});
});

},
'dojox/mobile/Video':function(){
define("dojox/mobile/Video", [
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"./Audio"
], function(declare, has, Audio){
	// module:
	//		dojox/mobile/Video
	// summary:
	//		A thin wrapper around the html5 <video> element.

	return declare("dojox.mobile.Video", Audio, {
		width: "200px",
		height: "150px",
		_tag: "video",

		_getEmbedRegExp: function(){
			return has("ff") ? /video\/mp4/i :
				   has.isIE >= 9 ? /video\/webm/i :
				   //has("safari") ? /video\/webm/i : //Google is gooing to provide webm plugin for safari
				   null;
		}
	});
});

},
'dojox/mobile/transition':function(){
define("dojox/mobile/transition", [
	"dojo/_base/Deferred",
	"dojo/_base/config"
], function(Deferred, config){
	/* summary: this is the wrapper module which load
	 * dojox/css3/transit conditionally. If mblCSS3Transition
	 * is set to 'dojox/css3/transit', it will be loaded as
	 * the module to conduct the view transition.
	 */
	if(config['mblCSS3Transition']){
		//require dojox/css3/transit and resolve it as the result of transitDeferred.
		var transitDeferred = new Deferred();
		require([config['mblCSS3Transition']], function(transit){
			transitDeferred.resolve(transit);
		});
		return transitDeferred;
	}
	return null;
});

},
'dojox/css3/transit':function(){
define("dojox/css3/transit", ["dojo/_base/kernel", "dojo/_base/array","dojo/dom-style","dojo/DeferredList","./transition"],
	function(dojo, darray, domStyle, DeferredList,transition){
	var transit =  function(from, to, options){
		var rev = (options && options.reverse) ? -1 : 1;
		if(!options || !options.transition || !transition[options.transition]){
			domStyle.set(from,"display","none");
			domStyle.set(to, "display", "");
			if(options.transitionDefs){
				if(options.transitionDefs[from.id]){
					options.transitionDefs[from.id].resolve(from);
				}
				if(options.transitionDefs[to.id]){
								options.transitionDefs[to.id].resolve(to);
							}
			}
		}else{
			var defs=[];
			var transit=[];
			var duration = 250;
			if(options.transition === "fade"){
				duration = 600;
			}else if (options.transition === "flip"){
				duration = 200;
			}
			domStyle.set(from, "display", ""); 
			domStyle.set(to, "display", "");
			if (from){
				//create transition to transit "from" out
				var fromTransit = transition[options.transition](from, {
					"in": false,
					direction: rev,
					duration: duration,
					deferred: (options.transitionDefs && options.transitionDefs[from.id]) ? options.transitionDefs[from.id] : null
				});
				defs.push(fromTransit.deferred);//every transition object should have a deferred.
				transit.push(fromTransit);
			}
			
			//create transition to transit "to" in					
			var toTransit = transition[options.transition](to, {
							direction: rev,
							duration: duration,
							deferred: (options.transitionDefs && options.transitionDefs[to.id]) ? options.transitionDefs[to.id] : null
						});
			defs.push(toTransit.deferred);//every transition object should have a deferred.
			transit.push(toTransit);
			
			//TODO If it is flip use the chainedPlay
			//play fromTransit and toTransit together
			if(options.transition === "flip"){
				transition.chainedPlay(transit);
			}else{
				transition.groupedPlay(transit);
			}

			return new DeferredList(defs);
			
		}
	};
	
	return transit;
});

},
'dojox/mobile/iconUtils':function(){
define("dojox/mobile/iconUtils", [
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff"
], function(array, config, connect, event, lang, domClass, domConstruct, domStyle, has){

	var dm = lang.getObject("dojox.mobile", true);

	// module:
	//		dojox/mobile/iconUtils
	// summary:
	//		Utilities to create an icon (image, css sprite image, or DOM Button)

	var iconUtils = new function(){
		this.setupSpriteIcon = function(/*DomNode*/iconNode, /*String*/iconPos){
			// summary:
			//		Sets up CSS sprite for a foreground image.
			if(iconNode && iconPos){
				var arr = array.map(iconPos.split(/[ ,]/),function(item){return item-0});
				var t = arr[0]; // top
				var r = arr[1] + arr[2]; // right
				var b = arr[0] + arr[3]; // bottom
				var l = arr[1]; // left
				domStyle.set(iconNode, {
					clip: "rect("+t+"px "+r+"px "+b+"px "+l+"px)",
					top: (iconNode.parentNode ? domStyle.get(iconNode, "top") : 0) - t + "px",
					left: -l + "px"
				});
				domClass.add(iconNode, "mblSpriteIcon");
			}
		};

		this.createDomButton = function(/*DomNode*/refNode, /*Object?*/style, /*DomNode?*/toNode){
			// summary:
			//		Creates a DOM button.
			// description:
			//		DOM button is a simple graphical object that consists of one or
			//		more nested DIV elements with some CSS styling. It can be used
			//		in place of an icon image on ListItem, IconItem, and so on.
			//		The kind of DOM button to create is given as a class name of
			//		refNode. The number of DIVs to create is searched from the style
			//		sheets in the page. However, if the class name has a suffix that
			//		starts with an underscore, like mblDomButtonGoldStar_5, then the
			//		suffixed number is used instead. A class name for DOM button
			//		must starts with 'mblDomButton'.
			// refNode:
			//		A node that has a DOM button class name.
			// style:
			//		A hash object to set styles to the node.
			// toNode:
			//		A root node to create a DOM button. If omitted, refNode is used.

			if(!this._domButtons){
				if(has("webkit")){
					var findDomButtons = function(sheet, dic){
						// summary:
						//		Searches the style sheets for DOM buttons.
						// description:
						//		Returns a key-value pair object whose keys are DOM
						//		button class names and values are the number of DOM
						//		elements they need.
						var i, j;
						if(!sheet){
							var _dic = {};
							var ss = dojo.doc.styleSheets;
							for (i = 0; i < ss.length; i++){
								ss[i] && findDomButtons(ss[i], _dic);
							}
							return _dic;
						}
						var rules = sheet.cssRules || [];
						for (i = 0; i < rules.length; i++){
							var rule = rules[i];
							if(rule.href && rule.styleSheet){
								findDomButtons(rule.styleSheet, dic);
							}else if(rule.selectorText){
								var sels = rule.selectorText.split(/,/);
								for (j = 0; j < sels.length; j++){
									var sel = sels[j];
									var n = sel.split(/>/).length - 1;
									if(sel.match(/(mblDomButton\w+)/)){
										var cls = RegExp.$1;
										if(!dic[cls] || n > dic[cls]){
											dic[cls] = n;
										}
									}
								}
							}
						}
						return dic;
					}
					this._domButtons = findDomButtons();
				}else{
					this._domButtons = {};
				}
			}

			var s = refNode.className;
			var node = toNode || refNode;
			if(s.match(/(mblDomButton\w+)/) && s.indexOf("/") === -1){
				var btnClass = RegExp.$1;
				var nDiv = 4;
				if(s.match(/(mblDomButton\w+_(\d+))/)){
					nDiv = RegExp.$2 - 0;
				}else if(this._domButtons[btnClass] !== undefined){
					nDiv = this._domButtons[btnClass];
				}
				var props = null;
				if(has("bb") && config["mblBBBoxShadowWorkaround"] !== false){
					// Removes box-shadow because BlackBerry incorrectly renders it.
					props = {style:"-webkit-box-shadow:none"};
				}
				for(var i = 0, p = node; i < nDiv; i++){
					p = p.firstChild || domConstruct.create("div", props, p);
				}
				if(toNode){
					setTimeout(function(){
						domClass.remove(refNode, btnClass);
					}, 0);
					domClass.add(toNode, btnClass);
				}
			}else if(s.indexOf(".") !== -1){ // file name
				domConstruct.create("img", {src:s}, node);
			}else{
				return null;
			}
			domClass.add(node, "mblDomButton");
			!!style && domStyle.set(node, style);
			return node;
		};

		this.createIcon = function(/*String*/icon, /*String?*/iconPos, /*DomNode?*/node, /*String?*/title, /*DomNode?*/parent, /*DomNode?*/refNode, /*String?*/pos){
			// summary:
			//		Creates or updates an icon node
			// description:
			//		If node exists, updates the existing node. Otherwise, creates a new one.
			// icon:
			//		Path for an image, or DOM button class name.
			title = title || "";
			if(icon && icon.indexOf("mblDomButton") === 0){
				// DOM button
				if(!node){
					node = domConstruct.create("div", null, refNode || parent, pos);
				}else{
					if(node.className.match(/(mblDomButton\w+)/)){
						domClass.remove(node, RegExp.$1);
					}
				}
				node.title = title;
				domClass.add(node, icon);
				this.createDomButton(node);
			}else if(icon && icon !== "none"){
				// Image
				if(!node || node.nodeName !== "IMG"){
					node = domConstruct.create("img", {
						alt: title
					}, refNode || parent, pos);
				}
				node.src = (icon || "").replace("${theme}", dm.currentTheme);
				this.setupSpriteIcon(node, iconPos);
				if(iconPos && parent){
					var arr = iconPos.split(/[ ,]/);
					domStyle.set(parent, {
						width: arr[2] + "px",
						height: arr[3] + "px"
					});
					domClass.add(parent, "mblSpriteIconParent");
				}
				connect.connect(node, "ondragstart", event, "stop");
			}
			return node;
		};

		this.iconWrapper = false;
		this.setIcon = function(/*String*/icon, /*String*/iconPos, /*DomNode*/iconNode, /*String?*/alt, /*DomNode*/parent, /*DomNode?*/refNode, /*String?*/pos){
			// summary:
			//		A setter function to set an icon.
			// description:
			//		This function is intended to be used by icon setters (e.g. _setIconAttr)
			// icon:
			//		An icon path or a DOM button class name.
			// iconPos:
			//		The position of an aggregated icon. IconPos is comma separated
			//		values like top,left,width,height (ex. "0,0,29,29").
			// iconNode:
			//		An icon node.
			// alt:
			//		An alt text for the icon image.
			// parent:
			//		Parent node of the icon.
			// refNode:
			//		A node reference to place the icon.
			// pos:
			//		The position of the icon relative to refNode.
			if(!parent || !icon && !iconNode){ return null; }
			if(icon && icon !== "none"){ // create or update an icon
				if(!this.iconWrapper && icon.indexOf("mblDomButton") !== 0 && !iconPos){ // image
					if(iconNode && iconNode.tagName === "DIV"){
						domConstruct.destroy(iconNode);
						iconNode = null;
					}
					iconNode = this.createIcon(icon, null, iconNode, alt, parent, refNode, pos);
					domClass.add(iconNode, "mblImageIcon");
				}else{ // sprite or DOM button
					if(iconNode && iconNode.tagName === "IMG"){
						domConstruct.destroy(iconNode);
						iconNode = null;
					}
					iconNode && domConstruct.empty(iconNode);
					if(!iconNode){
						iconNode = domConstruct.create("div", null, refNode || parent, pos);
					}
					this.createIcon(icon, iconPos, null, null, iconNode);
					if(alt){
						iconNode.title = alt;
					}
				}
				domClass.remove(parent, "mblNoIcon");
				return iconNode;
			}else{ // clear the icon
				domConstruct.destroy(iconNode);
				domClass.add(parent, "mblNoIcon");
				return null;
			}
		};
	};
	return iconUtils;
});

},
'dojox/mobile/Container':function(){
define("dojox/mobile/Container", [
	"dojo/_base/declare",
	"dijit/_Container",
	"./Pane"
], function(declare, Container, Pane){

/*=====
	var Container = dijit._Container;
=====*/

	// module:
	//		dojox/mobile/Container
	// summary:
	//		A simple container-type widget.

	return declare("dojox.mobile.Container", [Pane, Container], {
		// summary:
		//		A simple container-type widget.
		// description:
		//		Container is a simple container widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblContainer"
	});
});

},
'dojox/mobile/dh/PatternFileTypeMap':function(){
define("dojox/mobile/dh/PatternFileTypeMap", [
	"dojo/_base/lang"
], function(lang){

	var o = lang.getObject("dojox.mobile.dh.PatternFileTypeMap", true);

	o.map = {
		".*\.html": "html",
		".*\.json": "json"
	};

	o.add = function(/*String*/ key, /*String*/ contentType){
		this.map[key] = contentType;
	};

	o.getContentType = function(/*String*/ fileName){
		for(var key in this.map){
			if((new RegExp(key)).test(fileName)){
				return this.map[key];
			}
		}
		return null;
	};

	return o;
});

},
'dojox/mobile/_IconItemPane':function(){
define("dojox/mobile/_IconItemPane", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"./Pane",
	"./iconUtils"
], function(declare, domConstruct, Pane, iconUtils){

/*=====
	var IconItemPane = dojox.mobile._IconItemPane
=====*/

	// module:
	//		dojox/mobile/_IconItemPane
	// summary:
	//		An internal widget used for IconContainer.

	return declare("dojox.mobile._IconItemPane", Pane, {
		iconPos: "",
		closeIconRole: "",
		closeIconTitle: "",
		label: "",
		closeIcon: "mblDomButtonBlueMinus",
		baseClass: "mblIconItemPane",

		// tabIndex: String
		//		Tabindex setting for the close button so users can hit the tab
		//		key to focus on it.
		tabIndex: "0",
		_setTabIndexAttr: "closeIconNode", // sets tabIndex to closeIconNode

		buildRendering: function(){
			this.inherited(arguments);
			this.hide();
			this.closeHeaderNode = domConstruct.create("h2", {className:"mblIconItemPaneHeading"}, this.domNode);
			this.closeIconNode = domConstruct.create("div", {
				className: "mblIconItemPaneIcon",
				role: this.closeIconRole,
				title: this.closeIconTitle
			}, this.closeHeaderNode);
			this.labelNode = domConstruct.create("span", {className:"mblIconItemPaneTitle"}, this.closeHeaderNode);
			this.containerNode = domConstruct.create("div", {className:"mblContent"}, this.domNode);
		},

		show: function(){
			this.domNode.style.display = "";
		},

		hide: function(){
			this.domNode.style.display = "none";
		},

		isOpen: function(e){
			return this.domNode.style.display !== "none";
		},

		_setLabelAttr: function(/*String*/text){
			this._set("label", text);
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		},

		_setCloseIconAttr: function(icon){
			this._set("closeIcon", icon);
			this.closeIconNode = iconUtils.setIcon(icon, this.iconPos, this.closeIconNode, null, this.closeHeaderNode);
		}
	});
});

},
'dojox/mobile/TabBarButton':function(){
define("dojox/mobile/TabBarButton", [
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./iconUtils",
	"./_ItemBase",
	"./Badge",
	"./sniff"
], function(connect, declare, event, lang, dom, domClass, domConstruct, domStyle, iconUtils, ItemBase, Badge, has){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/TabBarButton
	// summary:
	//		A button widget that is placed in the TabBar widget.

	return declare("dojox.mobile.TabBarButton", ItemBase,{
		// summary:
		//		A button widget that is placed in the TabBar widget.
		// description:
		//		TabBarButton is a button that is placed in the TabBar widget. It
		//		is a subclass of dojox.mobile._ItemBase just like ListItem or
		//		IconItem. So, unlike Button, it has similar capability as
		//		ListItem or IconItem, such as icon support, transition, etc.

		// icon1: String
		//		A path for the unselected (typically dark) icon. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon1: "",

		// icon2: String
		//		A path for the selected (typically highlight) icon. If icon is
		//		not specified, the iconBase parameter of the parent widget or
		//		icon1 is used.
		icon2: "",

		// iconPos1: String
		//		The position of an aggregated unselected (typically dark)
		//		icon. IconPos1 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos1 is not
		//		specified, the iconPos parameter of the parent widget is used.
		iconPos1: "",

		// iconPos2: String
		//		The position of an aggregated selected (typically highlight)
		//		icon. IconPos2 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos2 is not
		//		specified, the iconPos parameter of the parent widget or
		//		iconPos1 is used.
		iconPos2: "",

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// transition: String
		//		A type of animated transition effect.
		transition: "none",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		badge: "",

		/* internal properties */	
		baseClass: "mblTabBarButton",
		closeIcon: "mblDomButtonWhiteCross",

		_selStartMethod: "touch",
		_selEndMethod: "touch",

		destroy: function(){
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
		},

		inheritParams: function(){
			// summary:
			//		Overrides dojox.mobile._ItemBase.inheritParams().
			if(this.icon && !this.icon1){ this.icon1 = this.icon; }
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }

				if(parent.closable){
					if(!this.icon1){
						this.icon1 = this.closeIcon;
					}
					if(!this.icon2){
						this.icon2 = this.closeIcon;
					}
					domClass.add(this.domNode, "mblTabBarButtonClosable");
				}
			}
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);

			if(this.srcNodeRef){
				if(!this.label){
					this.label = lang.trim(this.srcNodeRef.innerHTML);
				}
				this.srcNodeRef.innerHTML = "";
			}

			this.labelNode = this.box = domConstruct.create("div", {className:"mblTabBarButtonLabel"}, this.domNode);

			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }

			this._dragstartHandle = this.connect(this.domNode, "ondragstart", event.stop);
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers
			var parent = this.getParent();
			if(parent && parent.closable){
				this._clickCloseHandler = this.connect(this.iconDivNode, "onclick", "_onCloseButtonClick");
				this._keydownCloseHandler = this.connect(this.iconDivNode, "onkeydown", "_onCloseButtonClick"); // for desktop browsers
				this.iconDivNode.tabIndex = "0";
			}

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				this.set({icon1:this.icon1, icon2:this.icon2}); // retry applying the attribute
			}
			dom.setSelectable(this.domNode, false);
		},

		onClose: function(e){
			connect.publish("/dojox/mobile/tabClose", [this]);
			return this.getParent().onCloseButtonClick(this);
		},

		_onCloseButtonClick: function(e){
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onCloseButtonClick(e) === false){ return; } // user's click action
			if(this.onClose()){
				this.destroy();
			}
		},

		onCloseButtonClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setIcon: function(icon, n){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this._set("icon" + n, icon);
			if(!this.iconDivNode){
				this.iconDivNode = domConstruct.create("div", {className:"mblTabBarButtonIconArea"}, this.domNode, "first");
				// mblTabBarButtonDiv -> mblTabBarButtonIconArea
			}
			if(!this["iconParentNode" + n]){
				this["iconParentNode" + n] = domConstruct.create("div", {className:"mblTabBarButtonIconParent mblTabBarButtonIconParent" + n}, this.iconDivNode);
				// mblTabBarButtonIcon -> mblTabBarButtonIconParent
			}
			this["iconNode" + n] = iconUtils.setIcon(icon, this["iconPos" + n],
				this["iconNode" + n], this.alt, this["iconParentNode" + n]);
			this["icon" + n] = icon;
			domClass.toggle(this.domNode, "mblTabBarButtonHasIcon", icon && icon !== "none");
		},

		_setIcon1Attr: function(icon){
			this._setIcon(icon, 1);
		},

		_setIcon2Attr: function(icon){
			this._setIcon(icon, 2);
		},

		_getBadgeAttr: function(){
			return this.badgeObj && this.badgeObj.domNode.parentNode &&
				this.badgeObj.domNode.parentNode.nodeType == 1 ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:11});
				domStyle.set(this.badgeObj.domNode, {
					position: "absolute",
					top: "0px",
					right: "0px"
				});
			}
			this.badgeObj.setValue(value);
			if(value){
				this.domNode.appendChild(this.badgeObj.domNode);
			}else{
				if(this.domNode === this.badgeObj.domNode.parentNode){
					this.domNode.removeChild(this.badgeObj.domNode);
				}
			}
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domClass.toggle(this.domNode, "mblTabBarButtonSelected", selected);
		}
	});
});

},
'dojox/mobile/dh/JsonContentHandler':function(){
define("dojox/mobile/dh/JsonContentHandler", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/json",
	"dojo/dom-construct"
], function(array, declare, lang, Deferred, json, domConstruct){

	// module:
	//		dojox/mobile/dh/JsonContentHandler
	// summary:
	//		A JSON content handler.

	return declare("dojox.mobile.dh.JsonContentHandler", null, {
		// summary:
		//		A JSON content handler.
		// description:
		//		This module is a content handler that creates a view from JSON
		//		data. If widgets used in the JSON data are not available, they
		//		are loaded automatically before instantiation.
		//
		//		There are two formats as shown in the examples below. You can
		//		choose either of them. The v1.7 format can be more compact, but
		//		if you want multiple widgets at the same level, they must be in
		//		an array. So, you can have, for example, two consecutive
		//		RoundRectLists, but you cannot have, for example,
		//		RoundRectCategory, RoundRectList, RoundRectCategory, and
		//		RoundRectList, because they are keys in one JS object, which
		//		causes conflict. The v1.8 format has no such limitation.
		//
		// example:
		// |	// v1.7 format
		// |	{
		// |	  "dojox.mobile.View": {
		// |	    "@id": "view1",
		// |	    "dojox.mobile.Heading": {
		// |	      "@back": "Home",
		// |	      "@moveTo": "home",
		// |	      "@label": "view1.json"
		// |	    },
		// |	    "dojox.mobile.EdgeToEdgeList": {
		// |	      "dojox.mobile.ListItem": [{
		// |	        "@label": "Jack Coleman"
		// |	      }, {
		// |	        "@label": "James Evans"
		// |	      }, {
		// |	        "@label": "Jason Griffin"
		// |	      }]
		// |	    }
		// |	  }
		// |	}
		// |	
		// example:
		// |	// v1.8 format
		// |	{
		// |	  "class": "dojox.mobile.View",
		// |	  "@id": "view1",
		// |	  "children": [
		// |	
		// |	    {
		// |	      "class": "dojox.mobile.Heading",
		// |	      "@back": "Home",
		// |	      "@moveTo": "home",
		// |	      "@label": "view1.json"
		// |	    },
		// |	
		// |	    {
		// |	      "class": "dojox.mobile.EdgeToEdgeList",
		// |	      "children": [
		// |	        {
		// |	          "class": "dojox.mobile.ListItem",
		// |	          "@label": "Jack Coleman"
		// |	        },
		// |	        {
		// |	          "class": "dojox.mobile.ListItem",
		// |	          "@label": "James Evans"
		// |	        },
		// |	        {
		// |	          "class": "dojox.mobile.ListItem",
		// |	          "@label": "Jason Griffin"
		// |	        }
		// |	      ]
		// |	    }
		// |	
		// |	  ]
		// |	}
		// |	
		// example:
		// |	// SpinWheel in v1.8 format
		// |	{
		// |	  "class": "dojox.mobile.View",
		// |	  "@id": "view1",
		// |	  "children": [
		// |	    {
		// |	      "class": "dojox.mobile.SpinWheel",
		// |	      "@id": "spin1",
		// |	      "@style": {"margin":"10px auto","width":"304px"},
		// |	      "children": [
		// |	        {
		// |	          "class": "dojox.mobile.SpinWheelSlot",
		// |	          "@labels": "A,B,C,D,E",
		// |	          "@style": {"textAlign":"center","width":"300px"}
		// |	        }
		// |	      ]
		// |	    }
		// |	  ]
		// |	}

		parse: function(/*String*/ text, /*DomNode*/ target, /*DomNode*/ refNode){
			var view, container = domConstruct.create("DIV");
			target.insertBefore(container, refNode);
			this._ws = [];
			this._req = [];
			var root = json.parse(text);
			return Deferred.when(this._loadPrereqs(root), lang.hitch(this, function(){
				view = this._instantiate(root, container);
				view.style.visibility = "hidden";
				array.forEach(this._ws, function(w){
					if(!w._started && w.startup){
						w.startup();
					}
				});
				this._ws = null;
				return view.id;
			}));
		},

		_loadPrereqs: function(root){
			var d = new Deferred();
			var req = this._collectRequires(root);
			if(req.length === 0){ return true; }

			if(dojo.require){
				array.forEach(req, function(c){
					dojo["require"](c);
				});
				return true;
			}else{
				req = array.map(req, function(s){ return s.replace(/\./g, "/"); });
				require(req, function(){
					d.resolve(true);
				});
			}
			return d;
		},

		_collectRequires: function(obj){
			var className = obj["class"];
			for(var key in obj){
				if(key.charAt(0) == "@" || key === "children"){ continue; }
				var cls = className || key.replace(/:.*/, "");
				this._req.push(cls);
				if(!cls){ continue; }
				var objs = className ? [obj] :
						(lang.isArray(obj[key]) ? obj[key] : [obj[key]]);
				for(var i = 0; i < objs.length; i++){
					// process child widgets
					if(!className){
						this._collectRequires(objs[i]);
					}else if(objs[i].children){
						for(var j = 0; j < objs[i].children.length; j++){
							this._collectRequires(objs[i].children[j]);
						}
					}
				}
			}
			return this._req;
		},

		_instantiate: function(/*Object*/obj, /*DomNode*/node, /*Widget*/parent){
			// summary:
			//		Given the evaluated json data, does the same thing as what
			//		the parser does.
			var widget;
			var className = obj["class"];
			for(var key in obj){
				if(key.charAt(0) == "@" || key === "children"){ continue; }
				var cls = lang.getObject(className || key.replace(/:.*/, ""));
				if(!cls){ continue; }
				var proto = cls.prototype,
					objs = className ? [obj] :
						(lang.isArray(obj[key]) ? obj[key] : [obj[key]]);
				for(var i = 0; i < objs.length; i++){
					var params = {};
					for(var prop in objs[i]){
						if(prop.charAt(0) == "@"){
							var v = objs[i][prop];
							prop = prop.substring(1);
							var t = typeof proto[prop];
							if(lang.isArray(proto[prop])){
								params[prop] = v.split(/\s*,\s*/);
							}else if(t === "string"){
								params[prop] = v;
							}else if(t === "number"){
								params[prop] = v - 0;
							}else if(t === "boolean"){
								params[prop] = (v !== "false");
							}else if(t === "object"){
								params[prop] = json.parse(v);
							}else if(t === "function"){
								params[prop] = lang.getObject(v, false) || new Function(v);
							}
						}
					}
					widget = new cls(params, node);
					if(node){ // to call View's startup()
						this._ws.push(widget);
					}
					if(parent){
						widget.placeAt(parent.domNode);
						if(parent._started){
							widget.startup();
						}
					}
					// process child widgets
					if(!className){
						this._instantiate(objs[i], null, widget);
					}else if(objs[i].children){
						for(var j = 0; j < objs[i].children.length; j++){
							this._instantiate(objs[i].children[j], null, widget);
						}
					}
				}
			}
			return widget && widget.domNode;
		}
	});
});

},
'dojox/mobile/_ScrollableMixin':function(){
define("dojox/mobile/_ScrollableMixin", [
	"dojo/_base/kernel",
	"dojo/_base/config",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dijit/registry",	// registry.byNode
	"./scrollable"
], function(dojo, config, declare, lang, win, dom, domClass, registry, Scrollable){
	// module:
	//		dojox/mobile/_ScrollableMixin
	// summary:
	//		Mixin for widgets to have a touch scrolling capability.

	var cls = declare("dojox.mobile._ScrollableMixin", null, {
		// summary:
		//		Mixin for widgets to have a touch scrolling capability.
		// description:
		//		Actual implementation is in scrollable.js.
		//		scrollable.js is not a dojo class, but just a collection
		//		of functions. This module makes scrollable.js a dojo class.

		// fixedHeader: String
		//		Id of the fixed header.
		fixedHeader: "",

		// fixedFooter: String
		//		Id of the fixed footer.
		fixedFooter: "",

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// allowNestedScrolls: Boolean
		//		e.g. Allow ScrollableView in a SwapView.
		allowNestedScrolls: true,

		appBars: true, // search for application-level bars

		constructor: function(){
			this.scrollableParams = {};
		},

		destroy: function(){
			this.cleanup();
			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }
			this.findAppBars();
			var node, params = this.scrollableParams;
			if(this.fixedHeader){
				node = dom.byId(this.fixedHeader);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalHeader = true;
				}
				params.fixedHeaderHeight = node.offsetHeight;
			}
			if(this.fixedFooter){
				node = dom.byId(this.fixedFooter);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalFooter = true;
					node.style.bottom = "0px";
				}
				params.fixedFooterHeight = node.offsetHeight;
			}
			this.scrollType = this.scrollType || config["mblScrollableScrollType"] || 0;
			this.init(params);
			if(this.allowNestedScrolls){
				for(var p = this.getParent(); p; p = p.getParent()){
					if(p && p.scrollableParams){
						this.dirLock = true;
						p.dirLock = true;
						break;
					}
				}
			}
			// subscribe to afterResizeAll to scroll the focused input field into view
			// so as not to break layout on orientation changes while keyboard is shown (#14991)
			this._resizeHandle = this.subscribe("/dojox/mobile/afterResizeAll", function(){
				if(this.domNode.style.display === 'none'){ return; }
				var elem = win.doc.activeElement;
				if(this.isFormElement(elem) && dom.isDescendant(elem, this.containerNode)){
					this.scrollIntoView(elem);
				}
			});
			this.inherited(arguments);
		},

		findAppBars: function(){
			// summary:
			//		Search for application-specific header or footer.
			if(!this.appBars){ return; }
			var i, len, c;
			for(i = 0, len = win.body().childNodes.length; i < len; i++){
				c = win.body().childNodes[i];
				this.checkFixedBar(c, false);
			}
			if(this.domNode.parentNode){
				for(i = 0, len = this.domNode.parentNode.childNodes.length; i < len; i++){
					c = this.domNode.parentNode.childNodes[i];
					this.checkFixedBar(c, false);
				}
			}
			this.fixedFooterHeight = this.fixedFooter ? this.fixedFooter.offsetHeight : 0;
		},

		checkFixedBar: function(/*DomNode*/node, /*Boolean*/local){
			// summary:
			//		Checks if the given node is a fixed bar or not.
			if(node.nodeType === 1){
				var fixed = node.getAttribute("fixed")
					|| (registry.byNode(node) && registry.byNode(node).fixed);
				if(fixed === "top"){
					domClass.add(node, "mblFixedHeaderBar");
					if(local){
						node.style.top = "0px";
						this.fixedHeader = node;
					}
					return fixed;
				}else if(fixed === "bottom"){
					domClass.add(node, "mblFixedBottomBar");
					this.fixedFooter = node;
					return fixed;
				}
			}
			return null;
		}
	});
	lang.extend(cls, new Scrollable(dojo, dojox));
	return cls;
});

},
'dojox/mobile/ValuePicker':function(){
define("dojox/mobile/ValuePicker", [
	"dojo/_base/declare",
	"./_PickerBase",
	"./ValuePickerSlot" // to load ValuePickerSlot for you (no direct references)
], function(declare, PickerBase){

	// module:
	//		dojox/mobile/ValuePicker
	// summary:
	//		A value picker that has stepper.

	return declare("dojox.mobile.ValuePicker", PickerBase, {
		// summary:
		//		A value picker that has stepper.
		// description:
		//		ValuePicker is a widget for selecting some values. The values
		//		can be selected by the Plus button, the Minus button, or the
		//		input field

		/* internal properties */	
		baseClass: "mblValuePicker",

		onValueChanged: function(/*Widget*/slot){
		}
	});
});

},
'dojox/mobile/_ListTouchMixin':function(){
define("dojox/mobile/_ListTouchMixin", [
	"dojo/_base/declare",
	"dojo/_base/event",
	"dijit/form/_ListBase"
], function(declare, event, ListBase){

	/*=====
		ListBase = dijit.form._ListBase;
	=====*/
	return declare( "dojox.mobile._ListTouchMixin", ListBase, {
		// summary:
		//		Focus-less menu to handle touch events consistently
		//		Abstract methods that must be defined externally:
		//			onClick: item was chosen (mousedown somewhere on the menu and mouseup somewhere on the menu)
		// tags:
		//		private
	
		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.domNode, "onclick", "_onClick");
		},
	
		_onClick: function(/*Event*/ evt){
			event.stop(evt);
			var target = this._getTarget(evt);
			if(target){
				this._setSelectedAttr(target);
				this.onClick(target);
			}
		}
	});
});

},
'dojox/mobile/EdgeToEdgeDataList':function(){
define("dojox/mobile/EdgeToEdgeDataList", [
	"dojo/_base/declare",
	"./EdgeToEdgeList",
	"./_DataListMixin"
], function(declare, EdgeToEdgeList, DataListMixin){

/*=====
	var EdgeToEdgeList = dojox.mobile.EdgeToEdgeList;
	var DataListMixin = dojox.mobile._DataListMixin;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeDataList
	// summary:
	//		An enhanced version of EdgeToEdgeList.

	return declare("dojox.mobile.EdgeToEdgeDataList", [EdgeToEdgeList, DataListMixin],{
		// summary:
		//		An enhanced version of EdgeToEdgeList.
		// description:
		//		EdgeToEdgeDataList is an enhanced version of EdgeToEdgeList. It
		//		can generate ListItems according to the given dojo.data store.
	});
});

},
'dojox/mobile/GridLayout':function(){
define("dojox/mobile/GridLayout", [
	"dojo/_base/declare",
	"./IconMenu"
], function(declare, IconMenu){
	// module:
	//		dojox/mobile/GridLayout
	// summary:
	//		A container widget that places its children in the grid layout.

	return declare("dojox.mobile.GridLayout", IconMenu, {
		cols: 0,
		childItemClass: "mblGridItem",
		baseClass: "mblGridLayout",
		_tags: "div",
		_createTerminator: true
	});
});

},
'dojox/mobile/uacss':function(){
define("dojox/mobile/uacss", [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/window",
	"./sniff"
], function(dojo, lang, win, has){
	var html = win.doc.documentElement;
	html.className = lang.trim(html.className + " " + [
		has("bb") ? "dj_bb" : "",
		has("android") ? "dj_android" : "",
		has("iphone") ? "dj_iphone" : "",
		has("ipod") ? "dj_ipod" : "",
		has("ipad") ? "dj_ipad" : ""
	].join(" ").replace(/ +/g," "));
	return dojo;
});

},
'dojox/mobile/ExpandingTextArea':function(){
define("dojox/mobile/ExpandingTextArea", [
	"dojo/_base/declare",
	"dijit/form/_ExpandingTextAreaMixin",
	"./TextArea"
], function(declare, ExpandingTextAreaMixin, TextArea){

	/*=====
		TextArea = dojox.mobile.TextArea;
		ExpandingTextAreaMixin = dijit.form._ExpandingTextAreaMixin;
	=====*/
	return declare("dojox.mobile.ExpandingTextArea", [TextArea, ExpandingTextAreaMixin], {
		// summary:
		//		Non-templated TEXTAREA widget with the capability to adjust it's height according to the amount of data.
		//
		// description:
		//		A textarea that dynamically expands/contracts (changing it's height) as
		//		the user types, to display all the text without requiring a vertical scroll bar.
		//
		//		Takes all the parameters (name, value, etc.) that a vanilla textarea takes.
		//		Rows is not supported since this widget adjusts the height.
		//
		// example:
		// |	<textarea dojoType="dojox.mobile.ExpandingTextArea">...</textarea>

		baseClass: "mblTextArea mblExpandingTextArea"
	});
});

},
'dojox/mobile/ProgressBar':function(){
define("dojox/mobile/ProgressBar", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_WidgetBase"
], function(declare, domClass, domConstruct, WidgetBase){

/*=====
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/ProgressBar
	// summary:
	//		A progress indication widget that shows the status of a task.

	return declare("dojox.mobile.ProgressBar", WidgetBase, {
		// summary:
		//		A progress indication widget that shows the status of a task.
		// description:

		// value: String
		//		Number ("0" to maximum) or percentage ("0%" to "100%")
		//		indicating the amount of task completed.
		value: "0",

		// maximum: Number
		//		Max sample number
		maximum: 100,

		/* internal properties */	
		baseClass: "mblProgressBar",

		buildRendering: function(){
			this.inherited(arguments);
			this.progressNode = domConstruct.create("div", {
				className: "mblProgressBarProgress"
			}, this.domNode);
			this.msgNode = domConstruct.create("div", {
				className: "mblProgressBarMsg"
			}, this.domNode);
		},

		_setValueAttr: function(value){
			// summary:
			//		Sets the new value to the progress bar.
			value += "";
			this._set("value", value);

			var percent = Math.min(100, (value.indexOf("%") != -1 ?
				parseFloat(value) : this.maximum ? 100 * value / this.maximum : 0));
			this.progressNode.style.width = percent + "%";
			domClass.toggle(this.progressNode, "mblProgressBarNotStarted", !percent);
			domClass.toggle(this.progressNode, "mblProgressBarComplete", percent == 100);
			this.onChange(value, this.maximum, percent);
		},

		_setLabelAttr: function(label){
			this.msgNode.innerHTML = label;
		},

		onChange: function(/*Number*/ percent){
			// summary:
			//		User defined function called when progress updates
			// tags:
			//		callback
		}
	});
});

},
'dojox/mobile/dh/DataHandler':function(){
define("dojox/mobile/dh/DataHandler", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"./ContentTypeMap"
], function(declare, lang, Deferred, ContentTypeMap){

	// module:
	//		dojox/mobile/dh/DataHandler
	// summary:
	//		A component that provides an interface between data and handlers.

	return declare("dojox.mobile.dh.DataHandler", null, {
		ds: null,
		target: null,
		refNode: null,

		constructor: function(/*DataSource*/ ds, /*DomNode*/ target, /*DomNode*/ refNode){
			this.ds = ds;
			this.target = target;
			this.refNode = refNode;
		},

		processData: function(/*String*/ contentType, /*Function*/ callback){
			var ch = ContentTypeMap.getHandlerClass(contentType);
			require([ch], lang.hitch(this, function(ContentHandler){
				Deferred.when(this.ds.getData(), lang.hitch(this, function(){
					Deferred.when(new ContentHandler().parse(this.ds.text, this.target, this.refNode), function(id){
						callback(id);
					});
				}))
			}));
		}
	});
});

},
'dojox/mobile/_EditableListMixin':function(){

// TODO: auto scroll?

define("dojox/mobile/_EditableListMixin", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/touch",
	"dijit/registry",
	"./ListItem"
], function(array, connect, declare, event, domClass, domGeometry, domStyle, touch, registry, ListItem){

	// module:
	//		dojox/mobile/EditableRoundRectList
	// summary:
	//		A rounded rectangle list.

	return declare("dojox.mobile._EditableListMixin", null, {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		EditableRoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be
		//		dojox.mobile.ListItem.

		rightIconForEdit: "mblDomButtonGrayKnob",
		deleteIconForEdit: "mblDomButtonRedCircleMinus",

		// isEditing: Boolean
		//		A read-only flag that indicates whether the widget is in the edit mode.
		isEditing: false,

		destroy: function(){
			if(this._blankItem){
				this._blankItem.destroy();
			}
			this.inherited(arguments);
		},

		_setupMoveItem: function(/*DomNode*/node){
			domStyle.set(node, {
				width: domGeometry.getContentBox(node).w + "px",
				top: node.offsetTop + "px"
			});
			domClass.add(node, "mblListItemFloat");
		},

		_resetMoveItem: function(/*DomNode*/node){
			setTimeout(function(){ // iPhone needs setTimeout
				domClass.remove(node, "mblListItemFloat");
				domStyle.set(node, {
					width: "",
					top: ""
				});
			}, 0);
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			var item = registry.getEnclosingWidget(e.target);
			for(var n = e.target; n !== item.domNode; n = n.parentNode){
				if(n === item.deleteIconNode){
					connect.publish("/dojox/mobile/deleteListItem", [item]);
					break;
				}
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_onTouchStart: function(e){
			if(this.getChildren().length <= 1){ return; }
			if(!this._blankItem){
				this._blankItem = new ListItem();
			}
			var item = this._movingItem = registry.getEnclosingWidget(e.target);
			var rightIconPressed = false;
			for(var n = e.target; n !== item.domNode; n = n.parentNode){
				if(n === item.rightIconNode){
					rightIconPressed = true;
					break;
				}
			}
			if(!rightIconPressed){ return; }
			var ref = item.getNextSibling();
			ref = ref ? ref.domNode : null;
			this.domNode.insertBefore(this._blankItem.domNode, ref);
			this._setupMoveItem(item.domNode);
			this.domNode.appendChild(item.domNode);

			if(!this._conn){
				this._conn = [
					this.connect(this.domNode, touch.move, "_onTouchMove"),
					this.connect(this.domNode, touch.release, "_onTouchEnd")
				];
			}
			this._pos = [];
			array.forEach(this.getChildren(), function(c, index){
				this._pos.push(domGeometry.position(c.domNode, true).y);
			}, this);
			this.touchStartY = e.touches ? e.touches[0].pageY : e.pageY;
			this._startTop = domGeometry.getMarginBox(item.domNode).t;
			event.stop(e);
		},

		_onTouchMove: function(e){
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			var index = this._pos.length - 1;
			for(var i = 1; i < this._pos.length; i++){
				if(y < this._pos[i]){
					index = i - 1;
					break;
				}
			}
			var item = this.getChildren()[index];
			var blank = this._blankItem;
			if(item !== blank){
				var p = item.domNode.parentNode;
				if(item.getIndexInParent() < blank.getIndexInParent()){
					p.insertBefore(blank.domNode, item.domNode);
				}else{
					p.insertBefore(item.domNode, blank.domNode);
				}
			}
			this._movingItem.domNode.style.top = this._startTop + (y - this.touchStartY) + "px";
		},

		_onTouchEnd: function(e){
			var ref = this._blankItem.getNextSibling();
			ref = ref ? ref.domNode : null;
			this.domNode.insertBefore(this._movingItem.domNode, ref);
			this.domNode.removeChild(this._blankItem.domNode);
			this._resetMoveItem(this._movingItem.domNode);

			array.forEach(this._conn, connect.disconnect);
			this._conn = null;
		},

		startEdit: function(){
			this.isEditing = true;
			domClass.add(this.domNode, "mblEditableRoundRectList");
			array.forEach(this.getChildren(), function(child){
				if(!child.deleteIconNode){
					child.set("rightIcon", this.rightIconForEdit);
					child.set("deleteIcon", this.deleteIconForEdit);
					child.deleteIconNode.tabIndex = child.tabIndex;
				}
				child.rightIconNode.style.display = "";
				child.deleteIconNode.style.display = "";
			}, this);
			if(!this._handles){
				this._handles = [
					this.connect(this.domNode, touch.press, "_onTouchStart"),
					this.connect(this.domNode, "onclick", "_onClick"),
					this.connect(this.domNode, "onkeydown", "_onClick") // for desktop browsers
				];
			}
		},

		endEdit: function(){
			domClass.remove(this.domNode, "mblEditableRoundRectList");
			array.forEach(this.getChildren(), function(child){
				child.rightIconNode.style.display = "none";
				child.deleteIconNode.style.display = "none";
			});
			if(this._handles){
				array.forEach(this._handles, this.disconnect, this);
				this._handles = null;
			}
			this.isEditing = false;
		}
	});
});

},
'dojox/mobile/_StoreListMixin':function(){
define("dojox/mobile/_StoreListMixin", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"./_StoreMixin",
	"./ListItem"
], function(array, declare, StoreMixin, ListItem){

	// module:
	//		dojox/mobile/_StoreListMixin
	// summary:
	//		Mixin for widgets to generate the list items corresponding to the
	//		dojo.store data provider object.

	return declare("dojox.mobile._StoreListMixin", StoreMixin, {
		// summary:
		//		Mixin for widgets to generate the list items corresponding to
		//		the dojo.store data provider object.
		// description:
		//		By mixing this class into the widgets, the list item nodes are
		//		generated as the child nodes of the widget and automatically
		//		re-generated whenever the corresponding data items are modified.

		// append: Boolean
		//		If true, refresh() does not clear the existing items.
		append: false,

		// itemMap: Object
		//		An optional parameter mapping field names from the store to ItemList name.
		// example:
		// |	itemMap:{text:'label', profile_image_url:'icon' }
		itemMap: null,

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.store){ return; }
			var store = this.store;
			this.store = null;
			this.setStore(store, this.query, this.queryOptions);
		},

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			var props = {};
			if(!item["label"]){
				props["label"] = item[this.labelProperty];
			}
			for(var name in item){
				props[(this.itemMap && this.itemMap[name]) || name] = item[name];
			}
			return new ListItem(props);
		},

		generateList: function(/*Array*/items){
			// summary:
			//		Given the data, generates a list of items.
			if(!this.append){
				array.forEach(this.getChildren(), function(child){
					child.destroyRecursive();
				});
			}
			array.forEach(items, function(item, index){
				this.addChild(this.createListItem(item));
				if(item[this.childrenProperty]){
					array.forEach(item[this.childrenProperty], function(child, index){
						this.addChild(this.createListItem(child));
					}, this);
				}
			}, this);
		},

		onComplete: function(/*Array*/items){
			// summary:
			//		An handler that is called after the fetch completes.
			this.generateList(items);
		},

		onError: function(/*Object*/errorData){
			// summary:
			//		An error handler.
		},

		onUpdate: function(/*Object*/item, /*Number*/insertedInto){
			//	summary:
			//		Add a new item or update an existing item.
			if(insertedInto === this.getChildren().length){
				this.addChild(this.createListItem(item)); // add a new ListItem
			}else{
				this.getChildren()[insertedInto].set(item); // update the existing ListItem
			}
		},

		onDelete: function(/*Object*/item, /*Number*/removedFrom){
			//	summary:
			//		Delete an existing item.
			this.getChildren()[removedFrom].destroyRecursive();
		}
	});
});

},
'dojox/html/ext-dojo/style':function(){
define("dojox/html/ext-dojo/style", ["dojo/_base/kernel", "dojo/dom-style", "dojo/_base/lang", "dojo/_base/html", "dojo/_base/sniff",
		"dojo/_base/window", "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dojo/dom-attr"], 
	function(kernel, domStyle, lang, Html, has, win, DOM, DOMConstruct, DOMStyle, DOMAttr){
	kernel.experimental("dojox.html.ext-dojo.style");
	var st = lang.getObject("dojox.html.ext-dojo.style", true);
	var HtmlX = lang.getObject("dojox.html");
	// summary: Extensions to dojo.style adding the css3 "transform" and "transform-origin" properties on IE5.5+
	// description:
	//	A Package to extend the dojo.style function
	//	Supported transformation functions:
	//  matrix, translate, translateX, translateY, scale, scaleX, scaleY, rotate, skewX, skewY, skew
	lang.mixin(HtmlX["ext-dojo"].style, {
		supportsTransform: true,
		_toPx: function(measure){
			var ds = Html.style, _conversion = this._conversion;
			if(typeof measure === "number"){
				return measure + "px";
			}else if(measure.toLowerCase().indexOf("px") != -1){
				return measure;
			}
			// "native" conversion in px
			!_conversion.parentNode && DOMConstruct.place(_conversion, win.body());
			ds(_conversion, "margin", measure);
			return ds(_conversion, "margin");
		},
		init: function(){
			var docStyle = win.doc.documentElement.style, extStyle = HtmlX["ext-dojo"].style,
				sget = DOMStyle.get, sset = DOMStyle.set;
			DOMStyle.get = function(/*DOMNode|String*/ node, /*String|Object*/ name){
				var tr = (name == "transform"),
					to = (name == "transformOrigin");
				if(tr){
					return extStyle.getTransform(node);
				}else if(to){
					return extStyle.getTransformOrigin(node);
				}else{
					return arguments.length == 2 ? sget(node, name) : sget(node);
				}
			};
			DOMStyle.set = function(/*DOMNode|String*/ node, /*String|Object*/ name, /*String?*/ value){
				var tr = (name == "transform"),
					to = (name == "transformOrigin"),
					n = DOM.byId(node)
				;
				if(tr){
					return extStyle.setTransform(n, value, true);
				}else if(to){
					return extStyle.setTransformOrigin(n, value);
				}else{
					return arguments.length == 3 ? sset(n, name, value) : sset(n, name);
				}
			};
			// prefixes and property names
			for(var i = 0, tPrefix = ["WebkitT", "MozT", "OT", "msT", "t"]; i < tPrefix.length; i++){
				if(typeof docStyle[tPrefix[i] + "ransform"] !== "undefined"){
					this.tPropertyName = tPrefix[i] + "ransform";
				}
				if(typeof docStyle[tPrefix[i] + "ransformOrigin"] !== "undefined"){
					this.toPropertyName = tPrefix[i] + "ransformOrigin";
				}
			}
			if(this.tPropertyName){
				this.setTransform = function(/*DomNode*/node, /*String*/ transform){
					return DOMStyle.set(node, this.tPropertyName, transform);
				};
				this.getTransform = function(/*DomNode*/node){
					return DOMStyle.get(node, this.tPropertyName);
				};
			}else if(has("ie")){
				this.setTransform = this._setTransformFilter;
				this.getTransform = this._getTransformFilter;
			}
			if(this.toPropertyName){
				this.setTransformOrigin = function(/*DomNode*/node, /*String*/ transformOrigin){
					return sset(node, this.toPropertyName, transformOrigin);
				};
				this.getTransformOrigin = function(/*DomNode*/node){
					return sget(node, this.toPropertyName);
				};
			}else if(has("ie")){
				this.setTransformOrigin = this._setTransformOriginFilter;
				this.getTransformOrigin = this._getTransformOriginFilter;
			}else{
				this.supportsTransform = false;
			}
			this._conversion = DOMConstruct.create("div", {
				style: {
					position: "absolute",
					top: "-100px",
					left: "-100px",
					fontSize: 0,
					width: "0",
					backgroundPosition: "50% 50%"
				}
			});
		},
		_notSupported: function(){
			console.warn("Sorry, this browser doesn't support transform and transform-origin");
		},
		_setTransformOriginFilter: function(/*DomNode*/ node, /*String*/ transformOrigin){
			var to = lang.trim(transformOrigin)
				.replace(" top", " 0")
				.replace("left ", "0 ")
				.replace(" center", "50%")
				.replace("center ", "50% ")
				.replace(" bottom", " 100%")
				.replace("right ", "100% ")
				.replace(/\s+/, " "),
				toAry = to.split(" "),
				n = DOM.byId(node),
				t = this.getTransform(n),
				validOrigin = true
			;
			for(var i = 0; i < toAry.length; i++){
				validOrigin = validOrigin && /^0|(\d+(%|px|pt|in|pc|mm|cm))$/.test(toAry[i]);
				if(toAry[i].indexOf("%") == -1){
					toAry[i] = this._toPx(toAry[i]);
				}
			}
			if(!validOrigin || !toAry.length || toAry.length > 2 ){
				return transformOrigin;
			}
			Html.attr(n, "dojo-transform-origin", toAry.join(" "));
			t && this.setTransform(node, t);
			return transformOrigin;
		},
		_getTransformOriginFilter: function(/*DomNode*/ node){
			return Html.attr(node, "dojo-transform-origin") || "50% 50%";
		},
		_setTransformFilter: function(/*DomNode*/ node, /*String*/ transform){
			// Using the Matrix Filter to implement the transform property on IE
			var t = transform.replace(/\s/g, ""),
				n = DOM.byId(node),
				transforms = t.split(")"),
				toRad = 1, toRad1 = 1,
				mstr = "DXImageTransform.Microsoft.Matrix",
				hasAttr = DOMAttr.has,
				attr = Html.attr,
				// Math functions
				PI = Math.PI, cos = Math.cos, sin = Math.sin, tan = Math.tan, max = Math.max, min = Math.min, abs = Math.abs,
				degToRad = PI/180, gradToRad = PI/200,

				// current transform
				ct = "", currentTransform = "",
				matchingTransforms = [],
				x0 = 0, y0 = 0, dx = 0, dy = 0, xc = 0, yc = 0, a = 0,

				// default transform, identity matrix
				m11 = 1, m12 = 0, m21 = 0, m22 = 1,

				// no translation
				tx = 0, ty = 0,
				props = [m11, m12, m21, m22, tx, ty],
				hasMatrix = false,
				ds = Html.style,
				newPosition = ds(n, "position") == "absolute" ? "absolute" : "relative",
				w = ds(n, "width") + ds(n, "paddingLeft") + ds(n, "paddingRight"),
				h = ds(n, "height") + ds(n, "paddingTop") + ds(n, "paddingBottom"),
				toPx = this._toPx
			;

			!hasAttr(n, "dojo-transform-origin") && this.setTransformOrigin(n, "50% 50%");

			for(var i = 0, l = transforms.length; i < l; i++){
				matchingTransforms = transforms[i].match(/matrix|rotate|scaleX|scaleY|scale|skewX|skewY|skew|translateX|translateY|translate/);
				currentTransform = matchingTransforms ? matchingTransforms[0] : "";
				switch(currentTransform){
					case "matrix":
						// generic transformation
						//
						// matrix:
						// m11        m12
						//
						// m21        m22
						//
						ct = transforms[i].replace(/matrix\(|\)/g, "");
						var matrix = ct.split(",");
						m11 = props[0]*matrix[0] + props[1]*matrix[2];
						m12 = props[0]*matrix[1] + props[1]*matrix[3];
						m21 = props[2]*matrix[0] + props[3]*matrix[2];
						m22 = props[2]*matrix[1] + props[3]*matrix[3];
						tx = props[4] + matrix[4];
						ty = props[5] + matrix[5];
					break;
					case "rotate":
						// rotate
						//
						// rotation angle:
						// a (rad, deg or grad)
						//
						// matrix:
						// cos(a)     -sin(a)
						//
						// sin(a)     cos(a)
						//
						ct = transforms[i].replace(/rotate\(|\)/g, "");
						toRad = ct.indexOf("deg") != -1 ? degToRad : ct.indexOf("grad") != -1 ? gradToRad : 1;
						a = parseFloat(ct)*toRad;
						var s = sin(a),
							c = cos(a)
						;
						m11 = props[0]*c + props[1]*s;
						m12 = -props[0]*s + props[1]*c;
						m21 = props[2]*c + props[3]*s;
						m22 = -props[2]*s + props[3]*c;
					break;
					case "skewX":
						// skewX
						//
						// skew angle:
						// a (rad, deg or grad)
						//
						// matrix:
						// 1          tan(a)
						//
						// 0          1
						//
						ct = transforms[i].replace(/skewX\(|\)/g, "");
						toRad = ct.indexOf("deg") != -1 ? degToRad : ct.indexOf("grad") != -1 ? gradToRad : 1;
						var ta = tan(parseFloat(ct)*toRad);
						m11 = props[0];
						m12 = props[0]*ta + props[1];
						m21 = props[2];
						m22 = props[2]*ta + props[3];
					break;
					case "skewY":
						// skewY
						//
						// skew angle:
						// a (rad, deg or grad)
						//
						// matrix:
						// 1          0
						//
						// tan(a)     1
						//
						ct = transforms[i].replace(/skewY\(|\)/g, "");
						toRad = ct.indexOf("deg") != -1 ? degToRad : ct.indexOf("grad") != -1 ? gradToRad : 1;
						ta = tan(parseFloat(ct)*toRad);
						m11 = props[0] + props[1]*ta;
						m12 = props[1];
						m21 = props[2] + props[3]*ta;
						m22 = props[3];
					break;
					case "skew":
						// skew
						//
						// skew angles:
						// a0 (rad, deg or grad)
						// a1 (rad, deg or grad)
						//
						// matrix:
						// 1          tan(a0)
						//
						// tan(a1)    1
						//
						ct = transforms[i].replace(/skew\(|\)/g, "");
						var skewAry = ct.split(",");
						skewAry[1] = skewAry[1] || "0";
						toRad = skewAry[0].indexOf("deg") != -1 ? degToRad : skewAry[0].indexOf("grad") != -1 ? gradToRad : 1;
						toRad1 = skewAry[1].indexOf("deg") != -1 ? degToRad : skewAry[1].indexOf("grad") != -1 ? gradToRad : 1;
						var a0 = tan(parseFloat(skewAry[0])*toRad),
							a1 = tan(parseFloat(skewAry[1])*toRad1)
						;
						m11 = props[0] + props[1]*a1;
						m12 = props[0]*a0 + props[1];
						m21 = props[2]+ props[3]*a1;
						m22 = props[2]*a0 + props[3];
					break;
					case "scaleX":
						// scaleX
						//
						// scale factor:
						// sx
						//
						// matrix:
						// sx         0
						//
						// 0          1
						//
						ct = parseFloat(transforms[i].replace(/scaleX\(|\)/g, "")) || 1;
						m11 = props[0]*ct;
						m12 = props[1];
						m21 = props[2]*ct;
						m22 = props[3];
					break;
					case "scaleY":
						// scaleY
						//
						// scale factor:
						// sy
						//
						// matrix:
						// 1          0
						//
						// 0          sy
						//
						ct = parseFloat(transforms[i].replace(/scaleY\(|\)/g, "")) || 1;
						m11 = props[0];
						m12 = props[1]*ct;
						m21 = props[2];
						m22 = props[3]*ct;
					break;
					case "scale":
						// scale
						//
						// scale factor:
						// sx, sy
						//
						// matrix:
						// sx         0
						//
						// 0          sy
						//
						ct = transforms[i].replace(/scale\(|\)/g, "");
						var scaleAry = ct.split(",");
						scaleAry[1] = scaleAry[1] || scaleAry[0];
						m11 = props[0]*scaleAry[0];
						m12 = props[1]*scaleAry[1];
						m21 = props[2]*scaleAry[0];
						m22 = props[3]*scaleAry[1];
					break;
					case "translateX":
						ct = parseInt(transforms[i].replace(/translateX\(|\)/g, "")) || 1;
						m11 = props[0];
						m12 = props[1];
						m21 = props[2];
						m22 = props[3];
						tx = toPx(ct);
						tx && attr(n, "dojo-transform-matrix-tx", tx);
					break;
					case "translateY":
						ct = parseInt(transforms[i].replace(/translateY\(|\)/g, "")) || 1;
						m11 = props[0];
						m12 = props[1];
						m21 = props[2];
						m22 = props[3];
						ty = toPx(ct);
						ty && attr(n, "dojo-transform-matrix-ty", ty);
					break;
					case "translate":
						ct = transforms[i].replace(/translate\(|\)/g, "");
						m11 = props[0];
						m12 = props[1];
						m21 = props[2];
						m22 = props[3];
						var translateAry = ct.split(",");
						translateAry[0] = parseInt(toPx(translateAry[0])) || 0;
						translateAry[1] = parseInt(toPx(translateAry[1])) || 0;
						tx = translateAry[0];
						ty = translateAry[1];
						tx && attr(n, "dojo-transform-matrix-tx", tx);
						ty && attr(n, "dojo-transform-matrix-ty", ty);
					break;
				}
				props = [m11, m12, m21, m22, tx, ty];
			}
			// test
			var Bx = min(w*m11 + h*m12, min(min(w*m11, h*m12), 0)),
				By = min(w*m21 + h*m22, min(min(w*m21, h*m22), 0))
			;
			dx = -Bx;
			dy = -By;
			if(has("ie") < 8){
				// on IE < 8 the node must have hasLayout = true
				n.style.zoom = "1";
				if(newPosition != "absolute"){
					var parentWidth = ds(node.parentNode, "width"),
						tw = abs(w*m11),
						th = abs(h*m12),
						wMax = max(tw + th, max(max(th, tw), 0))
					;
					dx -= (wMax - w) / 2 - (parentWidth > wMax ? 0 : (wMax - parentWidth) / 2);
				}
			}else if(has("ie") == 8){
				// IE8 bug, a filter is applied to positioned descendants
				// only if the parent has z-index
				ds(n, "zIndex") == "auto" && (n.style.zIndex = "0");
			}

			try{
				hasMatrix = !!n.filters.item(mstr);
			}catch(e){
				hasMatrix = false;
			}
			if(hasMatrix){
				n.filters.item(mstr).M11 = m11;
				n.filters.item(mstr).M12 = m12;
				n.filters.item(mstr).M21 = m21;
				n.filters.item(mstr).M22 = m22;
				// use 'nearest' for a faster transform
				n.filters.item(mstr).filterType = 'bilinear';
				n.filters.item(mstr).Dx = 0;
				n.filters.item(mstr).Dy = 0;
				n.filters.item(mstr).sizingMethod = 'auto expand';
			}else{
				n.style.filter +=
					" progid:" + mstr + "(M11=" + m11 +
					",M12=" + m12 +
					",M21=" + m21 +
					",M22=" + m22 +
					",FilterType='bilinear',Dx=0,Dy=0,sizingMethod='auto expand')"
				;
			}
			tx = parseInt(attr(n, "dojo-transform-matrix-tx") || "0");
			ty = parseInt(attr(n, "dojo-transform-matrix-ty") || "0");

			// transform origin
			var toAry = attr(n, "dojo-transform-origin").split(" ");

			for(i = 0; i < 2; i++){
				toAry[i] = toAry[i] || "50%";
			}
			xc = (toAry[0].toString().indexOf("%") != -1) ? w * parseInt(toAry[0]) * .01 : toAry[0];
			yc = (toAry[1].toString().indexOf("%") != -1) ? h * parseInt(toAry[1]) * .01 : toAry[1];
			if(hasAttr(n, "dojo-startX")){
				x0 = parseInt(attr(n, "dojo-startX"));
			}else{
				x0 = parseInt(ds(n, "left"));
				attr(n, "dojo-startX", newPosition == "absolute" ? x0 : "0");
			}
			if(hasAttr(n, "dojo-startY")){
				y0 = parseInt(attr(n, "dojo-startY"));
			}else{
				y0 = parseInt(ds(n, "top"));
				attr(n, "dojo-startY", newPosition == "absolute" ? y0 : "0");
			}
			ds(n, {
				position: newPosition,
				left: x0 - parseInt(dx) + parseInt(xc) - ((parseInt(xc) - tx)*m11 + (parseInt(yc) - ty)*m12) + "px",
				top:  y0 - parseInt(dy) + parseInt(yc) - ((parseInt(xc) - tx)*m21 + (parseInt(yc) - ty)*m22) + "px"
			});
			return transform;
		},
		_getTransformFilter: function(/*DomNode*/ node){
			try{
				var n = DOM.byId(node),
					item = n.filters.item(0)
				;
				return "matrix(" + item.M11 + ", " + item.M12 + ", " + item.M21 + ", " +
					item.M22 + ", " + (Html.attr(node, "dojo-transform-tx") || "0") + ", " + (Html.attr(node, "dojo-transform-ty") || "0") + ")";
			}catch(e){
				return "matrix(1, 0, 0, 1, 0, 0)";
			}
		},
		setTransform: function(){
			this._notSupported();
		},
		setTransformOrigin: function(){
			this._notSupported();
		}
	});

	HtmlX["ext-dojo"].style.init();
	return Html.style;
});

},
'dojox/mobile/ScrollablePane':function(){
define("dojox/mobile/ScrollablePane", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./_ScrollableMixin",
	"./Pane"
], function(array, declare, has, win, dom, domConstruct, domStyle, ScrollableMixin, Pane){

	// module:
	//		dojox/mobile/ScrollablePane
	// summary:
	//		A pane that has the touch-scrolling capability.

	return declare("dojox.mobile.ScrollablePane", [Pane, ScrollableMixin], {
		// summary:
		//		A pane that has the touch-scrolling capability.

		// roundCornerMask: Boolean
		//		If true, created a rounded corner mask to clip
		//		corners of a child widget or dom node.
		//		Works only on WebKit-based browsers.
		roundCornerMask: false,

		// radius: Number
		//		Radius of the rounded corner mask.
		radius: 0,

		baseClass: "mblScrollablePane",

		buildRendering: function(){
			var c = this.containerNode = domConstruct.create("div", {
				className: "mblScrollableViewContainer",
				style: {
					width: this.scrollDir === "v" ? "100%" : ""
				}
			});
			this.inherited(arguments);

			if(this.srcNodeRef){
				// reparent
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this.containerNode.appendChild(this.srcNodeRef.firstChild);
				}
			}

			if(this.roundCornerMask && has("webkit")){
				var node = this.containerNode;
				var mask = this.maskNode = domConstruct.create("div", {
					className: "mblScrollablePaneMask",
					style: {
						webkitMaskImage: "-webkit-canvas(" + this.id + "_mask)"
					}
				});
				mask.appendChild(node);
				c = mask;
			}

			this.domNode.appendChild(c);
			dom.setSelectable(this.containerNode, false);
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.inherited(arguments); // scrollable#resize() will be called
			if(this.roundCornerMask){
				this.createRoundMask();
			}
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		isTopLevel: function(e){
			// summary:
			//		Returns true if this is a top-level widget.
			//		Overrides dojox.mobile.scrollable.
			var parent = this.getParent && this.getParent();
			return (!parent || !parent.resize); // top level widget
		},

		createRoundMask: function(){
			// summary:
			//		Creates a rounded corner rectangle mask.
			// description:
			//		This function works only on WebKit-based browsers.
			if(has("webkit")){
				if(this.domNode.offsetHeight == 0){ return; } // in a hidden view
				this.maskNode.style.height = this.domNode.offsetHeight + "px";
				var child = this.getChildren()[0],
					c = this.containerNode,
					node = child ? child.domNode :
						(c.childNodes.length > 0 && (c.childNodes[0].nodeType === 1 ? c.childNodes[0] : c.childNodes[1]));

				var r = this.radius;
				if(!r){
					var getRadius = function(n){ return parseInt(domStyle.get(n, "borderTopLeftRadius")); };
					if(child){
						r = getRadius(child.domNode);
						if(!r){
							var item = child.getChildren()[0];
							r = item ? getRadius(item.domNode) : 0;
						}
					}else{
						r = getRadius(node);
					}
				}

				var pw = this.domNode.offsetWidth, // pane width
					w = node.offsetWidth,
					h = this.domNode.offsetHeight,
					t = domStyle.get(node, "marginTop"),
					b = domStyle.get(node, "marginBottom"),
					l = domStyle.get(node, "marginLeft");

				var ctx = win.doc.getCSSCanvasContext("2d", this.id + "_mask", pw, h);
				ctx.fillStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(l + r, t);
				ctx.arcTo(l + w, t, l + w, h - b - r, r);
				ctx.arcTo(l + w, h - b, l + r, h - b, r);
				ctx.arcTo(l, h - b, l, t  +  r, r);
				ctx.arcTo(l, t, l + r, t, r);
				ctx.closePath();
				ctx.fill();
			}
		}
	});
});

},
'dojox/mobile/dh/UrlDataSource':function(){
define("dojox/mobile/dh/UrlDataSource", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/xhr"
], function(declare, lang, xhr){

	return declare("dojox.mobile.dh.UrlDataSource", null, {
		text: "",

		_url: "",

		constructor: function(/*String*/ url){
			this._url = url;
		},

		getData: function(){
			var obj = xhr.get({
				url: this._url,
				handleAs: "text"
			});
			obj.addCallback(lang.hitch(this, function(response, ioArgs){
				this.text = response;
			}));
			obj.addErrback(function(error){
				console.log("Failed to load "+this._url+"\n"+(error.description||error));
			});
			return obj; // Deferred
		}
	});
});

},
'dojox/mobile/TimePicker':function(){
define("dojox/mobile/TimePicker", [
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(declare, lang){

	// module:
	//		dojox/mobile/TimePicker
	// summary:
	//		

	var dm = lang.getObject("dojox.mobile", true);
	var pickerClass = dm.currentTheme === "android" ?
		"dojox/mobile/ValuePickerTimePicker" : "dojox/mobile/SpinWheelTimePicker";

	var cls = declare("dojox.mobile.TimePicker", null, {});

	require([pickerClass], lang.hitch(this, function(module){
		cls.prototype = module.prototype;
	}));

	return cls;
});

},
'dojox/mobile/RoundRectStoreList':function(){
define("dojox/mobile/RoundRectStoreList", [
	"dojo/_base/declare",
	"./RoundRectList",
	"./_StoreListMixin"
], function(declare, RoundRectList, StoreListMixin){

/*=====
	var RoundRectList = dojox.mobile.RoundRectList;
	var StoreListMixin = dojox.mobile._StoreListMixin;
=====*/

	// module:
	//		dojox/mobile/RoundRectStoreList
	// summary:
	//		An enhanced version of RoundRectList.

	return declare("dojox.mobile.RoundRectStoreList", [RoundRectList, StoreListMixin], {
		// summary:
		//		An enhanced version of RoundRectList.
		// description:
		//		RoundRectStoreList is an enhanced version of RoundRectList. It
		//		can generate ListItems according to the given dojo.store store.
	});
});

},
'dojox/mobile/Heading':function(){
define("dojox/mobile/Heading", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./ProgressIndicator",
	"./ToolBarButton",
	"./View"
], function(array, connect, declare, lang, win, dom, domClass, domConstruct, domStyle, registry, Contained, WidgetBase, ProgressIndicator, ToolBarButton, View){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Heading
	// summary:
	//		A widget that represents a navigation bar.

	return declare("dojox.mobile.Heading", [WidgetBase, Contained],{
		// summary:
		//		A widget that represents a navigation bar.
		// description:
		//		Heading is a widget that represents a navigation bar, which
		//		usually appears at the top of an application. It usually
		//		displays the title of the current view and can contain a
		//		navigational control. If you use it with
		//		dojox.mobile.ScrollableView, it can also be used as a fixed
		//		header bar or a fixed footer bar. In such cases, specify the
		//		fixed="top" attribute to be a fixed header bar or the
		//		fixed="bottom" attribute to be a fixed footer bar. Heading can
		//		have one or more ToolBarButton widgets as its children.

		// back: String
		//		A label for the navigational control to return to the previous
		//		View.
		back: "",

		// href: String
		//		A URL to open when the navigational control is pressed.
		href: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "slide",

		// label: String
		//		A title text of the heading. If the label is not specified, the
		//		innerHTML of the node is used as a label.
		label: "",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "H1",

		// busy: Boolean
		//		If true, a progress indicator spins.
		busy: false,

		// progStyle: String
		//		A css class name to add to the progress indicator.
		progStyle: "mblProgWhite",

		/* internal properties */	
		baseClass: "mblHeading",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement(this.tag);
			this.inherited(arguments);
			if(!this.label){
				array.forEach(this.domNode.childNodes, function(n){
					if(n.nodeType == 3){
						var v = lang.trim(n.nodeValue);
						if(v){
							this.label = v;
							this.labelNode = domConstruct.create("span", {innerHTML:v}, n, "replace");
						}
					}
				}, this);
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("span", null, this.domNode);
			}
			this.labelNode.className = "mblHeadingSpanTitle";
			this.labelDivNode = domConstruct.create("div", {
				className: "mblHeadingDivTitle",
				innerHTML: this.labelNode.innerHTML
			}, this.domNode);

			dom.setSelectable(this.domNode, false);
		},

		startup: function(){
			if(this._started){ return; }
			var parent = this.getParent && this.getParent();
			if(!parent || !parent.resize){ // top level widget
				var _this = this;
				setTimeout(function(){ // necessary to render correctly
					_this.resize();
				}, 0);
			}
			this.inherited(arguments);
		},

		resize: function(){
			if(this.labelNode){
				// find the rightmost left button (B), and leftmost right button (C)
				// +-----------------------------+
				// | |A| |B|             |C| |D| |
				// +-----------------------------+
				var leftBtn, rightBtn;
				var children = this.containerNode.childNodes;
				for(var i = children.length - 1; i >= 0; i--){
					var c = children[i];
					if(c.nodeType === 1){
						if(!rightBtn && domStyle.get(c, "float") === "right"){
							rightBtn = c;
						}
						if(!leftBtn && domStyle.get(c, "float") === "left"){
							leftBtn = c;
						}
					}
				}

				if(!this.labelNodeLen && this.label){
					this.labelNode.style.display = "inline";
					this.labelNodeLen = this.labelNode.offsetWidth;
					this.labelNode.style.display = "";
				}

				var bw = this.domNode.offsetWidth; // bar width
				var rw = rightBtn ? bw - rightBtn.offsetLeft + 5 : 0; // rightBtn width
				var lw = leftBtn ? leftBtn.offsetLeft + leftBtn.offsetWidth + 5 : 0; // leftBtn width
				var tw = this.labelNodeLen || 0; // title width
				domClass[bw - Math.max(rw,lw)*2 > tw ? "add" : "remove"](this.domNode, "mblHeadingCenterTitle");
			}
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		_setBackAttr: function(/*String*/back){
			this._set("back", back);
			if(!this.backButton){
				this.backButton = new ToolBarButton({
					arrow: "left",
					label: back,
					moveTo: this.moveTo,
					back: !this.moveTo,
					href: this.href,
					transition: this.transition,
					transitionDir: -1
				});
				this.backButton.placeAt(this.domNode, "first");
				if(this._started){
					this.backButton.startup();
				}
			}else{
				this.backButton.set("label", back);
			}
			this.resize();
		},

		_setLabelAttr: function(/*String*/label){
			this._set("label", label);
			this.labelNode.innerHTML = this.labelDivNode.innerHTML = this._cv ? this._cv(label) : label;
		},

		_setBusyAttr: function(/*Boolean*/busy){
			var prog = this._prog;
			if(busy){
				if(!prog){
					prog = this._prog = new ProgressIndicator({size:30, center:false});
					domClass.add(prog.domNode, this.progStyle);
				}
				domConstruct.place(prog.domNode, this.domNode, "first");
				prog.start();
			}else{
				prog.stop();
			}
			this._set("busy", busy);
		}	
	});
});

},
'dojox/fx/ext-dojo/complex':function(){
define("dojox/fx/ext-dojo/complex", ["dojo/_base/kernel", "dojo/_base/lang", "dojo/_base/array","dojo/_base/declare", "dojo/_base/connect", 
	"dojo/_base/Color", "dojo/_base/fx", "dojo/fx"], 
	function(dojo, lang, arrayUtil, declare, connectUtil, Color, baseFx, coreFx){
	lang.getObject("dojox.fx.ext-dojo.complex", true);
	
	var da = baseFx.animateProperty;
	dojo.animateProperty = baseFx.animateProperty = function(options){
		// summary:
		//		An extension of dojo.animateProperty which adds functionality
		//		that animates a "complex property". The primary example is the
		//		clip style: rect(10px 30px 10px 50px).
		//		Note this can also be used with (and is actually intended for)
		//		CSS3 properties, such as transform:
		//		transform: rotate(10deg) translateX(0px)
		//
		//	description:
		//		The standard animation doesn't know what to do with something like
		//		rect(...). This class identifies complex properties by they being a
		//		string and having parenthesis. If so, that property is made into a
		//		dojox.fx._Complex object and the getValue() is obtained from
		//		there.
		//
		//	example:
		//		|	var ani = dojo.animateProperty({
		//		|		node:dojo.byId("myDiv"),
		//		|		duration:600,
		//		|		properties:{
		//		|			clip:{start:'rect(0px 50px 50px 0px)', end:'rect(10px 30px 30px 10px)'}
		//		|		}
		//		|	}).play();
		//
		var d = dojo;
		var ani = da(options);

		connectUtil.connect(ani, "beforeBegin", function(){
			// dojo.Animate original still invokes and still
			// works. We're appending this functionality to
			// modify targeted properties.
			ani.curve.getValue = function(r){
				// Overwriting dojo.Animate's curve.getValue
				// This is mostly duplicate code, except it looks
				// for an instance of dojox.fx._Complex.
				var ret = {};
				for(var p in this._properties){
					var prop = this._properties[p],
						start = prop.start;
					if(start instanceof d.Color){
						ret[p] = d.blendColors(start, prop.end, r, prop.tempColor).toCss();
					}else if(start instanceof dojox.fx._Complex){
						ret[p] = start.getValue(r);
					}else if(!d.isArray(start)){
						ret[p] = ((prop.end - start) * r) + start + (p != "opacity" ? prop.units || "px" : 0);
					}
				}
				return ret;
			};

			// this.properties has already been set, as has this.curve._properties.
			// We're fixing the props in curve which will have NaN attributes from
			// our string property.
			var pm = {};
			for(var p in this.properties){
				var o = this.properties[p];
				if(typeof(o.start) == "string" && /\(/.test(o.start)){
					this.curve._properties[p].start = new dojox.fx._Complex(o);
				}
			}

		});
		return ani; // dojo.Animation
	}

	return declare("dojox.fx._Complex", null, {
		// summary:
		//		A class that takes a complex property such as
		//		clip style: rect(10px 30px 10px 50px), and breaks it
		//		into seperate animatable units. The object has a getValue()
		//		that will return a string with the modified units.
		//
		PROP: /\([\w|,|+|\-|#|\.|\s]*\)/g,
		constructor: function(options){
			var beg = options.start.match(this.PROP);
			var end = options.end.match(this.PROP);

			var begProps = arrayUtil.map(beg, this.getProps, this);
			var endProps = arrayUtil.map(end, this.getProps, this);

			this._properties = {};
			this.strProp = options.start;
			arrayUtil.forEach(begProps, function(prop, i){
				arrayUtil.forEach(prop, function(p, j){
					this.strProp = this.strProp.replace(p, "PROP_"+i+""+j);
					this._properties["PROP_"+i+""+j] = this.makePropObject(p, endProps[i][j])
				},this);
			},this);
		},

		getValue: function(/*Float*/r){
			// summary:
			// 		Returns a string with teh same integrity as the
			// 		original star and end, but with the modified units.
			var str = this.strProp, u;
			for(var nm in this._properties){
				var v, o = this._properties[nm];
				if(o.units == "isColor"){
					v = Color.blendColors(o.beg, o.end, r).toCss(false);
					u = "";
				}else{
					v = ((o.end - o.beg) * r) + o.beg;
					u = o.units;
				}
				str = str.replace(nm, v + u);
			}

			return str; // String
		},

		makePropObject: function(/* String */beg, /* String */end){
			// summary:
			//		Returns an object that stores the numeric value and
			//		units of the beggining and ending properties.
			//
			var b = this.getNumAndUnits(beg);
			var e = this.getNumAndUnits(end);
			return {
				beg:b.num,
				end:e.num,
				units:b.units
			}; // Object
		},

		getProps: function(/* String */str){
			// summary:
			//		Helper function that splits a stringified set of properties
			//		into individual units.
			//
			str = str.substring(1, str.length-1);
			var s;
			if(/,/.test(str)){
				str = str.replace(/\s/g, "");
				s = str.split(",");
			}else{
				str = str.replace(/\s{2,}/g, " ");
				s = str.split(" ");
			}
			return s; // String
		},
		getNumAndUnits: function(prop){
			// summary:
			//		Helper function that returns the numeric verion of the string
			//		property (or dojo.Color object) and the unit in which it was
			//		defined.
			//
			if(!prop){ return {}; }
			if(/#/.test(prop)){
				return {
					num: new Color(prop),
					units:"isColor"
				}; // Object
			}
			var o = {
				num:parseFloat(/-*[\d\.\d|\d]{1,}/.exec(prop).join(""))
			};
			o.units = /[a-z]{1,}/.exec(prop);//.join("");
			o.units = o.units && o.units.length ? o.units.join("") : "";
			return o; // Object
		}
	});
});

},
'dojox/mobile/Badge':function(){
define("dojox/mobile/Badge", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./iconUtils"
], function(declare, lang, domClass, domConstruct, iconUtils){
	// module:
	//		dojox/mobile/Badge
	// summary:
	//		A utility to create/update a badge node.

	return declare("dojox.mobile.Badge", null, {
		value: "0",
		className: "mblDomButtonRedBadge",
		fontSize: 16, // [px]

		constructor: function(params, node){
			if (params){
				lang.mixin(this, params);
			}
			this.domNode = node ? node : domConstruct.create("div");
			domClass.add(this.domNode, "mblBadge");
			if(this.domNode.className.indexOf("mblDomButton") === -1){
				domClass.add(this.domNode, this.className);
			}
			if(this.fontSize !== 16){
				this.domNode.style.fontSize = this.fontSize + "px";
			}
			iconUtils.createDomButton(this.domNode);
			this.setValue(this.value);
		},

		getValue: function(){
			return this.domNode.firstChild.innerHTML || "";
		},

		setValue: function(/*String*/value){
			this.domNode.firstChild.innerHTML = value;
		}
	});
});

},
'dojox/mobile/TransitionEvent':function(){
define("dojox/mobile/TransitionEvent", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/on",
	"./transition"
], function(declare, Deferred, lang, on, transitDeferred){

	return declare("dojox.mobile.TransitionEvent", null, {
		constructor: function(target, transitionOptions, triggerEvent){
			this.transitionOptions=transitionOptions;	
			this.target = target;
			this.triggerEvent=triggerEvent||null;	
		},

		dispatch: function(){
			var opts = {bubbles:true, cancelable:true, detail: this.transitionOptions, triggerEvent: this.triggerEvent};	
			//console.log("Target: ", this.target, " opts: ", opts);

			var evt = on.emit(this.target,"startTransition", opts);
			//console.log('evt: ', evt);
			if(evt){
				Deferred.when(transitDeferred, lang.hitch(this, function(transition){
					Deferred.when(transition.call(this, evt), lang.hitch(this, function(results){
						this.endTransition(results);
					})); 
				}));
			}
		},

		endTransition: function(results){
			on.emit(this.target, "endTransition" , {detail: results.transitionOptions});
		}
	});
});

},
'dojox/mobile/dh/SuffixFileTypeMap':function(){
define("dojox/mobile/dh/SuffixFileTypeMap", [
	"dojo/_base/lang"
], function(lang){

	var o = lang.getObject("dojox.mobile.dh.SuffixFileTypeMap", true);

	o.map = {
		"html": "html",
		"json": "json"
	};

	o.add = function(/*String*/ key, /*String*/ contentType){
		this.map[key] = contentType;
	};

	o.getContentType = function(/*String*/ fileName){
		var fileType = (fileName || "").replace(/.*\./, "");
		return this.map[fileType];
	};

	return o;
});

},
'dojox/mobile/viewRegistry':function(){
define("dojox/mobile/viewRegistry", [
	"dojo/_base/array",
	"dojo/dom-class",
	"dijit/registry"
], function(array, domClass, registry){

	// module:
	//		dojox/mobile/viewRegistry
	// summary:
	//		A registry of existing views.

	var viewRegistry = {
		length: 0,
		hash: {},
		initialView: null,

		add: function(/*Widget*/ view){
			// summary:
			//		Add a view to the registry.
			this.hash[view.id] = view;
			this.length++;
		},

		remove: function(/*String*/ id){
			// summary:
			//		Remove a view from the registry.
			if(this.hash[id]){
				delete this.hash[id];
				this.length--;
			}
		},

		getViews: function(){
			var arr = [];
			for(var i in this.hash){
				arr.push(this.hash[i]);
			}
			return arr;
		},

		getParentView: function(/*Widget*/ view){
			for(var v = view.getParent(); v; v = v.getParent()){
				if(domClass.contains(v.domNode, "mblView")){ return v; }
			}
			return null;
		},

		getChildViews: function(/*Widget*/ parent){
			return array.filter(this.getViews(), function(v){ return this.getParentView(v) === parent; }, this);
		},

		getEnclosingView: function(/*DomNode*/ node){
			for(var n = node; n && n.tagName !== "BODY"; n = n.parentNode){
				if(n.nodeType === 1 && domClass.contains(n, "mblView")){
					return registry.byNode(n);
				}
			}
			return null;
		},

		getEnclosingScrollable: function(/*DomNode*/ node){
			for(var w = registry.getEnclosingWidget(node); w; w = w.getParent()){
				if(w.scrollableParams && w._v){ return w; }
			}
			return null;
		}
	};

	return viewRegistry;
});

},
'dojox/mobile/SpinWheelTimePicker':function(){
define("dojox/mobile/SpinWheelTimePicker", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"./_TimePickerMixin",
	"./SpinWheel",
	"./SpinWheelSlot"
], function(declare, domClass, TimePickerMixin, SpinWheel, SpinWheelSlot){

/*=====
	var SpinWheel = dojox.mobile.SpinWheel;
=====*/

	// module:
	//		dojox/mobile/SpinWheelTimePicker
	// summary:
	//		A SpinWheel-based time picker widget.

	return declare("dojox.mobile.SpinWheelTimePicker", [SpinWheel, TimePickerMixin], {
		// summary:
		//		A SpinWheel-based time picker widget.
		// description:
		//		SpinWheelTimePicker is a time picker widget. It is a subclass of
		//		dojox.mobile.SpinWheel. It has the hour and minute slots.

		slotClasses: [
			SpinWheelSlot,
			SpinWheelSlot
		],

		slotProps: [
			{labelFrom:0, labelTo:23, style:{width:"50px", textAlign:"right"}},
			{labelFrom:0, labelTo:59, zeroPad:2, style:{width:"40px", textAlign:"right"}}
		],

		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode, "mblSpinWheelTimePicker");
		}
	});
});

},
'dojox/mobile/_TimePickerMixin':function(){
define("dojox/mobile/_TimePickerMixin", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/date/locale"
], function(declare, domClass, datelocale){

	// module:
	//		dojox/mobile/_TimePickerMixin
	// summary:
	//		A mixin for time picker widget.

	return declare("dojox.mobile._TimePickerMixin", null, {
		// summary:
		//		A mixin for time picker widget.

		reset: function(){
			// summary:
			//		Goes to now.
			var now = new Date(),
				h = now.getHours() + "",
				m = now.getMinutes();
			m = (m < 10 ? "0" : "") + m;
			this.set("values", [h, m]);
			this.set("colors", [h, m]);
		},

		_getDateAttr: function(){
			// summary:
			//		Returns a Date object for the current values
			var v = this.get("values"); // [hour24, minute]
			return datelocale.parse(v[0] + ":" + v[1], {timePattern:"H:m", selector:"time"});
		}
	});
});

},
'dojox/mobile/EdgeToEdgeStoreList':function(){
define("dojox/mobile/EdgeToEdgeStoreList", [
	"dojo/_base/declare",
	"./EdgeToEdgeList",
	"./_StoreListMixin"
], function(declare, EdgeToEdgeList, StoreListMixin){

/*=====
	var EdgeToEdgeList = dojox.mobile.EdgeToEdgeList;
	var StoreListMixin = dojox.mobile._StoreListMixin;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeStoreList
	// summary:
	//		An enhanced version of EdgeToEdgeList.

	return declare("dojox.mobile.EdgeToEdgeStoreList", [EdgeToEdgeList, StoreListMixin],{
		// summary:
		//		An enhanced version of EdgeToEdgeList.
		// description:
		//		EdgeToEdgeStoreList is an enhanced version of EdgeToEdgeList. It
		//		can generate ListItems according to the given dojo.store store.
	});
});

},
'dojox/mobile/RoundRectDataList':function(){
define("dojox/mobile/RoundRectDataList", [
	"dojo/_base/declare",
	"./RoundRectList",
	"./_DataListMixin"
], function(declare, RoundRectList, DataListMixin){

/*=====
	var RoundRectList = dojox.mobile.RoundRectList;
	var DataListMixin = dojox.mobile._DataListMixin;
=====*/

	// module:
	//		dojox/mobile/RoundRectDataList
	// summary:
	//		An enhanced version of RoundRectList.

	return declare("dojox.mobile.RoundRectDataList", [RoundRectList, DataListMixin], {
		// summary:
		//		An enhanced version of RoundRectList.
		// description:
		//		RoundRectDataList is an enhanced version of RoundRectList. It
		//		can generate ListItems according to the given dojo.data store.
	});
});

},
'dojox/mobile/ScrollableView':function(){
define("dojox/mobile/ScrollableView", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",	// registry.byNode
	"./View",
	"./_ScrollableMixin"
], function(array, declare, domClass, domConstruct, registry, View, ScrollableMixin){

	/*=====
		var View = dojox.mobile.View;
		var ScrollableMixin = dojox.mobile._ScrollableMixin;
	=====*/

	// module:
	//		dojox/mobile/ScrollableView
	// summary:
	//		A container that has a touch scrolling capability.

	return declare("dojox.mobile.ScrollableView", [View, ScrollableMixin], {
		// summary:
		//		A container that has a touch scrolling capability.
		// description:
		//		ScrollableView is a subclass of View (=dojox.mobile.View).
		//		Unlike the base View class, ScrollableView's domNode always stays
		//		at the top of the screen and its height is "100%" of the screen.
		//		In this fixed domNode, containerNode scrolls. Browser's default
		//		scrolling behavior is disabled, and the scrolling machinery is
		//		re-implemented with JavaScript. Thus the user does not need to use the
		//		two-finger operation to scroll an inner DIV (containerNode).
		//		The main purpose of this widget is to realize fixed-positioned header
		//		and/or footer bars.

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// keepScrollPos: Boolean
		//		Overrides dojox.mobile.View.keepScrollPos.
		keepScrollPos: false,

		constructor: function(){
			this.scrollableParams = {noResize: true};
		},

		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode, "mblScrollableView");
			this.domNode.style.overflow = "hidden";
			this.domNode.style.top = "0px";
			this.containerNode = domConstruct.create("div",
				{className:"mblScrollableViewContainer"}, this.domNode);
			this.containerNode.style.position = "absolute";
			this.containerNode.style.top = "0px"; // view bar is relative
			if(this.scrollDir === "v"){
				this.containerNode.style.width = "100%";
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.reparent();
			this.inherited(arguments);
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.inherited(arguments); // scrollable#resize() will be called
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		isTopLevel: function(e){
			// summary:
			//		Returns true if this is a top-level widget.
			//		Overrides dojox.mobile.scrollable.
			var parent = this.getParent && this.getParent();
			return (!parent || !parent.resize); // top level widget
		},

		addFixedBar: function(widget){
			var c = widget.domNode;
			var fixed = this.checkFixedBar(c, true);
			if(!fixed){ return; }
			// Fixed bar has to be added to domNode, not containerNode.
			this.domNode.appendChild(c);
			if(fixed === "top"){
				this.fixedHeaderHeight = c.offsetHeight;
				this.isLocalHeader = true;
			}else if(fixed === "bottom"){
				this.fixedFooterHeight = c.offsetHeight;
				this.isLocalFooter = true;
				c.style.bottom = "0px";
			}
			this.resize();
		},

		reparent: function(){
			// summary:
			//		Moves all the children, except header and footer, to
			//		containerNode.
			var i, idx, len, c;
			for(i = 0, idx = 0, len = this.domNode.childNodes.length; i < len; i++){
				c = this.domNode.childNodes[idx];
				// search for view-specific header or footer
				if(c === this.containerNode || this.checkFixedBar(c, true)){
					idx++;
					continue;
				}
				this.containerNode.appendChild(this.domNode.removeChild(c));
			}
		},

		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			this.flashScrollBar();
		},

		getChildren: function(){
			// summary:
			//		Overrides _WidgetBase#getChildren to add local fixed bars,
			//		which are not under containerNode, to the children array.
			var children = this.inherited(arguments);
			if(this.fixedHeader && this.fixedHeader.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedHeader));
			}
			if(this.fixedFooter && this.fixedFooter.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedFooter));
			}
			return children;
		}
	});
});

},
'dojox/mobile/ValuePickerTimePicker':function(){
define("dojox/mobile/ValuePickerTimePicker", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"./_TimePickerMixin",
	"./ToolBarButton",
	"./ValuePicker",
	"./ValuePickerSlot"
], function(declare, domClass, TimePickerMixin, ToolBarButton, ValuePicker, ValuePickerSlot){

/*=====
	var ValuePicker = dojox.mobile.ValuePicker;
=====*/

	// module:
	//		dojox/mobile/ValuePickerTimePicker
	// summary:
	//		A ValuePicker-based time picker widget.

	return declare("dojox.mobile.ValuePickerTimePicker", [ValuePicker, TimePickerMixin], {
		// summary:
		//		A ValuePicker-based time picker widget.
		// description:
		//		ValuePickerTimePicker is a time picker widget. It is a subclass of
		//		dojox.mobile.ValuePicker. It has the hour and minute slots.

		// readOnly: Boolean
		//		If true, slot input fields are read-only. Only the plus and
		//		minus buttons can be used to change the values.
		readOnly: false,

		is24h: false,

		slotClasses: [
			ValuePickerSlot,
			ValuePickerSlot
		],

		slotProps: [
			{labelFrom:0, labelTo:23, style:{width:"72px"}},
			{labelFrom:0, labelTo:59, zeroPad:2, style:{width:"72px"}}
		],

		buildRendering: function(){
			var p = this.slotProps;
			p[0].readOnly = p[1].readOnly = this.readOnly;
			this.inherited(arguments);
			var items = this.slots[0].items;
			this._zero = items.slice(0, 1);
			this._pm = items.slice(13);

			domClass.add(this.domNode, "mblValuePickerTimePicker");

			this.ampmButton = new ToolBarButton();
			this.addChild(this.ampmButton);
			this._conn = [
				this.connect(this.ampmButton, "onClick", "onBtnClick")
			];
			this.set("is24h", this.is24h);
		},

		to12h: function(a){
			// a = [hour24, minute]
			var h = a[0] - 0;
			var ampm = h < 12 ? "AM" : "PM";
			if(h == 0){
				h = 12;
			}else if(h > 12){
				h = h - 12;
			}
			return [h + "", a[1], ampm]; // [hour12, minute, ampm]
		},

		to24h: function(a){
			// a = [hour12, minute, ampm]
			var h = a[0] - 0;
			if(a[2] == "AM"){
				h = h == 12 ? 0 : h; // 12AM is 0h
			}else{
				h = h == 12 ? h : h + 12; // 12PM is 12h
			}
			return [h + "", a[1]]; // [hour24, minute]
		},

		onBtnClick: function(e){
			var ampm = this.ampmButton.get("label") == "AM" ? "PM" : "AM";
			var v = this.get("values12");
			v[2] = ampm;
			this.set("values12", v);
		},

		_setIs24hAttr: function(/*Boolean*/f){
			var items = this.slots[0].items;
			if(f && items.length != 24){ // 24h: 0 - 23
				this.slots[0].items = this._zero.concat(items).concat(this._pm);
			}else if(!f && items.length != 12){ // 12h: 1 - 12
				items.splice(0, 1);
				items.splice(12);
			}
			var v = this.get("values");
			this._set("is24h", f);
			this.ampmButton.domNode.style.display = f ? "none" : "";
			this.set("values", v);
		},

		_getValuesAttr: function(){
			// summary:
			//		Returns an array of hour an minute in 24h format.
			var v = this.inherited(arguments); // [hour, minute]
			return this.is24h ? v : this.to24h([v[0], v[1], this.ampmButton.get("label")]);
		},

		_setValuesAttr: function(/*Array*/a){
			// summary:
			//		Sets an array of hour an minute in 24h format.
			// a:
			//		[hour24, minute]
			if(this.is24h){
				this.inherited(arguments);
			}else{
				a = this.to12h(a);
				this.ampmButton.set("label", a[2]);
				this.inherited(arguments);
			}
		},

		_getValues12Attr: function(){
			return this.to12h(this._getValuesAttr());
		},

		_setValues12Attr: function(/*Array*/a){
			// summary:
			//		Sets an array of hour an minute in 12h format.
			// a:
			//		[hour12, minute, ampm]
			this.set("values", this.to24h(a));
		}
	});
});

},
'dojox/mobile/ViewController':function(){
define("dojox/mobile/ViewController", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/_base/Deferred",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/ready",
	"dijit/registry",
	"./ProgressIndicator",
	"./TransitionEvent",
	"./viewRegistry"
], function(dojo, array, connect, declare, lang, win, Deferred, dom, domClass, domConstruct, on, ready, registry, ProgressIndicator, TransitionEvent, viewRegistry){

	// module:
	//		dojox/mobile/ViewController
	// summary:
	//		A singleton class that controlls view transition.

	var Controller = declare("dojox.mobile.ViewController", null, {
		// summary:
		//		A singleton class that controlls view transition.
		// description:
		//		This class listens to the "startTransition" events and performs
		//		view transitions. If the transition destination is an external
		//		view specified with the url parameter, retrieves the view
		//		content and parses it to create a new target view.

		dataHandlerClass: "dojox/mobile/dh/DataHandler",
		dataSourceClass: "dojox/mobile/dh/UrlDataSource",
		fileTypeMapClass: "dojox/mobile/dh/SuffixFileTypeMap",

		constructor: function(){
			this.viewMap = {};
			ready(lang.hitch(this, function(){
				on(win.body(), "startTransition", lang.hitch(this, "onStartTransition"));
			}));
		},

		findTransitionViews: function(/*String*/moveTo){
			// summary:
			//		Searches for a starting view and a destination view.
			if(!moveTo){ return []; }
			// removes a leading hash mark (#) and params if exists
			// ex. "#bar&myParam=0003" -> "bar"
			moveTo.match(/^#?([^&?]+)(.*)/);
			var params = RegExp.$2;
			var view = registry.byId(RegExp.$1);
			if(!view){ return []; }
			for(var v = view.getParent(); v; v = v.getParent()){ // search for the topmost invisible parent node
				if(v.isVisible && !v.isVisible()){
					var sv = view.getShowingView();
					if(sv && sv.id !== view.id){
						view.show();
					}
					view = v;
				}
			}
			return [view.getShowingView(), view, params]; // fromView, toView, params
		},

		openExternalView: function(/*Object*/ transOpts, /*DomNode*/ target){
			var d = new Deferred();
			var id = this.viewMap[transOpts.url];
			if(id){
				transOpts.moveTo = id;
				if(!transOpts.noTransition){
					new TransitionEvent(win.body(), transOpts).dispatch();
				}
				d.resolve(true);
				return d;
			}

			// if a fixed bottom bar exists, a new view should be placed before it.
			var refNode = null;
			for(var i = target.childNodes.length - 1; i >= 0; i--){
				var c = target.childNodes[i];
				if(c.nodeType === 1){
					var fixed = c.getAttribute("fixed")
						|| (registry.byNode(c) && registry.byNode(c).fixed);
					if(fixed === "bottom"){
						refNode = c;
					}
					break;
				}
			}

			var dh = transOpts.dataHandlerClass || this.dataHandlerClass;
			var ds = transOpts.dataSourceClass || this.dataSourceClass;
			var ft = transOpts.fileTypeMapClass || this.fileTypeMapClass;
			require([dh, ds, ft], lang.hitch(this, function(DataHandler, DataSource, FileTypeMap){
				var handler = new DataHandler(new DataSource(transOpts.url || transOpts.data), target, refNode);
				var contentType = transOpts.contentType || FileTypeMap.getContentType(transOpts.url) || "html";
				handler.processData(contentType, lang.hitch(this, function(id){
					if(id){
						this.viewMap[transOpts.url] = transOpts.moveTo = id;
						if(!transOpts.noTransition){
							new TransitionEvent(win.body(), transOpts).dispatch();
						}
						d.resolve(true);
					}else{
						d.reject("Failed to load "+transOpts.url);
					}
				}));
			}));
			return d;
		},

		onStartTransition: function(evt){
			// summary:
			//		A handler that performs view transition.
			evt.preventDefault();
			if(!evt.detail){ return; }
			var detail = evt.detail;
			if(!detail.moveTo && !detail.href && !detail.url && !detail.scene){ return; }

			if(detail.url && !detail.moveTo){
				var urlTarget = detail.urlTarget;
				var w = registry.byId(urlTarget);
				var target = w && w.containerNode || dom.byId(urlTarget);
				if(!target){
					w = viewRegistry.getEnclosingView(evt.target);
					target = w && w.domNode.parentNode || win.body();
				}
				this.openExternalView(detail, target);
				return;
			}else if(detail.href){
				if(detail.hrefTarget){
					win.global.open(detail.href, detail.hrefTarget);
				}else{
					var view; // find top level visible view
					for(var v = viewRegistry.getEnclosingView(evt.target); v; v = viewRegistry.getParentView(v)){
						view = v;
					}
					if(view){
						view.performTransition(null, detail.transitionDir, detail.transition, evt.target, function(){location.href = detail.href;});
					}
				}
				return;
			}else if(detail.scene){
				connect.publish("/dojox/mobile/app/pushScene", [detail.scene]);
				return;
			}

			var arr = this.findTransitionViews(detail.moveTo),
				fromView = arr[0],
				toView = arr[1],
				params = arr[2];
			if(!location.hash && !detail.hashchange){
				viewRegistry.initialView = fromView;
			}
			if(detail.moveTo && toView){
				detail.moveTo = (detail.moveTo.charAt(0) === '#' ? '#' + toView.id : toView.id) + params;
			}
			if(!fromView || (detail.moveTo && fromView === registry.byId(detail.moveTo.replace(/^#?([^&?]+).*/, "$1")))){ return; }
			var src = registry.getEnclosingWidget(evt.target);
			if(src && src.callback){
				detail.context = src;
				detail.method = src.callback;
			}
			fromView.performTransition(detail);
		}
	});
	Controller._instance = new Controller(); // singleton
	Controller.getInstance = function(){
		return Controller._instance;
	};
	return Controller;
});


},
'dojox/css3/transition':function(){
define("dojox/css3/transition", ["dojo/_base/kernel", 
		"dojo/_base/lang",
		"dojo/_base/declare",
		"dojo/_base/array",
		"dojo/_base/Deferred",
		"dojo/DeferredList",
		"dojo/on",
		"dojo/_base/sniff"], 
		function(dojo, lang, declare, array, deferred, deferredList, on, has){
	//TODO create cross platform animation/transition effects
	var transitionEndEventName = "transitionend";
	var transitionPrefix = "t"; //by default use "t" prefix and "ransition" to make word "transition"
	var translateMethodStart = "translate3d(";//Android 2.x does not support translateX in CSS Transition, we need to use translate3d in webkit browsers
	var translateMethodEnd = ",0,0)";
	if(has("webkit")){
		transitionPrefix = "WebkitT";
		transitionEndEventName = "webkitTransitionEnd";
	}else if(has("mozilla")){
		transitionPrefix = "MozT";
		translateMethodStart = "translateX(";
		translateMethodEnd = ")";
	}
	
	//TODO find a way to lock the animation and prevent animation conflict
	declare("dojox.css3.transition", null, {
		

		constructor: function(args){
			//default config should be in animation object itself instead of its prototype
			//otherwise, it might be easy for making mistake of modifying prototype
			var defaultConfig = {
				startState: {},
				endState: {},
				node: null,
				duration: 250,
				"in": true,
				direction: 1,
				autoClear: true
			};
			
			lang.mixin(this, defaultConfig);
			lang.mixin(this, args);
			
			//create the deferred object which will resolve after the animation is finished.
			//We can rely on "onAfterEnd" function to notify the end of a single animation,
			//but using a deferred object is easier to wait for multiple animations end.
			if(!this.deferred){
				this.deferred = new deferred();
			}
		},
		
		play: function(){
			//play the animation using CSS3 Transition
			dojox.css3.transition.groupedPlay([this]);
		},
		
		//method to apply the state of the transition
		_applyState: function(state){
			var style = this.node.style;
			for(var property in state){
				if(state.hasOwnProperty(property)){
					style[property] = state[property];
				}
			}
		},
		
		//method to initialize state for transition
		initState: function(){
			
			//apply the immediate style change for initial state.
			this.node.style[transitionPrefix + "ransitionProperty"] = "none";
			this.node.style[transitionPrefix + "ransitionDuration"] = "0ms";
			this._applyState(this.startState);
			
		},
		
		_beforeStart: function(){
			if (this.node.style.display === "none"){
				this.node.style.display = "";
			}
			this.beforeStart();
		},
		
		_beforeClear: function(){
			this.node.style[transitionPrefix + "ransitionProperty"] = null;
			this.node.style[transitionPrefix + "ransitionDuration"] = null;
			if(this["in"] !== true){
				this.node.style.display = "none";
			}			 
			this.beforeClear();
		},
		
		_onAfterEnd: function(){
			this.deferred.resolve(this.node);
			if(this.node.id && dojox.css3.transition.playing[this.node.id]===this.deferred){
				delete dojox.css3.transition.playing[this.node.id];
			}
			this.onAfterEnd();
		},
		
		beforeStart: function(){
			
		},
		
		beforeClear: function(){
			
		},
		
		onAfterEnd: function(){
			
		},
		
		//method to start the transition
		start: function(){
			this._beforeStart();
			
			var self = this;
			//change the transition duration
			self.node.style[transitionPrefix + "ransitionProperty"] = "all";
			self.node.style[transitionPrefix + "ransitionDuration"] = self.duration + "ms";
			
			//connect to clear the transition state after the transition end.
			//Since the transition is conducted asynchronously, we need to 
			//connect to transition end event to clear the state
			on.once(self.node, transitionEndEventName, function(){
				self.clear();
			});
			
			this._applyState(this.endState);
		},
		
		//method to clear state after transition
		clear: function(){
			this._beforeClear();
			this._removeState(this.endState);
			console.log(this.node.id + " clear.");
			this._onAfterEnd();
		},
		
		//create removeState method
		_removeState: function(state){
			var style = this.node.style;
			for(var property in state){
				if(state.hasOwnProperty(property)){
					style[property] = null;
				}
			}
		}
		
	});
	
	//TODO add the lock mechanism for all of the transition effects
	//	   consider using only one object for one type of transition.
	//TODO create the first animation, slide.
	dojox.css3.transition.slide = function(node, config){

		//TODO create the return and set the startState, endState of the return
		var ret = new dojox.css3.transition(config);
		ret.node = node;
		
		var startX = "0";
		var endX = "0";
		
		if(ret["in"]){
			if(ret.direction === 1){
				startX = "100%";
			}else{
				startX = "-100%";
			}
		}else{
			if(ret.direction === 1){
				endX = "-100%";
			}else{
				endX = "100%";
			}
		}
		
		
		ret.startState[transitionPrefix + "ransform"]=translateMethodStart+startX+translateMethodEnd;
		
		ret.endState[transitionPrefix + "ransform"]=translateMethodStart+endX+translateMethodEnd;
		
		return ret;
	};
		
	
	//fade in/out animation effects
	dojox.css3.transition.fade = function(node, config){
		
		var ret = new dojox.css3.transition(config);
		ret.node = node;
		
		var startOpacity = "0";
		var endOpacity = "0";
		
		if(ret["in"]){
			endOpacity = "1";
		}else{
			startOpacity = "1";
		}
		
		lang.mixin(ret, {
			startState:{
				"opacity": startOpacity
			},
			endState:{
				"opacity": endOpacity
			}
		});
		
		return ret;
	};
	
  //fade in/out animation effects
	dojox.css3.transition.flip = function(node, config){
		
		var ret = new dojox.css3.transition(config);
		ret.node = node;
	   
		if(ret["in"]){
			//Need to set opacity here because Android 2.2 has bug that
			//scale(...) in transform does not persist status
			lang.mixin(ret,{
				startState:{
					"opacity": "0"
				},
				endState:{
					"opacity": "1"
				}
			});
			ret.startState[transitionPrefix + "ransform"]="scale(0,0.8) skew(0,-30deg)";
			ret.endState[transitionPrefix + "ransform"]="scale(1,1) skew(0,0)";
		}else{
			lang.mixin(ret,{
				startState:{
					"opacity": "1"
				},
				endState:{
					"opacity": "0"
				}
			});			
			ret.startState[transitionPrefix + "ransform"]="scale(1,1) skew(0,0)";
			ret.endState[transitionPrefix + "ransform"]="scale(0,0.8) skew(0,30deg)";
		}
		
		return ret;
	};
	
	var getWaitingList = function(/*Array*/ nodes){
		var defs = [];
		array.forEach(nodes, function(node){
			//check whether the node is under other animation
			if(node.id && dojox.css3.transition.playing[node.id]){
				//TODO hook on deferred object in dojox.css3.transition.playing
				defs.push(dojox.css3.transition.playing[node.id]);
			}
			
		});
		return new deferredList(defs);
	};
	
	dojox.css3.transition.getWaitingList = getWaitingList;
	
	//TODO groupedPlay should ensure the UI update happens when
	//all animations end.
	//the group player to start multiple animations together
	dojox.css3.transition.groupedPlay = function(/*Array*/args){
		//args should be array of dojox.css3.transition
		
		var animNodes = array.filter(args, function(item){
			return item.node;
		});
		
		var waitingList = getWaitingList(animNodes);

		//update registry with deferred objects in animations of args.
		array.forEach(args, function(item){
			if(item.node.id){
				dojox.css3.transition.playing[item.node.id] = item.deferred;
			}
		});
		
		//TODO wait for all deferred object in deferred list to resolve
		dojo.when(waitingList, function(){
			array.forEach(args, function(item){
				//set the start state
				item.initState();
			});
			
			//Assume the fps of the animation should be higher than 30 fps and
			//allow the browser to use one frame's time to redraw so that
			//the transition can be started
			setTimeout(function(){
				array.forEach(args, function(item){
					item.start();
				});			   
			}, 33);
		});		   
	};
	
	//the chain player to start multiple animations one by one
	dojox.css3.transition.chainedPlay = function(/*Array*/args){
		//args should be array of dojox.css3.transition
		
		var animNodes = array.filter(args, function(item){
			return item.node;
		});
		
		var waitingList = getWaitingList(animNodes);

		//update registry with deferred objects in animations of args.
		array.forEach(args, function(item){
			if(item.node.id){
				dojox.css3.transition.playing[item.node.id] = item.deferred;
			}
		});
		
		dojo.when(waitingList, function(){
			array.forEach(args, function(item){
				//set the start state
				item.initState();
			});
			
			//chain animations together
			for (var i=1, len=args.length; i < len; i++){
				args[i-1].deferred.then(lang.hitch(args[i], function(){
					this.start();
				}));
			}
			
			//Assume the fps of the animation should be higher than 30 fps and
			//allow the browser to use one frame's time to redraw so that
			//the transition can be started
			setTimeout(function(){
				args[0].start();
			}, 33);
		});		   
	};
	
	//TODO complete the registry mechanism for animation handling and prevent animation conflicts
	dojox.css3.transition.playing = {};
	
	return dojox.css3.transition;
});

},
'dojox/mobile/TextArea':function(){
define("dojox/mobile/TextArea", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"./TextBox"
], function(declare, domConstruct, TextBox){

	/*=====
		TextBox = dojox.mobile.TextBox;
	=====*/
	return declare("dojox.mobile.TextArea",TextBox, {
		// summary:
		//		Non-templated TEXTAREA widget.
		//
		// description:
		//		A textarea widget that wraps an HTML TEXTAREA element.
		//		Takes all the parameters (name, value, etc.) that a vanilla textarea takes.
		//
		// example:
		// |	<textarea dojoType="dojox.mobile.TextArea">...</textarea>

		baseClass: "mblTextArea",

		postMixInProperties: function(){
			 // Copy value from srcNodeRef, unless user specified a value explicitly (or there is no srcNodeRef)
			// TODO: parser will handle this in 2.0
			if(!this.value && this.srcNodeRef){
				this.value = this.srcNodeRef.value;
			}
			this.inherited(arguments);
		},

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("textarea", {});
			}
			this.inherited(arguments);
		}
	});
});

},
'dojox/mobile/Icon':function(){
define("dojox/mobile/Icon", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./iconUtils"
], function(declare, lang, domClass, domConstruct, iconUtils){

	// module:
	//		dojox/mobile/Icon
	// summary:
	//		A wrapper for image icon, css sprite icon, or DOM Button.

	return declare("dojox.mobile.Icon", null,{
		// summary:
		//		A DOM Button wrapper.
		// description:
		//		This widget creates a specified DOM Button.
		// example:
		//		Image icon:
		//	|	<div data-dojo-type="dojox.mobile.Icon"
		//	|		data-dojo-props='icon:"images/tab-icon-12h.png"'></div>
		//
		//		CSS sprite icon:
		//	|	<div data-dojo-type="dojox.mobile.Icon"
		//	|		data-dojo-props='icon:"images/tab-icons.png",iconPos:"29,116,29,29"'></div>
		//
		//		DOM Button:
		//	|	<div data-dojo-type="dojox.mobile.Icon"
		//	|		data-dojo-props='icon:"mblDomButtonBlueCircleArrow"'></div>

		icon: "",
		iconPos: "",
		alt: "",
		tag: "div",

		constructor: function(args, node){
			if(args){
				lang.mixin(this, args);
			}
			this.domNode = node || domConstruct.create(this.tag);
			iconUtils.createIcon(this.icon, this.iconPos, null, this.alt, this.domNode);
		}
	});
});

},
'dojox/mobile/DatePicker':function(){
define("dojox/mobile/DatePicker", [
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(declare, lang){

	// module:
	//		dojox/mobile/DatePicker
	// summary:
	//		

	var dm = lang.getObject("dojox.mobile", true);
	var pickerClass = dm.currentTheme === "android" ?
		"dojox/mobile/ValuePickerDatePicker" : "dojox/mobile/SpinWheelDatePicker";

	var cls = declare("dojox.mobile.DatePicker", null, {});

	require([pickerClass], lang.hitch(this, function(module){
		cls.prototype = module.prototype;
	}));

	return cls;
});

},
'dojox/mobile/Slider':function(){
define("dojox/mobile/Slider", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/form/_FormValueMixin"
],
	function(array, connect, declare, lang, win, domClass, domConstruct, domGeometry, domStyle, keys, WidgetBase, FormValueMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormValueMixin = dijit.form._FormValueMixin;
	=====*/
	return declare("dojox.mobile.Slider", [WidgetBase, FormValueMixin], {
		// summary:
		//		A non-templated Slider widget similar to the HTML5 INPUT type=range.
		//

		// value: [const] Number
		//		The current slider value.
		value: 0,

		// min: [const] Number
		//		The first value the slider can be set to.
		min: 0,

		// max: [const] Number
		//		The last value the slider can be set to.
		max: 100,

		// step: [const] Number
		//		The delta from 1 value to another.
		//		This causes the slider handle to snap/jump to the closest possible value.
		//		A value of 0 means continuous (as much as allowed by pixel resolution).
		step: 1,

		baseClass: "mblSlider",

		// flip: [const] Boolean
		//		Specifies if the slider should change its default: ascending <--> descending.
		flip: false,

		// orientation: [const] String
		//		The slider direction.
		//		"H": horizontal
		//		"V": vertical
		//		"auto": use width/height comparison at instantiation time (default is "H" if width/height are 0)
		orientation: "auto",

		// halo: Number
		//		Size of the boundary that extends beyond the edges of the slider
		//		to make it easier to touch.
		halo: "8pt",

		buildRendering: function(){
			this.focusNode = this.domNode = domConstruct.create("div", {});
			this.valueNode = domConstruct.create("input", (this.srcNodeRef && this.srcNodeRef.name) ? { type: "hidden", name: this.srcNodeRef.name } : { type: "hidden" }, this.domNode, "last");
			var relativeParent = domConstruct.create("div", { style: { position:"relative", height:"100%", width:"100%" } }, this.domNode, "last");
			this.progressBar = domConstruct.create("div", { style:{ position:"absolute" }, "class":"mblSliderProgressBar" }, relativeParent, "last");
			this.touchBox = domConstruct.create("div", { style:{ position:"absolute" }, "class":"mblSliderTouchBox" }, relativeParent, "last");
			this.handle = domConstruct.create("div", { style:{ position:"absolute" }, "class":"mblSliderHandle" }, relativeParent, "last");
			this.inherited(arguments);
		},

		_setValueAttr: function(/*Number*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so set('value', value) works.
			value = Math.max(Math.min(value, this.max), this.min);
			var fromPercent = (this.value - this.min) * 100 / (this.max - this.min);
			this.valueNode.value = value;
			this.inherited(arguments);
			if(!this._started){ return; } // don't move images until all the properties are set
			this.focusNode.setAttribute("aria-valuenow", value);
			var toPercent = (value - this.min) * 100 / (this.max - this.min);
			// now perform visual slide
			var horizontal = this.orientation != "V";
			if(priorityChange === true){
				domClass.add(this.handle, "mblSliderTransition");
				domClass.add(this.progressBar, "mblSliderTransition");
			}else{
				domClass.remove(this.handle, "mblSliderTransition");
				domClass.remove(this.progressBar, "mblSliderTransition");
			}
			domStyle.set(this.handle, this._attrs.handleLeft, (this._reversed ? (100-toPercent) : toPercent) + "%");
			domStyle.set(this.progressBar, this._attrs.width, toPercent + "%");
		},

		postCreate: function(){
			this.inherited(arguments);

			function beginDrag(e){
				function getEventData(e){
					point = isMouse ? e[this._attrs.pageX] : (e.touches ? e.touches[0][this._attrs.pageX] : e[this._attrs.clientX]);
					pixelValue = point - startPixel;
					pixelValue = Math.min(Math.max(pixelValue, 0), maxPixels);
					var discreteValues = this.step ? ((this.max - this.min) / this.step) : maxPixels;
					if(discreteValues <= 1 || discreteValues == Infinity ){ discreteValues = maxPixels; }
					var wholeIncrements = Math.round(pixelValue * discreteValues / maxPixels);
					value = (this.max - this.min) * wholeIncrements / discreteValues;
					value = this._reversed ? (this.max - value) : (this.min + value);
				}
				function continueDrag(e){
					e.preventDefault();
					lang.hitch(this, getEventData)(e);
					this.set('value', value, false);
				}
		
				function endDrag(e){
					e.preventDefault();
					array.forEach(actionHandles, lang.hitch(this, "disconnect"));
					actionHandles = [];
					this.set('value', this.value, true);
				}

				e.preventDefault();
				var isMouse = e.type == "mousedown";
				var box = domGeometry.position(node, false); // can't use true since the added docScroll and the returned x are body-zoom incompatibile
				var bodyZoom = domStyle.get(win.body(), "zoom") || 1;
				if(isNaN(bodyZoom)){ bodyZoom = 1; }
				var nodeZoom = domStyle.get(node, "zoom") || 1;
				if(isNaN(nodeZoom)){ nodeZoom = 1; }
				var startPixel = box[this._attrs.x] * nodeZoom * bodyZoom + domGeometry.docScroll()[this._attrs.x];
				var maxPixels = box[this._attrs.w] * nodeZoom * bodyZoom;
				lang.hitch(this, getEventData)(e);
				if(e.target == this.touchBox){
					this.set('value', value, true);
				}
				array.forEach(actionHandles, connect.disconnect);
				var root = win.doc.documentElement;
				var actionHandles = [
					this.connect(root, isMouse ? "onmousemove" : "ontouchmove", continueDrag),
					this.connect(root, isMouse ? "onmouseup" : "ontouchend", endDrag)
				];
			}

			function keyPress(/*Event*/ e){
				if(this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey){ return; }
				var	step = this.step,
					multiplier = 1,
					newValue;
				switch(e.keyCode){
					case keys.HOME:
						newValue = this.min;
						break;
					case keys.END:
						newValue = this.max;
						break;
					case keys.RIGHT_ARROW:
						multiplier = -1;
					case keys.LEFT_ARROW:
						newValue = this.value + multiplier * ((flip && horizontal) ? step : -step);
						break;
					case keys.DOWN_ARROW:
						multiplier = -1;
					case keys.UP_ARROW:
						newValue = this.value + multiplier * ((!flip || horizontal) ? step : -step);
						break;
					default:
						return;
				}
				e.preventDefault();
				this._setValueAttr(newValue, false);
			}

			function keyUp(/*Event*/ e){
				if(this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey){ return; }
				this._setValueAttr(this.value, true);
			}

			var	point, pixelValue, value,
				node = this.domNode;
			if(this.orientation == "auto"){
				 this.orientation = node.offsetHeight <= node.offsetWidth ? "H" : "V";
			}
			// add V or H suffix to baseClass for styling purposes
			domClass.add(this.domNode, array.map(this.baseClass.split(" "), lang.hitch(this, function(c){ return c+this.orientation; })));
			var	horizontal = this.orientation != "V",
				ltr = horizontal ? this.isLeftToRight() : false,
				flip = !!this.flip;
			// _reversed is complicated since you can have flipped right-to-left and vertical is upside down by default
			this._reversed = !((horizontal && ((ltr && !flip) || (!ltr && flip))) || (!horizontal && flip));
			this._attrs = horizontal ? { x:'x', w:'w', l:'l', r:'r', pageX:'pageX', clientX:'clientX', handleLeft:"left", left:this._reversed ? "right" : "left", width:"width" } : { x:'y', w:'h', l:'t', r:'b', pageX:'pageY', clientX:'clientY', handleLeft:"top", left:this._reversed ? "bottom" : "top", width:"height" };
			this.progressBar.style[this._attrs.left] = "0px";
			this.connect(this.touchBox, "ontouchstart", beginDrag);
			this.connect(this.touchBox, "onmousedown", beginDrag); // in case this works
			this.connect(this.handle, "ontouchstart", beginDrag);
			this.connect(this.handle, "onmousedown", beginDrag); // in case this works
			this.connect(this.domNode, "onkeypress", keyPress); // for desktop a11y
			this.connect(this.domNode, "onkeyup", keyUp); // fire onChange on desktop
			this.startup();
			this.set('value', this.value);
		}
	});
});

},
'dojox/mobile/Tooltip':function(){
define("dojox/mobile/Tooltip", [
	"dojo/_base/array", // array.forEach
	"dijit/registry",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/place",
	"dijit/_WidgetBase"
], function(array, registry, declare, lang, domClass, domConstruct, domGeometry, domStyle, place, WidgetBase){

	/*=====
		WidgetBase = dijit._WidgetBase;
	=====*/
	return declare("dojox.mobile.Tooltip", WidgetBase, {
		// summary:
		//		A non-templated popup bubble widget
		//

		baseClass: "mblTooltip mblTooltipHidden",

		buildRendering: function(){
			// create the helper nodes here in case the user overwrote domNode.innerHTML
			this.inherited(arguments);
			this.anchor = domConstruct.create("div", {"class":"mblTooltipAnchor"}, this.domNode, "first");
			this.arrow = domConstruct.create("div", {"class":"mblTooltipArrow"}, this.anchor);
			this.innerArrow = domConstruct.create("div", {"class":"mblTooltipInnerArrow"}, this.anchor);
		},

		show: function(/*DomNode*/ aroundNode, positions){
			// summary:
			//		Pop up the tooltip and point to aroundNode using the best position
			// positions:
			//		Ordered list of positions to try matching up.
			//			* before: places drop down before the aroundNode
			//			* after: places drop down after the aroundNode
			//			* above-centered: drop down goes above aroundNode
			//			* below-centered: drop down goes below aroundNode
			var domNode = this.domNode;
			var connectorClasses = {
				"MRM": "mblTooltipAfter",
				"MLM": "mblTooltipBefore",
				"BMT": "mblTooltipBelow",
				"TMB": "mblTooltipAbove",
				"BLT": "mblTooltipBelow",
				"TLB": "mblTooltipAbove",
				"BRT": "mblTooltipBelow",
				"TRB": "mblTooltipAbove",
				"TLT": "mblTooltipBefore",
				"TRT": "mblTooltipAfter",
				"BRB": "mblTooltipAfter",
				"BLB": "mblTooltipBefore"
			};
			domClass.remove(domNode, ["mblTooltipAfter","mblTooltipBefore","mblTooltipBelow","mblTooltipAbove"]);
			array.forEach(registry.findWidgets(domNode), function(widget){
				if(widget.height == "auto" && typeof widget.resize == "function"){
					if(!widget.fixedFooterHeight){
						widget.fixedFooterHeight = domGeometry.getPadBorderExtents(domNode).b;
					}
					widget.resize();
				}
			});
			var best = place.around(domNode, aroundNode, positions || ['below-centered', 'above-centered', 'after', 'before'], this.isLeftToRight());
			var connectorClass = connectorClasses[best.corner + best.aroundCorner.charAt(0)] || '';
			domClass.add(domNode, connectorClass);
			var pos = domGeometry.position(aroundNode, true);
			domStyle.set(this.anchor, (connectorClass == "mblTooltipAbove" || connectorClass == "mblTooltipBelow")
				? { top: "", left: Math.max(0, pos.x - best.x + (pos.w >> 1) - (this.arrow.offsetWidth >> 1)) + "px" }
				: { left: "", top: Math.max(0, pos.y - best.y + (pos.h >> 1) - (this.arrow.offsetHeight >> 1)) + "px" }
			);
			domClass.replace(domNode, "mblTooltipVisible", "mblTooltipHidden");
			this.resize = lang.hitch(this, "show", aroundNode, positions); // orientation changes
			return best;
		},

		hide: function(){
			// summary:
			//		Pop down the tooltip
			this.resize = undefined;
			domClass.replace(this.domNode, "mblTooltipHidden", "mblTooltipVisible");
		},

		onBlur: function(/*Event*/e){
			return true; // touching outside the overlay area does call hide() by default
		},

		destroy: function(){
			if(this.anchor){
				this.anchor.removeChild(this.innerArrow);
				this.anchor.removeChild(this.arrow);
				this.domNode.removeChild(this.anchor);
				this.anchor = this.arrow = this.innerArrow = undefined;
			}
			this.inherited(arguments);
		}
	});
});

},
'dojox/mobile/Rating':function(){
define("dojox/mobile/Rating", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"./iconUtils"
], function(declare, lang, domConstruct, WidgetBase, iconUtils){

/*=====
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Rating
	// summary:
	//		A widget that shows rating with stars.

	return declare("dojox.mobile.Rating", WidgetBase, {
		// summary:
		//		A widget that shows rating with stars.
		// description:
		//		This widget simply shows specified number of stars. It is a
		//		read-only widget, and has no editing capability.

		// image: String
		//		Path to a star image, which includes three stars, full star,
		//		empty star, and half star, from left to right.
		image: "",

		// numStars: Number
		//		The number of stars to show.
		numStars: 5,

		// value: Number
		//		The current value of the Rating.
		value: 0,

		// alt: String
		//		An alt text for the icon image.
		alt: "",

		/* internal properties */	
		baseClass: "mblRating",

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.style.display = "inline-block";
			var img = this.imgNode = domConstruct.create("img");
			this.connect(img, "onload",
				lang.hitch(this, function(){ this.set("value", this.value); }));
			iconUtils.createIcon(this.image, null, img);
		},

		_setValueAttr: function(value){
			this._set("value", value);
			var h = this.imgNode.height;
			if(h == 0){ return; } // loading of image has not been completed yet
			domConstruct.empty(this.domNode);
			var i, left, w = this.imgNode.width / 3;
			for(i = 0; i < this.numStars; i++){
				if(i <= value - 1){
					left = 0; // full
				}else if(i >= value){
					left = w; // empty
				}else{
					left = w * 2; // half
				}
				var parent = domConstruct.create("div", {
					style: {"float": "left"}
				}, this.domNode);
				iconUtils.createIcon(this.image,
					"0," + left + "," + w + "," + h, null, this.alt, parent);
			}
		}
	});
});

},
'dojox/mobile/SpinWheelDatePicker':function(){
define("dojox/mobile/SpinWheelDatePicker", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"./_DatePickerMixin",
	"./SpinWheel",
	"./SpinWheelSlot"
], function(array, declare, domClass, DatePickerMixin, SpinWheel, SpinWheelSlot){

/*=====
	var SpinWheel = dojox.mobile.SpinWheel;
	var SpinWheelSlot = dojox.mobile.SpinWheelSlot;
=====*/

	// module:
	//		dojox/mobile/SpinWheelDatePicker
	// summary:
	//		A SpinWheel-based date picker widget.

	return declare("dojox.mobile.SpinWheelDatePicker", [SpinWheel, DatePickerMixin], {
		// summary:
		//		A SpinWheel-based date picker widget.
		// description:
		//		SpinWheelDatePicker is a date picker widget. It is a subclass of
		//		dojox.mobile.SpinWheel. It has the year, month, and day slots.

		slotClasses: [
			SpinWheelSlot,
			SpinWheelSlot,
			SpinWheelSlot
		],

		slotProps: [
			{labelFrom:1970, labelTo:2038},
			{},
			{}
		],

		buildRendering: function(){
			this.initSlots();
			this.inherited(arguments);
			domClass.add(this.domNode, "mblSpinWheelDatePicker");
			this._conn = [
				this.connect(this.slots[0], "onFlickAnimationEnd", "onYearSet"),
				this.connect(this.slots[1], "onFlickAnimationEnd", "onMonthSet"),
				this.connect(this.slots[2], "onFlickAnimationEnd", "onDaySet")
			];
		},

		disableValues: function(/*Number*/nDays){
			// summary:
			//		Makes the specified items grayed out.
			array.forEach(this.slots[2].panelNodes, function(panel){
				for(var i = 27; i < 31; i++){
					domClass.toggle(panel.childNodes[i], "mblSpinWheelSlotLabelGray", i >= nDays);
				}
			});
		}
	});
});

},
'dojox/main':function(){
define("dojox/main", ["dojo/_base/kernel"], function(dojo) {
	// module:
	//		dojox/main
	// summary:
	//		The dojox package main module; dojox package is somewhat unusual in that the main module currently just provides an empty object.

	return dojo.dojox;
});
},
'dojox/mobile/IconContainer':function(){
define("dojox/mobile/IconContainer", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./IconItem", // to load IconItem for you (no direct references)
	"./Heading",
	"./View"
], function(array, declare, lang, win, domConstruct, Contained, Container, WidgetBase, IconItem, Heading, View){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/IconContainer
	// summary:
	//		A container widget that holds multiple icons.

	return declare("dojox.mobile.IconContainer", [WidgetBase, Container, Contained],{
		// summary:
		//		A container widget that holds multiple icons.
		// description:
		//		IconContainer is a container widget that holds multiple icons
		//		each of which represents application component.

		// defaultIcon: String
		//		The default fall-back icon, which is displayed only when the
		//		specified icon has failed to load.
		defaultIcon: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation. If "below" is specified,
		//		the application contents are displayed below the icons.
		transition: "below",

		// pressedIconOpacity: Number
		//		The opacity of the pressed icon image.
		pressedIconOpacity: 0.4,

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// back: String
		//		A label for the navigational control.
		back: "Home",

		// label: String
		//		A title text of the heading.
		label: "My Application",

		// single: Boolean
		//		If true, only one icon content can be opened at a time.
		single: false,

		// editable: Boolean
		//		If true, the icons can be removed or re-ordered.
		editable: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		/* internal properties */	
		baseClass: "mblIconContainer",
		editableMixinClass: "dojox/mobile/_EditableIconMixin",
		iconItemPaneContainerClass: "dojox/mobile/Container",
		iconItemPaneContainerProps: null,
		iconItemPaneClass: "dojox/mobile/_IconItemPane",
		iconItemPaneProps: null,

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			// _terminator is used to apply the clear:both style to terminate floating icons.
			this._terminator = domConstruct.create(this.tag === "ul" ? "li" : "div",
				{className:"mblIconItemTerminator"}, this.domNode);
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.editable && !this.startEdit){ // if editable is true but editableMixinClass is not inherited
				require([this.editableMixinClass], lang.hitch(this, function(module){
					declare.safeMixin(this, new module());
					this.set("editable", this.editable);
				}));
			}
		},

		startup: function(){
			if(this._started){ return; }

			require([this.iconItemPaneContainerClass], lang.hitch(this, function(module){
				this.paneContainerWidget = new module(this.iconItemPaneContainerProps);
				if(this.transition === "below"){
					domConstruct.place(this.paneContainerWidget.domNode, this.domNode, "after");
				}else{
					var view = this.appView = new View({id:this.id+"_mblApplView"});
					var _this = this;
					view.onAfterTransitionIn = function(moveTo, dir, transition, context, method){
						_this._opening._open_1();
					};
					view.domNode.style.visibility = "hidden";
					var heading = view._heading
						= new Heading({back: this._cv ? this._cv(this.back) : this.back,
										label: this._cv ? this._cv(this.label) : this.label,
										moveTo: this.domNode.parentNode.id,
										transition: this.transition == "zoomIn" ? "zoomOut" : this.transition});
					heading.placeAt(view.domNode);
					if(view._started){
						heading.startup();
					}
					this.paneContainerWidget.placeAt(view.domNode);
					if(view._started){
						this.paneContainerWidget.startup();
					}

					var target;
					for(var w = this.getParent(); w; w = w.getParent()){
						if(w instanceof View){
							target = w.domNode.parentNode;
							break;
						}
					}
					if(!target){ target = win.body(); }
					target.appendChild(view.domNode);

					view.startup();
				}
			}));

			this.inherited(arguments);
		},

		closeAll: function(){
			// summary:
			//		Closes all the icon items.
			array.forEach(this.getChildren(), function(w){
				w.close(true); // disables closing animation
			}, this);
		},

		addChild: function(widget, /*Number?*/insertIndex){
			this.inherited(arguments);
			this.domNode.appendChild(this._terminator); // to ensure that _terminator is always the last node
		},

		removeChild: function(/*Widget|Number*/widget){
			var index = (typeof widget == "number") ? widget : widget.getIndexInParent();
			this.paneContainerWidget.removeChild(index);
			this.inherited(arguments);
		},	

		_setLabelAttr: function(/*String*/text){
			if(!this.appView){ return; }
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.appView._heading.set("label", s);
		}
	});
});

},
'dojox/mobile/ValuePickerDatePicker':function(){
define("dojox/mobile/ValuePickerDatePicker", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"./_DatePickerMixin",
	"./ValuePicker",
	"./ValuePickerSlot"
], function(declare, domClass, DatePickerMixin, ValuePicker, ValuePickerSlot){

	// module:
	//		dojox/mobile/ValuePickerDatePicker
	// summary:
	//		A ValuePicker-based date picker widget.

	return declare("dojox.mobile.ValuePickerDatePicker", [ValuePicker, DatePickerMixin], {
		// readOnly: Boolean
		//		If true, slot input fields are read-only. Only the plus and
		//		minus buttons can be used to change the values.
		readOnly: false,

		slotClasses: [
			ValuePickerSlot,
			ValuePickerSlot,
			ValuePickerSlot
		],

		slotProps: [
			{labelFrom:1970, labelTo:2038, style:{width:"87px"}},
			{style:{width:"72px"}},
			{style:{width:"72px"}}
		],

		buildRendering: function(){
			var p = this.slotProps;
			p[0].readOnly = p[1].readOnly = p[2].readOnly = this.readOnly;
			this.initSlots();
			this.inherited(arguments);
			domClass.add(this.domNode, "mblValuePickerDatePicker");
			this._conn = [
				this.connect(this.slots[0], "_setValueAttr", "onYearSet"),
				this.connect(this.slots[1], "_setValueAttr", "onMonthSet"),
				this.connect(this.slots[2], "_setValueAttr", "onDaySet")
			];
		},

		disableValues: function(/*Number*/daysInMonth){
			var items = this.slots[2].items;
			if(this._tail){
				this.slots[2].items = items = items.concat(this._tail);
			}
			this._tail = items.slice(daysInMonth);
			items.splice(daysInMonth);
		}
	});
});

},
'dojox/mobile/SimpleDialog':function(){
define("dojox/mobile/SimpleDialog", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./Pane",
	"./iconUtils"
], function(declare, win, domClass, domConstruct, Pane, iconUtils){
	// module:
	//		dojox/mobile/SimpleDialog
	// summary:
	//		TODOC

	return declare("dojox.mobile.SimpleDialog", Pane, {
		title: "",
		top: "auto",
		left: "auto",
		modal: true,
		closeButton: false,
		closeButtonClass: "mblDomButtonSilverCircleRedCross",

		// tabIndex: String
		//		Tabindex setting for the item so users can hit the tab key to
		//		focus on it.
		tabIndex: "0",
		_setTabIndexAttr: "", // sets tabIndex to domNode

		/* internal properties */	
		baseClass: "mblSimpleDialog",
		_cover: [], // array is to share the cover instance

		buildRendering: function(){
			this.containerNode = domConstruct.create("div", {className:"mblSimpleDialogContainer"});
			if(this.srcNodeRef){
				// reparent
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this.containerNode.appendChild(this.srcNodeRef.removeChild(this.srcNodeRef.firstChild));
				}
			}
			this.inherited(arguments);
			domClass.add(this.domNode, "mblSimpleDialogDecoration");
			this.domNode.style.display = "none";
			this.domNode.appendChild(this.containerNode);
			if(this.closeButton){
				this.closeButtonNode = domConstruct.create("div", {
					className: "mblSimpleDialogCloseBtn "+this.closeButtonClass
				}, this.domNode);
				iconUtils.createDomButton(this.closeButtonNode);
				this._clickHandle = this.connect(this.closeButtonNode, "onclick", "_onCloseButtonClick");
			}
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onKeyDown"); // for desktop browsers
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
		},

		addCover: function(){
			if(!this._cover[0]){
				this._cover[0] = domConstruct.create("div", {
					className: "mblSimpleDialogCover"
				}, win.body());
			}else{
				this._cover[0].style.display = "";
			}
		},

		removeCover: function(){
			this._cover[0].style.display = "none";
		},

		_onCloseButtonClick: function(e){
			if(this.onCloseButtonClick(e) === false){ return; } // user's click action
			this.hide();
		},

		onCloseButtonClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_onKeyDown: function(e){
			if(e.keyCode == 27){ // ESC
				this.hide();
			}
		},

		refresh: function(){ // TODO: should we call refresh on resize?
			var n = this.domNode;
			if(this.closeButton){
				var b = this.closeButtonNode;
				var s = Math.round(b.offsetHeight / 2);
				b.style.top = -s + "px";
				b.style.left = n.offsetWidth - s + "px";
			}
			if(this.top === "auto"){
				var h = win.global.innerHeight || win.doc.documentElement.clientHeight;
				n.style.top = Math.round((h - n.offsetHeight) / 2) + "px";
			}else{
				n.style.top = this.top;
			}
			if(this.left === "auto"){
				var h = win.global.innerWidth || win.doc.documentElement.clientWidth;
				n.style.left = Math.round((h - n.offsetWidth) / 2) + "px";
			}else{
				n.style.left = this.left;
			}
		},

		show: function(){
			if(this.domNode.style.display === ""){ return; }
			if(this.modal){
				this.addCover();
			}
			this.domNode.style.display = "";
			this.refresh();
			this.domNode.focus();
		},

		hide: function(){
			if(this.domNode.style.display === "none"){ return; }
			this.domNode.style.display = "none";
			if(this.modal){
				this.removeCover();
			}
		}
	});
});

},
'dojox/mobile/_EditableIconMixin':function(){
define("dojox/mobile/_EditableIconMixin", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/touch",
	"dijit/registry",
	"./IconItem",
	"./sniff"
], function(array, connect, declare, event, lang, domGeometry, domStyle, touch, registry, IconItem, has){

	// module:
	//		dojox/mobile/_EditableIconMixin
	// summary:
	//		A mixin for IconContainer so it can be editable.

	return declare("dojox.mobile._EditableIconMixin", null, {
		// summary:
		//		A mixin for IconContainer so it can be editable.
		// description:
		//		

		deleteIconForEdit: "mblDomButtonBlackCircleCross",
		threshold: 4, // drag threshold value in pixels

		destroy: function(){
			if(this._blankItem){
				this._blankItem.destroy();
			}
			this.inherited(arguments);
		},

		startEdit: function(){
			if(!this.editable || this.isEditing){ return; }

			this.isEditing = true;
			if(!this._handles){
				this._handles = [
					this.connect(this.domNode, "webkitTransitionStart", "_onTransitionStart"),
					this.connect(this.domNode, "webkitTransitionEnd", "_onTransitionEnd")
				];
			}

			var count = 0;
			array.forEach(this.getChildren(), function(w){
				setTimeout(lang.hitch(this, function(){
					w.set("deleteIcon", this.deleteIconForEdit);
					if(w.deleteIconNode){
						w._deleteHandle = this.connect(w.deleteIconNode, "onclick", "_deleteIconClicked");
					}
					w.highlight(0);
				}), 15*count++);
			}, this);

			connect.publish("/dojox/mobile/startEdit", [this]); // pubsub
			this.onStartEdit(); // callback
		},

		endEdit: function(){
			if(!this.isEditing){ return; }

			array.forEach(this.getChildren(), function(w){
				w.unhighlight();
				if(w._deleteHandle){
					this.disconnect(w._deleteHandle);
					w._deleteHandle = null;
				}
				w.set("deleteIcon", "");
			}, this);

			this._movingItem = null;
			if(this._handles){
				array.forEach(this._handles, this.disconnect, this);
				this._handles = null;
			}

			connect.publish("/dojox/mobile/endEdit", [this]); // pubsub
			this.onEndEdit(); // callback
			this.isEditing = false;
		},

		scaleItem: function(/*Widget*/widget, /*Number*/ratio){
			domStyle.set(widget.domNode, {
				webkitTransition: has("android") ? "" : "-webkit-transform .1s ease-in-out",
				webkitTransform: ratio == 1 ? "" : "scale(" + ratio + ")"
			});			
		},

		_onTransitionStart: function(e){
			event.stop(e);
		},

		_onTransitionEnd: function(e){
			event.stop(e);
			var w = registry.getEnclosingWidget(e.target);
			w._moving = false;
			domStyle.set(w.domNode, "webkitTransition", "");
		},

		_onTouchStart: function(e){
			if(!this._blankItem){
				this._blankItem = new IconItem();
				this._blankItem.domNode.style.visibility = "hidden";
				this._blankItem._onClick = function(){};
			}
			var item = this._movingItem = registry.getEnclosingWidget(e.target);
			var iconPressed = false;
			for(var n = e.target; n !== item.domNode; n = n.parentNode){
				if(n === item.iconNode){
					iconPressed = true;
					break;
				}
			}
			if(!iconPressed){ return; }

			if(!this._conn){
				this._conn = [
					this.connect(this.domNode, touch.move, "_onTouchMove"),
					this.connect(this.domNode, touch.release, "_onTouchEnd")
				];
			}
			this._touchStartPosX = e.touches ? e.touches[0].pageX : e.pageX;
			this._touchStartPosY = e.touches ? e.touches[0].pageY : e.pageY;
			if(this.isEditing){
				this._onDragStart(e);
			}else{
				// set timer to detect long press
				this._pressTimer = setTimeout(lang.hitch(this, function(){
					this.startEdit();
					this._onDragStart(e);
				}), 1000);
			}
		},

		_onDragStart: function(e){
			this._dragging = true;

			var movingItem = this._movingItem;
			if(movingItem.get("selected")){
				movingItem.set("selected", false);
			}
			this.scaleItem(movingItem, 1.1);

			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			var startPos = this._startPos = domGeometry.position(movingItem.domNode, true);
			this._offsetPos = {
				x: startPos.x - x,
				y: startPos.y - y
			};

			this._startIndex = this.getIndexOfChild(movingItem);
			this.addChild(this._blankItem, this._startIndex);
			this.moveChild(movingItem, this.getChildren().length);
			domStyle.set(movingItem.domNode, {
				position: "absolute",
				top: startPos.y + "px",
				left: startPos.x + "px",
				zIndex: 100
			});
		},

		_onTouchMove: function(e){
			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			if(this._dragging){
				domStyle.set(this._movingItem.domNode, {
					top: (this._offsetPos.y + y) + "px",
					left: (this._offsetPos.x + x) + "px"
				});
				this._detectOverlap({x: x, y: y});
				event.stop(e);
			}else{
				var dx = Math.abs(this._touchStartPosX - x);
				var dy = Math.abs(this._touchStartPosY - y);
				if (dx > this.threshold || dy > this.threshold) {
					this._clearPressTimer();					
				}
			}
		},

		_onTouchEnd: function(e){
			this._clearPressTimer();
			if(this._conn){
				array.forEach(this._conn, this.disconnect, this);
				this._conn = null;				
			}

			if(this._dragging){
				this._dragging = false;

				var movingItem = this._movingItem;
				this.scaleItem(movingItem, 1.0);
				domStyle.set(movingItem.domNode, {
					position: "",
					top: "",
					left: "",
					zIndex: ""
				});
				var startIndex = this._startIndex;
				var endIndex = this.getIndexOfChild(this._blankItem);
				this.moveChild(movingItem, endIndex);
				this.removeChild(this._blankItem);
				connect.publish("/dojox/mobile/moveIconItem", [this, movingItem, startIndex, endIndex]); // pubsub
				this.onMoveItem(movingItem, startIndex, endIndex); // callback
			}
		},

		_clearPressTimer: function(){
			if(this._pressTimer){
				clearTimeout(this._pressTimer);
				this._pressTimer = null;
			}
		},

		_detectOverlap: function(/*Object*/point){
			var children = this.getChildren(),
				blankItem = this._blankItem,
				blankPos = domGeometry.position(blankItem.domNode, true),
				blankIndex = this.getIndexOfChild(blankItem),
				dir = 1;
			if(this._contains(point, blankPos)){
				return;
			}else if(point.y < blankPos.y || (point.y <= blankPos.y + blankPos.h && point.x < blankPos.x)){
				dir = -1;
			}
			for(var i = blankIndex + dir; i>=0 && i<children.length-1; i += dir){
				var w = children[i];
				if(w._moving){ continue; }
				var pos = domGeometry.position(w.domNode, true);
				if(this._contains(point, pos)){
					setTimeout(lang.hitch(this, function(){
						this.moveChildWithAnimation(blankItem, dir == 1 ? i+1 : i);
					}),0);
					break;
				}else if((dir == 1 && pos.y > point.y) || (dir == -1 && pos.y + pos.h < point.y)){
					break;
				}
			}
		},

		_contains: function(point, pos){
			return pos.x < point.x && point.x < pos.x + pos.w && pos.y < point.y && point.y < pos.y + pos.h;
		},

		_animate: function(/*Integer*/from, /*Integer*/to){
			if(from == to) { return; }
			var dir = from < to ? 1 : -1;
			var children = this.getChildren();
			var posArray = [];
			for(var i=from; i!=to; i+=dir){
				posArray.push({
					t: (children[i+dir].domNode.offsetTop - children[i].domNode.offsetTop) + "px",
					l: (children[i+dir].domNode.offsetLeft - children[i].domNode.offsetLeft) + "px"
				});
			}
			for(var i=from, j=0; i!=to; i+=dir, j++){
				var w = children[i];
				w._moving = true;
				domStyle.set(w.domNode, {
					top: posArray[j].t,
					left: posArray[j].l
				});
				setTimeout(lang.hitch(w, function(){
					domStyle.set(this.domNode, {
						webkitTransition: "top .3s ease-in-out, left .3s ease-in-out",
						top: "0px",
						left: "0px"
					});
				}), j*10);
			}
		},

		removeChildWithAnimation: function(/*Widget|Number*/widget){
			var index = (typeof widget === "number") ? widget : this.getIndexOfChild(widget);
			this.removeChild(widget);

			// Show remove animation
			this.addChild(this._blankItem);
			this._animate(index, this.getChildren().length - 1);
			this.removeChild(this._blankItem);
		},

		moveChild: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			this.addChild(widget, insertIndex);
			this.paneContainerWidget.addChild(widget.paneWidget, insertIndex);
		},

		moveChildWithAnimation: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			var index = this.getIndexOfChild(this._blankItem);
			this.moveChild(widget, insertIndex);

			// Show move animation
			this._animate(index, insertIndex);
		},

		_deleteIconClicked: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.deleteIconClicked(e) === false){ return; } // user's click action
			var item = registry.getEnclosingWidget(e.target);
			this.deleteItem(item);
		},

		deleteIconClicked: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		deleteItem: function(item){
			if(item._deleteHandle){
				this.disconnect(item._deleteHandle);
			}
			this.removeChildWithAnimation(item);

			connect.publish("/dojox/mobile/deleteIconItem", [this, item]); // pubsub
			this.onDeleteItem(item); // callback

			item.destroy();
		},

		onDeleteItem: function(/*Widget*/item){
			// Stub function to connect to from your application.
		},

		onMoveItem: function(/*Widget*/item, /*Integer*/from, /*Ingeter*/to){
			// Stub function to connect to from your application.
		},

		onStartEdit: function(){
			// Stub function to connect to from your application.
		},

		onEndEdit: function(){
			// Stub function to connect to from your application.
		},

		_setEditableAttr: function(/*Boolean*/editable){
			this._set("editable", editable);
			if(editable && !this._touchStartHandle){ // Allow users to start editing by long press on IconItems
				this._touchStartHandle = this.connect(this.domNode, touch.press, "_onTouchStart");
			}else if(!editable && this._touchStartHandle){
				this.disconnect(this._touchStartHandle);
				this._touchStartHandle = null;
			}
		}
	});
});

},
'dojox/mobile/Switch':function(){
define("dojox/mobile/Switch", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/touch",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./sniff"
], function(array, connect, declare, event, win, domClass, domConstruct, domStyle, touch, Contained, WidgetBase, has){

/*=====
	Contained = dijit._Contained;
	WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Switch
	// summary:
	//		A toggle switch with a sliding knob.

	return declare("dojox.mobile.Switch", [WidgetBase, Contained],{
		// summary:
		//		A toggle switch with a sliding knob.
		// description:
		//		Switch is a toggle switch with a sliding knob. You can either
		//		tap or slide the knob to toggle the switch. The onStateChanged
		//		handler is called when the switch is manipulated.

		// value: String
		//		The initial state of the switch. "on" or "off". The default
		//		value is "on".
		value: "on",

		// name: String
		//		A name for a hidden input field, which holds the current value.
		name: "",

		// leftLabel: String
		//		The left-side label of the switch.
		leftLabel: "ON",

		// rightLabel: String
		//		The right-side label of the switch.
		rightLabel: "OFF",

		// shape: String
		//		The shape of the switch.
		//		"mblSwDefaultShape", "mblSwSquareShape", "mblSwRoundShape1",
		//		"mblSwRoundShape2", "mblSwArcShape1" or "mblSwArcShape2".
		//		The default value is "mblSwDefaultShape".
		shape: "mblSwDefaultShape",

		// tabIndex: String
		//		Tabindex setting for this widget so users can hit the tab key to
		//		focus on it.
		tabIndex: "0",
		_setTabIndexAttr: "", // sets tabIndex to domNode

		/* internal properties */
		baseClass: "mblSwitch",
		role: "", // a11y
		_createdMasks: [],

		buildRendering: function(){
			this.domNode = (this.srcNodeRef && this.srcNodeRef.tagName === "SPAN") ?
				this.srcNodeRef : domConstruct.create("span");
			this.inherited(arguments);
			var c = (this.srcNodeRef && this.srcNodeRef.className) || this.className || this["class"];
			if((c = c.match(/mblSw.*Shape\d*/))){ this.shape = c; }
			domClass.add(this.domNode, this.shape);
			var nameAttr = this.name ? " name=\"" + this.name + "\"" : "";
			this.domNode.innerHTML =
				  '<div class="mblSwitchInner">'
				+	'<div class="mblSwitchBg mblSwitchBgLeft">'
				+		'<div class="mblSwitchText mblSwitchTextLeft"></div>'
				+	'</div>'
				+	'<div class="mblSwitchBg mblSwitchBgRight">'
				+		'<div class="mblSwitchText mblSwitchTextRight"></div>'
				+	'</div>'
				+	'<div class="mblSwitchKnob"></div>'
				+	'<input type="hidden"'+nameAttr+'></div>'
				+ '</div>';
			var n = this.inner = this.domNode.firstChild;
			this.left = n.childNodes[0];
			this.right = n.childNodes[1];
			this.knob = n.childNodes[2];
			this.input = n.childNodes[3];
		},

		postCreate: function(){
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers
			this._startHandle = this.connect(this.domNode, touch.press, "onTouchStart");
			this._initialValue = this.value; // for reset()
		},

		_changeState: function(/*String*/state, /*Boolean*/anim){
			var on = (state === "on");
			this.left.style.display = "";
			this.right.style.display = "";
			this.inner.style.left = "";
			if(anim){
				domClass.add(this.domNode, "mblSwitchAnimation");
			}
			domClass.remove(this.domNode, on ? "mblSwitchOff" : "mblSwitchOn");
			domClass.add(this.domNode, on ? "mblSwitchOn" : "mblSwitchOff");

			var _this = this;
			setTimeout(function(){
				_this.left.style.display = on ? "" : "none";
				_this.right.style.display = !on ? "" : "none";
				domClass.remove(_this.domNode, "mblSwitchAnimation");
			}, anim ? 300 : 0);
		},

		_createMaskImage: function(){
			if(this._hasMaskImage){ return; }
			this._width = this.domNode.offsetWidth - this.knob.offsetWidth;
			this._hasMaskImage = true;
			if(!has("webkit")){ return; }
			var rDef = domStyle.get(this.left, "borderTopLeftRadius");
			if(rDef == "0px"){ return; }
			var rDefs = rDef.split(" ");
			var rx = parseFloat(rDefs[0]), ry = (rDefs.length == 1) ? rx : parseFloat(rDefs[1]);
			var w = this.domNode.offsetWidth, h = this.domNode.offsetHeight;
			var id = (this.shape+"Mask"+w+h+rx+ry).replace(/\./,"_");
			if(!this._createdMasks[id]){
				this._createdMasks[id] = 1;
				var ctx = win.doc.getCSSCanvasContext("2d", id, w, h);
				ctx.fillStyle = "#000000";
				ctx.beginPath();
				if(rx == ry){
					// round arc
					ctx.moveTo(rx, 0);
					ctx.arcTo(0, 0, 0, rx, rx);
					ctx.lineTo(0, h - rx);
					ctx.arcTo(0, h, rx, h, rx);
					ctx.lineTo(w - rx, h);
					ctx.arcTo(w, h, w, rx, rx);
					ctx.lineTo(w, rx);
					ctx.arcTo(w, 0, w - rx, 0, rx);
				}else{
					// elliptical arc
					var pi = Math.PI;
					ctx.scale(1, ry/rx);
					ctx.moveTo(rx, 0);
					ctx.arc(rx, rx, rx, 1.5 * pi, 0.5 * pi, true);
					ctx.lineTo(w - rx, 2 * rx);
					ctx.arc(w - rx, rx, rx, 0.5 * pi, 1.5 * pi, true);
				}
				ctx.closePath();
				ctx.fill();
			}
			this.domNode.style.webkitMaskImage = "-webkit-canvas(" + id + ")";
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			if(this._moved){ return; }
			this.value = this.input.value = (this.value == "on") ? "off" : "on";
			this._changeState(this.value, true);
			this.onStateChanged(this.value);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		onTouchStart: function(e){
			// summary:
			//		Internal function to handle touchStart events.
			this._moved = false;
			this.innerStartX = this.inner.offsetLeft;
			if(!this._conn){
				this._conn = [
					this.connect(this.inner, touch.move, "onTouchMove"),
					this.connect(this.inner, touch.release, "onTouchEnd")
				];
			}
			this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
			this.left.style.display = "";
			this.right.style.display = "";
			event.stop(e);
			this._createMaskImage();
		},

		onTouchMove: function(e){
			// summary:
			//		Internal function to handle touchMove events.
			e.preventDefault();
			var dx;
			if(e.targetTouches){
				if(e.targetTouches.length != 1){ return; }
				dx = e.targetTouches[0].clientX - this.touchStartX;
			}else{
				dx = e.clientX - this.touchStartX;
			}
			var pos = this.innerStartX + dx;
			var d = 10;
			if(pos <= -(this._width-d)){ pos = -this._width; }
			if(pos >= -d){ pos = 0; }
			this.inner.style.left = pos + "px";
			if(Math.abs(dx) > d){
				this._moved = true;
			}
		},

		onTouchEnd: function(e){
			// summary:
			//		Internal function to handle touchEnd events.
			array.forEach(this._conn, connect.disconnect);
			this._conn = null;
			if(this.innerStartX == this.inner.offsetLeft){
				if(has("touch")){
					var ev = win.doc.createEvent("MouseEvents");
					ev.initEvent("click", true, true);
					this.inner.dispatchEvent(ev);
				}
				return;
			}
			var newState = (this.inner.offsetLeft < -(this._width/2)) ? "off" : "on";
			this._changeState(newState, true);
			if(newState != this.value){
				this.value = this.input.value = newState;
				this.onStateChanged(newState);
			}
		},

		onStateChanged: function(/*String*/newState){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the state has been changed.
		},

		_setValueAttr: function(/*String*/value){
			this._changeState(value, false);
			if(this.value != value){
				this.onStateChanged(value);
			}
			this.value = this.input.value = value;
		},

		_setLeftLabelAttr: function(/*String*/label){
			this.leftLabel = label;
			this.left.firstChild.innerHTML = this._cv ? this._cv(label) : label;
		},

		_setRightLabelAttr: function(/*String*/label){
			this.rightLabel = label;
			this.right.firstChild.innerHTML = this._cv ? this._cv(label) : label;
		},

		reset: function(){
			// summary:
			//		Reset the widget's value to what it was at initialization time
			this.set("value", this._initialValue);
		}
	});
});

},
'dojox/mobile/StoreCarousel':function(){
define("dojox/mobile/StoreCarousel", [
	"dojo/_base/declare",
	"./Carousel",
	"./_StoreMixin"
], function(declare, Carousel, StoreMixin){

	// module:
	//		dojox/mobile/StoreCarousel
	// summary:
	//		A dojo.store enabled Carousel.

	return declare("dojox.mobile.StoreCarousel", [Carousel, StoreMixin], {
		// summary:
		//		A dojo.store enabled Carousel.
		// description:
		//		StoreCarousel is an enhanced version of dojox.mobile.Carousel. It
		//		can generate contents according to the given dojo.store store.
	});
});

},
'dojox/mobile/ListItem':function(){
define("dojox/mobile/ListItem", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",
	"./iconUtils",
	"./_ItemBase",
	"./ProgressIndicator"
], function(array, declare, lang, domClass, domConstruct, domStyle, registry, iconUtils, ItemBase, ProgressIndicator){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ListItem
	// summary:
	//		An item of either RoundRectList or EdgeToEdgeList.

	lang.extend(dijit._WidgetBase, {
		layout: "",
		preventTouch: false
	});

	return declare("dojox.mobile.ListItem", ItemBase, {
		// summary:
		//		An item of either RoundRectList or EdgeToEdgeList.
		// description:
		//		ListItem represents an item of either RoundRectList or
		//		EdgeToEdgeList. There are three ways to move to a different
		//		view, moveTo, href, and url. You can choose only one of them.
		//
		//		A child DOM node (or widget) can have the layout attribute,
		//		whose value is "left", "right", or "center". Such nodes will be
		//		aligned as specified.
		// example:
		// |	<li data-dojo-type="dojox.mobile.ListItem">
		// |		<div layout="left">Left Node</div>
		// |		<div layout="right">Right Node</div>
		// |		<div layout="center">Center Node</div>
		// |	</li>
		//
		//		Note that even if you specify variableHeight="true" to the list
		//		and place a tall object inside the layout node as an example
		//		below, the layout node does not expand as you may expect,
		//		because layout node is aligned using float:left, float:right, or
		//		position:absolute.
		// example:
		// |	<li data-dojo-type="dojox.mobile.ListItem" variableHeight="true">
		// |		<div layout="left"><img src="large-picture.jpg"></div>
		// |	</li>

		// rightText: String
		//		A right-aligned text to display on the item.
		rightText: "",

		// rightIcon: String
		//		An icon to display at the right hand side of the item. The value
		//		can be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon: "",

		// rightIcon2: String
		//		An icon to display at the left of the rightIcon. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon2: "",

		// deleteIcon: String
		//		A delete icon to display at the left of the item. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		deleteIcon: "",

		// anchorLabel: Boolean
		//		If true, the label text becomes a clickable anchor text. When
		//		the user clicks on the text, the onAnchorLabelClicked handler is
		//		called. You can override or connect to the handler and implement
		//		any action. The handler has no default action.
		anchorLabel: false,

		// noArrow: Boolean
		//		If true, the right hand side arrow is not displayed.
		noArrow: false,

		// checked: Boolean
		//		If true, a check mark is displayed at the right of the item.
		checked: false,

		// arrowClass: String
		//		An icon to display as an arrow. The value can be either a path
		//		for an image file or a class name of a DOM button.
		arrowClass: "",

		// checkClass: String
		//		An icon to display as a check mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		checkClass: "",

		// uncheckClass: String
		//		An icon to display as an uncheck mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		uncheckClass: "",

		// variableHeight: Boolean
		//		If true, the height of the item varies according to its
		//		content. In dojo 1.6 or older, the "mblVariableHeight" class was
		//		used for this purpose. In dojo 1.7, adding the mblVariableHeight
		//		class still works for backward compatibility.
		variableHeight: false,


		// rightIconTitle: String
		//		An alt text for the right icon.
		rightIconTitle: "",

		// rightIcon2Title: String
		//		An alt text for the right icon2.
		rightIcon2Title: "",

		// header: Boolean
		//		If true, this item is rendered as a category header.
		header: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		// busy: Boolean
		//		If true, a progress indicator spins.
		busy: false,

		// progStyle: String
		//		A css class name to add to the progress indicator.
		progStyle: "",

		/* internal properties */	
		paramsToInherit: "variableHeight,transition,deleteIcon,icon,rightIcon,rightIcon2,uncheckIcon,arrowClass,checkClass,uncheckClass,deleteIconTitle,deleteIconRole",
		baseClass: "mblListItem",

		_selStartMethod: "touch",
		_selEndMethod: "timer",
		_delayedSelection: true,

		_selClass: "mblListItemSelected",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);

			if(this.selected){
				domClass.add(this.domNode, this._selClass);
			}
			if(this.header){
				domClass.replace(this.domNode, "mblEdgeToEdgeCategory", this.baseClass);
			}

			this.labelNode =
				domConstruct.create("div", {className:"mblListItemLabel"});
			var ref = this.srcNodeRef;
			if(ref && ref.childNodes.length === 1 && ref.firstChild.nodeType === 3){
				// if ref has only one text node, regard it as a label
				this.labelNode.appendChild(ref.firstChild);
			}
			this.domNode.appendChild(this.labelNode);

			if(this.anchorLabel){
				this.labelNode.style.display = "inline"; // to narrow the text region
				this.labelNode.style.cursor = "pointer";
				this._anchorClickHandle = this.connect(this.labelNode, "onclick", "_onClick");
				this.onTouchStart = function(e){
					return (e.target !== this.labelNode);
				};
			}
			this._layoutChildren = [];
		},

		startup: function(){
			if(this._started){ return; }

			var parent = this.getParent();
			var opts = this.getTransOpts();
			if(opts.moveTo || opts.href || opts.url || this.clickable || (parent && parent.select)){
				this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers
			}else{
				this._handleClick = false;
			}

			if(domClass.contains(this.domNode, "mblVariableHeight")){
				this.variableHeight = true;
			}
			if(this.variableHeight){
				domClass.add(this.domNode, "mblVariableHeight");
				setTimeout(lang.hitch(this, "layoutVariableHeight"), 0);
			}

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				this.set({ // retry applying the attribute
					icon: this.icon,
					deleteIcon: this.deleteIcon,
					rightIcon: this.rightIcon,
					rightIcon2: this.rightIcon2
				});
			}
			if(parent && parent.select){
				this.set("checked", this.checked); // retry applying the attribute
			}
			this.setArrow();
			this.layoutChildren();
		},

		layoutChildren: function(){
			var centerNode;
			array.forEach(this.domNode.childNodes, function(n){
				if(n.nodeType !== 1){ return; }
				var layout = n.getAttribute("layout") || (registry.byNode(n) || {}).layout;
				if(layout){
					domClass.add(n, "mblListItemLayout" +
						layout.charAt(0).toUpperCase() + layout.substring(1));
					this._layoutChildren.push(n);
					if(layout === "center"){ centerNode = n; }
				}
			}, this);
			if(centerNode){
				this.domNode.insertBefore(centerNode, this.domNode.firstChild);
			}
		},

		resize: function(){
			if(this.variableHeight){
				this.layoutVariableHeight();
			}

			// If labelNode is empty, shrink it so as not to prevent user clicks.
			this.labelNode.style.display = this.labelNode.firstChild ? "block" : "inline";
		},

		_onTouchStart: function(e){
			if(e.target.getAttribute("preventTouch") ||
				(registry.getEnclosingWidget(e.target) || {}).preventTouch){
				return;
			}
			this.inherited(arguments);
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.getParent().isEditing || e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			var n = this.labelNode;
			if(this.anchorLabel && e.currentTarget === n){
				domClass.add(n, "mblListItemLabelSelected");
				setTimeout(function(){
					domClass.remove(n, "mblListItemLabelSelected");
				}, this._duration);
				this.onAnchorLabelClicked(e);
				return;
			}
			var parent = this.getParent();
			if(parent.select){
				if(parent.select === "single"){
					if(!this.checked){
						this.set("checked", true);
					}
				}else if(parent.select === "multiple"){
					this.set("checked", !this.checked);
				}
			}
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		onAnchorLabelClicked: function(e){
			// summary:
			//		Stub function to connect to from your application.
		},

		layoutVariableHeight: function(){
			var h = this.domNode.offsetHeight;
			if(h === this.domNodeHeight){ return; }
			this.domNodeHeight = h;
			array.forEach(this._layoutChildren.concat([
				this.rightTextNode,
				this.rightIcon2Node,
				this.rightIconNode,
				this.uncheckIconNode,
				this.iconNode,
				this.deleteIconNode,
				this.knobIconNode
			]), function(n){
				if(n){
					var domNode = this.domNode;
					var f = function(){
						var t = Math.round((domNode.offsetHeight - n.offsetHeight) / 2) -
							domStyle.get(domNode, "paddingTop");
						n.style.marginTop = t + "px";
					}
					if(n.offsetHeight === 0 && n.tagName === "IMG"){
						n.onload = f;
					}else{
						f();
					}
				}
			}, this);
		},

		setArrow: function(){
			// summary:
			//		Sets the arrow icon if necessary.
			if(this.checked){ return; }
			var c = "";
			var parent = this.getParent();
			var opts = this.getTransOpts();
			if(opts.moveTo || opts.href || opts.url || this.clickable){
				if(!this.noArrow && !(parent && parent.selectOne)){
					c = this.arrowClass || "mblDomButtonArrow";
				}
			}
			if(c){
				this._setRightIconAttr(c);
			}
		},

		_findRef: function(/*String*/type){
			// summary:
			//		Find an appropriate position to insert a new child node.
			var i, node, list = ["deleteIcon", "icon", "rightIcon", "uncheckIcon", "rightIcon2", "rightText"];
			for(i = array.indexOf(list, type) + 1; i < list.length; i++){
				node = this[list[i] + "Node"];
				if(node){ return node; }
			}
			for(i = list.length - 1; i >= 0; i--){
				node = this[list[i] + "Node"];
				if(node){ return node.nextSibling; }
			}
			return this.domNode.firstChild;
		},

		_setIcon: function(/*String*/icon, /*String*/type){
			if(!this._isOnLine){ return; } // icon may be invalid because inheritParams is not called yet
			this._set(type, icon);
			this[type + "Node"] = iconUtils.setIcon(icon, this[type + "Pos"],
				this[type + "Node"], this[type + "Title"] || this.alt, this.domNode, this._findRef(type), "before");
			if(this[type + "Node"]){
				var cap = type.charAt(0).toUpperCase() + type.substring(1);
				domClass.add(this[type + "Node"], "mblListItem" + cap);
			}
			var role = this[type + "Role"];
			if(role){
				this[type + "Node"].setAttribute("role", role);
			}
		},

		_setDeleteIconAttr: function(/*String*/icon){
			this._setIcon(icon, "deleteIcon");
		},

		_setIconAttr: function(icon){
			this._setIcon(icon, "icon");
		},

		_setRightTextAttr: function(/*String*/text){
			if(!this.rightTextNode){
				this.rightTextNode = domConstruct.create("div", {className:"mblListItemRightText"}, this.labelNode, "before");
			}
			this.rightText = text;
			this.rightTextNode.innerHTML = this._cv ? this._cv(text) : text;
		},

		_setRightIconAttr: function(/*String*/icon){
			this._setIcon(icon, "rightIcon");
		},

		_setUncheckIconAttr: function(/*String*/icon){
			this._setIcon(icon, "uncheckIcon");
		},

		_setRightIcon2Attr: function(/*String*/icon){
			this._setIcon(icon, "rightIcon2");
		},

		_setCheckedAttr: function(/*Boolean*/checked){
			if(!this._isOnLine){ return; } // icon may be invalid because inheritParams is not called yet
			var parent = this.getParent();
			if(parent && parent.select === "single" && checked){
				array.forEach(parent.getChildren(), function(child){
					child !== this && child.checked && child.set("checked", false);
				}, this);
			}
			this._setRightIconAttr(this.checkClass || "mblDomButtonCheck");
			this._setUncheckIconAttr(this.uncheckClass);

			domClass.toggle(this.domNode, "mblListItemChecked", checked);
			domClass.toggle(this.domNode, "mblListItemUnchecked", !checked);
			domClass.toggle(this.domNode, "mblListItemHasUncheck", !!this.uncheckIconNode);
			this.rightIconNode.style.position = (this.uncheckIconNode && !checked) ? "absolute" : "";

			if(parent && this.checked !== checked){
				parent.onCheckStateChanged(this, checked);
			}
			this._set("checked", checked);
		},

		_setBusyAttr: function(/*Boolean*/busy){
			var prog = this._prog;
			if(busy){
				if(!this.iconNode){
					this.iconNode = domConstruct.create("div", {className:"mblListItemIcon"},
						this._findRef("icon"), "before");
				}
				if(!prog){
					prog = this._prog = new ProgressIndicator({size:25, center:false});
					domClass.add(prog.domNode, this.progStyle);
				}
				array.forEach(this.iconNode.childNodes, function(child){
					child.style.display = "none";
				});
				this.iconNode.appendChild(prog.domNode);
				prog.start();
			}else{
				array.forEach(this.iconNode.childNodes, function(child){
					child.style.display = "";
				});
				prog.stop();
			}
			this._set("busy", busy);
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domClass.toggle(this.domNode, this._selClass, selected);
		}
	});
});

},
'dojox/mobile/_DataListMixin':function(){
define("dojox/mobile/_DataListMixin", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dijit/registry",
	"./_DataMixin",
	"./ListItem"
], function(array, declare, registry, DataMixin, ListItem){

	// module:
	//		dojox/mobile/_DataListMixin
	// summary:
	//		Mixin for widgets to generate the list items corresponding to the
	//		data provider object.

	return declare("dojox.mobile._DataListMixin", DataMixin, {
		// summary:
		//		Mixin for widgets to generate the list items corresponding to
		//		the data provider object.
		// description:
		//		By mixing this class into the widgets, the list item nodes are
		//		generated as the child nodes of the widget and automatically
		//		re-generated whenever the corresponding data items are modified.

		// append: Boolean
		//		If true, refresh() does not clear the existing items.
		append: false,

		// itemMap: Object
		//		An optional parameter mapping field names from the store to ItemList name.
		// example:
		// |	itemMap:{text:'label', profile_image_url:'icon' }
		itemMap: null,

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.store){ return; }
			var store = this.store;
			this.store = null;
			this.setStore(store, this.query, this.queryOptions);
		},

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			var attr = {};
			var arr = this.store.getLabelAttributes(item);
			var labelAttr = arr ? arr[0] : null;
			array.forEach(this.store.getAttributes(item), function(name){
				if(name === labelAttr){
					attr["label"] = this.store.getLabel(item);
				}else{
					attr[(this.itemMap && this.itemMap[name]) || name] = this.store.getValue(item, name);
				}
			}, this);
			var w = new ListItem(attr);
			item._widgetId = w.id;
			return w;
		},

		generateList: function(/*Array*/items, /*Object*/dataObject){
			// summary:
			//		Given the data, generates a list of items.
			if(!this.append){
				array.forEach(this.getChildren(), function(child){
					child.destroyRecursive();
				});
			}
			array.forEach(items, function(item, index){
				this.addChild(this.createListItem(item));
			}, this);
		},

		onComplete: function(/*Array*/items, /*Object*/request){
			// summary:
			//		An handler that is called after the fetch completes.
			this.generateList(items, request);
		},

		onError: function(/*Object*/errorData, /*Object*/request){
			// summary:
			//		An error handler.
		},

		onSet: function(/*Object*/item, /*String*/attribute, /*Object|Array*/oldValue, /*Object|Array*/newValue){
			//	summary:
			//		See dojo.data.api.Notification.onSet()
		},

		onNew: function(/*Object*/newItem, /*Object?*/parentInfo){
			//	summary:
			//		See dojo.data.api.Notification.onNew()
			this.addChild(this.createListItem(newItem));
		},

		onDelete: function(/*Object*/deletedItem){
			//	summary:
			//		See dojo.data.api.Notification.onDelete()
			registry.byId(deletedItem._widgetId).destroyRecursive();
		},

		onStoreClose: function(/*Object?*/request){
			//	summary:
			//		Refresh list on close.
			if(this.store.clearOnClose){
				this.refresh();
			}
		}
	});
});

},
'dojox/mobile/parser':function(){
define("dojox/mobile/parser", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/ready"
], function(dojo, array, config, lang, win, ready){

	// module:
	//		dojox/mobile/parser
	// summary:
	//		A lightweight parser.

	var dm = lang.getObject("dojox.mobile", true);

	var parser = new function(){
		// summary:
		//		A lightweight parser.
		// description:
		//		dojox.mobile.parser is an extremely small subset of dojo.parser.
		//		It has no extended features over dojo.parser, so there is no
		//		reason you must use dojox.mobile.parser instead of dojo.parser.
		//		However, if dojox.mobile.parser's capability is enough for your
		//		application, use of it could reduce the total code size.

		var _ctorMap = {};
		var getCtor = function(type, mixins){
			if(typeof(mixins) === "string"){
				var t = type + ":" + mixins.replace(/ /g, "");
				return _ctorMap[t] ||
					(_ctorMap[t] = getCtor(type).createSubclass(array.map(mixins.split(/, */), getCtor)));
			}
			return _ctorMap[type] || (_ctorMap[type] = lang.getObject(type) || require(type));
		};
		var _eval = function(js){ return eval(js); };

		this.instantiate = function(/* Array */nodes, /* Object? */mixin, /* Object? */options){
			// summary:
			//		Function for instantiating a list of widget nodes.
			// nodes:
			//		The list of DOMNodes to walk and instantiate widgets on.
			mixin = mixin || {};
			options = options || {};
			var i, ws = [];
			if(nodes){
				for(i = 0; i < nodes.length; i++){
					var n = nodes[i],
						type = n._type,
						ctor = getCtor(type, n.getAttribute("data-dojo-mixins")),
						proto = ctor.prototype,
						params = {}, prop, v, t;
					lang.mixin(params, _eval.call(options.propsThis, '({'+(n.getAttribute("data-dojo-props")||"")+'})'));
					lang.mixin(params, options.defaults);
					lang.mixin(params, mixin);
					for(prop in proto){
						v = n.getAttributeNode(prop);
						v = v && v.nodeValue;
						t = typeof proto[prop];
						if(!v && (t !== "boolean" || v !== "")){ continue; }
						if(lang.isArray(proto[prop])){
							params[prop] = v.split(/\s*,\s*/);
						}else if(t === "string"){
							params[prop] = v;
						}else if(t === "number"){
							params[prop] = v - 0;
						}else if(t === "boolean"){
							params[prop] = (v !== "false");
						}else if(t === "object"){
							params[prop] = eval("(" + v + ")");
						}else if(t === "function"){
							params[prop] = lang.getObject(v, false) || new Function(v);
							n.removeAttribute(prop);
						}
					}
					params["class"] = n.className;
					if(!params.style){ params.style = n.style.cssText; }
					v = n.getAttribute("data-dojo-attach-point");
					if(v){ params.dojoAttachPoint = v; }
					v = n.getAttribute("data-dojo-attach-event");
					if(v){ params.dojoAttachEvent = v; }
					var instance = new ctor(params, n);
					ws.push(instance);
					var jsId = n.getAttribute("jsId") || n.getAttribute("data-dojo-id");
					if(jsId){
						lang.setObject(jsId, instance);
					}
				}
				for(i = 0; i < ws.length; i++){
					var w = ws[i];
					!options.noStart && w.startup && !w._started && w.startup();
				}
			}
			return ws;
		};

		this.parse = function(rootNode, options){
			// summary:
			//		Function to handle parsing for widgets in the current document.
			//		It is not as powerful as the full parser, but it will handle basic
			//		use cases fine.
			// rootNode:
			//		The root node in the document to parse from
			if(!rootNode){
				rootNode = win.body();
			}else if(!options && rootNode.rootNode){
				// Case where 'rootNode' is really a params object.
				options = rootNode;
				rootNode = rootNode.rootNode;
			}

			var nodes = rootNode.getElementsByTagName("*");
			var i, j, list = [];
			for(i = 0; i < nodes.length; i++){
				var n = nodes[i],
					type = (n._type = n.getAttribute("dojoType") || n.getAttribute("data-dojo-type"));
				if(type){
					if(n._skip){
						n._skip = undefined;
						continue;
					}
					if(getCtor(type).prototype.stopParser && !(options && options.template)){
						var arr = n.getElementsByTagName("*");
						for(j = 0; j < arr.length; j++){
							arr[j]._skip = 1;
						}
					}
					list.push(n);
				}
			}
			var mixin = options && options.template ? {template: true} : null;
			return this.instantiate(list, mixin, options);
		};
	}();
	if(config.parseOnLoad){
		ready(100, function(){
			// Now that all the modules are loaded, check if the app loaded dojo/parser too.
			// If it did, let dojo/parser handle the parseOnLoad flag instead of me.
			try{
				if(!require("dojo/parser")){
					// IE6 takes this path when dojo/parser unavailable, rather than catch() block below,
					// due to http://support.microsoft.com/kb/944397
					parser.parse();
				}
			}catch(e){
				// Other browsers (and later versions of IE) take this path when dojo/parser unavailable
				parser.parse();
			}
		});
	}
	dm.parser = parser; // for backward compatibility
	dojo.parser = dojo.parser || parser; // in case user application calls dojo.parser
	return parser;
});

},
'dojox/mobile':function(){
define("dojox/mobile", [
	".",
	"dojo/_base/lang",
	"dojox/mobile/_base"
], function(dojox, lang, base){
	lang.getObject("mobile", true, dojox);
	return dojox.mobile;
});

},
'dojox/mobile/Accordion':function(){
define("dojox/mobile/Accordion", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./iconUtils",
	"./lazyLoadUtils",
	"require"
], function(array, declare, lang, has, dom, domClass, domConstruct, Contained, Container, WidgetBase, iconUtils, lazyLoadUtils, require){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Accordion
	// summary:
	//		A layout widget that allows the user to freely navigate between panes.

	// inner class
	var _AccordionTitle = declare([WidgetBase, Contained], {
		label: "Label",
		icon1: "",
		icon2: "",
		iconPos1: "",
		iconPos2: "",
		selected: false,

		baseClass: "mblAccordionTitle",

		buildRendering: function(){
			this.inherited(arguments);

			var a = this.anchorNode = domConstruct.create("a", {
				className: "mblAccordionTitleAnchor"
			}, this.domNode);
			a.href = "javascript:void(0)"; // for a11y

			// text box
			this.textBoxNode = domConstruct.create("div", {className:"mblAccordionTitleTextBox"}, a);
			this.labelNode = domConstruct.create("span", {
				className: "mblAccordionTitleLabel",
				innerHTML: this._cv ? this._cv(this.label) : this.label
			}, this.textBoxNode);

			this._isOnLine = this.inheritParams();
		},

		postCreate: function(){
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			dom.setSelectable(this.domNode, false);
		},

		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }
			}
			return !!parent;
		},

		_setIcon: function(icon, n){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this._set("icon" + n, icon);
			if(!this["iconParentNode" + n]){
				this["iconParentNode" + n] = domConstruct.create("div",
					{className:"mblAccordionIconParent mblAccordionIconParent" + n}, this.anchorNode, "first");
			}
			this["iconNode" + n] = iconUtils.setIcon(icon, this["iconPos" + n],
				this["iconNode" + n], this.alt, this["iconParentNode" + n]);
			this["icon" + n] = icon;
			domClass.toggle(this.domNode, "mblAccordionHasIcon", icon && icon !== "none");
		},

		_setIcon1Attr: function(icon){
			this._setIcon(icon, 1);
		},

		_setIcon2Attr: function(icon){
			this._setIcon(icon, 2);
		},

		startup: function(){
			if(this._started){ return; }
			if(!this._isOnLine){
				this.inheritParams();
			}
			if(!this._isOnLine){
				this.set({ // retry applying the attribute
					icon1: this.icon1,
					icon2: this.icon2
				});
			}
			this.inherited(arguments);
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			var p = this.getParent();
			if(!p.fixedHeight && this.contentWidget.domNode.style.display !== "none"){
				p.collapse(this.contentWidget, !p.animation);
			}else{
				p.expand(this.contentWidget, !p.animation);
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			domClass.toggle(this.domNode, "mblAccordionTitleSelected", selected);
			this._set("selected", selected);
		}
	});

	lang.extend(dijit._WidgetBase, {
		alt: "",
		label: "",
		icon1: "",
		icon2: "",
		iconPos1: "",
		iconPos2: "",
		selected: false,
		lazy: false
	});

	return declare("dojox.mobile.Accordion", [WidgetBase, Container, Contained], {
		iconBase: "",
		iconPos: "",
		fixedHeight: false,
		singleOpen: false,
		animation: true,

		duration: .3, // [seconds]

		baseClass: "mblAccordion",

		_openSpace: 1,

		startup: function(){
			if(this._started){ return; }

			if(this.fixedHeight){
				this.singleOpen = true;
			}
			var children = this.getChildren();
			array.forEach(children, this._setupChild, this);
			var sel;
			array.forEach(children, function(child){
				child.startup();
				child._at.startup();
				this.collapse(child, true);
				if(child.selected){
					sel = child;
				}
			}, this);
			if(!sel && this.fixedHeight){
				sel = children[children.length - 1];
			}
			if(sel){
				this.expand(sel, true);
			}else{
				this._updateLast();
			}
			setTimeout(lang.hitch(this, function(){ this.resize(); }), 0);

			this._started = true;
		},

		_setupChild: function(/*Widget*/ child){
			if(child.domNode.style.overflow != "hidden"){
				child.domNode.style.overflow = this.fixedHeight ? "auto" : "hidden";
			}
			child._at = new _AccordionTitle({
				label: child.label,
				alt: child.alt,
				icon1: child.icon1,
				icon2: child.icon2,
				iconPos1: child.iconPos1,
				iconPos2: child.iconPos2,
				contentWidget: child
			});
			domConstruct.place(child._at.domNode, child.domNode, "before");
			domClass.add(child.domNode, "mblAccordionPane");
		},

		addChild: function(/*Widget*/ widget, /*int?*/ insertIndex){
			this.inherited(arguments);
			if(this._started){
				this._setupChild(widget);
				widget._at.startup();
				if(widget.selected){
					this.expand(widget, true);
					setTimeout(function(){
						widget.domNode.style.height = "";
					}, 0);
				}else{
					this.collapse(widget);
				}
			}
		},

		removeChild: function(/*Widget*/ widget){
			child._at.destroy();
			this.inherited(arguments);
		},

		getChildren: function(){
			return array.filter(this.inherited(arguments), function(child){
				return !(child instanceof _AccordionTitle);
			});
		},

		getSelectedPanes: function(){
			return array.filter(this.getChildren(), function(pane){
				return pane.domNode.style.display != "none";
			});
		},

		resize: function(){
			if(this.fixedHeight){
				var panes = array.filter(this.getChildren(), function(child){ // active pages
					return child._at.domNode.style.display != "none";
				});
				var openSpace = this.domNode.clientHeight; // height of all panes
				array.forEach(panes, function(child){
					openSpace -= child._at.domNode.offsetHeight;
				});
				this._openSpace = openSpace > 0 ? openSpace : 0;
				var sel = this.getSelectedPanes()[0];
				sel.domNode.style.webkitTransition = "";
				sel.domNode.style.height = this._openSpace + "px";
			}
		},

		_updateLast: function(){
			var children = this.getChildren();
			array.forEach(children, function(c, i){
				// add "mblAccordionTitleLast" to the last, closed accordion title
				domClass.toggle(c._at.domNode, "mblAccordionTitleLast",
					i === children.length - 1 && !domClass.contains(c._at.domNode, "mblAccordionTitleSelected"))
			}, this);
		},

		expand: function(/*Widget*/pane, /*boolean*/noAnimation){
			if(pane.lazy){
				lazyLoadUtils.instantiateLazyWidgets(pane.containerNode, pane.requires);
				pane.lazy = false;
			}
			var children = this.getChildren();
			array.forEach(children, function(c, i){
				c.domNode.style.webkitTransition = noAnimation ? "" : "height "+this.duration+"s linear";
				if(c === pane){
					c.domNode.style.display = "";
					var h;
					if(this.fixedHeight){
						h = this._openSpace;
					}else{
						h = parseInt(c.height || c.domNode.getAttribute("height")); // ScrollableView may have the height property
						if(!h){
							c.domNode.style.height = "";
							h = c.domNode.offsetHeight;
							c.domNode.style.height = "0px";
						}
					}
					setTimeout(function(){ // necessary for webkitTransition to work
						c.domNode.style.height = h + "px";
					}, 0);
					this.select(pane);
				}else if(this.singleOpen){
					this.collapse(c, noAnimation);
				}
			}, this);
			this._updateLast();
		},

		collapse: function(/*Widget*/pane, /*boolean*/noAnimation){
			if(pane.domNode.style.display === "none"){ return; } // already collapsed
			pane.domNode.style.webkitTransition = noAnimation ? "" : "height "+this.duration+"s linear";
			pane.domNode.style.height = "0px";
			if(!has("webkit") || noAnimation){
				pane.domNode.style.display = "none";
				this._updateLast();
			}else{
				// Adding a webkitTransitionEnd handler to panes may cause conflict
				// when the panes already have the one. (e.g. ScrollableView)
				var _this = this;
				setTimeout(function(){
					pane.domNode.style.display = "none";
					_this._updateLast();

					// Need to call parent view's resize() especially when the Accordion is
					// on a ScrollableView, the ScrollableView is scrolled to
					// the bottom, and then expand any other pane while in the
					// non-fixed singleOpen mode.
					if(!_this.fixedHeight && _this.singleOpen){
						for(var v = _this.getParent(); v; v = v.getParent()){
							if(domClass.contains(v.domNode, "mblView")){
								if(v && v.resize){ v.resize(); }
								break;
							}
						}
					}
				}, this.duration*1000);
			}
			this.deselect(pane);
		},

		select: function(/*Widget*/pane){
			pane._at.set("selected", true);
		},

		deselect: function(/*Widget*/pane){
			pane._at.set("selected", false);
		}
	});
});

},
'dojox/mobile/Opener':function(){
define("dojox/mobile/Opener", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"./Tooltip",
	"./Overlay",
	"./lazyLoadUtils"
], function(declare, Deferred, lang, win, domClass, domConstruct, domStyle, domGeometry, Tooltip, Overlay, lazyLoadUtils){

	/*=====
		Tooltip = dojox.mobile.Tooltip;
		Overlay = dojox.mobile.Overlay;
	=====*/
	var isOverlay = domClass.contains(win.doc.documentElement, "dj_phone");
	var cls = declare("dojox.mobile.Opener", isOverlay ? Overlay : Tooltip, {
		// summary:
		//		A non-templated popup widget that will use either Tooltip or Overlay depending on screen size
		//

		// lazy: String
		//		If true, the content of the widget, which includes dojo markup,
		//		is instantiated lazily. That is, only when the widget is opened
		//		by the user, the required modules are loaded and the content
		//		widgets are instantiated.
		lazy: false,

		// requires: String
		//		Comma-separated required module names to be lazily loaded. This
		//		is effective only when lazy=true. All the modules specified with
		//		dojoType and their depending modules are automatically loaded
		//		when the widget is opened. However, if you need other extra
		//		modules to be loaded, use this parameter.
		requires: "",

		buildRendering: function(){
			this.inherited(arguments);
			this.cover = domConstruct.create('div', {
				onclick: lang.hitch(this, '_onBlur'), 'class': 'mblOpenerUnderlay',
				style: { position: isOverlay ? 'absolute' : 'fixed', backgroundColor:'transparent', overflow:'hidden', zIndex:'-1' }
			}, this.domNode, 'first');
		},

		onShow: function(/*DomNode*/node){},
		onHide: function(/*DomNode*/node, /*Anything*/v){},

		show: function(node, positions){
			if(this.lazy){
				this.lazy = false;
				var _this = this;
				return Deferred.when(lazyLoadUtils.instantiateLazyWidgets(this.domNode, this.requires), function(){
					return _this.show(node, positions);
				});
			}
			this.node = node;
			this.onShow(node);
			domStyle.set(this.cover, { top:'0px', left:'0px', width:'0px', height:'0px' }); // move cover temporarily to calculate domNode vertical position correctly
			this._resizeCover(domGeometry.position(this.domNode, false)); // must be before this.inherited(arguments) for Tooltip sizing
			return this.inherited(arguments);
		},

		hide: function(/*Anything*/ val){
			this.inherited(arguments);
			this.onHide(this.node, val);
		},
		
		_reposition: function(){
			var popupPos = this.inherited(arguments);
			this._resizeCover(popupPos);
			return popupPos;
		},

		_resizeCover: function(popupPos){
			if(isOverlay){
				if(parseInt(domStyle.get(this.cover, 'top')) != -popupPos.y || parseInt(domStyle.get(this.cover, 'height')) != popupPos.y){
					var x = Math.max(popupPos.x, 0); // correct onorientationchange values
					domStyle.set(this.cover, { top:-popupPos.y+'px', left:-x+'px', width:popupPos.w+x+'px', height:popupPos.y+'px' });
				}
			}else{
				domStyle.set(this.cover, { 
					width:Math.max(win.doc.documentElement.scrollWidth || win.body().scrollWidth || win.doc.documentElement.clientWidth)+'px', 
					height:Math.max(win.doc.documentElement.scrollHeight || win.body().scrollHeight || win.doc.documentElement.clientHeight)+'px' 
				});
			}			
		},

		_onBlur: function(e){
			var ret = this.onBlur(e);
			if(ret !== false){ // only exactly false prevents hide()
				this.hide(e);
			}
			return ret;
		}
	});
	cls.prototype.baseClass += " mblOpener"; // add to either mblOverlay or mblTooltip
	return cls;
});

},
'dojox/mobile/i18n':function(){
define("dojox/mobile/i18n", [
	"dojo/_base/lang",
	"dojo/i18n",
	"dijit/_WidgetBase"
], function(lang, di18n, WidgetBase){

/*=====
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/i18n
	// summary:
	//		An internationalization utility for dojox.mobile-based user
	//		applications.

	var i18n = lang.getObject("dojox.mobile.i18n", true);
/*=====
	var i18n = dojox.mobile.i18n;
=====*/

	i18n.load = function(/*String*/packageName, /*String*/bundleName, /*String?*/locale){
		// summary:
		//		Loads an nls resouce bundle and returns an array of localized
		//		resources.
		return i18n.registerBundle(di18n.getLocalization(packageName, bundleName, locale));
	};

	i18n.registerBundle = function(/*Array*/bundle){
		// summary:
		//		Accumulates the given localized resouces in an array and returns
		//		it.
		if(!i18n.bundle){ i18n.bundle = []; }
		return lang.mixin(i18n.bundle, bundle);
	};

	lang.extend(WidgetBase, {
		mblNoConv: false,
		_cv: function(s){
			if(this.mblNoConv || !i18n.bundle){ return s; }
			return i18n.bundle[lang.trim(s)] || s;
		}
	});

	return i18n;
});

},
'dojox/mobile/_DataMixin':function(){
define("dojox/mobile/_DataMixin", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(array, declare, lang, Deferred){

	// module:
	//		dojox/mobile/_DataMixin
	// summary:
	//		Mixin for widgets to enable dojo.data data store.

	return declare("dojox.mobile._DataMixin", null, {
		// summary:
		//		Mixin for widgets to enable dojo.data data store.
		// description:
		//		By mixing this class into a widget, it can get data through a
		//		dojo.data data store. The widget must implement
		//		onComplete(/*Array*/items) to handle the retrieved data.

		// store: Object
		//		Reference to data provider object
		store: null,

		// query: Object
		//		A query that can be passed to 'store' to initially filter the
		//		items.
		query: null,

		// queryOptions: Object
		//		An optional parameter for the query.
		queryOptions: null,

		setStore: function(store, query, queryOptions){
			// summary:
			//		Sets the store to use with this widget.
			if(store === this.store){ return null; }
			this.store = store;
			this._setQuery(query, queryOptions);
			if(store && store.getFeatures()["dojo.data.api.Notification"]){
				array.forEach(this._conn || [], this.disconnect, this);
				this._conn = [
					this.connect(store, "onSet", "onSet"),
					this.connect(store, "onNew", "onNew"),
					this.connect(store, "onDelete", "onDelete"),
					this.connect(store, "close", "onStoreClose")
				];
			}
			return this.refresh();
		},

		setQuery: function(query, queryOptions){
			this._setQuery(query, queryOptions);
			return this.refresh();
		},

		_setQuery: function(query, queryOptions){
			this.query = query;
			this.queryOptions = queryOptions || this.queryOptions;
		},

		refresh: function(){
			// summary:
			//		Fetches the data and generates the list items.
			if(!this.store){ return null; }
			var d = new Deferred();
			var onComplete = lang.hitch(this, function(items, request){
				this.onComplete(items, request);
				d.resolve();
			});
			var onError = lang.hitch(this, function(errorData, request){
				this.onError(errorData, request);
				d.resolve();
			});
			var q = this.query;
			this.store.fetch({
				query: q,
				queryOptions: this.queryOptions,
				onComplete: onComplete,
				onError: onError,
				start: q && q.start,
				count: q && q.count
			});
			return d;
		}

/*
		// Subclass MUST implement the following methods.

		onComplete: function(items, request){
			// summary:
			//		An handler that is called after the fetch completes.
		},

		onError: function(errorData, request){
			// summary:
			//		An error handler.
		},

		onSet: function(item, attribute, oldValue, newValue){
			//	summary:
			//		See dojo.data.api.Notification.onSet()
		},

		onNew: function(newItem, parentInfo){
			//	summary:
			//		See dojo.data.api.Notification.onNew()
		},

		onDelete: function(deletedItem){
			//	summary:
			//		See dojo.data.api.Notification.onDelete()
		},

		onStoreClose: function(request){
			//	summary:
			//		Refresh list on close.
		}
*/
	});
});

},
'dojox/mobile/IconItem':function(){
define("dojox/mobile/IconItem", [
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"./_ItemBase",
	"./Badge",
	"./TransitionEvent",
	"./iconUtils",
	"./lazyLoadUtils",
	"./viewRegistry"
], function(declare, event, lang, has, win, domClass, domConstruct, domGeometry, domStyle, ItemBase, Badge, TransitionEvent, iconUtils, lazyLoadUtils, viewRegistry){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/IconItem
	// summary:
	//		An icon item widget.

	return declare("dojox.mobile.IconItem", ItemBase, {
		// summary:
		//		An icon item widget.
		// description:
		//		IconItem represents an item that has an application component
		//		and its icon image. You can tap the icon to open the
		//		corresponding application component. You can also use the icon
		//		to move to a different view by specifying either of the moveTo,
		//		href or url parameters.

		// lazy: String
		//		If true, the content of the widget, which includes dojo markup,
		//		is instantiated lazily. That is, only when the widget is opened
		//		by the user, the required modules are loaded and the content
		//		widgets are instantiated.
		lazy: false,

		// requires: String
		//		Comma-separated required module names to be lazily loaded. This
		//		is effective only when lazy=true. All the modules specified with
		//		dojoType and their depending modules are automatically loaded
		//		when the widget is opened. However, if you need other extra
		//		modules to be loaded, use this parameter.
		requires: "",

		// timeout: String
		//		Duration of highlight in seconds.
		timeout: 10,

		// content: String
		//		An html fragment to embed.
		content: "",

		badge: "",
		badgeClass: "mblDomButtonRedBadge",

		deletable: true,
		deleteIcon: "",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		/* internal properties */	
		paramsToInherit: "transition,icon,deleteIcon,badgeClass,deleteIconTitle,deleteIconRole",
		baseClass: "mblIconItem",
		_selStartMethod: "touch",
		_selEndMethod: "none",

		destroy: function(){
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);

			if(this.srcNodeRef){
				// reparent
				this._tmpNode = domConstruct.create("div");
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this._tmpNode.appendChild(this.srcNodeRef.firstChild);
				}
			}

			this.iconDivNode = domConstruct.create("div", {className:"mblIconArea"}, this.domNode);
			this.iconParentNode = domConstruct.create("div", {className:"mblIconAreaInner"}, this.iconDivNode);
			this.labelNode = domConstruct.create("span", {className:"mblIconAreaTitle"}, this.iconDivNode);

			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }

			var p = this.getParent();
			require([p.iconItemPaneClass], lang.hitch(this, function(module){
				var w = this.paneWidget = new module(p.iconItemPaneProps);
				this.containerNode = w.containerNode;
				if(this._tmpNode){
					// reparent
					for(var i = 0, len = this._tmpNode.childNodes.length; i < len; i++){
						w.containerNode.appendChild(this._tmpNode.firstChild);
					}
					this._tmpNode = null;
				}
				p.paneContainerWidget.addChild(w, this.getIndexInParent());
				w.set("label", this.label);
				this._clickCloseHandle = this.connect(w.closeIconNode, "onclick", "_closeIconClicked");
				this._keydownCloseHandle = this.connect(w.closeIconNode, "onkeydown", "_closeIconClicked"); // for desktop browsers
			}));

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				this.set("icon", this.icon); // retry applying the attribute
			}
			if(!this.icon && p.defaultIcon){
				this.set("icon", p.defaultIcon);
			}

			this._dragstartHandle = this.connect(this.domNode, "ondragstart", event.stop);
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers
		},

		highlight: function(/*Number?*/timeout){
			// summary:
			//		Shakes the icon 10 seconds.
			domClass.add(this.iconDivNode, "mblVibrate");
			timeout = (timeout !== undefined) ? timeout : this.timeout;
			if(timeout > 0){
				var _this = this;
				setTimeout(function(){
					_this.unhighlight();
				}, timeout*1000);
			}
		},

		unhighlight: function(){
			// summary:
			//		Stops shaking the icon.
			domClass.remove(this.iconDivNode, "mblVibrate");
		},

		isOpen: function(e){
			// summary:
			//		Returns true if the icon is open.
			return this.paneWidget.isOpen();
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.getParent().isEditing || e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_onNewWindowOpened: function(e){
			this.set("selected", false);
		},

		_prepareForTransition: function(e, transOpts){
			if(transOpts){
				setTimeout(lang.hitch(this, function(d){
					this.set("selected", false);
				}), 1500);
				return true;
			}else{
				if(this.getParent().transition === "below" && this.isOpen()){
					this.close();
				}else{
					this.open(e);
				}
				return false;
			}
		},

		_closeIconClicked: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e){
				if(e.type === "keydown" && e.keyCode !== 13){ return; }
				if(this.closeIconClicked(e) === false){ return; } // user's click action
				setTimeout(lang.hitch(this, function(d){ this._closeIconClicked(); }), 0);
				return;
			}
			this.close();
		},

		closeIconClicked: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		open: function(e){
			// summary:
			//		Opens the icon content, or makes a transition.
			var parent = this.getParent(); // IconContainer
			if(this.transition === "below"){
				if(parent.single){
					parent.closeAll();
				}
				this._open_1();
			}else{
				parent._opening = this;
				if(parent.single){
					this.paneWidget.closeHeaderNode.style.display = "none";
					if(!this.isOpen()){
						parent.closeAll();
					}
					parent.appView._heading.set("label", this.label);
				}
				this.moveTo = parent.id + "_mblApplView";
				new TransitionEvent(this.domNode, this.getTransOpts(), e).dispatch();
			}
		},

		_open_1: function(){
			this.paneWidget.show();
			this.unhighlight();
			if(this.lazy){
				lazyLoadUtils.instantiateLazyWidgets(this.containerNode, this.requires);
				this.lazy = false;
			}
			this.scrollIntoView(this.paneWidget.domNode);
			this.onOpen();
		},

		scrollIntoView: function(/*DomNode*/node){
			var s = viewRegistry.getEnclosingScrollable(node);
			if(s){ // this node is placed inside scrollable
				s.scrollIntoView(node, true);
			}else{
				win.global.scrollBy(0, domGeometry.position(node, false).y);
			}
		},

		close: function(/*Boolean?*/noAnimation){
			// summary:
			//		Closes the icon content.
			if(!this.isOpen()){ return; }
			this.set("selected", false);
			if(has("webkit") && !noAnimation){
				var contentNode = this.paneWidget.domNode;
				if(this.getParent().transition == "below"){
					domClass.add(contentNode, "mblCloseContent mblShrink");
					var nodePos = domGeometry.position(contentNode, true);
					var targetPos = domGeometry.position(this.domNode, true);
					var origin = (targetPos.x + targetPos.w/2 - nodePos.x) + "px " + (targetPos.y + targetPos.h/2 - nodePos.y) + "px";
					domStyle.set(contentNode, { webkitTransformOrigin:origin });
				}else{
					domClass.add(contentNode, "mblCloseContent mblShrink0");
				}
			}else{
				this.paneWidget.hide();
			}
			this.onClose();
		},

		onOpen: function(){
			// summary:
			//		Stub method to allow the application to connect to.
		},

		onClose: function(){
			// summary:
			//		Stub method to allow the application to connect to.
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.labelNode.innerHTML = s;
			if(this.paneWidget){
				this.paneWidget.set("label", text);
			}
		},

		_getBadgeAttr: function(){
			return this.badgeObj ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:14, className:this.badgeClass});
				domStyle.set(this.badgeObj.domNode, {
					position: "absolute",
					top: "-2px",
					right: "2px"
				});
			}
			this.badgeObj.setValue(value);
			if(value){
				this.iconDivNode.appendChild(this.badgeObj.domNode);
			}else{
				this.iconDivNode.removeChild(this.badgeObj.domNode);
			}
		},

		_setDeleteIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet

			this._set("deleteIcon", icon);
			icon = this.deletable ? icon : "";
			this.deleteIconNode = iconUtils.setIcon(icon, this.deleteIconPos, this.deleteIconNode, 
					this.deleteIconTitle || this.alt, this.iconDivNode);
			if(this.deleteIconNode){
				domClass.add(this.deleteIconNode, "mblIconItemDeleteIcon");
				if(this.deleteIconRole){
					this.deleteIconNode.setAttribute("role", this.deleteIconRole);
				}
			}
		},

		_setContentAttr: function(/*String|DomNode*/data){
			var root;
			if(!this.paneWidget){
				if(!this._tmpNode){
					this._tmpNode = domConstruct.create("div");
				}
				root = this._tmpNode;
			}else{
				root = this.paneWidget.containerNode;
			}

			if(typeof data === "object"){
				domConstruct.empty(root);
				root.appendChild(data);
			}else{
				root.innerHTML = data;
			}
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domStyle.set(this.iconNode, "opacity",
						 selected ? this.getParent().pressedIconOpacity : 1);
		}
	});
});

},
'dojox/mobile/RadioButton':function(){
define("dojox/mobile/RadioButton", [
	"dojo/_base/declare",
	"dijit/form/_RadioButtonMixin",
	"./CheckBox"
], function(declare, RadioButtonMixin, CheckBox){
	/*=====
		CheckBox = dojox.mobile.CheckBox;
		RadioButtonMixin = dijit.form._RadioButtonMixin;
	=====*/
	return declare("dojox.mobile.RadioButton", [CheckBox, RadioButtonMixin], {
		// summary:
		//		A non-templated radiobutton widget that can be in two states (checked or not).

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		baseClass: "mblRadioButton"
	});
});

},
'dojox/mobile/dh/HtmlContentHandler':function(){
define("dojox/mobile/dh/HtmlContentHandler", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",
	"../lazyLoadUtils"
], function(dojo, array, declare, Deferred, domClass, domConstruct, registry, lazyLoadUtils){

	// module:
	//		dojox/mobile/dh/HtmlContentHandler
	// summary:
	//		An HTML content handler.

	return declare("dojox.mobile.dh.HtmlContentHandler", null, {
		// summary:
		//		A HTML content handler.
		// description:
		//		This module is a content handler that creates a view from HTML
		//		data. If widgets used in the HTML data are not available, they
		//		are loaded automatically before instantiation.

		parse: function(/*String*/ text, /*DomNode*/ target, /*DomNode*/ refNode){
			if(this.execScript){
				text = this.execScript(text);
			}
			var container = domConstruct.create("div", {
				innerHTML: text,
				style: {visibility: "hidden"}
			});
			target.insertBefore(container, refNode);

			return Deferred.when(lazyLoadUtils.instantiateLazyWidgets(container), function(){
				// allows multiple root nodes in the fragment,
				// but transition will be performed to the 1st view.
				var view;
				for(i = 0, len = container.childNodes.length; i < len; i++){
					var n = container.firstChild;
					if(!view && n.nodeType === 1){
						view = registry.byNode(n);
					}
					target.insertBefore(container.firstChild, refNode); // reparent
				}
				target.removeChild(container);
				if(!view || !domClass.contains(view.domNode, "mblView")){
					console.log("HtmlContentHandler.parse: invalid view content");
					return null;
				}
				return view.id;
			});
		}
	});
});

},
'dojox/css3/fx':function(){
define("dojox/css3/fx", [
	"dojo/_base/kernel",
	"dojo/_base/connect",	// dojo.connect
	"dojo/dom-style",	// dojo.style
	"dojo/_base/fx",
	"dojo/fx",
	"dojo/_base/html",
	"dojox/html/ext-dojo/style",
	"dojox/fx/ext-dojo/complex"],
function(lang,connectUtil,domStyle,baseFx,coreFx,htmlUtil,htmlStyleExt,complexFx){
	var css3fx = lang.getObject("dojox.css3.fx", true);
	/*===== css3fx = dojox.css3.fx =====*/
	
	return lang.mixin(css3fx, {
		puff: function(args){
			// summary:
			//		Returns an animation that will do a "puff" effect on the given node
			//
			// description:
			//		Fades out an element and scales it to args.endScale
			//
			return coreFx.combine([baseFx.fadeOut(args),
				this.expand({
					node: args.node,
					endScale: args.endScale || 2
				})
			]);
		},

		expand: function(args){
			// summary:
			//		Returns an animation that expands args.node
			//
			// description:
			//		Scales an element to args.endScale
			//
			return baseFx.animateProperty({
				node: args.node,
				properties: {
					transform: { start: "scale(1)", end: "scale(" + [args.endScale || 3] + ")" }
				}
			});
		},

		shrink: function(args){
			// summary:
			//		Returns an animation that shrinks args.node
			//
			// description:
			//		Shrinks an element, same as expand({ node: node, endScale: .01 });
			//
			return this.expand({
				node: args.node,
				endScale: .01
			});
		},

		rotate: function(args){
			// summary:
			//		Returns an animation that rotates an element
			//
			// description:
			//		Rotates an element from args.startAngle to args.endAngle
			//
			return baseFx.animateProperty({
				node: args.node,
				duration: args.duration || 1000,
				properties: {
					transform: { start: "rotate(" + (args.startAngle || "0deg") + ")", end: "rotate(" + (args.endAngle || "360deg") + ")" }
				}
			});
		},

		flip: function(args){
			// summary:
			//		Returns an animation that flips an element around his y axis
			//
			// description:
			//		Flips an element around his y axis. The default is a 360deg flip
			//		but it's possible to run a partial flip using args.whichAnims
			//
			// example:
			//	|	// half flip
			//	|	dojox.css3.fx.flip({
			//	|		node: domNode,
			//	|		whichAnim: [0, 1]
			//	|	}).play();
			//
			var anims = [],
				whichAnims = args.whichAnims || [0, 1, 2, 3],
					direction = args.direction || 1,
				transforms = [
					{ start: "scale(1, 1) skew(0deg,0deg)", end: "scale(0, 1) skew(0," + (direction * 30) + "deg)" },
					{ start: "scale(0, 1) skew(0deg," + (direction * 30) + "deg)", end: "scale(-1, 1) skew(0deg,0deg)" },
					{ start: "scale(-1, 1) skew(0deg,0deg)", end: "scale(0, 1) skew(0deg," + (-direction * 30) + "deg)" },
					{ start: "scale(0, 1) skew(0deg," + (-direction * 30) + "deg)", end: "scale(1, 1) skew(0deg,0deg)" }
			];
			for(var i = 0; i < whichAnims.length; i++){
				anims.push(baseFx.animateProperty(
					lang.mixin({
					node: args.node,
					duration: args.duration || 600,
					properties: {
						transform: transforms[whichAnims[i]]
					}}, args)
				));
			}
			return coreFx.chain(anims);
		},

		bounce: function(args){
			// summary:
			//		Returns an animation that do a "bounce" effect on args.node
			//
			// description:
			//		Vertical bounce animation, the scaleX, scaleY deformation and the
			//		jump height (args.jumpHeight) can be specified
			//
			var anims = [],
				n = args.node,
				duration = args.duration || 1000,
				scaleX = args.scaleX || 1.2,
				scaleY = args.scaleY || .6,
				ds = htmlUtil.style,
				oldPos = ds(n, "position"),
				newPos = "absolute",
				oldTop = ds(n, "top"),
				combinedAnims = [],
				bTime = 0,
				round = Math.round,
				jumpHeight = args.jumpHeight || 70
			;
			if(oldPos !== "absolute"){
				newPos = "relative";
			}
			var a1 = baseFx.animateProperty({
				node: n,
				duration: duration / 6,
				properties: {
					transform: { start: "scale(1, 1)", end: "scale(" + scaleX + ", " + scaleY + ")" }
				}
			});
			connectUtil.connect(a1, "onBegin", function(){
				ds(n, {
					transformOrigin: "50% 100%",
					position: newPos
				});
			});
			anims.push(a1);
			var a2 = baseFx.animateProperty({
				node: n,
				duration: duration / 6,
				properties: {
					transform: { end: "scale(1, 1)", start: "scale(" + scaleX + ", " + scaleY + ")" }
				}
			});
			combinedAnims.push(a2);
			combinedAnims.push(new baseFx.Animation(lang.mixin({
				curve: [],
				duration: duration / 3,
				delay: duration / 12,
				onBegin: function(){
					bTime = (new Date).getTime();
				},
				onAnimate: function(){
					var cTime = (new Date).getTime();
					ds(n, {
						top: parseInt(ds(n, "top")) - round(jumpHeight*((cTime-bTime)/this.duration)) + "px"
					});
					bTime = cTime;
				}
			}, args)));
			anims.push(coreFx.combine(combinedAnims));
			anims.push(baseFx.animateProperty(lang.mixin({
				duration: duration / 3,
				onEnd: function(){
					ds(n, {
						position: oldPos
					});
				},
				properties:{
					top: oldTop
				}
			}, args)));
			anims.push(a1);
			anims.push(a2);

			return coreFx.chain(anims);
		}
	});
});

},
'dojox/mobile/dh/StringDataSource':function(){
define("dojox/mobile/dh/StringDataSource", [
	"dojo/_base/declare"
], function(declare){

	return declare("dojox.mobile.dh.StringDataSource", null, {
		text: "",

		constructor: function(/*String*/ text){
			this.text = text;
		},

		getData: function(){
			return this.text;
		}
	});
});

},
'dojox/mobile/SpinWheelSlot':function(){
define("dojox/mobile/SpinWheelSlot", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./scrollable"
], function(array, declare, lang, win, domClass, domConstruct, Contained, WidgetBase, Scrollable){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/SpinWheelSlot
	// summary:
	//		A slot of a SpinWheel.

	var cls = declare("", null, {});
	lang.extend(cls, new Scrollable());

	return declare("dojox.mobile.SpinWheelSlot", [WidgetBase, Contained, cls], {
		// summary:
		//		A slot of a SpinWheel.
		// description:
		//		SpinWheelSlot is a slot that is placed in the SpinWheel widget.

		// items: Array
		//		An array of array of key-label paris.
		//		(e.g. [[0,"Jan"],[1,"Feb"],...] ) If key values for each label
		//		are not necessary, labels can be used instead.
		items: [],

		// labels: Array
		//		An array of labels to be displayed on the slot.
		//		(e.g. ["Jan","Feb",...] ) This is a simplified version of the
		//		items property.
		labels: [],

		// labelFrom: Number
		//		The start value of display values of the slot. This parameter is
		//		especially useful when slot has serial values.
		labelFrom: 0,

		// labelTo: Number
		//		The end value of display values of the slot.
		labelTo: 0,

		// zeroPad: Number
		//		Length of zero padding numbers.
		//		Ex. zeroPad=2 -> "00", "01", ...
		//		Ex. zeroPad=3 -> "000", "001", ...
		zeroPad: 0,

		// value: String
		//		The initial value of the slot.
		value: "",

		// step: Number
		//		The steps between labelFrom and labelTo.
		step: 1,

		// tabIndex: String
		//		Tabindex setting for this widget so users can hit the tab key to
		//		focus on it.
		tabIndex: "0",
		_setTabIndexAttr: "", // sets tabIndex to domNode

		/* internal properties */	
		baseClass: "mblSpinWheelSlot",
		maxSpeed: 500,
		minItems: 15,
		centerPos: 0,
		scrollBar: false,
		constraint: false,
		propagatable: false, // stop touchstart event propagation to make spin wheel work inside scrollable
		androidWorkaroud: false, // disable workaround in SpinWheel TODO:remove this line later

		buildRendering: function(){
			this.inherited(arguments);

			this.initLabels();
			if(this.labels.length > 0){
				this.items = [];
				for(i = 0; i < this.labels.length; i++){
					this.items.push([i, this.labels[i]]);
				}
			}

			this.containerNode = domConstruct.create("div", {className:"mblSpinWheelSlotContainer"});
			this.containerNode.style.height
				= (win.global.innerHeight||win.doc.documentElement.clientHeight) * 2 + "px"; // must bigger than the screen
			this.panelNodes = [];
			for(var k = 0; k < 3; k++){
				this.panelNodes[k] = domConstruct.create("div", {className:"mblSpinWheelSlotPanel"});
				var len = this.items.length;
				var n = Math.ceil(this.minItems / len);
				for(j = 0; j < n; j++){
					for(i = 0; i < len; i++){
						domConstruct.create("div", {
							className: "mblSpinWheelSlotLabel",
							name: this.items[i][0],
							innerHTML: this._cv ? this._cv(this.items[i][1]) : this.items[i][1]
						}, this.panelNodes[k]);
					}
				}
				this.containerNode.appendChild(this.panelNodes[k]);
			}
			this.domNode.appendChild(this.containerNode);
			this.touchNode = domConstruct.create("div", {className:"mblSpinWheelSlotTouch"}, this.domNode);
			this.setSelectable(this.domNode, false);

			if(this.value === "" && this.items.length > 0){
				this.value = this.items[0][1];
			}
			this._initialValue = this.value;
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.noResize = true;
			this.init();
			this.centerPos = this.getParent().centerPos;
			var items = this.panelNodes[1].childNodes;
			this._itemHeight = items[0].offsetHeight;
			this.adjust();
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onKeyDown"); // for desktop browsers
		},

		initLabels: function(){
			if(this.labelFrom !== this.labelTo){
				var a = this.labels = [],
					zeros = this.zeroPad && Array(this.zeroPad).join("0");
				for(var i = this.labelFrom; i <= this.labelTo; i += this.step){
					a.push(this.zeroPad ? (zeros + i).slice(-this.zeroPad) : i + "");
				}
			}
		},

		adjust: function(){
			// summary:
			//		Adjusts the position of slot panels.
			var items = this.panelNodes[1].childNodes;
			var adjustY;
			for(var i = 0, len = items.length; i < len; i++){
				var item = items[i];
				if(item.offsetTop <= this.centerPos && this.centerPos < item.offsetTop + item.offsetHeight){
					adjustY = this.centerPos - (item.offsetTop + Math.round(item.offsetHeight/2));
					break;
				}
			}
			var h = this.panelNodes[0].offsetHeight;
			this.panelNodes[0].style.top = -h + adjustY + "px";
			this.panelNodes[1].style.top = adjustY + "px";
			this.panelNodes[2].style.top = h + adjustY + "px";
		},

		setInitialValue: function(){
			// summary:
			//		Sets the initial value using this.value or the first item.
			this.set("value", this._initialValue);
		},

		_onKeyDown: function(e){
			if(!e || e.type !== "keydown"){ return; }
			if(e.keyCode === 40){ // down arrow key
				this.spin(-1);
			}else if(e.keyCode === 38){ // up arrow key
				this.spin(1);
			}
		},

		_getCenterPanel: function(){
			// summary:
			//		Gets a panel that contains the currently selected item.
			var pos = this.getPos();
			for(var i = 0, len = this.panelNodes.length; i < len; i++){
				var top = pos.y + this.panelNodes[i].offsetTop;
				if(top <= this.centerPos && this.centerPos < top + this.panelNodes[i].offsetHeight){
					return this.panelNodes[i];
				}
			}
			return null;
		},

		setColor: function(/*String*/value, /*String?*/color){
			// summary:
			//		Sets the color of the specified item as blue.
			array.forEach(this.panelNodes, function(panel){
				array.forEach(panel.childNodes, function(node, i){
					domClass.toggle(node, color || "mblSpinWheelSlotLabelBlue", node.innerHTML === value);
				}, this);
			}, this);
		},

		disableValues: function(/*Number*/n){
			// summary:
			//		Makes the specified items grayed out.
			array.forEach(this.panelNodes, function(panel){
				for(var i = 27; i < 31; i++){
					domClass.toggle(panel.childNodes[i], "mblSpinWheelSlotLabelGray", i >= nDays);
				}
			});
		},

		getCenterItem: function(){
			// summary:
			//		Gets the currently selected item.
			var pos = this.getPos();
			var centerPanel = this._getCenterPanel();
			if(centerPanel){
				var top = pos.y + centerPanel.offsetTop;
				var items = centerPanel.childNodes;
				for(var i = 0, len = items.length; i < len; i++){
					if(top + items[i].offsetTop <= this.centerPos && this.centerPos < top + items[i].offsetTop + items[i].offsetHeight){
						return items[i];
					}
				}
			}
			return null;

		},

		_getKeyAttr: function(){
			// summary:
			//		Gets the key for the currently selected value.
			var item = this.getCenterItem();
			return (item && item.getAttribute("name"));
		},

		_getValueAttr: function(){
			// summary:
			//		Gets the currently selected value.
			var item = this.items[this.get("key")];
			return item && item[1];
		},

		_setValueAttr: function(value){
			// summary:
			//		Sets the value to this slot.
			var idx0, idx1;
			var curValue = this.get("value");
			if(!curValue){
				this._penddingValue = value;
				return;
			}
			this._penddingValue = undefined;
			this._set("value", value);
			var n = this.items.length;
			for(var i = 0; i < n; i++){
				if(this.items[i][1] === String(curValue)){
					idx0 = i;
				}
				if(this.items[i][1] === String(value)){
					idx1 = i;
				}
				if(idx0 !== undefined && idx1 !== undefined){
					break;
				}
			}
			var d = idx1 - (idx0 || 0);
			var m;
			if(d > 0){
				m = (d < n - d) ? -d : n - d;
			}else{
				m = (-d < n + d) ? -d : -(n + d);
			}
			this.spin(m);
		},

		spin: function(/*Number*/steps){
			// summary:
			//		Spins the slot as specified by steps.
			if(!this._started){ return; } // do not work until start up
			var to = this.getPos();
			if(to.y % this._itemHeight){ return; } // maybe still spinning
			to.y += steps * this._itemHeight;
			this.slideTo(to, 1);
		},

		getSpeed: function(){
			// summary:
			//		Overrides dojox.mobile.scrollable.getSpeed().
			var y = 0, n = this._time.length;
			var delta = (new Date()).getTime() - this.startTime - this._time[n - 1];
			if(n >= 2 && delta < 200){
				var dy = this._posY[n - 1] - this._posY[(n - 6) >= 0 ? n - 6 : 0];
				var dt = this._time[n - 1] - this._time[(n - 6) >= 0 ? n - 6 : 0];
				y = this.calcSpeed(dy, dt);
			}
			return {x:0, y:y};
		},

		calcSpeed: function(/*Number*/d, /*Number*/t){
			// summary:
			//		Overrides dojox.mobile.scrollable.calcSpeed().
			var speed = this.inherited(arguments);
			if(!speed){ return 0; }
			var v = Math.abs(speed);
			var ret = speed;
			if(v > this.maxSpeed){
				ret = this.maxSpeed*(speed/v);
			}
			return ret;
		},

		adjustDestination: function(to, pos, dim){
			// summary:
			//		Overrides dojox.mobile.scrollable.adjustDestination().
			var h = this._itemHeight;
			var j = to.y + Math.round(h/2);
			var a = Math.abs(j);
			var r = j >= 0 ? j % h : j % h + h;
			to.y = j - r;
			return true;
		},

		resize: function(e){
			if(this._penddingValue){
				this.set("value", this._penddingValue);
			}
		},

		slideTo: function(/*Object*/to, /*Number*/duration, /*String*/easing){
			// summary:
			//		Overrides dojox.mobile.scrollable.slideTo().
			var pos = this.getPos();
			var top = pos.y + this.panelNodes[1].offsetTop;
			var bottom = top + this.panelNodes[1].offsetHeight;
			var vh = this.domNode.parentNode.offsetHeight;
			var t;
			if(pos.y < to.y){ // going down
				if(bottom > vh){
					// move up the bottom panel
					t = this.panelNodes[2];
					t.style.top = this.panelNodes[0].offsetTop - this.panelNodes[0].offsetHeight + "px";
					this.panelNodes[2] = this.panelNodes[1];
					this.panelNodes[1] = this.panelNodes[0];
					this.panelNodes[0] = t;
				}
			}else if(pos.y > to.y){ // going up
				if(top < 0){
					// move down the top panel
					t = this.panelNodes[0];
					t.style.top = this.panelNodes[2].offsetTop + this.panelNodes[2].offsetHeight + "px";
					this.panelNodes[0] = this.panelNodes[1];
					this.panelNodes[1] = this.panelNodes[2];
					this.panelNodes[2] = t;
				}
			}
			if(!this._initialized){
				duration = 0; // to reduce flickers at start-up especially on android
				this._initialized = true;
			}else if(Math.abs(this._speed.y) < 40){
				duration = 0.2;
			}
			this.inherited(arguments, [to, duration, easing]); // 2nd arg is to avoid excessive optimization by closure compiler
		}
	});
});

},
'dojox/mobile/FixedSplitterPane':function(){
define("dojox/mobile/FixedSplitterPane", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"./Container"
], function(kernel, declare, Container){
	kernel.deprecated("dojox.mobile.FixedSplitterPane is deprecated", "Use dojox.mobile.Container instead", 2.0);
	return declare("dojox.mobile.FixedSplitterPane", Container, {
		baseClass: "mblFixedSplitterPane"
	});
});

},
'dojox/mobile/common':function(){
define("dojox/mobile/common", [
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/ready",
	"dijit/registry",
	"./sniff",
	"./uacss" // (no direct references)
], function(array, config, connect, lang, win, domClass, domConstruct, ready, registry, has){

	var dm = lang.getObject("dojox.mobile", true);
/*=====
	var dm = dojox.mobile;
=====*/

	// module:
	//		dojox/mobile/common
	// summary:
	//		A common module for dojox.mobile.
	// description:
	//		This module includes common utility functions that are used by
	//		dojox.mobile widgets. Also, it provides functions that are commonly
	//		necessary for mobile web applications, such as the hide address bar
	//		function.

	dm.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight || win.doc.documentElement.clientHeight,
			w: win.global.innerWidth || win.doc.documentElement.clientWidth
		};
	};

	dm.updateOrient = function(){
		// summary:
		//		Updates the orientation specific css classes, 'dj_portrait' and
		//		'dj_landscape'.
		var dim = dm.getScreenSize();
		domClass.replace(win.doc.documentElement,
				  dim.h > dim.w ? "dj_portrait" : "dj_landscape",
				  dim.h > dim.w ? "dj_landscape" : "dj_portrait");
	};
	dm.updateOrient();

	dm.tabletSize = 500;
	dm.detectScreenSize = function(/*Boolean?*/force){
		// summary:
		//		Detects the screen size and determines if the screen is like
		//		phone or like tablet. If the result is changed,
		//		it sets either of the following css class to <html>
		//			- 'dj_phone'
		//			- 'dj_tablet'
		//		and it publishes either of the following events.
		//			- '/dojox/mobile/screenSize/phone'
		//			- '/dojox/mobile/screenSize/tablet'
		var dim = dm.getScreenSize();
		var sz = Math.min(dim.w, dim.h);
		var from, to;
		if(sz >= dm.tabletSize && (force || (!this._sz || this._sz < dm.tabletSize))){
			from = "phone";
			to = "tablet";
		}else if(sz < dm.tabletSize && (force || (!this._sz || this._sz >= dm.tabletSize))){
			from = "tablet";
			to = "phone";
		}
		if(to){
			domClass.replace(win.doc.documentElement, "dj_"+to, "dj_"+from);
			connect.publish("/dojox/mobile/screenSize/"+to, [dim]);
		}
		this._sz = sz;
	};
	dm.detectScreenSize();

	// dojox.mobile.hideAddressBarWait: Number
	//		The time in milliseconds to wait before the fail-safe hiding address
	//		bar runs. The value must be larger than 800.
	dm.hideAddressBarWait = typeof(config["mblHideAddressBarWait"]) === "number" ?
		config["mblHideAddressBarWait"] : 1500;

	dm.hide_1 = function(){
		// summary:
		//		Internal function to hide the address bar.
		scrollTo(0, 1);
		dm._hidingTimer = (dm._hidingTimer == 0) ? 200 : dm._hidingTimer * 2;
		setTimeout(function(){ // wait for a while for "scrollTo" to finish
			if(dm.isAddressBarHidden() || dm._hidingTimer > dm.hideAddressBarWait){
				// Succeeded to hide address bar, or failed but timed out 
				dm.resizeAll();
				dm._hiding = false;
			}else{
				// Failed to hide address bar, so retry after a while
				setTimeout(dm.hide_1, dm._hidingTimer);
			}
		}, 50); //50ms is an experiential value
	};

	dm.hideAddressBar = function(/*Event?*/evt){
		// summary:
		//		Hides the address bar.
		// description:
		//		Tries hiding of the address bar a couple of times to do it as
		//		quick as possible while ensuring resize is done after the hiding
		//		finishes.
		if(dm.disableHideAddressBar || dm._hiding){ return; }
		dm._hiding = true;
		dm._hidingTimer = has("iphone") ? 200 : 0; // Need to wait longer in case of iPhone
		var minH = screen.availHeight;
		if(has("android")){
			minH = outerHeight / devicePixelRatio;
			// On some Android devices such as Galaxy SII, minH might be 0 at this time.
			// In that case, retry again after a while. (200ms is an experiential value)
			if(minH == 0){
				dm._hiding = false;
				setTimeout(function(){ dm.hideAddressBar(); }, 200);
			}
			// On some Android devices such as HTC EVO, "outerHeight/devicePixelRatio"
			// is too short to hide address bar, so make it high enough
			if(minH <= innerHeight){ minH = outerHeight; }
			// On Android 2.2/2.3, hiding address bar fails when "overflow:hidden" style is
			// applied to html/body element, so force "overflow:visible" style
			if(has("android") < 3){
				win.doc.documentElement.style.overflow = win.body().style.overflow = "visible";
			}
		}
		if(win.body().offsetHeight < minH){ // to ensure enough height for scrollTo to work
			win.body().style.minHeight = minH + "px";
			dm._resetMinHeight = true;
		}
		setTimeout(dm.hide_1, dm._hidingTimer);
	};

	dm.isAddressBarHidden = function(){
		return pageYOffset === 1;
	};

	dm.resizeAll = function(/*Event?*/evt, /*Widget?*/root){
		// summary:
		//		Call the resize() method of all the top level resizable widgets.
		// description:
		//		Find all widgets that do not have a parent or the parent does not
		//		have the resize() method, and call resize() for them.
		//		If a widget has a parent that has resize(), call of the widget's
		//		resize() is its parent's responsibility.
		// evt:
		//		Native event object
		// root:
		//		If specified, search the specified widget recursively for top level
		//		resizable widgets.
		//		root.resize() is always called regardless of whether root is a
		//		top level widget or not.
		//		If omitted, search the entire page.
		if(dm.disableResizeAll){ return; }
		connect.publish("/dojox/mobile/resizeAll", [evt, root]); // back compat
		connect.publish("/dojox/mobile/beforeResizeAll", [evt, root]);
		if(dm._resetMinHeight){
			win.body().style.minHeight = dm.getScreenSize().h + "px";
		} 
		dm.updateOrient();
		dm.detectScreenSize();
		var isTopLevel = function(w){
			var parent = w.getParent && w.getParent();
			return !!((!parent || !parent.resize) && w.resize);
		};
		var resizeRecursively = function(w){
			array.forEach(w.getChildren(), function(child){
				if(isTopLevel(child)){ child.resize(); }
				resizeRecursively(child);
			});
		};
		if(root){
			if(root.resize){ root.resize(); }
			resizeRecursively(root);
		}else{
			array.forEach(array.filter(registry.toArray(), isTopLevel),
					function(w){ w.resize(); });
		}
		connect.publish("/dojox/mobile/afterResizeAll", [evt, root]);
	};

	dm.openWindow = function(url, target){
		// summary:
		//		Opens a new browser window with the given url.
		win.global.open(url, target || "_blank");
	};

	if(config["mblApplyPageStyles"] !== false){
		domClass.add(win.doc.documentElement, "mobile");
	}
	if(has("chrome")){
		// dojox.mobile does not load uacss (only _compat does), but we need dj_chrome.
		domClass.add(win.doc.documentElement, "dj_chrome");
	}

	if(win.global._no_dojo_dm){
		// deviceTheme seems to be loaded from a script tag (= non-dojo usage)
		var _dm = win.global._no_dojo_dm;
		for(var i in _dm){
			dm[i] = _dm[i];
		}
		dm.deviceTheme.setDm(dm);
	}

	// flag for Android transition animation flicker workaround
	has.add("mblAndroidWorkaround", 
			config["mblAndroidWorkaround"] !== false && has("android") < 3, undefined, true);
	has.add("mblAndroid3Workaround", 
			config["mblAndroid3Workaround"] !== false && has("android") >= 3, undefined, true);

	ready(function(){
		dm.detectScreenSize(true);

		if(config["mblAndroidWorkaroundButtonStyle"] !== false && has("android")){
			// workaround for the form button disappearing issue on Android 2.2-4.0
			domConstruct.create("style", {innerHTML:"BUTTON,INPUT[type='button'],INPUT[type='submit'],INPUT[type='reset'],INPUT[type='file']::-webkit-file-upload-button{-webkit-appearance:none;}"}, win.doc.head, "first");
		}
		if(has("mblAndroidWorkaround")){
			// add a css class to show view offscreen for android flicker workaround
			domConstruct.create("style", {innerHTML:".mblView.mblAndroidWorkaround{position:absolute;top:-9999px !important;left:-9999px !important;}"}, win.doc.head, "last");
		}

		//	You can disable hiding the address bar with the following djConfig.
		//	var djConfig = { mblHideAddressBar: false };
		var f = dm.resizeAll;
		if(config["mblHideAddressBar"] !== false &&
			navigator.appVersion.indexOf("Mobile") != -1 ||
			config["mblForceHideAddressBar"] === true){
			dm.hideAddressBar();
			if(config["mblAlwaysHideAddressBar"] === true){
				f = dm.hideAddressBar;
			}
		}
		if(has("android") && win.global.onorientationchange !== undefined){
			var _f = f;
			f = function(evt){
				var _conn = connect.connect(null, "onresize", null, function(e){
					connect.disconnect(_conn);
					_f(e);
				});
			};
		}
		connect.connect(null, win.global.onorientationchange !== undefined
			? "onorientationchange" : "onresize", null, f);
		win.body().style.visibility = "visible";
	});

	return dm;
});

},
'dojox/mobile/CarouselItem':function(){
define("dojox/mobile/CarouselItem", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(declare, domConstruct, domGeometry, domStyle, Contained, WidgetBase, iconUtils){

/*=====
	var CarouselItem = dojox.mobile.CarouselItem
=====*/

	// module:
	//		dojox/mobile/CarouselItem
	// summary:
	//		An internal widget used from Carousel.

	return declare("dojox.mobile.CarouselItem", [WidgetBase, Contained], {
		alt: "",
		src: "",
		headerText: "",
		footerText: "",

		baseClass: "mblCarouselItem",

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.tabIndex = "0";
			this.headerTextNode = domConstruct.create("div", { className: "mblCarouselItemHeaderText" }, this.domNode);
			this.imageNode = domConstruct.create("img", { className: "mblCarouselItemImage" }, this.domNode);
			this.footerTextNode = domConstruct.create("div", { className: "mblCarouselItemFooterText" }, this.domNode);
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.resize();
		},

		resize: function(size){
			var box = domGeometry.getMarginBox(this.domNode);
			if(box.h === 0){ return; }
			var h1 = domGeometry.getMarginBox(this.headerTextNode).h;
			var h2 = domGeometry.getMarginBox(this.footerTextNode).h;
			domGeometry.setMarginBox(this.imageNode, {h:box.h - h1 - h2});
		},

		select: function(){
			var img = this.imageNode
			domStyle.set(img, "opacity", 0.4);
			setTimeout(function(){
				domStyle.set(img, "opacity", 1);
			}, 1000);
		},

		_setAltAttr: function(/*String*/alt){
			this._set("alt", alt);
			this.imageNode.alt = alt;
		},

		_setSrcAttr: function(/*String*/src){
			this._set("src", src);
			this.imageNode.src = src;
		},

		_setHeaderTextAttr: function(/*String*/text){
			this._set("headerText", text);
			this.headerTextNode.innerHTML = this._cv ? this._cv(text) : text;
		},

		_setFooterTextAttr: function(/*String*/text){
			this._set("footerText", text);
			this.footerTextNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dojox/mobile/_ItemBase':function(){
define("dojox/mobile/_ItemBase", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/touch",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./TransitionEvent",
	"./iconUtils"
], function(array, declare, lang, win, domClass, touch, registry, Contained, WidgetBase, TransitionEvent, iconUtils){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
	var TransitionEvent = dojox.mobile.TransitionEvent;
=====*/

	// module:
	//		dojox/mobile/_ItemBase
	// summary:
	//		A base class for item classes (e.g. ListItem, IconItem, etc.)

	return declare("dojox.mobile._ItemBase", [WidgetBase, Contained],{
		// summary:
		//		A base class for item classes (e.g. ListItem, IconItem, etc.)
		// description:
		//		_ItemBase is a base class for widgets that have capability to
		//		make a view transition when clicked.

		// icon: String
		//		An icon image to display. The value can be either a path for an
		//		image file or a class name of a DOM button. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon: "",

		// iconPos: String
		//		The position of an aggregated icon. IconPos is comma separated
		//		values like top,left,width,height (ex. "0,0,29,29"). If iconPos
		//		is not specified, the iconPos parameter of the parent widget is
		//		used.
		iconPos: "", // top,left,width,height (ex. "0,0,29,29")

		// alt: String
		//		An alt text for the icon image.
		alt: "",

		// href: String
		//		A URL of another web page to go to.
		href: "",

		// hrefTarget: String
		//		A target that specifies where to open a page specified by
		//		href. The value will be passed to the 2nd argument of
		//		window.open().
		hrefTarget: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// scene: String
		//		The name of a scene. Used from dojox.mobile.app.
		scene: "",

		// clickable: Boolean
		//		If true, this item becomes clickable even if a transition
		//		destination (moveTo, etc.) is not specified.
		clickable: false,

		// url: String
		//		A URL of an html fragment page or JSON data that represents a
		//		new view content. The view content is loaded with XHR and
		//		inserted in the current page. Then a view transition occurs to
		//		the newly created view. The view is cached so that subsequent
		//		requests would not load the content again.
		url: "",

		// urlTarget: String
		//		Node id under which a new view will be created according to the
		//		url parameter. If not specified, The new view will be created as
		//		a sibling of the current view.
		urlTarget: "",

		// back: Boolean
		//		If true, history.back() is called when clicked.
		back: false,

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "",

		// transitionDir: Number
		//		The transition direction. If 1, transition forward. If -1,
		//		transition backward. For example, the slide transition slides
		//		the view from right to left when dir == 1, and from left to
		//		right when dir == -1.
		transitionDir: 1,

		// transitionOptions: Object
		//		A hash object that holds transition options.
		transitionOptions: null,

		// callback: Function|String
		//		A callback function that is called when the transition has been
		//		finished. A function reference, or name of a function in
		//		context.
		callback: null,

		// label: String
		//		A label of the item. If the label is not specified, innerHTML is
		//		used as a label.
		label: "",

		// toggle: Boolean
		//		If true, the item acts like a toggle button.
		toggle: false,

		// selected: Boolean
		//		If true, the item is highlighted to indicate it is selected.
		selected: false,

		// tabIndex: String
		//		Tabindex setting for the item so users can hit the tab key to
		//		focus on it.
		tabIndex: "0",
		_setTabIndexAttr: "", // sets tabIndex to domNode

		/* internal properties */	

		// paramsToInherit: String
		//		Comma separated parameters to inherit from the parent.
		paramsToInherit: "transition,icon",

		// _selStartMethod: String
		//		Specifies how the item enters the selected state.
		//		"touch": Use touch events to enter the selected state.
		//		"none": Do not change the selected state.
		_selStartMethod: "none", // touch or none

		// _selEndMethod: String
		//		Specifies how the item leaves the selected state.
		//		"touch": Use touch events to leave the selected state.
		//		"timer": Use setTimeout to leave the selected state.
		//		"none": Do not change the selected state.
		_selEndMethod: "none", // touch, timer, or none

		// _delayedSelection: Boolean
		//		If true, selection is delayed 100ms and canceled if dragged in
		//		order to avoid selection when flick operation is performed.
		_delayedSelection: false,

		// _duration: Number
		//		Duration of selection, milliseconds.
		_duration: 800,

		// _handleClick: Boolean
		//		If true, this widget listens to touch events.
		_handleClick: true,

		buildRendering: function(){
			this.inherited(arguments);
			this._isOnLine = this.inheritParams();
		},

		startup: function(){
			if(this._started){ return; }
			if(!this._isOnLine){
				this.inheritParams();
			}
			if(this._handleClick && this._selStartMethod === "touch"){
				this._onTouchStartHandle = this.connect(this.domNode, touch.press, "_onTouchStart");
			}
			this.inherited(arguments);
		},

		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
				array.forEach(this.paramsToInherit.split(/,/), function(p){
					if(p.match(/icon/i)){
						var base = p + "Base", pos = p + "Pos";
						if(this[p] && parent[base] &&
							parent[base].charAt(parent[base].length - 1) === '/'){
							this[p] = parent[base] + this[p];
						}
						if(!this[p]){ this[p] = parent[base]; }
						if(!this[pos]){ this[pos] = parent[pos]; }
					}
					if(!this[p]){ this[p] = parent[p]; }
				}, this);
			}
			return !!parent;
		},

		getTransOpts: function(){
			var opts = this.transitionOptions || {};
			array.forEach(["moveTo", "href", "hrefTarget", "url", "target",
				"urlTarget", "scene", "transition", "transitionDir"], function(p){
				opts[p] = opts[p] || this[p];
			}, this);
			return opts;
		},

		userClickAction: function(e){
			// summary:
			//		User defined click action
		},

		defaultClickAction: function(e){
			// summary:
			//		The default action of this item
			this.handleSelection(e);
			if(this.userClickAction(e) === false){ return; } // user's click action
			this.makeTransition(e);
		},

		handleSelection: function(e){
			// summary:
			//		Handles this items selection state
			if(this._onTouchEndHandle){
				this.disconnect(this._onTouchEndHandle);
				this._onTouchEndHandle = null;
			}

			var p = this.getParent();
			if(this.toggle){
				this.set("selected", !this._currentSel);
			}else if(p && p.selectOne){
				this.set("selected", true);
			}else{
				if(this._selEndMethod === "touch"){
					this.set("selected", false);
				}else if(this._selEndMethod === "timer"){
					var _this = this;
					setTimeout(function(){
						_this.set("selected", false);
					}, this._duration);
				}
			}
		},

		makeTransition: function(e){
			if(this.back && history){
				history.back();	
				return;
			}	
			if (this.href && this.hrefTarget) {
				win.global.open(this.href, this.hrefTarget || "_blank");
				this._onNewWindowOpened(e);
				return;
			}
			var opts = this.getTransOpts();
			var doTransition = 
				!!(opts.moveTo || opts.href || opts.url || opts.target || opts.scene);
			if(this._prepareForTransition(e, doTransition ? opts : null) === false){ return; }
			if(doTransition){
				this.setTransitionPos(e);
				new TransitionEvent(this.domNode, opts, e).dispatch();
			}
		},

		_onNewWindowOpened: function(e){
			// subclass may want to implement
		},

		_prepareForTransition: function(e, /*Object*/ transOpts){
			// subclass may want to implement
		},

		_onTouchStart: function(e){
			if(this.getParent().isEditing || this.onTouchStart(e) === false){ return; } // user's touchStart action
			if(!this._onTouchEndHandle && this._selStartMethod === "touch"){
				// Connect to the entire window. Otherwise, fail to receive
				// events if operation is performed outside this widget.
				// Expose both connect handlers in case the user has interest.
				this._onTouchMoveHandle = this.connect(win.body(), touch.move, "_onTouchMove"),
				this._onTouchEndHandle = this.connect(win.body(), touch.release, "_onTouchEnd")
			}
			this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
			this.touchStartY = e.touches ? e.touches[0].pageY : e.clientY;
			this._currentSel = this.selected;

			if(this._delayedSelection){
				// so as not to make selection when the user flicks on ScrollableView
				this._selTimer = setTimeout(lang.hitch(this, function(){ this.set("selected", true); }), 100);
			}else{
				this.set("selected", true);
			}
		},

		onTouchStart: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle touchStart
			// tags:
			//		callback
		},

		_onTouchMove: function(e){
			var x = e.touches ? e.touches[0].pageX : e.clientX;
			var y = e.touches ? e.touches[0].pageY : e.clientY;
			if(Math.abs(x - this.touchStartX) >= 4 ||
			   Math.abs(y - this.touchStartY) >= 4){ // dojox.mobile.scrollable#threshold
				this.cancel();
				var p = this.getParent();
				if(p && p.selectOne){
					this._prevSel && this._prevSel.set("selected", true);
				}else{
					this.set("selected", false);
				}
			}
		},

		_disconnect: function(){
			this.disconnect(this._onTouchMoveHandle);
			this.disconnect(this._onTouchEndHandle);
			this._onTouchMoveHandle = this._onTouchEndHandle = null;
		},

		cancel: function(){
			if(this._selTimer){
				clearTimeout(this._selTimer);
				this._selTimer = null;
			}
			this._disconnect();
		},

		_onTouchEnd: function(e){
			if(!this._selTimer && this._delayedSelection){ return; }
			this.cancel();
			this._onClick(e);
		},

		setTransitionPos: function(e){
			// summary:
			//		Stores the clicked position for later use.
			// description:
			//		Some of the transition animations (e.g. ScaleIn) needs the
			//		clicked position.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w || domClass.contains(w.domNode, "mblView")){ break; }
			}
			if(w){
				w.clickedPosX = e.clientX;
				w.clickedPosY = e.clientY;
			}
		},

		transitionTo: function(/*String|Object*/moveTo, href, url, scene){
			// summary:
			//		Performs a view transition.
			// description:
			//		Given a transition destination, this method performs a view
			//		transition. This method is typically called when this item
			//		is clicked.
			var opts = (moveTo && typeof(moveTo) === "object") ? moveTo :
				{moveTo: moveTo, href: href, url: url, scene: scene,
				 transition: this.transition, transitionDir: this.transitionDir};
			new TransitionEvent(this.domNode, opts).dispatch();
		},

		_setIconAttr: function(icon){
			if(!this._isOnLine){ return; } // icon may be invalid because inheritParams is not called yet
			this._set("icon", icon);
			this.iconNode = iconUtils.setIcon(icon, this.iconPos, this.iconNode, this.alt, this.iconParentNode, this.refNode, this.position);
		},

		_setLabelAttr: function(/*String*/text){
			this._set("label", text);
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			// description:
			//		Subclass should override.
			if(selected){
				var p = this.getParent();
				if(p && p.selectOne){
					// deselect the currently selected item
					var arr = array.filter(p.getChildren(), function(w){
						return w.selected;
					});
					array.forEach(arr, function(c){
						this._prevSel = c;
						c.set("selected", false);
					}, this);
				}
			}
			this._set("selected", selected);
		}
	});
});

},
'dojox/mobile/Overlay':function(){
define("dojox/mobile/Overlay", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/window",
	"dijit/_WidgetBase",
	"dojo/_base/array",
	"dijit/registry"
], function(declare, lang, has, win, domClass, domGeometry, domStyle, windowUtils, WidgetBase, array, registry){

	/*=====
		WidgetBase = dijit._WidgetBase;
	=====*/
	return declare("dojox.mobile.Overlay", WidgetBase, {
		// summary:
		//		A non-templated widget that animates up from the bottom, overlaying the current content
		//

		baseClass: "mblOverlay mblOverlayHidden",

		_reposition: function(){
			// summary:
			//		Position the overlay at the bottom
			var popupPos = domGeometry.position(this.domNode);
			var vp = windowUtils.getBox();
			if((popupPos.y+popupPos.h) != vp.h // TODO: should be a has() test for position:fixed not scrolling
				|| (domStyle.get(this.domNode, 'position') != 'absolute' && has("android") < 3)){ // android 2.x supports position:fixed but child transforms don't persist
				popupPos.y = vp.t + vp.h - popupPos.h;
				domStyle.set(this.domNode, { position: "absolute", top: popupPos.y + "px", bottom: "auto" });
			}
			return popupPos;
		},

		show: function(/*DomNode?*/aroundNode){
			// summary:
			//		Scroll the overlay up into view
			array.forEach(registry.findWidgets(this.domNode), function(w){
				if(w && w.height == "auto" && typeof w.resize == "function"){
					w.resize();
				}
			});
			var popupPos = this._reposition();
			if(aroundNode){
				var aroundPos = domGeometry.position(aroundNode);
				if(popupPos.y < aroundPos.y){ // if the aroundNode is under the popup, try to scroll it up
					win.global.scrollBy(0, aroundPos.y + aroundPos.h - popupPos.y);
					this._reposition();
				}
			}
			var _domNode = this.domNode;
			domClass.replace(_domNode, ["mblCoverv", "mblIn"], ["mblOverlayHidden", "mblRevealv", "mblOut", "mblReverse", "mblTransition"]);
			setTimeout(lang.hitch(this, function(){
				var handler = this.connect(_domNode, "webkitTransitionEnd", function(){
					this.disconnect(handler);
					domClass.remove(_domNode, ["mblCoverv", "mblIn", "mblTransition"]);
					this._reposition();
				});
				domClass.add(_domNode, "mblTransition");
			}), 100);
			var skipReposition = false;

			this._moveHandle = this.connect(win.doc.documentElement, has("touch") ? "ontouchmove" : "onmousemove",
				function(){
					skipReposition = true;
				}
			);
			this._repositionTimer = setInterval(lang.hitch(this, function(){
				if(skipReposition){ // don't reposition if busy
					skipReposition = false;
					return;
				}
				this._reposition();
			}), 50); // yield a short time to allow for consolidation for better CPU throughput
			return popupPos;
		},

		hide: function(){
			// summary:
			//		Scroll the overlay down and then make it invisible
			var _domNode = this.domNode;
			if(this._moveHandle){
				this.disconnect(this._moveHandle);
				this._moveHandle = null;
				clearInterval(this._repositionTimer);
				this._repositionTimer = null;
			}
			if(has("webkit")){
				domClass.replace(_domNode, ["mblRevealv", "mblOut", "mblReverse"], ["mblCoverv", "mblIn", "mblOverlayHidden", "mblTransition"]);
				setTimeout(lang.hitch(this, function(){
					var handler = this.connect(_domNode, "webkitTransitionEnd", function(){
						this.disconnect(handler);
						domClass.replace(_domNode, ["mblOverlayHidden"], ["mblRevealv", "mblOut", "mblReverse", "mblTransition"]);
					});
					domClass.add(_domNode, "mblTransition");
				}), 100);
			}else{
				domClass.replace(_domNode, ["mblOverlayHidden"], ["mblCoverv", "mblIn", "mblRevealv", "mblOut", "mblReverse"]);
			}
		},

		onBlur: function(/*Event*/e){
			return false; // touching outside the overlay area does not call hide()
		}
	});
});

},
'dojox/mobile/IconMenuItem':function(){
define("dojox/mobile/IconMenuItem", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./iconUtils",
	"./_ItemBase"
], function(declare, lang, domClass, domConstruct, iconUtils, ItemBase){
	// module:
	//		dojox/mobile/IconMenuItem
	// summary:
	//		An item of IconMenu.

	return declare("dojox.mobile.IconMenuItem", ItemBase, { 
		selColor: "mblIconMenuItemSel",
		closeOnAction: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		baseClass: "mblIconMenuItem",

		_selStartMethod: "touch",
		_selEndMethod: "touch",

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
			if(this.selected){
				domClass.add(this.domNode, this.selColor);
			}

			if(this.srcNodeRef){
				if(!this.label){
					this.label = lang.trim(this.srcNodeRef.innerHTML);
				}
				this.srcNodeRef.innerHTML = "";
			}

			var a = this.anchorNode = this.containerNode = domConstruct.create("a", {
				className: "mblIconMenuItemAnchor",
				href: "javascript:void(0)"
			});
			var tbl = domConstruct.create("table", {
				className: "mblIconMenuItemTable"
			}, a);
			var cell = this.iconParentNode = tbl.insertRow(-1).insertCell(-1);
			this.iconNode = domConstruct.create("div", {
				className: "mblIconMenuItemIcon"
			}, cell);
			this.labelNode = this.refNode = domConstruct.create("div", {
				className: "mblIconMenuItemLabel"
			}, cell);
			this.position = "before";
			this.domNode.appendChild(a);
		},

		startup: function(){
			if(this._started){ return; }

			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick"); // for desktop browsers

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				this.set("icon", this.icon); // retry applying the attribute
			}
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			if(this.closeOnAction){
				var p = this.getParent(); // maybe SimpleDialog
				if(p && p.hide){
					p.hide();
				}
			}
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domClass.toggle(this.domNode, this.selColor, selected);
		}
	});
});

},
'dojox/mobile/EdgeToEdgeList':function(){
define("dojox/mobile/EdgeToEdgeList", [
	"dojo/_base/declare",
	"./RoundRectList"
], function(declare, RoundRectList){

/*=====
	var RoundRectList = dojox.mobile.RoundRectList;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeCategory
	// summary:
	//		An edge-to-edge layout list.

	return declare("dojox.mobile.EdgeToEdgeList", RoundRectList, {
		// summary:
		//		An edge-to-edge layout list.
		// description:
		//		EdgeToEdgeList is an edge-to-edge layout list, which displays
		//		all items in equally sized rows. Each item must be
		//		dojox.mobile.ListItem.

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblEdgeToEdgeList";
		}
	});
});

},
'dojox/mobile/_StoreMixin':function(){
define("dojox/mobile/_StoreMixin", [
	"dojo/_base/Deferred",
	"dojo/_base/declare"
], function(Deferred, declare){

	// module:
	//		dojox/mobile/_StoreMixin
	// summary:
	//		Mixin for widgets to enable dojo.data data store.

	return declare("dojox.mobile._StoreMixin", null, {
		// summary:
		//		Mixin for widgets to enable dojo.store data store.
		// description:
		//		By mixing this class into a widget, it can get data through a
		//		dojo.store data store. The widget must implement
		//		onComplete(/*Array*/items) to handle the retrieved data.

		// store: Object
		//		Reference to data provider object
		store: null,

		// query: Object
		//		A query that can be passed to 'store' to initially filter the
		//		items.
		query: null,

		// queryOptions: Object
		//		An optional parameter for the query.
		queryOptions: null,

		// labelProperty: String
		//		A property name (a property in the dojo.store item) that specifies that item's label
		labelProperty: "label",

		// childrenProperty: String
		//		A property name (a property in the dojo.store item) that specifies that item's children
		childrenProperty: "children",

		setStore: function(store, query, queryOptions){
			// summary:
			//		Sets the store to use with this widget.
			if(store === this.store){ return null; }
			if(store){
				store.getValue = function(item, property){
					return item[property];
				};
			}
			this.store = store;
			this._setQuery(query, queryOptions);
			return this.refresh();
		},

		setQuery: function(query, queryOptions){
			this._setQuery(query, queryOptions);
			return this.refresh();
		},

		_setQuery: function(query, queryOptions){
			this.query = query;
			this.queryOptions = queryOptions || this.queryOptions;
		},

		refresh: function(){
			// summary:
			//		Fetches the data and generates the list items.
			if(!this.store){ return null; }
			var _this = this;
			var promise = this.store.query(this.query, this.queryOptions);
			Deferred.when(promise, function(results){
				if(results.items){
					results = results.items; // looks like dojo.data style items array
				}
				if(promise.observe){
					promise.observe(function(object, removedFrom, insertedInto){
						if(removedFrom > -1){ // existing object removed
							_this.onDelete(object, removedFrom);
						}else if(insertedInto > -1){ // new or updated object inserted
							_this.onUpdate(object, insertedInto);
						}
					});
				}
				_this.onComplete(results);
			}, function(error){
				_this.onError(error);
			});
			return promise;
		}

/*
		// Subclass MUST implement the following methods.

		onComplete: function(items){
			// summary:
			//		An handler that is called after the fetch completes.
		},

		onError: function(errorData){
			// summary:
			//		An error handler.
		},

		onUpdate: function(item, insertedInto){
			//	summary:
			//		Add a new item or update an existing item.
		},

		onDelete: function(item, removedFrom){
			//	summary:
			//		Delete an existing item.
		}
*/
	});
});

},
'dojox/mobile/_base':function(){
define("dojox/mobile/_base", [
	"./common",
	"./View",
	"./Heading",
	"./RoundRect",
	"./RoundRectCategory",
	"./EdgeToEdgeCategory",
	"./RoundRectList",
	"./EdgeToEdgeList",
	"./ListItem",
	"./Container",
	"./Pane",
	"./Switch",
	"./ToolBarButton",
	"./ProgressIndicator"
], function(common, View, Heading, RoundRect, RoundRectCategory, EdgeToEdgeCategory, RoundRectList, EdgeToEdgeList, ListItem, Switch, ToolBarButton, ProgressIndicator){
	// module:
	//		dojox/mobile/_base
	// summary:
	//		Includes the basic dojox.mobile modules

	return common;
});

},
'dojox/mobile/PageIndicator':function(){
define("dojox/mobile/PageIndicator", [
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(connect, declare, dom, domClass, domConstruct, registry, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/PageIndicator
	// summary:
	//		A current page indicator.

	return declare("dojox.mobile.PageIndicator", [WidgetBase, Contained],{
		// summary:
		//		A current page indicator.
		// description:
		//		PageIndicator displays a series of gray and white dots to
		//		indicate which page is currently being viewed. It can typically
		//		be used with dojox.mobile.SwapView. It is also internally used
		//		in dojox.mobile.Carousel.

		// refId: String
		//		An ID of a DOM node to be searched. Siblings of the reference
		//		node will be searched for views. If not specified, this.domNode
		//		will be the reference node.
		refId: "",

		baseClass: "mblPageIndicator",

		buildRendering: function(){
			this.inherited(arguments);
			this._tblNode = domConstruct.create("table", {className:"mblPageIndicatorContainer"}, this.domNode);
			this._tblNode.insertRow(-1);
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			this.subscribe("/dojox/mobile/viewChanged", function(view){
				this.reset();
			});
		},

		startup: function(){
			var _this = this;
			setTimeout(function(){ // to wait until views' visibility is determined
				_this.reset();
			}, 0);
		},

		reset: function(){
			// summary:
			//		Updates the indicator.
			var r = this._tblNode.rows[0];
			var i, c, a = [], dot;
			var refNode = (this.refId && dom.byId(this.refId)) || this.domNode;
			var children = refNode.parentNode.childNodes;
			for(i = 0; i < children.length; i++){
				c = children[i];
				if(this.isView(c)){
					a.push(c);
				}
			}
			if(r.cells.length !== a.length){
				domConstruct.empty(r);
				for(i = 0; i < a.length; i++){
					c = a[i];
					dot = domConstruct.create("div", {className:"mblPageIndicatorDot"});
					r.insertCell(-1).appendChild(dot);
				}
			}
			if(a.length === 0){ return; }
			var currentView = registry.byNode(a[0]).getShowingView();
			for(i = 0; i < r.cells.length; i++){
				dot = r.cells[i].firstChild;
				if(a[i] === currentView.domNode){
					domClass.add(dot, "mblPageIndicatorDotSelected");
				}else{
					domClass.remove(dot, "mblPageIndicatorDotSelected");
				}
			}
		},

		isView: function(node){
			// summary:
			//		Returns true if the given node is a view.
			return (node && node.nodeType === 1 && domClass.contains(node, "mblView"));
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e.target !== this.domNode){ return; }
			if(e.layerX < this._tblNode.offsetLeft){
				connect.publish("/dojox/mobile/prevPage", [this]);
			}else if(e.layerX > this._tblNode.offsetLeft + this._tblNode.offsetWidth){
				connect.publish("/dojox/mobile/nextPage", [this]);
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		}
	});
});

},
'dojox/mobile/dh/HtmlScriptContentHandler':function(){
define("dojox/mobile/dh/HtmlScriptContentHandler", [
	"dojo/_base/declare",
	"./HtmlContentHandler",
	"../_ExecScriptMixin"
], function(declare, HtmlContentHandler, _ExecScriptMixin){

	return declare("dojox.mobile.dh.HtmlScriptContentHandler", [HtmlContentHandler, _ExecScriptMixin], {
		// summary:
		//		An html content handler that has script execution capability.
	});
});

},
'dojox/mobile/DataCarousel':function(){
define("dojox/mobile/DataCarousel", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"./Carousel",
	"./_DataMixin"
], function(kernel, declare, Carousel, DataMixin){

	// module:
	//		dojox/mobile/DataCarousel
	// summary:
	//		A dojo.data enabled Carousel.

	kernel.deprecated("dojox.mobile.DataCarousel is deprecated", "Use dojox.mobile.StoreCarousel instead", 2.0);
	return declare("dojox.mobile.DataCarousel", [Carousel, DataMixin], {
		// summary:
		//		A dojo.data enabled Carousel.
		// description:
		//		DataCarousel is an enhanced version of dojox.mobile.Carousel. It
		//		can generate contents according to the given dojo.data store.
	});
});

},
'dojox/mobile/ProgressIndicator':function(){
define("dojox/mobile/ProgressIndicator", [
	"dojo/_base/config",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/has",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(config, declare, lang, domClass, domConstruct, domGeometry, domStyle, has, Contained, WidgetBase){

	// module:
	//		dojox/mobile/ProgressIndicator
	// summary:
	//		A progress indication widget.

	var cls = declare("dojox.mobile.ProgressIndicator", [WidgetBase, Contained], {
		// summary:
		//		A progress indication widget.
		// description:
		//		ProgressIndicator is a round spinning graphical representation
		//		that indicates the current task is on-going.

		// interval: Number
		//		The time interval in milliseconds for updating the spinning
		//		indicator.
		interval: 100,

		// size: Number
		//		The size of the indicator in pixels.
		size: 40,

		// removeOnStop: Boolean
		//		If true, this widget is removed from the parent node
		//		when stop() is called.
		removeOnStop: true,

		// startSpinning: Boolean
		//		If true, call start() to run the indicator at startup.
		startSpinning: false,

		// center: Boolean
		//		If true, the indicator is displayed as center aligned.
		center: true,

		// colors: Array
		//		An array of indicator colors. 12 colors have to be given.
		//		If colors are not specified, css styles
		//		(mblProg0Color - mblProg11Color) are used.
		colors: null,

		baseClass: "mblProgressIndicator",

		constructor: function(){
			this.colors = [];
			this._bars = [];
		},

		buildRendering: function(){
			this.inherited(arguments);
			if(this.center){
				domClass.add(this.domNode, "mblProgressIndicatorCenter");
			}
			this.containerNode = domConstruct.create("div", {className:"mblProgContainer"}, this.domNode);
			this.spinnerNode = domConstruct.create("div", null, this.containerNode);
			for(var i = 0; i < 12; i++){
				var div = domConstruct.create("div", {className:"mblProg mblProg"+i}, this.spinnerNode);
				this._bars.push(div);
			}
			this.scale(this.size);
			if(this.startSpinning){
				this.start();
			}
		},

		scale: function(/*Number*/size){
			var scale = size / 40;
			domStyle.set(this.containerNode, {
				webkitTransform: "scale(" + scale + ")",
				webkitTransformOrigin: "0 0"
			});
			domGeometry.setMarginBox(this.domNode, {w:size, h:size});
			domGeometry.setMarginBox(this.containerNode, {w:size / scale, h:size / scale});
		},

		start: function(){
			// summary:
			//		Starts the ProgressIndicator spinning.
			if(this.imageNode){
				var img = this.imageNode;
				var l = Math.round((this.containerNode.offsetWidth - img.offsetWidth) / 2);
				var t = Math.round((this.containerNode.offsetHeight - img.offsetHeight) / 2);
				img.style.margin = t+"px "+l+"px";
				return;
			}
			var cntr = 0;
			var _this = this;
			var n = 12;
			this.timer = setInterval(function(){
				cntr--;
				cntr = cntr < 0 ? n - 1 : cntr;
				var c = _this.colors;
				for(var i = 0; i < n; i++){
					var idx = (cntr + i) % n;
					if(c[idx]){
						_this._bars[i].style.backgroundColor = c[idx];
					}else{
						domClass.replace(_this._bars[i],
										 "mblProg" + idx + "Color",
										 "mblProg" + (idx === n - 1 ? 0 : idx + 1) + "Color");
					}
				}
			}, this.interval);
		},

		stop: function(){
			// summary:
			//		Stops the ProgressIndicator spinning.
			if(this.timer){
				clearInterval(this.timer);
			}
			this.timer = null;
			if(this.removeOnStop && this.domNode && this.domNode.parentNode){
				this.domNode.parentNode.removeChild(this.domNode);
			}
		},

		setImage: function(/*String*/file){
			// summary:
			//		Sets an indicator icon image file (typically animated GIF).
			//		If null is specified, restores the default spinner.
			if(file){
				this.imageNode = domConstruct.create("img", {src:file}, this.containerNode);
				this.spinnerNode.style.display = "none";
			}else{
				if(this.imageNode){
					this.containerNode.removeChild(this.imageNode);
					this.imageNode = null;
				}
				this.spinnerNode.style.display = "";
			}
		}
	});

	cls._instance = null;
	cls.getInstance = function(props){
		if(!cls._instance){
			cls._instance = new cls(props);
		}
		return cls._instance;
	};

	return cls;
});

},
'dojox/mobile/lazyLoadUtils':function(){
define("dojox/mobile/lazyLoadUtils", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/window",
	"dojo/_base/Deferred",
	"dojo/ready"
], function(dojo, array, config, win, Deferred, ready){

	// module:
	//		dojox/mobile/lazyLoadUtils
	// summary:
	//		Utilities to lazy-load dojo widgets.

	var lazyLoadUtils = new function(){
		this._lazyNodes = [];
		var _this = this;
		if(config.parseOnLoad){
			ready(90, function(){
				var lazyNodes = array.filter(win.body().getElementsByTagName("*"), // avoid use of dojo.query
					function(n){ return n.getAttribute("lazy") === "true" || (n.getAttribute("data-dojo-props")||"").match(/lazy\s*:\s*true/); });
				var i, j, nodes, s, n;
				for(i = 0; i < lazyNodes.length; i++){
					array.forEach(["dojoType", "data-dojo-type"], function(a){
						nodes = array.filter(lazyNodes[i].getElementsByTagName("*"),
											function(n){ return n.getAttribute(a); });
						for(j = 0; j < nodes.length; j++){
							n = nodes[j];
							n.setAttribute("__" + a, n.getAttribute(a));
							n.removeAttribute(a);
							_this._lazyNodes.push(n);
						}
					});
				}
			});
		}

		ready(function(){
			for(var i = 0; i < _this._lazyNodes.length; i++){ /* 1.8 */
				var n = _this._lazyNodes[i];
				array.forEach(["dojoType", "data-dojo-type"], function(a){
					if(n.getAttribute("__" + a)){
						n.setAttribute(a, n.getAttribute("__" + a));
						n.removeAttribute("__" + a);
					}
				});
			}
			delete _this._lazyNodes;

		});

		this.instantiateLazyWidgets = function(root, requires, callback){
			// summary:
			//		Instantiate dojo widgets under the root node.
			// description:
			//		Find dom nodes that have the dojoType or data-dojo-type attributes,
			//		require the found dojo modules, and run the parser.
			var d = new Deferred();
			var req = requires ? requires.split(/,/) : [];
			var nodes = root.getElementsByTagName("*"); // avoid use of dojo.query
			var len = nodes.length;
			for(var i = 0; i < len; i++){
				var s = nodes[i].getAttribute("dojoType") || nodes[i].getAttribute("data-dojo-type");
				if(s){
					req.push(s);
					var m = nodes[i].getAttribute("data-dojo-mixins"),
						mixins = m ? m.split(/, */) : [];
					req = req.concat(mixins);
				}
			}
			if(req.length === 0){ return true; }

			if(dojo.require){
				array.forEach(req, function(c){
					dojo["require"](c);
				});
				dojo.parser.parse(root);
				if(callback){ callback(root); }
				return true;
			}else{
				req = array.map(req, function(s){ return s.replace(/\./g, "/"); });
				require(req, function(){
					dojo.parser.parse(root);
					if(callback){ callback(root); }
					d.resolve(true);
				});
			}
			return d;
		}	
	};
	return lazyLoadUtils;
});


},
'dojox/mobile/Pane':function(){
define("dojox/mobile/Pane", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(array, declare, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Pane
	// summary:
	//		A simple div-wrapper pane widget.

	return declare("dojox.mobile.Pane", [WidgetBase, Contained], {
		// summary:
		//		A simple pane widget.
		// description:
		//		Pane is a simple pane widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblPane",

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// set containerNode so that getChildren() works
				this.containerNode = this.domNode;
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});

},
'dojox/mobile/sniff':function(){
define("dojox/mobile/sniff", [
	"dojo/_base/window",
	"dojo/_base/sniff"
], function(win, has){

	var ua = navigator.userAgent;

	// BlackBerry (OS 6 or later only)
	has.add("bb", ua.indexOf("BlackBerry") >= 0 && parseFloat(ua.split("Version/")[1]) || undefined, undefined, true);

	// Android
	has.add("android", parseFloat(ua.split("Android ")[1]) || undefined, undefined, true);

	// iPhone, iPod, or iPad
	// If iPod or iPad is detected, in addition to has("ipod") or has("ipad"),
	// has("iphone") will also have iOS version number.
	if(ua.match(/(iPhone|iPod|iPad)/)){
		var p = RegExp.$1.replace(/P/, 'p');
		var v = ua.match(/OS ([\d_]+)/) ? RegExp.$1 : "1";
		var os = parseFloat(v.replace(/_/, '.').replace(/_/g, ''));
		has.add(p, os, undefined, true);
		has.add("iphone", os, undefined, true);
	}

	if(has("webkit")){
		has.add("touch", (typeof win.doc.documentElement.ontouchstart != "undefined" &&
			navigator.appVersion.indexOf("Mobile") != -1) || !!has("android"), undefined, true);
	}

	return has;
});

},
'dojox/mobile/SwapView':function(){
define("dojox/mobile/SwapView", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/dom-class",
	"dijit/registry",	// registry.byNode
	"./View",
	"./_ScrollableMixin",
	"./sniff"
], function(array, connect, declare, dom, domClass, registry, View, ScrollableMixin, has){

/*=====
	var View = dojox.mobile.View;
	var ScrollableMixin = dojox.mobile._ScrollableMixin;
=====*/

	// module:
	//		dojox/mobile/SwapView
	// summary:
	//		A container that can be flipped horizontally.

	return declare("dojox.mobile.SwapView", [View, ScrollableMixin], {
		// summary:
		//		A container that can be flipped horizontally.
		// description:
		//		SwapView is a container widget that represents entire mobile
		//		device screen, and can be swiped horizontally. (In dojo-1.6, it
		//		was called 'FlippableView'.) SwapView is a subclass of
		//		dojox.mobile.View. SwapView allows the user to swipe the screen
		//		left or right to move between the views. When SwapView is
		//		swiped, it finds an adjacent SwapView to open it.

		/* internal properties */	
		scrollDir: "f",
		weight: 1.2,

		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode, "mblSwapView");
			this.setSelectable(this.domNode, false);
			this.containerNode = this.domNode;
			this.subscribe("/dojox/mobile/nextPage", "handleNextPage");
			this.subscribe("/dojox/mobile/prevPage", "handlePrevPage");
			this.noResize = true; // not to call resize() from scrollable#init
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.inherited(arguments); // scrollable#resize() will be called
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onTouchStart: function(e){
			// summary:
			//		Internal function to handle touchStart events.
			var fromTop = this.domNode.offsetTop;
			var nextView = this.nextView(this.domNode);
			if(nextView){
				nextView.stopAnimation();
				domClass.add(nextView.domNode, "mblIn");
				// Temporarily add padding to align with the fromNode while transition
				nextView.containerNode.style.paddingTop = fromTop + "px";
			}
			var prevView = this.previousView(this.domNode);
			if(prevView){
				prevView.stopAnimation();
				domClass.add(prevView.domNode, "mblIn");
				// Temporarily add padding to align with the fromNode while transition
				prevView.containerNode.style.paddingTop = fromTop + "px";
			}
			this.inherited(arguments);
		},

		handleNextPage: function(/*Widget*/w){
			// summary:
			//		Called when the "/dojox/mobile/nextPage" topic is published.
			var refNode = w.refId && dom.byId(w.refId) || w.domNode;
			if(this.domNode.parentNode !== refNode.parentNode){ return; }
			if(this.getShowingView() !== this){ return; }
			this.goTo(1);
		},

		handlePrevPage: function(/*Widget*/w){
			// summary:
			//		Called when the "/dojox/mobile/prevPage" topic is published.
			var refNode = w.refId && dom.byId(w.refId) || w.domNode;
			if(this.domNode.parentNode !== refNode.parentNode){ return; }
			if(this.getShowingView() !== this){ return; }
			this.goTo(-1);
		},

		goTo: function(/*Number*/dir, /*String?*/moveTo){
			// summary:
			//		Moves to the next or previous view.
			var view = moveTo ? registry.byId(moveTo) :
				((dir == 1) ? this.nextView(this.domNode) : this.previousView(this.domNode));
			if(view && view !== this){
				this.stopAnimation(); // clean-up animation states
				view.stopAnimation();
				this.domNode._isShowing = false; // update isShowing flag
				view.domNode._isShowing = true;
				this.performTransition(view.id, dir, "slide", null, function(){
					connect.publish("/dojox/mobile/viewChanged", [view]);
				});
			}
		},

		isSwapView: function(node){
			// summary:
			//		Returns true if the given node is a SwapView widget.
			return (node && node.nodeType === 1 && domClass.contains(node, "mblSwapView"));
		},

		nextView: function(node){
			// summary:
			//		Returns the next view.
			for(var n = node.nextSibling; n; n = n.nextSibling){
				if(this.isSwapView(n)){ return registry.byNode(n); }
			}
			return null;
		},

		previousView: function(node){
			// summary:
			//		Returns the previous view.
			for(var n = node.previousSibling; n; n = n.previousSibling){
				if(this.isSwapView(n)){ return registry.byNode(n); }
			}
			return null;
		},

		scrollTo: function(/*Object*/to){
			// summary:
			//		Overrides dojox.mobile.scrollable.scrollTo().
			if(!this._beingFlipped){
				var newView, x;
				if(to.x < 0){
					newView = this.nextView(this.domNode);
					x = to.x + this.domNode.offsetWidth;
				}else{
					newView = this.previousView(this.domNode);
					x = to.x - this.domNode.offsetWidth;
				}
				if(newView){
					if(newView.domNode.style.display === "none"){
						newView.domNode.style.display = "";
						newView.resize();
					}
					newView._beingFlipped = true;
					newView.scrollTo({x:x});
					newView._beingFlipped = false;
				}
			}
			this.inherited(arguments);
		},

		slideTo: function(/*Object*/to, /*Number*/duration, /*String*/easing, fake_pos){
			// summary:
			//		Overrides dojox.mobile.scrollable.slideTo().
			if(!this._beingFlipped){
				var w = this.domNode.offsetWidth;
				var pos = fake_pos || this.getPos();
				var newView, newX;
				if(pos.x < 0){ // moving to left
					newView = this.nextView(this.domNode);
					if(pos.x < -w/4){ // slide to next
						if(newView){
							to.x = -w;
							newX = 0;
						}
					}else{ // go back
						if(newView){
							newX = w;
						}
					}
				}else{ // moving to right
					newView = this.previousView(this.domNode);
					if(pos.x > w/4){ // slide to previous
						if(newView){
							to.x = w;
							newX = 0;
						}
					}else{ // go back
						if(newView){
							newX = -w;
						}
					}
				}

				if(newView){
					newView._beingFlipped = true;
					newView.slideTo({x:newX}, duration, easing);
					newView._beingFlipped = false;

					if(newX === 0){ // moving to another view
						dojox.mobile.currentView = newView;
					}
					newView.domNode._isShowing = (newView && newX === 0);
				}
				this.domNode._isShowing = !(newView && newX === 0);
			}
			this.inherited(arguments);
		},

		onAnimationEnd: function(e){
			// summary:
			//		Overrides dojox.mobile.View.onAnimationEnd().
			if(e && e.target && domClass.contains(e.target, "mblScrollableScrollTo2")){ return; }
			this.inherited(arguments);
		},

		onFlickAnimationEnd: function(e){
			// summary:
			//		Overrides dojox.mobile.scrollable.onFlickAnimationEnd().
			if(e && e.target && !domClass.contains(e.target, "mblScrollableScrollTo2")){ return; }
			this.inherited(arguments);

			if(this.domNode._isShowing){
				// Hide all the views other than the currently showing one.
				// Otherwise, when the orientation is changed, other views
				// may appear unexpectedly.
				array.forEach(this.domNode.parentNode.childNodes, function(c){
					if(this.isSwapView(c)){
						domClass.remove(c, "mblIn");
						if(!c._isShowing){
							c.style.display = "none";
							c.style.webkitTransform = "";
							c.style.left = "0px"; // top/left mode needs this
						}
					}
				}, this);
				connect.publish("/dojox/mobile/viewChanged", [this]);
				// Reset the temporary padding
				this.containerNode.style.paddingTop = "";
			}else if(!has("webkit")){
				this.containerNode.style.left = "0px"; // compat mode needs this
			}
		}
	});
});

},
'dojox/mobile/EdgeToEdgeCategory':function(){
define("dojox/mobile/EdgeToEdgeCategory", [
	"dojo/_base/declare",
	"./RoundRectCategory"
], function(declare, RoundRectCategory){

/*=====
	var RoundRectCategory = dojox.mobile.RoundRectCategory;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeCategory
	// summary:
	//		A category header for an edge-to-edge list.

	return declare("dojox.mobile.EdgeToEdgeCategory", RoundRectCategory, {
		// summary:
		//		A category header for an edge-to-edge list.
		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblEdgeToEdgeCategory";
		}
	});
});

},
'dojox/mobile/SpinWheel':function(){
define("dojox/mobile/SpinWheel", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"./_PickerBase",
	"./SpinWheelSlot" // to load SpinWheelSlot for you (no direct references)
], function(declare, domConstruct, PickerBase){

	// module:
	//		dojox/mobile/SpinWheel
	// summary:
	//		A value picker widget that has spin wheels.

	return declare("dojox.mobile.SpinWheel", PickerBase, {
		// summary:
		//		A value picker widget that has spin wheels.
		// description:
		//		SpinWheel is a value picker component. It is a sectioned wheel
		//		that can be used to pick up some values from the wheel slots by
		//		spinning them.

		/* internal properties */	
		baseClass: "mblSpinWheel",

		buildRendering: function(){
			this.inherited(arguments);
			domConstruct.create("div", {className: "mblSpinWheelBar"}, this.domNode);
		},

		startup: function(){
			if(this._started){ return; }
			this.centerPos = Math.round(this.domNode.offsetHeight / 2);
			this.inherited(arguments);
		}
	});
});

},
'dojox/mobile/IconMenu':function(){
define("dojox/mobile/IconMenu", [
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./IconMenuItem"
], function(declare, has, domClass, domConstruct, domStyle, Contained, Container, WidgetBase){
	// module:
	//		dojox/mobile/IconMenu
	// summary:
	//		TODOC

	return declare("dojox.mobile.IconMenu", [WidgetBase, Container, Contained], {
		transition: "slide",
		iconBase: "",
		iconPos: "",
		cols: 3,
		childItemClass: "mblIconMenuItem",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		selectOne: false,
		baseClass: "mblIconMenu",

		_createTerminator: false,

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);

			if(this._createTerminator){
				var t = this._terminator = domConstruct.create("br");
				t.className = this.childItemClass + "Terminator";
				this.domNode.appendChild(t);
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.refresh();
			this.inherited(arguments);
		},

		refresh: function(){
			var p = this.getParent();
			if(p){
				domClass.remove(p.domNode, "mblSimpleDialogDecoration");
			}
			var children = this.getChildren();
			if(this.cols){
				var nRows = Math.ceil(children.length / this.cols);
				var w = Math.floor(100/this.cols);
				var _w = 100 - w*this.cols;
				var h = Math.floor(100 / nRows);
				var _h = 100 - h*nRows;
				if(has("ie")){
					_w--;
					_h--;
				}
			}
			for(var i = 0; i < children.length; i++){
				var item = children[i];
				if(this.cols){
					var first = ((i % this.cols) === 0); // first column
					var last = (((i + 1) % this.cols) === 0); // last column
					var rowIdx = Math.floor(i / this.cols);
					domStyle.set(item.domNode, {
						width: w + (last ? _w : 0) + "%",
						height: h + ((rowIdx + 1 === nRows) ? _h : 0) + "%"
					});
					domClass.toggle(item.domNode, this.childItemClass + "FirstColumn", first);
					domClass.toggle(item.domNode, this.childItemClass + "LastColumn", last);
					domClass.toggle(item.domNode, this.childItemClass + "FirstRow", rowIdx === 0);
					domClass.toggle(item.domNode, this.childItemClass + "LastRow", rowIdx + 1 === nRows);
				}
			};
		},

		addChild: function(widget, /*Number?*/insertIndex){
			this.inherited(arguments);
			this.refresh();
		},

		hide: function(){
			var p = this.getParent();
			if(p && p.hide){
				p.hide();
			}
		}
	});
});

},
'dojox/mobile/View':function(){
define("dojox/mobile/View", [
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/_base/Deferred",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./ViewController", // to load ViewController for you (no direct references)
	"./common",
	"./transition",
	"./viewRegistry"
], function(array, config, connect, declare, lang, has, win, Deferred, dom, domClass, domConstruct, domGeometry, domStyle, registry, Contained, WidgetBase, ViewController, common, transitDeferred, viewRegistry){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
	var ViewController = dojox.mobile.ViewController;
=====*/

	// module:
	//		dojox/mobile/View
	// summary:
	//		A widget that represents a view that occupies the full screen

	var dm = lang.getObject("dojox.mobile", true);

	return declare("dojox.mobile.View", [WidgetBase, Contained], {
		// summary:
		//		A widget that represents a view that occupies the full screen
		// description:
		//		View acts as a container for any HTML and/or widgets. An entire
		//		HTML page can have multiple View widgets and the user can
		//		navigate through the views back and forth without page
		//		transitions.

		// selected: Boolean
		//		If true, the view is displayed at startup time.
		selected: false,

		// keepScrollPos: Boolean
		//		If true, the scroll position is kept between views.
		keepScrollPos: true,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "div",

		/* internal properties */
		baseClass: "mblView",

		constructor: function(params, node){
			if(node){
				dom.byId(node).style.visibility = "hidden";
			}
		},

		destroy: function(){
			viewRegistry.remove(this.id);
			this.inherited(arguments);
		},

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);

			this._animEndHandle = this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this._animStartHandle = this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
				this._transEndHandle = this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			if(has("mblAndroid3Workaround")){
				// workaround for the screen flicker issue on Android 3.x/4.0
				// applying "-webkit-transform-style:preserve-3d" to domNode can avoid
				// transition animation flicker
				domStyle.set(this.domNode, "webkitTransformStyle", "preserve-3d");
			}

			viewRegistry.add(this);
			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }

			// Determine which view among the siblings should be visible.
			// Priority:
			//   1. fragment id in the url (ex. #view1,view2)
			//   2. this.selected
			//   3. the first view
			if(this._visible === undefined){
				var views = this.getSiblingViews();
				var ids = location.hash && location.hash.substring(1).split(/,/);
				var fragView, selectedView, firstView;
				array.forEach(views, function(v, i){
					if(array.indexOf(ids, v.id) !== -1){ fragView = v; }
					if(i == 0){ firstView = v; }
					if(v.selected){ selectedView = v; }
					v._visible = false;
				}, this);
				(fragView || selectedView || firstView)._visible = true;
			}
			if(this._visible){
				// The 2nd arg is not to hide its sibling views so that they can be
				// correctly initialized.
				this.show(true, true);

				this.onStartView();
				connect.publish("/dojox/mobile/startView", [this]);
			}

			if(this.domNode.style.visibility != "visible"){ // this check is to avoid screen flickers
				this.domNode.style.visibility = "visible";
			}

			// Need to call inherited first - so that child widgets get started
			// up correctly
			this.inherited(arguments);

			var parent = this.getParent();
			if(!parent || !parent.resize){ // top level widget
				this.resize();
			}

			if(!this._visible){
				// hide() should be called last so that child widgets can be
				// initialized while they are visible.
				this.hide();
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onStartView: function(){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called only when this view is shown at startup time.
		},

		onBeforeTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the arriving transition occurs.
		},

		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the arriving transition occurs.
		},

		onBeforeTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the leaving transition occurs.
		},

		onAfterTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the leaving transition occurs.
		},

		_clearClasses: function(/*DomNode*/node){
			// summary:
			//		Clean up the domNode classes that were added while making a transition.
			// description:
			//		Remove all the "mbl" prefixed classes except mbl*View.
			if(!node){ return; }
			var classes = [];
			array.forEach(lang.trim(node.className||"").split(/\s+/), function(c){
				if(c.match(/^mbl\w*View$/) || c.indexOf("mbl") === -1){
					classes.push(c);
				}
			}, this);
			node.className = classes.join(' ');
		},

		_fixViewState: function(/*DomNode*/toNode){
			// summary:
			//		Sanity check for view transition states.
			// description:
			//		Sometimes uninitialization of Views fails after making view transition,
			//		and that results in failure of subsequent view transitions.
			//		This function does the uninitialization for all the sibling views.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView")){
					this._clearClasses(n);
				}
			}
			this._clearClasses(toNode); // just in case toNode is a sibling of an ancestor.
		},

		convertToId: function(moveTo){
			if(typeof(moveTo) == "string"){
				// removes a leading hash mark (#) and params if exists
				// ex. "#bar&myParam=0003" -> "bar"
				return moveTo.replace(/^#?([^&?]+).*/, "$1");
			}
			return moveTo;
		},

		_isBookmarkable: function(detail){
			return detail.moveTo && (config['mblForceBookmarkable'] || detail.moveTo.charAt(0) === '#') && !detail.hashchange;
		},

		performTransition: function(/*String*/moveTo, /*Number*/transitionDir, /*String*/transition,
									/*Object|null*/context, /*String|Function*/method /*...*/){
			// summary:
			//		Function to perform the various types of view transitions, such as fade, slide, and flip.
			// moveTo: String
			//		The id of the transition destination view which resides in
			//		the current page.
			//		If the value has a hash sign ('#') before the id
			//		(e.g. #view1) and the dojo.hash module is loaded by the user
			//		application, the view transition updates the hash in the
			//		browser URL so that the user can bookmark the destination
			//		view. In this case, the user can also use the browser's
			//		back/forward button to navigate through the views in the
			//		browser history.
			//		If null, transitions to a blank view.
			//		If '#', returns immediately without transition.
			// transitionDir: Number
			//		The transition direction. If 1, transition forward. If -1, transition backward.
			//		For example, the slide transition slides the view from right to left when transitionDir == 1,
			//		and from left to right when transitionDir == -1.
			// transition: String
			//		A type of animated transition effect. You can choose from
			//		the standard transition types, "slide", "fade", "flip", or
			//		from the extended transition types, "cover", "coverv",
			//		"dissolve", "reveal", "revealv", "scaleIn",
			//		"scaleOut", "slidev", "swirl", "zoomIn", "zoomOut". If
			//		"none" is specified, transition occurs immediately without
			//		animation.
			// context: Object
			//		The object that the callback function will receive as "this".
			// method: String|Function
			//		A callback function that is called when the transition has been finished.
			//		A function reference, or name of a function in context.
			// tags:
			//		public
			//
			// example:
			//		Transition backward to a view whose id is "foo" with the slide animation.
			//	|	performTransition("foo", -1, "slide");
			//
			// example:
			//		Transition forward to a blank view, and then open another page.
			//	|	performTransition(null, 1, "slide", null, function(){location.href = href;});

			// normalize the arg
			var detail, optArgs;
			if(moveTo && typeof(moveTo) === "object"){
				detail = moveTo;
				optArgs = transitionDir; // array
			}else{
				detail = {
					moveTo: moveTo,
					transitionDir: transitionDir,
					transition: transition,
					context: context,
					method: method
				};
				optArgs = [];
				for(var i = 5; i < arguments.length; i++){
					optArgs.push(arguments[i]);
				}
			}

			// save the parameters
			this._detail = detail;
			this._optArgs = optArgs;
			this._arguments = [
				detail.moveTo,
				detail.transitionDir,
				detail.transition,
				detail.context,
				detail.method
			];

			if(detail.moveTo === "#"){ return; }
			var toNode;
			if(detail.moveTo){
				toNode = this.convertToId(detail.moveTo);
			}else{
				if(!this._dummyNode){
					this._dummyNode = win.doc.createElement("div");
					win.body().appendChild(this._dummyNode);
				}
				toNode = this._dummyNode;
			}

			if(this.addTransitionInfo && typeof(detail.moveTo) == "string" && this._isBookmarkable(detail)){
				this.addTransitionInfo(this.id, detail.moveTo, {transitionDir:detail.transitionDir, transition:detail.transition});
			}

			var fromNode = this.domNode;
			var fromTop = fromNode.offsetTop;
			toNode = this.toNode = dom.byId(toNode);
			if(!toNode){ console.log("dojox.mobile.View#performTransition: destination view not found: "+detail.moveTo); return; }
			toNode.style.visibility = "hidden";
			toNode.style.display = "";
			this._fixViewState(toNode);
			var toWidget = registry.byNode(toNode);
			if(toWidget){
				// Now that the target view became visible, it's time to run resize()
				if(config["mblAlwaysResizeOnTransition"] || !toWidget._resized){
					common.resizeAll(null, toWidget);
					toWidget._resized = true;
				}

				if(detail.transition && detail.transition != "none"){
					// Temporarily add padding to align with the fromNode while transition
					toWidget.containerNode.style.paddingTop = fromTop + "px";
				}

				toWidget.load && toWidget.load(); // for ContentView

				toWidget.movedFrom = fromNode.id;
			}
			if(has("mblAndroidWorkaround") && !config['mblCSS3Transition']
					&& detail.transition && detail.transition != "none"){
				// workaround for the screen flicker issue on Android 2.2/2.3
				// apply "-webkit-transform-style:preserve-3d" to both toNode and fromNode
				// to make them 3d-transition-ready state just before transition animation
				domStyle.set(toNode, "webkitTransformStyle", "preserve-3d");
				domStyle.set(fromNode, "webkitTransformStyle", "preserve-3d");
				// show toNode offscreen to avoid flicker when switching "display" and "visibility" styles
				domClass.add(toNode, "mblAndroidWorkaround");
			}

			this.onBeforeTransitionOut.apply(this, this._arguments);
			connect.publish("/dojox/mobile/beforeTransitionOut", [this].concat(lang._toArray(this._arguments)));
			if(toWidget){
				// perform view transition keeping the scroll position
				if(this.keepScrollPos && !this.getParent()){
					var scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					fromNode._scrollTop = scrollTop;
					var toTop = (detail.transitionDir == 1) ? 0 : (toNode._scrollTop || 0);
					toNode.style.top = "0px";
					if(scrollTop > 1 || toTop !== 0){
						fromNode.style.top = toTop - scrollTop + "px";
						if(config["mblHideAddressBar"] !== false){
							setTimeout(function(){ // iPhone needs setTimeout
								win.global.scrollTo(0, (toTop || 1));
							}, 0);
						}
					}
				}else{
					toNode.style.top = "0px";
				}
				toWidget.onBeforeTransitionIn.apply(toWidget, this._arguments);
				connect.publish("/dojox/mobile/beforeTransitionIn", [toWidget].concat(lang._toArray(this._arguments)));
			}
			toNode.style.display = "none";
			toNode.style.visibility = "visible";

			common.fromView = this;
			common.toView = toWidget;

			this._doTransition(fromNode, toNode, detail.transition, detail.transitionDir);
		},

		_toCls: function(s){
			// convert from transition name to corresponding class name
			// ex. "slide" -> "mblSlide"
			return "mbl"+s.charAt(0).toUpperCase() + s.substring(1);
		},

		_doTransition: function(fromNode, toNode, transition, transitionDir){
			var rev = (transitionDir == -1) ? " mblReverse" : "";
			toNode.style.display = "";
			if(!transition || transition == "none"){
				this.domNode.style.display = "none";
				this.invokeCallback();
			}else if(config['mblCSS3Transition']){
				//get dojox/css3/transit first
				Deferred.when(transitDeferred, lang.hitch(this, function(transit){
					//follow the style of .mblView.mblIn in View.css
					//need to set the toNode to absolute position
					var toPosition = domStyle.get(toNode, "position");
					domStyle.set(toNode, "position", "absolute");
					Deferred.when(transit(fromNode, toNode, {transition: transition, reverse: (transitionDir===-1)?true:false}),lang.hitch(this,function(){
						domStyle.set(toNode, "position", toPosition);
						this.invokeCallback();
					}));
				}));
			}else{
				if(transition.indexOf("cube") != -1){
					if(has("ipad")){
						domStyle.set(toNode.parentNode, {webkitPerspective:1600});
					}else if(has("iphone")){
						domStyle.set(toNode.parentNode, {webkitPerspective:800});
					}
				}
				var s = this._toCls(transition);
				if(has("mblAndroidWorkaround")){
					// workaround for the screen flicker issue on Android 2.2
					// applying transition css classes just after setting toNode.style.display = ""
					// causes flicker, so wait for a while using setTimeout
					setTimeout(function(){
						domClass.add(fromNode, s + " mblOut" + rev);
						domClass.add(toNode, s + " mblIn" + rev);
						domClass.remove(toNode, "mblAndroidWorkaround"); // remove offscreen style
						setTimeout(function(){
							domClass.add(fromNode, "mblTransition");
							domClass.add(toNode, "mblTransition");
						}, 30); // 30 = 100 - 70, to make total delay equal to 100ms
					}, 70); // 70ms is experiential value
				}else{
					domClass.add(fromNode, s + " mblOut" + rev);
					domClass.add(toNode, s + " mblIn" + rev);
					setTimeout(function(){
						domClass.add(fromNode, "mblTransition");
						domClass.add(toNode, "mblTransition");
					}, 100);
				}
				// set transform origin
				var fromOrigin = "50% 50%";
				var toOrigin = "50% 50%";
				var scrollTop, posX, posY;
				if(transition.indexOf("swirl") != -1 || transition.indexOf("zoom") != -1){
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -domGeometry.position(fromNode, true).y;
					}
					posY = win.global.innerHeight / 2 + scrollTop;
					fromOrigin = "50% " + posY + "px";
					toOrigin = "50% " + posY + "px";
				}else if(transition.indexOf("scale") != -1){
					var viewPos = domGeometry.position(fromNode, true);
					posX = ((this.clickedPosX !== undefined) ? this.clickedPosX : win.global.innerWidth / 2) - viewPos.x;
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -viewPos.y;
					}
					posY = ((this.clickedPosY !== undefined) ? this.clickedPosY : win.global.innerHeight / 2) + scrollTop;
					fromOrigin = posX + "px " + posY + "px";
					toOrigin = posX + "px " + posY + "px";
				}
				domStyle.set(fromNode, {webkitTransformOrigin:fromOrigin});
				domStyle.set(toNode, {webkitTransformOrigin:toOrigin});
			}
		},

		onAnimationStart: function(e){
		},

		onAnimationEnd: function(e){
			var name = e.animationName || e.target.className;
			if(name.indexOf("Out") === -1 &&
				name.indexOf("In") === -1 &&
				name.indexOf("Shrink") === -1){ return; }
			var isOut = false;
			if(domClass.contains(this.domNode, "mblOut")){
				isOut = true;
				this.domNode.style.display = "none";
				domClass.remove(this.domNode, [this._toCls(this._detail.transition), "mblIn", "mblOut", "mblReverse"]);
			}else{
				// Reset the temporary padding
				this.containerNode.style.paddingTop = "";
			}
			domStyle.set(this.domNode, {webkitTransformOrigin:""});
			if(name.indexOf("Shrink") !== -1){
				var li = e.target;
				li.style.display = "none";
				domClass.remove(li, "mblCloseContent");

				// If target is placed inside scrollable, need to call onTouchEnd
				// to adjust scroll position
				var p = viewRegistry.getEnclosingScrollable(this.domNode);
				p && p.onTouchEnd();
			}
			if(isOut){
				this.invokeCallback();
			}
			this._clearClasses(this.domNode);

			// clear the clicked position
			this.clickedPosX = this.clickedPosY = undefined;

			if(name.indexOf("Cube") !== -1 &&
				name.indexOf("In") !== -1 && has("iphone")){
				this.domNode.parentNode.style.webkitPerspective = "";
			}
		},

		invokeCallback: function(){
			this.onAfterTransitionOut.apply(this, this._arguments);
			connect.publish("/dojox/mobile/afterTransitionOut", [this].concat(this._arguments));
			var toWidget = registry.byNode(this.toNode);
			if(toWidget){
				toWidget.onAfterTransitionIn.apply(toWidget, this._arguments);
				connect.publish("/dojox/mobile/afterTransitionIn", [toWidget].concat(this._arguments));
				toWidget.movedFrom = undefined;
				if(this.setFragIds && this._isBookmarkable(this._detail)){
					this.setFragIds(toWidget); // setFragIds is defined in bookmarkable.js
				}
			}
			if(has("mblAndroidWorkaround")){
				// workaround for the screen flicker issue on Android 2.2/2.3
				// remove "-webkit-transform-style" style after transition finished
				// to avoid side effects such as input field auto-scrolling issue
				// use setTimeout to avoid flicker in case of ScrollableView
				setTimeout(lang.hitch(this, function(){
					if(toWidget){ domStyle.set(this.toNode, "webkitTransformStyle", ""); }
					domStyle.set(this.domNode, "webkitTransformStyle", "");
				}), 0);
			}

			var c = this._detail.context, m = this._detail.method;
			if(!c && !m){ return; }
			if(!m){
				m = c;
				c = null;
			}
			c = c || win.global;
			if(typeof(m) == "string"){
				c[m].apply(c, this._args);
			}else if(typeof(m) == "function"){
				m.apply(c, this._args);
			}
		},

		isVisible: function(/*Boolean?*/checkAncestors){
			// summary:
			//		Return true if this view is visible
			// checkAncestors:
			//		If true, in addition to its own visibility, also checks the
			//		ancestors visibility to see if the view is actually being
			//		shown or not.
			var visible = function(node){
				return domStyle.get(node, "display") !== "none";
			};
			if(checkAncestors){
				for(var n = this.domNode; n.tagName !== "BODY"; n = n.parentNode){
					if(!visible(n)){ return false; }
				}
				return true;
			}else{
				return visible(this.domNode);
			}
		},

		getShowingView: function(){
			// summary:
			//		Find the currently showing view from my sibling views.
			// description:
			//		Note that depending on the ancestor views' visibility,
			//		the found view may not be actually shown.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView") && n.style.display !== "none"){
					return registry.byNode(n);
				}
			}
			return null;
		},

		getSiblingViews: function(){
			// summary:
			//		Returns an array of the sibling views.
			if(!this.domNode.parentNode){ return [this]; }
			return array.map(array.filter(this.domNode.parentNode.childNodes,
				function(n){ return n.nodeType === 1 && domClass.contains(n, "mblView"); }),
				function(n){ return registry.byNode(n); });
		},

		show: function(/*Boolean?*/noEvent, /*Boolean?*/doNotHideOthers){
			// summary:
			//		Shows this view without a transition animation.
			var out = this.getShowingView();
			if(!noEvent){
				if(out){
					out.onBeforeTransitionOut(out.id);
					connect.publish("/dojox/mobile/beforeTransitionOut", [out, out.id]);
				}
				this.onBeforeTransitionIn(this.id);
				connect.publish("/dojox/mobile/beforeTransitionIn", [this, this.id]);
			}

			if(doNotHideOthers){
				this.domNode.style.display = "";
			}else{
				array.forEach(this.getSiblingViews(), function(v){
					v.domNode.style.display = (v === this) ? "" : "none";
				}, this);
			}
			this.load && this.load(); // for ContentView

			if(!noEvent){
				if(out){
					out.onAfterTransitionOut(out.id);
					connect.publish("/dojox/mobile/afterTransitionOut", [out, out.id]);
				}
				this.onAfterTransitionIn(this.id);
				connect.publish("/dojox/mobile/afterTransitionIn", [this, this.id]);
			}
		},

		hide: function(){
			this.domNode.style.display = "none";
		}
	});
});

},
'dojox/mobile/RoundRectList':function(){
define("dojox/mobile/RoundRectList", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, event, lang, win, domConstruct, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRectList
	// summary:
	//		A rounded rectangle list.

	return declare("dojox.mobile.RoundRectList", [WidgetBase, Container, Contained], {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		RoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be
		//		dojox.mobile.ListItem.

		// transition: String
		//		The default animated transition effect for child items.
		transition: "slide",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// select: String
		//		Selection mode of the list. The check mark is shown for the
		//		selected list item(s). The value can be "single", "multiple", or
		//		"". If "single", there can be only one selected item at a time.
		//		If "multiple", there can be multiple selected items at a time.
		select: "",

		// stateful: Boolean
		//		If true, the last selected item remains highlighted.
		stateful: false,

		// syncWithViews: Boolean
		//		True if this widget listens to view transition events to be
		//		synchronized with view's visibility.
		syncWithViews: false,

		// editable: Boolean
		//		If true, the list can be re-ordered.
		editable: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		editableMixinClass: "dojox/mobile/_EditableListMixin",
		baseClass: "mblRoundRectList",

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.editable){
				require([this.editableMixinClass], lang.hitch(this, function(module){
					lang.mixin(this, new module());
				}));
			}
			this.connect(this.domNode, "onselectstart", event.stop);

			if(this.syncWithViews){ // see also TabBar#postCreate
				var f = function(view, moveTo, dir, transition, context, method){
					var child = array.filter(this.getChildren(), function(w){
						return w.moveTo === "#" + view.id || w.moveTo === view.id; })[0];
					if(child){ child.set("selected", true); }
				};
				this.subscribe("/dojox/mobile/afterTransitionIn", f);
				this.subscribe("/dojox/mobile/startView", f);
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onCheckStateChanged: function(/*Widget*/listItem, /*String*/newState){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the check state has been changed.
		},

		_setStatefulAttr: function(stateful){
			this._set("stateful", stateful);
			this.selectOne = stateful;
			array.forEach(this.getChildren(), function(child){
				child.setArrow && child.setArrow();
			});
		},

		deselectItem: function(/*ListItem*/item){
			// summary:
			//		Deselects the given item.
			item.set("selected", false);
		},

		deselectAll: function(){
			// summary:
			//		Deselects all the items.
			array.forEach(this.getChildren(), function(child){
				child.set("selected", false);
			});
		},

		selectItem: function(/*ListItem*/item){
			// summary:
			//		Selects the given item.
			item.set("selected", true);
		}
	});
});

},
'dojox/mobile/FixedSplitter':function(){
define("dojox/mobile/FixedSplitter", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, win, domClass, domGeometry, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/FixedSplitter
	// summary:
	//		A layout container that splits the window horizontally or vertically.

	return declare("dojox.mobile.FixedSplitter", [WidgetBase, Container, Contained], {
		// summary:
		//		A layout container that splits the window horizontally or
		//		vertically.
		// description:
		//		FixedSplitter is a very simple container widget that layouts its
		//		child dom nodes side by side either horizontally or
		//		vertically. An example usage of this widget would be to realize
		//		the split view on iPad. There is no visual splitter between the
		//		children, and there is no function to resize the child panes
		//		with drag-and-drop. If you need a visual splitter, you can
		//		specify a border of a child dom node with CSS.
		//
		//		FixedSplitter has no knowledge of its child widgets.
		//		dojox.mobile.Container (=formerly known as FixedSplitterPane),
		//		dojox.mobile.Pane, or dojox.mobile.ContentPane can be used as a
		//		child widget of FixedSplitter.
		//
		//		- Use dojox.mobile.Container if your content consists of ONLY
		//		  dojo widgets.
		//		- Use dojox.mobile.Pane if your content is an inline html
		//		  fragment (may or may not include dojo widgets).
		//		- Use dojox.mobile.ContentPane if your content is an external
		//		  html fragment (may or may not include dojo widgets).
		//
		// example:
		// |	<div dojoType="dojox.mobile.FixedSplitter" orientation="H">
		// |		<div dojoType="dojox.mobile.Pane"
		// |			style="width:200px;border-right:1px solid black;">
		// |			pane #1 (width=200px)
		// |		</div>
		// |		<div dojoType="dojox.mobile.Pane">
		// |			pane #2
		// |		</div>
		// |	</div>

		// orientation: String
		//		The direction of split. If "H" is specified, panes are split
		//		horizontally. If "V" is specified, panes are split vertically.
		orientation: "H",

		// variablePane: Number
		//		The index of a pane that fills the remainig space.
		//		If -1, the last child pane fills the remaining space.
		variablePane: -1,

		// screenSizeAware: Boolean
		//		If true, dynamically load a screen-size-aware module.
		screenSizeAware: false,

		// screenSizeAwareClass: String
		//		A screen-size-aware module to load.
		screenSizeAwareClass: "dojox/mobile/ScreenSizeAware",

		baseClass: "mblFixedSplitter",

		startup: function(){
			if(this._started){ return; }
			domClass.add(this.domNode, this.baseClass + this.orientation);

			var parent = this.getParent(), f;
			if(!parent || !parent.resize){ // top level widget
				var _this = this;
				f = function(){
					setTimeout(function(){
						_this.resize();
					}, 0);
				};
			}

			if(this.screenSizeAware){
				require([this.screenSizeAwareClass], function(module){
					module.getInstance();
					f && f();
				});
			}else{
				f && f();
			}

			this.inherited(arguments);
		},

		resize: function(){
			var wh = this.orientation === "H" ? "w" : "h", // width/height
				tl = this.orientation === "H" ? "l" : "t", // top/left
				props1 = {}, props2 = {},
				i, c, h,
				a = [], offset = 0, total = 0,
				children = array.filter(this.domNode.childNodes, function(node){ return node.nodeType == 1; }),
				idx = this.variablePane == -1 ? children.length - 1 : this.variablePane;
			for(i = 0; i < children.length; i++){
				if(i != idx){
					a[i] = domGeometry.getMarginBox(children[i])[wh];
					total += a[i];
				}
			}

			if(this.orientation == "V"){
				if(this.domNode.parentNode.tagName == "BODY"){
					if(array.filter(win.body().childNodes, function(node){ return node.nodeType == 1; }).length == 1){
						h = (win.global.innerHeight||win.doc.documentElement.clientHeight);
					}
				}
			}
			var l = (h || domGeometry.getMarginBox(this.domNode)[wh]) - total;
			props2[wh] = a[idx] = l;
			c = children[idx];
			domGeometry.setMarginBox(c, props2);
			c.style[this.orientation === "H" ? "height" : "width"] = "";

			for(i = 0; i < children.length; i++){
				c = children[i];
				props1[tl] = offset;
				domGeometry.setMarginBox(c, props1);
				c.style[this.orientation === "H" ? "top" : "left"] = "";
				offset += a[i];
			}

			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		_setOrientationAttr: function(/*String*/orientation){
			var s = this.baseClass;
			domClass.replace(this.domNode, s + orientation, s + this.orientation);
			this.orientation = orientation;
			if(this._started){
				this.resize();
			}
		}
	});
});

},
'dojox/mobile/Carousel':function(){
define("dojox/mobile/Carousel", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./lazyLoadUtils",
	"./CarouselItem",
	"./PageIndicator",
	"./SwapView",
	"require"
], function(array, connect, declare, event, has, domClass, domConstruct, domStyle, registry, Contained, Container, WidgetBase, lazyLoadUtils, CarouselItem, PageIndicator, SwapView, require){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var PageIndicator = dojox.mobile.PageIndicator;
	var SwapView = dojox.mobile.SwapView;
=====*/

	// module:
	//		dojox/mobile/Carousel
	// summary:
	//		A carousel widget that manages a list of images

	return declare("dojox.mobile.Carousel", [WidgetBase, Container, Contained], {
		// summary:
		//		A carousel widget that manages a list of images
		// description:
		//		The carousel widget manages a list of images that can be
		//		displayed horizontally, and allows the user to scroll through
		//		the list and select a single item.
		//
		//		This widget itself has no data store support, but there are two
		//		subclasses dojox.mobile.DataCarousel and dojox.mobile.StoreCarousel
		//		available for generating the contents from data store.
		//		To feed data into Carousel through dojo.data, use DataCarousel.
		//		To feed data into Carousel through dojo.store, use StoreCarousel.

		// numVisible: Number
		//		The number of visible items.
		numVisible: 2,

		// itemWidth: Number
		//		The number of visible items (=numVisible) is determined by
		//		(carousel_width / itemWidth).
		//		If itemWidth is specified, numVisible is automatically
		//		calculated.
		//		If resize() is called, numVisible is recalculated and the layout
		//		is changed accordingly.
		itemWidth: 0,

		// title: String
		//		A title of the carousel to be displayed on the title bar.
		title: "",

		// pageIndicator: Boolean
		//		If true, a page indicator, a series of small dots that indicate
		//		the current page, is displayed on the title bar.
		pageIndicator: true,

		// navButton: Boolean
		//		If true, navigation buttons are displyed on the title bar.
		navButton: false,

		// height: String
		//		Explicitly specified height of the widget (ex. "300px"). If
		//		"inherit" is specified, the height is inherited from its offset
		//		parent.
		height: "",

		// selectable: Boolean
		//		If true, an item can be selected by clicking on it.
		selectable: true,

		/* internal properties */	
		baseClass: "mblCarousel",

		buildRendering: function(){
			this.containerNode = domConstruct.create("div", {className: "mblCarouselPages"});
			this.inherited(arguments);
			if(this.srcNodeRef){
				// reparent
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this.containerNode.appendChild(this.srcNodeRef.firstChild);
				}
			}

			this.headerNode = domConstruct.create("div", {className: "mblCarouselHeaderBar"}, this.domNode);

			if(this.navButton){
				this.btnContainerNode = domConstruct.create("div", {
					className: "mblCarouselBtnContainer"
				}, this.headerNode);
				domStyle.set(this.btnContainerNode, "float", "right"); // workaround for webkit rendering problem
				this.prevBtnNode = domConstruct.create("button", {
					className: "mblCarouselBtn",
					title: "Previous",
					innerHTML: "&lt;"
				}, this.btnContainerNode);
				this.nextBtnNode = domConstruct.create("button", {
					className: "mblCarouselBtn",
					title: "Next",
					innerHTML: "&gt;"
				}, this.btnContainerNode);
				this._prevHandle = this.connect(this.prevBtnNode, "onclick", "onPrevBtnClick");
				this._nextHandle = this.connect(this.nextBtnNode, "onclick", "onNextBtnClick");
			}

			if(this.pageIndicator){
				if(!this.title){
					this.title = "&nbsp;";
				}
				this.piw = new PageIndicator();
				domStyle.set(this.piw, "float", "right"); // workaround for webkit rendering problem
				this.headerNode.appendChild(this.piw.domNode);
			}

			this.titleNode = domConstruct.create("div", {
				className: "mblCarouselTitle"
			}, this.headerNode);

			this.domNode.appendChild(this.containerNode);
			this.subscribe("/dojox/mobile/viewChanged", "handleViewChanged");
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick");
			this._dragstartHandle = this.connect(this.domNode, "ondragstart", event.stop);
			this.selectedItemIndex = -1;
			this.items = [];
		},

		startup: function(){
			if(this._started){ return; }

			var h;
			if(this.height === "inherit"){
				if(this.domNode.offsetParent){
					h = this.domNode.offsetParent.offsetHeight + "px";
				}
			}else if(this.height){
				h = this.height;
			}
			if(h){
				this.domNode.style.height = h;
			}

			if(this.store){
				if(!this.setStore){
					throw new Error("Use StoreCarousel or DataCarousel instead of Carousel.");
				}
				var store = this.store;
				this.store = null;
				this.setStore(store, this.query, this.queryOptions);
			}else{
				this.resizeItems();
			}
			this.inherited(arguments);

			this.currentView = array.filter(this.getChildren(), function(view){
				return view.isVisible();
			})[0];
		},

		resizeItems: function(){
			var idx = 0;
			var h = this.domNode.offsetHeight - (this.headerNode ? this.headerNode.offsetHeight : 0);
			var m = has("ie") ? 5 / this.numVisible-1 : 5 / this.numVisible;
			array.forEach(this.getChildren(), function(view){
				if(!(view instanceof SwapView)){ return; }
				if(!(view.lazy || view.domNode.getAttribute("lazy"))){
					view._instantiated = true;
				}
				var ch = view.containerNode.childNodes;
				for(var i = 0, len = ch.length; i < len; i++){
					var node = ch[i];
					if(node.nodeType !== 1){ continue; }
					var item = this.items[idx] || {};
					domStyle.set(node, {
						width: item.width || (90 / this.numVisible + "%"),
						height: item.height || h + "px",
						margin: "0 " + (item.margin || m + "%")
					});
					domClass.add(node, "mblCarouselSlot");
					idx++;
				}
			}, this);

			if(this.piw){
				this.piw.refId = this.containerNode.firstChild;
				this.piw.reset();
			}
		},

		resize: function(){
			if(!this.itemWidth){ return; }
			var num = Math.floor(this.domNode.offsetWidth / this.itemWidth);
			if(num === this.numVisible){ return; }
			this.selectedItemIndex = this.getIndexByItemWidget(this.selectedItem);
			this.numVisible = num;
			if(this.items.length > 0){
				this.onComplete(this.items);
				this.select(this.selectedItemIndex);
			}
		},

		fillPages: function(){
			array.forEach(this.getChildren(), function(child, i){
				var s = "";
				for(var j = 0; j < this.numVisible; j++){
					var type, props = "", mixins;
					var idx = i * this.numVisible + j;
					var item = {};
					if(idx < this.items.length){
						item = this.items[idx];
						type = this.store.getValue(item, "type");
						if(type){
							props = this.store.getValue(item, "props");
							mixins = this.store.getValue(item, "mixins");
						}else{
							type = "dojox.mobile.CarouselItem";
							array.forEach(["alt", "src", "headerText", "footerText"], function(p){
								var v = this.store.getValue(item, p);
								if(v !== undefined){
									if(props){ props += ','; }
									props += p + ':"' + v + '"';
								}
							}, this);
						}
					}else{
						type = "dojox.mobile.CarouselItem";
						props = 'src:"' + require.toUrl("dojo/resources/blank.gif") + '"' +
							', className:"mblCarouselItemBlank"';
					}

					s += '<div data-dojo-type="' + type + '"';
					if(props){
						s += ' data-dojo-props=\'' + props + '\'';
					}
					if(mixins){
						s += ' data-dojo-mixins=\'' + mixins + '\'';
					}
					s += '></div>';
				}
				child.containerNode.innerHTML = s;
			}, this);
		},

		onComplete: function(/*Array*/items){
			array.forEach(this.getChildren(), function(child){
				if(child instanceof SwapView){
					child.destroyRecursive();
				}
			});
			this.selectedItem = null;
			this.items = items;
			var nPages = Math.ceil(items.length / this.numVisible),
				i, h = this.domNode.offsetHeight - this.headerNode.offsetHeight,
				idx = this.selectedItemIndex === -1 ? 0 : this.selectedItemIndex;
				pg = Math.floor(idx / this.numVisible); // current page
			for(i = 0; i < nPages; i++){
				var w = new SwapView({height: h + "px", lazy:true});
				this.addChild(w);
				if(i === pg){
					w.show();
					this.currentView = w;
				}else{
					w.hide();
				}
			}
			this.fillPages();
			this.resizeItems();
			var children = this.getChildren();
			var from = pg - 1 < 0 ? 0 : pg - 1;
			var to = pg + 1 > nPages - 1 ? nPages - 1 : pg + 1;
			for(i = from; i <= to; i++){
				this.instantiateView(children[i]);
			}
		},

		onError: function(errText){
		},

		onUpdate: function(item, insertedInto){
		},

		onDelete: function(item, removedFrom){
		},

		onSet: function(item, attribute, oldValue, newValue){
		},

		onNew: function(newItem, parentInfo){
		},

		onStoreClose: function(request){
		},

		getParentView: function(/*DomNode*/node){
			for(var w = registry.getEnclosingWidget(node); w; w = w.getParent()){
				if(w.getParent() instanceof SwapView){ return w; }
			}
			return null;
		},

		getIndexByItemWidget: function(/*Widget*/w){
			if(!w){ return -1; }
			var view = w.getParent();
			return array.indexOf(this.getChildren(), view) * this.numVisible +
				array.indexOf(view.getChildren(), w);
		},

		getItemWidgetByIndex: function(/*Number*/index){
			if(index === -1){ return null; }
			var view = this.getChildren()[Math.floor(index / this.numVisible)];
			return view.getChildren()[index % this.numVisible];
		},

		onPrevBtnClick: function(e){
			if(this.currentView){
				this.currentView.goTo(-1);
			}
		},

		onNextBtnClick: function(e){
			if(this.currentView){
				this.currentView.goTo(1);
			}
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e && e.type === "keydown"){ // keyboard navigation for accessibility
				if(e.keyCode === 39){ // right arrow
					this.onNextBtnClick();
				}else if(e.keyCode === 37){ // left arrow
					this.onPrevBtnClick();
				}else if(e.keyCode !== 13){ // !Enter
					return;
				}
			}

			var w;
			for(w = registry.getEnclosingWidget(e.target); ; w = w.getParent()){
				if(!w){ return; }
				if(w.getParent() instanceof SwapView){ break; }
			}
			this.select(w);
			var idx = this.getIndexByItemWidget(w);
			connect.publish("/dojox/mobile/carouselSelect", [this, w, this.items[idx], idx]);
		},

		select: function(/*Widget|Number*/itemWidget){
			if(typeof(itemWidget) === "number"){
				itemWidget = this.getItemWidgetByIndex(itemWidget);
			}
			if(this.selectable){
				if(this.selectedItem){
					this.selectedItem.set("selected", false);
					domClass.remove(this.selectedItem.domNode, "mblCarouselSlotSelected");
				}
				if(itemWidget){
					itemWidget.set("selected", true);
					domClass.add(itemWidget.domNode, "mblCarouselSlotSelected");
				}
				this.selectedItem = itemWidget;
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		instantiateView: function(view){
			if(view && !view._instantiated){
				var isHidden = (domStyle.get(view.domNode, "display") === "none");
				if(isHidden){
					domStyle.set(view.domNode, {visibility:"hidden", display:""});
				}
				lazyLoadUtils.instantiateLazyWidgets(view.containerNode, null, function(root){
					if(isHidden){
						domStyle.set(view.domNode, {visibility:"visible", display:"none"});
					}
				});
				view._instantiated = true;
			}
		},

		handleViewChanged: function(view){
			if(view.getParent() !== this){ return; }
			if(this.currentView.nextView(this.currentView.domNode) === view){
				this.instantiateView(view.nextView(view.domNode));
			}else{
				this.instantiateView(view.previousView(view.domNode));
			}
			this.currentView = view;
		},

		_setTitleAttr: function(/*String*/title){
			this.titleNode.innerHTML = this._cv ? this._cv(title) : title;
			this._set("title", title);
		}
	});
});

},
'dojox/mobile/TextBox':function(){
define("dojox/mobile/TextBox", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_FormValueMixin",
	"dijit/form/_TextBoxMixin"
], function(declare, domConstruct, WidgetBase, FormValueMixin, TextBoxMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormValueMixin = dijit.form._FormValueMixin;
		TextBoxMixin = dijit.form._TextBoxMixin;
	=====*/
	return declare("dojox.mobile.TextBox",[WidgetBase, FormValueMixin, TextBoxMixin],{
		// summary:
		//		A non-templated base class for textbox form inputs

		baseClass: "mblTextBox",

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// Map widget attributes to DOMNode attributes.
		_setPlaceHolderAttr: "textbox",

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("input", {"type":this.type});
			}
			this.inherited(arguments);
			this.textbox = this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.textbox, "onmouseup", function(){ this._mouseIsDown = false; });
			this.connect(this.textbox, "onmousedown", function(){ this._mouseIsDown = true; });
			this.connect(this.textbox, "onfocus", function(e){
				this._onFocus(this._mouseIsDown ? "mouse" : e);
				this._mouseIsDown = false;
			});
			this.connect(this.textbox, "onblur", "_onBlur");
		}
	});
});

},
'dojox/mobile/Audio':function(){
define("dojox/mobile/Audio", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/_base/sniff",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(declare, domConstruct, has, Contained, WidgetBase){
	// module:
	//		dojox/mobile/Audio
	// summary:
	//		A thin wrapper around the html5 <audio> element.

	return declare("dojox.mobile.Audio", [WidgetBase, Contained], {
		source: null,
		width: "200px",
		height: "15px",

		_playable: false,
		_tag: "audio",

		constructor: function(){
			this.source = [];
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this._tag);
		},

		_getEmbedRegExp: function(){
			return has("ff") ? /audio\/mpeg/i :
				   has("ie") ? /audio\/wav/i :
				   null;
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
		 	if(this.domNode.canPlayType){
				if(this.source.length > 0){
					for(var i = 0, len = this.source.length; i < len; i++){
						domConstruct.create("source", {src:this.source[i].src, type:this.source[i].type}, this.domNode);
						this._playable = this._playable || !!this.domNode.canPlayType(this.source[i].type);
					}
				}else{
					for(var i = 0, len = this.domNode.childNodes.length; i < len; i++){
						var n = this.domNode.childNodes[i];
						if(n.nodeType === 1 && n.nodeName === "SOURCE"){
							this.source.push({src:n.src, type:n.type});
							this._playable = this._playable || !!this.domNode.canPlayType(n.type);
						}
					}
				}
			}
			has.add("mobile-embed-audio-video-support", true);	//It should move to staticHasFeatures
		 	if(has("mobile-embed-audio-video-support")){
				if(!this._playable){
					for(var i = 0, len = this.source.length, re = this._getEmbedRegExp(); i < len; i++){
					 	if(this.source[i].type.match(re)){
							var node = domConstruct.create("embed", {
								src: this.source[0].src,
								type: this.source[0].type,
								width: this.width,
								height: this.height
							});
							this.domNode.parentNode.replaceChild(node, this.domNode);
							this.domNode = node;
							this._playable = true;
							break;
						}
					}
				}
			}
		}

	});
});

},
'dojox/mobile/dh/ContentTypeMap':function(){
define("dojox/mobile/dh/ContentTypeMap", [
	"dojo/_base/lang"
], function(lang){

	var o = lang.getObject("dojox.mobile.dh.ContentTypeMap", true);

	o.map = {
		"html": "dojox/mobile/dh/HtmlContentHandler",
		"json": "dojox/mobile/dh/JsonContentHandler"
	};

	o.add = function(/*String*/ contentType, /*String*/ handlerClass){
		this.map[contentType] = handlerClass;
	};

	o.getHandlerClass = function(/*String*/ contentType){
		return this.map[contentType];
	};

	return o;
});

},
'dojox/mobile/Button':function(){
define("dojox/mobile/Button", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_ButtonMixin",
	"dijit/form/_FormWidgetMixin"
],
	function(array, declare, domClass, domConstruct, WidgetBase, ButtonMixin, FormWidgetMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormWidgetMixin = dijit.form._FormWidgetMixin;
		ButtonMixin = dijit.form._ButtonMixin;
	=====*/
	return declare("dojox.mobile.Button", [WidgetBase, FormWidgetMixin, ButtonMixin], {
		// summary:
		//	Non-templated BUTTON widget with a thin API wrapper for click events and setting the label
		//
		// description:
		//              Buttons can display a label, an icon, or both.
		//              A label should always be specified (through innerHTML) or the label
		//              attribute.  It can be hidden via showLabel=false.
		// example:
		// |    <button dojoType="dijit.form.Button" onClick="...">Hello world</button>

		baseClass: "mblButton",

		// Override automatic assigning type --> node, it causes exception on IE.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// duration: Number
		//	duration of selection, milliseconds or -1 for no post-click CSS styling
		duration: 1000,

		_onClick: function(e){
			var ret = this.inherited(arguments);
			if(ret && this.duration >= 0){ // if its not a button with a state, then emulate press styles
				var button = this.focusNode || this.domNode;
				var newStateClasses = (this.baseClass+' '+this["class"]).split(" ");
				newStateClasses = array.map(newStateClasses, function(c){ return c+"Selected"; });
				domClass.add(button, newStateClasses);
				setTimeout(function(){
					domClass.remove(button, newStateClasses);
				}, this.duration);
			}
			return ret;
		},

		isFocusable: function(){ return false; },

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("button", {"type": this.type});
			}else if(this._cv){
				var n = this.srcNodeRef.firstChild;
				if(n && n.nodeType === 3){
					n.nodeValue = this._cv(n.nodeValue);
				}
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.domNode, "onclick", "_onClick");
		},

		_setLabelAttr: function(/*String*/ content){
			this.inherited(arguments, [this._cv ? this._cv(content) : content]);
		}
	});

});

},
'dojox/mobile/RoundRectCategory':function(){
define("dojox/mobile/RoundRectCategory", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(declare, win, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRectCategory
	// summary:
	//		A category header for a rounded rectangle list.

	return declare("dojox.mobile.RoundRectCategory", [WidgetBase, Contained],{
		// summary:
		//		A category header for a rounded rectangle list.

		// label: String
		//		A label text for the widget.
		label: "",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("H2");
			this.domNode.className = "mblRoundRectCategory";
			if(!this.label){
				this.label = this.domNode.innerHTML;
			}
		},

		_setLabelAttr: function(/*String*/label){
			this.label = label;
			this.domNode.innerHTML = this._cv ? this._cv(label) : label;
		}
	});

});

},
'dojox/mobile/ValuePickerSlot':function(){
define("dojox/mobile/ValuePickerSlot", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/touch",
	"dijit/_WidgetBase",
	"./iconUtils"
], function(array, declare, event, lang, win, domClass, domConstruct, touch, WidgetBase, iconUtils){

/*=====
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/ValuePickerSlot
	// summary:
	//		A widget that shows rating with stars.

	return declare("dojox.mobile.ValuePickerSlot", WidgetBase, {
		// items: Array
		//		An array of array of key-label paris.
		//		(e.g. [[0,"Jan"],[1,"Feb"],...] ) If key values for each label
		//		are not necessary, labels can be used instead.
		items: [],

		// labels: Array
		//		An array of labels to be displayed on the value picker.
		//		(e.g. ["Jan","Feb",...] ) This is a simplified version of the
		//		items property.
		labels: [],

		// labelFrom: Number
		//		The start value of display values of the value picker. This
		//		parameter is especially useful when value picker has serial
		//		values.
		labelFrom: 0,

		// labelTo: Number
		//		The end value of display values of the value picker.
		labelTo: 0,

		// zeroPad: Number
		//		Length of zero padding numbers.
		//		Ex. zeroPad=2 -> "00", "01", ...
		//		Ex. zeroPad=3 -> "000", "001", ...
		zeroPad: 0,

		// value: String
		//		The initial value of the value picker.
		value: "",

		// step: Number
		//		The steps between labelFrom and labelTo.
		step: 1,

		// readOnly: Boolean
		//		A flag used to indicate if the input field is readonly or not.
		readOnly: false,

		// tabIndex: String
		//		Tabindex setting for this widget so users can hit the tab key to
		//		focus on it.
		tabIndex: "0",

		/* internal properties */	
		baseClass: "mblValuePickerSlot",

		buildRendering: function(){
			this.inherited(arguments);

			this.initLabels();
			if(this.labels.length > 0){
				this.items = [];
				for(i = 0; i < this.labels.length; i++){
					this.items.push([i, this.labels[i]]);
				}
			}

			this.plusBtnNode = domConstruct.create("div", {
				className: "mblValuePickerSlotPlusButton mblValuePickerSlotButton",
				title: "+"
			}, this.domNode);
			this.plusIconNode = domConstruct.create("div", {
				className: "mblValuePickerSlotIcon"
			}, this.plusBtnNode);
			iconUtils.createIcon("mblDomButtonGrayPlus", null, this.plusIconNode);

			this.inputAreaNode = domConstruct.create("div", {
				className: "mblValuePickerSlotInputArea"
			}, this.domNode);
			this.inputNode = domConstruct.create("input", {
				className: "mblValuePickerSlotInput",
				readonly: this.readOnly
			}, this.inputAreaNode);

			this.minusBtnNode = domConstruct.create("div", {
				className: "mblValuePickerSlotMinusButton mblValuePickerSlotButton",
				title: "-"
			}, this.domNode);
			this.minusIconNode = domConstruct.create("div", {
				className: "mblValuePickerSlotIcon"
			}, this.minusBtnNode);
			iconUtils.createIcon("mblDomButtonGrayMinus", null, this.minusIconNode);

			if(this.value === "" && this.items.length > 0){
				this.value = this.items[0][1];
			}
			this._initialValue = this.value;
		},

		startup: function(){
			if(this._started){ return; }
			this._handlers = [
				this.connect(this.plusBtnNode, touch.press, "_onTouchStart"),
				this.connect(this.minusBtnNode, touch.press, "_onTouchStart"),
				this.connect(this.plusBtnNode, "onkeydown", "_onClick"), // for desktop browsers
				this.connect(this.minusBtnNode, "onkeydown", "_onClick"), // for desktop browsers
				this.connect(this.inputNode, "onchange", lang.hitch(this, function(e){
					this._onChange(e);
				}))
			];
			this.inherited(arguments);
		},

		initLabels: function(){
			if(this.labelFrom !== this.labelTo){
				var a = this.labels = [],
					zeros = this.zeroPad && Array(this.zeroPad).join("0");
				for(var i = this.labelFrom; i <= this.labelTo; i += this.step){
					a.push(this.zeroPad ? (zeros + i).slice(-this.zeroPad) : i + "");
				}
			}
		},

		spin: function(/*Number*/steps){
			// summary:
			//		Spins the slot as specified by steps.

			// find the position of the current value
			var pos = -1,
				v = this.get("value"),
				len = this.items.length;
			for(var i = 0; i < len; i++){
				if(this.items[i][1] === v){
					pos = i;
					break;
				}
			}
			if(v == -1){ return; }
			pos += steps;
			if(pos < 0){ // shift to positive
				pos += (Math.abs(Math.ceil(pos / len)) + 1) * len;
			}
			var newItem = this.items[pos % len];
			this.set("value", newItem[1]);
		},

		setInitialValue: function(){
			// summary:
			//		Sets the initial value using this.value or the first item.
			this.set("value", this._initialValue);
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			var node = e.currentTarget;
			if(node === this.plusBtnNode || node === this.minusBtnNode){
				this._btn = node;
			}
			this.spin(this._btn === this.plusBtnNode ? 1 : -1);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_onChange: function(e){
			// summary:
			//		Internal handler for the input field's value change events
			// tags:
			//		callback
			if(this.onChange(e) === false){ return; } // user's click action
			var v = this.get("value"), // text in the input field
				a = this.validate(v);
			this.set("value", a.length ? a[0][1] : this.value);
		},

		onChange: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle value changes
			// tags:
			//		callback
		},

		validate: function(value){
			return array.filter(this.items, function(a){
				return (a[1] + "").toLowerCase() == (value + "").toLowerCase();
			});
		},

		_onTouchStart: function(e){
			this._conn = [
				this.connect(win.body(), touch.move, "_onTouchMove"),
				this.connect(win.body(), touch.release, "_onTouchEnd")
			];
			this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
			this.touchStartY = e.touches ? e.touches[0].pageY : e.clientY;
			domClass.add(e.currentTarget, "mblValuePickerSlotButtonSelected");
			this._btn = e.currentTarget;
			if(this._interval){
				clearTimeout(this._interval); // fail safe
				this._interval = null;
			}
			this._timer = setTimeout(lang.hitch(this, function(){
				this._interval = setInterval(lang.hitch(this, function(){
					this.spin(this._btn === this.plusBtnNode ? 1 : -1);
				}), 60);
				this._timer = null;
			}), 1000);
			event.stop(e);
		},

		_onTouchMove: function(e){
			var x = e.touches ? e.touches[0].pageX : e.clientX;
			var y = e.touches ? e.touches[0].pageY : e.clientY;
			if(Math.abs(x - this.touchStartX) >= 4 ||
			   Math.abs(y - this.touchStartY) >= 4){ // dojox.mobile.scrollable#threshold
				if(this._interval){
					clearTimeout(this._interval);
					this._interval = null;
				}
				array.forEach(this._conn, this.disconnect, this);
				domClass.remove(this._btn, "mblValuePickerSlotButtonSelected");
			}
		},

		_onTouchEnd: function(e){
			if(this._timer){
				clearTimeout(this._timer);
				this._timer = null;
			}
			array.forEach(this._conn, this.disconnect, this);
			domClass.remove(this._btn, "mblValuePickerSlotButtonSelected");
			if(this._interval){
				clearTimeout(this._interval);
				this._interval = null;
			}else{
				this._onClick(e);
			}
		},

		_getKeyAttr: function(){
			var val = this.get("value");
			var item = array.filter(this.items, function(item){
				return item[1] === val;
			})[0];
			return item ? item[0] : null;
		},

		_getValueAttr: function(){
			// summary:
			//		Gets the currently selected value.
			return this.inputNode.value;
		},

		_setValueAttr: function(value){
			// summary:
			//		Sets the newValue to this slot.
			this.inputNode.value = value;
			this._set("value", value);
			var parent = this.getParent();
			if(parent && parent.onValueChanged){
				parent.onValueChanged(this);
			}
		},

		_setTabIndexAttr: function(/*String*/ tabIndex){
			this.plusBtnNode.setAttribute("tabIndex", tabIndex);
			this.minusBtnNode.setAttribute("tabIndex", tabIndex);
		}
	});
});

},
'dojox/mobile/TabBar':function(){
define("dojox/mobile/TabBar", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./TabBarButton" // to load TabBarButton for you (no direct references)
], function(array, declare, win, domClass, domConstruct, domGeometry, domStyle, Contained, Container, WidgetBase, TabBarButton){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/TabBar
	// summary:
	//		A bar widget that has buttons to control visibility of views.

	return declare("dojox.mobile.TabBar", [WidgetBase, Container, Contained],{
		// summary:
		//		A bar widget that has buttons to control visibility of views.
		// description:
		//		TabBar is a container widget that has typically multiple
		//		TabBarButtons which controls visibility of views. It can be used
		//		as a tab container.

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// barType: String
		//		"tabBar", "segmentedControl", "standardTab", "slimTab", "flatTab",
		//		or "tallTab"
		barType: "tabBar",

		// closable: Boolean
		//		True if user can close (destroy) a child tab by clicking the X on the tab.
		//		This property is NOT effective for "tabBar" and "tallBar".
		closable: false,

		// center: Boolean
		//		If true, place the tabs in the center of the bar.
		//		This property is NOT effective for "tabBar".
		center: true,

		// syncWithViews: Boolean
		//		True if this widget listens to view transition events to be
		//		synchronized with view's visibility.
		syncWithViews: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		/* internal properties */	
		selectOne: true,
		baseClass: "mblTabBar",
		_fixedButtonWidth: 76,
		_fixedButtonMargin: 17,
		_largeScreenWidth: 500,

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.reset();
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.syncWithViews){ // see also RoundRect#postCreate
				var f = function(view, moveTo, dir, transition, context, method){
					var child = array.filter(this.getChildren(), function(w){
						return w.moveTo === "#" + view.id || w.moveTo === view.id; })[0];
					if(child){ child.set("selected", true); }
				};
				this.subscribe("/dojox/mobile/afterTransitionIn", f);
				this.subscribe("/dojox/mobile/startView", f);
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.resize();
		},

		reset: function(){
			var prev = this._barType;
			if(typeof this.barType === "object"){
				this._barType = this.barType["*"];
				for(var c in this.barType){
					if(domClass.contains(win.doc.documentElement, c)){
						this._barType = this.barType[c];
						break;
					}
				}
			}else{
				this._barType = this.barType;
			}
			var cap = function(s){
				return s.charAt(0).toUpperCase() + s.substring(1);
			};
			if(prev){
				domClass.remove(this.domNode, this.baseClass + cap(prev));
			}
			domClass.add(this.domNode, this.baseClass + cap(this._barType));
		},

		resize: function(size){
			var i, w;
			if(size && size.w){
				domGeometry.setMarginBox(this.domNode, size);
				w = size.w;
			}else{
				// Calculation of the bar width varies according to its "position" value.
				// When the widget is used as a fixed bar, its position would be "absolute".
				w = domStyle.get(this.domNode, "position") === "absolute" ?
					domGeometry.getContentBox(this.domNode).w : domGeometry.getMarginBox(this.domNode).w;
			}
			var bw = this._fixedButtonWidth;
			var bm = this._fixedButtonMargin;
			var arr = dojo.map(this.getChildren(), function(w){ return w.domNode; });

			domClass.toggle(this.domNode, "mblTabBarNoIcons",
							!array.some(this.getChildren(), function(w){ return w.iconNode1; }));
			domClass.toggle(this.domNode, "mblTabBarNoText",
							!array.some(this.getChildren(), function(w){ return w.label; }));

			var margin = 0;
			if (this._barType == "tabBar"){
				this.containerNode.style.paddingLeft = "";
				margin = Math.floor((w - (bw + bm * 2) * arr.length) / 2);
				if(w < this._largeScreenWidth || margin < 0){
					// If # of buttons is 4, for example, assign "25%" to each button.
					// More precisely, 1%(left margin) + 98%(bar width) + 1%(right margin)
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = Math.round(98/arr.length) + "%";
						arr[i].style.margin = "0";
					}
				}else{
					// Fixed width buttons. Mainly for larger screen such as iPad.
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = bw + "px";
						arr[i].style.margin = "0 " + bm + "px";
					}
					if(arr.length > 0){
						arr[0].style.marginLeft = margin + bm + "px";
					}
				}
			}else{
				for(i = 0; i < arr.length; i++){
					arr[i].style.width = arr[i].style.margin = "";
				}
				var parent = this.getParent();
				if(this.center && (!parent || !domClass.contains(parent.domNode, "mblHeading"))){
					margin = w;
					for(i = 0; i < arr.length; i++){
						margin -= domGeometry.getMarginBox(arr[i]).w;
					}
					margin = Math.floor(margin/2);
				}
				this.containerNode.style.paddingLeft = margin ? margin + "px" : "";
			}
		},

		getSelectedTab: function(){
			return array.filter(this.getChildren(), function(w){ return w.selected; })[0];
		},

		onCloseButtonClick: function(/*TabBarButton*/tab){
			// summary:
			//		Called whenever the close button [X] of a child tab is clicked.
			return true;
		}
	});
});

},
'dojox/mobile/scrollable':function(){


define("dojox/mobile/scrollable", [
	"dojo/_base/kernel",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff"
], function(dojo, connect, event, lang, win, domClass, domConstruct, domStyle, has){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
// summary:
//		Utility for enabling touch scrolling capability.
// description:
//		Mobile WebKit browsers do not allow scrolling inner DIVs. (You need
//		the two-finger operation to scroll them.)
//		That means you cannot have fixed-positioned header/footer bars.
//		To solve this issue, this module disables the browsers default scrolling
//		behavior, and re-builds its own scrolling machinery by handling touch
//		events. In this module, this.domNode has height "100%" and is fixed to
//		the window, and this.containerNode scrolls. If you place a bar outside
//		of this.containerNode, then it will be fixed-positioned while
//		this.containerNode is scrollable.
//
//		This module has the following features:
//		- Scrolls inner DIVs vertically, horizontally, or both.
//		- Vertical and horizontal scroll bars.
//		- Flashes the scroll bars when a view is shown.
//		- Simulates the flick operation using animation.
//		- Respects header/footer bars if any.
//
//		dojox.mobile.scrollable is a simple function object, which holds
//		several properties and functions in it. But if you transform it to a
//		dojo class, it can be used as a mix-in class for any custom dojo
//		widgets. dojox.mobile._ScrollableMixin is such a class.
//
//		Also, it can be used even for non-dojo applications. In such cases,
//		several dojo APIs used in this module, such as dojo.connect,
//		dojo.create, etc., are re-defined so that the code works without dojo.
//		When in dojo, of course those re-defined functions are not necessary.
//		So, they are surrounded by the includeStart and includeEnd directives
//		so that they can be excluded from the build.
//
//		If you use this module for non-dojo application, you need to explicitly
//		assign your outer fixed node and inner scrollable node to this.domNode
//		and this.containerNode respectively.
//
//		Non-dojo application should capture the onorientationchange or
//		the onresize event and call resize() in the event handler.
//
// example:
//		Use this module from a non-dojo applicatoin:
//		| function onLoad(){
//		| 	var scrollable = new dojox.mobile.scrollable(dojo, dojox);
//		| 	scrollable.init({
//		| 		domNode: "outer", // id or node
//		| 		containerNode: "inner" // id or node
//		| 	});
//		| }
//		| <body onload="onLoad()">
//		| 	<h1 id="hd1" style="position:relative;width:100%;z-index:1;">
//		| 		Fixed Header
//		| 	</h1>
//		| 	<div id="outer" style="position:relative;height:100%;overflow:hidden;">
//		| 		<div id="inner" style="position:absolute;width:100%;">
//		| 			... content ...
//		| 		</div>
//		| 	</div>
//		| </body>
=====*/

var scrollable = function(/*Object?*/dojo, /*Object?*/dojox){
	this.fixedHeaderHeight = 0; // height of a fixed header
	this.fixedFooterHeight = 0; // height of a fixed footer
	this.isLocalFooter = false; // footer is view-local (as opposed to application-wide)
	this.scrollBar = true; // show scroll bar or not
	this.scrollDir = "v"; // v: vertical, h: horizontal, vh: both, f: flip
	this.weight = 0.6; // frictional drag
	this.fadeScrollBar = true;
	this.disableFlashScrollBar = false;
	this.threshold = 4; // drag threshold value in pixels
	this.constraint = true; // bounce back to the content area
	this.touchNode = null; // a node that will have touch event handlers
	this.propagatable = true; // let touchstart event propagate up
	this.dirLock = false; // disable the move handler if scroll starts in the unexpected direction
	this.height = ""; // explicitly specified height of this widget (ex. "300px")
	this.scrollType = 0; // 1: use -webkit-transform:translate3d(x,y,z) style,
						 // 2: use top/left style,
						 // 0: use default value (2 in case of Android, otherwise 1)


	this.init = function(/*Object?*/params){
		if(params){
			for(var p in params){
				if(params.hasOwnProperty(p)){
					this[p] = ((p == "domNode" || p == "containerNode") && typeof params[p] == "string") ?
						win.doc.getElementById(params[p]) : params[p]; // mix-in params
				}
			}
		}
		this.touchNode = this.touchNode || this.containerNode;
		this._v = (this.scrollDir.indexOf("v") != -1); // vertical scrolling
		this._h = (this.scrollDir.indexOf("h") != -1); // horizontal scrolling
		this._f = (this.scrollDir == "f"); // flipping views

		this._ch = []; // connect handlers
		this._ch.push(connect.connect(this.touchNode,
			has("touch") ? "ontouchstart" : "onmousedown", this, "onTouchStart"));
		if(has("webkit")){
			// flag for whether to use -webkit-transform:translate3d(x,y,z) or top/left style.
			// top/left style works fine as a workaround for input fields auto-scrolling issue,
			// so use top/left in case of Android by default.
			this._useTopLeft = this.scrollType ? this.scrollType === 2 : has("android") < 3;
			if(!this._useTopLeft){
				this._ch.push(connect.connect(this.domNode, "webkitAnimationEnd", this, "onFlickAnimationEnd"));
				this._ch.push(connect.connect(this.domNode, "webkitAnimationStart", this, "onFlickAnimationStart"));

				// Creation of keyframes takes a little time. If they are created
				// in a lazy manner, a slight delay is noticeable when you start
				// scrolling for the first time. This is to create keyframes up front.
				for(var i = 0; i < 3; i++){
					this.setKeyframes(null, null, i);
				}
				if(dm.hasTranslate3d){ // workaround for flicker issue on iPhone and Android 3.x/4.0
					domStyle.set(this.containerNode, "webkitTransform", "translate3d(0,0,0)");
				}
			}else{
				this._ch.push(connect.connect(this.domNode, "webkitTransitionEnd", this, "onFlickAnimationEnd"));
				this._ch.push(connect.connect(this.domNode, "webkitTransitionStart", this, "onFlickAnimationStart"));
			}
		}

		this._speed = {x:0, y:0};
		this._appFooterHeight = 0;
		if(this.isTopLevel() && !this.noResize){
			this.resize();
		}
		var _this = this;
		setTimeout(function(){
			_this.flashScrollBar();
		}, 600);
	};

	this.isTopLevel = function(){
		// subclass may want to override
		return true;
	};

	this.cleanup = function(){
		if(this._ch){
			for(var i = 0; i < this._ch.length; i++){
				connect.disconnect(this._ch[i]);
			}
			this._ch = null;
		}
	};

	this.findDisp = function(/*DomNode*/node){
		// summary:
		//		Finds the currently displayed view node from my sibling nodes.
		if(!node.parentNode){ return null; }
		var nodes = node.parentNode.childNodes;
		for(var i = 0; i < nodes.length; i++){
			var n = nodes[i];
			if(n.nodeType === 1 && domClass.contains(n, "mblView") && n.style.display !== "none"){
				return n;
			}
		}
		return node;
	};

	this.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight||win.doc.documentElement.clientHeight||win.doc.documentElement.offsetHeight,
			w: win.global.innerWidth||win.doc.documentElement.clientWidth||win.doc.documentElement.offsetWidth
		};
	};

	this.resize = function(e){
		// summary:
		//		Adjusts the height of the widget.
		// description:
		//		If the height property is 'inherit', the height is inherited
		//		from its offset parent. If 'auto', the content height, which
		//		could be smaller than the entire screen height, is used. If an
		//		explicit height value (ex. "300px"), it is used as the new
		//		height. If nothing is specified as the height property, from the
		//		current top position of the widget to the bottom of the screen
		//		will be the new height.

		// moved from init() to support dynamically added fixed bars
		this._appFooterHeight = (this.fixedFooterHeight && !this.isLocalFooter) ?
			this.fixedFooterHeight : 0;
		if(this.isLocalHeader){
			this.containerNode.style.marginTop = this.fixedHeaderHeight + "px";
		}

		// Get the top position. Same as dojo.position(node, true).y
		var top = 0;
		for(var n = this.domNode; n && n.tagName != "BODY"; n = n.offsetParent){
			n = this.findDisp(n); // find the first displayed view node
			if(!n){ break; }
			top += n.offsetTop;
		}

		// adjust the height of this view
		var	h,
			screenHeight = this.getScreenSize().h,
			dh = screenHeight - top - this._appFooterHeight; // default height
		if(this.height === "inherit"){
			if(this.domNode.offsetParent){
				h = this.domNode.offsetParent.offsetHeight + "px";
			}
		}else if(this.height === "auto"){
			var parent = this.domNode.offsetParent;
			if(parent){
				this.domNode.style.height = "0px";
				var	parentRect = parent.getBoundingClientRect(),
					scrollableRect = this.domNode.getBoundingClientRect(),
					contentBottom = parentRect.bottom - this._appFooterHeight;
				if(scrollableRect.bottom >= contentBottom){ // use entire screen
					dh = screenHeight - (scrollableRect.top - parentRect.top) - this._appFooterHeight;
				}else{ // stretch to fill predefined area
					dh = contentBottom - scrollableRect.bottom;
				}
			}
			// content could be smaller than entire screen height
			var contentHeight = Math.max(this.domNode.scrollHeight, this.containerNode.scrollHeight);
			h = (contentHeight ? Math.min(contentHeight, dh) : dh) + "px";
		}else if(this.height){
			h = this.height;
		}
		if(!h){
			h = dh + "px";
		}
		if(h.charAt(0) !== "-" && // to ensure that h is not negative (e.g. "-10px")
			h !== "default"){
			this.domNode.style.height = h;
		}

		// to ensure that the view is within a scrolling area when resized.
		this.onTouchEnd();
	};

	this.onFlickAnimationStart = function(e){
		event.stop(e);
	};

	this.onFlickAnimationEnd = function(e){
		var an = e && e.animationName;
		if(an && an.indexOf("scrollableViewScroll2") === -1){
			if(an.indexOf("scrollableViewScroll0") !== -1){ // scrollBarV
				if(this._scrollBarNodeV){ domClass.remove(this._scrollBarNodeV, "mblScrollableScrollTo0"); }
			}else if(an.indexOf("scrollableViewScroll1") !== -1){ // scrollBarH
				if(this._scrollBarNodeH){ domClass.remove(this._scrollBarNodeH, "mblScrollableScrollTo1"); }
			}else{ // fade or others
				if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
				if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
			}
			return;
		}
		if(this._useTopLeft){
			var n = e.target;
			if(n === this._scrollBarV || n === this._scrollBarH){
				var cls = "mblScrollableScrollTo" + (n === this._scrollBarV ? "0" : "1");
				if(domClass.contains(n, cls)){
					domClass.remove(n, cls);
				}else{
					n.className = "";
				}
				return;
			}
		}
		if(e && e.srcElement){
			event.stop(e);
		}
		this.stopAnimation();
		if(this._bounce){
			var _this = this;
			var bounce = _this._bounce;
			setTimeout(function(){
				_this.slideTo(bounce, 0.3, "ease-out");
			}, 0);
			_this._bounce = undefined;
		}else{
			this.hideScrollBar();
			this.removeCover();
		}
	};

	this.isFormElement = function(node){
		if(node && node.nodeType !== 1){ node = node.parentNode; }
		if(!node || node.nodeType !== 1){ return false; }
		var t = node.tagName;
		return (t === "SELECT" || t === "INPUT" || t === "TEXTAREA" || t === "BUTTON");
	};

	this.onTouchStart = function(e){
		if(this.disableTouchScroll){ return; }
		if(this._conn && (new Date()).getTime() - this.startTime < 500){
			return; // ignore successive onTouchStart calls
		}
		if(!this._conn){
			this._conn = [];
			this._conn.push(connect.connect(win.doc, has("touch") ? "ontouchmove" : "onmousemove", this, "onTouchMove"));
			this._conn.push(connect.connect(win.doc, has("touch") ? "ontouchend" : "onmouseup", this, "onTouchEnd"));
		}

		this._aborted = false;
		if(domClass.contains(this.containerNode, "mblScrollableScrollTo2")){
			this.abort();
		}else{ // reset scrollbar class especially for reseting fade-out animation
			if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
			if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
		}
		this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
		this.touchStartY = e.touches ? e.touches[0].pageY : e.clientY;
		this.startTime = (new Date()).getTime();
		this.startPos = this.getPos();
		this._dim = this.getDim();
		this._time = [0];
		this._posX = [this.touchStartX];
		this._posY = [this.touchStartY];
		this._locked = false;

		if(!this.isFormElement(e.target)){
			this.propagatable ? e.preventDefault() : event.stop(e);
		}
	};

	this.onTouchMove = function(e){
		if(this._locked){ return; }
		var x = e.touches ? e.touches[0].pageX : e.clientX;
		var y = e.touches ? e.touches[0].pageY : e.clientY;
		var dx = x - this.touchStartX;
		var dy = y - this.touchStartY;
		var to = {x:this.startPos.x + dx, y:this.startPos.y + dy};
		var dim = this._dim;

		dx = Math.abs(dx);
		dy = Math.abs(dy);
		if(this._time.length == 1){ // the first TouchMove after TouchStart
			if(this.dirLock){
				if(this._v && !this._h && dx >= this.threshold && dx >= dy ||
					(this._h || this._f) && !this._v && dy >= this.threshold && dy >= dx){
					this._locked = true;
					return;
				}
			}
			if(this._v && Math.abs(dy) < this.threshold ||
				(this._h || this._f) && Math.abs(dx) < this.threshold){
				return;
			}
			this.addCover();
			this.showScrollBar();
		}

		var weight = this.weight;
		if(this._v && this.constraint){
			if(to.y > 0){ // content is below the screen area
				to.y = Math.round(to.y * weight);
			}else if(to.y < -dim.o.h){ // content is above the screen area
				if(dim.c.h < dim.d.h){ // content is shorter than display
					to.y = Math.round(to.y * weight);
				}else{
					to.y = -dim.o.h - Math.round((-dim.o.h - to.y) * weight);
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){
				to.x = Math.round(to.x * weight);
			}else if(to.x < -dim.o.w){
				if(dim.c.w < dim.d.w){
					to.x = Math.round(to.x * weight);
				}else{
					to.x = -dim.o.w - Math.round((-dim.o.w - to.x) * weight);
				}
			}
		}
		this.scrollTo(to);

		var max = 10;
		var n = this._time.length; // # of samples
		if(n >= 2){
			// Check the direction of the finger move.
			// If the direction has been changed, discard the old data.
			var d0, d1;
			if(this._v && !this._h){
				d0 = this._posY[n - 1] - this._posY[n - 2];
				d1 = y - this._posY[n - 1];
			}else if(!this._v && this._h){
				d0 = this._posX[n - 1] - this._posX[n - 2];
				d1 = x - this._posX[n - 1];
			}
			if(d0 * d1 < 0){ // direction changed
				// leave only the latest data
				this._time = [this._time[n - 1]];
				this._posX = [this._posX[n - 1]];
				this._posY = [this._posY[n - 1]];
				n = 1;
			}
		}
		if(n == max){
			this._time.shift();
			this._posX.shift();
			this._posY.shift();
		}
		this._time.push((new Date()).getTime() - this.startTime);
		this._posX.push(x);
		this._posY.push(y);
	};

	this.onTouchEnd = function(e){
		if(this._locked){ return; }
		var speed = this._speed = {x:0, y:0};
		var dim = this._dim;
		var pos = this.getPos();
		var to = {}; // destination
		if(e){
			if(!this._conn){ return; } // if we get onTouchEnd without onTouchStart, ignore it.
			for(var i = 0; i < this._conn.length; i++){
				connect.disconnect(this._conn[i]);
			}
			this._conn = null;

			var n = this._time.length; // # of samples
			var clicked = false;
			if(!this._aborted){
				if(n <= 1){
					clicked = true;
				}else if(n == 2 && Math.abs(this._posY[1] - this._posY[0]) < 4
					&& has("touch")){ // for desktop browsers, posY could be the same, since we're using clientY, see onTouchMove()
					clicked = true;
				}
			}
			if(clicked){ // clicked, not dragged or flicked
				this.hideScrollBar();
				this.removeCover();
				// #12697 Do not generate a click event programmatically when a
				// form element (input, select, etc.) is clicked.
				// Otherwise, in particular, when checkbox is clicked, its state
				// is reversed again by the generated event.
				if(has("touch") && !this.isFormElement(e.target)){
					var elem = e.target;
					if(elem.nodeType != 1){
						elem = elem.parentNode;
					}
					var ev = win.doc.createEvent("MouseEvents");
					ev.initMouseEvent("click", true, true, win.global, 1, e.screenX, e.screenY, e.clientX, e.clientY);
					setTimeout(function(){
						elem.dispatchEvent(ev);
					}, 0);
				}
				return;
			}
			speed = this._speed = this.getSpeed();
		}else{
			if(pos.x == 0 && pos.y == 0){ return; } // initializing
			dim = this.getDim();
		}

		if(this._v){
			to.y = pos.y + speed.y;
		}
		if(this._h || this._f){
			to.x = pos.x + speed.x;
		}

		if(this.adjustDestination(to, pos, dim) === false){ return; }

		if(this.scrollDir == "v" && dim.c.h < dim.d.h){ // content is shorter than display
			this.slideTo({y:0}, 0.3, "ease-out"); // go back to the top
			return;
		}else if(this.scrollDir == "h" && dim.c.w < dim.d.w){ // content is narrower than display
			this.slideTo({x:0}, 0.3, "ease-out"); // go back to the left
			return;
		}else if(this._v && this._h && dim.c.h < dim.d.h && dim.c.w < dim.d.w){
			this.slideTo({x:0, y:0}, 0.3, "ease-out"); // go back to the top-left
			return;
		}

		var duration, easing = "ease-out";
		var bounce = {};
		if(this._v && this.constraint){
			if(to.y > 0){ // going down. bounce back to the top.
				if(pos.y > 0){ // started from below the screen area. return quickly.
					duration = 0.3;
					to.y = 0;
				}else{
					to.y = Math.min(to.y, 20);
					easing = "linear";
					bounce.y = 0;
				}
			}else if(-speed.y > dim.o.h - (-pos.y)){ // going up. bounce back to the bottom.
				if(pos.y < -dim.o.h){ // started from above the screen top. return quickly.
					duration = 0.3;
					to.y = dim.c.h <= dim.d.h ? 0 : -dim.o.h; // if shorter, move to 0
				}else{
					to.y = Math.max(to.y, -dim.o.h - 20);
					easing = "linear";
					bounce.y = -dim.o.h;
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){ // going right. bounce back to the left.
				if(pos.x > 0){ // started from right of the screen area. return quickly.
					duration = 0.3;
					to.x = 0;
				}else{
					to.x = Math.min(to.x, 20);
					easing = "linear";
					bounce.x = 0;
				}
			}else if(-speed.x > dim.o.w - (-pos.x)){ // going left. bounce back to the right.
				if(pos.x < -dim.o.w){ // started from left of the screen top. return quickly.
					duration = 0.3;
					to.x = dim.c.w <= dim.d.w ? 0 : -dim.o.w; // if narrower, move to 0
				}else{
					to.x = Math.max(to.x, -dim.o.w - 20);
					easing = "linear";
					bounce.x = -dim.o.w;
				}
			}
		}
		this._bounce = (bounce.x !== undefined || bounce.y !== undefined) ? bounce : undefined;

		if(duration === undefined){
			var distance, velocity;
			if(this._v && this._h){
				velocity = Math.sqrt(speed.x*speed.x + speed.y*speed.y);
				distance = Math.sqrt(Math.pow(to.y - pos.y, 2) + Math.pow(to.x - pos.x, 2));
			}else if(this._v){
				velocity = speed.y;
				distance = to.y - pos.y;
			}else if(this._h){
				velocity = speed.x;
				distance = to.x - pos.x;
			}
			if(distance === 0 && !e){ return; } // #13154
			duration = velocity !== 0 ? Math.abs(distance / velocity) : 0.01; // time = distance / velocity
		}
		this.slideTo(to, duration, easing);
	};

	this.adjustDestination = function(to, pos, dim){
		// subclass may want to implement
		return true;
	};

	this.abort = function(){
		this.scrollTo(this.getPos());
		this.stopAnimation();
		this._aborted = true;
	};

	this.stopAnimation = function(){
		// stop the currently running animation
		domClass.remove(this.containerNode, "mblScrollableScrollTo2");
		if(this._scrollBarV){
			this._scrollBarV.className = "";
		}
		if(this._scrollBarH){
			this._scrollBarH.className = "";
		}
		if(this._useTopLeft){
			this.containerNode.style.webkitTransition = "";
			if(this._scrollBarV) { this._scrollBarV.style.webkitTransition = ""; }
			if(this._scrollBarH) { this._scrollBarH.style.webkitTransition = ""; }
		}
	};

	this.scrollIntoView = function(/*DOMNode*/node, /*Boolean?*/alignWithTop, /*number?*/duration){
		if(!this._v){ return; } // cannot scroll vertically
		
		var c = this.containerNode,
			h = this.getDim().d.h, // the height of ScrollableView's content display area
			top = 0;
		
		// Get the top position of node relative to containerNode
		for(var n = node; n !== c; n = n.offsetParent){
			if(!n || n.tagName === "BODY"){ return; } // exit if node is not a child of scrollableView
			top += n.offsetTop;
		}
		// Calculate scroll destination position
		var y = alignWithTop ? Math.max(h - c.offsetHeight, -top) : Math.min(0, h - top - node.offsetHeight);
		
		// Scroll to destination position
		(duration && typeof duration === "number") ? 
			this.slideTo({y: y}, duration, "ease-out") : this.scrollTo({y: y});
	};

	this.getSpeed = function(){
		var x = 0, y = 0, n = this._time.length;
		// if the user holds the mouse or finger more than 0.5 sec, do not move.
		if(n >= 2 && (new Date()).getTime() - this.startTime - this._time[n - 1] < 500){
			var dy = this._posY[n - (n > 3 ? 2 : 1)] - this._posY[(n - 6) >= 0 ? n - 6 : 0];
			var dx = this._posX[n - (n > 3 ? 2 : 1)] - this._posX[(n - 6) >= 0 ? n - 6 : 0];
			var dt = this._time[n - (n > 3 ? 2 : 1)] - this._time[(n - 6) >= 0 ? n - 6 : 0];
			y = this.calcSpeed(dy, dt);
			x = this.calcSpeed(dx, dt);
		}
		return {x:x, y:y};
	};

	this.calcSpeed = function(/*Number*/d, /*Number*/t){
		return Math.round(d / t * 100) * 4;
	};

	this.scrollTo = function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node){ // to: {x, y}
		// summary:
		//		Scrolls to the given position.
		var s = (node || this.containerNode).style;
		if(has("webkit")){
			if(!this._useTopLeft){
				s.webkitTransform = this.makeTranslateStr(to);
			}else{
				s.webkitTransition = "";
				if(this._v){
					s.top = to.y + "px";
				}
				if(this._h || this._f){
					s.left = to.x + "px";
				}
			}
		}else{
			if(this._v){
				s.top = to.y + "px";
			}
			if(this._h || this._f){
				s.left = to.x + "px";
			}
		}
		if(!doNotMoveScrollBar){
			this.scrollScrollBarTo(this.calcScrollBarPos(to));
		}
	};

	this.slideTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		// summary:
		//		Scrolls to the given position with slide animation.
		this._runSlideAnimation(this.getPos(), to, duration, easing, this.containerNode, 2);
		this.slideScrollBarTo(to, duration, easing);
	};

	this.makeTranslateStr = function(to){
		var y = this._v && typeof to.y == "number" ? to.y+"px" : "0px";
		var x = (this._h||this._f) && typeof to.x == "number" ? to.x+"px" : "0px";
		return dm.hasTranslate3d ?
				"translate3d("+x+","+y+",0px)" : "translate("+x+","+y+")";
	};

	this.getPos = function(){
		// summary:
		//		Get the top position in the midst of animation
		if(has("webkit")){
			var s = win.doc.defaultView.getComputedStyle(this.containerNode, '');
			if(!this._useTopLeft){
				var m = s["-webkit-transform"];
				if(m && m.indexOf("matrix") === 0){
					var arr = m.split(/[,\s\)]+/);
					return {y:arr[5] - 0, x:arr[4] - 0};
				}
				return {x:0, y:0};
			}else{
				return {x:parseInt(s.left) || 0, y:parseInt(s.top) || 0};
			}
		}else{
			// this.containerNode.offsetTop does not work here,
			// because it adds the height of the top margin.
			var y = parseInt(this.containerNode.style.top) || 0;
			return {y:y, x:this.containerNode.offsetLeft};
		}
	};

	this.getDim = function(){
		var d = {};
		// content width/height
		d.c = {h:this.containerNode.offsetHeight, w:this.containerNode.offsetWidth};

		// view width/height
		d.v = {h:this.domNode.offsetHeight + this._appFooterHeight, w:this.domNode.offsetWidth};

		// display width/height
		d.d = {h:d.v.h - this.fixedHeaderHeight - this.fixedFooterHeight, w:d.v.w};

		// overflowed width/height
		d.o = {h:d.c.h - d.v.h + this.fixedHeaderHeight + this.fixedFooterHeight, w:d.c.w - d.v.w};
		return d;
	};

	this.showScrollBar = function(){
		if(!this.scrollBar){ return; }

		var dim = this._dim;
		if(this.scrollDir == "v" && dim.c.h <= dim.d.h){ return; }
		if(this.scrollDir == "h" && dim.c.w <= dim.d.w){ return; }
		if(this._v && this._h && dim.c.h <= dim.d.h && dim.c.w <= dim.d.w){ return; }

		var createBar = function(self, dir){
			var bar = self["_scrollBarNode" + dir];
			if(!bar){
				var wrapper = domConstruct.create("div", null, self.domNode);
				var props = { position: "absolute", overflow: "hidden" };
				if(dir == "V"){
					props.right = "2px";
					props.width = "5px";
				}else{
					props.bottom = (self.isLocalFooter ? self.fixedFooterHeight : 0) + 2 + "px";
					props.height = "5px";
				}
				domStyle.set(wrapper, props);
				wrapper.className = "mblScrollBarWrapper";
				self["_scrollBarWrapper"+dir] = wrapper;

				bar = domConstruct.create("div", null, wrapper);
				domStyle.set(bar, {
					opacity: 0.6,
					position: "absolute",
					backgroundColor: "#606060",
					fontSize: "1px",
					webkitBorderRadius: "2px",
					MozBorderRadius: "2px",
					webkitTransformOrigin: "0 0",
					zIndex: 2147483647 // max of signed 32-bit integer
				});
				domStyle.set(bar, dir == "V" ? {width: "5px"} : {height: "5px"});
				self["_scrollBarNode" + dir] = bar;
			}
			return bar;
		};
		if(this._v && !this._scrollBarV){
			this._scrollBarV = createBar(this, "V");
		}
		if(this._h && !this._scrollBarH){
			this._scrollBarH = createBar(this, "H");
		}
		this.resetScrollBar();
	};

	this.hideScrollBar = function(){
		if(this.fadeScrollBar && has("webkit")){
			if(!dm._fadeRule){
				var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
				node.textContent =
					".mblScrollableFadeScrollBar{"+
					"  -webkit-animation-duration: 1s;"+
					"  -webkit-animation-name: scrollableViewFadeScrollBar;}"+
					"@-webkit-keyframes scrollableViewFadeScrollBar{"+
					"  from { opacity: 0.6; }"+
					"  to { opacity: 0; }}";
				dm._fadeRule = node.sheet.cssRules[1];
			}
		}
		if(!this.scrollBar){ return; }
		var f = function(bar, self){
			domStyle.set(bar, {
				opacity: 0,
				webkitAnimationDuration: ""
			});
			// do not use fade animation in case of using top/left on Android
			// since it causes screen flicker during adress bar's fading out
			if(!(self._useTopLeft && has("android"))){
				bar.className = "mblScrollableFadeScrollBar";
			}
		};
		if(this._scrollBarV){
			f(this._scrollBarV, this);
			this._scrollBarV = null;
		}
		if(this._scrollBarH){
			f(this._scrollBarH, this);
			this._scrollBarH = null;
		}
	};

	this.calcScrollBarPos = function(/*Object*/to){ // to: {x, y}
		var pos = {};
		var dim = this._dim;
		var f = function(wrapperH, barH, t, d, c){
			var y = Math.round((d - barH - 8) / (d - c) * t);
			if(y < -barH + 5){
				y = -barH + 5;
			}
			if(y > wrapperH - 5){
				y = wrapperH - 5;
			}
			return y;
		};
		if(typeof to.y == "number" && this._scrollBarV){
			pos.y = f(this._scrollBarWrapperV.offsetHeight, this._scrollBarV.offsetHeight, to.y, dim.d.h, dim.c.h);
		}
		if(typeof to.x == "number" && this._scrollBarH){
			pos.x = f(this._scrollBarWrapperH.offsetWidth, this._scrollBarH.offsetWidth, to.x, dim.d.w, dim.c.w);
		}
		return pos;
	};

	this.scrollScrollBarTo = function(/*Object*/to){ // to: {x, y}
		if(!this.scrollBar){ return; }
		if(this._v && this._scrollBarV && typeof to.y == "number"){
			if(has("webkit")){
				if(!this._useTopLeft){
					this._scrollBarV.style.webkitTransform = this.makeTranslateStr({y:to.y});
				}else{
					domStyle.set(this._scrollBarV, {
						webkitTransition: "",
						top: to.y + "px"
					});
				}
			}else{
				this._scrollBarV.style.top = to.y + "px";
			}
		}
		if(this._h && this._scrollBarH && typeof to.x == "number"){
			if(has("webkit")){
				if(!this._useTopLeft){
					this._scrollBarH.style.webkitTransform = this.makeTranslateStr({x:to.x});
				}else{
					domStyle.set(this._scrollBarH, {
						webkitTransition: "",
						left: to.x + "px"
					});
				}
			}else{
				this._scrollBarH.style.left = to.x + "px";
			}
		}
	};

	this.slideScrollBarTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		if(!this.scrollBar){ return; }
		var fromPos = this.calcScrollBarPos(this.getPos());
		var toPos = this.calcScrollBarPos(to);
		if(this._v && this._scrollBarV){
			this._runSlideAnimation({y:fromPos.y}, {y:toPos.y}, duration, easing, this._scrollBarV, 0);
		}
		if(this._h && this._scrollBarH){
			this._runSlideAnimation({x:fromPos.x}, {x:toPos.x}, duration, easing, this._scrollBarH, 1);
		}
	};

	this._runSlideAnimation = function(/*Object*/from, /*Object*/to, /*Number*/duration, /*String*/easing, node, idx){
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(has("webkit")){
			if(!this._useTopLeft){
				this.setKeyframes(from, to, idx);
				domStyle.set(node, {
					webkitAnimationDuration: duration + "s",
					webkitAnimationTimingFunction: easing
				});
				domClass.add(node, "mblScrollableScrollTo"+idx);
				if(idx == 2){
					this.scrollTo(to, true, node);
				}else{
					this.scrollScrollBarTo(to);
				}
			}else{
				domStyle.set(node, {
					webkitTransitionProperty: "top, left",
					webkitTransitionDuration: duration + "s",
					webkitTransitionTimingFunction: easing
				});
				setTimeout(function(){ // setTimeout is needed to prevent webkitTransitionEnd not fired
					domStyle.set(node, {
						top: (to.y || 0) + "px",
						left: (to.x || 0) + "px"
					});
				}, 0);
				domClass.add(node, "mblScrollableScrollTo"+idx);
			}
		}else if(dojo.fx && dojo.fx.easing && duration){
			// If you want to support non-webkit browsers,
			// your application needs to load necessary modules as follows:
			//
			// | dojo.require("dojo.fx");
			// | dojo.require("dojo.fx.easing");
			//
			// This module itself does not make dependency on them.
			var s = dojo.fx.slideTo({
				node: node,
				duration: duration*1000,
				left: to.x,
				top: to.y,
				easing: (easing == "ease-out") ? dojo.fx.easing.quadOut : dojo.fx.easing.linear
			}).play();
			if(idx == 2){
				connect.connect(s, "onEnd", this, "onFlickAnimationEnd");
			}
		}else{
			// directly jump to the destination without animation
			if(idx == 2){
				this.scrollTo(to, false, node);
				this.onFlickAnimationEnd();
			}else{
				this.scrollScrollBarTo(to);
			}
		}
	};

	this.resetScrollBar = function(){
		//	summary:
		//		Resets the scroll bar length, position, etc.
		var f = function(wrapper, bar, d, c, hd, v){
			if(!bar){ return; }
			var props = {};
			props[v ? "top" : "left"] = hd + 4 + "px"; // +4 is for top or left margin
			var t = (d - 8) <= 0 ? 1 : d - 8;
			props[v ? "height" : "width"] = t + "px";
			domStyle.set(wrapper, props);
			var l = Math.round(d * d / c); // scroll bar length
			l = Math.min(Math.max(l - 8, 5), t); // -8 is for margin for both ends
			bar.style[v ? "height" : "width"] = l + "px";
			domStyle.set(bar, {"opacity": 0.6});
		};
		var dim = this.getDim();
		f(this._scrollBarWrapperV, this._scrollBarV, dim.d.h, dim.c.h, this.fixedHeaderHeight, true);
		f(this._scrollBarWrapperH, this._scrollBarH, dim.d.w, dim.c.w, 0);
		this.createMask();
	};

	this.createMask = function(){
		//	summary:
		//		Creates a mask for a scroll bar edge.
		// description:
		//		This function creates a mask that hides corners of one scroll
		//		bar edge to make it round edge. The other side of the edge is
		//		always visible and round shaped with the border-radius style.
		if(!has("webkit")){ return; }
		var ctx;
		if(this._scrollBarWrapperV){
			var h = this._scrollBarWrapperV.offsetHeight;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskV", 5, h);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(1, 0, 3, 2);
			ctx.fillRect(0, 1, 5, 1);
			ctx.fillRect(0, h - 2, 5, 1);
			ctx.fillRect(1, h - 1, 3, 2);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(0, 2, 5, h - 4);
			this._scrollBarWrapperV.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskV)";
		}
		if(this._scrollBarWrapperH){
			var w = this._scrollBarWrapperH.offsetWidth;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskH", w, 5);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0, 1, 2, 3);
			ctx.fillRect(1, 0, 1, 5);
			ctx.fillRect(w - 2, 0, 1, 5);
			ctx.fillRect(w - 1, 1, 2, 3);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(2, 0, w - 4, 5);
			this._scrollBarWrapperH.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskH)";
		}
	};

	this.flashScrollBar = function(){
		if(this.disableFlashScrollBar || !this.domNode){ return; }
		this._dim = this.getDim();
		if(this._dim.d.h <= 0){ return; } // dom is not ready
		this.showScrollBar();
		var _this = this;
		setTimeout(function(){
			_this.hideScrollBar();
		}, 300);
	};

	this.addCover = function(){
	};

	this.removeCover = function(){
	};

	this.setKeyframes = function(/*Object*/from, /*Object*/to, /*Number*/idx){
		if(!dm._rule){
			dm._rule = [];
		}
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(!dm._rule[idx]){
			var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
			node.textContent =
				".mblScrollableScrollTo"+idx+"{-webkit-animation-name: scrollableViewScroll"+idx+";}"+
				"@-webkit-keyframes scrollableViewScroll"+idx+"{}";
			dm._rule[idx] = node.sheet.cssRules[1];
		}
		var rule = dm._rule[idx];
		if(rule){
			if(from){
				rule.deleteRule("from");
				rule.insertRule("from { -webkit-transform: "+this.makeTranslateStr(from)+"; }");
			}
			if(to){
				if(to.x === undefined){ to.x = from.x; }
				if(to.y === undefined){ to.y = from.y; }
				rule.deleteRule("to");
				rule.insertRule("to { -webkit-transform: "+this.makeTranslateStr(to)+"; }");
			}
		}
	};

	this.setSelectable = function(node, selectable){
		// dojo.setSelectable has dependency on dojo.query. Re-define our own.
		node.style.KhtmlUserSelect = selectable ? "auto" : "none";
		node.style.MozUserSelect = selectable ? "" : "none";
		node.onselectstart = selectable ? null : function(){return false;};
		if(has("ie")){
			node.unselectable = selectable ? "" : "on";
			var nodes = node.getElementsByTagName("*");
			for(var i = 0; i < nodes.length; i++){
				nodes[i].unselectable = selectable ? "" : "on";
			}
		}
	};

	// feature detection
	if(has("webkit")){
		var elem = win.doc.createElement("div");
		elem.style.webkitTransform = "translate3d(0px,1px,0px)";
		win.doc.documentElement.appendChild(elem);
		var v = win.doc.defaultView.getComputedStyle(elem, '')["-webkit-transform"];
		dm.hasTranslate3d = v && v.indexOf("matrix") === 0;
		win.doc.documentElement.removeChild(elem);
	}
};

dm.scrollable = scrollable; // for backward compatibility
return scrollable;
});

},
'dojox/mobile/_ExecScriptMixin':function(){
define("dojox/mobile/_ExecScriptMixin", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-construct"
], function(kernel, declare, win, domConstruct){
	// module:
	//		dojox/mobile/_ExecScriptMixin
	// summary:
	//		Mixin for content handler to have a script execution capability.

	return declare("dojox.mobile._ExecScriptMixin", null, {
		// summary:
		//		Mixin for content handler to have a script execution capability.
		// description:
		//		This module defines the execScript method, which is called
		//		from an html content handler.

		execScript: function(/*String*/ html){
			// summary:
			//		Finds script tags and executes the script.
			// returns:
			//		The given html text from which <script> blocks are removed.
			var s = html.replace(/\f/g, " ").replace(/<\/script>/g, "\f");
			s = s.replace(/<script [^>]*src=['"]([^'"]+)['"][^>]*>([^\f]*)\f/ig, function(ignore, path){
				domConstruct.create("script", {
					type: "text/javascript",
					src: path}, win.doc.getElementsByTagName("head")[0]);
				return "";
			});

			s = s.replace(/<script>([^\f]*)\f/ig, function(ignore, code){
				kernel.eval(code);
				return "";
			});

			return s;
		}
	});
});

},
'dojox/mobile/CheckBox':function(){
define("dojox/mobile/CheckBox", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/form/_CheckBoxMixin",
	"./ToggleButton"
],
	function(declare, domConstruct, CheckBoxMixin, ToggleButton){

	/*=====
		ToggleButton = dojox.mobile.ToggleButton;
		CheckBoxMixin = dijit.form._CheckBoxMixin;
	=====*/
	return declare("dojox.mobile.CheckBox", [ToggleButton, CheckBoxMixin], {
		// summary:
		//		A non-templated checkbox widget that can be in two states (checked or not).

		baseClass: "mblCheckBox",

		_setTypeAttr: function(){}, // cannot be changed: IE complains w/o this

		buildRendering: function(){
			if(!this.srcNodeRef){
				// The following doesn't work on IE < 8 if the default state is checked.
				// You have to use "<input checked>" instead but it's not worth the bytes here.
				this.srcNodeRef = domConstruct.create("input", {type: this.type});
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},
		
		_getValueAttr: function(){
			return (this.checked ? this.value : false);
		}
	});
});

},
'dojox/mobile/ToggleButton':function(){
define("dojox/mobile/ToggleButton", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"dijit/form/_ToggleButtonMixin",
	"./Button"
], function(declare, domClass, ToggleButtonMixin, Button){

	/*=====
		Button = dojox.mobile.Button;
		ToggleButtonMixin = dijit.form._ToggleButtonMixin;
	=====*/
	return declare("dojox.mobile.ToggleButton", [Button, ToggleButtonMixin], {
		// summary:
		//		A non-templated button widget that can be in two states (checked or not).
		//		Can be base class for things like tabs or checkbox or radio buttons

		baseClass: "mblToggleButton",

		_setCheckedAttr: function(){
			this.inherited(arguments);
			var newStateClasses = (this.baseClass+' '+this["class"]).replace(/(\S+)\s*/g, "$1Checked ").split(" ");
			domClass[this.checked ? "add" : "remove"](this.focusNode || this.domNode, newStateClasses);
		}
	});
});

},
'dojox/mobile/_PickerBase':function(){
define("dojox/mobile/_PickerBase", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, Contained, Container, WidgetBase){

/*=====
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/_PickerBase
	// summary:
	//		A base class for picker classes (e.g. SpinWheel, ValuePicker)

	return declare("dojox.mobile._PickerBase", [WidgetBase, Container, Contained], {
		// summary:
		//		dojox/mobile/_PickerBase

		// slotClasses: Array
		//		An array of slot classes.
		slotClasses: [],

		// slotProps: Array
		//		An array of property objects for each slot class specified in
		//		slotClasses.
		slotProps: [],

		// slotOrder: Array
		//		An array of index of slotClasses and slotProps.
		//		If there are three slots and slotOrder=[2,1,0], the slots are
		//		displayed in reverse order.
		slotOrder: [],

		buildRendering: function(){
			this.inherited(arguments);
			this.slots = [];
			for(var i = 0; i < this.slotClasses.length; i++){
				var idx = this.slotOrder.length ? this.slotOrder[i] : i;
				var slot = new this.slotClasses[idx](this.slotProps[idx]);
				this.addChild(slot);
				this.slots[idx] = slot;
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.reset();
		},

		getSlots: function(){
			return this.slots.length ? this.slots :
				array.filter(this.getChildren(), function(c){
					return c.declaredClass.indexOf("Slot") !== -1;
				});
		},

		_getValuesAttr: function(){
			// summary:
			//		Returns an array of slot values.
			return array.map(this.getSlots(), function(w){
				return w.get("value");
			});
		},

		_setValuesAttr: function(/*Array*/a){
			// summary:
			//		Sets the slot values.
			array.forEach(this.getSlots(), function(w, i){
				w.set("value", a[i]);
			});
		},

		_setColorsAttr: function(/*Array*/a){
			// summary:
			//		Sets the slot colors.
			array.forEach(this.getSlots(), function(w, i){
				w.setColor && w.setColor(a[i]);
			});
		},

		reset: function(){
			// summary:
			//		Resets the picker to show the initial values.
			array.forEach(this.getSlots(), function(w){
				w.setInitialValue();
			});
		}
	});
});

},
'dojox/mobile/RoundRect':function(){
define("dojox/mobile/RoundRect", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"./Pane"
], function(declare, domClass, Pane){

	// module:
	//		dojox/mobile/RoundRect
	// summary:
	//		A simple round rectangle pane.

	return declare("dojox.mobile.RoundRect", Pane, {
		// summary:
		//		A simple round rectangle pane.
		// description:
		//		RoundRect is a simple round rectangle pane for any HTML
		//		and/or widgets. You can achieve the same appearance by just
		//		applying the -webkit-border-radius style to a div tag. However,
		//		if you use RoundRect, you can get a round rectangle even on
		//		non-CSS3 browsers such as (older) IE.

		// shadow: Boolean
		//		If true, adds a shadow effect to the pane element.
		shadow: false,

		baseClass: "mblRoundRect",

		buildRendering: function(){
			this.inherited(arguments);
			if(this.shadow){
				domClass.add(this.domNode, "mblShadow");
			}
		}
	});
});

},
'dojox/mobile/_ContentPaneMixin':function(){
define("dojox/mobile/_ContentPaneMixin", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/_base/xhr",
	"./_ExecScriptMixin",
	"./ProgressIndicator",
	"./lazyLoadUtils"
], function(declare, Deferred, lang, win, xhr, ExecScriptMixin, ProgressIndicator, lazyLoadUtils){

	// module:
	//		dojox/mobile/_ContentPaneMixin
	// summary:
	//		Mixin for a very simple content pane to embed an HTML fragment.

	return declare("dojox.mobile._ContentPaneMixin", ExecScriptMixin, {
		// summary:
		//		Mixin for a very simple content pane to embed an HTML fragment.
		// description:
		//		By mixing this class into a widget, the widget can have ability
		//		to embed an external HTML fragment and run the parser.

		// href: String
		//		URL of the content to embed.
		href: "",

		// lazy: String
		//		If true, external content specified with the href property is
		//		not loaded at startup time. It can be loaded by calling load().
		lazy: false,

		// content: String
		//		An html fragment to embed.
		content: "",

		// parseOnLoad: Boolean
		//		If true, runs the parser when the load completes.
		parseOnLoad: true,

		// prog: Boolean
		//		If true, shows progress indicator.
		prog: true,

		// executeScripts: Boolean
		//		If true, executes scripts that is found in the content
		executeScripts: true,

		constructor: function(){
			if(this.prog){
				this._p = ProgressIndicator.getInstance();
			}
		},

		loadHandler: function(/*String*/response){
			// summary:
			//		A handler called when load completes.
			this.set("content", response);
		},

		errorHandler: function(err){
			// summary:
			//		An error handler called when load fails.
			if(this._p){ this._p.stop(); }
		},

		load: function(){
			this.set("href", this.href);
		},

		onLoad: function(){
			// summary:
			//		Stub method to allow the application to connect to.
			//		Called when parsing is done and the content is ready.
			return true;
		},

		_setHrefAttr: function(/*String*/href){
			if(this.lazy || !href || href === this._loaded){
				this.lazy = false;
				return null;
			}
			var p = this._p;
			if(p){
				win.body().appendChild(p.domNode);
				p.start();
			}
			this._set("href", href);
			this._loaded = href;
			return xhr.get({
				url: href,
				handleAs: "text",
				load: lang.hitch(this, "loadHandler"),
				error: lang.hitch(this, "errorHandler")
			});
		},

		_setContentAttr: function(/*String|DomNode*/data){
			this.destroyDescendants();
			if(typeof data === "object"){
				this.containerNode.appendChild(data);
			}else{
				if(this.executeScripts){
					data = this.execScript(data);
				}
				this.containerNode.innerHTML = data;
			}
			if(this.parseOnLoad){
				var _this = this;
				return Deferred.when(lazyLoadUtils.instantiateLazyWidgets(_this.containerNode), function(){
					if(_this._p){ _this._p.stop(); }
					return _this.onLoad();
				});
			}
			if(this._p){ this._p.stop(); }
			return this.onLoad();
		}
	});
});

},
'dojox/mobile/compat':function(){
define("dojox/mobile/compat", [
	"dojo/_base/lang",
	"dojo/_base/sniff"
], function(lang, has){
	var dm = lang.getObject("dojox.mobile", true);
	if(!has("webkit")){
		var s = "dojox/mobile/_compat"; // assign to a variable so as not to be picked up by the build tool
		require([s]);
	}
	return dm;
});

},
'dojox/mobile/ContentPane':function(){
define("dojox/mobile/ContentPane", [
	"dojo/_base/declare",
	"./Pane",
	"./_ContentPaneMixin"
], function(declare, Pane, ContentPaneMixin){

	// module:
	//		dojox/mobile/ContentPane
	// summary:
	//		A very simple content pane to embed an HTML fragment.

	return declare("dojox.mobile.ContentPane", [Pane, ContentPaneMixin], {
		// summary:
		//		A very simple content pane to embed an HTML fragment.
		// description:
		//		This widget embeds an HTML fragment and run the parser. It has
		//		ability to load external content using dojo/_base/xhr. onLoad()
		//		is called when parsing is done and the content is
		//		ready. Compared with dijit.layout.ContentPane, this widget
		//		provides only basic fuctionality, but it is much smaller than
		//		dijit.layout.ContentPane.

		baseClass: "mblContentPane"
	});
});

},
'dojox/mobile/_DatePickerMixin':function(){
define("dojox/mobile/_DatePickerMixin", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/date",
	"dojo/date/locale"
], function(array, declare, lang, ddate, datelocale){

	// module:
	//		dojox/mobile/_DatePickerMixin
	// summary:
	//		A mixin for date picker widget.

	var slotMixin = {
		format: function(/*Date*/d){
			return datelocale.format(d, {datePattern:this.pattern, selector:"date"});
		}
	};

	var yearSlotMixin = lang.mixin({
		initLabels: function(){
			this.labels = [];
			if(this.labelFrom !== this.labelTo){
				var d = new Date(this.labelFrom, 0, 1);
				var i, idx;
				for(i = this.labelFrom, idx = 0; i <= this.labelTo; i++, idx++){
					d.setFullYear(i);
					this.labels.push(this.format(d));
				}
			}
		}
	}, slotMixin);

	var monthSlotMixin = lang.mixin({
		initLabels: function(){
			this.labels = [];
			var d = new Date(2000, 0, 1);
			for(var i = 0; i < 12; i++){
				d.setMonth(i);
				this.labels.push(this.format(d));
			}
		}
	}, slotMixin);

	var daySlotMixin = lang.mixin({
		initLabels: function(){
			this.labels = [];
			var d = new Date(2000, 0, 1);
			for(var i = 1; i <= 31; i++){
				d.setDate(i);
				this.labels.push(this.format(d));
			}
		}
	}, slotMixin);

	return declare("dojox.mobile._DatePickerMixin", null, {
		// summary:
		//		A mixin for date picker widget.

		yearPattern: "yyyy",
		monthPattern: "MMM",
		dayPattern: "d",

		initSlots: function(){
			var c = this.slotClasses, p = this.slotProps;
			c[0] = declare(c[0], yearSlotMixin);
			c[1] = declare(c[1], monthSlotMixin);
			c[2] = declare(c[2], daySlotMixin);
			p[0].pattern = this.yearPattern;
			p[1].pattern = this.monthPattern;
			p[2].pattern = this.dayPattern;
			this.reorderSlots();
		},

		reorderSlots: function(){
			if(this.slotOrder.length){ return; }
			var a = datelocale._parseInfo().bundle["dateFormat-short"].toLowerCase().split(/[^ymd]+/, 3);
			this.slotOrder = array.map(a, function(pat){
				return {y:0, m:1, d:2}[pat.charAt(0)];
			});
		},

		reset: function(){
			// summary:
			//		Goes to today.
			var now = new Date();
			var v = array.map(this.slots, function(w){ return w.format(now); });
			this.set("values", v);
			this.set("colors", v);
			this.disableValues(this.onDaySet());
		},

		onYearSet: function(){
			// summary:
			//		A handler called when the year value is changed.
			this.disableValues(this.onDaySet());
		},

		onMonthSet: function(){
			// summary:
			//		A handler called when the month value is changed.
			this.disableValues(this.onDaySet());
		},

		onDaySet: function(){
			// summary:
			//		A handler called when the day value is changed.
			var v = this.get("values"), // [year, month, day]
				pat = this.slots[0].pattern + "/" + this.slots[1].pattern,
				date = datelocale.parse(v[0] + "/" + v[1], {datePattern:pat, selector:"date"}),
				daysInMonth = ddate.getDaysInMonth(date);
			if(daysInMonth < v[2]){
				this.slots[2].set("value", daysInMonth);
			}
			return daysInMonth;
		},

		_getDateAttr: function(){
			// summary:
			//		Returns a Date object for the current values
			var v = this.get("values"), // [year, month, day]
				s = this.slots,
				pat = s[0].pattern + "/" + s[1].pattern + "/" + s[2].pattern;
				return datelocale.parse(v[0] + "/" + v[1] + "/" + v[2], {datePattern:pat, selector:"date"});
		}
	});
});

}}});

require(["dojo/i18n"], function(i18n){
i18n._preloadLocalizations("dojo/nls/mobile-ui-layer", []);
});
define("dojo/mobile-ui-layer", [], 1);
