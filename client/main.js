import Renderer from './lib/Renderer';
import Vector2 from './lib/Vector2';
import World from './lib/World';
import {keyboard, mouse} from './lib/input';
import {socket} from './communication';
import {resources} from './resources'


import Game from './game/JetPackGame';

var canvas = document.createElement('canvas');
var game, renderer, world, token, frame = 0;
var debug = true;
var offset = new Vector2();

function renderSoldierInfo(soldier) {
  let li = document.createElement('li');
  let percentage = soldier.health * 100;
  li.innerHTML = `
    <strong>${soldier.name}</strong>
    <span class="health">
     <span class="health-bar" style="width:${percentage}%"></span> 
    </span>
    <div class="points">Points: ${soldier.points || 0}</div>
  `;
  if (soldier.killed) {
    li.classList.add('killed')
  }
  return li;
}

function onPoints(soldier, points, game) {
  createInfo(game);
}

function createInfo(game) {
  let info = document.getElementById('info');
  info.innerHTML = '';
  let rows = [].concat(game.world.soldiers).sort((a, b) => {
    if (a.points < b.points) {
      return 1;
    }
    if (a.points > b.points) {
      return -1;
    }
  }).map(soldier => renderSoldierInfo(soldier));
  rows.forEach(row => info.appendChild(row));
}

function init() {
  canvas.width = 680;
  canvas.height = 460;
  document.getElementById('canvas').appendChild(canvas);
  renderer = new Renderer({canvas});
  world = new World();
  game = new Game({world, renderer, keyboard, mouse, onPoints: function (soldier, points) {
    onPoints(soldier, points, game)
  }});
  calcOffset();
  cancelAnimationFrame(token);
  loop();
  createInfo(game);

  window.game = game;
}

function loop() {
  frame++;
  mouse.setOffset(offset);
  game.tick(frame);
  renderer.render(frame, debug);
  token = requestAnimationFrame(loop);
}

function calcOffset() {
  let rect = canvas.getClientRects()[0];
  offset.x = rect.left;
  offset.y = rect.top;
  
}

function resize() {
  calcOffset();
}

window.addEventListener('load', () => {
  resources.load(init)
});
window.addEventListener('resize', resize);