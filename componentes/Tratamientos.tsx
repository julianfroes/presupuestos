import React from 'react';

interface Tratamiento {
  nombre: string;
  costo: number;
}

interface TratamientosProps {
  tratamientosDisponibles: Tratamiento[];
  tratamientosSeleccionados: Tratamiento[];
  onSeleccionarTratamiento: (tratamiento: Tratamiento) => void;
  onEliminarTratamiento: (tratamiento: Tratamiento) => void;
}

const Tratamientos: React.FC<TratamientosProps> = ({
  tratamientosDisponibles,
  tratamientosSeleccionados,
  onSeleccionarTratamiento,
  onEliminarTratamiento,
}) => {
  return (
    <div>
      <label>
        Tratamiento(s):
        <div>
          {tratamientosDisponibles.map((tratamiento) => (
            <button
              key={`${tratamiento.nombre}-${tratamiento.costo}`}
              type="button"
              onClick={() => onSeleccionarTratamiento(tratamiento)}
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
                onClick={() => onEliminarTratamiento(tratamiento)}
                style={{ marginLeft: '5px' }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </label>
    </div>
  );
};

export default Tratamientos;