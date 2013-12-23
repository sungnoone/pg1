//參數區
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var file_items_infoYear = "info_year.txt";
var file_items_infoTarget = "info_Target.txt";
var file_items_infoClass = "info_Class.txt";
var infoYearStr = "9901\r\n9902\r\n10001\r\n10002\r\n10101\r\n10102\r\n10201\r\n10202\r\n10301\r\n10302";
var infoTargetStr = "康軒\r\n南一\r\n龍騰\r\n康軒";
var infoClassStr = "市占\r\n銷售\r\n定價\r\n策略\r\n經銷商";

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;

    //Page2 select Items refresh
    $(document).delegate("#page2", "pagecreate", function(){
        yearSelectItemsSetup();
        targetSelectItemsSetup();
        classSelectItemsSetup();
    });

}

/*$(document).ready(function(){

})*/

//======== 網路服務存取(查詢) =============
{

    function btnQueryClick(){
        var jqxhr = $.getJSON("http://infosys.hanlin.com.tw/infos/api/info/?format=json", function(data){
            var items = [];
            $.each(data, function(key, val){
                if(key=="objects"){
                    btnQueryClick_Result_Parse(val);
                }
            });
        });
    }

    function btnQueryClick_Result_Parse(jsonObjs){
        for(var v1=0 ; v1<jsonObjs.length ; v1++){
            var items = [];
            $("#page1_content").append("<ul><h3>第"+(v1+1)+"筆</h3>");
            $.each(jsonObjs[v1], function(key, val){
                $("#page1_content").append("<li>"+key + " : " + val+"</li>");
            });
            $("#page1_content").append("</ul>");
        }
    }


}

//======== 網路服務存取(寫回) =============

// Post data only
function btnAddSave(){
/*    var jsonStr = JSON.stringify({
        "info_Year": $("#addinfo_txtYear").val(),
        "info_Create_Date": "2013-10-11",
        "info_Class": "生產進度",
        "info_Field": "all",
        "info_Subject": "hello",
        "info_Content": "good job",
        "info_Image": "none",
        "info_Memo": "none"
        });*/

    //$("#addinfo_txtCreateDate").val()
    var jsonStr = '{' +
        '"info_Class":"' + $("#addinfo_txtClass").val() + '",' +
        '"info_Content":"' + $("#addinfo_txtContent").val() + '",' +
        '"info_Create_Date":"' + $("#addinfo_txtCreateDate").val() + '",'  +
        '"info_Field":"' + $("#addinfo_txtField").val() + '",' +
        '"info_Image":"' + 'none' + '",' +
        '"info_Memo":"' + $("#addinfo_txtMemo").val() + '",' +
        '"info_Subject":"' + $("#addinfo_txtSubject").val() + '", ' +
        '"info_Year":"' + $("#addinfo_txtYear").val() + '"'
        + '}';
    alert(jsonStr);
    var request = $.ajax({
        url:"http://infosys.hanlin.com.tw/infos/api/info/",
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        dataType: 'json',
        processData: false
/*        success:function(){
            alert("OK! ");
        },
        error:function(e){
            alert("Error!"+ e);
        }*/
    });
    request.always(function(){
       alert("Second complete");
       alert(request.status+request.statusText);
    });
}

// post data with uploading file
function btnAddSave_upload(){
    var jsonStr = '{' +
        '"info_Class":"' + $("#addinfo_txtClass").val() + '",' +
        '"info_Content":"' + $("#addinfo_txtContent").val() + '",' +
        '"info_Create_Date":"' + $("#addinfo_txtCreateDate").val() + '",'  +
        '"info_Field":"' + $("#addinfo_txtField").val() + '",' +
        '"info_Image":"' + 'none' + '",' +
        '"info_Memo":"' + $("#addinfo_txtMemo").val() + '",' +
        '"info_Subject":"' + $("#addinfo_txtSubject").val() + '", ' +
        '"info_Year":"' + $("#addinfo_txtYear").val() + '"'
        + '}';
    alert(jsonStr);
    var request = $.ajax({
        url:"http://infosys.hanlin.com.tw/infos/api/info/",
        type: 'POST',
        contentType: 'application/json',
        data: jsonStr,
        dataType: 'json',
        processData: false
    });
    request.always(function(){
        alert("Second complete");
        alert(request.status+request.statusText);
    });
}



//========= 照相功能 =========
function capturePhoto(source){
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 75,
        destinationType: destinationType.FILE_URI,
        allowEdit:true,
        saveToPhotoAlbum:true,
        correctOrientation:true,
        sourceType:source
    });
}

function onPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//========= 拍照並上傳 =========
function captureUpload(source){
    navigator.camera.getPicture(onUploadURISuccess, onUploadFail, {
        quality: 75,
        destinationType: destinationType.FILE_URI,
        allowEdit:true,
        saveToPhotoAlbum:true,
        correctOrientation:true,
        sourceType:source
    });
}

function onUploadURISuccess(imageURI) {
    var largeImage = document.getElementById('largeImage3');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;

    var jqxhr = $.getJSON("http://infosys.hanlin.com.tw/infos/api/info/?format=json", function(data){
        var items = [];
        $.each(data, function(key, val){
            //items.push(key+":"+val);
            if(key=="objects"){
                parsrReturn(val);
            }
        });
    });
}

function onUploadFail(message) {
    alert('Failed because: ' + message);
}

function parsrReturn(jsonObjs){
    for(var v1=0 ; v1<jsonObjs.length ; v1++){
        var items = [];
        var s = "";
        $.each(jsonObjs[v1], function(key, val){
            s += key + ":" + val + "\r\n";
        });
        alert(s);
    }
}



//=========== 設定選擇項目==============
{
function yearSelectItemsSetup(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoYear, null, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    var lines = s.replace(/\r\n/g, "\n").split("\n");
                    $("#addinfo_txtYear").find("option").remove();
                    for(var v1=0; v1<lines.length; v1++){
                        $("#addinfo_txtYear").append('<option value="' + lines[v1] + '">' + lines[v1] + '</option>');
                    }
                }
                reader.readAsText(file);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}

function targetSelectItemsSetup(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoTarget, null, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    var lines = s.replace(/\r\n/g, "\n").split("\n");
                    $("#addinfo_txtTarget").find("option").remove();
                    for(var v1=0; v1<lines.length; v1++){
                        $("#addinfo_txtTarget").append('<option value="' + lines[v1] + '">' + lines[v1] + '</option>');
                    }
                }
                reader.readAsText(file);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}

function classSelectItemsSetup(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoClass, null, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    var lines = s.replace(/\r\n/g, "\n").split("\n");
                    $("#addinfo_txtClass").find("option").remove();
                    for(var v1=0; v1<lines.length; v1++){
                        $("#addinfo_txtClass").append('<option value="' + lines[v1] + '">' + lines[v1] + '</option>');
                    }
                }
                reader.readAsText(file);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}

function fileSystemFail(error) {
    alert("FileSystem Fail!! "+error.code);
}
}

//=============== Read Directory Entries =================
{
function readDir(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, listFS, fileSystemFail);
}

function listFS(fileSystem){
    var dir = fileSystem.root;
    var dirReader = dir.createReader();
    dirReader.readEntries(readEntries, fileSystemFail);
}

function readEntries(entries){
    var s = "";
    for(var i=0; i<entries.length; i++){
        //alert(entries[i].name);
        s+=entries[i].name+"\r\n";
    }
    alert(s);
}
}

//=============== 日期欄位 ===================
function datePicker(){
        var currentField = $("#addinfo_txtCreateDate");
        var myNewDate = new Date();

        // Same handling for iPhone and Android
        window.plugins.datePicker.show({
            date : myNewDate,
            mode : 'date', // date or time or blank for both
            allowOldDates : true
        }, function(returnDate) {
            var array = returnDate.split("/");
            var day = array[2], month = array[1];
            if (day <= 9)
                day = "0" + day;
            if (month <= 9)
                month = "0" + month;
            currentField.val(array[0] + "-" + month + "-" + day);
            // This fixes the problem you mention at the bottom of this script with it not working a second/third time around, because it is in focus.
            currentField.blur();
        });
}

//======== 更新 情報對象選項 資料 ===========

function updateItemsFile_infoYear(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoYear, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(writer){
                writer.onwriteend = function(evt) {
                    alert("write OK!");
                };
                writer.write(infoYearStr);
            },fail);
        }, fail);
    }, fail);
}

function updateItemsFile_infoTarget(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoTarget, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(writer){
                writer.onwriteend = function(evt) {
                    alert("write OK!");
                };
                writer.write(infoTargetStr);
            },fail);
        }, fail);
    }, fail);
}

function updateItemsFile_infoClass(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(file_items_infoClass, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(writer){
                writer.onwriteend = function(evt) {
                    alert("write OK!");
                };
                writer.write(infoClassStr);
            },fail);
        }, fail);
    }, fail);
}

function fail(error) {
    alert(error.code);
}

//======== SQLite插件測試 ===========
function testSQL(){
    alert("Before SQLite Plugin");
    //var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
    var db = window.sqlitePlugin.openDatabase({name: "pg1"});
    alert(db.dbname);
    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS test_table');
        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

        for(var v1=0; v1<500; v1++){
            tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test"+v1, 100+v1], function(tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1"); // check #18/#38 is fixed
                //alert("insertId: " + res.insertId + " -- should be valid");
                db.transaction(function(tx) {
                    tx.executeSql("SELECT data_num from test_table;", [], function(tx, res) {
                        console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                        //alert("res.rows.item(0).data_num: " + res.rows.item(0).data_num + " -- should be 100");
                    });
                });
            }, function(e) {
                console.log("ERROR: " + e.message);
            });
        }
    });
}

function querySQLite(){
    var db = window.sqlitePlugin.openDatabase({name: "pg1"});
    db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM test_table', [], function(tx, res){
                $("#page8_content").append("<ul>"+res.rows.length);
                for(var v1=0; v1<res.rows.length; v1++){
                    $("#page8_content").append("<li>"+res.rows.item(v1).data+"=> "+res.rows.item(v1).data_num+"</li>");
                }
                $("#page8_content").append("</ul>");
            }, function(e){
                alert("Select error:" + e.message);
            });

        }, function(e) {
            console.log("ERROR: " + e.message);
        });
}


//======== 同步資料庫 ===========
function syncDB(){
    var jqxhr = $.getJSON("http://infosys.hanlin.com.tw/infos/api/info/?format=json", function(data){
        var items = [];
        $.each(data, function(key, val){
            if(key=="objects"){
                syncDB_GetData(val)
            }
        });
    });
}

function syncDB_GetData(jsonObjs){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile("infos_cache.txt", {create: true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(writer){
                writer.onwriteend = function(evt) {alert("write OK!");};
                for(var v1=0 ; v1<jsonObjs.length ; v1++){
                    var items = [];
                    $.each(jsonObjs[v1], function(key, val){
                        writer.write(jsonObjs);
                    });
                    alert(s);
                }
            },fail);
        }, fail);
    }, fail);
}

function syncDB_GetData_fail(error){
    alert("syncDB_GetData_fail! "+error.code);
}

//======== Page7 jQuery File Upload 測試 ===========
{
    function page7_upload(source){
        navigator.camera.getPicture(page7_onUploadURISuccess, page7_onUploadFail, {
            quality: 75,
            destinationType: destinationType.FILE_URI,
            allowEdit:true,
            saveToPhotoAlbum:true,
            correctOrientation:true,
            sourceType:source
        });
    }

    function page7_onUploadURISuccess(imageURI){
        var largeImage = document.getElementById('cameraImage');
        largeImage.style.display = 'block';
        largeImage.src = imageURI;

        //var upload_url = "";
//        $.ajax({
//            type: "GET",
//            url: "http://dev-gae1.appspot.com/url",
//            success:function(responseText){
//                fileTransfer(responseText,imageURI);
//            },
//            fail:page7_onUploadFail
//        });
        //fileTransfer("http://formsample1.hanlin.com.tw/form/upload/",imageURI);
        $.ajax({
            type: "GET",
            url: "http://formsample1.hanlin.com.tw/form/info/",
            success:function(responseText){
                alert(responseText);
                fileTransfer("http://formSample1.hanlin.com.tw/form/info/",imageURI);
            },
            fail:page7_onUploadFail
        });

    }

    function page7_onUploadFail(message){
        alert('Failed because: ' + message);
    }

    function fileTransfer(upload_url,image_uri){
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = image_uri.substr(image_uri.lastIndexOf("/")+1);
        options.mimeType = "image/jpeg";
        var params = {};
        //params.value1 = "test";
        //params.value2 = "param";
        var ft = new FileTransfer();
        alert(image_uri);
        alert(options.fileName);
        ft.upload(image_uri, encodeURI(upload_url), fileTransfer_success, fileTransfer_fail, options);
    }

    function fileTransfer_success(r) {
        alert("Code = " + r.responseCode);
        alert("Response = " + r.response);
        alert("Sent = " + r.bytesSent);
    }

    function fileTransfer_fail(error) {
        alert("An error has occurred: Code = " + error.code);
        alert("upload error source " + error.source);
        alert("upload error target " + error.target);
    }

}


//======== Page10  jQuery File Upload 測試 ===========
{

    function getFileSystem() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem){
                var rootDir = fileSystem.root;
                var dcimDir = rootDir.getDirectory("dcim/Camera", {create:false},
                    function(dcim){
                        listDir(dcim, $("#page10_gallery"));
                    },
                    function(error){
                        alert(error.code);
                    }
                );
            },
            function(evt){
                alert(evt.target.error.code);
            }
        );
    }

    function listDir(dirEntry, domParent){
        $.mobile.showPageLoadingMsg();
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(
            function(entries){
                for(var v1=0; v1<entries.length; v1++){
                    $("#page10_fieldcontain").append("<p>"+entries[v1].fullPath+"</p>");
/*                    if(v1%2 == 0){
                        domParent.append("<div class='ui-block-a'><div class='thumbnail'><img src=" + entries[v1].fullPath + " title=" + entries[v1].name + "/></div></div>");
                    }else{
                        domParent.append("<div class='ui-block-b'><div class='thumbnail'><img src=" + entries[v1].fullPath + " title=" + entries[v1].name +"/></div></div>");
                    }*/
                }
                $.mobile.hidePageLoadingMsg();
            },
            function(error){
                alert(error.code);
            });
    }

    function getDirSuccess(entries) {
        var i;
        for (i=0; i<entries.length; i++) {
            console.log(entries[i].name);
            $('#page10_fieldcontain').append("<p>"+entries[i].name+"</p>")
        }
    }

    function getDirFail(error) {
        alert("error:" + error.code);
    }


    function page10_upload(source){
        navigator.camera.getPicture(page10_onUploadURISuccess, page10_onUploadFail, {
            quality: 75,
            destinationType: destinationType.FILE_URI,
            allowEdit:true,
            saveToPhotoAlbum:true,
            correctOrientation:true,
            sourceType:source
        });
    }

    function page10_onUploadURISuccess(imageURI){
        var largeImage = document.getElementById('page10_cameraImage');
        largeImage.style.display = 'block';
        largeImage.src = imageURI;

        $.ajax({
            type: "GET",
            url: "http://formsample1.hanlin.com.tw/form/upload/",
            success:function(responseText){
                alert(responseText);
                page10_fileTransfer("http://formSample1.hanlin.com.tw/form/upload/",imageURI);
            },
            fail:page10_onUploadFail
        });

    }

    function page10_onUploadFail(message){
        alert('Failed because: ' + message);
    }

    function page10_fileTransfer(upload_url,image_uri){
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = image_uri.substr(image_uri.lastIndexOf("/")+1);
        options.mimeType = "image/jpeg";
        var params = {};
        //params.value1 = "test";
        //params.value2 = "param";
        var ft = new FileTransfer();
        alert(image_uri);
        alert(upload_url);
        //ft.upload(image_uri, encodeURI(upload_url), fileTransfer_success, fileTransfer_fail, options);
        ft.upload(image_uri, upload_url, fileTransfer_success, function(error){
            alert("File Transfer Error Code: "+error.code+" image_url:"+image_uri);
        }, options);
    }

}

// ==================== Page 11 =============================
{
    // Upload from Camera
    function page11_upload(source){
            navigator.camera.getPicture(page11_onUploadURISuccess, page11_onUploadFail, {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                allowEdit:true,
                saveToPhotoAlbum:true,
                correctOrientation:true,
                sourceType:source
            });
    }

    function page11_onUploadURISuccess(imageURI){
        var upload_url = "http://formSample1.hanlin.com.tw/form/upload/";
        var largeImage = document.getElementById('page11_cameraImage');
        largeImage.style.display = 'block';
        largeImage.src = imageURI;
        $.ajax({
            type: "GET",
            url: "http://formsample1.hanlin.com.tw/form/upload/",
            success:function(responseText){
                alert(responseText);
                page11_fileTransfer("http://formSample1.hanlin.com.tw/form/upload/",imageURI);
            },
            fail:page11_onUploadFail
        });

    }

    function page11_onUploadFail(message){
        alert('Failed because: ' + message);
    }

    // Upload from Camera
    function page11_fileTransfer(upload_url,image_uri){
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = image_uri.substr(image_uri.lastIndexOf("/")+1);
        options.mimeType = "image/jpeg";
        var params = {};
        //params.value1 = "test";
        //params.value2 = "param";
        alert(image_uri);
        alert(upload_url);
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(image_uri, upload_url,
            function(r){
                alert("Code = " + r.responseCode);
                alert("Response = " + r.response);
                alert("Sent = " + r.bytesSent);
            },
            function(error){
                alert("An error has occurred: Code = " + error.code);
                alert("upload error source " + error.source);
                alert("upload error target " + error.target);
            },
            options, true);
    }

    // Upload from the specified file
    function page11_upload_from_specified(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem){
                var rootDir = fileSystem.root;
                var fs = rootDir.getFile("dcim/Camera/1380079547407.jpg", null,
                    function(fileEntry){
                        fileEntry.file(function(file){
                            var upload_url = "http://formSample1.hanlin.com.tw/form/upload/";
                            var options = new FileUploadOptions();
                            var filename = file.fullPath;
                            options.fileKey = "file";
                            options.fileName = filename.substr(filename.lastIndexOf("/")+1);
                            options.mimeType = "image/jpeg";
                            var params = new Object();
                            options.params = params;
                            var ft = new FileTransfer();
                            ft.upload(filename, upload_url,
                                function(r){
                                    alert("Code = " + r.responseCode);
                                    alert("Response = " + r.response);
                                    alert("Sent = " + r.bytesSent);
                                },
                                function(error){
                                    alert("An error has occurred: Code = " + error.code);
                                    alert("upload error source " + error.source);
                                    alert("upload error target " + error.target);
                                },
                                options, true);

                        }, page11_upload_from_specified_fail);
                    },
                    function(error){
                        alert(error.code);
                    });
            },
            page11_upload_from_specified_fail
            );
    }

    function page11_upload_from_specified_fail(evt){
        alert(evt.target.error.code);
    }

}


// =================== Page12 =============================

{

    // Use camera to capture photo
    function page12_Camera(source){
        navigator.camera.getPicture(
            function(imageURI){
                var largeImage = document.getElementById('page12_cameraImage');
                largeImage.style.display = 'block';
                largeImage.src = imageURI;
            },
            function(evt){
                alert(evt.target.error.code);
            },
            {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            allowEdit:true,
            saveToPhotoAlbum:true,
            correctOrientation:true,
            sourceType:source
        });
    }

    function page12_Save(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem){
                var image_path = $("#page12_cameraImage").prop("src");
                var rootDir = fileSystem.root;
                var image_rel_path = image_path.replace(rootDir.fullPath+"/", ""); // 只要 root 以下的路徑
                var fs = rootDir.getFile(image_rel_path, null,
                    function(fileEntry){
                        fileEntry.file(function(file){
                            var upload_url = "http://formSample1.hanlin.com.tw/form/upload/";
                            var options = new FileUploadOptions();
                            var filename = file.fullPath;
                            options.fileKey = "info_img1";
                            options.fileName = filename.substr(filename.lastIndexOf("/")+1);
                            options.mimeType = "image/jpeg";
                            var params = {};
                            // Other Text Data
                            params.info_Subject = $("#page12_txtSubject").val();
                            options.params = params;
                            var ft = new FileTransfer();
                            ft.upload(filename, upload_url,
                                function(r){
                                    alert("Code = " + r.responseCode);
                                    alert("Response = " + r.response);
                                    alert("Sent = " + r.bytesSent);
                                    //page12_Submit_TextData(r.response);
                                },
                                function(error){
                                    alert("An error has occurred: Code = " + error.code);
                                    alert("upload error source " + error.source);
                                    alert("upload error target " + error.target);
                                },
                                options, true);
                        }, page12_Submit_Fail);
                    },
                    function(error){
                        alert("filesystem getFile fail: "+error.code);
                    });
            },
            page12_Submit_Fail
        );
    }

    function page12_Submit_Fail(evt){
        alert(evt.target.error.code);
    }

    function page12_Submit_TextData(fileid){
        var jsonStr = '{' +
            '"info_Class":"' + $("#page12_txtClass").val() + '",' +
            '"info_Content":"' + $("#page12_txtContent").val() + '",' +
            '"info_Create_Date":"' + $("#page12_txtCreateDate").val() + '",'  +
            '"info_Field":"' + $("#page12_txtField").val() + '",' +
            '"info_Memo":"' + $("#page12_txtMemo").val() + '",' +
            '"info_Subject":"' + $("#page12_txtSubject").val() + '", ' +
            '"info_Year":"' + $("#page12_txtYear").val() + '",' +
            '"info_img1":"' + fileid + '"'
            + '}';
        alert(jsonStr);
        var request = $.ajax({
            url:"http://formSample1.hanlin.com.tw/form/minfo/",
            type: 'POST',
            contentType: 'application/json',
            data: jsonStr,
            dataType: 'json',
            processData: false,
            success:function(){
                alert("OK! ");
             },
             error:function(e){
                alert("Error!"+ e);
             }
        });
        request.always(function(){
            alert("Second complete");
            alert(request.status+request.statusText);
        });
    }

}


// ===================  Page 13=============================

{
    // Use camera to capture photo
    function page13_Camera(source){
        navigator.camera.getPicture(
            function(imageURI){
                var largeImage = document.getElementById('page13_cameraImage');
                largeImage.style.display = 'block';
                largeImage.src = imageURI;
            },
            function(evt){
                alert(evt.target.error.code);
            },
            {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                allowEdit:true,
                saveToPhotoAlbum:true,
                correctOrientation:true,
                sourceType:source
            });
    }

    function page13_Save(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem){
                var image_path = $("#page13_cameraImage").prop("src");
                var rootDir = fileSystem.root;
                var image_rel_path = image_path.replace(rootDir.fullPath+"/", ""); // 只要 root 以下的路徑
                var fs = rootDir.getFile(image_rel_path, null,
                    function(fileEntry){
                        fileEntry.file(function(file){
                            var upload_url = "http://192.168.1.109:5000/api/srv2/";
                            var options = new FileUploadOptions();
                            var filename = file.fullPath;
                            options.fileKey = "info_img1";
                            options.fileName = filename.substr(filename.lastIndexOf("/")+1);
                            options.mimeType = "image/jpeg";
                            var params = {};
                            // Other Text Data on the Form
                            params.info_Year = $("#page13_txtYear").val();
                            params.info_Create_Date = $("#page13_txtCreateDate").val();
                            params.info_Target = $("#page13_txtTarget").val();
                            params.info_Creator = $("#page13_txtCreator").val();
                            params.info_Class = $("#page13_txtClass").val();
                            params.info_Field = $("#page13_txtField").val();
                            params.info_Subject = $("#page13_txtSubject").val();
                            params.info_Content = $("#page13_txtContent").val();
                            params.info_Memo = $("#page13_txtMemo").val();
                            options.params = params;
                            var ft = new FileTransfer();

                            ft.upload(filename, upload_url,
                                function(r){
                                    alert("Code = " + r.responseCode);
                                    alert("Response = " + r.response);
                                    alert("Sent = " + r.bytesSent);
                                    //page13_Submit_TextData(r.response);
                                },
                                function(error){
                                    alert("An error has occurred: Code = " + error.code);
                                    alert("upload error source " + error.source);
                                    alert("upload error target " + error.target);
                                },
                                options, true);
                        }, page13_Submit_Fail);
                    },
                    function(error){
                        alert("filesystem getFile fail: "+error.code);
                    });
            },
            page13_Submit_Fail
        );
    }

    function page13_Submit_Fail(evt){
        alert(evt.target.error.code);
    }

    function page13_Submit_TextData(fileid){
        var jsonStr = '{' +
            '"info_Year":"' + $("#page13_txtYear").val() + '",' +
            '"info_Create_Date":"' + $("#page13_txtCreateDate").val() + '",'  +
            '"info_Target":"' + $("#page13_txtTarget").val() + '",'  +
            '"info_Creator":"' + $("#page13_txtCreator").val() + '",'  +
            '"info_Class":"' + $("#page13_txtClass").val() + '",'  +
            '"info_Field":"' + $("#page13_txtField").val() + '",' +
            '"info_Subject":"' + $("#page13_txtSubject").val() + '", ' +
            '"info_Content":"' + $("#page13_txtContent").val() + '", ' +
            '"info_Memo":"' + $("#page13_txtMemo").val() + '",' +
            '"info_img1":"' + fileid + '"'
            + '}';
        alert(jsonStr);
        var request = $.ajax({
            url:"http://192.168.1.109:5000/api/srv2/",
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: jsonStr,
            dataType: 'json',
            processData: false,
            success:function(r){
                alert("OK! ");
            },
            error:function(e){
                alert("Error!"+ e.toString());
            }
        });
        request.always(function(){
            alert("Second complete");
            alert(request.status+request.statusText);
        });
    }

}

// ===================  Page 14===========================
function page14_GetData(){
    $('#page14_ul').empty();
    var request = $.ajax({
        url:"http://192.168.1.109:5000/api/srv3/",
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success:function(r){
            alert("OK! ");
            var count = 0;
            for(var key in r){
                count++;
                var item = $.parseJSON(r[key]);
                if(item){
                    var title = count.toString();
                    var span_content1 = '';
                    for(var key1 in item){
                        if(key1=='image'){
                            var image_id_object = item[key1];
                            var image_id = image_id_object['$oid'];
                            var image_url = "http://192.168.1.109:5000/api/srv4/" + image_id;
                        }else{
                            span_content1 += '<p>'+key1+':'+item[key1]+'</p>';
                        }
                    }
                    // 有圖片
                    if(image_url){
                        span_content1 += '<img  style="width: 100px; height: 100px" src="'+ image_url +'" />';
                    }
                    var html = '<div data-role="collapsible" data-collapsed="true"><h3>'+title+'</h3><span style="text-align: left">'+span_content1+'</span></div>';
                    var $element = $(html).appendTo($('#page14_first_content'));
                    $element.collapsible();
                }
            }
        },
        error:function(error){
            alert("An error has occurred: Code = " + error.code);
            alert("upload error source " + error.source);
            alert("upload error target " + error.target);
        }
    });
}


// ===================  Page 15 ===========================
function page15_GetData(){
    alert('page15_GetData');
    for(var v1=0 ; v1<5 ; v1++){
        var title = v1;
        var span_content1 = '<a href="#">image</a>';
        var span_content2 = '<img src="http://192.168.1.109:5000/api/srv4/525b8c90fb492a3a5001ee12" />';
        var html = '<div data-role="collapsible" data-collapsed="true"><h3>'+title+'</h3><span>'+span_content1+span_content2+'</span></div>';
        var $element = $(html).appendTo($('#page15_content'));
        $element.collapsible();
    }


    //var $element = $('<div data-role="collapsible" data-collapsed="true"><h3>22</h3><span>hello</span></div>').appendTo($('#page15_content'));
    //$element.collapsible();

}
