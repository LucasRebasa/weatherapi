let weather = {
    APIKey: 'ab8085ccf1021feb2adc5b72d8702b59',
    img: 'http://openweathermap.org/img/wn/10d@2x.png',
    getCurrentWeather: function(city){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.APIKey}&lang=es&units=metric`)
        .then(response => response.json())
        .then(data => this.renderCurrentWeather(data))
        .catch(e => {
            console.log(`Error:${e}`)
        })
    },
    getForecast: function(city){
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.APIKey}&lang=es&units=metric`)
        .then(res => res.json())
        .then(data => this.renderForecast(data))
    },
    renderCurrentWeather: function(data){
        let { name } = data
        this.getForecast(name)
        let { temp } = data.main
        let { temp_max } = data.main
        let { temp_min } = data.main
        let { humidity } = data.main
        let { pressure } = data.main
        let { description } = data.weather[0]
        let { dt } = data
        let { deg } = data.wind
        let { speed } = data.wind
        let { icon } = data.weather[0]
        let { visibility } = data
        let date = this.parseDate(dt)
        
        const imgElem = document.getElementById('main-img')
        document.querySelector('.main-temp-description').innerHTML = description[0].toUpperCase() + description.substring(1)
        document.querySelector('.temp').innerHTML = Math.round(temp)
        document.getElementById('main-date').innerHTML = date[0].toUpperCase() + date.substring(1)
        document.querySelector('.location').innerHTML = ' ' + name
        document.getElementById('wind').innerHTML = speed + ' m/s'
        document.querySelector('.wind-description').innerHTML = this.convertDeg(deg)
        document.getElementById('humidity').innerHTML = humidity
        document.getElementById('visibility').innerHTML = visibility/1000 + 'km'
        document.getElementById('pressure').innerHTML = pressure + 'hPa'
        imgElem.src = this.selectImg(icon)
    },
    renderForecast: function(data){
        let j = 0
        const maxTemp = document.querySelectorAll('.max')
        const minTemp = document.querySelectorAll('.min')
        const dates = document.querySelectorAll('.forecast-date')
        const imgs = document.querySelectorAll('.forecast-img')
        let index = this.findDayIndex(data.list)
        for(let i=index;i<40;i=i+8){
            let maxElement = maxTemp[j]
            let minElement = minTemp[j]
            let date = dates[j]
            let img = imgs[j]
            maxElement.innerHTML = Math.round(data.list[i].main.temp_max) + '°C'
            minElement.innerHTML = Math.round(data.list[i].main.temp_min) + '°C'
            img.src = this.selectImg(data.list[i].weather[0].icon)
            if(j===0){
                date.innerHTML = 'Mañana'
            }else{
                date.innerHTML = this.parseDate(data.list[i].dt)
            }
            j++
        }
    },
    convertDeg: function(deg){
        if(deg>=315 || deg<=45){
            return 'Norte'
        }else if(deg>=225 || deg < 315){
            return 'Oeste'
        }else if(deg>=135 || deg < 225){
            return 'Sur'
        }else if(deg < 135 || deg > 45){
            return 'Este'
        }    
    },
    selectImg: function(icon){
        switch(true){
            case  icon === '01d' || icon === '01n':
                return './img/Clear.png'
                break
            case  icon === '02d' || icon === '02n':
                return './img/LightCloud.png'
                break
            case  icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n':
                return './img/HeavyCloud.png'
                break
            case  icon === '09d' || icon === '09n':
                return './img/Shower.png'
                break
            case  icon === '010d' || icon === '010n':
                return './img/Rain.png'
                break
            case  icon === '011d' || icon === '011n':
                return './img/Thunderstorm.png'
                break
            case  icon === '013d' || icon === '013n':
                return './img/Snow'
                break
            case  icon === '050d' || icon === '050n':
                return './img/Mist.png'
                break
            default:
                return './img/LightCloud.png'
        }
    },
    parseDate: function(date){
        let options = { weekday: 'short', month: 'short', day: 'numeric'}
        let aux = new Date(date*1000)
        let string = aux.toLocaleDateString('es-ES',options)
        string[string.length-2].toUpperCase()
        return string
    },
    findDayIndex: function(array){
        let today = new Date(Date.now())
        today = new Date(today.getFullYear(),today.getMonth(),today.getDate() + 1)
        for(let i=0;i<array.length;i++){
            let day = array[i]
            let dayDate = new Date(day.dt * 1000)
            if(dayDate.getTime() === today.getTime()){
                return (i - 1)
            } 
        }
    }

}
weather.getCurrentWeather('Buenos Aires')

const searchButton = document.getElementById('search-button')
const input = document.querySelector('.input-search')
searchButton.addEventListener('click', search)
input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        search()
    }
})
 function search(){
    if(input.value !== ''){
        weather.getCurrentWeather(input.value)
    }
 }