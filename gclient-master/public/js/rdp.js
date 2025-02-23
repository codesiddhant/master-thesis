// Desktop Client side custom javascript
var host = window.location.hostname; 
var port = window.location.port;
var path = window.location.pathname;
var protocol = window.location.protocol;

if (protocol == 'https:'){
  var wsprotocol = 'wss:';
}
else{
  var wsprotocol = 'ws:'
}
// Hide Cursor
document.body.style.cursor = 'none';
// Sidebar expansion
function side_open() {
  $('#display').css("marginLeft","200px");
  $('#sidebar').css("width", "200px");
  $('#sidebar').css("display", "block");
}
function side_close() {
  $('#display').css("marginLeft", "0px");
  $('#sidebar').css("display", "none");
}
function closeside() {
  $('#nav-trigger').prop('checked', false);
  side_close();
  $('#sidebaricon').append('<i class="fa fa-arrow-right"></i>');
}
// Sidebar shortcut
shortcut.add("Ctrl+Alt+Shift",function() {
  if ($('#nav-trigger').prop('checked') == true){
    $('#nav-trigger').prop('checked', false);
    side_close();
    $('#sidebaricon').append('<i class="fa fa-arrow-right"></i>');
  }
  else{
    $('#nav-trigger').prop('checked', true);
    $('#sidebaricon').empty();
    side_open();
  }
});
// Modify the arrow pointer on click
$('#nav-trigger').change(function () {
  if ($('#nav-trigger').prop('checked') == true){
    $('#sidebaricon').empty();
    side_open();
  }
  else{
    $('#sidebaricon').empty();
    side_close();
    $('#sidebaricon').append('<i class="fa fa-arrow-right"></i>');
  }
});

//// Guacamole related ////
// Get display div from document
var display = document.getElementById("display");
// Instantiate client, using an HTTP tunnel for communications.
var connectionstring = $('#connectionstring').val();
var baseurl = $('#baseurl').val();
var guac = new Guacamole.Client(
  new Guacamole.WebSocketTunnel(wsprotocol + '//' + host + ':' + port + baseurl + 'guaclite?token=' + connectionstring + '&width=' + $(document).width() + '&height=' + $(document).height())
);
// Show current client clipboard
guac.onclipboard = function clientClipboardReceived(stream, mimetype) {
  var reader;
  // If the received data is text, read it as a simple string (ignore blob data)
  if (/^text\//.exec(mimetype)) {
    reader = new Guacamole.StringReader(stream);
    // Assemble received data into a single string
    reader.ontext = function textReceived(text) {
      $('#clipboard').val(text);
    };
  }
};
// Grab user input to set client clipboard
$('#clipboard').on('input', function() { 
  guac.setClipboard($(this).val());
});
// Add client to display div
display.appendChild(guac.getDisplay().getElement());
// Error handler
guac.onerror = function(error) {
  $('#display').empty();
  $('#display').append(
    '<center><h1>Error Connecting to Desktop</h1><br><p>' 
     + JSON.stringify(error) + '</p>');
};
// Connect
guac.connect();
// Disconnect on close
window.onunload = function() {
  guac.disconnect();
};
// Mouse
var mouse = new Guacamole.Mouse(guac.getDisplay().getElement());
mouse.onmousedown = 
mouse.onmouseup   =
mouse.onmousemove = function(mouseState) {
  guac.sendMouseState(mouseState);
};
// Touchscreen
var touch = new Guacamole.Mouse.Touchscreen(guac.getDisplay().getElement());
touch.onmousedown = 
touch.onmouseup   =
touch.onmousemove = function(mouseState) {
  guac.sendMouseState(mouseState);
};
// Keyboard
var keyboard = new Guacamole.Keyboard(document);
keyboard.onkeydown = function (keysym) {
  guac.sendKeyEvent(1, keysym);
};
keyboard.onkeyup = function (keysym) {
  guac.sendKeyEvent(0, keysym);
};
// Audio
guac.onaudio = function clientAudio(stream, mimetype) {
  let context = Guacamole.AudioContextFactory.getAudioContext();
  context.resume().then(() => console.log('play audio'));
};
// Disable keyboard events if our sidebar inputs are used
$(".stopcapture").click(function(e) {
  keyboard.onkeydown = null;
  keyboard.onkeyup = null;
}).on("blur", function(e) {
  keyboard.onkeydown = function(keysym) {
    guac.sendKeyEvent(1, keysym);
  };
  keyboard.onkeyup = function(keysym) {
    guac.sendKeyEvent(0, keysym);
  };
});
// On Screen keyboard
// Just mashing a blob in here for now as this is the only way I can tell to do it
var layout = {"language":"en_US","type":"qwerty","width":22,"keys":{"0":[{"title":"0","requires":[]},{"title":")","requires":["shift"]}],"1":[{"title":"1","requires":[]},{"title":"!","requires":["shift"]}],"2":[{"title":"2","requires":[]},{"title":"@","requires":["shift"]}],"3":[{"title":"3","requires":[]},{"title":"#","requires":["shift"]}],"4":[{"title":"4","requires":[]},{"title":"$","requires":["shift"]}],"5":[{"title":"5","requires":[]},{"title":"%","requires":["shift"]}],"6":[{"title":"6","requires":[]},{"title":"^","requires":["shift"]}],"7":[{"title":"7","requires":[]},{"title":"&","requires":["shift"]}],"8":[{"title":"8","requires":[]},{"title":"*","requires":["shift"]}],"9":[{"title":"9","requires":[]},{"title":"(","requires":["shift"]}],"Back":65288,"Tab":65289,"Enter":65293,"Esc":65307,"Home":65360,"PgUp":65365,"PgDn":65366,"End":65367,"Ins":65379,"F1":65470,"F2":65471,"F3":65472,"F4":65473,"F5":65474,"F6":65475,"F7":65476,"F8":65477,"F9":65478,"F10":65479,"F11":65480,"F12":65481,"Del":65535,"Space":" ","Left":[{"title":"←","keysym":65361}],"Up":[{"title":"↑","keysym":65362}],"Right":[{"title":"→","keysym":65363}],"Down":[{"title":"↓","keysym":65364}],"Menu":[{"title":"Menu","keysym":65383}],"LShift":[{"title":"Shift","modifier":"shift","keysym":65505}],"RShift":[{"title":"Shift","modifier":"shift","keysym":65506}],"LCtrl":[{"title":"Ctrl","modifier":"control","keysym":65507}],"RCtrl":[{"title":"Ctrl","modifier":"control","keysym":65508}],"Caps":[{"title":"Caps","modifier":"caps","keysym":65509}],"LAlt":[{"title":"Alt","modifier":"alt","keysym":65513}],"RAlt":[{"title":"Alt","modifier":"alt","keysym":65514}],"Super":[{"title":"Super","modifier":"super","keysym":65515}],"`":[{"title":"`","requires":[]},{"title":"~","requires":["shift"]}],"-":[{"title":"-","requires":[]},{"title":"_","requires":["shift"]}],"=":[{"title":"=","requires":[]},{"title":"+","requires":["shift"]}],",":[{"title":",","requires":[]},{"title":"<","requires":["shift"]}],".":[{"title":".","requires":[]},{"title":">","requires":["shift"]}],"/":[{"title":"/","requires":[]},{"title":"?","requires":["shift"]}],"[":[{"title":"[","requires":[]},{"title":"{","requires":["shift"]}],"]":[{"title":"]","requires":[]},{"title":"}","requires":["shift"]}],"\\":[{"title":"\\","requires":[]},{"title":"|","requires":["shift"]}],";":[{"title":";","requires":[]},{"title":":","requires":["shift"]}],"'":[{"title":"'","requires":[]},{"title":"\"","requires":["shift"]}],"q":[{"title":"q","requires":[]},{"title":"Q","requires":["caps"]},{"title":"Q","requires":["shift"]},{"title":"q","requires":["caps","shift"]}],"w":[{"title":"w","requires":[]},{"title":"W","requires":["caps"]},{"title":"W","requires":["shift"]},{"title":"w","requires":["caps","shift"]}],"e":[{"title":"e","requires":[]},{"title":"E","requires":["caps"]},{"title":"E","requires":["shift"]},{"title":"e","requires":["caps","shift"]}],"r":[{"title":"r","requires":[]},{"title":"R","requires":["caps"]},{"title":"R","requires":["shift"]},{"title":"r","requires":["caps","shift"]}],"t":[{"title":"t","requires":[]},{"title":"T","requires":["caps"]},{"title":"T","requires":["shift"]},{"title":"t","requires":["caps","shift"]}],"y":[{"title":"y","requires":[]},{"title":"Y","requires":["caps"]},{"title":"Y","requires":["shift"]},{"title":"y","requires":["caps","shift"]}],"u":[{"title":"u","requires":[]},{"title":"U","requires":["caps"]},{"title":"U","requires":["shift"]},{"title":"u","requires":["caps","shift"]}],"i":[{"title":"i","requires":[]},{"title":"I","requires":["caps"]},{"title":"I","requires":["shift"]},{"title":"i","requires":["caps","shift"]}],"o":[{"title":"o","requires":[]},{"title":"O","requires":["caps"]},{"title":"O","requires":["shift"]},{"title":"o","requires":["caps","shift"]}],"p":[{"title":"p","requires":[]},{"title":"P","requires":["caps"]},{"title":"P","requires":["shift"]},{"title":"p","requires":["caps","shift"]}],"a":[{"title":"a","requires":[]},{"title":"A","requires":["caps"]},{"title":"A","requires":["shift"]},{"title":"a","requires":["caps","shift"]}],"s":[{"title":"s","requires":[]},{"title":"S","requires":["caps"]},{"title":"S","requires":["shift"]},{"title":"s","requires":["caps","shift"]}],"d":[{"title":"d","requires":[]},{"title":"D","requires":["caps"]},{"title":"D","requires":["shift"]},{"title":"d","requires":["caps","shift"]}],"f":[{"title":"f","requires":[]},{"title":"F","requires":["caps"]},{"title":"F","requires":["shift"]},{"title":"f","requires":["caps","shift"]}],"g":[{"title":"g","requires":[]},{"title":"G","requires":["caps"]},{"title":"G","requires":["shift"]},{"title":"g","requires":["caps","shift"]}],"h":[{"title":"h","requires":[]},{"title":"H","requires":["caps"]},{"title":"H","requires":["shift"]},{"title":"h","requires":["caps","shift"]}],"j":[{"title":"j","requires":[]},{"title":"J","requires":["caps"]},{"title":"J","requires":["shift"]},{"title":"j","requires":["caps","shift"]}],"k":[{"title":"k","requires":[]},{"title":"K","requires":["caps"]},{"title":"K","requires":["shift"]},{"title":"k","requires":["caps","shift"]}],"l":[{"title":"l","requires":[]},{"title":"L","requires":["caps"]},{"title":"L","requires":["shift"]},{"title":"l","requires":["caps","shift"]}],"z":[{"title":"z","requires":[]},{"title":"Z","requires":["caps"]},{"title":"Z","requires":["shift"]},{"title":"z","requires":["caps","shift"]}],"x":[{"title":"x","requires":[]},{"title":"X","requires":["caps"]},{"title":"X","requires":["shift"]},{"title":"x","requires":["caps","shift"]}],"c":[{"title":"c","requires":[]},{"title":"C","requires":["caps"]},{"title":"C","requires":["shift"]},{"title":"c","requires":["caps","shift"]}],"v":[{"title":"v","requires":[]},{"title":"V","requires":["caps"]},{"title":"V","requires":["shift"]},{"title":"v","requires":["caps","shift"]}],"b":[{"title":"b","requires":[]},{"title":"B","requires":["caps"]},{"title":"B","requires":["shift"]},{"title":"b","requires":["caps","shift"]}],"n":[{"title":"n","requires":[]},{"title":"N","requires":["caps"]},{"title":"N","requires":["shift"]},{"title":"n","requires":["caps","shift"]}],"m":[{"title":"m","requires":[]},{"title":"M","requires":["caps"]},{"title":"M","requires":["shift"]},{"title":"m","requires":["caps","shift"]}]},"layout":[["Esc",0.7,"F1","F2","F3","F4",0.7,"F5","F6","F7","F8",0.7,"F9","F10","F11","F12"],[0.1],{"main":{"alpha":[["`","1","2","3","4","5","6","7","8","9","0","-","=","Back"],["Tab","q","w","e","r","t","y","u","i","o","p","[","]","\\"],["Caps","a","s","d","f","g","h","j","k","l",";","'","Enter"],["LShift","z","x","c","v","b","n","m",",",".","/","RShift"],["LCtrl","Super","LAlt","Space","RAlt","Menu","RCtrl"]],"movement":[["Ins","Home","PgUp"],["Del","End","PgDn"],[1],["Up"],["Left","Down","Right"]]}}],"keyWidths":{"Back":2,"Tab":1.5,"\\":1.5,"Caps":1.85,"Enter":2.25,"LShift":2.1,"RShift":3.1,"LCtrl":1.6,"Super":1.6,"LAlt":1.6,"Space":6.1,"RAlt":1.6,"Menu":1.6,"RCtrl":1.6,"Ins":1.6,"Home":1.6,"PgUp":1.6,"Del":1.6,"End":1.6,"PgDn":1.6}};
// When On Screen Keyboard modal is launched render keyboard based on width
function poposk(){
  // Close the sidebar
  if ($('#nav-trigger').prop('checked') == true){
    $('#nav-trigger').prop('checked', false);
    $('#sidebaricon').empty();
    side_close();
    $('#sidebaricon').append('<i class="fa fa-arrow-right"></i>');
  }
  // Create the element for the keyboard and append it to the modal
  var osk = new Guacamole.OnScreenKeyboard(layout);
  osk.onkeydown = function (keysym) {
    guac.sendKeyEvent(1, keysym);
  };
  osk.onkeyup = function (keysym) {
    guac.sendKeyEvent(0, keysym);
  };
  $('#osk').empty();
  $('#osk').append(osk.getElement());
  // Launch Modal
  $('#Keyboard').appendTo('body').modal('show');
  // Resize keyboard to the width of the screen
  osk.resize($(window).width());
}

// When file browser is launched open modal
$('#filesform').on('submit', function() {
  if ($('#nav-trigger').prop('checked') == true){
    $('#nav-trigger').prop('checked', false);
    $('#sidebaricon').empty();
    side_close();
    $('#sidebaricon').append('<i class="fa fa-arrow-right"></i>');
  }
  $('#files').appendTo('body').modal('show');
  $("#files_frame").width(100 + '%');
  $("#files_frame").height(90 + '%');
});

// RDP Resize window logic
var resizeId;
$(window).resize(function() {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 500);
});
function doneResizing(){
  document.location.reload(true);
}
