import './App.css';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import imgLogo from './assets/SMILE360logo.jpg';
import whaIcon from './assets/whatsapp.png';
import facIcon from './assets/facebook.png';
import insIcon from './assets/instagram.png';
import locIcon from './assets/location-dot-solid.png';

import {
  Box,
  Button,
  TextField,
  FormControl,
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


  const handleChangenombreDen = (value: string) => {
    setNombreDen(value);
  }; const handleChangenombreCliente = (value: string) => {
    sertNombreCliente(value);
  };

  const handleChangeTratamientoGeneral = (value: string) => {
    setTratamientoGenText(value);

    const tratF = tratamientosGenerales.find((t) => (t.nombre + " - " + t.costo) == value)
    if (tratF) {
      setTratGenselec(tratF)
    }

  };

  const handleChangeAfeccion = (value: string) => {
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
    if (tratGenSelec == null) return
    setTratamientosGeneralesSelectos([
      ...tratamientosGeneralesSelectos,
      tratGenSelec
    ])
    setTratGenselec(null)
    setTratamientoGenText('')
  }

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = 10;

    // Estilos
    const styles = {
        title: { size: 14, color: [0, 0, 0], font: 'helvetica', style: 'bold' },
        subtitle: { size: 12, color: [0, 0, 0], font: 'helvetica', style: 'normal' },
        header: { size: 10, color: [0, 0, 0], font: 'helvetica', style: 'bold' },
        body: { size: 10, color: [0, 0, 0], font: 'helvetica', style: 'normal' },
        footer: { size: 8, color: [100, 100, 100], font: 'helvetica', style: 'normal' },
        icon: { size: 12, color: [50, 50, 50] }
    };

    // 1. Logo (asegúrate de tener la imagen en base64 o URL)
     doc.addImage(imgLogo, 'JPEG', margin, yPosition, 50, 50);
    yPosition += 15;

    // 2. Fecha y título
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const formattedDate = new Intl.DateTimeFormat('es-MX', options).format(today);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    
    doc.setFont(styles.subtitle.font, styles.subtitle.style);
    doc.setFontSize(styles.subtitle.size);
    doc.setTextColor(...styles.subtitle.color);
    
    // Asegurar que la fecha no se salga del documento
    const dateWidth = doc.getStringUnitWidth(capitalizedDate) * styles.subtitle.size / doc.internal.scaleFactor;
    const maxDateX = pageWidth - margin;
    const dateX = Math.max(margin, maxDateX - dateWidth);
    doc.text(capitalizedDate, dateX, yPosition + 6);
    
    
    yPosition += 25;
    
    doc.setFont(styles.title.font, styles.title.style);
    doc.setFontSize(styles.title.size);
    doc.setTextColor(...styles.title.color);
    doc.text('Cotización de plan de tratamiento', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    
    // 3. Información del paciente
    doc.setFont(styles.body.font, styles.body.style);
    doc.setFontSize(styles.body.size);
    doc.setTextColor(...styles.body.color);
    doc.text(`Paciente: ${nombreCliente || 'Nombre del paciente'}`, margin, yPosition);
    
    yPosition += 8;

    // 4. Tabla de tratamientos principales
    autoTable(doc, {
        startY: yPosition,
        head: [['Afeccion / Tratamiento / Dientes', 'Costo unitario', 'Costo total']],
        body: presupuesto.flatMap((item) => 
            item.tratamientos.map((tx) => [
                `${item.afeccion} / ${tx.nombre} / OD ${item.dientes.map(d => `${d}`).join(', ')} (${item.dientes.length} dientes)`,
                tx.costo ? `$${tx.costo.toLocaleString('es-MX')}` : '-',
                `$${(tx.costo * item.dientes.length).toLocaleString('es-MX')}`
            ])
        ),
        styles: {
            fontSize: 9,
            cellPadding: 3,
            halign: 'left',
            valign: 'middle'
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.2
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto', halign: 'right' },
            2: { cellWidth: 'auto', halign: 'right' }
        },
        margin: { left: margin, right: margin }
    });

    // 5. Tabla de tratamientos generales (si existen)
    if (tratamientosGeneralesSelectos.length > 0) {
        yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        autoTable(doc, {
            startY: yPosition,
            head: [['Tratamiento General', 'Costo']],
            body: tratamientosGeneralesSelectos.map(item => [
                item.nombre,
                `$${item.costo.toLocaleString('es-MX')}`
            ]),
            styles: {
                fontSize: 9,
                cellPadding: 3,
                halign: 'left',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.2
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto', halign: 'right' }
            },
            margin: { left: margin, right: margin }
        });
    }

    // 6. Notas importantes
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    doc.setFont(styles.body.font, styles.body.style);
    doc.setFontSize(styles.body.size);
    doc.setTextColor(...styles.body.color);
    
    const notaText = "La cotización NO incluye gabinete radiográfico como estudio de tomografía computarizada o planeación digital.";
    doc.text(notaText, margin, yPosition, { maxWidth: pageWidth - margin * 2 });

    // 7. Pie de página (información de la clínica)
    yPosition = doc.internal.pageSize.getHeight() - 15;
    
    
    // Iconos (usando texto como iconos simples)
    const iconSize = styles.icon.size;
    //const iconColor = `rgb(${styles.icon.color.join(',')})`;
    
    // Instagram
    doc.addImage(insIcon, 'PNG', margin, yPosition, 4, 4);
    doc.setFontSize(iconSize);
    doc.setTextColor(...styles.icon.color);
    doc.addImage(facIcon, 'PNG', margin+5, yPosition, 4, 4);
    doc.setFontSize(styles.footer.size);
    doc.text('@clinica_smile360', margin + 11, yPosition + 3);
    // Teléfono y otros datos
    doc.setFont(styles.footer.font, styles.footer.style);
    doc.addImage(whaIcon, 'PNG', margin+70, yPosition, 4, 4); // Icono de wha
    doc.text(`Teléfono: 662-338-0376`, margin+77, yPosition+3)
    // Ubicación
    doc.setFontSize(iconSize);
    doc.addImage(locIcon, 'PNG', pageWidth-margin-63, yPosition, 4, 4); // Icono de ubicación
    doc.setFontSize(styles.footer.size);
    doc.text('Calle Pino Suárez #148', pageWidth - margin - 55, yPosition+3);
    // Guardar el PDF
    doc.save(`Presupuesto_${nombreCliente || 'paciente'}_${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.pdf`);
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

  /*function formatNumber(num: number): string {
    return num.toString().replace('/\B(?=(\d{3})+(?!\d)/g', ",");
  }*/

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
        { nombre: "Prótesis fija de 3 unidades metal porcelana", costo: 3666.66 },
        { nombre: "Prótesis fija de 3 unidades EMAX", costo: 6000 },
        { nombre: "Prótesis fija de 3 unidades Zirconia", costo: 6000 },
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

  const handleChangeDiente = (value: string) => {
    setDiente(value);
    const idDiente = value.slice(0, 2)
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
              onChange={(e)=>{handleChangenombreDen(e.target.value)}}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nombre Paciente"
              variant="outlined"
              value={nombreCliente}
              onChange={(e)=>{handleChangenombreCliente(e.target.value)}}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <Autocomplete
                freeSolo
                options={afecciones.map((option) => option.nombre)}
                value={afeccion}
                onChange={(_event, newValue) => {
                  handleChangeAfeccion(  newValue ?? "");
                }}
                inputValue={afeccion}
                onInputChange={(_event, newInputValue) => {
                  handleChangeAfeccion(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Afección"
                    variant="outlined"
                    margin="normal"
                    color="error"
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                freeSolo
                options={dientes.map((diente) => `${diente.id} - ${diente.nombre}`)}
                value={diente}
                onChange={(_event, newValue) => {
                  handleChangeDiente(newValue ?? "" );
                }}
                onInputChange={(_event, newInputValue) => {
                  handleChangeDiente(newInputValue);
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
          onChange={(_event, newValue) => {
            const tratamientoSeleccionado = tratamientosGenerales.find(
              (t) => `${t.nombre} - $${t.costo}` === newValue
            );
            if (tratamientoSeleccionado) {
              setTratGenselec(tratamientoSeleccionado);
            }
            handleChangeTratamientoGeneral(newValue ?? "");
          }}
          onInputChange={(_event, newInputValue) => {
            handleChangeTratamientoGeneral(newInputValue ?? "");
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
            {/*<TableRow>
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
            </TableRow>*/}
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