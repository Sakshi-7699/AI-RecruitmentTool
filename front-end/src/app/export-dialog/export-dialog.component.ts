import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent {
  columnsToExport: string = '';
  rowsToExport: number = 10; // Default value

  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onExport(): void {
    this.dialogRef.close({
      columns: this.columnsToExport.split(',').map(col => col.trim()),
      rows: this.rowsToExport
    });
  }
}
