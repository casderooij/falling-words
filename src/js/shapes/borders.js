import { Bodies, Composite, World } from 'matter-js';

export class Borders {
  constructor (world) {
    this.world = world;
    this.topBorder;
    this.bottomBorder;
    this.leftBorder;
    this.rightBorder;
  }

  setBorders(width, height) {
    this.topBorder = Bodies.rectangle(width / 2, -250, width, 500, {
      isStatic: true,
      restitution: 0.6,
    });
    this.bottomBorder = Bodies.rectangle(width / 2, height * 4, width, 500, {
      isStatic: true,
    });
    this.leftBorder = Bodies.rectangle(-250, height * 2, 500, height * 4, {
      isStatic: true,
    });
    this.rightBorder = Bodies.rectangle(
      width + 250,
      height * 2,
      500,
      height * 4,
      {
        isStatic: true,
      }
    );
    World.add(this.world, [
      this.topBorder,
      this.bottomBorder,
      this.leftBorder,
      this.rightBorder,
    ]);
  };

  removeBorders() {
    Composite.remove(this.world, this.topBorder);
    Composite.remove(this.world, this.bottomBorder);
    Composite.remove(this.world, this.leftBorder);
    Composite.remove(this.world, this.rightBorder);
  }
}