import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js";


export const sendToken = async (user, statusCode, res, message ="") => {
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );
  
    // options for cookie
    const options = {
      maxAge:  1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    const options2 = {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
  
    res.status(statusCode).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options2).json({
      success: true,
      user,
      refreshToken,
      accessToken,
      message
    });
  };
  
  









  const data = () =>{
    const express = require('express');
const axios = require('axios');
const Bull = require('bull');

const app = express();

// Create a queue for handling requests
const requestQueue = new Bull('requestQueue');

// Sample handler server addresses
const handlerServers = [
  'http://handler1.example.com',
  'http://handler2.example.com',
  'http://handler3.example.com',
];

// Function to send request to the handler server
async function forwardRequestToHandler(requestData, handlerUrl) {
  try {
    const response = await axios.post(handlerUrl, requestData);
    return response.data;
  } catch (error) {
    console.error('Error forwarding request:', error);
    throw error;
  }
}

// Job processor to handle requests in the queue
requestQueue.process(async (job) => {
  const { requestData, handlerIndex } = job.data;
  const handlerUrl = handlerServers[handlerIndex];
  console.log(`Forwarding request to ${handlerUrl}`);
  const response = await forwardRequestToHandler(requestData, handlerUrl);
  return response;
});

// API endpoint to add requests to the queue
app.post('/send-request', express.json(), async (req, res) => {
  const { requestData, handlerIndex = 0 } = req.body;

  // Add job to the queue with request data and the handler index
  try {
    const job = await requestQueue.add({ requestData, handlerIndex });
    res.status(202).send({ message: 'Request queued', jobId: job.id });
  } catch (error) {
    res.status(500).send({ message: 'Error queuing the request' });
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

}