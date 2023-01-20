const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadVideos(subreddit) {
  try {
    // Create a new folder for the subreddit
    const subredditFolder = path.join(__dirname, subreddit);
    if (!fs.existsSync(subredditFolder)) {
      fs.mkdirSync(subredditFolder);
    }

    let after = null;
    let stop = false;

    // Use a scroll-based loading technique to handle lazy loading and fetch all data
    while (!stop) {
      // Make a GET request to the subreddit URL
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/.json`,
        {
          params: {
            after,
          },
        }
      );
      // Extract the title and video URL from the post
      const posts = response.data.data.children;

      posts.forEach(async (post) => {
        if (post.data.secure_media === null) {
          return;
        }
        const title = post.data.title;
        const videoURL = post.data.secure_media.reddit_video.fallback_url.replace('?source=fallback', '');

        console.log(`Title: ${title}`);
        console.log(`Video URL: ${videoURL}`);

        // Check if the title is a suitable file name on Windows
        const regex = /[/\\:*?"<>|]/;        
        const filename = title.replace(regex, "-");
        
        let count = 0;
        if (filename === '') {
          filename = count++;
        }
        // Download the video using the video URL
        const videoResponse = await axios({
          method: "GET",
          url: videoURL,
          responseType: "stream",
        });

        // Save the video to a file in the subreddit folder
        const videoFilepath = path.join(subredditFolder, `${filename}.mp4`);
        videoResponse.data.pipe(fs.createWriteStream(videoFilepath));

      });

      // Update the "after" parameter for the next request
      after = response.data.data.after;
      // Stop when there are no more posts to load
      stop = response.data.data.after == null;
    }
  } catch (error) {
    console.error(error);
  }
}

downloadVideos("");
