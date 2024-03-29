import { Typography } from "@material-ui/core"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { atoms } from 'misc'
import { StyledSlider, StyledSliderReverse } from "./Slider"
import { SliderWrapper } from "./styles"


export default function SliderStyled (){
  const [ marks ] = useState([...new Array(15)].map((v,i)=>({value: 2006+i})))
  const [ year, setYear ] = useRecoilState(atoms.year)

  console.log()
  return (<div>
    <SliderWrapper>
      <StyledSliderReverse 
        aria-label="History Slider" 
        marks={marks} 
        valueLabelDisplay="off" 
        max={2022}
        min={2006}
        value={year}
        onChange={(e:any)=>setYear(e?.target.value||2022)}
      />
      <h4>{year}</h4>
    </SliderWrapper>
  </div>)
}
