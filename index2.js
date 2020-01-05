'use strict';

const WIDTH = 108; // inches
const HEIGHT = 54; // inches
const PADDING = 2; // inches
const SCALE = 8;   // pixels per inch;

const D3 = window['d3'];

const svg = D3.select('body').append('svg')
  .attr('width', WIDTH * SCALE)
  .attr('height', HEIGHT * SCALE);

const bounder = svg.append('rect')
  .style('fill', 'none')
  .style('stroke', 'black')
  .attr('class', 'bounder');

const outlet = svg.append('rect')
.attr('x', (85 + 1 / 8) * SCALE)
.attr('y', 36 * SCALE)
.attr('width', 2.75 * SCALE)
.attr('height', 4.5 * SCALE)
.style('fill', 'red')
.style('stroke', 'black');

const color = D3.scale.category20();

const boundingRect = {
  x0: 0,
  y0: 0,
  x1: WIDTH,
  y1: HEIGHT,
  width() { return this.x1 - this.x0; },
  height() { return this.y1 - this.y0; },
  trueX() { return (WIDTH - this.width()) / 2; },
  trueY() { return (HEIGHT - this.height()) / 2; },
  xOffset() { return this.trueX() - this.x0; },
  yOffset() { return this.trueY() - this.y0; }
};

const nodes = [
//{name: 'center', width: 0, height: 0, x: width / 2, y: height / 2, fixed: true},
  {name: 'SupremeCourt',   width: 21+ 9/16, height: 18+ 9/16}, //
  {name: 'AkronLaw',       width: 21+ 3/ 4, height: 18+ 3/ 4},
//{name: 'TreeOctopus',    width: 23+ 3/16, height: 35+ 5/16},
//{name: 'Malki',          width: 14+ 1/16, height: 12+ 1/16}, //
  {name: 'Someday',        width: 23+11/16, height: 18+ 3/ 4}, //
  {name: 'SirIan',         width: 19+ 7/ 8, height: 25+ 1/ 8}, //
  {name: 'Katharine',      width: 14+ 9/16, height: 17+ 9/16}, //
//{name: 'Butterfly',      width: 10+15/16, height:  8+15/16},
//{name: 'Ravenclaw',      width:  9+ 7/16, height:  9+ 7/16}, //
  {name: 'DoctorHoo',      width: 29+ 3/ 8, height: 17+ 1/16}, //
  {name: 'GoldenTreasure', width: 16+ 1/ 4, height: 13+ 3/ 4}, //
//{name: 'Regretsy',       width: 18+ 3/16, height: 24+ 3/16},
  {name: 'ElevenDoctors',  width: 17+ 1/ 2, height: 14+ 1/ 2}, //
  {name: 'AynRand',        width: 15      , height: 15      }  //
];

const force = D3.layout.force()
.size([WIDTH, HEIGHT])
.linkDistance(0)
.charge(2)
.nodes(nodes);

force.start();

const rects = svg.selectAll('.data-rect')
  .data(nodes)
  .enter().append('rect')
    .attr('width', d => d.width * SCALE)
    .attr('height', d => d.height * SCALE)
    .attr('x', d => (d.x - d.width / 2) * SCALE)
    .attr('y', d => (d.y - d.height / 2) * SCALE)
    .style('fill', (d, i) => color(i % 14))
    .attr('class', 'data-rect')
  .call(force.drag);

const names = svg.selectAll('.name')
  .data(nodes)
  .enter().append('text')
    .attr('x', d => d.x * SCALE)
    .attr('y', d => d.y * SCALE - 10)
    .style('font-family', 'Triplicate T4c')
    .style('font-size', '10px')
    .style('fill', 'black')
    .style('text-anchor', 'middle')
    .attr('class', 'name')
    .text(d => d.name);

const dims = svg.selectAll('.dims')
  .data(nodes)
  .enter().append('text')
    .attr('x', d => d.x * SCALE)
    .attr('y', d => d.y * SCALE + 10)
    .style('font-family', 'Triplicate T4c')
    .style('font-size', '10px')
    .style('fill', 'black')
    .style('text-anchor', 'middle')
    .attr('class', 'dims')
    .text(formatLabel);

force.on('tick', () => {

  let q = D3.geom.quadtree(nodes);

  nodes.forEach((node) => {
    q.visit(collide(node));
    if (node.x < PADDING + node.width / 2) {
      node.x = PADDING + node.width / 2;
    }
    if (node.x > WIDTH - PADDING - node.width / 2) {
      node.x = WIDTH - PADDING - node.width / 2;
    }
    if (node.y < PADDING + node.height / 2) {
      node.y = PADDING + node.height / 2;
    }
    if (node.y > HEIGHT - PADDING - node.height / 2) {
      node.y = HEIGHT - PADDING - node.height / 2;
    }
    q.visit(testCollision(node));
    if (node.x < PADDING + node.width / 2 ||
        node.x > WIDTH - PADDING - node.width / 2 ||
        node.y < PADDING + node.height / 2 ||
        node.y > HEIGHT - PADDING - node.height / 2) {
      node.colliding = true;
    }
  });

  boundingRect.x0 = Math.min(...(nodes.map(n => n.x - n.width / 2)));
  boundingRect.y0 = Math.min(...(nodes.map(n => n.y - n.height / 2)));
  boundingRect.x1 = Math.max(...(nodes.map(n => n.x + n.width / 2)));
  boundingRect.y1 = Math.max(...(nodes.map(n => n.y + n.height / 2)));

  rects
    .attr('x', d => (d.x - d.width / 2) * SCALE)
    .attr('y', d => (d.y - d.height / 2) * SCALE)
    .style('stroke', d => d.colliding ? '#ff0000' : 'none');

  names
    .attr('x', d => d.x * SCALE)
    .attr('y', d => d.y * SCALE - 10);

  dims
    .attr('x', d => d.x * SCALE)
    .attr('y', d => d.y * SCALE + 10)
    .text(formatLabel);

  bounder
  .attr('x', boundingRect.trueX() * SCALE)
  .attr('y', boundingRect.trueY() * SCALE)
  .attr('width', boundingRect.width() * SCALE)
  .attr('height', boundingRect.height() * SCALE);

});

function toFraction(val) {
  let int = Math.floor(val);
  let frac = Math.floor((val - int) * 32);
  let div = 32;
  while (div > 1 && frac > 1 && frac % 2 === 0) {
    div /= 2;
    frac /= 2;
  }
  return `${int}` + (frac > 0 ? ` ${frac}/${div}` : '');
}

function formatLabel(n) {
  return `${toFraction((n.x - n.width / 2) + (boundingRect.xOffset() || 0))} × ${toFraction((n.y - n.height / 2) + (boundingRect.yOffset() || 0))}`;
}

function testCollision(n) {
  n.colliding = false;
  return function(q) {
    if (q.point && (q.point !== n)) {
      let xmin = n.width / 2 + q.point.width / 2 + PADDING;
      let ymin = n.height / 2 + q.point.height / 2 + PADDING;
      let xdiff = Math.abs(n.x - q.point.x);
      let ydiff = Math.abs(n.y - q.point.y);
      if (xdiff < xmin - 0.1 && ydiff < ymin - 0.1) {
        n.colliding = true;
      }
    }
    return false;
  };
}

function collide(n) {
  return function(q) {
    if (q.point && (q.point !== n)) {
      let xmin = n.width / 2 + q.point.width / 2 + PADDING;
      let ymin = n.height / 2 + q.point.height / 2 + PADDING;
      let xdiff = Math.abs(n.x - q.point.x);
      let ydiff = Math.abs(n.y - q.point.y);
      if (xdiff < xmin && ydiff < ymin) {
        if (xmin - xdiff < ymin - ydiff) {
          correctX(n, q, xmin - xdiff);
        } else {
          correctY(n, q, ymin - ydiff);
        }
      }
    }
    return false;
  };
}

function correctX(n, q, d) {
  if (n.x <= q.point.x) {
    n.x -= d / 2;
    q.point.x += d / 2;
  } else {
    n.x += d / 2;
    q.point.x -= d / 2;
  }
}

function correctY(n, q, d) {
  if (n.y <= q.point.y) {
    n.y -= d / 2;
    q.point.y += d / 2;
  } else {
    n.y += d / 2;
    q.point.y -= d / 2;
  }
}
