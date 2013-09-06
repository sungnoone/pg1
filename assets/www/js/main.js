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
        classSelectItemsSetup()
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
                    btnQueryClick_Result_Parse(val)
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

