function fileOnDragOver(holder){
	holder.className = "element-drag";
	event.preventDefault();
	return false;
}

function fileOnDragEnd(holder) {
	holder.className = "element";
	return false;
}

function fileOnDrop(event,id,hostip,hostname,osname,acount) {

	event.preventDefault();
	var holder = $("#content-"+id)[0];
	holder.className = "element-drop";

	var files = event.dataTransfer.files;     
	var fd = new FormData();
    fd.append('uploadedFile', files[0]);
    
    var progress = jQuery('<progress>', {
        id: "progress-"+id,
        value: "0",
        max: "100"
    });
    
	$("#footer-"+id)[0].outerHTML = progress[0].outerHTML;
	
    $.ajax({
        url: hostip+"/ws/put",
        type: "POST",
        data: fd,
        processData: false, //Work around #1
        contentType: false, //Work around #2
        success: function(){
            holder.className = "element";
            var c = parseInt(acount);
            expand(id,hostip,hostname,osname,++c);
        },
        error: function(){
        	holder.className = "element";
        	alert("Failed");
        },
        //Work around #3
        xhr: function() {
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                myXhr.upload.addEventListener('progress',function(evt) {
			    if (evt.lengthComputable) {
			        var percentComplete = (evt.loaded / evt.total) * 100;
			        $('#progress-'+id)[0].value = percentComplete;
			    }  
			}, false);
            } else {
                console.log("Uploadress is not supported.");
            }
            return myXhr;
        }
    });
	
	return false;
}

function expand(id,hostip,hostname,osname,acount){
	$.get("/views/components/line-ok-expand10.ht", function(contents) {
		var files = "";
		$.get(hostip+"/ws/all", function(data) {
			var json = jQuery.parseJSON( data );
			files = "<ul type=disk>";
		    for (var key in json.list) {
		    	var filename = json.list[key];
		    	files=files.concat("<li>").concat("<a href=\"javascript:open('" + hostip + "','" + filename + "')\">").concat(filename).concat("</a>").concat("</li>");
		    }
		    files=files.concat("</ul>");
		}).fail(function(error) {
			var errMsg = "";
			if(error.status == 0){
				files = "No se puede conectar con el host remoto";
			}else{
				files = error.responseText;
			}
		}).always(function() {
			$("#element-"+id)[0].outerHTML=contents
				.replace(/\${id}/g,id)
				.replace(/\${hostip}/g,hostip)
				.replace(/\${hostname}/g,hostname)
				.replace(/\${osname}/g,osname)
				.replace(/\${acount}/g,acount)
				.replace(/\${files}/g,files)

		});	
	})
}

function open(host,filename){
	$.post("/client/open", {host: host, filename: filename}, function(data) {})
	.fail(function(data) {
	    alert( "error:" + data );
	});	
}

function contract(id,hostip,hostname,osname,acount){
	$.get("/views/components/line-ok8.ht", function(contents) {
		$("#element-"+id)[0].outerHTML=contents
			.replace(/\${id}/g,id)
			.replace(/\${hostip}/g,hostip)
			.replace(/\${hostname}/g,hostname)
			.replace(/\${osname}/g,osname)
			.replace(/\${acount}/g,acount)

	})
}

function reloadPage(){
	$.get("/host/all", function(data) {
	    for (var key in data) {
	        addElement(key,data[key]);
	    }
	}).fail(function(data) {
	    alert( "error:" + data );
	});	
}

function refresh(){
	var form = $( "#formulario" );
	$.post( form.attr( "action" ), form.serialize(), function(data) {
		addElement(new Date().getMilliseconds(),data);
	}).fail(function(data) {
	    alert( "error:" + data );
	});
	return false;
}

function refreshElement(id,host){
	$("#element-"+id).remove();
	addElement(id,host);
}

function addElement(id,host){
	$.get("/views/components/line-process9.ht", function(contents) {
		$("#elements").append(contents
			.replace(/\${id}/g,id)
			.replace(/\${hostip}/g,host)
		);
	})
    .always(function() {
    	$.get(host+"/ws/status", function(data) {
    		var json = jQuery.parseJSON( data );
    		$.get("/views/components/line-ok8.ht", function(contents) {
    			$("#element-"+id)[0].outerHTML=contents
    				.replace(/\${id}/g,id)
    				.replace(/\${hostip}/g,host)
    				.replace(/\${hostname}/g,json.name)
    				.replace(/\${osname}/g,json.os)
    				.replace(/\${acount}/g,json.size)
    		})
    		$("#element-"+id).css("color","green");
    	})
        .fail(function(error) {
    		$.get("/views/components/line-error9.ht", function(contents) {
    			var errMsg = "";
    			if(error.status == 0){
    				errMsg = "No se puede conectar con el host remoto";
    			}else{
    				errMsg = error.responseText;
    			}
    			$("#element-"+id)[0].outerHTML=contents
    				.replace(/\${id}/g,id)
    				.replace(/\${hostip}/g,host)
    				.replace(/\${title}/g,errMsg)
    		})
    		$("#element-"+id).css("color","red");
        });
    });
}