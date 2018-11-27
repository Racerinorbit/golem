var projectSettingsEditor = null;
var globalSettingsEditor = null;


$(document).ready(function() {    
    if(settingsCode != null){
        $("#projectSettingsContainer").show();
        projectSettingsEditor = CodeMirror($("#projectSettingsContainer>.codeEditorContainer")[0], {
          value: settingsCode,
          mode: "application/ld+json",
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          lineWrapping: true
      })
    }

    globalSettingsEditor = CodeMirror($("#globalSettingsContainer>.codeEditorContainer")[0], {
        value: globalSettingsCode,
        mode: "application/ld+json",
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true
    });

    // set unsaved changes watcher
    watchForUnsavedChanges();
});


function saveSettings(){

    var projectSettings = null;
    if(projectSettingsEditor != null){
        projectSettings = projectSettingsEditor.getValue();
    }
    var globalSettings = globalSettingsEditor.getValue();

    $.ajax({
        url: "/save_settings/",
        data: JSON.stringify({
            "project": project,
            "projectSettings": projectSettings,
            "globalSettings": globalSettings
        }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: function(data) {
            if(data.result === 'ok'){
                Main.Utils.toast('success', "Settings saved", 2000);

                if(projectSettingsEditor != null) projectSettingsEditor.markClean();
                globalSettingsEditor.markClean();
            }
            else{
                Main.Utils.toast('error', data, 3000);
            }
        },
    });
}


function watchForUnsavedChanges(){
    window.addEventListener("beforeunload", function (e) {
        if(projectSettingsEditor != null)
            var projectSettingsIsClean = projectSettingsEditor.isClean();
        else
            var projectSettingsIsClean = true;
        var globalSettingsIsClean = globalSettingsEditor.isClean();
        if(!globalSettingsIsClean || !projectSettingsIsClean){
            var confirmationMessage = 'There are unsaved changes';
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
    });
}