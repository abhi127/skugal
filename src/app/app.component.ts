import { Component,OnInit } from '@angular/core';
import { Firestore,doc, addDoc, collectionData } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { WorkBook,WorkSheet,utils,writeFile} from 'xlsx'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'skugal';
  note:any = ''
  data:Array<any>=[]

  constructor(private fs:Firestore){}
  ngOnInit(){
    this.getData()
  }
  getData() {
    let ref=collection(this.fs,'note')
    collectionData(ref,{idField:'id'}).subscribe(data=>{this.data = data;console.log(data)},error=>{console.log(error)}) 
  
  }
  submit(){ 
    if(this.note==''){
      alert('Blank Value')
      return
    }
    this.Showloader()
    console.log('in submit')

    try{
      let data:any={value:this.note}
      data.id= doc(collection(this.fs,'id')).id
      addDoc(collection(this.fs,'note'),data).then(res=>{
        console.log("res",res);this.getData();
      })
        .catch(err=>{console.log(err)})

    }
  catch(e) {
    console.error("Error adding document: ", e);
  }
  setTimeout(() => {
    this.hideloader()
    
  }, 1000);
  }
  hideloader():void{

    const el:any =  document.getElementById('loader')
        el.style.display = 'none';
}
  Showloader():void{
    const el:any = document.getElementById('loader')
        el.style.display = 'inline-flex';

  }
  Export():void{
    let ele = document.getElementById('export-table')
    const ws:WorkSheet = utils.table_to_sheet(ele)
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb,'ExcelExport.xlsx')
  }
  openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 200   ;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Todo.pdf');
    })
  }
}
