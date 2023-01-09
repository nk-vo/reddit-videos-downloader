const axios = require('axios');
const fs = require('fs');

async function downloadVideo(url) {
  try {
    // Use axios to fetch the M3U8 playlist file
    const response = await axios.get(url);
    console.log(response);
    
  } catch (error) {
    console.error(error);
  }
}

downloadVideo('https://v.redd.it/2pfesmq2ytaa1/HLS_AUDIO_160_K.m3u8?a=1675817381%2CZjQyNmFhNzZmY2NhOWE4NzgxMDM1OTk4YWVmZDgzYmMyMTVmMWNjZGU0ZTQ0ODBhODc0OWI0ODBmNzIzYWUzNA%3D%3D&amp;v=1&amp;f=sd');
