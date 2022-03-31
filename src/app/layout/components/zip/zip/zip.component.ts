import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { CartaWrapBlob } from 'src/app/pages/opciones-album/carta-wrap-blob.model';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Album } from 'src/app/pages/album/album';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartaBlobService } from './carta-blob.service';

/**
 * Componente que gestiona la creación de un zip con las cartas de un album.
 * @author Miguel Bautista Pérez
 */
@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css']
})
export class ZipComponent implements OnInit {

  @Input("album")
  album: Album;

  length: number;
  file_ready: boolean = false;
  cargando: boolean = false;
  download_progress: string;
  cartas_resp: CartaWrapBlob[] = [];

  opcionesImagen: { code: string; label: string; }[];
  opcionesCalidad: { code: string; label: string; }[];
  opcionesCopias: { code: string; label: string; }[];

  zipForm: FormGroup;

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
    this.zipForm = this.fb.group({
      copias: [{ code: 'todas', label: 'Incluir todas' }, Validators.required],
      calidad: [{ code: 'best', label: 'Máxima' }, Validators.required],
      imagen: [{ code: 'full', label: 'Carta completa' }, Validators.required]
    });

    this.zipForm.get("imagen").valueChanges.subscribe(
      (value) => {
        if (value.code == "artwork") {
          this.zipForm.get("calidad").disable();
          this.opcionesCalidad.push({ code: 'high', label: 'Máxima' });
          this.zipForm.get("calidad").setValue({ code: 'high', label: 'Máxima' });
          this.opcionesCalidad.splice(this.opcionesCalidad.length - 1, 1);
        } else {
          this.zipForm.get("calidad").setValue({ code: 'best', label: 'Máxima' });
          this.zipForm.get("calidad").enable();
        }
      });
  }

  generarZip() {
    this.file_ready = false;
    this.cargando = true;
    this.cartas_resp = [];

    let img_quality = this.zipForm.get('calidad').value.code;
    if (this.zipForm.get('imagen').value.code == "artwork") {
      img_quality = "artwork";
    }

    this.cartaBlobService.setAlbum(this.album.id, img_quality);
    this.cartaBlobService.generarBlob((res: CartaWrapBlob[]) => {
      this.cartas_resp = res;
      this.file_ready = true;
      this.downloadZip();
    });
  }

  downloadZip() {
    if (!this.file_ready) {
      alert('File not ready yet.');
      return;
    }

    this.cargando = true;
    var zip = new JSZip();
    this.cartas_resp.forEach((carta: CartaWrapBlob) => {
      let nombreCarta = carta.data.name.replace(/\//g, '-');
      nombreCarta = nombreCarta + ' - ' + carta.data.set.toUpperCase() + ' - ' + carta.data.id.slice(0, 5);
      console.log(this.zipForm.get('copias').value);
      let guardarRepetidas = (this.zipForm.get('copias').value.code == 'todas');
      if (guardarRepetidas) {
        nombreCarta += '-' + carta.id;
      }
      for (let i = 0; i < carta.amount; i++) {
        let filename: string = nombreCarta;
        if (guardarRepetidas) {
          filename += '-' + Math.floor(Math.random() * 100000);
        }
        filename += '.' + carta.main_image_type;
        zip.file(
          filename,
          carta.main_image_object,
          { binary: true }
        );
      }
    });

    this.download_progress = "0%";
    zip.generateAsync({ type: "blob" }, (metadata) => {
      this.download_progress = Math.floor(metadata.percent) + "%";
    }).then((blob) => {
      let fecha = new Date().toISOString().slice(0, 10);
      saveAs(blob, this.album.nombre + '-' + fecha + ".zip");
      this.download_progress = "Espera un momento";
      setTimeout(() => {
        this.cargando = false;
        this.file_ready = false;
      }, 1000);
    });
  }
}
