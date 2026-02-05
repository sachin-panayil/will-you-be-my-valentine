# Valentine's Day Proposal

A Valentine's Day proposal thats free to host and cute to send to your special someone!

## Example 
![example](https://github.com/user-attachments/assets/f812ac4a-2ca8-41ea-a537-c35eef113040)

## How to Make It Your Own

1. Download or fork this repository
2. Customize the values in `docs/main.js`

```javascript
const CONFIG = {
    name: "",
    greeting: "Hey", 
    question: "Will you be my Valentine?",
    yesButtonText: "Yes! 💖",
    noButtonText: "No",
    celebrationTitle: "Yay! 🎉💕",
    celebrationMessage: "I knew you'd say yes! Can't wait to spend Valentine's Day with you! 💕",
    celebrationGif: "https://...",
    confettiSound: "https://...",
    escapeSound: "https://..."
};
```

3. Find a GIF on [Giphy](https://giphy.com) and copy the GIF link
4. I supplied some good sounds but you can import your own by downloading a mp3 and placing the, in `/sounds`
5. You could host it anywhere but hosting on Github Pages is the simplest

### Hosting on GitHub Pages

1. Fork this repository
2. Edit `main.js` in your fork and update the `CONFIG` values
3. Go to Settings → Pages → select `main` branch → select `/docs` folder -> Save
4. Share the link!

## Local Preview
1. Download the repo
2. Open `index.html` in your browser
