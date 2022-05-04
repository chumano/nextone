import IconLine from './IconLine'
import IconFill from './IconFill'
import IconSymbol from './IconSymbol'
import IconBackground from './IconBackground'
import IconCircle from './IconCircle'
import IconMissing from './IconMissing'

const IconLayer: React.FC<any> = (props) => {
  const iconProps = { style: props.style }
  switch (props.type) {
    case 'fill': return <IconFill {...iconProps} />
    case 'line': return <IconLine {...iconProps} />
    case 'point': return <IconCircle {...iconProps} />
    case 'symbol': return <IconSymbol {...iconProps} />
    default: return <IconMissing {...iconProps} />
  }
}

export default IconLayer;
