const covid = (() => {
    //variables
    let datalocation = []
    let dataactive = []
    let datadeaths = []
    let dataconfirmed = []
    let datarecovered = []
    let chiledatarecovered = []
    let chiledataconfirmed = []
    let chiledatadeaths = []

    //funciones
    //ocultando y apareciendo tablas
const toggleFormAndTable = (form,table) => {
    $(`#${form}`).toggle()
    $(`#${table}`).toggle()
    $(".graphic").toggle()
}

//identificando usuario y guardando la llave
const postData = async (email, password) => {
    try {
    const response = await fetch('http://localhost:3000/api/login',
    {
    method:'POST',
    body: JSON.stringify({email:email,password:password})
    })
    const {token} = await response.json()
    localStorage.setItem('jwt-token',token)
    return token
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//obteniendo informacion mundial
const getPosts = async (jwt) => {
    try {
    const response = await fetch('http://localhost:3000/api/total',
    {
    method:'GET',
    headers: {
    Authorization: `Bearer ${jwt}`
    }
    })
    const {data} = await response.json()
    return data
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//crear tablas
const fillTable = (data,table, jwt) => {
    try{
    let rows = "";
    $.each(data, (i, row) => {
        rows += `<tr>
        <td style="padding-right:10px"> ${row.location} </td>
        <td style="padding-right:10px"> ${row.active} </td>
        <td style="padding-right:10px"> ${row.deaths} </td>
        <td style="padding-right:10px"> ${row.confirmed} </td>
        <td style="padding-right:10px"> ${row.recovered} </td>
        <td><button type="button" style="float:left" class="btn col-6" data-toggle="modal" data-target="#pais${i}">Mas Detalles</button></td>
        </td>`
        printInfoModal(i)
        getpais(jwt, row.location, i, row.active, row.deaths, row.confirmed, row.recovered)
        if (row.active > 10000){
            datalocation.push(`${row.location}`);
            dataactive.push(`${row.active}`)
            datadeaths.push(`${row.deaths}`)
            dataconfirmed.push(`${row.confirmed}`)
            datarecovered.push(`${row.recovered}`)
        }
    })
    grafica(datalocation, datadeaths, dataconfirmed, dataactive, datarecovered)
    $(`#${table} tbody`).append(rows);
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

// grafica mundial
function grafica(location, deaths, confirmed, active, recovered){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: location,
            datasets: [{
                label: 'active',
                data: active,
                backgroundColor:
                    'rgba(255, 99, 132, 50)',
                borderWidth: 1
            },
            {
                label: 'deaths',
                data: deaths,
                backgroundColor: 
                    'rgba(54, 162, 235, 50)',
                borderWidth: 1
            },
            {
                label: 'confirmed',
                data: confirmed,
                backgroundColor: 
                    'rgba(75, 192, 192, 50)',
                borderWidth: 1
            },
            {
                label: 'recovered',
                data: recovered,
                backgroundColor: 
                    'rgba(255, 159, 64, 50)',
                borderWidth: 1
            },
        ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// grafico por pais
function graficamodal(location, deaths, confirmed, active, recovered, i){
    var ctx = document.getElementById(`myChart${i}`).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: location,
            datasets: [{
                label: 'active',
                data: active,
                backgroundColor:
                    'rgba(255, 99, 132, 50)',
                borderWidth: 1
            },{
                label: 'deaths',
                data: deaths,
                backgroundColor: 
                    'rgba(54, 162, 235, 50)',
                borderWidth: 1
            },
            {
                label: 'confirmed',
                data: confirmed,
                backgroundColor: 
                    'rgba(75, 192, 192, 50)',
                borderWidth: 1
            },
            {
                label: 'recovered',
                data: recovered,
                backgroundColor: 
                    'rgba(255, 159, 64, 50)',
                borderWidth: 1
            },
        ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//modal de los paises
function printInfoModal(i){
    let result = $(".modales")
    let primero = $('<div class="cartas"></div>')
    let segundo = $(`<div class="modal fade" id="pais${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>`);
    let tercero = $('<div class="modal-dialog" role="document"></div>')
    let cuarto = $('<div class="modal-content"></div>')
    let quinto1 = $('<div class="modal-header"></div>')
    let quinto2 = $('<div class="modal-body"></div>')
    let boton1 = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">')
    let boton2 = $('<span aria-hidden="true">&times;</span>')
    let grafico = $(`<canvas id="myChart${i}" width="1200px" height="800px"></canvas>`)
    quinto2.append(grafico)
    cuarto.append(quinto1)
    boton1.append(boton2)
    quinto1.append(boton1)
    cuarto.append(quinto2)
    tercero.append(cuarto)
    segundo.append(tercero)
    primero.append(segundo)
    result.append(primero)
}

//obteniendo informacion paises
const getpais = async (jwt, location, i, active, deaths, confirmed, recovered) => {
    try {
    const response = await fetch(`http://localhost:3000/api/countries/${location}`,
    {
    method:'GET',
    headers: {
    Authorization: `Bearer ${jwt}`
    }
    })
    const {data} = await response.json()
    if (data.location == undefined){
        let datalocationmodal = []
        let dataactivemodal = []
        let datadeathsmodal = []
        let dataconfirmedmodal = []
        let datarecoveredmodal = []
        datalocationmodal.push(location);
        dataactivemodal.push(`${active}`)
        datadeathsmodal.push(`${deaths}`)
        dataconfirmedmodal.push(`${confirmed}`)
        datarecoveredmodal.push(`${recovered}`)
        graficamodal(datalocationmodal, datadeathsmodal, dataconfirmedmodal, dataactivemodal, datarecoveredmodal, i)
    }
    else if (data) {
        let datalocationmodal = []
        let dataactivemodal = []
        let datadeathsmodal = []
        let dataconfirmedmodal = []
        let datarecoveredmodal = []
        datalocationmodal.push(data.location);
        dataactivemodal.push(`${data.active}`)
        datadeathsmodal.push(`${data.deaths}`)
        dataconfirmedmodal.push(`${data.confirmed}`)
        datarecoveredmodal.push(`${data.recovered}`)
        graficamodal(datalocationmodal, datadeathsmodal, dataconfirmedmodal, dataactivemodal, datarecoveredmodal, i)
    }
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//informaciond confirmed
const getconfirmed = async (jwt) => {
    try {
    const response = await fetch(`http://localhost:3000/api/confirmed`,
    {
    method:'GET',
    headers: {
    Authorization: `Bearer ${jwt}`
    }
    })
    const {data} = await response.json()
    if (data) {
        $.each(data, (i, row) => {
            chiledataconfirmed.push({
                x: `${row.date}`,
                y: `${row.total}`   
            });
        })
    }
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//informaciond deaths
const getdeaths = async (jwt) => {
    try {
    const response = await fetch(`http://localhost:3000/api/deaths`,
    {
    method:'GET',
    headers: {
    Authorization: `Bearer ${jwt}`
    }
    })
    const {data} = await response.json()
    if (data) {
        $.each(data, (i, row) => {
            chiledatadeaths.push({
                x: `${row.date}`,
                y: `${row.total}`   
            });
        })
    }
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//informaciond recovered
const getrecovered = async (jwt) => {
    try {
    const response = await fetch(`http://localhost:3000/api/recovered`,
    {
    method:'GET',
    headers: {
    Authorization: `Bearer ${jwt}`
    }
    })
    const {data} = await response.json()
    if (data) {
        $.each(data, (i, row) => {
            console.log(row.date)
            //filtro dias
            fecha = new Date(row.date)
            dia = fecha.getDate()
            console.log(dia)
            chiledatarecovered.push({
                x: `${row.date}`,
                y: `${row.total}`   
            });
        })
    }
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

//grafica lineal chile
function graficachile(chiledatarecovered, chiledataconfirmed, chiledatadeaths){
    var ctx = document.getElementById(`myLineChart`).getContext('2d');
    var scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'confirmed',
                borderColor: "#3e95cd",
                fill: false,
                data: chiledataconfirmed
            },
            {
                label: 'recovered',
                borderColor: "#8e5ea2",
                fill: false,
                data: chiledatarecovered
            },
            {
                label: 'deaths',
                borderColor: "#3cba9f",
                fill: false,
                data: chiledatadeaths
            }
        ]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    position: 'bottom'
                }]
            }
        }
    });
}

const init = async () => {
    try {
    const token = localStorage.getItem('jwt-token')
    if(token) {
        $("#situacionchile").show()
        $(".esconder").hide()
        $("#sesion").hide()
        $("#csesion").show()
        $("#situacionchile").show()
        $("#mostrar").show()
        const posts = await getPosts(token)
        fillTable(posts,'js-table-posts', token)
        toggleFormAndTable('js-form-wrapper','js-table-wrapper')
    }
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
} 

const init2 = async () => {
    try {
    const token = localStorage.getItem('jwt-token')
    if(token) {
        $("#cargar").show()
        if(chiledataconfirmed.length == 0){
            Promise.all([getconfirmed(token), getdeaths(token), getrecovered(token)])
            .then (resp => {
                if(chiledataconfirmed.length > 1){
                    graficachile(chiledatarecovered, chiledataconfirmed, chiledatadeaths)
                    $("#cargar").hide()
                }
            })
        }
    }
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
}

return{
    inicio: async () => {
    try {
        init()
        init2()
        //ingresar datos formulario
        $('form').submit(async (event) => {
            event.preventDefault()
            $("#situacionmundo").hide()
            const email = $('#email').val()
            const password = $('#password').val()
            const token = await postData(email,password)
            if (token){
                if (datalocation.length == 0){
                $("#cargar").show()
                init()
                init2()
                }
                else{
                $("#sesion").hide()
                $("#situacionchile").show()
                $("#csesion").show()
                $(`.mundial`).show()
                $(".esconder").hide()
                $("#js-form-wrapper").hide()
                $("#mostrar").show()
                }
            }
            else{
                alert("porfavor iniciar sesion con cuenta registrada")
                const token = localStorage.getItem('jwt-token')
                localStorage.removeItem('jwt-token');
            }
        })
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
},
delete: async () => {
    try {
    //cerrarsesion y ocultar todo y haciendo parecer como el inicio
$("#cerrarsesion").on("click", function(){
    const token = localStorage.getItem('jwt-token')
    localStorage.removeItem('jwt-token');
    $("#situacionchile").hide()
    $("#situacionmundo").hide()
    $("#csesion").hide()
    $(`.mundial`).hide()
    $(".chile").hide()
    $("#mostrar").hide()
    $("#cargar").hide()
    $("#sesion").show()
    $("#mostrarmundo").show()
    $(".esconder").show()
    $("#js-form-wrapper").show()
}) 

//boton de cambiar de pagina a chile
$("#schile").on("click", function(){
    $(".chile").show()
    $("#situacionmundo").show()
    $(".mundial").hide()
    $("#situacionchile").hide()
})

//boton de cambiar de pagina a mundial
$("#smundial").on("click", function(){
    $(".mundial").show()
    $("#situacionchile").show()
    $(".chile").hide()
    $("#situacionmundo").hide()
})
}
catch (err) {
    console.error(`Error: ${err}`)
}
}
}
})()

covid.inicio()
covid.delete()
//revisar porque se demora en cargar grafico chile