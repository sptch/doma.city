import React, { useEffect, useMemo, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box, FormLabel, FormControl, Divider, FormGroup, FormControlLabel, FormHelperText, Checkbox, useEventCallback,
  Select, MenuItem, InputLabel, Typography, Button  } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Close, Info, Layers as L } from '@material-ui/icons'
import * as Atoms from 'misc/Atoms'
import * as Queries from 'misc/Queries'
import { useQuery } from '@apollo/client'
import DataLayer from './DataLayer'
import Layer from './Layer'
import otherLayers from 'sources.json'

export { default as LayersButton } from './LayersButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    formControl: {
      marginTop: theme.spacing(1),
    },
    layers: {
      padding:'1.5rem',
      paddingTop:'0rem',
      overflowY:'scroll',
      position:'relative',
      borderRadius:'0 0 0.5rem 0.5rem', 
      boxShadow: "-15px 15px 15px rgba(0,0,0,0.2)",
      backgroundColor:'#081217',  
      height:'calc(100% - 6.0rem)'
    }
  }),
)

function Header ({open, setOpen}:any) {
  return  <div style={{
        position:'sticky', 
        display:'block', 
        top:0, 
        left:0, 
        backgroundColor:'#081217', 
        zIndex:5,
        padding:'1rem',
        paddingLeft:'1.5rem',
        paddingRight: '2rem',
        paddingBottom: '0.5rem',
        borderRadius:'0.5rem 0.5rem 0 0'
      }}>
        <div className="Header" style={{
            display:'flex', 
            alignItems:'center', 
            justifyContent:'space-between', 
            }}>
          <Typography
            variant="body1"
            style={{
              textTransform:"capitalize",
              paddingTop:'0.3rem',
              marginRight:'3rem'
            }}>
              Map Layers:
          </Typography>
          <Button 
            size='small'
            onClick={()=>{
              console.log('click')
              setOpen(false)
            }} 
            className="Another button"
            style={{
              minWidth:'0.8rem',
              position:'relative', 
              marginLeft:'0.5rem', 
              marginRight:'-1rem'}}>
            <Close fontSize='small' />
          </Button>
        </div>
        <Typography
            variant="caption"
            style={{
              textTransform:"capitalize",
              paddingTop:'1rem'
            }}>
              By groups
        </Typography>
        <Divider style={{borderColor:'rgba(255,255,255,0.2)', transform:'translate(0,0.5rem)'}} />

      </div>
}

function Group ({group, years}:any) {
  const classes = useStyles()

  return <div style={{marginTop:'0.5rem', display:'flex', flexDirection:'column', flexWrap:'wrap'}} className={classes.root}>
    <Typography style={{textTransform: 'capitalize'}}>
      {group.name.replaceAll('_',' ')}
    </Typography>
    <div style={{marginLeft:'1rem', display:'flex', flexDirection:'column', flexWrap:'wrap'}} >
      {
        group.layers
        .sort((a:any,b:any)=>{
          var nameA = a.entry?.[0].replaceAll('_',' ').toUpperCase();
          var nameB = b.entry?.[0].replaceAll('_',' ').toUpperCase();
          return nameA < nameB ? -1: nameA > nameB? 1:0
        })
        .map((layer:any, i:number)=>{
          // ( layerKey!=='vancouver_x_property_tax_parcels' && 
          // layerKey!=='vancouver_x_property_tax_blocks' ) &&
          return layer.type==='layer'?
            <Layer {...{layerKey:layer.entry[0], key:i}}/>:
            <DataLayer 
            {...{
              layerKey: layer.entry[0],
              fields: layer.entry[1]?.fields, 
              years: years?.vancouver_x_property_tax_parcels_data?.map((v:any)=>v.report_year), 
              key:i
            }}/>
          }
        )
      }
    </div>
  </div>
}

export default ({open, setOpen}:any)=>{
  const classes = useStyles()
  const [layers] = useRecoilState<any>(Atoms.tileLayers)
  const [dataLayersNames] = useRecoilState<any>(Atoms.dataLayersNames)
  const [dataLayers, setDataLayers] = useRecoilState<any>(Atoms.dataLayers)

  const { data:keys } = useQuery(Queries.getKeys(dataLayersNames))
  const { data:years } = useQuery(Queries.getRange('vancouver_x_property_tax_parcels_data', 'report_year'), {variables:{numeric: false}})

  useEffect(()=>{
    if(keys){
      setDataLayers(keys)
    }
  },[keys])

  return (<>
    <Header {...{open, setOpen}} />
    <div className={classes.layers}>
      <Box style={{position: 'relative', height:'fit-content', width: '100%'}}>
        
        <Box style={{width: '100%'}}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>

              {
                [...Object.entries(
                  [
                    ...(Object?.entries(layers) as any).map((e:any)=>{
                        const dataEntries = (Object?.entries(dataLayers) as any)
                        const dataLayer = dataEntries.find((v:any)=>v[0]===e[0])
                        return ({
                          type: dataLayer?'dataLayer':'layer', 
                          entry: dataLayer || e})
                      })
                  ]?.reduce((a:any,v:any,i:number)=>{
                    const groupName = v.entry?.[0].split('_x_')[0]
                    return a[groupName]?
                      {...a, [groupName]:[...a[groupName], v] }:
                      {...a,[groupName]:[v]}
                  },{})
                )].reverse()
                .map((group,i)=><Group {...{years}} group={{name:group[0], layers:group[1]}} key={i}/>)
              }

            </FormGroup>
          </FormControl>
        </Box>
      </Box>
    </div>
</>
  )
}