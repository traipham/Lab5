// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var img_width = 400;
var img_height = 400;
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  var dim = getDimmensions(400, 400, img_width, img_height);

  //DRAWS THE IMAGE ON BLACK CANVAS
  ctx.clearRect(0, 0, 400, 400);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 400, 400);
  ctx.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;
  document.getElementById('voice-selection').disabled = false;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//input: image-input
const image_file = document.getElementById('image-input');
image_file.onchange = () => {
  const file = image_file.files[0];
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    img_height = img.height;
    img_width = img.width;
    URL.revokeObjectURL(img.src);
  }
}

//FORM: submit
const clicky = document.getElementById('generate-meme');
clicky.addEventListener('submit', logSubmit);
const submitButt = document.querySelector("[type='submit']")

function logSubmit(event) {
  event.preventDefault();
  let toptop = document.getElementById('text-top').value;
  let botbot = document.getElementById('text-bottom').value;
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');

  ctx.font = "60px Arial"
  ctx.fillStyle = "green"
  ctx.textAlign = "center"
  ctx.fillText(toptop, 200, 50);
  ctx.fillText(botbot, 200, 390);

  submitButt.disabled = true;
  clearButt.disabled = false;
  readButt.disabled = false;
}

//BUTTON: clear
const clearButt = document.querySelector("[type='reset']");
clearButt.onclick = function () {
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 400, 400);
  img.src = '';
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
  document.getElementById('voice-selection').disabled = true;
}

//Voice selector
window.addEventListener('load', (event) => {
  let voice_select = document.getElementById('voice-selection');
  var synth = window.speechSynthesis;
  let voices = synth.getVoices()
  for (let i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name;
    voice_select.add(option);
  }
})

//BUTTON: Read Text
const readButt = document.querySelector("[type='button']");

readButt.onclick = function () {
  let toptop = document.getElementById('text-top').value;
  let botbot = document.getElementById('text-bottom').value;
  let speak_text = new SpeechSynthesisUtterance();
  speak_text.volume = volume.value / 100;
  speak_text.text = toptop + " " + botbot;

  let alertThis = "some string";
  let voices = synth.getVoices()
  for (let i = 0; i < voices.length; i++) {
    if (document.getElementById('voice-selection').value === voices[i].name) {
      speak_text.voice = voices[i];
      alertThis = voices[i].name;
    }
  }

  window.speechSynthesis.speak(speak_text);
};

var synth = window.speechSynthesis;
window.onload = function () {
  let voice_select = document.getElementById('voice-selection');
  let voices = synth.getVoices()
  for (let i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name;
    voice_select.add(option);
  }
}

//volume group
const controller = document.getElementById('volume-group');
var volume = document.querySelector("[type='range']");
controller.addEventListener('input', volumeKnob);

function volumeKnob(event) {
  if (volume.value > 66 && volume.value < 101) {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-3.svg";
  }
  else if (volume.value > 33 && volume.value < 67) {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-2.svg";
  }
  else if (volume.value > 0 && volume.value < 34) {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-1.svg";
  }
  else if (volume.value == 0) {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-0.svg";
  }
}

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}