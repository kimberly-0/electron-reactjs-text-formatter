# Text formatter

This desktop app is built with **Electron** and **React** and was created to solve a real-world problem. It can format large texts within seconds, which was previously achieved by manually typing every word. The app has enabled processes to be more efficient and less time-consuming.

The user can paste unformatted text into a text field. The program will recognise lines separated by a line break delimiter and columns split up by either multiple spaces or tabs. It will format the text based on the options the user selects. The result is displayed in a text field, so the user can modify it if necessary. A ‘copy to clipboard’ button was added to simplify the process of selecting and copying the formatted text for further processing.

*The methods responsible for the main functionality of the program (formatting the text) can be found in [`format.js`](https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/format.js).*


## Preview

Demo of app [^1]:

![app preview](https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/preview/preview.gif)

### Steps

<img src="https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/preview/preview-step-1.png" width="400"> <img src="https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/preview/preview-step-2.png" width="400"> <img src="https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/preview/preview-step-3.png" width="400"> <img src="https://github.com/kidijkmans/electron-reactjs-text-formatter/blob/master/preview/preview-step-4.png" width="400">

## Get started

1. Install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if not already installed
2. Clone the repository
```
git clone https://github.com/kidijkmans/electron-reactjs-text-formatter.git
cd electron-reactjs-text-formatter
```
3. Install dependencies with `npm install`
4. Run watch script with `npm run watch`
5. In a new terminal, locate project folder and run app with `npm run start-dev`
6. Stop running app with `ctrl+c`

[^1]: Actual names have been replaced by dummy text.
