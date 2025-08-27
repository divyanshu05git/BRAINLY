"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    let opt = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += opt[Math.floor(Math.random() * opt.length)];
    }
    return ans;
}
