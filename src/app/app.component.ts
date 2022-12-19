import { Component,OnInit } from '@angular/core';
import { Firestore,doc, addDoc, collectionData } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

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
  hideloader() {

    const el:any =  document.getElementById('loader')
        el.style.display = 'none';
}
  Showloader(){
    const el:any = document.getElementById('loader')
        el.style.display = 'inline-flex';

  }
}
