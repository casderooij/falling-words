import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Bodies, Body, Sleeping } from "matter-js";

export class TextBlock {
  constructor({
    x = 0,
    y = 0,
    widthOffset = 40,
    height = 100,
    scale = 1,
    content = "",
    fillColor = 0x000000,
    textColor = 0xffffff,
  }) {
    this.x = x;
    this.y = y;
    this.widthOffset = widthOffset;
    this.height = height;
    this.scale = scale;
    this.content = content;
    this.fillColor = fillColor;
    this.textColor = textColor;
    this.sprite;
    this.body;
  }

  initializeTextBlockSprite(renderer) {
    const container = new Container();
    const text = new Text(this.content, {
      fontFamily: 'happy-times',
      fontSize: 110,
      fill: this.textColor,
      align: 'center',
    });
    text.anchor.set(0.5);
    const textBounds = text.getBounds();

    const graphic = new Graphics();
    graphic.beginFill(this.fillColor);
    graphic.drawRect(
      textBounds.x - this.widthOffset,
      -this.height,
      textBounds.width + this.widthOffset * 2,
      this.height * 2
    );
    graphic.endFill();

    container.addChild(graphic);
    container.addChild(text);

    container.cacheAsBitmap = true;
    container.scale.set(0.5);
    const texture = renderer.generateTexture(container);
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.scale);

    this.body = Bodies.rectangle(
      this.x,
      this.y,
      textBounds.width / 2 + this.widthOffset,
      this.height,
      {
        restitution: 0.6,
      }
    );
    Body.scale(this.body, this.scale, this.scale);
  }

  updateSprite() {
    this.sprite.position.set(this.body.position.x, this.body.position.y);
    this.sprite.rotation = this.body.angle;
  }

  resetBody(x, y) {
    Sleeping.set(this.body, false);
    Body.setPosition(this.body, { x, y });
  }
}