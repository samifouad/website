<script>
  export let value = 75; // Default score
  export let size = 120; // Default size
  
  const getColor = (value) => {
    if (value >= 89) return '#00cc66';
    if (value >= 49) return '#ffaa33';
    return '#ff4848';
  };

  // Calculate the radius and circumference based on the size
  const radius = (size / 2) - 5; // Subtract stroke width for accurate radius
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dashoffset and dasharray based on the value
  const calculateStrokeDashoffset = (value) => {
    return circumference - (value / 100) * circumference;
  };

  const color = getColor(value);
  const strokeDashoffset = calculateStrokeDashoffset(value);
</script>

<!-- Include Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@700&display=swap" rel="stylesheet">

<svg width="{size}" height="{size}" viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
  <circle
    cx="{size / 2}"
    cy="{size / 2}"
    r="{radius}"
    fill="none"
    stroke="#ccc"
    stroke-width="5"
  />
  <circle
    cx="{size / 2}"
    cy="{size / 2}"
    r="{radius}"
    fill="none"
    stroke={color}
    stroke-width="5"
    stroke-dasharray="{circumference}"
    stroke-dashoffset="{strokeDashoffset}"
    transform={`rotate(-90 ${size / 2} ${size / 2})`}
  />
  <text
    x="50%"
    y="53%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-size="24"
    fill={color}
    font-family="'Inconsolata', sans-serif"
  >
    {value}
  </text>
</svg>

<style>
  svg {
    display: block;
    margin: auto;
  }
</style>
