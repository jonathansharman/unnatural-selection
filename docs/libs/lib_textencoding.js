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

var lib_textencoding_convertBytesToText = function(vm, args) {
	if ((args[0][0] != 6)) {
		return buildInteger(vm[13], 2);
	}
	var byteList = args[0][1];
	var format = args[1][1];
	var output = args[2][1];
	var strOut = PST$stringBuffer16;
	var length = byteList[1];
	var unwrappedBytes = PST$createNewArray(length);
	var i = 0;
	var value = null;
	var c = 0;
	while ((i < length)) {
		value = byteList[2][i];
		if ((value[0] != 3)) {
			return buildInteger(vm[13], 3);
		}
		c = value[1];
		if (((c < 0) || (c > 255))) {
			return buildInteger(vm[13], 3);
		}
		unwrappedBytes[i] = c;
		i += 1;
	}
	var sc = LIB$textencoding$bytesToText(unwrappedBytes, format, strOut);
	if ((sc == 0)) {
		addToList(output, buildString(vm[13], strOut[0]));
	}
	return buildInteger(vm[13], sc);
};

var lib_textencoding_convertTextToBytes = function(vm, args) {
	var value = args[0][1];
	var format = args[1][1];
	var includeBom = args[2][1];
	var output = args[3][1];
	var byteList = [];
	var intOut = PST$intBuffer16;
	var sc = LIB$textencoding$textToBytes(value, includeBom, format, byteList, vm[13][9], intOut);
	var swapWordSize = intOut[0];
	if ((swapWordSize != 0)) {
		var i = 0;
		var j = 0;
		var length = byteList.length;
		var swap = null;
		var half = (swapWordSize >> 1);
		var k = 0;
		while ((i < length)) {
			k = (i + swapWordSize - 1);
			j = 0;
			while ((j < half)) {
				swap = byteList[(i + j)];
				byteList[(i + j)] = byteList[(k - j)];
				byteList[(k - j)] = swap;
				j += 1;
			}
			i += swapWordSize;
		}
	}
	if ((sc == 0)) {
		addToList(output, buildList(byteList));
	}
	return buildInteger(vm[13], sc);
};


C$common$scrapeLibFuncNames('textencoding');


LIB$textencoding$bytesToText = function(bytes, format, strOut) {
	var i;
	var length = bytes.length;
	var sb = [];
	var a;
	var b;
	var c;
	var cp;
	var t;
	var isBigEndian = format == 5 || format == 7;
	switch (format) {
		case 1:
		case 2:
			var isAscii = format == 1;
			for (i = 0; i < length; ++i) {
				c = bytes[i];
				if (isAscii && c > 127) return 1;
				sb.push(String.fromCharCode(c));
			}
			break;
		case 3:
			i = 0;
			while (i < length) {
				c = bytes[i];
				if ((c & 0x80) == 0) {
					cp = c;
					i++;
				} else if ((c & 0xE0) == 0xC0) {
					if (i + 1 >= length) return 1;
					cp = c & 0x1FF;
					c = bytes[i + 1];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					i += 2;
				} else if ((c & 0xF0) == 0xE0) {
					if (i + 2 >= length) return 1;
					cp = c & 0x0F;
					c = bytes[i + 1];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					c = bytes[i + 2];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					i += 3;
				} else if ((c & 0xF8) == 0xF0) {
					if (i + 3 >= length) return 1;
					cp = c & 0x07;
					c = bytes[i + 1];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					c = bytes[i + 2];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					c = bytes[i + 3];
					if ((c & 0xC0) != 0x80) return 1;
					cp = (cp << 6) | (c & 0x3F);
					i += 4;
				}
				sb.push(String.fromCodePoint(cp));
			}
			break;
		
		case 4:
		case 5:
			for (i = 0; i < length; i += 2) {
				if (isBigEndian) {
					a = bytes[i];
					b = bytes[i + 1];
				} else {
					a = bytes[i + 1];
					b = bytes[i];
				}
				c = (a << 8) | b;
				if (c < 0xD800 || c > 0xDFFF) {
					cp = c;
				} else if (c < 0xD800 && c >= 0xDC00) {
					return 1;
				} else if (i + 3 >= length) {
					return 1;
				} else {
					if (isBigEndian) {
						a = bytes[i + 2];
						b = bytes[i + 3];
					} else {
						a = bytes[i + 3];
						b = bytes[i + 2];
					}
					b = (a << 8) | b;
					a = c;
					// a and b are now 16 bit words
					if (b < 0xDC00 || b > 0xDFFF) return 1;
					cp = (((a & 0x03FF) << 10) | (b & 0x03FF)) + 0x10000;
					i += 2;
				}
				sb.push(String.fromCodePoint(cp));
			}
			break;
		
		case 6:
		case 7:
			for (i = 0; i < length; i += 4) {
				if (isBigEndian) {
					cp = bytes[i + 3] | (bytes[i + 2] << 8) | (bytes[i + 1] << 16) | (bytes[i] << 24);
				} else {
					cp = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
				}
				sb.push(String.fromCodePoint(cp));
			}
			break;
	}
	
	strOut[0] = sb.join('');
	return 0;
};

LIB$textencoding$stringToCodePointList = function(s) {
	var codePoints = Array.from(s);
	var length = codePoints.length;
	var n;
	for (var i = 0; i < length; ++i) {
		n = codePoints[i].codePointAt(0);
		codePoints[i] = n;
	}
	return codePoints;
};

LIB$textencoding$textToBytes = function(value, includeBom, format, byteList, positiveIntegers, intOut) {
	intOut[0] = 0;
	var codePoints = LIB$textencoding$stringToCodePointList(value);
	var length = codePoints.length;
	var maxValue = 0;
	var n = 0;
	var i;
	for (i = 0; i < length; ++i) {
		if (codePoints[i] > maxValue) {
			maxValue = codePoints[i];
		}
	}
	if (maxValue > 127 && format == 1) return 1;

	// TODO: this is slightly wrong. Unicode characters should be converted into extended ASCII chars, if possible.
	if (maxValue > 255 && format == 2) return 1;

	var bytes;
	if (format <= 2) {
		bytes = codePoints;
	} else {
		bytes = [];
		if (includeBom) {
			switch (format) {
				case 3: bytes = [239, 187, 191]; break;
				case 4: bytes = [255, 254]; break;
				case 5: bytes = [254, 255]; break;
				case 6: bytes = [255, 254, 0, 0]; break;
				case 7: bytes = [0, 0, 254, 255]; break;
			}
		}
		length = codePoints.length;
		switch (format) {
			case 3:
				LIB$textencoding$codePointsToUtf8(codePoints, bytes);
				break;
			case 4:
			case 5:
				LIB$textencoding$codePointsToUtf16(codePoints, bytes, format == 5);
				break;
			case 6:
			case 7:
				LIB$textencoding$codePointsToUtf32(codePoints, bytes, format == 7);
				break;
		}
	}
	
	for (i = 0; i < bytes.length; ++i) {
		byteList.push(positiveIntegers[bytes[i]]);
	}
	
	return 0;
};

LIB$textencoding$codePointsToUtf8 = function(points, buffer) {
	var length = points.length;
	var p;
	for (var pIndex = 0; pIndex < length; ++pIndex) {
		p = points[pIndex];
		if (p < 0x80) {
			buffer.push(p);
		} else if (p < 0x0800) {
			buffer.push(0xC0 | ((p >> 6) & 0x1F));
			buffer.push(0x80 | (p & 0x3F));
		} else if (p < 0x10000) {
			buffer.push(0xE0 | ((p >> 12) & 0x0F));
			buffer.push(0x80 | ((p >> 6) & 0x3F));
			buffer.push(0x80 | (p & 0x3F));
		} else {
			buffer.push(0xF0 | ((p >> 18) & 3));
			buffer.push(0x80 | ((p >> 12) & 0x3F));
			buffer.push(0x80 | ((p >> 6) & 0x3F));
			buffer.push(0x80 | (p & 0x3F));
		}
	}
};


LIB$textencoding$codePointsToUtf16 = function(points, buffer, isBigEndian) {
	var length = points.length;
	var p;
	var a;
	var b;
	
	for (var pIndex = 0; pIndex < length; ++pIndex) {
		p = points[pIndex];
		if (p < 0x10000) {
			if (isBigEndian) {
				buffer.push((p >> 8) & 255);
				buffer.push(p & 255);
			} else {
				buffer.push(p & 255);
				buffer.push((p >> 8) & 255);
			}
		} else {
			p -= 0x10000;
			a = 0xD800 | ((p >> 10) & 0x03FF);
			b = 0xDC00 | (p & 0x03FF);
			if (isBigEndian) {
				buffer.push((a >> 8) & 255);
				buffer.push(a & 255);
				buffer.push((b >> 8) & 255);
				buffer.push(b & 255);
			} else {
				buffer.push(a & 255);
				buffer.push((a >> 8) & 255);
				buffer.push(b & 255);
				buffer.push((b >> 8) & 255);
			}
		}
	}
};

LIB$textencoding$codePointsToUtf32 = function(points, buffer, isBigEndian) {
	var i = 0;
	var length = points.length;
	var p;
	while (i < length) {
		p = points[i++];
		if (isBigEndian) {
			buffer.push((p >> 24) & 255);
			buffer.push((p >> 16) & 255);
			buffer.push((p >> 8) & 255);
			buffer.push(p & 255);
		} else {
			buffer.push(p & 255);
			buffer.push((p >> 8) & 255);
			buffer.push((p >> 16) & 255);
			buffer.push((p >> 24) & 255);
		}
	}
};

