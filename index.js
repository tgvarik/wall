var width = 143 + 1 / 8;
var height = 62 + 3 / 4;
var padding = 2 + 1 / 4;
var scale = 8;

var svg = d3.select('body').append('svg')
  .attr('width', width * scale)
  .attr('height', height * scale);

var bounder = svg.append('rect')
  .style('fill', 'none')
  .style('stroke', 'black');

var color = d3.scale.category20();

var boundingRect = {
  x0: 0,
  y0: 0,
  x1: width,
  y1: height,
  width: function(){ return this.x1 - this.x0; },
  height: function(){ return this.y1 - this.y0; },
  trueX: function(){ return (width - this.width()) / 2; },
  trueY: function(){ return (height - this.height()) / 2; },
  xOffset: function(){ return this.trueX() - this.x0; },
  yOffset: function(){ return this.trueY() - this.y0; }
};

var nodes = [
//{name: 'center', width: 0, height: 0, x: width / 2, y: height / 2, fixed: true},
  {name: 'SupremeCourt',   width: 21+ 9/16, height: 18+ 9/16},
  {name: 'AkronLaw',       width: 21+ 3/ 4, height: 18+ 3/ 4},
//{name: 'TreeOctopus',    width: 23+ 3/16, height: 35+ 5/16},
  {name: 'Malki',          width: 14+ 1/16, height: 12+ 1/16},
  {name: 'Someday',        width: 23+11/16, height: 18+ 3/ 4},
  {name: 'SirIan',         width: 19+ 7/ 8, height: 25+ 1/ 8},
  {name: 'Katharine',      width: 14+ 9/16, height: 17+ 9/16},
  {name: 'Butterfly',      width: 10+15/16, height:  8+15/16},
  {name: 'Ravenclaw',      width:  9+ 7/16, height:  9+ 7/16},
  {name: 'DoctorHoo',      width: 29+ 3/ 8, height: 17+ 1/16},
  {name: 'GoldenTreasure', width: 16+ 1/ 4, height: 13+ 3/ 4},
//{name: 'Regretsy',       width: 18+ 3/16, height: 24+ 3/16},
  {name: 'ElevenDoctors',  width: 17+ 1/ 2, height: 14+ 1/ 2},
  {name: 'AynRand',        width: 15      , height: 15      }
];

var force = d3.layout.force()
  .size([width, height])
  .linkDistance(0)
  .charge(2)
  .nodes(nodes);

force.start();

var rects = svg.selectAll('.data-rect')
  .data(nodes)
  .enter().append('rect')
    .attr('width', function(d) { return d.width * scale; })
    .attr('height', function(d) { return d.height * scale; })
    .attr('x', function(d) {return (d.x - d.width / 2) * scale; })
    .attr('y', function(d) {return (d.y - d.height / 2) * scale; })
    .style('fill', function(d, i) { return color(i % 14); })
    .attr('class', 'data-rect')
.call(force.drag);

var names = svg.selectAll('.name')
  .data(nodes)
  .enter().append('text')
    .attr('x', function(d) { return d.x * scale; })
    .attr('y', function(d) { return d.y * scale - 10; })
    .style('font-family', 'Triplicate T4c')
    .style('font-size', '10px')
    .style('fill', 'black')
    .style('text-anchor', 'middle')
    .attr('class', 'name')
    .text(function(d){return d.name;});

var dims = svg.selectAll('.dims')
  .data(nodes)
  .enter().append('text')
    .attr('x', function(d) { return d.x * scale; })
    .attr('y', function(d) { return d.y * scale + 10; })
    .style('font-family', 'Triplicate T4c')
    .style('font-size', '10px')
    .style('fill', 'black')
    .style('text-anchor', 'middle')
    .attr('class', 'dims')
    .text(formatLabel);

force.on('tick', function(e) {
  var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;

  while (i < n) {
    q.visit(collide(nodes[i]));

    if (nodes[i].x < padding + nodes[i].width / 2){
      nodes[i].x = padding + nodes[i].width / 2;
    }
    if (nodes[i].x > width - padding - nodes[i].width / 2){
      nodes[i].x = width - padding - nodes[i].width / 2;
    }
    if (nodes[i].y < padding + nodes[i].height / 2){
      nodes[i].y = padding + nodes[i].height / 2;
    }
    if (nodes[i].y > height - padding - nodes[i].height / 2){
      nodes[i].y = height - padding - nodes[i].height / 2;
    }

    q.visit(testCollision(nodes[i]));
    if (nodes[i].x < padding + nodes[i].width / 2 || nodes[i].x > width - padding - nodes[i].width / 2 || nodes[i].y < padding + nodes[i].height / 2 || nodes[i].y > height - padding - nodes[i].height / 2){
      nodes[i].colliding = true;
    }
    i++;
  }

  boundingRect.x0 = Math.min.apply(null, nodes.map(function (node) {
    return node.x - node.width / 2;
  }));
  boundingRect.y0 = Math.min.apply(null, nodes.map(function (node) {
    return node.y - node.height / 2;
  }));
  boundingRect.x1 = Math.max.apply(null, nodes.map(function (node) {
    return node.x + node.width / 2;
  }));
  boundingRect.y1 = Math.max.apply(null, nodes.map(function (node) {
    return node.y + node.height / 2;
  }));

  //if (boundingRect.x1 - boundingRect.x0 < width - padding * 2){
  //  nodes.forEach(function(node){
  //    node.x += ((width - padding - boundingRect.x1) - (boundingRect.x0 -
  // padding)); }); } if (boundingRect.y1 - boundingRect.y0 < height - padding
  // * 2){ nodes.forEach(function(node){ node.y += (height - padding -
  // boundingRect.y1) - (boundingRect.y0 - padding); }); }

  rects
    .attr('x', function(d) { return (d.x - d.width / 2) * scale; })
    .attr('y', function(d) { return (d.y - d.height / 2) * scale; })
    .style('stroke', function(d) { return d.colliding ? '#ff0000': 'none'});
  names
    .attr('x', function(d) { return d.x * scale; })
    .attr('y', function(d) { return d.y * scale - 10; });
  dims
    .attr('x', function(d) { return d.x * scale; })
    .attr('y', function(d) { return d.y * scale + 10; })
    .text(formatLabel);
  bounder
    .attr('x', boundingRect.trueX() * scale)
    .attr('y', boundingRect.trueY() * scale)
    .attr('width', boundingRect.width() * scale)
    .attr('height', boundingRect.height() * scale);
});

function formatLabel(node) {
  var labelText = '';

  var xInt = Math.floor((node.x - node.width / 2) + (boundingRect.xOffset() || 0));
  var x32nds = Math.floor((((node.x - node.width / 2) + (boundingRect.xOffset() || 0)) - xInt) * 32);
  var xDivisor = 32;
  var xDividend = x32nds;
  while (xDividend > 1 && xDivisor > 1 && xDividend % 2 === 0){
    xDividend /= 2;
    xDivisor /= 2;
  }
  var yInt = Math.floor((node.y - node.height / 2) + (boundingRect.yOffset() || 0));
  var y32nds = Math.floor((((node.y - node.height / 2) + (boundingRect.yOffset() || 0)) - yInt) * 32);
  var yDivisor = 32;
  var yDividend = y32nds;
  while (yDividend > 1 && yDivisor > 1 && yDividend % 2 === 0){
    yDividend /= 2;
    yDivisor /= 2;
  }
  labelText += xInt.toString() + (xDividend > 0 ? ' ' + xDividend.toString() + '/' + xDivisor.toString() : '') + ' × ' + yInt.toString() + (yDividend > 0 ? ' ' + yDividend.toString() + '/' + yDivisor.toString() : '')
  return labelText;
}

function testCollision(node) {
  node.colliding = false;
  return function(quad) {
    if ( quad.point && (quad.point !== node) ) {
      var xmin, ymin;
      xmin = node.width / 2 + quad.point.width / 2 + padding;
      ymin = node.height / 2 + quad.point.height / 2 + padding;
      var xdiff = Math.abs(node.x - quad.point.x);
      var ydiff = Math.abs(node.y - quad.point.y);
      if ( xdiff < xmin - 0.1 && ydiff < ymin - 0.1 ) {
        node.colliding = true;
      }
    }
    return false;
  };
}

function collide (node) {
  return function (quad) {

    var correctX = function (diff) {
      if ( node.x <= quad.point.x ) {
        node.x -= diff / 2;
        quad.point.x += diff / 2;
      } else {
        node.x += diff / 2;
        quad.point.x -= diff / 2;
      }
    };
    var correctY = function (diff) {
      if ( node.y <= quad.point.y ) {
        node.y -= diff / 2;
        quad.point.y += diff / 2;
      } else {
        node.y += diff / 2;
        quad.point.y -= diff / 2;
      }
    };
    if ( quad.point && (quad.point !== node) ) {
      var xmin, ymin;
      xmin = node.width / 2 + quad.point.width / 2 + padding;
      ymin = node.height / 2 + quad.point.height / 2 + padding;
      var xdiff = Math.abs(node.x - quad.point.x);
      var ydiff = Math.abs(node.y - quad.point.y);

      if ( xdiff < xmin && ydiff < ymin ) {
        if ( xmin - xdiff < ymin - ydiff ) {
          correctX(xmin - xdiff);
        } else {
          correctY(ymin - ydiff);
        }
      }
    }
    return false;
  };
}
