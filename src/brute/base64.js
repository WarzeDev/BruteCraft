const digitsStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
const digits = digitsStr.split('');
const digitsMap = Object.fromEntries(digits.map((char, i) => [char, i]));

export function fromIntV(int32) {
    let result = '';
    while (true) {
        result = digits[int32 & 0x3f] + result;
        int32 >>>= 6;
        if (int32 === 0) break;
    }
    return result;
}

export function fromIntN(int32, n) {
    let result = '';
    for (let i = 0; i < n; ++i) {
        result = digits[int32 & 0x3f] + result;
        int32 >>= 6;
    }
    return result;
}

export function toInt(digitsStr) {
    return digitsStr.split('').reduce((result, char) => (result << 6) + digitsMap[char], 0);
}

export function toIntSigned(digitsStr) {
    let result = 0;
    if (digitsStr[0] && (digitsMap[digitsStr[0]] & 0x20)) {
        result = -1;
    }
    for (const char of digitsStr) {
        result = (result << 6) + digitsMap[char];
    }
    return result;
}
