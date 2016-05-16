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
      { name: '1', target: 'A' },
      { name: '2', target: 'B' }
    ]
  }
];
