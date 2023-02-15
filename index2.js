'use strict';

const WIDTH   = 143.50; // inches
const HEIGHT  =  62.75; // inches
const PADDING =   1.50; // inches
const SCALE   =   8.00; // pixels per inch;

const D3 = window['d3'];

const svg = D3.select('body').append('svg')
  .attr('width', WIDTH * SCALE)
  .attr('height', HEIGHT * SCALE);

const bounder = svg.append('rect')
  .style('fill', 'none')
  .style('stroke', 'black')
  .attr('class', 'bounder');

// const outlet = svg.append('rect')
// .attr('x', (85 + 1 / 8) * SCALE)
// .attr('y', 36 * SCALE)
// .attr('width', 2.75 * SCALE)
// .attr('height', 4.5 * SCALE)
// .style('fill', 'red')
// .style('stroke', 'black');

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
  {name: 'SupremeCourt',   width: 21+ 9/16, height: 18+ 9/16, drop: 4+ 9/16 },
  {name: 'AkronLaw',       width: 21+11/16, height: 18+ 3/ 4, drop: 4+ 1/ 2 },
  {name: 'Malki',          width: 14+ 1/16, height: 12+ 1/16, drop: 2+ 5/ 8 },
  {name: 'Someday',        width: 25+23/32, height: 18+ 3/ 4, drop: 4+ 3/16 },
  {name: 'SirIan',         width: 19+27/32, height: 25+ 3/32, drop: 7       },
  {name: 'Katharine',      width: 14+ 9/16, height: 17+ 9/16, drop: 4+ 1/ 2 },
  {name: 'Butterfly',      width: 10+13/16, height:  8+ 7/ 8, drop:    7/ 8 },
  {name: 'Ravenclaw',      width:  9+ 7/16, height:  9+ 7/16, drop: 1+ 7/16 },
  {name: 'DoctorHoo',      width: 29+ 7/16, height: 17+ 1/16, drop: 4       },
  {name: 'GoldenTreasure', width: 16+ 3/ 4, height: 13+ 3/ 4, drop: 1+ 7/ 8 },
  {name: 'ElevenDoctors',  width: 17+ 1/ 2, height: 14+ 1/ 2, drop: 3+ 1/ 2 },
  {name: 'AynRand',        width: 15      , height: 15      , drop: 3+ 1/ 8 },
  {name: 'Novy',           width: 12+ 5/ 8, height: 24      , drop: 1       },
];

const locks = { // top-left corner!
  SupremeCourt:   { x:  32+21/32, y:   2+21/32 },
  AkronLaw:       { x:  60+ 3/ 8, y:  22+23/32 },
  Malki:          { x:  55+11/16, y:   9+ 5/32 },
  Someday:        { x:  97+11/16, y:   3+11/16 },
  SirIan:         { x:  39+ 1/16, y:  22+23/32 },
  Katharine:      { x:  97+21/32, y:  23+15/16 },
  Butterfly:      { x:  71+ 7/32, y:  12+11/32 },
  Ravenclaw:      { x: 113+11/16, y:  23+15/16 },
  DoctorHoo:      { x:  76+29/32, y:  43       },
  GoldenTreasure: { x:  20+13/16, y:  38+23/32 },
  ElevenDoctors:  { x:  20+ 1/16, y:  22+23/32 },
  AynRand:        { x:  60+13/32, y:  42+31/32 },
  Novy:           { x:  83+17/32, y:  17+ 1/ 2 }
};

nodes.forEach(n => {
  if (locks[n.name]) {
    n.x = locks[n.name].x + n.width / 2;
    n.y = locks[n.name].y + n.height / 2;
    n.fixed = true;
  }
});

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

const hooks = svg.selectAll('.hook')
.data(nodes)
.enter().append('circle')
.attr('cx', d => d.x * SCALE)
.attr('cy', d => ((d.y - d.height/2) + d.drop) * SCALE)
.attr('r', 1)
.style('fill', 'red')
.attr('class', 'hook');

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
  return `${toFraction(n.x + (boundingRect.xOffset() || 0))} × ${toFraction(((n.y - n.height / 2) + n.drop) + (boundingRect.yOffset() || 0))}`;
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
