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

var lib_fileiocommon_directoryCreate = function(vm, args) {
	var bool1 = false;
	var i = 0;
	var int1 = 0;
	var stringList1 = null;
	var hostObject = args[0];
	var path = args[1][1];
	if (args[2][1]) {
		int1 = 0;
		if (!LIB$fileiocommon$fakedisk$dirExists(lib_fileiocommon_getDiskObject(hostObject), '/')) {
			int1 = 4;
		} else {
			stringList1 = [];
			bool1 = true;
			while ((bool1 && !LIB$fileiocommon$fakedisk$dirExists(lib_fileiocommon_getDiskObject(hostObject), path))) {
				stringList1.push(path);
				int1 = LIB$fileiocommon$fakedisk$getPathParent(path, PST$stringBuffer16);
				path = PST$stringBuffer16[0];
				if ((int1 != 0)) {
					bool1 = false;
				}
			}
			if (bool1) {
				i = (stringList1.length - 1);
				while ((i >= 0)) {
					path = stringList1[i];
					int1 = LIB$fileiocommon$fakedisk$mkdir(lib_fileiocommon_getDiskObject(hostObject), path);
					if ((int1 != 0)) {
						i = -1;
					}
					i -= 1;
				}
			}
		}
	} else {
		int1 = LIB$fileiocommon$fakedisk$mkdir(lib_fileiocommon_getDiskObject(hostObject), path);
	}
	return buildInteger(vm[13], int1);
};

var lib_fileiocommon_directoryDelete = function(vm, args) {
	var sc = LIB$fileiocommon$fakedisk$rmdir(lib_fileiocommon_getDiskObject(args[0]), args[1][1]);
	return buildInteger(vm[13], sc);
};

var lib_fileiocommon_directoryList = function(vm, args) {
	var diskhost = args[0];
	var path = args[1][1];
	var useFullPath = args[2][1];
	var outputList = args[3][1];
	var stringList1 = [];
	var sc = LIB$fileiocommon$fakedisk$listdir(lib_fileiocommon_getDiskObject(diskhost), path, useFullPath, stringList1);
	if ((sc == 0)) {
		var i = 0;
		while ((i < stringList1.length)) {
			addToList(outputList, buildString(vm[13], stringList1[i]));
			i += 1;
		}
	}
	return buildInteger(vm[13], sc);
};

var lib_fileiocommon_directoryMove = function(vm, args) {
	var statusCode = LIB$fileiocommon$fakedisk$movedir(lib_fileiocommon_getDiskObject(args[0]), args[1][1], args[2][1]);
	return buildInteger(vm[13], statusCode);
};

var lib_fileiocommon_fileDelete = function(vm, args) {
	var statusCode = LIB$fileiocommon$fakedisk$fileDelete(lib_fileiocommon_getDiskObject(args[0]), args[1][1]);
	return buildInteger(vm[13], statusCode);
};

var lib_fileiocommon_fileInfo = function(vm, args) {
	var mask = args[2][1];
	LIB$fileiocommon$fakedisk$getPathInfoExt(lib_fileiocommon_getDiskObject(args[0]), args[1][1], mask, PST$intBuffer16, PST$floatBuffer16);
	var outputList = args[3][1];
	clearList(outputList);
	var globals = vm[13];
	addToList(outputList, buildBoolean(globals, (PST$intBuffer16[0] > 0)));
	addToList(outputList, buildBoolean(globals, (PST$intBuffer16[1] > 0)));
	if (((mask & 1) != 0)) {
		addToList(outputList, buildInteger(globals, PST$intBuffer16[2]));
	} else {
		addToList(outputList, globals[0]);
	}
	if (((mask & 2) != 0)) {
		addToList(outputList, buildBoolean(globals, (PST$intBuffer16[3] > 0)));
	} else {
		addToList(outputList, globals[0]);
	}
	if (((mask & 4) != 0)) {
		addToList(outputList, buildFloat(globals, PST$floatBuffer16[0]));
	} else {
		addToList(outputList, globals[0]);
	}
	if (((mask & 8) != 0)) {
		addToList(outputList, buildFloat(globals, PST$floatBuffer16[1]));
	} else {
		addToList(outputList, globals[0]);
	}
	return args[3];
};

var lib_fileiocommon_fileMove = function(vm, args) {
	var statusCode = LIB$fileiocommon$fakedisk$fileMove(lib_fileiocommon_getDiskObject(args[0]), args[1][1], args[2][1], args[3][1], args[4][1]);
	return buildInteger(vm[13], statusCode);
};

var lib_fileiocommon_fileRead = function(vm, args) {
	var diskHostObject = args[0];
	var sandboxedPath = args[1][1];
	var readDataAsBytes = args[2][1];
	var outputList = args[3][1];
	var tList = [];
	var statusCode = LIB$fileiocommon$fakedisk$fileRead(lib_fileiocommon_getDiskObject(diskHostObject), sandboxedPath, readDataAsBytes, PST$stringBuffer16, vm[13][9], tList);
	if (((statusCode == 0) && !readDataAsBytes)) {
		addToList(outputList, buildString(vm[13], PST$stringBuffer16[0]));
	} else {
		outputList[2] = tList;
		outputList[1] = tList.length;
	}
	return buildInteger(vm[13], statusCode);
};

var lib_fileiocommon_fileWrite = function(vm, args) {
	var ints = vm[13][9];
	if ((args[3][0] != 3)) {
		return ints[3];
	}
	var statusCode = 0;
	var contentString = null;
	var byteArrayRef = null;
	var format = args[3][1];
	if ((format == 0)) {
		byteArrayRef = lib_fileiocommon_listToBytes(args[2][1]);
		if ((byteArrayRef == null)) {
			return ints[6];
		}
	} else {
		if ((args[2][0] != 5)) {
			return ints[6];
		} else {
			contentString = args[2][1];
		}
	}
	if ((statusCode == 0)) {
		statusCode = LIB$fileiocommon$fakedisk$fileWrite(lib_fileiocommon_getDiskObject(args[0]), args[1][1], format, contentString, byteArrayRef);
	}
	return buildInteger(vm[13], statusCode);
};

var lib_fileiocommon_getCurrentDirectory = function(vm, args) {
	return buildString(vm[13], '/');
};

var lib_fileiocommon_getDiskObject = function(diskObjectArg) {
	var objInst = diskObjectArg[1];
	return objInst[3][0];
};

var lib_fileiocommon_getUserDirectory = function(vm, args) {
	return buildString(vm[13], '/');
};

var lib_fileiocommon_initializeDisk = function(vm, args) {
	var objInstance1 = args[0][1];
	var objArray1 = PST$createNewArray(1);
	objInstance1[3] = objArray1;
	var object1 = LIB$fileiocommon$fakedisk$create(args[1][1]);
	objArray1[0] = object1;
	return vm[13][0];
};

var lib_fileiocommon_isWindows = function(vm, args) {
	if (C$common$alwaysFalse()) {
		return vm[13][1];
	}
	return vm[13][2];
};

var lib_fileiocommon_listToBytes = function(listOfMaybeInts) {
	var bytes = PST$createNewArray(listOfMaybeInts[1]);
	var intValue = null;
	var byteValue = 0;
	var i = (listOfMaybeInts[1] - 1);
	while ((i >= 0)) {
		intValue = listOfMaybeInts[2][i];
		if ((intValue[0] != 3)) {
			return null;
		}
		byteValue = intValue[1];
		if ((byteValue >= 256)) {
			return null;
		}
		if ((byteValue < 0)) {
			if ((byteValue < -128)) {
				return null;
			}
			byteValue += 256;
		}
		bytes[i] = byteValue;
		i -= 1;
	}
	return bytes;
};

var lib_fileiocommon_textToLines = function(vm, args) {
	lib_fileiocommon_textToLinesImpl(vm[13], args[0][1], args[1][1]);
	return args[1];
};

var lib_fileiocommon_textToLinesImpl = function(globals, text, output) {
	var stringList = [];
	LIB$fileiocommon$fakedisk$textToLines(text, stringList);
	var _len = stringList.length;
	var i = 0;
	while ((i < _len)) {
		addToList(output, buildString(globals, stringList[i]));
		i += 1;
	}
	return 0;
};


C$common$scrapeLibFuncNames('fileiocommon');

/*
	Fake disk is a disk implemented over a simple string-to-string dictionary.
	There are two scenarios for this:
	- Creating a temporary fully sandboxed file system using a new empty dictionary {}
	- Creating a persistent data store using the localStorage dictionary.
	
	There are 4 types of keys. All keys have a special prefix to prevent collisions
	with other apps in the case of using localStorage. 
	
	- {prefix}:version - A number. Each time a change occurs to the fakedisk, increment the version
	- {prefix}:nextId - An ID allocator. Used for generating new file ID#'s
	- {prefix}:disk - A serialized string containing all directory and file metadata
	- {prefix}:F{file ID#} - the contents of files with the given ID#. This can either be a string or a hex-encoded byte string 
	
	Fake disk is not optimized for vast and complex virtual disks.
	The most common scenario is storing a couple of relatively small user-preference files.
	
	The disk value is a JSON string.
	Read this string when you are about to make a change and the current version is old.
	Serialize your version back to a string and increment the version in localStorage / the dictionary.
	
	Local disk is a series of nested objects that represent files and directories.
	
	Directory:
	{
		d --> is a directory (boolean, always true)
		c --> created timestamp (int)
		m --> modified timestamp (int)
		f --> files (dictionary keyed by name string)
		root --> true or undefined if this is the root directory
	}
	
	File:
	{
		d --> is a directory (boolean, always false)
		c --> created timestamp (int)
		m --> created timestamp (int)
		i --> id (int)
		s --> size (int)
		b --> is stored as hex string (bool)
	}
	
	Fake Disk object:
	{
		v --> version
		r --> local cache of root object
		s --> string-based storage, either a JS object or localStorage
		u --> uses local storage? (bool)
		p --> prefix
		d --> recently deleted file ID's
	}
		
*/

LIB$fileiocommon$fakedisk$createDefault = function() {
	return {d:true,c:0,m:0,f:{}};
}

LIB$fileiocommon$fakedisk$create = function(useLocalStorage) {
	return {
		v:-1,
		r: LIB$fileiocommon$fakedisk$createDefault(), // root directory
		u: useLocalStorage, // distinction is necessary to invoke .removeItem(key)
		s: useLocalStorage ? window.localStorage : {},
		p: 'PREFIX:', // TODO get the real file prefix
		d: [], // recently deleted file ID's
	};
};


LIB$fileiocommon$fakedisk$ensureLatest = function(disk) {
	var version = parseInt(disk.s[disk.p + 'version']);
	if (!(version > 0)) { // could be NaN
		LIB$fileiocommon$fakedisk$format(disk);
		return LIB$fileiocommon$fakedisk$ensureLatest(disk);
	}
	if (version != disk.v) {
		var json = disk.s[disk.p + 'disk'];
		var success = false;
		if (!!json && json.length > 0) {
			try {
				disk.r = JSON.parse(json);
				disk.v = version;
				success = true;
			} catch (e) {}
		}
		if (!success) {
			LIB$fileiocommon$fakedisk$format(disk);
			disk.r = LIB$fileiocommon$fakedisk$createDefault();
			disk.v = 0;
			disk.s[disk.p + 'version'] = disk.v + '';
		}
	}
	disk.r.root = true;
};

LIB$fileiocommon$fakedisk$pushChanges = function(disk) {
	disk.s[disk.p + 'disk'] = JSON.stringify(disk.r);
	disk.s[disk.p + 'version'] = ++disk.v;
	for (var i = 0; i < disk.d.length; ++i) {
		disk.s.removeItem(prefix + 'F' + disk.d[i]);
	}
	disk.d = [];
};

LIB$fileiocommon$fakedisk$format = function(disk) {
	var keys = [];
	for (var key in disk.s) {
		if (key.startsWith(disk.p)) keys.push(key);
	}
	for (var i = 0; i < keys.length; ++i) {
		if (disk.u) disk.s.removeItem(keys[i]);
		else delete disk.s[keys[i]];
	}
	disk.s[disk.p + 'version'] = '1';
	disk.s[disk.p + 'nextId'] = '1';
	disk.s[disk.p + 'disk'] = JSON.stringify(LIB$fileiocommon$fakedisk$createDefault());
};

LIB$fileiocommon$fakedisk$getNormalizedPath = function(path) {
	var rawParts = path.split('/');
	var parts = [];
	for (var i = 0; i < rawParts.length; ++i) {
		if (rawParts[i].length > 0) {
			parts.push(rawParts[i]);
		}
	}
	return parts;
}

LIB$fileiocommon$fakedisk$getFileName = function(path) {
	var pathParts = LIB$fileiocommon$fakedisk$getNormalizedPath(path);
	if (pathParts.length == 0) return null;
	return pathParts[pathParts.length - 1];
}

LIB$fileiocommon$fakedisk$now = function() {
	return Math.floor(new Date().getTime());
};

LIB$fileiocommon$fakedisk$getNode = function(disk, path, getParent) {
	var parts = LIB$fileiocommon$fakedisk$getNormalizedPath(path);
	if (getParent && parts.length == 0) return null;
	if (getParent) parts.pop();
	
	LIB$fileiocommon$fakedisk$ensureLatest(disk);
	
	var current = disk.r;
	for (var i = 0; i < parts.length; ++i) {
		if (!current.d) return null;
		current = current.f[parts[i]];
		if (current === undefined) return null;
	}
	
	return current;
};

/*
	status codes:
		0 -> success
		4 -> not found
*/
LIB$fileiocommon$fakedisk$listdir = function(disk, path, includeFullPath, filesOut) {
	var dir = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (dir == null || !dir.d) return 4;
	var prefix = '';
	if (includeFullPath) {
		var parts = LIB$fileiocommon$fakedisk$getNormalizedPath(path);
		if (parts.length == 0) prefix = '/';
		else {
			prefix = '/' + parts.join('/') + '/';
		}
	}
	for (var file in dir.f) {
		filesOut.push(prefix + file);
	}
	filesOut.sort();
	return 0;
};

/*
	status codes:
	0 -> OK
	1 -> unknown -- occurs when name is invalid or there's something already there
	4 -> directory not found
	8 -> access denied
	11 -> target parent doesn't exist
*/
LIB$fileiocommon$fakedisk$movedir = function(disk, fromPath, toPath) {
	var toName = LIB$fileiocommon$fakedisk$getFileName(toPath);
	var fromName = LIB$fileiocommon$fakedisk$getFileName(fromPath);
	if (!LIB$fileiocommon$fakedisk$isFileNameValid(toName)) return 1;
	var fromDir = LIB$fileiocommon$fakedisk$getNode(disk, fromPath, false);
	if (fromDir == null || !fromDir.d) return 4;
	if (!!fromDir.root) return 8;
	var toDir = LIB$fileiocommon$fakedisk$getNode(disk, toPath, true);
	if (toDir == null || !toDir.d) return 11;
	var toItem = LIB$fileiocommon$fakedisk$getNode(disk, toPath, false);
	if (toItem != null) return 1;
	var fromParent = LIB$fileiocommon$fakedisk$getNode(disk, fromPath, true);
	delete fromParent.f[fromName];
	toDir.f[toName] = fromDir;
	LIB$fileiocommon$fakedisk$pushChanges(disk);
	return 0;
};

LIB$fileiocommon$fakedisk$isFileNameValid = function(name) {
	if (name.length == 0) return false;
	for (var i = 0; i < name.length; ++i) {
		switch (name[i]) {
			case ':':
			case '\\':
			case '\n':
			case '\r':
			case '\0':
			case '\t':
			case '>':
			case '<':
			case '|':
			case '?':
			case '*':
				return false;
			default: break;
		}
	}
	return true;
};

/*
	status codes:
		0 -> success
		1 -> unknown error
		
		// TODO: need to update translated code to expect better error conditions
		
		1 -> parent does not exist
		2 -> something already exists there
		3 -> invalid directory name
*/
LIB$fileiocommon$fakedisk$mkdir = function(disk, path) {
	var dir = LIB$fileiocommon$fakedisk$getNode(disk, path, true);
	if (dir == null || !dir.d) return 1; //1;
	var file = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (file != null) return 1; // 2;
	var name = LIB$fileiocommon$fakedisk$getFileName(path);
	if (!LIB$fileiocommon$fakedisk$isFileNameValid(name)) return 1; //3;
	var now = LIB$fileiocommon$fakedisk$now();
	dir.f[name] = {
		d: true,
		c: now,
		m: now,
		f: {}
	};
	LIB$fileiocommon$fakedisk$pushChanges(disk);
	return 0;
};

/*
	status codes:
		0 -> success
		1 -> directory not found
		2 -> access denied (tried to delete root)
		3 -> unknown error (file seemingly disappeared during the middle of the dir update)
*/
LIB$fileiocommon$fakedisk$rmdir = function(disk, path) {
	var dir = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (dir == null || !dir.d) return 1;
	var parent = LIB$fileiocommon$fakedisk$getNode(disk, path, true);
	if (parent == null) return 2;
	var name = LIB$fileiocommon$fakedisk$getFileName(path);
	if (parent.f[name] === undefined) return 3;
	delete parent.f[name];
	// TODO: go through and unlink all affected file ID's
	LIB$fileiocommon$fakedisk$pushChanges(disk);
};

/*
	status codes:
		0 -> success
		1 -> unknownn -- occurs when file name was invalid
		3 -> bad encoding
		4 -> parent directory not found
*/
LIB$fileiocommon$fakedisk$fileWrite = function(disk, path, format, contentString, contentBytes) {
	var isBytes = format == 0;
	if (format < 0 || format > 5) return 3;
	var content = isBytes ? contentBytes : contentString;
	var size = content.length;
	var encodedContent = content;
	if (isBytes) {
		var sb = [];
		var b;
		for (var i = 0; i < encodedContent.length; ++i) {
			b = encodedContent[i].toString(16);
			if (b.length == 1) b = '0' + b;
			sb.push(b);
		}
		encodedContent = sb.join('');
	}
	
	var dir = LIB$fileiocommon$fakedisk$getNode(disk, path, true);
	if (dir == null || !dir.d) return 4;
	var file = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	var name = LIB$fileiocommon$fakedisk$getFileName(path);
	if (!LIB$fileiocommon$fakedisk$isFileNameValid(name)) return 1;
	var id;
	var now = LIB$fileiocommon$fakedisk$now();
	if (file == null) {
		// new file. get new ID. set created and modified times.
		var id = LIB$fileiocommon$fakedisk$getNextId(disk);
		file = {
			d: false,
			i: id,
			c: now,
			m: now,
			b: isBytes,
			s: size
		};
	} else {
		// old file. use old ID. set modified time. don't change created time.
		id = file.i;
		file.m = now;
		file.s = size;
		file.b = isBytes;
	}
	dir.f[name] = file;
	disk.s[disk.p + 'F' + id] = encodedContent;
	LIB$fileiocommon$fakedisk$pushChanges(disk);
	return 0;
};

LIB$fileiocommon$fakedisk$getNextId = function(disk) {
	var k = disk.p + 'nextId';
	var id = parseInt(disk.s[k]);
	if (!(id == id)) id = 1;
	disk.s[k] = '' + (id + 1);
	return id;
};

LIB$fileiocommon$fakedisk$removeBom = function(s) {
	return (s.length > 2 && s.charCodeAt(0) == 239 && s.charCodeAt(1) == 187 && s.charCodeAt(2) == 191)
		? s.substring(3)
		: s;
};

/*
	status codes:
		0 -> OK
		4 -> file not found
	
	if reading as text, set stringOut[0] as the contents
	if reading as bytes, add integerObjectCache[byteValue]'s to the them to bytesOut
*/
LIB$fileiocommon$fakedisk$fileRead = function(disk, path, readAsBytes, stringOut, integerObjectCache, bytesOut) {
	var file = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (file == null) return 4;
	var content = disk.s[disk.p + 'F' + file.i];
	if (content === undefined) content = [];
	
	// is a string and read as string...
	if (!file.b && !readAsBytes) {
		stringOut[0] = LIB$fileiocommon$fakedisk$removeBom(content);
		return 0;
	}
	
	// file is encoded as bytes
	if (file.b) {
		// get the bytes
		var sb = [];
		var b;
		for (var i = 0; i < content.length; i += 2) {
			b = parseInt(content[i], 16) * 16 + parseInt(content[i + 1], 16);
			if (b == b) {
				if (readAsBytes) {
					bytesOut.push(integerObjectCache[b]);
				} else {
					sb.push(String.fromCharCode(b));
				}
			} // drop invalid bytes
		}
		
		if (!readAsBytes) {
			stringOut[0] = LIB$fileiocommon$fakedisk$removeBom(sb.join(''));
		}
		return 0;
	}
	
	// otherwise it's a string and we want bytes.
	var bytes = [];
	for (var i = 0; i < content.length; ++i) {
		bytesOut.push(integerObjectCache[content.charCodeAt(i)]);
	}
	return 0;
};

/*
	status codes
		0 -> OK
		1 -> unknown error -- occurs if there is a directory OR if topath is not a valid name
		4 -> from path doesn't exist or to directory doesn't exist or isn't a directory
		9 -> file exists and allowOverwrite isn't true
*/
LIB$fileiocommon$fakedisk$fileMove = function(disk, fromPath, toPath, isCopy, allowOverwrite) {
	var toName = LIB$fileiocommon$fakedisk$getFileName(toPath);
	var fromName = LIB$fileiocommon$fakedisk$getFileName(fromPath);
	if (!LIB$fileiocommon$fakedisk$isFileNameValid(toName)) return 1;
	var file = LIB$fileiocommon$fakedisk$getNode(disk, fromPath, false);
	if (file == null || file.d) return 4;
	var fromDir = LIB$fileiocommon$fakedisk$getNode(disk, fromPath, true);
	var toDir = LIB$fileiocommon$fakedisk$getNode(disk, toPath, true);
	if (toDir == null || !toDir.d) return 4;
	var toFile = LIB$fileiocommon$fakedisk$getNode(disk, toPath, false);
	var isOverwrite = toFile != null;
	var deletedId = null;
	if (isOverwrite) {
		if (toFile.d) return 1;
		if (!allowOverwrite) return 9;
		disk.d.push(toFile.i);
	}
	
	var deleteFrom = true;
	var newFile = file;
	if (isCopy) {
		newFile = {
			d: false,
			c: file.c,
			m: file.m,
			i:  LIB$fileiocommon$fakedisk$getNextId(disk),
			s: file.s,
			b: file.b
		};
		disk.s[disk.p + 'F' + newFile.i] = disk.s[disk.p + 'F' + file.i];
		deleteFrom = false;
	}
	
	toDir.f[toName] = newFile;
	if (deleteFrom && fromDir.f[fromname] !== undefined) {
		delete fromDir.f[fromName];
	}
	
	LIB$fileiocommon$fakedisk$pushChanges(disk);
	return 0;
};

// Called safely (won't try to traverse above root)
LIB$fileiocommon$fakedisk$getPathParent = function(path, stringOut) {
	parts = LIB$fileiocommon$fakedisk$getNormalizedPath(path);
	parts.pop();
	stringOut[0] = '/' + parts.join('/');
	return 0;
};

/*
	status codes:
		0 -> OK
		1 -> unknown error -- occurs if for some odd reason the file is found but the parent isn't
		4 -> not found
*/
LIB$fileiocommon$fakedisk$fileDelete = function(disk, path) {
	var file = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (file == null || file.d) return 4;
	var parent = LIB$fileiocommon$fakedisk$getNode(disk, path, true);
	if (parent == null || !parent.d) return 1; // not sure how that would happen
	var name = LIB$fileiocommon$fakedisk$getFileName(path);
	
	if (parent.f[name] !== undefined) {
		delete parent.f[name];
	}
	
	var key = disk.p + 'F' + file.i;
	
	if (disk.s[key] !== undefined) {
		if (disk.u) disk.s.removedItem(key);
		else { delete disk.s[key]; }
		disk.d.push(file.i);
	}
	return 0;
};

/*
	[
		exists?,
		is directory?,
		file size?
		created timestamp?
		modified timestamp?
	]
*/
LIB$fileiocommon$fakedisk$pathInfo = function(disk, path) {
	var item = LIB$fileiocommon$fakedisk$getNode(disk, path, false);
	if (item == null) return [false, false, 0, 0, 0];
	return [true, item.d, item.s, item.c, item.m];
};

LIB$fileiocommon$fakedisk$dirExists = function(disk, path) {
	return LIB$fileiocommon$fakedisk$pathInfo(disk, path)[1];
};

LIB$fileiocommon$fakedisk$getPathInfoExt = function(disk, path, mask, intOut, floatOut) {
	var info = LIB$fileiocommon$fakedisk$pathInfo(disk, path)
	intOut[0] = info[0] ? 1 : 0;
	intOut[1] = info[1] ? 1 : 0;
	if (info[0] && !info[1]) {
		intOut[2] = info[2];
	}
	intOut[3] = 0;
	floatOut[0] = info[3] / 1000;
	floatOut[1] = info[4] / 1000;
};

LIB$fileiocommon$fakedisk$textToLines = function(text, stringOut) {
	var sb = [];
	var length = text.length;
	var c;
	var c2;
	for (var i = 0; i < length; ++i) {
		c = text.charAt(i);
		if (c == '\n' || c == '\r') {
			c2 = (i + 1 < length) ? text.charAt(i + 1) : '@';
			if (c == '\r' && c2 == '\n') {
				// Windows line ending
				sb.push("\r\n");
				stringOut.push(sb.join(''));
				sb = [];
				++i;
			}
			else if (c == '\n')
			{
				// Linux line ending
				sb.push("\n");
				stringOut.push(sb.join(''));
				sb = [];
			}
			else if (c == '\r')
			{
				// legacy Mac line ending
				sb.push("\r");
				stringOut.push(sb.join(''));
				sb = [];
			}
			else
			{
				sb.push(c);
			}
		}
		else
		{
			sb.push(c);
		}
	}
	stringOut.push(sb.join(''));
};
