import './App.css';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import imgMembrete from './assets/hoja membretada-  Smile360 B.jpg';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Chip,
  Divider,
  Autocomplete
} from '@mui/material';

import Grid from '@mui/material/Grid';

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
  }; const handleChangenombreCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    sertNombreCliente(e.target.value);
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
    if (afeccion && tratamientosSeleccionados.length > 0 && dientesSeleccionados.length > 0) {
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
    console.log("bolivianer", tratGenSelec)
    if (tratGenSelec == null) return
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
        item.afeccion + " - " + item.tratamientos[index].nombre + " - dientes(" + item.dientes.length + ")" + item.dientes.map((d) => d),
        item.tratamientos[index].costo,
        item.tratamientos[index].costo * item.dientes.length
      ]),
      startY: 30,
      ...tableStyles,
      didDrawPage: function (data) {
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

  const handleDienteSeleccionado = (diente: Diente) => {
    const dienSeleccionado = dientes.find((dien) => dien.id == diente.id)
    if (dienSeleccionado) {
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
    const idDiente = e.target.value.slice(0, 2)
    const dienteF = dientes.find((d) => d.id == idDiente)
    const dientesSeleccionadosF = dientesSeleccionados.find((d) => d.id == idDiente)
    if (dienteF && !dientesSeleccionadosF) {
      setDientesSeleccionados([...dientesSeleccionados, dienteF])
      setDiente('')
    };
  }
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

  useEffect(() => {
    if (banderaD) {
      if (dienteSelec) {
        handleDienteSeleccionado(dienteSelec)
        setDienteselec(null)
      }
    }
    else {
      if (dienteSelec) {
        handleEliminarDiente(dienteSelec)
        setDienteselec(null)
      }
    }

  }), [banderaD]




  return (
    <Box component="div">
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Nuevo Presupuestos</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <TextField
              fullWidth
              label="Nombre Dentista"
              variant="outlined"
              value={nombreDen}
              onChange={handleChangenombreDen}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nombre Paciente"
              variant="outlined"
              value={nombreCliente}
              onChange={handleChangenombreCliente}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <Autocomplete
                freeSolo
                options={afecciones.map((option) => option.nombre)}
                value={afeccion}
                onChange={(event, newValue) => {
                  handleChangeAfeccion({ target: { value: newValue ?? "" } });
                }}
                inputValue={afeccion}
                onInputChange={(event, newInputValue) => {
                  handleChangeAfeccion({ target: { value: newInputValue } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Afección"
                    variant="outlined"
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    paddingTop: '0px !important',
                    paddingBottom: '0px !important'
                  }
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                freeSolo
                options={dientes.map((diente) => `${diente.id} - ${diente.nombre}`)}
                value={diente}
                onChange={(event, newValue) => {
                  handleChangeDiente({ target: { value: newValue ?? "" } });
                }}
                onInputChange={(event, newInputValue) => {
                  handleChangeDiente({ target: { value: newInputValue } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nombre diente"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Dientes seleccionados:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dientesSeleccionados.map((dienteS) => (
                  <Chip
                    key={dienteS.id}
                    label={dienteS.id}
                    onDelete={() => {
                      setBanderaD(false);
                      setDienteselec(dienteS);
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Typography variant="subtitle1" gutterBottom>Tratamientos:</Typography>
            <Grid container spacing={2}>
              {tratamientosDisponibles.map((tratamiento) => (
                <Grid key={`${tratamiento.nombre}-${tratamiento.costo}`}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setBandera(true);
                      setTratselec(tratamiento);
                    }}
                  >
                    {tratamiento.nombre} (${tratamiento.costo})
                  </Button>
                </Grid>
              ))}

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Tratamientos seleccionados:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tratamientosSeleccionados.map((tratamiento) => (
                    <Chip
                      key={tratamiento.nombre}
                      label={`${tratamiento.nombre} ($${tratamiento.costo})`}
                      onDelete={() => {
                        setBandera(false);
                        setTratselec(tratamiento);
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Agregar
            </Button>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Autocomplete
          freeSolo
          options={tratamientosGenerales.map(
            (tratamiento) => `${tratamiento.nombre} - $${tratamiento.costo}`
          )}
          value={tratamientoGenText}
          onChange={(event, newValue) => {
            const tratamientoSeleccionado = tratamientosGenerales.find(
              (t) => `${t.nombre} - $${t.costo}` === newValue
            );
            if (tratamientoSeleccionado) {
              setTratGenselec(tratamientoSeleccionado);
            }
            handleChangeTratamientoGeneral({ target: { value: newValue ?? "" } });
          }}
          onInputChange={(event, newInputValue) => {
            handleChangeTratamientoGeneral({ target: { value: newInputValue ?? "" } });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tratamientos generales"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button
          variant="contained"
          onClick={agregarTratGeneral}
          sx={{ mt: 1, mb: 2 }}
        >
          Agregar
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Presupuesto</Typography>

        <Table sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '50%' }}>Concepto</TableCell>
              <TableCell align="right" sx={{ width: '25%' }}>Costo U</TableCell>
              <TableCell align="right" sx={{ width: '25%' }}>Costo Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presupuesto.map((item, index) => (
              item.tratamientos.map((trat) => (
                <TableRow key={"tr" + index}>
                  <TableCell>
                    {item.afeccion + " - " + trat.nombre + " - dientes(" + item.dientes.length + ")" + item.dientes.map((d) => d)}
                  </TableCell>
                  <TableCell align="right">${trat.costo}</TableCell>
                  <TableCell align="right">${trat.costo * item.dientes.length}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        {<Table>
          <TableHead>
            <TableRow>
              <TableCell>Tratamiento</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tratamientosGeneralesSelectos.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell align="right">${item.costo}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={1} align="right">
                <Typography variant="subtitle1">Total General:</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1">
                  ${(
                    tratamientosGeneralesSelectos.reduce((sum, tratgens) => sum + tratgens.costo, 0) +
                    presupuesto.reduce((sum, afeccionx) => sum + afeccionx.tratamientos.reduce((sum, tratn) => sum + tratn.costo, 0), 0)
                  ).toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={generarPDF}
          size="large"
          sx={{ mt: 2 }}
        >
          Generar PDF
        </Button>
      </Box>
    </Box>
  );
}

export default App;