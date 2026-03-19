import * as React from 'react'
import Svg, { Path, G, Circle, SvgProps, NumberProp } from 'react-native-svg'

interface QualityEventIconProps extends SvgProps {
  width?: NumberProp
  height?: NumberProp
}

const QualityEventIcon: React.FC<QualityEventIconProps> = ({
  width = 45,
  height = 45,
  ...props
}) => (
  <Svg viewBox="0 0 200 200" width={width} height={height} {...props}>
    <Path
      fill="#A2B0C7"
      d="M182.1 200H17.9C8 200 0 192 0 182.1V17.9C0 8 8 0 17.9 0h164.3C192 0 200 8 200 17.9v164.3c0 9.8-8 17.8-17.9 17.8zm-8-192H25.9C16 8 8 16 8 25.9v148.3C8 184 16 192 25.9 192h148.3c9.9 0 17.9-8 17.9-17.9V25.9C192 16 184 8 174.1 8z"
    />
    <Path
      fill="#A2B0C7"
      d="M173.8 187.4H26.2c-7.5 0-13.6-6.1-13.6-13.6V26.2c0-7.5 6.1-13.6 13.6-13.6h147.6c7.5 0 13.6 6.1 13.6 13.6v147.6c0 7.5-6.1 13.6-13.6 13.6z"
    />
    <G>
      <Circle
        cx={138}
        cy={138}
        r={40}
        stroke="#002d5c"
        strokeWidth={7}
        fill="none"
        strokeOpacity={1}
        strokeMiterlimit={4}
      />
      <Circle
        cx={62}
        cy={62}
        r={40}
        stroke="#002d5c"
        strokeWidth={7}
        fill="none"
        strokeOpacity={1}
        strokeMiterlimit={4}
      />
      <G fill="#002d5c" fillOpacity={1}>
        <Path d="m123.08 154.83.218-.437c1.188-6.84 7.155-10.452 14.338-10.452 7.183 0 13.149 3.612 14.338 10.452l.214.437c0 2.524 1.772 4.157 4.3 4.157 2.197 0 3.578-2.091 4.018-4.157-1.05-10.81-11.59-19.403-22.678-19.403-11.088 0-22.02 8.593-23.07 19.403.441 2.066 1.822 4.157 4.018 4.157 2.528 0 4.296-1.633 4.296-4.157z" />
        <Circle cx={130.9} cy={117.3} r={6.236} />
        <Circle cx={155.1} cy={117.3} r={6.236} />
      </G>
      <Path
        d="m34.307 164.045 134.23-132.882"
        stroke="#002d5c"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
        strokeOpacity={1}
        strokeMiterlimit={4}
      />
      <Circle cx={49.5} cy={48.5} r={6.5} fill="#002d5c" fillOpacity={1} />
      <Circle cx={75} cy={48.5} r={6.5} fill="#002d5c" fillOpacity={1} />
    </G>
    <Path
      d="m47.782 70 .213.419C49.167 76.999 55.035 82 62.1 82c7.064 0 12.933-5.002 14.105-11.58l.213-.42c0-2.43 1.742-4 4.227-4 2.162 0 3.521 2.013 3.955 4-1.033 10.397-11.595 20-22.5 20s-21.467-9.603-22.5-20c.434-1.987 1.793-4 3.955-4 2.485 0 4.227 1.57 4.227 4z"
      fill="#002d5c"
      fillOpacity={1}
      stroke="#002d5c"
      strokeOpacity={1}
      strokeWidth={1.08090293}
    />
  </Svg>
)

export default QualityEventIcon
