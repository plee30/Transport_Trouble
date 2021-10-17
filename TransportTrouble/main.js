title = "Transport Trouble";

description = 
`[TAP]          row right\n[HOLD+RELEASE] row left
\n\n Guide the boats safely 
 to the bottom of the 
 screen
`
;

characters = [
  `
pppppp
pp  pp
p    p
pppppp
 pppp
  pp
`, `
  pp  
pppppp
pppppp
  pp
`,

  // Row Boat sprite
  `
y ll y
 ylly
  yy
  ll
  ll
  ll
`, `
  ll
  ll
yyyyyy
  ll
  ll
  ll
`,

// Waves sprite
  `
 l   l
l l l
   l
`, `
l   l
 l l l
  l
`,

// Bomb/Rock sprite
`
l rr l
 lrrl
rryyrr
rryyrr
 lrrl
l rr l
`,`
      

l rr l
 lrrl
rryyrr
rryyrr
`
];

// Game design variable container
const G = {
  WIDTH: 150,
  HEIGHT: 150,

  SHIP_SPEED_MIN: 0.8,
  SHIP_SPEED_MAX: 1.0,
};


options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  seed: 1,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "dark"
};

//Typedefs

/**
 * @typedef {{
 * pos: Vector,
 * }} Rock
 */

/**
 * @type { Rock [] }
 */
let rocks;

/**
 * @typedef {{
 * pos: Vector
 * duration: number
 * }} Ship
 */

/**
 * @type { Ship [] }
 */
let ships;

/**
 * @type { number }
 */
let currentShipSpeed;

/**
 * @typedef {{
 * pos: Vector,
 * }} Waves
 */

/**
 * @type { Rock [] }
 */
let waves;

let direction = "Right"

function update() {
  if (!ticks) {

    rocks = times(7, () => {
      const posX = rnd(0, G.WIDTH);
      //Don't want rocks to spawn at the very top of the screen
      const posY = rnd(20, G.HEIGHT);
      return {
        pos: vec(posX, posY),
      };
    });

    // Randomize waves
    waves = times(25, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      return {
        pos: vec(posX, posY),
      };
    });

    ships = [];

    /*
    ships = times(5, () => {
      const posX = rnd(0, G.WIDTH);
      //Don't want rocks to spawn at the very top of the screen
      const posY = rnd(20, G.HEIGHT);;
      return {
          pos: vec(posX, posY),
      };
    });
    */

    //ships = [];
  }

  if (ships.length === 0) {
    currentShipSpeed =
      rnd(G.Ship_MIN_BASE_SPEED, G.Ship_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 1; i++) {
      const posX = rnd(0, G.WIDTH);
      //const posY = -rnd(i * G.HEIGHT);
      const posY = 0;
      ships.push({
        pos: vec(posX, posY),
        duration: 0
      });
    }
  }

  rocks.forEach((r) => {
    // Choose a color to draw
    color("black");
    // Draw the star as a square of size 1
    //box(r.pos, 3);
    char(addWithCharCode("g", (floor(ticks / 30) % 2)), r.pos)
  });

  // Spawn and animate waves
  waves.forEach((r) => {
    color("blue");
    char(addWithCharCode("e", (floor(ticks / 30) % 2)), r.pos)
  });


  remove(ships, (s) => {
    //s.pos.y += currentShipSpeed;
    s.pos.y += .7;
    s.pos.clamp(0, G.WIDTH, -20, G.HEIGHT + 50);

    if (input.isPressed == true) {
      s.duration++;
    }

    //debug
    //color("black");
    //text("Duration:" + s.duration.toString(), 3, 10);
    //color("green");
    //text(direction, 120 , 10);

    if (s.duration > 8) {
      color("green")
      text("left", 125 , 10);
      if (input.isJustReleased == true) {
        s.pos.x -= 10;
        s.duration = 0;
      }
    }

    else if (input.isJustReleased == true) {
      s.pos.x += 5;
      s.duration = 0;
    }

    /*
    if (input.isJustReleased == true){
      s.pos.x += 5;
    }
    */

    // color("green");
    //const isCollidingWithRocks = char("a", s.pos).isColliding.char.b;

    // Animate "row boat"
    color("black");
    const c = char(addWithCharCode("c", (floor(ticks / 15) % 2)), s.pos)
    //const isCollidingWithRocks = char(addWithCharCode("c", (floor(ticks / 15) % 2)), s.pos).isColliding.char.g;
    isCollidingWithRocksG = c.isColliding.char.g
    isCollidingWithRocksH = c.isColliding.char.h
     // bug: collision sometimes not triggered if sprite is on different frame
    if ((floor(ticks / 15) % 2) == 0) {
      color("cyan");
      particle(s.pos);
    }

    if (isCollidingWithRocksG || isCollidingWithRocksH) {
      particle(s.pos);
      play("explosion");
      end();
      play("powerUp");
    }

    // Also another condition to remove the object
    if (s.pos.y > G.HEIGHT) {
      addScore(10);
    }
    return (isCollidingWithRocksG || isCollidingWithRocksH || s.pos.y > G.HEIGHT);
    //return (s.pos.y > G.HEIGHT);
  });

}
