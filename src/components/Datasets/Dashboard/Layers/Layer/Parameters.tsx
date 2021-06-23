import React from 'react'
import { FormControl, Select, MenuItem, Typography } from '@material-ui/core'
import { useRecoilValue } from 'recoil'
import { atoms } from 'misc'
import { ArrowDropDown } from '@material-ui/icons'

export default function Parameters ({ layerKey, param, setParam, setLayers }:any) {
  const tilejson:{[k: string]: any} = useRecoilValue(atoms.tilejson);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setParam(event.target.value as string);
    setLayers((prev:any)=>({ ...prev, [layerKey]: event.target.value as string }))
  };

  return <>
    <FormControl variant="standard" style={{paddingLeft: '2rem'}} >
      <Select
        id={layerKey}
        value={param}
        onChange={handleChange}
        MenuProps={{MenuListProps:{style:{border: 'solid 2px rgba(255,255,255,0.6)'}}}}
        IconComponent={()=><ArrowDropDown fontSize='small' style={{color:'white', marginLeft:'-1.3rem', marginTop:'-0.2rem'}}/>}
        SelectDisplayProps={{style:{backgroundColor:'rgba(255,255,255,0.05)', border:'solid 1px rgba(255,255,255,0.2)', marginBottom:'0.5rem'}}}
        style={{width:'220px', textTransform:"capitalize", }}
      >
        {
          (Object.keys(tilejson[layerKey].properties) as Array<keyof typeof tilejson>)
            .sort()
            .map((itemKey, i)=>
              <MenuItem 
                key={i} 
                
                style={{textTransform:"capitalize", display:'block', minHeight:'1.5rem'}} 
                value={itemKey}>
                  <Typography variant="body2" component="div" style={{display:'block', paddingLeft:'1rem', textTransform:"capitalize"}}>
                    {
                      typeof(itemKey)==="string"?
                      itemKey.replaceAll('_',' '):
                      itemKey
                    }
                  </Typography>
              </MenuItem>
            )
        }
      </Select>
    </FormControl>
  </>
}