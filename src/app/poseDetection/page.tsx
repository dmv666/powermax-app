"use client";

import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const PoseDetection: React.FC = () => {
  const [selectedLeftJoint, setSelectedLeftJoint] = useState<string>("default");
  const [selectedRightJoint, setSelectedRightJoint] = useState<string>("default");
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);

  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);

  useEffect(() => {
    const createPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 2,
        });
        setPoseLandmarker(landmarker);
      } catch (error) {
        console.error("Error al crear PoseLandmarker:", error);
      }
    };

    createPoseLandmarker();
  }, []);

  const enableCam = () => {
    if (!poseLandmarker) {
      console.log("¡Espera! El poseLandmarker no se ha cargado aún.");
      return;
    }

    const constraints = { video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error);
      });
    setWebcamRunning(true);
  };

  const predictWebcam = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    const canvas2 = canvas2Ref.current;
    const canvasCtx2 = canvas2?.getContext("2d");

    if (!canvas || !canvasCtx || !canvas2 || !canvasCtx2 || !poseLandmarker || !video) {
      console.log("Algunos elementos no están disponibles.");
      return;
    }

    const drawingUtils = new DrawingUtils(canvasCtx);

    const result = await poseLandmarker.detectForVideo(video, performance.now());

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx2.save();
    canvasCtx2.clearRect(0, 0, canvas2.width, canvas2.height);

    let yPosition = 50;

    for (const landmark of result.landmarks) {
      drawingUtils.drawLandmarks(landmark, { radius: 1, color: "white" });
      drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
        color: "red",
        lineWidth: 2,
      });

      [selectedLeftJoint, selectedRightJoint].forEach((joint) => {
        let angle = null;

        if (joint === "hombroIzquierdo" || joint === "hombroDerecho") {
          angle = getShoulderAngle(landmark, joint);
        } else if (joint === "codoIzquierdo" || joint === "codoDerecho") {
          angle = getElbowAngle(landmark, joint);
        }

        if (angle !== null) {
          canvasCtx2.fillText(`${joint}: ${angle.toFixed(2)}°`, 50, yPosition);
          yPosition += 30;
        }
      });
    }

    canvasCtx.restore();
    canvasCtx2.restore();

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const calculateAngle = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };

    const dotProduct = ab.x * bc.x + ab.y * bc.y;
    const magnitudeAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    const magnitudeBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);

    const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);
    const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1));

    return angleRad * (180 / Math.PI);
  };

  const getShoulderAngle = (landmarks: any[], joint: string) => {
    if (joint === "hombroIzquierdo") {
      return calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
    } else if (joint === "hombroDerecho") {
      return calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
    }
    return null;
  };

  const getElbowAngle = (landmarks: any[], joint: string) => {
    if (joint === "codoIzquierdo") {
      return calculateAngle(landmarks[13], landmarks[15], landmarks[17]);
    } else if (joint === "codoDerecho") {
      return calculateAngle(landmarks[14], landmarks[16], landmarks[18]);
    }
    return null;
  };

  return (
    <div>
      <h1>Pose Detection using MediaPipe</h1>
      <button onClick={enableCam} style={{ display: "block", margin: "20px auto", padding: "10px 20px", fontSize: "16px" }}>Enable Webcam</button>
      <video ref={videoRef} autoPlay playsInline width="480px" height="360px" />
      <canvas ref={canvasRef} id="output_canvas" width="480" height="360" />
      <canvas ref={canvas2Ref} id="output_canvas2" width="480" height="360" />
    </div>
  );
};

export default PoseDetection;
