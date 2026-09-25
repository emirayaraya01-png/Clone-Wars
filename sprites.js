// Dragon Flap art. Built by the Art builder, following CONTRACT.md section 2.
// The look: a sunset farm field in the Guanajuato countryside. You fly a dragon fruit.
// The obstacles are stacked wooden produce crates. Canvas shapes only.
window.SPRITES = {

  // The whole canvas: sunset sky, distant hills, crop rows. Complete at time = 0.
  drawBackground: function (ctx, width, height, time) {
    ctx.save();

    // Sunset sky.
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#2c2a54');
    sky.addColorStop(0.35, '#8f4a76');
    sky.addColorStop(0.65, '#e2703a');
    sky.addColorStop(1, '#f5b04c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // The low evening sun.
    const sunX = width * 0.72;
    const sunY = height * 0.42;
    const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 90);
    glow.addColorStop(0, 'rgba(255, 236, 170, 0.9)');
    glow.addColorStop(1, 'rgba(255, 236, 170, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sunX - 90, sunY - 90, 180, 180);
    ctx.fillStyle = '#ffdf8a';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Slow drifting clouds. They sit still and look fine at time = 0.
    ctx.fillStyle = 'rgba(255, 214, 190, 0.55)';
    const drift = (time * 6) % (width + 160) - 80;
    const cloud = function (cx, cy, s) {
      ctx.beginPath();
      ctx.arc(cx, cy, 16 * s, 0, Math.PI * 2);
      ctx.arc(cx + 20 * s, cy + 4 * s, 12 * s, 0, Math.PI * 2);
      ctx.arc(cx - 20 * s, cy + 5 * s, 11 * s, 0, Math.PI * 2);
      ctx.fill();
    };
    cloud(drift, height * 0.14, 1.1);
    cloud(width - drift * 0.6, height * 0.24, 0.8);

    // Distant hills.
    ctx.fillStyle = '#5b3a63';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.62);
    ctx.quadraticCurveTo(width * 0.25, height * 0.52, width * 0.5, height * 0.6);
    ctx.quadraticCurveTo(width * 0.78, height * 0.68, width, height * 0.58);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Farm field: crop rows fanning toward the bottom.
    ctx.fillStyle = '#7c5537';
    ctx.fillRect(0, height * 0.72, width, height * 0.28);
    ctx.strokeStyle = '#5e3f28';
    ctx.lineWidth = 3;
    for (let i = 0; i < 9; i += 1) {
      const rowX = (i / 8) * width;
      ctx.beginPath();
      ctx.moveTo(width / 2 + (rowX - width / 2) * 0.35, height * 0.72);
      ctx.lineTo(rowX, height);
      ctx.stroke();
    }
    // A few leafy crop clumps along the rows.
    ctx.fillStyle = '#4d7a3a';
    for (let i = 0; i < 7; i += 1) {
      const cx = ((i * 53) % width);
      const cy = height * 0.78 + (i % 3) * height * 0.055;
      ctx.beginPath();
      ctx.arc(cx, cy, 7 + (i % 2) * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  // The ground strip: tilled soil with furrows that slide left as the game scrolls.
  drawGround: function (ctx, width, height, groundHeight, offset) {
    ctx.save();
    const top = height - groundHeight;

    ctx.fillStyle = '#6b4526';
    ctx.fillRect(0, top, width, groundHeight);

    // Furrow stripes, scrolled by offset.
    ctx.fillStyle = '#57371e';
    const step = 34;
    const shift = ((offset % step) + step) % step;
    for (let x = -step; x < width + step; x += step) {
      ctx.fillRect(x - shift, top + 12, 16, groundHeight - 12);
    }

    // A sunlit top edge, with a dark line so the ground reads clearly.
    ctx.fillStyle = '#a9713d';
    ctx.fillRect(0, top, width, 7);
    ctx.fillStyle = '#2e1c0e';
    ctx.fillRect(0, top, width, 3);

    ctx.restore();
  },

  // The character: a bright dragon fruit with green leaf-tips, tilting as it flies.
  drawBird: function (ctx, x, y, size, velocity) {
    ctx.save();
    ctx.translate(x, y);
    // Tilt up when rising, down when falling.
    const tilt = Math.max(-0.45, Math.min(0.6, velocity / 700));
    ctx.rotate(tilt);

    const r = size / 2;

    // Green leaf-tips sticking out around the body.
    ctx.fillStyle = '#3e8a4f';
    ctx.strokeStyle = '#173a20';
    ctx.lineWidth = 2;
    const tips = 7;
    for (let i = 0; i < tips; i += 1) {
      const angle = (i / tips) * Math.PI * 2 + 0.4;
      const tx = Math.cos(angle) * r * 1.0;
      const ty = Math.sin(angle) * r * 1.0;
      ctx.beginPath();
      ctx.moveTo(tx * 0.55, ty * 0.55);
      ctx.lineTo(tx + Math.cos(angle + 0.5) * 3, ty + Math.sin(angle + 0.5) * 3);
      ctx.lineTo(tx * 0.7 + Math.cos(angle + 1.2) * 4, ty * 0.7 + Math.sin(angle + 1.2) * 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // The pink body, with a dark outline so it stands out from the sunset.
    ctx.fillStyle = '#e83e8c';
    ctx.strokeStyle = '#4a1030';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.92, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // A lighter belly.
    ctx.fillStyle = '#f97fb5';
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, r * 0.12, r * 0.55, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiny dark seeds.
    ctx.fillStyle = '#3a0d24';
    const seeds = [[-0.3, -0.25], [0.05, -0.35], [0.35, -0.1], [-0.1, 0.05], [0.25, 0.25], [-0.4, 0.2]];
    for (const seed of seeds) {
      ctx.beginPath();
      ctx.arc(seed[0] * r, seed[1] * r, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // An eye, so it reads as the character.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(r * 0.42, -r * 0.18, r * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#173a20';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#1c1c28';
    ctx.beginPath();
    ctx.arc(r * 0.5, -r * 0.18, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // One pair of obstacles: stacked wooden produce crates.
  // They fill exactly the rectangles the game crashes you on. Nothing sticks into the gap.
  drawPipe: function (ctx, x, gapTop, gapBottom, pipeWidth, height) {
    ctx.save();

    const drawStack = function (y0, y1) {
      const stackHeight = y1 - y0;
      if (stackHeight <= 0) return;

      // The crate wood.
      ctx.fillStyle = '#b07a3f';
      ctx.fillRect(x, y0, pipeWidth, stackHeight);

      // One crate is about 46 pixels tall. Draw the crates from the bottom up.
      const crate = 46;
      ctx.strokeStyle = '#5a3a1a';
      for (let cy = y1; cy > y0; cy -= crate) {
        const top = Math.max(y0, cy - crate);
        // Crate frame.
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1.5, top + 1.5, pipeWidth - 3, cy - top - 3);
        // Two horizontal slats.
        ctx.lineWidth = 2;
        const h = cy - top;
        if (h > 18) {
          ctx.beginPath();
          ctx.moveTo(x + 3, top + h * 0.38);
          ctx.lineTo(x + pipeWidth - 3, top + h * 0.38);
          ctx.moveTo(x + 3, top + h * 0.7);
          ctx.lineTo(x + pipeWidth - 3, top + h * 0.7);
          ctx.stroke();
        }
        // Produce peeking over the crate rim: little round fruits (drawn inside the box).
        if (h > 30) {
          ctx.fillStyle = (Math.floor(cy / crate) % 2 === 0) ? '#d94f30' : '#8bc34a';
          for (let f = 0; f < 3; f += 1) {
            ctx.beginPath();
            ctx.arc(x + pipeWidth * (0.25 + f * 0.25), top + 11, 6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#b07a3f';
        }
      }

      // A dark outline around the whole stack, so it stands out from the sky.
      ctx.strokeStyle = '#2e1c0e';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y0 + 1.5, pipeWidth - 3, stackHeight - 3);
    };

    drawStack(0, gapTop);
    drawStack(gapBottom, height);

    ctx.restore();
  }
};
