function generarPDF(solicitud) {
  const { usuario, email, servicio, procedimiento, cargasIniciales, cargasFinales, parametros, resultados, metadatos } = solicitud;

  const doc = new jsPDF();

  // Encabezado institucional
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GobLab Gran Canaria', 20, 20);
  doc.setFontSize(12);
  doc.text('Calculadora de reducción de cargas administrativas', 20, 28);
  doc.setFontSize(10);
  doc.text(metadatos.metodologia, 20, 34);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 34);

  // Datos del usuario
  doc.setFont('helvetica', 'normal');
  doc.text(`Usuario: ${usuario}`, 20, 45);
  doc.text(`Email: ${email}`, 20, 52);
  if (servicio) doc.text(`Servicio: ${servicio}`, 20, 59);
  doc.text(`Procedimiento: ${procedimiento}`, 20, 66);

  // Cargas iniciales
  doc.setFont('helvetica', 'bold');
  doc.text('Cargas iniciales:', 20, 76);
  doc.setFont('helvetica', 'normal');
  let y = 82;
  cargasIniciales.forEach(c => {
    doc.text(`• ${c.tipo} - Cantidad: ${c.cantidad} - CU: ${c.costoUnitario} €`, 25, y);
    y += 6;
  });

  // Cargas finales
  doc.setFont('helvetica', 'bold');
  doc.text('Cargas finales:', 20, y + 4);
  y += 10;
  doc.setFont('helvetica', 'normal');
  cargasFinales.forEach(c => {
    doc.text(`• ${c.tipo} - Cantidad: ${c.cantidad} - CU: ${c.costoUnitario} €`, 25, y);
    y += 6;
  });

  // Parámetros y resultados
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Parámetros anuales:', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Población (PB): ${parametros.poblacion}`, 25, y);
  doc.text(`Frecuencia anual (FR): ${parametros.frecuencia}`, 100, y);
  y += 8;
  doc.text(`Ahorro anual estimado: ${resultados.ahorroAnual} €`, 25, y);
  doc.text(`Reducción porcentual: ${resultados.porcentajeReduccion}%`, 100, y);

  // Pie institucional
  y += 12;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Este documento ha sido generado automáticamente según el método simplificado AGE.', 20, y);

  // Descarga
  doc.save(`Solicitud_${solicitud.id}.pdf`);
}