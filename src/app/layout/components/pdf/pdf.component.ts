import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { Album } from 'src/app/pages/album/album';
import { CartaWrapBlob } from 'src/app/pages/opciones-album/carta-wrap-blob.model';
import { CartaBlobService } from '../zip/zip/carta-blob.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  @Input() album: Album;

  file_ready: boolean = false;
  cargando: boolean = false;
  length: number;

  opcionesImagen: { code: string; label: string; }[];
  opcionesCalidad: { code: string; label: string; }[];
  opcionesCopias: { code: string; label: string; }[];

  pdfForm: FormGroup;
  ajustesAvanzados: boolean = false;

  constructor(
    private cartaBlobService: CartaBlobService,
    private fb: FormBuilder
  ) {
    this.opcionesImagen = [
      { code: 'full', label: 'Carta completa' },
      { code: 'artwork', label: 'Ilustración' }
    ];
    this.opcionesCalidad = [
      { code: 'mini', label: 'Miniatura' },
      { code: 'med', label: 'Media' },
      { code: 'high', label: 'Alta' },
      { code: 'best', label: 'Máxima' }
    ];
    this.opcionesCopias = [
      { code: 'todas', label: 'Incluir todas' },
      { code: 'una', label: 'Una sola copia' },
    ];
  }

  ngOnInit(): void {
    this.pdfForm = this.fb.group({
      copias: [{ code: 'todas', label: 'Incluir todas' }, Validators.required],
      calidad: [{ code: 'best', label: 'Máxima' }, Validators.required],
      imagen: [{ code: 'full', label: 'Carta completa' }, Validators.required],
      
      distancia: [0.2, Validators.required],
      margenX: [10, Validators.required],
      margenY: [10, Validators.required]
    });

    this.pdfForm.get("imagen").valueChanges.subscribe(
      (value) => {
        if (value.code == "artwork") {
          this.pdfForm.get("calidad").disable();
          this.pdfForm.get("calidad").setValue({ code: 'high', label: 'Alta' });

        } else {
          this.pdfForm.get("calidad").enable();
        }
      });
  }

  toogleAvanzados() {
    this.ajustesAvanzados = !this.ajustesAvanzados;
  }

  exportarPdf() {
    this.file_ready = false;
    this.cargando = true;

    let img_quality = this.pdfForm.get('calidad').value.code;
    if (this.pdfForm.get('imagen').value.code == "artwork") {
      img_quality = "artwork";
    }

    this.cartaBlobService.setAlbum(this.album.id, img_quality);

    this.cartaBlobService.generarBlob((response: CartaWrapBlob[]) => {
      let pdf = this.generarPdf(response);
      pdf.save("CTS.pdf");
      this.cargando = false;
      this.file_ready = false;
    });
  }

  generarPdf(cartas: CartaWrapBlob[]) {
    let pdf = new jsPDF();

    let margen_x = this.pdfForm.get('margenX').value;
    let margen_y = this.pdfForm.get('margenY').value;
    let distancia = this.pdfForm.get('distancia').value;
    let x = distancia ? -distancia : 0;
    let y = 0;
    let tam_x = 63.5;
    let tam_y = 88;

    cartas.forEach((carta: CartaWrapBlob) => {
      let cantidad =  (this.pdfForm.get('copias').value.code == "todas" ) ? carta.amount : 1;

      for (let i = 0; i < cantidad; i++) {
        if (x >= 190) {
          x = 0;
          y += tam_y;
          y += distancia;
        } else {
          x += distancia;
        }
        if (y >= 264) {
          y = 0;
          pdf.addPage();
        }

        let pos_x = margen_x + x;
        let pos_y = margen_y + y;
        let type = carta.main_image_type.toUpperCase()
        pdf.addImage(carta.main_image_object, type, pos_x, pos_y, tam_x, tam_y);
        x += tam_x;
      }
    });
    return pdf;
  }
}

