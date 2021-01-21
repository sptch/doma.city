import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRecoilState } from 'recoil'
import interpolateColor from 'misc/interpolateColor'
import * as Atoms from 'components/Atoms'
import * as Queries from 'components/Queries'
import 'mapbox-gl/dist/mapbox-gl.css'


export default function PaintLayer ({dataType, dataLayerKey, visible, source, sourceLayer, setPaintProperty}:any) {
  type ColorMode = 'quantile' | 'linear'
  let mode:ColorMode = 'quantile'
  const [legendData, setLegendData] = useRecoilState<any>(Atoms.legendData)

  const ntiles:number = 12
  const [getRange, { data:range, called, loading }] = useLazyQuery(Queries.getRange(source, dataLayerKey), {variables:{
    numeric: 
      dataType!=='varchar'
  }, fetchPolicy: "no-cache"})

  const [getNTiles, { data:tiles }] = useLazyQuery(Queries.getNTiles, {variables:{
    table_id: source, 
    column_id: dataLayerKey,
    ntiles,
    mode: 'min'
  }, fetchPolicy: "no-cache"})

  useEffect(()=>{
    if(!visible){
      setLegendData(({[sourceLayer.replace('public.','')]:remove, ...rest}:any)=>rest)
    }
  }, [visible, sourceLayer])

  useEffect(()=>{
    if(visible && !called) {
      const numeric = 
        dataType!=='varchar'
      getRange(); 
      if(numeric) getNTiles(); 
    }
  },[visible, called, getRange, getNTiles])

  useEffect(()=>{
    const numeric = 
      dataType!=='varchar'

    if( visible && range && (tiles || !numeric)){  

      if(numeric){
        console.log('numeric', range, tiles, source)
        if(range[source+'_aggregate']){
          const legendPairs = tiles.get_tiles
          ?.reduce((arr:any,v:any)=>{
            if(!arr.find((a:any)=>a===v.tile)){
              arr.push(v.tile)
            }
            return arr
          },[])
          ?.map((v:number, i:number, arr:any)=>[
            v, 
            interpolateColor(
              (v-arr[0])/
              (arr[arr.length-1]-arr[0])
            )
          ])

          setLegendData((prev:any)=>({...prev, [sourceLayer.replace('public.','')]:legendPairs}))
          setPaintProperty([
            'step',
            ['to-number',['get', dataLayerKey], tiles.get_tiles[0].tile], 
            "#cccccc",
            ...legendPairs.flat()
          ])
        }
      }else{
        //Here goes categorical
        console.log('categorical', range, dataLayerKey, source)
        if(range[source]){
          setLegendData((prev:any)=>({
            ...prev,
            [sourceLayer.replace('public.','')]:range[source]?.map((v:string, i:number)=>[
              v[dataLayerKey], 
              interpolateColor(i/(range[source].length-1), false)
            ])
          }))
          setPaintProperty([
            'case', 
            ...range[source]?.map((v:string, i:number)=>[
              ["==", ['get', dataLayerKey], v[dataLayerKey]], 
              interpolateColor(i/(range[source].length-1), false)
            ]).flat(),
            '#cccccc'
          ]) 
        }
      }
    }
  },[ range, tiles, visible])


  return null 
}
