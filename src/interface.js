const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

const createEmptyList = (length, value) => Array.from({ length }, () => value);

const getEmptyCoordinates = () => ({
  x: createEmptyList(10, 0),
  y: createEmptyList(10, 1),
});

class UserInterface {
  line = contrib.line({
    label: 'Response Time (ms)',
    showLegend: true,
  });    

  getRequest = {
    ...getEmptyCoordinates(),
    title: 'GET /',
    style: {
      line: 'yellow',
    },
  };

  postRequest = {
    ...getEmptyCoordinates(),
    title: 'POST /',
    style: {
      line: 'green',
    },
  };

  constructor() {
    this.screen = screen;
    this.screen.append(this.line);
  }

  renderGraph() {
    this.line.setData([this.getRequest, this.postRequest]);
    this.screen.render();
  }

  updateGraph(method, time) {
    const target = method === 'GET' ? this.getRequest : this.postRequest;

    // remove first element and add new value to the last
    target.y.shift();
    target.y.push(time);

    this.renderGraph();
  }
}

module.exports = UserInterface;