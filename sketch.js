
let video;
let bodyPose;
let poses = [];
let connections;
let squatCount = 0;
let previousY = null;
let state = "Up";


function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  stroke(255, 0, 0); 
  line(0, height * 0.6, width, height * 0.6);
  
  if (poses.length > 0) {
    let pose = poses[0];
    let leftHipY = pose.keypoints[11].y; 
    let rightHipY = pose.keypoints[12].y; 

    let hipY = (leftHipY + rightHipY) / 2;

    let thresholdY = height * 0.6;

    if (hipY > thresholdY) {
      if (state === "Up") {
        state = "Down";
      }
    } else {
      if (state === "Down") {
        state = "Up";
        squatCount++;
      }
    }

    fill(255);
    textSize(32);
    text("Squats: " + squatCount, 10, 40);

  }
  
  
  
  
  // Draw the skeleton connections
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      // Only draw a line if both points are confident enough
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
