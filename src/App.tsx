import './App.css';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import imgMembrete from './assets/hoja membretada-  Smile360 B.jpg';

function App() {
  // Estados individuales para cada campo
  const [diente, setDiente] = useState<string>('');
  const [nombreDen, setNombreDen] = useState<string>('');
  const [nombreCliente, sertNombreCliente] = useState<string>('');
  const [tratamientoGenText, setTratamientoGenText] = useState<string>('');
  const [afeccion, setAfeccion] = useState<string>('');
  const [tratSelec, setTratselec] = useState<Tratamiento | null>(null);
  const [dienteSelec, setDienteselec] = useState<Diente | null>(null);
  const [tratamientosGeneralesSelectos, setTratamientosGeneralesSelectos] = useState<Tratamiento[]>([]);
  const [tratGenSelec, setTratGenselec] = useState<Tratamiento | null>(null);
  const [bandera, setBandera] = useState(false);
  const [banderaD, setBanderaD] = useState(false);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<Tratamiento[]>([]);
  const [dientesSeleccionados, setDientesSeleccionados] = useState<Diente[]>([]);

  const [presupuesto, setPresupuesto] = useState<
    { dientes: string[]; afeccion: string; tratamientos: Tratamiento[]; }[]
  >([]);
  const [tratamientosDisponibles, setTratamientosDisponibles] = useState<Tratamiento[]>([]);

  
  const handleChangenombreDen = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreDen(e.target.value);
  };const handleChangenombreCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    sertNombreCliente(e.target.value);
  };

  const handleChangeTratamientoGeneral = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTratamientoGenText(e.target.value);
    console.log("eeeeeeeee",e.target.value)

    const tratF = tratamientosGenerales.find((t) => (t.nombre+" - "+t.costo )== e.target.value)
    if(tratF){
      console.log("encontro",tratF)
      setTratGenselec(tratF)
    } 
    
  };

  const handleChangeAfeccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAfeccion(value);

    // Actualizar tratamientos disponibles según la afección seleccionada
    const afeccionSeleccionada = afecciones.find((af) => af.nombre === value);
    if (afeccionSeleccionada) {
      setTratamientosSeleccionados(afeccionSeleccionada.tratamientos);
      setTratamientosDisponibles([]);
    } 
      /*
      if (afeccionSeleccionada.tratamientos.length === 1) {
        // Si solo hay un tratamiento, seleccionarlo automáticamente
        setTratamientosSeleccionados([afeccionSeleccionada.tratamientos[0]]);
        setTratamientosDisponibles([]);
      } else {
        // Si hay múltiples tratamientos, mostrarlos como opciones
        setTratamientosDisponibles(afeccionSeleccionada.tratamientos);
        setTratamientosSeleccionados([]);
      }
    } else {
      setTratamientosDisponibles([]);
      setTratamientosSeleccionados([]);
    }*/
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ( afeccion && tratamientosSeleccionados.length > 0 && dientesSeleccionados.length > 0) {
      const idsDientes = dientesSeleccionados.map((d) => d.id)

      setPresupuesto([
        ...presupuesto,
        {
          dientes: idsDientes,
          afeccion,
          tratamientos: tratamientosSeleccionados,
        },
      ]);

      // Reiniciar el formulario
      setDiente('');
      setAfeccion('');
      setTratamientosDisponibles([]);
      setTratamientosSeleccionados([]);
      setDientesSeleccionados([]);
    }
  };

  const agregarTratGeneral = () => {
    console.log("bolivianer",tratGenSelec)
    if(tratGenSelec == null) return
    setTratamientosGeneralesSelectos([
      ...tratamientosGeneralesSelectos,
      tratGenSelec
    ])
    setTratGenselec(null)
    setTratamientoGenText('')
  }

  /*const generarPDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [1650, 1275] // Ajusta según tus necesidades (ancho, alto)
    });
    console.log("llegaasdq")
    doc.addImage(imgMembrete, 'JPEG', 0, 0, 1650, 1275);
    // Estilo minimalista con bordes negros (con tipos explícitos)
    const tableStyles: UserOptions = {
      headStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        fontStyle: 'bold' as const,  // 'as const' para tipo literal
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.2
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]   // Mantener blanco
      },
      margin: { top: 20 },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: 'left' as const,    // Tipo específico para halign
        valign: 'middle' as const   // Tipo específico para valign
      }
    };
  
    // Resto del código permanece igual...
    // Título del documento
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Presupuesto Dental', 14, 20);
  
    // Primera tabla
    autoTable(doc, {
      head: [['Concepto', 'Costo Unitario', 'Costo Total']],
      body: presupuesto.map((item, index) => [
        item.afeccion+" - "+ item.tratamientos[index].nombre +" - dientes("+item.dientes.length +")"+item.dientes.map((d) => d),
        item.tratamientos[index].costo,
        item.tratamientos[index].costo * item.dientes.length
      ]),
      startY: 30,
      ...tableStyles,
      didDrawPage: function(data) {
        const yPosition = data.cursor ? data.cursor.y + 20 : 70; 
        doc.setFontSize(12);
        doc.text('Tratamientos Generales', data.settings.margin.left, yPosition);
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 70;
    
    autoTable(doc, {
      head: [['Tratamiento', 'Costo']],
      body: tratamientosGeneralesSelectos.map(item => [
        item.nombre,
        `$${item.costo.toLocaleString()}`
      ]),
      startY: finalY + 30,
      ...tableStyles
    });
  
    // Total general
    // const totalGeneral = presupuesto.reduce((sum, item) => sum + item.total, 0) + 
                        //tratamientosGeneralesSelectos.reduce((sum, item) => sum + item.costo, 0);
    
    const finalY2 = (doc as any).lastAutoTable?.finalY || 100;
    
    doc.setFontSize(12);
    doc.setFont('arial', 'bold');
    doc.text(`Total General: $${formatNumber(0)}`, 14, finalY2 + 20);
  
    doc.save('presupuesto_dental.pdf');
  };*/

  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Estilo minimalista con bordes negros
    const tableStyles: UserOptions = {
      headStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        fontStyle: 'bold',
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.2
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]  // Mantener blanco (sin filas alternas coloreadas)
      },
      margin: { top: 20 },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        halign: 'left',
        valign: 'middle'
      }
    };
  
    // Título del documento
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Presupuesto Dental', 14, 20);
  
    // Primera tabla
    autoTable(doc, {
      head: [['Concepto', 'Costo Unitario', 'Costo Total']],
      body: presupuesto.map((item, index) => [
        item.afeccion+" - "+ item.tratamientos[index].nombre +" - dientes("+item.dientes.length +")"+item.dientes.map((d) => d),
        item.tratamientos[index].costo,
        item.tratamientos[index].costo * item.dientes.length
      ]),
      startY: 30,
      ...tableStyles,
      didDrawPage: function(data) {
        const yPosition = data.cursor ? data.cursor.y + 20 : 70; 
        doc.setFontSize(12);
        doc.text('Tratamientos Generales', data.settings.margin.left, yPosition);
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 70;
    
    autoTable(doc, {
      head: [['Tratamiento', 'Costo']],
      body: tratamientosGeneralesSelectos.map(item => [
        item.nombre,
        `$${item.costo.toLocaleString()}`
      ]),
      startY: finalY + 30,
      ...tableStyles
    });
  
    /*const totalGeneral = presupuesto.reduce((sum, item) => sum + item.total, 0) + 
                        tratamientosGeneralesSelectos.reduce((sum, item) => sum + item.costo, 0);*/
    
    const finalY2 = (doc as any).lastAutoTable?.finalY || 100;
    
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    doc.text(`Total General: $${(15000).toLocaleString()}`, 14, finalY2 + 20);
  
    doc.save('presupuesto_dental.pdf');
  };

  const handleTratamientoSeleccionado = (tratamiento: Tratamiento) => {
    const tratSeleccionado = tratamientosDisponibles.find((trat) => trat.nombre == tratamiento.nombre)
    if(tratSeleccionado){
      setTratamientosSeleccionados([...tratamientosSeleccionados, tratSeleccionado])
      setTratamientosDisponibles(tratamientosDisponibles.filter((x) => x.nombre !== tratamiento.nombre))
    }
  };

  const handleEliminarTratamiento = (tratamiento: Tratamiento) => {
    setTratamientosSeleccionados((prev) =>
      prev.filter((t) => t.nombre !== tratamiento.nombre)
    );
    setTratamientosDisponibles((prev) => [...prev, tratamiento]);
  };

  const handleDienteSeleccionado = (diente: Diente) => {
    const dienSeleccionado = dientes.find((dien) => dien.id == diente.id)
    if(dienSeleccionado){
      setDientesSeleccionados([...dientesSeleccionados, dienSeleccionado])
      //setTratamientosDisponibles(tratamientosDisponibles.filter((x) => x.nombre !== diente.nombre))
    }
  };

  const handleEliminarDiente = (diente: Diente) => {
    setDientesSeleccionados((prev) =>
      prev.filter((t) => t.id !== diente.id)
    );
    //setTratamientosDisponibles((prev) => [...prev, tratamiento]);
  };

  function formatNumber(num: number): string {
    return num.toString().replace('/\B(?=(\d{3})+(?!\d)/g', ",");
  }

  interface Tratamiento {
    nombre: string;
    costo: number;
  }

  interface Afeccion {
    nombre: string;
    tratamientos: Tratamiento[];
  }

  interface Diente {
    nombre: string;
    id: string;
  }

  const tratamientosGenerales: Tratamiento[] = [
    { nombre: "MUÑON-  corona porcelana", costo: 8000 },
    { nombre: "FLUOROSIS – MICROABRASION", costo: 0 },
    { nombre: "Discromía - endodoncia, blanqueamiento interno", costo: 0 },
    { nombre: "GINGIVITIS – LIMPIEZA DENTAL", costo: 0 },
    { nombre: "PERIODONTITIS – RASPADO Y ALISADO RADICULAR POR CUADRANTE", costo: 0 },
    { nombre: "MOVILIDAD – TRATAMIENTO ESPECIFICO", costo: 0 },
    { nombre: "HERPES – LESION DE TEJIDOS", costo: 0 },
    { nombre: "PAPILOMA  - lESION DE TEJIDOS BLANDOS", costo: 0 },
    { nombre: "FIBROMA - LESION DE TEJIDOS BLANDOS", costo: 0 },
    { nombre: "MUCOCELE - LESION DE TEJIDOS BLANDOS", costo: 0 },
    //
    { nombre: "CARILLAS DE RESINA DIRECTA", costo: 15000 },
    { nombre: "CARILLAS DE RESINA INYECTADA", costo: 20000 },
    { nombre: "CARILLAS DE EMAX", costo: 64000 },
    { nombre: "BLANQUEAMIENTO DENTAL", costo: 2500 },
    { nombre: "GUARDA", costo: 1500 },
    { nombre: "GUARDA OCLUSAL DESPROGRAMADORA", costo: 3500 },
    { nombre: "FERULIZACION", costo: 1500 },
    { nombre: "RETENEDOR FIJO", costo: 1500 },
    { nombre: "MANTENIMIENTO DE CARILLAS DE RESINA", costo: 800 },
    { nombre: "TRATAMIENTO DE ORTODONCIA", costo: 5000 },
    { nombre: "RECORTE DE ENCIA", costo: 6000 },
    { nombre: "PROTESIS TOTAL", costo: 6500 },
    { nombre: "CIRUGIA REGULARIZACION PROCESO ALVEOLAR", costo: 3500 },
    { nombre: "EXTRACCION SERIADA SUPERIOR", costo: 2500 },
    { nombre: "EXTRACCION SERIADA INFERIOR", costo: 2500 },
  ]

  const dientes: Diente[] = [
    // Derecha
    { nombre: "Incisivo central", id: "11" },
    { nombre: "Incisivo lateral", id: "12" },
    { nombre: "Canino", id: "13" },
    { nombre: "Primer premolar", id: "14" },
    { nombre: "Segundo premolar", id: "15" },
    { nombre: "Primer molar", id: "16" },
    { nombre: "Segundo molar", id: "17" },
    { nombre: "Tercer molar (diente del juicio)", id: "18" },
    { nombre: "Tercer molar (diente del juicio)", id: "48" },
    { nombre: "Segundo molar", id: "47" },
    { nombre: "Primer molar", id: "46" },
    { nombre: "Segundo premolar", id: "45" },
    { nombre: "Primer premolar", id: "44" },
    { nombre: "Canino", id: "43" },
    { nombre: "Incisivo lateral", id: "42" },
    { nombre: "Incisivo central", id: "41" },
    // Izquierda
    { nombre: "Incisivo central", id: "21" },
    { nombre: "Incisivo lateral", id: "22" },
    { nombre: "Canino", id: "23" },
    { nombre: "Primer premolar", id: "24" },
    { nombre: "Segundo premolar", id: "25" },
    { nombre: "Primer molar", id: "26" },
    { nombre: "Segundo molar", id: "27" },
    { nombre: "Tercer molar (diente del juicio)", id: "28" },
    { nombre: "Tercer molar (diente del juicio)", id: "38" },
    { nombre: "Segundo molar", id: "37" },
    { nombre: "Primer molar", id: "36" },
    { nombre: "Segundo premolar", id: "35" },
    { nombre: "Primer premolar", id: "34" },
    { nombre: "Canino", id: "33" },
    { nombre: "Incisivo lateral", id: "32" },
    { nombre: "Incisivo central", id: "31" },
  ];

  const afecciones: Afeccion[] = [
    {
      nombre: "Caries Incipiente",
      tratamientos: [{ nombre: "Sellador", costo: 800 }],
    },
    {
      nombre: "Caries clase 1",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 2",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 3",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 4",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Ausencia Dental",
      tratamientos: [
        { nombre: "Prótesis fija de 3 unidades metal porcelana", costo: 11000 },
        { nombre: "Prótesis fija de 3 unidades EMAX", costo: 18000 },
        { nombre: "Prótesis fija de 3 unidades Zirconia", costo: 18000 },
      ],
    },
    {
      nombre: "Desgaste",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "RECESION GINGIVAL",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Fractura Coronaria",
      tratamientos: [
        { nombre: "Reconstrucción de resina", costo: 1500 },
        { nombre: "Rehabilitación porcelana", costo: 8000 },
        { nombre: "Endodoncia y corona porcelana", costo: 13000 },
        { nombre: "Extracción", costo: 800 },
      ],
    },
    {
      nombre: "AGRANDAMIENTO GINGIVAL",
      tratamientos: [{ nombre: "ALARGAMIENTO DE CORONA", costo: 2300 }],
    },
    {
      nombre: "Fractura Vertical",
      tratamientos: [
        { nombre: "Extraccion", costo: 800 },
        { nombre: "MOVILIDAD GRADO 3 - Extraccion", costo: 8000 },
        { nombre: "Endodoncia y corona porcelana", costo: 13000 },
        { nombre: "Extracción", costo: 800 },
      ],
    },
  ];

  const handleChangeDiente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiente(e.target.value);
    const idDiente = e.target.value.slice(0,2)
    const dienteF = dientes.find((d) => d.id == idDiente)
    if(dienteF){
      setDientesSeleccionados([...dientesSeleccionados, dienteF])
      setDiente('')
    };
  }
  useEffect(()=>{
    if(bandera){
      if(tratSelec){
        handleTratamientoSeleccionado(tratSelec)
        setTratselec(null)
      }
    }
    else{
      if(tratSelec){
      handleEliminarTratamiento(tratSelec)
        setTratselec(null)
      }
    }
      
  }),[bandera]

  useEffect(()=>{
    if(banderaD){
      if(dienteSelec){
        handleDienteSeleccionado(dienteSelec)
        setDienteselec(null)
      }
    }
    else{
      if(dienteSelec){
      handleEliminarDiente(dienteSelec)
      setDienteselec(null)
      }
    }
      
  }),[banderaD]

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <label>
          Nombre Dentista:
          <input
            type="text"
            value={nombreDen}
            onChange={handleChangenombreDen}
          />
        </label>
        <br />
        <label>
          Nombre Paciente:
          <input
            type="text"
            value={nombreCliente}
            onChange={handleChangenombreCliente}
          />
        </label>
        
        <br />
        <label>
          Afección:
          <input
            type="text"
            value={afeccion}
            onChange={handleChangeAfeccion}
            list="afecciones-list"
          />
          <datalist id="afecciones-list">
            {afecciones.map((afeccion) => (
              <option key={afeccion.nombre} value={afeccion.nombre} />
            ))}
          </datalist>
        </label>
        <br />
        <label>
          Nombre diente:
          <input
            type="text"
            value={diente}
            onChange={handleChangeDiente}
            list="dientes-list"
          />
          <datalist id="dientes-list">
            {dientes.map((diente) => (
              <option key={diente.id} value={`${diente.id} - ${diente.nombre}`} />
            ))}
          </datalist>
        </label>
        <div>
        <label>
          Dientes selectos:
          {
            dientesSeleccionados.map((dienteS) => (
              <div key={dienteS.id} style={{ margin: '5px' }}>
                {dienteS.id}
                <button
                  type="button"
                  onClick={() => {
                    setBanderaD(false)
                    setDienteselec(dienteS)
                    }}
                  style={{ marginLeft: '5px' }}
                >
                  x
                </button>
              </div>
            ))
          }
        </label>
        </div>
        <br />
        <label>
          Tratamiento(s):
          <div>
            {tratamientosDisponibles.map((tratamiento) => (
              <div>
              <button
                key={`${tratamiento.nombre}-${tratamiento.costo}`}
                type="button"
                onClick={() => {
                  setBandera(true)
                  setTratselec(tratamiento)}}
              >
                {tratamiento.nombre} (${tratamiento.costo})
              </button>
              </div>
            ))}
          </div>
          <div>
            {tratamientosSeleccionados.map((tratamiento) => (
              <div key={tratamiento.nombre} style={{ margin: '5px' }}>
                {tratamiento.nombre} (${tratamiento.costo})
                <button
                  type="button"
                  onClick={() => {
                    setBandera(false)
                    setTratselec(tratamiento)
                    }}
                  style={{ marginLeft: '5px' }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </label>
        <br />
        <button type="submit">Agregar</button>
      </form>
      <div>
      <label>
          Tratamientos generales
          <input
            type="text"
            value={tratamientoGenText}
            onChange={handleChangeTratamientoGeneral}
            list="tratamientos-gnr-list"
          />
          <datalist id="tratamientos-gnr-list">
            {tratamientosGenerales.map((tratamiento) => (
              <option key={tratamiento.nombre} value={`${tratamiento.nombre} - ${tratamiento.costo}`} onClick={()=>{
                console.log("click tramtamiento",tratamiento)
                setTratGenselec(tratamiento)
              }} />
            ))}
          </datalist>
        </label>
      <button type="submit" onClick={()=>{agregarTratGeneral()}} >Agregar</button>
      </div>
      
      <h3>Presupuesto</h3>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Costo U</th>
            <th>Costo Total</th>
          </tr>
        </thead>
        <tbody>
          {presupuesto.map((item, index) => (
            <tr key={index}>
              <td>{item.afeccion+" - "+ item.tratamientos[index].nombre +" - dientes("+item.dientes.length +")"+item.dientes.map((d) => d)}</td>
              <td>{item.tratamientos[index].costo}</td>
              <td>{item.tratamientos[index].costo * item.dientes.length }</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Tratamiento</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {tratamientosGeneralesSelectos.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>${item.costo}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ textAlign: 'right' }}>Total General</td>
            <td>77</td>
              {
              //<td>${presupuesto.reduce((sum, item) => sum + item.total, 0)}</td>
              }
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={generarPDF}>
        Generar PDF
      </button>
    </div>
  );
}

export default App;
/*
import './App.css';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import imgMembrete from './assets/hoja membretada-  Smile360 B.jpg';

function App() {
  // Estados individuales para cada campo
  const [diente, setDiente] = useState<string>('');
  const [tratamientoGenText, setTratamientoGenText] = useState<string>('');
  const [afeccion, setAfeccion] = useState<string>('');
  const [tratSelec, setTratselec] = useState<Tratamiento | null>(null);
  const [tratamientosGeneralesSelectos, setTratamientosGeneralesSelectos] = useState<Tratamiento[]>([]);
  const [tratGenSelec, setTratGenselec] = useState<Tratamiento | null>(null);
  const [bandera, setBandera] = useState(false);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<Tratamiento[]>([]);

  const [presupuesto, setPresupuesto] = useState<
    { idDiente: string; nombreDiente: string; afeccion: string; tratamientos: string; total: number }[]
  >([]);
  const [tratamientosDisponibles, setTratamientosDisponibles] = useState<Tratamiento[]>([]);

  const handleChangeDiente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiente(e.target.value);
  };
  const handleChangeTratamientoGeneral = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTratamientoGenText(e.target.value);
    console.log("eeeeeeeee", e.target.value)

    const tratF = tratamientosGenerales.find((t) => (t.nombre + " - " + t.costo) == e.target.value)
    if (tratF) {
      console.log("encontro", tratF)
      setTratGenselec(tratF)
    }

  };

  const handleChangeAfeccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAfeccion(value);

    // Actualizar tratamientos disponibles según la afección seleccionada
    const afeccionSeleccionada = afecciones.find((af) => af.nombre === value);
    if (afeccionSeleccionada) {
      if (afeccionSeleccionada.tratamientos.length === 1) {
        // Si solo hay un tratamiento, seleccionarlo automáticamente
        setTratamientosSeleccionados([afeccionSeleccionada.tratamientos[0]]);
        setTratamientosDisponibles([]);
      } else {
        // Si hay múltiples tratamientos, mostrarlos como opciones
        setTratamientosDisponibles(afeccionSeleccionada.tratamientos);
        setTratamientosSeleccionados([]);
      }
    } else {
      setTratamientosDisponibles([]);
      setTratamientosSeleccionados([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (diente && afeccion && tratamientosSeleccionados.length > 0) {
      const [idDiente, nombreDiente] = diente.split(' - ');
      const tratamientosStr = tratamientosSeleccionados
        .map((t) => `${t.nombre} ($${t.costo})`)
        .join(', ');
      const totalTratamientos = tratamientosSeleccionados.reduce(
        (sum, t) => sum + t.costo,
        0
      );

      setPresupuesto([
        ...presupuesto,
        {
          idDiente,
          nombreDiente,
          afeccion,
          tratamientos: tratamientosStr,
          total: totalTratamientos,
        },
      ]);

      // Reiniciar el formulario
      setDiente('');
      setAfeccion('');
      setTratamientosDisponibles([]);
      setTratamientosSeleccionados([]);
    }
  };

  const agregarTratGeneral = () => {
    console.log("bolivianer", tratGenSelec)
    if (tratGenSelec == null) return
    setTratamientosGeneralesSelectos([
      ...tratamientosGeneralesSelectos,
      tratGenSelec
    ])
    setTratGenselec(null)
    setTratamientoGenText('')
  }

  const generarPDF = async () => {
    const img = new Image();
    img.src = imgMembrete;
    await img.decode(); // Espera a que cargue

    // Redimensiona si es necesario
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 800; // Ancho máximo
    const scale = MAX_WIDTH / img.width;
    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const optimizedImg = canvas.toDataURL('image/jpeg', 0.9);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4" // Ajusta según tus necesidades (ancho, alto)
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Escalar la imagen manteniendo la relación de aspecto
    const imgProps = doc.getImageProperties(imgMembrete);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;


    doc.addImage(
      imgMembrete,
      'JPEG',
      0, // Posición X (izquierda)
      (pageHeight - imgHeight) / 2, // Centrar verticalmente
      imgWidth,
      imgHeight
    );
    // Estilo minimalista con bordes negros (con tipos explícitos)
    const tableStyles: UserOptions = {
      headStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        fontStyle: 'bold' as const,  // 'as const' para tipo literal
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.2
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0],       // Texto negro
        lineColor: [0, 0, 0],       // Bordes negros
        lineWidth: 0.1
      },
      margin: { left: 120, top: 180 },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: 'left' as const,    // Tipo específico para halign
        valign: 'middle' as const   // Tipo específico para valign
      }
    };

    // Resto del código permanece igual...
    // Título del documento
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Presupuesto Dental', 14, 20);

    // Primera tabla
    autoTable(doc, {
      head: [['ID Diente', 'Diente', 'Afección', 'Tratamiento(s)', 'Total']],
      body: presupuesto.map(item => [
        item.idDiente,
        item.nombreDiente,
        item.afeccion,
        item.tratamientos,
        `$${item.total.toLocaleString()}`
      ]),
      ...tableStyles,
    });

    // Segunda tabla
    const finalY = (doc as any).lastAutoTable?.finalY || 70;

    autoTable(doc, {
      head: [['Tratamiento', 'Costo']],
      body: tratamientosGeneralesSelectos.map(item => [
        item.nombre,
        `$${item.costo.toLocaleString()}`
      ]),
      startY: finalY + 30,
      ...tableStyles
    });

    // Total general
    const totalGeneral = presupuesto.reduce((sum, item) => sum + item.total, 0) +
      tratamientosGeneralesSelectos.reduce((sum, item) => sum + item.costo, 0);

    const finalY2 = (doc as any).lastAutoTable?.finalY || 100;

    doc.setFontSize(12);
    doc.setFont('arial', 'bold');
    doc.text(`Total General: $${formatNumber(totalGeneral)}`, 14, finalY2 + 20);

    doc.save('presupuesto_dental.pdf');
  };

  const handleTratamientoSeleccionado = (tratamiento: Tratamiento) => {
    const tratSeleccionado = tratamientosDisponibles.find((trat) => trat.nombre == tratamiento.nombre)
    if (tratSeleccionado) {
      setTratamientosSeleccionados([...tratamientosSeleccionados, tratSeleccionado])
      setTratamientosDisponibles(tratamientosDisponibles.filter((x) => x.nombre !== tratamiento.nombre))
    }
  };

  const handleEliminarTratamiento = (tratamiento: Tratamiento) => {
    setTratamientosSeleccionados((prev) =>
      prev.filter((t) => t.nombre !== tratamiento.nombre)
    );
    setTratamientosDisponibles((prev) => [...prev, tratamiento]);
  };

  function formatNumber(num: number): string {
    return num.toString().replace('/\B(?=(\d{3})+(?!\d)/g', ",");
  }

  interface Tratamiento {
    nombre: string;
    costo: number;
  }

  interface Afeccion {
    nombre: string;
    tratamientos: Tratamiento[];
  }

  interface Diente {
    nombre: string;
    id: string;
  }

  const tratamientosGenerales: Tratamiento[] = [
    { nombre: "MUÑON-  corona porcelana", costo: 8000 },
    { nombre: "FLUOROSIS – MICROABRASION", costo: 0 },
    { nombre: "Discromía - endodoncia, blanqueamiento interno", costo: 0 },
    { nombre: "GINGIVITIS – LIMPIEZA DENTAL", costo: 0 },
    { nombre: "PERIODONTITIS – RASPADO Y ALISADO RADICULAR POR CUADRANTE", costo: 0 },
    { nombre: "MOVILIDAD – TRATAMIENTO ESPECIFICO", costo: 0 },
    { nombre: "HERPES – LESION DE TEJIDOS", costo: 0 },
    { nombre: "PAPILOMA  - lESION DE TEJIDOS BLANDOS", costo: 0 },
    { nombre: "FIBROMA - LESION DE TEJIDOS BLANDOS", costo: 0 },
    { nombre: "MUCOCELE - LESION DE TEJIDOS BLANDOS", costo: 0 },
    //
    { nombre: "CARILLAS DE RESINA DIRECTA", costo: 15000 },
    { nombre: "CARILLAS DE RESINA INYECTADA", costo: 20000 },
    { nombre: "CARILLAS DE EMAX", costo: 64000 },
    { nombre: "BLANQUEAMIENTO DENTAL", costo: 2500 },
    { nombre: "GUARDA", costo: 1500 },
    { nombre: "GUARDA OCLUSAL DESPROGRAMADORA", costo: 3500 },
    { nombre: "FERULIZACION", costo: 1500 },
    { nombre: "RETENEDOR FIJO", costo: 1500 },
    { nombre: "MANTENIMIENTO DE CARILLAS DE RESINA", costo: 800 },
    { nombre: "TRATAMIENTO DE ORTODONCIA", costo: 5000 },
    { nombre: "RECORTE DE ENCIA", costo: 6000 },
    { nombre: "PROTESIS TOTAL", costo: 6500 },
    { nombre: "CIRUGIA REGULARIZACION PROCESO ALVEOLAR", costo: 3500 },
    { nombre: "EXTRACCION SERIADA SUPERIOR", costo: 2500 },
    { nombre: "EXTRACCION SERIADA INFERIOR", costo: 2500 },
  ]

  const dientes: Diente[] = [
    // Derecha
    { nombre: "Incisivo central", id: "11" },
    { nombre: "Incisivo lateral", id: "12" },
    { nombre: "Canino", id: "13" },
    { nombre: "Primer premolar", id: "14" },
    { nombre: "Segundo premolar", id: "15" },
    { nombre: "Primer molar", id: "16" },
    { nombre: "Segundo molar", id: "17" },
    { nombre: "Tercer molar (diente del juicio)", id: "18" },
    { nombre: "Tercer molar (diente del juicio)", id: "48" },
    { nombre: "Segundo molar", id: "47" },
    { nombre: "Primer molar", id: "46" },
    { nombre: "Segundo premolar", id: "45" },
    { nombre: "Primer premolar", id: "44" },
    { nombre: "Canino", id: "43" },
    { nombre: "Incisivo lateral", id: "42" },
    { nombre: "Incisivo central", id: "41" },
    // Izquierda
    { nombre: "Incisivo central", id: "21" },
    { nombre: "Incisivo lateral", id: "22" },
    { nombre: "Canino", id: "23" },
    { nombre: "Primer premolar", id: "24" },
    { nombre: "Segundo premolar", id: "25" },
    { nombre: "Primer molar", id: "26" },
    { nombre: "Segundo molar", id: "27" },
    { nombre: "Tercer molar (diente del juicio)", id: "28" },
    { nombre: "Tercer molar (diente del juicio)", id: "38" },
    { nombre: "Segundo molar", id: "37" },
    { nombre: "Primer molar", id: "36" },
    { nombre: "Segundo premolar", id: "35" },
    { nombre: "Primer premolar", id: "34" },
    { nombre: "Canino", id: "33" },
    { nombre: "Incisivo lateral", id: "32" },
    { nombre: "Incisivo central", id: "31" },
  ];

  const afecciones: Afeccion[] = [
    {
      nombre: "Caries Incipiente",
      tratamientos: [{ nombre: "Sellador", costo: 800 }],
    },
    {
      nombre: "Caries clase 1",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 2",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 3",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Caries clase 4",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Ausencia Dental",
      tratamientos: [
        { nombre: "Prótesis fija de 3 unidades metal porcelana", costo: 11000 },
        { nombre: "Prótesis fija de 3 unidades EMAX", costo: 18000 },
        { nombre: "Prótesis fija de 3 unidades Zirconia", costo: 18000 },
      ],
    },
    {
      nombre: "Desgaste",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "RECESION GINGIVAL",
      tratamientos: [{ nombre: "Obturación con resina", costo: 800 }],
    },
    {
      nombre: "Fractura Coronaria",
      tratamientos: [
        { nombre: "Reconstrucción de resina", costo: 1500 },
        { nombre: "Rehabilitación porcelana", costo: 8000 },
        { nombre: "Endodoncia y corona porcelana", costo: 13000 },
        { nombre: "Extracción", costo: 800 },
      ],
    },
    {
      nombre: "AGRANDAMIENTO GINGIVAL",
      tratamientos: [{ nombre: "ALARGAMIENTO DE CORONA", costo: 2300 }],
    },
    {
      nombre: "Fractura Vertical",
      tratamientos: [
        { nombre: "Extraccion", costo: 800 },
        { nombre: "MOVILIDAD GRADO 3 - Extraccion", costo: 8000 },
        { nombre: "Endodoncia y corona porcelana", costo: 13000 },
        { nombre: "Extracción", costo: 800 },
      ],
    },
  ];
  useEffect(() => {
    if (bandera) {
      if (tratSelec) {
        handleTratamientoSeleccionado(tratSelec)
        setTratselec(null)
      }
    }
    else {
      if (tratSelec) {
        handleEliminarTratamiento(tratSelec)
        setTratselec(null)
      }
    }

  }), [bandera]

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre diente:
          <input
            type="text"
            value={diente}
            onChange={handleChangeDiente}
            list="dientes-list"
          />
          <datalist id="dientes-list">
            {dientes.map((diente) => (
              <option key={diente.id} value={`${diente.id} - ${diente.nombre}`} />
            ))}
          </datalist>
        </label>
        <br />
        <label>
          Afección:
          <input
            type="text"
            value={afeccion}
            onChange={handleChangeAfeccion}
            list="afecciones-list"
          />
          <datalist id="afecciones-list">
            {afecciones.map((afeccion) => (
              <option key={afeccion.nombre} value={afeccion.nombre} />
            ))}
          </datalist>
        </label>
        <br />
        <label>
          Tratamiento(s):
          <div>
            {tratamientosDisponibles.map((tratamiento) => (
              <button
                key={`${tratamiento.nombre}-${tratamiento.costo}`}
                type="button"
                onClick={() => {
                  setBandera(true)
                  setTratselec(tratamiento)
                }}
              >
                {tratamiento.nombre} (${tratamiento.costo})
              </button>
            ))}
          </div>
          <div>
            {tratamientosSeleccionados.map((tratamiento) => (
              <div key={tratamiento.nombre} style={{ display: 'inline-block', margin: '5px' }}>
                {tratamiento.nombre} (${tratamiento.costo})
                <button
                  type="button"
                  onClick={() => {
                    setBandera(false)
                    setTratselec(tratamiento)
                  }}
                  style={{ marginLeft: '5px' }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </label>
        <br />
        <button type="submit">Agregar</button>
      </form>
      <div>
        <label>
          Tratamientos generales
          <input
            type="text"
            value={tratamientoGenText}
            onChange={handleChangeTratamientoGeneral}
            list="tratamientos-gnr-list"
          />
          <datalist id="tratamientos-gnr-list">
            {tratamientosGenerales.map((tratamiento) => (
              <option key={tratamiento.nombre} value={`${tratamiento.nombre} - ${tratamiento.costo}`} onClick={() => {
                console.log("click tramtamiento", tratamiento)
                setTratGenselec(tratamiento)
              }} />
            ))}
          </datalist>
        </label>
        <button type="submit" onClick={() => { agregarTratGeneral() }} >Agregar</button>
      </div>

      <h3>Presupuesto</h3>
      <table>
        <thead>
          <tr>
            <th>Diente</th>
            <th>Afección</th>
            <th>Tratamiento(s)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {presupuesto.map((item, index) => (
            <tr key={index}>
              <td>{item.idDiente + " - " + item.nombreDiente}</td>
              <td>{item.afeccion}</td>
              <td>{item.tratamientos}</td>
              <td>${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Tratamiento</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {tratamientosGeneralesSelectos.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>${item.costo}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ textAlign: 'right' }}>Total General</td>
            <td>${presupuesto.reduce((sum, item) => sum + item.total, 0)}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={generarPDF}>
        Generar PDF
      </button>
    </div>
  );
}

export default App;
*/