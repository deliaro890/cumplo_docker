
var cont = 0
var token = 0

token_ = localStorage.getItem("token_")
console.log(token_)

token_final = 'Bearer '+ token_

ambiente = localStorage.getItem("local_server")
console.log(ambiente)

//urls

var pro_local_dev = "http://localhost:8000/productos/"
var pro_local_prod = "http://localhost:1337/productos/"
var pro_server_dev = "https://107.152.32.237:8000/productos"
var pro_server_prod = "https://dynasty.fit/productos"

var local_dev="http://localhost:8000/compras/"
var local_prod="http://localhost:1337/compras/"
var server_dev="https://107.152.32.237:8000/compras/"
var server_prod="https://dynasty.fit/compras/"

var detail_local_dev = "http://localhost:8000/compra_detail/"
var detail_local_prod = "http://localhost:1337/compra_detail/"
var detail_server_dev = "https://107.152.32.237:8000/compra_detail/"
var detail_server_prod = "https://dynasty.fit/compra_detail/"

var login_local_dev="http://localhost:8000/login_form/"
var login_local_prod="http://localhost:1337/login_form/"
var login_server_dev="https://107.152.32.237:8000/login_form/"
var login_server_prod="https://dynasty.fit/login_form/"

var menu_local_dev="http://localhost:8000/menu/"
var menu_local_prod="http://localhost:1337/menu/"
var menu_server_dev="https://107.152.32.237:8000/"
var menu_server_prod="https://dynasty.fit/menu/"



if(ambiente == 'local'){

    url_login = login_local_dev
    url_list_productos = pro_local_dev
    url_compras = local_dev
    url_detail = detail_local_dev
    url_menu = menu_local_dev

}else if(ambiente == 'server'){

    url_login = login_server_prod
    url_list_productos = pro_server_prod
    url_compras = server_prod
    url_detail = detail_server_prod
    url_menu = menu_server_prod
}

///List products

$.ajax({
        url : url_list_productos,
        //url: pro_local_dev,
        //url: pro_local_prod,
        //url: pro_server_dev,
        //url: pro_server_prod,
            
        headers: {'Authorization': token_final},
        contentType: 'application/json; charset=utf-8',
        success: function (data) { 
            console.log(data)
            lista(data)
        },
        error: function (xhr, status, errorThrown) { 
            
            var status = xhr.status
            console.log(status+', '+xhr.responseText)
        
            if(status==401){
                
                expiro_token()

            }else{
                alert('ha ocurrido un error ._.')
            }
        }
});

function expiro_token(){
    alert('tu sesión ha expirado o el token es invalido')
    token_final = 0
    localStorage.setItem("token_",0);//rev, esta mien!!
    location.href = url_login
    //location.href = login_local_dev
    //location.href = login_local_prod
    //location.href = login_server_dev
    //location.href = login_server_prod
}

    

var list = []
function lista(data){
    list.push(data)
    return list
}

function asign_token(data_token){
    token = data_token
    return token
}


function create_input_producto(cont){
    var div = document.createElement('hr')
    div.className='division'
    var input_producto_label = document.createElement("label");
    input_producto_label.innerHTML = 'Producto'
    input_producto_label.className = 'mt-3'
    console.log(list[0][1]['id'])
    console.log(list[0])
    lista = []

    for(var a=0;a<list[0].length;a++){
        elemento =  '<option value='+list[0][a]['id']+'">'+
        //list[0][a]['id']+'-'+
        list[0][a]['nombre']+'-'+
        '$'+list[0][a]['precio']+'-'+
        list[0][a]['puntos_producto']+
        '</option>'

        lista.push(elemento)
    }
    
    var input_producto = document.createElement("select");
    input_producto.setAttribute('id','producto_'+cont);
    input_producto.className = 'form-control col-8';
    input_producto.innerHTML=
        '<select>'+
        '<option selected value="zero">Selecciona</option>'+
        lista+        
        '</select>'

    var contenedor = document.getElementById("carrito");
    contenedor.appendChild(div);
    contenedor.appendChild(input_producto_label);
    contenedor.appendChild(input_producto);

}

function create_input_cantidad(cont){

    var input_cantidad = document.createElement("input");
    input_cantidad.setAttribute('id','cantidad_'+cont)
    input_cantidad.className = 'form-control col-8'
    input_cantidad.setAttribute('type','number')
    input_cantidad.value = '0'
    input_cantidad.min='0'

    var input_cantidad_label = document.createElement("label");
    input_cantidad_label.innerHTML = 'Cantidad'
    input_cantidad_label.className = 'mt-1'

    var contenedor = document.getElementById("carrito");
    contenedor.appendChild(input_cantidad_label);
    contenedor.appendChild(input_cantidad);

}



$("#boton_mas").click(function () {

    create_input_producto(cont)
    create_input_cantidad(cont)
    cont=cont+1
})


$("#boton").click(function () {
   
    var socio = document.getElementById('socio').value
    var fecha = document.getElementById('date').value
 
    console.log(socio)
    console.log(fecha)
    
    if(socio=='Selecciona'){
        mensaje = 'debes elegir un socio'
        document.getElementById('socio_error').innerHTML = mensaje
    }
    else{

        socio = parseInt(socio)
        
        array_productos_cantidades = []
        datos = []
        for(i=0; i<cont;i++){
            producto = document.getElementById('producto_'+i).value
            cantidad = document.getElementById('cantidad_'+i).value
            elementos = []
            if(producto!='zero' && cantidad!=0){
                producto_id = parseInt(producto)
                cantidad = parseInt(cantidad)
                elementos.push(producto_id)
                elementos.push(cantidad)
                array_productos_cantidades.push(elementos)

                if(fecha!=''){
                    dato = {
                        "socio":socio,
                        "producto":producto_id,
                        "cantidad":cantidad,
                        "fecha_compra":fecha
                    }

                }else{
                    dato = {
                        "socio":socio,
                        "producto":producto_id,
                        "cantidad":cantidad
                    }

                }
                
                datos.push(dato)
            }
    
        }
      
        console.log(datos)
        $.ajax({
            url : url_compras,
            //url: local_dev,
            //url: local_prod,
            //url: server_dev,
            //url: server_prod,
            type: "Post",
            headers: {'Authorization': token_final},
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            success: function (data) { 
                console.log(data)
                var carrito = data[0]["carrito_code"]
                console.log(data)
                location.href = url_detail+carrito
                //location.href = detail_local_dev+carrito;
                //location.href = detail_local_prod+carrito;
                //location.href = detail_server_dev+carrito;
                //location.href = detail_server_prod+carrito;
                
                          
            },
            ///aca no nec la function de setear el token a 0 y enviar al login, porque ya lo hace el ajax de list_products
            //error 403 forbidden: user sin permiso :v
            error: function (xhr, status, errorThrown) { 
                
                var status = xhr.status
                console.log(status+', '+xhr.responseText)

                if(status==403){

                    alert('usted no tiene permiso para realizar está acción :p')
                    location.href = url_menu
                    //location.href = menu_local_dev
                    //location.href = menu_local_prod
                    //location.href = menu_server_dev
                    //location.href = menu_server_prod    

                }else{
                    alert('ha ocurrido un error ._.')
                }

            }
                
        });
                     
    }   
    
});
