import "../css/style.css";
import "./physics";

import * as Matter from 'matter-js';

(function () {
  Matter.use('matter-dom-plugin');

  const Engine = Matter.Engine;
  const Runner = Matter.Runner;
  const RenderDom = Matter.RenderDom;
  const DomBodies = Matter.DomBodies;
  const MouseConstraint = Matter.MouseConstraint;
  const DomMouseConstraint = Matter.DomMouseConstraint;
  const Mouse = Matter.Mouse;
  const World = Matter.World;

  // Set up engine and renderer
  const engine = Engine.create();
  const world = engine.world;
  const runner = Runner.create();
  Runner.run(runner, engine);

  const render = RenderDom.create({ engine });
  RenderDom.run(render);

  // Initialize physics bodies
  const block = DomBodies.block(100, 100, {
    Dom: {
      render,
      element: document.querySelector('#block')
    }
  });
  World.add(world, block);

  // Mouse control
  const mouse = Mouse.create(document.body);
  const mouseConstraint = DomMouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: .1,
      render: {
        visible: false
      }
    }
  });

  World.add(world, MouseConstraint);
})();