module.exports = [
  {
    name: 'A',
    connections: [
      { name: '1', target: 'B' },
    ],
  },
  {
    name: 'B',
    connections: [
      { name: '1', target: 'C' }
    ]
  },
  {
    name: 'C',
    connections: [
      { name: '1', target: 'D' },
      { name: '2', target: 'B' }
    ]
  },
  {
    name: 'D',
    connections: [
      { name: '1', target: 'E' },
      { name: '2', target: 'B' }
    ]
  },
  {
    name: 'E',
    connections: [
      { name: '1', target: 'F' }
    ]
  },
  {
    name: 'F',
    connections: [
      { name: '1', target: 'G' },
      { name: '2', target: 'B' },
    ]
  },
  {
    name: 'G',
    connections: [
      { name: '1', target: 'H' },
    ]
  },
  {
    name: 'H',
    connections: [
      { name: '1', target: 'I' },
      { name: '2', target: 'J' },
    ]
  },
  {
    name: 'I',
    connections: [
      { name: '1', target: 'J' }
    ]
  },
  {
    name: 'J',
    connections: [
      { name: '1', target: 'K' },
    ]
  },
  {
    name: 'K',
    connections: [
      { name: '1', target: 'L' },
      { name: '2', target: 'A' },
    ]
  },
  {
    name: 'L',
    connections: [
      { name: '1', target: 'M' },
    ]
  },
  {
    name: 'M',
    connections: [
      { name: '1', target: 'N' },
    ]
  },
  {
    name: 'N',
    connections: [
      { name: '1', target: 'A' },
    ]
  }
];
