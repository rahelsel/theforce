import React from "react";
import PropTypes from "prop-types";
import SVGInline from "react-svg-inline";

const Student = props => {
  return (
    <SVGInline
      height={props.height}
      width={props.width}
      svg={`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 481.639 481.639" style="enable-background:new 0 0 481.639 481.639;" xml:space="preserve">
<path style="fill:#603813;" d="M392.82,361.639v-99.496c0-15.739-12.757-28.5-28.496-28.504H117.316
	c-15.739,0.004-28.496,12.765-28.496,28.504v99.496H392.82z"/>
<path style="fill:#333333;" d="M323.604,209.639c16.424-0.298,29.501-13.847,29.216-30.272v-55.872
	c0.378-45.006-25.97-85.952-67.088-104.256l-5.92-2.56c-27.887-12.039-59.602-11.52-87.08,1.424
	c-39.372,19.054-64.251,59.077-63.912,102.816v58.448c-0.285,16.425,12.792,29.974,29.216,30.272h165.6H323.604z"/>
<path style="fill:#FF7BAC;" d="M80.82,473.639V370.183c-0.074-35.626,18.022-68.831,48-88.08l40-15.048
	c5.076-0.763,10.203-1.145,15.336-1.144l56.664,40.368l56.664-40.368c5.133-0.001,10.26,0.381,15.336,1.144l40,15.048
	c29.977,19.25,48.072,52.454,48,88.08v103.456"/>
<g>
	<path style="fill:#8C6239;" d="M168.82,233.639v240h-40v-240"/>
	<path style="fill:#8C6239;" d="M312.82,233.639h40v240h-40V233.639z"/>
</g>
<path style="fill:#ECC19C;" d="M196.396,245.527v20.384h-12.24l56.664,40.368l56.664-40.368h-11.168v-20.384H196.396z"/>
<path style="fill:#F0D0B4;" d="M320.82,129.167v49c1.015,42.835-32.855,78.398-75.688,79.472h-8.624
	c-42.833-1.074-76.703-36.637-75.688-79.472v-49c0,0,112.944,0,131.768-39.528C292.588,89.639,301.996,129.167,320.82,129.167z"/>
<path d="M80.82,481.639c4.418,0,8-3.582,8-8V370.183c-0.043-27.382,11.598-53.481,32-71.744v175.2c0,4.418,3.582,8,8,8
	c4.418,0,8-3.582,8-8v-232h24v232c0,4.418,3.582,8,8,8s8-3.582,8-8V274.367c1.6-0.128,3.2-0.376,4.8-0.424l54.536,38.848
	c2.777,1.977,6.503,1.977,9.28,0l54.584-38.848c1.6,0.048,3.2,0.296,4.8,0.424v199.272c0,4.418,3.582,8,8,8s8-3.582,8-8v-232h24v232
	c0,4.418,3.582,8,8,8s8-3.582,8-8v-175.2c20.41,18.274,32.051,44.389,32,71.784v103.416c0,4.418,3.582,8,8,8s8-3.582,8-8V370.183
	c0.012-14.343-2.703-28.558-8-41.888v-66.152c-0.022-20.148-16.348-36.478-36.496-36.504h-49c1.771-2.864,3.374-5.829,4.8-8.88
	c1.078,0.561,2.273,0.863,3.488,0.88c20.83-0.325,37.471-17.441,37.208-38.272v-55.88c0.454-48.223-27.818-92.096-71.92-111.608
	l-5.912-2.56c-29.997-12.939-64.105-12.382-93.664,1.528c-42.133,20.429-68.782,63.248-68.504,110.072v58.448
	c-0.263,20.834,16.383,37.952,37.216,38.272c1.215-0.017,2.41-0.319,3.488-0.88c1.426,3.051,3.029,6.016,4.8,8.88h-49
	c-20.151,0.022-36.482,16.353-36.504,36.504v66.152c-5.297,13.33-8.012,27.545-8,41.888v103.456
	C72.82,478.058,76.401,481.639,80.82,481.639L80.82,481.639z M364.324,241.639c11.317,0.013,20.487,9.187,20.496,20.504v38.632
	c-6.833-8.714-14.921-16.365-24-22.704v-36.432L364.324,241.639z M304.82,258.183c-2.4-0.16-4.888-0.272-7.336-0.272
	c-1.664,0.001-3.286,0.522-4.64,1.488l-52.024,37.056l-52-37.056c-1.354-0.966-2.976-1.487-4.64-1.488
	c-2.448,0-4.896,0.112-7.336,0.272v-16.544c0.637-0.047,1.266-0.173,1.872-0.376c15.243,15.507,36.048,24.283,57.792,24.376h8.624
	c21.752-0.087,42.568-8.863,57.816-24.376c0.606,0.203,1.235,0.329,1.872,0.376V258.183z M245.132,249.639h-8.624
	c-38.396-1.116-68.66-33.072-67.688-71.472v-41.12c24.456-0.656,91.624-4.848,120.672-30.656c4.384,11.2,11.864,24.8,23.328,29.264
	v42.512C313.792,216.568,283.528,248.524,245.132,249.639z M136.82,179.367v-58.448c-0.291-40.632,22.784-77.819,59.32-95.6
	c25.411-11.943,54.726-12.409,80.504-1.28l5.912,2.56c38.231,16.976,62.705,55.06,62.264,96.888v55.88
	c0.194,11.146-8.037,20.649-19.096,22.048c2.033-7.583,3.074-15.397,3.096-23.248v-49c0-4.418-3.582-8-8-8
	c-8.12,0-17.096-19.384-20.456-33.384c-0.789-3.298-3.571-5.741-6.944-6.096c-3.377-0.389-6.623,1.429-8.056,4.512
	c-13.648,28.656-94.536,34.96-124.544,34.968c-4.418,0-8,3.582-8,8v49c0.022,7.851,1.063,15.665,3.096,23.248
	C144.856,200.017,136.625,190.513,136.82,179.367L136.82,179.367z M96.82,262.143c0.009-11.32,9.184-20.495,20.504-20.504h3.496
	v36.44c-9.079,6.336-17.167,13.985-24,22.696V262.143z"/>
<g>
</g>
</svg>
`}
    />
  );
};

Student.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
};

Student.defaultProps = {
  height: "100%",
  width: "100%"
};

export default Student;
