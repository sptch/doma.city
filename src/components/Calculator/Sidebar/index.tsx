import { atoms, useLayout } from "misc";
import { useRecoilState } from "recoil";
import HistorySlider from "./HistorySlider"
import IncomeSlider from "./IncomeSlider"
import Toggle from "./Toggle/";
import { format } from 'd3-format'
import { useEffect, useState } from "react";
import { Wrapper, Container, SlidersBlock, Number, LogoContainer, Footer } from "./styles";
import { Text } from "components/styles";
import {ReactComponent as Logo} from 'assets/icons/logo.svg'
import medianIncomes from 'data/median_incomes.json'
import pricesHistorical from 'data/prices_historical.json'
import rentsHistorical from 'data/rents_historical.json'
import blocksData from 'data/blocks_data.json'

const formatter = format(",.2r")
const percentFormatter = format(",.2r")

export  default function Sidebar(){
  const [ mode ] = useRecoilState(atoms.mode)
  const [ year ] = useRecoilState(atoms.year)
  const [ income ] = useRecoilState(atoms.income)

  const rentPercentage = (((12*(rentsHistorical.find(d=>d.year===year)?.rent_median||0))/income)*100)
  const incomeRatio = income/(medianIncomes.find(d=>d.year===year)?.median_income||0)
  
  const [ percentAffordableRent, setPercentAffordableRent ] = useState(0)
  const rentAffordabilityThreshold = income/12*0.3;

  const affordableMortgage = income*4.5

  const [ percentAffordablePrice, setPercentAffordablePrice ] = useState(0)
  const layout = useLayout()

  useEffect(()=>{
    const relevant = blocksData
      ?.[(year||2022) as unknown as keyof typeof blocksData] as {
        id: number;
        price: number;
        rent: number;
    }[];

    const percent = (relevant.filter(v=>v.rent<rentAffordabilityThreshold).length||0)/(relevant.length||0)*100
    setPercentAffordableRent(percent)
  },[year, rentAffordabilityThreshold])

  useEffect(()=>{
    const relevant = blocksData
      ?.[(year||2022) as unknown as keyof typeof blocksData] as {
        id: number;
        price: number;
        rent: number;
    }[];
    const percent = (relevant.filter(v=>v.price<affordableMortgage).length||0)/
      (relevant.length)*100
    setPercentAffordablePrice(percent)
  },[year, affordableMortgage])

  return <Wrapper>
    <Container>
      <Text>
      <div>
  
        <h2>Select income and year</h2>   

        <SlidersBlock>
          <IncomeSlider {...{medianIncomes}}/>
          <p>
            The map shows a personalised view towards Vancouver's real estate market,
            depending on selected houshold income and year. 
          </p>
          <HistorySlider/>
        </SlidersBlock>
        <Toggle/>

        <br/>
        <p>
            - Selected income is {
                incomeRatio===1?
                <><Number>equal</Number> to the </>:
                incomeRatio<1?
                <><Number>{percentFormatter((1-incomeRatio)*100)}%</Number> lower then </>:
                <><Number>{percentFormatter((incomeRatio-1)*100)}%</Number> higher then </>} 
                Vancouver's median.
        </p>
        {mode==='rent'?
        <>
          <p>
            - Average annual rent in Vancouver is <Number>{formatter(12* (rentsHistorical.find(d=>d.year===year)?.rent_median||0))+' CAD '} </Number>
            which is <Number>{
              rentPercentage.toFixed(1)
            }%</Number> of selected annual household income.
          </p>
          <p>
            - <Number>{
              percentFormatter(percentAffordableRent)
            }%</Number> of rental homes are considered affordable for selected income.
          </p>
          <p>
              - Finding affordable rental home for a household with such income is {
              rentPercentage>=30?'hard':'easy'}.
          </p>

        </>:
        <>
          <p>
              - Median property price in Vancouver is <Number>{formatter(pricesHistorical.find(d=>d.year===year)?.price_median||0)+' CAD '} </Number>
              which is <Number>x{
                ((pricesHistorical.find(d=>d.year===year)?.price_median||0)/income).toFixed(1)
              }</Number> the selected annual income.
          </p>
          <p>
              - The maximum mortgage amount this household can qualify for is 
              <Number>{' '+formatter(income*4)+' CAD'}</Number>. This can cover <Number>{percentFormatter(percentAffordablePrice)}%</Number> of homes in Vancouver.
          </p>
          <p>
              - Finding affordable property for a household with such income is {percentAffordablePrice>=20?'easy':'hard'}.
          </p>
        </>}
        <Footer>
          {layout==='desktop' && <LogoContainer href="http://doma.city/" rel="home">
            <Logo color='black'/>
          </LogoContainer>}
          <a style={{ color: 'black', textDecoration: 'underline' }} href="https://spatialtech.notion.site/Methodology-75e4b010047d429e936b1d3ab6193ccf">Read more on our methodology</a>

        </Footer> 

        </div>
      </Text>
    </Container>
  </Wrapper>
}


