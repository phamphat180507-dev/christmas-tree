// ===== LẤY VIDEO & CANVAS =====
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480;

// ===== KHỞI ĐỘNG CAMERA =====
const camera = new Camera(video, {
  onFrame: async () => {},
  width: 640,
  height: 480
});
camera.start();

// ===== HAND DETECTION (MỞ / NẮM) =====
let handOpen = false;

const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1640029074/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults((results) => {
  handOpen = false;

  if (results.multiHandLandmarks) {
    const lm = results.multiHandLandmarks[0];
    let fingers = 0;

    if (lm[8].y < lm[6].y) fingers++;
    if (lm[12].y < lm[10].y) fingers++;
    if (lm[16].y < lm[14].y) fingers++;
    if (lm[20].y < lm[18].y) fingers++;

    handOpen = fingers >= 3;
  }
});

// ===== VÒNG LẶP RENDER =====
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gửi frame camera cho MediaPipe
  hands.send({ image: video });

  // debug trạng thái tay
  ctx.fillStyle = handOpen ? "lime" : "red";
  ctx.font = "20px Arial";
  ctx.fillText(handOpen ? "✋ MỞ TAY" : "✊ NẮM TAY", 20, 40);

  requestAnimationFrame(render);
}

render();
