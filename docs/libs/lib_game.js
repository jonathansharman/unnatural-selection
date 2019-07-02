PST$sortedCopyOfArray = function(n) {
	var a = n.concat([]);
	a.sort();
	return a;
};

PST$multiplyList = function(l, n) {
	var o = [];
	var s = l.length;
	var i;
	while (n-- > 0) {
		for (i = 0; i < s; ++i) {
			o.push(l[i]);
		}
	}
	return o;
};

PST$checksubstring = function(s, index, lookfor) { return s.substring(index, index + lookfor.length) === lookfor; };

PST$stringTrimOneSide = function(s, isLeft) {
	var i = isLeft ? 0 : s.length - 1;
	var end = isLeft ? s.length : -1;
	var step = isLeft ? 1 : -1;
	var c;
	var trimming = true;
	while (trimming && i != end) {
		c = s.charAt(i);
		switch (c) {
			case ' ':
			case '\n':
			case '\t':
			case '\r':
				i += step;
				break;
			default:
				trimming = false;
				break;
		}
	}

	return isLeft ? s.substring(i) : s.substring(0, i + 1);
};

PST$floatParseHelper = function(o, s) {
	var t = parseFloat(s);
	if (t + '' == 'NaN') {
		o[0] = -1;
	} else {
		o[0] = 1;
		o[1] = t;
	}
};

PST$createNewArray = function(s) {
	var o = [];
	while (s-- > 0) o.push(null);
	return o;
};

PST$dictionaryKeys = function(d) {
	var o = [];
	for (var k in d) {
		o.push(k);
	}
	return o;
};

PST$dictionaryValues = function(d) {
	var o = [];
	for (var k in d) {
		o.push(d[k]);
	}
	return o;
};

PST$is_valid_integer = function(n) {
	var t = parseInt(n);
	return t < 0 || t >= 0;
};

PST$clearList = function(v) {
	v.length = 0;
};

PST$shuffle = function(v) {
	var t;
	var len = v.length;
	var sw;
	for (i = len - 1; i >= 0; --i) {
		sw = Math.floor(Math.random() * len);
		t = v[sw];
		v[sw] = v[i];
		v[i] = t;
	}
};

PST$stringEndsWith = function(s, v) {
	return s.indexOf(v, s.length - v.length) !== -1;
};

PST$intBuffer16 = PST$multiplyList([0], 16);
PST$floatBuffer16 = PST$multiplyList([0.0], 16);
PST$stringBuffer16 = PST$multiplyList([''], 16);

var lib_audio_load_sfx_from_resourceImpl = function(obj, path) {
	var sfx = C$audio$prepSoundForLoading(path);
	obj[3] = PST$createNewArray(1);
	obj[3][0] = sfx;
	return 1;
};

var lib_audio_music_load_from_resourceImpl = function(musicObj, path) {
	var nativeMusicObject = C$audio$musicLoad(path);
	if ((nativeMusicObject != null)) {
		musicObj[3] = PST$createNewArray(1);
		musicObj[3][0] = nativeMusicObject;
		return true;
	}
	return false;
};

var lib_audio_music_playImpl = function(musicObject, isResource, path, startingVolume, isLoop) {
	C$audio$musicSetVolume(startingVolume);
	var nativeObject = null;
	if ((musicObject[3] != null)) {
		nativeObject = musicObject[3][0];
	}
	if (isResource) {
		C$audio$musicPlay(nativeObject, isLoop);
	} else {
		if (!false) {
			return -1;
		}
		C$common$alwaysTrue();
	}
	return 0;
};

var lib_audio_sfx_get_stateImpl = function(channel, sfxResource, resourceId) {
	return (channel[2] + 1);
};

var lib_audio_sfx_launch = function(sfxResource, channelNativeDataOut, volume, pan) {
	var channel = C$audio$playSound(sfxResource, 0);
	if ((channel == null)) {
		return 0;
	}
	channelNativeDataOut[0] = channel;
	return 1;
};

var lib_audio_sfx_set_panImpl = function(channel, sfxResource, pan) {
	return 0;
};

var lib_audio_sfx_set_volumeImpl = function(channel, sfxResource, volume) {
	return 0;
};

var lib_audio_sfx_stopImpl = function(channel, resource, resourceId, isActivelyPlaying, hardStop) {
	C$audio$stopSound(channel, true);
	return 0;
};

var lib_audio_sfx_unpause = function(channel, sfxResource, volume, pan) {
	C$audio$resumeSound(channel);
	return 0;
};

var lib_audio_stop = function(sound, reset) {
	C$audio$stopSound(sound);
	return 0;
};

var lib_game_audio_getAudioResourcePath = function(vm, args) {
	return resource_manager_getResourceOfType(vm, args[0][1], "SND");
};

var lib_game_audio_is_supported = function(vm, args) {
	if (C$audio$isAudioSupported()) {
		return vm[13][1];
	}
	return vm[13][2];
};

var lib_game_audio_music_is_playing = function(vm, args) {
	if (C$audio$musicIsPlaying()) {
		return vm[13][1];
	}
	return vm[13][2];
};

var lib_game_audio_music_load_from_file = function(vm, args) {
	return vm[13][0];
};

var lib_game_audio_music_load_from_resource = function(vm, args) {
	var objInstance1 = args[0][1];
	if (lib_audio_music_load_from_resourceImpl(objInstance1, args[1][1])) {
		return vm[13][1];
	}
	return vm[13][2];
};

var lib_game_audio_music_play = function(vm, args) {
	return buildBoolean(vm[13], (lib_audio_music_playImpl(args[0][1], args[1][1], args[2][1], args[3][1], args[4][1]) != -1));
};

var lib_game_audio_music_set_volume = function(vm, args) {
	C$audio$musicSetVolume(args[0][1]);
	return vm[13][0];
};

var lib_game_audio_music_stop = function(vm, args) {
	return vm[13][0];
};

var lib_game_audio_sfx_get_state = function(vm, args) {
	var channelInstance = args[0][1];
	var nativeChannel = channelInstance[3][0];
	var soundInstance = args[1][1];
	var nativeSound = soundInstance[3][0];
	var resourceId = args[2][1];
	return buildInteger(vm[13], lib_audio_sfx_get_stateImpl(nativeChannel, nativeSound, resourceId));
};

var lib_game_audio_sfx_load_from_file = function(vm, args) {
	return vm[13][0];
};

var lib_game_audio_sfx_load_from_resource = function(vm, args) {
	var soundInstance = args[0][1];
	lib_audio_load_sfx_from_resourceImpl(soundInstance, args[1][1]);
	return vm[13][0];
};

var lib_game_audio_sfx_play = function(vm, args) {
	var channelInstance = args[0][1];
	var resourceInstance = args[1][1];
	channelInstance[3] = PST$createNewArray(1);
	var nativeResource = resourceInstance[3][0];
	var vol = args[2][1];
	var pan = args[3][1];
	return buildInteger(vm[13], lib_audio_sfx_launch(nativeResource, channelInstance[3], vol, pan));
};

var lib_game_audio_sfx_resume = function(vm, args) {
	var sndInstance = args[0][1];
	var nativeSound = sndInstance[3][0];
	var sndResInstance = args[1][1];
	var nativeResource = sndResInstance[3][0];
	var vol = args[2][1];
	var pan = args[3][1];
	lib_audio_sfx_unpause(nativeSound, nativeResource, vol, pan);
	return vm[13][0];
};

var lib_game_audio_sfx_set_pan = function(vm, args) {
	var channel = args[0][1];
	var nativeChannel = channel[3][0];
	var resource = args[1][1];
	var nativeResource = resource[3][0];
	lib_audio_sfx_set_panImpl(nativeChannel, nativeResource, args[2][1]);
	return vm[13][0];
};

var lib_game_audio_sfx_set_volume = function(vm, args) {
	var channel = args[0][1];
	var nativeChannel = channel[3][0];
	var resource = args[1][1];
	var nativeResource = resource[3][0];
	lib_audio_sfx_set_volumeImpl(nativeChannel, nativeResource, args[2][1]);
	return vm[13][0];
};

var lib_game_audio_sfx_stop = function(vm, args) {
	var channel = args[0][1];
	var nativeChannel = channel[3][0];
	var resource = args[1][1];
	var nativeResource = resource[3][0];
	var resourceId = args[2][1];
	var currentState = args[3][1];
	var completeStopAndFreeChannel = args[4][1];
	var isAlreadyPaused = ((currentState == 2) && !completeStopAndFreeChannel);
	if (((currentState != 3) && !isAlreadyPaused)) {
		lib_audio_sfx_stopImpl(nativeChannel, nativeResource, resourceId, (currentState == 1), completeStopAndFreeChannel);
	}
	return vm[13][0];
};

var lib_game_clock_tick = function(vm, args) {
	C$game$endFrame();
	vm_suspend_context_by_id(vm, args[0][1], 1);
	return vm[14];
};

var lib_game_gamepad_current_device_count = function(vm, args) {
	var total = 0;
	if ((true && C$gamepad$isSupported())) {
		total = C$gamepad$getDeviceCount();
	}
	return buildInteger(vm[13], total);
};

var lib_game_gamepad_get_axis_1d_state = function(vm, args) {
	var index = args[1][1];
	var dev = args[0][1];
	return buildFloat(vm[13], C$gamepad$getAxisState(dev[3][0], index));
};

var lib_game_gamepad_get_axis_2d_state = function(vm, args) {
	var arg1 = args[0];
	var arg2 = args[1];
	var arg3 = args[2];
	var objInstance1 = arg1[1];
	var int1 = arg2[1];
	var list1 = arg3[1];
	0;
	clearList(list1);
	addToList(list1, buildInteger(vm[13], PST$intBuffer16[0]));
	addToList(list1, buildInteger(vm[13], PST$intBuffer16[1]));
	return vm[14];
};

var lib_game_gamepad_get_button_state = function(vm, args) {
	var int1 = 0;
	var objInstance1 = null;
	var arg1 = args[0];
	var arg2 = args[1];
	objInstance1 = arg1[1];
	int1 = arg2[1];
	if (C$gamepad$getButtonState(objInstance1[3][0], int1)) {
		return vm[15];
	}
	return vm[16];
};

var lib_game_gamepad_get_save_file_path = function(vm, args) {
	var string1 = ".crayon-js.gamepad.config";
	if ((string1 != null)) {
		return buildString(vm[13], string1);
	}
	return vm[14];
};

var lib_game_gamepad_getPlatform = function(vm, args) {
	return buildInteger(vm[13], 3);
};

var lib_game_gamepad_initialize_device = function(vm, args) {
	var int1 = args[0][1];
	var objInstance1 = args[1][1];
	var list1 = args[2][1];
	var object1 = C$gamepad$getDevice(int1);
	objInstance1[3] = PST$createNewArray(1);
	objInstance1[3][0] = object1;
	clearList(list1);
	addToList(list1, buildString(vm[13], C$gamepad$getName(object1)));
	addToList(list1, buildInteger(vm[13], C$gamepad$getButtonCount(object1)));
	addToList(list1, buildInteger(vm[13], C$gamepad$getAxisCount(object1)));
	addToList(list1, buildInteger(vm[13], 0));
	return vm[14];
};

var lib_game_gamepad_is_supported = function(vm, args) {
	if ((true && C$gamepad$isSupported())) {
		return vm[15];
	} else {
		return vm[16];
	}
};

var lib_game_gamepad_jsIsOsx = function(vm, args) {
	return buildInteger(vm[13], (window.navigator.platform == 'MacIntel' ? 1 : 0));
};

var lib_game_gamepad_platform_requires_refresh = function(vm, args) {
	if ((true && C$gamepad$isSupported())) {
		return vm[15];
	}
	return vm[16];
};

var lib_game_gamepad_poll_universe = function(vm, args) {
	C$common$alwaysTrue();
	return vm[14];
};

var lib_game_gamepad_refresh_devices = function(vm, args) {
	C$gamepad$refresh();
	return vm[14];
};

var lib_game_getScreenInfo = function(vm, args) {
	var outList = args[0];
	var o = PST$intBuffer16;
	if (C$game$screenInfo(o)) {
		var output = outList[1];
		clearList(output);
		addToList(output, buildBoolean(vm[13], (o[0] == 1)));
		addToList(output, buildInteger(vm[13], o[1]));
		addToList(output, buildInteger(vm[13], o[2]));
	}
	return outList;
};

var lib_game_getTouchState = function(vm, args) {
	var output = args[0][1];
	var data = PST$createNewArray(31);
	data[0] = 0;
	C$game$getTouchState(data);
	var _len = data[0];
	var end = ((_len * 3) + 1);
	var i = 1;
	while ((i < end)) {
		addToList(output, buildInteger(vm[13], data[i]));
		i += 1;
	}
	return vm[14];
};

var lib_game_initialize = function(vm, args) {
	C$game$initializeGame(getFloat(args[0]));
	return vm[14];
};

var lib_game_initialize_screen = function(vm, args) {
	var ecId = args[4][1];
	var ec = getExecutionContext(vm, ecId);
	C$game$initializeScreen(args[0][1], args[1][1], args[2][1], args[3][1], ecId);
	vm_suspend_for_context(ec, 1);
	return vm[14];
};

var lib_game_pump_events = function(vm, args) {
	var output = args[0][1];
	var eventList = C$game$pumpEventObjects();
	var globals = vm[13];
	clearList(output);
	var _len = eventList.length;
	if ((_len > 0)) {
		var i = 0;
		i = 0;
		while ((i < _len)) {
			var ev = eventList[i];
			addToList(output, buildInteger(globals, ev[0]));
			var t = ev[0];
			addToList(output, buildInteger(globals, ev[1]));
			if ((t >= 32)) {
				addToList(output, buildInteger(globals, ev[2]));
				if ((t == 37)) {
					addToList(output, buildFloat(globals, ev[4]));
				} else {
					if (((t >= 64) && (t < 80))) {
						addToList(output, buildInteger(globals, ev[3]));
					}
				}
			}
			i += 1;
		}
	}
	return args[0];
};

var lib_game_set_title = function(vm, args) {
	C$game$setTitle(args[0][1]);
	return vm[14];
};

var lib_game_set_window_mode = function(vm, args) {
	var mode = args[0][1];
	var width = args[1][1];
	var height = args[2][1];
	C$common$alwaysFalse();
	return vm[14];
};

var lib_game_setInstance = function(vm, args) {
	var o = args[0][1];
	var nd = PST$createNewArray(1);
	nd[0] = null;
	o[3] = nd;
	return vm[14];
};

var lib_game_startup = function(vm, args) {
	var functionLookup = C$game$getCallbackFunctions();
	var names = PST$dictionaryKeys(functionLookup);
	var i = 0;
	while ((i < names.length)) {
		var fn = null;
		var name = names[i];
		fn = functionLookup[name];
		if (fn === undefined) fn = null;
		if ((fn != null)) {
			registerNamedCallback(vm, "Game", name, fn);
		}
		i += 1;
	}
	return vm[14];
};


C$common$scrapeLibFuncNames('game');

// Lookups for fast hex conversion
C$drawing = 1;
C$drawing$HEX = [];
C$drawing$HEXR = [];
C$drawing$events = [];
C$drawing$eventsLength = 0;
C$drawing$images = [];
C$drawing$textChars = [];

for (var i = 0; i < 256; ++i) {
    var t = i.toString(16);
    if (i < 16) t = '0' + t;
    C$drawing$HEX.push(t);
    C$drawing$HEXR.push('#' + t);
}

C$drawing$rendererSetData = function(events, eventsLength, images, textChars) {
    C$drawing$events = events;
    C$drawing$eventsLength = eventsLength;
    C$drawing$images = images;
    C$drawing$textChars = textChars;
    C$game$doRender();
};

C$drawing$render = function(ctx, gameWidth, gameHeight) {
    var ev = C$drawing$events;
    var images = C$drawing$images;
    var imagesIndex = 0;
    var canvas = null;
    var mask = 0;
    var x = 0;
    var y = 0;
    var w = 0;
    var h = 0;
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 0;
    var tw = 0;
    var th = 0;
    var sx = 0;
    var sy = 0;
    var sw = 0;
    var sh = 0;
    var alpha = 0;
    var theta = 0;
    var radiusX = 0;
    var radiusY = 0;
    var path;
    var offset;
    var font;
    var text;
    var textIndex = 0;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    for (var i = 0; i < C$drawing$eventsLength; i += 16) {
        switch (ev[i]) {
            case 1:
                // rectangle
                x = ev[i | 1];
                y = ev[i | 2];
                w = ev[i | 3];
                h = ev[i | 4];
                r = ev[i | 5];
                g = ev[i | 6];
                b = ev[i | 7];
                a = ev[i | 8];

                ctx.fillStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                if (a != 255) {
                    ctx.globalAlpha = a / 255.0;
                    ctx.fillRect(x, y, w + .1, h + .1); // TODO: get to the bottom of this mysterious .1. Is it still necessary?
                    ctx.globalAlpha = 1;
                } else {
                    ctx.fillRect(x, y, w + .1, h + .1);
                }
                break;

            case 2:
                // ellipse
                w = ev[i | 3] / 2; // note that w and h are half width and half height
                h = ev[i | 4] / 2;
                x = ev[i | 1] + w;
                y = ev[i | 2] + h;
                r = ev[i | 5];
                g = ev[i | 6];
                b = ev[i | 7];
                a = ev[i | 8];

                w = w * 4 / 3; // no idea why this needs to exist to look correct...
                ctx.beginPath();
                ctx.moveTo(x, y - h);
                ctx.bezierCurveTo(
                    x + w, y - h,
                    x + w, y + h,
                    x, y + h);
                ctx.bezierCurveTo(
                    x - w, y + h,
                    x - w, y - h,
                    x, y - h);
                ctx.fillStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                if (a != 255) {
                    ctx.globalAlpha = a / 255.0;
                    ctx.fill();
                    ctx.closePath();
                    ctx.globalAlpha = 1;
                } else {
                    ctx.fill();
                    ctx.closePath();
                }
                break;

            case 3:
                // line
                ax = ev[i | 1];
                ay = ev[i | 2];
                bx = ev[i | 3];
                by = ev[i | 4];
                width = ev[i | 5];
                r = ev[i | 6];
                g = ev[i | 7];
                b = ev[i | 8];
                a = ev[i | 9];

                if (a > 0) {
                    offset = ((width % 2) == 0) ? 0 : .5;
                    ctx.beginPath();
                    ctx.moveTo(ax + offset, ay + offset);
                    ctx.lineTo(bx + offset, by + offset);
                    ctx.lineWidth = width;
                    if (a < 255) {
                        ctx.globalAlpha = a / 255;
                        ctx.strokeStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                    } else {
                        ctx.strokeStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
                break;

            case 4: // triangle
            case 5: // quad
                ax = ev[i | 1];
                ay = ev[i | 2];
                bx = ev[i | 3];
                by = ev[i | 4];
                cx = ev[i | 5];
                cy = ev[i | 6];
                if (ev[i] == 4) {
                    // triangle
                    dx = null;
                    r = ev[i | 7];
                    g = ev[i | 8];
                    b = ev[i | 9];
                    a = ev[i | 10];
                } else {
                    // quad
                    dx = ev[i | 7];
                    dy = ev[i | 8]
                    r = ev[i | 9];
                    g = ev[i | 10];
                    b = ev[i | 11];
                    a = ev[i | 12];
                }

                if (a > 0) {
                    path = new Path2D();
                    path.moveTo(ax, ay);
                    path.lineTo(bx, by);
                    path.lineTo(cx, cy);
                    if (dx != null) {
                        path.lineTo(dx, dy);
                    }

                    ctx.fillStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                    if (a < 255) {
                        ctx.globalAlpha = a / 255;
                        ctx.fill(path);
                        ctx.globalAlpha = 1;
                    } else {
                        ctx.fill(path);
                    }
                }

                break;

            case 6:
                // images
                canvas = images[imagesIndex++][0][3];
                x = ev[i | 8];
                y = ev[i | 9];
                w = canvas.width;
                h = canvas.height;
                mask = ev[i | 1];
                if (mask == 0) {
                    // basic case
                    ctx.drawImage(canvas, 0, 0, w, h, x, y, w, h);
                } else if ((mask & 4) != 0) {
                    // rotation is involved
                    theta = ev[i | 10] / 1048576.0;
                    if ((mask & 3) == 0) {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(theta);

                        if ((mask & 8) == 0) {
                            ctx.drawImage(canvas, -w / 2, -h / 2);
                        } else {
                            ctx.globalAlpha = ev[i | 11] / 255;
                            ctx.drawImage(canvas, -w / 2, -h / 2);
                            ctx.globalAlpha = 1;
                        }
                        ctx.restore();
                    } else {
                        // TODO: slice and scale a picture and rotate it.
                    }
                } else {
                    // no rotation
                    if ((mask & 1) == 0) {
                        sx = 0;
                        sy = 0;
                        sw = w;
                        sh = h;
                    } else {
                        sx = ev[i | 2];
                        sy = ev[i | 3];
                        sw = ev[i | 4];
                        sh = ev[i | 5];
                    }
                    if ((mask & 2) == 0) {
                        tw = sw;
                        th = sh;
                    } else {
                        tw = ev[i | 6];
                        th = ev[i | 7];
                    }

                    if ((mask & 8) == 0) {
                        ctx.drawImage(canvas, sx, sy, sw, sh, x, y, tw, th);
                    } else {
                        ctx.globalAlpha = ev[i | 11] / 255;
                        ctx.drawImage(canvas, sx, sy, sw, sh, x, y, tw, th);
                        ctx.globalAlpha = 1;
                    }
                }
                break;

            case 7:
                // text

                x = ev[i | 1];
                y = ev[i | 2];
                font = C$drawing$fontsById[ev[i | 3]];
                height = ev[i | 4] / 1024.0;
                bold = ev[i | 5] == 1; 
                italic = ev[i | 6] == 1;
                r = ev[i | 7];
                g = ev[i | 8];
                b = ev[i | 9];
                a = ev[i | 10];
                // TODO: kerning ev[i | 11]
                // TODO: line height ev[i | 12]
                w = ev[i | 13];

                text = '';
                for (j = 0; j < w; ++j) {
                    text += String.fromCharCode(C$drawing$textChars[textIndex++]);
                }

                ctx.font = (italic ? 'italic ' : '') + (bold ? 'bold ' : '') + height + 'px ' + font;
                ctx.fillStyle = C$drawing$HEXR[r] + C$drawing$HEX[g] + C$drawing$HEX[b];
                if (a != 255) {
                    ctx.globalAlpha = a / 255;
                    ctx.fillText(text, x, y);
                    ctx.globalAlpha = 1;
                } else {
                    ctx.fillText(text, x, y);
                }
                break;
        }

    }
};

C$drawing$flipImage = function (canvas, flipX, flipY) {
  var output = document.createElement('canvas');

  output.width = canvas.width;
  output.height = canvas.height;

  var ctx = output.getContext('2d');

  if (flipX) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
  }
  if (flipY) {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
  }

  ctx.drawImage(canvas, 0, 0);

  if (flipX) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
  }
  if (flipY) {
      ctx.scale(1, -1);
      ctx.translate(0, -canvas.height);
  }

  return output;
};

C$drawing$scaleImage = function (originalCanvas, width, height) {
  var output = document.createElement('canvas');
  var ctx = output.getContext('2d');
  output.width = width;
  output.height = height;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    originalCanvas,
    0, 0, originalCanvas.width, originalCanvas.height,
    0, 0, width, height);
  return output;
};

C$drawing$fontsById = [];

C$drawing$loadFont = function (isSystem, name, id) {
    while (C$drawing$fontsById.length <= id) C$drawing$fontsById.push(null);

    if (isSystem) {
        // TODO: assume it's available. 
        // There's a horrificly hacky hack that's pretty simple to check if a font is availble that involves
        // checking the width of a div element with some text such as "IO" with the following styles applied to it:
        // font-family: "(the font)", sans-serif
        // font-family: "(the font)", monospace
        // If the sizes are the same, then it's available.
        // But for now, assume it's always available.

        C$drawing$fontsById[id] = name;
        return true;
    } else {
        // TODO: this
    }
    return false;
};

C$drawing$pushCodePoints = function (list, string) {
    var byteLength = string.length;
    var logicalLength = 0;
    var c;
    for (var i = 0; i < byteLength; ++i) {
        c = string.charCodeAt(i);
        if (c < 128) {
            list.push(c);
        } else {
            // TODO: decode UTF-8 and update i accordingly
            list.push(c);
        }
        ++logicalLength;
    }

    return logicalLength;
};



C$game = 1;

C$game$width = 0;
C$game$height = 0;
C$game$pwidth = 0;
C$game$pheight = 0;
C$game$fps = 60;
C$game$real_canvas = null;
C$game$virtual_canvas = null;
C$game$scaled_mode = false;
C$game$ctx = null;
C$game$execId = -1;

C$game$now = function() { return (Date.now ? Date.now() : new Date().getTime()) / 1000.0; };
C$game$last_frame_began = C$game$now();

C$game$beginFrame = function () {
    C$game$last_frame_began = C$game$now();
};

C$game$knownSize = null;

C$game$platformSpecificEnforceFullScreen = function(jsCanvas, canvasCtx, windowSize, gameSize) {
    // TODO: make this a no-op and then move this to iOS
    jsCanvas.width = windowSize[0];
    jsCanvas.height = windowSize[1];
    canvasCtx.scale(screen[0] / gameSize[0], screen[1] / gameSize[1]);
};

C$game$getScreenDimensionsForFullScreen = function() {
  return [window.innerWidth, window.innerHeight];
};

C$game$enforceFullScreen = function() {
	var screen = C$game$getScreenDimensionsForFullScreen();
	if (C$game$knownSize === null ||
		C$game$knownSize[0] != screen[0] ||
		C$game$knownSize[1] != screen[1]) {
		
		var phsCanvas = C$game$real_canvas;
		C$game$knownSize = screen;
		C$game$platformSpecificEnforceFullScreen(phsCanvas, C$game$ctx, screen, [C$game$width, C$game$height]);
	}
};

C$game$endFrame = function() {
    if (C$game$scaled_mode) {
        C$game$real_canvas.getContext('2d').drawImage(C$game$virtual_canvas, 0, 0);
    }
    if (!!C$common$globalOptions['fullscreen']) {
		C$game$enforceFullScreen();
    }
    
    C$game$everyFrame();
    window.setTimeout(C$game$runFrame, C$game$computeDelayMillis());
};

C$game$runFrame = function () {
    C$game$beginFrame();
    C$handleVmResult(runInterpreter(C$common$programData, C$game$execId)); // clockTick will induce endFrame()
};

C$game$computeDelayMillis = function () {
    var ideal = 1.0 / C$game$fps;
    var diff = C$game$now() - C$game$last_frame_began;
    var delay = Math.floor((ideal - diff) * 1000);
    if (delay < 1) delay = 1;
    return delay;
};

C$game$initializeGame = function (fps) {
    C$game$fps = fps;
};

C$game$pumpEventObjects = function () {
  var newEvents = [];
  var output = C$input$eventRelays;
  C$input$eventRelays = newEvents;
  return output;
};

C$game$everyFrame = function() {
// override in other platforms
};

C$game$wrapCanvasHtml = function(canvasHtml) {
    return canvasHtml;
};

// TODO: also apply keydown and mousedown handlers
// TODO: (here and python as well) throw an error if you attempt to call this twice.
C$game$initializeScreen = function (width, height, pwidth, pheight, execId) {
  var scaledMode;
  var canvasWidth;
  var canvasHeight;
  var virtualCanvas = null;
  var screenSize = C$game$enforcedScreenSize(pwidth, pheight);
  pwidth = screenSize[0];
  pheight = screenSize[1];
  if (pwidth === null || pheight === null) {
    scaledMode = false;
    canvasWidth = width;
    canvasHeight = height;
  } else {
    scaledMode = true;
    canvasWidth = pwidth;
    canvasHeight = pheight;
    virtualCanvas = document.createElement('canvas');
    virtualCanvas.width = width;
    virtualCanvas.height = height;
  }
  
  var innerHost = C$game$getCrayonHostInner();
  
  // make sure the font loader exists first so that it can hide behind the screen.
  C$game$getFontLoader();
  innerHost.innerHTML +=
	C$game$wrapCanvasHtml('<canvas id="crayon_screen" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>') +
	'<div style="display:none;">' +
		'<img id="crayon_image_loader" crossOrigin="anonymous" />' +
		'<div id="crayon_image_loader_queue"></div>' +
		'<div id="crayon_image_store"></div>' +
		'<div id="crayon_temp_image"></div>' +
		'<div id="crayon_font_loader"></div>' +
	'</div>';
  var canvas = document.getElementById('crayon_screen');

  C$game$scaled_mode = scaledMode;
  C$game$real_canvas = canvas;
  C$game$virtual_canvas = scaledMode ? virtualCanvas : canvas;
  C$game$ctx = canvas.getContext('2d');
  C$game$width = width;
  C$game$height = height;
  C$game$execId = execId;

  C$images$image_loader = document.getElementById('crayon_image_loader');
  C$images$image_store = document.getElementById('crayon_image_store');
  C$images$temp_image = document.getElementById('crayon_temp_image');

  document.onkeydown = C$input$keydown;
  document.onkeyup = C$input$keyup;

  canvas.addEventListener('mousedown', C$input$mousedown);
  canvas.addEventListener('mouseup', C$input$mouseup);
  canvas.addEventListener('mousemove', C$input$mousemove);

  if (C$game$isMobile()) {
	canvas.ontouchstart = C$game$onTouchUpdate;
	canvas.ontouchmove = C$game$onTouchUpdate;
	canvas.ontouchcancel = C$game$onTouchUpdate;
	canvas.ontouchend = C$game$onTouchUpdate;
  }

  C$game$ctx.imageSmoothingEnabled = false;
  C$game$ctx.mozImageSmoothingEnabled = false;
  C$game$ctx.msImageSmoothingEnabled = false;
  C$game$ctx.webkitImageSmoothingEnabled = false;

  if (scaledMode) {
      C$game$ctx.scale(pwidth / width, pheight / height);
  }

  C$game$runFrame();
};

C$game$doRender = function() {
	C$drawing$render(C$game$ctx, C$game$width, C$game$height);
};

C$game$getCrayonHostInner = function() {
  var d = document.getElementById('crayon_host_inner');
  if (!d) {
	document.getElementById('crayon_host').innerHTML = '<div style="position:relative;" id="crayon_host_inner"></div>';
	d = document.getElementById('crayon_host_inner');
  }
  return d;
};

C$game$getFontLoader = function() {
  var host = C$game$getCrayonHostInner();
  var id = 'crayon_font_loader_host';
  var fl = document.getElementById(id);
  if (!fl) {
    host.innerHTML += 
      '<div style="position:absolute;left:0px;top:0px;font-size:8px" id="' + id + '">' + 
	    '<span id="crayon_font_loader_1"></span>' +
	    '<span id="crayon_font_loader_2"></span>' +
	  '</div>';
	fl = document.getElementById(id);
  }
  return fl;
};

C$game$setTitle = function (title) {
  window.document.title = title;
};

C$game$enforcedScreenSize = function(width, height) { return [width, height]; };

C$game$screenInfo = function(o) { return false; };

window.addEventListener('keydown', function(e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

C$game$touches = {}; // { ID -> [x, y] }

C$game$onTouchUpdate = function(ev) {
  ev.preventDefault();
  C$game$touches = {};
  var w = C$game$width;
  var h = C$game$height;
  for (var i = 0; i < ev.touches.length; ++i) {
	var t = ev.touches[i];
	var c = t.target;
	var x = Math.floor(w * (t.clientX - c.clientLeft) / c.clientWidth);
	var y = Math.floor(h * (t.clientY - c.clientTop) / c.clientHeight);
	x = Math.max(0, Math.min(w - 1, x));
	y = Math.max(0, Math.min(h - 1, y));
	C$game$touches[t.identifier] = [x, y];
  }
};

C$game$getTouchState = function(data) {
	var n = 0;
	for (var key in C$game$touches) {
		var p = C$game$touches[key];
		var i = n * 3 + 1;
		data[i] = key;
		data[i + 1] = p[0];
		data[i + 2] = p[1];
		n++;
		if (n > 9) break;
	}
	data[0] = n;
};

C$game$isMobile = function() {
	return navigator.userAgent.indexOf('Mobile') !== -1;
};

C$game$getCallbackFunctions = function() {
	var t = {};
	t["set-render-data"] = function(o) { return C$drawing$rendererSetData(o[0], o[1], o[2], o[3]); };
	return t;
};



C$gamepad = 1;

// devices connected but not yet flushed to the universe.
C$gamepad$queue = [];

// devices made known to the user.
C$gamepad$devices = [];

C$gamepad$support = !!navigator.getGamepads;

C$gamepad$isSupported = function () {
	return C$gamepad$support;
};

C$gamepad$refresh = function () {
	for (i = 0; i < C$gamepad$queue.length; ++i) {
		C$gamepad$devices.push(C$gamepad$queue[i]);
	}
	
	if (C$gamepad$support) {
		var gps = navigator.getGamepads();
		for (var i = 0; i < gps.length; ++i) {
			var gp = gps[i];
			if (!!gp) {
				var known = false;
				for (var j = 0; j < C$gamepad$devices.length; ++j) {
					if (gp == C$gamepad$devices[j]) {
						known = true;
						break;
					}
				}
				if (!known) {
					C$gamepad$devices.push(gp);
				}
			}
		}
	}
	
	C$gamepad$queue = [];
};

C$gamepad$getDeviceCount = function () {
    return C$gamepad$devices.length;
};

C$gamepad$getDevice = function (i) {
    return C$gamepad$devices[i];
};

C$gamepad$getName = function (device) {
  return device.id;
};

C$gamepad$getButtonCount = function (device) {
  return device.buttons.length;
};

C$gamepad$getAxisCount = function (device) {
  return device.axes.length;
};

C$gamepad$getButtonState = function (device, index) {
  return device.buttons[index].pressed;
};

C$gamepad$getAxisState = function (device, index) {
  return device.axes[index];
};

window.addEventListener("gamepadconnected", function (e) {
    C$gamepad$queue.push(e.gamepad);
});

window.addEventListener("gamepaddisconnected", function (e) {
  // ignore for now.
});



C$input = 1;
C$input$eventRelays = [];
C$input$pressedKeys = {};

C$input$mousedown = function (ev) {
    C$input$mousething(ev, true, true);
};

C$input$mouseup = function (ev) {
    C$input$mousething(ev, true, false);
};

C$input$mousemove = function (ev) {
    C$input$mousething(ev, false, 'ignored');
};

C$input$mousething = function (ev, click, down) {
    var pos = C$input$getMousePos(ev);
  var x = pos[0];
  var y = pos[1];
  var rwidth = C$game$real_canvas.width;
  var rheight = C$game$real_canvas.height;
  var vwidth = C$game$virtual_canvas.width;
  var vheight = C$game$virtual_canvas.height;

  x = Math.floor(x * vwidth / rwidth);
  y = Math.floor(y * vheight / rheight);

  if (click) {
    var rightclick = false;
    if (!ev) ev = window.event;
    if (ev.which) rightclick = (ev.which == 3);
    else if (ev.button) rightclick = (ev.button == 2);
    var button = rightclick ? 'right' : 'left';
    C$input$eventRelays.push(buildRelayObj(33 + (rightclick ? 2 : 0) + (down ? 0 : 1), x, y, 0, 0, ''));
  } else {
      C$input$eventRelays.push(buildRelayObj(32, x, y, 0, 0, ''));
  }
};

C$input$getMousePos = function (ev) {
    var obj = C$game$real_canvas;
  var obj_left = 0;
  var obj_top = 0;
  var xpos;
  var ypos;
  while (obj.offsetParent) {
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  if (ev) {
    // Most browsers
    xpos = ev.pageX;
    ypos = ev.pageY;
  } else {
    // Legacy IE
    xpos = window.event.x + document.body.scrollLeft - 2;
    ypos = window.event.y + document.body.scrollTop - 2;
  }
  xpos -= obj_left;
  ypos -= obj_top;
  return [xpos, ypos];
};

C$input$keydown = function (ev) {
    C$input$keydownup(ev, true);
};

C$input$keyup = function (ev) {
    C$input$keydownup(ev, false);
};

C$input$keydownup = function (ev, down) {
  var keycode = ev.which ? ev.which : ev.keyCode;
  if (!!keycode) {
    if (keycode == 59) keycode = 186; // semicolon oddities different across browsers
    if (keycode == 92) keycode--; // left-windows key and right-windows key is just one enum value.
    if (keycode == 173) keycode = 189; // hyphen

    if (down && C$input$pressedKeys[keycode]) {
      // do not allow key repeats.
      return;
    }
    C$input$pressedKeys[keycode] = down;
    C$input$eventRelays.push(buildRelayObj(down ? 16 : 17, keycode, 0, 0, 0, ''));
  }
};



/*
A music native object is a struct-like list of 3 items.
music[0] -> audio object
music[1] -> user-given filepath
music[2] -> URL
music[3] -> is looping

*/

C$audio = 1;
C$audio$dummyAudio = new Audio();
C$audio$musicCurrent = null;
C$audio$soundObjectIndexByFilename = {};
C$audio$soundObjectsByIndex = [];

C$audio$isAudioSupported = function () {
    return C$audio$isAudioEnabled(C$audio$dummyAudio);
};

C$audio$isAudioEnabled = function (audioObj) {
    return !!C$audio$dummyAudio.canPlayType('audio/ogg');
};

C$audio$musicSetVolume = function (r) {
    if (C$audio$musicCurrent != null)
        C$audio$musicCurrent[0].volume = r;
};

C$audio$musicPlay = function (music, loop) {
    if (C$audio$musicIsPlaying()) C$audio$musicCurrent[0].pause();

    if (C$audio$isAudioEnabled(music[0])) {
    if (music[0].readyState == 2) {
      music[0].currentTime = 0;
    }
    music[3] = loop;
    C$audio$musicCurrent = music;
    music[0].play();
  }
};

C$audio$musicStop = function () {
    if (C$audio$musicIsPlaying()) C$audio$musicCurrent[0].pause();
};

C$audio$musicIsPlaying = function () {
    return C$audio$musicCurrent != null && !C$audio$musicCurrent.paused;
};

C$audio$musicLoad = function (filepath) {
    var audioObject = new Audio(C$common$jsFilePrefix + 'resources/audio/' + filepath);
  var m = [
    audioObject,
    filepath,
    filepath,
    false
  ];

  audioObject.addEventListener('ended', function () {
    if (m[3]) { // isLooping.
      this.currentTime = 0;
      this.play();
    }
  }, false);

  return m;
};

/*
  At the core of the sound mixer is a giant list of sound "structs" which are individually treated
  as the "native sound object" to the rest of the translated code.
  Each sound struct is a list composed of 3 items:
  - soundStruct[0] -> a list of JS Audio objects.
  - soundStruct[1] -> the original file name that should be used as the input to new Audio objects.
  - soundStruct[2] -> the index of this object in the overall list of sound structs.

  There is also a reverse lookup of filepaths to the index of where they are in this list.
  When a sound is being loaded, the index is looked up in the reverse lookup. If none is
  found, then a new sound struct is created with exactly 1 Audio object in it with that filename.

  When a sound struct is going to be played, the first Audio object that is not currently playing has
  its .play() method invoked. If there are no available objects, a new one is created and pushed to the
  end of the list. Servers/browsers should be smart enough to start playing this instantly with a 304.

  A channel instance is the following list-struct
  - channelStruct[0] -> soundStruct index
  - channelStruct[1] -> the current audio element that's playing
  - channelStruct[2] -> currentTime value if paused, or null if playing
  - channelStruct[3] -> current state: 0 -> playing, 1 -> paused, 2 -> stopped
*/

C$audio$prepSoundForLoading = function (filepath) {
    var index = C$audio$soundObjectIndexByFilename[filepath];
  if (index === undefined) {
      index = C$audio$soundObjectsByIndex.length;
      var data = [[new Audio(C$common$jsFilePrefix + 'resources/audio/' + filepath)], filepath, index];
    C$audio$soundObjectIndexByFilename[filepath] = index;
    C$audio$soundObjectsByIndex.push(data);
  }

  return C$audio$soundObjectsByIndex[index];
};

C$audio$stopSound = function (channel, isPause) {
  if (channel[3] == 0) {
      var s = C$audio$soundObjectsByIndex[channel[0]];
    var audio = s[0][channel[1]];
    if (!audio.ended) {
      channel[2] = audio.currentTime;
      audio.pause();
      channle[3] = isPause ? 1 : 2;
    }
  }
};

C$audio$resumeSound = function (channel) {
  if (channel[3] == 1) {
      var s = C$audio$soundObjectsByIndex[channel[0]];
      newChannel = C$audio$playSound(s[1], channel[2]); // just discard the new channel object and apply the info to the currently existing reference.
    channel[1] = newChannel[1];
    channel[3] = 0;
  }
};

C$audio$playSound = function (sound, startFrom) {
  var audioList = sound[0];
  var audio = null;
  var audioIndex = 0;
  for (var i = 0; i < audioList.length; ++i) {
    if (!audioList[i].playing) {
      audio = audioList[i];
      audioIndex = i;
      break;
    }
  }
  if (audio == null) {
    audioIndex = audioList.length;
    audio = new Audio(C$common$jsFilePrefix + sound[1]);
    audioList.push(audio);
  }
  if (C$audio$isAudioEnabled(audio)) {
    if (audio.readyState == 2) {
      audio.currentTime = startFrom;
    }
    audio.play();

    // See channel struct comment above.
    return [sound[2], audioIndex, null, 0];
  }
  return [sound[2], audioIndex, null, 2];
};

