/**
 * Web Audio Test
 * Kísérletezés a WebAudio API-val
 */
window.WAT = window.WAT || {};

//createjs fps beállítás
createjs.timingMode = createjs.RAF_SYNCHED;
createjs.Ticker.setFPS(60);

//prototype js és jquery miatt
jQuery.noConflict();