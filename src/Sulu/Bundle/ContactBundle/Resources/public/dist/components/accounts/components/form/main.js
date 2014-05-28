define([],function(){"use strict";var a={headline:"contact.accounts.title"},b=["urls","emails","faxes","phones","notes","addresses"],c={tagsId:"#tags"},d=function(){this.sandbox.emit("sulu.header.set-toolbar",{template:"default"})};return{view:!0,templates:["/admin/contact/template/account/form"],initialize:function(){this.options=this.sandbox.util.extend(!0,{},a,this.options),this.form="#contact-form",this.saved=!0,this.dfdListenForChange=this.sandbox.data.deferred(),this.dfdFormIsSet=this.sandbox.data.deferred(),this.accountCategoryURL="api/account/categories",this.render(),this.setHeaderBar(!0),d.call(this),this.listenForChange()},render:function(){var a,b;this.sandbox.once("sulu.contacts.set-defaults",this.setDefaults.bind(this)),this.sandbox.once("sulu.contacts.set-types",this.setTypes.bind(this)),this.html(this.renderTemplate("/admin/contact/template/account/form")),this.titleField=this.$find("#name"),a=this.initContactData(),b=[],this.options.data.id&&b.push({id:this.options.data.id}),this.sandbox.start([{name:"auto-complete@husky",options:{el:"#company",remoteUrl:"/admin/api/accounts?searchFields=id,name&flat=true",getParameter:"search",value:a.parent?a.parent:null,instanceName:"companyAccount"+a.id,valueName:"name",noNewValues:!0,excludes:[{id:a.id,name:a.name}]}}]),this.initForm(a),this.initCategorySelect(a),this.startCategoryOverlay(),this.setTags(a),this.bindDomEvents(),this.bindCustomEvents(),this.bindTagEvents(a)},setTags:function(){this.dfdFormIsSet.then(function(){this.sandbox.start([{name:"auto-complete-list@husky",options:{el:"#tags",instanceName:"contacts",getParameter:"search",remoteUrl:"/admin/api/tags?flat=true&sortBy=name",completeIcon:"tag",noNewTags:!0}}])}.bind(this))},bindTagEvents:function(a){a.tags&&a.tags.length>0?(this.sandbox.on("husky.auto-complete-list.contacts.initialized",function(){this.sandbox.emit("husky.auto-complete-list.contacts.set-tags",a.tags)}.bind(this)),this.sandbox.on("husky.auto-complete-list.contacts.items-added",function(){this.dfdListenForChange.resolve()}.bind(this))):this.dfdListenForChange.resolve()},initCategorySelect:function(a){this.preselectedElemendId=a.accountCategory?a.accountCategory.id:null,this.accountCategoryData=null,this.sandbox.util.load(this.accountCategoryURL).then(function(a){var b=a._embedded;this.accountCategoryData=this.copyArrayOfObjects(b),this.sandbox.util.foreach(b,function(a){a.category=this.sandbox.translate(a.category)}.bind(this)),this.addDividerAndActionsForSelect(b),this.sandbox.start([{name:"select@husky",options:{el:"#accountCategory",instanceName:"account-category",multipleSelect:!1,defaultLabel:this.sandbox.translate("contact.accounts.category.select"),valueName:"category",repeatSelect:!1,preSelectedElements:[this.preselectedElemendId],data:b}}])}.bind(this)).fail(function(a,b){this.sandbox.logger.error(a,b)}.bind(this))},addDividerAndActionsForSelect:function(a){a.push({divider:!0}),a.push({id:-1,category:this.sandbox.translate("contact.accounts.manage.categories"),callback:this.showCategoryOverlay.bind(this),updateLabel:!1})},showCategoryOverlay:function(){var a=this.sandbox.dom.$('<div id="overlayContainer"></div>'),b={instanceName:"accountCategories",el:"#overlayContainer",openOnStart:!0,removeOnClose:!0,triggerEl:null,title:this.sandbox.translate("contact.accounts.manage.categories.title"),data:this.accountCategoryData};this.sandbox.dom.remove("#overlayContainer"),this.sandbox.dom.append("body",a),this.sandbox.emit("sulu.types.open",b)},startCategoryOverlay:function(){this.sandbox.start([{name:"type-overlay@suluadmin",options:{overlay:{el:"#overlayContainer",instanceName:"accountCategories",removeOnClose:!0},url:this.accountCategoryURL,data:this.accountCategoryData}}])},setDefaults:function(a){this.defaultTypes=a},setTypes:function(a){this.fieldTypes=a},fillFields:function(a,b,c){var d,e=-1,f=a.length;for(b>f&&(f=b);++e<f;)d=e+1>b?{}:{permanent:!0},a[e]?a[e].attributes=d:(a.push(c),a[a.length-1].attributes=d);return a},initContactData:function(){var a=this.options.data;return this.sandbox.util.foreach(b,function(b){a.hasOwnProperty(b)||(a[b]=[])}),this.fillFields(a.urls,1,{id:null,url:"",urlType:this.defaultTypes.urlType}),this.fillFields(a.emails,1,{id:null,email:"",emailType:this.defaultTypes.emailType}),this.fillFields(a.phones,1,{id:null,phone:"",phoneType:this.defaultTypes.phoneType}),this.fillFields(a.faxes,1,{id:null,fax:"",faxType:this.defaultTypes.faxType}),this.fillFields(a.notes,1,{id:null,value:""}),a},initForm:function(a){this.sandbox.on("sulu.contact-form.initialized",function(){var b=this.sandbox.form.create(this.form);b.initialized.then(function(){this.setFormData(a)}.bind(this))}.bind(this)),this.sandbox.start([{name:"contact-form@sulucontact",options:{el:"#contact-edit-form",fieldTypes:this.fieldTypes,defaultTypes:this.defaultTypes}}])},setFormData:function(a){this.sandbox.emit("sulu.contact-form.add-collectionfilters",this.form),this.sandbox.form.setData(this.form,a).then(function(){this.sandbox.start(this.form),this.sandbox.emit("sulu.contact-form.add-required",["email"]),this.dfdFormIsSet.resolve()}.bind(this))},updateHeadline:function(){this.sandbox.emit("sulu.header.set-title",this.sandbox.dom.val(this.titleField))},bindDomEvents:function(){this.sandbox.dom.keypress(this.form,function(a){13===a.which&&(a.preventDefault(),this.submit())}.bind(this))},bindCustomEvents:function(){this.sandbox.on("sulu.header.toolbar.delete",function(){this.sandbox.emit("sulu.contacts.account.delete",this.options.data.id)},this),this.sandbox.on("sulu.contacts.accounts.saved",function(a){this.options.data=a,this.initContactData(),this.setFormData(a),this.setHeaderBar(!0)},this),this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.contacts.accounts.list")},this),this.sandbox.on("sulu.types.closed",function(a){var b=[];this.accountCategoryData=this.copyArrayOfObjects(a),b.push(parseInt(this.selectedAccountCategory?this.selectedAccountCategory:this.preselectedElemendId,10)),this.addDividerAndActionsForSelect(a),this.sandbox.util.foreach(a,function(a){a.category=this.sandbox.translate(a.category)}.bind(this)),this.sandbox.emit("husky.select.account-category.update",a,b)},this)},copyArrayOfObjects:function(a){var b=[];return this.sandbox.util.foreach(a,function(a){b.push(this.sandbox.util.extend(!0,{},a))}.bind(this)),b},submit:function(){if(this.sandbox.form.validate(this.form)){var a=this.sandbox.form.getData(this.form);""===a.id&&delete a.id,a.tags=this.sandbox.dom.data(this.$find(c.tagsId),"tags"),this.updateHeadline(),a.parent={id:this.sandbox.dom.attr("#company input","data-id")},this.sandbox.emit("sulu.contacts.accounts.save",a)}},setHeaderBar:function(a){if(a!==this.saved){var b=this.options.data&&this.options.data.id?"edit":"add";this.sandbox.emit("sulu.header.toolbar.state.change",b,a,!0)}this.saved=a},listenForChange:function(){this.dfdListenForChange.then(function(){this.sandbox.dom.on("#contact-form","change",function(){this.setHeaderBar(!1)}.bind(this),"select, input, textarea"),this.sandbox.dom.on("#contact-form","keyup",function(){this.setHeaderBar(!1)}.bind(this),"input, textarea"),this.sandbox.on("sulu.contact-form.changed",function(){this.setHeaderBar(!1)}.bind(this))}.bind(this)),this.sandbox.on("husky.select.account-category.selected.item",function(a){a>0&&(this.selectedAccountCategory=a,this.setHeaderBar(!1))}.bind(this))}}});