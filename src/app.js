const express = require('express')
const path = require('path')
const hbs =require('hbs')
const request =require('request')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const app = express()

const viewsPath = path.join(__dirname,'../templates/views/') 
const partialPath = path.join(__dirname,'../templates/partials/') 
app.use(express.static(path.join(__dirname,'../public')))
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)
app.get('',(req,res)=>{
    res.render('index')
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/help',(req,res)=>{
    res.render('help')
})
app.get('/weather',(req,res)=>{
    if(!req.query.address)
    {
        return res.send({
            error: 'Enter an address'
        })
    }
    geocode(req.query.address,(error,{latitude, longitude, location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData)=> {
            if(error)
            {
                return res.send({error})   
            }
            return res.send({
                forecast: forecastData, location,
                address: req.query.address
            })
        })

    })
})
app.get('*',(req,res)=>{
    res.render('404')
})
app.listen(3000);
console.log('Love you 3000 (port)');
