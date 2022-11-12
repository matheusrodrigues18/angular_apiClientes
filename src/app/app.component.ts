import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  clientes: any[] = [];
  mensagemCadastro: string = '';
  mensagemEdicao: string = '';
  paginador: number = 1;
  filtro: any = { nome : '' };
  
  constructor(private httpClient: HttpClient){}

  formCadastro = new FormGroup({

    nome: new FormControl('',[Validators.required, Validators.minLength(8)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    cpf: new FormControl('',[Validators.required, Validators.minLength(11), Validators.maxLength(11)])

  });

  formEdicao = new FormGroup({

    idCliente : new FormControl('',[Validators.required]),
    nome: new FormControl('',[Validators.required, Validators.minLength(8)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    cpf: new FormControl('',[Validators.required, Validators.minLength(11), Validators.maxLength(11)])

  });

  get formPost():any{

    return this.formCadastro.controls;

  }

  get formUpdate():any{

    return this.formEdicao.controls;

  }

  ngOnInit(): void{

    this.httpClient.get(environment.apiClientes).subscribe({
        next:(data) =>{

          this.clientes = data as any[];

        },
        error:(e) =>{

          console.log(e);

        }
    });

  }

  cadastrarCliente(): void{

    this.mensagemCadastro='';

      this.httpClient.post(environment.apiClientes, this.formCadastro.value).subscribe({
          next:(data: any)=>{

            this.mensagemCadastro = data.mensagem;
            this.formCadastro.reset();
            this.ngOnInit();

          },
          error:(e) =>{

            this.mensagemCadastro = 'Ocorreu um erro ao tentar cadastrar um cliente.';
            console.log(e);

          }
      });

  }

  excluirCliente(idCliente: number): void{

    if(window.confirm('Deseja realmente excluir um cliente?')){
    this.httpClient.delete(environment.apiClientes+idCliente).subscribe({
        next:(data: any)=>{

          alert(data.mensagem);
          this.ngOnInit();

        },
        error:(e)=>{

          alert('Ocorreu um erro ao tentar deletar o cliente.');
          console.log(e);

        }
    });
  }

  }

  handlePageChange(event: any): void{

    this.paginador = event;

  }

  buscarClientePorId(idCliente: number):void{

    this.mensagemEdicao = '';

    this.formEdicao.reset();

    this.httpClient.get(environment.apiClientes+idCliente).subscribe({
      next:(data: any)=>{

        this.formEdicao.patchValue(data);

      },
      error:(e) =>{

        console.log(e);

      }
  });

  }

  atualizarCliente():void{

    this.mensagemEdicao = '';

    this.httpClient.put(environment.apiClientes,this.formEdicao.value).subscribe({
      next:(data: any)=>{

        this.mensagemEdicao = data.mensagem;
        this.formEdicao.reset();
        this.ngOnInit();
        

      },
      error:(e) =>{

        this.mensagemEdicao = 'Ocorreu um erro ao tentar atualizar um cliente.';
        console.log(e);

      }
  });

  }

}
