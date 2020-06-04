PST$createNewArray = function(s) {
	var o = [];
	while (s-- > 0) o.push(null);
	return o;
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

PST$intBuffer16 = PST$multiplyList([0], 16);

PST$stringBuffer16 = PST$multiplyList([''], 16);

var lib_http_fastEnsureAllBytes = function(vm, args) {
	if ((args[0][0] == 6)) {
		var list1 = args[0][1];
		var i = list1[1];
		var int1 = 0;
		var intArray1 = PST$createNewArray(i);
		var value = null;
		while ((i > 0)) {
			i -= 1;
			value = list1[2][i];
			if ((value[0] != 3)) {
				return vm[16];
			}
			int1 = value[1];
			if ((int1 < 0)) {
				if ((int1 < -128)) {
					return vm[16];
				}
				int1 += 256;
			} else if ((int1 >= 256)) {
				return vm[16];
			}
			intArray1[i] = int1;
		}
		var objArray1 = PST$createNewArray(1);
		objArray1[0] = intArray1;
		var objInstance1 = args[1][1];
		objInstance1[3] = objArray1;
		return vm[15];
	}
	return vm[16];
};

var lib_http_getResponseBytes = function(vm, args) {
	var outputListValue = args[1];
	var objInstance1 = args[0][1];
	var objArray1 = objInstance1[3];
	var tList = [];
	LIB$http$getResponseBytes(objArray1[0], vm[13][9], tList);
	var outputList = outputListValue[1];
	outputList[2] = tList;
	outputList[1] = tList.length;
	return outputListValue;
};

var lib_http_pollRequest = function(vm, args) {
	var objInstance1 = args[0][1];
	var objArray1 = objInstance1[3];
	if (LIB$http$pollRequest(objArray1)) {
		return vm[15];
	}
	return vm[16];
};

var lib_http_populateResponse = function(vm, args) {
	var arg2 = args[1];
	var arg3 = args[2];
	var arg4 = args[3];
	var objInstance1 = args[0][1];
	var object1 = objInstance1[3][0];
	var objArray1 = PST$createNewArray(1);
	var stringList1 = [];
	LIB$http$readResponseData(object1, PST$intBuffer16, PST$stringBuffer16, objArray1, stringList1);
	objInstance1 = arg2[1];
	objInstance1[3] = objArray1;
	var outputList = arg3[1];
	addToList(outputList, buildInteger(vm[13], PST$intBuffer16[0]));
	addToList(outputList, buildString(vm[13], PST$stringBuffer16[0]));
	var value = vm[14];
	var value2 = vm[15];
	if ((PST$intBuffer16[1] == 0)) {
		value = buildString(vm[13], PST$stringBuffer16[1]);
		value2 = vm[16];
	}
	addToList(outputList, value);
	addToList(outputList, value2);
	var list1 = arg4[1];
	var i = 0;
	while ((i < stringList1.length)) {
		addToList(list1, buildString(vm[13], stringList1[i]));
		i += 1;
	}
	return vm[14];
};

var lib_http_sendRequest = function(vm, args) {
	var body = args[5];
	var objInstance1 = args[0][1];
	var objArray1 = PST$createNewArray(3);
	objInstance1[3] = objArray1;
	objArray1[2] = false;
	var method = args[2][1];
	var url = args[3][1];
	var headers = [];
	var list1 = args[4][1];
	var i = 0;
	while ((i < list1[1])) {
		headers.push(list1[2][i][1]);
		i += 1;
	}
	var bodyRawObject = body[1];
	var bodyState = 0;
	if ((body[0] == 5)) {
		bodyState = 1;
	} else if ((body[0] == 8)) {
		objInstance1 = bodyRawObject;
		bodyRawObject = objInstance1[3][0];
		bodyState = 2;
	} else {
		bodyRawObject = null;
	}
	var getResponseAsText = (args[6][1] == 1);
	if (args[1][1]) {
		LIB$http$sendRequestAsync(objArray1, method, url, headers, bodyState, bodyRawObject, getResponseAsText, vm, args[8], (args[9][1])[3]);
	} else {
		var execId = args[7][1];
		if (LIB$http$sendRequestSync(objArray1, method, url, headers, bodyState, bodyRawObject, getResponseAsText, execId, vm)) {
			vm_suspend_context_by_id(vm, execId, 1);
		}
	}
	return vm[14];
};


C$common$scrapeLibFuncNames('http');


LIB$http$makeHttpRequest = function(requestNativeData, method, url, contentMode, content, requestHeaders, outputIsBinary, executionContextId, vm, cb) {
	var xhr = new XMLHttpRequest({ mozSystem: true });

	xhr.open(method, url, true);
	
	xhr.onload = function () {
		if (xhr.readyState == 4) {
			var rawHeaders = xhr.getAllResponseHeaders().trim().split('\r\n');
			var responseHeaders = [];
			for (var i = 0; i < rawHeaders.length; ++i) {
				var parts = rawHeaders[i].split(':', 2);
				responseHeaders.push(parts[0].trim());
				responseHeaders.push(parts.length > 1 ? parts[1].trim() : '');
			}
			var data = outputIsBinary ? xhr.response : xhr.responseText;
			requestNativeData[0] = {
				'sc': xhr.status,
				'sm': xhr.statusText,
				'ib': outputIsBinary, 
				'cb': outputIsBinary ? data : null,
				'cs': outputIsBinary ? null : data,
				'h': responseHeaders,
			};
			requestNativeData[2] = true;
			if (executionContextId !== null) {
				runInterpreter(vm, executionContextId);
			}
			
			if (cb != null) {
				runInterpreterWithFunctionPointer(vm, cb, []);
			}
		}
	};
	
	xhr.ontimeout = function () {
		requestNativeData[0] = null;
		requestNativeData[2] = true;
		if (executionContextId !== null) {
			runInterpreter(vm, executionContextId);
		}
	};

	for (var i = 0; i < requestHeaders.length; i += 2) {
		var name = requestHeaders[i];
		switch (name.toLowerCase()) {
			case 'user-agent': break;
			default: xhr.setRequestHeader(name, requestHeaders[i + 1]); break;
		}
	}

	xhr.send(content);
};

LIB$http$readResponseData = function (response, intOut, stringOut, responseNativeData, headersOut) {
	intOut[0] = response['sc'];
	intOut[1] = response['ib'] ? 1 : 0;
	stringOut[0] = response['sm'];
	stringOut[1] = response['cs'];
	responseNativeData[0] = response['cb'];
	
	var headers = response['h'];
	for (var i = 0; i < headers.length; i += 2) {
		headersOut.push(headers[i]);
		headersOut.push(headers[i + 1]);
	}
};

LIB$http$getResponseBytes = function (bytes, integers, output) {
	var length = bytes.length;
	var i = 0;
	while (i < length) {
		output.push(integers[bytes[i++]]);
	}
};

LIB$http$sendRequestAsync = function(requestNativeData, method, url, headers, contentMode, content, outputIsBinary, vm, cb, mutexIgnore) {
	LIB$http$makeHttpRequest(requestNativeData, method, url, contentMode, content, headers, outputIsBinary, null, vm, cb);
};

LIB$http$sendRequestSync = function (
	requestNativeData,
	method,
	url,
	headers,
	contentMode, // 0 - null, 1 - text, 2 - binary
	content,
	outputIsBinary,
	executionContextId,
	vm) {
	LIB$http$makeHttpRequest(requestNativeData, method, url, contentMode, content, headers, outputIsBinary, executionContextId, vm, null);
	return true;
};

LIB$http$pollRequest = function (requestNativeData) {
	return requestNativeData[2];
};

