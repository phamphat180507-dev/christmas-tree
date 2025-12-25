window.onload = () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 640;
  canvas.height = 480;

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
      ctx.fillStyle = "lime";
      ctx.font = "20px Arial";
      ctx.fillText("✅ Đã nhận bàn tay", 20, 40);
    } else {
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText("❌ Chưa nhận bàn tay", 20, 40);
    }
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480
  });

  camera.start();
};
