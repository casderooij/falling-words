import { Renderer, Container, Ticker } from "pixi.js";
import { Engine, Events, MouseConstraint, Mouse, World } from "matter-js";
import FontFaceObserver from "fontfaceobserver";

import { Circle } from "./shapes/circle";
import { TextBlock } from "./shapes/textblock";
import { Borders } from "./shapes/borders";
import { randomRange, createTextBlockData } from "./utils";





const canvas = document.querySelector("#physicscanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = canvas.clientWidth;
let height = canvas.clientHeight;

const words = canvas.dataset.words.replace(/\s+/g, "").split(",");

let scale = 1;
let resolution = 1;
let ballInfo = {
  num: 45,
  minSize: 3,
  maxSize: 8
};

if (width < 768) {
  resolution = window.devicePixelRatio;
  scale = 0.7;
  ballInfo.num = 25;
  ballInfo.minSize = 3;
  ballInfo.maxSize = 8;
}

// Setup Matter
const engine = Engine.create({
  enableSleeping: true,
});
const world = engine.world;
world.gravity.y = -1;
world.gravity.x = -0.3;

const borders = new Borders(world);
borders.setBorders(width, height);

// Setup PIXI
const renderer = new Renderer({
  view: canvas,
  width: canvas.clientWidth,
  height: canvas.clientHeight,
  transparent: true,
  resolution,
});

const stage = new Container();

const circles = [];
const textblocks = [];

// Mouse interaction
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse });
mouse.pixelRatio = resolution;
mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
World.add(world, mouseConstraint);

// let canvasActive = true;

// Events.on(mouseConstraint, "mousedown", (event) => {
//   if (!mouseConstraint.body) {
//     canvasActive = false;
//     console.log(event.name, mouseConstraint.body, canvasActive);
//     // window.addEventListener('touchstart', () => {
//     //   console.log('touchstart');
//     //   canvas.style.pointerEvents = 'none';
//     //   canvas.style.touchAction = 'none';
//     // });
//     canvas.style.pointerEvents = 'none';
//     canvas.style.touchAction = 'none';
//     if (!canvasActive) {
//       document.elementFromPoint(event.mouse.position.x, event.mouse.position.y).click();
//       document.elementFromPoint(event.mouse.position.x, event.mouse.position.y).scroll();
//     }
    
//   } else {
//     console.log(event.name, mouseConstraint.body.label, canvasActive);
//   }
// });

// window.addEventListener('mouseup', () => {
//   canvasActive = true;
//   console.log('mouseup');
//   canvas.style.pointerEvents = 'auto';
// });

// window.addEventListener('touchend', () => {
//   canvasActive = true;
//   console.log('touchend');
//   canvas.style.pointerEvents = 'auto';
//   canvas.style.touchAction = 'auto';
// });

// Events.on(mouseConstraint, 'mousemove', (event) => {
//   console.log(event);
//   if (!mouseConstraint.body) {
//     canvas.style.pointerEvents = 'none';
//     canvas.style.touchAction = 'none';
//     document.elementFromPoint(event.mouse.position.x, event.mouse.position.y).click();
//     canvas.style.pointerEvents = 'auto';
//     canvas.style.touchAction = 'auto';
//   }
// });

// Events.on(mouseConstraint, 'mouseup', (event) => {
//   console.log(event);
//   if (!mouseConstraint.body) {
//     canvas.style.pointerEvents = 'auto';
//     canvas.style.touchAction = 'auto';
//   }
// });

// Window resizing
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;

    if (canvas.clientWidth != width) {
      borders.removeBorders();
      borders.setBorders(newWidth, newHeight);

      circles.map((circle) => {
        circle.resetBody(Math.random() * newWidth, newHeight);
      });
      textblocks.map((block) => {
        block.resetBody(Math.random() * newWidth, newHeight);
      });
    }
    width = newWidth;
    height = newHeight;
    renderer.resize(width, height);
  }, 250);
});

// Startup script
const start = () => {
  // Add circles
  for (let i = 0; i < ballInfo.num; i++) {
    const circle = new Circle({
      x: (randomRange(2, 7) / 10) * canvas.clientWidth,
      y: height + 500 * Math.random(),
      scale: scale * randomRange(ballInfo.minSize, ballInfo.maxSize) * 0.08,
      // scale: 0.15,
      fillColor: [37, 100, randomRange(70, 90)],
    });
    circle.initializeCircleSprite(renderer);
    World.add(world, circle.body);
    stage.addChild(circle.sprite);

    circles.push(circle);

    circle.sprite.on('pointerover', () => {
      console.log('over');
    });

    circle.sprite.on('pointerout', () => {
      console.log('out');
    });
  }

  // Add textblocks
  const blockdata = createTextBlockData(words);
  for (let i = 0; i < blockdata.length; i++) {
    const textblock = new TextBlock({
      x: blockdata[i].x * width,
      y: height + 500 * Math.random(),
      height: blockdata[i].height,
      scale: scale * blockdata[i].scale,
      content: blockdata[i].content,
    });

    textblock.initializeTextBlockSprite(renderer);
    World.add(world, textblock.body);
    stage.addChild(textblock.sprite);

    textblocks.push(textblock);
  }

  const animate = () => {
    Engine.update(engine);
    circles.map((c) => {
      c.updateSprite();
    });

    textblocks.map((t) => {
      t.updateSprite();
    });
    renderer.render(stage);
  };

  const ticker = new Ticker();
  ticker.add(animate);
  ticker.start();
};

const font = new FontFaceObserver('happy-times');
font.load().then(() => {
  setTimeout(() => {
    start();
  }, 100);
});