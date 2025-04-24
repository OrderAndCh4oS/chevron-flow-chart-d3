# Chevron Flow Chart D3

A D3.js plugin for creating beautiful chevron flow charts in both straight (horizontal) and radial (circular) layouts.

## Usage

### Straight (Horizontal) Chevron Flow Chart

```html
<div id="chart" style="width: 100%; height: 200px;"></div>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script type="module">
    import { straightChevronChart } from 'chevron-flow-chart';

    const segments = [
        {label: "A"},
        {label: "B"},
        {label: "C"},
        {label: "D"},
        {label: "E"},
        {label: "F"}
    ];

    const chart = straightChevronChart({
        width: 150,
        height: 100,
        headPoint: 40,
        tailPoint: 40,
        gap: 18,
        strokeWidth: 8,
        strokeColor: '#000',
        flatFirstArrow: true
    });

    d3.select("#chart")
        .datum(segments)
        .call(chart);
</script>
```

### Radial (Circular) Chevron Flow Chart

```html
<div id="chart" style="width: 100vw; height: 100vh;"></div>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script type="module">
    import { radialChevronChart } from 'chevron-flow-chart';

    const segments = [
        {label: 'A', description: 'A description', icon: ''},
        {label: 'B', description: 'A description', icon: ''},
        {label: 'C', description: 'A description', icon: ''},
        {label: 'D', description: 'A description', icon: ''},
        {label: 'E', description: 'A description', icon: ''},
        {label: 'F', description: 'A description', icon: ''},
    ];

    const chart = radialChevronChart({
        width: 816,
        height: 816,
        innerRadius: 250,
        outerRadius: 400,
        gapDegrees: 4,
        rotateDegrees: 5,
        labelOffsetDeg: 0,
        strokeWidth: 8,
        strokeColor: '#000',
        responsive: true
    });

    d3.select("#chart")
        .datum(segments)
        .call(chart);
</script>
```

## API

### Segment Object

Both chart types use an array of segment objects as data:

```javascript
{
  label: "A",              // Required: Text label for the segment
  description: "Details",  // Optional: Description text
  icon: "icon-name",       // Optional: Icon identifier
  color: "#ff0000"         // Optional: Custom color for this segment
}
```

### straightChevronChart(config)

Creates a horizontal chevron flow chart.

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| width | number | 220 | Width of each chevron |
| height | number | 80 | Height of each chevron |
| headPoint | number | 40 | Size of the chevron head point |
| tailPoint | number | 40 | Size of the chevron tail point |
| gap | number | 12 | Gap between chevrons |
| colors | string[] | d3.schemeObservable10 | Array of colors to use |
| textColor | string | '#fff' | Color of the text labels |
| strokeColor | string | '#fff' | Color of the stroke |
| strokeWidth | number | 2 | Width of the stroke |
| fontFamily | string | 'sans-serif' | Font family for labels |
| fontSize | number | 26 | Font size for labels |
| fontWeight | string | 'bold' | Font weight for labels |
| flatFirstArrow | boolean | true | Whether the first arrow has a flat back |
| strokeLineJoin | 'round'\|'miter' | 'miter' | Style of line joins |

### radialChevronChart(config)

Creates a radial (circular) chevron flow chart.

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| width | number | 700 | Width of the SVG |
| height | number | 700 | Height of the SVG |
| innerRadius | number | 180 | Inner radius of the chart |
| outerRadius | number | 300 | Outer radius of the chart |
| gapDegrees | number | 4 | Gap between segments in degrees |
| rotateDegrees | number | 10 | Rotation of the chevron points in degrees |
| labelOffsetDeg | number | 30 | Label position offset in degrees |
| colors | string[] | d3.schemeObservable10 | Array of colors to use |
| textColor | string | '#fff' | Color of the text labels |
| strokeColor | string | '#fff' | Color of the stroke |
| strokeWidth | number | 8 | Width of the stroke |
| fontFamily | string | 'sans-serif' | Font family for labels |
| fontSize | number | 26 | Font size for labels |
| fontWeight | string | 'bold' | Font weight for labels |
| responsive | boolean | true | Whether to make the chart responsive |

## Dependencies

- [D3.js](https://d3js.org/) v7 or higher
