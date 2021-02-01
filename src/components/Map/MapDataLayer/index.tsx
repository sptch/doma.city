import React, { useEffect, useState } from 'react'
import { Source, Layer, FeatureState } from '@urbica/react-map-gl'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useLazyQuery } from '@apollo/client'
import * as Atoms from 'components/Atoms'
import * as Queries from 'components/Queries'
import PaintDataLayer from './PaintDataLayer'
import getCentroid from '@turf/centroid'

export default function MapDataLayer ({setCursor, layerKey, property, visible, i}:any) {
  const tilejson:{[k: string]: any} = useRecoilValue(Atoms.tilejson)
  const [year] = useRecoilState<any>(Atoms.taxesYear)
  const l = tilejson[layerKey]
  const [layers, setLayers] = useRecoilState<any>(Atoms.tileLayers)
  const dataLayers = useRecoilValue<any>(Atoms.dataLayers)
  const [paintProperty, setPaintProperty] = useState("rgba(247,178,17,0.3)")
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [popup, setPopup] = useRecoilState<any>(Atoms.popup);
  const [popupBase, setPopupBase] = useState<any>({id:0, properties:{id:0}})
  
  const [getDatum, { data:popupData, loading, refetch: refetchDatum }] = useLazyQuery(
    Queries.getDatum(layerKey+"_data", dataLayers[layerKey].fields.map((v:any)=>v.name)), {variables: {
      id: popupBase.id||popupBase.properties.id||0,
      year: Number(year) || 2006
    }})

  const onClick = (e:any)=>{
    setPopupBase(e.features[0])
    if(!popupData){
      getDatum()
    }else{
      refetchDatum && refetchDatum({
        id: popupBase.id,
        year 
      })
    }
  }

  useEffect(()=>{
    if(popupData){
      setPopup({ 
        location:{
          longitude: getCentroid(popupBase.geometry).geometry.coordinates[0],
          latitude: getCentroid(popupBase.geometry).geometry.coordinates[1]
        },
        properties: popupData[layerKey+'_data'][0]
      })
    }
  },[popupData])
  
  const onHover = (event:any) => {
    setCursor("pointer")
    if (event.features.length > 0) {
      const nextHoveredStateId = event.features[0].id;
      if (hoveredStateId !== nextHoveredStateId) {
        setHoveredStateId(nextHoveredStateId);
      }
    }
  };
  
  const onLeave = () => {
    setCursor("")
    if (hoveredStateId) {
      setHoveredStateId(null);
    }
  };

  return <>
    <Source 
      id={layerKey}
      type="vector"
      tiles={[`https://spatialtech.herokuapp.com/http://dev.spatialtech.info:3003/${l.schema}.${l.table}/{z}/{x}/{y}.pbf`]}
      volatile={true}
      promoteId='id'
    />

    <Layer 
      id={layerKey+'_polygon'}
      type="fill"
      source={l.table}
      source-layer={l.id}
      paint={{
        "fill-color": paintProperty,
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.9, 0.8]
      }}
      onHover={onHover}
      onLeave={onLeave}
      onClick={onClick}
      layout={{
        "visibility": visible?'visible':'none',
      }}
      before='road-label'
    />
    <Layer 
      id={layerKey+'_line'}
      type="line"
      source={l.table}
      source-layer={l.id}
      onHover={onHover}
      onLeave={onLeave}
      paint={{
        'line-color': paintProperty,
        'line-width':  ['case', ['boolean', ['feature-state', 'hover'], false], 4, 0.2],
        'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.8]
      }}
      layout={{
        "visibility": visible?'visible':'none'
      }}
      before='road-label'
    />
    {
      dataLayers[layerKey].fields?.map((l:any,i:any)=>
        <PaintDataLayer 
          dataType={l.type.name}
          dataLayerKey={l.name} 
          visible={property && l.name===property}
          source={layerKey}
          sourceLayer={'public.'+layerKey}
          {...{setPaintProperty}}
          key={i} />
      )
    }
    {hoveredStateId && <FeatureState id={hoveredStateId} source={layerKey} sourceLayer={'public.'+layerKey} state={{ hover: true }} />}

  </>
}
