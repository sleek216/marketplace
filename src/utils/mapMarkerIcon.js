const buildPinSvg = (fillColor) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
  <path d="M12 1C6.48 1 2 5.48 2 11c0 8.1 10 23 10 23s10-14.9 10-23C22 5.48 17.52 1 12 1z" fill="${fillColor}" stroke="white" stroke-width="1.5"/>
  <circle cx="12" cy="11" r="4.1" fill="white"/>
</svg>
`;

export const getBluePinDataUrl = (fillColor) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(buildPinSvg(fillColor))}`;

export const getBlueGooglePinIcon = ({
  google,
  fillColor,
  width = 30,
  height = 40,
}) => ({
  url: getBluePinDataUrl(fillColor),
  scaledSize: new google.maps.Size(width, height),
  anchor: new google.maps.Point(width / 2, height),
});
