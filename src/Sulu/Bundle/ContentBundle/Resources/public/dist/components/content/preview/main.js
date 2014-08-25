define("app-config",function(a){"use strict";var b={initiated:!1,init:function(){if(!b.initiated){this.sandbox.dom.on(this.formId,"focusout",f.bind(this),".preview-update");var a=this.sandbox.form.getData(this.formId);b.update(a),b.initiated=!0}},update:function(a){var b="/admin/content/preview/"+this.data.id+"/update?&webspace="+this.options.webspace+"&language="+this.options.language;this.sandbox.util.ajax({url:b,type:"POST",data:{changes:a}})}},c={detection:function(){var a="MozWebSocket"in window?"MozWebSocket":"WebSocket"in window?"WebSocket":null;return null===a?(this.sandbox.logger.log("Your browser doesn't support Websockets."),!1):(window.MozWebSocket&&(window.WebSocket=window.MozWebSocket),!0)},init:function(){var a=this.wsUrl+":"+this.wsPort;this.sandbox.logger.log("Connect to url: "+a),this.ws=new WebSocket(a),this.ws.onopen=function(){this.sandbox.logger.log("Connection established!"),this.opened=!0,this.sandbox.dom.on(this.formId,"keyup change",this.updateEvent.bind(this),".preview-update"),this.writeStartMessage()}.bind(this),this.ws.onclose=function(){this.opened||(this.ws="ajax",b.init())}.bind(this),this.ws.onmessage=function(a){var b=JSON.parse(a.data);this.sandbox.logger.log("Message:",b)}.bind(this),this.ws.onerror=function(a){this.sandbox.logger.warn(a),this.ws="ajax",b.init()}.bind(this)},writeStartMessage:function(){if(null!==this.ws){var b={command:"start",content:this.data.id,type:"form",user:a.getUser().id,webspaceKey:this.options.webspace,languageCode:this.options.language,params:{}};this.ws.send(JSON.stringify(b))}},updateWs:function(b){if("ws"===this.ws&&this.ws.readyState===this.ws.OPEN){var c={command:"update",content:this.data.id,type:"form",user:a.getUser().id,webspaceKey:this.options.webspace,languageCode:this.options.language,params:{changes:b}};this.ws.send(JSON.stringify(c))}}},d=function(){c.detection()?c.init():b.init(),this.initiated=!0,this.sandbox.on("sulu.preview.update",function(a,b,c){if(this.data.id){var d=this.getSequence(a);"ws"!==this.method&&c||e.call(this,d,b)}},this)},e=function(a,c){if(this.initiated){var d={};a&&c?d[a]=c:d=this.sandbox.form.getData(this.formId),"ws"===this.method?b.updateWs.call(this,d):b.update.call(this,d)}},f=function(a){if(this.data.id&&this.previewInitiated){var b=$(a.currentTarget),c=this.sandbox.dom.data(b,"element");this.updatePreview(this.getSequence(b),c.getValue())}};return{sandbox:null,initiated:!1,method:"ws",initialize:function(a){this.sandbox=a,d.call(this)},getSequence:function(a){a=$(a);for(var b,c=this.sandbox.dom.data(a,"mapperProperty"),d=a.parents("*[data-mapper-property]"),e=a.parents("*[data-mapper-property-tpl]")[0];!a.data("element");)a=a.parent();return d.length>0&&(b=this.sandbox.dom.data(d[0],"mapperProperty"),"string"!=typeof b&&(b=this.sandbox.dom.data(d[0],"mapperProperty")[0].data),c=[b,$(e).index(),this.sandbox.dom.data(a,"mapperProperty")]),c}}});