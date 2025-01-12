import { useEffect } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

window.PIXI = PIXI;

Live2DModel.registerTicker(PIXI.Ticker);
PIXI.Renderer.registerPlugin("interaction", PIXI.InteractionManager);

function App() {
  useEffect(() => {
    (async function () {
      const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        autoStart: true,
        resizeTo: window,
      });

      const model = await Live2DModel.from('https://cdn.jsdelivr.net/gh/phandeptrai1/tunguyen/HoshinoAi/hoshino_ai.model3.json', {
        idleMotionGroup: "Idle", // Chọn nhóm chuyển động, nếu có
      });
      app.stage.addChild(model);

      // transforms
      model.x = 100;
      model.y = 100;
      model.position.set(window.innerWidth / 2, window.innerHeight / 2);
      model.anchor.set(0.5, 0.5);
      model.scale.set(0.1, 0.1);

      // interaction
      model.on("hit", () => {
        model.motion("Tap@Body"); // Chạy chuyển động khi click
      });

      const handleTap = (event) => {
        if (!model) return;
        // Get the pointer position relative to the canvas
        const rect = app.view.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        // Send the tap event to the model
        model.motion("Tap", {
          x: pointerX,
          y: pointerY,
        });
        const bounds = model.getBounds();
        if (bounds.contains(pointerX, pointerY)) {
          model.motion("Tap", pointerX);
        }
        console.log(`Tap sent to model at: x=${pointerX}, y=${pointerY}`);
      };

      // Add event listener to the canvas
      app.view.addEventListener("pointerdown", handleTap);
    })();
  }, []); // Chạy chỉ một lần khi component được mount

  return (
    <div>
      <canvas id="canvas" />
    </div>
  );
}

export default App;
