//urls
var local_dev="http://localhost:8000/redes/"
var local_prod="http://localhost:1337/redes/"
var server_dev="https://107.152.32.237:8000/redes/"
var server_prod="https://dynasty.fit/redes/"

var login_local_dev="http://localhost:8000/login_form/"
var login_local_prod="http://localhost:1337/login_form/"
var login_server_dev="https://107.152.32.237:8000/login_form/"
var login_server_prod="https://dynasty.fit/login_form/"

//token
token_ = localStorage.getItem("token_")
console.log(token_)
token_final = 'Bearer '+ token_

ambiente = localStorage.getItem("local_server")
console.log(ambiente)

//ambiente
if(ambiente == 'local'){

    url_redes = local_dev
    url_login = login_local_dev
  
  }else if(ambiente == 'server'){
  
    url_redes = server_prod
    url_login = login_server_prod
  }
//

$("#boton").click(function () {
    //var socio = 1;
    var socio = document.getElementById('socio_uiid').value

    $.ajax({

        url: url_redes,
        //url: local_prod,
        //url: server_dev,
        //url: server_prod,

        type: "Post",
        headers: {'Authorization': token_final},
        data: JSON.stringify({
            socio_id: socio,
            mes: 0,
            anio:0
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) { 
                  
            var arreglo = []
                  
            if(data['red_dont_care'].length>0){
                //for(d=0; d< data['red_dont_care'].length; d++){
                for(d in data['red_dont_care']){
                          elementos = []
                          elementos.push(data['red_dont_care'][d]['Patrocinador_id'])
                          elementos.push(data['red_dont_care'][d]['Número de socio'])
                          elementos.push(data['red_dont_care'][d]['Nombre'])
                          arreglo.push(elementos)
                }
                var nombre_socio_one = data['socio']
                var socio_id_one = data['red_dont_care'][0]['Patrocinador_id'].toString()
                      
                arreglo_string=[]
                node = []
              
                elementos_node_one = {
                          "id":socio_id_one,
                          "title":socio_id_one,
                          "name":nombre_socio_one
                }
              
                node.push(elementos_node_one)
              
              
                for (a in arreglo){
                    elementos = []
                          
                    pat = arreglo[a][0].toString()
                    socio = arreglo[a][1].toString()
                    elementos.push(pat)
                    elementos.push(socio)
                    arreglo_string.push(elementos)
                    elementos_node = {
                              "id":socio,
                              "title":socio,
                              "name":arreglo[a][2]
                    }
                    node.push(elementos_node)
              
                }
          
                }else{
                    arreglo_string=[[data['data_in']["socio_id"].toString(),'0']]
                    node = [
                          {
                              "id":data['data_in']["socio_id"].toString(),
                              "title":data['data_in']["socio_id"].toString(),
                              "name":data["socio"]
                          }
                    ]
                }
                console.log(arreglo_string)
                console.log(node)
                  
                  
                 //Highcharts
                  
                Highcharts.chart('container_api', {
          
                      chart: {
                          height: 600,
                          inverted: true
                      },
          
                      title: {
                          text: 'Organización multinivel',
                          fontSize:'10px'
                      },
                  
                      series: [{
                          type: 'organization',
                          name: 'Highsoft',
                          keys: ['from', 'to'],
                          data: arreglo_string,
                          levels: [
                              {
                                  level: 0,
                                  color: 'silver',
                                  fontSize:'10px',
                                  
                                  dataLabels: {
                                      color: 'black',
                                      nombre:'jojo',
                                  },
                                  height: 60,
                                  
                              }, 
          
                              {
                                  level: 1,
                                  color: 'pink',
                                  dataLabels: {
                                      color: 'black'
                                  },
                                  height: 25
                              },
                              
                              {
                                  level: 3,
                                  color: 'purple',
                                  dataLabels: {
                                      color: 'white'
                                  },
                                  height: 25
                              }, 
                              {
                                  level: 4,
                                  color: 'orange',
                                  dataLabels: {
                                      color: 'white'
                                  },
                                  height: 25
                              }, 
                              
                          
                          ],
          
                          nodes: node,
                          
                          colorByPoint: false,
                          color: '#007ad0',
                          dataLabels: {
                              color: 'white',
                              nodeFormatter: function () {
                                  // Call the default renderer
                                  var html = Highcharts.defaultOptions
                                      .plotOptions
                                      .organization
                                      .dataLabels
                                      .nodeFormatter
                                      .call(this);
          
                                  // Do some modification
                                  html = html.replace(
                                      '<h4 style="',
                                      '<h4 style="font-style: italic;',
                                      '<h4 style="font-size: 13px;'
                                  );
                                  return html;
                              },
                              //
                              chartOptions: {
                                chart: {
                                    events: {
                                        load: function() {
                                            var labels = [...document.querySelectorAll('.highcharts-axis-labels')];
                                            stored_sizes = [];
                                            labels.forEach(function(label) {
                                                stored_sizes.push(label.style.fontSize)
                                                console.log(label.style.fontSize)
                                                label.style.fontSize = '70px'
                                            })
                                            setTimeout(function() {
                                                labels.forEach(function(label) {
                                                    label.style.fontSize = stored_sizes.shift()
                                                })
                                            }, 0)
                                        }
                                    }
                                }
                            },
                              //
                              style:{
                                
                                fontSize:'13px!important'
                                
                                }
                          },
                          borderColor: 'white',
                          nodeWidth: 65
                      }],
                      tooltip: {
                          outside: true
                      },
                      exporting: {
                          allowHTML: true,
                          sourceWidth: 800,
                          sourceHeight: 600
                      }
          
                });//Highcharts
             
        }, //fin-success
        error: function () { 
            expiro_token()
        }
    });//fin-ajax
           
});

function expiro_token(){
    alert('tu sesión ha expirado o no tiene autorización')
    token_final = 0
    location.href = url_login
    //location.href = login_local_prod
    //location.href = login_server_dev
    //location.href = login_server_prod
}
