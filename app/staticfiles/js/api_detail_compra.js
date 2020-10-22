//token
token_ = localStorage.getItem("token_")
console.log(token_)

token_final = 'Bearer '+ token_

ambiente = localStorage.getItem("local_server")
console.log(ambiente)


//urls
var local_dev="http://localhost:8000/tickets/"
var local_prod="http://localhost:1337/tickets/"
var server_dev="https://107.152.32.237:8000/tickets/"
var server_prod="https://dynasty.fit/tickets/"

var login_local_dev="http://localhost:8000/login_form/"
var login_local_prod="http://localhost:1337/login_form/"
var login_server_dev="https://107.152.32.237:8000/login_form/"
var login_server_prod="https://dynasty.fit/login_form/"

//ambiente
if(ambiente == 'local'){

  url_tickets = local_dev
  url_login = login_local_dev

}else if(ambiente == 'server'){

  url_tickets = server_prod
  url_login = login_server_prod
}
//

//obteniendo token:poner datos de un user root!!, el password desde un input lo entrega hasheado!!
var carrito = document.getElementById('carrito').value

        
  $.ajax({
    url: url_tickets+carrito,
    //url: local_prod+carrito,
    //url: server_dev+carrito,
    //url: server_prod+carrito,
    headers: {'Authorization': token_final},
    contentType: 'application/json; charset=utf-8',
    success: function (data) { 
               
      var socio = document.getElementById('socio')
      socio.innerHTML = 'Compra exitosa del socio: '+data['item_compras'][0]['socio']
      var date = document.getElementById('date')
      date.innerHTML = 'Fecha de compra: '+data['item_compras'][0]['fecha_compra']

      for (a in data['item_compras']){
        var div = document.createElement("hr")
        var producto = document.createElement("p");
        producto.innerHTML='Producto: '+data['item_compras'][a]['producto']
                    
        var cantidad = document.createElement("p");
        cantidad.innerHTML='Cantidad: '+data['item_compras'][a]['cantidad']
        var importe = document.createElement("p");
        importe.innerHTML='Importe: '+data['item_compras'][a]['importe']
        var puntos = document.createElement("p");
        puntos.innerHTML='Puntos: '+data['item_compras'][a]['puntos_compra']

        var contenedor = document.getElementById("contenedor");
        contenedor.appendChild(div);
        contenedor.appendChild(producto);
                    
        contenedor.appendChild(cantidad);
        contenedor.appendChild(importe);
        contenedor.appendChild(puntos);
                    
      }
      var importe_total= document.getElementById('importe_total')
      importe_total.innerHTML = 'Importe Total: '+data['ticket']['importe_total']
      var puntos_totales = document.getElementById('puntos_totales')
      puntos_totales.innerHTML = 'Puntos Totales: '+data['ticket']['puntos_totales']   
    },//fin-success
    error: function () { 
      expiro_token()
    }
  });//fin-ajax


function expiro_token(){
    alert('tu sesión ha expirado D:')
    token_final = 0
    location.href = url_login
    //location.href = login_local_prod
    //location.href = login_server_dev
    //location.href = login_server_prod
}
        
 