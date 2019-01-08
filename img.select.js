/**
	plugin name			: script core file
	Developer Name		: ABTanjir;
	Developer Firm 		: Omicronic;
	Website				: https://omicronic.com
	Contact 			: +8801911222919 [bangladesh]
	Email				: abtanjir@gmail.com
	BIO					: https://abtanjir.com
	Facebook			: fb.com/ABTanjir
*/

$(document).ready(function() {
    var ____error____ = null;
    var max_files = 5;
    var image_type = "jpg|jpeg|png";
    var max_size =(1024*1024*3);
    var min_size =24;
    var content_type = image_type.split("|");
    // var file_count = 0;
    
    var fileList;
    var data_index = 0;
    
    data_index = $('#upload_preview .upload_thumb_contaier').length;
    
    function previewImages(){
        var count = 0;
        var fileList = this.files;
        
        var anyWindow = window.URL || window.webkitURL;
            // /*maximum file filter*/
        if((data_index+fileList.length) <= max_files){
            // /*--	maximum file filter	--*/
            for(var i = 0; i < fileList.length; i++){
                //if(data_index >= max_files) break;
                console.log('onloop');
                file = fileList[i];
                // file_count++;
                /*file extention filter*/
                var ext = (file.name).split('.').pop().toLowerCase();
                if(content_type.indexOf(ext) < 0){
                    ____error____ = 'invalid file extention!';
                    break;
                }
                /*--	file extention filter    --*/
                /*file size filter*/
                if((file.size>max_size) || (file.size<min_size)) {
                    ____error____ = 'invalid file size!';
                    break;
                }
                /*--	file size filter	--*/
                /*file content filter*/
                fileType = file.type.split("/");
                if(content_type.indexOf(fileType[1]) < 0){
                    ____error____ = 'invalid file content!';
                    break;
                }
                /*--	file cotent filter	--*/
    
    
                if(____error____ == null){
                    var picObj = anyWindow.createObjectURL(file);
                    $('#upload_preview').append('<span class="upload_thumb_contaier"><div class="upload_view">'+
                                    '<img id="rm" class="imageThumb" src="' + picObj + '" title="'+file.name+'"/></div>'+
                                    '<div type="button" id="remove_upload" class="remove_upload">'+
                                    //'<br>name: '+ file.name +'<br>size: ' + file.size +
                                    //'<a class="remove">Remove image</a>'+
                                    '</div>'+
                                    '</span>'
                                    );
            
                    // get rid of the blob
                    window.URL.revokeObjectURL(fileList[i]);
                    count++;
                    if(fileList.length == count){
                        $('#upload_preview').find('.upload_thumb_contaier').each(function(index){
                            $(this).attr('data-index', index);
                        });
                        ajax_load();
                    }
                }
            }
        }else{
            ____error____ = 'maximum '+max_files+' image can be uploaded';
        }
        if(____error____){
            alert(____error____);
            ____error____ = null;
        }
    
    }
    
    
    $('#upload_preview').on('click', '#remove_upload', function(){ 
            var currentThumb = $(this).parent('.upload_thumb_contaier');
            var id = $(currentThumb).attr('data-id');
            $(currentThumb).css("pointer-events", "none");
            
                console.log('deleted');
                var request = $.ajax({
                    //no id here
                    url: "module/ajax_upload.php?action=unlink_temp&id="+id,
                    type: "get",
                    //data: { id : id },
                    success: function(){
                        console.log('d-ar'+id);
                        data_index--;
                        $(currentThumb).fadeOut(function(){
                            $(this).remove();
                        });
                    }
                });
    }); 
            
    function ajax_load(){
        var ajaxData = new FormData();
            ajaxData.append('action','files');
            $.each($("input[type=file]"), function(i, obj) {
                $.each(obj.files,function(j, file){
                    ajaxData.append('files['+j+']', file);
                })
            });
        $.ajax({
                url : "module/ajax_upload.php",
                type: "POST",
                data : ajaxData,
                contentType: false,
                cache: false,
                processData:false,
                xhr: function(){
                //upload Progress
                var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function(event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                            //update progressbar
                            $(".show_loading").text(percent);
                        }, true);
                    }
                    return xhr;
                },
                mimeType:"multipart/form-data"
            }).done(function(data){
                $('#debug').html(data);
                var obj = jQuery.parseJSON(data);
                
                $(obj).each(function (index, value){
                    serverName = (value.server);
                    if(value.error_upload){
                        $('#upload_preview').find('.upload_thumb_contaier').eq(data_index).addClass('error');
                    }else{
                        //$('#upload_preview').find('.upload_thumb_contaier').each(function(key){
                        $('#upload_preview').find('.upload_thumb_contaier').eq(data_index).attr('data-id', serverName);
                    }
                    
                    data_index++;
                    
                    console.log('U ba : '+data_index);
                    //$(this).attr('data-id', serverName);
                        //alert();
                    //});
                    
                });
            });
    }
    
    if (window.File && window.FileList && window.FileReader) {
        $('#files').change(previewImages); //bind the function to the input
    }else{
        alert("Your browser doesn't support to File API");
    }
    
    });
    
