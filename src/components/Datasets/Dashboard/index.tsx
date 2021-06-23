import React, { useState } from 'react';
import Layers, { LayersButton } from './Layers'
import { useSpring, animated } from 'react-spring' 
import Legend from './Legend'

export default ()=>{

  const [open, setOpen ] = useState(true)
  const pos:any = useSpring({
    from:{ translateX: 100 },
    to: open?{ translateX:0 }:{ translateX: 100 },
  })

  return (<>
    <animated.div 
      style={{
        transform: pos.translateX.interpolate((v:number)=>`translate(${v}%,0)`),
        position:'absolute',
        display: 'block',
        top: 0,
        bottom:0,
        right: 0,
        textAlign: 'left',
        padding:'1rem',
        paddingLeft:0,
        zIndex:2,
        overflowX: 'visible',
      }}
      className="Dashboard">
      <Layers {...{open, setOpen}} />
      <Legend />
      <LayersButton {...{pos, open, setOpen}} />
    </animated.div>
  </>);
}