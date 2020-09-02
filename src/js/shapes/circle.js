import { Container, Graphics, Sprite } from "pixi.js";
import { Bodies, Body, Sleeping } from "matter-js";

export class Circle {
  constructor({ x = 0, y = 0, r = 50, scale = 1 }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.scale = scale;
    this.fillColor = 0x000000;
    this.sprite;
    this.body;
  }

  initializeCircleSprite(renderer) {
    const container = new Container();

    const graphic = new Graphics();
    graphic.beginFill(this.fillColor);
    graphic.drawCircle(0, 0, this.r * 2);
    graphic.endFill();
    
    container.addChild(graphic);
    container.cacheAsBitmap = true;
    container.scale.set(0.5);
    const texture = renderer.generateTexture(container);
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.scale);

    this.body = Bodies.circle(this.x, this.y, this.r, {
      restitution: 0.6,
    });
    Body.scale(this.body, this.scale, this.scale);
  }

  updateSprite() {
    this.sprite.position.set(this.body.position.x, this.body.position.y);
  }

  resetBody(x, y) {
    Sleeping.set(this.body, false);
    Body.setPosition(this.body, { x, y });
  }
}