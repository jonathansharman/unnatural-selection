PST$createNewArray = function(s) {
	var o = [];
	while (s-- > 0) o.push(null);
	return o;
};

var lib_imageresources_blit = function(vm, args) {
	var object1 = null;
	var objInstance1 = args[0][1];
	var objInstance2 = args[1][1];
	LIB$imageresources$imageResourceBlitImage(objInstance1[3][0], objInstance2[3][0], args[2][1], args[3][1], args[4][1], args[5][1], args[6][1], args[7][1]);
	return vm[14];
};

var lib_imageresources_checkLoaderIsDone = function(vm, args) {
	var objInstance1 = args[0][1];
	var objInstance2 = args[1][1];
	var status = LIB$imageresources$checkLoaderIsDone(objInstance1[3], objInstance2[3]);
	return buildInteger(vm[13], status);
};

var lib_imageresources_flushImageChanges = function(vm, args) {
	return vm[14];
};

var lib_imageresources_getManifestString = function(vm, args) {
	return buildString(vm[13], LIB$imageresources$getImageResourceManifest());
};

var lib_imageresources_loadAsynchronous = function(vm, args) {
	var objInstance1 = args[0][1];
	var filename = args[1][1];
	var objInstance2 = args[2][1];
	var objArray1 = PST$createNewArray(3);
	objInstance1[3] = objArray1;
	var objArray2 = PST$createNewArray(4);
	objArray2[2] = 0;
	objInstance2[3] = objArray2;
	LIB$imageresources$imageLoad(filename, objArray1, objArray2);
	return vm[14];
};

var lib_imageresources_nativeImageDataInit = function(vm, args) {
	var objInstance1 = args[0][1];
	var nd = PST$createNewArray(4);
	var width = args[1][1];
	var height = args[2][1];
	nd[0] = LIB$imageresources$generateNativeBitmapOfSize(width, height);
	nd[1] = width;
	nd[2] = height;
	nd[3] = null;
	objInstance1[3] = nd;
	return vm[14];
};


C$common$scrapeLibFuncNames('imageresources');


LIB$imageresources$imageLoad = function(filename, nativeData, imageLoaderNativeData) {

	var image = new Image();
	var statusOut = imageLoaderNativeData;

	image.onerror = function () {
		imageLoaderNativeData[2] = 2;
	};

	image.onload = function () {
		var w = image.width;
		var h = image.height;
		if (w < 1 || h < 1) { // another possible error case
			imageLoaderNativeData[2] = 2;
		} else {
			var canvas = LIB$imageresources$generateNativeBitmapOfSize(w, h);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0);
			nativeData[0] = canvas;
			nativeData[1] = w;
			nativeData[2] = h;
			imageLoaderNativeData[2] = 1;
		}
	};

	image.src = C$common$jsFilePrefix + 'resources/images/' + filename;
};

LIB$imageresources$getImageResourceManifest = function() {
	var v = C$common$getTextRes('image_sheets.txt');
	return !v ? '' : v;
};

LIB$imageresources$generateNativeBitmapOfSize = function(width, height) {
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

LIB$imageresources$imageResourceBlitImage = function(target, source, targetX, targetY, sourceX, sourceY, width, height) {
	target.getContext('2d').drawImage(source, sourceX, sourceY, width, height, targetX, targetY, width, height);
};

LIB$imageresources$checkLoaderIsDone = function(imageLoaderNativeData, nativeImageDataNativeData, output) {
	return imageLoaderNativeData[2];
};

