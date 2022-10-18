const router = require("express").Router();
const faceapi = require('@vladmandic/face-api/dist/face-api.node.js'); // use this when using face-api in dev mode
const User = require("../model/User");
const canvas = require("canvas");
const {Canvas, Image} = canvas
const fs = require("fs");
const path = require('path');
//load the model and get it ready
let model_path = "./node_modules/@vladmandic/face-api/model/"
    faceapi
        .nets
        .tinyFaceDetector
        .loadFromDisk(model_path),
    faceapi
        .nets
        .faceLandmark68Net
        .loadFromDisk(model_path),
    faceapi
        .nets
        .ageGenderNet
        .loadFromDisk(model_path),
    faceapi
        .nets
        .ssdMobilenetv1
        .loadFromDisk(model_path),
    faceapi
        .nets
        .faceRecognitionNet
        .loadFromDisk(model_path),
    faceapi
        .nets
        .faceExpressionNet
        .loadFromDisk(model_path)

    router.post("/face", async(req, res) => {

        try {

            let {image_link, username, width, height} = req
                ?.body;

            let user = await User.findOne({username: username});
            if (!user) {
                res
                    .status(500)
                    .json("Wrong username or password");
                return;
            }
   
            image_link =  image_link.replace(/^data:image\/[a-z]+;base64,/, "");
            image_link = image_link.replace(/ /g, '+');
            let baseDir = path.join(__dirname + `/../static/`);

            try {
                fs
                    .writeFileSync(`${baseDir}${username + width + height}.jpg`, image_link, 'base64', function (err) {
                        if (err) {}

                    });

            } catch (error) {
                res
                    .status(500)
                    .send("image processing image");
                return;
            }
            faceapi
                .env
                .monkeyPatch({Canvas, Image})
            const img = await canvas.loadImage(`${baseDir}${username + width + height}.jpg`)

            const detections = await faceapi
                .detectAllFaces(img)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()
                .withAgeAndGender();

            let kek = detections[0]
                ?.gender;
            let old = detections[0]
                ?.age;
            const detectionsForSize = faceapi.resizeResults(detections, {
                width: img.width,
                height: img.height
            });

            let faceDescriptions = faceapi.resizeResults(detections, img)

            const out = faceapi.createCanvasFromMedia(img);
            faceapi
                .draw
                .drawDetections(out, detections)

            faceapi
                .draw
                .drawDetections(out, faceDescriptions) //to draw box around detection
            faceapi
                .draw
                .drawFaceLandmarks(out, faceDescriptions) //to draw face landmarks
            faceapi
                .draw
                .drawFaceExpressions(out, faceDescriptions) //to mention face expression
            //  console.log(out.toBuffer('image/jpeg'))
            const ctx = out.getContext('2d');
            ctx.font = '19px "Sans"';
            ctx.fillStyle = '#ff3647';
            ctx.fillText(`age:${Math.round(old)} gender:${kek}`, 250, 15);
            let canvas_data = out.toBuffer('image/jpeg');

             let buftostr = Buffer.from(canvas_data); 
             let base64 ='data:image/jpg;base64,' + buftostr.toString('base64'); //send the above two variables as response
            await res
                .status(200)
                .json({image_data: base64});
            fs.unlinkSync(`${baseDir}${username + width + height}.jpg`);
            return;
        } catch (err) {
            res
                .status(500)
                .json(err);
            return;
        }

    })

    module.exports = router;