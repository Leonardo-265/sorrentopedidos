import React, { useState } from "react";
import productosData from "./productos.json";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "./supabaseClient";

function guardarPedidoCocinaLocal(pedido) {
  const pedidos = JSON.parse(localStorage.getItem("pedidosCocina") || "[]");
  pedidos.push(pedido);
  localStorage.setItem("pedidosCocina", JSON.stringify(pedidos));
}

// Función corregida para guardar en Supabase (cocina)
async function enviarPedidoSupabase(pedido) {
  const { error } = await supabase.from("pedidos").insert([
    {
      cliente_nombre: pedido.cliente.nombre,
      cliente_direccion: pedido.cliente.direccion,
      cliente_telefono: pedido.cliente.telefono,
      cliente_pago: pedido.cliente.pago,
      cliente_horario: pedido.cliente.horario,
      cliente_obs: pedido.cliente.obs,
      carrito: pedido.carrito,
      total: pedido.total,
      estado: pedido.estado,
      fecha: new Date().toISOString(),
      detalle: pedido.detalle // ✅ ya viene generado desde App
    }
  ]);

  if (error) {
    console.error("Error completo:", error);
    alert("Error al enviar a cocina: " + error.message);
  } else {
    console.log("Pedido enviado exitosamente");
  }
}

export default function App() {
  const [cat, setCat] = useState(productosData[0]?.categoria || "");
  const [subcat, setSubcat] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({nombre:"",telefono:"",direccion:"",pago:"",horario:"",obs:""});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

 const categoriasPermitidas = [
   "Promo","Pastas Cocinadas","Con Salsa", "Empanadas", "Pizzas", "Tartas", "Canelones"
];


  const categorias = categoriasPermitidas;


  const subcategorias = [...new Set(productosData.filter(p=>p.categoria===cat&&p.subcategoria).map(p=>p.subcategoria))];
  let productos = productosData.filter(p=>p.categoria===cat);
  if(subcat) productos = productos.filter(p=>p.subcategoria===subcat);

  const agregar = (p) => {
    setCarrito(cs=>{
      const existe = cs.find(c=>c.nombre===p.nombre && c.sabor===p.sabor);
      if(existe) return cs.map(c=>c.nombre===p.nombre && c.sabor===p.sabor? {...c, cantidad:c.cantidad+1}:c);
      return [...cs, {...p, cantidad:1}];
    });
  };
  const cambiarCantidad = (idx, cant) => {
    if (cant < 1) return;
    setCarrito(cs=>cs.map((c,i)=>i===idx? {...c,cantidad:cant}:c));
  };
  const eliminar = (idx) => setCarrito(cs=>cs.filter((_,i)=>i!==idx));
  const total = carrito.reduce((sum,p)=>sum+p.precio*p.cantidad,0);

  const descargarExcel = (pedido) => {
    const data = pedido.carrito.map(item => ({
      "Nombre": pedido.cliente.nombre,
      "Teléfono": pedido.cliente.telefono,
      "Dirección": pedido.cliente.direccion,
      "Pago": pedido.cliente.pago,
      "Horario": pedido.cliente.horario,
      "Observaciones": pedido.cliente.obs,
      "Producto": item.nombre,
      "Sabor": item.sabor || "",
      "Cantidad": item.cantidad,
      "Precio Unitario": item.precio,
      "Subtotal": item.precio * item.cantidad,
      "TOTAL PEDIDO": pedido.total,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedido");
    XLSX.writeFile(wb, `pedido_sorrento_${new Date().toISOString().slice(0,19).replace(/[-T:]/g,"")}.xlsx`);
  };

  const enviarWhatsApp = () => {
    if (!cliente.telefono || !cliente.nombre || !cliente.direccion) {
      setMensaje("Completá nombre, teléfono y dirección.");
      return;
    }
    if (carrito.length === 0) {
      setMensaje("El carrito está vacío.");
      return;
    }
    let msj = `*Pedido Sorrento Pastas*%0A`;
    msj += `Nombre: ${cliente.nombre}%0A`;
    msj += `Teléfono: ${cliente.telefono}%0A`;
    msj += `Dirección: ${cliente.direccion}%0A`;
    msj += `Horario: ${cliente.horario || "-"}%0A`;
    msj += `Pago: ${cliente.pago || "-"}%0A`;
    if (cliente.obs) msj += `Observaciones: ${cliente.obs}%0A`;
    msj += `%0ADetalle:%0A`;
    carrito.forEach(p => {
      msj += `- ${p.nombre}${p.sabor?" ("+p.sabor+")":""} x${p.cantidad} - $${p.precio*p.cantidad}%0A`;
    });
    msj += `%0A*TOTAL: $${total}*%0A`;
    msj += `%0AAlias: sorrento10%0ATitular: Martín Sebastián Diez`;
    window.open(`https://wa.me/${cliente.telefono}?text=${msj}`);
  };

  const enviarACocina = async () => {
    if (!cliente.nombre || !cliente.direccion) {
      setMensaje("Faltan datos del cliente");
      return;
    }
    if (!carrito.length) {
      setMensaje("El carrito está vacío");
      return;
    }

    const detalle = carrito
      .map(item => `${item.nombre}${item.sabor ? ` (${item.sabor})` : ''} x${item.cantidad}`)
      .join(", ");

    const pedidoObj = {
      cliente: { ...cliente },
      carrito: [...carrito],
      total,
      detalle,
      fecha: new Date().toLocaleString(),
      estado: "pendiente"
    };

    guardarPedidoCocinaLocal(pedidoObj);
    await enviarPedidoSupabase(pedidoObj);
    setMensaje("¡Pedido enviado a cocina!");
    setCarrito([]);
  };

  const confirmarPedido = () => {
    if (!cliente.nombre || !cliente.direccion) {
      setMensaje("Faltan datos del cliente");
      return;
    }
    if (!carrito.length) {
      setMensaje("El carrito está vacío");
      return;
    }
    const pedidoObj = {
      cliente: {...cliente},
      carrito: [...carrito],
      total,
      fecha: new Date().toLocaleString()
    };
    descargarExcel(pedidoObj);
    setMensaje("¡Pedido guardado en Excel!");
    setCarrito([]);
  };

  return (
    <div style={{display:"flex",height:"100vh",background:"#f6f8fa"}}>
      {/* Panel Categorías */}
      <aside style={{width:180,padding:18,background:"#fff",borderRight:"1px solid #eee"}}>
        <h3>Categorías</h3>
        {categorias.map((c,i)=>(
          <button key={i}
            style={{display:"block",width:"100%",padding:20,fontSize:26,margin:"6px 0",fontWeight:cat===c?"bold":"normal"}}
            onClick={()=>{setCat(c);setSubcat("");}}>{c}</button>
        ))}
      </aside>

      {/* Panel Productos */}
      <main style={{flex:1,padding:10,overflowY:"auto"}}>
        <h2>{cat}{subcat&&" / "+subcat}</h2>

        {subcategorias.length>0 && (
          <div style={{marginBottom:18, display:"flex", gap:10, flexWrap:"wrap"}}>
            <span style={{fontSize: 16, marginRight: 8}}>Subcategorías:</span>
            {subcategorias.map((s,i)=>
              <button key={i}
                style={{
                  fontSize:"20px",
                  padding:"9px 15px",
                  borderRadius:"8px",
                  background: subcat===s ? "#ffeebb" : "#f7f7fa",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: subcat===s ? "bold" : "normal"
                }}
                onClick={()=>setSubcat(s)}
              >{s}</button>
            )}
            <button style={{marginLeft:15,fontSize:13}} onClick={()=>setSubcat("")}>Ver todos</button>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:15}}>
          {productos.map((p,i)=>(
            <div key={i} style={{border:"1px solid #ccc",borderRadius:12,padding:12,background:"#fff"}}>
              <b>{p.nombre}</b>
              {p.sabor && <div style={{fontSize:13,color:"#555"}}>{p.sabor}</div>}
              <div style={{fontWeight:500,fontSize:20,margin:"7px 0"}}>${p.precio}</div>
              <button onClick={()=>agregar(p)} style={{background:"#16a34a",color:"#fff",border:"none",padding:"8px 16px",borderRadius:7,fontWeight:600}}>Agregar</button>
            </div>
          ))}
        </div>
      </main>

      {/* Panel Derecho */}
      <aside style={{width:350,padding:15,background:"#fff",borderLeft:"1px solid #eee",display:"flex",flexDirection:"column"}}>
        <h3>Datos Cliente</h3>
        <input placeholder="Nombre" style={{margin:3}} value={cliente.nombre} onChange={e=>setCliente({...cliente,nombre:e.target.value})}/>
        <input placeholder="Teléfono" style={{margin:3}} value={cliente.telefono} onChange={e=>setCliente({...cliente,telefono:e.target.value})}/>
        <input placeholder="Dirección" style={{margin:3}} value={cliente.direccion} onChange={e=>setCliente({...cliente,direccion:e.target.value})}/>
        <input placeholder="Forma de Pago" style={{margin:3}} value={cliente.pago} onChange={e=>setCliente({...cliente,pago:e.target.value})}/>
        <input placeholder="Horario" style={{margin:3}} value={cliente.horario} onChange={e=>setCliente({...cliente,horario:e.target.value})}/>
        <input placeholder="Observaciones" style={{margin:3}} value={cliente.obs} onChange={e=>setCliente({...cliente,obs:e.target.value})}/>
        <h3 style={{marginTop:10}}>Pedido</h3>
        <div style={{flex:1,overflowY:"auto"}}>
          {carrito.length===0 && <div>No hay productos.</div>}
          {carrito.map((p,idx)=>
            <div key={idx} style={{borderBottom:"1px dashed #ccc",padding:"4px 0",display:"flex",alignItems:"center"}}>
              <span style={{flex:1}}>{p.nombre}{p.sabor?" ("+p.sabor+")":""} x{p.cantidad}</span>
              <input type="number" min={1} value={p.cantidad} onChange={e=>cambiarCantidad(idx,parseInt(e.target.value)||1)} style={{width:38,marginLeft:6}}/>
              <span style={{marginLeft:12}}>${p.precio*p.cantidad}</span>
              <button onClick={()=>eliminar(idx)} style={{marginLeft:10,color:"#b91c1c"}}>🗑</button>
            </div>
          )}
        </div>
        <div style={{margin:"8px 0",fontWeight:700}}>TOTAL: ${total}</div>
        <button style={{background:"#2563eb",color:"#fff",fontWeight:600,padding:8,borderRadius:7,marginBottom:8}} onClick={confirmarPedido}>Confirmar y Guardar Excel</button>
        <button style={{background:"#10b981",color:"#fff",fontWeight:600,padding:8,borderRadius:7,marginBottom:8}} onClick={enviarWhatsApp}>Enviar por WhatsApp</button>
        <button style={{background:"#f59e42",color:"#fff",fontWeight:600,padding:8,borderRadius:7,marginBottom:8}} onClick={enviarACocina}>Enviar a Cocina</button>
        <button style={{background:"#a855f7",color:"#fff",fontWeight:600,padding:8,borderRadius:7,marginBottom:8}} onClick={()=>navigate("/cocina")}>Ir a Cocina</button>
        {mensaje && <div style={{color:"#b91c1c",marginTop:5}}>{mensaje}</div>}
      </aside>
    </div>
  );
}
