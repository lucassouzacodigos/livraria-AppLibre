import { useEffect, useState } from 'react'

//Import do css
import './App.css'

//Import da variavel DB que vem do firebase
import { db, } from './firebase'
import { collection, deleteDoc, doc, getDocs, addDoc } from 'firebase/firestore'
import { notEqual } from 'firebase/firestore/pipelines'






export default function App() {
  

  //useState onde serao guardados os dados dos livros
  const [livros, setLivros] = useState([])

  //useState para guardar os dados do livro
  //e adiciona-lo ao banco
  const [titulo, settitulo] = useState('')
  const [autor, setAutor] = useState('')

  // Função para pegar as informações do Firebase
  async function getLivros() {
    const snapshot = await getDocs(collection(db, "livraria"))
    const livros = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    setLivros(livros)
    
    //printa no console só para confirmação dos dados
    //opcional
    console.log(livros)
  }

  
  //Funcao para excluir 1 livro do Firebase
  async function excluir(id){

    await deleteDoc(doc(db, "livraria", id))

    //chama a função de pegar os dados denovo para recarregar a lista
    getLivros()
  }

  //Funcao para adicionar o livro no banco
  async function adicionarLivro(){

    if(titulo === '' && autor === ''){
      alert('Preencha pelo menos 1 campo')
      return
    }

    //Adiciona os dados no Firebase
    await addDoc(collection(db, "livraria"), {
      titulo: titulo,
      autor: autor
    })

    //limpa os campos
    settitulo('')
    setAutor('')

    //Atualiza a lista com o livro ja adicionado
    getLivros()
  }






  // useEffect, roda toda vez que a pagina é carregada
  // para pegar os dados do Firebase
  useEffect(() => {
    getLivros()
  }, [])






  return(
    <div className='app flex-center'>
      <h1>Exemplo CRUD Firebase</h1>
      <h2>Livraria App-Libre</h2>

      <div className='addLivro flex-center'>
        <input value={titulo} onChange={(e) => settitulo(e.target.value)} type='text' placeholder='Titulo do Livro'></input>
        <input value={autor} onChange={(e) => setAutor(e.target.value)} type='text' placeholder='Nome do Autor'></input>
        <button className='botaoAdd' onClick={() => adicionarLivro()}>Adicionar Livro</button>      
      </div>

      {/* verifica se os livros estao presentes (se a length for maior que 0)
      e renderiza todos numa lista com a funcao map */}
      {
        livros.length > 0 ? 
        livros.map((livro) => {
          return(
            <div key={livro.id} className='livroContainer flex-center'>
              <h2>Título: {livro.titulo}</h2>
              <p>Autor: {livro.autor}</p>
              <button onClick={() => excluir(livro.id)} className='excluir'>X</button>
            </div>
          )
        }) : <p>Sem livros até o momento</p>
      }

      
    </div>
    
  )
}


