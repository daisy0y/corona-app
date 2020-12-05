import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout'
import {Bar , Doughnut,Line} from 'react-chartjs-2'
const Internal = () => {
    const axios = require('axios').default;
    const [confirmedData,setConfirmedData] = useState({})
    const [quarantinedData,setQuarantinedData] = useState({})
    const [comparedData,setComparedData] = useState({})
    useEffect(()=>{
        const fetechData = async () => {
            try{
           const res = await axios.get('https://api.covid19api.com/total/dayone/country/kr')
             .then((response)=>{makeData(response.data)})
            }catch(error){console.error(error)}

        }
        const makeData = (items)=> {
            const arr = items.reduce((acc,cur)=>{
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered
                
                const findItem = acc.find( a=> a.year ===year && a.month === month)
               
                if(!findItem){
                    acc.push({year,month,date,confirmed,active,death,recovered})
                }
               if(findItem && findItem.date < date){
                   findItem.active = active;
                   findItem.death = death;
                   findItem.confirmed = confirmed;
                   findItem.year = year;
                   findItem.month = month;
                   findItem.recovered = recovered;
                   findItem.date = date;
               }
               
                return acc;
            },[])

            const labels = arr.map(a=>`${a.month+1}월`)
            setConfirmedData({
                labels,
                datasets:[
                    {
                        label:"국내 누적 확진자",
                        backgroundColor:"blue",
                        fill:true,
                        data: arr.map(a=>a.confirmed)
                    }
                ]
            })

            setQuarantinedData({
                labels,
                datasets:[
                    {
                        label:"월별 격리자 현황",
                        borderColor:"blue",
                        fill:false,
                        data: arr.map(a=>a.active)
                    }
                ]
            })
            const last = arr[arr.length-1]
            setComparedData({
                labels:["확진자","격리해제","사망"],
                datasets:[
                    {
                        label:"누적 환진,해제,사망 비율",
                        backgroundColor:["#487eb0","#e84118","#192a56"],
                        fill:false,
                        data: [last.confirmed,last.recovered,last.death]
                    }
                ]
            })
     
        }
        
        fetechData()
    },[])

    return (

        <MainLayout>
        <h1>국내 코로나 현황</h1>
            <div className="internal">
                <div className="internal-item">
                    <Bar data = {confirmedData} options={
                        {title:{display:true,text:"누적 확진자 추이", fontSize:16}},
                    {legend:{display:true, position: "bottom"}}
                    }/>
                </div>
                <div className="internal-item">
                    <Line data = {quarantinedData} options={
                        {title:{display:true,text:"월별 격리자 현황", fontSize:16}},
                    {legend:{display:true, position: "bottom"}}
                    }/>
                </div>
                <div className="internal-item">
                    <Doughnut data = {comparedData} options={
                        {title:{display:true,text:`누적,확진,해제,사망(${new Date().getFullYear+1})`, fontSize:16}},
                    {legend:{display:true, position: "bottom"}}
                    }/>
                </div>
            </div>
        </MainLayout>
    )
}

export default Internal
